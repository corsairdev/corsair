import * as client from './client';
import { PostizAPIError } from './client';
import { Insights, Integrations, Posts } from './endpoints';
import { buildContext, captureError } from './test-helpers';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return { ...actual, makePostizRequest: jest.fn() };
});

const mockedRequest = jest.mocked(client.makePostizRequest);

const ctx = buildContext();

const integrationId = 'cm4ean69r0003w8w1cdomox9n';

beforeEach(() => {
	mockedRequest.mockReset();
});

describe('response parsing', () => {
	it('accepts a field Postiz adds and keeps it on the result', async () => {
		mockedRequest.mockResolvedValue([
			{ id: 'i1', identifier: 'x', brand_new_field: 'v' },
		]);

		const result = await Integrations.list(ctx, {});

		expect(result.integrations[0]).toMatchObject({ brand_new_field: 'v' });
	});

	it('rejects a list whose body is not an array', async () => {
		mockedRequest.mockResolvedValue({ integrations: [] });

		await expect(Integrations.list(ctx, {})).rejects.toThrow();
	});

	it('accepts an empty integration list, which a fresh workspace returns', async () => {
		mockedRequest.mockResolvedValue([]);

		const result = await Integrations.list(ctx, {});

		expect(result.integrations).toEqual([]);
	});

	it('keeps a null error on a post that did not fail', async () => {
		mockedRequest.mockResolvedValue({
			posts: [{ id: 'p1', state: 'QUEUE', error: null }],
		});

		const result = await Posts.list(ctx, {
			startDate: '2024-12-01T00:00:00.000Z',
			endDate: '2024-12-31T00:00:00.000Z',
		});

		expect(result.posts[0]?.error).toBeNull();
	});

	it('keeps the platform rejection message on an ERROR post', async () => {
		mockedRequest.mockResolvedValue({
			posts: [
				{
					id: 'p1',
					state: 'ERROR',
					error: 'Account banned from posting',
				},
			],
		});

		const result = await Posts.list(ctx, {
			startDate: '2024-12-01T00:00:00.000Z',
			endDate: '2024-12-31T00:00:00.000Z',
		});

		expect(result.posts[0]?.error).toBe('Account banned from posting');
	});

	it('accepts a post state the schema has not seen, so a new one cannot fail a read', async () => {
		mockedRequest.mockResolvedValue({
			posts: [{ id: 'p1', state: 'SOMETHING_NEW' }],
		});

		const result = await Posts.list(ctx, {
			startDate: '2024-12-01T00:00:00.000Z',
			endDate: '2024-12-31T00:00:00.000Z',
		});

		expect(result.posts[0]?.state).toBe('SOMETHING_NEW');
	});

	it('rejects a post whose state is a number rather than a string', async () => {
		mockedRequest.mockResolvedValue({ posts: [{ id: 'p1', state: 1 }] });

		await expect(
			Posts.list(ctx, {
				startDate: '2024-12-01T00:00:00.000Z',
				endDate: '2024-12-31T00:00:00.000Z',
			}),
		).rejects.toThrow();
	});

	it('rejects a media page that is not the `{ pages, results }` envelope', async () => {
		mockedRequest.mockResolvedValue([]);

		await expect(Insights.list(ctx, {})).rejects.toThrow();
	});

	it('rejects a notification whose id is not a string', async () => {
		mockedRequest.mockResolvedValue({
			notifications: [{ id: 42, content: 'hi' }],
		});

		await expect(Insights.notifications(ctx, {})).rejects.toThrow();
	});

	it('accepts an analytics row whose platform reports no percentage change', async () => {
		mockedRequest.mockResolvedValue([
			{ label: 'Followers', data: [{ total: 1, date: '2025-01-01' }] },
		]);

		const result = await Insights.analytics(ctx, {
			integration: integrationId,
			date: '30',
		});

		expect(result.analytics[0]?.percentageChange).toBeUndefined();
	});

	it('rejects an analytics body that is not an array of rows', async () => {
		mockedRequest.mockResolvedValue({ analytics: [] });

		await expect(
			Insights.analytics(ctx, {
				integration: integrationId,
				date: '30',
			}),
		).rejects.toThrow();
	});

	it('rejects a period that is not a number of days', async () => {
		await expect(
			Insights.analytics(ctx, {
				integration: integrationId,
				date: 'last_30_days',
			}),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('input validation before the request', () => {
	it('rejects a schedule with no posts, which would publish nothing', async () => {
		await expect(
			Posts.create(ctx, {
				type: 'schedule',
				date: '2024-12-14T10:00:00.000Z',
				shortLink: false,
				tags: [],
			}),
		).rejects.toThrow(/at least one post/);
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rejects an immediate post with no posts', async () => {
		await expect(
			Posts.create(ctx, {
				type: 'now',
				date: '2024-12-14T10:00:00.000Z',
				shortLink: false,
				tags: [],
			}),
		).rejects.toThrow(/at least one post/);
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('accepts a draft with no posts', async () => {
		mockedRequest.mockResolvedValue([]);

		await expect(
			Posts.create(ctx, {
				type: 'draft',
				date: '2024-12-14T10:00:00.000Z',
				shortLink: false,
				tags: [],
			}),
		).resolves.toBeDefined();
	});

	it('rejects an empty value array on a post item', async () => {
		await expect(
			Posts.create(ctx, {
				type: 'now',
				date: '2024-12-14T10:00:00.000Z',
				shortLink: false,
				tags: [],
				posts: [{ integration: { id: integrationId }, value: [] }],
			}),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rejects a post type outside the documented three', async () => {
		await expect(
			Posts.create(ctx, {
				type: 'later' as never,
				date: '2024-12-14T10:00:00.000Z',
				shortLink: false,
				tags: [],
			}),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rejects a reversed date window, which would silently return nothing', async () => {
		await expect(
			Posts.list(ctx, {
				startDate: '2024-12-31T00:00:00.000Z',
				endDate: '2024-12-01T00:00:00.000Z',
			}),
		).rejects.toThrow(/must not be after/);
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('accepts a window whose bounds are equal', async () => {
		mockedRequest.mockResolvedValue({ posts: [] });

		await expect(
			Posts.list(ctx, {
				startDate: '2024-12-01T00:00:00.000Z',
				endDate: '2024-12-01T00:00:00.000Z',
			}),
		).resolves.toBeDefined();
	});

	it('rejects a change-status target outside draft and schedule', async () => {
		await expect(
			Posts.changeStatus(ctx, { id: 'p1', status: 'published' as never }),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rejects an empty id rather than sending a blank path segment', async () => {
		await expect(Posts.remove(ctx, { id: '' })).rejects.toThrow();
		await expect(Integrations.findSlot(ctx, { id: '' })).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it("rejects a page below each route's first page", async () => {
		// Media pages start at 1 and notification pages at 0.
		await expect(Insights.list(ctx, { page: 0 })).rejects.toThrow();
		await expect(Insights.notifications(ctx, { page: -1 })).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('surfaces a Postiz rejection as an error a handler can match', async () => {
		mockedRequest.mockRejectedValue(
			new PostizAPIError('fetch failed', { method: 'GET', transport: true }),
		);

		const error = await captureError(Integrations.list(ctx, {}));

		expect(error).toBeInstanceOf(PostizAPIError);
		expect(error).toMatchObject({ method: 'GET', transport: true });
	});
});
