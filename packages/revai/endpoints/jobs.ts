import { logEventFromContext } from 'corsair/core';
import type { RevAIEndpoints } from '..';
import { makeRevAIRequest } from '../client';
import type { RevAIEndpointOutputs } from './types';
import { RevAIEndpointInputSchemas, RevAIEndpointOutputSchemas } from './types';

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
	const {
		media_url,
		notification_config: unsafeNotificationConfig,
		...safeInput
	} = parsedInput;
	const safeNotificationConfig = unsafeNotificationConfig
		? {
				...unsafeNotificationConfig,
				auth_headers: undefined,
			}
		: undefined;
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
					typeof response === 'string' ? JSON.parse(response) : response,
				);

	await logEventFromContext(
		ctx,
		'revai.jobs.getTranscript',
		{ ...parsedInput },
		'completed',
	);
	return parsedResponse;
};
