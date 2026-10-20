import { logEventFromContext } from 'corsair/core';
import type { OctenEndpoints } from '..';
import { makeOctenRequest } from '../client';
import { OctenEndpointInputSchemas, OctenEndpointOutputSchemas } from './types';

// The generation endpoints return the task resource directly rather than the
// `{ code, msg, data }` envelope, hence `envelope: false`.
export const groundedGenerationCreate: OctenEndpoints['groundedGenerationCreate'] =
	async (ctx, input) => {
		const parsedInput =
			OctenEndpointInputSchemas.groundedGenerationCreate.parse(input);
		const response = await makeOctenRequest(
			'/v1/grounded-generation',
			ctx.key,
			{
				method: 'POST',
				body: parsedInput,
				envelope: false,
			},
		);
		const parsed =
			OctenEndpointOutputSchemas.groundedGenerationCreate.parse(response);

		await logEventFromContext(
			ctx,
			'octen.groundedGeneration.create',
			{ modality: parsedInput.modality },
			'completed',
		);

		return parsed;
	};

export const groundedGenerationGet: OctenEndpoints['groundedGenerationGet'] =
	async (ctx, input) => {
		const parsedInput =
			OctenEndpointInputSchemas.groundedGenerationGet.parse(input);
		const response = await makeOctenRequest(
			'/v1/grounded-generation/{generation_id}',
			ctx.key,
			{
				method: 'GET',
				path: { generation_id: parsedInput.generation_id },
				envelope: false,
			},
		);
		const parsed =
			OctenEndpointOutputSchemas.groundedGenerationGet.parse(response);

		await logEventFromContext(
			ctx,
			'octen.groundedGeneration.get',
			{ generation_id: parsedInput.generation_id },
			'completed',
		);

		return parsed;
	};
