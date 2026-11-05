import { logEventFromContext } from 'corsair/core';
import type { StreamtimeEndpoints } from '..';
import { makeStreamtimeRequest } from '../client';
import {
	StreamtimeEndpointInputSchemas,
	StreamtimeEndpointOutputSchemas,
} from './types';

export const getRole: StreamtimeEndpoints['getRole'] = async (ctx, input) => {
	const parsedInput = StreamtimeEndpointInputSchemas.getRole.parse(input);
	const response = await makeStreamtimeRequest<unknown>(
		`roles/${parsedInput.role_id}`,
		ctx.key,
		{ method: 'GET' },
	);

	const parsed = StreamtimeEndpointOutputSchemas.getRole.parse(response);
	await logEventFromContext(
		ctx,
		'streamtime.roles.get',
		{ ...parsedInput },
		'completed',
	);
	return parsed;
};

export const listRoles: StreamtimeEndpoints['listRoles'] = async (
	ctx,
	input,
) => {
	const parsedInput = StreamtimeEndpointInputSchemas.listRoles.parse(input);
	const response = await makeStreamtimeRequest<unknown>('roles', ctx.key, {
		method: 'GET',
	});

	const parsed = StreamtimeEndpointOutputSchemas.listRoles.parse(response);
	await logEventFromContext(
		ctx,
		'streamtime.roles.list',
		{ ...parsedInput },
		'completed',
	);
	return parsed;
};
