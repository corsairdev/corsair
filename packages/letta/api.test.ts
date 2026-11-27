import { writeFileSync } from 'node:fs';
import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { letta } from './index';

/**
 * Live run against Letta Cloud (or a server at LETTA_BASE_URL). Skipped unless
 * LETTA_API_KEY is set (CI never runs files named api.test.ts).
 *
 *   LETTA_API_KEY=... npx jest api.test.ts
 *   (LETTA_LIVE_REPORT=<file> also writes one line per operation;
 *    LETTA_LIVE_MODEL picks the model, default letta/echo, which costs nothing)
 *
 * Every step goes through createCorsair, so a pass means Letta answered 2xx
 * and the body matched the operation's output schema. The run makes a
 * throwaway block, tool, agent, conversation, MCP server (DeepWiki's public
 * one), scheduled message and access token named corsair-live-<timestamp>, and
 * deletes all of them at the end, even when a step fails.
 */
const key = process.env.LETTA_API_KEY;
const describeIfKey = key ? describe : describe.skip;
if (!key) console.warn('Skipping Letta live run: set LETTA_API_KEY.');

// `unknown` because each operation answers its own shape; steps read fields by name.
type Json = Record<string, unknown>;
const RUN = `corsair-live-${Date.now()}`;
const MODEL = process.env.LETTA_LIVE_MODEL ?? 'letta/echo';
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
/** Letta lists come back as a bare array or a `{ <field>: [...] }` page. */
const rows = (value: unknown, field?: string): Json[] =>
	Array.isArray(value)
		? (value as Json[])
		: (((value as Json | undefined)?.[field ?? 'items'] as
				| Json[]
				| undefined) ?? []);
const TOOL_SOURCE = `def corsair_live_add(a: int, b: int) -> int:
    """Add two numbers.

    Args:
        a: The first number.
        b: The second number.

    Returns:
        The sum.
    """
    return a + b
`;

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
	jest.setTimeout(600_000);
	let client: Awaited<ReturnType<typeof createClient>> | undefined;
	const report: Array<{ op: string; ok: boolean; note: string }> = [];
	const made: Record<string, string | undefined> = {};

	const call = async (op: string, args: Json = {}): Promise<Json> => {
		// `unknown` because the walk goes through the generated API object by name.
		let fn: unknown = (client as NonNullable<typeof client>).corsair.letta.api;
		for (const part of op.split('.')) {
			fn = (fn as Record<string, unknown>)[part];
		}
		return (await (fn as (input: Json) => Promise<unknown>)(args)) as Json;
	};
	/** Runs one operation and records it; a failure is recorded, not thrown. */
	const step = async (
		op: string,
		args: Json = {},
		note: (out: Json) => string = () => 'ok',
	): Promise<Json | undefined> => {
		try {
			const out = await call(op, args);
			report.push({ op, ok: true, note: note(out) });
			return out;
		} catch (error) {
			report.push({ op, ok: false, note: (error as Error).message });
			return undefined;
		}
	};
	/** An operation Letta refuses for a reason outside the plugin (no such route, no object to act on). */
	const refused = async (op: string, args: Json, status: RegExp) => {
		try {
			await call(op, args);
			report.push({ op, ok: true, note: 'ok (expected a refusal)' });
		} catch (error) {
			const message = (error as Error).message;
			report.push({
				op,
				ok: status.test(message),
				note: `refused as expected: ${message}`,
			});
		}
	};

	beforeAll(async () => {
		client = await createClient();
	});

	afterAll(async () => {
		if (client) {
			const cleanup: Array<[string, Json]> = [];
			if (made.token)
				cleanup.push(['accessTokens.delete', { token: made.token }]);
			if (made.conversation) {
				cleanup.push([
					'conversations.delete',
					{ conversation_id: made.conversation },
				]);
			}
			if (made.agent) cleanup.push(['agents.delete', { agent_id: made.agent }]);
			for (const name of ['block', 'block2']) {
				if (made[name])
					cleanup.push(['blocks.delete', { block_id: made[name] }]);
			}
			if (made.tool) cleanup.push(['tools.delete', { tool_id: made.tool }]);
			if (made.mcp) {
				cleanup.push(['mcpServers.delete', { mcp_server_id: made.mcp }]);
			}
			for (const [op, args] of cleanup) {
				await call(op, args).catch((error) =>
					console.warn(`cleanup ${op}: ${(error as Error).message}`),
				);
			}
			await client.testDb.cleanup?.();
		}
		const file = process.env.LETTA_LIVE_REPORT;
		if (file) writeFileSync(file, JSON.stringify(report, null, 2));
		const passed = report.filter((r) => r.ok).length;
		console.log(
			`letta live: ${passed}/${report.length} steps ok\n${report
				.map((r) => `${r.ok ? 'ok  ' : 'FAIL'} ${r.op}: ${r.note}`)
				.join('\n')}`,
		);
	});

	it('reads that need no ids', async () => {
		await step('client.health');
		await step('models.list', {}, (out) => `${rows(out).length} models`);
		await step('models.embeddings.list');
		await step('agents.list', { limit: 5 });
		await step('blocks.list', { limit: 5 });
		await step('tools.list', { limit: 5 });
		// A new organization has no tool index yet (400 from Turbopuffer) until it
		// creates a tool; the 'blocks and tools' step searches again after that.
		try {
			await call('tools.search', { query: 'send message', limit: 3 });
		} catch {
			/* recorded by the second search */
		}
		await step('mcpServers.list');
		await step('runs.list', { limit: 5 });
		await step('messages.list', { limit: 5 });
		await step('conversations.list', { limit: 5 });
		await step('tags.list', { limit: 5 });
		await step('environments.list', {});
		await step('accessTokens.list', {});
	});

	it('blocks and tools', async () => {
		const block = await step('blocks.create', {
			label: 'human',
			value: 'The user is Ada, a mathematician in London.',
		});
		if (block) {
			made.block = String(block.id);
			await step('blocks.get', { block_id: made.block });
			await step('blocks.update', {
				block_id: made.block,
				value: 'The user is Ada Lovelace, a mathematician in London.',
			});
		}
		const block2 = await step('blocks.create', {
			label: 'project',
			value: 'Ada is writing notes on the Analytical Engine.',
		});
		if (block2) made.block2 = String(block2.id);
		const tool = await step('tools.create', {
			source_code: TOOL_SOURCE,
			description: 'Add two numbers (corsair live run).',
			tags: [RUN],
		});
		if (tool) {
			made.tool = String(tool.id);
			await step('tools.get', { tool_id: made.tool });
			await step('tools.update', {
				tool_id: made.tool,
				description: 'Add two numbers (corsair live run, updated).',
			});
			await step('tools.search', { query: 'add two numbers', limit: 3 });
			await step('tools.upsert', {
				source_code: TOOL_SOURCE,
				description: 'Add two numbers (corsair live run, upserted).',
				tags: [RUN],
			});
		}
	});

	it('agent: memory, tools, passages, schedule, messages and runs', async () => {
		if (!made.block) return;
		const agent = await step('agents.create', {
			name: RUN,
			model: MODEL,
			embedding: 'openai/text-embedding-3-small',
			block_ids: [made.block],
			tags: [RUN],
		});
		if (!agent) return;
		made.agent = String(agent.id);
		const a = { agent_id: made.agent };
		await step('agents.get', a);
		await step('agents.update', { ...a, description: 'corsair live run' });
		await step('agents.recompile', { ...a, dry_run: true });
		await step('agents.blocks.list', a);
		await step('agents.blocks.get', { ...a, block_label: 'human' });
		await step('agents.blocks.update', {
			...a,
			block_label: 'human',
			value: 'The user is Ada; she prefers short answers.',
		});
		if (made.block2) {
			await step('agents.blocks.attach', { ...a, block_id: made.block2 });
			await step('blocks.agents.list', { block_id: made.block2 });
			await step('agents.blocks.detach', { ...a, block_id: made.block2 });
		}
		await step('agents.tools.list', a);
		if (made.tool) {
			const t = { ...a, tool_id: made.tool };
			await step('agents.tools.attach', t);
			await step(
				'agents.tools.run',
				{ ...a, tool_name: 'corsair_live_add', args: { a: 2, b: 3 } },
				(out) =>
					`returned ${JSON.stringify(out.tool_return ?? out.func_return)}`,
			);
			await step('agents.tools.detach', t);
		}
		const passage = await step('agents.passages.create', {
			...a,
			text: 'Ada wrote the first published algorithm in 1843.',
			tags: ['history'],
		});
		await step('agents.passages.list', a);
		const passageId = rows(passage)[0]?.id ?? passage?.id;
		if (passageId) {
			await step('agents.passages.delete', { ...a, memory_id: passageId });
		}
		const scheduled = await step('agents.schedule.create', {
			...a,
			messages: [{ role: 'user', content: 'Reminder: check the notes.' }],
			schedule: {
				type: 'one-time',
				scheduled_at: Date.now() + 30 * 24 * 3600 * 1000,
			},
		});
		await step('agents.schedule.list', a);
		if (scheduled?.id) {
			const sm = { ...a, scheduled_message_id: scheduled.id };
			await step('agents.schedule.get', sm);
			await step('agents.schedule.delete', sm);
		}

		const reply = await step(
			'agents.messages.create',
			{ ...a, input: 'In one sentence: who am I?' },
			(out) => `${rows(out, 'messages').length} messages back`,
		);
		await step('agents.messages.list', { ...a, limit: 10 });
		await step(
			'agents.messages.stream',
			{ ...a, input: 'Say hi.', streaming: true },
			(out) => `${String(out.text).length} chars of events`,
		);
		// A background run can be streamed again by its id.
		const background = await step(
			'agents.messages.stream',
			{ ...a, input: 'Say hello again.', streaming: true, background: true },
			(out) => `${String(out.text).length} chars of events (background)`,
		);
		const backgroundRun = /"run_id":\s*"([^"]+)"/.exec(
			String(background?.text ?? ''),
		)?.[1];
		const firstMessage = rows(reply, 'messages')[0];
		if (firstMessage?.id) {
			await step('messages.get', { message_id: firstMessage.id });
		}
		await step('messages.search', { query: 'who am I', agent_id: made.agent });
		const runId = rows(reply, 'messages')[0]?.run_id;
		if (runId) {
			for (let i = 0; i < 10; i++) {
				const run = await call('runs.get', { run_id: runId });
				if (run.status !== 'created' && run.status !== 'running') break;
				await sleep(2_000);
			}
			const r = { run_id: runId };
			await step('runs.get', r, (out) => String(out.status));
			await step('runs.messages.list', r);
			await step('runs.usage.get', r);
		}
		if (backgroundRun) {
			await step(
				'runs.messages.stream',
				{ run_id: backgroundRun, agent_id: made.agent },
				(out) => `${String(out.text).length} chars of events`,
			);
		}
		// Nothing is running by now, and four messages are too few to compact.
		await refused('agents.messages.cancel', { ...a, run_ids: [] }, /\b409\b/);
		await refused('agents.messages.compact', a, /\b400\b/);
		await step('agents.messages.reset', {
			...a,
			add_default_initial_messages: false,
		});

		const fake = 'identity-00000000-0000-4000-8000-000000000000';
		await refused(
			'agents.identities.attach',
			{ ...a, identity_id: fake },
			/\b(400|404|422)\b/,
		);
		await refused(
			'agents.identities.detach',
			{ ...a, identity_id: fake },
			/\b(400|404|422)\b/,
		);
		await refused(
			'agents.archives.attach',
			{ ...a, archive_id: 'archive-00000000-0000-4000-8000-000000000000' },
			/\b(400|404|422)\b/,
		);
		await refused(
			'agents.archives.detach',
			{ ...a, archive_id: 'archive-00000000-0000-4000-8000-000000000000' },
			/\b(400|404|422)\b/,
		);
		await refused(
			'agents.folders.attach',
			{ ...a, folder_id: 'source-00000000-0000-4000-8000-000000000000' },
			/\b(400|404|422)\b/,
		);
		await refused(
			'agents.folders.detach',
			{ ...a, folder_id: 'source-00000000-0000-4000-8000-000000000000' },
			/\b(400|404|422)\b/,
		);
		await refused(
			'agents.files.open',
			{ ...a, file_id: 'file-00000000-0000-4000-8000-000000000000' },
			/\b(400|404|422)\b/,
		);
		await refused(
			'agents.files.close',
			{ ...a, file_id: 'file-00000000-0000-4000-8000-000000000000' },
			/\b(400|404|422)\b/,
		);
	});

	it('conversations', async () => {
		if (!made.agent) return;
		const conversation = await step('conversations.create', {
			agent_id: made.agent,
			summary: RUN,
		});
		if (!conversation) return;
		made.conversation = String(conversation.id);
		const c = { conversation_id: made.conversation };
		await step('conversations.get', c);
		await step('conversations.update', { ...c, description: 'corsair live' });
		await step(
			'conversations.messages.create',
			{ ...c, input: 'Hello from the conversation.' },
			(out) => (typeof out === 'string' ? 'streamed (default)' : 'json'),
		);
		await step('conversations.messages.create', {
			...c,
			input: 'And once more, as JSON.',
			streaming: false,
		});
		await step('conversations.messages.list', c);
		await step('conversations.recompile', { ...c, dry_run: true });
		// Streaming a conversation needs an active run; cancel needs one too.
		await refused('conversations.messages.stream', c, /\b400\b/);
		await refused('conversations.cancel', c, /\b409\b/);
		await refused('conversations.messages.compact', c, /\b400\b/);
		const fork = await step('conversations.fork', c);
		if (fork?.id) {
			await step('conversations.delete', { conversation_id: fork.id });
		}
		await step('conversations.delete', c);
		made.conversation = undefined;
	});

	it('MCP server (DeepWiki, public) and access tokens', async () => {
		const server = await step('mcpServers.create', {
			server_name: `corsair_live_${Date.now()}`,
			config: {
				mcp_server_type: 'streamable_http',
				server_url: 'https://mcp.deepwiki.com/mcp',
			},
		});
		if (server?.id) {
			made.mcp = String(server.id);
			const m = { mcp_server_id: made.mcp };
			await step('mcpServers.get', m);
			const tools = await step('mcpServers.tools.list', m);
			const tool = rows(tools).find((t) =>
				String(t.name).endsWith('read_wiki_structure'),
			);
			if (tool?.id) {
				await step('mcpServers.tools.get', { ...m, tool_id: tool.id });
				await step('mcpServers.tools.run', {
					...m,
					tool_id: tool.id,
					args: { repoName: 'letta-ai/letta' },
				});
			}
			await step('mcpServers.refresh', m);
			await step('mcpServers.update', {
				...m,
				config: {
					mcp_server_type: 'streamable_http',
					server_url: 'https://mcp.deepwiki.com/mcp',
				},
			});
			await step('mcpServers.delete', m);
			made.mcp = undefined;
		}
		if (made.agent) {
			const token = await step('accessTokens.create', {
				hostname: 'https://example.com',
				policy: [{ type: 'agent', id: made.agent, access: ['read_messages'] }],
			});
			if (token?.token) {
				made.token = String(token.token);
				await step('accessTokens.list', { agentId: made.agent });
				// Letta refuses every delete (400, its own body check); the token expires in 5 minutes.
				await refused('accessTokens.delete', { token: made.token }, /\b400\b/);
				made.token = undefined;
			}
		}
		await refused(
			'environments.get',
			{ deviceId: 'corsair-live-none' },
			/\b(400|404)\b/,
		);
		await refused(
			'environments.sendMessage',
			{
				connectionId: 'corsair-live-none',
				messages: [{ role: 'user', content: 'hi', client_message_id: RUN }],
			},
			/\b(400|404|422)\b/,
		);
	});

	it('routes Letta Cloud does not serve (11-27)', async () => {
		// Letta Cloud's gateway answers "Cannot <METHOD> <path>" (404) for these,
		// though the reference lists them.
		const none = /\b404\b/;
		await refused('archives.list', {}, none);
		await refused('archives.create', { name: RUN }, none);
		await refused('folders.list', {}, none);
		await refused('folders.create', { name: RUN }, none);
		await refused(
			'templates.create',
			{ body: { type: 'agent', agent_id: made.agent ?? 'agent-x' } },
			none,
		);
		await refused('passages.search', { query: 'algorithm' }, none);
		await refused('steps.list', { limit: 5 }, none);
		await refused('steps.get', { step_id: 'step-x' }, none);
		await refused('runs.steps.list', { run_id: 'run-x' }, none);
		await refused('runs.trace.get', { run_id: 'run-x' }, none);
		if (made.agent) {
			const a = { agent_id: made.agent };
			await refused('agents.exportFile', a, none);
			await refused('agents.messages.createAsync', { ...a, input: 'hi' }, none);
			await refused(
				'agents.tools.updateApproval',
				{ ...a, tool_name: 'send_message', requires_approval: false },
				none,
			);
			await refused('agents.files.list', a, none);
			await refused('agents.files.closeAll', a, none);
			await refused('agents.folders.list', a, none);
			await refused('agents.passages.search', { ...a, query: 'x' }, none);
		}
		await refused(
			'agents.importFile',
			{
				file: {
					base64: Buffer.from('{}').toString('base64'),
					filename: 'agent.af',
					contentType: 'application/json',
				},
			},
			none,
		);
	});

	it('deletes what it made', async () => {
		if (made.agent) {
			await step('agents.delete', { agent_id: made.agent });
			made.agent = undefined;
		}
		for (const name of ['block', 'block2']) {
			if (made[name]) {
				await step('blocks.delete', { block_id: made[name] });
				made[name] = undefined;
			}
		}
		if (made.tool) {
			await step('tools.delete', { tool_id: made.tool });
			made.tool = undefined;
		}
		const failed = report.filter((r) => !r.ok);
		expect(failed).toEqual([]);
	});
});
