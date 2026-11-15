import { logEventFromContext } from 'corsair/core';
import type { CodaEndpoints } from '..';
import { makeCodaRequest } from '../client';
import type { CodaEndpointOutputs } from './types';

const whoami: CodaEndpoints['accountWhoami'] = async (ctx, input) => {
	const response = await makeCodaRequest<CodaEndpointOutputs['accountWhoami']>(
		'whoami',
		ctx.key,
		{ method: 'GET' },
	);
	await logEventFromContext(
		ctx,
		'coda.account.whoami',
		{ ...input },
		'completed',
	);
	return response;
};

const resolveBrowserLink: CodaEndpoints['accountResolveBrowserLink'] = async (
	ctx,
	input,
) => {
	const response = await makeCodaRequest<
		CodaEndpointOutputs['accountResolveBrowserLink']
	>('resolveBrowserLink', ctx.key, { method: 'GET', query: input });
	await logEventFromContext(
		ctx,
		'coda.account.resolveBrowserLink',
		{ ...input },
		'completed',
	);
	return response;
};

const getMutationStatus: CodaEndpoints['accountGetMutationStatus'] = async (
	ctx,
	input,
) => {
	const { requestId } = input;
	const response = await makeCodaRequest<
		CodaEndpointOutputs['accountGetMutationStatus']
	>(`mutationStatus/${encodeURIComponent(requestId)}`, ctx.key, {
		method: 'GET',
	});
	await logEventFromContext(
		ctx,
		'coda.account.getMutationStatus',
		{ ...input },
		'completed',
	);
	return response;
};

export const Account = {
	whoami,
	resolveBrowserLink,
	getMutationStatus,
};
