import { logEventFromContext } from 'corsair/core';
import type { CursorEndpoints } from '..';
import { makeCursorRequest } from '../client';
import type { CursorEndpointOutputs } from './types';

export const list: CursorEndpoints['agentsList'] = async (ctx, input) => {
	const response = await makeCursorRequest<CursorEndpointOutputs['agentsList']>(
		'agents',
		ctx.key,
		{
			method: 'GET',
			query: {
				limit: input.limit,
				cursor: input.cursor,
			},
		},
	);

	if (response.agents && ctx.db.agents) {
		for (const agent of response.agents) {
			const { id, source, target, createdAt: createdAtStr, ...rest } = agent;
			if (!id) continue;
			try {
				await ctx.db.agents.upsertByEntityId(id, {
					...rest,
					id,
					createdAt: createdAtStr ? new Date(createdAtStr) : undefined,
					sourceRef: source?.ref,
					sourceRepository: source?.repository,
					targetUrl: target?.url,
					targetPrUrl: target?.prUrl,
					targetBranchName: target?.branchName,
					targetAutoCreatePr: target?.autoCreatePr,
				});
			} catch (error) {
				console.warn('Failed to save agent to database:', error);
			}
		}
	}

	await logEventFromContext(
		ctx,
		'cursor.agents.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const getConversation: CursorEndpoints['agentsGetConversation'] = async (
	ctx,
	input,
) => {
	const response = await makeCursorRequest<
		CursorEndpointOutputs['agentsGetConversation']
	>(`agents/${input.id}/conversation`, ctx.key, { method: 'GET' });

	if (ctx.db.agents) {
		try {
			const { messages: _messages, ...rest } = response;
			await ctx.db.agents.upsertByEntityId(response.id, {
				...rest,
			});
		} catch (error) {
			console.warn('Failed to save agent to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'cursor.agents.getConversation',
		{ ...input },
		'completed',
	);
	return response;
};
