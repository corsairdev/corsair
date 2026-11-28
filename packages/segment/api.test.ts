import { writeFileSync } from 'node:fs';
import { segmentEndpointsNested } from './endpoints/catalog';
import type { SegmentContext } from './index';

/**
 * Live run against a real Segment workspace. Skipped unless a credential is
 * set (CI never runs files named api.test.ts):
 *
 *   SEGMENT_PUBLIC_API_TOKEN=sgp_... SEGMENT_WRITE_KEY=... [SEGMENT_REGION=eu] npx jest api.test.ts
 *
 * SEGMENT_PUBLIC_API_TOKEN (Team or Business plan) runs the workspace reads
 * and a label + source round trip (both deleted again). SEGMENT_WRITE_KEY
 * sends identify, track, page and batch calls to that source: use a test
 * source with no destinations connected. Optional: SEGMENT_LIVE_REPORT=<file>
 * writes each step's outcome as JSON.
 */
const token = process.env.SEGMENT_PUBLIC_API_TOKEN;
const writeKey = process.env.SEGMENT_WRITE_KEY;
const region = process.env.SEGMENT_REGION === 'eu' ? 'eu' : 'us';
const describeIfToken = token ? describe : describe.skip;
const describeIfWriteKey = writeKey ? describe : describe.skip;
if (!token || !writeKey) {
	console.warn(
		`Skipping Segment live run${token || writeKey ? ' in part' : ''}: set SEGMENT_PUBLIC_API_TOKEN and SEGMENT_WRITE_KEY.`,
	);
}

const STAMP = Date.now().toString(36);
type Step = { id: string; ok: boolean; expected?: boolean; note?: string };
const steps: Step[] = [];

function ctx(): SegmentContext {
	const key = token ?? writeKey ?? '';
	return {
		endpoints: {},
		$getAccountId: () => Promise.resolve('live-account'),
		key,
		options: { region, ...(writeKey ? { writeKey } : {}) },
		keys: { get_api_key: () => Promise.resolve(key) },
		db: {},
		// `unknown` because a live context fills only the fields the endpoints read.
	} as unknown as SegmentContext;
}

// `unknown` because the walk goes through nested groups of endpoints.
async function run(
	id: string,
	input: Record<string, unknown> = {},
	expect403 = false,
): Promise<unknown> {
	let node: unknown = segmentEndpointsNested;
	for (const part of id.split('.'))
		node = (node as Record<string, unknown>)[part];
	try {
		const result = await (
			node as (c: SegmentContext, i: unknown) => Promise<unknown>
		)(ctx(), input);
		steps.push({ id, ok: true });
		return result;
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		// A plan or role without the feature answers 403: expected where marked.
		if (expect403 && /Segment 403/.test(message)) {
			steps.push({ id, ok: true, expected: true, note: message.slice(0, 160) });
			return undefined;
		}
		steps.push({ id, ok: false, note: message.slice(0, 300) });
		throw error;
	}
}

// `unknown` because the value is any parsed response.
function pick(value: unknown, ...path: string[]): unknown {
	let node = value;
	for (const part of path) {
		node =
			typeof node === 'object' && node !== null
				? (node as Record<string, unknown>)[part]
				: undefined;
	}
	return node;
}

afterAll(() => {
	if (process.env.SEGMENT_LIVE_REPORT) {
		writeFileSync(
			process.env.SEGMENT_LIVE_REPORT,
			JSON.stringify(steps, null, 2),
		);
	}
});

describeIfToken('Segment Public API (live)', () => {
	jest.setTimeout(120_000);

	it('reads the workspace and its resources', async () => {
		const workspace = await run('workspaces.get');
		expect(pick(workspace, 'data', 'workspace', 'id')).toEqual(
			expect.any(String),
		);
		await run('testing.echo', { message: `corsair-${STAMP}` });
		for (const id of [
			'sources.list',
			'destinations.list',
			'warehouses.list',
			'trackingPlans.list',
			'functions.list',
			'transformations.list',
			'users.list',
			'invites.list',
			'userGroups.list',
			'roles.list',
			'labels.list',
			'credentials.list',
			'regulations.list',
			'regulations.listSuppressions',
			'auditTrail.list',
			'catalog.listSources',
			'catalog.listDestinations',
			'catalog.listWarehouses',
			'usage.getDailyApiCalls',
			'usage.getDailyMtu',
		]) {
			const input = id.startsWith('usage.')
				? { period: `${new Date().toISOString().slice(0, 7)}-01` }
				: { pagination: { count: 10 } };
			await run(id, input, true);
		}
		await run('spaces.list', {}, true);
	});

	it('creates and deletes a label', async () => {
		const label = {
			key: 'corsair',
			value: `t-${STAMP}`,
			description: 'Corsair live test',
		};
		await run('labels.create', { label });
		await run('labels.delete', { key: label.key, value: label.value });
	});

	it('creates, reads and deletes an HTTP API source', async () => {
		const catalog = await run('catalog.listSources', {
			pagination: { count: 200 },
		});
		const http = (
			pick(catalog, 'data', 'sourcesCatalog') as
				| Array<Record<string, unknown>>
				| undefined
		)?.find((s) => s.slug === 'http-api' || s.slug === 'http');
		expect(http?.id).toEqual(expect.any(String));
		const created = await run('sources.create', {
			slug: `corsair-live-${STAMP}`,
			enabled: false,
			metadataId: http?.id,
		});
		const sourceId = String(pick(created, 'data', 'source', 'id'));
		try {
			await run('sources.get', { sourceId });
			await run('sources.update', { sourceId, name: `Corsair live ${STAMP}` });
			await run('sources.getSchemaSettings', { sourceId });
			await run('sources.listConnectedDestinations', { sourceId });
		} finally {
			await run('sources.delete', { sourceId });
		}
	});
});

describeIfWriteKey('Segment Tracking API (live)', () => {
	jest.setTimeout(60_000);
	const userId = `corsair-live-${STAMP}`;

	it('sends identify, track, page, screen, group, alias and batch calls', async () => {
		expect(
			await run('tracking.identify', { userId, traits: { plan: 'test' } }),
		).toMatchObject({ success: true });
		expect(
			await run('tracking.track', {
				userId,
				event: 'Corsair Live Test',
				properties: { stamp: STAMP },
			}),
		).toMatchObject({ success: true });
		await run('tracking.page', { userId, name: 'Corsair live test' });
		await run('tracking.screen', { userId, name: 'Corsair live test' });
		await run('tracking.group', {
			userId,
			groupId: `corsair-${STAMP}`,
			traits: { name: 'Corsair test' },
		});
		await run('tracking.alias', { userId, previousId: `anon-${STAMP}` });
		await run('tracking.batch', {
			batch: [
				{ type: 'track', userId, event: 'Corsair Batch One' },
				{ type: 'track', userId, event: 'Corsair Batch Two' },
			],
		});
	});
});
