import { bindEndpointsRecursively } from '../core/endpoints/bind';
import type { CorsairPlugin } from '../core/plugins';
import type { HubConfig } from '../hub/types';

// Its own file: the job kinds are cached per plugin for the life of the module,
// so a Hub that has none needs a module of its own.
const hub: HubConfig = {
	projectApiKey: 'ck_cloud_test',
	signingSecret: 'signing-secret',
	apiUrl: 'https://hub.test',
	instanceKey: 'main',
};
// Binding reads only the plugin's id and options.authType (to pick managed
// pricing), so the rest of a CorsairPlugin is left out of this fixture.
const plugin = {
	id: 'firecrawl',
	options: { authType: 'managed_pricing' as const },
} as unknown as CorsairPlugin;

afterEach(() => {
	jest.restoreAllMocks();
});

it('a Hub with no job kinds gets the calls it got before', async () => {
	// unknown: request bodies are parsed JSON, read with matchers.
	const sent: { url: string; body: Record<string, unknown> }[] = [];
	jest.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
		const url = String(input);
		sent.push({ url, body: JSON.parse(String(init?.body ?? '{}')) });
		const status = url.endsWith('/managed-pricing/job-kinds') ? 404 : 200;
		return new Response(
			JSON.stringify(
				status === 404
					? { error: 'Not found' }
					: { api_key: 'k', expires_in: 300 },
			),
			{ status, headers: { 'content-type': 'application/json' } },
		);
	});
	// unknown: bind writes bound functions of any shape into the tree.
	const tree: Record<string, unknown> = {};
	bindEndpointsRecursively({
		endpoints: {
			crawl: { start: async () => ({ success: true, id: 'crawl-abc' }) },
		},
		ctx: {},
		tree,
		pluginId: 'firecrawl',
		errorHandlers: {},
		currentPath: [],
		endpointMeta: { 'crawl.start': { riskLevel: 'write' } },
		tenantId: 'me',
		hubConfig: hub,
		plugin,
	});
	// bindEndpointsRecursively writes the bound function at crawl.start; the
	// test endpoint takes any input and is read with matchers, hence unknown.
	const api = tree as { crawl: { start: (args: unknown) => Promise<unknown> } };

	await expect(
		api.crawl.start({ url: 'https://example.com', limit: 50 }),
	).resolves.toMatchObject({
		id: 'crawl-abc',
	});
	const credentials = sent.filter((s) =>
		s.url.endsWith('/managed-pricing/credentials'),
	);
	expect(credentials[0]?.body).not.toHaveProperty('cap');
	expect(sent.some((s) => s.url.endsWith('/managed-pricing/jobs'))).toBe(false);
});
