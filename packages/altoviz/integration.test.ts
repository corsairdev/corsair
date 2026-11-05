/**
 * Live Altoviz API checks.
 *
 * Skipped unless ALTOVIZ_API_KEY is set. Loads gitignored `.env.local` from
 * the repo root when present.
 *
 * Reads reference tables and catalog records, validates them against the
 * official-key persist schemas, then creates a disposable customer (with an
 * explicit number so numbering-sequence init is not required) and deletes it.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { AltovizAPIError, makeAltovizRequest } from './client';
import { AltovizEndpointOutputSchemas } from './endpoints/types';
import {
	AltovizClassificationEntity,
	AltovizCustomerEntity,
	AltovizUnitEntity,
	AltovizVatEntity,
} from './schema/database';

function loadEnvLocal() {
	try {
		const text = readFileSync(resolve(__dirname, '../../.env.local'), 'utf8');
		for (const line of text.split('\n')) {
			const match = /^([A-Z0-9_]+)=(.*)$/.exec(line.replace(/\r$/, ''));
			if (!match) continue;
			const key = match[1];
			const value = match[2];
			if (key && value !== undefined && !process.env[key]) {
				process.env[key] = value;
			}
		}
	} catch {
		// no local env file
	}
}

loadEnvLocal();

const apiKey = process.env.ALTOVIZ_API_KEY;
const describeLive = apiKey ? describe : describe.skip;

function issues(error: {
	issues: readonly { path?: PropertyKey[]; code?: string; message?: string }[];
}): string[] {
	return error.issues.map((issue) => {
		const where = (issue.path ?? []).join('.') || '(root)';
		return `${where}: ${issue.code ?? 'invalid'} - ${issue.message ?? ''}`;
	});
}

describeLive('Altoviz live', () => {
	const key = apiKey as string;
	let customerId: number | undefined;
	const probeNumber = `CRSR-${Date.now().toString(36).toUpperCase()}`;

	afterAll(async () => {
		if (!customerId) return;
		try {
			await makeAltovizRequest('v1/customers/{id}', key, {
				method: 'DELETE',
				path: { id: customerId },
			});
		} catch (error) {
			if (!(error instanceof AltovizAPIError && error.status === 404)) {
				throw error;
			}
		}
	});

	test('TEST_API_KEY: GET /hello returns account identity', async () => {
		const raw = await makeAltovizRequest('hello', key);
		const parsed =
			AltovizEndpointOutputSchemas.accountTestApiKey.safeParse(raw);
		if (!parsed.success) console.error(issues(parsed.error));
		expect(parsed.success).toBe(true);
		expect(parsed.data?.serverTimestamp).toBeTruthy();
	});

	test('GET_UNITS: official Unit keys persist', async () => {
		const raw = await makeAltovizRequest('v1/units', key);
		const parsed = AltovizEndpointOutputSchemas.accountGetUnits.safeParse(raw);
		if (!parsed.success) console.error(issues(parsed.error));
		expect(parsed.success).toBe(true);
		expect(Array.isArray(parsed.data) && parsed.data.length).toBeGreaterThan(0);
		for (const unit of parsed.data ?? []) {
			const row = AltovizUnitEntity.safeParse(unit);
			if (!row.success) console.error(issues(row.error));
			expect(row.success).toBe(true);
		}
	});

	test('GET_VATS: official Vat keys persist', async () => {
		const raw = await makeAltovizRequest('v1/vats', key);
		const parsed = AltovizEndpointOutputSchemas.accountGetVats.safeParse(raw);
		if (!parsed.success) console.error(issues(parsed.error));
		expect(parsed.success).toBe(true);
		expect(Array.isArray(parsed.data) && parsed.data.length).toBeGreaterThan(0);
		for (const vat of parsed.data ?? []) {
			const row = AltovizVatEntity.safeParse(vat);
			if (!row.success) console.error(issues(row.error));
			expect(row.success).toBe(true);
		}
	});

	test('GET_CLASSIFICATIONS: official Classification keys persist', async () => {
		const raw = await makeAltovizRequest('v1/classifications', key);
		const parsed =
			AltovizEndpointOutputSchemas.accountGetClassifications.safeParse(raw);
		if (!parsed.success) console.error(issues(parsed.error));
		expect(parsed.success).toBe(true);
		for (const classification of parsed.data ?? []) {
			const row = AltovizClassificationEntity.safeParse(classification);
			if (!row.success) console.error(issues(row.error));
			expect(row.success).toBe(true);
		}
	});

	test('LIST_CUSTOMERS: PageIndex is 1-based and rows match Customer', async () => {
		const raw = await makeAltovizRequest('v1/customers', key, {
			query: { PageIndex: 1, PageSize: 10 },
		});
		const parsed = AltovizEndpointOutputSchemas.customersList.safeParse(raw);
		if (!parsed.success) console.error(issues(parsed.error));
		expect(parsed.success).toBe(true);
		for (const customer of parsed.data ?? []) {
			const row = AltovizCustomerEntity.safeParse(customer);
			if (!row.success) console.error(issues(row.error));
			expect(row.success).toBe(true);
		}
	});

	test.each([
		['v1/users/me', 'accountGetCurrentUser'],
		['v1/settings', 'accountGetSettings'],
		['v1/productfamilies', 'productFamiliesList'],
		['v1/customerfamilies', 'customerFamiliesList'],
		['v1/contacts', 'contactsList'],
		['v1/suppliers', 'suppliersList'],
		['v1/colleagues', 'colleaguesList'],
		['v1/saleinvoices', 'saleInvoicesList'],
		['v1/salecredits', 'saleCreditsList'],
		['v1/salequotes', 'saleQuotesList'],
		['v1/receipts', 'receiptsList'],
		['v1/webhooks', 'webhookSubscriptionsList'],
	] as const)('GET %s matches the output schema', async (url, schemaKey) => {
		const raw = await makeAltovizRequest(url, key, {
			query:
				url === 'v1/users/me' || url === 'v1/settings' || url === 'v1/webhooks'
					? undefined
					: { PageIndex: 1, PageSize: 5 },
		});
		const parsed = AltovizEndpointOutputSchemas[schemaKey].safeParse(raw);
		if (!parsed.success) console.error(url, issues(parsed.error));
		expect(parsed.success).toBe(true);
	});

	test('CREATE_CUSTOMER / GET_CUSTOMER / DELETE_CUSTOMER', async () => {
		const created = await makeAltovizRequest<{ id: number }>(
			'v1/customers',
			key,
			{
				method: 'POST',
				body: {
					type: 'Business',
					companyName: 'Corsair probe',
					email: `corsair-probe-${probeNumber.toLowerCase()}@example.com`,
					number: probeNumber,
				},
			},
		);
		expect(created.id).toEqual(expect.any(Number));
		customerId = created.id;

		const got = await makeAltovizRequest('v1/customers/{id}', key, {
			path: { id: created.id },
		});
		const parsed = AltovizCustomerEntity.safeParse(got);
		if (!parsed.success) console.error(issues(parsed.error));
		expect(parsed.success).toBe(true);
		expect(parsed.data?.id).toBe(created.id);
		expect(parsed.data?.type).toBe('Business');

		const updated = await makeAltovizRequest<AltovizCustomerEntity>(
			'v1/customers/{id}',
			key,
			{
				method: 'PUT',
				path: { id: created.id },
				body: {
					id: created.id,
					type: 'Business',
					companyName: 'Corsair probe 2',
					email: parsed.data?.email,
					number: probeNumber,
				},
			},
		);
		expect(updated.companyName).toBe('Corsair probe 2');
		expect(updated.number).toBe(probeNumber);

		const contacts = await makeAltovizRequest(
			'v1/customers/{id}/contacts',
			key,
			{ path: { id: created.id } },
		);
		expect(
			AltovizEndpointOutputSchemas.customersGetContacts.safeParse(contacts)
				.success,
		).toBe(true);

		await makeAltovizRequest('v1/customers/{id}', key, {
			method: 'DELETE',
			path: { id: created.id },
		});
		customerId = undefined;
	});
});
