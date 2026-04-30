export type ModelPrice = {
	input: number;
	output: number;
};

export const MODEL_PRICES: Record<string, ModelPrice> = {
	'gpt-4o': { input: 2.5, output: 10 },
	'gpt-4o-2024-11-20': { input: 2.5, output: 10 },
	'gpt-4o-2024-08-06': { input: 2.5, output: 10 },
	'gpt-4o-mini': { input: 0.15, output: 0.6 },
	'gpt-4-turbo': { input: 10, output: 30 },
	'gpt-4': { input: 30, output: 60 },
	'gpt-3.5-turbo': { input: 0.5, output: 1.5 },
	'gpt-4.1': { input: 2, output: 8 },
	'gpt-4.1-mini': { input: 0.4, output: 1.6 },
	'gpt-4.1-nano': { input: 0.1, output: 0.4 },
	'gpt-5': { input: 1.25, output: 10 },
	'gpt-5-mini': { input: 0.25, output: 2 },
	'gpt-5-nano': { input: 0.05, output: 0.4 },
	o1: { input: 15, output: 60 },
	'o1-mini': { input: 3, output: 12 },
	'o1-preview': { input: 15, output: 60 },
	'o3-mini': { input: 1.1, output: 4.4 },
	o3: { input: 2, output: 8 },
	'o4-mini': { input: 1.1, output: 4.4 },

	'claude-opus-4-5': { input: 15, output: 75 },
	'claude-opus-4-7': { input: 15, output: 75 },
	'claude-opus-4-1': { input: 15, output: 75 },
	'claude-sonnet-4-5': { input: 3, output: 15 },
	'claude-sonnet-4-6': { input: 3, output: 15 },
	'claude-sonnet-4': { input: 3, output: 15 },
	'claude-haiku-4-5': { input: 1, output: 5 },
	'claude-3-7-sonnet-latest': { input: 3, output: 15 },
	'claude-3-5-sonnet-latest': { input: 3, output: 15 },
	'claude-3-5-sonnet-20241022': { input: 3, output: 15 },
	'claude-3-5-haiku-latest': { input: 0.8, output: 4 },
	'claude-3-5-haiku-20241022': { input: 0.8, output: 4 },
	'claude-3-opus-latest': { input: 15, output: 75 },
	'claude-3-haiku-20240307': { input: 0.25, output: 1.25 },

	'gemini-2.5-pro': { input: 1.25, output: 10 },
	'gemini-2.5-flash': { input: 0.3, output: 2.5 },
	'gemini-2.5-flash-lite': { input: 0.1, output: 0.4 },
	'gemini-2.0-flash': { input: 0.1, output: 0.4 },
	'gemini-2.0-flash-001': { input: 0.1, output: 0.4 },
	'gemini-2.0-flash-lite': { input: 0.075, output: 0.3 },
	'gemini-2.0-pro-exp': { input: 1.25, output: 5 },
	'gemini-1.5-pro': { input: 1.25, output: 5 },
	'gemini-1.5-pro-latest': { input: 1.25, output: 5 },
	'gemini-1.5-flash': { input: 0.075, output: 0.3 },
	'gemini-1.5-flash-latest': { input: 0.075, output: 0.3 },
	'gemini-1.5-flash-8b': { input: 0.0375, output: 0.15 },

	'llama-3.3-70b-versatile': { input: 0.59, output: 0.79 },
	'llama-3.1-70b-versatile': { input: 0.59, output: 0.79 },
	'llama-3.1-8b-instant': { input: 0.05, output: 0.08 },
	'llama-3.2-1b-preview': { input: 0.04, output: 0.04 },
	'llama-3.2-3b-preview': { input: 0.06, output: 0.06 },
	'llama-3.2-11b-vision-preview': { input: 0.18, output: 0.18 },
	'llama-3.2-90b-vision-preview': { input: 0.9, output: 0.9 },
	'mixtral-8x7b-32768': { input: 0.24, output: 0.24 },
	'gemma2-9b-it': { input: 0.2, output: 0.2 },
	'deepseek-r1-distill-llama-70b': { input: 0.75, output: 0.99 },

	'deepseek-chat': { input: 0.27, output: 1.1 },
	'deepseek-reasoner': { input: 0.55, output: 2.19 },
	'mistral-large-latest': { input: 2, output: 6 },
	'mistral-small-latest': { input: 0.2, output: 0.6 },
	'codestral-latest': { input: 0.3, output: 0.9 },
	'grok-2': { input: 2, output: 10 },
	'grok-2-mini': { input: 0.3, output: 0.5 },
	'grok-3': { input: 3, output: 15 },
	'grok-3-mini': { input: 0.3, output: 0.5 },
	'grok-4': { input: 5, output: 25 },
};

function normalizeId(id: string): string {
	return id
		.toLowerCase()
		.replace(/^models\//, '')
		.replace(/^anthropic\//, '')
		.replace(/^openai\//, '')
		.replace(/^google\//, '')
		.replace(/^groq\//, '')
		.trim();
}

function candidateIds(modelId: string): string[] {
	const norm = normalizeId(modelId);
	const variants = new Set<string>([modelId, norm]);

	const stripDate = norm
		.replace(/-\d{8}$/, '')
		.replace(/-\d{4}-\d{2}-\d{2}$/, '');
	if (stripDate !== norm) variants.add(stripDate);

	const stripVersion = norm.replace(/-(?:00\d|0?\d{2,3})$/, '');
	if (stripVersion !== norm) variants.add(stripVersion);

	const stripLatest = norm.replace(/-latest$/, '');
	if (stripLatest !== norm) variants.add(stripLatest);

	const stripPreview = norm.replace(/-preview$/, '').replace(/-exp$/, '');
	if (stripPreview !== norm) variants.add(stripPreview);

	return Array.from(variants);
}

const PRICES_NORMALIZED: Record<string, ModelPrice> = (() => {
	const map: Record<string, ModelPrice> = {};
	for (const [k, v] of Object.entries(MODEL_PRICES)) {
		map[normalizeId(k)] = v;
	}
	return map;
})();

export function getModelPrice(modelId: string): ModelPrice | null {
	if (MODEL_PRICES[modelId]) return MODEL_PRICES[modelId];

	for (const candidate of candidateIds(modelId)) {
		const direct = PRICES_NORMALIZED[candidate];
		if (direct) return direct;
	}

	const norm = normalizeId(modelId);
	let bestMatch: { key: string; price: ModelPrice } | null = null;
	for (const [key, price] of Object.entries(PRICES_NORMALIZED)) {
		if (norm.startsWith(key) || key.startsWith(norm)) {
			if (!bestMatch || key.length > bestMatch.key.length) {
				bestMatch = { key, price };
			}
		}
	}
	return bestMatch?.price ?? null;
}

export type TokenUsage = {
	inputTokens: number;
	outputTokens: number;
	totalTokens: number;
};

export function computeCost(modelId: string, usage: TokenUsage): number | null {
	const price = getModelPrice(modelId);
	if (!price) {
		console.warn(`[corsair:pricing] no price entry for model "${modelId}"`);
		return null;
	}
	const input = (usage.inputTokens / 1_000_000) * price.input;
	const output = (usage.outputTokens / 1_000_000) * price.output;
	return input + output;
}
