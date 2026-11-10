import { logEventFromContext } from 'corsair/core';
import type { FidelEndpoints } from '..';
import { makeFidelRequest } from '../client';
import { fidelPathParameter } from './path';
import type { FidelEndpointOutputs } from './types';

export const listPrograms: FidelEndpoints['listPrograms'] = async (
	ctx,
	input,
) => {
	const response = await makeFidelRequest<FidelEndpointOutputs['listPrograms']>(
		ctx,
		'/v1/programs',
		{ method: 'GET', query: input },
	);
	await logEventFromContext(
		ctx,
		'fidel.programs.listPrograms',
		input,
		'completed',
	);
	return response;
};

export const createProgram: FidelEndpoints['createProgram'] = async (
	ctx,
	input,
) => {
	const response = await makeFidelRequest<
		FidelEndpointOutputs['createProgram']
	>(ctx, '/v1/programs', { method: 'POST', body: input });
	await logEventFromContext(
		ctx,
		'fidel.programs.createProgram',
		input,
		'completed',
	);
	return response;
};

export const updateProgram: FidelEndpoints['updateProgram'] = async (
	ctx,
	input,
) => {
	const { programId, ...rest } = input;
	const response = await makeFidelRequest<
		FidelEndpointOutputs['updateProgram']
	>(
		ctx,
		fidelPathParameter(
			'/v1/programs/{programId}',
			'programId',
			input.programId,
		),
		{ method: 'PATCH', body: rest },
	);
	await logEventFromContext(
		ctx,
		'fidel.programs.updateProgram',
		input,
		'completed',
	);
	return response;
};

export const retrieveProgram: FidelEndpoints['retrieveProgram'] = async (
	ctx,
	input,
) => {
	const response = await makeFidelRequest<
		FidelEndpointOutputs['retrieveProgram']
	>(
		ctx,
		fidelPathParameter(
			'/v1/programs/{programId}',
			'programId',
			input.programId,
		),
		{ method: 'GET' },
	);
	await logEventFromContext(
		ctx,
		'fidel.programs.retrieveProgram',
		input,
		'completed',
	);
	return response;
};
