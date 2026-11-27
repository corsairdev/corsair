import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { browserbase } from './index';

/**
 * Live run against a Browserbase project. Skipped unless BROWSERBASE_API_KEY
 * is set (CI never runs files named api.test.ts).
 *
 *   BROWSERBASE_API_KEY=... npx jest api.test.ts
 *
 * Uses about a minute of browser time: one session that is released at once,
 * plus one fetch and one search. Labels, a context and a navigation policy are
 * made and deleted; cleanup runs even when a step fails. Functions and agents
 * are left out (they need deployed code or spend model tokens).
 */
const key = process.env.BROWSERBASE_API_KEY;
const describeIfKey = key ? describe : describe.skip;
if (!key)
	console.warn('Skipping Browserbase live run: set BROWSERBASE_API_KEY.');

// `unknown` because each operation answers its own shape; steps read fields by name.
type Json = Record<string, unknown>;
const RUN = `corsair-live-${Date.now()}`;

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'browserbase', 'default');
	const corsair = createCorsair({
		plugins: [browserbase({ key })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

describeIfKey('browserbase live', () => {
	jest.setTimeout(180_000);
	let client: Awaited<ReturnType<typeof createClient>> | undefined;
	const made: Record<string, string> = {};

	const call = async (op: string, args: Json = {}): Promise<Json> => {
		// `unknown` because the walk goes through the generated API object by name.
		let fn: unknown = (client as NonNullable<typeof client>).corsair.browserbase
			.api;
		for (const part of op.split('.')) {
			fn = (fn as Record<string, unknown>)[part];
		}
		return (await (fn as (input: Json) => Promise<unknown>)(args)) as Json;
	};

	beforeAll(async () => {
		client = await createClient();
	});

	afterAll(async () => {
		const undo: Array<[string, Json]> = [];
		if (made.session) {
			undo.push([
				'sessions.update',
				{ id: made.session, status: 'REQUEST_RELEASE' },
			]);
		}
		if (made.label) undo.push(['labels.delete', { labelId: made.label }]);
		if (made.context) undo.push(['contexts.delete', { id: made.context }]);
		if (made.policy)
			undo.push(['navigationPolicies.delete', { id: made.policy }]);
		for (const [op, args] of undo) await call(op, args).catch(() => undefined);
		await client?.testDb.cleanup?.();
	});

	it('projects, usage and lists', async () => {
		const projects = (await call('projects.list')) as unknown as Json[];
		made.project = String(projects[0]?.id);
		await call('projects.usage', { id: made.project });
		await call('sessions.list', {});
		await call('labels.list', {});
		await call('secrets.keypair', {});
	});

	it('fetch and search', async () => {
		const page = await call('fetch.page', { url: 'https://example.com' });
		expect(page).toBeDefined();
		await call('search.web', {
			query: 'Browserbase headless browser',
			numResults: 3,
		});
	});

	it('labels, context and navigation policy', async () => {
		const label = await call('labels.create', { name: RUN });
		made.label = String(label.id);
		await call('labels.update', {
			labelId: made.label,
			name: `${RUN}-renamed`,
		});
		const context = await call('contexts.create', { projectId: made.project });
		made.context = String(context.id);
		await call('contexts.get', { id: made.context });
		const policy = await call('navigationPolicies.create', { name: RUN });
		made.policy = String(policy.id);
		await call('navigationPolicies.get', { id: made.policy });
	});

	it('a session, start to release', async () => {
		const session = await call('sessions.create', {
			projectId: made.project,
			timeout: 120,
		});
		made.session = String(session.id);
		await call('sessions.get', { id: made.session });
		await call('sessions.debug', { id: made.session });
		await call('sessions.setLabels', {
			id: made.session,
			labels: [made.label],
		});
		await call('sessions.update', {
			id: made.session,
			status: 'REQUEST_RELEASE',
		});
		made.session = '';
		await call('sessions.logs', { id: String(session.id) });
	});
});
