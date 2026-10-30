import { logEventFromContext } from 'corsair/core';
import type { TypeSafeEndpoints } from '..';
import { makeTypeSafeRequest } from '../client';
import {
	TypeSafeEndpointInputSchemas,
	TypeSafeEndpointOutputSchemas,
} from './types';

export const list: TypeSafeEndpoints['modelsList'] = async (ctx, input) => {
	TypeSafeEndpointInputSchemas.modelsList.parse(input ?? {});
	const raw = await makeTypeSafeRequest(ctx.key, {
		method: 'GET',
		path: '/v1/models',
	});
	const result = TypeSafeEndpointOutputSchemas.modelsList.parse(raw);
	await logEventFromContext(
		ctx,
		'typesafe.models.list',
		{ count: result.models.length },
		'completed',
	);
	return result;
};
