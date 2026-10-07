"""
ZTDS (Zero-Trust Data Sanitization) Guardrail for LiteLLM
Protocol Authority: ZTDS AI Consortium (https://ztds.ai)
Standard Track: IETF draft-sibiryakov-ztds-protocol-02 / RFC v1.0
"""

from __future__ import annotations

import copy
import uuid
from typing import Any, Dict, List, Optional

from ..core import NativeZtdsEngine

try:
    from litellm.integrations.custom_guardrail import CustomGuardrail
except ImportError:
    class CustomGuardrail:
        def __init__(self, **kwargs: Any) -> None:
            for k, v in kwargs.items():
                setattr(self, k, v)


class ZTDSGuardrail(CustomGuardrail):
    """
    LiteLLM Guardrail enforcing Zero-Trust Data Sanitization (ZTDS) RFC v1.0.
    Intercepts prompts before upstream WAN transmission, deterministically tokens sensitive entities in volatile RAM,
    and reverses tokens on completion return without external network egress.
    """

    def __init__(
        self,
        reverse_on_output: bool = True,
        guardrail_name: str = "ztds",
        engine: Optional[NativeZtdsEngine] = None,
        **kwargs: Any
    ) -> None:
        super().__init__(guardrail_name=guardrail_name, **kwargs)
        self.reverse_on_output = reverse_on_output
        self.engine = engine or NativeZtdsEngine()
        self._active_sessions: Dict[str, str] = {}

    def _get_call_id(self, data: Dict[str, Any]) -> str:
        metadata = data.get("litellm_params", {}).get("metadata", {}) or {}
        return (
            metadata.get("session_id")
            or metadata.get("trace_id")
            or data.get("litellm_call_id")
            or str(uuid.uuid4())
        )

    async def async_pre_call_hook(
        self,
        user_api_key_dict: Any,
        cache: Any,
        data: Dict[str, Any],
        call_type: str
    ) -> Dict[str, Any]:
        """Intercepts input messages before WAN dispatch and sanitizes sensitive tokens."""
        call_id = self._get_call_id(data)
        messages = data.get("messages")
        if not messages:
            return data

        sanitized_messages = []
        for msg in messages:
            msg_copy = copy.deepcopy(msg)
            content = msg_copy.get("content")
            if isinstance(content, str):
                sanitized_text, _ = self.engine.sanitize(content, call_id)
                msg_copy["content"] = sanitized_text
            elif isinstance(content, list):
                for part in content:
                    if isinstance(part, dict) and part.get("type") == "text":
                        sanitized_part, _ = self.engine.sanitize(part.get("text", ""), call_id)
                        part["text"] = sanitized_part
            sanitized_messages.append(msg_copy)

        data["messages"] = sanitized_messages
        data.setdefault("litellm_params", {}).setdefault("metadata", {})["ztds_session_id"] = call_id
        return data

    async def async_post_call_success_hook(
        self,
        data: Dict[str, Any],
        user_api_key_dict: Any,
        response: Any
    ) -> Any:
        """Restores surrogate tokens on outbound response to user, then zeroizes session RAM."""
        if not self.reverse_on_output or not response:
            return response

        call_id = data.get("litellm_params", {}).get("metadata", {}).get("ztds_session_id")
        if not call_id:
            return response

        try:
            choices = getattr(response, "choices", None)
            if choices:
                for choice in choices:
                    message = getattr(choice, "message", None)
                    if message and getattr(message, "content", None):
                        message.content = self.engine.reveal(message.content, call_id)
            elif isinstance(response, dict) and "choices" in response:
                for choice in response["choices"]:
                    if "message" in choice and "content" in choice["message"]:
                        choice["message"]["content"] = self.engine.reveal(
                            choice["message"]["content"], call_id
                        )
        finally:
            # Ephemeral Invariant 3: Zeroize session from memory after completion
            self.engine.zeroize(call_id)

        return response
