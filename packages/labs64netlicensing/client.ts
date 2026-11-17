import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const NETLICENSING_API_BASE = 'https://go.netlicensing.io/core/v2/rest';

/** A form or query value; arrays repeat the field (e.g. `discount`). */
export type FormValue = string | number | boolean | string[] | undefined;

function configFor(apiKey: string): OpenAPIConfig {
	return {
		BASE: NETLICENSING_API_BASE,
		VERSION: '2',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			Authorization: `Basic ${Buffer.from(`apiKey:${apiKey}`, 'utf8').toString('base64')}`,
		},
	};
}

export async function netlicensingGet<T>(
	apiKey: string,
	url: string,
	query?: Record<string, string | undefined>,
): Promise<T> {
	const requestOptions: ApiRequestOptions = { method: 'GET', url, query };
	try {
		return await request<T>(configFor(apiKey), requestOptions);
	} catch (error) {
		explain(error);
		throw error;
	}
}

const ENTITY_PATH =
	/\/(product|productmodule|licensetemplate|licensee|license|transaction)\/[^/?#]+/g;

/** Replaces entity numbers in a path and drops the query string. */
export function withoutIds(url: string): string {
	return (url.split('?')[0] ?? url).replace(ENTITY_PATH, '/$1/[id]');
}

/**
 * Core's message for a NetLicensing error is only the HTTP status text; the
 * reason is in `infos.info[].value` (e.g. "Requested product does not
 * exist."), so it is appended. A failed write also keeps its form body, which
 * can hold licensee names and custom properties: it is dropped. The ApiError
 * itself, its status and retry data stay.
 */
function explain(error: unknown): void {
	if (!(error instanceof ApiError)) return;
	if (error.request) {
		(error.request as { body?: unknown }).body = undefined;
		const req = error.request as { url?: unknown; query?: unknown };
		if (typeof req.url === 'string') req.url = withoutIds(req.url);
		req.query = undefined;
	}
	// The id in the path can be a licensee alias such as an email address.
	(error as { url: string }).url = withoutIds(error.url);
	// unknown: the error body is provider JSON, checked field by field.
	const infos = (error.body as { infos?: { info?: unknown } } | undefined)
		?.infos?.info;
	const reasons = asList(infos)
		.map((info) => (info as { value?: unknown } | null)?.value)
		.filter((value): value is string => typeof value === 'string');
	if (reasons.length && !error.message.includes(reasons[0] ?? '')) {
		error.message = `${error.message}: ${reasons.join(' ')}`;
	}
}

/** Encodes form fields; `undefined` is left out, arrays repeat the name. */
export function toForm(fields: Record<string, FormValue>): string {
	const form = new URLSearchParams();
	for (const [name, value] of Object.entries(fields)) {
		if (value === undefined) continue;
		if (Array.isArray(value)) {
			for (const entry of value) form.append(name, entry);
		} else {
			form.append(name, String(value));
		}
	}
	return form.toString();
}

/**
 * Writes: NetLicensing takes `application/x-www-form-urlencoded` bodies on
 * POST, and `forceCascade` as a query value on DELETE. Deletes answer 204
 * with no body. https://netlicensing.io/wiki/restful-api
 */
export async function netlicensingSend<T>(
	apiKey: string,
	method: 'POST' | 'DELETE',
	url: string,
	options: {
		form?: Record<string, FormValue>;
		query?: Record<string, string | undefined>;
	} = {},
): Promise<T> {
	const requestOptions: ApiRequestOptions = {
		method,
		url,
		query: options.query,
		...(options.form
			? {
					body: toForm(options.form),
					mediaType: 'application/x-www-form-urlencoded',
				}
			: {}),
	};
	try {
		return await request<T>(configFor(apiKey), requestOptions);
	} catch (error) {
		explain(error);
		throw error;
	}
}

// unknown: NetLicensing sends one node or an array of them.
function asList(value: unknown): unknown[] {
	if (value == null) return [];
	return Array.isArray(value) ? value : [value];
}

// unknown: an `item` node from the response, checked field by field.
function propertyMap(item: unknown): Record<string, string> {
	if (!item || typeof item !== 'object') return {};
	const record = item as Record<string, unknown>;
	const out: Record<string, string> = {};
	for (const prop of asList(record.property)) {
		if (!prop || typeof prop !== 'object') continue;
		const name = (prop as { name?: unknown }).name;
		const value = (prop as { value?: unknown }).value;
		if (typeof name !== 'string' || value == null) continue;
		out[name] = String(value);
	}
	for (const key of ['number', 'active', 'name', 'version']) {
		if (out[key] !== undefined) continue;
		const flat = record[key];
		if (
			typeof flat === 'string' ||
			typeof flat === 'boolean' ||
			typeof flat === 'number'
		) {
			out[key] = String(flat);
		}
	}
	return out;
}

/** A NetLicensing `list` inside an item, such as a product's discounts. */
export type NetLicensingList = {
	name?: string;
	properties: Record<string, string>;
	lists?: NetLicensingList[];
};

/**
 * An entity as NetLicensing returns it: every `property` as a string, with
 * the common ones (number, active, name) lifted out, and nested `list`s.
 */
export type NetLicensingItem = {
	type?: string;
	number?: string;
	active?: boolean;
	name?: string;
	properties: Record<string, string>;
	lists?: NetLicensingList[];
};

// unknown: a `list` node from the response, checked field by field.
function toList(node: unknown): NetLicensingList {
	const record = (node ?? {}) as Record<string, unknown>;
	const lists = asList(record.list).map(toList);
	return {
		...(typeof record.name === 'string' ? { name: record.name } : {}),
		properties: propertiesOf(node),
		...(lists.length ? { lists } : {}),
	};
}

// unknown: an `item` node from the response, checked field by field.
function propertiesOf(node: unknown): Record<string, string> {
	const out: Record<string, string> = {};
	if (!node || typeof node !== 'object') return out;
	for (const prop of asList((node as Record<string, unknown>).property)) {
		if (!prop || typeof prop !== 'object') continue;
		const name = (prop as { name?: unknown }).name;
		const value = (prop as { value?: unknown }).value;
		if (typeof name !== 'string' || value == null) continue;
		out[name] = String(value);
	}
	return out;
}

// unknown: an `item` node from the response, checked field by field.
export function toItem(node: unknown): NetLicensingItem {
	if (!node || typeof node !== 'object' || Array.isArray(node)) {
		throw new Error('NetLicensing returned an unexpected response');
	}
	const record = node as Record<string, unknown>;
	const properties = propertiesOf(node);
	const lists = asList(record.list).map(toList);
	return {
		...(typeof record.type === 'string' ? { type: record.type } : {}),
		...(properties.number !== undefined ? { number: properties.number } : {}),
		...(optionalFlag(properties.active) !== undefined
			? { active: optionalFlag(properties.active) }
			: {}),
		...(properties.name !== undefined ? { name: properties.name } : {}),
		properties,
		...(lists.length ? { lists } : {}),
	};
}

/** Paging fields NetLicensing sends next to a list (as strings). */
export type NetLicensingPage = {
	pageNumber?: number;
	totalPages?: number;
	totalItems?: number;
	hasNext?: boolean;
};

// unknown: the response body, checked field by field.
export function itemsOf(body: unknown): {
	items: NetLicensingItem[];
	page: NetLicensingPage;
	ttl?: string;
} {
	// A JSON object with `items` (an object, or null when NetLicensing has
	// nothing to return) is the documented envelope; anything else, such as
	// an HTML error page, is an error rather than an empty result.
	if (!body || typeof body !== 'object' || !('items' in body)) {
		throw new Error('NetLicensing returned an unexpected response');
	}
	const record = body as Record<string, unknown>;
	// `items: null` means nothing to return; any other non-object is malformed.
	if (
		record.items !== null &&
		(typeof record.items !== 'object' || Array.isArray(record.items))
	) {
		throw new Error('NetLicensing returned an unexpected response');
	}
	const items = (record.items ?? {}) as Record<string, unknown>;
	const num = (v: unknown) =>
		v == null || v === '' || Number.isNaN(Number(v)) ? undefined : Number(v);
	const page: NetLicensingPage = {};
	if (num(items.pagenumber) !== undefined)
		page.pageNumber = num(items.pagenumber);
	if (num(items.totalpages) !== undefined)
		page.totalPages = num(items.totalpages);
	if (num(items.totalitems) !== undefined)
		page.totalItems = num(items.totalitems);
	const hasNext = optionalFlag(
		items.hasnext == null ? undefined : String(items.hasnext),
	);
	if (hasNext !== undefined) page.hasNext = hasNext;
	return {
		items: asList(items.item).map(toItem),
		page,
		...(typeof record.ttl === 'string' ? { ttl: record.ttl } : {}),
	};
}

// unknown: the response body, checked field by field.
export function listedItems(
	// unknown: the response body, checked by itemsOf.
	body: unknown,
	type: string,
): Record<string, string>[] {
	// `filter=exportSettings=true` and `exportAssets=true` add other entity
	// types to a list, so only items of the asked-for type are kept.
	return itemsOf(body)
		.items.filter((item) => item.type === undefined || item.type === type)
		.map((item) => item.properties);
}

export function optionalFlag(value: string | undefined): boolean | undefined {
	if (value === 'true') return true;
	if (value === 'false') return false;
	return undefined;
}
