import { logEventFromContext } from 'corsair/core';
import type { TursoEndpoints } from '..';
import { makeTursoRequest } from '../client';
import type { TursoEndpointOutputs } from './types';

export const get: TursoEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeTursoRequest<TursoEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'turso.example.get',
		{ ...input },
		'completed',
	);
	return response;
};
