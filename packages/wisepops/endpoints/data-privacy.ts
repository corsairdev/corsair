import { logEventFromContext } from 'corsair/core';
import type { WisepopsEndpoints } from '..';
import { makeWisepopsRequest } from '../client';
import type { WisepopsEndpointOutputs } from './types';
import {
	WisepopsEndpointInputSchemas,
	WisepopsEndpointOutputSchemas,
} from './types';

export const deleteData: WisepopsEndpoints['dataPrivacyDelete'] = async (
	ctx,
	input,
) => {
	const validatedInput =
		WisepopsEndpointInputSchemas.dataPrivacyDelete.parse(input);
	const response = await makeWisepopsRequest<
		WisepopsEndpointOutputs['dataPrivacyDelete']
	>('api2/data-privacy', ctx.key, {
		method: 'DELETE',
		body: validatedInput,
	});

	await logEventFromContext(
		ctx,
		'wisepops.dataPrivacy.delete',
		{},
		'completed',
	);
	return WisepopsEndpointOutputSchemas.dataPrivacyDelete.parse(response);
};
