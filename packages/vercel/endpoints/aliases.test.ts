import { logEventFromContext } from 'corsair/core';
import { makeAuthenticatedVercelRequest } from '../client';
import type { VercelContext } from '../index';
import { VercelAliasSchema } from '../schema/database';
import {
	assignAlias,
	deleteAlias,
	getAlias,
	getAliases,
	getDeploymentAliases,
} from './aliases';

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

const upsert = jest.fn();
const remove = jest.fn();
const ctx = {
	key: 'test-token',
	options: {},
	db: { aliases: { upsertByEntityId: upsert, deleteByEntityId: remove } },
} as unknown as VercelContext;

// Shape as GET /v4/aliases returns it live, plus a share-link bypass.
const alias = {
	uid: 'a1',
	alias: 'www.example.com',
	created: '2026-11-01T00:00:00.000Z',
	createdAt: 1793500000000,
	updatedAt: 1793500000000,
	deletedAt: null,
	deploymentId: 'dpl_1',
	projectId: 'prj_1',
	redirect: null,
	redirectStatusCode: null,
	creator: { uid: 'u1', username: 'dev', email: 'dev@example.com' },
	deployment: { id: 'dpl_1', url: 'site-abc.vercel.app' },
	protectionBypass: {
		'share-secret-123': {
			createdAt: 1,
			createdBy: 'u1',
			scope: 'shareable-link',
		},
	},
	somethingNew: true,
};

beforeEach(() => {
	jest.clearAllMocks();
});

describe('aliases', () => {
	it('getAliases sends filters, keeps nulls and new fields, stores without bypass secrets', async () => {
		request.mockResolvedValueOnce({
			aliases: [alias],
			pagination: { count: 1, next: 7, prev: null },
		});

		const result = await getAliases(ctx, {
			teamId: 'team_1',
			domain: ['example.com', 'example.org'],
			projectId: 'prj_1',
			limit: 50,
			until: 99,
		});

		expect(request).toHaveBeenCalledWith('/v4/aliases', ctx, {
			teamId: 'team_1',
			query: {
				domain: ['example.com', 'example.org'],
				projectId: 'prj_1',
				limit: 50,
				until: 99,
			},
		});
		expect(result.aliases[0]?.redirect).toBeNull();
		expect(result.aliases[0]?.somethingNew).toBe(true);
		expect(result.pagination?.next).toBe(7);
		const [uid, stored] = upsert.mock.calls[0] ?? [];
		expect(uid).toBe('a1');
		expect(stored).toMatchObject({ uid: 'a1', alias: 'www.example.com' });
		expect(stored).not.toHaveProperty('redirect');
		expect(JSON.stringify(stored)).not.toContain('share-secret-123');
		// Core parses upserts with the entity schema.
		expect(() => VercelAliasSchema.parse(stored)).not.toThrow();
		expect(logEvent).toHaveBeenCalledWith(
			ctx,
			'vercel.aliases.getAliases',
			expect.objectContaining({ projectId: 'prj_1' }),
			'completed',
		);
	});

	it('getAliases rejects more than 20 domains before calling Vercel', async () => {
		await expect(
			getAliases(ctx, {
				domain: Array.from({ length: 21 }, (_, i) => `d${i}.com`),
			}),
		).rejects.toThrow();
		expect(request).not.toHaveBeenCalled();
	});

	it('getAlias encodes the hostname, passes its filters and stores a null createdAt safely', async () => {
		request.mockResolvedValueOnce({ ...alias, createdAt: null });
		const result = await getAlias(ctx, {
			idOrAlias: 'www.example.com/',
			projectId: 'prj_1',
		});
		expect(request).toHaveBeenCalledWith(
			'/v4/aliases/www.example.com%2F',
			ctx,
			{
				teamId: undefined,
				query: { projectId: 'prj_1' },
			},
		);
		expect(result.deployment?.url).toBe('site-abc.vercel.app');
		expect(result.createdAt).toBeNull();
		expect(upsert).toHaveBeenCalledWith(
			'a1',
			expect.objectContaining({ uid: 'a1' }),
		);
		const stored = upsert.mock.calls[0]?.[1];
		expect(stored).not.toHaveProperty('createdAt');
		expect(() => VercelAliasSchema.parse(stored)).not.toThrow();
		expect(() =>
			VercelAliasSchema.parse({ ...alias, createdAt: null }),
		).toThrow();
	});

	it('getAlias rejects a response without a uid', async () => {
		request.mockResolvedValueOnce({ alias: 'www.example.com' });
		await expect(
			getAlias(ctx, { idOrAlias: 'www.example.com' }),
		).rejects.toThrow();
	});

	it('getDeploymentAliases lists the aliases of a deployment without storing them', async () => {
		request.mockResolvedValueOnce({
			aliases: [
				{
					uid: 'a1',
					alias: 'site.vercel.app',
					created: '2026-11-01T00:00:00.000Z',
					redirect: null,
				},
			],
		});
		const result = await getDeploymentAliases(ctx, {
			deploymentId: 'dpl_1',
			teamId: 'team_1',
		});
		expect(request).toHaveBeenCalledWith('/v2/deployments/dpl_1/aliases', ctx, {
			teamId: 'team_1',
		});
		expect(result.aliases[0]?.alias).toBe('site.vercel.app');
		expect(upsert).not.toHaveBeenCalled();
	});

	it('assignAlias posts the alias and stores the deployment it now points at', async () => {
		request.mockResolvedValueOnce({
			uid: 'a2',
			alias: 'www.example.com',
			created: '2026-11-15T00:00:00.000Z',
			oldDeploymentId: 'dpl_0',
		});
		const result = await assignAlias(ctx, {
			deploymentId: 'dpl_1',
			alias: 'www.example.com',
			redirect: null,
			teamId: 'team_1',
		});
		expect(request).toHaveBeenCalledWith('/v2/deployments/dpl_1/aliases', ctx, {
			method: 'POST',
			teamId: 'team_1',
			body: { alias: 'www.example.com', redirect: null },
		});
		expect(result.oldDeploymentId).toBe('dpl_0');
		expect(upsert).toHaveBeenCalledWith(
			'a2',
			expect.objectContaining({ uid: 'a2', deploymentId: 'dpl_1' }),
		);
	});

	it('assignAlias from a hostname does not guess the deployment id', async () => {
		request.mockResolvedValueOnce({
			uid: 'a3',
			alias: 'x.example.com',
			created: 'c',
		});
		await assignAlias(ctx, {
			deploymentId: 'site-abc.vercel.app',
			alias: 'x.example.com',
		});
		expect(request).toHaveBeenCalledWith(
			'/v2/deployments/site-abc.vercel.app/aliases',
			ctx,
			{ method: 'POST', teamId: undefined, body: { alias: 'x.example.com' } },
		);
		expect(upsert.mock.calls[0]?.[1]).not.toHaveProperty('deploymentId');
	});

	it('assignAlias rejects a missing alias before calling Vercel', async () => {
		await expect(
			assignAlias(ctx, { deploymentId: 'dpl_1' } as Parameters<
				typeof assignAlias
			>[1]),
		).rejects.toThrow();
		expect(request).not.toHaveBeenCalled();
	});

	it('deleteAlias by id removes it and clears the local record', async () => {
		request.mockResolvedValueOnce({ status: 'SUCCESS' });
		await expect(
			deleteAlias(ctx, { aliasId: 'a1', teamId: 'team_1' }),
		).resolves.toEqual({
			deleted: true,
			aliasId: 'a1',
			status: 'SUCCESS',
		});
		expect(request).toHaveBeenCalledWith('/v2/aliases/a1', ctx, {
			method: 'DELETE',
			teamId: 'team_1',
		});
		expect(remove).toHaveBeenCalledWith('a1');
	});
});

describe('deleteAlias by hostname', () => {
	beforeEach(() => jest.clearAllMocks());

	it('looks up the alias id first so the local record is cleared too', async () => {
		request
			.mockResolvedValueOnce({ uid: 'als_9', alias: 'www.example.com' })
			.mockResolvedValueOnce({ status: 'SUCCESS' });
		const result = await deleteAlias(ctx, { aliasId: 'www.example.com' });
		expect(request).toHaveBeenNthCalledWith(
			1,
			'/v4/aliases/www.example.com',
			ctx,
			{
				teamId: undefined,
			},
		);
		expect(request).toHaveBeenNthCalledWith(
			2,
			'/v2/aliases/www.example.com',
			ctx,
			{ method: 'DELETE', teamId: undefined },
		);
		expect(remove).toHaveBeenCalledWith('als_9');
		expect(result.deleted).toBe(true);
	});
});
