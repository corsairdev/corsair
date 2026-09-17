import { logEventFromContext } from 'corsair/core';
import { makePhantomBusterRequest } from '../client';
import type { PhantomBusterContext } from '../index';
import type {
	GenerateIdentityTokenInput,
	GenerateIdentityTokenResponse,
	SaveIdentityEventInput,
	SaveIdentityEventResponse,
} from './types';

export const generateToken = async (
	ctx: PhantomBusterContext,
	_input: GenerateIdentityTokenInput,
): Promise<GenerateIdentityTokenResponse> => {
	const response =
		await makePhantomBusterRequest<GenerateIdentityTokenResponse>(
			'/identities/generate-token',
			ctx.key,
			{ method: 'POST' },
		);

	await logEventFromContext(
		ctx,
		'phantombuster.identities.generateToken',
		{},
		'completed',
	);

	return response;
};

export const saveEvent = async (
	ctx: PhantomBusterContext,
	input: SaveIdentityEventInput,
): Promise<SaveIdentityEventResponse> => {
	const response = await makePhantomBusterRequest<SaveIdentityEventResponse>(
		'/identities/events/save',
		ctx.key,
		{
			method: 'POST',
			body: { ...input, event_data: { ...input.event_data } },
		},
	);

	await logEventFromContext(
		ctx,
		'phantombuster.identities.saveEvent',
		{},
		'completed',
	);

	return response;
};
