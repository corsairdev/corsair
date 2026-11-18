import { AuthMissingError } from 'corsair/core';
import {
	googlePhotosAuthConfig,
	googlePhotosEndpointSchemas,
	googlephotos,
} from './index';

/**
 * Every dot-notation path in the registered endpoint tree, sorted.
 *
 * unknown: an `as const` tree of functions nested at mixed depths has no single
 * indexable type, so the walk starts from a cast and reads keys and typeof only.
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

function metaOf(
	plugin: ReturnType<typeof googlephotos>,
): Record<string, MetaEntry> {
	return plugin.endpointMeta ?? {};
}

describe('googlephotos plugin definition', () => {
	const plugin = googlephotos();
	const meta = metaOf(plugin);

	it('registers as googlephotos with oauth_2 auth only', () => {
		expect(plugin.id).toBe('googlephotos');
		expect(plugin.options?.authType).toBe('oauth_2');
		expect(Object.keys(googlePhotosAuthConfig)).toEqual(['oauth_2']);
	});

	it('requests only the scopes that survived the April 2025 change', () => {
		// The removed scopes would make the connect fail, so this is a real
		// correctness check, not a formatting one.
		expect(plugin.oauthConfig?.scopes).toEqual([
			'https://www.googleapis.com/auth/photoslibrary.appendonly',
			'https://www.googleapis.com/auth/photoslibrary.readonly.appcreateddata',
			'https://www.googleapis.com/auth/photoslibrary.edit.appcreateddata',
		]);
		expect(plugin.oauthConfig?.scopes).not.toContain(
			'https://www.googleapis.com/auth/photoslibrary.readonly',
		);
		expect(plugin.oauthConfig?.scopes).not.toContain(
			'https://www.googleapis.com/auth/photoslibrary.sharing',
		);
	});

	it('declares no extra account fields', () => {
		expect(googlePhotosAuthConfig.oauth_2.account).toEqual([]);
	});

	it('declares no webhooks, because the Library API sends none', () => {
		expect(plugin.webhooks).toEqual({});
		expect(plugin.pluginWebhookMatcher?.({ headers: {}, body: {} })).toBe(
			false,
		);
	});

	it('registers every album and media item operation, and no removed one', () => {
		const paths = endpointPaths(plugin.endpoints);

		expect(paths).toEqual([
			'albums.addEnrichment',
			'albums.batchAddMediaItems',
			'albums.batchRemoveMediaItems',
			'albums.create',
			'albums.get',
			'albums.list',
			'albums.update',
			'mediaItems.batchGet',
			'mediaItems.create',
			'mediaItems.get',
			'mediaItems.list',
			'mediaItems.search',
			'mediaItems.update',
		]);
		// The API removed these in April 2025; exposing them would be a route
		// that always fails.
		expect(paths).not.toContain('albums.share');
		expect(paths).not.toContain('albums.unshare');
		expect(paths).not.toContain('sharedAlbums.list');
		expect(paths).not.toContain('sharedAlbums.join');
		expect(paths).not.toContain('sharedAlbums.leave');
		expect(paths).not.toContain('sharedAlbums.get');
	});

	it('has an input and output schema for every operation', () => {
		expect(Object.keys(googlePhotosEndpointSchemas).sort()).toEqual(
			endpointPaths(plugin.endpoints),
		);
		for (const schemas of Object.values(googlePhotosEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('marks no operation irreversible, because no call destroys data', () => {
		// Removing an item from an album leaves it in the library, so it can be
		// added back. Nothing this plugin exposes deletes outright.
		const irreversible = Object.entries(meta).filter(
			([, entry]) => entry.irreversible === true,
		);

		expect(irreversible).toEqual([]);
	});

	it('marks exactly the reads as reads', () => {
		const reads = Object.entries(meta)
			.filter(([, entry]) => entry.riskLevel === 'read')
			.map(([name]) => name)
			.sort();

		expect(reads).toEqual([
			'albums.get',
			'albums.list',
			'mediaItems.batchGet',
			'mediaItems.get',
			'mediaItems.list',
			'mediaItems.search',
		]);
	});

	it('describes every operation', () => {
		for (const entry of Object.values(meta)) {
			expect((entry.description ?? '').length).toBeGreaterThan(10);
		}
	});
});

describe('googlephotos key builder', () => {
	/**
	 * unknown: the resolver reads a handful of account-manager methods, so the
	 * rest of the generated surface is absent rather than faked.
	 */
	function resolverContext(authType: string) {
		return {
			authType,
			tenantId: 'default',
			keys: {
				get_integration_credentials: async () => ({
					client_id: 'client-id',
					client_secret: null,
					redirect_url: null,
				}),
				get_access_token: async () => null,
				get_expires_at: async () => null,
				get_refresh_token: async () => null,
			},
		} as unknown as Parameters<NonNullable<typeof builder>>[0]; // unknown: partial.
	}
	const builder = googlephotos().keyBuilder;

	it('throws AuthMissingError when the stored token cannot be read', async () => {
		await expect(
			googlephotos().keyBuilder?.(resolverContext('oauth_2'), 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('refuses a non-oauth auth type', async () => {
		await expect(
			googlephotos().keyBuilder?.(resolverContext('api_key'), 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
