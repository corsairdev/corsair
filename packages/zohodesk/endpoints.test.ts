import { logEventFromContext } from 'corsair/core';
import { ZodError } from 'zod';
import { ZohoDeskAPIError } from './client';
import {
	Agents,
	Contacts,
	Departments,
	Organizations,
	Roles,
	Tasks,
	Tickets,
} from './endpoints';
import {
	AGENT_ID,
	agent,
	CONTACT_ID,
	comment,
	contact,
	contactAccount,
	DEPARTMENT_ID,
	department,
	errorBody,
	ORG_ID,
	organization,
	resolution,
	role,
	THREAD_ID,
	TICKET_ID,
	taskResults,
	team,
	thread,
	ticket,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const TOKEN = '1000.test-access-token';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Each endpoint returns its own output type,
// so the shared return is unknown.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

function fakeDb() {
	return {
		tickets: { upsertByEntityId: jest.fn().mockResolvedValue({}) },
		contacts: { upsertByEntityId: jest.fn().mockResolvedValue({}) },
	};
}

function fakeCtx() {
	return {
		key: TOKEN,
		options: { region: 'us' },
		tenantId: 'default',
		keys: {
			get_tenant_external_id: jest.fn().mockResolvedValue(ORG_ID),
			set_tenant_external_id: jest.fn().mockResolvedValue(undefined),
		},
		db: fakeDb(),
	};
}

// unknown: negative cases pass values no schema accepts.
function invoke(
	endpoint: AnyEndpoint,
	input: unknown,
	ctx: ReturnType<typeof fakeCtx> = fakeCtx(),
) {
	// The fake context only carries what the endpoints read.
	return endpoint(ctx as never, input as never);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json;charset=UTF-8' },
		}),
	);
}

function respondEmpty() {
	fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }));
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
		body: init.body,
	};
}

function expectAuthenticated() {
	const { headers, origin } = lastRequest();
	expect(origin).toBe('https://desk.zoho.com');
	expect(headers.get('authorization')).toBe(`Zoho-oauthtoken ${TOKEN}`);
	expect(headers.get('orgId')).toBe(ORG_ID);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	jest.restoreAllMocks();
});

type Case = {
	name: string;
	endpoint: AnyEndpoint;
	// unknown: each endpoint takes its own input shape.
	input: Record<string, unknown>;
	path: string;
	query?: Record<string, string>;
	// unknown: each endpoint answers with its own JSON.
	body: unknown;
	event: string;
	// unknown: compared with toMatchObject against the endpoint's result.
	expected?: unknown;
};

const readCases: Case[] = [
	{
		name: 'tickets.list sends every filter, comma-joined',
		endpoint: Tickets.list,
		input: {
			from: 10,
			limit: 50,
			departmentIds: ['1', '2'],
			viewId: '77',
			assignee: ['Unassigned', '5'],
			teamIds: ['8', '9'],
			channel: ['Email', 'Web'],
			status: ['Open', 'On Hold'],
			priority: ['High', 'Low'],
			sortBy: '-createdTime',
			receivedInDays: 30,
			include: ['contacts', 'assignee'],
			fields: ['subject', 'webUrl'],
		},
		path: '/api/v1/tickets',
		query: {
			from: '10',
			limit: '50',
			departmentIds: '1,2',
			viewId: '77',
			assignee: 'Unassigned,5',
			teamIds: '8,9',
			channel: 'Email,Web',
			status: 'Open,On Hold',
			priority: 'High,Low',
			sortBy: '-createdTime',
			receivedInDays: '30',
			include: 'contacts,assignee',
			fields: 'subject,webUrl',
		},
		body: { data: [ticket] },
		event: 'zohodesk.tickets.list',
		expected: {
			data: [{ id: TICKET_ID, threadCount: '121', sharedCount: '0' }],
		},
	},
	{
		name: 'tickets.get',
		endpoint: Tickets.get,
		input: { ticketId: TICKET_ID, include: ['contract', 'skills'] },
		path: `/api/v1/tickets/${TICKET_ID}`,
		query: { include: 'contract,skills' },
		body: ticket,
		event: 'zohodesk.tickets.get',
		expected: { subject: ticket.subject, assignee: { firstName: 'Jack' } },
	},
	{
		name: 'tickets.getResolution',
		endpoint: Tickets.getResolution,
		input: { ticketId: TICKET_ID },
		path: `/api/v1/tickets/${TICKET_ID}/resolution`,
		body: resolution,
		event: 'zohodesk.tickets.getResolution',
		expected: {
			content: resolution.content,
			author: { id: 160200000000068000 },
		},
	},
	{
		name: 'tickets.getLatestThread',
		endpoint: Tickets.getLatestThread,
		input: {
			ticketId: TICKET_ID,
			needPublic: true,
			needIncomingThread: false,
			include: ['plainText'],
			threadStatus: 'success',
		},
		path: `/api/v1/tickets/${TICKET_ID}/latestThread`,
		query: {
			needPublic: 'true',
			needIncomingThread: 'false',
			include: 'plainText',
			threadStatus: 'success',
		},
		body: thread,
		event: 'zohodesk.tickets.getLatestThread',
		expected: { id: THREAD_ID, direction: 'out' },
	},
	{
		name: 'tickets.getThread',
		endpoint: Tickets.getThread,
		input: {
			ticketId: TICKET_ID,
			threadId: THREAD_ID,
			include: ['plainText'],
		},
		path: `/api/v1/tickets/${TICKET_ID}/threads/${THREAD_ID}`,
		query: { include: 'plainText' },
		body: { ...thread, plainText: 'We found the cause.' },
		event: 'zohodesk.tickets.getThread',
		expected: { plainText: 'We found the cause.' },
	},
	{
		name: 'tickets.listConversations',
		endpoint: Tickets.listConversations,
		input: { ticketId: TICKET_ID, from: 5, limit: 200 },
		path: `/api/v1/tickets/${TICKET_ID}/conversations`,
		query: { from: '5', limit: '200' },
		body: { data: [thread, comment] },
		event: 'zohodesk.tickets.listConversations',
		expected: {
			data: [{ id: THREAD_ID }, { type: 'comment', isPublic: false }],
		},
	},
	{
		name: 'contacts.list',
		endpoint: Contacts.list,
		input: {
			from: 1,
			limit: 100,
			viewId: '11',
			filterId: '12',
			sortBy: '-createdTime',
			include: ['accounts'],
			fields: ['firstName', 'email'],
		},
		path: '/api/v1/contacts',
		query: {
			from: '1',
			limit: '100',
			viewId: '11',
			filterId: '12',
			sortBy: '-createdTime',
			include: 'accounts',
			fields: 'firstName,email',
		},
		body: { data: [contact] },
		event: 'zohodesk.contacts.list',
		expected: { data: [{ id: CONTACT_ID, accountCount: '1' }] },
	},
	{
		name: 'contacts.get',
		endpoint: Contacts.get,
		input: { contactId: CONTACT_ID, include: ['accounts', 'owner'] },
		path: `/api/v1/contacts/${CONTACT_ID}`,
		query: { include: 'accounts,owner' },
		body: {
			...contact,
			owner: { id: '5', firstName: 'Jack', lastName: 'Rue' },
		},
		event: 'zohodesk.contacts.get',
		expected: { email: contact.email, owner: { firstName: 'Jack' } },
	},
	{
		name: 'contacts.getByIds',
		endpoint: Contacts.getByIds,
		input: { ids: [CONTACT_ID, '1892000000772003'] },
		path: '/api/v1/contacts/contactsByIds',
		query: { ids: `${CONTACT_ID},1892000000772003` },
		body: { data: [contact] },
		event: 'zohodesk.contacts.getByIds',
		expected: { data: [{ id: CONTACT_ID }] },
	},
	{
		name: 'contacts.listAccounts',
		endpoint: Contacts.listAccounts,
		input: {
			contactId: CONTACT_ID,
			from: 1,
			limit: 20,
			sortBy: 'accountName',
			startsWith: 'Z',
		},
		path: `/api/v1/contacts/${CONTACT_ID}/accounts`,
		query: { from: '1', limit: '20', sortBy: 'accountName', startsWith: 'Z' },
		body: { data: [contactAccount] },
		event: 'zohodesk.contacts.listAccounts',
		expected: { data: [{ mappingInfo: { mappingType: 'PRIMARY' } }] },
	},
	{
		name: 'agents.get',
		endpoint: Agents.get,
		input: { agentId: AGENT_ID, include: ['role', 'verifiedEmails'] },
		path: `/api/v1/agents/${AGENT_ID}`,
		query: { include: 'role,verifiedEmails' },
		body: agent,
		event: 'zohodesk.agents.get',
		expected: { emailId: agent.emailId, role: { name: 'CEO' } },
	},
	{
		name: 'agents.getCount',
		endpoint: Agents.getCount,
		input: { status: 'ACTIVE', isConfirmed: true, includeLightAgent: false },
		path: '/api/v1/agents/count',
		query: {
			status: 'ACTIVE',
			isConfirmed: 'true',
			includeLightAgent: 'false',
		},
		body: { count: 5 },
		event: 'zohodesk.agents.getCount',
		expected: { count: 5 },
	},
	{
		name: 'departments.list',
		endpoint: Departments.list,
		input: {
			from: 0,
			limit: 200,
			isEnabled: true,
			searchStr: 'Zyl*',
			chatStatus: '${UNAVAILABLE}',
		},
		path: '/api/v1/departments',
		query: {
			from: '0',
			limit: '200',
			isEnabled: 'true',
			searchStr: 'Zyl*',
			chatStatus: '${UNAVAILABLE}',
		},
		body: { data: [department] },
		event: 'zohodesk.departments.list',
		expected: { data: [{ id: DEPARTMENT_ID, hasLogo: true }] },
	},
	{
		name: 'departments.get',
		endpoint: Departments.get,
		input: { departmentId: DEPARTMENT_ID },
		path: `/api/v1/departments/${DEPARTMENT_ID}`,
		body: { ...department, associatedAgentIds: ['1892000000042001'] },
		event: 'zohodesk.departments.get',
		expected: { name: 'Zylker', associatedAgentIds: ['1892000000042001'] },
	},
	{
		name: 'departments.getCount',
		endpoint: Departments.getCount,
		input: { isEnabled: false },
		path: '/api/v1/departments/count',
		query: { isEnabled: 'false' },
		body: { count: 5 },
		event: 'zohodesk.departments.getCount',
		expected: { count: 5 },
	},
	{
		name: 'departments.listTeams',
		endpoint: Departments.listTeams,
		input: {
			departmentId: DEPARTMENT_ID,
			from: 0,
			limit: 10,
			searchStr: 'Tier',
		},
		path: `/api/v1/departments/${DEPARTMENT_ID}/teams`,
		query: { from: '0', limit: '10', searchStr: 'Tier' },
		body: { teams: [team] },
		event: 'zohodesk.departments.listTeams',
		expected: { teams: [{ name: 'Tier 2', departmentId: DEPARTMENT_ID }] },
	},
	{
		name: 'roles.list',
		endpoint: Roles.list,
		input: {
			from: 0,
			limit: 500,
			isVisible: true,
			isDefault: false,
			searchStr: '*lead*',
		},
		path: '/api/v1/roles',
		query: {
			from: '0',
			limit: '500',
			isVisible: 'true',
			isDefault: 'false',
			searchStr: '*lead*',
		},
		body: { data: [role] },
		event: 'zohodesk.roles.list',
		expected: { data: [{ name: 'CEO', reportsTo: null }] },
	},
	{
		name: 'roles.listByIds',
		endpoint: Roles.listByIds,
		input: { roleIds: ['4000000012423', '4000000012420'] },
		path: '/api/v1/rolesByIds',
		query: { roleIds: '4000000012423,4000000012420' },
		body: { data: [role] },
		event: 'zohodesk.roles.listByIds',
		expected: { data: [{ id: role.id }] },
	},
];

describe('Zoho Desk read endpoints', () => {
	it.each(readCases)('$name', async (testCase) => {
		respond(testCase.body);

		const result = await invoke(testCase.endpoint, testCase.input);

		const sent = lastRequest();
		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(sent.method).toBe('GET');
		expect(sent.path).toBe(testCase.path);
		expect(sent.query).toEqual(testCase.query ?? {});
		expect(sent.body).toBeUndefined();
		expectAuthenticated();
		expect(result).toMatchObject(testCase.expected as object);
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			testCase.event,
			expect.any(Object),
			'completed',
		);
	});

	it('sends no query at all when a list has no options', async () => {
		respond({ data: [ticket] });

		await invoke(Tickets.list, {});

		expect(lastRequest().query).toEqual({});
	});

	it('defaults the conversation limit, which the reference marks required', async () => {
		respond({ data: [] });

		await invoke(Tickets.listConversations, { ticketId: TICKET_ID });

		expect(lastRequest().query).toEqual({ limit: '100' });
	});
});

describe('Zoho Desk tasks.updateMany', () => {
	it('POSTs the update as JSON and keeps per-task failures in the result', async () => {
		respond(taskResults);
		const input = {
			ids: ['1892000000093303', '1892000000050003'],
			fieldName: 'priority',
			fieldValue: 'High',
			isCustomField: false,
		};

		const result = await invoke(Tasks.updateMany, input);

		const sent = lastRequest();
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe('/api/v1/tasks/updateMany');
		expect(sent.query).toEqual({});
		expect(sent.headers.get('content-type')).toBe('application/json');
		expect(JSON.parse(String(sent.body))).toEqual(input);
		expectAuthenticated();
		expect(result).toMatchObject({
			results: [
				{ success: true, errors: null },
				{ success: false, errors: { errorCode: 'UNPROCESSABLE_ENTITY' } },
			],
		});
	});

	it('allows a missing fieldValue, which the reference marks optional', async () => {
		respond({ results: [] });

		await invoke(Tasks.updateMany, { ids: ['1'], fieldName: 'dueDate' });

		expect(JSON.parse(String(lastRequest().body))).toEqual({
			ids: ['1'],
			fieldName: 'dueDate',
		});
	});

	it('logs a count rather than the IDs and value', async () => {
		respond({ results: [] });

		await invoke(Tasks.updateMany, {
			ids: ['1', '2'],
			fieldName: 'subject',
			fieldValue: 'private note',
		});

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'zohodesk.tasks.updateMany',
			{ taskCount: 2, fieldName: 'subject', isCustomField: undefined },
			'completed',
		);
	});

	it('rejects more than 50 IDs before calling Zoho', async () => {
		const ids = Array.from({ length: 51 }, (_, index) => String(index));

		await expect(
			invoke(Tasks.updateMany, { ids, fieldName: 'subject' }),
		).rejects.toBeInstanceOf(ZodError);
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('Zoho Desk organizations.list', () => {
	it('sends no orgId header, as the one route documented without it', async () => {
		respond({ data: [organization] });
		const ctx = fakeCtx();

		const result = await invoke(Organizations.list, {}, ctx);

		const sent = lastRequest();
		expect(sent.method).toBe('GET');
		expect(sent.path).toBe('/api/v1/organizations');
		expect(sent.headers.get('authorization')).toBe(`Zoho-oauthtoken ${TOKEN}`);
		expect(sent.headers.has('orgId')).toBe(false);
		expect(ctx.keys.get_tenant_external_id).not.toHaveBeenCalled();
		expect(result).toMatchObject({
			data: [{ id: ORG_ID, isDefault: 'false', isAdminInOrg: true }],
		});
	});
});

describe('Zoho Desk department logos', () => {
	const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0xff, 0x00, 0xfe]);

	it('downloads the logo without corrupting binary bytes', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(png, {
				status: 200,
				headers: { 'Content-Type': 'image/png' },
			}),
		);

		const result = await invoke(Departments.getLogo, {
			departmentId: DEPARTMENT_ID,
			fileSize: 'THUMBNAIL',
		});

		const sent = lastRequest();
		expect(sent.method).toBe('GET');
		expect(sent.path).toBe(`/api/v1/departments/${DEPARTMENT_ID}/logo`);
		expect(sent.query).toEqual({ fileSize: 'THUMBNAIL' });
		expectAuthenticated();
		expect(result).toEqual({
			contentType: 'image/png',
			contentBase64: png.toString('base64'),
			size: png.length,
		});
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'zohodesk.departments.getLogo',
			{ departmentId: DEPARTMENT_ID, fileSize: 'THUMBNAIL' },
			'completed',
		);
	});

	it('uploads the logo as multipart form data under departmentLogo', async () => {
		respondEmpty();

		const result = await invoke(Departments.uploadLogo, {
			departmentId: DEPARTMENT_ID,
			fileName: 'logo.PNG',
			contentBase64: png.toString('base64'),
		});

		const sent = lastRequest();
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe(`/api/v1/departments/${DEPARTMENT_ID}/logo`);
		expectAuthenticated();
		// fetch sets the multipart boundary itself, so nothing may preset this.
		expect(sent.headers.has('content-type')).toBe(false);

		expect(sent.body).toBeInstanceOf(FormData);
		const file = (sent.body as FormData).get('departmentLogo') as File;
		expect(file.name).toBe('logo.PNG');
		expect(file.type).toBe('image/png');
		expect(Buffer.from(await file.arrayBuffer()).equals(png)).toBe(true);
		expect(result).toEqual({ uploaded: true });
	});

	it('keeps the image bytes out of the event log', async () => {
		respondEmpty();

		await invoke(Departments.uploadLogo, {
			departmentId: DEPARTMENT_ID,
			fileName: 'logo.gif',
			contentBase64: png.toString('base64'),
		});

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'zohodesk.departments.uploadLogo',
			{ departmentId: DEPARTMENT_ID, fileName: 'logo.gif' },
			'completed',
		);
	});

	it('still reports success if Zoho answers an upload with JSON', async () => {
		respond({ logoURL: 'https://desk.zoho.com/logo' });

		await expect(
			invoke(Departments.uploadLogo, {
				departmentId: DEPARTMENT_ID,
				fileName: 'logo.png',
				contentBase64: png.toString('base64'),
			}),
		).resolves.toMatchObject({ uploaded: true });
	});

	it.each([
		['a file type Zoho refuses', { fileName: 'logo.svg' }],
		['a data URL', { contentBase64: 'data:image/png;base64,iVBORw0KGgo=' }],
		[
			'more than 2MB',
			{
				contentBase64: Buffer.alloc(2 * 1024 * 1024 + 1).toString('base64'),
			},
		],
	])('rejects %s before calling Zoho', async (_name, override) => {
		await expect(
			invoke(Departments.uploadLogo, {
				departmentId: DEPARTMENT_ID,
				fileName: 'logo.png',
				contentBase64: png.toString('base64'),
				...override,
			}),
		).rejects.toBeInstanceOf(ZodError);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('accepts a logo of exactly 2MB', async () => {
		respondEmpty();

		await expect(
			invoke(Departments.uploadLogo, {
				departmentId: DEPARTMENT_ID,
				fileName: 'logo.jpeg',
				contentBase64: Buffer.alloc(2 * 1024 * 1024).toString('base64'),
			}),
		).resolves.toEqual({ uploaded: true });
	});

	it('turns a failed download into a typed error', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(JSON.stringify(errorBody('URL_NOT_FOUND', 'No logo')), {
				status: 404,
				headers: { 'Content-Type': 'application/json' },
			}),
		);

		const error = await invoke(Departments.getLogo, {
			departmentId: DEPARTMENT_ID,
		}).catch((caught) => caught);

		expect(error).toBeInstanceOf(ZohoDeskAPIError);
		expect(error).toMatchObject({ status: 404, code: 'URL_NOT_FOUND' });
	});
});

describe('Zoho Desk empty answers', () => {
	it.each<[string, AnyEndpoint, Record<string, unknown>, unknown]>([
		['tickets.list', Tickets.list, {}, { data: [] }],
		[
			'tickets.listConversations',
			Tickets.listConversations,
			{ ticketId: TICKET_ID },
			{ data: [] },
		],
		['contacts.list', Contacts.list, {}, { data: [] }],
		['contacts.getByIds', Contacts.getByIds, { ids: ['1'] }, { data: [] }],
		[
			'contacts.listAccounts',
			Contacts.listAccounts,
			{ contactId: CONTACT_ID },
			{ data: [] },
		],
		['departments.list', Departments.list, {}, { data: [] }],
		[
			'departments.listTeams',
			Departments.listTeams,
			{ departmentId: DEPARTMENT_ID },
			{ teams: [] },
		],
		['organizations.list', Organizations.list, {}, { data: [] }],
		['roles.list', Roles.list, {}, { data: [] }],
		['roles.listByIds', Roles.listByIds, { roleIds: ['1'] }, { data: [] }],
		[
			'tickets.getLatestThread',
			Tickets.getLatestThread,
			{ ticketId: TICKET_ID },
			null,
		],
		[
			'tickets.getResolution',
			Tickets.getResolution,
			{ ticketId: TICKET_ID },
			null,
		],
	])('%s answers a 204', async (_name, endpoint, input, expected) => {
		respondEmpty();

		await expect(invoke(endpoint, input)).resolves.toEqual(expected);
	});
});

describe('Zoho Desk input validation', () => {
	it.each<[string, AnyEndpoint, Record<string, unknown>]>([
		['a limit above the tickets maximum', Tickets.list, { limit: 101 }],
		['a limit of zero on tickets', Tickets.list, { limit: 0 }],
		['a negative offset', Tickets.list, { from: -1 }],
		['more than 30 fields', Tickets.list, { fields: Array(31).fill('a') }],
		['an unknown include', Tickets.get, { ticketId: '1', include: ['x'] }],
		[
			'an unknown thread status',
			Tickets.getLatestThread,
			{
				ticketId: '1',
				threadStatus: 'pending',
			},
		],
		[
			'a conversation limit above 200',
			Tickets.listConversations,
			{
				ticketId: '1',
				limit: 201,
			},
		],
		['a contact limit above 100', Contacts.list, { limit: 101 }],
		[
			'more than 20 contact IDs',
			Contacts.getByIds,
			{
				ids: Array(21).fill('1'),
			},
		],
		['no contact IDs', Contacts.getByIds, { ids: [] }],
		['an unknown agent status', Agents.getCount, { status: 'AWAY' }],
		['a department limit above 200', Departments.list, { limit: 201 }],
		[
			'an unknown logo size',
			Departments.getLogo,
			{
				departmentId: '1',
				fileSize: 'HUGE',
			},
		],
		['a role limit above 500', Roles.list, { limit: 501 }],
		[
			'more than 50 role IDs',
			Roles.listByIds,
			{ roleIds: Array(51).fill('1') },
		],
		['a missing ticket ID', Tickets.get, {}],
	])('rejects %s', async (_name, endpoint, input) => {
		await expect(invoke(endpoint, input)).rejects.toBeInstanceOf(ZodError);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it.each(['../../organizations', '1/../2', '1?x=1', '%2e%2e', '12a'])(
		'refuses to put %s in a URL path',
		async (ticketId) => {
			await expect(invoke(Tickets.get, { ticketId })).rejects.toBeInstanceOf(
				ZodError,
			);
			expect(fetchMock).not.toHaveBeenCalled();
		},
	);

	it('rejects numeric IDs, which lose precision above 2^53', async () => {
		await expect(
			invoke(Tickets.get, { ticketId: 1892000000042034 }),
		).rejects.toBeInstanceOf(ZodError);
	});
});

describe('Zoho Desk output validation', () => {
	it('keeps fields the schema does not know about', async () => {
		respond({ ...ticket, newZohoField: { nested: true } });

		await expect(
			invoke(Tickets.get, { ticketId: TICKET_ID }),
		).resolves.toMatchObject({ newZohoField: { nested: true } });
	});

	it('accepts a response carrying only an ID', async () => {
		respond({ id: TICKET_ID });

		await expect(invoke(Tickets.get, { ticketId: TICKET_ID })).resolves.toEqual(
			{ id: TICKET_ID },
		);
	});

	it('accepts numbers and booleans in either JSON type', async () => {
		respond({ data: [{ ...ticket, isSpam: 'false', threadCount: 121 }] });

		await expect(invoke(Tickets.list, {})).resolves.toMatchObject({
			data: [{ isSpam: 'false', threadCount: 121 }],
		});
	});

	it('rejects a body that is not the documented shape', async () => {
		respond({ data: 'nope' });

		await expect(invoke(Tickets.list, {})).rejects.toBeInstanceOf(ZodError);
	});
});

describe('Zoho Desk local sync', () => {
	it('saves listed tickets with IDs as strings', async () => {
		const ctx = fakeCtx();
		respond({ data: [{ ...ticket, id: 42, ticketNumber: 101 }] });

		await invoke(Tickets.list, {}, ctx);

		expect(ctx.db.tickets.upsertByEntityId).toHaveBeenCalledTimes(1);
		expect(ctx.db.tickets.upsertByEntityId).toHaveBeenCalledWith(
			'42',
			expect.objectContaining({
				id: '42',
				ticketNumber: '101',
				subject: ticket.subject,
				contactId: CONTACT_ID,
			}),
		);
	});

	it('saves a fetched ticket', async () => {
		const ctx = fakeCtx();
		respond(ticket);

		await invoke(Tickets.get, { ticketId: TICKET_ID }, ctx);

		expect(ctx.db.tickets.upsertByEntityId).toHaveBeenCalledWith(
			TICKET_ID,
			expect.objectContaining({ status: 'Open' }),
		);
	});

	it.each<[string, AnyEndpoint, Record<string, unknown>, unknown]>([
		['contacts.list', Contacts.list, {}, { data: [contact] }],
		['contacts.get', Contacts.get, { contactId: CONTACT_ID }, contact],
		[
			'contacts.getByIds',
			Contacts.getByIds,
			{ ids: ['1'] },
			{ data: [contact] },
		],
	])('%s saves contacts', async (_name, endpoint, input, body) => {
		const ctx = fakeCtx();
		respond(body);

		await invoke(endpoint, input, ctx);

		expect(ctx.db.contacts.upsertByEntityId).toHaveBeenCalledWith(
			CONTACT_ID,
			expect.objectContaining({ email: contact.email }),
		);
	});

	it.each<[string, AnyEndpoint, 'tickets' | 'contacts', unknown]>([
		['tickets', Tickets.list, 'tickets', { data: [{ id: TICKET_ID }] }],
		['contacts', Contacts.list, 'contacts', { data: [{ id: CONTACT_ID }] }],
	])(
		'does not save %s from a fields selection, which would blank stored columns',
		async (_name, endpoint, table, body) => {
			const ctx = fakeCtx();
			respond(body);

			await invoke(endpoint, { fields: ['subject'] }, ctx);

			expect(ctx.db[table].upsertByEntityId).not.toHaveBeenCalled();
		},
	);

	it('skips a row with no ID', async () => {
		const ctx = fakeCtx();
		respond({ data: [{ subject: 'no id' }] });

		await invoke(Tickets.list, {}, ctx);

		expect(ctx.db.tickets.upsertByEntityId).not.toHaveBeenCalled();
	});

	it('still returns the answer when saving fails', async () => {
		const warn = jest
			.spyOn(console, 'warn')
			.mockImplementation(() => undefined);
		const ctx = fakeCtx();
		ctx.db.tickets.upsertByEntityId.mockRejectedValueOnce(new Error('disk'));
		respond(ticket);

		await expect(
			invoke(Tickets.get, { ticketId: TICKET_ID }, ctx),
		).resolves.toMatchObject({ id: TICKET_ID });
		expect(warn).toHaveBeenCalled();
	});
});
