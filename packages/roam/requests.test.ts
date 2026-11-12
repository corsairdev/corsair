import * as Endpoints from './endpoints/endpoints';
import {
	BLOCK_MESSAGE,
	CHAT_ID,
	CHAT_PAGE,
	CHAT_POST,
	CHAT_POST_SCHEDULED,
	CHAT_UPDATE,
	GROUP_ID,
	GROUP_PAGE,
	MEETING_ID,
	MEETING_PAGE,
	MESSAGE_PAGE,
	POLL_MESSAGE,
	REACTION_ADD,
	REACTION_LIST,
	TIMESTAMP,
	TOKEN_INFO,
	TRANSCRIPT,
	USER,
	USER_ID,
	USER_PAGE,
	VOICE_MESSAGE,
} from './test-fixtures';
import { invoke, lastRequest, respond, spyOnFetch } from './test-support';

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = spyOnFetch();
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('token.info', () => {
	it('reads the account behind the token', async () => {
		respond(fetchMock, TOKEN_INFO);

		const result = (await invoke(Endpoints.tokenInfo, {})) as Awaited<
			ReturnType<typeof Endpoints.tokenInfo>
		>;

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/v1/token.info');
		expect(request.method).toBe('GET');
		expect(result.token.user?.email).toBe('sam@example.com');
		expect(result.token.scopes).toEqual(['chat:read', 'chat:write']);
		expect(result.token.clientId).toBe('client-123');
		expect(result.token.roam?.name).toBe('Corsair Plugin Test');
	});
});

describe('users', () => {
	it('looks a user up by email', async () => {
		respond(fetchMock, { ok: true, ...USER });

		const result = (await invoke(Endpoints.userInfo, {
			email: 'sam@example.com',
			expand: ['status', 'available'],
		})) as Awaited<ReturnType<typeof Endpoints.userInfo>>;

		expect(lastRequest(fetchMock).query).toEqual({
			email: 'sam@example.com',
			expand: 'status,available',
		});
		expect(result.user.name).toBe('Sam Rivera');
	});

	it('lists users and reads the cursor', async () => {
		respond(fetchMock, USER_PAGE);

		const result = (await invoke(Endpoints.userList, {
			ids: ['a', 'b'],
			limit: 50,
		})) as Awaited<ReturnType<typeof Endpoints.userList>>;

		expect(lastRequest(fetchMock).query).toEqual({
			ids: 'a,b',
			limit: '50',
		});
		expect(result.users).toHaveLength(1);
		expect(result.next_cursor).toBe('next-cursor-1');
		expect(result.has_more).toBe(true);
	});
});

describe('chat.list and chat.history', () => {
	it('lists chats and stops paging on the last page', async () => {
		respond(fetchMock, CHAT_PAGE);

		const result = (await invoke(Endpoints.chatList, { limit: 20 })) as Awaited<
			ReturnType<typeof Endpoints.chatList>
		>;

		expect(lastRequest(fetchMock).path).toBe('/v1/chat.list');
		expect(result.chats[0]?.name).toBe('Water Runners');
		expect(result.chats[0]?.groupId).toBe(GROUP_ID);
		expect(result.next_cursor).toBeNull();
		expect(result.has_more).toBe(false);
	});

	it('reads a chat history with a thread filter', async () => {
		respond(fetchMock, MESSAGE_PAGE);

		const result = (await invoke(Endpoints.chatHistory, {
			chat_id: CHAT_ID,
			thread_timestamp: TIMESTAMP,
			limit: 100,
		})) as Awaited<ReturnType<typeof Endpoints.chatHistory>>;

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/v1/chat.history');
		expect(request.query).toEqual({
			chatId: CHAT_ID,
			threadTimestamp: String(TIMESTAMP),
			limit: '100',
		});
		expect(result.messages[0]?.text).toBe('Standup in five');
		expect(result.next_cursor).toBe('cursor-2');
	});

	it('accepts a group instead of a chat', async () => {
		respond(fetchMock, MESSAGE_PAGE);

		await invoke(Endpoints.chatHistory, { group_id: GROUP_ID });

		expect(lastRequest(fetchMock).query).toEqual({ groupId: GROUP_ID });
	});

	it('reads poll, block and voice messages in the shapes Roam returns', async () => {
		respond(fetchMock, {
			ok: true,
			chatId: CHAT_ID,
			messages: [POLL_MESSAGE, BLOCK_MESSAGE, VOICE_MESSAGE],
		});

		const result = (await invoke(Endpoints.chatHistory, {
			chat_id: CHAT_ID,
		})) as Awaited<ReturnType<typeof Endpoints.chatHistory>>;

		expect(result.messages[0]?.poll?.options?.[1]?.text).toBe('Salad');
		expect(result.messages[1]?.blocks?.[0]?.type).toBe('image');
		expect(result.messages[2]?.voice?.transcript).toBe('On my way');
	});

	it('reads the direct chat with a set of users', async () => {
		respond(fetchMock, MESSAGE_PAGE);

		await invoke(Endpoints.chatHistory, { user_ids: [USER_ID] });

		expect(lastRequest(fetchMock).query).toEqual({ userIds: USER_ID });
	});

	it('rejects a page size above the route maximum', async () => {
		await expect(
			invoke(Endpoints.chatList, { limit: 51 }),
		).rejects.toThrow();
		await expect(
			invoke(Endpoints.chatHistory, { chat_id: CHAT_ID, limit: 201 }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a history request with two destinations', async () => {
		await expect(
			invoke(Endpoints.chatHistory, { chat_id: CHAT_ID, group_id: GROUP_ID }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a history request with no chat and no group', async () => {
		await expect(
			invoke(Endpoints.chatHistory, { limit: 10 }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('chat.post', () => {
	it('posts a text message to a chat', async () => {
		respond(fetchMock, CHAT_POST);

		const result = (await invoke(Endpoints.chatPost, {
			chat_id: CHAT_ID,
			text: 'Standup in five',
		})) as Awaited<ReturnType<typeof Endpoints.chatPost>>;

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('POST');
		expect(request.path).toBe('/v1/chat.post');
		expect(request.json()).toEqual({
			chatId: CHAT_ID,
			text: 'Standup in five',
		});
		expect(result.post.timestamp).toBe(TIMESTAMP);
	});

	it('schedules a post instead of sending it', async () => {
		respond(fetchMock, CHAT_POST_SCHEDULED);

		const result = (await invoke(Endpoints.chatPost, {
			chat_id: CHAT_ID,
			text: 'Reminder',
			send_at: '2026-11-11T09:00:00.000Z',
		})) as Awaited<ReturnType<typeof Endpoints.chatPost>>;

		expect(lastRequest(fetchMock).json()).toMatchObject({
			sendAt: '2026-11-11T09:00:00.000Z',
		});
		expect(result.post.scheduledMessageId).toBe(
			'55555555-6666-7777-8888-999999999999',
		);
	});

	it('opens a direct chat from user ids', async () => {
		respond(fetchMock, CHAT_POST);

		await invoke(Endpoints.chatPost, {
			user_ids: ['a', 'b'],
			text: 'Hi',
		});

		expect(lastRequest(fetchMock).json()).toMatchObject({
			userIds: ['a', 'b'],
			text: 'Hi',
		});
	});

	it('rejects a post with no destination', async () => {
		await expect(
			invoke(Endpoints.chatPost, { text: 'Nowhere' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a post with no content', async () => {
		await expect(
			invoke(Endpoints.chatPost, { chat_id: CHAT_ID }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a post carrying two content types, which Roam refuses', async () => {
		await expect(
			invoke(Endpoints.chatPost, {
				chat_id: CHAT_ID,
				text: 'hi',
				blocks: [{ type: 'section' }],
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('chat.update', () => {
	it('edits a message by chat and timestamp', async () => {
		respond(fetchMock, CHAT_UPDATE);

		const result = (await invoke(Endpoints.chatUpdate, {
			chat_id: CHAT_ID,
			timestamp: TIMESTAMP,
			text: 'Standup in ten',
		})) as Awaited<ReturnType<typeof Endpoints.chatUpdate>>;

		expect(lastRequest(fetchMock).json()).toEqual({
			chatId: CHAT_ID,
			timestamp: TIMESTAMP,
			text: 'Standup in ten',
		});
		expect(result.update.chatId).toBe(CHAT_ID);
	});

	it('rejects an update with no content type', async () => {
		await expect(
			invoke(Endpoints.chatUpdate, {
				chat_id: CHAT_ID,
				timestamp: TIMESTAMP,
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('reactions', () => {
	it('adds a reaction to a message', async () => {
		respond(fetchMock, REACTION_ADD);

		await invoke(Endpoints.reactionAdd, {
			chat_id: CHAT_ID,
			timestamp: TIMESTAMP,
			name: 'thumbsup',
		});

		expect(lastRequest(fetchMock).json()).toEqual({
			chatId: CHAT_ID,
			timestamp: TIMESTAMP,
			name: 'thumbsup',
		});
	});

	it('lists the reactions on a message', async () => {
		respond(fetchMock, REACTION_LIST);

		const result = (await invoke(Endpoints.reactionList, {
			chat_id: CHAT_ID,
			timestamp: TIMESTAMP,
		})) as Awaited<ReturnType<typeof Endpoints.reactionList>>;

		expect(result.reactions[0]?.count).toBe(2);
		expect(result.reactions[0]?.users).toEqual([USER.id]);
		expect(result.pollVotes?.[0]?.optionId).toBe('opt-1');
	});

	it('rejects a reaction with no name', async () => {
		await expect(
			invoke(Endpoints.reactionAdd, {
				chat_id: CHAT_ID,
				timestamp: TIMESTAMP,
				name: '',
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('groups and meetings', () => {
	it('lists groups with a type filter', async () => {
		respond(fetchMock, GROUP_PAGE);

		const result = (await invoke(Endpoints.groupList, {
			type: 'standard',
			query: 'water',
		})) as Awaited<ReturnType<typeof Endpoints.groupList>>;

		expect(lastRequest(fetchMock).query).toEqual({
			type: 'standard',
			query: 'water',
		});
		expect(result.groups[0]?.name).toBe('Water Runners');
	});

	it('lists meetings in a window', async () => {
		respond(fetchMock, MEETING_PAGE);

		const result = (await invoke(Endpoints.meetingList, {
			after: '2026-11-01T00:00:00.000Z',
			limit: 10,
			expand: ['summary', 'chapters'],
		})) as Awaited<ReturnType<typeof Endpoints.meetingList>>;

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/v1/meeting.list');
		expect(request.query.expand).toBe('summary,chapters');
		expect(result.meetings[0]?.start).toBe('2026-11-10T10:00:00.000Z');
		expect(result.meetings[0]?.participantCount).toBe(2);
		expect(result.meetings[0]?.host?.name).toBe('Sam Rivera');
	});

	it('reads a transcript with its cues', async () => {
		respond(fetchMock, TRANSCRIPT);

		const result = (await invoke(Endpoints.meetingTranscript, {
			meeting_id: MEETING_ID,
		})) as Awaited<ReturnType<typeof Endpoints.meetingTranscript>>;

		expect(lastRequest(fetchMock).query).toEqual({ id: MEETING_ID });
		expect(result.transcript.cues).toHaveLength(2);
		expect(result.transcript.cues?.[0]?.speakerId).toBe(USER_ID);
		expect(result.transcript.cues?.[1]?.text).toBe('Sounds good.');
	});

	it('rejects a transcript with no meeting id', async () => {
		await expect(
			invoke(Endpoints.meetingTranscript, { meeting_id: '' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('envelope handling', () => {
	it('fails rather than inventing an empty list when the key is missing', async () => {
		respond(fetchMock, { ok: true, hasMore: false });

		await expect(invoke(Endpoints.chatList, {})).rejects.toThrow();
	});

	it('drops the ok flag from a single-object answer', async () => {
		// CHAT_POST already carries `ok`, so no second one is spread in.
		respond(fetchMock, CHAT_POST);

		const result = (await invoke(Endpoints.chatPost, {
			chat_id: CHAT_ID,
			text: 'x',
		})) as Awaited<ReturnType<typeof Endpoints.chatPost>>;

		expect(result.post.ok).toBeUndefined();
		expect(result.post.chatId).toBe(CHAT_ID);
	});
});
