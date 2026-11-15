import { GivebutterEndpointOutputSchemas as Out } from './endpoints/types';

// Givebutter's OpenAPI documents these responses as HouseholdResource,
// RecurringPlanResource and SsoAccountResource; ids may arrive as numbers.
describe('documented resource responses', () => {
	it('removeHouseholdContact returns a household', () => {
		expect(
			Out.removeHouseholdContact.safeParse({ id: 7, name: 'Doe household' })
				.success,
		).toBe(true);
		expect(Out.removeHouseholdContact.safeParse({ id: {} }).success).toBe(
			false,
		);
	});

	it('getPlan and listPlans items are recurring plans', () => {
		const plan = {
			id: 'plan_1',
			contact_id: 12,
			amount: '25.00',
			status: 'active',
			frequency: 'monthly',
			canceled_at: null,
			extra: 'kept',
		};
		expect(Out.getPlan.safeParse(plan).success).toBe(true);
		expect(Out.getPlan.safeParse({ id: {} }).success).toBe(false);
		const page = {
			data: [{ id: {} }],
			links: { first: null, last: null, prev: null, next: null },
			meta: {
				current_page: 1,
				from: null,
				last_page: 1,
				links: [],
				path: null,
				per_page: 20,
				to: null,
				total: 0,
			},
		};
		expect(Out.listPlans.safeParse(page).success).toBe(false);
		expect(Out.listPlans.safeParse({ ...page, data: [plan] }).success).toBe(
			true,
		);
	});

	it('getSsoAccount is an SSO account', () => {
		expect(
			Out.getSsoAccount.safeParse({ id: 99, name: 'Acme', slug: 'acme' })
				.success,
		).toBe(true);
		expect(Out.getSsoAccount.safeParse({ id: 'a', name: [] }).success).toBe(
			false,
		);
	});
});
