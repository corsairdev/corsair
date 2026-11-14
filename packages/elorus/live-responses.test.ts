import { ElorusEndpoints } from './endpoints';
import { elorusOperationSchemas } from './endpoints/types';
import type { ElorusContext } from './index';

jest.mock('corsair/core', () => {
	const actual =
		jest.requireActual<typeof import('corsair/core')>('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn().mockResolvedValue(null),
	};
});

const context = {
	endpoints: {},
	db: {},
	$getAccountId: async () => 'fixture-account',
	key: 'fixture-token',
	options: {},
	keys: {
		get_dek: async () => 'fixture-dek',
		issue_new_dek: async () => 'fixture-dek',
		get_api_key: async () => 'fixture-token',
		set_api_key: async (_value: string | null) => undefined,
		get_webhook_signature: async () => 'fixture-signature',
		set_webhook_signature: async (_value: string | null) => undefined,
		get_organization_id: async () => 'fixture-organization',
		set_organization_id: async (_value: string | null) => undefined,
	},
} satisfies ElorusContext;

// Trimmed from real Elorus answers (a demo organization), with IDs replaced and contact details removed.
// Elorus sends organization and user references as 19-digit strings, beyond what a JS number holds exactly.
const ORGANIZATION = '3671500000000000001';
const USER = '3671500000000000002';

// unknown: fixtures are raw JSON as Elorus sends it.
function mockFetch(body: unknown) {
	return jest.spyOn(globalThis, 'fetch').mockResolvedValue(
		new Response(JSON.stringify(body), {
			status: 200,
			headers: { 'content-type': 'application/json' },
		}),
	);
}

function page<T>(results: T[]) {
	return { count: results.length, next: null, previous: null, results };
}

afterEach(() => {
	jest.restoreAllMocks();
});

describe('Elorus responses as the live API returns them', () => {
	it('reads a v1.1 invoice list with null sequence and loading address and a string organization', async () => {
		mockFetch(
			page([
				{
					id: '3671500000000000101',
					custom_id: '',
					representation: 'Invoice #15',
					status: 'partial',
					draft: false,
					documenttype: '3671500000000000102',
					sequence: null,
					number: '15',
					date: '2026-11-14',
					due_date: null,
					client: '3671500000000000103',
					loading_address: null,
					dispatch_date: null,
					move_purpose: null,
					currency_code: 'USD',
					exchange_rate: '1.000000',
					total: '18611.10',
					paid: '15000.00',
					organization: ORGANIZATION,
					created: '2026-11-14T17:07:20.241459Z',
					modified: '2026-11-14T17:07:20.241518Z',
				},
			]),
		);
		const result = await ElorusEndpoints.v11.invoices_list(context, {});
		expect(result.results[0]?.sequence).toBeNull();
		expect(result.results[0]?.loading_address).toBeNull();
		expect(result.results[0]?.organization).toBe(ORGANIZATION);
	});

	it('reads a v1.2 contact list with a null default template', async () => {
		mockFetch(
			page([
				{
					id: '3671500000000000201',
					display_name: 'Sales Department (Internal)',
					company: 'Sales Department (Internal)',
					is_client: true,
					is_supplier: true,
					active: true,
					default_template: null,
					default_currency_code: '',
					default_language: 'en',
					custom_id: '',
					organization: ORGANIZATION,
					created: '2026-11-14T17:07:15.098941Z',
					modified: '2026-11-14T17:07:15.098983Z',
				},
			]),
		);
		const result = await ElorusEndpoints.v12.contacts_list(context, {});
		expect(result.results[0]?.default_template).toBeNull();
		expect(result.results[0]?.organization).toBe(ORGANIZATION);
	});

	it('reads v1.2 products with an empty TARIC code and a null stock', async () => {
		mockFetch(
			page([
				{
					id: '3671500000000000301',
					title: 'Premium Postcards',
					code: '',
					sales: true,
					sale_value: '636.00000',
					sale_taxes: [],
					purchases: true,
					purchase_taxes: ['3671500000000000302'],
					manage: false,
					stock: null,
					unit_measure: null,
					active: true,
					taric_code: '',
					organization: ORGANIZATION,
				},
				{
					id: '3671500000000000303',
					title: 'Notebook',
					manage: true,
					stock: '25.0000',
					taric_code: '',
					organization: ORGANIZATION,
				},
			]),
		);
		const result = await ElorusEndpoints.v12.products_list(context, {});
		expect(result.results.map((product) => product.stock)).toEqual([
			null,
			'25.0000',
		]);
		expect(result.results[0]?.taric_code).toBe('');
	});

	it('reads v1.2 time entries with boolean billing flags and a string assignee', async () => {
		mockFetch(
			page([
				{
					id: '3671500000000000401',
					start_datetime: '2026-11-14T17:07:14.002269Z',
					end_datetime: '2026-11-15T01:07:14.002269Z',
					duration: 28800,
					project: '3671500000000000402',
					task: '3671500000000000403',
					description: 'Finalization',
					assignee: USER,
					user_team: null,
					billable: true,
					invoiceitem: null,
					forcibly_billed: false,
					is_billed: false,
					project_billing_method: 'task_rate',
					project_active: true,
					task_active: true,
					organization: ORGANIZATION,
					created: '2026-11-14T17:07:17.545111Z',
					modified: '2026-11-14T17:07:17.545163Z',
				},
			]),
		);
		const result = await ElorusEndpoints.v12.timeentries_list(context, {});
		const entry = result.results[0];
		expect(entry?.assignee).toBe(USER);
		expect(entry?.is_billed).toBe(false);
		expect(entry?.project_active).toBe(true);
		expect(entry?.invoiceitem).toBeNull();
	});

	it('reads a v1.2 project with boolean managers, string members and hour totals in seconds', async () => {
		mockFetch({
			id: '3671500000000000501',
			name: 'Website redesign',
			client: '3671500000000000502',
			billing_method: 'task_rate',
			fixed_cost: null,
			hourly_rate: null,
			billable_hours: 1002000,
			total_hours: 1045200,
			unbilled_hours: 118800,
			costs: '9030.50',
			billed_amount: '15215.00',
			members: [
				{
					member: USER,
					member_repr: 'Jane Doe',
					manager: true,
					hourly_rate: null,
					cost_per_hour: '34.00',
				},
			],
			active: true,
			organization: ORGANIZATION,
		});
		const result = await ElorusEndpoints.v12.projects_read(context, {
			path: { id: '3671500000000000501' },
		});
		expect(result.members?.[0]?.member).toBe(USER);
		expect(result.members?.[0]?.manager).toBe(true);
		expect(result.billable_hours).toBe(1002000);
	});

	it('reads a v1.1 project whose members carry boolean managers', async () => {
		mockFetch({
			id: '3671500000000000501',
			name: 'Website redesign',
			members: [
				{
					id: '3671500000000000503',
					member: USER,
					manager: false,
					hourly_rate: null,
					cost_per_hour: '24.00',
				},
			],
			organization: ORGANIZATION,
		});
		const result = await ElorusEndpoints.v11.projects_read(context, {
			path: { id: '3671500000000000501' },
		});
		expect(result.members?.[0]?.manager).toBe(false);
	});

	it('reads v1.2 recurring invoices and estimates with null schedule, address and conversion fields', async () => {
		mockFetch(
			page([
				{
					id: '3671500000000000601',
					name: null,
					active: null,
					last_execution: null,
					next_execution: null,
					shipping_address: null,
					interval: 1,
					organization: ORGANIZATION,
				},
			]),
		);
		const recurring = await ElorusEndpoints.v12.recurringinvoices_list(
			context,
			{},
		);
		expect(recurring.results[0]?.next_execution).toBeNull();

		jest.restoreAllMocks();
		mockFetch(
			page([
				{
					id: '3671500000000000701',
					representation: 'Estimate #3',
					status: 'issued',
					draft: false,
					converted_invoice: null,
					shipping_address: null,
					loading_address: null,
					currency_code: 'USD',
					total: '100.57',
					organization: ORGANIZATION,
				},
			]),
		);
		const estimates = await ElorusEndpoints.v12.estimates_list(context, {});
		expect(estimates.results[0]?.converted_invoice).toBeNull();
	});

	it('reads document type sequences from the count/results envelope Elorus sends', async () => {
		mockFetch({
			count: 1,
			results: [{ name: 'IN', in_use: 3, active: true }],
		});
		const result = await ElorusEndpoints.v12.documenttypes_sequences_list(
			context,
			{ path: { parent_pk: '3671500000000000801' } },
		);
		expect(result.results).toEqual([{ name: 'IN', in_use: 3, active: true }]);
	});

	it('still rejects a response that breaks a field Elorus does fill', async () => {
		mockFetch(page([{ id: '3671500000000000201', is_client: 'yes' }]));
		await expect(
			ElorusEndpoints.v12.contacts_list(context, {}),
		).rejects.toMatchObject({ name: 'ZodError' });
	});

	it('leaves request schemas as documented', () => {
		const create = elorusOperationSchemas['v12.products_create'].input;
		expect(
			create.safeParse({ body: { title: 'Notebook', taric_code: '' } }).success,
		).toBe(false);
		expect(
			create.safeParse({ body: { title: 'Notebook', stock: null } }).success,
		).toBe(false);
		expect(
			create.safeParse({
				body: { title: 'Notebook', taric_code: '4820100000' },
			}).success,
		).toBe(true);
	});
});
