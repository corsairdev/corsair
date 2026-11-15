import { logEventFromContext } from 'corsair/core';
import { Groups, Ponds, RateLimit, Teams, Users } from './admin';

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

function metadata(collection: string) {
	return {
		collection,
		offset: 0,
		limit: 10,
		total: 1,
		next: null,
		nextLink: null,
	};
}

// Fixtures follow the harvested official examples.
const user = {
	id: 21,
	created: '2023-03-06T19:48:47Z',
	updated: '2023-04-24T14:38:13Z',
	name: 'Jean-Luc Picard',
	firstName: 'Jean-Luc',
	lastName: 'Picard',
	email: 'jeanluc@enterprise.uss',
	phone: '1234567890',
	role: 'Broker',
	status: 'Active',
	timezone: 'America/New_York',
	beta: false,
	pauseLeadDistribution: false,
	canExport: true,
	canCreateApiKeys: true,
	isOwner: true,
	groups: [{ id: 63, name: 'Buyer Leads' }],
	teamIds: [8],
	teamLeaderOf: [],
	leadEmailAddress: 'jean-luc.picard@followupboss.me',
};

const team = {
	id: 8,
	name: 'Palm Beach Team',
	userIds: [12, 14, 23],
	leaderIds: [14],
};

const group = {
	id: 63,
	name: 'Eastside',
	type: 'Agent',
	distribution: 'round-robin',
	defaultUserId: null,
	defaultPondId: null,
	defaultGroupId: null,
	claimWindow: 900,
	nextRoundRobinUser: 334,
	isPrimary: false,
	users: [
		{
			id: 199,
			name: 'Daniel Corkill',
			firstName: 'Daniel',
			lastName: 'Corkill',
			role: 'Broker',
			pauseLeadDistribution: true,
		},
	],
};

const pond = {
	id: 23,
	name: 'Palm Beach Pond',
	userId: 14,
	userIds: [14, 23, 24],
};

const rateLimits = {
	system: 'your-system',
	current_limits: {
		across_all_accounts: { default: 750, 'GET.people': 100 },
		per_account: { default: 25 },
	},
};

const rateUsage = {
	system: 'your-system',
	period: 'last_24h',
	usage: {
		total_requests: 1247,
		rate_limited_requests: 23,
		rate_limit_percentage: 1.84,
		peak_hour: '2026-05-19T14:00:00Z',
		current_limits: {
			across_all_accounts: { default: 750, 'GET.people': 100 },
			per_account: { default: 25 },
		},
	},
};

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('users', () => {
	it('list keeps every user and the _metadata block', async () => {
		respond({ users: [user], _metadata: metadata('users') });

		const result = await invoke(Users.list, {});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/users',
			body: undefined,
		});
		expect(lastRequest().query).toEqual({});
		expect(result).toEqual({ users: [user], _metadata: metadata('users') });
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'followupboss.users.list',
			{ count: 1 },
			'completed',
		);
	});

	it('list sends the role, paging and includeDeleted filters', async () => {
		respond({ users: [] });

		await invoke(Users.list, {
			role: 'Agent',
			name: 'Jean-Luc Picard',
			email: 'jeanluc@enterprise.uss',
			sort: '-id',
			fields: 'id,name',
			includeDeleted: true,
			limit: 25,
			offset: 5,
		});

		expect(lastRequest().query).toEqual({
			role: 'Agent',
			name: 'Jean-Luc Picard',
			email: 'jeanluc@enterprise.uss',
			sort: '-id',
			fields: 'id,name',
			includeDeleted: 'true',
			limit: '25',
			offset: '5',
		});
	});

	it('get unwraps the single-user envelope', async () => {
		respond({ users: [user] });

		const result = await invoke(Users.get, { id: 21 });

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/users/21',
			body: undefined,
		});
		expect(result).toEqual(user);
	});

	it('delete reassigns the leads through the required assignTo query', async () => {
		respond({});

		const result = await invoke(Users.delete, { id: 21, assignTo: 14 });

		expect(lastRequest()).toMatchObject({
			method: 'DELETE',
			path: '/v1/users/21',
			body: undefined,
		});
		expect(lastRequest().query).toEqual({ assignTo: '14' });
		expect(result).toEqual({ id: 21, resource: {} });
	});
});

describe('teams', () => {
	it('list keeps every team and the _metadata block', async () => {
		respond({ teams: [team], _metadata: metadata('teams') });

		const result = await invoke(Teams.list, { limit: 10 });

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/teams',
		});
		expect(lastRequest().query).toEqual({ limit: '10' });
		expect(result).toEqual({ teams: [team], _metadata: metadata('teams') });
	});

	it('create POSTs the members and answers the 200 team', async () => {
		respond(team);

		const result = await invoke(Teams.create, {
			name: 'Miami Team',
			userIds: [281, 301, 18],
			leaderIds: [281],
		});

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v1/teams',
			body: { name: 'Miami Team', userIds: [281, 301, 18], leaderIds: [281] },
		});
		expect(lastRequest().headers.get('content-type')).toBe('application/json');
		expect(result).toEqual(team);
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'followupboss.teams.create',
			{ teamId: 8 },
			'completed',
		);
	});

	it('get unwraps the single-team envelope', async () => {
		respond(team);

		const result = await invoke(Teams.get, { id: 8 });

		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/teams/8',
		});
		expect(result).toEqual(team);
	});

	it('update PUTs the fields without the id', async () => {
		const renamed = { ...team, name: 'Miami Team', leaderIds: [23] };
		respond(renamed);

		const result = await invoke(Teams.update, {
			id: 8,
			name: 'Miami Team',
			userIds: [18, 23, 281, 301],
			leaderIds: [23],
		});

		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			path: '/v1/teams/8',
			body: {
				name: 'Miami Team',
				userIds: [18, 23, 281, 301],
				leaderIds: [23],
			},
		});
		expect(result).toEqual(renamed);
	});

	it('delete merges members into the target team via the query', async () => {
		respond({});

		const result = await invoke(Teams.delete, { id: 8, moveToTeamId: 5 });

		expect(lastRequest()).toMatchObject({
			method: 'DELETE',
			path: '/v1/teams/8',
		});
		expect(lastRequest().query).toEqual({ moveToTeamId: '5' });
		expect(result).toEqual({ id: 8, resource: {} });
	});
});

describe('groups', () => {
	it('list filters by type and sort', async () => {
		respond({ groups: [group], _metadata: metadata('groups') });

		const result = await invoke(Groups.list, { type: 'Agent', sort: 'name' });

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/groups',
		});
		expect(lastRequest().query).toEqual({ type: 'Agent', sort: 'name' });
		expect(result).toEqual({ groups: [group], _metadata: metadata('groups') });
	});

	it('create POSTs the distribution settings and unwraps the 201 group', async () => {
		respond(group, 201);

		const result = await invoke(Groups.create, {
			name: 'Westside',
			users: [199],
			distribution: 'round-robin',
			type: 'Agent',
			claimWindow: 900,
			defaultPondId: 23,
		});

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v1/groups',
			body: {
				name: 'Westside',
				users: [199],
				distribution: 'round-robin',
				type: 'Agent',
				claimWindow: 900,
				defaultPondId: 23,
			},
		});
		expect(result).toEqual(group);
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'followupboss.groups.create',
			{ groupId: 63 },
			'completed',
		);
	});

	it('get unwraps the single-group envelope', async () => {
		respond(group);

		const result = await invoke(Groups.get, { id: 63 });

		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/groups/63',
		});
		expect(result).toEqual(group);
	});

	it('update PUTs the body without the id', async () => {
		const renamed = { ...group, name: 'Westside' };
		respond(renamed);

		const result = await invoke(Groups.update, {
			id: 63,
			name: 'Westside',
			users: [199, 200],
			distribution: 'first-to-claim',
			defaultUserId: 199,
		});

		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			path: '/v1/groups/63',
			body: {
				name: 'Westside',
				users: [199, 200],
				distribution: 'first-to-claim',
				defaultUserId: 199,
			},
		});
		expect(result).toEqual(renamed);
	});

	it('delete answers success from the 200 body', async () => {
		respond({});

		const result = await invoke(Groups.delete, { id: 63 });

		expect(lastRequest()).toMatchObject({
			method: 'DELETE',
			path: '/v1/groups/63',
		});
		// The empty 200 body leaves the optional resource echo empty.
		expect(result).toEqual({ id: 63, resource: {} });
	});

	it('roundRobin lists the round-robin groups behind its own path', async () => {
		respond({ groups: [group], _metadata: metadata('groups') });

		const result = await invoke(Groups.roundRobin, { type: 'Agent' });

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/groups/roundRobin',
		});
		expect(lastRequest().query).toEqual({ type: 'Agent' });
		expect(result).toEqual({ groups: [group], _metadata: metadata('groups') });
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'followupboss.groups.roundRobin',
			{ count: 1 },
			'completed',
		);
	});
});

describe('ponds', () => {
	it('list keeps every pond and the _metadata block', async () => {
		respond({ ponds: [pond], _metadata: metadata('ponds') });

		const result = await invoke(Ponds.list, {});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/ponds',
			body: undefined,
		});
		expect(lastRequest().query).toEqual({});
		expect(result).toEqual({ ponds: [pond], _metadata: metadata('ponds') });
	});

	it('create POSTs the required pond fields', async () => {
		respond(pond);

		const result = await invoke(Ponds.create, {
			name: 'Orlando Pond',
			userId: 327,
			userIds: [281, 301, 327],
		});

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v1/ponds',
			body: { name: 'Orlando Pond', userId: 327, userIds: [281, 301, 327] },
		});
		expect(lastRequest().headers.get('content-type')).toBe('application/json');
		expect(result).toEqual(pond);
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'followupboss.ponds.create',
			{ pondId: 23 },
			'completed',
		);
	});

	it('get unwraps the single-pond envelope', async () => {
		respond(pond);

		const result = await invoke(Ponds.get, { id: 23 });

		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/ponds/23',
		});
		expect(result).toEqual(pond);
	});

	it('update PUTs the fields without the id', async () => {
		const reassigned = { ...pond, userId: 281, userIds: [281, 301] };
		respond(reassigned);

		const result = await invoke(Ponds.update, {
			id: 23,
			userId: 281,
			userIds: [281, 301],
		});

		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			path: '/v1/ponds/23',
			body: { userId: 281, userIds: [281, 301] },
		});
		expect(result).toEqual(reassigned);
	});

	it('delete reassigns the pond contacts through the required assignTo query', async () => {
		respond({});

		const result = await invoke(Ponds.delete, { id: 23, assignTo: 14 });

		expect(lastRequest()).toMatchObject({
			method: 'DELETE',
			path: '/v1/ponds/23',
		});
		expect(lastRequest().query).toEqual({ assignTo: '14' });
		expect(result).toEqual({ id: 23, resource: {} });
	});
});

describe('rateLimit', () => {
	it('limits hits the normalized path without doubling the /v1 prefix', async () => {
		respond(rateLimits);

		const result = await invoke(RateLimit.limits, {});

		expectAuthenticated();
		// The published path is '/v1/rateLimit/limits', but the base URL already
		// includes /v1, so the endpoint sends '/rateLimit/limits' and the wire
		// path must not become '/v1/v1/...'.
		expect(lastUrl()).toBe('https://api.followupboss.com/v1/rateLimit/limits');
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/rateLimit/limits',
			body: undefined,
		});
		expect(lastRequest().query).toEqual({});
		expect(result).toEqual(rateLimits);
	});

	it('usage reads the rolling window counters from the normalized path', async () => {
		respond(rateUsage);

		const result = await invoke(RateLimit.usage, {});

		expect(lastUrl()).toBe('https://api.followupboss.com/v1/rateLimit/usage');
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/rateLimit/usage',
		});
		expect(result).toEqual(rateUsage);
	});
});

describe('input validation happens before any request', () => {
	// Every endpoint here rejects an empty input at the schema, so no fetch
	// is ever attempted and no queued response is consumed.
	const emptyInputs: [string, AnyEndpoint][] = [
		['users.get', Users.get],
		['users.delete', Users.delete],
		['teams.create', Teams.create],
		['teams.update', Teams.update],
		['teams.delete', Teams.delete],
		['groups.create', Groups.create],
		['groups.get', Groups.get],
		['groups.update', Groups.update],
		['groups.delete', Groups.delete],
		['ponds.create', Ponds.create],
		['ponds.get', Ponds.get],
		['ponds.update', Ponds.update],
		['ponds.delete', Ponds.delete],
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
