"""
ZTDS (Zero-Trust Data Sanitization) Node Postprocessor for LlamaIndex
Protocol Authority: ZTDS AI Consortium (https://ztds.ai)
Standard Track: IETF draft-sibiryakov-ztds-protocol-02 / RFC v1.0
"""

from __future__ import annotations

from typing import Any, List, Optional

from ..core import NativeZtdsEngine

try:
    from llama_index.core.postprocessor.types import BaseNodePostprocessor
    from llama_index.core.schema import NodeWithScore, QueryBundle
except ImportError:
    class BaseNodePostprocessor:
        pass
    class NodeWithScore:
        def __init__(self, node: Any, score: float = 1.0) -> None:
            self.node = node
            self.score = score
    class QueryBundle:
        def __init__(self, query_str: str) -> None:
            self.query_str = query_str


class ZTDSNodePostprocessor(BaseNodePostprocessor):
    """
    LlamaIndex NodePostprocessor providing Zero-Trust Data Sanitization (ZTDS) RFC v1.0.
    Sanitizes retrieved text chunks prior to LLM synthesis to prevent PII and corporate
    secrets from crossing WAN sockets unmasked.
    """

    def __init__(
        self,
        session_id: str = "llama-default",
        engine: Optional[NativeZtdsEngine] = None,
        **kwargs: Any
    ) -> None:
        super().__init__(**kwargs)
        self.session_id = session_id
        self.engine = engine or NativeZtdsEngine()

    def sanitize_text(self, text: str) -> str:
        """Sanitize text chunk in local RAM."""
        sanitized, _ = self.engine.sanitize(text, self.session_id)
        return sanitized

    def postprocess_nodes(
        self,
        nodes: List[NodeWithScore],
        query_bundle: Optional[QueryBundle] = None,
    ) -> List[NodeWithScore]:
        """Sanitizes text across retrieved RAG nodes in-place."""
        for node_with_score in nodes:
            node = node_with_score.node
            if hasattr(node, "text") and node.text:
                node.text = self.sanitize_text(node.text)
            elif hasattr(node, "get_content"):
                content = node.get_content()
                if content and hasattr(node, "set_content"):
                    node.set_content(self.sanitize_text(content))
        return nodes

    def restore_text(self, text: str) -> str:
        """Restore tokens back to original values."""
        return self.engine.reveal(text, self.session_id)

    def zeroize(self) -> bool:
        """Zeroize memory map for session."""
        return self.engine.zeroize(self.session_id)
