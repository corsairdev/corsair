export type MiniMaxRegion = 'global_en' | 'cn_zh';

export type MiniMaxBaseUrls = {
	openaiBaseUrl: string;
	anthropicBaseUrl: string;
	docsRoot: string;
};

export const MINIMAX_SUPPORTED_MODEL_IDS = [
	'MiniMax-M3',
	'MiniMax-M2.7',
] as const;

export type MiniMaxSupportedModelId =
	(typeof MINIMAX_SUPPORTED_MODEL_IDS)[number];

export const MINIMAX_MODEL_CONFIG = {
	reason_codes: {
		provider_add: 'provider-add',
		model_add: 'model-add',
		parameter_refresh: 'parameter-refresh',
		input_capability: 'input-capability',
	},
	model_id: 'MiniMax-M3',
	model_ids: ['MiniMax-M3', 'MiniMax-M2.7'],
	models: [
		{
			model_id: 'MiniMax-M3',
			context_window: 1000000,
			pricing_usd_per_million_tokens: {
				input: 0.6,
				output: 2.4,
				cache_read: 0.12,
				cache_write: null,
			},
			input_modalities: ['text', 'image', 'video'],
			thinking: ['adaptive', 'disabled'],
		},
		{
			model_id: 'MiniMax-M2.7',
			context_window: 204800,
			pricing_usd_per_million_tokens: {
				input: 0.3,
				output: 1.2,
				cache_read: 0.06,
				cache_write: 0.375,
			},
			input_modalities: ['text'],
			thinking: ['always_on'],
		},
	],
	anthropic_base_url: 'https://api.minimax.io/anthropic',
	openai_base_url: 'https://api.minimax.io/v1',
	context_window: 1000000,
	pricing_usd_per_million_tokens: {
		input: 0.6,
		output: 2.4,
		cache_read: 0.12,
		cache_write: null,
	},
	thinking: ['adaptive', 'disabled'],
} as const;

export const MINIMAX_REGION_ENDPOINTS = [
	{
		region: 'global_en',
		openai_base_url: 'https://api.minimax.io/v1',
		anthropic_base_url: 'https://api.minimax.io/anthropic',
		docs_root: 'https://platform.minimax.io/docs',
	},
	{
		region: 'cn_zh',
		openai_base_url: 'https://api.minimaxi.com/v1',
		anthropic_base_url: 'https://api.minimaxi.com/anthropic',
		docs_root: 'https://platform.minimaxi.com/docs',
	},
] as const;

export function resolveMiniMaxBaseUrls(
	input: {
		region?: MiniMaxRegion;
		openaiBaseUrl?: string;
	anthropicBaseUrl?: string;
	} = {},
): MiniMaxBaseUrls {
	const region = input.region ?? 'global_en';
	const resolved =
		MINIMAX_REGION_ENDPOINTS.find((entry) => entry.region === region) ??
		MINIMAX_REGION_ENDPOINTS[0];

	if (!resolved) {
		throw new Error('MiniMax region configuration is missing.');
	}

	return {
		openaiBaseUrl: input.openaiBaseUrl ?? resolved.openai_base_url,
		anthropicBaseUrl: input.anthropicBaseUrl ?? resolved.anthropic_base_url,
		docsRoot: resolved.docs_root,
	};
}