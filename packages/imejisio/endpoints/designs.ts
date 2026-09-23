import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { makeImejisioRenderRequest } from '../client';
import type { ImejisioEndpoints } from '../index';
import { RenderDesignInputSchema, RenderDesignResponseSchema } from './types';

/**
 * Renders an Imejis template design into image/PDF bytes or a stored URL.
 *
 * API: POST https://render.imejis.io/v1/{design_id}
 * Docs: https://www.imejis.io/apis
 * OpenAPI: `renderDesignPost`
 *
 * @param ctx - Corsair plugin context carrying the resolved render API key.
 * @param rawInput - Render input including designId, format, quality, delivery, and dynamic overrides.
 * @returns The rendered design response (stream base64 payload, hosted URL, or signed URL).
 */
export const render: ImejisioEndpoints['renderDesign'] = async (
	ctx,
	rawInput,
) => {
	if (!ctx.key) {
		throw new AuthMissingError('imejisio', 'api_key');
	}

	const input = RenderDesignInputSchema.parse(rawInput);

	const rawResponse = await makeImejisioRenderRequest(input.designId, ctx.key, {
		format: input.format,
		quality: input.quality,
		delivery: input.delivery,
		expiresIn: input.expiresIn,
		overrides: input.overrides,
	});

	const response = RenderDesignResponseSchema.parse(rawResponse);

	// stream renders are never stored by Imejis, so there is nothing to mirror.
	if (response.delivery !== 'stream' && ctx.db?.renders) {
		try {
			await ctx.db.renders.upsertByEntityId(response.url, {
				designId: input.designId,
				delivery: response.delivery,
				url: response.url,
				format: response.format ?? null,
				expiresAt:
					response.delivery === 'signed' ? (response.expiresAt ?? null) : null,
				file: response.file ?? null,
				renderedAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save Imejis render to database:', error);
		}
	}

	// The overrides carry caller data and the render key is a credential, so
	// neither is logged — only the non-sensitive render parameters.
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
