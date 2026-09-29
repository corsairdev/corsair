import { logEventFromContext } from 'corsair/core';
import { makeAuthenticatedZohoInventoryRequest } from '../client';
import type { ZohoInventoryContext } from '../index';

export type RouteSpec = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	path: string;
	/** Path placeholders without the leading colon. */
	params?: readonly string[];
	query?: readonly string[];
	org?: boolean;
	binary?: boolean;
	form?: 'invoice_attachment';
};

const SENSITIVE_EVENT_FIELDS = new Set([
	'content_base64',
	'to_mail_ids',
	'cc_mail_ids',
	'body',
	'subject',
]);

function eventFields(input: Record<string, unknown>): Record<string, unknown> {
	const fields: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(input)) {
		if (!SENSITIVE_EVENT_FIELDS.has(key)) fields[key] = value;
	}
	return fields;
}

const PATH_OR_CONTROL = new Set([
	'organization_id',
	'filename',
	'content_base64',
	'content_type',
]);

function pick(
	input: Record<string, unknown>,
	keys: readonly string[] | undefined,
): Record<string, string | number | boolean | undefined> {
	const query: Record<string, string | number | boolean | undefined> = {};
	for (const key of keys ?? []) {
		const value = input[key];
		if (value === undefined) continue;
		query[key] = Array.isArray(value) ? value.join(',') : (value as never);
	}
	return query;
}

function openApiPath(template: string): string {
	let out = '';
	for (let i = 0; i < template.length; i++) {
		const ch = template[i];
		if (ch !== ':') {
			out += ch;
			continue;
		}
		let end = i + 1;
		while (end < template.length) {
			const c = template.charCodeAt(end);
			const isName = (c >= 97 && c <= 122) || c === 95 || (c >= 48 && c <= 57);
			if (!isName) break;
			end += 1;
		}
		out += `{${template.slice(i + 1, end)}}`;
		i = end - 1;
	}
	return out;
}

function pathParams(
	input: Record<string, unknown>,
	keys: readonly string[] | undefined,
): Record<string, string> | undefined {
	if (!keys?.length) return undefined;
	const path: Record<string, string> = {};
	for (const key of keys) {
		const value = input[key];
		if (value === undefined || value === null || value === '') {
			throw new Error(`[zohoinventory] missing path parameter ${key}`);
		}
		path[key] = String(value);
	}
	return path;
}

function jsonBody(
	input: Record<string, unknown>,
	spec: RouteSpec,
): Record<string, unknown> | undefined {
	if (spec.method === 'GET' || spec.method === 'DELETE' || spec.form) {
		return undefined;
	}
	const reserved = new Set([
		...PATH_OR_CONTROL,
		...(spec.params ?? []),
		...(spec.query ?? []),
	]);
	const body: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(input)) {
		if (!reserved.has(key) && value !== undefined) body[key] = value;
	}
	return Object.keys(body).length > 0 ? body : undefined;
}

async function persistLists(
	ctx: ZohoInventoryContext,
	res: Record<string, unknown>,
): Promise<void> {
	const pairs: Array<[string, string, string]> = [
		['organizations', 'organizations', 'organization_id'],
		['items', 'items', 'item_id'],
		['contacts', 'contacts', 'contact_id'],
		['salesOrders', 'salesorders', 'salesorder_id'],
		['invoices', 'invoices', 'invoice_id'],
		['creditNotes', 'creditnotes', 'creditnote_id'],
	];
	for (const [table, field, idField] of pairs) {
		const rows = res[field];
		const store = (
			ctx.db as
				| Record<
						string,
						{ upsertByEntityId?: (id: string, row: object) => Promise<unknown> }
				  >
				| undefined
		)?.[table];
		if (!Array.isArray(rows) || !store?.upsertByEntityId) continue;
		for (const row of rows) {
			if (!row || typeof row !== 'object') continue;
			const id = String((row as Record<string, unknown>)[idField] ?? '');
			if (!id) continue;
			await store.upsertByEntityId(id, { ...row, id });
		}
	}
}

export async function runZohoInventory(
	ctx: ZohoInventoryContext,
	event: string,
	input: Record<string, unknown>,
	spec: RouteSpec,
): Promise<Record<string, unknown>> {
	const query = {
		...(spec.org === false
			? {}
			: { organization_id: input.organization_id as string }),
		...pick(input, spec.query),
	};

	let formData: Record<string, string | Blob> | undefined;
	if (spec.form === 'invoice_attachment') {
		const bytes = Buffer.from(String(input.content_base64 ?? ''), 'base64');
		const type = String(input.content_type ?? 'application/octet-stream');
		const filename = String(input.filename ?? 'attachment');
		formData = {
			attachment: new File([bytes], filename, { type }),
		};
	}

	const res = await makeAuthenticatedZohoInventoryRequest<
		Record<string, unknown>
	>(openApiPath(spec.path), ctx, {
		method: spec.method,
		region: ctx.options.region,
		apiDomain: ctx.options.apiDomain,
		query,
		path: pathParams(input, spec.params),
		body: jsonBody(input, spec),
		formData,
		binary: spec.binary,
	});

	await persistLists(ctx, res);
	await logEventFromContext(ctx, event, eventFields(input), 'completed');
	return {
		code: (res.code as number | undefined) ?? 0,
		message: (res.message as string | undefined) ?? 'success',
		...res,
	};
}
