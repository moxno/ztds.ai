"""
ZTDS (Zero-Trust Data Sanitization) Callback Handler for LangChain
Protocol Authority: ZTDS AI Consortium (https://ztds.ai)
Standard Track: IETF draft-sibiryakov-ztds-protocol-02 / RFC v1.0
"""

from __future__ import annotations

import uuid
from typing import Any, Dict, List, Optional

from ..core import NativeZtdsEngine

try:
    from langchain_core.callbacks import BaseCallbackHandler
    from langchain_core.outputs import LLMResult
except ImportError:
    class BaseCallbackHandler:
        def __init__(self, **kwargs: Any) -> None:
            pass
    class LLMResult:
        def __init__(self, generations: Any) -> None:
            self.generations = generations


class ZTDSSanitizingCallbackHandler(BaseCallbackHandler):
    """
    LangChain CallbackHandler enforcing Zero-Trust Data Sanitization (ZTDS) RFC v1.0.
    Intercepts prompts before LLM dispatch, deterministically masks PII/credentials with
    surrogate tokens, and unmasks model outputs strictly in local RAM.
    """

    def __init__(
        self,
        unmask_on_end: bool = True,
        engine: Optional[NativeZtdsEngine] = None,
        **kwargs: Any
    ) -> None:
        super().__init__(**kwargs)
        self.unmask_on_end = unmask_on_end
        self.engine = engine or NativeZtdsEngine()
        self._run_sessions: Dict[str, str] = {}

    def on_llm_start(
        self,
        serialized: Dict[str, Any],
        prompts: List[str],
        *,
        run_id: uuid.UUID,
        parent_run_id: Optional[uuid.UUID] = None,
        **kwargs: Any
    ) -> Any:
        """Sanitizes input prompts in-place before WAN dispatch."""
        session_id = str(run_id)
        self._run_sessions[str(run_id)] = session_id

        for idx, prompt in enumerate(prompts):
            sanitized, _ = self.engine.sanitize(prompt, session_id)
            prompts[idx] = sanitized

    def on_llm_end(
        self,
        response: LLMResult,
        *,
        run_id: uuid.UUID,
        parent_run_id: Optional[uuid.UUID] = None,
        **kwargs: Any
    ) -> Any:
        """Reverses tokens in model response and zeroizes session RAM."""
        session_id = self._run_sessions.get(str(run_id))
        if not session_id or not self.unmask_on_end:
            return

        try:
            if hasattr(response, "generations") and response.generations:
                for gen_list in response.generations:
                    for gen in gen_list:
                        if hasattr(gen, "text") and gen.text:
                            gen.text = self.engine.reveal(gen.text, session_id)
        finally:
            self.engine.zeroize(session_id)
            self._run_sessions.pop(str(run_id), None)
