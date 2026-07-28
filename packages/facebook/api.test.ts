import { request } from 'corsair/http';
import { FACEBOOK_API_BASE, resolvePageId } from './client';
import { FacebookEndpointInputSchemas } from './endpoints/types';
import { errorHandlers } from './error-handlers';
import type { FacebookContext } from './index';
import { facebook } from './index';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

jest.mock('corsair/core', () => {
	const original = jest.requireActual('corsair/core');
	return {
		...original,
		logEventFromContext: jest.fn().mockResolvedValue(undefined),
	};
});

const mockRequest = request as jest.Mock;

const PAGE_ID = '111';
const POST_ID = '111_222';
const COMMENT_ID = '111_333';
const PAGE_TOKEN = 'page-access-token';
const USER_TOKEN = 'user-access-token';

type Handler = (
	ctx: FacebookContext,
	input: Record<string, unknown>,
) => Promise<unknown>;
type EndpointTree = Record<string, Record<string, Handler | undefined>>;

function lastCall() {
	const call = mockRequest.mock.calls[mockRequest.mock.calls.length - 1];
	return { config: call?.[0], options: call?.[1] };
}

function callAt(index: number) {
	const call = mockRequest.mock.calls[index];
	return { config: call?.[0], options: call?.[1] };
}

describe('Facebook endpoint behavior (mocked HTTP)', () => {
	const plugin = facebook({ key: USER_TOKEN });
	const endpoints = plugin.endpoints as unknown as EndpointTree;

	const pagesUpsert = jest.fn().mockResolvedValue(undefined);
	const pagesFind = jest.fn().mockResolvedValue({
		data: { accessToken: PAGE_TOKEN, facebookId: PAGE_ID },
	});

	const mockCtx = {
		key: USER_TOKEN,
		$getAccountId: async () => 'test-account-id',
		options: {},
		db: {
			users: { upsertByEntityId: jest.fn().mockResolvedValue(undefined) },
			pages: {
				findByEntityId: pagesFind,
				upsertByEntityId: pagesUpsert,
			},
			posts: {
				upsertByEntityId: jest.fn().mockResolvedValue(undefined),
				deleteByEntityId: jest.fn().mockResolvedValue(true),
			},
			comments: {
				upsertByEntityId: jest.fn().mockResolvedValue(undefined),
				deleteByEntityId: jest.fn().mockResolvedValue(true),
			},
			conversations: {
				upsertByEntityId: jest.fn().mockResolvedValue(undefined),
			},
			messages: { upsertByEntityId: jest.fn().mockResolvedValue(undefined) },
			albums: { upsertByEntityId: jest.fn().mockResolvedValue(undefined) },
			photos: { upsertByEntityId: jest.fn().mockResolvedValue(undefined) },
			videos: { upsertByEntityId: jest.fn().mockResolvedValue(undefined) },
			insights: { upsertByEntityId: jest.fn().mockResolvedValue(undefined) },
			reactions: { upsertByEntityId: jest.fn().mockResolvedValue(undefined) },
			pageRoles: { upsertByEntityId: jest.fn().mockResolvedValue(undefined) },
		},
	} as unknown as FacebookContext;

	function call(group: string, name: string, input: Record<string, unknown>) {
		const handler = endpoints[group]?.[name];
		if (!handler) throw new Error(`[test] missing endpoint ${group}.${name}`);
		return handler(mockCtx, input);
	}

	beforeEach(() => {
		mockRequest.mockReset();
		pagesFind.mockResolvedValue({
			data: { accessToken: PAGE_TOKEN, facebookId: PAGE_ID },
		});
		pagesUpsert.mockClear();
		jest.clearAllMocks();
		pagesFind.mockResolvedValue({
			data: { accessToken: PAGE_TOKEN, facebookId: PAGE_ID },
		});
	});

	it('covers all 44 endpoints', () => {
		const leaves = Object.values(endpoints).flatMap((group) =>
			Object.values(group ?? {}),
		);
		expect(leaves).toHaveLength(44);
	});

	it('registers zod schemas for every nested endpoint', () => {
		expect(Object.keys(plugin.endpointSchemas ?? {})).toHaveLength(44);
		expect(Object.keys(FacebookEndpointInputSchemas)).toHaveLength(44);
	});

	it('includes read_insights in OAuth scopes', () => {
		expect(plugin.oauthConfig?.scopes).toContain('read_insights');
	});

	it('resolvePageId extracts composite PageID_PostID', () => {
		expect(resolvePageId(undefined, POST_ID)).toBe(PAGE_ID);
		expect(resolvePageId('999', POST_ID)).toBe('999');
		expect(() => resolvePageId(undefined, 'nopage')).toThrow(
			/page_id is required/,
		);
	});

	describe('page token cache', () => {
		it('uses cached page accessToken without a live Graph resolve', async () => {
			mockRequest.mockResolvedValue({ id: PAGE_ID, name: 'Cached Page' });
			await call('pages', 'getDetails', { page_id: PAGE_ID });

			expect(pagesFind).toHaveBeenCalledWith(PAGE_ID);
			expect(mockRequest).toHaveBeenCalledTimes(1);
			expect(lastCall().config.TOKEN).toBe(PAGE_TOKEN);
		});

		it('falls back to live Graph resolve and caches the token', async () => {
			pagesFind.mockResolvedValue(null);
			mockRequest
				.mockResolvedValueOnce({ access_token: 'fresh-page-token' })
				.mockResolvedValueOnce({ id: PAGE_ID, name: 'Live Page' });

			await call('pages', 'getDetails', { page_id: PAGE_ID });

			expect(callAt(0)).toMatchObject({
				config: { TOKEN: USER_TOKEN, BASE: FACEBOOK_API_BASE },
				options: {
					method: 'GET',
					url: PAGE_ID,
					query: { fields: 'access_token' },
				},
			});
			expect(callAt(1).config.TOKEN).toBe('fresh-page-token');
			expect(pagesUpsert).toHaveBeenCalledWith(
				PAGE_ID,
				expect.objectContaining({ accessToken: 'fresh-page-token' }),
			);
		});

		it('preserves accessToken when upserting page details', async () => {
			mockRequest.mockResolvedValue({
				id: PAGE_ID,
				name: 'Updated',
				about: 'About',
			});
			await call('pages', 'getDetails', { page_id: PAGE_ID });

			expect(pagesUpsert).toHaveBeenCalledWith(
				PAGE_ID,
				expect.objectContaining({
					accessToken: PAGE_TOKEN,
					name: 'Updated',
					about: 'About',
				}),
			);
		});
	});

	describe('users', () => {
		it('getCurrentUser GETs /me with the user token', async () => {
			mockRequest.mockResolvedValue({ id: 'u1', name: 'User' });
			await call('users', 'getCurrentUser', {});
			expect(lastCall()).toMatchObject({
				config: { TOKEN: USER_TOKEN },
				options: { method: 'GET', url: 'me' },
			});
		});

		it('getUserPages GETs /me/accounts', async () => {
			mockRequest.mockResolvedValue({ data: [] });
			await call('users', 'getUserPages', { limit: 10 });
			expect(lastCall().options).toMatchObject({
				method: 'GET',
				url: 'me/accounts',
			});
		});
	});

	describe('pages', () => {
		it('listManaged caches page access tokens', async () => {
			mockRequest.mockResolvedValue({
				data: [
					{
						id: PAGE_ID,
						name: 'Page',
						access_token: 'listed-token',
						tasks: ['MANAGE'],
					},
				],
			});
			await call('pages', 'listManaged', {});
			expect(pagesUpsert).toHaveBeenCalledWith(
				PAGE_ID,
				expect.objectContaining({ accessToken: 'listed-token' }),
			);
		});

		it('search uses the deprecated /pages/search endpoint', async () => {
			mockRequest.mockResolvedValue({ data: [] });
			await call('pages', 'search', { q: 'coffee' });
			expect(lastCall().options.url).toBe('pages/search');
		});

		it('updateSettings POSTs editable fields with a page token', async () => {
			mockRequest.mockResolvedValue({ success: true });
			await call('pages', 'updateSettings', {
				page_id: PAGE_ID,
				about: 'New about',
			});
			expect(lastCall()).toMatchObject({
				config: { TOKEN: PAGE_TOKEN },
				options: {
					method: 'POST',
					url: PAGE_ID,
					body: { about: 'New about' },
				},
			});
		});

		it('getInsights writes insight entities', async () => {
			mockRequest.mockResolvedValue({
				data: [
					{
						id: 'ins1',
						name: 'page_impressions',
						period: 'day',
						values: [{ value: 10, end_time: '2026-01-01' }],
					},
				],
			});
			await call('pages', 'getInsights', {
				page_id: PAGE_ID,
				metric: 'page_impressions',
				period: 'day',
			});
			expect(mockCtx.db.insights.upsertByEntityId).toHaveBeenCalled();
		});

		it('getRoles / assignTask / removeTask hit the expected edges', async () => {
			mockRequest.mockResolvedValue({ data: [{ id: 'u1', role: 'MANAGER' }] });
			await call('pages', 'getRoles', { page_id: PAGE_ID });
			expect(lastCall().options.url).toBe(`${PAGE_ID}/roles`);

			mockRequest.mockResolvedValue({ success: true });
			await call('pages', 'assignTask', {
				page_id: PAGE_ID,
				user: 'u1',
				tasks: ['MANAGE'],
			});
			expect(lastCall().options).toMatchObject({
				method: 'POST',
				url: `${PAGE_ID}/assigned_users`,
			});

			await call('pages', 'removeTask', { page_id: PAGE_ID, user: 'u1' });
			expect(lastCall().options).toMatchObject({
				method: 'DELETE',
				url: `${PAGE_ID}/assigned_users`,
				query: { user: 'u1' },
			});
		});
	});

	describe('posts', () => {
		it('create POSTs to /{page_id}/feed with a page token', async () => {
			mockRequest.mockResolvedValue({ id: POST_ID });
			await call('posts', 'create', {
				page_id: PAGE_ID,
				message: 'hello',
			});
			expect(lastCall()).toMatchObject({
				config: { TOKEN: PAGE_TOKEN },
				options: {
					method: 'POST',
					url: `${PAGE_ID}/feed`,
					body: { message: 'hello' },
				},
			});
		});

		it('list uses /feed not /posts', async () => {
			mockRequest.mockResolvedValue({ data: [{ id: POST_ID, message: 'x' }] });
			await call('posts', 'list', { page_id: PAGE_ID });
			expect(lastCall().options.url).toBe(`${PAGE_ID}/feed`);
		});

		it('get/update/delete/reschedule/publish use page tokens', async () => {
			mockRequest.mockResolvedValue({
				id: POST_ID,
				message: 'm',
				is_published: false,
			});
			await call('posts', 'get', { post_id: POST_ID });
			expect(lastCall().config.TOKEN).toBe(PAGE_TOKEN);

			mockRequest.mockResolvedValue({ success: true });
			await call('posts', 'update', { post_id: POST_ID, message: 'edited' });
			expect(lastCall()).toMatchObject({
				config: { TOKEN: PAGE_TOKEN },
				options: { method: 'POST', url: POST_ID, body: { message: 'edited' } },
			});

			await call('posts', 'delete', { post_id: POST_ID });
			expect(lastCall().options.method).toBe('DELETE');

			await call('posts', 'reschedule', {
				post_id: POST_ID,
				scheduled_publish_time: 1700000000,
			});
			expect(lastCall().options.body).toEqual({
				scheduled_publish_time: 1700000000,
			});

			await call('posts', 'publishScheduled', { post_id: POST_ID });
			expect(lastCall().options.body).toEqual({ is_published: true });
		});

		it('listScheduled / listTagged / getInsights / getReactions', async () => {
			mockRequest.mockResolvedValue({ data: [] });
			await call('posts', 'listScheduled', { page_id: PAGE_ID });
			expect(lastCall().options.url).toBe(`${PAGE_ID}/scheduled_posts`);

			await call('posts', 'listTagged', { page_id: PAGE_ID });
			expect(lastCall().options.url).toBe(`${PAGE_ID}/tagged`);

			mockRequest.mockResolvedValue({
				data: [{ name: 'post_impressions', values: [{ value: 1 }] }],
			});
			await call('posts', 'getInsights', {
				post_id: POST_ID,
				metric: ['post_impressions'],
			});
			expect(lastCall().options.url).toBe(`${POST_ID}/insights`);
			expect(mockCtx.db.insights.upsertByEntityId).toHaveBeenCalled();

			mockRequest.mockResolvedValue({
				data: [{ id: 'u1', type: 'LIKE', name: 'A' }],
			});
			await call('posts', 'getReactions', { post_id: POST_ID });
			expect(lastCall().options.url).toBe(`${POST_ID}/reactions`);
		});
	});

	describe('comments', () => {
		it('create/list/get/update/delete use page tokens', async () => {
			mockRequest.mockResolvedValue({ id: COMMENT_ID });
			await call('comments', 'create', {
				object_id: POST_ID,
				message: 'nice',
			});
			expect(lastCall()).toMatchObject({
				config: { TOKEN: PAGE_TOKEN },
				options: {
					method: 'POST',
					url: `${POST_ID}/comments`,
					body: { message: 'nice' },
				},
			});

			mockRequest.mockResolvedValue({ data: [{ id: COMMENT_ID }] });
			await call('comments', 'list', { object_id: POST_ID });
			expect(lastCall().config.TOKEN).toBe(PAGE_TOKEN);

			mockRequest.mockResolvedValue({ id: COMMENT_ID, message: 'nice' });
			await call('comments', 'get', {
				comment_id: COMMENT_ID,
				page_id: PAGE_ID,
			});
			expect(lastCall().config.TOKEN).toBe(PAGE_TOKEN);

			mockRequest.mockResolvedValue({ success: true });
			await call('comments', 'update', {
				comment_id: COMMENT_ID,
				page_id: PAGE_ID,
				message: 'edited',
			});
			expect(lastCall().options.body).toEqual({ message: 'edited' });

			await call('comments', 'delete', {
				comment_id: COMMENT_ID,
				page_id: PAGE_ID,
			});
			expect(lastCall().options.method).toBe('DELETE');
		});
	});

	describe('reactions', () => {
		it('add posts LIKE via /likes with a page token', async () => {
			mockRequest.mockResolvedValue({ success: true });
			await call('reactions', 'add', { object_id: POST_ID });
			expect(lastCall()).toMatchObject({
				config: { TOKEN: PAGE_TOKEN },
				options: { method: 'POST', url: `${POST_ID}/likes` },
			});
		});

		it('rejects non-LIKE reaction types', async () => {
			await expect(
				call('reactions', 'add', { object_id: POST_ID, type: 'LOVE' }),
			).rejects.toThrow(/only supports adding LIKE/);
		});

		it('unlike DELETEs /likes with a page token', async () => {
			mockRequest.mockResolvedValue({ success: true });
			await call('reactions', 'unlike', { object_id: POST_ID });
			expect(lastCall()).toMatchObject({
				config: { TOKEN: PAGE_TOKEN },
				options: { method: 'DELETE', url: `${POST_ID}/likes` },
			});
		});
	});

	describe('photos', () => {
		it('upload / createPost / addToAlbum / createAlbum / list use page tokens', async () => {
			mockRequest.mockResolvedValue({ id: 'ph1' });
			await call('photos', 'upload', {
				page_id: PAGE_ID,
				url: 'https://example.com/a.jpg',
			});
			expect(lastCall().options.url).toBe(`${PAGE_ID}/photos`);

			await call('photos', 'createPost', {
				page_id: PAGE_ID,
				url: 'https://example.com/a.jpg',
				scheduled_publish_time: 1700000000,
			});
			expect(lastCall().options.body).toEqual({
				url: 'https://example.com/a.jpg',
				published: false,
				scheduled_publish_time: 1700000000,
			});

			await call('photos', 'addToAlbum', {
				album_id: 'alb1',
				page_id: PAGE_ID,
				url: 'https://example.com/a.jpg',
			});
			expect(lastCall().options.url).toBe('alb1/photos');

			await call('photos', 'createAlbum', {
				page_id: PAGE_ID,
				name: 'Album',
			});
			expect(lastCall().options.url).toBe(`${PAGE_ID}/albums`);

			mockRequest.mockResolvedValue({ data: [{ id: 'ph1', name: 'n' }] });
			await call('photos', 'list', { page_id: PAGE_ID });
			expect(lastCall().options.url).toBe(`${PAGE_ID}/photos`);
		});

		it('uploadBatch authenticates the batch request with a page token', async () => {
			mockRequest.mockResolvedValue([{ code: 200, body: '{"id":"ph1"}' }]);
			await call('photos', 'uploadBatch', {
				page_id: PAGE_ID,
				photos: [{ url: 'https://example.com/a.jpg' }],
			});
			expect(lastCall()).toMatchObject({
				config: { TOKEN: PAGE_TOKEN },
				options: {
					method: 'POST',
					url: '',
					formData: expect.objectContaining({
						batch: expect.stringContaining(`${PAGE_ID}/photos`),
					}),
				},
			});
		});
	});

	describe('videos', () => {
		it('createPost defaults published=false when scheduling', async () => {
			mockRequest.mockResolvedValue({ id: 'v1' });
			await call('videos', 'createPost', {
				page_id: PAGE_ID,
				file_url: 'https://example.com/v.mp4',
				scheduled_publish_time: 1700000000,
			});
			expect(lastCall().options.body).toEqual({
				file_url: 'https://example.com/v.mp4',
				published: false,
				scheduled_publish_time: 1700000000,
			});
		});

		it('list and deprecated upload hit /videos', async () => {
			mockRequest.mockResolvedValue({ data: [{ id: 'v1' }] });
			await call('videos', 'list', { page_id: PAGE_ID });
			expect(lastCall().options.url).toBe(`${PAGE_ID}/videos`);

			mockRequest.mockResolvedValue({ id: 'v2' });
			await call('videos', 'upload', {
				page_id: PAGE_ID,
				file_url: 'https://example.com/v.mp4',
			});
			expect(lastCall().options.url).toBe(`${PAGE_ID}/videos`);
		});
	});

	describe('conversations + messages', () => {
		it('lists conversations and messages with page tokens', async () => {
			mockRequest.mockResolvedValue({ data: [{ id: 'c1' }] });
			await call('conversations', 'list', { page_id: PAGE_ID });
			expect(lastCall().options.url).toBe(`${PAGE_ID}/conversations`);

			mockRequest.mockResolvedValue({ data: [{ id: 'm1', message: 'hi' }] });
			await call('conversations', 'getMessages', {
				page_id: PAGE_ID,
				conversation_id: 'c1',
			});
			expect(lastCall().options.url).toBe('c1/messages');
		});

		it('send / sendMedia / markSeen / toggleTyping use Messenger payload shapes', async () => {
			mockRequest.mockResolvedValue({ recipient_id: 'u1', message_id: 'm1' });
			await call('messages', 'send', {
				page_id: PAGE_ID,
				recipient_id: 'u1',
				message: 'hello',
			});
			expect(lastCall().options.body).toEqual({
				recipient: { id: 'u1' },
				message: { text: 'hello' },
			});

			await call('messages', 'sendMedia', {
				page_id: PAGE_ID,
				recipient_id: 'u1',
				attachment_type: 'image',
				attachment_url: 'https://example.com/a.jpg',
			});
			expect(lastCall().options.body.message).toEqual({
				attachment: {
					type: 'image',
					payload: { url: 'https://example.com/a.jpg', is_reusable: true },
				},
			});

			mockRequest.mockResolvedValue({ recipient_id: 'u1' });
			await call('messages', 'markSeen', {
				page_id: PAGE_ID,
				recipient_id: 'u1',
			});
			expect(lastCall().options.body).toEqual({
				recipient: { id: 'u1' },
				sender_action: 'mark_seen',
			});

			await call('messages', 'toggleTyping', {
				page_id: PAGE_ID,
				recipient_id: 'u1',
				action: 'typing_on',
			});
			expect(lastCall().options.body).toEqual({
				recipient: { id: 'u1' },
				sender_action: 'typing_on',
			});
		});

		it('getDetails fetches a message with a page token', async () => {
			mockRequest.mockResolvedValue({ id: 'm1', message: 'hi' });
			await call('messages', 'getDetails', {
				page_id: PAGE_ID,
				message_id: 'm1',
			});
			expect(lastCall()).toMatchObject({
				config: { TOKEN: PAGE_TOKEN },
				options: { method: 'GET', url: 'm1' },
			});
		});
	});

	describe('error handlers', () => {
		it('matches Graph rate-limit codes', async () => {
			const { FacebookAPIError } = await import('./client');
			const err = new FacebookAPIError('too many', 4);
			expect(errorHandlers.RATE_LIMIT_ERROR.match(err)).toBe(true);
			const result = await errorHandlers.RATE_LIMIT_ERROR.handler(err);
			expect(result.maxRetries).toBe(5);
		});

		it('matches auth and permission errors', async () => {
			const { FacebookAPIError } = await import('./client');
			expect(
				errorHandlers.AUTH_ERROR.match(new FacebookAPIError('bad', 190)),
			).toBe(true);
			expect(
				errorHandlers.PERMISSION_ERROR.match(
					new FacebookAPIError('denied', 10),
				),
			).toBe(true);
		});
	});
});
