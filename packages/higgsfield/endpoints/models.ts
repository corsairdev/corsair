import { logEventFromContext } from 'corsair/core';
import {
	HiggsfieldAPIError,
	HiggsfieldError,
	makeHiggsfieldRequest,
	normalizeModelPath,
} from '../client';
import type { HiggsfieldEndpoints } from '../index';
import type { ModelsListInput, ModelsListResponse } from './types';
import {
	HiggsfieldEndpointInputSchemas,
	HiggsfieldEndpointOutputSchemas,
} from './types';

/**
 * GET /models answers on the API but isn't in Higgsfield's docs, which send
 * people to the Console and the per-model pages. It's the one source that is
 * never out of date, and it carries each model's input fields, so the plugin
 * reads it rather than shipping a catalog that goes stale. Being undocumented,
 * it could change: the failure says where to look instead, and the schema only
 * insists on `slug`.
 */
async function readModels(
	apiKey: string,
	input: ModelsListInput,
): Promise<ModelsListResponse> {
	const routeGone = () =>
		new HiggsfieldError(
			'The Higgsfield model list (an API route the docs do not cover) could not be read. Model paths and input fields are on https://docs.higgsfield.ai/docs/models.',
			'bad_response',
		);
	// unknown: checked by the schema just below.
	let raw: unknown;
	try {
		raw = await makeHiggsfieldRequest(apiKey, '/models', {
			query: {
				search: input.search,
				output_type: input.outputType,
				operation_type: input.operationType,
				include_schema: input.includeSchema ? 'true' : undefined,
			},
		});
	} catch (error) {
		if (
			error instanceof HiggsfieldAPIError &&
			(error.status === 404 || error.status === 405 || error.status === 410)
		) {
			throw routeGone();
		}
		throw error;
	}
	const parsed = HiggsfieldEndpointOutputSchemas.modelsList.safeParse(raw);
	if (!parsed.success) throw routeGone();
	return parsed.data;
}

export const list: HiggsfieldEndpoints['modelsList'] = async (
	ctx,
	rawInput,
) => {
	const input = HiggsfieldEndpointInputSchemas.modelsList.parse(rawInput);
	const response = await readModels(ctx.key, input);
	await logEventFromContext(
		ctx,
		'higgsfield.models.list',
		{ search: input.search, count: response.items.length },
		'completed',
	);
	return response;
};

export const get: HiggsfieldEndpoints['modelsGet'] = async (ctx, rawInput) => {
	const input = HiggsfieldEndpointInputSchemas.modelsGet.parse(rawInput);
	const slug = normalizeModelPath(input.modelPath);
	// The route has no single-model form, and its `search` is free text, so the
	// exact path is picked out of the whole list.
	const { items } = await readModels(ctx.key, { includeSchema: true });
	const model = items.find((item) => item.slug === slug);
	if (!model) {
		throw new HiggsfieldError(
			`"${slug}" is not in the Higgsfield model list for this account. Find paths with models.list; a model documented on https://docs.higgsfield.ai/docs/models can still answer even when it isn't listed.`,
			'not_found',
		);
	}
	await logEventFromContext(
		ctx,
		'higgsfield.models.get',
		{ modelPath: slug },
		'completed',
	);
	return HiggsfieldEndpointOutputSchemas.modelsGet.parse(model);
};
