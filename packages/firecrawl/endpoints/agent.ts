import { logEventFromContext } from 'corsair/core';
import type { FirecrawlEndpoints } from '..';
import { makeFirecrawlRequest } from '../client';
import { persistJob } from './persist';
import type { FirecrawlEndpointOutputs } from './types';

export const start: FirecrawlEndpoints['agentStart'] = async (ctx, input) => {
	const response = await makeFirecrawlRequest<
		FirecrawlEndpointOutputs['agentStart']
	>('v2/agent', ctx.key, {
		method: 'POST',
		body: input as Record<string, unknown>,
	});

	const jobId = (response as { id?: string }).id;
	if (typeof jobId === 'string') {
		await persistJob(ctx, 'agent', jobId, response);
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
	const response = await makeFirecrawlRequest<
		FirecrawlEndpointOutputs['agentGet']
	>(`v2/agent/${input.id}`, ctx.key, {
		method: 'GET',
	});

	await persistJob(ctx, 'agent', input.id, response);

	await logEventFromContext(
		ctx,
		'firecrawl.agent.get',
		{ ...input },
		'completed',
	);
	return response;
};

export const cancel: FirecrawlEndpoints['agentCancel'] = async (ctx, input) => {
	const response = await makeFirecrawlRequest<
		FirecrawlEndpointOutputs['agentCancel']
	>(`v2/agent/${input.id}`, ctx.key, {
		method: 'DELETE',
	});

	await persistJob(ctx, 'agent', input.id, response);

	await logEventFromContext(
		ctx,
		'firecrawl.agent.cancel',
		{ ...input },
		'completed',
	);
	return response;
};
