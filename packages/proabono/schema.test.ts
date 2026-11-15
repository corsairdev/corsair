import {
	BalanceLinesCreateInputSchema,
	CustomerSchema,
	CustomersCreateInputSchema,
	CustomersUpdateInputSchema,
	PROABONO_FEATURE_TYPES,
	PROABONO_SUBSCRIPTION_STATES,
	ProabonoJsonValueSchema,
	SubscriptionSchema,
	SubscriptionsCreateInputSchema,
	UsageIncrementInputSchema,
	UsagesUpdateInputSchema,
} from './endpoints/types';
import { ProabonoSchema } from './schema';

describe('ProAbono plugin schema', () => {
	it('declares a semver version', () => {
		expect(ProabonoSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no entities, because the plugin stores nothing', () => {
		expect(ProabonoSchema.entities).toEqual({});
		// Object.keys is always an array, so the value itself is what proves it.
		expect(Array.isArray(ProabonoSchema.entities)).toBe(false);
	});
});

describe('documented vocabularies', () => {
	it('pins the subscription states the docs use', () => {
		expect(PROABONO_SUBSCRIPTION_STATES).toEqual([
			'InitiatedAgent',
			'ActiveRunning',
			'Suspended',
			'Terminated',
		]);
	});

	it('pins the three feature types', () => {
		expect(PROABONO_FEATURE_TYPES).toEqual([
			'Limitation',
			'OnOff',
			'Quantifiable',
		]);
	});
});

describe('customer schemas', () => {
	it('parses a customer with its billable flag and links', () => {
		expect(
			CustomerSchema.safeParse({
				Id: 133700,
				ReferenceCustomer: 'cust-42',
				Name: 'Jane Smith',
				Email: 'jane@example.com',
				IsBillable: true,
				IsActive: true,
				Links: [
					{
						rel: 'insite-home',
						href: 'https://demo.proabono.com/portal-auth/x',
					},
				],
			}).success,
		).toBe(true);
	});

	it('keeps a metadata value of any JSON shape', () => {
		const parsed = CustomerSchema.parse({
			Id: 1,
			Metadata: { crm: 'Acme', tier: 3, active: true, tags: ['a'] },
		});

		expect(parsed.Metadata).toMatchObject({ crm: 'Acme', tier: 3 });
	});

	it('requires a reference on create, which is the caller own id', () => {
		expect(
			CustomersCreateInputSchema.safeParse({ ReferenceCustomer: 'cust-42' })
				.success,
		).toBe(true);
		expect(CustomersCreateInputSchema.safeParse({}).success).toBe(false);
		expect(
			CustomersCreateInputSchema.safeParse({ ReferenceCustomer: '' }).success,
		).toBe(false);
	});

	it('drops fields the create route does not document', () => {
		// ProAbono answers an undocumented property with 422
		// Error.Property.UnexpectedProperty, so it never reaches the body.
		const parsed = CustomersCreateInputSchema.parse({
			ReferenceCustomer: 'cust-42',
			Country: 'FR',
			Company: 'Acme',
		});
		expect(parsed).toEqual({ ReferenceCustomer: 'cust-42' });
	});

	it('requires at least one change on update', () => {
		expect(
			CustomersUpdateInputSchema.safeParse({ ReferenceCustomer: 'cust-42' })
				.success,
		).toBe(false);
		expect(
			CustomersUpdateInputSchema.safeParse({
				ReferenceCustomer: 'cust-42',
				Email: 'new@example.com',
			}).success,
		).toBe(true);
	});
});

describe('subscription schemas', () => {
	it('parses the documented subscription example', () => {
		expect(
			SubscriptionSchema.safeParse({
				Id: 44082,
				IdSegment: 69,
				IdOffer: 1274,
				IdCustomer: 133700,
				ReferenceOffer: 'premium',
				ReferenceCustomer: 'cust-42',
				Status: 'Active',
				StateSubscription: 'ActiveRunning',
				DateStart: '2025-08-09T12:38:55.00Z',
				IsTrial: true,
				CountDaysTrial: 13,
				AmountRecurrence: 9900,
				DurationRecurrence: 1,
				UnitRecurrence: 'Month',
				PricingSubtotal: 9900,
				PricingTotal: 11880,
			}).success,
		).toBe(true);
	});

	it('requires a customer and an offer to subscribe', () => {
		expect(
			SubscriptionsCreateInputSchema.safeParse({
				ReferenceOffer: 'premium',
				ReferenceCustomer: 'cust-42',
			}).success,
		).toBe(true);
		expect(
			SubscriptionsCreateInputSchema.safeParse({ ReferenceOffer: 'premium' })
				.success,
		).toBe(false);
		expect(
			SubscriptionsCreateInputSchema.safeParse({ ReferenceCustomer: 'cust-42' })
				.success,
		).toBe(false);
	});

	it('accepts the three switches that control the start', () => {
		expect(
			SubscriptionsCreateInputSchema.safeParse({
				ReferenceOffer: 'premium',
				ReferenceCustomer: 'cust-42',
				EnsureBillable: true,
				TryStart: false,
				BillNow: true,
			}).success,
		).toBe(true);
	});
});

describe('usage schemas', () => {
	it('accepts a negative increment, which records a reversal', () => {
		expect(
			UsageIncrementInputSchema.safeParse({
				ReferenceCustomer: 'cust-42',
				ReferenceFeature: 'feat-users',
				Increment: -5,
				DateStamp: '2025-03-29T19:33:50.65Z',
			}).success,
		).toBe(true);
	});

	it('rejects a fractional increment', () => {
		expect(
			UsageIncrementInputSchema.safeParse({
				ReferenceCustomer: 'cust-42',
				ReferenceFeature: 'feat-users',
				Increment: 1.5,
				DateStamp: '2025-03-29T19:33:50.65Z',
			}).success,
		).toBe(false);
	});

	it('rejects an empty multi-usage update', () => {
		expect(UsagesUpdateInputSchema.safeParse({ usages: [] }).success).toBe(
			false,
		);
	});

	it('accepts a usage row with an increment, a current quantity or an on/off', () => {
		const DateStamp = '2025-03-29T19:33:50.65Z';
		expect(
			UsagesUpdateInputSchema.safeParse({
				usages: [
					{
						ReferenceCustomer: 'a',
						ReferenceFeature: 'b',
						Increment: 1,
						DateStamp,
					},
					{
						ReferenceCustomer: 'a',
						ReferenceFeature: 'c',
						QuantityCurrent: 10,
						DateStamp,
					},
					{
						ReferenceCustomer: 'a',
						ReferenceFeature: 'd',
						IsEnabled: true,
						DateStamp,
					},
				],
			}).success,
		).toBe(true);
	});

	it('rejects a usage row without the DateStamp ProAbono requires', () => {
		expect(
			UsagesUpdateInputSchema.safeParse({
				usages: [
					{ ReferenceCustomer: 'a', ReferenceFeature: 'b', Increment: 1 },
				],
			}).success,
		).toBe(false);
	});

	it('rejects more than the 50 rows ProAbono allows per call', () => {
		const row = {
			ReferenceCustomer: 'a',
			ReferenceFeature: 'b',
			Increment: 1,
			DateStamp: '2025-03-29T19:33:50.65Z',
		};
		expect(
			UsagesUpdateInputSchema.safeParse({ usages: Array(51).fill(row) })
				.success,
		).toBe(false);
	});
});

describe('balance line schemas', () => {
	it('accepts a negative amount, which is a credit', () => {
		expect(
			BalanceLinesCreateInputSchema.safeParse({
				ReferenceCustomer: 'cust-42',
				Label: 'Goodwill credit',
				Amount: -500,
			}).success,
		).toBe(true);
	});

	it('rejects a fractional amount, since amounts are cents', () => {
		expect(
			BalanceLinesCreateInputSchema.safeParse({
				ReferenceCustomer: 'cust-42',
				Label: 'Setup',
				Amount: 12.5,
			}).success,
		).toBe(false);
	});
});

describe('the shared JSON value schema', () => {
	it('accepts every JSON shape metadata can hold', () => {
		for (const value of ['text', 1, true, null, [1], { a: { b: null } }]) {
			expect(ProabonoJsonValueSchema.safeParse(value).success).toBe(true);
		}
	});

	it('rejects a value JSON cannot carry', () => {
		expect(ProabonoJsonValueSchema.safeParse(undefined).success).toBe(false);
	});
});
