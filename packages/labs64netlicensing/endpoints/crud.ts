import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { FormValue, NetLicensingItem } from '../client';
import { itemsOf, netlicensingGet, netlicensingSend } from '../client';
import type { NetLicensingContext } from '../context';
import {
	NetLicensingLicenseEntity,
	NetLicensingProductEntity,
} from '../schema/database';
import type {
	DeletedOutput,
	ItemOutput,
	ItemsOutput,
	ListInput,
} from './types';
import { ItemOutputSchema, ItemsOutputSchema, ListInputSchema } from './types';

/** The REST collections this plugin covers. */
type Resource =
	| 'product'
	| 'productmodule'
	| 'licensetemplate'
	| 'licensee'
	| 'license'
	| 'transaction';

// The two entities the plugin stores locally (licenses.list/products.list).
async function store(
	ctx: NetLicensingContext,
	resource: Resource,
	item: NetLicensingItem,
): Promise<void> {
	if (!item.number) return;
	try {
		if (resource === 'product' && ctx.db?.products) {
			const row = NetLicensingProductEntity.safeParse({
				number: item.number,
				active: item.active,
				name: item.name,
				version: item.properties.version,
			});
			if (row.success)
				await ctx.db.products.upsertByEntityId(item.number, row.data);
		}
		if (resource === 'license' && ctx.db?.licenses) {
			const row = NetLicensingLicenseEntity.safeParse({
				number: item.number,
				active: item.active,
			});
			if (row.success)
				await ctx.db.licenses.upsertByEntityId(item.number, row.data);
		}
	} catch {
		console.warn(`Failed to save NetLicensing ${resource}`);
	}
}

async function unstore(
	ctx: NetLicensingContext,
	resource: Resource,
	number: string,
): Promise<void> {
	try {
		if (resource === 'product')
			await ctx.db?.products?.deleteByEntityId(number);
		if (resource === 'license')
			await ctx.db?.licenses?.deleteByEntityId(number);
	} catch {
		console.warn(`Failed to remove NetLicensing ${resource}`);
	}
}

/**
 * Builds the form for a create or update: the typed fields, then any custom
 * properties (typed fields win on a name clash). Path and query keys are left
 * out.
 */
export function formFrom(
	// unknown: a parsed create/update input; each value is a form value.
	parsed: Record<string, unknown>,
	skip: readonly string[] = [],
): Record<string, FormValue> {
	const form: Record<string, FormValue> = {};
	const custom = parsed.customProperties as Record<string, string> | undefined;
	for (const [key, value] of Object.entries(custom ?? {})) form[key] = value;
	for (const [key, value] of Object.entries(parsed)) {
		if (key === 'customProperties' || skip.includes(key)) continue;
		form[key] = value as FormValue;
	}
	return form;
}

// unknown: the response body; itemsOf checks the envelope.
function first(body: unknown, what: string): NetLicensingItem {
	const item = itemsOf(body).items[0];
	if (!item) throw new Error(`NetLicensing returned no ${what}`);
	return ItemOutputSchema.parse({ item }).item;
}

export function listOf(
	resource: Resource,
	event: string,
): CorsairEndpoint<NetLicensingContext, ListInput, ItemsOutput> {
	return async (ctx, input) => {
		const parsed = ListInputSchema.parse(input ?? {});
		const body = await netlicensingGet<unknown>(ctx.key, `/${resource}`, {
			filter: parsed.filter,
		});
		const result = ItemsOutputSchema.parse(itemsOf(body));
		await logEventFromContext(
			ctx,
			event,
			{ count: result.items.length },
			'completed',
		);
		return result;
	};
}

export function getOf<S extends z.ZodType<Record<string, string>>>(
	resource: Resource,
	event: string,
	schema: S,
	idKey: string,
): CorsairEndpoint<NetLicensingContext, z.input<S>, ItemOutput> {
	return async (ctx, input) => {
		const parsed = schema.parse(input) as Record<string, string>;
		const id = parsed[idKey] ?? '';
		const body = await netlicensingGet<unknown>(
			ctx.key,
			`/${resource}/${encodeURIComponent(id)}`,
		);
		const item = first(body, resource);
		await store(ctx, resource, item);
		await logEventFromContext(ctx, event, { number: id }, 'completed');
		return { item };
	};
}

/** Create (no idKey) or update (idKey names the path parameter). */
export function saveOf<S extends z.ZodType>(
	resource: Resource,
	event: string,
	schema: S,
	idKey?: string,
): CorsairEndpoint<NetLicensingContext, z.input<S>, ItemOutput> {
	return async (ctx, input) => {
		// unknown: each schema's own parsed fields.
		const parsed = schema.parse(input) as Record<string, unknown>;
		const id = idKey ? String(parsed[idKey]) : undefined;
		const path = id ? `/${resource}/${encodeURIComponent(id)}` : `/${resource}`;
		const body = await netlicensingSend<unknown>(ctx.key, 'POST', path, {
			form: formFrom(parsed, idKey ? [idKey] : []),
		});
		const item = first(body, resource);
		// A rename changes the number: drop the old local row first.
		if (id && item.number && item.number !== id)
			await unstore(ctx, resource, id);
		await store(ctx, resource, item);
		await logEventFromContext(
			ctx,
			event,
			{ number: item.number ?? id },
			'completed',
		);
		return { item };
	};
}

export function deleteOf<
	S extends z.ZodType<Record<string, string | boolean | undefined>>,
>(
	resource: Resource,
	event: string,
	schema: S,
	idKey: string,
): CorsairEndpoint<NetLicensingContext, z.input<S>, DeletedOutput> {
	return async (ctx, input) => {
		const parsed = schema.parse(input) as Record<
			string,
			string | boolean | undefined
		>;
		const id = String(parsed[idKey]);
		await netlicensingSend<unknown>(
			ctx.key,
			'DELETE',
			`/${resource}/${encodeURIComponent(id)}`,
			{
				query: {
					forceCascade: parsed.forceCascade === true ? 'true' : undefined,
				},
			},
		);
		// Reached only when NetLicensing confirmed the delete (an error throws).
		await unstore(ctx, resource, id);
		await logEventFromContext(ctx, event, { number: id }, 'completed');
		return { deleted: true, number: id };
	};
}
