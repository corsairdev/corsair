import type { CorsairEndpoint } from 'corsair/core';
import { AuthMissingError, logEventFromContext } from 'corsair/core';
import type { NetLicensingPage } from '../client';
import { itemsOf, listedItems, netlicensingGet, optionalFlag } from '../client';
import type { NetLicensingContext } from '../context';
import {
	NetLicensingLicenseEntity,
	NetLicensingProductEntity,
} from '../schema/database';
import type {
	ListInput,
	ListLicensesResponse,
	ListProductsResponse,
} from './types';
import {
	ListInputSchema,
	ListLicensesResponseSchema,
	ListProductsResponseSchema,
} from './types';

async function load(
	ctx: NetLicensingContext,
	path: '/license' | '/product',
	input: ListInput | undefined,
): Promise<{ rows: Record<string, string>[]; page: NetLicensingPage }> {
	if (!ctx.key) {
		throw new AuthMissingError('labs64netlicensing', 'api_key');
	}
	const parsed = ListInputSchema.parse(input ?? {});
	const body = await netlicensingGet<unknown>(ctx.key, path, {
		filter: parsed.filter,
	});
	return {
		rows: listedItems(body, path === '/license' ? 'License' : 'Product'),
		page: itemsOf(body).page,
	};
}

export const listLicenses: CorsairEndpoint<
	NetLicensingContext,
	ListInput,
	ListLicensesResponse
> = async (ctx, input) => {
	const loaded = await load(ctx, '/license', input);
	const rows = loaded.rows.flatMap((item) => {
		const row = NetLicensingLicenseEntity.safeParse({
			number: item.number,
			active: optionalFlag(item.active),
		});
		return row.success ? [row.data] : [];
	});
	if (ctx.db?.licenses) {
		for (const row of rows) {
			try {
				await ctx.db.licenses.upsertByEntityId(row.number, row);
			} catch {
				console.warn('Failed to save NetLicensing license');
			}
		}
	}
	await logEventFromContext(
		ctx,
		'labs64netlicensing.licenses.list',
		{ count: rows.length },
		'completed',
	);
	return ListLicensesResponseSchema.parse({
		licenses: rows,
		page: loaded.page,
	});
};

export const listProducts: CorsairEndpoint<
	NetLicensingContext,
	ListInput,
	ListProductsResponse
> = async (ctx, input) => {
	const loaded = await load(ctx, '/product', input);
	const rows = loaded.rows.flatMap((item) => {
		const row = NetLicensingProductEntity.safeParse({
			number: item.number,
			active: optionalFlag(item.active),
			name: item.name,
			version: item.version,
		});
		return row.success ? [row.data] : [];
	});
	if (ctx.db?.products) {
		for (const row of rows) {
			try {
				await ctx.db.products.upsertByEntityId(row.number, row);
			} catch {
				console.warn('Failed to save NetLicensing product');
			}
		}
	}
	await logEventFromContext(
		ctx,
		'labs64netlicensing.products.list',
		{ count: rows.length },
		'completed',
	);
	return ListProductsResponseSchema.parse({
		products: rows,
		page: loaded.page,
	});
};
