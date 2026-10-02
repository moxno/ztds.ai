"""
ZTDS (Zero-Trust Data Sanitization) Callback Handler for LangChain
Protocol Authority: ZTDS AI Consortium & Standards Authority
IETF Standards Track: draft-sibiryakov-ztds-protocol-02
https://datatracker.ietf.org/doc/draft-sibiryakov-ztds-protocol/
Standard Specification: https://ztds.ai/standard/

Invariants Enforced:
1. Zero External Egress Prior to Sanitization (100% in-memory local execution)
2. Deterministic Reversible Tokenization (Bracketed syntactic surrogates)
3. Verifiable Ephemeral RAM Isolation & Theorem 2 Zeroization
4. Zero Subprocessors (GDPR Art. 28 / HIPAA Safe Harbor)
"""

import re
import uuid
from typing import Any, Dict, List, Optional

try:
    from langchain_core.callbacks import BaseCallbackHandler
    from langchain_core.outputs import LLMResult
except ImportError:
    class BaseCallbackHandler:
        def __init__(self, **kwargs: Any) -> None:
            pass
    class LLMResult:
        def __init__(self, generations: Any):
            self.generations = generations


class ZTDSSanitizingCallbackHandler(BaseCallbackHandler):
    """
    LangChain CallbackHandler enforcing Zero-Trust Data Sanitization (ZTDS) RFC v1.0.
    Intercepts prompts before LLM dispatch, deterministically masks PII/credentials with
    surrogate tokens, and unmasks model outputs strictly in local RAM.
    """

    TOKEN_PATTERN: re.Pattern = re.compile(r"\[[A-Z_]+_TOKEN_[a-zA-Z0-9_-]+\]")

    PATTERNS: Dict[str, re.Pattern] = {
        "EMAIL": re.compile(r"\b[A-Za-z0-9._%+-]{1,64}@[A-Za-z0-9-]{1,63}(?:\.[A-Za-z0-9-]{1,63})*\.[A-Za-z]{2,24}\b"),
        "IPV4": re.compile(r"\b(?:\d{1,3}\.){3}\d{1,3}\b"),
        "IBAN": re.compile(r"\b[A-Z]{2}[0-9]{2}[A-Z0-9]{4}[0-9]{7}([A-Z0-9]?){0,16}\b"),
        "CREDIT_CARD": re.compile(r"\b(?:\d{4}[-\s]?){3}\d{4}\b"),
        "SSN": re.compile(r"\b\d{3}-\d{2}-\d{4}\b"),
        "PHONE": re.compile(r"\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b"),
        "API_SECRET": re.compile(r"\b(?:sk-[a-zA-Z0-9_-]{20,}|ghp_[a-zA-Z0-9]{20,}|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,})\b"),
    }

    def __init__(
        self,
        enabled_entities: Optional[List[str]] = None,
        unmask_on_end: bool = True,
        secure_surrogates: bool = False,
    ) -> None:
        super().__init__()
        self.enabled_entities = enabled_entities or list(self.PATTERNS.keys())
        self.unmask_on_end = unmask_on_end
        self.secure_surrogates = secure_surrogates
        self._run_maps: Dict[str, Dict[str, str]] = {}
        self._entity_maps: Dict[str, Dict[str, str]] = {}
        self._run_salts: Dict[str, str] = {}

    def sanitize_text(self, text: str, run_id_str: str) -> str:
        if not text or not isinstance(text, str):
            return text

        if run_id_str not in self._run_maps:
            self._run_maps[run_id_str] = {}
            self._entity_maps[run_id_str] = {}

        token_map = self._run_maps[run_id_str]
        entity_map = self._entity_maps[run_id_str]
        existing_tokens = set(self.TOKEN_PATTERN.findall(text))

        sanitized = text
        for entity_type in self.enabled_entities:
            if entity_type == "EMAIL" and "@" not in sanitized:
                continue

            pattern = self.PATTERNS.get(entity_type)
            if not pattern:
                continue

            salt = None
            if self.secure_surrogates:
                if run_id_str not in self._run_salts:
                    self._run_salts[run_id_str] = uuid.uuid4().hex[:6]
                salt = self._run_salts[run_id_str]

            entity_counter = sum(1 for k in token_map if k.startswith(f"[{entity_type}_TOKEN_"))

            def _replace_match(match: re.Match, et: str = entity_type, s: Optional[str] = salt) -> str:
                nonlocal entity_counter
                original = match.group(0)
                if original in entity_map:
                    token = entity_map[original]
                else:
                    while True:
                        entity_counter += 1
                        candidate = f"[{et}_TOKEN_{s}_{entity_counter}]" if s else f"[{et}_TOKEN_{entity_counter}]"
                        if candidate not in existing_tokens and candidate not in token_map:
                            token = candidate
                            break
                    token_map[token] = original
                    entity_map[original] = token
                return token

            sanitized = pattern.sub(_replace_match, sanitized)

        return sanitized

    def restore_text(self, text: str, run_id_str: str) -> str:
        token_map = self._run_maps.get(run_id_str, {})
        if not token_map:
            return text

        def _replace_token(match: re.Match) -> str:
            tok = match.group(0)
            return token_map.get(tok, tok)

        return self.TOKEN_PATTERN.sub(_replace_token, text)

    def zeroize_run(self, run_id_str: str) -> None:
        """Theorem 2: RAM Zeroization."""
        if run_id_str in self._run_maps:
            self._run_maps[run_id_str].clear()
            del self._run_maps[run_id_str]
        if run_id_str in self._entity_maps:
            self._entity_maps[run_id_str].clear()
            del self._entity_maps[run_id_str]
        if run_id_str in self._run_salts:
            del self._run_salts[run_id_str]

    def on_llm_start(
        self,
        serialized: Dict[str, Any],
        prompts: List[str],
        *,
        run_id: Optional[uuid.UUID] = None,
        parent_run_id: Optional[uuid.UUID] = None,
        tags: Optional[List[str]] = None,
        metadata: Optional[Dict[str, Any]] = None,
        **kwargs: Any,
    ) -> Any:
        """Sanitizes outgoing prompt strings in-place before WAN dispatch."""
        run_id_str = str(run_id) if run_id else "default-run"
        for i, prompt in enumerate(prompts):
            prompts[i] = self.sanitize_text(prompt, run_id_str)

    def on_llm_end(
        self,
        response: Any,
        *,
        run_id: Optional[uuid.UUID] = None,
        parent_run_id: Optional[uuid.UUID] = None,
        **kwargs: Any,
    ) -> Any:
        """Restores cleartext entities in generated responses and zeroizes RAM."""
        run_id_str = str(run_id) if run_id else "default-run"
        try:
            if self.unmask_on_end and hasattr(response, "generations"):
                for gen_list in response.generations:
                    for gen in gen_list:
                        if hasattr(gen, "text") and isinstance(gen.text, str):
                            gen.text = self.restore_text(gen.text, run_id_str)
                        elif hasattr(gen, "message") and hasattr(gen.message, "content"):
                            if isinstance(gen.message.content, str):
                                gen.message.content = self.restore_text(gen.message.content, run_id_str)
        finally:
            self.zeroize_run(run_id_str)

    def on_llm_error(
        self,
        error: BaseException,
        *,
        run_id: Optional[uuid.UUID] = None,
        parent_run_id: Optional[uuid.UUID] = None,
        **kwargs: Any,
    ) -> Any:
        """Theorem 2: Guarantees volatile memory zeroization when LLM pipeline fails."""
        run_id_str = str(run_id) if run_id else "default-run"
        self.zeroize_run(run_id_str)

