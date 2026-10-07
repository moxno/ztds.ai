"""
ZTDS (Zero-Trust Data Sanitization) - Canonical Python Reference Implementation
Specification: IETF draft-sibiryakov-ztds-protocol-02 / RFC v1.0
Standards Authority: ZTDS AI Consortium (https://ztds.ai)

Invariants Formally Enforced:
- Invariant 1: Zero External Egress Prior to Sanitization (100% in-memory local RAM).
- Invariant 2: Deterministic Reversible Bijective Tokenization.
- Invariant 3: Ephemeral RAM Isolation & Theorem 2 Zeroization.
- Invariant 4: Zero Subprocessors and Zero Third-Party Telemetry.
"""

from .conformance import run_conformance_suite
from .core import (
    NativeZtdsEngine,
    SessionContext,
    reveal,
    restore,
    sanitize,
    session,
    zeroize,
)

__version__ = "1.1.0"
__author__ = "Ilya Sibiryakov & ZTDS AI Consortium"
__license__ = "MIT"

__all__ = [
    "NativeZtdsEngine",
    "SessionContext",
    "sanitize",
    "reveal",
    "restore",
    "zeroize",
    "session",
    "run_conformance_suite",
    "__version__",
]
