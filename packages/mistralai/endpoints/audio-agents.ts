import type { MistralAiEndpoints } from '../index';
import { callMistralAi, callMistralAiNoContent } from './shared';
import {
	MistralAiEndpointInputSchemas,
	MistralAiEndpointOutputSchemas,
} from './types';

export const list: MistralAiEndpoints['audioAgentsList'] = async (
	ctx,
	rawInput,
) => {
	const input = MistralAiEndpointInputSchemas.audioAgentsList.parse(
		rawInput ?? {},
	);
	return callMistralAi(ctx, '/v1/audio/agents', {
		query: input,
		output: MistralAiEndpointOutputSchemas.audioAgentsList,
		event: 'audioAgents.list',
	});
};

export const create: MistralAiEndpoints['audioAgentsCreate'] = async (
	ctx,
	rawInput,
) => {
	const input = MistralAiEndpointInputSchemas.audioAgentsCreate.parse(rawInput);
	return callMistralAi(ctx, '/v1/audio/agents', {
		method: 'POST',
		body: input,
		output: MistralAiEndpointOutputSchemas.audioAgentsCreate,
		event: 'audioAgents.create',
		logged: { name: input.name },
	});
};

export const get: MistralAiEndpoints['audioAgentsGet'] = async (
	ctx,
	rawInput,
) => {
	const input = MistralAiEndpointInputSchemas.audioAgentsGet.parse(rawInput);
	return callMistralAi(ctx, '/v1/audio/agents/{agent_id}', {
		path: { agent_id: input.agent_id },
		query: { version: input.version },
		output: MistralAiEndpointOutputSchemas.audioAgentsGet,
		event: 'audioAgents.get',
		logged: { agent_id: input.agent_id },
	});
};

export const update: MistralAiEndpoints['audioAgentsUpdate'] = async (
	ctx,
	rawInput,
) => {
	const { agent_id, ...body } =
		MistralAiEndpointInputSchemas.audioAgentsUpdate.parse(rawInput);
	return callMistralAi(ctx, '/v1/audio/agents/{agent_id}', {
		method: 'PUT',
		path: { agent_id },
		body,
		output: MistralAiEndpointOutputSchemas.audioAgentsUpdate,
		event: 'audioAgents.update',
		logged: { agent_id },
	});
};

export const remove: MistralAiEndpoints['audioAgentsDelete'] = async (
	ctx,
	rawInput,
) => {
	const input = MistralAiEndpointInputSchemas.audioAgentsDelete.parse(rawInput);
	return callMistralAiNoContent(ctx, '/v1/audio/agents/{agent_id}', {
		method: 'DELETE',
		path: { agent_id: input.agent_id },
		output: MistralAiEndpointOutputSchemas.audioAgentsDelete,
		event: 'audioAgents.delete',
		logged: { agent_id: input.agent_id },
	});
};

export const listVersions: MistralAiEndpoints['audioAgentsListVersions'] =
	async (ctx, rawInput) => {
		const { agent_id, ...query } =
			MistralAiEndpointInputSchemas.audioAgentsListVersions.parse(rawInput);
		return callMistralAi(ctx, '/v1/audio/agents/{agent_id}/versions', {
			path: { agent_id },
			query,
			output: MistralAiEndpointOutputSchemas.audioAgentsListVersions,
			event: 'audioAgents.listVersions',
			logged: { agent_id },
		});
	};

export const listSessions: MistralAiEndpoints['audioAgentsListSessions'] =
	async (ctx, rawInput) => {
		const { agent_id, ...query } =
			MistralAiEndpointInputSchemas.audioAgentsListSessions.parse(rawInput);
		return callMistralAi(ctx, '/v1/audio/agents/{agent_id}/sessions', {
			path: { agent_id },
			query,
			output: MistralAiEndpointOutputSchemas.audioAgentsListSessions,
			event: 'audioAgents.listSessions',
			logged: { agent_id },
		});
	};
