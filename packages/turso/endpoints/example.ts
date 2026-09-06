import { logEventFromContext } from 'corsair/core';
import type { TursoEndpoints } from '..';
import { makeTursoRequest } from '../client';
import type { TursoEndpointOutputs } from './types';

export const listDatabases: TursoEndpoints['listDatabases'] = async (
	ctx,
	input,
) => {
	const response = await makeTursoRequest<
		TursoEndpointOutputs['listDatabases']
	>(`v1/organizations/${input.organizationSlug}/databases`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'turso.database.list',
		{ ...input },
		'completed',
	);

	return response;
};

export const createDatabase: TursoEndpoints['createDatabase'] = async (
	ctx,
	input,
) => {
	const response = await makeTursoRequest<
		TursoEndpointOutputs['createDatabase']
	>(`v1/organizations/${input.organizationSlug}/databases`, ctx.key, {
		method: 'POST',
		body: {
			name: input.name,
			group: input.group,
		},
	});

	await logEventFromContext(
		ctx,
		'turso.database.create',
		{ ...input },
		'completed',
	);

	return response;
};

export const deleteDatabase: TursoEndpoints['deleteDatabase'] = async (
	ctx,
	input,
) => {
	const response = await makeTursoRequest<
		TursoEndpointOutputs['deleteDatabase']
	>(
		`v1/organizations/${input.organizationSlug}/databases/${input.databaseName}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	await logEventFromContext(
		ctx,
		'turso.database.delete',
		{ ...input },
		'completed',
	);

	return response;
};
