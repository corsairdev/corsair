import type { MistralAiEndpoints } from '../index';
import { callMistralAi } from './shared';
import {
	MistralAiEndpointInputSchemas,
	MistralAiEndpointOutputSchemas,
} from './types';

export const list: MistralAiEndpoints['modelsList'] = async (ctx, rawInput) => {
	const input = MistralAiEndpointInputSchemas.modelsList.parse(rawInput ?? {});
	return callMistralAi(ctx, '/v1/models', {
		query: { provider: input.provider, model: input.model },
		output: MistralAiEndpointOutputSchemas.modelsList,
		event: 'models.list',
	});
};

export const get: MistralAiEndpoints['modelsGet'] = async (ctx, rawInput) => {
	const input = MistralAiEndpointInputSchemas.modelsGet.parse(rawInput);
	return callMistralAi(ctx, '/v1/models/{model_id}', {
		path: { model_id: input.model_id },
		output: MistralAiEndpointOutputSchemas.modelsGet,
		event: 'models.get',
		logged: { model_id: input.model_id },
	});
};

export const remove: MistralAiEndpoints['modelsDelete'] = async (
	ctx,
	rawInput,
) => {
	const input = MistralAiEndpointInputSchemas.modelsDelete.parse(rawInput);
	return callMistralAi(ctx, '/v1/models/{model_id}', {
		method: 'DELETE',
		path: { model_id: input.model_id },
		output: MistralAiEndpointOutputSchemas.modelsDelete,
		event: 'models.delete',
		logged: { model_id: input.model_id },
	});
};

export const update: MistralAiEndpoints['modelsUpdate'] = async (
	ctx,
	rawInput,
) => {
	const { model_id, ...body } =
		MistralAiEndpointInputSchemas.modelsUpdate.parse(rawInput);
	return callMistralAi(ctx, '/v1/fine_tuning/models/{model_id}', {
		method: 'PATCH',
		path: { model_id },
		body,
		output: MistralAiEndpointOutputSchemas.modelsUpdate,
		event: 'models.update',
		logged: { model_id },
	});
};

export const archive: MistralAiEndpoints['modelsArchive'] = async (
	ctx,
	rawInput,
) => {
	const input = MistralAiEndpointInputSchemas.modelsArchive.parse(rawInput);
	return callMistralAi(ctx, '/v1/fine_tuning/models/{model_id}/archive', {
		method: 'POST',
		path: { model_id: input.model_id },
		output: MistralAiEndpointOutputSchemas.modelsArchive,
		event: 'models.archive',
		logged: { model_id: input.model_id },
	});
};

export const unarchive: MistralAiEndpoints['modelsUnarchive'] = async (
	ctx,
	rawInput,
) => {
	const input = MistralAiEndpointInputSchemas.modelsUnarchive.parse(rawInput);
	return callMistralAi(ctx, '/v1/fine_tuning/models/{model_id}/archive', {
		method: 'DELETE',
		path: { model_id: input.model_id },
		output: MistralAiEndpointOutputSchemas.modelsUnarchive,
		event: 'models.unarchive',
		logged: { model_id: input.model_id },
	});
};
