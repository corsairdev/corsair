import { logEventFromContext } from 'corsair/core';
import { makeFirecrawlRequest } from '../client';
import type { FirecrawlEndpoints } from '../index';
import type {
	AgentCancelResponse,
	AgentGetResponse,
	AgentStartResponse,
} from './types';

export const start: FirecrawlEndpoints['agentStart'] = async (ctx, input) => {
	const response = await makeFirecrawlRequest<AgentStartResponse>(
		'v2/agent',
		ctx.key,
		{
			method: 'POST',
			body: input,
		},
	);

	if (!!response.id && ctx.db.jobs) {
		try {
			await ctx.db.jobs.upsertByEntityId(response.id, {
				id: response.id,
				kind: 'agent',
				success: response.success,
				snapshot: response,
				updatedAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save agent job to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'firecrawl.agent.start',
		{ ...input },
		'completed',
	);
	return response;
};

export const get: FirecrawlEndpoints['agentGet'] = async (ctx, input) => {
	const response = await makeFirecrawlRequest<AgentGetResponse>(
		`v2/agent/${input.id}`,
		ctx.key,
		{
			method: 'GET',
		},
	);

	if (ctx.db.jobs) {
		try {
			await ctx.db.jobs.upsertByEntityId(input.id, {
				id: input.id,
				kind: 'agent',
				success: response.success,
				snapshot: response,
				updatedAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save agent job to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'firecrawl.agent.get',
		{ ...input },
		'completed',
	);
	return response;
};

export const cancel: FirecrawlEndpoints['agentCancel'] = async (ctx, input) => {
	const response = await makeFirecrawlRequest<AgentCancelResponse>(
		`v2/agent/${input.id}`,
		ctx.key,
		{
			method: 'DELETE',
		},
	);

	if (ctx.db.jobs) {
		try {
			await ctx.db.jobs.upsertByEntityId(input.id, {
				id: input.id,
				kind: 'agent',
				success: response.success,
				snapshot: response,
				updatedAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save agent job to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'firecrawl.agent.cancel',
		{ ...input },
		'completed',
	);
	return response;
};
