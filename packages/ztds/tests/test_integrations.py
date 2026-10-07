"""
Unit tests for ZTDS AI Framework Integrations (LiteLLM, CrewAI, LangChain, LlamaIndex).
"""

import asyncio
import unittest
import uuid
from ztds.integrations import (
    ZTDSGuardrail,
    ZTDSSanitizerTool,
    ZTDSSanitizingCallbackHandler,
    ZTDSNodePostprocessor,
)


class TestZtdsIntegrations(unittest.TestCase):
    def test_crewai_tool(self):
        tool = ZTDSSanitizerTool()
        raw = "User email: boss@venture.capital with API key sk-ant-api03-01234567890123456789."
        sanitized = tool._run(raw, session_id="crew-1")
        self.assertNotIn("boss@venture.capital", sanitized)
        self.assertIn("[EMAIL_1]", sanitized)
        self.assertIn("[API_SECRET_1]", sanitized)

        restored = tool.restore(sanitized, session_id="crew-1")
        self.assertEqual(restored, raw)

        tool.zeroize("crew-1")
        self.assertEqual(tool.restore(sanitized, session_id="crew-1"), sanitized)

    def test_langchain_callback(self):
        handler = ZTDSSanitizingCallbackHandler()
        run_id = uuid.uuid4()
        prompts = ["Process payment for card 4532-1234-5678-9012 for user@test.com"]

        handler.on_llm_start({}, prompts, run_id=run_id)
        self.assertNotIn("4532-1234-5678-9012", prompts[0])
        self.assertIn("[CREDIT_CARD_1]", prompts[0])
        self.assertIn("[EMAIL_1]", prompts[0])

        class FakeGeneration:
            def __init__(self, text):
                self.text = text

        class FakeResult:
            def __init__(self, gens):
                self.generations = gens

        ai_response = FakeResult([[FakeGeneration("Received confirmation for [EMAIL_1] and [CREDIT_CARD_1].")]])
        handler.on_llm_end(ai_response, run_id=run_id)

        self.assertIn("user@test.com", ai_response.generations[0][0].text)
        self.assertIn("4532-1234-5678-9012", ai_response.generations[0][0].text)

    def test_llamaindex_postprocessor(self):
        post = ZTDSNodePostprocessor(session_id="llama-test")

        class FakeNode:
            def __init__(self, text):
                self.text = text

        class FakeNodeWithScore:
            def __init__(self, node):
                self.node = node

        nodes = [FakeNodeWithScore(FakeNode("Customer SSN: 123-45-6789."))]
        post.postprocess_nodes(nodes)
        self.assertNotIn("123-45-6789", nodes[0].node.text)
        self.assertIn("[SSN_1]", nodes[0].node.text)

        restored = post.restore_text(nodes[0].node.text)
        self.assertEqual(restored, "Customer SSN: 123-45-6789.")
        post.zeroize()

    def test_litellm_guardrail_async(self):
        guard = ZTDSGuardrail()

        async def run_test():
            call_id = "test-call-123"
            data = {
                "litellm_call_id": call_id,
                "messages": [
                    {"role": "user", "content": "Deploy database with secret ghp_012345678901234567890123456789012345"}
                ]
            }
            # Pre-call hook
            sanitized_data = await guard.async_pre_call_hook(None, None, data, "completion")
            sanitized_content = sanitized_data["messages"][0]["content"]
            self.assertNotIn("ghp_012345678901234567890123456789012345", sanitized_content)
            self.assertIn("[API_SECRET_1]", sanitized_content)

            # Post-call success hook
            class FakeMessage:
                def __init__(self, content):
                    self.content = content
            class FakeChoice:
                def __init__(self, message):
                    self.message = message
            class FakeResponse:
                def __init__(self, choices):
                    self.choices = choices

            response = FakeResponse([FakeChoice(FakeMessage("Confirmed token [API_SECRET_1] is active."))])
            final_res = await guard.async_post_call_success_hook(sanitized_data, None, response)
            self.assertIn("ghp_012345678901234567890123456789012345", final_res.choices[0].message.content)

        asyncio.run(run_test())


if __name__ == "__main__":
    unittest.main()
