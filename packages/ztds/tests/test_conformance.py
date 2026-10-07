"""
Test suite executing canonical ZTDS Conformance Test Vectors against Python Reference Core.
"""

import unittest
from ztds import run_conformance_suite


class TestZtdsConformance(unittest.TestCase):
    def test_all_canonical_vectors(self):
        result = run_conformance_suite(verbose=False)
        self.assertTrue(result["conformance_passed"], "All test vectors must pass with 100% invariant conformance")
        self.assertEqual(result["failed_vectors"], 0)
        self.assertEqual(result["passed_vectors"], result["total_vectors"])
        self.assertLess(result["avg_latency_ms"], 5.0, "Average latency per vector must remain under 5ms")


if __name__ == "__main__":
    unittest.main()
