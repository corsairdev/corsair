import { logEventFromContext } from 'corsair/core';
import { makeAuthenticatedVercelRequest } from '../client';
import type { VercelContext } from '../index';
import {
	createWebhook,
	deleteWebhook,
	getWebhook,
	getWebhooks,
} from './webhooks';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(),
}));

jest.mock('../client', () => ({
	...jest.requireActual('../client'),
	makeAuthenticatedVercelRequest: jest.fn(),
}));

const request = makeAuthenticatedVercelRequest as jest.MockedFunction<
	typeof makeAuthenticatedVercelRequest
>;
const logEvent = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

const ctx = {
	key: 'test-token',
	options: {},
	db: {},
} as unknown as VercelContext;

const hook = {
	id: 'hook_1',
	url: 'https://example.com/vercel',
	events: ['deployment.succeeded', 'some.future-event'],
	ownerId: 'team_1',
	projectIds: ['prj_1'],
	createdAt: 1,
	updatedAt: 2,
	projectsMetadata: null,
	somethingNew: 'kept',
};

beforeEach(() => {
	jest.clearAllMocks();
});

describe('webhooks', () => {
	it('getWebhooks filters by project and returns the bare list', async () => {
		request.mockResolvedValueOnce([hook]);
		const result = await getWebhooks(ctx, {
			projectId: 'prj_1',
			teamId: 'team_1',
		});
		expect(request).toHaveBeenCalledWith('/v1/webhooks', ctx, {
			teamId: 'team_1',
			query: { projectId: 'prj_1' },
		});
		expect(result[0]?.events).toContain('some.future-event');
		expect(result[0]?.somethingNew).toBe('kept');
		expect(logEvent).toHaveBeenCalledWith(
			ctx,
			'vercel.webhooks.getWebhooks',
			expect.objectContaining({ projectId: 'prj_1' }),
			'completed',
		);
	});

	it('getWebhooks accepts an empty list', async () => {
		request.mockResolvedValueOnce([]);
		await expect(getWebhooks(ctx, {})).resolves.toEqual([]);
		expect(request).toHaveBeenCalledWith('/v1/webhooks', ctx, {
			teamId: undefined,
			query: {},
		});
	});

	it('getWebhook encodes the id and rejects a response without one', async () => {
		request.mockResolvedValueOnce({ ...hook, url: null });
		const result = await getWebhook(ctx, { id: 'hook/1' });
		expect(request).toHaveBeenCalledWith('/v1/webhooks/hook%2F1', ctx, {
			teamId: undefined,
		});
		expect(result.url).toBeNull();

		request.mockResolvedValueOnce({ url: 'https://example.com' });
		await expect(getWebhook(ctx, { id: 'hook_1' })).rejects.toThrow();
	});

	it('createWebhook posts the subscription and returns the signing secret without logging it', async () => {
		request.mockResolvedValueOnce({ ...hook, secret: 'whsec-signing-secret' });
		const result = await createWebhook(ctx, {
			teamId: 'team_1',
			url: 'https://example.com/vercel?token=receiver-token',
			events: ['deployment.succeeded', 'some.future-event'],
			projectIds: ['prj_1'],
		});
		expect(request).toHaveBeenCalledWith('/v1/webhooks', ctx, {
			method: 'POST',
			teamId: 'team_1',
			body: {
				url: 'https://example.com/vercel?token=receiver-token',
				events: ['deployment.succeeded', 'some.future-event'],
				projectIds: ['prj_1'],
			},
		});
		expect(result.secret).toBe('whsec-signing-secret');
		expect(result.somethingNew).toBe('kept');
		const logged = JSON.stringify(logEvent.mock.calls[0]?.[2]);
		expect(logged).toContain('https://example.com/vercel');
		expect(logged).toContain('deployment.succeeded');
		expect(logged).not.toContain('receiver-token');
		expect(logged).not.toContain('whsec-signing-secret');
	});

	it.each([
		[
			'a non-HTTP URL',
			{ url: 'ftp://example.com', events: ['deployment.created'] },
		],
		['no events', { url: 'https://example.com', events: [] }],
		[
			'a project name instead of an id',
			{
				url: 'https://example.com',
				events: ['project.created'],
				projectIds: ['my-site'],
			},
		],
	])(
		'createWebhook rejects %s before calling Vercel',
		async (_label, fields) => {
			await expect(
				createWebhook(ctx, fields as Parameters<typeof createWebhook>[1]),
			).rejects.toThrow();
			expect(request).not.toHaveBeenCalled();
		},
	);

	it('deleteWebhook reports the deletion after a 204', async () => {
		request.mockResolvedValueOnce(undefined);
		await expect(
			deleteWebhook(ctx, { id: 'hook_1', teamId: 'team_1' }),
		).resolves.toEqual({
			deleted: true,
			id: 'hook_1',
		});
		expect(request).toHaveBeenCalledWith('/v1/webhooks/hook_1', ctx, {
			method: 'DELETE',
			teamId: 'team_1',
		});
	});
});
