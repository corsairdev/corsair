import { workspaceLink } from './test-fixtures';
import {
	BASE,
	endpoints,
	installFetchMock,
	jsonResponse,
	lastCall,
	makeCtx,
	mockFetch,
	restoreFetchMock,
} from './test-helpers';

/**
 * Shapes and rules seen on the live API (box run, 2026-11-26), where they
 * differ from Linkly's OpenAPI 1.4.
 */
beforeEach(installFetchMock);
afterEach(restoreFetchMock);

describe('links.getDetails', () => {
	it('reads domain and domains as host names, the way the live API sends them', async () => {
		// Trimmed from a live answer; the spec types both as objects.
		mockFetch(
			jsonResponse({
				base62_id: '2TQ',
				clicks_count: 0,
				domain: 'linkly.link',
				domains: ['linkly.link', 'l.linklyhq.com'],
				link: workspaceLink,
			}),
		);

		const result = await endpoints.links.getDetails(makeCtx(), {
			id: 41657524,
		});

		expect(result.domain).toBe('linkly.link');
		expect(result.domains).toEqual(['linkly.link', 'l.linklyhq.com']);
	});
});

describe('webhook unsubscribes', () => {
	const hook = 'https://hooks.example.com/linkly';

	it('accept the empty 200 Linkly sends for a workspace webhook', async () => {
		mockFetch(new Response(null, { status: 200 }));

		await expect(
			endpoints.webhooks.unsubscribe(makeCtx(), {
				workspace_id: 42,
				hook_id: hook,
			}),
		).resolves.toBeUndefined();
	});

	it('accept the empty 200 Linkly sends for a link webhook', async () => {
		mockFetch(new Response(null, { status: 200 }));

		await expect(
			endpoints.webhooks.unsubscribeFromLink(makeCtx(), {
				link_id: 30,
				hook_id: hook,
			}),
		).resolves.toBeUndefined();
	});
});

describe('click filters', () => {
	it('take a numeric link_id, the type every link answer carries', async () => {
		mockFetch(jsonResponse({ traffic: [] }));

		await endpoints.clicks.getTimeSeries(makeCtx(), {
			workspace_id: 42,
			link_id: 30,
		});

		expect(new URL(lastCall().url).searchParams.get('link_id')).toBe('30');
		expect(
			lastCall().url.startsWith(`${BASE}/api/v1/workspace/42/clicks`),
		).toBe(true);
	});
});
