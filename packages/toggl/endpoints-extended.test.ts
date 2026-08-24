/**
 * Covers the operations added to match the OSS catalog surface: the /me
 * collections, reference data, organization groups and users, workspace logo
 * and preferences, project membership, bulk time-entry edits, webhook
 * subscription management and the transactional mail endpoints.
 *
 * Network access is mocked, so this runs in CI. The mail endpoints in
 * particular are only ever exercised here — firing them for real would send
 * email from the test account.
 */
import {
	Me,
	Organizations,
	Projects,
	Reference,
	Smail,
	Tasks,
	TimeEntries,
	Webhooks,
	Workspaces,
} from './endpoints';

const WS = 3000001;
const ORG = 2000001;
const BASE = 'https://api.track.toggl.com/api/v9';
const WEBHOOKS = 'https://api.track.toggl.com/webhooks/api/v1';

type Ctx = Parameters<typeof Me.get>[0];

function makeStore() {
	return {
		upsertByEntityId: jest.fn(async () => undefined),
		deleteByEntityId: jest.fn(async () => true),
	};
}

/** Builds an endpoint context and hands back the cache mocks for assertions. */
function makeCtxWithDb() {
	const db = {
		workspaces: makeStore(),
		clients: makeStore(),
		projects: makeStore(),
		tags: makeStore(),
	};
	// Only `key`, `db` and the logging members are touched by the endpoints.
	const ctx = {
		key: 'fake-toggl-token-for-tests-only',
		db,
		database: undefined,
		$getAccountId: async () => 'test-account',
	} as unknown as Ctx;
	return { ctx, db };
}

/** Builds a minimal endpoint context when the cache is not under test. */
function makeCtx() {
	return makeCtxWithDb().ctx;
}

let lastCall: { url: string; init: RequestInit } | undefined;

/** Stubs global fetch with a single JSON response and records the request. */
function mockResponse(body: unknown) {
	global.fetch = (async (url: string, init: RequestInit) => {
		lastCall = { url, init };
		return {
			ok: true,
			status: 200,
			statusText: 'OK',
			url,
			headers: new Headers({ 'Content-Type': 'application/json' }),
			json: async () => body,
			text: async () => JSON.stringify(body),
		};
	}) as unknown as typeof global.fetch;
}

/** Returns the URL, method and parsed body of the last recorded request. */
function requested() {
	if (!lastCall) throw new Error('no request was made');
	return {
		url: lastCall.url,
		method: lastCall.init.method,
		body: lastCall.init.body
			? JSON.parse(String(lastCall.init.body))
			: undefined,
	};
}

const originalFetch = global.fetch;
afterAll(() => {
	global.fetch = originalFetch;
});
beforeEach(() => {
	lastCall = undefined;
});

describe('me — collections and account actions', () => {
	it('confirms token validity via /me/logged', async () => {
		mockResponse({});
		const result = await Me.getLogged(makeCtx(), {});
		expect(requested().url).toBe(`${BASE}/me/logged`);
		expect(result).toEqual({ ok: true });
	});

	it('gets the user location', async () => {
		mockResponse({ city: 'Springfield', country_code: 'US' });
		const result = await Me.getLocation(makeCtx(), {});
		expect(requested().url).toBe(`${BASE}/me/location`);
		expect(result.city).toBe('Springfield');
	});

	it('gets the API quota per organization', async () => {
		mockResponse([{ organization_id: ORG, remaining: 600, total: 600 }]);
		const result = await Me.getQuota(makeCtx(), {});
		expect(requested().url).toBe(`${BASE}/me/quota`);
		expect(result[0]?.remaining).toBe(600);
	});

	it('passes `since` through on the user collections', async () => {
		mockResponse([]);
		await Me.getClients(makeCtx(), { since: 1755000000 });
		expect(requested().url).toContain('since=1755000000');

		mockResponse([]);
		await Me.getProjects(makeCtx(), { since: 1755000000 });
		expect(requested().url).toBe(`${BASE}/me/projects?since=1755000000`);
	});

	it('lists the user tags and passes `since` through', async () => {
		mockResponse([{ id: 7, workspace_id: 1, name: 'billable' }]);
		const result = await Me.getTags(makeCtx(), { since: 1755000000 });
		expect(requested().url).toBe(`${BASE}/me/tags?since=1755000000`);
		expect(requested().method).toBe('GET');
		expect(result[0]?.name).toBe('billable');
	});

	it('normalises a null tags collection to an empty array', async () => {
		mockResponse(null);
		expect(await Me.getTags(makeCtx(), {})).toEqual([]);
		expect(requested().url).toBe(`${BASE}/me/tags`);
	});

	it('normalises a null tasks collection to an empty array', async () => {
		mockResponse(null);
		expect(await Me.getTasks(makeCtx(), {})).toEqual([]);
	});

	it('feeds the entity cache from the /me collections', async () => {
		// These return the same records as the workspace-scoped lists, so reading
		// through /me must not leave the local mirror stale.
		const { ctx, db } = makeCtxWithDb();

		mockResponse([{ id: 4000001, wid: WS, name: 'Acme Corp' }]);
		await Me.getClients(ctx, {});
		expect(db.clients.upsertByEntityId).toHaveBeenCalledWith(
			'4000001',
			expect.objectContaining({ workspace_id: WS, name: 'Acme Corp' }),
		);

		mockResponse([{ id: 5000001, workspace_id: WS, name: 'Website' }]);
		await Me.getProjects(ctx, {});
		expect(db.projects.upsertByEntityId).toHaveBeenCalledWith(
			'5000001',
			expect.objectContaining({ name: 'Website' }),
		);

		mockResponse([{ id: 6000001, workspace_id: WS, name: 'billable' }]);
		await Me.getTags(ctx, {});
		expect(db.tags.upsertByEntityId).toHaveBeenCalledWith(
			'6000001',
			expect.objectContaining({ name: 'billable' }),
		);
	});

	it('posts the unsubscribe code for product emails', async () => {
		mockResponse({});
		await Me.disableProductEmails(makeCtx(), { disable_code: 'code-123' });
		expect(requested().url).toBe(`${BASE}/me/disable_product_emails`);
		expect(requested().method).toBe('POST');
		expect(requested().body).toMatchObject({ disable_code: 'code-123' });
	});

	it('disables the weekly report', async () => {
		mockResponse({});
		const result = await Me.disableWeeklyReport(makeCtx(), { code: 'abc' });
		expect(requested().url).toBe(`${BASE}/me/disable_weekly_report`);
		expect(result).toEqual({ ok: true });
	});
});

describe('reference data', () => {
	it('lists countries', async () => {
		mockResponse([{ id: 1, name: 'United States' }]);
		const result = await Reference.getCountries(makeCtx(), {});
		expect(requested().url).toBe(`${BASE}/countries`);
		expect(result[0]?.name).toBe('United States');
	});

	it('lists country subdivisions for a country id', async () => {
		mockResponse([{ name: 'California', iso_code: 'US-CA', country_id: 235 }]);
		await Reference.getCountrySubdivisions(makeCtx(), { country_id: 235 });
		expect(requested().url).toBe(`${BASE}/countries/235/subdivisions`);
	});

	it('lists currencies', async () => {
		mockResponse([{ currency_id: 1, iso_code: 'USD', symbol: '$' }]);
		const result = await Reference.getCurrencies(makeCtx(), {});
		expect(result[0]?.iso_code).toBe('USD');
	});

	it('reads timezones and offsets from their separate paths', async () => {
		mockResponse(['Europe/Tallinn']);
		await Reference.getTimezones(makeCtx(), {});
		expect(requested().url).toBe(`${BASE}/timezones`);

		mockResponse([{ name: 'Europe/Tallinn', utc: '3' }]);
		await Reference.getTimezoneOffsets(makeCtx(), {});
		expect(requested().url).toBe(`${BASE}/timezones/offsets`);
	});

	it('gets the JWKS keyset', async () => {
		mockResponse({ keys: [{ alg: 'EdDSA', kid: '2023-07-25' }] });
		const result = await Reference.getKeys(makeCtx(), {});
		expect(requested().url).toBe(`${BASE}/keys`);
		expect(result.keys).toHaveLength(1);
	});
});

describe('organizations — groups, users, invitations, plans', () => {
	it('creates an organization with its first workspace', async () => {
		mockResponse({ id: ORG, name: 'Example Org' });
		await Organizations.create(makeCtx(), {
			name: 'Example Org',
			workspace_name: 'Main',
		});
		expect(requested().url).toBe(`${BASE}/organizations`);
		expect(requested().method).toBe('POST');
		expect(requested().body).toMatchObject({ workspace_name: 'Main' });
	});

	it('lists groups', async () => {
		mockResponse([]);
		expect(
			await Organizations.getGroups(makeCtx(), { organization_id: ORG }),
		).toEqual([]);
		expect(requested().url).toBe(`${BASE}/organizations/${ORG}/groups`);
	});

	it('creates a group', async () => {
		mockResponse({ id: 9, name: 'Engineering' });
		await Organizations.createGroup(makeCtx(), {
			organization_id: ORG,
			name: 'Engineering',
		});
		expect(requested().method).toBe('POST');
		expect(requested().body).toMatchObject({ name: 'Engineering' });
	});

	it('deletes a group', async () => {
		mockResponse({});
		const result = await Organizations.deleteGroup(makeCtx(), {
			organization_id: ORG,
			group_id: 9,
		});
		expect(requested().method).toBe('DELETE');
		expect(result).toEqual({ deleted: true, id: 9 });
	});

	it('lists organization users with filters applied', async () => {
		mockResponse([{ id: 1, email: 'a@b.com' }]);
		await Organizations.getUsers(makeCtx(), {
			organization_id: ORG,
			only_admins: true,
			page: 2,
		});
		expect(requested().url).toContain('only_admins=true');
		expect(requested().url).toContain('page=2');
	});

	it('creates an invitation', async () => {
		mockResponse({});
		await Organizations.createInvitation(makeCtx(), {
			organization_id: ORG,
			emails: ['new@example.com'],
			workspaces: [{ workspace_id: WS, admin: false }],
		});
		expect(requested().url).toBe(`${BASE}/organizations/${ORG}/invitations`);
		expect(requested().body).toMatchObject({ emails: ['new@example.com'] });
	});

	it('reads plan and subscription information', async () => {
		mockResponse({ user_count: 1 });
		await Organizations.getPlans(makeCtx(), { organization_id: ORG });
		expect(requested().url).toBe(`${BASE}/organizations/${ORG}/plans`);

		mockResponse({});
		await Organizations.getSubscriptionPlans(makeCtx(), {
			organization_id: ORG,
		});
		expect(requested().url).toBe(
			`${BASE}/organizations/${ORG}/subscription_plans`,
		);
	});
});

describe('workspaces — logo, preferences and workspace-wide tasks', () => {
	it('gets the workspace logo', async () => {
		mockResponse({ logo: 'https://example.com/logo.png' });
		const result = await Workspaces.getLogo(makeCtx(), { workspace_id: WS });
		expect(requested().url).toBe(`${BASE}/workspaces/${WS}/logo`);
		expect(result.logo).toContain('logo.png');
	});

	it('gets workspace preferences', async () => {
		mockResponse({ initial_pricing_plan: 0, hide_start_end_times: false });
		const result = await Workspaces.getPreferences(makeCtx(), {
			workspace_id: WS,
		});
		expect(result.hide_start_end_times).toBe(false);
	});

	it('lists workspace-wide tasks and unwraps the paginated envelope', async () => {
		// Omitting project_id selects the workspace route, which wraps results.
		mockResponse({
			total_count: 1,
			page: 1,
			data: [{ id: 1, name: 'Task', workspace_id: WS }],
		});
		const result = await Tasks.list(makeCtx(), { workspace_id: WS });
		expect(requested().url).toContain(`${BASE}/workspaces/${WS}/tasks`);
		expect(result).toHaveLength(1);
	});

	it('returns an empty array when the envelope carries no data', async () => {
		mockResponse({ total_count: 0, data: null });
		expect(await Tasks.list(makeCtx(), { workspace_id: WS })).toEqual([]);
	});

	it('uses the project route and a bare array when project_id is given', async () => {
		mockResponse([{ id: 1, name: 'Task', workspace_id: WS, project_id: 5 }]);
		const result = await Tasks.list(makeCtx(), {
			workspace_id: WS,
			project_id: 5,
		});
		expect(requested().url).toContain(
			`${BASE}/workspaces/${WS}/projects/5/tasks`,
		);
		expect(result).toHaveLength(1);
	});
});

describe('projects — members and groups', () => {
	it('adds a user to a project', async () => {
		mockResponse({ id: 1, project_id: 5000001, user_id: 42 });
		await Projects.addUser(makeCtx(), {
			workspace_id: WS,
			project_id: 5000001,
			user_id: 42,
			manager: true,
		});
		expect(requested().url).toBe(`${BASE}/workspaces/${WS}/project_users`);
		expect(requested().body).toMatchObject({ user_id: 42, manager: true });
	});

	it('deletes a project group', async () => {
		mockResponse({});
		const result = await Projects.deleteGroup(makeCtx(), {
			workspace_id: WS,
			project_group_id: 7,
		});
		expect(requested().method).toBe('DELETE');
		expect(result).toEqual({ deleted: true, id: 7 });
	});
});

describe('time entries — bulk edit', () => {
	it('sends JSON Patch operations against a comma-joined id list', async () => {
		mockResponse({ success: [1, 2], failure: [] });
		const result = await TimeEntries.bulkEdit(makeCtx(), {
			workspace_id: WS,
			time_entry_ids: [1, 2],
			operations: [{ op: 'replace', path: '/billable', value: true }],
		});
		expect(requested().method).toBe('PATCH');
		expect(requested().url).toBe(`${BASE}/workspaces/${WS}/time_entries/1,2`);
		expect(requested().body).toEqual([
			{ op: 'replace', path: '/billable', value: true },
		]);
		expect(result.success).toEqual([1, 2]);
	});
});

describe('webhook subscriptions', () => {
	it('reads the service status from the webhooks host, not the v9 API', async () => {
		mockResponse({ status: 'OK' });
		const result = await Webhooks.getStatus(makeCtx(), {});
		expect(requested().url).toBe(`${WEBHOOKS}/status`);
		expect(result.status).toBe('OK');
	});

	it('lists the available event filters', async () => {
		mockResponse({ client: ['created', 'updated', 'deleted'] });
		const result = await Webhooks.getEventFilters(makeCtx(), {});
		expect(requested().url).toBe(`${WEBHOOKS}/event_filters`);
		expect(result.client).toContain('created');
	});

	it('lists subscriptions for a workspace', async () => {
		mockResponse([]);
		await Webhooks.listSubscriptions(makeCtx(), { workspace_id: WS });
		expect(requested().url).toBe(`${WEBHOOKS}/subscriptions/${WS}`);
	});

	it('deletes a subscription', async () => {
		mockResponse({});
		const result = await Webhooks.deleteSubscription(makeCtx(), {
			workspace_id: WS,
			subscription_id: 55,
		});
		expect(requested().method).toBe('DELETE');
		expect(requested().url).toBe(`${WEBHOOKS}/subscriptions/${WS}/55`);
		expect(result).toEqual({ deleted: true, id: 55 });
	});
});

describe('transactional mail', () => {
	it('sends a demo request', async () => {
		mockResponse({});
		const result = await Smail.sendDemo(makeCtx(), { email: 'a@b.com' });
		expect(requested().url).toBe(`${BASE}/smail/demo`);
		expect(requested().method).toBe('POST');
		expect(result).toEqual({ ok: true });
	});

	it('sends a contact email', async () => {
		mockResponse({});
		await Smail.sendContact(makeCtx(), {
			email: 'a@b.com',
			name: 'A',
			message: 'hello',
		});
		expect(requested().url).toBe(`${BASE}/smail/contact`);
	});

	it('sends a meet invitation', async () => {
		mockResponse({});
		await Smail.sendMeet(makeCtx(), {
			email: 'a@b.com',
			location: 'Tallinn',
		});
		expect(requested().url).toBe(`${BASE}/smail/meet`);
		expect(requested().body).toMatchObject({ location: 'Tallinn' });
	});
});
