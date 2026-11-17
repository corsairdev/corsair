import { logEventFromContext } from 'corsair/core';
import * as billing from './endpoints/billing';
import type { DeeplineContext } from './index';
import { billingMeta, billingSchemas } from './registry-billing';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));
const fetchMock = jest.fn();
const originalFetch = global.fetch;
const ctx = {
	key: 'tenant-resolved-key',
	database: {},
	options: { key: 'wrong-option-key' },
} as DeeplineContext;
// Response bodies are arbitrary JSON fixtures, including deliberately malformed
// ones, so the helper takes unknown; a stricter type would block those cases.
function reply(value: unknown, status = 200) {
	return new Response(JSON.stringify(value), {
		status,
		headers: { 'Content-Type': 'application/json' },
	});
}
beforeEach(() => {
	jest.clearAllMocks();
	fetchMock.mockReset();
	global.fetch = fetchMock;
});
afterAll(() => {
	global.fetch = originalFetch;
});
function requestAt(index: number) {
	const [url, init] = fetchMock.mock.calls.at(index) as [string, RequestInit];
	return { url: new URL(url), init, headers: new Headers(init.headers) };
}

const org = 'org-example';
const autoRecharge = {
	org_id: org,
	enabled: true,
	available: true,
	reason: null,
	threshold_credits: 100,
	refill_to_credits: 500,
	rolling_limit_cents: null,
	purchase_limit_credits: 2000,
};
const mutation = {
	data: { org_id: org, credits: 1000 },
	operation: {
		id: 'op-1',
		state: 'payment_pending',
		version: 1,
		next_action: null,
	},
	request_id: 'req-1',
};
const usageEvent = {
	id: 'evt-1',
	provider: 'deepline_native',
	operation: 'free_simple_company_search',
	status: 'completed',
	request_id: 'public-execute:1',
	billing_outcome_reason: 'free_operation',
	credits: 0,
	billing_mode: null,
	pricing_model: null,
	policy_id: null,
	run_id: null,
	created_at: '2026-11-16T15:02:28.675Z',
};
const KEY = 'purchase-2026-11-17:0001';

type Case = {
	name: keyof typeof billingSchemas;
	call: () => Promise<unknown>;
	method?: string;
	path: string;
	query?: Record<string, string>;
	body?: unknown;
	headers?: Record<string, string | null>;
	response: unknown;
	/** What the op returns when it unwraps a { data } envelope. */
	result?: unknown;
};
const cases: Case[] = [
	{
		name: 'billing.catalog',
		call: () => billing.catalog(ctx, {}),
		path: '/api/v2/billing/catalog/current',
		response: {
			catalog_id: 'deepline-billing',
			catalog_version: '2026-08-usage-v2',
			active_plan: {
				plan_family_id: 'usage',
				plan_version_id: 'usage-current-v2',
				public_name: 'Usage',
				rate_card_id: 'usage-current-rates-v2',
				assigned_by: 'system',
				assigned_at: null,
				has_subscription: false,
			},
			plans: [
				{
					plan_family_id: 'usage',
					plan_version_id: 'usage-current-v1',
					public_name: 'Usage',
					price_usd: null,
					price_interval: null,
					monthly_grant_credits: 0,
					rollover: { mode: 'none' },
					acquirable: false,
				},
			],
			meters: [{ id: 'sdk.tool_call', name: 'Tool calls' }],
			public_pricing: {},
		},
	},
	{
		name: 'billing.plans',
		call: () => billing.plans(ctx, { promo_code: 'LAUNCH' }),
		path: '/api/v2/billing/plans',
		query: { promo_code: 'LAUNCH' },
		response: {
			org_id: org,
			plans: [
				{
					sku: 'payg-v1',
					name: 'Pay as you go',
					recurring_price_usd: 0,
					first_month_price_usd: null,
					bonus_credits: null,
					interval: 'month',
					included_credits: 0,
					benefits: {},
					purchased_credit_price_usd: 0.1,
					acquisition_enabled: true,
				},
			],
			promo_code: {
				code: 'LAUNCH',
				status: 'unknown',
				plan_skus: [],
				expires_at: null,
			},
			current_plan_sku: 'payg-v1',
			pending_plan_sku: null,
			acquisition_enabled: true,
			enabled_offer_keys: ['payg-v1'],
		},
	},
	{
		name: 'billing.status',
		call: () => billing.status(ctx, {}),
		path: '/api/v2/billing/status',
		response: {
			org_id: org,
			plan: {
				sku: 'payg-v1',
				name: 'Pay as you go',
				recurring_price_usd: 0,
				interval: 'month',
				included_credits: 0,
			},
			state: 'active',
			changes_allowed: true,
			payment_state: 'not_configured',
			recharge_state: 'idle',
			billing_email: null,
			billing_address: null,
			next_action: null,
			pending_plan_sku: null,
			as_of: '2026-11-15T01:18:26.742Z',
		},
	},
	{
		name: 'billing.subscription.status',
		call: () => billing.subscription.status(ctx, {}),
		path: '/api/v2/billing/subscription/status',
		response: {
			org_id: org,
			plan_version_id: 'payg-v1',
			plan_name: 'Pay as you go',
			plan_family_id: 'target-commercial',
			subscribed: false,
			price_usd: 0,
			price_interval: 'month',
			monthly_grant_credits: 0,
			assigned_by: 'system',
			assigned_at: null,
			credit_pools: [
				{
					grant_id: 'grant-1',
					pool: 'promo',
					credits_remaining: 25,
					credits_granted: 25,
					source: 'metronome_promotional',
					cycle_key: null,
					effective_at: '2026-11-15T01:18:29.483Z',
				},
			],
			pooled_credits_remaining: 25,
			current_period_end: null,
			cancel_at_period_end: false,
			stripe_status: null,
		},
	},
	{
		name: 'billing.invoices',
		call: () => billing.invoices(ctx, { limit: 5 }),
		path: '/api/v2/billing/invoices',
		query: { limit: '5' },
		response: {
			org_id: org,
			entries: [
				{
					kind: 'receipt',
					id: 'rcpt-1',
					created_at: '2026-11-01T00:00:00Z',
					description: '1,000 credits',
					amount_cents: 10000,
					currency: 'usd',
					status: 'paid',
					url: null,
					pdf_url: null,
				},
			],
		},
	},
	{
		name: 'billing.autoRecharge.get',
		call: () => billing.autoRecharge.get(ctx, {}),
		path: '/api/v2/billing/auto-recharge',
		response: autoRecharge,
	},
	{
		name: 'billing.usageEvents',
		call: () =>
			billing.usageEvents(ctx, { limit: 2, cursor: 'c1', run_id: 'run-1' }),
		path: '/api/v2/usage/events',
		query: { limit: '2', cursor: 'c1', run_id: 'run-1' },
		response: {
			org_id: org,
			run_id: 'run-1',
			next_cursor: null,
			entries: [usageEvent],
		},
	},
	{
		name: 'billing.includedCompute',
		call: () => billing.includedCompute(ctx, { include_overage: true }),
		path: '/api/v2/billing/included-compute',
		query: { include_overage: 'true' },
		response: {
			status: 'on',
			credits_per_minute: 0.67,
			included_minutes: 300,
			plan: { included_minutes: 300, credits_per_minute: 0.67 },
			period_start_at: '2026-11-01T00:00:00.000Z',
			period_end_at: '2026-12-01T00:00:00.000Z',
			resets_on: 'calendar_month',
			included_minutes_used: 0,
			included_credits_used: 0,
			overage_credits: 0,
			minutes_used: 0,
			days: [{ day: '2026-11-01', minutes: 0 }],
		},
	},
	{
		name: 'billing.quote',
		call: () =>
			billing.quote(ctx, {
				quantity: 2,
				sandbox_runtime: { timeout: '90m', size: 'large' },
			}),
		method: 'POST',
		path: '/api/v2/billing/quote',
		body: { quantity: 2, sandbox_runtime: { timeout: '90m', size: 'large' } },
		response: {
			scope: 'sandbox_session',
			quantity: 2,
			resources: { timeoutSeconds: 5400, memoryGiB: 4, cpu: 2, diskGiB: 8 },
			maximum_backend: 'daytona',
			priced_backends: ['daytona', 'modal'],
			maximum_billing_seconds: 3600,
			maximum_credits: 200,
			total_play_credits: null,
			total_budget_supported: false,
			unbounded_components: ['provider_operations'],
			explanation: 'Highest per-session ceiling.',
			plan_version_id: 'usage-current-v2',
			rate_card_id: 'usage-current-rates-v2',
		},
	},
	{
		name: 'billing.subscription.cancel',
		call: () => billing.subscription.cancel(ctx, { action: 'undo_cancel' }),
		method: 'POST',
		path: '/api/v2/billing/subscription/cancel',
		body: { action: 'undo_cancel' },
		response: {
			org_id: org,
			subscription_id: 'sub-1',
			cancel_at_period_end: false,
			current_period_end: '2026-12-01T00:00:00Z',
			status: 'active',
			message: 'Cancellation reversed.',
		},
	},
	{
		name: 'billing.autoRecharge.update',
		call: () =>
			billing.autoRecharge.update(ctx, {
				enabled: true,
				threshold_credits: 100,
				refill_to_credits: 500,
				purchase_limit_credits: 2000,
				idempotencyKey: KEY,
			}),
		method: 'PUT',
		path: '/api/v2/billing/auto-recharge',
		body: {
			enabled: true,
			threshold_credits: 100,
			refill_to_credits: 500,
			purchase_limit_credits: 2000,
		},
		headers: { 'Idempotency-Key': KEY },
		response: { data: autoRecharge, request_id: 'req-2' },
		result: autoRecharge,
	},
	{
		name: 'billing.topUp',
		call: () => billing.topUp(ctx, { credits: 1000, idempotencyKey: KEY }),
		method: 'POST',
		path: '/api/v2/billing/top-up',
		body: { credits: 1000, idempotency_key: KEY },
		headers: { 'Idempotency-Key': KEY, 'x-deepline-top-up-receipt': null },
		response: {
			ok: true,
			credits: 1000,
			amount_cents: 10000,
			currency: 'usd',
			balance: 1025,
			stripe_payment_intent_id: 'pi_1',
			payment_method: { brand: 'visa', last4: '4242' },
		},
	},
	{
		name: 'billing.creditPurchases.create',
		call: () =>
			billing.creditPurchases.create(ctx, {
				credits: 1000,
				idempotencyKey: KEY,
			}),
		method: 'POST',
		path: '/api/v2/billing/credit-purchases',
		body: { credits: 1000 },
		headers: { 'Idempotency-Key': KEY },
		response: mutation,
	},
	{
		name: 'billing.creditPurchases.recover',
		call: () =>
			billing.creditPurchases.recover(ctx, {
				credits: 1000,
				org_id: org,
				idempotencyKey: KEY,
			}),
		method: 'POST',
		path: '/api/v2/billing/credit-purchases/recover',
		body: { credits: 1000, org_id: org },
		headers: { 'Idempotency-Key': KEY },
		response: {
			...mutation,
			data: { org_id: org, recovery_disposition: 'retired_before_start' },
			operation: { ...mutation.operation, state: 'retired' },
		},
	},
	{
		name: 'billing.planTransitions.create',
		call: () =>
			billing.planTransitions.create(ctx, {
				action: 'start_or_change',
				target_plan_sku: 'growth-v1',
				promo_code: 'LAUNCH',
				idempotencyKey: KEY,
			}),
		method: 'POST',
		path: '/api/v2/billing/plan-transitions',
		body: {
			action: 'start_or_change',
			target_plan_sku: 'growth-v1',
			promo_code: 'LAUNCH',
		},
		headers: { 'Idempotency-Key': KEY },
		response: mutation,
	},
	{
		name: 'billing.portalSessions.create',
		call: () => billing.portalSessions.create(ctx, { flow: 'customer_update' }),
		method: 'POST',
		path: '/api/v2/billing/portal-sessions',
		query: { flow: 'customer_update' },
		body: {},
		response: {
			data: { url: 'https://billing.stripe.com/p/session/test_1' },
			request_id: 'req-3',
		},
		result: { url: 'https://billing.stripe.com/p/session/test_1' },
	},
];

describe('Deepline billing HTTP contracts', () => {
	it.each(cases)(
		'$name sends the documented request and validates the result',
		async (test) => {
			fetchMock.mockResolvedValueOnce(reply(test.response));
			expect(await test.call()).toEqual(test.result ?? test.response);
			expect(fetchMock).toHaveBeenCalledTimes(1);
			const { url, init, headers } = requestAt(-1);
			expect(url.origin).toBe('https://code.deepline.com');
			expect(url.pathname).toBe(test.path);
			expect(init.method).toBe(test.method ?? 'GET');
			expect(headers.get('Authorization')).toBe('Bearer tenant-resolved-key');
			expect(Object.fromEntries(url.searchParams)).toEqual(test.query ?? {});
			if (test.body === undefined) expect(init.body).toBeUndefined();
			else expect(JSON.parse(String(init.body))).toEqual(test.body);
			for (const [name, value] of Object.entries(test.headers ?? {}))
				expect(headers.get(name)).toBe(value);
			// The event records the operation only, never inputs or results.
			expect(logEventFromContext).toHaveBeenCalledWith(
				ctx,
				`deepline.${test.name}`,
				{},
				'completed',
			);
		},
	);
	it.each(cases)('$name rejects a malformed success response', async (test) => {
		fetchMock.mockResolvedValueOnce(reply({ unrelated: true }));
		await expect(test.call()).rejects.toThrow();
		expect(logEventFromContext).not.toHaveBeenCalled();
	});
	it('covers every billing registry entry, with meta for each', () => {
		const names = Object.keys(billingSchemas).sort();
		expect(cases.map((t) => t.name).sort()).toEqual(names);
		expect(Object.keys(billingMeta).sort()).toEqual(names);
	});
	it('exports only registered ops from the billing module', () => {
		const leaves: string[] = [];
		for (const [name, value] of Object.entries(billing)) {
			if (typeof value === 'function') leaves.push(`billing.${name}`);
			else
				for (const [child, fn] of Object.entries(value)) {
					expect(typeof fn).toBe('function');
					leaves.push(`billing.${name}.${child}`);
				}
		}
		expect(leaves.sort()).toEqual(
			[
				...Object.keys(billingSchemas),
				'billing.entitlements',
				'billing.balance',
				'billing.usage',
				'billing.ledger',
			].sort(),
		);
	});
	it('marks every money, plan, subscription or auto-recharge change destructive', () => {
		for (const name of [
			'billing.topUp',
			'billing.creditPurchases.create',
			'billing.planTransitions.create',
			'billing.subscription.cancel',
			'billing.autoRecharge.update',
		] as const)
			expect(billingMeta[name].riskLevel).toBe('destructive');
		expect(billingMeta['billing.topUp'].description).toMatch(/spends money/);
		expect(billingMeta['billing.creditPurchases.create'].description).toMatch(
			/spends money/,
		);
		expect(billingMeta['billing.quote'].riskLevel).toBe('read');
		expect(billingMeta['billing.creditPurchases.recover'].riskLevel).toBe(
			'write',
		);
	});
});

const keyed = [
	{
		name: 'billing.topUp',
		call: (idempotencyKey?: string) =>
			billing.topUp(ctx, { credits: 1000, idempotencyKey } as never),
		response: cases.find((c) => c.name === 'billing.topUp')!.response,
	},
	{
		name: 'billing.creditPurchases.create',
		call: (idempotencyKey?: string) =>
			billing.creditPurchases.create(ctx, {
				credits: 1000,
				idempotencyKey,
			} as never),
		response: mutation,
	},
	{
		name: 'billing.creditPurchases.recover',
		call: (idempotencyKey?: string) =>
			billing.creditPurchases.recover(ctx, {
				credits: 1000,
				org_id: org,
				idempotencyKey,
			} as never),
		response: mutation,
	},
	{
		name: 'billing.planTransitions.create',
		call: (idempotencyKey?: string) =>
			billing.planTransitions.create(ctx, {
				action: 'cancel',
				idempotencyKey,
			} as never),
		response: mutation,
	},
	{
		name: 'billing.autoRecharge.update',
		call: (idempotencyKey?: string) =>
			billing.autoRecharge.update(ctx, {
				enabled: false,
				idempotencyKey,
			} as never),
		response: { data: autoRecharge },
	},
];
describe('money-moving billing writes and idempotency', () => {
	it.each(keyed)(
		'$name requires a caller-supplied idempotency key before HTTP',
		async (test) => {
			for (const bad of [
				undefined,
				'',
				' padded',
				'padded ',
				'line\nbreak',
				'x'.repeat(201),
			])
				await expect(test.call(bad)).rejects.toThrow();
			expect(fetchMock).not.toHaveBeenCalled();
		},
	);
	it.each(keyed)(
		'$name retried with the same key sends the identical request',
		async (test) => {
			fetchMock
				.mockResolvedValueOnce(reply(test.response))
				.mockResolvedValueOnce(reply(test.response));
			await test.call(KEY);
			await test.call(KEY);
			const first = requestAt(0);
			const second = requestAt(1);
			expect(first.headers.get('Idempotency-Key')).toBe(KEY);
			expect(second.headers.get('Idempotency-Key')).toBe(KEY);
			expect(second.url.href).toBe(first.url.href);
			expect(second.init.method).toBe(first.init.method);
			expect(second.init.body).toBe(first.init.body);
		},
	);
	it('top-up with receipt sends the receipt header and parses a pending receipt', async () => {
		const pending = {
			status: 'pending',
			operation_id: 'op-9',
			operation_state: 'payment_pending',
			requested_credits: 500,
			amount_cents: 5000,
			currency: 'usd',
		};
		fetchMock.mockResolvedValueOnce(reply(pending));
		expect(
			await billing.topUp(ctx, {
				credits: 500,
				idempotencyKey: KEY,
				receipt: true,
			}),
		).toEqual(pending);
		const { headers, init } = requestAt(-1);
		expect(headers.get('x-deepline-top-up-receipt')).toBe('operation-v1');
		expect(headers.get('Idempotency-Key')).toBe(KEY);
		expect(JSON.parse(String(init.body))).toEqual({
			credits: 500,
			idempotency_key: KEY,
		});
	});
	it('top-up parses an applied receipt', async () => {
		const applied = {
			status: 'applied',
			operation_id: 'op-9',
			operation_state: 'applied',
			applied_credits: 500,
			amount_cents: 5000,
			currency: 'usd',
			balance: 525,
		};
		fetchMock.mockResolvedValueOnce(reply(applied));
		expect(
			await billing.topUp(ctx, {
				credits: 500,
				idempotencyKey: KEY,
				receipt: true,
			}),
		).toEqual(applied);
	});
	it.each([0, -5, 1.5])('rejects %p credits before HTTP', async (credits) => {
		await expect(
			billing.topUp(ctx, { credits, idempotencyKey: KEY }),
		).rejects.toThrow();
		await expect(
			billing.creditPurchases.create(ctx, { credits, idempotencyKey: KEY }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
	it('surfaces a 409 checkout-required top-up as an error without retrying', async () => {
		fetchMock.mockResolvedValueOnce(reply({ error: 'Checkout required' }, 409));
		await expect(
			billing.topUp(ctx, { credits: 1000, idempotencyKey: KEY }),
		).rejects.toThrow('HTTP 409');
		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(logEventFromContext).not.toHaveBeenCalled();
	});
});

describe('billing write input rules', () => {
	it('auto-recharge off sends only enabled:false', async () => {
		fetchMock.mockResolvedValueOnce(reply({ data: autoRecharge }));
		await billing.autoRecharge.update(ctx, {
			enabled: false,
			idempotencyKey: KEY,
		});
		expect(JSON.parse(String(requestAt(-1).init.body))).toEqual({
			enabled: false,
		});
	});
	it('auto-recharge accepts a null purchase cap and an unwrapped response', async () => {
		fetchMock.mockResolvedValueOnce(reply(autoRecharge));
		expect(
			await billing.autoRecharge.update(ctx, {
				enabled: true,
				threshold_credits: 0,
				refill_to_credits: 100,
				purchase_limit_credits: null,
				idempotencyKey: KEY,
			}),
		).toEqual(autoRecharge);
		expect(JSON.parse(String(requestAt(-1).init.body))).toEqual({
			enabled: true,
			threshold_credits: 0,
			refill_to_credits: 100,
			purchase_limit_credits: null,
		});
	});
	it.each([
		{ enabled: true, refill_to_credits: 100 },
		{ enabled: true, threshold_credits: 10 },
		{ enabled: false, threshold_credits: 10 },
		{ enabled: false, purchase_limit_credits: 0 },
	])('auto-recharge rejects inconsistent settings %p', async (input) => {
		await expect(
			billing.autoRecharge.update(ctx, {
				...input,
				idempotencyKey: KEY,
			} as never),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
	it('plan cancel sends only the action', async () => {
		fetchMock.mockResolvedValueOnce(reply(mutation));
		await billing.planTransitions.create(ctx, {
			action: 'undo_cancel',
			idempotencyKey: KEY,
		});
		expect(JSON.parse(String(requestAt(-1).init.body))).toEqual({
			action: 'undo_cancel',
		});
	});
	it.each([
		{ action: 'start_or_change' },
		{ action: 'cancel', target_plan_sku: 'growth-v1' },
		{ action: 'undo_cancel', promo_code: 'X' },
	])('plan transition rejects %p', async (input) => {
		await expect(
			billing.planTransitions.create(ctx, {
				...input,
				idempotencyKey: KEY,
			} as never),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
	it('subscription cancel requires an explicit action', async () => {
		await expect(
			billing.subscription.cancel(ctx, {} as never),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
	it('recover requires the original org_id', async () => {
		await expect(
			billing.creditPurchases.recover(ctx, {
				credits: 10,
				org_id: ' org',
				idempotencyKey: KEY,
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
	it('portal session without flow has no query', async () => {
		fetchMock.mockResolvedValueOnce(
			reply({ data: { url: 'https://billing.stripe.com/p/session/x' } }),
		);
		await billing.portalSessions.create(ctx, {});
		expect(requestAt(-1).url.search).toBe('');
	});
});

describe('billing read input rules', () => {
	it('usage event lookup by request_id sends only request_id', async () => {
		const value = {
			org_id: org,
			run_id: null,
			next_cursor: null,
			entries: [usageEvent],
		};
		fetchMock.mockResolvedValueOnce(reply(value));
		expect(
			await billing.usageEvents(ctx, { request_id: 'public-execute:1' }),
		).toEqual(value);
		expect(Object.fromEntries(requestAt(-1).url.searchParams)).toEqual({
			request_id: 'public-execute:1',
		});
	});
	it.each([
		{ request_id: 'r', cursor: 'c' },
		{ request_id: 'r', run_id: 'run' },
		{ request_id: 'r', limit: 5 },
		{ request_id: ' r' },
		{ limit: 501 },
	])('usage events reject %p before HTTP', async (input) => {
		await expect(billing.usageEvents(ctx, input)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
	it('included compute omits include_overage unless true; quote defaults the runtime', async () => {
		const compute = cases.find((c) => c.name === 'billing.includedCompute')!;
		const quote = cases.find((c) => c.name === 'billing.quote')!;
		fetchMock
			.mockResolvedValueOnce(reply(compute.response))
			.mockResolvedValueOnce(reply(quote.response));
		await billing.includedCompute(ctx, { include_overage: false });
		expect(requestAt(-1).url.search).toBe('');
		expect(requestAt(-1).init.method).toBe('GET');
		await billing.quote(ctx, { quantity: 1 });
		expect(JSON.parse(String(requestAt(-1).init.body))).toEqual({
			quantity: 1,
			sandbox_runtime: {},
		});
	});
	it.each([
		{ quantity: 0 },
		{ quantity: 1, sandbox_runtime: { size: 'huge' } },
		{ quantity: 1, sandbox_runtime: { timeout: '90s' } },
	])('quote rejects %p', async (input) => {
		await expect(billing.quote(ctx, input as never)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});
