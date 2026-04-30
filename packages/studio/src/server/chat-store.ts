import Database from 'better-sqlite3';
import { Kysely, SqliteDialect } from 'kysely';

export type StoredChat = {
	id: string;
	title: string;
	created_at: number;
};

export type StoredMsgBlock =
	| { type: 'text'; content: string }
	| { type: 'tool'; name: string; args: unknown; result?: unknown };

export type StoredMessage = {
	id: string;
	chat_id: string;
	role: 'user' | 'assistant';
	blocks: StoredMsgBlock[];
	error: string | null;
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

export async function createChat() {
	await schemaReady;

	const chat: StoredChat = {
		id: crypto.randomUUID(),
		title: 'New chat',
		created_at: Date.now(),
	};

	await db.insertInto('chats').values(chat).execute();
	return chat;
}

export async function listChats() {
	await schemaReady;

	return db
		.selectFrom('chats')
		.select(['id', 'title', 'created_at'])
		.orderBy('created_at', 'desc')
		.execute();
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

export async function getMessages(chatId: string) {
	await schemaReady;

	const rows = await db
		.selectFrom('chat_messages')
		.select(['id', 'chat_id', 'role', 'blocks', 'error'])
		.where('chat_id', '=', chatId)
		.orderBy('seq', 'asc')
		.execute();

	return rows.map((row) => ({
		id: row.id,
		chat_id: row.chat_id,
		role: row.role,
		blocks: JSON.parse(row.blocks) as StoredMsgBlock[],
		error: row.error,
	}));
}

export async function appendMessage(
	chatId: string,
	id: string,
	role: 'user' | 'assistant',
	blocks: StoredMsgBlock[],
	error?: string,
) {
	await schemaReady;

	await db
		.insertInto('chat_messages')
		.values({
			id,
			chat_id: chatId,
			role,
			blocks: JSON.stringify(blocks),
			error: error ?? null,
			seq: ++_seq,
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
