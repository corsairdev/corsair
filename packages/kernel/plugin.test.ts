import { AuthMissingError } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { resolveManagedPricingApiKey } from 'corsair/hub';
import { kernelEndpointMeta } from './endpoints/catalog';
import { kernelOperations } from './endpoints/manifest';
import { errorHandlers } from './error-handlers';
import { kernel } from './index';

jest.mock('corsair/hub', () => {
	const actual = jest.requireActual('corsair/hub');
	return {
		...actual,
		resolveManagedPricingApiKey: jest.fn(() => Promise.resolve('sk_managed')),
	};
});

// `unknown` because each case gives the key builder only the context fields it reads.
type KeyBuilder = (
	ctx: unknown,
	source: 'endpoint' | 'webhook',
) => Promise<string>;

function keyBuilderOf(plugin: ReturnType<typeof kernel>): KeyBuilder {
	return plugin.keyBuilder as unknown as KeyBuilder;
}

// `unknown` because each case sets only the fields the key builder reads.
function keyContext(fields: Record<string, unknown>): unknown {
	return fields;
}

function apiError(status: number): ApiError {
	return new ApiError(
		{ method: 'GET', url: '/browsers' },
		{ url: '/browsers', ok: false, status, statusText: 'x', body: {} },
		`Kernel ${status}`,
	);
}

describe('kernel plugin', () => {
	it('registers as kernel with every operation in the tree and its meta', () => {
		const plugin = kernel();
		expect(plugin.id).toBe('kernel');
		expect(Object.keys(plugin.endpointMeta ?? {}).sort()).toEqual(
			kernelOperations.map((operation) => operation.id).sort(),
		);
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
	});

	it('uses the key passed in options', async () => {
		const plugin = kernel({ key: 'sk_option' });
		await expect(
			keyBuilderOf(plugin)(keyContext({ authType: 'api_key' }), 'endpoint'),
		).resolves.toBe('sk_option');
	});

	it('reads the stored key, and asks the tenant to connect when there is none', async () => {
		const plugin = kernel();
		await expect(
			keyBuilderOf(plugin)(
				keyContext({
					authType: 'api_key',
					keys: { get_api_key: () => Promise.resolve('sk_stored') },
				}),
				'endpoint',
			),
		).resolves.toBe('sk_stored');
		await expect(
			keyBuilderOf(plugin)(
				keyContext({
					authType: 'api_key',
					keys: { get_api_key: () => Promise.resolve(null) },
				}),
				'endpoint',
			),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('gets a metered key from Hub under managed_pricing, per operation', async () => {
		const plugin = kernel({ authType: 'managed_pricing' });
		const ctx = keyContext({
			authType: 'managed_pricing',
			meteredOperationId: 'browsers.create',
			tenantId: 't1',
		});
		await expect(keyBuilderOf(plugin)(ctx, 'endpoint')).resolves.toBe(
			'sk_managed',
		);
		expect(resolveManagedPricingApiKey).toHaveBeenCalledWith(
			ctx,
			expect.objectContaining({
				plugin: 'kernel',
				operation: 'browsers.create',
			}),
		);
	});

	it('has no webhook secret to build', async () => {
		await expect(
			keyBuilderOf(kernel())(keyContext({ authType: 'api_key' }), 'webhook'),
		).resolves.toBe('');
	});

	it('keeps DEFAULT last so a caller handler is reached', () => {
		const custom = {
			match: () => true,
			handler: async () => ({ maxRetries: 1 }),
		};
		const handlers = kernel({
			errorHandlers: { CUSTOM: custom },
		}).errorHandlers;
		const keys = Object.keys(handlers ?? {});
		expect(keys[keys.length - 1]).toBe('DEFAULT');
		expect(keys).toContain('CUSTOM');
	});
});

describe('error handlers', () => {
	it.each([
		[429, 'RATE_LIMIT_ERROR'],
		[401, 'AUTH_ERROR'],
		[403, 'AUTH_ERROR'],
		[404, 'NOT_FOUND_ERROR'],
		[400, 'BAD_REQUEST_ERROR'],
		[409, 'BAD_REQUEST_ERROR'],
		[422, 'BAD_REQUEST_ERROR'],
		[500, 'SERVER_ERROR'],
		[503, 'SERVER_ERROR'],
	])(
		'routes HTTP %i to %s, which does not retry again',
		async (status, name) => {
			const error = apiError(status);
			const matched = Object.entries(errorHandlers).find(([, handler]) =>
				handler.match(error),
			);
			expect(matched?.[0]).toBe(name);
			await expect(matched?.[1].handler()).resolves.toEqual({
				maxRetries: 0,
			});
		},
	);

	it('falls back to the message when an error lost its status', () => {
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(new Error('Too Many Requests')),
		).toBe(true);
		expect(
			errorHandlers.NOT_FOUND_ERROR.match(new Error('browser not found')),
		).toBe(true);
		expect(errorHandlers.DEFAULT.match()).toBe(true);
	});
});

describe('risk levels (PLUGIN_PR_RULES R8)', () => {
	const meta = kernelEndpointMeta as Record<
		string,
		{ riskLevel: string; irreversible?: boolean; description?: string }
	>;

	it('marks every delete and the key and payment operations destructive', () => {
		for (const operation of kernelOperations) {
			const entry = meta[operation.id];
			if (
				operation.method === 'DELETE' &&
				operation.id !== 'browsers.fs.watch.stop'
			) {
				expect([operation.id, entry?.riskLevel]).toEqual([
					operation.id,
					'destructive',
				]);
				expect(entry?.irreversible).toBe(true);
			}
		}
		for (const id of [
			'apiKeys.create',
			'apiKeys.rotate',
			'vaults.items.performOperation',
			'browsers.fs.deleteFile',
		]) {
			expect(meta[id]?.riskLevel).toBe('destructive');
		}
	});

	it('marks every GET a read and every description agent-readable', () => {
		for (const operation of kernelOperations) {
			const entry = meta[operation.id];
			if (operation.method === 'GET') expect(entry?.riskLevel).toBe('read');
			expect(entry?.description?.length ?? 0).toBeGreaterThan(8);
		}
	});

	it('tells an agent how a browser bills and how a person takes over', () => {
		expect(meta['browsers.create']?.description).toMatch(/8x/);
		expect(meta['browsers.create']?.description).toMatch(/browsers\.delete/);
		expect(meta['browsers.liveView.create']?.description).toMatch(/take over/);
		expect(meta['browsers.playwright.execute']?.description).toMatch(
			/simplest way/,
		);
	});
});
