import type { MistralAiEndpoints } from '../index';
import { callMistralAi, callMistralAiNoContent } from './shared';
import {
	MistralAiEndpointInputSchemas,
	MistralAiEndpointOutputSchemas,
} from './types';

export const complete: MistralAiEndpoints['agentsComplete'] = async (
	ctx,
	rawInput,
) => {
	const input = MistralAiEndpointInputSchemas.agentsComplete.parse(rawInput);
	// Corsair returns one JSON result, so streaming stays off.
	return callMistralAi(ctx, '/v1/agents/completions', {
		method: 'POST',
		body: { ...input, stream: false },
		output: MistralAiEndpointOutputSchemas.agentsComplete,
		event: 'agents.complete',
		logged: { agent_id: input.agent_id },
	});
};

export const create: MistralAiEndpoints['agentsCreate'] = async (
	ctx,
	rawInput,
) => {
	const input = MistralAiEndpointInputSchemas.agentsCreate.parse(rawInput);
	return callMistralAi(ctx, '/v1/agents', {
		method: 'POST',
		body: input,
		output: MistralAiEndpointOutputSchemas.agentsCreate,
		event: 'agents.create',
		logged: { model: input.model, name: input.name },
	});
};

export const list: MistralAiEndpoints['agentsList'] = async (ctx, rawInput) => {
	const { metadata, ...input } = MistralAiEndpointInputSchemas.agentsList.parse(
		rawInput ?? {},
	);
	return callMistralAi(ctx, '/v1/agents/pages', {
		query: {
			...input,
			// The spec sends this filter as one JSON-encoded query value.
			metadata: metadata ? JSON.stringify(metadata) : undefined,
		},
		output: MistralAiEndpointOutputSchemas.agentsList,
		event: 'agents.list',
	});
};

export const get: MistralAiEndpoints['agentsGet'] = async (ctx, rawInput) => {
	const input = MistralAiEndpointInputSchemas.agentsGet.parse(rawInput);
	return callMistralAi(ctx, '/v1/agents/{agent_id}', {
		path: { agent_id: input.agent_id },
		query: { agent_version: input.agent_version },
		output: MistralAiEndpointOutputSchemas.agentsGet,
		event: 'agents.get',
		logged: { agent_id: input.agent_id },
	});
};

export const update: MistralAiEndpoints['agentsUpdate'] = async (
	ctx,
	rawInput,
) => {
	const { agent_id, ...body } =
		MistralAiEndpointInputSchemas.agentsUpdate.parse(rawInput);
	return callMistralAi(ctx, '/v1/agents/{agent_id}', {
		method: 'PATCH',
		path: { agent_id },
		body,
		output: MistralAiEndpointOutputSchemas.agentsUpdate,
		event: 'agents.update',
		logged: { agent_id },
	});
};

export const remove: MistralAiEndpoints['agentsDelete'] = async (
	ctx,
	rawInput,
) => {
	const input = MistralAiEndpointInputSchemas.agentsDelete.parse(rawInput);
	return callMistralAiNoContent(ctx, '/v1/agents/{agent_id}', {
		method: 'DELETE',
		path: { agent_id: input.agent_id },
		event: 'agents.delete',
		logged: { agent_id: input.agent_id },
	});
};

export const setVersion: MistralAiEndpoints['agentsSetVersion'] = async (
	ctx,
	rawInput,
) => {
	const input = MistralAiEndpointInputSchemas.agentsSetVersion.parse(rawInput);
	return callMistralAi(ctx, '/v1/agents/{agent_id}/version', {
		method: 'PATCH',
		path: { agent_id: input.agent_id },
		query: { version: input.version },
		output: MistralAiEndpointOutputSchemas.agentsSetVersion,
		event: 'agents.setVersion',
		logged: { agent_id: input.agent_id, version: input.version },
	});
};

export const listVersions: MistralAiEndpoints['agentsListVersions'] = async (
	ctx,
	rawInput,
) => {
	const input =
		MistralAiEndpointInputSchemas.agentsListVersions.parse(rawInput);
	return callMistralAi(ctx, '/v1/agents/{agent_id}/versions', {
		path: { agent_id: input.agent_id },
		query: { page: input.page, page_size: input.page_size },
		output: MistralAiEndpointOutputSchemas.agentsListVersions,
		event: 'agents.listVersions',
		logged: { agent_id: input.agent_id },
	});
};

export const getVersion: MistralAiEndpoints['agentsGetVersion'] = async (
	ctx,
	rawInput,
) => {
	const input = MistralAiEndpointInputSchemas.agentsGetVersion.parse(rawInput);
	return callMistralAi(ctx, '/v1/agents/{agent_id}/versions/{version}', {
		path: { agent_id: input.agent_id, version: input.version },
		output: MistralAiEndpointOutputSchemas.agentsGetVersion,
		event: 'agents.getVersion',
		logged: { agent_id: input.agent_id, version: input.version },
	});
};

export const listAliases: MistralAiEndpoints['agentsListAliases'] = async (
	ctx,
	rawInput,
) => {
	const input = MistralAiEndpointInputSchemas.agentsListAliases.parse(rawInput);
	return callMistralAi(ctx, '/v1/agents/{agent_id}/aliases', {
		path: { agent_id: input.agent_id },
		output: MistralAiEndpointOutputSchemas.agentsListAliases,
		event: 'agents.listAliases',
		logged: { agent_id: input.agent_id },
	});
};

export const upsertAlias: MistralAiEndpoints['agentsUpsertAlias'] = async (
	ctx,
	rawInput,
) => {
	const input = MistralAiEndpointInputSchemas.agentsUpsertAlias.parse(rawInput);
	return callMistralAi(ctx, '/v1/agents/{agent_id}/aliases', {
		method: 'PUT',
		path: { agent_id: input.agent_id },
		query: { alias: input.alias, version: input.version },
		output: MistralAiEndpointOutputSchemas.agentsUpsertAlias,
		event: 'agents.upsertAlias',
		logged: {
			agent_id: input.agent_id,
			alias: input.alias,
			version: input.version,
		},
	});
};

export const deleteAlias: MistralAiEndpoints['agentsDeleteAlias'] = async (
	ctx,
	rawInput,
) => {
	const input = MistralAiEndpointInputSchemas.agentsDeleteAlias.parse(rawInput);
	return callMistralAiNoContent(ctx, '/v1/agents/{agent_id}/aliases', {
		method: 'DELETE',
		path: { agent_id: input.agent_id },
		query: { alias: input.alias },
		event: 'agents.deleteAlias',
		logged: { agent_id: input.agent_id, alias: input.alias },
	});
};
