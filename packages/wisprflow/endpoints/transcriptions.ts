import { logEventFromContext } from 'corsair/core';
import type { WisprFlowEndpoints } from '..';
import { makeWisprFlowRequest } from '../client';
import {
	WisprFlowEndpointInputSchemas,
	WisprFlowEndpointOutputSchemas,
} from './types';

export const create: WisprFlowEndpoints['transcriptionsCreate'] = async (
	ctx,
	input,
) => {
	const body = WisprFlowEndpointInputSchemas.transcriptionsCreate.parse(input);
	const response = WisprFlowEndpointOutputSchemas.transcriptionsCreate.parse(
		await makeWisprFlowRequest('/api', ctx.key, { method: 'POST', body }),
	);
	await ctx.db.transcription.upsertByEntityId(response.id, response);
	// Audio, screenshots and the context fields carry user content, so only the language hint is logged.
	await logEventFromContext(
		ctx,
		'wisprflow.transcriptions.create',
		{ language: body.language },
		'completed',
	);
	return response;
};

export const warmup: WisprFlowEndpoints['transcriptionsWarmup'] = async (
	ctx,
	input,
) => {
	WisprFlowEndpointInputSchemas.transcriptionsWarmup.parse(input);
	const response = WisprFlowEndpointOutputSchemas.transcriptionsWarmup.parse(
		await makeWisprFlowRequest('/warmup_dash', ctx.key, { method: 'GET' }),
	);
	await logEventFromContext(
		ctx,
		'wisprflow.transcriptions.warmup',
		{},
		'completed',
	);
	return response;
};
