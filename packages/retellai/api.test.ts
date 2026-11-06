import { retellai } from './index';
import { RetellSchema } from './schema';

// Live checks against the real Retell API. They run only when a key is set:
// RETELL_API_KEY=<key> npx jest api.test.ts
// Every plugin operation runs through its endpoint function, so a response that
// stops matching the output schema fails the test. For chats the suite makes
// its own records and removes them: a Retell LLM, a chat agent and one chat
// (no messages sent, nothing billed). It never creates calls: calls.get reads
// the newest existing call and is skipped on an account that has none. (A web
// call nobody joins stays "registered" and cannot be stopped or deleted.)
const LIVE_KEY = process.env.RETELL_API_KEY ?? '';
const describeLive = LIVE_KEY.length > 0 ? describe : describe.skip;
const BASE = 'https://api.retellai.com';

jest.setTimeout(60_000);

// Inputs and outputs differ per operation and the suite drives them by name,
// so both stay `unknown` here.
type Operation = (ctx: unknown, input: unknown) => Promise<unknown>;

// Safe: the plugin's nested endpoint map is exactly group -> name -> handler.
const operations = retellai().endpoints as unknown as Record<
	string,
	Record<string, Operation>
>;

// Cached rows go through the entity schema, as the ORM does on write.
const cached: { entity: string; id: string }[] = [];
function table(entity: 'calls' | 'chats') {
	return {
		upsertByEntityId: async (id: string, data: unknown) => {
			RetellSchema.entities[entity].parse(data);
			cached.push({ entity, id });
			return { id };
		},
	};
}
const ctx = {
	key: LIVE_KEY,
	$getAccountId: async () => 'live',
	db: { calls: table('calls'), chats: table('chats') },
};

// Stay around one request a second.
let lastCallAt = 0;
async function pace() {
	const wait = lastCallAt + 1000 - Date.now();
	if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
	lastCallAt = Date.now();
}

async function call<T>(path: string, input: unknown = {}): Promise<T> {
	await pace();
	const [group, name] = path.split('.') as [string, string];
	const operation = operations[group]?.[name];
	if (!operation) throw new Error(`unknown operation ${path}`);
	return (await operation(ctx, input)) as T;
}

// Setup and cleanup use routes the plugin does not wrap.
async function raw<T>(method: string, path: string, body?: object) {
	await pace();
	const res = await fetch(`${BASE}${path}`, {
		method,
		headers: {
			Authorization: `Bearer ${LIVE_KEY}`,
			'Content-Type': 'application/json',
		},
		body: body ? JSON.stringify(body) : undefined,
	});
	const text = await res.text();
	if (!res.ok) throw new Error(`${method} ${path}: ${res.status} ${text}`);
	return (text ? JSON.parse(text) : undefined) as T;
}

type ListResult = {
	items: { call_id?: string; chat_id?: string }[];
	has_more?: boolean;
	total?: number;
};

describeLive('Retell live API: lists', () => {
	it.each(['calls.list', 'chats.list'])('%s returns total', async (path) => {
		const result = await call<ListResult>(path, {
			limit: 5,
			includeTotal: true,
		});
		expect(Array.isArray(result.items)).toBe(true);
		expect(typeof result.total).toBe('number');
	});
});

describeLive('Retell live API: calls.get', () => {
	it('reads the newest existing call, if any', async () => {
		const list = await call<ListResult>('calls.list', {
			limit: 1,
			sortOrder: 'descending',
		});
		const id = list.items[0]?.call_id;
		if (!id) return; // a fresh account has no calls to read
		const result = await call<{ call_id: string }>('calls.get', { id });
		expect(result.call_id).toBe(id);
		expect(cached).toContainEqual({ entity: 'calls', id });
	});
});

describeLive('Retell live API: a chat made by the suite', () => {
	const made = { llm: '', agent: '', chat: '' };

	beforeAll(async () => {
		made.llm = (
			await raw<{ llm_id: string }>('POST', '/create-retell-llm', {
				general_prompt: 'Corsair plugin live test. Reply with one word.',
			})
		).llm_id;
		made.agent = (
			await raw<{ agent_id: string }>('POST', '/create-chat-agent', {
				response_engine: { type: 'retell-llm', llm_id: made.llm },
				agent_name: 'corsair-live-test-chat',
			})
		).agent_id;
		made.chat = (
			await raw<{ chat_id: string }>('POST', '/create-chat', {
				agent_id: made.agent,
			})
		).chat_id;
	});

	afterAll(async () => {
		// Retell deletes only ended chats; end-chat on an ended chat is harmless.
		const steps: [string, string, string][] = [
			[made.chat, 'PATCH', `/end-chat/${made.chat}`],
			[made.chat, 'DELETE', `/delete-chat/${made.chat}`],
			[made.agent, 'DELETE', `/delete-chat-agent/${made.agent}`],
			[made.llm, 'DELETE', `/delete-retell-llm/${made.llm}`],
		];
		for (const [id, method, path] of steps) {
			if (id) await raw(method, path).catch(() => undefined);
		}
	});

	it('chats.get reads the ongoing chat before it has an end time', async () => {
		const chat = await call<{
			chat_id: string;
			chat_status?: string;
			end_timestamp?: number | null;
		}>('chats.get', { id: made.chat });
		expect(chat.chat_id).toBe(made.chat);
		expect(chat.chat_status).toBe('ongoing');
		expect(chat.end_timestamp ?? null).toBeNull();
		expect(cached).toContainEqual({ entity: 'chats', id: made.chat });
	});

	it('chats.list finds the chat by id and counts it', async () => {
		const result = await call<ListResult>('chats.list', {
			includeTotal: true,
			filterCriteria: {
				chat_id: { type: 'string', op: 'eq', value: made.chat },
			},
		});
		expect(result.items.map((c) => c.chat_id)).toContain(made.chat);
		expect(result.total).toBe(1);
	});

	it('chats.get reads the chat again after it ends', async () => {
		await raw('PATCH', `/end-chat/${made.chat}`);
		const chat = await call<{
			chat_status?: string;
			end_timestamp?: number | null;
		}>('chats.get', { id: made.chat });
		expect(chat.chat_status).toBe('ended');
		expect(typeof chat.end_timestamp).toBe('number');
	});
});
