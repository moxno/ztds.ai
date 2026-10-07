"""
Unit tests for ZTDS Python Reference Core (Invariant 1-4 validation).
"""

import unittest
from ztds import NativeZtdsEngine, sanitize, reveal, restore, zeroize, session


class TestZtdsCore(unittest.TestCase):
    def setUp(self):
        self.engine = NativeZtdsEngine()

    def test_invariant_1_and_2_roundtrip(self):
        text = "Contact Alice at alice@cyber-defense.org or call +1 (555) 123-4567. Key: sk-ant-api03-abcdef1234567890abcdef."
        sess_id = "test-sess-1"

        sanitized, minted = self.engine.sanitize(text, sess_id)

        # Invariant 1: Zero leakage in sanitized text
        self.assertNotIn("alice@cyber-defense.org", sanitized)
        self.assertNotIn("+1 (555) 123-4567", sanitized)
        self.assertNotIn("sk-ant-api03-abcdef1234567890abcdef", sanitized)

        # Canonical RFC token format
        self.assertIn("[EMAIL_1]", sanitized)
        self.assertIn("[PHONE_1]", sanitized)
        self.assertIn("[API_SECRET_1]", sanitized)

        # Invariant 2: Bijective restoration
        restored = self.engine.restore(sanitized, sess_id)
        self.assertEqual(restored, text)

    def test_coreference_determinism(self):
        text = "User marcus@corp.com met with client. Later marcus@corp.com confirmed the meeting."
        sess_id = "test-sess-coref"

        sanitized, _ = self.engine.sanitize(text, sess_id)
        # Both occurrences should map to [EMAIL_1]
        self.assertEqual(sanitized.count("[EMAIL_1]"), 2)
        self.assertNotIn("[EMAIL_2]", sanitized)

        restored = self.engine.restore(sanitized, sess_id)
        self.assertEqual(restored, text)

    def test_invariant_3_ram_zeroization(self):
        text = "Confidential token: sk-proj-12345678901234567890"
        sess_id = "test-sess-zeroize"

        sanitized, _ = self.engine.sanitize(text, sess_id)
        self.assertIn("[API_SECRET_1]", sanitized)

        # Pre-zeroization restoration works
        self.assertEqual(self.engine.restore(sanitized, sess_id), text)

        # Zeroize
        self.engine.zeroize(sess_id)

        # Post-zeroization restoration fails (tokens remain unreplaced in memory)
        self.assertEqual(self.engine.restore(sanitized, sess_id), sanitized)

    def test_context_manager(self):
        text = "Patient record for ssn: 123-45-6789 and IBAN DE89370400440532013000"
        with self.engine.session() as s:
            sanitized, _ = s.sanitize(text)
            self.assertIn("[SSN_1]", sanitized)
            self.assertIn("[IBAN_1]", sanitized)
            restored = s.reveal(sanitized)
            self.assertEqual(restored, text)
            saved_sess_id = s.session_id

        # Outside context, session memory is wiped
        self.assertEqual(self.engine.restore(sanitized, saved_sess_id), sanitized)


if __name__ == "__main__":
    unittest.main()
