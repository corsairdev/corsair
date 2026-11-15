import type { CorsairEndpoint } from 'corsair/core';
import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { searchLogoDev } from '../client';
import type { LogoDevContext } from '../context';
import { LogoDevBrandEntity } from '../schema/database';
import type { SearchBrandsInput, SearchBrandsResponse } from './types';
import { SearchBrandsInputSchema, SearchBrandsResponseSchema } from './types';

export function logoUrlWithoutToken(
	url: string | undefined,
): string | undefined {
	if (!url) return undefined;
	try {
		const parsed = new URL(url);
		parsed.searchParams.delete('token');
		const query = parsed.searchParams.toString();
		return query
			? `${parsed.origin}${parsed.pathname}?${query}`
			: `${parsed.origin}${parsed.pathname}`;
	} catch {
		return undefined;
	}
}

export const searchBrands: CorsairEndpoint<
	LogoDevContext,
	SearchBrandsInput,
	SearchBrandsResponse
> = async (ctx, input) => {
	if (!ctx.key) {
		throw new AuthMissingError('logodev', 'api_key');
	}
	const parsed = SearchBrandsInputSchema.parse(input);
	const body = await searchLogoDev<unknown>(ctx.key, parsed);
	const result = SearchBrandsResponseSchema.parse(body);
	const data = result.data.map((item) => ({
		...item,
		logo_url: logoUrlWithoutToken(item.logo_url),
	}));
	await storeBrands(ctx, data);
	await logEventFromContext(
		ctx,
		'logodev.brands.search',
		{ limit: parsed.limit ?? 10 },
		'completed',
	);
	return { ...result, data };
};

async function storeBrands(
	ctx: LogoDevContext,
	brands: SearchBrandsResponse['data'],
): Promise<void> {
	if (!ctx.db?.brands) return;
	for (const item of brands) {
		const row = LogoDevBrandEntity.safeParse({
			domain: item.domain,
			name: item.name,
			object: item.object,
			logoUrl: item.logo_url,
		});
		if (!row.success) continue;
		try {
			await ctx.db.brands.upsertByEntityId(row.data.domain, row.data);
		} catch {
			console.warn('Failed to save Logo.dev brand');
		}
	}
}
