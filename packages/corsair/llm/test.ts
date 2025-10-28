import { llm } from "./index.js";
import { z } from "zod";

// Test schema
const testSchema = z.object({
  message: z.string(),
  confidence: z.number().min(0).max(1),
});

async function testLLM() {
  console.log("Testing LLM functionality...");

  try {
    // Test with a detailed prompt
    const result = await llm({
      provider: "openai", // Default provider
      prompt: `You are a helpful assistant that responds with valid JSON according to the provided schema.`,
      message: `Please respond with a JSON object containing:
- message: A simple greeting string
- confidence: A number between 0 and 1

Example format:
{
  "message": "Hello, this is a test!",
  "confidence": 0.95
}`,
      schema: testSchema,
    });

    if (result) {
      console.log("✅ LLM test successful!");
      console.log("Response:", result);
    } else {
      console.log("❌ LLM test failed - no response");
    }
  } catch (error) {
    console.log("❌ LLM test failed with error:", error);
  }
}

// Only run test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testLLM();
}