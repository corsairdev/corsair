import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { zep } from './index';

/**
 * Live run against a Zep project. Skipped unless ZEP_API_KEY is set (CI
 * never runs files named api.test.ts).
 *
 *   ZEP_API_KEY=... npx jest api.test.ts
 *
 * Reads the project and the lists that need no arguments, then makes a
 * throwaway user with a thread and messages, and a throwaway graph with an
 * episode, reads the context and searches, and deletes all of it at the end
 * (even when a step fails). Agent Skills routes are left out: they are in
 * closed release.
 */
const key = process.env.ZEP_API_KEY;
const describeIfKey = key ? describe : describe.skip;
if (!key) console.warn('Skipping Zep live run: set ZEP_API_KEY.');

// `unknown` because each operation answers its own shape; steps read fields by name.
type Json = Record<string, unknown>;
const RUN = `corsair-live-${Date.now()}`;
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'zep', 'default');
	const corsair = createCorsair({
		plugins: [zep({ key })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

describeIfKey('zep live', () => {
	jest.setTimeout(180_000);
	let client: Awaited<ReturnType<typeof createClient>> | undefined;
	const made: Record<string, string> = {};

	const call = async (op: string, args: Json = {}): Promise<Json> => {
		// `unknown` because the walk goes through the generated API object by name.
		let fn: unknown = (client as NonNullable<typeof client>).corsair.zep.api;
		for (const part of op.split('.')) {
			fn = (fn as Record<string, unknown>)[part];
		}
		return (await (fn as (input: Json) => Promise<unknown>)(args)) as Json;
	};

	beforeAll(async () => {
		client = await createClient();
	});

	afterAll(async () => {
		if (made.thread) {
			await call('threads.delete', { thread_uuid: made.thread }).catch(
				() => undefined,
			);
		}
		if (made.user) {
			await call('users.delete', { user_uuid: made.user }).catch(
				() => undefined,
			);
		}
		if (made.graph) {
			await call('graphs.delete', { graph_uuid: made.graph }).catch(
				() => undefined,
			);
		}
		await client?.testDb.cleanup?.();
	});

	it.each([
		['project.get', {}],
		['users.list', { page_size: 5 }],
		['graphs.list', { page_size: 5 }],
		['tasks.list', { page_size: 5 }],
		['batches.list', { page_size: 5 }],
		['contextTemplates.list', { page_size: 5 }],
	] as const)('%s', async (op, args) => {
		await expect(call(op, args)).resolves.toBeDefined();
	});

	it('user, thread, messages and context', async () => {
		const user = await call('users.create', {
			user_id: RUN,
			first_name: 'Ada',
			email: `${RUN}@example.com`,
		});
		made.user = String(user.uuid);
		const thread = await call('threads.create', { user_uuid: made.user });
		made.thread = String(thread.uuid);
		await call('threads.messages.add', {
			thread_uuid: made.thread,
			messages: [
				{ role: 'user', name: 'Ada', content: 'I moved to Lisbon last month.' },
				{ role: 'assistant', content: 'Noted: you live in Lisbon now.' },
			],
		});
		await sleep(10_000);
		const context = await call('threads.getContext', {
			thread_uuid: made.thread,
		});
		expect(context).toBeDefined();
		await call('threads.messages.list', { thread_uuid: made.thread });
	});

	it('graph, episode and search', async () => {
		const graph = await call('graphs.create', { name: RUN });
		made.graph = String(graph.uuid);
		await call('graphs.episodes.add', {
			graph_uuid: made.graph,
			type: 'text',
			data: 'Ada Lovelace wrote the first published algorithm in 1843.',
		});
		await sleep(15_000);
		await call('graphs.searchEdges', {
			graph_uuid: made.graph,
			query: 'Who wrote the first algorithm?',
		});
		await call('graphs.nodes.list', { graph_uuid: made.graph, page_size: 5 });
		await call('graphs.episodes.list', { graph_uuid: made.graph });
	});
});
