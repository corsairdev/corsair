import {
	moneybirdEndpointMeta,
	moneybirdEndpointSchemas,
} from './endpoints/catalog';
import {
	MoneybirdManifestSchema,
	moneybirdDefinitions,
	moneybirdManifest,
	moneybirdOperations,
} from './endpoints/manifest';
import {
	getMoneybirdInputSchema,
	getMoneybirdOutputSchema,
} from './endpoints/openapi-schema';
import { MONEYBIRD_OPERATION_IDS } from './endpoints/operation-types';

const ids = moneybirdOperations.map((operation) => operation.id);

function operation(id: string) {
	const found = moneybirdOperations.find((o) => o.id === id);
	if (!found) throw new Error(`no operation ${id}`);
	return found;
}

// The first version's 27 operations keep their names.
const FIRST_VERSION = [
	'administrations.list',
	...['contacts', 'timeEntries', 'products', 'projects'].flatMap((group) =>
		['list', 'get', 'create', 'update', 'delete'].map(
			(verb) => `${group}.${verb}`,
		),
	),
	...['list', 'get', 'create', 'update', 'send', 'delete'].map(
		(verb) => `salesInvoices.${verb}`,
	),
];

describe('moneybird-manifest.json', () => {
	it('matches the manifest schema', () => {
		expect(
			MoneybirdManifestSchema.safeParse(moneybirdManifest).error?.issues ?? [],
		).toEqual([]);
	});

	it('has 298 operations, one per id and route', () => {
		expect(ids).toHaveLength(298);
		expect(new Set(ids).size).toBe(298);
		expect([...MONEYBIRD_OPERATION_IDS].sort()).toEqual([...ids].sort());
		const routes = new Set(
			moneybirdOperations.map((o) => `${o.method} ${o.path}`),
		);
		expect(routes.size).toBe(298);
	});

	it('keeps the first version operation names', () => {
		expect(FIRST_VERSION.filter((id) => !ids.includes(id))).toEqual([]);
	});

	it('keeps the first version operations (27)', () => {
		expect(FIRST_VERSION).toHaveLength(27);
	});

	it('leaves out the routes Moneybird marks deprecated', () => {
		const routes = moneybirdOperations.map((o) => `${o.method} ${o.path}`);
		expect(
			routes.filter((route) =>
				/register_payment\.json$|\/delete\.json$/.test(route),
			),
		).toEqual([]);
	});

	it('resolves every schema reference', () => {
		const missing = new Set<string>();
		// `unknown` because the walk covers raw JSON Schema documents.
		const visit = (value: unknown) => {
			if (Array.isArray(value)) return value.forEach(visit);
			if (typeof value !== 'object' || value === null) return;
			for (const [key, inner] of Object.entries(value)) {
				if (
					key === '$ref' &&
					typeof inner === 'string' &&
					!(inner in moneybirdDefinitions)
				) {
					missing.add(inner);
				}
				visit(inner);
			}
		};
		visit(moneybirdManifest);
		expect([...missing]).toEqual([]);
	});

	it('maps routes to the right kinds', () => {
		expect(operation('contacts.list').path).toBe(
			'/{administration_id}/contacts.json',
		);
		expect(operation('contacts.list').paginated).toBe(true);
		expect(operation('administrations.list').global).toBe(true);
		expect(operation('administrations.list').path).toBe(
			'/administrations.json',
		);
		expect(operation('salesInvoices.downloadPdf').response).toBe('file');
		expect(operation('salesInvoices.downloadPdf').path).toBe(
			'/{administration_id}/sales_invoices/{id}/download_pdf',
		);
		expect(operation('salesInvoices.downloadUbl').response).toBe('file');
		expect(operation('salesInvoices.attachments.create').request).toBe(
			'multipart',
		);
		expect(operation('contacts.archive').response).toBe('empty');
		expect(operation('documents.receipts.delete').emptyOk).toBe(true);
		expect(operation('salesInvoices.send').method).toBe('PATCH');
	});

	it('takes no events.list cursor (it only comes in a Link header)', () => {
		expect(operation('events.list').input.properties).not.toHaveProperty(
			'cursor',
		);
	});
});

describe('schemas', () => {
	it('builds every input and output schema', () => {
		const failed: string[] = [];
		for (const id of ids) {
			try {
				getMoneybirdInputSchema(id);
				getMoneybirdOutputSchema(id);
				// The catalog's getters build the same schemas.
				const entry =
					moneybirdEndpointSchemas[id as keyof typeof moneybirdEndpointSchemas];
				if (!entry.input || !entry.output) failed.push(id);
			} catch {
				failed.push(id);
			}
		}
		expect(failed).toEqual([]);
	});

	it('requires path ids and refuses unknown keys on body-less routes', () => {
		const get = getMoneybirdInputSchema('projects.get');
		expect(get.safeParse({}).success).toBe(false);
		expect(get.safeParse({ id: 1 }).success).toBe(true);
		expect(get.safeParse({ id: '458026356994737217' }).success).toBe(true);
		expect(get.safeParse({ id: 'abc' }).success).toBe(false);
		expect(get.safeParse({ id: 1, nope: true }).success).toBe(false);
		expect(
			getMoneybirdInputSchema('contacts.notes.create').safeParse({}).success,
		).toBe(false);
		// The administration id is optional on every call (it has fallbacks).
		expect(getMoneybirdInputSchema('taxRates.list').safeParse({}).success).toBe(
			true,
		);
	});

	it('asks for one of the filters Moneybird needs (400 without, found live)', () => {
		// Live: "entity_type, entity_id are missing, at least one parameter must
		// be provided" and "at least a contact_id, project_id or
		// ledger_account_id is required"; the spec marks none of them required.
		const events = getMoneybirdInputSchema('events.list');
		expect(events.safeParse({}).success).toBe(false);
		expect(events.safeParse({ per_page: 10 }).success).toBe(false);
		expect(events.safeParse({ entity_type: 'Contact' }).success).toBe(true);
		expect(events.safeParse({ entity_id: '458026356994737217' }).success).toBe(
			true,
		);
		const journal = getMoneybirdInputSchema('reports.journalEntries');
		expect(journal.safeParse({ period: 'this_year' }).success).toBe(false);
		for (const field of ['contact_id', 'project_id', 'ledger_account_id']) {
			expect(journal.safeParse({ [field]: '458026356994737217' }).success).toBe(
				true,
			);
		}
		const refused = journal.safeParse({});
		expect(refused.success).toBe(false);
		expect(refused.error?.issues[0]?.message).toContain('ledger_account_id');
	});

	it('builds referenced objects in place so Studio can render them', () => {
		// `unknown` because zod's internals are walked to find the field schemas.
		type Def = {
			type: string;
			innerType?: { def: Def };
			shape?: Record<string, { def: Def }>;
		};
		const unwrap = (def: Def): Def =>
			def.type === 'optional' && def.innerType
				? unwrap(def.innerType.def)
				: def;
		const input = getMoneybirdInputSchema(
			'salesInvoices.create',
		) as unknown as {
			def: Def;
		};
		const wrapper = unwrap(input.def.shape?.sales_invoice?.def as Def);
		expect(wrapper.type).toBe('object');
		const fields = Object.values(wrapper.shape ?? {}).map((field) =>
			unwrap(field.def),
		);
		expect(fields.length).toBeGreaterThan(10);
		expect(fields.filter((field) => field.type === 'lazy')).toEqual([]);
	});

	it('wraps paginated lists as items and next_page', () => {
		const out = getMoneybirdOutputSchema('contacts.list');
		expect(
			out.safeParse({ items: [{ id: '1' }], next_page: null }).success,
		).toBe(true);
		expect(out.safeParse([{ id: '1' }]).success).toBe(false);
	});

	it('parses responses leniently: nulls and unknown fields pass', () => {
		const out = getMoneybirdOutputSchema('projects.get');
		const parsed = out.safeParse({
			id: '1',
			name: null,
			state: null,
			brand_new_field: 'x',
		});
		expect(parsed.success).toBe(true);
		expect((parsed.data as Record<string, unknown>).brand_new_field).toBe('x');
	});

	it('accepts a bodiless success where the spec documents one', () => {
		expect(
			getMoneybirdOutputSchema('contacts.delete').safeParse({ success: true })
				.success,
		).toBe(true);
	});
});

describe('risk levels (R8)', () => {
	it('marks every read GET as read and every DELETE as destructive', () => {
		for (const o of moneybirdOperations) {
			const risk =
				moneybirdEndpointMeta[o.id as keyof typeof moneybirdEndpointMeta]
					.riskLevel;
			if (o.method === 'GET') expect([o.id, risk]).toEqual([o.id, 'read']);
			if (o.method === 'DELETE')
				expect([o.id, risk]).toEqual([o.id, 'destructive']);
		}
	});

	it('marks sends and money destructive', () => {
		for (const id of [
			'salesInvoices.send',
			'salesInvoices.sendReminders',
			'estimates.send',
			'contacts.paymentsMandate.request',
			'subscriptions.create',
			'subscriptions.createAndScheduleOneOffSalesInvoice',
			'recurringSalesInvoices.create',
			'purchaseTransactionBatches.createFromSepaFile',
			'contacts.additionalCharges.create',
			'subscriptions.additionalCharges.create',
		]) {
			expect([
				id,
				moneybirdEndpointMeta[id as keyof typeof moneybirdEndpointMeta]
					.riskLevel,
			]).toEqual([id, 'destructive']);
		}
	});

	it('keeps reads sent as POST read and ordinary writes write', () => {
		for (const id of [
			'contacts.fetchByIds',
			'salesInvoices.fetchByIds',
			'downloads.download',
			'purchaseTransactionBatches.download',
		]) {
			expect([
				id,
				moneybirdEndpointMeta[id as keyof typeof moneybirdEndpointMeta]
					.riskLevel,
			]).toEqual([id, 'read']);
		}
		for (const id of [
			'contacts.create',
			'salesInvoices.create',
			'salesInvoices.payments.create',
			'contacts.archive',
			'webhooks.create',
		]) {
			expect([
				id,
				moneybirdEndpointMeta[id as keyof typeof moneybirdEndpointMeta]
					.riskLevel,
			]).toEqual([id, 'write']);
		}
	});

	it('gives every operation a description', () => {
		const empty = ids.filter(
			(id) =>
				!moneybirdEndpointMeta[id as keyof typeof moneybirdEndpointMeta]
					.description,
		);
		expect(empty).toEqual([]);
	});
});
