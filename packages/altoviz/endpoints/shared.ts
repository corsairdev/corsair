import { z } from 'zod';
import { makeAltovizRequest } from '../client';
import type {
	AltovizCustomerFamilyEntity,
	AltovizProductFamilyEntity,
	AltovizUnitEntity,
	AltovizVatEntity,
} from '../schema/database';

export const AltovizIdSchema = z.number().int();

/** Altoviz calendar dates use the documented `YYYY-MM-DD` wire format. */
export const AltovizDateSchema = z.iso.date();

/**
 * Every `{id}` path parameter in the Altoviz surface is int32 - confirmed live,
 * a GUID or any other string is a 400 "The value ... is not valid.".
 */
export type AltovizId = z.infer<typeof AltovizIdSchema>;

/** Strips `undefined` values so `compactBody` never sends a documented-default field the caller omitted. */
export function compactBody(
	body: Record<string, unknown>,
): Record<string, unknown> {
	const compacted: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(body)) {
		if (value !== undefined) compacted[key] = value;
	}
	return compacted;
}

/** Same as {@link compactBody}, for query strings. */
export function compactQuery(
	query: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | boolean | undefined> {
	const compacted: Record<string, string | number | boolean | undefined> = {};
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined) compacted[key] = value;
	}
	return compacted;
}

// ─────────────────────────────────────────────────────────────────────────────
// Pagination
// ─────────────────────────────────────────────────────────────────────────────

/**
 * `PageIndex` is 1-based - confirmed on all eleven list endpoints,
 * `PageIndex=0` is a 400 "'Page Index' must be greater than or equal to '1'."
 * Defaulting client-side to 1 is what keeps a caller that never thinks about
 * paging from hitting that error on the very first call.
 */
export const PagingInputSchema = {
	pageIndex: z.number().int().min(1).default(1),
	pageSize: z.number().int().min(1).max(100).optional(),
	/** Accepted by every list endpoint but silently ignored by the API - confirmed live. Exposed because it is documented, not because it works. */
	orderBy: z.string().optional(),
	query: z.string().optional(),
};

export function buildPagingQuery(input: {
	pageIndex?: number;
	pageSize?: number;
	orderBy?: string;
	query?: string;
}): Record<string, string | number | boolean | undefined> {
	return compactQuery({
		PageIndex: input.pageIndex ?? 1,
		PageSize: input.pageSize,
		OrderBy: input.orderBy,
		query: input.query,
	});
}

/**
 * Paging state arrives in response headers, not the body (which is a bare
 * array) - `x-page-index`, `x-page-size`, `x-page-count`, `x-record-count`,
 * plus `x-page-next` / `x-page-prev` when a further page exists. Altoviz's
 * `x-page-next` value capitalises the path segment (`/v1/Customers?...`)
 * differently from the lower-case route the client called, so this parses the
 * query string out of it rather than trusting the path.
 */
export type AltovizPageInfo = {
	pageIndex?: number;
	pageSize?: number;
	pageCount?: number;
	recordCount?: number;
	hasNext: boolean;
	hasPrevious: boolean;
};

export function parsePageInfo(
	headers: Record<string, string> | undefined,
): AltovizPageInfo {
	// Headers may arrive with provider casing (`X-Page-Index`), so fold keys to
	// lower-case once - the field names below are already lower-case.
	const normalized: Record<string, string> = {};
	for (const [name, value] of Object.entries(headers ?? {})) {
		normalized[name.toLowerCase()] = value;
	}
	const get = (name: string) => normalized[name];
	const num = (name: string) => {
		const raw = get(name);
		if (raw === undefined) return undefined;
		const n = Number(raw);
		return Number.isFinite(n) ? n : undefined;
	};
	return {
		pageIndex: num('x-page-index'),
		pageSize: num('x-page-size'),
		pageCount: num('x-page-count'),
		recordCount: num('x-record-count'),
		hasNext: get('x-page-next') !== undefined,
		hasPrevious: get('x-page-prev') !== undefined,
	};
}

// ─────────────────────────────────────────────────────────────────────────────
// Nested-reference resolution: THE central finding of this plugin
// ─────────────────────────────────────────────────────────────────────────────

/**
 * `id` is `readOnly` on the Vat, Unit, CustomerFamily and ProductFamily
 * schemas in Altoviz's own OpenAPI document, and the live behaviour is
 * asymmetric in a way that makes it dangerous rather than merely
 * inconvenient:
 *
 *   vat: { id }      -> 400 "La TVA n'existe pas."          (loud)
 *   family: { id }   -> 200, record comes back family: null (SILENT)
 *
 * Every write in this plugin that takes a unit, VAT or family therefore
 * accepts the id an agent naturally has (from a prior read, or from the
 * mirrored reference stores) and translates it into the value form the
 * provider actually requires - `{code}` for units, `{rate, region}` for VAT,
 * `{label, number}` for families - before the request is built.
 *
 * Resolution order: the local mirror first (cheap, and usually warm because
 * these are reference tables read on the way to almost every write), then a
 * live list call that also refreshes the mirror, and only then a thrown error
 * naming the id - never a silent omission, which is the exact bug this
 * function exists to prevent.
 */

type EntityStore<T> = {
	findByEntityId: (entityId: string) => Promise<{ data: T } | null>;
	upsertByEntityId: (entityId: string, data: T) => Promise<unknown>;
};

/** Request-scoped list memo so parallel line resolves share one GET /units (or /vats). */
export type RefListCache = Map<string, Promise<unknown[]>>;

const FAMILY_PAGE_SIZE = 100;
const FAMILY_MAX_PAGES = 20;

async function fetchAllPages<T>(url: string, key: string): Promise<T[]> {
	const all: T[] = [];
	for (let page = 1; page <= FAMILY_MAX_PAGES; page++) {
		const rows = await makeAltovizRequest<T[]>(url, key, {
			query: { PageIndex: page, PageSize: FAMILY_PAGE_SIZE },
		});
		all.push(...rows);
		if (rows.length < FAMILY_PAGE_SIZE) break;
	}
	return all;
}

async function resolveViaMirrorOrList<T extends { id: number }>(opts: {
	store: EntityStore<T> | undefined;
	id: number;
	fetchList: () => Promise<T[]>;
	kind: string;
	lists?: RefListCache;
	listKey: string;
}): Promise<T> {
	const cached = await opts.store?.findByEntityId(String(opts.id));
	if (cached) return cached.data;

	let pending = opts.lists?.get(opts.listKey) as Promise<T[]> | undefined;
	if (!pending) {
		pending = opts.fetchList();
		opts.lists?.set(opts.listKey, pending as Promise<unknown[]>);
	}
	const list = await pending;

	if (opts.store) {
		for (const row of list) {
			await opts.store.upsertByEntityId(String(row.id), row);
		}
	}

	const match = list.find((row) => row.id === opts.id);
	if (!match) {
		throw new Error(
			`Altoviz ${opts.kind} ${opts.id} was not found in the local mirror or the live list - ` +
				'it may not exist, or the mirror needs the corresponding list endpoint called first.',
		);
	}
	return match;
}

export async function resolveUnitRef(
	store: EntityStore<AltovizUnitEntity> | undefined,
	key: string,
	unitId: number | undefined,
	lists?: RefListCache,
): Promise<{ code: string } | undefined> {
	if (unitId === undefined) return undefined;
	const unit = await resolveViaMirrorOrList({
		store,
		id: unitId,
		kind: 'unit',
		listKey: 'units',
		lists,
		fetchList: () => makeAltovizRequest<AltovizUnitEntity[]>('v1/units', key),
	});
	if (!unit.code) {
		throw new Error(`Altoviz unit ${unitId} has no code to reference it by.`);
	}
	return { code: unit.code };
}

export async function resolveVatRef(
	store: EntityStore<AltovizVatEntity> | undefined,
	key: string,
	vatId: number | undefined,
	lists?: RefListCache,
): Promise<{ rate: number; region: string } | undefined> {
	if (vatId === undefined) return undefined;
	const vat = await resolveViaMirrorOrList({
		store,
		id: vatId,
		kind: 'VAT rate',
		listKey: 'vats',
		lists,
		fetchList: () => makeAltovizRequest<AltovizVatEntity[]>('v1/vats', key),
	});
	if (vat.rate === undefined || vat.rate === null || !vat.region) {
		throw new Error(
			`Altoviz VAT rate ${vatId} has no rate/region to reference it by.`,
		);
	}
	return { rate: vat.rate, region: vat.region };
}

export async function resolveCustomerFamilyRef(
	store: EntityStore<AltovizCustomerFamilyEntity> | undefined,
	key: string,
	familyId: number | undefined,
): Promise<{ label: string; number: string } | undefined> {
	if (familyId === undefined) return undefined;
	const family = await resolveViaMirrorOrList({
		store,
		id: familyId,
		kind: 'customer family',
		listKey: 'customerfamilies',
		fetchList: () =>
			fetchAllPages<AltovizCustomerFamilyEntity>('v1/customerfamilies', key),
	});
	if (!family.label || !family.number) {
		throw new Error(
			`Altoviz customer family ${familyId} has no label/number to reference it by.`,
		);
	}
	return { label: family.label, number: family.number };
}

export async function resolveProductFamilyRef(
	store: EntityStore<AltovizProductFamilyEntity> | undefined,
	key: string,
	familyId: number | undefined,
): Promise<{ label: string; number: string } | undefined> {
	if (familyId === undefined) return undefined;
	const family = await resolveViaMirrorOrList({
		store,
		id: familyId,
		kind: 'product family',
		listKey: 'productfamilies',
		fetchList: () =>
			fetchAllPages<AltovizProductFamilyEntity>('v1/productfamilies', key),
	});
	if (!family.label || !family.number) {
		throw new Error(
			`Altoviz product family ${familyId} has no label/number to reference it by.`,
		);
	}
	return { label: family.label, number: family.number };
}

// ─────────────────────────────────────────────────────────────────────────────
// Read-modify-write support
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Best-effort mapping from the address shape Altoviz RETURNS
 * (`city, countryIso, formattedAddress, inlineAddress, street, zipcode`) back
 * to the shape it ACCEPTS as input (`line1, line2, zipCode, city,
 * countryCode`), so a read-modify-write update can resend an address the
 * caller did not touch without losing it.
 *
 * This is necessarily lossy: every captured response had `street: null`, so
 * there is no observed source for `line1`/`line2` on the way back in. City,
 * postal code and country carry across losslessly; a caller relying on a
 * street line surviving an update they did not ask to change should pass the
 * address explicitly.
 */
export function addressOutputToInput(
	address:
		| {
				city?: string | null;
				zipcode?: string | null;
				countryIso?: string | null;
		  }
		| null
		| undefined,
): Record<string, unknown> | undefined {
	if (!address) return undefined;
	return compactBody({
		city: address.city ?? undefined,
		zipCode: address.zipcode ?? undefined,
		countryCode: address.countryIso ?? undefined,
	});
}

// ─────────────────────────────────────────────────────────────────────────────
// Sale document lines
// ─────────────────────────────────────────────────────────────────────────────

/**
 * `SaleDocumentLine` has no `unitPrice`, `label` or `reference` field. Sending
 * `unitPrice` is not rejected - it is silently IGNORED, and without a
 * `productId` to price from, the line - and the whole document - totals zero
 * with a 200. `taxExcludedPrice` is the field the provider actually reads.
 * This schema exists so `unitPrice` cannot reach the transport at all: it is
 * rejected here, client-side, with a message naming the field the API wants.
 */
export const AltovizLineInputSchema = z
	.object({
		type: z
			.enum(['Empty', 'Product', 'Service', 'Subtotal', 'Text', 'NewPage'])
			.default('Service'),
		productId: AltovizIdSchema.optional(),
		description: z.string().optional(),
		quantity: z.number().optional(),
		/** The only price field Altoviz's line schema accepts. `unitPrice` is a documentation-shaped trap - see the module doc. */
		taxExcludedPrice: z.number().optional(),
		unitId: AltovizIdSchema.optional().describe(
			'Resolved to {code} via the units mirror before the request is sent.',
		),
		vatId: AltovizIdSchema.optional().describe(
			'Resolved to {rate, region} via the VAT mirror before the request is sent.',
		),
		classificationId: AltovizIdSchema.optional(),
	})
	.strict();
export type AltovizLineInput = z.infer<typeof AltovizLineInputSchema>;

export async function buildLine(
	line: AltovizLineInput,
	stores: {
		units?: EntityStore<AltovizUnitEntity>;
		vats?: EntityStore<AltovizVatEntity>;
	},
	key: string,
	lists: RefListCache = new Map(),
): Promise<Record<string, unknown>> {
	return compactBody({
		type: line.type,
		productId: line.productId,
		description: line.description,
		quantity: line.quantity,
		taxExcludedPrice: line.taxExcludedPrice,
		unit: await resolveUnitRef(stores.units, key, line.unitId, lists),
		vat: await resolveVatRef(stores.vats, key, line.vatId, lists),
		classificationId: line.classificationId,
	});
}
