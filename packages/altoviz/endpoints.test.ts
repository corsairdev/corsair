/**
 * Registry invariants: risk levels agree with the endpoint tree, the
 * non-idempotent set is exactly the non-read operations (nothing more,
 * nothing less), the UNREGISTER_WEBHOOK guard rejects a call with neither id
 * nor url, and the audit-payload allow-list cannot admit anything that looks
 * like personal or financial content.
 */

import { ALLOWED_FIELDS, auditPayload } from './endpoints/logging';
import { AltovizEndpointInputSchemas } from './endpoints/types';
import { isNonIdempotent, NON_IDEMPOTENT_OPERATIONS } from './error-handlers';
import { altovizEndpointMeta, altovizEndpointsNested } from './index';

function registeredPaths(): string[] {
	const paths: string[] = [];
	for (const [group, ops] of Object.entries(altovizEndpointsNested)) {
		for (const op of Object.keys(ops as Record<string, unknown>)) {
			paths.push(`${group}.${op}`);
		}
	}
	return paths;
}

describe('registry invariants', () => {
	test('every registered operation has metadata', () => {
		const paths = registeredPaths();
		expect(paths.length).toBe(67);
		for (const path of paths) {
			// toHaveProperty splits on '.' by default; these keys ARE dotted literals.
			expect(altovizEndpointMeta).toHaveProperty([path]);
		}
	});

	test('risk levels are only read, write or destructive, matching totals: 41 read, 15 write, 11 destructive', () => {
		const counts = { read: 0, write: 0, destructive: 0 };
		for (const meta of Object.values(altovizEndpointMeta)) {
			expect(['read', 'write', 'destructive']).toContain(meta.riskLevel);
			counts[meta.riskLevel as keyof typeof counts]++;
		}
		expect(counts).toEqual({ read: 41, write: 15, destructive: 11 });
	});

	test('every destructive operation is marked irreversible', () => {
		const entries = Object.entries(altovizEndpointMeta) as Array<
			[string, { riskLevel: string; irreversible?: boolean }]
		>;
		const destructive = entries.filter(
			([, m]) => m.riskLevel === 'destructive',
		);
		expect(destructive.length).toBe(11);
		for (const [, meta] of destructive) {
			expect(meta.irreversible).toBe(true);
		}
	});
});

describe('the non-idempotent set is exactly the non-read operations', () => {
	test('coverage sweep: the set is non-empty and matches the registry size class', () => {
		expect(NON_IDEMPOTENT_OPERATIONS.size).toBe(26);
	});

	test('every non-idempotent path is registered and is not a read', () => {
		const meta = altovizEndpointMeta as Record<string, { riskLevel: string }>;
		for (const path of NON_IDEMPOTENT_OPERATIONS) {
			expect(meta).toHaveProperty([path]);
			expect(meta[path]?.riskLevel).not.toBe('read');
		}
	});

	test('every non-read operation is in the non-idempotent set - nothing slips through silently', () => {
		const nonRead = Object.entries(altovizEndpointMeta)
			.filter(([, m]) => m.riskLevel !== 'read')
			.map(([path]) => path);
		expect(nonRead.length).toBe(26);
		expect([...nonRead].sort()).toEqual([...NON_IDEMPOTENT_OPERATIONS].sort());
	});

	test('isNonIdempotent agrees with the set', () => {
		expect(isNonIdempotent('customers.create')).toBe(true);
		expect(isNonIdempotent('customers.get')).toBe(false);
		expect(isNonIdempotent('not.a.real.operation')).toBe(false);
	});
});

describe('the UNREGISTER_WEBHOOK guard', () => {
	const schema = AltovizEndpointInputSchemas.webhookSubscriptionsUnregister;

	test('rejects a call with neither id nor url', () => {
		expect(schema.safeParse({}).success).toBe(false);
	});

	test('accepts a call with only webhookId', () => {
		expect(schema.safeParse({ webhookId: 1 }).success).toBe(true);
	});

	test('accepts a call with only url', () => {
		expect(schema.safeParse({ url: 'https://example.com/wh' }).success).toBe(
			true,
		);
	});

	test('rejects a call with both id and url', () => {
		expect(
			schema.safeParse({ webhookId: 1, url: 'https://example.com/wh' }).success,
		).toBe(false);
	});
});

describe('documented input constraints', () => {
	const listSchema = AltovizEndpointInputSchemas.customersList;
	const createInvoiceSchema = AltovizEndpointInputSchemas.saleInvoicesCreate;

	test('accepts page sizes from 1 through 100 only', () => {
		expect(listSchema.safeParse({ pageSize: 1 }).success).toBe(true);
		expect(listSchema.safeParse({ pageSize: 100 }).success).toBe(true);
		expect(listSchema.safeParse({ pageSize: 0 }).success).toBe(false);
		expect(listSchema.safeParse({ pageSize: 101 }).success).toBe(false);
	});

	test('requires YYYY-MM-DD calendar dates before making a request', () => {
		const base = { customerId: 1, lines: [{ description: 'Service' }] };
		expect(
			createInvoiceSchema.safeParse({ ...base, date: '2026-08-15' }).success,
		).toBe(true);
		expect(
			createInvoiceSchema.safeParse({ ...base, date: '15/08/2026' }).success,
		).toBe(false);
	});

	test('products.find rejects an empty call the API would 400', () => {
		const schema = AltovizEndpointInputSchemas.productsFind;
		expect(schema.safeParse({}).success).toBe(false);
		expect(schema.safeParse({ number: 'ABC' }).success).toBe(true);
	});
});

describe('audit payload: deny-by-default allow-list', () => {
	test('the allow-list admits no field name that looks like personal or financial content', () => {
		const forbidden = [
			'email',
			'phone',
			'address',
			'name',
			'note',
			'description',
			'subject',
			'amount',
			'price',
			'quantity',
			'iban',
			'siret',
			'secret',
			'signature',
		];
		const hits: string[] = [];
		for (const field of ALLOWED_FIELDS) {
			const lower = field.toLowerCase();
			for (const stem of forbidden) {
				if (lower.includes(stem)) hits.push(`${field}~${stem}`);
			}
		}
		expect(hits).toEqual([]);
	});

	test('an allowed field is recorded by value', () => {
		const payload = auditPayload({ customerId: 42, companyName: 'Acme Corp' });
		expect(payload.customerId).toBe(42);
	});

	test('a not-allowed field is recorded by name only, never by value', () => {
		const payload = auditPayload({
			customerId: 42,
			companyName: 'Acme Corp',
			email: 'a@example.com',
		});
		expect(payload).not.toHaveProperty('companyName');
		expect(payload).not.toHaveProperty('email');
		expect(payload.fields).toEqual(
			expect.arrayContaining(['companyName', 'email', 'customerId']),
		);
	});

	test('free-text search query is recorded by name only, never by value', () => {
		const payload = auditPayload({ pageIndex: 1, query: 'jane@example.com' });
		expect(payload).not.toHaveProperty('query');
		expect(payload.pageIndex).toBe(1);
		expect(payload.fields).toEqual(expect.arrayContaining(['query']));
	});

	test('orderBy is recorded by name only, never by value', () => {
		const payload = auditPayload({
			pageIndex: 1,
			orderBy: 'email,iban,siret',
		});
		expect(payload).not.toHaveProperty('orderBy');
		expect(payload.pageIndex).toBe(1);
		expect(payload.fields).toEqual(expect.arrayContaining(['orderBy']));
	});

	test('caller-chosen identifiers are recorded by name only, never by value', () => {
		const payload = auditPayload({
			customerId: 42,
			internalId: 'ssn-shaped',
			number: 'FR-iban-lookalike',
		});
		expect(payload.customerId).toBe(42);
		expect(payload).not.toHaveProperty('internalId');
		expect(payload).not.toHaveProperty('number');
		expect(payload.fields).toEqual(
			expect.arrayContaining(['internalId', 'number']),
		);
	});

	test('undefined fields are not recorded at all, not even by name', () => {
		const payload = auditPayload({ customerId: 42, email: undefined });
		expect(payload.fields).not.toContain('email');
	});

	test('extra fields passed by the endpoint author bypass the allow-list (they are not raw caller input)', () => {
		const payload = auditPayload({}, { linesCount: 3 });
		expect(payload.linesCount).toBe(3);
	});
});
