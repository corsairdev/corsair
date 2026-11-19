import { AuthMissingError } from 'corsair/core';
import {
	googleAdminAuthConfig,
	googleAdminEndpointSchemas,
	googleadmin,
} from './index';

/**
 * Every dot-notation path in the registered endpoint tree, sorted.
 *
 * The tree is walked by key, so the leaf type is never read. unknown: an
 * `as const` tree of functions nested at mixed depths has no single indexable
 * type, so the walk starts from a cast and reads keys and typeof only.
 */
function endpointPaths(tree: object | undefined): string[] {
	const paths: string[] = [];
	if (!tree) return paths;
	const walk = (node: object, prefix: string): void => {
		for (const [name, value] of Object.entries(node)) {
			const path = prefix ? `${prefix}.${name}` : name;
			if (typeof value === 'function') {
				paths.push(path);
			} else if (value !== null && typeof value === 'object') {
				walk(value, path);
			}
		}
	};
	walk(tree, '');
	return paths.sort();
}

type MetaEntry = {
	riskLevel: string;
	irreversible?: boolean;
	description?: string;
};

/** The endpoint metadata as a lookup, so a test can name one operation. */
function metaOf(
	plugin: ReturnType<typeof googleadmin>,
): Record<string, MetaEntry> {
	return plugin.endpointMeta ?? {};
}

describe('googleadmin plugin definition', () => {
	const plugin = googleadmin();
	const meta = metaOf(plugin);

	it('registers as googleadmin with oauth_2 auth only', () => {
		expect(plugin.id).toBe('googleadmin');
		expect(plugin.options?.authType).toBe('oauth_2');
		expect(Object.keys(googleAdminAuthConfig)).toEqual(['oauth_2']);
	});

	it('asks for read-only scopes on the resources it only reads', () => {
		const scopes = plugin.oauthConfig?.scopes ?? [];

		expect(scopes).toContain(
			'https://www.googleapis.com/auth/admin.directory.domain.readonly',
		);
		expect(scopes).toContain(
			'https://www.googleapis.com/auth/admin.directory.customer.readonly',
		);
		expect(scopes).not.toContain(
			'https://www.googleapis.com/auth/admin.directory.domain',
		);
		expect(scopes).not.toContain(
			'https://www.googleapis.com/auth/admin.directory.customer',
		);
	});

	it('declares no extra account fields', () => {
		// The tokens are all this plugin needs; an unfilled extra field would
		// mark every connection as partial.
		expect(googleAdminAuthConfig.oauth_2.account).toEqual([]);
	});

	it('declares no webhooks, because the Directory API pushes to a callback URL a tenant hosts', () => {
		expect(plugin.webhooks).toEqual({});
		expect(plugin.pluginWebhookMatcher?.({ headers: {}, body: {} })).toBe(
			false,
		);
	});

	it('registers every user, group, member, org unit, domain and customer operation', () => {
		expect(endpointPaths(plugin.endpoints)).toEqual([
			'customers.get',
			'domains.aliases.list',
			'domains.get',
			'domains.list',
			'groups.aliases.delete',
			'groups.aliases.insert',
			'groups.aliases.list',
			'groups.delete',
			'groups.get',
			'groups.insert',
			'groups.list',
			'groups.update',
			'members.delete',
			'members.get',
			'members.hasMember',
			'members.insert',
			'members.list',
			'members.update',
			'orgUnits.delete',
			'orgUnits.get',
			'orgUnits.insert',
			'orgUnits.list',
			'orgUnits.update',
			'users.aliases.delete',
			'users.aliases.insert',
			'users.aliases.list',
			'users.delete',
			'users.get',
			'users.insert',
			'users.list',
			'users.makeAdmin',
			'users.photos.delete',
			'users.photos.get',
			'users.photos.update',
			'users.signOut',
			'users.undelete',
			'users.update',
		]);
	});

	it('has an input and output schema for every operation', () => {
		expect(Object.keys(googleAdminEndpointSchemas).sort()).toEqual(
			endpointPaths(plugin.endpoints),
		);
		for (const schemas of Object.values(googleAdminEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('marks every destructive operation, and only the unrecoverable ones irreversible', () => {
		const destructive = Object.entries(meta)
			.filter(([, entry]) => entry.riskLevel === 'destructive')
			.map(([name]) => name)
			.sort();

		expect(destructive).toEqual([
			'groups.aliases.delete',
			'groups.delete',
			'members.delete',
			'orgUnits.delete',
			'users.aliases.delete',
			'users.delete',
			// A new user on a flexible plan is a billed licence.
			'users.insert',
			'users.makeAdmin',
			'users.photos.delete',
			// Ended sessions cannot be restored.
			'users.signOut',
		]);
		// A deleted user is recoverable through users.undelete while Google keeps
		// the account in the trash, so it is destructive but not irreversible.
		expect(meta['users.delete']?.irreversible).toBeUndefined();
		expect(meta['groups.delete']?.irreversible).toBe(true);
		expect(meta['orgUnits.delete']?.irreversible).toBe(true);
	});

	it('marks exactly the reads as reads', () => {
		const reads = Object.entries(meta)
			.filter(([, entry]) => entry.riskLevel === 'read')
			.map(([name]) => name)
			.sort();

		expect(reads).toEqual([
			'customers.get',
			'domains.aliases.list',
			'domains.get',
			'domains.list',
			'groups.aliases.list',
			'groups.get',
			'groups.list',
			'members.get',
			'members.hasMember',
			'members.list',
			'orgUnits.get',
			'orgUnits.list',
			'users.aliases.list',
			'users.get',
			'users.list',
			'users.photos.get',
		]);
	});

	it('describes every operation', () => {
		for (const entry of Object.values(meta)) {
			expect((entry.description ?? '').length).toBeGreaterThan(10);
		}
	});
});

describe('googleadmin key builder', () => {
	/**
	 * A context with only the lookups the token resolver calls.
	 *
	 * unknown: the resolver reads a handful of account-manager methods, so the
	 * rest of the generated surface is absent rather than faked.
	 */
	// unknown: only the methods the resolver calls are present, by design.
	function resolverContext(
		authType: string,
		fields: {
			clientSecret?: string | null;
			accessToken?: string | null;
		} = {},
	) {
		return {
			authType,
			tenantId: 'default',
			keys: {
				get_integration_credentials: async () => ({
					client_id: 'client-id',
					client_secret: fields.clientSecret ?? null,
					redirect_url: null,
				}),
				get_access_token: async () => fields.accessToken ?? null,
				get_expires_at: async () => null,
				get_refresh_token: async () => null,
			},
		} as unknown as Parameters<NonNullable<typeof pluginBuilder>>[0]; // unknown: partial.
	}
	const pluginBuilder = googleadmin().keyBuilder;

	it('throws AuthMissingError when no client secret and no stored token exist', async () => {
		await expect(
			googleadmin().keyBuilder?.(resolverContext('oauth_2'), 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('refuses a non-oauth auth type', async () => {
		await expect(
			googleadmin().keyBuilder?.(resolverContext('api_key'), 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
