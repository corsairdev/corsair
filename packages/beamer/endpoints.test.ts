import { logEventFromContext } from 'corsair/core';
import { Posts } from './endpoints';
import { BeamerEndpointOutputSchemas } from './endpoints/types';

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

		const post = {
			id: 123,
			date: '2018-12-31T00:00:00Z',
			dueDate: '2019-12-31T00:00:00Z',
			published: true,
			pinned: false,
			showInWidget: true,
			showInStandalone: true,
			category: 'new',
			boostedAnnouncement: 'snippet',
			translations: [
				{
					title: 'Test post',
					content: 'Test content',
					contentHtml: '<p>Test content</p>',
					language: 'EN',
					category: 'New',
					linkUrl: 'https://www.getbeamer.com/',
					linkText: 'Click here!',
					images: [],
				},
			],
			filter: 'admins',
			filterUrl: 'https://app.getbeamer.com/*',
			autoOpen: false,
			editionDate: '2018-12-31T10:00:00Z',
			feedbackEnabled: true,
			reactionsEnabled: true,
			views: 310,
			uniqueViews: 250,
			clicks: 120,
			feedbacks: 55,
			positiveReactions: 12,
			neutralReactions: 5,
			negativeReactions: 10,
		};

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
				json: async () => [post],
				text: async () => JSON.stringify([post]),
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
		expect(result).toEqual([post]);
		expect(BeamerEndpointOutputSchemas.postsGet.parse(result)).toEqual([
			post,
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
