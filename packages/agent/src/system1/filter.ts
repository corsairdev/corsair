import { generateText } from 'ai';
import type { LLMTierConfig, LLMTriggerFilter } from '../types.js';

/**
 * Evaluates an LLM-based trigger filter using System 1 (Haiku).
 * Runs on every matching webhook event — must stay cheap (~$0.0001 per call).
 */
export async function evaluateLLMFilter(
	filter: LLMTriggerFilter,
	model: LLMTierConfig,
	event: Record<string, unknown>,
) {
	const resolvedPrompt = filter.prompt.replace(
		/\{\{event\.([^}]+)\}\}/g,
		(_, path: string) => {
			const value = resolvePath(event, path);
			if (value == null) return '';
			return typeof value === 'object' ? JSON.stringify(value) : String(value);
		},
	);

	const { text } = await generateText({
		model,
		system: 'You are a binary classifier. Respond with exactly one word: "yes" or "no". No explanation, no punctuation.',
		prompt: resolvedPrompt,
		maxTokens: 5,
		temperature: 0,
	});

	return text.trim().toLowerCase() === filter.passIf.trim().toLowerCase();
}

/**
 * Evaluates a rule-based (zero-LLM) trigger filter.
 * The predicate is a JS expression with `event` in scope.
 */
export function evaluateRuleFilter(
	predicate: string,
	event: Record<string, unknown>,
) {
	try {
		// eslint-disable-next-line no-new-func
		const fn = new Function('event', `return !!(${predicate})`);
		return (fn as (e: unknown) => boolean)(event);
	} catch (err) {
		throw new Error(
			`Rule filter evaluation failed for predicate "${predicate}": ${String(err)}`,
		);
	}
}

function resolvePath(obj: Record<string, unknown>, path: string): unknown {
	let current: unknown = obj;
	for (const part of path.split('.')) {
		if (current == null || typeof current !== 'object') return undefined;
		current = (current as Record<string, unknown>)[part];
	}
	return current;
}
