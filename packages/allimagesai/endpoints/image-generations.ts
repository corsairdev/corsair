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
 * `GET /v1/image-generations` — list generation batches ("prints") created for
 * bulk use.
 *
 * Paginated with `limit` / `offset`; `filteredResults` reports the total
 * matching count.
 * https://api.all-images.ai/doc-json
 */
export const list: AllimagesaiEndpoints['imageGenerationsList'] = async (
	ctx,
	input,
) => {
	const query = AllimagesaiEndpointInputSchemas.imageGenerationsList.parse(
		input ?? {},
	);

	const response = await makeAllimagesaiRequest<
		AllimagesaiEndpointOutputs['imageGenerationsList']
	>('image-generations', ctx.key, {
		method: 'GET',
		query: {
			limit: query.limit,
			offset: query.offset,
			sort: query.sort,
			name: query.name,
			tag: query.tag,
		},
		schema: AllimagesaiEndpointOutputSchemas.imageGenerationsList,
	});

	if (response?.prints?.length && ctx.db.imageGenerations) {
		for (const print of response.prints) {
			// Without an id there is no stable key, so skip rather than invent one.
			if (!print.id) continue;

			await safely(`image generation ${print.id}`, () =>
				ctx.db.imageGenerations.upsertByEntityId(print.id as string, {
					id: print.id as string,
					name: print.name,
					prompt: print.prompt,
					status: print.status,
					process_mode: print.processMode ?? null,
					nb_images: print.nbImages ?? null,
					tags: print.tags,
					image_urls: print.images
						?.map((image) => image.url ?? '')
						.filter(Boolean),
					// `params` is a name/value list; flatten it to a lookup map so the
					// stored row is queryable by parameter name.
					params: Object.fromEntries(
						print.params.map((param) => [param.name, param.value]),
					),
					created_at: toDate(print.createdAt),
				}),
			);
		}
	}

	await logEventFromContext(
		ctx,
		'allimagesai.imageGenerations.list',
		{ ...query },
		'completed',
	);

	return response;
};

/**
 * `DELETE /v1/image-generations` — delete generation batches by print id.
 *
 * The ids travel in a JSON body, not the query string. The provider answers
 * 200 with an empty body for unknown ids and for an empty array alike, so it
 * reports nothing about what was actually removed; the input schema requires at
 * least one id so an empty request cannot masquerade as success.
 * https://api.all-images.ai/doc-json
 */
export const remove: AllimagesaiEndpoints['imageGenerationsDelete'] = async (
	ctx,
	input,
) => {
	const { printIds } =
		AllimagesaiEndpointInputSchemas.imageGenerationsDelete.parse(input);

	await makeAllimagesaiRequest<void>('image-generations', ctx.key, {
		method: 'DELETE',
		body: { printIds },
		expectEmptyBody: true,
	});

	if (ctx.db.imageGenerations) {
		for (const printId of printIds) {
			await safely(`image generation ${printId}`, () =>
				ctx.db.imageGenerations.deleteByEntityId(printId),
			);
		}
	}

	await logEventFromContext(
		ctx,
		'allimagesai.imageGenerations.delete',
		{ printIds },
		'completed',
	);

	// The provider returns no body, so echo back what was requested rather than
	// handing the caller an empty object.
	return { deleted: true, printIds };
};
