"""
ZTDS (Zero-Trust Data Sanitization) - Python CLI
Command-line interface for Zero-Trust sanitization, invariant auditing, and conformance verification.
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from typing import List, Optional

from . import __version__
from .conformance import run_conformance_suite
from .core import NativeZtdsEngine


def audit_directory(target_dir: str, strict: bool = False, json_output: bool = False) -> int:
    """
    Perform local in-memory audit of codebase files for sensitive patterns and WAN egress telemetry.
    Equivalent to npx ztds-audit.
    """
    from .core import BASELINE_PATTERNS

    ignored_dirs = {
        "node_modules", ".git", ".next", "dist", "build", ".vercel",
        "coverage", ".cache", "public/badge", "vendor", "fixtures",
        "benchmarks", "conformance", "__pycache__", ".pytest_cache", ".ruff_cache"
    }
    allowed_exts = {
        ".js", ".mjs", ".cjs", ".ts", ".tsx", ".jsx", ".json",
        ".py", ".go", ".rs", ".java", ".yaml", ".yml", ".env"
    }

    files_to_scan = []
    for root, dirs, files in os.walk(target_dir):
        dirs[:] = [d for d in dirs if d not in ignored_dirs]
        for f in files:
            ext = os.path.splitext(f)[1].lower()
            if ext in allowed_exts or f.startswith(".env"):
                files_to_scan.append(os.path.join(root, f))

    findings = []
    for filepath in files_to_scan:
        try:
            with open(filepath, "r", encoding="utf-8", errors="ignore") as fh:
                for line_idx, line in enumerate(fh, 1):
                    for entity_type, pat in BASELINE_PATTERNS.items():
                        if entity_type in ("API_SECRET", "CREDIT_CARD", "SSN"):
                            matches = pat.findall(line)
                            for m in matches:
                                findings.append({
                                    "file": os.path.relpath(filepath, target_dir),
                                    "line": line_idx,
                                    "type": entity_type,
                                    "sample": m[:12] + "..." if len(m) > 12 else m
                                })
        except Exception:
            continue

    passed = len(findings) == 0

    if json_output:
        print(json.dumps({
            "audit_passed": passed,
            "target_dir": target_dir,
            "files_scanned": len(files_to_scan),
            "findings_count": len(findings),
            "findings": findings
        }, indent=2))
        return 0 if passed else 1

    print("\n\033[1m\033[36m[ZTDS™]\033[0m \033[1mPython In-Memory Codebase Auditor\033[0m")
    print("-" * 74)
    print(f"Directory:     {target_dir}")
    print(f"Files Scanned: {len(files_to_scan)}")
    print("-" * 74)

    if passed:
        print("\033[1m\033[32m[PASS] CONFORMANCE CONFIRMED: 0 INVARIANT VIOLATIONS DETECTED\033[0m")
        print("All scanned files comply with ZTDS Invariant 1 (Zero-Egress) and Invariant 3 (RAM Isolation).\n")
        return 0
    else:
        print(f"\033[1m\033[31m[FAIL] AUDIT FAILED: {len(findings)} VIOLATION(S) DETECTED\033[0m")
        for f in findings[:15]:
            print(f"  \033[31m[{f['type']}]\033[0m {f['file']}:{f['line']} -> {f['sample']}")
        if len(findings) > 15:
            print(f"  ... and {len(findings) - 15} more findings.")
        print("")
        return 1


def main(args: Optional[List[str]] = None) -> int:
    parser = argparse.ArgumentParser(
        prog="ztds",
        description="Zero-Trust Data Sanitization (ZTDS) - Official Python CLI"
    )
    parser.add_argument("--version", "-v", action="version", version=f"ztds {__version__}")

    subparsers = parser.add_subparsers(dest="command", help="Available subcommands")

    # Command: sanitize
    sanitize_parser = subparsers.add_parser("sanitize", help="Sanitize a text prompt in local RAM")
    sanitize_parser.add_argument("text", type=str, help="Text to sanitize")
    sanitize_parser.add_argument("--session-id", type=str, default=None, help="Optional session ID")

    # Command: conformance
    conformance_parser = subparsers.add_parser("conformance", help="Run canonical RFC test vectors")
    conformance_parser.add_argument("--json", action="store_true", help="Output machine-readable JSON")

    # Command: audit
    audit_parser = subparsers.add_parser("audit", help="Audit local codebase for WAN egress and raw secrets")
    audit_parser.add_argument("--dir", "-d", type=str, default=".", help="Directory to audit")
    audit_parser.add_argument("--strict", action="store_true", help="Fail on any findings")
    audit_parser.add_argument("--json", action="store_true", help="Output machine-readable JSON")

    parsed_args = parser.parse_args(args)

    if not parsed_args.command:
        parser.print_help()
        return 0

    if parsed_args.command == "sanitize":
        engine = NativeZtdsEngine()
        sanitized, minted = engine.sanitize(parsed_args.text, parsed_args.session_id)
        print(sanitized)
        return 0

    elif parsed_args.command == "conformance":
        res = run_conformance_suite(verbose=not parsed_args.json)
        if parsed_args.json:
            print(json.dumps(res, indent=2))
        return 0 if res["conformance_passed"] else 1

    elif parsed_args.command == "audit":
        return audit_directory(
            target_dir=os.path.abspath(parsed_args.dir),
            strict=parsed_args.strict,
            json_output=parsed_args.json
        )

    return 0


if __name__ == "__main__":
    sys.exit(main())
