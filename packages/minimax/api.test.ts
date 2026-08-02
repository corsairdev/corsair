import {
	MINIMAX_MODEL_CONFIG,
	MINIMAX_REGION_ENDPOINTS,
	MINIMAX_SUPPORTED_MODEL_IDS,
	resolveMiniMaxBaseUrls,
} from './config';
import { MiniMaxEndpointInputSchemas, MiniMaxEndpointOutputSchemas } from './endpoints/types';

describe('MiniMax config', () => {
	it('exposes the supported model ids', () => {
		expect(MINIMAX_SUPPORTED_MODEL_IDS).toEqual(['MiniMax-M3', 'MiniMax-M2.7']);
		expect(MINIMAX_MODEL_CONFIG.model_ids).toEqual(['MiniMax-M3', 'MiniMax-M2.7']);
	});

	it('exposes the regional endpoints', () => {
		expect(MINIMAX_REGION_ENDPOINTS).toEqual([
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
		]);
	});

	it('keeps the documented model metadata', () => {
		expect(MINIMAX_MODEL_CONFIG.models).toEqual([
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
		]);
	});

	it('resolves the regional base urls', () => {
		expect(resolveMiniMaxBaseUrls().openaiBaseUrl).toBe('https://api.minimax.io/v1');
		expect(resolveMiniMaxBaseUrls({ region: 'cn_zh' }).anthropicBaseUrl).toBe('https://api.minimaxi.com/anthropic');
	});
});

describe('MiniMax schemas', () => {
	it('accepts the supported chat and anthropic models', () => {
		expect(
			MiniMaxEndpointInputSchemas.chatCreateCompletion.safeParse({
				model: 'MiniMax-M3',
				messages: [{ role: 'user', content: 'Hello' }],
			}).success,
		).toBe(true);
		expect(
			MiniMaxEndpointInputSchemas.anthropicCreateMessage.safeParse({
				model: 'MiniMax-M2.7',
				maxTokens: 128,
				messages: [{ role: 'user', content: 'Hello' }],
			}).success,
		).toBe(true);
	});

	it('rejects unsupported chat model ids', () => {
		expect(
			MiniMaxEndpointInputSchemas.chatCreateCompletion.safeParse({
				model: 'bad-model',
				messages: [{ role: 'user', content: 'Hello' }],
			}).success,
		).toBe(false);
	});

	it('accepts the documented model list shape', () => {
		expect(
			MiniMaxEndpointOutputSchemas.modelsList.safeParse({
				object: 'list',
				data: [
					{ id: 'MiniMax-M3', object: 'model', owned_by: 'minimax' },
					{ id: 'MiniMax-M2.7', object: 'model', owned_by: 'minimax' },
				],
			}).success,
		).toBe(true);
	});
});