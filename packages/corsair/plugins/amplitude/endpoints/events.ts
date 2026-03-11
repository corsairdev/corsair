import { logEventFromContext } from '../../utils/events';
import type { AmplitudeEndpoints } from '..';
import { makeAmplitudeRequest, AMPLITUDE_HTTP_API_BASE } from '../client';
import type { AmplitudeEndpointOutputs } from './types';

export const upload: AmplitudeEndpoints['eventsUpload'] = async (ctx, input) => {
	const result = await makeAmplitudeRequest<AmplitudeEndpointOutputs['eventsUpload']>(
		'/2/httpapi',
		ctx.key,
		{
			method: 'POST',
			body: {
				api_key: input.api_key,
				events: input.events,
				options: input.options,
			},
			baseUrl: AMPLITUDE_HTTP_API_BASE,
		},
	);

	await logEventFromContext(ctx, 'amplitude.events.upload', { ...input }, 'completed');
	return result;
};

export const uploadBatch: AmplitudeEndpoints['eventsUploadBatch'] = async (ctx, input) => {
	const result = await makeAmplitudeRequest<AmplitudeEndpointOutputs['eventsUploadBatch']>(
		'/batch',
		ctx.key,
		{
			method: 'POST',
			body: {
				api_key: input.api_key,
				events: input.events,
				options: input.options,
			},
			baseUrl: AMPLITUDE_HTTP_API_BASE,
		},
	);

	await logEventFromContext(ctx, 'amplitude.events.uploadBatch', { ...input }, 'completed');
	return result;
};

export const identifyUser: AmplitudeEndpoints['eventsIdentifyUser'] = async (ctx, input) => {
	const result = await makeAmplitudeRequest<AmplitudeEndpointOutputs['eventsIdentifyUser']>(
		'/identify',
		ctx.key,
		{
			method: 'POST',
			body: {
				api_key: input.api_key,
				identification: input.identification,
			},
			baseUrl: AMPLITUDE_HTTP_API_BASE,
		},
	);

	await logEventFromContext(ctx, 'amplitude.events.identifyUser', { ...input }, 'completed');
	return result;
};

export const getList: AmplitudeEndpoints['eventsGetList'] = async (ctx, input) => {
	const result = await makeAmplitudeRequest<AmplitudeEndpointOutputs['eventsGetList']>(
		'/api/2/events/list',
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'amplitude.events.getList', { ...input }, 'completed');
	return result;
};
