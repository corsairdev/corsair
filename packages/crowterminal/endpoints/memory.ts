import { logEventFromContext } from 'corsair/core';
import { makeCrowterminalRequest } from '../client';
import type { CrowterminalEndpoints } from '../index';
import type { CrowterminalEndpointOutputs } from './types';

export const get: CrowterminalEndpoints['memoryGet'] = async (ctx, input) => {
	const response = await makeCrowterminalRequest<
		CrowterminalEndpointOutputs['memoryGet']
	>(`/api/agent/memory/${input.clientId}`, ctx.key);

	await logEventFromContext(
		ctx,
		'crowterminal.memory.get',
		{ ...input },
		'completed',
	);
	return response;
};

export const engagementAnalysis: CrowterminalEndpoints['memoryEngagementAnalysis'] =
	async (ctx, input) => {
		const response = await makeCrowterminalRequest<
			CrowterminalEndpointOutputs['memoryEngagementAnalysis']
		>(`/api/agent/memory/${input.clientId}/engagement-analysis`, ctx.key, {
			method: 'POST',
			body: { agentMd: input.agentMd },
		});

		await logEventFromContext(
			ctx,
			'crowterminal.memory.engagement_analysis',
			{ ...input },
			'completed',
		);
		return response;
	};
