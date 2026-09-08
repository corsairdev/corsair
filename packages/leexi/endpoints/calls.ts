import { logEventFromContext } from 'corsair/core';
import { makeLeexiRequest, resolveLeexiCredentials } from '../client';
import type { LeexiEndpoints } from '../index';
import { LeexiEndpointInputSchemas, LeexiEndpointOutputSchemas } from './types';

export const list: LeexiEndpoints['callsList'] = async (ctx, input) => {
	const parsed = LeexiEndpointInputSchemas.callsList.parse(input);
	const credentials = await resolveLeexiCredentials(ctx);

	const raw = await makeLeexiRequest<unknown>('calls', credentials, {
		method: 'GET',
		query: parsed,
	});
	const response = LeexiEndpointOutputSchemas.callsList.parse(raw);

	await logEventFromContext(
		ctx,
		'leexi.calls.list',
		{ ...parsed },
		'completed',
	);
	return response;
};

export const get: LeexiEndpoints['callsGet'] = async (ctx, input) => {
	const parsed = LeexiEndpointInputSchemas.callsGet.parse(input);
	const credentials = await resolveLeexiCredentials(ctx);

	const raw = await makeLeexiRequest<unknown>(
		`calls/${parsed.uuid}`,
		credentials,
		{ method: 'GET' },
	);
	const response = LeexiEndpointOutputSchemas.callsGet.parse(raw);

	await logEventFromContext(
		ctx,
		'leexi.calls.get',
		{ uuid: parsed.uuid },
		'completed',
	);
	return response;
};

export const requestPresignedUrl: LeexiEndpoints['callsRequestPresignedUrl'] =
	async (ctx, input) => {
		const parsed =
			LeexiEndpointInputSchemas.callsRequestPresignedUrl.parse(input);
		const credentials = await resolveLeexiCredentials(ctx);

		const raw = await makeLeexiRequest<unknown>(
			'calls/presign_recording_url',
			credentials,
			{
				method: 'POST',
				body: { extension: parsed.extension ?? '.mp4' },
			},
		);
		const response =
			LeexiEndpointOutputSchemas.callsRequestPresignedUrl.parse(raw);

		await logEventFromContext(
			ctx,
			'leexi.calls.requestPresignedUrl',
			{ extension: parsed.extension ?? '.mp4' },
			'completed',
		);
		return response;
	};
