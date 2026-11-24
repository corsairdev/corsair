import { mocoEndpointMeta, mocoEndpointSchemas } from './endpoints/catalog';
import {
	MocoManifestSchema,
	mocoDefinitions,
	mocoManifest,
	mocoOperations,
} from './endpoints/manifest';
import {
	getMocoInputSchema,
	getMocoOutputSchema,
} from './endpoints/openapi-schema';
import { MOCO_OPERATION_IDS } from './endpoints/operation-types';

const ids = mocoOperations.map((operation) => operation.id);

function operation(id: string) {
	const found = mocoOperations.find((o) => o.id === id);
	if (!found) throw new Error(`no operation ${id}`);
	return found;
}

// The first version's 35 operations keep their names.
const FIRST_VERSION = [
	'session.verify',
	'profile.get',
	'activities.list',
	'activities.get',
	'activities.create',
	'activities.update',
	'activities.delete',
	'projects.list',
	'projects.get',
	'projects.create',
	'projects.update',
	'projects.archive',
	'projects.unarchive',
	'projects.report',
	'companies.list',
	'companies.get',
	'companies.create',
	'companies.update',
	'companies.archive',
	'companies.unarchive',
	'contacts.list',
	'contacts.get',
	'contacts.create',
	'contacts.update',
	'contacts.delete',
	'deals.list',
	'deals.get',
	'deals.create',
	'deals.update',
	'deals.delete',
	'invoices.list',
	'invoices.get',
	'invoices.updateStatus',
	'users.list',
	'users.get',
];

describe('moco-manifest.json', () => {
	it('matches the manifest schema', () => {
		expect(
			MocoManifestSchema.safeParse(mocoManifest).error?.issues ?? [],
		).toEqual([]);
	});

	it('has 290 operations, one per id and route', () => {
		expect(ids).toHaveLength(290);
		expect(new Set(ids).size).toBe(290);
		expect([...MOCO_OPERATION_IDS].sort()).toEqual([...ids].sort());
		const routes = new Set(mocoOperations.map((o) => `${o.method} ${o.path}`));
		expect(routes.size).toBe(290);
	});

	it('keeps the first version operation names', () => {
		expect(FIRST_VERSION.filter((id) => !ids.includes(id))).toEqual([]);
	});

	it('leaves out the password login route', () => {
		expect(
			mocoOperations.filter(
				(o) => o.method === 'POST' && o.path === '/session',
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
					!(inner in mocoDefinitions)
				) {
					missing.add(inner);
				}
				visit(inner);
			}
		};
		visit(mocoManifest);
		expect([...missing]).toEqual([]);
	});

	it('maps routes to the right kinds', () => {
		expect(operation('contacts.list').path).toBe('/contacts/people');
		expect(operation('invoices.getPdf').response).toBe('file');
		expect(operation('purchases.drafts.getPdf').response).toBe('file');
		expect(operation('purchases.storeDocument').request).toBe('multipart');
		expect(operation('invoices.updateStatus').response).toBe('empty');
		expect(operation('projects.list').paginated).toBe(true);
		expect(operation('taggings.add').method).toBe('PATCH');
		expect(operation('taggings.replace').method).toBe('PUT');
	});
});

describe('schemas', () => {
	it('builds every input and output schema', () => {
		const failed: string[] = [];
		for (const id of ids) {
			try {
				getMocoInputSchema(id);
				getMocoOutputSchema(id);
				// The catalog's getters build the same schemas.
				const entry =
					mocoEndpointSchemas[id as keyof typeof mocoEndpointSchemas];
				if (!entry.input || !entry.output) failed.push(id);
			} catch {
				failed.push(id);
			}
		}
		expect(failed).toEqual([]);
	});

	it('requires path ids and refuses unknown keys on body-less routes', () => {
		const get = getMocoInputSchema('projects.get');
		expect(get.safeParse({}).success).toBe(false);
		expect(get.safeParse({ id: 1 }).success).toBe(true);
		expect(get.safeParse({ id: 1, nope: true }).success).toBe(false);
		expect(
			getMocoInputSchema('projects.tasks.list').safeParse({}).success,
		).toBe(false);
	});

	it('builds referenced objects in place so Studio can render them', () => {
		const input = getMocoInputSchema('activities.bulkCreate') as unknown as {
			shape: {
				activities: { unwrap?: () => unknown; def?: { type?: string } };
			};
		};
		// `unknown` because zod's internals are walked to find the item schema.
		const list = input.shape.activities as unknown as {
			def: {
				type: string;
				element?: { def: { type: string } };
				innerType?: unknown;
			};
		};
		const array = (
			list.def.type === 'optional' ? list.def.innerType : list
		) as {
			def: { type: string; element: { def: { type: string } } };
		};
		expect(array.def.type).toBe('array');
		expect(array.def.element.def.type).not.toBe('lazy');
	});

	it('wraps paginated lists as items and next_page', () => {
		const out = getMocoOutputSchema('projects.list');
		expect(out.safeParse({ items: [{ id: 1 }], next_page: null }).success).toBe(
			true,
		);
		expect(out.safeParse([{ id: 1 }]).success).toBe(false);
	});

	// Live run 11-24: an expense booked from a purchase lists its purchase
	// items with net_total as a string (trimmed from the real response).
	it('reads a decimal MOCO sends as a string as a number', () => {
		const out = getMocoOutputSchema('projects.expenses.list');
		const parsed = out.safeParse({
			items: [
				{
					id: 6030210,
					title: 'Test item',
					billed: false,
					purchase_items: [
						{
							id: 6549532,
							title: 'Test item',
							net_total: '9.09',
							currency: 'USD',
							purchase_id: 5141848,
						},
					],
				},
			],
			next_page: null,
		});
		expect(parsed.success).toBe(true);
		const data = parsed.data as {
			items: Array<{ purchase_items: Array<{ net_total: unknown }> }>;
		};
		expect(data.items[0]?.purchase_items[0]?.net_total).toBe(9.09);
		const expense = getMocoOutputSchema('projects.expenses.get');
		expect(expense.safeParse({ quantity: 'lots' }).success).toBe(false);
		const empty = expense.safeParse({ quantity: null, price: undefined });
		expect(empty.success).toBe(true);
		expect((empty.data as { quantity: unknown }).quantity).toBeNull();
	});

	it('parses responses leniently: nulls and unknown fields pass', () => {
		const out = getMocoOutputSchema('projects.get');
		const parsed = out.safeParse({
			id: 1,
			name: null,
			customer: null,
			brand_new_field: 'x',
		});
		expect(parsed.success).toBe(true);
		expect((parsed.data as Record<string, unknown>).brand_new_field).toBe('x');
	});

	it('accepts a bodiless success where the spec documents one', () => {
		expect(
			getMocoOutputSchema('comments.delete').safeParse({ success: true })
				.success,
		).toBe(true);
	});
});

describe('risk levels (R8)', () => {
	it('marks every read GET as read and every DELETE as destructive', () => {
		for (const o of mocoOperations) {
			const risk =
				mocoEndpointMeta[o.id as keyof typeof mocoEndpointMeta].riskLevel;
			if (o.method === 'GET') expect([o.id, risk]).toEqual([o.id, 'read']);
			if (o.method === 'DELETE')
				expect([o.id, risk]).toEqual([o.id, 'destructive']);
		}
	});

	it('marks sends, paid seats and overwrites destructive', () => {
		for (const id of [
			'invoices.sendEmail',
			'offers.sendEmail',
			'invoiceReminders.sendEmail',
			'invoices.bookkeepingExports.create',
			'purchases.bookkeepingExports.create',
			'users.create',
			'taggings.replace',
			'purchases.storeDocument',
		]) {
			expect([
				id,
				mocoEndpointMeta[id as keyof typeof mocoEndpointMeta].riskLevel,
			]).toEqual([id, 'destructive']);
		}
	});

	it('keeps ordinary writes as write', () => {
		for (const id of [
			'activities.create',
			'projects.archive',
			'invoices.updateStatus',
			'taggings.add',
		]) {
			expect(
				mocoEndpointMeta[id as keyof typeof mocoEndpointMeta].riskLevel,
			).toBe('write');
		}
	});

	it('gives every operation a description', () => {
		const empty = ids.filter(
			(id) =>
				!mocoEndpointMeta[id as keyof typeof mocoEndpointMeta].description,
		);
		expect(empty).toEqual([]);
	});
});
