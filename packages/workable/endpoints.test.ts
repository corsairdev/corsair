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

function makeStore() {
	const rows = new Map<string, unknown>();
	return {
		rows,
		upsertByEntityId: async (id: string, data: unknown) => {
			rows.set(id, data);
		},
		deleteByEntityId: async (id: string) => {
			rows.delete(id);
		},
	};
}

function makeCtx() {
	const stores = {
		departments: makeStore(),
		employees: makeStore(),
		members: makeStore(),
		jobs: makeStore(),
		candidates: makeStore(),
	};
	const ctx = {
		key: 'test-token',
		options: { account: 'example' },
		keys: { get_account: async () => 'example' },
		db: stores,
	} as unknown as Ctx;
	return { ctx, stores };
}

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
		globalThis.fetch = (async (url: string, init?: RequestInit) => {
			calls.push({ url: String(url), init });
			return jsonResponse({});
		}) as typeof fetch;
	});

	afterEach(() => {
		globalThis.fetch = originalFetch;
	});

	function respondWith(body: unknown, status = 200) {
		globalThis.fetch = (async (url: string, init?: RequestInit) => {
			calls.push({ url: String(url), init });
			return jsonResponse(body, status);
		}) as typeof fetch;
	}

	it('accounts.list / accounts.get', async () => {
		const { ctx } = makeCtx();
		respondWith({ accounts: [{ id: '1', subdomain: 'example' }] });
		const list = await Accounts.list(ctx, {});
		expect(list.accounts).toHaveLength(1);
		expect(calls[0]?.url).toBe('https://example.workable.com/spi/v3/accounts');

		respondWith({ id: '1', subdomain: 'example' });
		const one = await Accounts.get(ctx, {});
		expect(one.subdomain).toBe('example');
		expect(calls.at(-1)?.url).toBe(
			'https://example.workable.com/spi/v3/accounts/example',
		);
	});

	it('departments: list/create/update/merge/delete round-trip through the cache', async () => {
		const { ctx, stores } = makeCtx();

		respondWith({ departments: [{ id: 'd1', name: 'Engineering' }] });
		const listed = await Departments.list(ctx, {});
		expect(listed.departments).toHaveLength(1);
		expect(stores.departments.rows.get('d1')).toMatchObject({
			name: 'Engineering',
		});

		respondWith({ id: 'd2', name: 'Sales', parent_id: null });
		const created = await Departments.create(ctx, { name: 'Sales' });
		expect(created.id).toBe('d2');
		expect(calls.at(-1)?.init?.method).toBe('POST');

		respondWith({ id: 'd2', name: 'Sales EU', parent_id: null });
		const updated = await Departments.update(ctx, {
			id: 'd2',
			name: 'Sales EU',
			parent_id: null,
		});
		expect(updated.name).toBe('Sales EU');
		expect(calls.at(-1)?.init?.method).toBe('PUT');

		respondWith({});
		await Departments.merge(ctx, { id: 'd2', target_department_id: 'd1' });
		expect(calls.at(-1)?.url).toContain('/departments/d2/merge');
		expect(stores.departments.rows.has('d2')).toBe(false);

		respondWith(null, 204);
		await Departments.remove(ctx, { id: 'd1' });
		expect(calls.at(-1)?.url).toContain('/departments/d1');
		expect(calls.at(-1)?.init?.method).toBe('DELETE');
	});

	it('employees: list/get/create/update/uploadDocuments', async () => {
		const { ctx } = makeCtx();

		respondWith({ employees: [{ id: 'e1', firstname: 'Ada' }], totalCount: 1 });
		const listed = await Employees.list(ctx, {});
		expect(listed.totalCount).toBe(1);

		respondWith({ id: 'e1', firstname: 'Ada' });
		const one = await Employees.get(ctx, { id: 'e1' });
		expect(one.id).toBe('e1');

		respondWith({ id: 'e2', state: 'draft' });
		const created = await Employees.create(ctx, {
			state: 'draft',
			employee: { firstname: 'Grace' },
		});
		expect(created.state).toBe('draft');
		expect(calls.at(-1)?.init?.method).toBe('POST');

		respondWith({ id: 'e2', state: 'published' });
		const updated = await Employees.update(ctx, {
			id: 'e2',
			employee: { firstname: 'Grace' },
		});
		expect(updated.state).toBe('published');
		expect(calls.at(-1)?.init?.method).toBe('PATCH');

		respondWith({ success: true });
		await Employees.uploadDocuments(ctx, {
			id: 'e2',
			documents: [{ url: 'https://example.com/f.pdf', name: 'contract.pdf' }],
		});
		expect(calls.at(-1)?.url).toContain('/employees/e2/documents');
	});

	it('members: list/invite/update/enable', async () => {
		const { ctx } = makeCtx();

		respondWith({ members: [{ id: 'm1', email: 'a@example.com' }] });
		await Members.list(ctx, {});

		respondWith({ id: 'm2', email: 'new@example.com', roles: ['ats.admin'] });
		const invited = await Members.invite(ctx, {
			email: 'new@example.com',
			roles: ['ats.admin'],
		});
		expect(invited.id).toBe('m2');
		expect(calls.at(-1)?.url).toContain('/members/invite');

		respondWith({ id: 'm2', roles: ['ats.reviewer'] });
		await Members.update(ctx, { id: 'm2', roles: ['ats.reviewer'] });
		expect(calls.at(-1)?.init?.method).toBe('PUT');

		respondWith(null, 204);
		await Members.enable(ctx, { id: 'm2' });
		expect(calls.at(-1)?.url).toContain('/members/m2/enable');
	});

	it('jobs.list and candidates.list persist into the cache', async () => {
		const { ctx, stores } = makeCtx();

		respondWith({ jobs: [{ id: 'j1', title: 'Engineer', shortcode: 'ENG1' }] });
		const jobs = await Jobs.list(ctx, {});
		expect(jobs.jobs?.[0]?.shortcode).toBe('ENG1');

		respondWith({ candidates: [{ id: 'c1', email: 'cand@example.com' }] });
		const candidates = await Candidates.list(ctx, {});
		expect(candidates.candidates).toHaveLength(1);
		expect(stores.candidates.rows.get('c1')).toBeDefined();
	});

	it('reference/config list endpoints hit the documented paths', async () => {
		const { ctx } = makeCtx();
		const cases: Array<[() => Promise<unknown>, string]> = [
			[() => Reference.stagesList(ctx, {}), '/stages'],
			[() => Reference.requisitionsList(ctx, {}), '/requisitions'],
			[() => Reference.recruitersList(ctx, {}), '/recruiters'],
			[() => Reference.legalEntitiesList(ctx, {}), '/legal_entities'],
			[() => Reference.customAttributesList(ctx, {}), '/custom_attributes'],
			[
				() => Reference.disqualificationReasonsList(ctx, {}),
				'/disqualification_reasons',
			],
			[() => Reference.permissionSetsList(ctx, {}), '/permission_sets'],
			[() => Reference.employeeFieldsList(ctx, {}), '/employee_fields'],
			[() => Reference.timeoffCategoriesList(ctx, {}), '/timeoff/categories'],
			[() => Reference.timeoffBalancesList(ctx, {}), '/timeoff/balances'],
			[() => Reference.workSchedulesList(ctx, {}), '/work_schedules'],
			[() => Reference.eventsList(ctx, {}), '/events'],
		];

		for (const [call, expectedPath] of cases) {
			respondWith({ items: [] });
			await call();
			expect(calls.at(-1)?.url).toBe(
				`https://example.workable.com/spi/v3${expectedPath}`,
			);
		}
	});

	it('subscriptions: list/create/delete', async () => {
		const { ctx } = makeCtx();

		respondWith({ subscriptions: [] });
		await Subscriptions.list(ctx, {});

		respondWith({ id: 1, target: 'https://hooks.example.com' });
		const created = await Subscriptions.create(ctx, {
			target: 'https://hooks.example.com',
			event: 'candidate_created',
		});
		expect(created.id).toBe(1);
		expect(calls.at(-1)?.init?.method).toBe('POST');

		respondWith({}, 200);
		await Subscriptions.remove(ctx, { id: '1' });
		expect(calls.at(-1)?.url).toContain('/subscriptions/1');
		expect(calls.at(-1)?.init?.method).toBe('DELETE');
	});

	it('publicJobs.list hits the unauthenticated job-board API and needs no connected account', async () => {
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
});
