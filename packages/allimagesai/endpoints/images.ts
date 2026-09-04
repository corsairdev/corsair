import { logEventFromContext } from 'corsair/core';
import { makeAllimagesaiRequest } from '../client';
import type { AllimagesaiEndpoints } from '../index';
import { safely, toDate } from './persist';
import type { AllimagesaiEndpointOutputs } from './types';
import {
	AllimagesaiEndpointInputSchemas,
	AllimagesaiEndpointOutputSchemas,
} from './types';

/**
 * `POST /v1/images/downladed` — list images already downloaded on this account.
 *
 * The path is misspelled on the provider's side. That is not a typo here: the
 * live API answers 200 for `/v1/images/downladed` and 404 for the correctly
 * spelled `/v1/images/downloaded`, and the published OpenAPI document uses the
 * same misspelling. Correcting it breaks the endpoint.
 *
 * Pagination and the date filters travel in the request body, not the query
 * string. https://developer.all-images.ai/all-images.ai-api/pagination
 */
const DOWNLOADED_IMAGES_PATH = 'images/downladed';

export const listDownloaded: AllimagesaiEndpoints['imagesListDownloaded'] =
	async (ctx, input) => {
		const parsed = AllimagesaiEndpointInputSchemas.imagesListDownloaded.parse(
			input ?? {},
		);

		const body: Record<string, unknown> = {};
		if (parsed.limit !== undefined) body.limit = parsed.limit;
		if (parsed.offset !== undefined) body.offset = parsed.offset;
		if (parsed.sort !== undefined) body.sort = parsed.sort;
		if (parsed.afterCreatedAt !== undefined) {
			body.afterCreatedAt = toIsoString(parsed.afterCreatedAt);
		}
		if (parsed.beforeCreatedAt !== undefined) {
			body.beforeCreatedAt = toIsoString(parsed.beforeCreatedAt);
		}

		const response = await makeAllimagesaiRequest<
			AllimagesaiEndpointOutputs['imagesListDownloaded']
		>(DOWNLOADED_IMAGES_PATH, ctx.key, {
			method: 'POST',
			body,
			schema: AllimagesaiEndpointOutputSchemas.imagesListDownloaded,
		});

		if (response?.images?.length && ctx.db.downloadedImages) {
			for (const image of response.images) {
				await safely(`downloaded image ${image.id}`, () =>
					ctx.db.downloadedImages.upsertByEntityId(image.id, {
						id: image.id,
						url: image.url,
						url_full: image.urlFull ?? null,
						url_upscale: image.urlUpscale ?? null,
						url_upscale_uhd: image.urlUpscaleUHD ?? null,
						downloaded_at: toDate(image.downloadedAt),
					}),
				);
			}
		}

		await logEventFromContext(
			ctx,
			'allimagesai.images.listDownloaded',
			{ ...body },
			'completed',
		);

		return response;
	};

/** Accepts either a Date or an already-formatted string, per the input schema. */
function toIsoString(value: string | Date): string {
	return value instanceof Date ? value.toISOString() : value;
}
