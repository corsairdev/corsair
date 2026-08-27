import { logEventFromContext } from 'corsair/core';
import { makeSynthflowRequest } from '../client';
import type { SynthflowEndpoints } from '../index';
import type { SynthflowEndpointOutputs } from './types';

export const create: SynthflowEndpoints['contactsCreate'] = async (
	ctx,
	input,
) => {
	const response = await makeSynthflowRequest<
		SynthflowEndpointOutputs['contactsCreate']
	>('contacts', ctx.key, {
		method: 'POST',
		body: input,
	});

	await logEventFromContext(
		ctx,
		'synthflow.contacts.create',
		{ name: input.name, phone_number: input.phone_number },
		'completed',
	);

	return response;
};
