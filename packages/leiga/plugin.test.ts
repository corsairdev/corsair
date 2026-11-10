import { AuthMissingError } from 'corsair/core';
import type { LeigaAuthContext } from './auth';
import {
	decodeLeigaStoredToken,
	encodeLeigaStoredToken,
	fingerprintLeigaPair,
	isStoredTokenUsable,
	resolveLeigaAccessToken,
} from './auth';
import { clearLeigaTokenCache } from './client';
import { leiga, leigaAuthConfig, leigaEndpointSchemas } from './index';
import { tokenResponse } from './test-fixtures';
import {
	installFetchMock,
	jsonResponse,
	mockFetch,
	restoreFetchMock,
} from './test-helpers';

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

const PAIR = fingerprintLeigaPair('cid', 'secret');

/** The `access_token` field as the resolver saves it. */
function storedToken(
	overrides: { accessToken?: string; expiresAt?: number; pair?: string } = {},
): string {
	return encodeLeigaStoredToken({
		accessToken: 'stored',
		expiresAt: Date.now() + 3_600_000,
		pair: PAIR,
		...overrides,
	});
}

/** A key manager slice: only the lookups the resolver calls. */
function authContext(
	stored: {
		accessToken?: string | null;
		clientId?: string | null;
		clientSecret?: string | null;
	} = {},
): LeigaAuthContext & { written: { token?: string } } {
	const written: { token?: string } = {};
	return {
		tenantId: 'default',
		written,
		keys: {
			get_access_token: jest.fn().mockResolvedValue(stored.accessToken ?? null),
			get_client_id: jest.fn().mockResolvedValue(stored.clientId ?? null),
			get_client_secret: jest
				.fn()
				.mockResolvedValue(stored.clientSecret ?? null),
			set_access_token: jest.fn(async (value: string) => {
				written.token = value;
			}),
		},
	};
}

beforeEach(() => {
	installFetchMock();
	clearLeigaTokenCache();
});
afterEach(restoreFetchMock);

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

	it('declares the client pair as account fields the manager can read', () => {
		// The account manager only generates accessors for account-level fields;
		// get_integration_credentials exists solely on oauth_2 managers, so the
		// pair has to be account-level or every call throws before the request.
		expect([...leigaAuthConfig.api_key.account]).toEqual([
			'client_id',
			'client_secret',
			'access_token',
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
	const record = (expiresAt: number, pair = PAIR) => ({
		accessToken: 'tok',
		expiresAt,
		pair,
	});

	it('accepts a token whose expiry is in the future', () => {
		expect(isStoredTokenUsable(record(Date.now() + 3_600_000), PAIR)).toBe(
			true,
		);
	});

	it('rejects a token inside the 60 second skew', () => {
		expect(isStoredTokenUsable(record(Date.now() + 30_000), PAIR)).toBe(false);
	});

	it('rejects an expired token', () => {
		expect(isStoredTokenUsable(record(Date.now() - 1_000), PAIR)).toBe(false);
	});

	it('rejects a token minted by another client pair', () => {
		const other = fingerprintLeigaPair('other', 'secret');
		expect(
			isStoredTokenUsable(record(Date.now() + 3_600_000, other), PAIR),
		).toBe(false);
	});

	it('fingerprints the id and the secret, not the id alone', () => {
		expect(fingerprintLeigaPair('cid', 'rotated')).not.toBe(PAIR);
		// The separator keeps "ab" + "c" apart from "a" + "bc".
		expect(fingerprintLeigaPair('ab', 'c')).not.toBe(
			fingerprintLeigaPair('a', 'bc'),
		);
		expect(PAIR).not.toContain('secret');
	});

	it('treats a bare token in the field as no token', () => {
		// Without its expiry and pair there is no telling whose it is or how
		// long it lasts, so it is replaced rather than trusted.
		expect(decodeLeigaStoredToken('just-a-token')).toBeUndefined();
		expect(decodeLeigaStoredToken('{"accessToken":"tok"}')).toBeUndefined();
		expect(decodeLeigaStoredToken('[1,2]')).toBeUndefined();
		expect(decodeLeigaStoredToken(null)).toBeUndefined();
	});

	it('reads back the record it writes', () => {
		const token = record(1_794_000_000_000);
		expect(decodeLeigaStoredToken(encodeLeigaStoredToken(token))).toEqual(
			token,
		);
	});

	it('returns a stored token without exchanging', async () => {
		const ctx = authContext({
			accessToken: storedToken(),
			clientId: 'cid',
			clientSecret: 'secret',
		});

		await expect(resolveLeigaAccessToken(ctx)).resolves.toBe('stored');
		expect(ctx.keys.set_access_token).not.toHaveBeenCalled();
		expect(jest.mocked(globalThis.fetch)).not.toHaveBeenCalled();
	});

	it('saves the token, its expiry and its pair in one write', async () => {
		const ctx = authContext({ clientId: 'cid', clientSecret: 'secret' });
		mockFetch(jsonResponse(tokenResponse));

		await expect(resolveLeigaAccessToken(ctx, { now: 1_000 })).resolves.toBe(
			'test-access-token',
		);

		expect(ctx.keys.set_access_token).toHaveBeenCalledTimes(1);
		expect(decodeLeigaStoredToken(ctx.written.token)).toEqual({
			accessToken: 'test-access-token',
			expiresAt: 1_000 + 604_800_000,
			pair: PAIR,
		});
		// The secret itself is not copied into the record.
		expect(ctx.written.token).not.toContain('secret');
	});

	it('exchanges when the stored token belongs to another pair', async () => {
		const ctx = authContext({
			accessToken: storedToken({
				pair: fingerprintLeigaPair('old-cid', 'old-secret'),
			}),
			clientId: 'cid',
			clientSecret: 'secret',
		});
		mockFetch(jsonResponse(tokenResponse));

		await expect(resolveLeigaAccessToken(ctx)).resolves.toBe(
			'test-access-token',
		);
		expect(decodeLeigaStoredToken(ctx.written.token)?.pair).toBe(PAIR);
	});

	it('never hands back the token Leiga rejected', async () => {
		const ctx = authContext({
			accessToken: storedToken(),
			clientId: 'cid',
			clientSecret: 'secret',
		});
		mockFetch(jsonResponse(tokenResponse));

		await expect(
			resolveLeigaAccessToken(ctx, { rejectedToken: 'stored' }),
		).resolves.toBe('test-access-token');
	});

	it('uses a stored token that is not the rejected one', async () => {
		// Another process already replaced the token Leiga refused.
		const ctx = authContext({
			accessToken: storedToken({ accessToken: 'replacement' }),
			clientId: 'cid',
			clientSecret: 'secret',
		});

		await expect(
			resolveLeigaAccessToken(ctx, { rejectedToken: 'stored' }),
		).resolves.toBe('replacement');
		expect(jest.mocked(globalThis.fetch)).not.toHaveBeenCalled();
	});

	it('still returns the token when saving it fails', async () => {
		const ctx = authContext({ clientId: 'cid', clientSecret: 'secret' });
		jest
			.mocked(ctx.keys.set_access_token)
			.mockRejectedValueOnce(new Error('database unavailable'));
		mockFetch(jsonResponse(tokenResponse));

		await expect(resolveLeigaAccessToken(ctx)).resolves.toBe(
			'test-access-token',
		);
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

	it('throws AuthMissingError for a stored token with no client pair', async () => {
		// The pair was removed. The token it minted must not outlive it.
		const ctx = authContext({ accessToken: storedToken() });

		await expect(resolveLeigaAccessToken(ctx)).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});
});

describe('leiga key builder', () => {
	it('prefers an explicit key without touching the store', async () => {
		const plugin = leiga({ key: 'explicit-token' });
		const ctx = authContext({
			accessToken: storedToken(),
			clientId: 'cid',
			clientSecret: 'secret',
		});

		const key = await plugin.keyBuilder?.(ctx as never, 'endpoint');

		expect(key).toBe('explicit-token');
		expect(ctx.keys.get_access_token).not.toHaveBeenCalled();
	});

	it('falls back to the stored token', async () => {
		const plugin = leiga();
		const ctx = authContext({
			accessToken: storedToken(),
			clientId: 'cid',
			clientSecret: 'secret',
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
