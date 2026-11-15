// Live MiniMax API tests. Excluded from the default run by
// `testPathIgnorePatterns` in `jest.config.cjs`
// (--testPathIgnorePatterns="api\.test\.ts"); run it with:
//
//   MINIMAX_API_KEY=... pnpm test:live
//
// These calls consume account credits, so this file never runs on an
// exported key by accident.
import { makeMinimaxRequest } from './client';
import type { ChatCompletionOutput, ModelsListOutput } from './endpoints/types';
import {
	ChatCompletionOutputSchema,
	ModelsListOutputSchema,
} from './endpoints/types';

const LIVE = process.env.MINIMAX_API_KEY ?? '';
const describeLive = LIVE.length > 0 ? describe : describe.skip;

describeLive('minimax live API (env-gated)', () => {
	it('GET /v1/models lists the available models', async () => {
		const res = await makeMinimaxRequest<ModelsListOutput>('/v1/models', LIVE, {
			method: 'GET',
		});

		const parsed = ModelsListOutputSchema.parse(res);
		expect(parsed.data.length).toBeGreaterThan(0);
		for (const model of parsed.data) {
			expect(typeof model.id).toBe('string');
		}
	});

	it('POST /v1/text/chatcompletion_v2 returns a completion', async () => {
		const res = await makeMinimaxRequest<ChatCompletionOutput>(
			'/v1/text/chatcompletion_v2',
			LIVE,
			{
				method: 'POST',
				body: {
					model: 'MiniMax-M2',
					messages: [
						{ role: 'user', content: 'Reply with the single word: ok' },
					],
					max_completion_tokens: 16,
				},
			},
		);

		const parsed = ChatCompletionOutputSchema.parse(res);
		expect(parsed.id).toBeDefined();
		expect(parsed.choices?.length).toBeGreaterThan(0);
	});
});
