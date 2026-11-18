import { logEventFromContext } from 'corsair/core';
import type { FidelEndpoints } from '..';
import { makeFidelRequest } from '../client';
import { fidelPathParameter } from './path';
import type { FidelEndpointOutputs } from './types';

export const retrieveMidRequest: FidelEndpoints['retrieveMidRequest'] = async (
	ctx,
	input,
) => {
	const response = await makeFidelRequest<
		FidelEndpointOutputs['retrieveMidRequest']
	>(
		ctx,
		fidelPathParameter(
			fidelPathParameter(
				'/v1/programs/{programId}/mid-requests/{midRequestId}',
				'programId',
				input.programId,
			),
			'midRequestId',
			input.midRequestId,
		),
		{ method: 'GET' },
	);
	await logEventFromContext(
		ctx,
		'fidel.mid-requests.retrieveMidRequest',
		input,
		'completed',
	);
	return response;
};

export const listMidRequests: FidelEndpoints['listMidRequests'] = async (
	ctx,
	input,
) => {
	const { programId, ...rest } = input;
	const response = await makeFidelRequest<
		FidelEndpointOutputs['listMidRequests']
	>(
		ctx,
		fidelPathParameter(
			'/v1/programs/{programId}/mid-requests',
			'programId',
			input.programId,
		),
		{ method: 'GET', query: rest },
	);
	await logEventFromContext(
		ctx,
		'fidel.mid-requests.listMidRequests',
		input,
		'completed',
	);
	return response;
};

export const createMidRequest: FidelEndpoints['createMidRequest'] = async (
	ctx,
	input,
) => {
	const { programId, ...rest } = input;
	const response = await makeFidelRequest<
		FidelEndpointOutputs['createMidRequest']
	>(
		ctx,
		fidelPathParameter(
			'/v1/programs/{programId}/mid-requests',
			'programId',
			input.programId,
		),
		{ method: 'POST', body: rest },
	);
	await logEventFromContext(
		ctx,
		'fidel.mid-requests.createMidRequest',
		input,
		'completed',
	);
	return response;
};
