import { elevenLabsJson, logQuietly, pathId } from '../client';
import type { ElevenLabsEndpoints } from '../index';
import {
	ElevenLabsEndpointInputSchemas,
	ElevenLabsEndpointOutputSchemas,
} from './types';

export const list: ElevenLabsEndpoints['agentsList'] = async (
	ctx,
	rawInput,
) => {
	const input = ElevenLabsEndpointInputSchemas.agentsList.parse(rawInput ?? {});
	const response = ElevenLabsEndpointOutputSchemas.agentsList.parse(
		await elevenLabsJson('/v1/convai/agents', ctx.key, {
			query: {
				cursor: input.cursor,
				page_size: input.pageSize,
				search: input.search,
				archived: input.archived,
				show_only_owned_agents: input.showOnlyOwnedAgents,
				tags: input.tags,
				sort_by: input.sortBy,
				sort_direction: input.sortDirection,
			},
		}),
	);
	await logQuietly(ctx, 'elevenlabs.agents.list', {
		count: response.agents.length,
	});
	return response;
};

export const get: ElevenLabsEndpoints['agentsGet'] = async (ctx, rawInput) => {
	const input = ElevenLabsEndpointInputSchemas.agentsGet.parse(rawInput);
	const response = ElevenLabsEndpointOutputSchemas.agentsGet.parse(
		await elevenLabsJson(
			`/v1/convai/agents/${pathId(input.agentId)}`,
			ctx.key,
			{
				query: { version_id: input.versionId, branch_id: input.branchId },
			},
		),
	);
	await logQuietly(ctx, 'elevenlabs.agents.get', { agentId: input.agentId });
	return response;
};

export const create: ElevenLabsEndpoints['agentsCreate'] = async (
	ctx,
	rawInput,
) => {
	const input = ElevenLabsEndpointInputSchemas.agentsCreate.parse(rawInput);
	const response = ElevenLabsEndpointOutputSchemas.agentsCreate.parse(
		await elevenLabsJson('/v1/convai/agents/create', ctx.key, {
			method: 'POST',
			json: {
				conversation_config: input.conversationConfig,
				platform_settings: input.platformSettings,
				workflow: input.workflow,
				name: input.name,
				tags: input.tags,
			},
		}),
	);
	await logQuietly(ctx, 'elevenlabs.agents.create', {
		agentId: response.agent_id,
	});
	return response;
};

export const update: ElevenLabsEndpoints['agentsUpdate'] = async (
	ctx,
	rawInput,
) => {
	const input = ElevenLabsEndpointInputSchemas.agentsUpdate.parse(rawInput);
	const response = ElevenLabsEndpointOutputSchemas.agentsUpdate.parse(
		await elevenLabsJson(
			`/v1/convai/agents/${pathId(input.agentId)}`,
			ctx.key,
			{
				method: 'PATCH',
				query: { branch_id: input.branchId },
				json: {
					conversation_config: input.conversationConfig,
					platform_settings: input.platformSettings,
					workflow: input.workflow,
					name: input.name,
					tags: input.tags,
					version_description: input.versionDescription,
				},
			},
		),
	);
	await logQuietly(ctx, 'elevenlabs.agents.update', { agentId: input.agentId });
	return response;
};

export const remove: ElevenLabsEndpoints['agentsDelete'] = async (
	ctx,
	rawInput,
) => {
	const input = ElevenLabsEndpointInputSchemas.agentsDelete.parse(rawInput);
	const response = ElevenLabsEndpointOutputSchemas.agentsDelete.parse(
		await elevenLabsJson(
			`/v1/convai/agents/${pathId(input.agentId)}`,
			ctx.key,
			{
				method: 'DELETE',
				query: { force: input.force },
			},
		),
	);
	await logQuietly(ctx, 'elevenlabs.agents.delete', { agentId: input.agentId });
	return response;
};

export const conversationsList: ElevenLabsEndpoints['agentsConversationsList'] =
	async (ctx, rawInput) => {
		const input = ElevenLabsEndpointInputSchemas.agentsConversationsList.parse(
			rawInput ?? {},
		);
		const response =
			ElevenLabsEndpointOutputSchemas.agentsConversationsList.parse(
				await elevenLabsJson('/v1/convai/conversations', ctx.key, {
					query: {
						cursor: input.cursor,
						page_size: input.pageSize,
						agent_id: input.agentId,
						search: input.search,
						summary_mode: input.summaryMode,
						sort_direction: input.sortDirection,
					},
				}),
			);
		await logQuietly(ctx, 'elevenlabs.agents.conversationsList', {
			count: response.conversations.length,
		});
		return response;
	};

export const conversationGet: ElevenLabsEndpoints['agentsConversationGet'] =
	async (ctx, rawInput) => {
		const input =
			ElevenLabsEndpointInputSchemas.agentsConversationGet.parse(rawInput);
		const response =
			ElevenLabsEndpointOutputSchemas.agentsConversationGet.parse(
				await elevenLabsJson(
					`/v1/convai/conversations/${pathId(input.conversationId)}`,
					ctx.key,
				),
			);
		await logQuietly(ctx, 'elevenlabs.agents.conversationGet', {
			conversationId: input.conversationId,
		});
		return response;
	};

export const conversationDelete: ElevenLabsEndpoints['agentsConversationDelete'] =
	async (ctx, rawInput) => {
		const input =
			ElevenLabsEndpointInputSchemas.agentsConversationDelete.parse(rawInput);
		const response =
			ElevenLabsEndpointOutputSchemas.agentsConversationDelete.parse(
				await elevenLabsJson(
					`/v1/convai/conversations/${pathId(input.conversationId)}`,
					ctx.key,
					{ method: 'DELETE' },
				),
			);
		await logQuietly(ctx, 'elevenlabs.agents.conversationDelete', {
			conversationId: input.conversationId,
		});
		return response;
	};

export const signedUrl: ElevenLabsEndpoints['agentsSignedUrl'] = async (
	ctx,
	rawInput,
) => {
	const input = ElevenLabsEndpointInputSchemas.agentsSignedUrl.parse(rawInput);
	const response = ElevenLabsEndpointOutputSchemas.agentsSignedUrl.parse(
		await elevenLabsJson('/v1/convai/conversation/get-signed-url', ctx.key, {
			query: {
				agent_id: input.agentId,
				include_conversation_id: input.includeConversationId,
				branch_id: input.branchId,
			},
		}),
	);
	// The URL is a credential, so only the agent is logged.
	await logQuietly(ctx, 'elevenlabs.agents.signedUrl', {
		agentId: input.agentId,
	});
	return response;
};
