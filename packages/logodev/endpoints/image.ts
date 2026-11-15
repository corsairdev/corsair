import type { CorsairEndpoint } from 'corsair/core';
import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { fetchLogoContentType, LOGODEV_IMAGE_BASE } from '../client';
import type { LogoDevContext } from '../context';
import type { FetchLogoInput, FetchLogoResponse } from './types';
import { FetchLogoInputSchema, FetchLogoResponseSchema } from './types';

export const fetchLogo: CorsairEndpoint<
	LogoDevContext,
	FetchLogoInput,
	FetchLogoResponse
> = async (ctx, input) => {
	if (!ctx.key) {
		throw new AuthMissingError('logodev', 'api_key');
	}
	const parsed = FetchLogoInputSchema.parse(input);
	const contentType = await fetchLogoContentType(ctx.key, parsed.domain);
	const result = FetchLogoResponseSchema.parse({
		url: `${LOGODEV_IMAGE_BASE}/${parsed.domain}`,
		contentType,
		status: 200,
	});
	await logEventFromContext(ctx, 'logodev.logos.fetch', {}, 'completed');
	return result;
};
