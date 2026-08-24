import { makeHuggingFaceRequest } from './client';

describe('Hugging Face raw request handling', () => {
	afterEach(() => {
		jest.restoreAllMocks();
	});

	it.each([
		[401, 'Unauthorized'],
		[429, 'Too Many Requests'],
	])(
		'throws API errors for SSE HTTP %i responses',
		async (status, statusText) => {
			const errorBody = JSON.stringify({ error: statusText });
			jest.spyOn(globalThis, 'fetch').mockResolvedValue(
				new Response(errorBody, {
					status,
					statusText,
					headers: { 'Content-Type': 'application/json' },
				}),
			);

			await expect(
				makeHuggingFaceRequest('/api/spaces/user/demo/events', 'hf_bad', {
					sse: true,
					timeoutMs: 50,
				}),
			).rejects.toMatchObject({
				name: 'ApiError',
				status,
				statusText,
				body: errorBody,
			});
		},
	);
});
