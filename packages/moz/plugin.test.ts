import { AuthMissingError } from 'corsair/core';
import { moz, mozEndpointSchemas } from './index';

function keyContext(stored: Record<string, string | null>) {
	return {
		authType: 'api_key' as const,
		options: {},
		tenantId: 'default',
		keys: {
			get_api_key: jest.fn().mockResolvedValue(stored.api_key ?? null),
			get_webhook_signature: jest
				.fn()
				.mockResolvedValue(stored.webhook_signature ?? null),
		},
	};
}

describe('moz plugin definition', () => {
	const plugin = moz();

	it('registers 74 operations with lazy schemas and metadata', () => {
		const meta = Object.keys(plugin.endpointMeta ?? {});
		expect(meta).toHaveLength(74);
		expect(Object.keys(mozEndpointSchemas).sort()).toEqual([...meta].sort());
		const entry = mozEndpointSchemas['metrics.fetch'];
		expect(
			entry.input.safeParse({
				site_query: { query: 'moz.com', scope: 'domain' },
			}).success,
		).toBe(true);
	});

	it('keeps the eleven original operation names', () => {
		for (const name of [
			'quota.lookup',
			'locales.list',
			'metrics.fetch',
			'metrics.fetchMultiple',
			'links.list',
			'links.intersect',
			'linkingDomains.list',
			'anchorText.list',
			'topPages.list',
			'competitors.fetch',
			'jobs.lookup',
		]) {
			expect(plugin.endpointMeta).toHaveProperty([name]);
		}
	});

	it('registers the four Moz Local location webhooks', () => {
		expect(Object.keys(plugin.webhookSchemas ?? {}).sort()).toEqual([
			'locations.canceled',
			'locations.closed',
			'locations.created',
			'locations.updated',
		]);
	});
});

describe('keyBuilder', () => {
	const build = (
		stored: Record<string, string | null>,
		source: 'endpoint' | 'webhook',
		options = {},
	) => moz(options).keyBuilder?.(keyContext(stored) as never, source);

	it('returns the stored token for endpoints', async () => {
		await expect(build({ api_key: 'tok' }, 'endpoint')).resolves.toBe('tok');
	});

	it('returns the webhook secret for webhooks, never the API token', async () => {
		await expect(
			build({ api_key: 'tok', webhook_signature: 'whsec_x' }, 'webhook'),
		).resolves.toBe('whsec_x');
	});

	it('asks for a connection when the token is missing', async () => {
		await expect(build({}, 'endpoint')).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});
});
