import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { letta } from './index';

/**
 * Live run against Letta Cloud (or a server at LETTA_BASE_URL). Skipped unless
 * LETTA_API_KEY is set (CI never runs files named api.test.ts).
 *
 *   LETTA_API_KEY=... npx jest api.test.ts
 *
 * Reads the lists, then makes a throwaway block, agent and archival passage,
 * sends the agent one message (a few hundred tokens of the free credit) and
 * deletes everything at the end, even when a step fails.
 */
const key = process.env.LETTA_API_KEY;
const describeIfKey = key ? describe : describe.skip;
if (!key) console.warn('Skipping Letta live run: set LETTA_API_KEY.');

// `unknown` because each operation answers its own shape; steps read fields by name.
type Json = Record<string, unknown>;
const RUN = `corsair-live-${Date.now()}`;

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'letta', 'default');
	const corsair = createCorsair({
		plugins: [letta({ key, baseUrl: process.env.LETTA_BASE_URL })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

describeIfKey('letta live', () => {
	jest.setTimeout(180_000);
	let client: Awaited<ReturnType<typeof createClient>> | undefined;
	const made: Record<string, string> = {};

	const call = async (op: string, args: Json = {}): Promise<Json> => {
		// `unknown` because the walk goes through the generated API object by name.
		let fn: unknown = (client as NonNullable<typeof client>).corsair.letta.api;
		for (const part of op.split('.')) {
			fn = (fn as Record<string, unknown>)[part];
		}
		return (await (fn as (input: Json) => Promise<unknown>)(args)) as Json;
	};

	beforeAll(async () => {
		client = await createClient();
	});

	afterAll(async () => {
		if (made.agent)
			await call('agents.delete', { agent_id: made.agent }).catch(
				() => undefined,
			);
		if (made.block)
			await call('blocks.delete', { block_id: made.block }).catch(
				() => undefined,
			);
		await client?.testDb.cleanup?.();
	});

	it.each([
		['client.health', {}],
		['agents.list', { limit: 5 }],
		['blocks.list', { limit: 5 }],
		['tools.list', { limit: 5 }],
		['models.list', {}],
		['models.embeddings.list', {}],
		['folders.list', { limit: 5 }],
		['mcpServers.list', {}],
		['runs.list', { limit: 5 }],
		['tags.list', {}],
	] as const)('%s', async (op, args) => {
		await expect(call(op, args)).resolves.toBeDefined();
	});

	it('block, agent, passage and one message', async () => {
		const block = await call('blocks.create', {
			label: 'human',
			value: 'The user is Ada, a mathematician in London.',
		});
		made.block = String(block.id);
		const models = (await call('models.list', {})) as unknown as Json[];
		const agent = await call('agents.create', {
			name: RUN,
			model: String(models[0]?.handle),
			block_ids: [made.block],
		});
		made.agent = String(agent.id);
		await call('agents.get', { agent_id: made.agent });
		await call('agents.blocks.list', { agent_id: made.agent });
		await call('agents.passages.create', {
			agent_id: made.agent,
			text: 'Ada wrote the first published algorithm.',
		});
		await call('agents.passages.list', { agent_id: made.agent });
		const reply = await call('agents.messages.create', {
			agent_id: made.agent,
			input: 'In one sentence: who am I?',
		});
		expect(reply).toBeDefined();
		await call('agents.messages.list', { agent_id: made.agent, limit: 5 });
	});
});
