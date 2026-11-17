import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { logoDevRequest } from '../client';
import type { LogoDevContext } from '../context';
import { LogoDevImageEntity } from '../schema/database';
import { requireKey } from './shared';
import type { FetchLogoInput, ImageResponse } from './types';
import {
	FetchLogoInputSchema,
	ImageResponseSchema,
	identifierQuery,
} from './types';

async function getImage(
	ctx: LogoDevContext,
	input: FetchLogoInput,
	kind: 'logo' | 'brandmark',
): Promise<ImageResponse> {
	const key = requireKey(ctx);
	const parsed = FetchLogoInputSchema.parse(input);
	// `unknown` until ImageResponseSchema parses it: untrusted provider JSON.
	const body = await logoDevRequest<unknown>(key, {
		path: `/v2/brands/${kind}`,
		query: identifierQuery(parsed),
	});
	const result = ImageResponseSchema.parse(body);
	if (kind === 'logo') {
		await storeImage(ctx, parsed.domain, result);
	}
	return result;
}

/** Get a brand's logo: a temporary download URL, its size, format and blurhash. */
export const fetchLogo: CorsairEndpoint<
	LogoDevContext,
	FetchLogoInput,
	ImageResponse
> = async (ctx, input) => {
	const result = await getImage(ctx, input, 'logo');
	await logEventFromContext(ctx, 'logodev.logos.fetch', {}, 'completed');
	return result;
};

/** Get a brand's brandmark (the symbol without the wordmark). */
export const getBrandmark: CorsairEndpoint<
	LogoDevContext,
	FetchLogoInput,
	ImageResponse
> = async (ctx, input) => {
	const result = await getImage(ctx, input, 'brandmark');
	await logEventFromContext(ctx, 'logodev.logos.getBrandmark', {}, 'completed');
	return result;
};

/** Saves a ready logo's metadata under the domain it was looked up by. The temporary URL is not kept. */
async function storeImage(
	ctx: LogoDevContext,
	domain: string | undefined,
	result: ImageResponse,
): Promise<void> {
	if (!domain || !ctx.db?.images) return;
	const row = LogoDevImageEntity.safeParse({
		domain,
		brandId: result.data.brand_id,
		format: result.data.source?.format,
		width: result.data.source?.width,
		height: result.data.source?.height,
		etag: result.data.etag,
	});
	if (!row.success || !row.data.brandId) return;
	try {
		await ctx.db.images.upsertByEntityId(row.data.domain, row.data);
	} catch {
		console.warn('Failed to save Logo.dev image');
	}
}
