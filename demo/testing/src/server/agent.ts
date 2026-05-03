import { createAnthropic } from '@ai-sdk/anthropic';
import { createCorsairAgent } from '@corsair-dev/agent';
import { corsair } from './corsair';

const anthropic = createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

export const agent = createCorsairAgent(corsair, {
	system1: anthropic('claude-haiku-4-5-20251001'),
	system2: anthropic('claude-sonnet-4-6'),
});

// Module-level guard so start() only runs once per process.
// Next.js dev mode preserves module state between requests.
let started = false;
export async function ensureAgentStarted() {
	if (!started) {
		started = true;
		await agent.start();
	}
}
