import { AuthMissingError } from 'corsair/core';
import {
	googleSearchConsoleAuthConfig,
	googleSearchConsoleEndpointSchemas,
	googlesearchconsole,
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
	plugin: ReturnType<typeof googlesearchconsole>,
): Record<string, MetaEntry> {
	return plugin.endpointMeta ?? {};
}

describe('googlesearchconsole plugin definition', () => {
	const plugin = googlesearchconsole();
	const meta = metaOf(plugin);

	it('registers as googlesearchconsole with oauth_2 auth only', () => {
		expect(plugin.id).toBe('googlesearchconsole');
		expect(plugin.options?.authType).toBe('oauth_2');
		expect(Object.keys(googleSearchConsoleAuthConfig)).toEqual(['oauth_2']);
	});

	it('requests the webmasters scope, which covers reads and the sitemap writes', () => {
		expect(plugin.oauthConfig?.scopes).toEqual([
			'https://www.googleapis.com/auth/webmasters',
		]);
	});

	it('declares no extra account fields', () => {
		expect(googleSearchConsoleAuthConfig.oauth_2.account).toEqual([]);
	});

	it('declares no webhooks, because Search Console sends none', () => {
		expect(plugin.webhooks).toEqual({});
		expect(plugin.pluginWebhookMatcher?.({ headers: {}, body: {} })).toBe(
			false,
		);
	});

	it('registers the analytics, site, sitemap and inspection operations', () => {
		expect(endpointPaths(plugin.endpoints)).toEqual([
			'searchanalytics.query',
			'sitemaps.delete',
			'sitemaps.get',
			'sitemaps.list',
			'sitemaps.submit',
			'sites.add',
			'sites.delete',
			'sites.get',
			'sites.list',
			'urlInspection.inspect',
		]);
	});

	it('has an input and output schema for every operation', () => {
		expect(Object.keys(googleSearchConsoleEndpointSchemas).sort()).toEqual(
			endpointPaths(plugin.endpoints),
		);
		for (const schemas of Object.values(googleSearchConsoleEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('marks the two operations that remove data as destructive', () => {
		const destructive = Object.entries(meta)
			.filter(([, entry]) => entry.riskLevel === 'destructive')
			.map(([name]) => name)
			.sort();

		expect(destructive).toEqual(['sitemaps.delete', 'sites.delete']);
	});

	it('marks exactly the reads as reads', () => {
		const reads = Object.entries(meta)
			.filter(([, entry]) => entry.riskLevel === 'read')
			.map(([name]) => name)
			.sort();

		expect(reads).toEqual([
			'searchanalytics.query',
			'sitemaps.get',
			'sitemaps.list',
			'sites.get',
			'sites.list',
			'urlInspection.inspect',
		]);
	});

	it('describes every operation', () => {
		for (const entry of Object.values(meta)) {
			expect((entry.description ?? '').length).toBeGreaterThan(10);
		}
	});
});

describe('googlesearchconsole key builder', () => {
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
	const builder = googlesearchconsole().keyBuilder;

	it('throws AuthMissingError when the stored token cannot be read', async () => {
		await expect(
			googlesearchconsole().keyBuilder?.(
				resolverContext('oauth_2'),
				'endpoint',
			),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('refuses a non-oauth auth type', async () => {
		await expect(
			googlesearchconsole().keyBuilder?.(
				resolverContext('api_key'),
				'endpoint',
			),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
