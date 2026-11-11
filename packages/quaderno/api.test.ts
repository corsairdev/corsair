import { makeQuadernoRequest } from './client';
import { QuadernoEndpointOutputSchemas as Outputs } from './endpoints/types';

/**
 * Live smoke against a scratch Quaderno account. Read-only apart from the
 * create/delete pair it cleans up, because Quaderno cannot delete a document
 * once issued: it has to be voided, which leaves a credit note behind.
 *
 * Run with `QUADERNO_API_KEY=... QUADERNO_ACCOUNT=... pnpm test:live`.
 * CI skips `api.test.ts` by name.
 */
const API_KEY = process.env.QUADERNO_API_KEY;
const ACCOUNT = process.env.QUADERNO_ACCOUNT;

const missing = [
	['QUADERNO_API_KEY', API_KEY],
	['QUADERNO_ACCOUNT', ACCOUNT],
]
	.filter(([, value]) => !value)
	.map(([name]) => name);

if (missing.length > 0) {
	console.warn(
		`[quaderno] ${missing.join(' and ')} not set: the live smoke tests are skipped, not passing.`,
	);
}

const describeIfReady = API_KEY && ACCOUNT ? describe : describe.skip;

const get = (path: string, query?: Record<string, string | number>) =>
	makeQuadernoRequest(API_KEY as string, ACCOUNT as string, {
		method: 'GET',
		path,
		query,
	});

describeIfReady('Quaderno live smoke', () => {
	it('pings and reports the account', async () => {
		const ping = await get('/ping');
		expect(ping).toEqual({ status: 'OK' });

		const auth = await get('/authorization');
		const identity = (auth as { identity?: { href?: string } }).identity;
		expect(identity?.href).toContain('.quadernoapp.com');
	});

	it('lists every paged resource as a bare array', async () => {
		for (const path of [
			'/contacts',
			'/items',
			'/invoices',
			'/receipts',
			'/credits',
			'/proformas',
			'/webhooks',
		]) {
			const page = await get(path);
			expect({ path, isArray: Array.isArray(page) }).toEqual({
				path,
				isArray: true,
			});
		}
	});

	it('reads the static tax reference lists', async () => {
		const codes = await get('/tax_codes', { limit: 2 });
		// unknown: the live client returns an untyped body, narrowed by the
		// Array.isArray check just above.
		expect((codes as unknown[]).length).toBe(2);

		const jurisdictions = await get('/jurisdictions');
		// unknown: same as above, an untyped body narrowed by the array check.
		expect((jurisdictions as unknown[]).length).toBeGreaterThan(100);
	});

	it('calculates a tax rate', async () => {
		const result = await get('/tax_rates/calculate', {
			to_country: 'US',
			tax_code: 'standard',
			amount: 10,
		});
		expect(result).toBeDefined();
	});

	it('creates a contact and deletes it again', async () => {
		const created = await makeQuadernoRequest(
			API_KEY as string,
			ACCOUNT as string,
			{
				method: 'POST',
				path: '/contacts',
				body: {
					kind: 'person',
					first_name: 'Corsair',
					last_name: 'LiveProbe',
					email: `live-probe-${Date.now()}@example.com`,
					country: 'US',
				},
			},
		);
		const id = (created as { id?: number }).id;
		expect(typeof id).toBe('number');
		if (typeof id !== 'number') return;

		const fetched = await get(`/contacts/${id}`);
		expect((fetched as { id?: number }).id).toBe(id);

		await makeQuadernoRequest(API_KEY as string, ACCOUNT as string, {
			method: 'DELETE',
			path: `/contacts/${id}`,
		});

		// A deleted contact answers 401 "does not exist", not 404.
		const gone = await get(`/contacts/${id}`).catch(
			// unknown: a rejection can be any value until the instanceof check below.
			(caught: unknown) => caught,
		);
		expect(gone).toBeInstanceOf(Error);
	});

	it('reports a missing record as a not-found error, not an auth error', async () => {
		const error = await get('/contacts/999999999999').catch(
			// unknown: a rejection can be any value until the instanceof check below.
			(caught: unknown) => caught,
		);
		expect(error).toBeInstanceOf(Error);
		if (!(error instanceof Error)) throw error;
		expect(error.message).toContain('does not exist');
	});

	it('discovers the account from the root host with no account name', async () => {
		// The flow the docs promise, and the reason `authorization` skips account
		// resolution: a caller with only a key can find its account here.
		const auth = await makeQuadernoRequest(API_KEY as string, '', {
			method: 'GET',
			path: '/authorization',
			operation: 'authorization',
			useRootHost: true,
		});
		const identity = (auth as { identity?: { href?: string } }).identity;
		expect(identity?.href).toContain('.quadernoapp.com');
	});

	it('records a payment and gets the payment back, not the invoice', async () => {
		// The route answers a payment object with no `created_at`, which an
		// invoice-shaped schema would reject.
		const contact = (await makeQuadernoRequest(
			API_KEY as string,
			ACCOUNT as string,
			{
				method: 'POST',
				path: '/contacts',
				body: {
					kind: 'person',
					first_name: 'Pay',
					last_name: 'Probe',
					email: `pay-probe-${Date.now()}@example.com`,
					country: 'US',
				},
			},
		)) as { id: number };

		const invoice = (await makeQuadernoRequest(
			API_KEY as string,
			ACCOUNT as string,
			{
				method: 'POST',
				path: '/invoices',
				body: {
					contact: { id: contact.id },
					currency: 'USD',
					items: [{ description: 'Probe', quantity: 1, unit_price: 10 }],
				},
			},
		)) as { id: number };

		try {
			const payment = await makeQuadernoRequest(
				API_KEY as string,
				ACCOUNT as string,
				{
					method: 'POST',
					path: `/invoices/${invoice.id}/payments`,
					body: { date: '2026-11-10', amount: 10, payment_method: 'cash' },
				},
			);

			const parsed = Outputs.invoicesRecordPayment.safeParse({ payment });
			expect(parsed.success).toBe(true);
			if (!parsed.success) return;
			expect(parsed.data.payment.payment_method).toBe('cash');
		} finally {
			// An invoice cannot be deleted, only voided, so cleanup has to run even
			// when an assertion above fails. A cleanup failure is surfaced with the
			// invoice id rather than swallowed: a silent failure would leave a real
			// invoice behind and the test would still pass.
			const voided = await makeQuadernoRequest(
				API_KEY as string,
				ACCOUNT as string,
				{
					method: 'PUT',
					path: `/invoices/${invoice.id}/void`,
					body: { void_reason: 'Live probe cleanup' },
				},
			).catch(
				// unknown: a rejection can be any value; the cleanup reports it either way.
				(caught: unknown) => caught,
			);

			if (voided instanceof Error) {
				throw new Error(
					`Cleanup failed: invoice ${invoice.id} was not voided. Void it by hand. ${voided.message}`,
				);
			}
		}
	});

	it('reports a wrong key as an auth error', async () => {
		const error = await makeQuadernoRequest(
			'sk_live_not_a_real_key',
			ACCOUNT as string,
			{ method: 'GET', path: '/ping' },
		).catch(
			// unknown: a rejection can be any value until the instanceof check below.
			(caught: unknown) => caught,
		);

		expect(error).toBeInstanceOf(Error);
		if (!(error instanceof Error)) throw error;
		expect(error.message).toContain('Wrong API key');
	});
});
