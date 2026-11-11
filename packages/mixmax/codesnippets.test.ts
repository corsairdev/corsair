import type { MixmaxContext } from './index';
import { mixmax } from './index';

jest.mock('./client', () => ({
	...jest.requireActual('./client'),
	makeMixmaxRequest: jest.fn(),
}));

import { makeMixmaxRequest } from './client';

const request = jest.mocked(makeMixmaxRequest);

// The handlers under test read only `key` from the runtime context and log
// through logEventFromContext, which needs $getAccountId; every other
// context service is untouched by these code paths.
const ctx = {
	key: 'mixmax_test_key',
	$getAccountId: async () => 'account-1',
} as unknown as MixmaxContext;

const SNIPPET = {
	_id: 'snip-1',
	userId: 'user-1',
	createdAt: '2026-10-14T15:00:00.000Z',
	title: 'Agenda snippet',
	code: 'const x = 1;',
	language: 'javascript',
	theme: 'xcode',
	background: 'rgb(255, 255, 255)',
};

// The factory always builds the validated endpoint tree, so the endpoints
// accessor is defined on every plugin instance.
const endpoints = mixmax({ key: 'mixmax_test_key' }).endpoints!;

describe('Mixmax code snippets endpoints', () => {
	beforeEach(() => {
		request.mockReset();
		request.mockResolvedValue(undefined);
	});

	it('codeSnippets.list sends GET /v1/codesnippets with documented query params', async () => {
		const page = { results: [SNIPPET], hasNext: false };
		request.mockResolvedValue(page);
		const result = await endpoints.codeSnippets.list(ctx, {
			limit: 50,
			fields: 'title,code',
		});

		expect(request).toHaveBeenCalledWith(ctx, '/v1/codesnippets', {
			method: 'GET',
			query: {
				limit: 50,
				next: undefined,
				previous: undefined,
				fields: 'title,code',
			},
		});
		expect(result).toEqual(page);
	});

	it('codeSnippets.create posts the snippet write fields as the body', async () => {
		request.mockResolvedValue({ id: 'snip-2' });
		const result = await endpoints.codeSnippets.create(ctx, {
			title: 'Agenda snippet',
			code: 'const y = 2;',
			language: 'javascript',
			html: '<pre>const y = 2;</pre>',
		});

		expect(request).toHaveBeenCalledWith(ctx, '/v1/codesnippets', {
			method: 'POST',
			body: {
				title: 'Agenda snippet',
				code: 'const y = 2;',
				language: 'javascript',
				html: '<pre>const y = 2;</pre>',
			},
		});
		expect(result).toEqual({ id: 'snip-2' });
	});

	it('codeSnippets.get sends GET /v1/codesnippets/:id and rejects unsafe ids', async () => {
		request.mockResolvedValue(SNIPPET);
		const result = await endpoints.codeSnippets.get(ctx, { id: 'snip-1' });

		expect(request).toHaveBeenCalledWith(ctx, '/v1/codesnippets/snip-1', {
			method: 'GET',
		});
		expect(result).toEqual(SNIPPET);

		await expect(
			endpoints.codeSnippets.get(ctx, { id: '../admin' }),
		).rejects.toThrow('Invalid Mixmax id');
		expect(request).toHaveBeenCalledTimes(1);
	});

	it('codeSnippets.get rejects a missing id before any request', async () => {
		await expect(
			// unknown: deliberately invalid input shape to prove the schema
			// boundary rejects it before transport.
			endpoints.codeSnippets.get(ctx, {} as never),
		).rejects.toThrow();
		expect(request).not.toHaveBeenCalled();
	});
});
