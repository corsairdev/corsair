import { AuthMissingError } from 'corsair/core';
import type { LeigaAuthContext } from './auth';
import { isStoredTokenUsable, resolveLeigaAccessToken } from './auth';
import { clearLeigaTokenCache } from './client';
import { leiga, leigaAuthConfig, leigaEndpointSchemas } from './index';

const OPERATIONS = [
	'issues.fields',
	'issues.get',
	'issues.getByNumber',
	'issues.list',
	'issues.types',
	'members.list',
	'projects.get',
	'projects.getByKey',
	'projects.list',
	'projects.templates',
	'sprints.get',
	'sprints.list',
	'tags.list',
	'workflows.list',
	'workflows.nextStates',
] as const;

type Nested = Record<string, Record<string, unknown>>;

/**
 * Nested `group -> function` maps, as the plugin registers them.
 * unknown: only the keys are walked, so the handler leaf type is never used.
 */
type NestedMap = Record<string, Record<string, unknown>>;

function flatten(endpoints: NestedMap): string[] {
	const paths: string[] = [];
	for (const [group, members] of Object.entries(endpoints)) {
		for (const name of Object.keys(members)) paths.push(`${group}.${name}`);
	}
	return paths.sort();
}

/** A key manager slice: only the four lookups the resolver calls. */
function authContext(
	stored: {
		accessToken?: string | null;
		expiresAt?: string | null;
		clientId?: string | null;
		clientSecret?: string | null;
	} = {},
): LeigaAuthContext & { written: (string | undefined)[] } {
	const written: (string | undefined)[] = [];
	return {
		tenantId: 'default',
		written,
		keys: {
			get_access_token: jest.fn().mockResolvedValue(stored.accessToken ?? null),
			get_expires_at: jest.fn().mockResolvedValue(stored.expiresAt ?? null),
			get_integration_credentials: jest.fn().mockResolvedValue({
				client_id: stored.clientId ?? null,
				client_secret: stored.clientSecret ?? null,
			}),
			set_access_token: jest.fn(async (value: string) => {
				written.push(value);
			}),
		},
	};
}

beforeEach(() => {
	clearLeigaTokenCache();
});

describe('leiga plugin definition', () => {
	const plugin = leiga();
	const meta = plugin.endpointMeta as unknown as Record<
		string,
		{ riskLevel: string; description: string; irreversible?: boolean }
	>;

	it('registers as leiga with api_key auth only', () => {
		expect(plugin.id).toBe('leiga');
		expect(plugin.options?.authType).toBe('api_key');
		expect(Object.keys(leigaAuthConfig)).toEqual(['api_key']);
	});

	it('declares the client pair as integration fields', () => {
		// Leiga issues the pair per app, so it is not an account credential.
		expect([...leigaAuthConfig.api_key.integration]).toEqual([
			'client_id',
			'client_secret',
		]);
		expect([...leigaAuthConfig.api_key.account]).toEqual([
			'access_token',
			'expires_at',
		]);
	});

	it('declares no webhooks, because Leiga sends none', () => {
		expect(plugin.webhooks).toEqual({});
		expect(plugin.pluginWebhookMatcher?.({ headers: {}, body: {} })).toBe(
			false,
		);
	});

	it('registers exactly the fifteen read operations', () => {
		expect(flatten(plugin.endpoints as unknown as NestedMap)).toEqual([
			...OPERATIONS,
		]);
	});

	it('marks every operation as a read', () => {
		// Nothing in this plugin mutates Leiga, so a read-only caller can use all
		// of it and a strict caller never needs approval.
		for (const [name, entry] of Object.entries(meta)) {
			expect(entry.riskLevel).toBe('read');
			expect(entry.description.length).toBeGreaterThan(10);
			expect(name).toBe(name.trim());
		}
	});

	it('has an input and output schema for every operation', () => {
		expect(Object.keys(leigaEndpointSchemas).sort()).toEqual([...OPERATIONS]);
		for (const schemas of Object.values(leigaEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('rejects an issue query with no projectId', () => {
		const list = leigaEndpointSchemas['issues.list'];
		expect(list.input.safeParse({ pageSize: 5 }).success).toBe(false);
		expect(list.input.safeParse({ projectId: 1 }).success).toBe(true);
	});

	it('rejects an unknown orderBy rather than sending it', () => {
		const list = leigaEndpointSchemas['issues.list'];
		expect(
			list.input.safeParse({ projectId: 1, orderBy: 'dueDate' }).success,
		).toBe(false);
	});

	it('keeps DEFAULT last when a caller adds a handler', () => {
		const custom = leiga({
			errorHandlers: {
				QUOTA_ERROR: {
					match: () => false,
					handler: async () => ({ maxRetries: 0 }),
				},
			},
		});
		const names = Object.keys(custom.errorHandlers ?? {});

		expect(names.at(-1)).toBe('DEFAULT');
		expect(names).toContain('QUOTA_ERROR');
		expect(names.indexOf('QUOTA_ERROR')).toBeLessThan(names.indexOf('DEFAULT'));
	});
});

describe('leiga stored token reuse', () => {
	it('accepts a token whose expiry is in the future', () => {
		expect(isStoredTokenUsable('tok', String(Date.now() + 3_600_000))).toBe(
			true,
		);
	});

	it('rejects a token inside the 60 second skew', () => {
		expect(isStoredTokenUsable('tok', String(Date.now() + 30_000))).toBe(false);
	});

	it('rejects an expired token', () => {
		expect(isStoredTokenUsable('tok', String(Date.now() - 1_000))).toBe(false);
	});

	it('accepts a token with no recorded expiry', () => {
		// A hand-stored token would otherwise force an exchange on every call.
		expect(isStoredTokenUsable('tok', null)).toBe(true);
	});

	it('returns a stored token without exchanging', async () => {
		const ctx = authContext({
			accessToken: 'stored',
			expiresAt: String(Date.now() + 3_600_000),
			clientId: 'cid',
			clientSecret: 'secret',
		});

		await expect(resolveLeigaAccessToken(ctx)).resolves.toBe('stored');
		expect(ctx.keys.set_access_token).not.toHaveBeenCalled();
	});

	it('throws AuthMissingError when no token and no client pair exist', async () => {
		const ctx = authContext({});

		await expect(resolveLeigaAccessToken(ctx)).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});

	it('throws AuthMissingError when only the client id is stored', async () => {
		const ctx = authContext({ clientId: 'cid' });

		await expect(resolveLeigaAccessToken(ctx)).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});
});

describe('leiga key builder', () => {
	it('prefers an explicit key without touching the store', async () => {
		const plugin = leiga({ key: 'explicit-token' });
		const ctx = authContext({
			accessToken: 'stored',
			expiresAt: String(Date.now() + 3_600_000),
		});

		const key = await plugin.keyBuilder?.(ctx as never, 'endpoint');

		expect(key).toBe('explicit-token');
		expect(ctx.keys.get_access_token).not.toHaveBeenCalled();
	});

	it('falls back to the stored token', async () => {
		const plugin = leiga();
		const ctx = authContext({
			accessToken: 'stored',
			expiresAt: String(Date.now() + 3_600_000),
		});

		await expect(plugin.keyBuilder?.(ctx as never, 'endpoint')).resolves.toBe(
			'stored',
		);
	});

	it('throws for a webhook source, because there are no webhooks', async () => {
		const plugin = leiga();

		await expect(
			plugin.keyBuilder?.(authContext({}) as never, 'webhook'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
