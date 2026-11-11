import { logEventFromContext } from 'corsair/core';
import {
	inboxAppsAddMessage,
	inboxAppsAddNote,
	inboxAppsAddSystemConfirmationMessage,
	inboxAppsCreateParticipant,
	inboxAppsDeactivate,
	inboxAppsDeleteParticipant,
	inboxAppsGetParticipants,
	inboxAppsInstall,
	inboxAppsInstalledApp,
	inboxAppsUpdateConversation,
	inboxAppsUpdateMessage,
	reactionsCreate,
	reactionsDelete,
	reactionsGet,
	teamInboxesList,
	threadedRepliesGet,
} from './inbox';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'fub-test-key';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Each endpoint returns its own output type,
// so the shared return is unknown.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

function invoke(endpoint: AnyEndpoint, input: unknown) {
	// The fake context only carries what call() reads: ctx.key and the
	// systemName/systemKey identification options, which stay unset so the
	// X-System header falls back to 'corsair'.
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

function respondEmpty(status: number) {
	fetchMock.mockResolvedValueOnce(new Response(null, { status }));
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
		// unknown: the request body is whatever the endpoint serialized.
		body: init.body ? (JSON.parse(String(init.body)) as unknown) : undefined,
	};
}

// FUB authenticates with the API key as the Basic username and an empty
// password, and identifies the calling system with X-System.
function expectAuthenticated() {
	const sent = lastRequest();
	expect(sent.origin).toBe('https://api.followupboss.com');
	expect(sent.path).toMatch(/^\/v1\//);
	expect(sent.headers.get('authorization')).toBe(
		`Basic ${Buffer.from(`${API_KEY}:`).toString('base64')}`,
	);
	expect(sent.headers.get('x-system')).toBe('corsair');
	expect(sent.headers.get('x-system-key')).toBeNull();
}

// Fixtures modeled on the response examples in the FUB inbox apps, team
// inboxes, reactions and threaded replies docs, with made-up apps and
// accounts; they live inline so this suite owns them.
const metadata = {
	collection: 'teamInboxes',
	offset: 0,
	limit: 10,
	total: 2,
	next: null,
	nextLink: null,
};

const participant = {
	id: 1,
	status: 'active',
	userId: null,
	personId: null,
	name: 'John Doe',
	phone: '+14075550123',
	email: 'john@example.com',
	isAutomation: false,
};

const inboxMessage = {
	id: 1,
	created: '2024-01-01T12:00:00Z',
	updated: '2024-01-01T12:00:00Z',
	sentAt: '2024-01-01T12:00:00Z',
	deliveryStatus: null,
	deliveryStatusErrorMessage: null,
	createdById: 1,
	updatedById: 1,
	isIncoming: true,
	message: 'An example message.',
	userId: 0,
	personId: 1,
	sender: { personId: 1, name: 'John Doe', email: null, phone: null },
	attachments: [],
	conversationDeepLinkUrl: 'https://app.followupboss.com/2/inbox-new/0/inbox/1',
};

const systemMessage = {
	id: 1,
	created: '2024-01-01T12:00:00Z',
	updated: '2024-01-01T12:00:00Z',
	sentAt: '2024-01-01T12:00:00Z',
	deliveryStatus: null,
	deliveryStatusErrorMessage: null,
	createdById: 1,
	updatedById: 1,
	isIncoming: true,
	isSystem: true,
	systemType: 'success',
	message: 'An example system confirmation message.',
	userId: 0,
	personId: 1,
	sender: { personId: 1, name: 'John Doe', email: null, phone: null },
	attachments: [],
	conversationDeepLinkUrl: 'https://app.followupboss.com/2/inbox-new/0/inbox/1',
};

const inboxNote = {
	id: 4,
	created: '2024-01-01T12:00:00Z',
	updated: '2024-01-01T12:00:00Z',
	createdById: 1,
	updatedById: 1,
	createdBy: 'John Doe',
	updatedBy: 'John Doe',
	conversationId: 1,
	body: 'An example note.',
	isHtml: false,
	type: 'ConversationNote',
	conversationDeepLinkUrl: 'https://app.followupboss.com/2/inbox-new/0/inbox/1',
};

const installedApp = {
	id: 1,
	created: '2024-01-01T12:00:00Z',
	updated: '2024-01-01T12:00:00Z',
	createdById: 1,
	updatedById: 1,
	status: 10,
	name: 'Example Inbox App',
	publishedInboxAppId: 1,
	userId: 1,
	canReply: true,
};

const conversation = {
	externalConversationId: 'ext-conversation-1',
	created: '2024-01-01T12:00:00Z',
	updated: '2024-01-01T12:00:00Z',
	createdById: 'John Doe',
	updatedById: 'John Doe',
	ownerUserId: 1,
	ownerSharedInboxId: 0,
	assignedUserId: 0,
	assignedSharedInboxId: 1,
	subject: 'A Conversation Subject',
	archived: false,
	person: { id: 1, name: null, email: null, phone: null },
	conversationDeepLinkUrl: 'https://app.followupboss.com/2/inbox-new/0/inbox/1',
};

const installation = {
	inboxAppId: 1,
	userId: 0,
	created: '2025-01-01T12:12:12Z',
};

const teamInbox = {
	id: 123,
	name: 'My Team Inbox',
	users: [{ id: 111, name: 'User Name', firstName: 'User', lastName: 'Name' }],
};

const reaction = {
	id: 1363,
	created: '2024-03-21T21:14:13Z',
	createdBy: 'Tom Minch',
	createdById: 1,
	refType: 'Note',
	refId: 2144705,
	body: '\u{1F92F}',
};

const threadedReply = {
	id: 1,
	created: '2024-01-11T18:50:12Z',
	updated: '2024-01-26T19:13:27Z',
	createdById: 1,
	refType: 'Note',
	refId: 468,
	body: 'Hello world part 2',
	reactions: reaction,
};

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('inboxApps', () => {
	it('deactivate DELETEs the inbox app and answers success from the 204', async () => {
		respondEmpty(204);

		const result = await invoke(inboxAppsDeactivate, { inboxAppId: 'app-1' });

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'DELETE',
			path: '/v1/inboxApps/app-1',
			body: undefined,
		});
		expect(result).toEqual({ success: true, inboxAppId: 'app-1' });
	});

	it('deleteParticipant encodes every segment of the four-segment path', async () => {
		respondEmpty(204);

		const result = await invoke(inboxAppsDeleteParticipant, {
			inboxAppId: 'app 1',
			extConversationId: 'wa/+15551234567',
			participantId: 'part 42',
		});

		// The external ids are provider-defined strings, so each of the four
		// path segments is percent-encoded individually.
		expect(lastRequest()).toMatchObject({
			method: 'DELETE',
			path: '/v1/inboxApps/app%201/conversations/wa%2F%2B15551234567/participants/part%2042',
			body: undefined,
		});
		expect(result).toEqual({ success: true, participantId: 'part 42' });
	});

	it('getParticipants parses the bare participant array', async () => {
		respond([participant, { ...participant, id: 2, userId: 1, name: null }]);

		const result = await invoke(inboxAppsGetParticipants, {
			inboxAppId: 'app-1',
			extConversationId: 'ext-conversation-1',
		});

		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/inboxApps/app-1/conversations/ext-conversation-1/participants',
			body: undefined,
		});
		expect(result).toEqual([
			participant,
			{ ...participant, id: 2, userId: 1, name: null },
		]);
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'followupboss.inboxApps.getParticipants',
			{ count: 2 },
			'completed',
		);
	});

	it('createParticipant POSTs the body and parses the 201 participant', async () => {
		respond(participant, 201);

		const result = await invoke(inboxAppsCreateParticipant, {
			inboxAppId: 'app-1',
			extConversationId: 'ext-conversation-1',
			body: { personId: 10 },
		});

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v1/inboxApps/app-1/conversations/ext-conversation-1/participants',
			body: { personId: 10 },
		});
		expect(lastRequest().headers.get('content-type')).toBe('application/json');
		expect(result).toEqual(participant);
	});

	it('addMessage POSTs the required message fields and parses the 201 message', async () => {
		respond(inboxMessage, 201);

		const result = await invoke(inboxAppsAddMessage, {
			inboxAppId: 'app-1',
			externalConversationId: 'ext-conversation-1',
			externalMessageId: 'ext-message-1',
			message: 'An example message.',
			isIncoming: true,
			sender: { personId: 1, name: 'John Doe' },
			deliveryStatus: 'Sent',
		});

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v1/inboxApps/app-1/message',
			body: {
				externalConversationId: 'ext-conversation-1',
				externalMessageId: 'ext-message-1',
				message: 'An example message.',
				isIncoming: true,
				sender: { personId: 1, name: 'John Doe' },
				deliveryStatus: 'Sent',
			},
		});
		expect(result).toEqual(inboxMessage);
	});

	it('addNote POSTs the note body and user and parses the 201 note', async () => {
		respond(inboxNote, 201);

		const result = await invoke(inboxAppsAddNote, {
			inboxAppId: 'app-1',
			externalConversationId: 'ext-conversation-1',
			body: 'An example note.',
			user: { id: '1' },
		});

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v1/inboxApps/app-1/note',
			body: {
				externalConversationId: 'ext-conversation-1',
				body: 'An example note.',
				user: { id: '1' },
			},
		});
		expect(result).toEqual(inboxNote);
	});

	it('addSystemConfirmationMessage POSTs the type and parses the 201 message', async () => {
		respond(systemMessage, 201);

		const result = await invoke(inboxAppsAddSystemConfirmationMessage, {
			inboxAppId: 'app-1',
			externalConversationId: 'ext-conversation-1',
			externalMessageId: 'ext-message-1',
			message: 'An example system confirmation message.',
			type: 'success',
		});

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v1/inboxApps/app-1/systemMessage',
			body: {
				externalConversationId: 'ext-conversation-1',
				externalMessageId: 'ext-message-1',
				message: 'An example system confirmation message.',
				type: 'success',
			},
		});
		expect(result).toEqual(systemMessage);
	});

	it('install POSTs the published app id, user scope and subscription url', async () => {
		respond(installedApp, 201);

		const result = await invoke(inboxAppsInstall, {
			publishedInboxAppId: 1,
			userId: 0,
			subscriptionUrl: 'https://acmeInboxApp.com/fub/replies',
		});

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v1/inboxApps/install',
			body: {
				publishedInboxAppId: 1,
				userId: 0,
				subscriptionUrl: 'https://acmeInboxApp.com/fub/replies',
			},
		});
		expect(result).toEqual(installedApp);
	});

	it('updateConversation PUTs the fields without the path ids', async () => {
		respond({ ...conversation, archived: true });

		const result = await invoke(inboxAppsUpdateConversation, {
			inboxAppId: 'app-1',
			extConversationId: 'ext-conversation-1',
			subject: 'A Conversation Subject',
			archived: true,
			assignedUserId: 0,
		});

		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			path: '/v1/inboxApps/app-1/conversations/ext-conversation-1',
			body: {
				subject: 'A Conversation Subject',
				archived: true,
				assignedUserId: 0,
			},
		});
		expect(result).toEqual({ ...conversation, archived: true });
	});

	it('updateMessage PUTs the delivery status without the inbox app id', async () => {
		respond(inboxMessage);

		const result = await invoke(inboxAppsUpdateMessage, {
			inboxAppId: 'app-1',
			id: 1,
			externalMessageId: 'ext-message-1',
			deliveryStatus: 'Read',
		});

		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			path: '/v1/inboxApps/app-1/message',
			body: {
				id: 1,
				externalMessageId: 'ext-message-1',
				deliveryStatus: 'Read',
			},
		});
		expect(result).toEqual(inboxMessage);
	});

	it('installedApp lists the installations of a published app', async () => {
		respond({ inboxApps: [installation] });

		const result = await invoke(inboxAppsInstalledApp, {
			publishedInboxAppId: '42',
		});

		// The installations path declares `publishedInboxAppId` as a string.
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/inboxApps/installedApps/42',
			body: undefined,
		});
		expect(result).toEqual({ inboxApps: [installation] });
	});
});

describe('teamInboxes', () => {
	it('list keeps every team inbox and the _metadata block', async () => {
		respond({ teamInboxes: [teamInbox], _metadata: metadata });

		const result = await invoke(teamInboxesList, {});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/teamInboxes',
			body: undefined,
		});
		expect(lastRequest().query).toEqual({});
		expect(result).toEqual({ teamInboxes: [teamInbox], _metadata: metadata });
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'followupboss.teamInboxes.list',
			{ count: 1 },
			'completed',
		);
	});
});

describe('reactions', () => {
	it('create POSTs the emoji body and parses the 201 reaction list', async () => {
		respond([reaction], 201);

		const result = await invoke(reactionsCreate, {
			refType: 'Note',
			refId: 2144705,
			body: '\u{1F92F}',
		});

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v1/reactions/Note/2144705',
			body: { body: '\u{1F92F}' },
		});
		expect(lastRequest().headers.get('content-type')).toBe('application/json');
		expect(result).toEqual([reaction]);
	});

	it.each(['oops', null])(
		'create rejects a %p reply instead of returning an empty list',
		async (body) => {
			respond(body, 201);

			await expect(
				invoke(reactionsCreate, { refType: 'Note', refId: 2144705, body: 'x' }),
			).rejects.toMatchObject({ name: 'ZodError' });
		},
	);

	it('create reads a bodyless reply as an empty list', async () => {
		respondEmpty(201);

		const result = await invoke(reactionsCreate, {
			refType: 'Note',
			refId: 2144705,
			body: 'x',
		});

		expect(result).toEqual([]);
	});

	it('delete forwards both the path and the DELETE body', async () => {
		respondEmpty(204);

		const result = await invoke(reactionsDelete, {
			refType: 'Note',
			refId: 2144705,
			emoji: '\u{1F92F}',
			body: '\u{1F92F}',
		});

		// This DELETE carries a body in the published contract, so the emoji
		// body must reach the wire alongside the path and the emoji query.
		expect(lastRequest()).toMatchObject({
			method: 'DELETE',
			path: '/v1/reactions/Note/2144705',
			body: { body: '\u{1F92F}' },
		});
		expect(lastRequest().query).toEqual({ emoji: '\u{1F92F}' });
		expect(lastRequest().headers.get('content-type')).toBe('application/json');
		expect(result).toEqual({ success: true, refType: 'Note', refId: 2144705 });
	});

	it('get fetches one reaction by id', async () => {
		respond(reaction);

		const result = await invoke(reactionsGet, { id: 1363 });

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/reactions/1363',
			body: undefined,
		});
		expect(result).toEqual(reaction);
	});
});

describe('threadedReplies', () => {
	it('get fetches one threaded reply with its reactions', async () => {
		respond(threadedReply);

		const result = await invoke(threadedRepliesGet, { id: 1 });

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/threadedReplies/1',
			body: undefined,
		});
		expect(result).toEqual(threadedReply);
	});
});

describe('input validation happens before any request', () => {
	// Every endpoint here rejects an empty input at the schema, so no fetch
	// is ever attempted and no queued response is consumed. teamInboxes.list
	// takes fully optional input and is therefore absent.
	const emptyInputs: [string, AnyEndpoint][] = [
		['inboxApps.deactivate', inboxAppsDeactivate],
		['inboxApps.deleteParticipant', inboxAppsDeleteParticipant],
		['inboxApps.getParticipants', inboxAppsGetParticipants],
		['inboxApps.createParticipant', inboxAppsCreateParticipant],
		['inboxApps.addMessage', inboxAppsAddMessage],
		['inboxApps.addNote', inboxAppsAddNote],
		[
			'inboxApps.addSystemConfirmationMessage',
			inboxAppsAddSystemConfirmationMessage,
		],
		['inboxApps.install', inboxAppsInstall],
		['inboxApps.updateConversation', inboxAppsUpdateConversation],
		['inboxApps.updateMessage', inboxAppsUpdateMessage],
		['inboxApps.installedApp', inboxAppsInstalledApp],
		['reactions.create', reactionsCreate],
		['reactions.delete', reactionsDelete],
		['reactions.get', reactionsGet],
		['threadedReplies.get', threadedRepliesGet],
	];

	it.each(emptyInputs)(
		'rejects an empty input to %s with a ZodError',
		async (_operation, endpoint) => {
			await expect(invoke(endpoint, {})).rejects.toMatchObject({
				name: 'ZodError',
			});
			expect(fetchMock).not.toHaveBeenCalled();
			expect(mockLog).not.toHaveBeenCalled();
		},
	);
});
