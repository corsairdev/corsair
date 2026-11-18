import { AuthMissingError } from 'corsair/core';
import { customerPathId } from './client';
import {
	googleAdsAuthConfig,
	googleAdsEndpointSchemas,
	googleads,
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
	plugin: ReturnType<typeof googleads>,
): Record<string, MetaEntry> {
	return plugin.endpointMeta ?? {};
}

describe('googleads plugin definition', () => {
	const plugin = googleads();
	const meta = metaOf(plugin);

	it('registers as googleads with oauth_2 auth only', () => {
		expect(plugin.id).toBe('googleads');
		expect(plugin.options?.authType).toBe('oauth_2');
		expect(Object.keys(googleAdsAuthConfig)).toEqual(['oauth_2']);
	});

	it('stores the developer token on the integration, not the account', () => {
		// The developer token identifies the application, so it is one per
		// integration; only the OAuth token varies per tenant.
		expect([...googleAdsAuthConfig.oauth_2.integration]).toEqual([
			'developer_token',
			'login_customer_id',
		]);
		expect(googleAdsAuthConfig.oauth_2.account).toEqual([]);
	});

	it('requests only the adwords scope, the one Google Ads accepts', () => {
		expect(plugin.oauthConfig?.scopes).toEqual([
			'https://www.googleapis.com/auth/adwords',
		]);
	});

	it('declares no webhooks, because Google Ads sends none', () => {
		expect(plugin.webhooks).toEqual({});
		expect(plugin.pluginWebhookMatcher?.({ headers: {}, body: {} })).toBe(
			false,
		);
	});

	it('registers every reporting, entity and account operation', () => {
		expect(endpointPaths(plugin.endpoints)).toEqual([
			'adGroups.create',
			'adGroups.update',
			'campaignBudgets.create',
			'campaignBudgets.update',
			'campaigns.create',
			'campaigns.remove',
			'campaigns.update',
			'customers.listAccessible',
			'customers.update',
			'googleAdsFields.search',
			'reporting.mutate',
			'reporting.search',
			'reporting.searchStream',
		]);
	});

	it('has an input and output schema for every operation', () => {
		expect(Object.keys(googleAdsEndpointSchemas).sort()).toEqual(
			endpointPaths(plugin.endpoints),
		);
		for (const schemas of Object.values(googleAdsEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('marks the two operations that cannot be undone', () => {
		const irreversible = Object.entries(meta)
			.filter(([, entry]) => entry.irreversible === true)
			.map(([name]) => name);

		// Only a campaign remove is documented as unrecoverable. Every other
		// write can be reversed by another call.
		expect(irreversible).toEqual(['campaigns.remove']);
	});

	it('marks exactly the reads as reads', () => {
		const reads = Object.entries(meta)
			.filter(([, entry]) => entry.riskLevel === 'read')
			.map(([name]) => name)
			.sort();

		expect(reads).toEqual([
			'customers.listAccessible',
			'googleAdsFields.search',
			'reporting.search',
			'reporting.searchStream',
		]);
	});

	it('describes every operation', () => {
		for (const entry of Object.values(meta)) {
			expect((entry.description ?? '').length).toBeGreaterThan(10);
		}
	});
});

describe('customer id normalisation', () => {
	it('strips hyphens, which is what the docs ask a caller to do', () => {
		expect(customerPathId('123-456-7890')).toBe('1234567890');
	});

	it('accepts a bare id unchanged', () => {
		expect(customerPathId('1234567890')).toBe('1234567890');
	});

	it('refuses anything that is not digits', () => {
		expect(() => customerPathId('abc')).toThrow(
			/Invalid Google Ads customer ID/,
		);
	});
});

describe('googleads key builder', () => {
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
					developer_token: 'dev-token',
				}),
				get_access_token: async () => null,
				get_expires_at: async () => null,
				get_refresh_token: async () => null,
			},
		} as unknown as Parameters<NonNullable<typeof builder>>[0]; // unknown: partial.
	}
	const builder = googleads().keyBuilder;

	it('throws AuthMissingError when the stored token cannot be read', async () => {
		await expect(
			googleads().keyBuilder?.(resolverContext('oauth_2'), 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('refuses a non-oauth auth type', async () => {
		await expect(
			googleads().keyBuilder?.(resolverContext('api_key'), 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
