import { logEventFromContext } from 'corsair/core';
import {
	Account,
	Appointments,
	AppointmentTypes,
	Calls,
	Events,
	Notes,
	People,
	PeopleRelationships,
	PersonAttachments,
	SmartLists,
	Tasks,
	TextMessages,
	Timeframes,
} from './endpoints';
import {
	appointment,
	appointmentType,
	attachment,
	call,
	event,
	identity,
	me,
	metadata,
	note,
	person,
	relationship,
	smartList,
	task,
	textMessage,
	timeframe,
} from './test-fixtures';

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

function lastUrl() {
	const [url] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	return url;
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

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('people', () => {
	it('list keeps every person and the _metadata cursor block', async () => {
		const second = { ...person, id: 951 };
		respond({ people: [person, second], _metadata: metadata });

		const result = await invoke(People.list, {});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/people',
			body: undefined,
		});
		expect(lastRequest().query).toEqual({});
		expect(result).toEqual({
			people: [person, second],
			_metadata: metadata,
		});
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'followupboss.people.list',
			{ count: 2 },
			'completed',
		);
	});

	it('list joins the id and tags filters with commas and passes the rest as-is', async () => {
		respond({ people: [] });

		await invoke(People.list, {
			id: [950, 951],
			tags: ['A', 'B'],
			stage: 'Lead',
			sort: '-updated',
			limit: 25,
			offset: 50,
		});

		expect(lastRequest().query).toEqual({
			id: '950,951',
			tags: 'A,B',
			stage: 'Lead',
			sort: '-updated',
			limit: '25',
			offset: '50',
		});
	});

	it('get unwraps the single-person envelope', async () => {
		respond({ people: [person] });

		const result = await invoke(People.get, { id: 950 });

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/people/950',
			body: undefined,
		});
		expect(result).toEqual(person);
	});

	it('get sends fields and reads the documented picture object', async () => {
		const documented = {
			...person,
			picture: { small: 'https://p.example/a.jpg' },
		};
		respond(documented);

		const result = await invoke(People.get, { id: 950, fields: 'allFields' });

		expect(lastRequest().query).toEqual({ fields: 'allFields' });
		expect(result).toEqual(documented);
	});

	it('create sends timeframeId, collaborators and createdAt as documented', async () => {
		respond(person, 201);

		await invoke(People.create, {
			firstName: 'Ava',
			timeframeId: 1,
			collaborators: [21, 22],
			createdAt: '2026-01-15',
		});

		expect(lastRequest().body).toEqual({
			firstName: 'Ava',
			timeframeId: 1,
			collaborators: [21, 22],
			createdAt: '2026-01-15',
		});
	});

	it('update sends timeframeId', async () => {
		respond(person);

		await invoke(People.update, { id: 950, timeframeId: 2 });

		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			path: '/v1/people/950',
		});
		expect(lastRequest().body).toEqual({ timeframeId: 2 });
	});

	it('create POSTs the body without deduplicate and sends it as the query', async () => {
		const created = { ...person, id: 955 };
		respond(created, 201);

		const result = await invoke(People.create, {
			firstName: 'Ava',
			lastName: 'Reyes',
			tags: ['Buyer'],
			deduplicate: true,
		});

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v1/people',
			body: { firstName: 'Ava', lastName: 'Reyes', tags: ['Buyer'] },
		});
		expect(lastRequest().query).toEqual({ deduplicate: 'true' });
		expect(lastRequest().headers.get('content-type')).toBe('application/json');
		expect(result).toEqual(created);
	});

	it('create sends the contact details in the body', async () => {
		respond({ ...person, id: 956 }, 201);

		await invoke(People.create, {
			firstName: 'Ava',
			lastName: 'Reyes',
			emails: [{ value: 'ava@northwind.example', type: 'home' }],
			phones: [{ value: '888-555-0123', type: 'mobile' }],
			addresses: [{ city: 'Austin', state: 'TX' }],
		});

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v1/people',
			body: {
				firstName: 'Ava',
				lastName: 'Reyes',
				emails: [{ value: 'ava@northwind.example', type: 'home' }],
				phones: [{ value: '888-555-0123', type: 'mobile' }],
				addresses: [{ city: 'Austin', state: 'TX' }],
			},
		});
	});

	it('list forwards the keyset next cursor', async () => {
		respond({ people: [person] });

		await invoke(People.list, { next: 'eyJzaW5jZUlkIjoxMDV9' });

		expect(lastRequest().query).toEqual({
			next: 'eyJzaW5jZUlkIjoxMDV9',
		});
	});

	it('create omits the deduplicate query param when it is not given', async () => {
		// IDs are positive integers, so path segments never need escaping; the
		// seam to pin instead is that undefined query params must not appear.
		respond({ ...person, id: 956 }, 201);

		await invoke(People.create, { firstName: 'Noah' });

		expect(lastRequest().query).toEqual({});
		expect(lastRequest().body).toEqual({ firstName: 'Noah' });
	});

	it('update PUTs the body without mergeTags and sends it as the query', async () => {
		respond({ people: [person] });

		const result = await invoke(People.update, {
			id: 950,
			stage: 'Active',
			mergeTags: true,
		});

		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			path: '/v1/people/950',
			body: { stage: 'Active' },
		});
		expect(lastRequest().query).toEqual({ mergeTags: 'true' });
		expect(result).toEqual(person);
	});

	it('delete keeps the resource FUB echoes in the 200 body', async () => {
		respond({ ...person });

		const result = await invoke(People.delete, { id: 950 });

		expect(lastRequest()).toMatchObject({
			method: 'DELETE',
			path: '/v1/people/950',
			body: undefined,
		});
		expect(result).toEqual({ id: 950, resource: person });
	});

	it('checkDuplicate filters by email and answers the match summary', async () => {
		const match = { found: true, matchedBy: 'email', assignedTo: 'Maya Chen' };
		respond(match);

		const result = await invoke(People.checkDuplicate, {
			email: 'ava.reyes@example.com',
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/people/checkDuplicate',
		});
		expect(lastRequest().query).toEqual({ email: 'ava.reyes@example.com' });
		expect(result).toEqual(match);
	});

	it('checkDuplicate answers found: false when nobody matches', async () => {
		respond({ found: false });

		await expect(
			invoke(People.checkDuplicate, { phone: '+1 555-0199' }),
		).resolves.toEqual({ found: false });
	});

	it('unclaimed lists the offered leads behind the paging params', async () => {
		const unclaimed = { ...person, id: 970, contacted: false };
		respond({ people: [unclaimed], _metadata: metadata });

		const result = await invoke(People.unclaimed, { limit: 10 });

		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/people/unclaimed',
		});
		expect(lastRequest().query).toEqual({ limit: '10' });
		expect(result).toEqual({ people: [unclaimed], _metadata: metadata });
	});

	it('claim POSTs the personId as the path segment and the body', async () => {
		respond({ people: [person] });

		const result = await invoke(People.claim, { personId: 123 });

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v1/people/claim/123',
			body: { personId: 123 },
		});
		expect(result).toEqual(person);
	});

	it('ignoreUnclaimed turns the 204 into a success result', async () => {
		respondEmpty(204);

		const result = await invoke(People.ignoreUnclaimed, { personId: 123 });

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v1/people/ignoreUnclaimed/123',
			body: { personId: 123 },
		});
		expect(result).toEqual({ success: true, personId: 123 });
	});
});

describe('personAttachments', () => {
	it('create POSTs the file fields and unwraps the 201 envelope', async () => {
		respond({ personAttachments: [attachment] }, 201);

		const result = await invoke(PersonAttachments.create, {
			personId: 950,
			uri: attachment.uri,
			fileName: attachment.fileName,
			fileSize: attachment.fileSize,
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v1/personAttachments',
			body: {
				personId: 950,
				uri: attachment.uri,
				fileName: attachment.fileName,
				fileSize: attachment.fileSize,
			},
		});
		expect(lastRequest().headers.get('content-type')).toBe('application/json');
		expect(result).toEqual(attachment);
	});

	it('get unwraps the single-attachment envelope', async () => {
		respond({ personAttachments: [attachment] });

		const result = await invoke(PersonAttachments.get, { id: 7 });

		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/personAttachments/7',
		});
		expect(result).toEqual(attachment);
	});

	it('update PUTs the fields without the id', async () => {
		respond({ personAttachments: [attachment] });

		const result = await invoke(PersonAttachments.update, {
			id: 7,
			personId: 950,
			uri: attachment.uri,
			fileName: attachment.fileName,
			fileSize: attachment.fileSize,
		});

		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			path: '/v1/personAttachments/7',
			body: {
				personId: 950,
				uri: attachment.uri,
				fileName: attachment.fileName,
				fileSize: attachment.fileSize,
			},
		});
		expect(result).toEqual(attachment);
	});

	it('delete answers success from the 204', async () => {
		respondEmpty(204);

		const result = await invoke(PersonAttachments.delete, { id: 7 });

		expect(lastRequest()).toMatchObject({
			method: 'DELETE',
			path: '/v1/personAttachments/7',
		});
		// The 204 has no body, so the optional resource echo stays null.
		expect(result).toEqual({ id: 7, resource: null });
	});
});

describe('peopleRelationships', () => {
	it('list unwraps the relationships envelope', async () => {
		respond({ peopleRelationships: [relationship] });

		const result = await invoke(PeopleRelationships.list, { personId: 950 });

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/peopleRelationships',
		});
		expect(lastRequest().query).toEqual({ personId: '950' });
		expect(result).toEqual({ peopleRelationships: [relationship] });
	});

	it('create accepts the bare relationship FUB answers with', async () => {
		respond(relationship, 201);

		const result = await invoke(PeopleRelationships.create, {
			personId: 950,
			firstName: 'Marco',
			lastName: 'Reyes',
			type: 'Spouse',
		});

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v1/peopleRelationships',
			body: {
				personId: 950,
				firstName: 'Marco',
				lastName: 'Reyes',
				type: 'Spouse',
			},
		});
		expect(result).toEqual(relationship);
	});

	it('get unwraps the single-relationship envelope', async () => {
		respond({ peopleRelationships: [relationship] });

		const result = await invoke(PeopleRelationships.get, { id: 12 });

		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/peopleRelationships/12',
		});
		expect(result).toEqual(relationship);
	});

	it('update PUTs the fields without the id', async () => {
		respond({ peopleRelationships: [relationship] });

		const result = await invoke(PeopleRelationships.update, {
			id: 12,
			type: 'Partner',
		});

		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			path: '/v1/peopleRelationships/12',
			body: { type: 'Partner' },
		});
		expect(result).toEqual(relationship);
	});

	it('delete answers success from the 204', async () => {
		respondEmpty(204);

		const result = await invoke(PeopleRelationships.delete, { id: 12 });

		expect(lastRequest()).toMatchObject({
			method: 'DELETE',
			path: '/v1/peopleRelationships/12',
		});
		// The 204 has no body, so the optional resource echo stays null.
		expect(result).toEqual({ id: 12, resource: null });
	});
});

describe('calls', () => {
	it('list filters by person and keeps the _metadata block', async () => {
		respond({ calls: [call], _metadata: metadata });

		const result = await invoke(Calls.list, { personId: 950 });

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/calls',
		});
		expect(lastRequest().query).toEqual({ personId: '950' });
		expect(result).toEqual({ calls: [call], _metadata: metadata });
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'followupboss.calls.list',
			{ count: 1 },
			'completed',
		);
	});

	it('create logs the call from its required body fields', async () => {
		respond({ calls: [call] }, 201);

		const result = await invoke(Calls.create, {
			personId: 950,
			phone: call.phone,
			isIncoming: false,
			note: call.note,
			outcome: 'Interested',
			duration: 254,
		});

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v1/calls',
			body: {
				personId: 950,
				phone: call.phone,
				isIncoming: false,
				note: call.note,
				outcome: 'Interested',
				duration: 254,
			},
		});
		expect(result).toEqual(call);
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'followupboss.calls.create',
			{ personId: 950 },
			'completed',
		);
	});

	it('get unwraps the single-call envelope', async () => {
		respond({ calls: [call] });

		const result = await invoke(Calls.get, { id: 88 });

		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/calls/88',
		});
		expect(result).toEqual(call);
	});

	it('update PUTs the fields without the id', async () => {
		respond({ calls: [call] });

		const result = await invoke(Calls.update, {
			id: 88,
			note: 'Left a voicemail.',
			duration: 61,
		});

		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			path: '/v1/calls/88',
			body: { note: 'Left a voicemail.', duration: 61 },
		});
		expect(result).toEqual(call);
	});
});

describe('textMessages', () => {
	it('list unwraps the messages envelope', async () => {
		respond({ textMessages: [textMessage] });

		const result = await invoke(TextMessages.list, {});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/textMessages',
			body: undefined,
		});
		expect(lastRequest().query).toEqual({});
		expect(result).toEqual({ textMessages: [textMessage] });
	});

	it('create POSTs the required message fields', async () => {
		respond({ textMessages: [textMessage] }, 201);

		const result = await invoke(TextMessages.create, {
			personId: 950,
			message: textMessage.message,
			toNumber: textMessage.toNumber,
			fromNumber: textMessage.fromNumber,
			isIncoming: false,
			externalLabel: 'Frontdesk',
		});

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v1/textMessages',
			body: {
				personId: 950,
				message: textMessage.message,
				toNumber: textMessage.toNumber,
				fromNumber: textMessage.fromNumber,
				isIncoming: false,
				externalLabel: 'Frontdesk',
			},
		});
		expect(result).toEqual(textMessage);
	});

	it('get unwraps the single-message envelope', async () => {
		respond({ textMessages: [textMessage] });

		const result = await invoke(TextMessages.get, { id: 33 });

		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/textMessages/33',
		});
		expect(result).toEqual(textMessage);
	});
});

describe('notes', () => {
	it('create POSTs the note fields', async () => {
		respond({ notes: [note] }, 201);

		const result = await invoke(Notes.create, {
			personId: 950,
			subject: note.subject,
			body: note.body,
			isHtml: false,
		});

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v1/notes',
			body: {
				personId: 950,
				subject: note.subject,
				body: note.body,
				isHtml: false,
			},
		});
		expect(result).toEqual(note);
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'followupboss.notes.create',
			{ personId: 950 },
			'completed',
		);
	});

	it('get sends both include flags as booleans', async () => {
		// A single fetch arrives as `{ notes: [note] }` and the route returns
		// the bare note, like every other single GET.
		respond({ notes: [note] });

		const result = await invoke(Notes.get, {
			id: 55,
			includeThreadedReplies: true,
			includeReactions: false,
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/notes/55',
		});
		expect(lastRequest().query).toEqual({
			includeThreadedReplies: 'true',
			includeReactions: 'false',
		});
		expect(result).toEqual(note);
	});

	it('update PUTs the fields without the id', async () => {
		respond({ notes: [note] });

		const result = await invoke(Notes.update, {
			id: 55,
			body: 'Approved up to $520,000 with First Bank.',
		});

		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			path: '/v1/notes/55',
			body: { body: 'Approved up to $520,000 with First Bank.' },
		});
		expect(result).toEqual(note);
	});

	it('delete keeps the resource FUB echoes in the 200 body', async () => {
		respond({ id: 55 });

		const result = await invoke(Notes.delete, { id: 55 });

		expect(lastRequest()).toMatchObject({
			method: 'DELETE',
			path: '/v1/notes/55',
		});
		expect(result).toEqual({ id: 55, resource: { id: 55 } });
	});
});

describe('documented write fields', () => {
	it.each([
		[
			'calls.create',
			Calls.create,
			{
				personId: 950,
				phone: '+1 555-0142',
				isIncoming: false,
				userId: 21,
				recordingUrl: 'https://rec.example/88.mp3',
			},
		],
		[
			'calls.update',
			Calls.update,
			{ id: 88, userId: 21, recordingUrl: 'https://rec.example/88.mp3' },
		],
		[
			'tasks.create',
			Tasks.create,
			{
				personId: 950,
				name: 'Call back',
				dueDateTime: '2026-05-15T17:00:00Z',
				remindSecondsBefore: 900,
			},
		],
		[
			'tasks.update',
			Tasks.update,
			{ id: 301, personId: 950, assignedTo: 'Maya Chen', assignedUserId: 21 },
		],
		[
			'appointments.create',
			Appointments.create,
			{
				title: 'Showing',
				start: '2026-05-21T17:00:00Z',
				end: '2026-05-21T18:00:00Z',
				outcomeId: 3,
			},
		],
		['appointments.update', Appointments.update, { id: 402, outcomeId: 3 }],
	] as const)('%s sends every documented field', async (_, endpoint, input) => {
		respond({ id: 1 });

		await invoke(endpoint, input);

		const { id: _id, ...body } = input as Record<string, unknown>;
		expect(lastRequest().body).toEqual(body);
	});
});

describe('events', () => {
	it('create sends the page, campaign, search and history fields', async () => {
		respond({}, 201);
		const input = {
			type: 'Viewed Page',
			source: 'cedarlane.example',
			person: { firstName: 'Ava' },
			occurredAt: '2026-05-01T10:00:00Z',
			pageTitle: 'Cedar Lane',
			pageUrl: 'https://cedarlane.example/82-cedar',
			pageReferrer: 'https://www.google.com',
			pageDuration: 45,
			campaign: { source: 'Google', medium: 'organic' },
			property: { street: '82 Cedar Lane', code: '83702', price: 475000 },
			propertySearch: {
				city: 'Boise',
				code: ['83702', '83706'],
				maxPrice: 500000,
			},
		};

		await invoke(Events.create, input);

		expect(lastRequest()).toMatchObject({ method: 'POST', path: '/v1/events' });
		expect(lastRequest().body).toEqual(input);
	});

	it('list joins the type filter with commas and passes the cursor through', async () => {
		respond({ events: [event] });

		const result = await invoke(Events.list, {
			type: ['Registration', 'Inquiry'],
			next: metadata.next,
			personId: 950,
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/events',
		});
		expect(lastRequest().query).toEqual({
			type: 'Registration,Inquiry',
			next: metadata.next,
			personId: '950',
		});
		expect(result).toEqual({ events: [event] });
	});

	it('get unwraps the single-event envelope', async () => {
		respond({ events: [event] });

		const result = await invoke(Events.get, { id: 601 });

		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/events/601',
		});
		expect(result).toEqual(event);
	});

	it('create answers with an empty result on the 204', async () => {
		respondEmpty(204);

		const input = {
			type: 'Registration',
			system: 'Open House Pro',
			source: 'Open House Form',
			person: {
				firstName: 'Ava',
				lastName: 'Reyes',
				emails: [{ value: 'ava.reyes@example.com' }],
			},
		};

		const result = await invoke(Events.create, input);

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v1/events',
			body: input,
		});
		expect(result).toEqual({});
	});

	it('create keeps the event when FUB answers 200 with the envelope', async () => {
		respond({ event });

		const result = await invoke(Events.create, {
			type: 'Inquiry',
			person: { id: 950 },
		});

		expect(lastRequest().body).toEqual({
			type: 'Inquiry',
			person: { id: 950 },
		});
		expect(result).toEqual({ event });
	});
});

describe('tasks', () => {
	it('list filters by person, completion and due range', async () => {
		respond({ tasks: [task], _metadata: metadata });

		const result = await invoke(Tasks.list, {
			personId: 950,
			isCompleted: false,
			due: 'overdue',
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/tasks',
		});
		expect(lastRequest().query).toEqual({
			personId: '950',
			isCompleted: 'false',
			due: 'overdue',
		});
		expect(result).toEqual({ tasks: [task], _metadata: metadata });
	});

	it('create POSTs the task fields and logs the new id', async () => {
		respond({ tasks: [task] }, 201);

		const result = await invoke(Tasks.create, {
			personId: 950,
			name: task.name,
			type: 'Follow Up',
			dueDate: '2026-05-15',
		});

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v1/tasks',
			body: {
				personId: 950,
				name: task.name,
				type: 'Follow Up',
				dueDate: '2026-05-15',
			},
		});
		expect(result).toEqual(task);
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'followupboss.tasks.create',
			{ taskId: 301 },
			'completed',
		);
	});

	it('get unwraps the single-task envelope', async () => {
		respond({ tasks: [task] });

		const result = await invoke(Tasks.get, { id: 301 });

		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/tasks/301',
		});
		expect(result).toEqual(task);
	});

	it('update PUTs the fields without the id', async () => {
		const completed = {
			...task,
			isCompleted: true,
			completed: '2026-05-15T18:00:00+00:00',
		};
		respond(completed);

		const result = await invoke(Tasks.update, { id: 301, isCompleted: true });

		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			path: '/v1/tasks/301',
			body: { isCompleted: true },
		});
		expect(result).toEqual(completed);
	});

	it('delete answers success from the 204', async () => {
		respondEmpty(204);

		const result = await invoke(Tasks.delete, { id: 301 });

		expect(lastRequest()).toMatchObject({
			method: 'DELETE',
			path: '/v1/tasks/301',
		});
		// The 204 has no body, so the optional resource echo stays null.
		expect(result).toEqual({ id: 301, resource: null });
	});
});

describe('appointments', () => {
	it('list filters by the date range and user', async () => {
		respond({ appointments: [appointment] });

		const result = await invoke(Appointments.list, {
			start: '2026-05-01T00:00:00+00:00',
			end: '2026-05-31T23:59:59+00:00',
			userId: 21,
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/appointments',
		});
		expect(lastRequest().query).toEqual({
			start: '2026-05-01T00:00:00+00:00',
			end: '2026-05-31T23:59:59+00:00',
			userId: '21',
		});
		expect(result).toEqual({ appointments: [appointment] });
	});

	it('list percent-encodes the reserved + in the ISO dates on the wire', () => {
		respond({ appointments: [] });

		return invoke(Appointments.list, {
			start: '2026-05-01T00:00:00+00:00',
			end: '2026-05-31T23:59:59+00:00',
		}).then(() => {
			expect(lastUrl()).toBe(
				'https://api.followupboss.com/v1/appointments?start=2026-05-01T00%3A00%3A00%2B00%3A00&end=2026-05-31T23%3A59%3A59%2B00%3A00',
			);
		});
	});

	it('create POSTs the body without sendInvitation and sends it as the query', async () => {
		respond({ appointments: [appointment] }, 201);

		const result = await invoke(Appointments.create, {
			title: appointment.title,
			start: '2026-05-21T17:00:00+00:00',
			end: '2026-05-21T18:00:00+00:00',
			invitees: [{ id: 950, type: 'person' }],
			sendInvitation: true,
		});

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v1/appointments',
			body: {
				title: appointment.title,
				start: '2026-05-21T17:00:00+00:00',
				end: '2026-05-21T18:00:00+00:00',
				invitees: [{ id: 950, type: 'person' }],
			},
		});
		expect(lastRequest().query).toEqual({ sendInvitation: 'true' });
		expect(result).toEqual(appointment);
	});

	it('get unwraps the single-appointment envelope', async () => {
		respond({ appointments: [appointment] });

		const result = await invoke(Appointments.get, { id: 402 });

		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/appointments/402',
		});
		expect(result).toEqual(appointment);
	});

	it('update PUTs the fields without the id and keeps sendInvitation in the query', async () => {
		respond({ appointments: [appointment] });

		const result = await invoke(Appointments.update, {
			id: 402,
			location: 'Video call',
			sendInvitation: false,
		});

		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			path: '/v1/appointments/402',
			body: { location: 'Video call' },
		});
		expect(lastRequest().query).toEqual({ sendInvitation: 'false' });
		expect(result).toEqual(appointment);
	});

	it('delete turns the 204 into a success result', async () => {
		respondEmpty(204);

		const result = await invoke(Appointments.delete, { id: 402 });

		expect(lastRequest()).toMatchObject({
			method: 'DELETE',
			path: '/v1/appointments/402',
		});
		expect(result).toEqual({ success: true, id: 402 });
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'followupboss.appointments.delete',
			{ appointmentId: 402 },
			'completed',
		);
	});
});

describe('appointmentTypes', () => {
	it('list unwraps the types envelope', async () => {
		respond({ appointmentTypes: [appointmentType] });

		const result = await invoke(AppointmentTypes.list, { sort: 'orderWeight' });

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/appointmentTypes',
		});
		expect(lastRequest().query).toEqual({ sort: 'orderWeight' });
		expect(result).toEqual({ appointmentTypes: [appointmentType] });
	});

	it('create POSTs the type fields', async () => {
		respond({ appointmentTypes: [appointmentType] }, 201);

		const result = await invoke(AppointmentTypes.create, {
			name: 'Showing',
			orderWeight: 1,
		});

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v1/appointmentTypes',
			body: { name: 'Showing', orderWeight: 1 },
		});
		expect(result).toEqual(appointmentType);
	});

	it('get unwraps the single-type envelope', async () => {
		respond({ appointmentTypes: [appointmentType] });

		const result = await invoke(AppointmentTypes.get, { id: 6 });

		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/appointmentTypes/6',
		});
		expect(result).toEqual(appointmentType);
	});

	it('update PUTs the fields without the id', async () => {
		const renamed = { ...appointmentType, name: 'Buyer showing' };
		respond(renamed);

		const result = await invoke(AppointmentTypes.update, {
			id: 6,
			name: 'Buyer showing',
		});

		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			path: '/v1/appointmentTypes/6',
			body: { name: 'Buyer showing' },
		});
		expect(result).toEqual(renamed);
	});

	it('delete requires assignTypeId in the query to reassign appointments', async () => {
		respondEmpty(204);

		const result = await invoke(AppointmentTypes.delete, {
			id: 6,
			assignTypeId: 9,
		});

		expect(lastRequest()).toMatchObject({
			method: 'DELETE',
			path: '/v1/appointmentTypes/6',
		});
		expect(lastRequest().query).toEqual({ assignTypeId: '9' });
		// The 204 has no body, so the optional resource echo stays null.
		expect(result).toEqual({ id: 6, resource: null });
	});
});

describe('timeframes', () => {
	it('list unwraps the timeframes envelope', async () => {
		respond({ timeframes: [timeframe] });

		const result = await invoke(Timeframes.list, {});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/timeframes',
			body: undefined,
		});
		expect(lastRequest().query).toEqual({});
		expect(result).toEqual({ timeframes: [timeframe] });
	});
});

describe('smartLists', () => {
	it('list sends the fub2 and all flags', async () => {
		respond({ smartLists: [smartList] });

		const result = await invoke(SmartLists.list, {
			fub2: true,
			all: true,
			limit: 50,
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/smartLists',
		});
		expect(lastRequest().query).toEqual({
			fub2: 'true',
			all: 'true',
			limit: '50',
		});
		expect(result).toEqual({ smartLists: [smartList] });
	});

	it('get unwraps the single-list envelope', async () => {
		respond({ smartLists: [smartList] });

		const result = await invoke(SmartLists.get, { id: 3 });

		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/smartLists/3',
		});
		expect(result).toEqual(smartList);
	});
});

describe('account', () => {
	it('me passes the flat user object straight through', async () => {
		respond(me);

		const result = await invoke(Account.me, {});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/me',
			body: undefined,
		});
		expect(result).toEqual(me);
	});

	it('identity passes the account identity straight through', async () => {
		respond(identity);

		const result = await invoke(Account.identity, {});

		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/identity',
			body: undefined,
		});
		expect(result).toEqual(identity);
	});
});

describe('input validation happens before any request', () => {
	// Every endpoint here rejects an empty input at the schema, so no fetch
	// is ever attempted and no queued response is consumed.
	const emptyInputs: [string, AnyEndpoint][] = [
		['people.get', People.get],
		['people.delete', People.delete],
		['people.checkDuplicate', People.checkDuplicate],
		['calls.create', Calls.create],
		['notes.create', Notes.create],
		['textMessages.create', TextMessages.create],
		['appointments.create', Appointments.create],
		['appointmentTypes.delete', AppointmentTypes.delete],
		['tasks.create', Tasks.create],
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
