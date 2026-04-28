import Database from 'better-sqlite3';

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

const db = new Database(':memory:');

db.exec(`
  CREATE TABLE chats (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    created_at INTEGER NOT NULL
  );
  CREATE TABLE chat_messages (
    id TEXT PRIMARY KEY,
    chat_id TEXT NOT NULL,
    role TEXT NOT NULL,
    blocks TEXT NOT NULL,
    error TEXT,
    seq INTEGER NOT NULL
  );
`);

let _seq = 0;

export function createChat(): StoredChat {
	const chat: StoredChat = {
		id: crypto.randomUUID(),
		title: 'New chat',
		created_at: Date.now(),
	};
	db.prepare('INSERT INTO chats (id, title, created_at) VALUES (?, ?, ?)').run(
		chat.id,
		chat.title,
		chat.created_at,
	);
	return chat;
}

export function listChats(): StoredChat[] {
	return db
		.prepare(
			'SELECT id, title, created_at FROM chats ORDER BY created_at DESC',
		)
		.all() as StoredChat[];
}

export function chatExists(chatId: string): boolean {
	return !!db.prepare('SELECT 1 FROM chats WHERE id = ?').get(chatId);
}

export function getMessages(chatId: string): StoredMessage[] {
	const rows = db
		.prepare(
			'SELECT id, chat_id, role, blocks, error FROM chat_messages WHERE chat_id = ? ORDER BY seq ASC',
		)
		.all(chatId) as Array<{
		id: string;
		chat_id: string;
		role: string;
		blocks: string;
		error: string | null;
	}>;
	return rows.map((row) => ({
		id: row.id,
		chat_id: row.chat_id,
		role: row.role as 'user' | 'assistant',
		blocks: JSON.parse(row.blocks) as StoredMsgBlock[],
		error: row.error,
	}));
}

export function appendMessage(
	chatId: string,
	id: string,
	role: 'user' | 'assistant',
	blocks: StoredMsgBlock[],
	error?: string,
): void {
	db.prepare(
		'INSERT INTO chat_messages (id, chat_id, role, blocks, error, seq) VALUES (?, ?, ?, ?, ?, ?)',
	).run(id, chatId, role, JSON.stringify(blocks), error ?? null, ++_seq);

	if (role === 'user') {
		const row = db
			.prepare('SELECT title FROM chats WHERE id = ?')
			.get(chatId) as { title: string } | undefined;
		if (row?.title === 'New chat') {
			const text = blocks
				.filter(
					(b): b is { type: 'text'; content: string } => b.type === 'text',
				)
				.map((b) => b.content)
				.join('');
			const newTitle = text.slice(0, 60).trim();
			if (newTitle) {
				db.prepare('UPDATE chats SET title = ? WHERE id = ?').run(
					newTitle,
					chatId,
				);
			}
		}
	}
}
