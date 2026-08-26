import { AuthMissingError, logEventFromContext } from 'corsair/core';
import {
	BRANDFETCH_CDN_BASE,
	makeBrandfetchRequest,
	resolveClientId,
	tryGetStoredKey,
} from '../client';
import type { BrandfetchContext, BrandfetchEndpoints } from '../index';
import type { GetBrandInfoInput, GetCdnLogoInput } from './types';
import { BrandfetchEndpointOutputSchemas, identifierPath } from './types';

export async function requireApiKey(ctx: BrandfetchContext): Promise<string> {
	const apiKey = ctx.key?.trim();
	if (apiKey) return apiKey;
	throw new AuthMissingError('brandfetch', 'api_key');
}
}

export async function requireClientId(
	ctx: BrandfetchContext,
	inputClientId?: string,
): Promise<string> {
	return resolveClientId({
		inputClientId,
		optionClientId: ctx.options?.clientId,
		storedClientId: await tryGetStoredKey(() => ctx.keys?.get_client_id()),
	});
}

export function brandApiPath(input: GetBrandInfoInput): string {
	return `/v2/brands/${identifierPath(input.identifier, input.identifierType)}`;
}

export function buildCdnLogoUrl(
	input: GetCdnLogoInput,
	clientId: string,
): string {
	const segments = [identifierPath(input.identifier, input.identifierType)];
	if (input.w !== undefined) segments.push(`w/${input.w}`);
	if (input.h !== undefined) segments.push(`h/${input.h}`);
	if (input.theme) segments.push(`theme/${input.theme}`);
	if (input.fallback) segments.push(`fallback/${input.fallback}`);
	if (input.logoType) segments.push(`type/${input.logoType}`);
	return `${BRANDFETCH_CDN_BASE}/${segments.join('/')}?c=${encodeURIComponent(clientId)}`;
}

export async function fetchBrand(
	ctx: BrandfetchContext,
	input: GetBrandInfoInput,
) {
	const apiKey = await requireApiKey(ctx);
	const raw = await makeBrandfetchRequest<unknown>(
		brandApiPath(input),
		apiKey,
		{
			method: 'GET',
			query: { allowNsfw: input.allowNsfw },
		},
	);
	return BrandfetchEndpointOutputSchemas.getBrandInfo.parse(raw);
}

export const getBrandInfo: BrandfetchEndpoints['getBrandInfo'] = async (
	ctx,
	input,
) => {
	const response = await fetchBrand(ctx, input);
	if (ctx.db.brands) {
		try {
			await ctx.db.brands.upsertByEntityId(response.id, {
				id: response.id,
				name: response.name,
				domain: response.domain,
				claimed: response.claimed,
				description: response.description,
				longDescription: response.longDescription,
				qualityScore: response.qualityScore,
				isNsfw: response.isNsfw,
				urn: response.urn,
				checkedAt: new Date(),
			});
		} catch {
			// Cache write is best-effort.
		}
	}
	await logEventFromContext(
		ctx,
		'brandfetch.brands.get',
		{ identifier: input.identifier, identifierType: input.identifierType },
		'completed',
	);
	return response;
};

export const getCompanyInfo: BrandfetchEndpoints['getCompanyInfo'] = async (
	ctx,
	input,
) => {
	const brand = await fetchBrand(ctx, input);
	if (brand.company && ctx.db.companies) {
		try {
			await ctx.db.companies.upsertByEntityId(brand.id, {
				brandId: brand.id,
				employees: brand.company.employees ?? null,
				foundedYear: brand.company.foundedYear ?? null,
				kind: brand.company.kind ?? null,
				city: brand.company.location?.city ?? null,
				country: brand.company.location?.country ?? null,
				countryCode: brand.company.location?.countryCode ?? null,
				region: brand.company.location?.region ?? null,
				state: brand.company.location?.state ?? null,
				subregion: brand.company.location?.subregion ?? null,
				checkedAt: new Date(),
			});
		} catch {
			// Cache write is best-effort.
		}
	}
	await logEventFromContext(
		ctx,
		'brandfetch.brands.getCompany',
		{ identifier: input.identifier, identifierType: input.identifierType },
		'completed',
	);
	return brand.company;
};

export const searchBrands: BrandfetchEndpoints['searchBrands'] = async (
	ctx,
	input,
) => {
	const clientId = await requireClientId(ctx, input.clientId);
	const raw = await makeBrandfetchRequest<unknown>(
		`/v2/search/${encodeURIComponent(input.name)}`,
		'',
		{
			method: 'GET',
			query: { c: clientId },
			bearer: false,
		},
	);
	const response = BrandfetchEndpointOutputSchemas.searchBrands.parse(raw);
	await logEventFromContext(
		ctx,
		'brandfetch.brands.search',
		{ name: input.name },
		'completed',
	);
	return response;
};

export const getCdnLogo: BrandfetchEndpoints['getCdnLogo'] = async (
	ctx,
	input,
) => {
	const clientId = await requireClientId(ctx, input.clientId);
	const url = buildCdnLogoUrl(input, clientId);
	await logEventFromContext(
		ctx,
		'brandfetch.logos.get',
		{ identifier: input.identifier, identifierType: input.identifierType },
		'completed',
	);
	return { url };
};

export const getTransactionInfo: BrandfetchEndpoints['getTransactionInfo'] =
	async (ctx, input) => {
		const apiKey = await requireApiKey(ctx);
		const raw = await makeBrandfetchRequest<unknown>(
			'/v2/brands/transaction',
			apiKey,
			{
				method: 'POST',
				body: {
					transactionLabel: input.transactionLabel,
					countryCode: input.countryCode,
				},
			},
		);
		const response =
			BrandfetchEndpointOutputSchemas.getTransactionInfo.parse(raw);
		await logEventFromContext(
			ctx,
			'brandfetch.transactions.get',
			{ countryCode: input.countryCode },
			'completed',
		);
		return response;
	};
