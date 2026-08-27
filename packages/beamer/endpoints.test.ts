import { logEventFromContext } from 'corsair/core';
import { Posts } from './endpoints';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => undefined),
}));

const mockLogEvent = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

const realFetch = global.fetch;

afterEach(() => {
	global.fetch = realFetch;
	mockLogEvent.mockClear();
});

describe('Beamer posts endpoint', () => {
	it('gets posts with pagination and API key', async () => {
		let requestedUrl = '';

		global.fetch = (async (url: unknown) => {
			requestedUrl = String(url);

			return {
				ok: true,
				status: 200,
				statusText: 'OK',
				url: requestedUrl,
				headers: new Headers({
					'Content-Type': 'application/json',
				}),
				json: async () => [
					{
						id: 'post-1',
						title: 'Test post',
					},
				],
				text: async () =>
					JSON.stringify([
						{
							id: 'post-1',
							title: 'Test post',
						},
					]),
			};
		}) as unknown as typeof global.fetch;

		const ctx = {
			key: 'test-api-key',
		} as Parameters<typeof Posts.get>[0];

		const result = await Posts.get(ctx, {
			page: 1,
			limit: 10,
		});

		const url = new URL(requestedUrl);

		expect(url.pathname).toBe('/v0/posts');
		expect(url.searchParams.get('page')).toBe('1');
		expect(url.searchParams.get('limit')).toBe('10');
		expect(result).toEqual([
			{
				id: 'post-1',
				title: 'Test post',
			},
		]);

		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'beamer.posts.get',
			{
				page: 1,
				limit: 10,
			},
			'completed',
		);
	});
});
