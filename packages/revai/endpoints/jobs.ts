import { logEventFromContext } from 'corsair/core';
import type { RevAIEndpoints } from '..';
import { makeRevAIRequest } from '../client';
import { RevAIJob } from '../schema/database';
import type { RevAIEndpointOutputs, SubmitJobInput } from './types';
import { RevAIEndpointInputSchemas, RevAIEndpointOutputSchemas } from './types';

function sanitizeNotificationConfig(
	notificationConfig: SubmitJobInput['notification_config'],
) {
	if (!notificationConfig) return undefined;
	return {
		url: notificationConfig.url,
	};
}

function decodeTranscriptJson(response: RevAIEndpointOutputs['getTranscript']) {
	return typeof response === 'string' ? JSON.parse(response) : response;
}

export const submitJob: RevAIEndpoints['submitJob'] = async (ctx, input) => {
	const parsedInput = RevAIEndpointInputSchemas.submitJob.parse(input);
	const response = await makeRevAIRequest<RevAIEndpointOutputs['submitJob']>(
		'/jobs',
		ctx.key,
		{
			method: 'POST',
			body: {
				source_config: { url: parsedInput.media_url },
				metadata: parsedInput.metadata,
				language: parsedInput.language,
				notification_config: parsedInput.notification_config,
			},
		},
	);
	const parsedResponse = RevAIEndpointOutputSchemas.submitJob.parse(response);
	await ctx.db.job.upsertByEntityId(
		parsedResponse.id,
		RevAIJob.parse(parsedResponse),
	);
	const safeInput = {
		metadata: parsedInput.metadata,
		language: parsedInput.language,
	};
	const safeNotificationConfig = sanitizeNotificationConfig(
		parsedInput.notification_config,
	);
	await logEventFromContext(
		ctx,
		'revai.jobs.submit',
		{ ...safeInput, notification_config: safeNotificationConfig },
		'completed',
	);
	return parsedResponse;
};

export const getJob: RevAIEndpoints['getJob'] = async (ctx, input) => {
	const parsedInput = RevAIEndpointInputSchemas.getJob.parse(input);
	const response = await makeRevAIRequest<RevAIEndpointOutputs['getJob']>(
		`/jobs/${encodeURIComponent(parsedInput.id)}`,
		ctx.key,
		{ method: 'GET' },
	);
	const parsedResponse = RevAIEndpointOutputSchemas.getJob.parse(response);
	await ctx.db.job.upsertByEntityId(
		parsedResponse.id,
		RevAIJob.parse(parsedResponse),
	);
	await logEventFromContext(
		ctx,
		'revai.jobs.get',
		{ ...parsedInput },
		'completed',
	);
	return parsedResponse;
};

export const getTranscript: RevAIEndpoints['getTranscript'] = async (
	ctx,
	input,
) => {
	const parsedInput = RevAIEndpointInputSchemas.getTranscript.parse(input);
	const response = await makeRevAIRequest<
		RevAIEndpointOutputs['getTranscript']
	>(`/jobs/${encodeURIComponent(parsedInput.id)}/transcript`, ctx.key, {
		method: 'GET',
		headers: {
			Accept: parsedInput.accept,
		},
	});

	const parsedResponse =
		parsedInput.accept === 'text/plain'
			? RevAIEndpointOutputSchemas.getTranscript.options[1].parse(response)
			: RevAIEndpointOutputSchemas.getTranscript.options[0].parse(
					decodeTranscriptJson(response),
				);

	await logEventFromContext(
		ctx,
		'revai.jobs.getTranscript',
		{ ...parsedInput },
		'completed',
	);
	return parsedResponse;
};
