import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { logoDevRequest } from '../client';
import type { LogoDevContext } from '../context';
import { LogoDevBrandEntity } from '../schema/database';
import { requireKey } from './shared';
import type { BrandResponse, GetBrandInput, LookupBrandInput } from './types';
import {
	BrandResponseSchema,
	GetBrandInputSchema,
	identifierQuery,
	LookupBrandInputSchema,
} from './types';

export const lookupBrand: CorsairEndpoint<
	LogoDevContext,
	LookupBrandInput,
	BrandResponse
> = async (ctx, input) => {
	const key = requireKey(ctx);
	const parsed = LookupBrandInputSchema.parse(input);
	// `unknown` until BrandResponseSchema parses it: untrusted provider JSON.
	const body = await logoDevRequest<unknown>(key, {
		path: '/v2/brands',
		query: {
			...identifierQuery(parsed),
			nosubscribe: parsed.noSubscribe ? 'true' : undefined,
		},
	});
	const result = BrandResponseSchema.parse(body);
	await storeBrand(ctx, result);
	await logEventFromContext(ctx, 'logodev.brands.lookup', {}, 'completed');
	return result;
};

export const getBrand: CorsairEndpoint<
	LogoDevContext,
	GetBrandInput,
	BrandResponse
> = async (ctx, input) => {
	const key = requireKey(ctx);
	const parsed = GetBrandInputSchema.parse(input);
	// `unknown` until BrandResponseSchema parses it: untrusted provider JSON.
	const body = await logoDevRequest<unknown>(key, {
		path: `/v2/brands/${encodeURIComponent(parsed.id)}`,
		query: { nosubscribe: parsed.noSubscribe ? 'true' : undefined },
	});
	const result = BrandResponseSchema.parse(body);
	await storeBrand(ctx, result);
	await logEventFromContext(ctx, 'logodev.brands.get', {}, 'completed');
	return result;
};

/** Saves a ready brand under its domain. A 202 (still indexing) has no name yet and is skipped. */
async function storeBrand(
	ctx: LogoDevContext,
	result: BrandResponse,
): Promise<void> {
	if (!ctx.db?.brands) return;
	const row = LogoDevBrandEntity.safeParse({
		domain: result.data.domain,
		name: result.data.name,
		object: result.data.object,
		brandId: result.data.id,
	});
	if (!row.success) return;
	try {
		await ctx.db.brands.upsertByEntityId(row.data.domain, row.data);
	} catch {
		console.warn('Failed to save Logo.dev brand');
	}
}
