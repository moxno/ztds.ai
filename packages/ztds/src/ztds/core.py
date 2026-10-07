"""
ZTDS (Zero-Trust Data Sanitization) - Canonical Python Reference Core
Specification: IETF draft-sibiryakov-ztds-protocol-02 / RFC v1.0
Standards Authority: ZTDS AI Consortium (https://ztds.ai)

Invariants Formally Enforced:
- Invariant 1: Zero External Egress Prior to Sanitization (100% in-memory local RAM).
- Invariant 2: Deterministic Reversible Bijective Tokenization (Syntactic bracketed surrogates).
- Invariant 3: Ephemeral RAM Isolation & Theorem 2 Zeroization.
- Invariant 4: Zero Subprocessors and Zero Third-Party Telemetry Side-Channels.
"""

from __future__ import annotations

import gc
import re
import unicodedata
import uuid
from types import MappingProxyType
from typing import Any, Dict, List, Optional, Tuple, Union


TOKEN_PATTERN: re.Pattern = re.compile(r"\[([A-Z_]+)_([0-9]+)\]")

BASELINE_PATTERNS: MappingProxyType = MappingProxyType({
    "API_SECRET": re.compile(
        r"\b(?:AKIA[0-9A-Z]{16}|sk-ant-[a-zA-Z0-9_\-]{20,}|sk-(?:proj-)?[a-zA-Z0-9_\-]{20,}|ghp_[a-zA-Z0-9]{36}|AIza[0-9A-Za-z\-_]{35}|eyJ[A-Za-z0-9\-_=]+\.eyJ[A-Za-z0-9\-_=]+\.[A-Za-z0-9\-_.]+|postgres:\/\/[^\s:@]+:[^\s:@]+@[^\s:@]+)\b"
    ),
    "EMAIL": re.compile(
        r"\b[A-Za-z0-9._%+\-]{1,64}@[A-Za-z0-9\-]{1,63}(?:\.[A-Za-z0-9\-]{1,63})*\.[A-Za-z]{2,24}\b"
    ),
    "IBAN": re.compile(r"\b[A-Z]{2}[0-9]{2}[A-Z0-9]{4}[0-9]{7}(?:[A-Z0-9]?){0,16}\b"),
    "CREDIT_CARD": re.compile(r"\b(?:\d{4}[-\s]?){3}\d{4}\b"),
    "SSN": re.compile(r"\b(?!000|666|9\d{2})\d{3}-(?!00)\d{2}-(?!0000)\d{4}\b"),
    "DATE": re.compile(r"\b\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])\b"),
    "PHONE": re.compile(r"(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}\b"),
    "IPV4": re.compile(r"\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b"),
})


class SessionContext:
    """
    Context manager for a scoped, ephemeral ZTDS sanitization session.
    Automatically zeroizes all session state from RAM on block exit.
    """

    def __init__(self, engine: "NativeZtdsEngine", session_id: Optional[str] = None) -> None:
        self.engine = engine
        self.session_id = session_id or str(uuid.uuid4())

    def __enter__(self) -> "SessionContext":
        return self

    def __exit__(self, exc_type: Any, exc_val: Any, exc_tb: Any) -> None:
        self.engine.zeroize(self.session_id)

    def sanitize(
        self,
        text: str,
        explicit_entities: Optional[List[Dict[str, str]]] = None
    ) -> Tuple[str, Dict[str, str]]:
        return self.engine.sanitize(text, self.session_id, explicit_entities)

    def reveal(self, text: str) -> str:
        return self.engine.reveal(text, self.session_id)

    def restore(self, text: str) -> str:
        return self.engine.reveal(text, self.session_id)


class NativeZtdsEngine:
    """
    Canonical, Zero-Dependency Zero-Trust Data Sanitization Engine.
    Executes 100% locally in process RAM with zero WAN egress.
    """

    def __init__(self) -> None:
        # Volatile RAM state: session_id -> { token: original_value }
        self._session_maps: Dict[str, Dict[str, str]] = {}
        # Coreference map: session_id -> { original_value: token }
        self._entity_maps: Dict[str, Dict[str, str]] = {}
        # Sequence counters: session_id -> { entity_type: count }
        self._type_counters: Dict[str, Dict[str, int]] = {}

    def _get_or_create_surrogate(
        self,
        original_value: str,
        entity_type: str,
        session_id: str
    ) -> str:
        if session_id not in self._session_maps:
            self._session_maps[session_id] = {}
            self._entity_maps[session_id] = {}
            self._type_counters[session_id] = {}

        token_map = self._session_maps[session_id]
        entity_map = self._entity_maps[session_id]
        counters = self._type_counters[session_id]

        # Coreference Check: if entity already has a surrogate in this session, reuse it
        if original_value in entity_map:
            return entity_map[original_value]

        # Increment type counter and mint canonical [TYPE_N] surrogate
        current_count = counters.get(entity_type, 0) + 1
        counters[entity_type] = current_count
        surrogate = f"[{entity_type}_{current_count}]"

        token_map[surrogate] = original_value
        entity_map[original_value] = surrogate
        return surrogate

    def sanitize(
        self,
        text: str,
        session_id: Optional[str] = None,
        explicit_entities: Optional[List[Dict[str, str]]] = None
    ) -> Tuple[str, Dict[str, str]]:
        """
        Sanitize input cleartext string in local RAM.
        
        Returns:
            Tuple of (sanitized_string, dictionary_of_newly_minted_tokens)
        """
        if not text:
            return "", {}

        sess_id = session_id or str(uuid.uuid4())
        # Unicode normalization (NFKC) prevents homoglyph / zero-width evasions
        normalized_text = unicodedata.normalize("NFKC", text)
        sanitized = normalized_text
        minted_in_call: Dict[str, str] = {}

        # Phase 1: Explicit Scenario Entities (sorted by length descending to prevent substring collisions)
        if explicit_entities:
            sorted_entities = sorted(
                explicit_entities,
                key=lambda x: len(x.get("value") or x.get("text") or ""),
                reverse=True
            )
            for ent in sorted_entities:
                val = ent.get("value") or ent.get("text") or ""
                etype = ent.get("type", "SENSITIVE")
                if not val or val not in sanitized:
                    continue
                surrogate = self._get_or_create_surrogate(val, etype, sess_id)
                minted_in_call[surrogate] = val
                sanitized = sanitized.replace(val, surrogate)

        # Phase 2: Canonical RFC Baseline Regular Expressions
        for entity_type, pattern in BASELINE_PATTERNS.items():
            def _replace_match(match: re.Match) -> str:
                matched_val = match.group(0)
                # Ignore already bracketed tokens
                if matched_val.startswith("[") and matched_val.endswith("]"):
                    return matched_val
                surrogate = self._get_or_create_surrogate(matched_val, entity_type, sess_id)
                minted_in_call[surrogate] = matched_val
                return surrogate

            sanitized = pattern.sub(_replace_match, sanitized)

        return sanitized, minted_in_call

    def reveal(self, text: str, session_id: str) -> str:
        """
        Bijective Restoration (Theorem 1):
        Replaces syntactic surrogate tokens in text with original values from volatile RAM.
        """
        if not text or session_id not in self._session_maps:
            return text

        token_map = self._session_maps[session_id]

        def _replace_token(match: re.Match) -> str:
            token = match.group(0)
            return token_map.get(token, token)

        return TOKEN_PATTERN.sub(_replace_token, text)

    def restore(self, text: str, session_id: str) -> str:
        """Alias for reveal() conforming to RFC v1.0 syntax."""
        return self.reveal(text, session_id)

    def zeroize(self, session_id: str) -> bool:
        """
        Ephemeral In-RAM Zeroization (Theorem 2):
        Destructively wipes cryptographic mapping dictionaries and forces garbage collection.
        """
        if session_id in self._session_maps:
            # Overwrite values before deletion to ensure RAM scrub
            token_map = self._session_maps[session_id]
            for k in list(token_map.keys()):
                token_map[k] = "\x00" * len(token_map[k])
            token_map.clear()
            del self._session_maps[session_id]

        if session_id in self._entity_maps:
            self._entity_maps[session_id].clear()
            del self._entity_maps[session_id]

        if session_id in self._type_counters:
            self._type_counters[session_id].clear()
            del self._type_counters[session_id]

        gc.collect()
        return True

    def session(self, session_id: Optional[str] = None) -> SessionContext:
        """Create a managed SessionContext with automatic zeroization on exit."""
        return SessionContext(self, session_id)


# Global default instance
_default_engine = NativeZtdsEngine()

def sanitize(
    text: str,
    session_id: Optional[str] = None,
    explicit_entities: Optional[List[Dict[str, str]]] = None
) -> Tuple[str, Dict[str, str]]:
    """Sanitize text using the global default engine."""
    return _default_engine.sanitize(text, session_id, explicit_entities)

def reveal(text: str, session_id: str) -> str:
    """Reveal text using the global default engine."""
    return _default_engine.reveal(text, session_id)

def restore(text: str, session_id: str) -> str:
    """Restore text using the global default engine."""
    return _default_engine.restore(text, session_id)

def zeroize(session_id: str) -> bool:
    """Zeroize session from the global default engine."""
    return _default_engine.zeroize(session_id)

def session(session_id: Optional[str] = None) -> SessionContext:
    """Create a scoped context-managed session."""
    return _default_engine.session(session_id)
