import { logEventFromContext } from 'corsair/core';
import type { WisepopsEndpoints } from '..';
import { makeWisepopsRequest } from '../client';
import type { WisepopsEndpointOutputs } from './types';

export const deleteData: WisepopsEndpoints['dataPrivacyDelete'] = async (
	ctx,
	input,
) => {
	const response = await makeWisepopsRequest<
		WisepopsEndpointOutputs['dataPrivacyDelete']
	>('api2/data-privacy', ctx.key, { method: 'DELETE', body: input });

	await logEventFromContext(
		ctx,
		'wisepops.dataPrivacy.delete',
		{ ...input },
		'completed',
	);
	return response;
};
