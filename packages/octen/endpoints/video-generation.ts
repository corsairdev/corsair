import { logEventFromContext } from 'corsair/core';
import type { OctenEndpoints } from '..';
import { makeOctenRequest } from '../client';
import { OctenEndpointInputSchemas, OctenEndpointOutputSchemas } from './types';

// The generation endpoints return the task resource directly rather than the
// `{ code, msg, data }` envelope, hence `envelope: false`.
export const videoGenerationCreate: OctenEndpoints['videoGenerationCreate'] =
	async (ctx, input) => {
		const parsedInput =
			OctenEndpointInputSchemas.videoGenerationCreate.parse(input);
		const response = await makeOctenRequest('/v1/videos', ctx.key, {
			method: 'POST',
			body: parsedInput,
			envelope: false,
		});
		const parsed =
			OctenEndpointOutputSchemas.videoGenerationCreate.parse(response);

		await logEventFromContext(
			ctx,
			'octen.videoGeneration.create',
			{ model: parsedInput.model },
			'completed',
		);

		return parsed;
	};

export const videoGenerationGet: OctenEndpoints['videoGenerationGet'] = async (
	ctx,
	input,
) => {
	const parsedInput = OctenEndpointInputSchemas.videoGenerationGet.parse(input);
	const response = await makeOctenRequest('/v1/videos/{id}', ctx.key, {
		method: 'GET',
		path: { id: parsedInput.id },
		envelope: false,
	});
	const parsed = OctenEndpointOutputSchemas.videoGenerationGet.parse(response);

	await logEventFromContext(
		ctx,
		'octen.videoGeneration.get',
		{ id: parsedInput.id },
		'completed',
	);

	return parsed;
};
