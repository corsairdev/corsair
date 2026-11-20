import { AuthMissingError } from 'corsair/core';
import type { JumpCloudAPIError } from './client';
import { jumpCloudEndpointsNested } from './endpoints';
import { errorHandlers } from './error-handlers';
import type { JumpCloudKeyBuilderContext } from './index';
import {
	jumpCloudEndpointMeta,
	jumpCloudEndpointSchemas,
	jumpcloud,
} from './index';
import { safeEventPayload } from './safe-event';

describe('jumpcloud plugin registry', () => {
	const plugin = jumpcloud({});
	const paths = Object.entries(jumpCloudEndpointsNested).flatMap(
		([family, ops]) => Object.keys(ops).map((op) => `${family}.${op}`),
	);
	const meta = jumpCloudEndpointMeta as Record<
		string,
		{ riskLevel?: string; description?: string }
	>;

	it('registers exactly 48 unique endpoint paths', () => {
		expect(paths).toHaveLength(48);
		expect(new Set(paths).size).toBe(48);
	});

	it('declares metadata and schemas for exactly the registered endpoint paths', () => {
		expect(Object.keys(jumpCloudEndpointMeta).sort()).toEqual(
			[...paths].sort(),
		);
		expect(Object.keys(jumpCloudEndpointSchemas).sort()).toEqual(
			[...paths].sort(),
		);
	});

	it('declares a valid riskLevel and a non-empty description for every endpoint', () => {
		for (const op of paths) {
			expect(['read', 'write', 'destructive']).toContain(meta[op]?.riskLevel);
			// all 48 endpoints carry a description; never allow an empty one
			expect(meta[op]?.description).toBeTruthy();
			expect(meta[op]?.description?.length).toBeGreaterThan(0);
		}
	});

	it('marks deletes, command runs, user creation and update (activation email), password and MFA resets destructive', () => {
		const destructiveOps = paths
			.filter((op) => meta[op]?.riskLevel === 'destructive')
			.sort();
		expect(destructiveOps).toEqual([
			'commands.run',
			'policies.delete',
			'systemGroups.delete',
			'systems.delete',
			'userGroups.delete',
			'users.create',
			'users.delete',
			'users.enforceMfa',
			'users.expirePassword',
			'users.resetMfa',
			'users.setPassword',
			'users.update',
		]);
	});

	it('registers as an api_key plugin with no webhooks', () => {
		expect(plugin.id).toBe('jumpcloud');
		expect(Object.keys(plugin.authConfig ?? {})).toEqual(['api_key']);
		expect(plugin.webhooks).toEqual({});
	});
});

describe('jumpcloud keyBuilder', () => {
	it('prefers the explicit options key for endpoint calls', async () => {
		const keyed = jumpcloud({ key: 'jc-explicit-key' });
		const ctx = {
			authType: 'api_key',
		} as unknown as JumpCloudKeyBuilderContext;

		await expect(keyed.keyBuilder!(ctx as never, 'endpoint')).resolves.toBe(
			'jc-explicit-key',
		);
	});

	it('returns the stored api key when the key manager has one', async () => {
		const plugin = jumpcloud({});
		const ctx = {
			authType: 'api_key',
			keys: { get_api_key: async () => 'jc-stored-key' },
		} as unknown as JumpCloudKeyBuilderContext;

		await expect(plugin.keyBuilder!(ctx as never, 'endpoint')).resolves.toBe(
			'jc-stored-key',
		);
	});

	it('throws AuthMissingError when the stored api key is null', async () => {
		const plugin = jumpcloud({});
		const ctx = {
			authType: 'api_key',
			keys: { get_api_key: async () => null },
		} as unknown as JumpCloudKeyBuilderContext;

		await expect(plugin.keyBuilder!(ctx as never, 'endpoint')).rejects.toThrow(
			AuthMissingError,
		);
	});
});

describe('jumpcloud error handlers', () => {
	function fakeJumpCloudError(partial: {
		status?: number;
		retryAfter?: number;
		message?: string;
	}): JumpCloudAPIError {
		return { message: '', ...partial } as unknown as JumpCloudAPIError;
	}

	it('routes HTTP 429 to RATE_LIMIT_ERROR and passes retry-after through', async () => {
		const error = fakeJumpCloudError({ status: 429, retryAfter: 3000 });

		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({ maxRetries: 0, headersRetryAfterMs: 3000 });
	});

	it('routes HTTP 401 and HTTP 403 to AUTH_ERROR', () => {
		expect(
			errorHandlers.AUTH_ERROR.match(fakeJumpCloudError({ status: 401 })),
		).toBe(true);
		expect(
			errorHandlers.AUTH_ERROR.match(fakeJumpCloudError({ status: 403 })),
		).toBe(true);
	});

	it('routes HTTP 500 to SERVER_ERROR', () => {
		expect(
			errorHandlers.SERVER_ERROR.match(fakeJumpCloudError({ status: 500 })),
		).toBe(true);
	});

	it('matches any error as the DEFAULT catch-all', () => {
		expect(errorHandlers.DEFAULT.match()).toBe(true);
	});
});

describe('safeEventPayload allowlist', () => {
	it('keeps identifier keys, identifier arrays and operation identifiers', () => {
		expect(
			safeEventPayload({
				id: 'x',
				system_id: 5,
				systemIds: ['1'],
				action: 'activate',
				mode: 'content',
				limit: 10,
			}),
		).toEqual({
			id: 'x',
			system_id: 5,
			systemIds: ['1'],
			action: 'activate',
			mode: 'content',
			limit: 10,
		});
	});

	it('drops passwords, bodies, markdown, names, prompts and command text entirely', () => {
		expect(
			safeEventPayload({
				password: 'x',
				body: {},
				markdown: 'x',
				name: 'x',
				prompt: 'x',
				command: 'rm -rf',
			}),
		).toEqual({});
	});

	it('keeps pagination keys and drops search text and non-allowlisted keys', () => {
		// Search text can be an email address, so it never reaches event history.
		expect(
			safeEventPayload({
				limit: 25,
				page: 2,
				searchTerm: 'person@example.com',
				query: 'person@example.com',
				term: 'vpn',
			}),
		).toEqual({ limit: 25, page: 2 });
		expect(safeEventPayload({ sort: 'name', description: 'd' })).toEqual({});
	});

	it('drops undeclared or personal keys that end in Id', () => {
		// Input schemas are loose, so any extra key reaches the payload filter.
		expect(
			safeEventPayload({
				limit: 10,
				managedAppleId: 'alice@example.com',
				externalId: 'emp-42',
				anyOtherId: 'x',
			}),
		).toEqual({ limit: 10 });
	});
});
