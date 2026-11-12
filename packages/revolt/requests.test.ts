import * as Endpoints from './endpoints/endpoints';
import {
	CHANNEL,
	CHANNEL_ID,
	DM_LIST,
	MEMBER_LIST,
	MESSAGE,
	MESSAGE_ID,
	MESSAGE_LIST,
	SERVER,
	SERVER_ID,
	USER,
	USER_ID,
} from './test-fixtures';
import { invoke, lastRequest, respond, spyOnFetch } from './test-support';

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = spyOnFetch();
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('users.me', () => {
	it('reads the account behind the token', async () => {
		respond(fetchMock, USER);

		const result = (await invoke(Endpoints.userMe, {})) as Awaited<
			ReturnType<typeof Endpoints.userMe>
		>;

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/users/@me');
		expect(request.headers.get('x-bot-token')).toBe('revolt-test-token');
		expect(result.user.username).toBe('sam');
	});

	it('sends a user token in the session header when configured', async () => {
		respond(fetchMock, USER);

		await invoke(Endpoints.userMe, {}, 'user');

		expect(lastRequest(fetchMock).headers.get('x-session-token')).toBe(
			'revolt-test-token',
		);
	});
});

describe('users.get and users.dms', () => {
	it('reads one user by id', async () => {
		respond(fetchMock, USER);

		const result = (await invoke(Endpoints.userGet, {
			user_id: USER_ID,
		})) as Awaited<ReturnType<typeof Endpoints.userGet>>;

		expect(lastRequest(fetchMock).path).toBe(`/users/${USER_ID}`);
		expect(result.user.display_name).toBe('Sam Rivera');
	});

	it('lists DM channels with their users', async () => {
		respond(fetchMock, DM_LIST);

		const result = (await invoke(Endpoints.userDms, {})) as Awaited<
			ReturnType<typeof Endpoints.userDms>
		>;

		expect(lastRequest(fetchMock).path).toBe('/users/dms');
		expect(result.channels[0]?.channel_type).toBe('DirectMessage');
		expect(result.users[0]?.username).toBe('sam');
	});
});

describe('channels', () => {
	it('reads one channel', async () => {
		respond(fetchMock, CHANNEL);

		const result = (await invoke(Endpoints.channelGet, {
			channel_id: CHANNEL_ID,
		})) as Awaited<ReturnType<typeof Endpoints.channelGet>>;

		expect(result.channel.name).toBe('general');
		expect(result.channel.channel_type).toBe('TextChannel');
	});

	it('patches a channel name', async () => {
		respond(fetchMock, CHANNEL);

		await invoke(Endpoints.channelEdit, {
			channel_id: CHANNEL_ID,
			name: 'announcements',
		});

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('PATCH');
		expect(request.path).toBe(`/channels/${CHANNEL_ID}`);
		expect(request.json()).toEqual({ name: 'announcements' });
	});

	it('deletes a channel', async () => {
		respond(fetchMock, {});

		const result = (await invoke(Endpoints.channelDelete, {
			channel_id: CHANNEL_ID,
		})) as Awaited<ReturnType<typeof Endpoints.channelDelete>>;

		expect(lastRequest(fetchMock).method).toBe('DELETE');
		expect(result.success).toBe(true);
	});
});

describe('messages', () => {
	it('lists messages with the authors already inline', async () => {
		respond(fetchMock, MESSAGE_LIST);

		const result = (await invoke(Endpoints.messagesList, {
			channel_id: CHANNEL_ID,
			limit: 50,
		})) as Awaited<ReturnType<typeof Endpoints.messagesList>>;

		const request = lastRequest(fetchMock);
		expect(request.path).toBe(`/channels/${CHANNEL_ID}/messages`);
		expect(request.query).toEqual({ limit: '50' });
		expect(result.messages[0]?.content).toBe('Standup in five');
		// The response carries the users and members the messages reference.
		expect(result.users?.[0]?.username).toBe('sam');
		expect(result.members?.[0]?.nickname).toBe('Sam');
	});

	it('rejects sort without nearby, which the API ignores alone', async () => {
		await expect(
			invoke(Endpoints.messagesList, {
				channel_id: CHANNEL_ID,
				sort: 'Latest',
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects before and after together', async () => {
		await expect(
			invoke(Endpoints.messagesList, {
				channel_id: CHANNEL_ID,
				before: MESSAGE_ID,
				after: MESSAGE_ID,
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('reads one message', async () => {
		respond(fetchMock, MESSAGE);

		const result = (await invoke(Endpoints.messagesGet, {
			channel_id: CHANNEL_ID,
			message_id: MESSAGE_ID,
		})) as Awaited<ReturnType<typeof Endpoints.messagesGet>>;

		expect(lastRequest(fetchMock).path).toBe(
			`/channels/${CHANNEL_ID}/messages/${MESSAGE_ID}`,
		);
		expect(result.message._id).toBe(MESSAGE_ID);
	});

	it('sends a message with a reply', async () => {
		respond(fetchMock, MESSAGE);

		await invoke(Endpoints.messagesSend, {
			channel_id: CHANNEL_ID,
			content: 'Standup in five',
			replies: [{ id: MESSAGE_ID, mention: true }],
		});

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('POST');
		expect(request.json()).toEqual({
			content: 'Standup in five',
			replies: [{ id: MESSAGE_ID, mention: true }],
		});
	});

	it('rejects an empty message with no attachment', async () => {
		await expect(
			invoke(Endpoints.messagesSend, { channel_id: CHANNEL_ID }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('edits a message', async () => {
		respond(fetchMock, MESSAGE);

		await invoke(Endpoints.messagesEdit, {
			channel_id: CHANNEL_ID,
			message_id: MESSAGE_ID,
			content: 'Standup in ten',
		});

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('PATCH');
		expect(request.json()).toEqual({ content: 'Standup in ten' });
	});

	it('deletes a message', async () => {
		respond(fetchMock, {});

		const result = (await invoke(Endpoints.messagesDelete, {
			channel_id: CHANNEL_ID,
			message_id: MESSAGE_ID,
		})) as Awaited<ReturnType<typeof Endpoints.messagesDelete>>;

		expect(lastRequest(fetchMock).method).toBe('DELETE');
		expect(result.success).toBe(true);
	});
});

describe('reactions.add', () => {
	it('adds a unicode emoji reaction', async () => {
		respond(fetchMock, {});

		const result = (await invoke(Endpoints.reactionsAdd, {
			channel_id: CHANNEL_ID,
			message_id: MESSAGE_ID,
			emoji: '👍',
		})) as Awaited<ReturnType<typeof Endpoints.reactionsAdd>>;

		const request = lastRequest(fetchMock);
		// Stoat registers the reaction route as PUT; a POST answers 404.
		expect(request.method).toBe('PUT');
		expect(request.path).toBe(
			`/channels/${CHANNEL_ID}/messages/${MESSAGE_ID}/reactions/${encodeURIComponent('👍')}`,
		);
		expect(result.success).toBe(true);
	});
});

describe('servers', () => {
	it('reads a server with its channels', async () => {
		respond(fetchMock, SERVER);

		const result = (await invoke(Endpoints.serverGet, {
			server_id: SERVER_ID,
			include_channels: true,
		})) as Awaited<ReturnType<typeof Endpoints.serverGet>>;

		expect(lastRequest(fetchMock).query).toEqual({
			include_channels: 'true',
		});
		expect(result.server.name).toBe('Acme');
		expect(result.server.channels).toEqual([CHANNEL_ID]);
	});

	it('lists the server members with their users', async () => {
		respond(fetchMock, MEMBER_LIST);

		const result = (await invoke(Endpoints.serverMembers, {
			server_id: SERVER_ID,
			exclude_offline: true,
		})) as Awaited<ReturnType<typeof Endpoints.serverMembers>>;

		expect(lastRequest(fetchMock).query).toEqual({
			exclude_offline: 'true',
		});
		expect(result.members[0]?.nickname).toBe('Sam');
		expect(result.users[0]?.username).toBe('sam');
	});
});

describe('message list envelope', () => {
	it('fails rather than inventing an empty list when messages are missing', async () => {
		respond(fetchMock, { users: [] });

		await expect(
			invoke(Endpoints.messagesList, { channel_id: CHANNEL_ID }),
		).rejects.toThrow();
	});
});
