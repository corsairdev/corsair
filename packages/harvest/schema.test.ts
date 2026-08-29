/**
 * Guards the persisted entity schemas against the two ways they go wrong:
 * dropping a field Harvest actually returns, and requiring a field Harvest
 * sometimes omits.
 *
 * The key lists below were captured from live responses (2026-08-13). The first
 * group asserts that every captured key is declared, so removing a field from a
 * schema — or transcribing one under the wrong name — fails here. It cannot
 * detect a field Harvest adds after the capture: that shows up only when the
 * lists are refreshed against a live account, which is why the capture date is
 * recorded above.
 */

import { HarvestEndpointInputSchemas as Inputs } from './endpoints/types';
import { HarvestSchema } from './schema';
import {
	HarvestClientEntity,
	HarvestCompanyEntity,
	HarvestContactEntity,
	HarvestEstimateEntity,
	HarvestExpenseCategoryEntity,
	HarvestInvoiceEntity,
	HarvestInvoiceItemCategoryEntity,
	HarvestProjectEntity,
	HarvestTaskEntity,
	HarvestUserEntity,
} from './schema/database';

const LIVE_KEYS = {
	clients: [
		'id',
		'name',
		'is_active',
		'address',
		'statement_key',
		'created_at',
		'updated_at',
		'currency',
	],
	contacts: [
		'id',
		'title',
		'first_name',
		'last_name',
		'email',
		'phone_office',
		'phone_mobile',
		'fax',
		'invoice_recipient_status',
		'created_at',
		'updated_at',
		'client',
	],
	projects: [
		'id',
		'name',
		'code',
		'is_active',
		'is_billable',
		'is_fixed_fee',
		'bill_by',
		'budget',
		'budget_by',
		'budget_is_monthly',
		'notify_when_over_budget',
		'over_budget_notification_percentage',
		'show_budget_to_all',
		'created_at',
		'updated_at',
		'starts_on',
		'ends_on',
		'over_budget_notification_date',
		'currency',
		'notes',
		'cost_budget',
		'cost_budget_include_expenses',
		'hourly_rate',
		'fee',
		'client',
	],
	tasks: [
		'id',
		'name',
		'billable_by_default',
		'is_default',
		'is_active',
		'created_at',
		'updated_at',
		'default_hourly_rate',
	],
	users: [
		'id',
		'first_name',
		'last_name',
		'employee_id',
		'email',
		'telephone',
		'timezone',
		'weekly_capacity',
		'has_access_to_all_future_projects',
		'is_contractor',
		'is_active',
		'calendar_integration_enabled',
		'calendar_integration_source',
		'created_at',
		'updated_at',
		'can_create_projects',
		'default_hourly_rate',
		'cost_rate',
		'roles',
		'access_roles',
		'permissions_claims',
		'avatar_url',
	],
	invoices: [
		'id',
		'client_key',
		'number',
		'purchase_order',
		'amount',
		'due_amount',
		'tax',
		'tax_amount',
		'tax2',
		'tax2_amount',
		'discount',
		'discount_amount',
		'subject',
		'notes',
		'state',
		'period_start',
		'period_end',
		'issue_date',
		'due_date',
		'payment_term',
		'sent_at',
		'paid_at',
		'closed_at',
		'recurring_invoice_id',
		'created_at',
		'updated_at',
		'paid_date',
		'currency',
		'payment_options',
		'client',
		'estimate',
		'retainer',
		'creator',
		'line_items',
	],
	estimates: [
		'id',
		'client_key',
		'number',
		'purchase_order',
		'amount',
		'tax',
		'tax_amount',
		'tax2',
		'tax2_amount',
		'discount',
		'discount_amount',
		'subject',
		'notes',
		'state',
		'issue_date',
		'sent_at',
		'created_at',
		'updated_at',
		'accepted_at',
		'declined_at',
		'currency',
		'client',
		'creator',
		'line_items',
	],
	expenseCategories: [
		'id',
		'name',
		'unit_name',
		'unit_price',
		'is_active',
		'created_at',
		'updated_at',
	],
	invoiceItemCategories: [
		'id',
		'name',
		'use_as_service',
		'use_as_expense',
		'created_at',
		'updated_at',
	],
	company: [
		'base_uri',
		'full_domain',
		'name',
		'is_active',
		'week_start_day',
		'wants_timestamp_timers',
		'time_format',
		'date_format',
		'plan_type',
		'expense_feature',
		'invoice_feature',
		'estimate_feature',
		'team_feature',
		'weekly_capacity',
		'approval_feature',
		'clock',
		'currency',
		'currency_code_display',
		'currency_symbol_display',
		'decimal_symbol',
		'thousands_separator',
		'color_scheme',
		'saml_sign_in_required',
		'day_entry_notes_required',
	],
} as const;

const ENTITIES = {
	clients: HarvestClientEntity,
	contacts: HarvestContactEntity,
	projects: HarvestProjectEntity,
	tasks: HarvestTaskEntity,
	users: HarvestUserEntity,
	invoices: HarvestInvoiceEntity,
	estimates: HarvestEstimateEntity,
	expenseCategories: HarvestExpenseCategoryEntity,
	invoiceItemCategories: HarvestInvoiceItemCategoryEntity,
	company: HarvestCompanyEntity,
} as const;

describe('entity schemas declare every live field', () => {
	for (const [name, schema] of Object.entries(ENTITIES)) {
		it(`${name} declares all ${LIVE_KEYS[name as keyof typeof LIVE_KEYS].length} keys Harvest returns`, () => {
			const declared = schema.shape;
			for (const key of LIVE_KEYS[name as keyof typeof LIVE_KEYS]) {
				expect(declared).toHaveProperty(key);
			}
		});
	}
});

describe('entity schemas require only the primary key', () => {
	/**
	 * Harvest omits or nulls most fields depending on plan, permissions and
	 * account features — an account without the invoicing feature returns a
	 * thinner invoice, a non-administrator sees no rates. A schema that
	 * required more than the key would reject those valid rows outright, which
	 * is the failure mode that matters: a rejected row is a lost row.
	 */
	const minimal = {
		clients: { id: 1 },
		contacts: { id: 1 },
		projects: { id: 1 },
		tasks: { id: 1 },
		users: { id: 1 },
		invoices: { id: 1 },
		estimates: { id: 1 },
		expenseCategories: { id: 1 },
		invoiceItemCategories: { id: 1 },
		company: { full_domain: 'example.harvestapp.com' },
	} as const;

	for (const [name, schema] of Object.entries(ENTITIES)) {
		it(`${name} parses a record carrying only its key`, () => {
			const result = schema.safeParse(minimal[name as keyof typeof minimal]);
			expect(result.success).toBe(true);
		});
	}
});

describe('entity schemas keep unknown fields', () => {
	it('preserves a field Harvest adds later rather than dropping it', () => {
		const parsed = HarvestClientEntity.parse({
			id: 12345,
			name: 'Example Client',
			some_future_field: 'kept',
		});

		expect(parsed).toHaveProperty('some_future_field', 'kept');
	});
});

describe('entity schemas reject a record with no key', () => {
	it('rejects a client with no id', () => {
		expect(HarvestClientEntity.safeParse({ name: 'Nameless' }).success).toBe(
			false,
		);
	});

	it('rejects company settings with no full_domain', () => {
		expect(HarvestCompanyEntity.safeParse({ name: 'testing' }).success).toBe(
			false,
		);
	});
});

/**
 * Message creation is two operations on one route, split by whether
 * `event_type` is present, and only the branch without it reaches the client.
 * Harvest rejects a send that has no recipient and no copy to self, so these
 * assert the plugin refuses it first rather than round-tripping the failure.
 */
describe('message send validation', () => {
	const cases = [
		['invoiceMessagesCreate', { invoice_id: 1 }],
		['estimateMessagesCreate', { estimate_id: 1 }],
	] as const;

	for (const [operation, id] of cases) {
		const schema = Inputs[operation];

		it(`${operation} rejects a send with no recipients and no copy`, () => {
			expect(schema.safeParse({ ...id }).success).toBe(false);
			expect(schema.safeParse({ ...id, send_me_a_copy: false }).success).toBe(
				false,
			);
		});

		it(`${operation} rejects an explicitly empty recipients list`, () => {
			expect(schema.safeParse({ ...id, recipients: [] }).success).toBe(false);
		});

		it(`${operation} accepts a send addressed to someone`, () => {
			expect(
				schema.safeParse({ ...id, recipients: [{ email: 'ap@example.com' }] })
					.success,
			).toBe(true);
			expect(schema.safeParse({ ...id, send_me_a_copy: true }).success).toBe(
				true,
			);
		});

		it(`${operation} accepts a state event with no recipients`, () => {
			// A state event sends nothing, so it needs no address.
			expect(schema.safeParse({ ...id, event_type: 'send' }).success).toBe(
				true,
			);
			expect(schema.safeParse({ ...id, event_type: 're-open' }).success).toBe(
				true,
			);
		});
	}
});

describe('plugin schema', () => {
	it('registers all ten entities', () => {
		expect(Object.keys(HarvestSchema.entities).sort()).toEqual(
			[
				'clients',
				'company',
				'contacts',
				'estimates',
				'expenseCategories',
				'invoiceItemCategories',
				'invoices',
				'projects',
				'tasks',
				'users',
			].sort(),
		);
	});
});

/**
 * Official attribute tables from help.getharvest.com/api-v2 (fetched 2026-08-13).
 * These must stay declared even when a given account omits them (e.g. saml_exempt).
 */
const OFFICIAL_KEYS = {
	clients: [
		'id',
		'name',
		'is_active',
		'address',
		'statement_key',
		'currency',
		'created_at',
		'updated_at',
	],
	contacts: [
		'id',
		'client',
		'title',
		'first_name',
		'last_name',
		'email',
		'phone_office',
		'phone_mobile',
		'fax',
		'invoice_recipient_status',
		'created_at',
		'updated_at',
	],
	projects: [
		'id',
		'client',
		'name',
		'code',
		'is_active',
		'is_billable',
		'is_fixed_fee',
		'bill_by',
		'hourly_rate',
		'budget_by',
		'budget_is_monthly',
		'budget',
		'cost_budget',
		'cost_budget_include_expenses',
		'notify_when_over_budget',
		'over_budget_notification_percentage',
		'over_budget_notification_date',
		'show_budget_to_all',
		'fee',
		'notes',
		'starts_on',
		'ends_on',
		'created_at',
		'updated_at',
	],
	tasks: [
		'id',
		'name',
		'billable_by_default',
		'default_hourly_rate',
		'is_default',
		'is_active',
		'created_at',
		'updated_at',
	],
	users: [
		'id',
		'first_name',
		'last_name',
		'email',
		'telephone',
		'timezone',
		'has_access_to_all_future_projects',
		'is_contractor',
		'is_active',
		'saml_exempt',
		'weekly_capacity',
		'default_hourly_rate',
		'cost_rate',
		'roles',
		'access_roles',
		'avatar_url',
		'created_at',
		'updated_at',
	],
	invoices: [
		'id',
		'client',
		'line_items',
		'estimate',
		'retainer',
		'creator',
		'client_key',
		'number',
		'purchase_order',
		'amount',
		'due_amount',
		'tax',
		'tax_amount',
		'tax2',
		'tax2_amount',
		'discount',
		'discount_amount',
		'subject',
		'notes',
		'currency',
		'state',
		'period_start',
		'period_end',
		'issue_date',
		'due_date',
		'payment_term',
		'payment_options',
		'sent_at',
		'paid_at',
		'paid_date',
		'closed_at',
		'recurring_invoice_id',
		'created_at',
		'updated_at',
	],
	estimates: [
		'id',
		'client',
		'line_items',
		'creator',
		'client_key',
		'number',
		'purchase_order',
		'amount',
		'tax',
		'tax_amount',
		'tax2',
		'tax2_amount',
		'discount',
		'discount_amount',
		'subject',
		'notes',
		'currency',
		'state',
		'issue_date',
		'sent_at',
		'accepted_at',
		'declined_at',
		'created_at',
		'updated_at',
	],
	expenseCategories: [
		'id',
		'name',
		'unit_name',
		'unit_price',
		'is_active',
		'created_at',
		'updated_at',
	],
	invoiceItemCategories: [
		'id',
		'name',
		'use_as_service',
		'use_as_expense',
		'created_at',
		'updated_at',
	],
	company: [
		'base_uri',
		'full_domain',
		'name',
		'is_active',
		'week_start_day',
		'wants_timestamp_timers',
		'time_format',
		'date_format',
		'plan_type',
		'clock',
		'currency_code_display',
		'currency_symbol_display',
		'decimal_symbol',
		'thousands_separator',
		'color_scheme',
		'weekly_capacity',
		'expense_feature',
		'invoice_feature',
		'estimate_feature',
		'approval_feature',
		'team_feature',
	],
} as const;

describe('entity schemas declare every official attribute', () => {
	for (const [name, schema] of Object.entries(ENTITIES)) {
		it(`${name} declares the official docs table`, () => {
			const declared = schema.shape;
			for (const key of OFFICIAL_KEYS[name as keyof typeof OFFICIAL_KEYS]) {
				expect(declared).toHaveProperty(key);
			}
		});
	}
});
