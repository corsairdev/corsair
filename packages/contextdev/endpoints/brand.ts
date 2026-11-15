import type { ContextDevContext, ContextDevEndpoints } from '..';
import { call } from './call';
import type { Brand } from './types';

async function saveBrand(ctx: ContextDevContext, brand: Brand) {
	if (!ctx.db.brands || !brand.domain) return;
	try {
		await ctx.db.brands.upsertByEntityId(brand.domain, {
			domain: brand.domain,
			title: brand.title,
			description: brand.description,
			logoUrl: brand.logos?.find((logo) => logo.type === 'logo')?.url,
			primaryColor: brand.colors?.[0]?.hex,
			industry: brand.industries?.eic?.[0]?.industry,
			employeeRange: brand.employees?.range,
			country: brand.address?.country_code,
			fetchedAt: new Date(),
		});
	} catch (error) {
		console.warn('Failed to save Context.dev brand to database:', error);
	}
}

export const retrieve: ContextDevEndpoints['brandRetrieve'] = async (
	ctx,
	input,
) => {
	const result = await call(
		ctx,
		'brandRetrieve',
		'brand.retrieve',
		'POST',
		'brand/retrieve',
		input,
	);
	await saveBrand(ctx, result.brand);
	return result;
};

export const search: ContextDevEndpoints['brandSearch'] = (ctx, input) =>
	call(ctx, 'brandSearch', 'brand.search', 'GET', 'brand/search', input);

export const styleguide: ContextDevEndpoints['brandStyleguide'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'brandStyleguide',
		'brand.styleguide',
		'GET',
		'web/styleguide',
		input,
	);

export const fonts: ContextDevEndpoints['brandFonts'] = (ctx, input) =>
	call(ctx, 'brandFonts', 'brand.fonts', 'GET', 'web/fonts', input);

export const naics: ContextDevEndpoints['brandNaics'] = (ctx, input) =>
	call(ctx, 'brandNaics', 'brand.naics', 'GET', 'web/naics', input);

export const sic: ContextDevEndpoints['brandSic'] = (ctx, input) =>
	call(ctx, 'brandSic', 'brand.sic', 'GET', 'web/sic', input);

export const prefetch: ContextDevEndpoints['brandPrefetch'] = (ctx, input) =>
	call(
		ctx,
		'brandPrefetch',
		'brand.prefetch',
		'POST',
		'utility/prefetch',
		input,
	);
