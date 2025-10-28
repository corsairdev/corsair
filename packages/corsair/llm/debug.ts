import "dotenv/config";

console.log("=== LLM Debug Info ===");
console.log("Working directory:", process.cwd());
console.log("OPENAI_API_KEY exists:", !!process.env.OPENAI_API_KEY);
console.log("OPENAI_API_KEY starts with sk-:", process.env.OPENAI_API_KEY?.startsWith('sk-'));
console.log("GROQ_API_KEY exists:", !!process.env.GROQ_API_KEY);
console.log("TOGETHER_API_KEY exists:", !!process.env.TOGETHER_API_KEY);
console.log("CORSAIR_LLM_PROVIDER:", process.env.CORSAIR_LLM_PROVIDER || "default (openai)");

// Test if we can reach the OpenAI API (without making a real request)
console.log("\n=== API Connectivity Test ===");
try {
  console.log("Fetch function available:", typeof fetch);
} catch (e) {
  console.log("Fetch error:", e);
}