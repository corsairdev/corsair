import Database from 'better-sqlite3';
import { Kysely, SqliteDialect } from 'kysely';
import { computeCost } from './model-pricing.js';

export type StoredChat = {
	id: string;
	title: string;
	created_at: number;
	usage_total: ChatUsageTotal;
};

export type StoredMsgBlock =
	| { type: 'text'; content: string }
	| { type: 'tool'; name: string; args: unknown; result?: unknown };

export type RawMessageUsage = {
	model: string;
	inputTokens: number;
	outputTokens: number;
	totalTokens: number;
};

export type MessageUsage = RawMessageUsage & {
	cost: number | null;
};

export type ChatUsageTotal = {
	inputTokens: number;
	outputTokens: number;
	totalTokens: number;
	cost: number;
	hasUnknownCost: boolean;
};

export type StoredMessage = {
	id: string;
	chat_id: string;
	role: 'user' | 'assistant';
	blocks: StoredMsgBlock[];
	error: string | null;
	usage: MessageUsage | null;
};

type ChatTable = {
	id: string;
	title: string;
	created_at: number;
};

type ChatMessageTable = {
	id: string;
	chat_id: string;
	role: 'user' | 'assistant';
	blocks: string;
	error: string | null;
	seq: number;
	usage: string | null;
};

type ChatStoreDb = {
	chats: ChatTable;
	chat_messages: ChatMessageTable;
};

const sqlite = new Database(':memory:');
const db = new Kysely<ChatStoreDb>({
	dialect: new SqliteDialect({ database: sqlite }),
});
const schemaReady = initSchema();

async function initSchema() {
	await db.schema
		.createTable('chats')
		.ifNotExists()
		.addColumn('id', 'text', (col) => col.primaryKey())
		.addColumn('title', 'text', (col) => col.notNull())
		.addColumn('created_at', 'integer', (col) => col.notNull())
		.execute();

	await db.schema
		.createTable('chat_messages')
		.ifNotExists()
		.addColumn('id', 'text', (col) => col.primaryKey())
		.addColumn('chat_id', 'text', (col) => col.notNull())
		.addColumn('role', 'text', (col) => col.notNull())
		.addColumn('blocks', 'text', (col) => col.notNull())
		.addColumn('error', 'text')
		.addColumn('seq', 'integer', (col) => col.notNull())
		.addColumn('usage', 'text')
		.execute();
}

let _seq = 0;

function getTextFromBlocks(blocks: StoredMsgBlock[]) {
	return blocks
		.filter(
			(block): block is Extract<StoredMsgBlock, { type: 'text' }> =>
				block.type === 'text',
		)
		.map((block) => block.content)
		.join('');
}

function parseRawUsage(raw: string | null): RawMessageUsage | null {
	if (!raw) return null;
	try {
		const parsed = JSON.parse(raw) as Partial<RawMessageUsage>;
		if (
			typeof parsed.model !== 'string' ||
			typeof parsed.inputTokens !== 'number' ||
			typeof parsed.outputTokens !== 'number' ||
			typeof parsed.totalTokens !== 'number'
		) {
			return null;
		}
		return {
			model: parsed.model,
			inputTokens: parsed.inputTokens,
			outputTokens: parsed.outputTokens,
			totalTokens: parsed.totalTokens,
		};
	} catch {
		return null;
	}
}

export function withCost(raw: RawMessageUsage): MessageUsage {
	return {
		...raw,
		cost: computeCost(raw.model, raw),
	};
}

export function aggregateUsage(rows: (MessageUsage | null)[]): ChatUsageTotal {
	const total: ChatUsageTotal = {
		inputTokens: 0,
		outputTokens: 0,
		totalTokens: 0,
		cost: 0,
		hasUnknownCost: false,
	};
	for (const u of rows) {
		if (!u) continue;
		total.inputTokens += u.inputTokens;
		total.outputTokens += u.outputTokens;
		total.totalTokens += u.totalTokens;
		if (u.cost === null) {
			total.hasUnknownCost = true;
		} else {
			total.cost += u.cost;
		}
	}
	return total;
}

export async function createChat(): Promise<StoredChat> {
	await schemaReady;

	const id = crypto.randomUUID();
	const created_at = Date.now();
	const title = 'New chat';

	await db.insertInto('chats').values({ id, title, created_at }).execute();
	return {
		id,
		title,
		created_at,
		usage_total: aggregateUsage([]),
	};
}

export async function listChats(): Promise<StoredChat[]> {
	await schemaReady;

	const chats = await db
		.selectFrom('chats')
		.select(['id', 'title', 'created_at'])
		.orderBy('created_at', 'desc')
		.execute();

	const messageRows = await db
		.selectFrom('chat_messages')
		.select(['chat_id', 'usage'])
		.execute();

	const usageByChat = new Map<string, MessageUsage[]>();
	for (const row of messageRows) {
		const raw = parseRawUsage(row.usage);
		if (!raw) continue;
		const list = usageByChat.get(row.chat_id) ?? [];
		list.push(withCost(raw));
		usageByChat.set(row.chat_id, list);
	}

	return chats.map((chat) => ({
		id: chat.id,
		title: chat.title,
		created_at: chat.created_at,
		usage_total: aggregateUsage(usageByChat.get(chat.id) ?? []),
	}));
}

export async function chatExists(chatId: string) {
	await schemaReady;

	const row = await db
		.selectFrom('chats')
		.select('id')
		.where('id', '=', chatId)
		.executeTakeFirst();
	return !!row;
}

export async function getMessages(chatId: string): Promise<StoredMessage[]> {
	await schemaReady;

	const rows = await db
		.selectFrom('chat_messages')
		.select(['id', 'chat_id', 'role', 'blocks', 'error', 'usage'])
		.where('chat_id', '=', chatId)
		.orderBy('seq', 'asc')
		.execute();

	return rows.map((row) => {
		const raw = parseRawUsage(row.usage);
		return {
			id: row.id,
			chat_id: row.chat_id,
			role: row.role,
			blocks: JSON.parse(row.blocks) as StoredMsgBlock[],
			error: row.error,
			usage: raw ? withCost(raw) : null,
		};
	});
}

export async function appendMessage(
	chatId: string,
	id: string,
	role: 'user' | 'assistant',
	blocks: StoredMsgBlock[],
	options: { error?: string; usage?: RawMessageUsage } = {},
) {
	await schemaReady;

	await db
		.insertInto('chat_messages')
		.values({
			id,
			chat_id: chatId,
			role,
			blocks: JSON.stringify(blocks),
			error: options.error ?? null,
			seq: ++_seq,
			usage: options.usage ? JSON.stringify(options.usage) : null,
		})
		.execute();

	if (role === 'user') {
		const row = await db
			.selectFrom('chats')
			.select('title')
			.where('id', '=', chatId)
			.executeTakeFirst();

		if (row?.title === 'New chat') {
			const text = getTextFromBlocks(blocks);
			const newTitle = text.slice(0, 60).trim();
			if (newTitle) {
				await db
					.updateTable('chats')
					.set({ title: newTitle })
					.where('id', '=', chatId)
					.execute();
			}
		}
	}
}
