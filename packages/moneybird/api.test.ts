import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { moneybirdOperations } from './endpoints/manifest';
import { moneybird } from './index';

/**
 * Live run against a Moneybird sandbox administration
 * (moneybird.com/administrations/sandboxes/new: free, full features,
 * watermarked invoices). Skipped unless MONEYBIRD_API_TOKEN and
 * MONEYBIRD_ADMINISTRATION_ID are set (CI never runs files named api.test.ts).
 *
 *   MONEYBIRD_API_TOKEN=... MONEYBIRD_ADMINISTRATION_ID=... npx jest api.test.ts
 *
 * Reads every settings list, a page of each record list and every other GET
 * that takes no arguments (reports, sync lists, defaults), then round trips on
 * made-up records: a contact at the test inbox (update, note, contact person),
 * a product, a project, and a draft sales invoice with its PDF. Everything
 * created is deleted at the end, even when a step fails. Calls are spaced
 * 2.1 s apart: Moneybird allows 150 requests per 5 minutes per IP.
 *
 * Never run here: salesInvoices.send, salesInvoices.sendReminders,
 * estimates.send and contacts.paymentsMandate.request (they email people),
 * subscriptions and recurring invoices (they invoice on a schedule), and the
 * SEPA upload (bank transfers).
 */
const token = process.env.MONEYBIRD_API_TOKEN;
const administrationId = process.env.MONEYBIRD_ADMINISTRATION_ID;
const describeIfKey = token && administrationId ? describe : describe.skip;

if (!token || !administrationId) {
	const missing = [
		!token && 'MONEYBIRD_API_TOKEN',
		!administrationId && 'MONEYBIRD_ADMINISTRATION_ID',
	]
		.filter(Boolean)
		.join(', ');
	console.warn(`Skipping Moneybird live run: set ${missing}.`);
}

const TODAY = new Date().toISOString().slice(0, 10);
const NAME = `corsair-plugin-test-${Date.now()}`;

// `unknown` because the value is any parsed response. Paged lists come back
// as `{ items, next_page }`, the others as a bare array.
function itemsOf(value: unknown): unknown[] {
	if (Array.isArray(value)) return value;
	const items =
		typeof value === 'object' && value !== null && 'items' in value
			? (value as { items?: unknown }).items
			: undefined;
	if (!Array.isArray(items)) throw new Error('response is not a list');
	return items;
}

// Every GET that needs nothing but the administration: safe to call with {}.
const NO_ARGUMENT_READS = moneybirdOperations
	.filter(
		(op) =>
			op.method === 'GET' &&
			op.response === 'json' &&
			// events.list and reports.journalEntries need one filter (anyOf).
			op.input.anyOf === undefined &&
			((op.input.required as string[] | undefined) ?? []).every(
				(name) => name === 'administration_id',
			),
	)
	.map((op) => op.id);

// `unknown` because the value is any parsed response.
function idOf(value: unknown): string {
	const id =
		typeof value === 'object' && value !== null && 'id' in value
			? (value as { id?: unknown }).id
			: undefined;
	if (typeof id !== 'string' && typeof id !== 'number') {
		throw new Error('response has no id');
	}
	return String(id);
}

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'moneybird', 'default');
	const corsair = createCorsair({
		plugins: [moneybird({ key: token, administrationId })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

type Client = Awaited<ReturnType<typeof createClient>>['corsair'];

describeIfKey('moneybird live', () => {
	jest.setTimeout(120_000);

	let client: Awaited<ReturnType<typeof createClient>> | undefined;
	const api = () =>
		(client as NonNullable<typeof client>).corsair.moneybird.api;
	const ids: Record<string, string> = {};
	const cleanups: Array<{
		what: string;
		run: (c: Client) => Promise<unknown>;
	}> = [];
	const cleanup = (what: string, run: (c: Client) => Promise<unknown>) =>
		cleanups.push({ what, run });
	const need = (name: string): string => {
		const id = ids[name];
		if (!id) throw new Error(`no ${name} from an earlier step`);
		return id;
	};

	const realFetch = globalThis.fetch;
	let last = 0;

	beforeAll(async () => {
		globalThis.fetch = (async (...args: Parameters<typeof fetch>) => {
			const wait = last + 2100 - Date.now();
			if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
			last = Date.now();
			return realFetch(...args);
		}) as typeof fetch;
		client = await createClient();
	});

	afterAll(async () => {
		const left: string[] = [];
		if (client) {
			for (const item of cleanups.reverse()) {
				try {
					await item.run(client.corsair);
				} catch (error) {
					left.push(`${item.what}: ${(error as Error).message}`);
				}
			}
			await client.testDb.cleanup?.();
		}
		globalThis.fetch = realFetch;
		if (left.length > 0) {
			console.warn(`Moneybird records left behind:\n${left.join('\n')}`);
		}
	});

	it('lists the administrations the token reaches', async () => {
		const out = (await api().administrations.list({})) as Array<{
			id: string;
		}>;
		expect(out.map((a) => String(a.id))).toContain(administrationId);
	});

	it.each([
		'taxRates',
		'ledgerAccounts',
		'workflows',
		'documentStyles',
		'identities',
		'users',
		'customFields',
		'financialAccounts',
		'webhooks',
		'downloads',
	] as const)('lists %s', async (group) => {
		const list = api()[group].list as (input: object) => Promise<unknown>;
		expect(Array.isArray(itemsOf(await list({})))).toBe(true);
	});

	it.each([
		'contacts',
		'salesInvoices',
		'estimates',
		'products',
		'projects',
		'timeEntries',
	] as const)('reads a page of %s', async (group) => {
		const list = api()[group].list as (input: object) => Promise<unknown>;
		const out = await list({ per_page: 5 });
		expect(out).toBeDefined();
	});

	it('reads the profit and loss report', async () => {
		await expect(api().reports.profitLoss({})).resolves.toBeDefined();
	});

	it.each(NO_ARGUMENT_READS)('reads %s with no arguments', async (id) => {
		// `unknown` because the path walks the generated API object by name.
		let fn: unknown = api();
		for (const part of id.split('.')) {
			fn = (fn as Record<string, unknown>)[part];
		}
		await expect(
			(fn as (input: object) => Promise<unknown>)({}),
		).resolves.toBeDefined();
	});

	it('reads events of one record type', async () => {
		const out = await api().events.list({ entity_type: 'SalesInvoice' });
		expect(Array.isArray(out)).toBe(true);
	});

	it('reads the journal entries report for one ledger account', async () => {
		const accounts = (await api().ledgerAccounts.list({})) as Array<{
			id: string;
		}>;
		const out = await api().reports.journalEntries({
			ledger_account_id: idOf(accounts[0]),
			period: 'this_year',
		});
		expect(Array.isArray(itemsOf(out))).toBe(true);
	});

	it('creates, updates and notes an example.com contact', async () => {
		const contact = await api().contacts.create({
			contact: {
				company_name: NAME,
				firstname: 'Jana',
				lastname: 'Test',
				send_invoices_to_email: 'corsair-tests@inkboxmail.com',
				country: 'NL',
			},
		});
		ids.contact = idOf(contact);
		cleanup('contact', (c) =>
			c.moneybird.api.contacts.delete({ id: need('contact') }),
		);
		await api().contacts.update({
			id: need('contact'),
			contact: { city: 'Amsterdam' },
		});
		const read = (await api().contacts.get({ id: need('contact') })) as {
			city?: string;
		};
		expect(read.city).toBe('Amsterdam');
		await api().contacts.notes.create({
			contact_id: need('contact'),
			note: { note: 'Corsair plugin live test' },
		});
		const person = await api().contacts.contactPeople.create({
			contact_id: need('contact'),
			contact_person: { firstname: 'Ada', lastname: 'Test' },
		});
		await api().contacts.contactPeople.delete({
			contact_id: need('contact'),
			id: idOf(person),
		});
	});

	it('creates and deletes a product and a project', async () => {
		const accounts = (await api().ledgerAccounts.list({})) as Array<{
			id: string;
			account_type?: string | null;
		}>;
		const revenue = accounts.find((a) => a.account_type === 'revenue');
		if (!revenue) throw new Error('no revenue ledger account');
		// Moneybird refuses a product without a VAT rate or product type.
		const rates = itemsOf(
			await api().taxRates.list({ filter: 'tax_rate_type:sales_invoice' }),
		);
		if (rates.length === 0) throw new Error('no sales tax rate');
		const product = await api().products.create({
			product: {
				description: NAME,
				price: '10.00',
				ledger_account_id: String(revenue.id),
				tax_rate_id: idOf(rates[0]),
			},
		});
		ids.product = idOf(product);
		cleanup('product', (c) =>
			c.moneybird.api.products.delete({ id: need('product') }),
		);
		const readProduct = (await api().products.get({
			id: need('product'),
		})) as { description?: string };
		expect(readProduct.description).toBe(NAME);
		const project = await api().projects.create({ project: { name: NAME } });
		ids.project = idOf(project);
		cleanup('project', (c) =>
			c.moneybird.api.projects.delete({ id: need('project') }),
		);
		const readProject = (await api().projects.get({
			id: need('project'),
		})) as { name?: string };
		expect(readProject.name).toBe(NAME);
	});

	it('creates a draft invoice and downloads its PDF (never sends it)', async () => {
		const invoice = await api().salesInvoices.create({
			sales_invoice: {
				contact_id: need('contact'),
				invoice_date: TODAY,
				details_attributes: [
					{ description: 'Corsair test line', price: '1.00' },
				],
			},
		});
		ids.invoice = idOf(invoice);
		cleanup('invoice', (c) =>
			c.moneybird.api.salesInvoices.delete({ id: need('invoice') }),
		);
		const read = (await api().salesInvoices.get({ id: need('invoice') })) as {
			state?: string;
		};
		expect(read.state).toBe('draft');
		const pdf = (await api().salesInvoices.downloadPdf({
			id: need('invoice'),
		})) as { contentType?: string; byteLength?: number };
		expect(pdf.contentType).toBe('application/pdf');
		expect(pdf.byteLength).toBeGreaterThan(100);
	});
});
