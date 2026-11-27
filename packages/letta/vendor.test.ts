import {
	lettaEndpointsNested as api,
	lettaEndpointMeta,
} from './endpoints/catalog';
import type { LettaContext } from './index';

// Routes written by hand from Letta's API reference (docs.letta.com/api) and
// its TypeScript SDK (letta-ai/letta-node), not read from the manifest.

type Captured = {
	url: URL;
	method: string;
	headers: Record<string, string>;
	// `unknown` because the sent body is a JSON string or a FormData.
	body: unknown;
};
let calls: Captured[] = [];

function reply(
	// `unknown` because each case answers its own body.
	body: unknown,
	status = 200,
	contentType = 'application/json',
) {
	jest.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
		const headers: Record<string, string> = {};
		new Headers(init?.headers).forEach((value, key) => {
			headers[key] = value;
		});
		calls.push({
			url: new URL(String(input)),
			method: init?.method ?? 'GET',
			headers,
			body: init?.body,
		});
		const payload =
			body === undefined
				? null
				: typeof body === 'string'
					? body
					: JSON.stringify(body);
		return new Response(payload, {
			status,
			headers: body === undefined ? {} : { 'content-type': contentType },
		});
	});
}

function ctx(options: Record<string, string> = {}): LettaContext {
	return {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: 'letta_test_key',
		options,
		keys: {},
		db: {},
		// `unknown` because a test context fills only the fields the endpoints read.
	} as unknown as LettaContext;
}

const AGENT = 'agent-3f0e6a2c-8b1d-4c7e-9a52-1d2e3f4a5b6c';
beforeEach(() => {
	calls = [];
});
afterEach(() => jest.restoreAllMocks());

describe('letta routes', () => {
	it('lists agents with Bearer auth on Letta Cloud', async () => {
		reply([]);
		await api.agents.list(ctx(), { limit: 5 });
		expect(calls[0]?.url.href).toBe('https://api.letta.com/v1/agents/?limit=5');
		expect(calls[0]?.headers.authorization).toBe('Bearer letta_test_key');
	});

	it('talks to a self-hosted server through baseUrl', async () => {
		reply([]);
		await api.agents.list(ctx({ baseUrl: 'http://localhost:8283' }), {});
		expect(calls[0]?.url.origin).toBe('http://localhost:8283');
		expect(calls[0]?.url.pathname).toBe('/v1/agents/');
	});

	it('sends a message to an agent', async () => {
		reply({ messages: [], usage: {} });
		await api.agents.messages.create(ctx(), {
			agent_id: AGENT,
			input: 'What do you remember about me?',
		});
		expect(calls[0]?.method).toBe('POST');
		expect(calls[0]?.url.pathname).toBe(`/v1/agents/${AGENT}/messages`);
		expect(JSON.parse(String(calls[0]?.body))).toEqual({
			input: 'What do you remember about me?',
		});
	});

	it('returns a streamed reply as text', async () => {
		reply(
			'data: {"message_type":"assistant_message"}\n\n',
			200,
			'text/event-stream',
		);
		const out = await api.agents.messages.stream(ctx(), {
			agent_id: AGENT,
			input: 'hi',
		});
		expect(out).toEqual({
			text: 'data: {"message_type":"assistant_message"}\n\n',
			contentType: 'text/event-stream',
		});
		expect(calls[0]?.url.pathname).toBe(`/v1/agents/${AGENT}/messages/stream`);
	});

	it('takes a conversation reply as JSON or as the default event stream, nothing else', async () => {
		reply(
			'data: {"message_type":"assistant_message"}\n\n',
			200,
			'text/event-stream',
		);
		await expect(
			api.conversations.messages.create(ctx(), {
				conversation_id: 'conv-1',
				input: 'hi',
			}),
		).resolves.toBe('data: {"message_type":"assistant_message"}\n\n');
		reply('<html>login</html>', 200, 'text/html');
		await expect(
			api.conversations.messages.create(ctx(), {
				conversation_id: 'conv-1',
				input: 'hi',
			}),
		).rejects.toThrow(/HTML page, not JSON/);
	});

	it('attaches a core memory block with a PATCH', async () => {
		reply({ id: AGENT });
		await api.agents.blocks.attach(ctx(), {
			agent_id: AGENT,
			block_id: 'block-1',
		});
		expect(calls[0]?.method).toBe('PATCH');
		expect(calls[0]?.url.pathname).toBe(
			`/v1/agents/${AGENT}/core-memory/blocks/attach/block-1`,
		);
	});

	it('imports an agent file as multipart with the embedding header', async () => {
		reply({ agent_ids: [AGENT] });
		await api.agents.importFile(ctx(), {
			file: {
				base64: 'e30=',
				filename: 'agent.af',
				contentType: 'application/json',
			},
			override_embedding_model: 'openai/text-embedding-3-small',
		});
		expect(calls[0]?.url.pathname).toBe('/v1/agents/import');
		expect(calls[0]?.headers['x-override-embedding-model']).toBe(
			'openai/text-embedding-3-small',
		);
		expect(((calls[0]?.body as FormData).get('file') as File).name).toBe(
			'agent.af',
		);
	});

	it('takes the approval flag in the body only', async () => {
		reply({ id: AGENT });
		await api.agents.tools.updateApproval(ctx(), {
			agent_id: AGENT,
			tool_name: 'send_email',
			requires_approval: true,
		});
		expect(calls[0]?.url.search).toBe('');
		expect(JSON.parse(String(calls[0]?.body))).toEqual({
			requires_approval: true,
		});
	});

	it('accepts an empty body where the reference gives no return type', async () => {
		reply(undefined, 204);
		await expect(
			api.agents.delete(ctx(), { agent_id: AGENT }),
		).resolves.toEqual({
			success: true,
		});
	});

	it('reads a validation error detail list', async () => {
		reply({ detail: [{ loc: ['body', 'name'], msg: 'field required' }] }, 422);
		await expect(
			api.blocks.create(ctx(), { label: 'human', value: 'x' }),
		).rejects.toThrow('Letta 422: name: field required');
	});
});

describe('risk levels', () => {
	it.each([
		'agents.messages.create',
		'agents.messages.stream',
		'agents.messages.reset',
		'agents.tools.run',
		'mcpServers.tools.run',
		'accessTokens.create',
		'agents.delete',
	] as const)('%s is destructive', (id) => {
		expect(lettaEndpointMeta[id].riskLevel).toBe('destructive');
	});

	it.each([
		'messages.search',
		'passages.search',
		'tools.search',
		'agents.list',
	] as const)('%s is read', (id) => {
		expect(lettaEndpointMeta[id].riskLevel).toBe('read');
	});
});
