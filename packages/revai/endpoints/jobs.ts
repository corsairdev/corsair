import { logEventFromContext } from 'corsair/core';
import type { RevAIEndpoints } from '..';
import { makeRevAIRequest } from '../client';
import type { RevAIEndpointOutputs } from './types';

export const submitJob: RevAIEndpoints['submitJob'] = async (ctx, input) => {
	const response = await makeRevAIRequest<RevAIEndpointOutputs['submitJob']>(
		'/jobs',
		ctx.key,
		{
			method: 'POST',
			body: {
				source_config: { url: input.media_url },
				metadata: input.metadata,
				language: input.language,
				notification_config: input.notification_config,
			},
		},
	);
	const { media_url, ...safeInput } = input;
	await logEventFromContext(ctx, 'revai.jobs.submit', safeInput, 'completed');
	return response;
};

export const getJob: RevAIEndpoints['getJob'] = async (ctx, input) => {
	const response = await makeRevAIRequest<RevAIEndpointOutputs['getJob']>(
		`/jobs/${encodeURIComponent(input.id)}`,
		ctx.key,
		{ method: 'GET' },
	);
	await logEventFromContext(ctx, 'revai.jobs.get', { ...input }, 'completed');
	return response;
};

export const getTranscript: RevAIEndpoints['getTranscript'] = async (
	ctx,
	input,
) => {
	const response = await makeRevAIRequest<
		RevAIEndpointOutputs['getTranscript']
	>(`/jobs/${encodeURIComponent(input.id)}/transcript`, ctx.key, {
		method: 'GET',
		headers: {
			Accept: input.accept || 'application/vnd.rev.transcript.v1.0+json',
		},
	});
	await logEventFromContext(
		ctx,
		'revai.jobs.getTranscript',
		{ ...input },
		'completed',
	);
	return response;
};
