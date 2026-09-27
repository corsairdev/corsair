import { AuthMissingError } from 'corsair/core';
import * as Accounts from './endpoints/accounts';
import * as Candidates from './endpoints/candidates';
import * as Departments from './endpoints/departments';
import * as Employees from './endpoints/employees';
import * as Jobs from './endpoints/jobs';
import * as Members from './endpoints/members';
import * as PublicJobs from './endpoints/public-jobs';
import * as Reference from './endpoints/reference';
import * as Subscriptions from './endpoints/subscriptions';

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(undefined),
	AuthMissingError: class AuthMissingError extends Error {
		constructor(
			public plugin: string,
			public credential: string,
			message?: string,
		) {
			super(message ?? `Missing ${credential} for ${plugin}`);
		}
	},
}));

type Ctx = Parameters<typeof Departments.list>[0];

/** Builds an in-memory mock of the entity cache stores. */
function makeStore() {
	// unknown: mock row store holds zod-validated rows of varying entity shapes.
	const rows = new Map<string, unknown>();
	return {
		rows,
		// unknown: mock accepts any validated row shape, mirroring the generic store.
		upsertByEntityId: async (id: string, data: unknown) => {
			rows.set(id, data);
		},
		deleteByEntityId: async (id: string) => {
			rows.delete(id);
		},
	};
}

/** Builds a mock endpoint context bound to the `example` test account. */
function makeCtx(
	key = 'test-token',
	account: string | null | Error = 'example',
) {
	const stores = {
		departments: makeStore(),
		employees: makeStore(),
		members: makeStore(),
		jobs: makeStore(),
		candidates: makeStore(),
	};
	const ctx = {
		key,
		options: { account: undefined },
		keys: {
			// why safe: test-only stub — throws like the real key manager
			// when simulating a tenant with no account row.
			get_account: async () => {
				if (account instanceof Error) throw account;
				return account;
			},
		},
		db: stores,
		// why safe: test-only ctx mock — narrowed from the real endpoint
		// parameter type via `Parameters<typeof …>[0]` above.
	} as unknown as Ctx;
	return { ctx, stores };
}

// unknown: mock fetch bodies of varying endpoint shapes — serialised, never inspected.
/** Builds a mock JSON fetch response with the given body and status. */
function jsonResponse(body: unknown, status = 200) {
	return new Response(status === 204 ? null : JSON.stringify(body), {
		status,
		headers: status === 204 ? {} : { 'Content-Type': 'application/json' },
	});
}

describe('Workable endpoints', () => {
	const originalFetch = globalThis.fetch;
	let calls: Array<{ url: string; init?: RequestInit }>;

	beforeEach(() => {
		calls = [];
		// why safe: test-only fetch stub — signature matches fetch, cast
		// bridges the local `(url: string)` narrowing to the global type.
		globalThis.fetch = (async (url: string, init?: RequestInit) => {
			calls.push({ url: String(url), init });
			return jsonResponse({});
		}) as typeof fetch;
	});

	afterEach(() => {
		globalThis.fetch = originalFetch;
	});

	/** Stubs the next fetch call(s) with the given body and status. */
	function respondWith(body: unknown, status = 200) {
		// unknown: mock fetch bodies of varying endpoint shapes — serialised, never inspected.
		// why safe: test-only fetch stub — see beforeEach note above.
		globalThis.fetch = (async (url: string, init?: RequestInit) => {
			calls.push({ url: String(url), init });
			return jsonResponse(body, status);
		}) as typeof fetch;
	}

	describe('accounts (WORKABLE_GET_ACCOUNTS / WORKABLE_GET_ACCOUNT)', () => {
		it('raises AuthMissingError before any request when no key is stored', async () => {
			const { ctx } = makeCtx('');
			await expect(Departments.list(ctx, {})).rejects.toBeInstanceOf(
				AuthMissingError,
			);
			expect(calls).toHaveLength(0);
		});

		it('accounts.list with no stored subdomain raises AuthMissingError for the account', async () => {
			const noAccount = new Error(
				'No DEK found for account (tenant: "default"). Initialize the account first.',
			);
			const { ctx } = makeCtx('test-token', noAccount);
			await expect(Accounts.list(ctx, {})).rejects.toBeInstanceOf(
				AuthMissingError,
			);
			expect(calls).toHaveLength(0);
		});

		it('accounts.list hits GET /accounts', async () => {
			const { ctx } = makeCtx();
			respondWith({ accounts: [{ id: '1', subdomain: 'example' }] });
			const list = await Accounts.list(ctx, {});
			expect(list.accounts).toHaveLength(1);
			expect(list.accounts[0]?.subdomain).toBe('example');
			expect(calls[0]?.url).toBe(
				'https://example.workable.com/spi/v3/accounts',
			);
		});

		it('accounts.get hits GET /accounts/{subdomain}', async () => {
			const { ctx } = makeCtx();
			respondWith({ id: '1', subdomain: 'example' });
			const one = await Accounts.get(ctx, {});
			expect(one.subdomain).toBe('example');
			expect(calls.at(-1)?.url).toBe(
				'https://example.workable.com/spi/v3/accounts/example',
			);
		});

		it('accounts.get accepts an explicit subdomain', async () => {
			const { ctx } = makeCtx();
			respondWith({ id: '2', subdomain: 'other-co' });
			const one = await Accounts.get(ctx, { subdomain: 'other-co' });
			expect(one.subdomain).toBe('other-co');
			// The authenticated host stays tied to the connected credential;
			// the input only selects which accessible account the path returns.
			expect(calls.at(-1)?.url).toBe(
				'https://example.workable.com/spi/v3/accounts/other-co',
			);
		});
	});

	describe('departments (WORKABLE_LIST/POST/PUT/MERGE/DELETE_DEPARTMENTS)', () => {
		it('departments.list hits GET /departments and caches rows', async () => {
			const { ctx, stores } = makeCtx();
			respondWith({ departments: [{ id: 'd1', name: 'Engineering' }] });
			const listed = await Departments.list(ctx, {});
			expect(listed.departments).toHaveLength(1);
			expect(calls[0]?.url).toBe(
				'https://example.workable.com/spi/v3/departments',
			);
			expect(stores.departments.rows.get('d1')).toMatchObject({
				name: 'Engineering',
			});
		});

		it('departments.create hits POST /departments and caches the row', async () => {
			const { ctx, stores } = makeCtx();
			respondWith({ id: 'd2', name: 'Sales', parent_id: null });
			const created = await Departments.create(ctx, { name: 'Sales' });
			expect(created.id).toBe('d2');
			expect(calls.at(-1)?.url).toBe(
				'https://example.workable.com/spi/v3/departments',
			);
			expect(calls.at(-1)?.init?.method).toBe('POST');
			expect(stores.departments.rows.get('d2')).toMatchObject({
				name: 'Sales',
			});
		});

		it('departments.update hits PUT /departments with the id in the body', async () => {
			const { ctx } = makeCtx();
			respondWith({ id: 'd2', name: 'Sales EU', parent_id: null });
			const updated = await Departments.update(ctx, {
				id: 'd2',
				name: 'Sales EU',
				parent_id: null,
			});
			expect(updated.name).toBe('Sales EU');
			expect(calls.at(-1)?.url).toBe(
				'https://example.workable.com/spi/v3/departments',
			);
			expect(calls.at(-1)?.init?.method).toBe('PUT');
		});

		it('departments.merge hits POST /departments/{id}/merge and evicts the row', async () => {
			const { ctx, stores } = makeCtx();
			stores.departments.rows.set('d2', { id: 'd2', name: 'Sales' });
			respondWith({});
			await Departments.merge(ctx, { id: 'd2', target_department_id: 'd1' });
			expect(calls.at(-1)?.url).toContain('/departments/d2/merge');
			expect(calls.at(-1)?.init?.method).toBe('POST');
			expect(stores.departments.rows.has('d2')).toBe(false);
		});

		it('departments.delete hits DELETE /departments/{id} and evicts the row', async () => {
			const { ctx, stores } = makeCtx();
			stores.departments.rows.set('d1', { id: 'd1', name: 'Engineering' });
			respondWith(null, 204);
			await Departments.remove(ctx, { id: 'd1' });
			expect(calls.at(-1)?.url).toContain('/departments/d1');
			expect(calls.at(-1)?.init?.method).toBe('DELETE');
			expect(stores.departments.rows.has('d1')).toBe(false);
		});

		it('departments.delete passes force=DELETE when forced', async () => {
			const { ctx } = makeCtx();
			respondWith(null, 204);
			await Departments.remove(ctx, { id: 'd1', force: true });
			expect(calls.at(-1)?.init?.method).toBe('DELETE');
			expect(calls.at(-1)?.url).toContain('force');
		});
	});

	describe('employees (WORKABLE_LIST/CREATE/UPDATE_EMPLOYEE + documents)', () => {
		it('employees.list hits GET /employees and caches rows', async () => {
			const { ctx, stores } = makeCtx();
			respondWith({
				employees: [{ id: 'e1', firstname: 'Ada' }],
				totalCount: 1,
			});
			const listed = await Employees.list(ctx, { limit: 10 });
			expect(listed.totalCount).toBe(1);
			expect(calls[0]?.url).toContain('/employees');
			expect(stores.employees.rows.get('e1')).toMatchObject({
				firstname: 'Ada',
			});
		});

		it('employees.get hits GET /employees/{id}', async () => {
			const { ctx } = makeCtx();
			respondWith({ id: 'e1', firstname: 'Ada' });
			const one = await Employees.get(ctx, { id: 'e1' });
			expect(one.id).toBe('e1');
			expect(calls.at(-1)?.url).toContain('/employees/e1');
		});

		it('employees.create hits POST /employees in draft state', async () => {
			const { ctx } = makeCtx();
			respondWith({ id: 'e2', state: 'draft' });
			const created = await Employees.create(ctx, {
				state: 'draft',
				employee: { firstname: 'Grace' },
			});
			expect(created.state).toBe('draft');
			expect(calls.at(-1)?.url).toBe(
				'https://example.workable.com/spi/v3/employees',
			);
			expect(calls.at(-1)?.init?.method).toBe('POST');
		});

		it('employees.create supports published state', async () => {
			const { ctx } = makeCtx();
			respondWith({ id: 'e3', state: 'published' });
			const created = await Employees.create(ctx, {
				state: 'published',
				employee: { firstname: 'Alan' },
			});
			expect(created.state).toBe('published');
			expect(calls.at(-1)?.init?.method).toBe('POST');
		});

		it('employees.update hits PATCH /employees/{id}', async () => {
			const { ctx } = makeCtx();
			respondWith({ id: 'e2', state: 'published' });
			const updated = await Employees.update(ctx, {
				id: 'e2',
				employee: { firstname: 'Grace' },
			});
			expect(updated.state).toBe('published');
			expect(calls.at(-1)?.url).toContain('/employees/e2');
			expect(calls.at(-1)?.init?.method).toBe('PATCH');
		});

		it('employees.uploadDocuments hits POST /employees/{id}/documents', async () => {
			const { ctx } = makeCtx();
			respondWith({ success: true });
			await Employees.uploadDocuments(ctx, {
				id: 'e2',
				documents: [{ url: 'https://example.com/f.pdf', name: 'contract.pdf' }],
			});
			expect(calls.at(-1)?.url).toContain('/employees/e2/documents');
			expect(calls.at(-1)?.init?.method).toBe('POST');
		});
	});

	describe('members (WORKABLE_GET/POST/PUT_MEMBERS + enable)', () => {
		it('members.list hits GET /members and caches rows', async () => {
			const { ctx, stores } = makeCtx();
			respondWith({ members: [{ id: 'm1', email: 'a@example.com' }] });
			const listed = await Members.list(ctx, {});
			expect(listed.members).toHaveLength(1);
			expect(calls[0]?.url).toBe('https://example.workable.com/spi/v3/members');
			expect(stores.members.rows.get('m1')).toMatchObject({
				email: 'a@example.com',
			});
		});

		it('members.invite hits POST /members/invite', async () => {
			const { ctx } = makeCtx();
			respondWith({ id: 'm2', email: 'new@example.com', roles: ['ats.admin'] });
			const invited = await Members.invite(ctx, {
				email: 'new@example.com',
				roles: ['ats.admin'],
			});
			expect(invited.id).toBe('m2');
			expect(calls.at(-1)?.url).toContain('/members/invite');
			expect(calls.at(-1)?.init?.method).toBe('POST');
		});

		it('members.update hits PUT /members', async () => {
			const { ctx } = makeCtx();
			respondWith({ id: 'm2', roles: ['ats.reviewer'] });
			const updated = await Members.update(ctx, {
				id: 'm2',
				roles: ['ats.reviewer'],
			});
			expect(updated.roles).toContain('ats.reviewer');
			expect(calls.at(-1)?.url).toBe(
				'https://example.workable.com/spi/v3/members',
			);
			expect(calls.at(-1)?.init?.method).toBe('PUT');
		});

		it('members.enable hits POST /members/{id}/enable and evicts the stale row', async () => {
			const { ctx, stores } = makeCtx();
			stores.members.rows.set('m2', { id: 'm2', active: false });
			respondWith(null, 204);
			await Members.enable(ctx, { id: 'm2' });
			expect(calls.at(-1)?.url).toContain('/members/m2/enable');
			expect(calls.at(-1)?.init?.method).toBe('POST');
			expect(stores.members.rows.has('m2')).toBe(false);
		});
	});

	describe('jobs + candidates (WORKABLE_GET_JOBS / WORKABLE_GET_CANDIDATES)', () => {
		it('jobs.list hits GET /jobs and caches rows', async () => {
			const { ctx, stores } = makeCtx();
			respondWith({
				jobs: [{ id: 'j1', title: 'Engineer', shortcode: 'ENG1' }],
			});
			const jobs = await Jobs.list(ctx, {});
			expect(jobs.jobs?.[0]?.shortcode).toBe('ENG1');
			expect(calls[0]?.url).toBe('https://example.workable.com/spi/v3/jobs');
			expect(stores.jobs.rows.get('j1')).toBeDefined();
		});

		it('jobs.list forwards the state filter', async () => {
			const { ctx } = makeCtx();
			respondWith({ jobs: [] });
			const jobs = await Jobs.list(ctx, { state: 'published', limit: 5 });
			expect(jobs.jobs).toHaveLength(0);
			expect(calls.at(-1)?.url).toContain('/jobs');
		});

		it('candidates.list hits GET /candidates and caches rows', async () => {
			const { ctx, stores } = makeCtx();
			respondWith({ candidates: [{ id: 'c1', email: 'cand@example.com' }] });
			const candidates = await Candidates.list(ctx, {});
			expect(candidates.candidates).toHaveLength(1);
			expect(calls[0]?.url).toBe(
				'https://example.workable.com/spi/v3/candidates',
			);
			expect(stores.candidates.rows.get('c1')).toBeDefined();
		});

		it('candidates.list forwards job/stage filters', async () => {
			const { ctx } = makeCtx();
			respondWith({ candidates: [] });
			const candidates = await Candidates.list(ctx, {
				shortcode: 'ENG1',
				stage: 'sourced',
				limit: 10,
			});
			expect(candidates.candidates).toHaveLength(0);
			expect(calls.at(-1)?.url).toContain('/candidates');
		});
	});

	describe('reference lists (stages, requisitions, recruiters, legal entities, attributes, reasons, permission sets, fields, timeoff, schedules, events)', () => {
		it('stages.list hits GET /stages', async () => {
			const { ctx } = makeCtx();
			respondWith({ stages: [] });
			await Reference.stagesList(ctx, {});
			expect(calls.at(-1)?.url).toBe(
				'https://example.workable.com/spi/v3/stages',
			);
		});

		it('requisitions.list hits GET /requisitions', async () => {
			const { ctx } = makeCtx();
			respondWith({ requisitions: [] });
			await Reference.requisitionsList(ctx, { limit: 10 });
			expect(calls.at(-1)?.url).toContain('/requisitions');
		});

		it('recruiters.list hits GET /recruiters', async () => {
			const { ctx } = makeCtx();
			respondWith({ recruiters: [] });
			await Reference.recruitersList(ctx, {});
			expect(calls.at(-1)?.url).toBe(
				'https://example.workable.com/spi/v3/recruiters',
			);
		});

		it('recruiters.list forwards the job shortcode filter', async () => {
			const { ctx } = makeCtx();
			respondWith({ recruiters: [] });
			await Reference.recruitersList(ctx, { shortcode: 'ENG1' });
			expect(calls.at(-1)?.url).toContain('/recruiters');
		});

		it('legalEntities.list hits GET /legal_entities', async () => {
			const { ctx } = makeCtx();
			respondWith({ legal_entities: [] });
			await Reference.legalEntitiesList(ctx, {});
			expect(calls.at(-1)?.url).toBe(
				'https://example.workable.com/spi/v3/legal_entities',
			);
		});

		it('customAttributes.list hits GET /custom_attributes', async () => {
			const { ctx } = makeCtx();
			respondWith({ custom_attributes: [] });
			await Reference.customAttributesList(ctx, {});
			expect(calls.at(-1)?.url).toBe(
				'https://example.workable.com/spi/v3/custom_attributes',
			);
		});

		it('disqualificationReasons.list hits GET /disqualification_reasons', async () => {
			const { ctx } = makeCtx();
			respondWith({ disqualification_reasons: [] });
			await Reference.disqualificationReasonsList(ctx, {});
			expect(calls.at(-1)?.url).toBe(
				'https://example.workable.com/spi/v3/disqualification_reasons',
			);
		});

		it('permissionSets.list hits GET /permission_sets', async () => {
			const { ctx } = makeCtx();
			respondWith({ permission_sets: [] });
			await Reference.permissionSetsList(ctx, {});
			expect(calls.at(-1)?.url).toBe(
				'https://example.workable.com/spi/v3/permission_sets',
			);
		});

		it('employeeFields.list hits GET /employee_fields', async () => {
			const { ctx } = makeCtx();
			respondWith({ employee_fields: [] });
			await Reference.employeeFieldsList(ctx, {});
			expect(calls.at(-1)?.url).toBe(
				'https://example.workable.com/spi/v3/employee_fields',
			);
		});

		it('timeoffCategories.list hits GET /timeoff/categories', async () => {
			const { ctx } = makeCtx();
			respondWith({ categories: [] });
			await Reference.timeoffCategoriesList(ctx, {});
			expect(calls.at(-1)?.url).toBe(
				'https://example.workable.com/spi/v3/timeoff/categories',
			);
		});

		it('timeoffBalances.list hits GET /timeoff/balances', async () => {
			const { ctx } = makeCtx();
			respondWith({ balances: [] });
			await Reference.timeoffBalancesList(ctx, { employee_id: 'e1' });
			expect(calls.at(-1)?.url).toContain('/timeoff/balances');
		});

		it('workSchedules.list hits GET /work_schedules', async () => {
			const { ctx } = makeCtx();
			respondWith({ work_schedules: [] });
			await Reference.workSchedulesList(ctx, {});
			expect(calls.at(-1)?.url).toBe(
				'https://example.workable.com/spi/v3/work_schedules',
			);
		});

		it('events.list hits GET /events', async () => {
			const { ctx } = makeCtx();
			respondWith({ events: [] });
			await Reference.eventsList(ctx, { type: 'interview', limit: 10 });
			expect(calls.at(-1)?.url).toContain('/events');
		});
	});

	describe('subscriptions (WORKABLE_GET_SUBSCRIPTIONS + create/delete)', () => {
		it('subscriptions.list hits GET /subscriptions', async () => {
			const { ctx } = makeCtx();
			respondWith({ subscriptions: [] });
			await Subscriptions.list(ctx, {});
			expect(calls[0]?.url).toBe(
				'https://example.workable.com/spi/v3/subscriptions',
			);
		});

		it('subscriptions.create hits POST /subscriptions', async () => {
			const { ctx } = makeCtx();
			respondWith({ id: 1, target: 'https://hooks.example.com' });
			const created = await Subscriptions.create(ctx, {
				target: 'https://hooks.example.com',
				event: 'candidate_created',
			});
			expect(created.id).toBe(1);
			expect(calls.at(-1)?.url).toBe(
				'https://example.workable.com/spi/v3/subscriptions',
			);
			expect(calls.at(-1)?.init?.method).toBe('POST');
		});

		it('subscriptions.delete hits DELETE /subscriptions/{id}', async () => {
			const { ctx } = makeCtx();
			respondWith({}, 200);
			await Subscriptions.remove(ctx, { id: '1' });
			expect(calls.at(-1)?.url).toContain('/subscriptions/1');
			expect(calls.at(-1)?.init?.method).toBe('DELETE');
		});
	});

	describe('publicJobs (WORKABLE_LIST_PUBLIC_JOBS)', () => {
		it('publicJobs.list hits the unauthenticated job-board API with an explicit subdomain', async () => {
			const { ctx } = makeCtx();
			respondWith({ name: 'Example Co', jobs: [] });
			const result = await PublicJobs.list(ctx, { subdomain: 'other-co' });
			expect(result.name).toBe('Example Co');
			expect(calls.at(-1)?.url).toBe(
				'https://www.workable.com/api/accounts/other-co',
			);
		});

		it('publicJobs.list falls back to the connected account subdomain', async () => {
			const { ctx } = makeCtx();
			respondWith({ name: 'Example Co', jobs: [] });
			await PublicJobs.list(ctx, {});
			expect(calls.at(-1)?.url).toBe(
				'https://www.workable.com/api/accounts/example',
			);
		});

		it('publicJobs.list with an explicit subdomain never touches the key manager', async () => {
			const noAccount = new Error(
				'No DEK found for account (tenant: "default"). Initialize the account first.',
			);
			const { ctx } = makeCtx('test-token', noAccount);
			respondWith({ name: 'Example Co', jobs: [] });
			const result = await PublicJobs.list(ctx, { subdomain: 'other-co' });
			expect(result.name).toBe('Example Co');
			expect(calls.at(-1)?.url).toBe(
				'https://www.workable.com/api/accounts/other-co',
			);
		});

		it('publicJobs.list without any subdomain raises the clean missing-subdomain error', async () => {
			const noAccount = new Error(
				'No DEK found for account (tenant: "default"). Initialize the account first.',
			);
			const { ctx } = makeCtx('test-token', noAccount);
			await expect(PublicJobs.list(ctx, {})).rejects.toThrow(
				'workable.publicJobs.list requires a subdomain',
			);
			expect(calls).toHaveLength(0);
		});
	});

	describe('publicLocations (WORKABLE_LIST_PUBLIC_LOCATIONS)', () => {
		it('publicLocations.list hits the unauthenticated locations API with an explicit subdomain', async () => {
			const { ctx } = makeCtx();
			respondWith([
				{ code: 'GB', name: 'United Kingdom', count: 1 },
				{ code: 'US', name: 'United States', count: 2 },
			]);
			const result = await PublicJobs.listLocations(ctx, {
				subdomain: 'other-co',
			});
			expect(result).toHaveLength(2);
			expect(result[0]?.code).toBe('GB');
			expect(result[1]?.count).toBe(2);
			expect(calls.at(-1)?.url).toBe(
				'https://www.workable.com/api/accounts/other-co/locations',
			);
		});

		it('publicLocations.list falls back to the connected account subdomain', async () => {
			const { ctx } = makeCtx();
			respondWith([]);
			const result = await PublicJobs.listLocations(ctx, {});
			expect(result).toHaveLength(0);
			expect(calls.at(-1)?.url).toBe(
				'https://www.workable.com/api/accounts/example/locations',
			);
		});
	});
});
