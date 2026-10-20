import { logEventFromContext } from 'corsair/core';
import type { ClayEndpoints } from '..';
import { makeClayRequest } from '../client';
import { ClayEndpointInputSchemas, ClayEndpointOutputSchemas } from './types';

export const me: ClayEndpoints['accountMe'] = async (ctx, input) => {
	ClayEndpointInputSchemas.accountMe.parse(input ?? {});
	const result = ClayEndpointOutputSchemas.accountMe.parse(
		await makeClayRequest('me', ctx.key),
	);
	await logEventFromContext(
		ctx,
		'clay.account.me',
		{ workspaceId: result.workspace.id },
		'completed',
	);
	return result;
};

export const credits: ClayEndpoints['accountCredits'] = async (ctx, input) => {
	ClayEndpointInputSchemas.accountCredits.parse(input ?? {});
	const result = ClayEndpointOutputSchemas.accountCredits.parse(
		await makeClayRequest('credits/balance', ctx.key),
	);
	await logEventFromContext(
		ctx,
		'clay.account.credits',
		{ balance: result.balance },
		'completed',
	);
	return result;
};
