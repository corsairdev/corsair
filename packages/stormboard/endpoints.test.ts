import { logEventFromContext } from 'corsair/core';
import { Chat, Folders, Ideas, Storms, Tags, Users } from './endpoints';
import {
	authKey,
	chatMessage,
	comment,
	connector,
	idea,
	liveConnectorSaved,
	livePersonalProfile,
	liveTemplate,
	noAuth,
	participant,
	profile,
	storm,
	stormsPage,
	tag,
	task,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'sb-test-key';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant.
// unknown: each endpoint returns its own output type, so the shared return
// has no narrower type.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts.
function invoke(endpoint: AnyEndpoint, input: unknown) {
	return endpoint({ key: API_KEY, options: {} } as never, input as never);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		origin: parsed.origin,
		path: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams),
		method: init.method,
		headers: new Headers(init.headers),
		body: init.body === undefined ? undefined : String(init.body),
	};
}

function expectAuthenticated() {
	const sent = lastRequest();
	expect(sent.origin).toBe('https://api.stormboard.com');
	expect(sent.headers.get('x-api-key')).toBe(API_KEY);
}

// unknown: inputs and response bodies vary per operation, so the shared
// case table carries them untyped.
type Case = {
	op: string;
	endpoint: AnyEndpoint;
	input: unknown;
	respondWith: () => { body: unknown; status?: number };
	expect: {
		method: 'GET' | 'POST' | 'PUT' | 'DELETE';
		path: string;
		query?: Record<string, string>;
		body?: Record<string, unknown> | undefined;
	};
};

// One row per documented operation, with the documented response example.
const cases: Case[] = [
	{
		op: 'users.create',
		endpoint: Users.create,
		input: {
			firstname: 'James',
			lastname: 'Dean',
			email: 'james.dean@fake.com',
			username: 'james.dean',
			password: 'secret',
		},
		respondWith: () => ({
			body: { message: 'User created', id: 8, api_key: '1234567890' },
		}),
		expect: {
			method: 'POST',
			path: '/users',
			body: {
				firstname: 'James',
				lastname: 'Dean',
				email: 'james.dean@fake.com',
				username: 'james.dean',
				password: 'secret',
			},
		},
	},
	{
		op: 'users.verify',
		endpoint: Users.verify,
		input: { code: 'ABC123' },
		respondWith: () => ({ body: { message: 'Account verified' } }),
		expect: { method: 'PUT', path: '/users/verify', body: { code: 'ABC123' } },
	},
	{
		op: 'users.updateProfile',
		endpoint: Users.updateProfile,
		input: { firstname: 'James' },
		respondWith: () => ({ body: { message: 'User updated' } }),
		expect: {
			method: 'PUT',
			path: '/users/profile',
			body: { firstname: 'James' },
		},
	},
	{
		op: 'users.getProfile',
		endpoint: Users.getProfile,
		input: {},
		respondWith: () => ({ body: { profile } }),
		expect: { method: 'GET', path: '/users/profile' },
	},
	{
		op: 'users.getProfile (live Personal plan: team false, numeric flags)',
		endpoint: Users.getProfile,
		input: {},
		respondWith: () => ({ body: { profile: livePersonalProfile } }),
		expect: { method: 'GET', path: '/users/profile' },
	},
	{
		op: 'users.getAuth',
		endpoint: Users.getAuth,
		input: {},
		respondWith: () => ({ body: { auth: [authKey] } }),
		expect: { method: 'GET', path: '/users/auth' },
	},
	{
		op: 'users.test',
		endpoint: Users.test,
		input: {},
		respondWith: () => ({ body: { message: 'Connected, w00t', status: 200 } }),
		expect: { method: 'GET', path: '/users/test' },
	},
	{
		op: 'users.updateNotifications',
		endpoint: Users.updateNotifications,
		input: { dailyemail: 0, newsletter: 1 },
		respondWith: () => ({ body: { message: 'User updated' } }),
		expect: {
			method: 'PUT',
			path: '/users/notifications',
			body: { dailyemail: 0, newsletter: 1 },
		},
	},
	{
		op: 'storms.create',
		endpoint: Storms.create,
		input: { plan: 'Team', title: 'New Storm', votesperuser: 5 },
		respondWith: () => ({
			body: { message: 'Storm created', id: 1000000, key: 'storm99' },
		}),
		expect: {
			method: 'POST',
			path: '/storms',
			body: { plan: 'Team', title: 'New Storm', votesperuser: 5 },
		},
	},
	{
		op: 'storms.get',
		endpoint: Storms.get,
		input: { stormId: 49999 },
		respondWith: () => ({ body: { storm } }),
		expect: { method: 'GET', path: '/storms/49999' },
	},
	{
		op: 'storms.update',
		endpoint: Storms.update,
		input: { stormId: 49999, title: 'My New Storm Title', votesperuser: 30 },
		respondWith: () => ({ body: { message: 'Storm updated' } }),
		expect: {
			method: 'PUT',
			path: '/storms/49999',
			body: { title: 'My New Storm Title', votesperuser: 30 },
		},
	},
	{
		op: 'storms.updateLegend',
		endpoint: Storms.updateLegend,
		input: { stormId: 49999, color: { yellow: 'Yellow Label', pink: 'Pinky' } },
		respondWith: () => ({ body: { message: 'Legend saved' } }),
		expect: {
			method: 'PUT',
			path: '/storms/49999/legend',
			body: { color: { yellow: 'Yellow Label', pink: 'Pinky' } },
		},
	},
	{
		op: 'storms.getTemplate',
		endpoint: Storms.getTemplate,
		input: { stormId: 49999 },
		respondWith: () => ({ body: liveTemplate }),
		expect: { method: 'GET', path: '/storms/49999/template' },
	},
	{
		op: 'storms.updateSection',
		endpoint: Storms.updateSection,
		input: {
			stormId: 49999,
			sectionIndex: 'abcdef123456',
			name: 'New Section Title',
			character: '1',
		},
		respondWith: () => ({ body: { message: 'Section updated', status: 200 } }),
		expect: {
			method: 'PUT',
			path: '/storms/49999/section/abcdef123456',
			body: { name: 'New Section Title', character: '1' },
		},
	},
	{
		op: 'storms.getAccess',
		endpoint: Storms.getAccess,
		input: { stormId: 49999 },
		respondWith: () => ({ body: { administrator: false, type: 'viewer' } }),
		expect: { method: 'GET', path: '/storms/49999/access' },
	},
	{
		op: 'storms.listIdeas',
		endpoint: Storms.listIdeas,
		input: { stormId: 49999, lastModifiedMin: '2024-01-01T00:00:00Z' },
		respondWith: () => ({ body: { ideas: [idea] } }),
		expect: {
			method: 'GET',
			path: '/storms/49999/ideas',
			query: { lastModifiedMin: '2024-01-01T00:00:00Z' },
		},
	},
	{
		op: 'storms.listUsers',
		endpoint: Storms.listUsers,
		input: { stormId: 49999 },
		respondWith: () => ({ body: { users: [participant] } }),
		expect: { method: 'GET', path: '/storms/49999/users' },
	},
	{
		op: 'storms.list',
		endpoint: Storms.list,
		input: { status: 'closed', order: 'alpha', results: 50 },
		respondWith: () => ({ body: stormsPage }),
		expect: {
			method: 'GET',
			path: '/storms/list',
			query: { status: 'closed', order: 'alpha', results: '50' },
		},
	},
	{
		op: 'storms.listInvites',
		endpoint: Storms.listInvites,
		input: {},
		respondWith: () => ({ body: stormsPage }),
		expect: { method: 'GET', path: '/storms/invites' },
	},
	{
		op: 'storms.listConnectors',
		endpoint: Storms.listConnectors,
		input: { stormId: 49999 },
		respondWith: () => ({ body: { connectors: [connector] } }),
		expect: { method: 'GET', path: '/storms/49999/connectors' },
	},
	{
		op: 'storms.close',
		endpoint: Storms.close,
		input: { stormId: 49999 },
		respondWith: () => ({ body: { message: 'Storm closed' } }),
		expect: { method: 'DELETE', path: '/storms/49999/close' },
	},
	{
		op: 'storms.reopen',
		endpoint: Storms.reopen,
		input: { stormId: 49999 },
		respondWith: () => ({
			body: { message: 'Storm re-opened', storm: '49999' },
		}),
		expect: { method: 'POST', path: '/storms/49999/reopen', body: {} },
	},
	{
		op: 'storms.invite',
		endpoint: Storms.invite,
		input: {
			stormId: 49999,
			participants: ['ronald@mcdonalds.com', 'yoda@jedicouncil.com'],
			type: 'contributor',
		},
		respondWith: () => ({
			body: { message: 'Participants invited', invited: 2 },
		}),
		expect: {
			method: 'POST',
			path: '/storms/49999/invite',
			body: {
				participants: ['ronald@mcdonalds.com', 'yoda@jedicouncil.com'],
				type: 'contributor',
			},
		},
	},
	{
		op: 'storms.acceptInvite',
		endpoint: Storms.acceptInvite,
		input: { stormId: 49999 },
		respondWith: () => ({ body: { message: 'Invite accepted' } }),
		expect: { method: 'POST', path: '/storms/49999/invite/accept', body: {} },
	},
	{
		op: 'storms.declineInvite',
		endpoint: Storms.declineInvite,
		input: { stormId: 49999 },
		respondWith: () => ({ body: { message: 'Invite declined' } }),
		expect: { method: 'POST', path: '/storms/49999/invite/decline', body: {} },
	},
	{
		op: 'storms.join',
		endpoint: Storms.join,
		input: { stormid: 49999, stormkey: 'piece335' },
		respondWith: () => ({ body: { message: 'Storm joined' } }),
		expect: {
			method: 'POST',
			path: '/storms/join',
			body: { stormid: 49999, stormkey: 'piece335' },
		},
	},
	{
		op: 'storms.leave',
		endpoint: Storms.leave,
		input: { stormId: 49999 },
		respondWith: () => ({
			body: { message: 'Successfully left Storm', storm: '49999' },
		}),
		expect: { method: 'POST', path: '/storms/49999/leave', body: {} },
	},
	{
		op: 'storms.duplicate',
		endpoint: Storms.duplicate,
		input: { stormId: 49999, stormname: 'My Copied Storm' },
		respondWith: () => ({
			body: {
				message: 'Storm duplicated',
				stormid: 49999,
				stormkey: 'piece335',
			},
		}),
		expect: {
			method: 'POST',
			path: '/storms/49999/duplicate',
			body: { stormname: 'My Copied Storm' },
		},
	},
	{
		op: 'storms.favorite',
		endpoint: Storms.favorite,
		input: { stormId: 49999 },
		respondWith: () => ({ body: {} }),
		expect: { method: 'POST', path: '/storms/49999/favorite', body: {} },
	},
	{
		op: 'storms.unfavorite',
		endpoint: Storms.unfavorite,
		input: { stormId: 49999 },
		respondWith: () => ({ body: {} }),
		expect: { method: 'DELETE', path: '/storms/49999/favorite' },
	},
	{
		op: 'ideas.create',
		endpoint: Ideas.create,
		input: { stormid: 49999, data: 'My idea text' },
		respondWith: () => ({ body: { message: 'idea created', id: 10000001 } }),
		expect: {
			method: 'POST',
			path: '/ideas',
			body: { stormid: 49999, data: 'My idea text' },
		},
	},
	{
		op: 'ideas.update',
		endpoint: Ideas.update,
		input: { ideaId: 10000001, data: 'Updated text', color: 'pink' },
		respondWith: () => ({ body: { message: 'idea updated', id: 10000001 } }),
		expect: {
			method: 'PUT',
			path: '/ideas/10000001',
			body: { data: 'Updated text', color: 'pink' },
		},
	},
	{
		op: 'ideas.get',
		endpoint: Ideas.get,
		input: { ideaId: 1000000 },
		respondWith: () => ({ body: { idea } }),
		expect: { method: 'GET', path: '/ideas/1000000' },
	},
	{
		op: 'ideas.delete',
		endpoint: Ideas.remove,
		input: { ideaId: 1000000 },
		respondWith: () => ({ body: { message: 'idea deleted', id: '1000000' } }),
		expect: { method: 'DELETE', path: '/ideas/1000000' },
	},
	{
		op: 'ideas.addVote',
		endpoint: Ideas.addVote,
		input: { ideaId: 1000000 },
		respondWith: () => ({
			body: {
				message: 'vote added',
				id: '1000000',
				idea: { totalvotes: 8, myvotes: '7' },
				storm: { id: '49999', title: 'Play Storm', votesremaining: 3 },
			},
		}),
		expect: { method: 'POST', path: '/ideas/1000000/vote', body: {} },
	},
	{
		op: 'ideas.removeVote',
		endpoint: Ideas.removeVote,
		input: { ideaId: 1000000 },
		respondWith: () => ({
			body: {
				message: 'vote deleted',
				id: '1000000',
				idea: { totalvotes: 2, myvotes: '1' },
				storm: { id: '49999', title: 'Play Storm', votesremaining: 9 },
			},
		}),
		expect: { method: 'DELETE', path: '/ideas/1000000/vote' },
	},
	{
		op: 'ideas.createComment',
		endpoint: Ideas.createComment,
		input: { ideaId: 1000000, comment: 'My awesome comment' },
		respondWith: () => ({
			body: { message: 'comment saved', comment },
		}),
		expect: {
			method: 'POST',
			path: '/ideas/1000000/comments',
			body: { comment: 'My awesome comment' },
		},
	},
	{
		op: 'ideas.updateComment',
		endpoint: Ideas.updateComment,
		input: { ideaId: 1000000, commentId: 1234, comment: 'Edited' },
		respondWith: () => ({ body: { message: 'comment updated' } }),
		expect: {
			method: 'PUT',
			path: '/ideas/1000000/comments/1234',
			body: { comment: 'Edited' },
		},
	},
	{
		op: 'ideas.deleteComment',
		endpoint: Ideas.deleteComment,
		input: { ideaId: 1000000, commentId: 1234 },
		respondWith: () => ({
			body: { message: 'comment deleted', deletedby: 'James Dean' },
		}),
		expect: { method: 'DELETE', path: '/ideas/1000000/comments/1234' },
	},
	{
		op: 'ideas.listComments',
		endpoint: Ideas.listComments,
		input: { ideaId: 1000000, order: 'asc' },
		respondWith: () => ({
			body: {
				comments: [
					{
						comment: 'Here is an example of a comment. ',
						created: '2014-03-01T19:46:58+00:00',
						user: { id: '999', name: 'James Dean' },
					},
				],
			},
		}),
		expect: {
			method: 'GET',
			path: '/ideas/1000000/comments',
			query: { order: 'asc' },
		},
	},
	{
		op: 'ideas.createConnector',
		endpoint: Ideas.createConnector,
		input: {
			from_idea_id: 1000,
			to_idea_id: 1001,
			label: 'Depends On',
			color: 'pink',
		},
		respondWith: () => ({ body: liveConnectorSaved }),
		expect: {
			method: 'POST',
			path: '/ideas/connector',
			body: {
				from_idea_id: 1000,
				to_idea_id: 1001,
				label: 'Depends On',
				color: 'pink',
			},
		},
	},
	{
		op: 'ideas.createConnector (uuid refs)',
		endpoint: Ideas.createConnector,
		input: {
			from_idea_id: '1e7accc2-fb9b-4003-b98c-1924fe7f6c72',
			to_idea_id: 'b155f49a-f298-4a90-aaa8-7ce78b42ad00',
		},
		respondWith: () => ({ body: liveConnectorSaved }),
		expect: {
			method: 'POST',
			path: '/ideas/connector',
			body: {
				from_idea_id: '1e7accc2-fb9b-4003-b98c-1924fe7f6c72',
				to_idea_id: 'b155f49a-f298-4a90-aaa8-7ce78b42ad00',
			},
		},
	},
	{
		op: 'ideas.updateConnector',
		endpoint: Ideas.updateConnector,
		input: { connectorId: 9999, label: 'Depended On', color: 'yellow' },
		respondWith: () => ({
			body: {
				...liveConnectorSaved,
				connector: { ...liveConnectorSaved.connector, label: 'Depended On' },
			},
		}),
		expect: {
			method: 'PUT',
			path: '/ideas/connector/9999',
			body: { label: 'Depended On', color: 'yellow' },
		},
	},
	{
		op: 'ideas.deleteConnector',
		endpoint: Ideas.deleteConnector,
		input: { connectorId: 9999 },
		respondWith: () => ({ body: { message: 'Idea Connector deleted' } }),
		expect: { method: 'DELETE', path: '/ideas/connector/9999' },
	},
	{
		op: 'ideas.deleteConnectorBetween',
		endpoint: Ideas.deleteConnectorBetween,
		input: { from_idea_id: 1000, to_idea_id: 1001 },
		respondWith: () => ({ body: { message: 'Idea Connector deleted' } }),
		// The API reads the ids from a JSON body (live 11-20).
		expect: {
			method: 'DELETE',
			path: '/ideas/connector',
			body: { from_idea_id: 1000, to_idea_id: 1001 },
		},
	},
	{
		op: 'ideas.updateTask',
		endpoint: Ideas.updateTask,
		input: { ideaId: 1000000, assigned_to: 1, date_due: '2020-01-01' },
		respondWith: () => ({ body: { task } }),
		expect: {
			method: 'PUT',
			path: '/ideas/1000000/task',
			body: { assigned_to: 1, date_due: '2020-01-01' },
		},
	},
	{
		op: 'tags.createForStorm',
		endpoint: Tags.createForStorm,
		input: { stormId: 49999, name: 'Integration ID' },
		respondWith: () => ({ body: {} }),
		expect: {
			method: 'POST',
			path: '/storms/49999/tags',
			body: { name: 'Integration ID' },
		},
	},
	{
		op: 'tags.createForIdea',
		endpoint: Tags.createForIdea,
		input: {
			ideaId: 1000000,
			data: {
				'Integration ID': 'e65561b7-fb70-48f8-8286-26b72b5223b9',
				Owner: 'John Smith',
			},
		},
		respondWith: () => ({ body: {} }),
		expect: {
			method: 'POST',
			path: '/ideas/1000000/tags',
			body: {
				data: {
					'Integration ID': 'e65561b7-fb70-48f8-8286-26b72b5223b9',
					Owner: 'John Smith',
				},
			},
		},
	},
	{
		op: 'tags.listForStorm',
		endpoint: Tags.listForStorm,
		input: { stormId: 49999 },
		respondWith: () => ({ body: { tags: [tag] } }),
		expect: { method: 'GET', path: '/storms/49999/tags' },
	},
	{
		op: 'tags.getForIdea',
		endpoint: Tags.getForIdea,
		input: { ideaId: 1000000 },
		respondWith: () => ({
			body: {
				data: {
					'Integration ID': 'e65561b7-fb70-48f8-8286-26b72b5223b9',
					Owner: 'John Smith',
				},
			},
		}),
		expect: { method: 'GET', path: '/ideas/1000000/tags' },
	},
	{
		op: 'chat.create',
		endpoint: Chat.create,
		input: { stormId: 1234, message: 'Example Chat Message 1' },
		respondWith: () => ({ body: { message: chatMessage } }),
		expect: {
			method: 'POST',
			path: '/chat/1234',
			body: { message: 'Example Chat Message 1' },
		},
	},
	{
		op: 'chat.list',
		endpoint: Chat.list,
		input: { stormId: 1234 },
		respondWith: () => ({ body: { messages: [chatMessage] } }),
		expect: { method: 'GET', path: '/chat/1234/list' },
	},
	{
		op: 'chat.listUnread',
		endpoint: Chat.listUnread,
		input: { stormId: 1234 },
		respondWith: () => ({ body: { messages: [chatMessage] } }),
		expect: { method: 'GET', path: '/chat/1234/new' },
	},
	{
		op: 'chat.markAllRead',
		endpoint: Chat.markAllRead,
		input: { stormId: 1234 },
		respondWith: () => ({ body: { success: 1 } }),
		expect: { method: 'PUT', path: '/chat/1234/allread', body: {} },
	},
	{
		op: 'folders.list',
		endpoint: Folders.list,
		input: { teamId: 1234 },
		respondWith: () => ({ body: { templates: { standard: [] } } }),
		expect: { method: 'GET', path: '/folders/1234/list' },
	},
];

describe('stormboard requests, one per documented operation', () => {
	beforeEach(() => {
		fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(() => {
			throw new Error('unmocked fetch in a unit test');
		});
		mockLog.mockClear();
	});

	afterEach(() => {
		fetchMock.mockRestore();
	});

	it.each(cases)(
		'$op sends the documented request',
		async ({ endpoint, input, respondWith, expect: wanted }) => {
			const { body, status } = respondWith();
			respond(body, status ?? 200);

			await invoke(endpoint, input);

			expectAuthenticated();
			const sent = lastRequest();
			expect(sent.method).toBe(wanted.method);
			expect(sent.path).toBe(wanted.path);
			if (wanted.query) {
				expect(sent.query).toEqual(wanted.query);
			}
			if (wanted.body !== undefined) {
				expect(JSON.parse(sent.body as string)).toEqual(wanted.body);
			} else {
				expect(sent.body).toBeUndefined();
			}
		},
	);
});

describe('stormboard output parsing', () => {
	beforeEach(() => {
		fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(() => {
			throw new Error('unmocked fetch in a unit test');
		});
		mockLog.mockClear();
	});

	afterEach(() => {
		fetchMock.mockRestore();
	});

	it('parses a numeric success flag on chat.markAllRead', async () => {
		respond({ success: 1 });

		await expect(invoke(Chat.markAllRead, { stormId: 1234 })).resolves.toEqual({
			success: 1,
		});
	});

	it('parses the chat message object that rides under message', async () => {
		respond({ message: chatMessage });

		const result = await invoke(Chat.create, {
			stormId: 1234,
			message: 'Example Chat Message 1',
		});
		expect(result).toEqual({ message: chatMessage });
	});

	it('rejects a wrong-shaped idea record rather than returning a blank row', async () => {
		// String ids are valid (the docs' examples use both); an object id is not.
		respond({ idea: { id: { value: 1 } } });

		await expect(invoke(Ideas.get, { ideaId: 1 })).rejects.toThrow();
	});

	it('rejects an invite with a malformed participant email', async () => {
		respond({ message: 'Participants invited', invited: 1 });

		await expect(
			invoke(Storms.invite, {
				stormId: 49999,
				participants: ['not-an-email'],
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a storm list with an undocumented status', async () => {
		respond(stormsPage);

		await expect(invoke(Storms.list, { status: 'archived' })).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a create with a partial-week color record? no: rejects a bad coordinates pair', async () => {
		respond({ message: 'idea created', id: 1 });

		await expect(
			invoke(Ideas.create, {
				stormid: 49999,
				data: 'Idea',
				x: -5,
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('surfaces the 403 auth envelope as a typed error', async () => {
		respond(noAuth, 403);

		await expect(invoke(Storms.list, {})).rejects.toThrow(
			'Stormboard 403: No authentication method set, it is required for this endpoint',
		);
	});
});
