import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { searchLogoDev } from '../client';
import type { LogoDevContext } from '../context';
import { requireKey, saveBrand } from './shared';
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
	const key = requireKey(ctx);
	const parsed = SearchBrandsInputSchema.parse(input);
	// `unknown` until SearchBrandsResponseSchema parses it: untrusted provider JSON.
	const body = await searchLogoDev<unknown>(key, parsed);
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
	for (const item of brands) {
		await saveBrand(ctx, {
			domain: item.domain,
			name: item.name,
			object: item.object,
			logoUrl: item.logo_url,
		});
	}
}
