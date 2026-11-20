import { AuthMissingError } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { tailscaleEndpointMeta } from './endpoints/catalog';
import { tailscaleOperations } from './endpoints/manifest';
import { errorHandlers } from './error-handlers';
import { tailscale } from './index';

// `unknown` because each case gives the key builder only the context fields it reads.
type KeyBuilder = (
	ctx: unknown,
	source: 'endpoint' | 'webhook',
) => Promise<string>;

function keyBuilderOf(plugin: ReturnType<typeof tailscale>): KeyBuilder {
	return plugin.keyBuilder as unknown as KeyBuilder;
}

// `unknown` because each case sets only the fields the key builder reads.
function keyContext(fields: Record<string, unknown>): unknown {
	return fields;
}

function apiError(status: number): ApiError {
	return new ApiError(
		{ method: 'GET', url: '/tailnet/{tailnet}/devices' },
		{ url: '/tailnet/-/devices', ok: false, status, statusText: 'x', body: {} },
		`Tailscale ${status}`,
	);
}

describe('tailscale plugin', () => {
	it('registers as tailscale with every operation in the tree and its meta', () => {
		const plugin = tailscale();
		expect(plugin.id).toBe('tailscale');
		expect(Object.keys(plugin.endpointMeta ?? {}).sort()).toEqual(
			tailscaleOperations.map((operation) => operation.id).sort(),
		);
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(plugin.endpoints?.policyFile.set).toEqual(expect.any(Function));
		expect(plugin.endpoints?.devices.postureAttributes.set).toEqual(
			expect.any(Function),
		);
	});

	it('uses the key passed in options', async () => {
		const plugin = tailscale({ key: 'tskey-api-option' });
		await expect(
			keyBuilderOf(plugin)(keyContext({ authType: 'api_key' }), 'endpoint'),
		).resolves.toBe('tskey-api-option');
	});

	it('reads the stored key, and asks the tenant to connect when there is none', async () => {
		const plugin = tailscale();
		await expect(
			keyBuilderOf(plugin)(
				keyContext({
					authType: 'api_key',
					keys: { get_api_key: () => Promise.resolve('tskey-client-k1-s') },
				}),
				'endpoint',
			),
		).resolves.toBe('tskey-client-k1-s');
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

	it('treats an account with no DEK as no stored key', async () => {
		await expect(
			keyBuilderOf(tailscale())(
				keyContext({
					authType: 'api_key',
					keys: {
						get_api_key: () =>
							Promise.reject(new Error('No DEK found for account')),
					},
				}),
				'endpoint',
			),
		).rejects.toBeInstanceOf(AuthMissingError);
		await expect(
			keyBuilderOf(tailscale())(
				keyContext({
					authType: 'api_key',
					keys: { get_api_key: () => Promise.reject(new Error('db down')) },
				}),
				'endpoint',
			),
		).rejects.toThrow('db down');
	});

	it('has no webhook secret to build', async () => {
		await expect(
			keyBuilderOf(tailscale())(keyContext({ authType: 'api_key' }), 'webhook'),
		).resolves.toBe('');
	});

	it('keeps DEFAULT last so a caller handler is reached', () => {
		const custom = {
			match: () => true,
			handler: async () => ({ maxRetries: 1 }),
		};
		const handlers = tailscale({
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
		[412, 'BAD_REQUEST_ERROR'],
		[422, 'BAD_REQUEST_ERROR'],
		[500, 'SERVER_ERROR'],
		[504, 'SERVER_ERROR'],
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
			errorHandlers.NOT_FOUND_ERROR.match(new Error('device not found')),
		).toBe(true);
		expect(errorHandlers.DEFAULT.match()).toBe(true);
	});
});

describe('risk levels (PLUGIN_PR_RULES R8)', () => {
	const meta = tailscaleEndpointMeta as Record<
		string,
		{ riskLevel: string; irreversible?: boolean; description?: string }
	>;

	// Deleting these removes a pending link or a reversible flag, nothing more.
	const undoesASetting = new Set([
		'devices.postureAttributes.delete',
		'deviceInvites.delete',
		'userInvites.delete',
	]);

	it('marks deletes, emails, minted secrets and access cut-offs destructive', () => {
		for (const operation of tailscaleOperations) {
			if (operation.method === 'DELETE' && !undoesASetting.has(operation.id)) {
				expect([operation.id, meta[operation.id]?.riskLevel]).toEqual([
					operation.id,
					'destructive',
				]);
			}
		}
		for (const id of [
			'devices.delete',
			'keys.delete',
			'users.delete',
			'tailnets.delete',
			'webhooks.rotateSecret',
		]) {
			expect([id, meta[id]?.riskLevel, meta[id]?.irreversible]).toEqual([
				id,
				'destructive',
				true,
			]);
		}
		for (const id of [
			'keys.create',
			'oauthApps.create',
			'tailnets.create',
			'userInvites.create',
			'deviceInvites.create',
			'userInvites.resend',
			'devices.expireKey',
			'policyFile.set',
		]) {
			expect([id, meta[id]?.riskLevel]).toEqual([id, 'destructive']);
		}
		for (const id of undoesASetting) {
			expect([id, meta[id]?.riskLevel]).toEqual([id, 'write']);
		}
	});

	it('marks every GET and the checking POSTs a read', () => {
		for (const operation of tailscaleOperations) {
			if (operation.method === 'GET') {
				expect([operation.id, meta[operation.id]?.riskLevel]).toEqual([
					operation.id,
					'read',
				]);
			}
		}
		for (const id of [
			'policyFile.validate',
			'policyFile.preview',
			'logging.awsExternalId.validate',
		]) {
			expect(meta[id]?.riskLevel).toBe('read');
		}
	});

	it('gives every operation a description an agent can act on', () => {
		for (const operation of tailscaleOperations) {
			expect(meta[operation.id]?.description?.length ?? 0).toBeGreaterThan(20);
		}
		expect(meta['policyFile.set']?.description).toMatch(/ifMatch/);
		expect(meta['policyFile.set']?.description).toMatch(/policyFile\.validate/);
		expect(meta['keys.create']?.description).toMatch(/ephemeral/);
		expect(meta['keys.create']?.description).toMatch(/returned once/);
	});
});
