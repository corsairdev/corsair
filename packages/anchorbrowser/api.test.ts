import type { AnchorBrowserContext } from './index';
import {
	AnchorBrowserProfile,
	AnchorBrowserSession,
	AnchorBrowserTask,
} from './schema/database';

/**
 * Live suite. Runs only with a real key and an explicit opt-in, and is excluded
 * from CI by path. Every assertion below hits api.anchorbrowser.io.
 *
 * Enable with:
 *   ANCHOR_BROWSER_API_KEY=... LIVE_TEST=1 pnpm --filter @corsair-dev/anchorbrowser test
 *
 * Only read-only operations are exercised; starting a browser session consumes
 * account credits, so session creation is deliberately not called here.
 */
const TEST_API_KEY = process.env.ANCHOR_BROWSER_API_KEY;
const LIVE_TEST_FLAG =
	process.env.LIVE_TEST === '1' || process.env.LIVE_TEST === 'true';

type NestedEndpoints = Record<
	string,
	Record<
		string,
		(
			ctx: AnchorBrowserContext,
			input: Record<string, unknown>,
		) => Promise<unknown>
	>
>;

let ops: NestedEndpoints;

/** Definite lookup — the plugin shape is asserted in plugin.test.ts. */
function op(group: string, name: string) {
	const handler = ops[group]?.[name];
	if (!handler) throw new Error(`missing endpoint ${group}.${name}`);
	return handler;
}

function testCtx(): AnchorBrowserContext {
	return {
		key: TEST_API_KEY,
		options: { authType: 'api_key' },
		db: {},
	} as unknown as AnchorBrowserContext;
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Anchor Browser wraps list responses in `{ data: { <collection>: [...] } }`. */
function itemsOf(response: unknown, ...keys: string[]): unknown[] {
	const payload =
		isRecord(response) && isRecord(response.data) ? response.data : response;
	if (!isRecord(payload)) return [];
	for (const key of keys) {
		const value = payload[key];
		if (Array.isArray(value)) return value;
	}
	return [];
}

const testSuite = TEST_API_KEY && LIVE_TEST_FLAG ? describe : describe.skip;

testSuite('AnchorBrowser live API', () => {
	beforeAll(async () => {
		const mod = await import('./endpoints');
		ops = mod.anchorBrowserEndpointsNested as unknown as NestedEndpoints;
	});

	it('listSessions returns the session collection', async () => {
		const response = await op('sessions', 'listSessions')(testCtx(), {});

		for (const item of itemsOf(response, 'sessions', 'items')) {
			expect(() => AnchorBrowserSession.parse(item)).not.toThrow();
		}
	});

	it('listSessions accepts the documented pagination parameters', async () => {
		const response = await op('sessions', 'listSessions')(testCtx(), {
			page: 1,
			limit: 10,
		});

		const data = (response as { data?: Record<string, unknown> }).data;
		expect(data).toBeDefined();
		expect(typeof data?.page).toBe('number');
		expect(typeof data?.total_pages).toBe('number');
	});

	it('listProfiles returns profiles matching the entity schema', async () => {
		const response = await op('profiles', 'listProfiles')(testCtx(), {});

		for (const item of itemsOf(response, 'items', 'profiles')) {
			expect(() => AnchorBrowserProfile.parse(item)).not.toThrow();
		}
	});

	it('listTasks returns tasks matching the entity schema', async () => {
		const response = await op('tasks', 'listTasks')(testCtx(), {});

		const items = itemsOf(response, 'tasks', 'items');
		for (const item of items) {
			expect(() => AnchorBrowserTask.parse(item)).not.toThrow();
			expect(isRecord(item)).toBe(true);
			expect(typeof (item as Record<string, unknown>).id).toBe('string');
		}
	});

	it('listExtensions succeeds', async () => {
		await expect(
			op('extensions', 'listExtensions')(testCtx(), {}),
		).resolves.toBeDefined();
	});

	it('listIntegrations succeeds', async () => {
		await expect(
			op('integrations', 'listIntegrations')(testCtx(), {}),
		).resolves.toBeDefined();
	});

	it('rejects an invalid API key', async () => {
		const badCtx = {
			key: 'sk-invalid-key-for-testing',
			options: { authType: 'api_key' },
			db: {},
		} as unknown as AnchorBrowserContext;

		await expect(op('sessions', 'listSessions')(badCtx, {})).rejects.toThrow();
	});
});
