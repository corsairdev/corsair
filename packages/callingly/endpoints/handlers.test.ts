import * as Handlers from './handlers';

const fetchMock = jest.spyOn(globalThis, 'fetch');

/** Every member of the entity client, as a jest.fn, so the mock satisfies the real type. */
function makeEntityClient() {
	return {
		findByEntityId: jest.fn(),
		existsByEntityId: jest.fn(),
		findIdByEntityId: jest.fn(),
		findById: jest.fn(),
		findManyByEntityIds: jest.fn(),
		list: jest.fn(),
		search: jest.fn(),
		upsertByEntityId: jest.fn(),
		deleteById: jest.fn(),
		deleteByEntityId: jest.fn(),
		count: jest.fn(),
	};
}

const db = {
	leads: makeEntityClient(),
	calls: makeEntityClient(),
	users: makeEntityClient(),
	teams: makeEntityClient(),
	teamUsers: makeEntityClient(),
	schedules: makeEntityClient(),
	clients: makeEntityClient(),
	webhooks: makeEntityClient(),
};

type Ctx = Parameters<typeof Handlers.getLead>[0];

const ctx: Ctx = {
	key: 'cg-test-token',
	options: {},
	db,
	endpoints: {},
	$getAccountId: async () => 'test-account',
	keys: {
		get_dek: async () => '',
		get_api_key: async () => 'cg-test-token',
		set_api_key: async () => {},
		get_webhook_signature: async () => null,
		set_webhook_signature: async () => {},
		issue_new_dek: async () => '',
	},
};

// Safe: the value is only passed to JSON.stringify, which accepts anything.
// A narrower type is not practical because tests send many different response shapes.
function json(body: unknown, status = 200): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: { 'Content-Type': 'application/json' },
	});
}

type SentRequest = {
	method: string;
	url: string;
	headers: Record<string, string>;
	// Safe: only compared with toEqual against literal request bodies.
	// A narrower type is not practical because each route sends a different JSON body.
	body: unknown;
};

function lastRequest(): SentRequest {
	const call = fetchMock.mock.calls.at(-1);
	if (!call) throw new Error('fetch was never called');
	const [input, init] = call;
	const headers = new Headers(init?.headers);
	return {
		method: init?.method ?? 'GET',
		url: input instanceof Request ? input.url : String(input),
		headers: Object.fromEntries(headers.entries()),
		body: typeof init?.body === 'string' ? JSON.parse(init.body) : undefined,
	};
}

const API = 'https://api.callingly.com/v1';

/** Samples copied from https://help.callingly.com/article/38-api */
const lead = {
	id: 1,
	account_id: 1,
	lead_owner_id: 4,
	fname: 'Test',
	lname: 'Lead',
	email: 'test@lead.com',
	phone_number: '+14801234567',
	source: 'Webhook',
	source_id: null,
	created_at: '2024-05-21 23:37:54',
	company: 'Callingly',
	category: null,
	status: 'missed',
	result: null,
	team: { id: 1, name: 'Team 1' },
	tags: [],
	stage: null,
	scheduled_call_at: '06/13/24 3:48pm MST',
	is_stopped: 0,
	is_blocked: 0,
};

const listedLead = {
	...lead,
	calls: [
		{
			id: 1,
			source: null,
			seconds: 0,
			direction: 'outbound',
			status: null,
			result: null,
			agent_retry: 0,
			lead_retry: 0,
			started_at: '2024-06-03 23:57:04',
			recording_url: null,
		},
	],
	lead_owner: {
		name: 'Bartholome Wilkinson',
		phone_number: '+14801239876',
		custom_id: null,
	},
};

const call = {
	id: 1234,
	started_at: '2020-11-11 12:08:13',
	direction: 'outbound',
	status: 'completed',
	status_formatted: 'Completed',
	lead_status: 'contacted',
	seconds: 5,
	duration: '5s',
	recording_url: 'https://cdn.callingly.com/recordings/example.mp3',
	error_message: null,
	user: {
		id: 1,
		name: 'Michael Scott',
		fname: 'Michael',
		lname: 'Scott',
		email: 'michael@dundermifflin.com',
		phone_number: '+11234567890',
	},
	lead: {
		id: 1234567,
		name: 'Example Lead',
		phone_number: '+11234567890',
		deleted_at: null,
	},
	profile: { id: 12345, name: 'Example Team' },
	transcript: 'Speaker A: Hello this is a call...',
	is_error: 0,
	error_code: '',
};

const listedCall = {
	id: 12343,
	started_at: '2020-11-30 10:54:01',
	direction: 'outbound',
	status: 'completed',
	lead_status: null,
	seconds: 37,
	duration: '37s',
	source: 'Dashboard',
	member: [],
	lead: [],
	profile: [],
	recording_url: 'https://cdn.callingly.com/recordings/da3c0bf.mp3',
};

const agent = {
	id: 123,
	account_id: 1,
	fname: 'John',
	lname: 'Smith',
	phone_number: '+16024819661',
	ext: '',
	donotdisturb: 0,
	priority: 1,
	timezone: 'America/Phoenix',
	is_available: true,
};

const schedule = [
	{
		label: 'Sunday',
		day: 0,
		is_available: false,
		times: [{ start: 'allday', end: '20:00:00' }],
	},
	{
		label: 'Monday',
		day: 1,
		is_available: true,
		times: [{ start: '06:00:00', end: '20:00:00' }],
	},
];

const team = {
	id: 123,
	account_id: 1,
	name: 'Main Team',
	is_record: 1,
	call_mode: 'simultaneous',
	retries: 3,
	retry_schedule: [15, 60, 120],
	is_users_available_for_call: true,
};

const teamAgents = {
	agents: [
		{ id: 1, name: 'John Smith', priority: 1, cap: null },
		{ id: 2, name: 'Test Test', priority: 1, cap: 1000 },
	],
};

const client = {
	id: 123,
	name: 'Client Name',
	email: 'client@email.com',
	billed_users: 12,
	billed_numbers: 2,
};

const webhook = {
	id: 1123,
	name: 'My Webhook',
	account_id: 1,
	event: 'call_completed',
	target_url: 'http://example.com/',
	call_status: null,
	call_lead_status: null,
	team_id: 1,
	number_id: 1,
	field: null,
	filter: null,
};

beforeEach(() => {
	fetchMock.mockReset();
	for (const table of Object.values(db)) {
		for (const fn of Object.values(table)) fn.mockReset();
	}
});

afterAll(() => {
	fetchMock.mockRestore();
});

describe('leads', () => {
	it('getLead sends GET /leads/{id} and stores the lead', async () => {
		fetchMock.mockResolvedValueOnce(json(lead));
		const result = await Handlers.getLead(ctx, { leadId: 1 });
		expect(lastRequest()).toEqual({
			method: 'GET',
			url: `${API}/leads/1`,
			headers: {
				accept: 'application/json',
				authorization: 'Bearer cg-test-token',
			},
			body: undefined,
		});
		expect(result).toEqual(lead);
		expect(db.leads.upsertByEntityId).toHaveBeenCalledWith('1', lead);
	});

	it('listLeads sends the documented filters as query params', async () => {
		fetchMock.mockResolvedValueOnce(json([listedLead]));
		const result = await Handlers.listLeads(ctx, {
			start: '2020-01-01',
			end: '2020-02-01',
			phone_number: '+14801234567',
		});
		expect(lastRequest().method).toBe('GET');
		expect(lastRequest().url).toBe(
			`${API}/leads?start=2020-01-01&end=2020-02-01&phone_number=%2B14801234567`,
		);
		expect(result).toEqual([listedLead]);
		expect(db.leads.upsertByEntityId).toHaveBeenCalledWith('1', listedLead);
	});

	it('updateLead sends PUT /leads/{id} with only the changed fields', async () => {
		fetchMock.mockResolvedValueOnce(json({ ...lead, status: 'contacted' }));
		const result = await Handlers.updateLead(ctx, {
			leadId: 1,
			status: 'contacted',
			is_stopped: 1,
		});
		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			url: `${API}/leads/1`,
			body: { status: 'contacted', is_stopped: 1 },
		});
		expect(lastRequest().headers['content-type']).toBe('application/json');
		expect(result.status).toBe('contacted');
	});

	it('deleteLead sends DELETE /leads/{id} and removes the local row', async () => {
		fetchMock.mockResolvedValueOnce(json({ success: true }));
		const result = await Handlers.deleteLead(ctx, { leadId: 7 });
		expect(lastRequest()).toMatchObject({
			method: 'DELETE',
			url: `${API}/leads/7`,
			body: undefined,
		});
		expect(result).toEqual({ success: true });
		expect(db.leads.deleteByEntityId).toHaveBeenCalledWith('7');
	});
});

describe('calls', () => {
	it('createCall sends POST /calls with the lead and team', async () => {
		fetchMock.mockResolvedValueOnce(json(call));
		const result = await Handlers.createCall(ctx, {
			account_id: 1,
			team_id: 123,
			first_name: 'John',
			last_name: 'Doe',
			phone_number: '555-555-5555',
			email: 'john@doe.com',
			scheduled_at: '2026-03-06 14:26:35',
		});
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			url: `${API}/calls`,
			body: {
				account_id: 1,
				team_id: 123,
				first_name: 'John',
				last_name: 'Doe',
				phone_number: '555-555-5555',
				email: 'john@doe.com',
				scheduled_at: '2026-03-06 14:26:35',
			},
		});
		expect(result).toEqual(call);
		expect(db.calls.upsertByEntityId).toHaveBeenCalledWith('1234', call);
	});

	it('createCall accepts a call_id response and stores it under that id', async () => {
		fetchMock.mockResolvedValueOnce(json({ call_id: 555 }));
		const result = await Handlers.createCall(ctx, {
			team_id: 123,
			phone_number: '+14801234567',
		});
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			url: `${API}/calls`,
			body: { team_id: 123, phone_number: '+14801234567' },
		});
		expect(result).toEqual({ call_id: 555 });
		expect(db.calls.upsertByEntityId).toHaveBeenCalledWith('555', {
			call_id: 555,
			id: 555,
		});
	});

	it('getCall sends GET /calls/{id}', async () => {
		fetchMock.mockResolvedValueOnce(json(call));
		const result = await Handlers.getCall(ctx, { callId: 1234 });
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			url: `${API}/calls/1234`,
		});
		expect(result.transcript).toBe('Speaker A: Hello this is a call...');
	});

	it('listCalls sends paging filters and parses empty PHP relations', async () => {
		fetchMock.mockResolvedValueOnce(json({ data: [listedCall] }));
		const result = await Handlers.listCalls(ctx, {
			start: '2020-01-01',
			end: '2020-02-01',
			team_id: 123,
			limit: 10,
			page: 1,
		});
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			url: `${API}/calls?start=2020-01-01&end=2020-02-01&team_id=123&limit=10&page=1`,
		});
		expect(result).toEqual({ data: [listedCall] });
		expect(db.calls.upsertByEntityId).toHaveBeenCalledWith('12343', listedCall);
	});
});

describe('agents', () => {
	it('createAgent sends POST /agents', async () => {
		fetchMock.mockResolvedValueOnce(json(agent));
		const result = await Handlers.createAgent(ctx, {
			fname: 'John',
			lname: 'Smith',
			phone_number: '555-555-5555',
			ext: '100',
			timezone: 'America/Phoenix',
		});
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			url: `${API}/agents`,
			body: {
				fname: 'John',
				lname: 'Smith',
				phone_number: '555-555-5555',
				ext: '100',
				timezone: 'America/Phoenix',
			},
		});
		expect(result).toEqual(agent);
	});

	it('listUsers sends GET /agents with the agency account_id', async () => {
		fetchMock.mockResolvedValueOnce(json([agent]));
		const result = await Handlers.listUsers(ctx, { account_id: 1 });
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			url: `${API}/agents?account_id=1`,
		});
		expect(result).toEqual([agent]);
		expect(db.users.upsertByEntityId).toHaveBeenCalledWith('123', agent);
	});

	it('updateAgent sends PUT /agents/{id}', async () => {
		fetchMock.mockResolvedValueOnce(json({ ...agent, donotdisturb: 1 }));
		const result = await Handlers.updateAgent(ctx, {
			agentId: 123,
			donotdisturb: 1,
			donotdisturb_until: '2021-01-25 22:00:00',
		});
		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			url: `${API}/agents/123`,
			body: { donotdisturb: 1, donotdisturb_until: '2021-01-25 22:00:00' },
		});
		expect(result.donotdisturb).toBe(1);
	});

	it('deleteAgent sends DELETE /agents/{id} and accepts an empty body', async () => {
		fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }));
		const result = await Handlers.deleteAgent(ctx, { agentId: 123 });
		expect(lastRequest()).toMatchObject({
			method: 'DELETE',
			url: `${API}/agents/123`,
		});
		expect(result).toEqual({});
		expect(db.users.deleteByEntityId).toHaveBeenCalledWith('123');
	});

	it('getAgentSchedule sends GET /agents/{id}/schedule and stores it by agent', async () => {
		fetchMock.mockResolvedValueOnce(json(schedule));
		const result = await Handlers.getAgentSchedule(ctx, { agentId: 123 });
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			url: `${API}/agents/123/schedule`,
		});
		expect(result).toEqual(schedule);
		expect(db.schedules.upsertByEntityId).toHaveBeenCalledWith('123', {
			id: 123,
			days: schedule,
		});
	});

	it('updateAgentSchedule sends the day array as the PUT body', async () => {
		fetchMock.mockResolvedValueOnce(json(schedule));
		const result = await Handlers.updateAgentSchedule(ctx, {
			agentId: 123,
			days: schedule,
			account_id: 9,
		});
		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			url: `${API}/agents/123/schedule?account_id=9`,
			body: schedule,
		});
		expect(result).toEqual(schedule);
	});
});

describe('teams', () => {
	it('createTeam sends POST /teams', async () => {
		fetchMock.mockResolvedValueOnce(json(team));
		const result = await Handlers.createTeam(ctx, {
			name: 'Main Team',
			call_mode: 'simultaneous',
			retry_schedule: [15, 60, 120],
		});
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			url: `${API}/teams`,
			body: {
				name: 'Main Team',
				call_mode: 'simultaneous',
				retry_schedule: [15, 60, 120],
			},
		});
		expect(result).toEqual(team);
	});

	it('listTeams sends GET /teams', async () => {
		fetchMock.mockResolvedValueOnce(
			json([{ id: 123, account_id: 1, name: 'Main Team' }]),
		);
		const result = await Handlers.listTeams(ctx, {});
		expect(lastRequest()).toMatchObject({ method: 'GET', url: `${API}/teams` });
		expect(result).toEqual([{ id: 123, account_id: 1, name: 'Main Team' }]);
	});

	it('getTeam sends GET /teams/{id}', async () => {
		fetchMock.mockResolvedValueOnce(json(team));
		const result = await Handlers.getTeam(ctx, { teamId: 123 });
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			url: `${API}/teams/123`,
		});
		expect(result).toEqual(team);
		expect(db.teams.upsertByEntityId).toHaveBeenCalledWith('123', team);
	});

	it('listTeamUsers sends GET /teams/{id}/agents and keys rows by team and agent', async () => {
		fetchMock.mockResolvedValueOnce(json(teamAgents));
		const result = await Handlers.listTeamUsers(ctx, { teamId: 123 });
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			url: `${API}/teams/123/agents`,
		});
		expect(result).toEqual(teamAgents);
		expect(db.teamUsers.upsertByEntityId).toHaveBeenCalledWith('123:2', {
			id: 2,
			name: 'Test Test',
			priority: 1,
			cap: 1000,
			team_id: 123,
		});
	});

	it('updateTeamUsers sends PUT /teams/{id}/agents with string agent ids', async () => {
		fetchMock.mockResolvedValueOnce(json({ success: true }));
		const result = await Handlers.updateTeamUsers(ctx, {
			teamId: 123,
			agents: [1, '3', 5],
		});
		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			url: `${API}/teams/123/agents`,
			body: { agents: ['1', '3', '5'] },
		});
		expect(result).toEqual({ success: true });
	});

	it('updateTeamAgentSettings sends PUT /teams/{id}/agents/{agent_id}', async () => {
		fetchMock.mockResolvedValueOnce(
			json({ id: 2, name: 'Test Test', priority: 1, cap: 100 }),
		);
		const result = await Handlers.updateTeamAgentSettings(ctx, {
			teamId: 123,
			agentId: 2,
			priority: 1,
			cap: 100,
		});
		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			url: `${API}/teams/123/agents/2`,
			body: { priority: 1, cap: 100 },
		});
		expect(result).toEqual({ id: 2, name: 'Test Test', priority: 1, cap: 100 });
	});

	it('removeTeamAgent sends DELETE /teams/{id}/agents/{agent_id}', async () => {
		fetchMock.mockResolvedValueOnce(json({ success: true }));
		const result = await Handlers.removeTeamAgent(ctx, {
			teamId: 123,
			agentId: 2,
		});
		expect(lastRequest()).toMatchObject({
			method: 'DELETE',
			url: `${API}/teams/123/agents/2`,
		});
		expect(result).toEqual({ success: true });
		expect(db.teamUsers.deleteByEntityId).toHaveBeenCalledWith('123:2');
	});
});

describe('clients', () => {
	it('listClients sends GET /clients', async () => {
		fetchMock.mockResolvedValueOnce(json([client]));
		const result = await Handlers.listClients(ctx, {});
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			url: `${API}/clients`,
		});
		expect(result).toEqual([client]);
	});

	it('createClient sends POST /clients', async () => {
		fetchMock.mockResolvedValueOnce(json(client));
		const result = await Handlers.createClient(ctx, {
			fname: 'John',
			lname: 'Smith',
			company: 'Smith Pools',
			email: 'client@email.com',
			phone_number: '555-555-5555',
			password: 'password123',
		});
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			url: `${API}/clients`,
			body: {
				fname: 'John',
				lname: 'Smith',
				company: 'Smith Pools',
				email: 'client@email.com',
				phone_number: '555-555-5555',
				password: 'password123',
			},
		});
		expect(result).toEqual(client);
	});

	it('deleteClient sends DELETE /clients/{id}', async () => {
		fetchMock.mockResolvedValueOnce(json({ success: true }));
		const result = await Handlers.deleteClient(ctx, { clientId: 123 });
		expect(lastRequest()).toMatchObject({
			method: 'DELETE',
			url: `${API}/clients/123`,
		});
		expect(result).toEqual({ success: true });
		expect(db.clients.deleteByEntityId).toHaveBeenCalledWith('123');
	});

	it('setClientActive sends POST /clients/{id}/active with is_active', async () => {
		fetchMock.mockResolvedValueOnce(json(client));
		const result = await Handlers.setClientActive(ctx, {
			clientId: 123,
			is_active: 0,
		});
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			url: `${API}/clients/123/active`,
			body: { is_active: 0 },
		});
		expect(result).toEqual(client);
	});
});

describe('webhooks', () => {
	it('listWebhooks sends GET /webhooks', async () => {
		fetchMock.mockResolvedValueOnce(json([webhook]));
		const result = await Handlers.listWebhooks(ctx, {});
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			url: `${API}/webhooks`,
		});
		expect(result).toEqual([webhook]);
		expect(db.webhooks.upsertByEntityId).toHaveBeenCalledWith('1123', webhook);
	});

	it('getWebhook sends GET /webhooks/{id}', async () => {
		fetchMock.mockResolvedValueOnce(json(webhook));
		const result = await Handlers.getWebhook(ctx, { webhookId: 1123 });
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			url: `${API}/webhooks/1123`,
		});
		expect(result).toEqual(webhook);
	});

	it('createWebhook sends POST /webhooks with the account_id in the body', async () => {
		fetchMock.mockResolvedValueOnce(json(webhook));
		const result = await Handlers.createWebhook(ctx, {
			name: 'My Webhook',
			event: 'call_completed',
			target_url: 'http://example.com/',
			team_id: 1,
			account_id: 1,
		});
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			url: `${API}/webhooks`,
			body: {
				account_id: 1,
				name: 'My Webhook',
				event: 'call_completed',
				target_url: 'http://example.com/',
				team_id: 1,
			},
		});
		expect(result).toEqual(webhook);
	});

	it('updateWebhook sends a partial PUT /webhooks/{id}', async () => {
		const updated = { ...webhook, target_url: 'http://example.com/new_url' };
		fetchMock.mockResolvedValueOnce(json(updated));
		const result = await Handlers.updateWebhook(ctx, {
			webhookId: 1123,
			target_url: 'http://example.com/new_url',
			number_id: 1,
		});
		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			url: `${API}/webhooks/1123`,
			body: { target_url: 'http://example.com/new_url', number_id: 1 },
		});
		expect(result).toEqual(updated);
	});

	it('deleteWebhook sends DELETE /webhooks/{id}', async () => {
		fetchMock.mockResolvedValueOnce(json({ message: 'Webhook deleted.' }));
		const result = await Handlers.deleteWebhook(ctx, { webhookId: 1123 });
		expect(lastRequest()).toMatchObject({
			method: 'DELETE',
			url: `${API}/webhooks/1123`,
		});
		expect(result).toEqual({ message: 'Webhook deleted.' });
		expect(db.webhooks.deleteByEntityId).toHaveBeenCalledWith('1123');
	});
});

describe('input validation and persistence', () => {
	it('rejects an unknown webhook event before any request', async () => {
		const invalid = { name: 'x', event: 'sms_sent', target_url: 'http://x.io' };
		await expect(
			Reflect.apply(Handlers.createWebhook, undefined, [ctx, invalid]),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('still returns the API result when the local write fails', async () => {
		const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
		db.teams.upsertByEntityId.mockRejectedValueOnce(new Error('db down'));
		fetchMock.mockResolvedValueOnce(json(team));
		await expect(Handlers.getTeam(ctx, { teamId: 123 })).resolves.toEqual(team);
		expect(warn).toHaveBeenCalledTimes(1);
		warn.mockRestore();
	});
});
