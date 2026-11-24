import { AuthMissingError } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { amikaEndpointMeta } from './endpoints/catalog';
import { amikaOperations } from './endpoints/manifest';
import { errorHandlers } from './error-handlers';
import { amika } from './index';

// `unknown` because each case gives the key builder only the context fields it reads.
type KeyBuilder = (
	ctx: unknown,
	source: 'endpoint' | 'webhook',
) => Promise<string>;

function keyBuilderOf(plugin: ReturnType<typeof amika>): KeyBuilder {
	return plugin.keyBuilder as unknown as KeyBuilder;
}

// `unknown` because each case sets only the fields the key builder reads.
function keyContext(fields: Record<string, unknown>): unknown {
	return fields;
}

function apiError(status: number): ApiError {
	return new ApiError(
		{ method: 'GET', url: '/rigs/{id}' },
		{ url: '/rigs/dev', ok: false, status, statusText: 'x', body: {} },
		`Amika ${status}`,
	);
}

describe('amika plugin', () => {
	it('registers as amika with every operation in the tree and its meta', () => {
		const plugin = amika();
		expect(plugin.id).toBe('amika');
		expect(Object.keys(plugin.endpointMeta ?? {}).sort()).toEqual(
			amikaOperations.map((operation) => operation.id).sort(),
		);
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(plugin.endpoints?.rigs.create).toEqual(expect.any(Function));
		expect(plugin.endpoints?.rigs.services.create).toEqual(
			expect.any(Function),
		);
		expect(plugin.endpoints?.agentCredentials.claude.check).toEqual(
			expect.any(Function),
		);
	});

	it('uses the key passed in options', async () => {
		const plugin = amika({ key: 'sk_option' });
		await expect(
			keyBuilderOf(plugin)(keyContext({ authType: 'api_key' }), 'endpoint'),
		).resolves.toBe('sk_option');
	});

	it('reads the stored key, and asks the tenant to connect when there is none', async () => {
		const plugin = amika();
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

	it('treats an account with no DEK as no stored key', async () => {
		await expect(
			keyBuilderOf(amika())(
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
			keyBuilderOf(amika())(
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
			keyBuilderOf(amika())(keyContext({ authType: 'api_key' }), 'webhook'),
		).resolves.toBe('');
	});

	it('keeps DEFAULT last so a caller handler is reached', () => {
		const custom = {
			match: () => true,
			handler: async () => ({ maxRetries: 1 }),
		};
		const handlers = amika({
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
			errorHandlers.NOT_FOUND_ERROR.match(new Error('rig not found')),
		).toBe(true);
		expect(errorHandlers.DEFAULT.match()).toBe(true);
	});
});

describe('risk levels (PLUGIN_PR_RULES R8)', () => {
	const meta = amikaEndpointMeta as Record<
		string,
		{ riskLevel: string; irreversible?: boolean; description?: string }
	>;

	it('marks every DELETE destructive', () => {
		for (const operation of amikaOperations) {
			if (operation.method === 'DELETE') {
				expect([operation.id, meta[operation.id]?.riskLevel]).toEqual([
					operation.id,
					'destructive',
				]);
			}
		}
	});

	it('marks running an agent or a command, and losing data for good, irreversible', () => {
		for (const id of [
			// The agent turn, the shell command and the job run happen; they can't be called back.
			'agentSessions.send',
			'commandRuns.create',
			'jobRuns.start',
			'rigs.delete',
			'snapshots.delete',
			'jobs.delete',
			'apiKeys.delete',
			'secrets.delete',
			'agentCredentials.claude.delete',
			'cloudAccounts.delete',
		]) {
			expect([id, meta[id]?.riskLevel, meta[id]?.irreversible]).toEqual([
				id,
				'destructive',
				true,
			]);
		}
		// Schedules shell commands that will run later.
		expect(meta['jobs.create']?.riskLevel).toBe('destructive');
	});

	it('marks booting or resuming a billed rig, and changing a schedule, destructive', () => {
		for (const id of ['rigs.create', 'rigs.start', 'jobs.update']) {
			expect([id, meta[id]?.riskLevel, meta[id]?.irreversible]).toEqual([
				id,
				'destructive',
				undefined,
			]);
		}
		// The default snapshot mode deletes the source rig.
		expect(meta['snapshots.create']?.riskLevel).toBe('destructive');
		expect(meta['snapshots.create']?.irreversible).toBe(true);
		expect(meta['rigs.stop']?.riskLevel).toBe('write');
	});

	it('marks every GET and the credential check a read', () => {
		for (const operation of amikaOperations) {
			if (operation.method === 'GET') {
				expect([operation.id, meta[operation.id]?.riskLevel]).toEqual([
					operation.id,
					'read',
				]);
			}
		}
		expect(meta['agentCredentials.claude.check']?.riskLevel).toBe('read');
	});

	it('names only rig selectors an operation takes (`by` or `sandbox_by`)', () => {
		for (const operation of amikaOperations) {
			const description = meta[operation.id]?.description ?? '';
			const takes = Object.keys(
				(operation.input.properties as Record<string, unknown>) ?? {},
			);
			for (const selector of ['by', 'sandbox_by']) {
				if (description.includes(`\`${selector}\` says`)) {
					expect([operation.id, takes]).toEqual([
						operation.id,
						expect.arrayContaining([selector]),
					]);
				}
			}
		}
	});

	it('gives every operation a description an agent can act on', () => {
		for (const operation of amikaOperations) {
			expect(meta[operation.id]?.description?.length ?? 0).toBeGreaterThan(20);
		}
		expect(meta['rigs.create']?.description).toMatch(/rigs\.get/);
		expect(meta['commandRuns.create']?.description).toMatch(/listEvents/);
		expect(meta['agentSessions.send']?.description).toMatch(/is_error/);
		expect(meta['apiKeys.create']?.description).toMatch(/returned once/);
	});
});
