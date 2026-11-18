import { logEventFromContext } from 'corsair/core';
import { makeAuthenticatedVercelRequest } from '../client';
import type { VercelContext } from '../index';
import {
	getEdgeConfig,
	getEdgeConfigItem,
	getEdgeConfigItems,
	getEdgeConfigs,
	updateEdgeConfigItems,
} from './edge-config';

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

const config = {
	id: 'ecfg_1',
	slug: 'flags',
	ownerId: 'team_1',
	digest: 'abc',
	itemCount: 2,
	sizeInBytes: 40,
	createdAt: 1,
	updatedAt: 2,
	createdBy: null,
	transfer: { fromAccountId: 'x' },
};

const item = (key: string, value: unknown) => ({
	key,
	value,
	edgeConfigId: 'ecfg_1',
	createdAt: 1,
	updatedAt: 2,
});

beforeEach(() => {
	jest.clearAllMocks();
});

describe('edgeConfig', () => {
	it('getEdgeConfigs lists Global Configs and keeps new fields', async () => {
		request.mockResolvedValueOnce([config]);
		const result = await getEdgeConfigs(ctx, { teamId: 'team_1' });
		expect(request).toHaveBeenCalledWith('/v1/global-config', ctx, {
			teamId: 'team_1',
		});
		expect(result[0]?.transfer).toEqual({ fromAccountId: 'x' });
		expect(result[0]?.createdBy).toBeNull();
		expect(logEvent).toHaveBeenCalledWith(
			ctx,
			'vercel.edgeConfig.getEdgeConfigs',
			{ teamId: 'team_1' },
			'completed',
		);
	});

	it('getEdgeConfig reads one by id and rejects a response without an id', async () => {
		request.mockResolvedValueOnce(config);
		const result = await getEdgeConfig(ctx, { edgeConfigId: 'ecfg_1' });
		expect(request).toHaveBeenCalledWith('/v1/global-config/ecfg_1', ctx, {
			teamId: undefined,
		});
		expect(result.itemCount).toBe(2);

		request.mockResolvedValueOnce({ slug: 'flags' });
		await expect(
			getEdgeConfig(ctx, { edgeConfigId: 'ecfg_1' }),
		).rejects.toThrow();
	});

	it('getEdgeConfigItems returns any JSON value, null included', async () => {
		request.mockResolvedValueOnce([
			item('greeting', 'hello'),
			item('limits', { max: 5, tiers: [1, 2] }),
			item('enabled', true),
			item('cleared', null),
		]);
		const result = await getEdgeConfigItems(ctx, {
			edgeConfigId: 'ecfg_1',
			teamId: 'team_1',
		});
		expect(request).toHaveBeenCalledWith(
			'/v1/global-config/ecfg_1/items',
			ctx,
			{
				teamId: 'team_1',
			},
		);
		expect(result.map((i) => i.value)).toEqual([
			'hello',
			{ max: 5, tiers: [1, 2] },
			true,
			null,
		]);
	});

	it('getEdgeConfigItem returns the item when it exists', async () => {
		request.mockResolvedValueOnce({
			...item('greeting', 'hello'),
			description: null,
		});
		const result = await getEdgeConfigItem(ctx, {
			edgeConfigId: 'ecfg_1',
			key: 'greeting',
		});
		expect(request).toHaveBeenCalledWith(
			'/v1/global-config/ecfg_1/item/greeting',
			ctx,
			{ teamId: undefined },
		);
		expect(result).toEqual({
			found: true,
			item: expect.objectContaining({ key: 'greeting', value: 'hello' }),
		});
	});

	it('getEdgeConfigItem reports a missing key (204, no body) as not found', async () => {
		request.mockResolvedValueOnce(undefined);
		const result = await getEdgeConfigItem(ctx, {
			edgeConfigId: 'ecfg_1',
			key: 'odd key',
		});
		expect(request).toHaveBeenCalledWith(
			'/v1/global-config/ecfg_1/item/odd%20key',
			ctx,
			{ teamId: undefined },
		);
		expect(result).toEqual({ found: false, item: null });
	});

	it('updateEdgeConfigItems patches the batch and logs keys, not values', async () => {
		request.mockResolvedValueOnce({ status: 'ok' });
		const result = await updateEdgeConfigItems(ctx, {
			edgeConfigId: 'ecfg_1',
			teamId: 'team_1',
			items: [
				{
					operation: 'create',
					key: 'new_flag',
					value: { rollout: 'private-value' },
				},
				{ operation: 'update', key: 'greeting', description: 'shown on home' },
				{ operation: 'upsert', key: 'count', value: 0 },
				{ operation: 'create', key: 'nothing', value: null },
				{ operation: 'delete', key: 'old-flag' },
			],
		});
		expect(request).toHaveBeenCalledWith(
			'/v1/global-config/ecfg_1/items',
			ctx,
			{
				method: 'PATCH',
				teamId: 'team_1',
				body: {
					items: [
						{
							operation: 'create',
							key: 'new_flag',
							value: { rollout: 'private-value' },
						},
						{
							operation: 'update',
							key: 'greeting',
							description: 'shown on home',
						},
						{ operation: 'upsert', key: 'count', value: 0 },
						{ operation: 'create', key: 'nothing', value: null },
						{ operation: 'delete', key: 'old-flag' },
					],
				},
			},
		);
		expect(result.status).toBe('ok');
		const logged = JSON.stringify(logEvent.mock.calls[0]?.[2]);
		expect(logged).toContain('new_flag');
		expect(logged).toContain('old-flag');
		expect(logged).not.toContain('private-value');
		expect(logged).not.toContain('shown on home');
	});

	it.each([
		['a create without a value', [{ operation: 'create', key: 'a' }]],
		[
			'an update with neither value nor description',
			[{ operation: 'update', key: 'a' }],
		],
		['a key with a dot', [{ operation: 'delete', key: 'a.b' }]],
		['an unknown operation', [{ operation: 'rename', key: 'a' }]],
		['an empty batch', []],
	])(
		'updateEdgeConfigItems rejects %s before calling Vercel',
		async (_label, items) => {
			await expect(
				updateEdgeConfigItems(ctx, {
					edgeConfigId: 'ecfg_1',
					items,
				} as unknown as Parameters<typeof updateEdgeConfigItems>[1]),
			).rejects.toThrow();
			expect(request).not.toHaveBeenCalled();
		},
	);
});
