import { AuthMissingError, logEventFromContext } from 'corsair/core';
import {
	makeImejisioRenderRequest,
	makeImejisioRequest,
	tryGetStoredKey,
} from '../client';
import type { ImejisioEndpoints } from '../index';
import {
	ListDesignsInputSchema,
	PaginatedDesignsSchema,
	RenderDesignInputSchema,
	RenderDesignResponseSchema,
} from './types';

/**
 * Lists the authenticated user's design templates from Imejis.io.
 *
 * Calls GET https://api.imejis.io/designs/v2 with Bearer token authentication.
 *
 * @param ctx - Corsair plugin context with resolved apiKey.
 * @param rawInput - Pagination options including page and limit.
 * @returns Paginated list of design template summaries.
 */
export const list: ImejisioEndpoints['listDesigns'] = async (ctx, rawInput) => {
	const input = ListDesignsInputSchema.parse(rawInput ?? {});

	const query: Record<string, string | number | boolean | undefined> = {};
	if (input.page !== undefined) {
		query.$page = input.page;
	}
	if (input.limit !== undefined) {
		query.$limit = input.limit;
	}

	const rawResponse = await makeImejisioRequest<unknown>(
		'/designs/v2',
		ctx.key,
		{
			method: 'GET',
			query,
		},
	);

	const response = PaginatedDesignsSchema.parse(rawResponse);

	await logEventFromContext(
		ctx,
		'imejisio.designs.list',
		{ ...input },
		'completed',
	);

	return response;
};

/**
 * Renders an Imejis template design into image/PDF bytes or a hosted URL.
 *
 * Calls POST https://render.imejis.io/v1/{design_id} with dma-api-key authentication.
 * Normalizes binary responses into a structured base64 representation.
 *
 * @param ctx - Corsair plugin context with options and keys manager.
 * @param rawInput - Render input options including designId, format, quality, delivery, and dynamic overrides.
 * @returns The rendered design response (stream base64 payload, hosted URL, or signed URL).
 */
export const render: ImejisioEndpoints['renderDesign'] = async (
	ctx,
	rawInput,
) => {
	const input = RenderDesignInputSchema.parse(rawInput);

	const renderKey =
		ctx.options?.renderKey ??
		(await tryGetStoredKey(() => ctx.keys?.get_render_key?.()));

	if (!renderKey) {
		throw new AuthMissingError('imejisio', 'api_key');
	}

	const rawNormalized = await makeImejisioRenderRequest<unknown>(
		input.designId,
		renderKey,
		{
			format: input.format,
			quality: input.quality,
			delivery: input.delivery,
			expiresIn: input.expiresIn,
			overrides: input.overrides,
		},
	);

	const response = RenderDesignResponseSchema.parse(rawNormalized);

	await logEventFromContext(
		ctx,
		'imejisio.designs.render',
		{
			designId: input.designId,
			format: input.format,
			delivery: input.delivery,
		},
		'completed',
	);

	return response;
};
