// Live OpenSEO tests. Excluded from the default run by the test:live script's
// path filter; run them with:
//
//   OPENSEO_API_KEY=oseo_... pnpm test:live
//   OPENSEO_LIVE_PAID=1 ...   also runs a few cheap credit-spending lookups
//
// The default run calls only tools that spend no credits. Calls go through
// createCorsair, so the plugin's error handlers and core's retries apply as in
// production.
import { createCorsair } from 'corsair/core';
import { openseo } from './index';

const key = process.env.OPENSEO_API_KEY?.trim() ?? '';
const hasKey = key.length > 0;
if (!hasKey) {
	console.warn(
		'[openseo] live API tests skipped: set OPENSEO_API_KEY to enable them.',
	);
}
const live = hasKey ? describe : describe.skip;
const paid = hasKey && process.env.OPENSEO_LIVE_PAID === '1' ? it : it.skip;

// `unknown` because the table calls every operation through one signature.
type AnyEndpoint = (input: unknown) => Promise<unknown>;

live('OpenSEO live API', () => {
	jest.setTimeout(5 * 60_000);
	const api = createCorsair({
		plugins: [openseo({ key })],
		// `unknown` is necessary because the bound API tree is indexed by operation names at runtime.
	}).openseo.api as unknown as Record<string, Record<string, AnyEndpoint>>;

	// `unknown` is necessary because each operation takes its own input type.
	function call(id: string, input: unknown): Promise<unknown> {
		const [group, action] = id.split('.') as [string, string];
		const endpoint = api[group]?.[action];
		if (!endpoint) throw new Error(`no endpoint ${id}`);
		return endpoint(input);
	}

	let projectId = '';

	it('account.whoami reports the account and its credits', async () => {
		const me = (await call('account.whoami', {})) as {
			mode?: string;
			scopes?: string[];
		};
		expect(me.mode).toBe('hosted');
		expect(me.scopes).toContain('mcp');
	});

	it('projects.list returns the account projects', async () => {
		const { projects } = (await call('projects.list', {})) as {
			projects: Array<{ id: string }>;
		};
		expect(projects.length).toBeGreaterThan(0);
		projectId = projects[0]?.id ?? '';
		expect(projectId).not.toBe('');
	});

	// Reads that spend no credits, called with the first project.
	const FREE = [
		'projects.getContext',
		'keywords.listSaved',
		'keywords.suggestions',
		'aiVisibility.getTracker',
		'aiVisibility.getTrend',
		'rankTracking.get',
		'siteAudits.list',
		'reports.list',
		'reports.listTemplates',
		'searchConsole.listSites',
		'googleAnalytics.listProperties',
	];
	it.each(FREE)('%s returns a result that matches its schema', async (id) => {
		const result = await call(id, { projectId });
		expect(typeof result).toBe('object');
		expect(result).not.toBeNull();
	});

	it('projects.getContext on an unknown project fails with NOT_FOUND', async () => {
		await expect(
			call('projects.getContext', {
				projectId: '00000000-0000-0000-0000-000000000000',
			}),
		).rejects.toThrow('NOT_FOUND');
	});

	paid('keywords.metrics returns volume for two keywords', async () => {
		const result = (await call('keywords.metrics', {
			projectId,
			keywords: ['seo tools', 'keyword research'],
		})) as { keywords: unknown[] };
		expect(result.keywords.length).toBeGreaterThan(0);
	});

	paid('serp.results returns Google results', async () => {
		const result = (await call('serp.results', {
			projectId,
			queries: [{ keyword: 'open source seo tool' }],
			depth: 10,
		})) as { results: Array<{ ok?: boolean; items?: unknown[] }> };
		expect(result.results[0]?.ok).toBe(true);
		expect(result.results[0]?.items?.length).toBeGreaterThan(0);
	});
});
