import { logEventFromContext } from 'corsair/core';
import * as client from './client';
import { Insights, Integrations, Posts } from './endpoints';
import { buildContext } from './test-helpers';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return { ...actual, makePostizRequest: jest.fn() };
});

const mockedRequest = jest.mocked(client.makePostizRequest);
const mockedLog = jest.mocked(logEventFromContext);

const ctx = buildContext();

/** The request the endpoint handed the client. */
function sentRequest(index = -1) {
	const call = mockedRequest.mock.calls.at(index);
	if (!call) throw new Error('no request was sent');
	return call[1];
}

const integration = {
	id: 'cm4ean69r0003w8w1cdomox9n',
	name: 'Nevo David',
	identifier: 'x',
	picture: 'https://uploads.postiz.com/avatar.jpg',
	disabled: false,
	profile: 'nevodavid',
};

const post = {
	id: 'post_1',
	content: 'Hello world!',
	state: 'QUEUE',
	publishDate: '2024-12-14T10:00:00.000Z',
	integration: { id: 'cm4ean69r0003w8w1cdomox9n', providerIdentifier: 'x' },
};

beforeEach(() => {
	mockedRequest.mockReset();
	mockedLog.mockReset();
});

describe('integrations endpoints', () => {
	it('integrations.list wraps the bare array the route answers with', async () => {
		mockedRequest.mockResolvedValue([integration]);

		const result = await Integrations.list(ctx, {});

		expect(sentRequest()).toEqual({
			method: 'GET',
			path: '/integrations',
			query: { group: undefined },
		});
		expect(result.integrations).toHaveLength(1);
		expect(result.integrations[0]?.identifier).toBe('x');
		expect(mockedLog).toHaveBeenCalledWith(
			ctx,
			'postiz.integrations.list',
			{ count: 1 },
			'completed',
		);
	});

	it('integrations.list filters by customer group', async () => {
		mockedRequest.mockResolvedValue([]);

		await Integrations.list(ctx, { group: 'customer-1' });

		expect(sentRequest()?.query).toEqual({ group: 'customer-1' });
	});

	it('integrations.isConnected reads the connection check', async () => {
		mockedRequest.mockResolvedValue({ connected: true });

		const result = await Integrations.isConnected(ctx, {});

		expect(sentRequest()).toEqual({ method: 'GET', path: '/is-connected' });
		expect(result.connected).toBe(true);
	});

	it('integrations.findSlot reads the next free slot', async () => {
		mockedRequest.mockResolvedValue({ date: '2025-01-15T10:00:00.000Z' });

		const result = await Integrations.findSlot(ctx, { id: integration.id });

		expect(sentRequest()).toEqual({
			method: 'GET',
			path: `/find-slot/${integration.id}`,
		});
		expect(result.date).toBe('2025-01-15T10:00:00.000Z');
	});
});

describe('posts endpoints', () => {
	it('posts.list sends the date window and an optional customer', async () => {
		mockedRequest.mockResolvedValue({ posts: [post] });

		const result = await Posts.list(ctx, {
			startDate: '2024-12-01T00:00:00.000Z',
			endDate: '2024-12-31T23:59:59.000Z',
			customer: 'customer-1',
		});

		expect(sentRequest()).toEqual({
			method: 'GET',
			path: '/posts',
			query: {
				startDate: '2024-12-01T00:00:00.000Z',
				endDate: '2024-12-31T23:59:59.000Z',
				customer: 'customer-1',
			},
		});
		expect(result.posts[0]?.state).toBe('QUEUE');
	});

	it('posts.create sends the documented body for a scheduled post', async () => {
		mockedRequest.mockResolvedValue({ posts: [post] });

		await Posts.create(ctx, {
			type: 'schedule',
			date: '2024-12-14T10:00:00.000Z',
			shortLink: false,
			tags: [],
			posts: [
				{
					integration: { id: integration.id },
					value: [{ content: 'Hello from the Postiz API!', image: [] }],
					settings: { __type: 'x', who_can_reply_post: 'everyone' },
				},
			],
		});

		expect(sentRequest()).toEqual({
			method: 'POST',
			path: '/posts',
			body: {
				type: 'schedule',
				date: '2024-12-14T10:00:00.000Z',
				shortLink: false,
				tags: [],
				posts: [
					{
						integration: { id: integration.id },
						value: [{ content: 'Hello from the Postiz API!', image: [] }],
						settings: { __type: 'x', who_can_reply_post: 'everyone' },
					},
				],
				inter: undefined,
			},
		});
	});

	it('posts.create sends a draft with no posts attached', async () => {
		mockedRequest.mockResolvedValue({ posts: [] });

		await Posts.create(ctx, {
			type: 'draft',
			date: '2024-12-14T10:00:00.000Z',
			shortLink: false,
			tags: [{ value: 'launch', label: 'Launch' }],
		});

		const request = sentRequest();
		expect(request?.body).toMatchObject({ type: 'draft', posts: undefined });
	});

	it('posts.create sends a thread as several parts in order', async () => {
		mockedRequest.mockResolvedValue({ posts: [post] });

		await Posts.create(ctx, {
			type: 'now',
			date: '2024-12-14T10:00:00.000Z',
			shortLink: false,
			tags: [],
			inter: 5,
			posts: [
				{
					integration: { id: integration.id },
					value: [
						{ content: 'Part one' },
						{ content: 'Part two' },
						{ content: 'Part three' },
					],
				},
			],
		});

		// The body is the request's own JSON, so its shape is read here directly.
		const body = sentRequest()?.body as {
			inter?: number;
			posts: { value: { content: string }[] }[];
		};
		expect(body.inter).toBe(5);
		expect(body.posts).toHaveLength(1);
		// Three parts in order is what makes it a thread.
		expect(body.posts[0]?.value.map((part) => part.content)).toEqual([
			'Part one',
			'Part two',
			'Part three',
		]);
	});

	it('posts.delete removes by path', async () => {
		mockedRequest.mockResolvedValue({ id: 'post_1' });

		const result = await Posts.remove(ctx, { id: 'post_1' });

		expect(sentRequest()).toEqual({ method: 'DELETE', path: '/posts/post_1' });
		expect(result.id).toBe('post_1');
	});

	it('posts.changeStatus puts the target status', async () => {
		mockedRequest.mockResolvedValue({ id: 'post_1', state: 'DRAFT' });

		const result = await Posts.changeStatus(ctx, {
			id: 'post_1',
			status: 'draft',
		});

		expect(sentRequest()).toEqual({
			method: 'PUT',
			path: '/posts/post_1/status',
			body: { status: 'draft' },
		});
		expect(result.state).toBe('DRAFT');
	});
});

describe('insights endpoints', () => {
	it('media.list pages the media library', async () => {
		mockedRequest.mockResolvedValue([
			{
				id: 'media_1',
				name: 'photo.jpg',
				path: 'https://uploads.postiz.com/p.jpg',
			},
		]);

		const result = await Insights.list(ctx, { page: 1 });

		// The route answers a bare array.
		expect(sentRequest()).toEqual({
			method: 'GET',
			path: '/media',
			query: { page: 1 },
		});
		expect(result.media).toHaveLength(1);
	});

	it('notifications.list pages the notifications', async () => {
		mockedRequest.mockResolvedValue([
			{ id: 'n1', content: 'Your post to X was published' },
		]);

		const result = await Insights.notifications(ctx, { page: 1 });

		expect(sentRequest()).toEqual({
			method: 'GET',
			path: '/notifications',
			query: { page: 1 },
		});
		expect(result.notifications).toHaveLength(1);
	});

	it('analytics.platform reads one channel over a period', async () => {
		mockedRequest.mockResolvedValue([
			{ label: 'Followers', percentageChange: 2.5, data: [10, 12, 15] },
		]);

		const result = await Insights.analytics(ctx, {
			integration: integration.id,
			date: 'last_30_days',
		});

		expect(sentRequest()).toEqual({
			method: 'GET',
			path: `/analytics/${integration.id}`,
			query: { date: 'last_30_days' },
		});
		expect(result.analytics).toHaveLength(1);
		expect(result.analytics[0]?.data).toEqual([10, 12, 15]);
	});
});
