import { logEventFromContext } from 'corsair/core';
import type { LexofficeEndpoints } from '..';
import { makeLexofficeRequest } from '../client';
import type { ProfileGetResponse } from './types';
import {
	LexofficeEndpointInputSchemas,
	LexofficeEndpointOutputSchemas,
} from './types';

export const get: LexofficeEndpoints['profileGet'] = async (ctx, input) => {
	LexofficeEndpointInputSchemas.profileGet.parse(input);
	const response = await makeLexofficeRequest<ProfileGetResponse>(
		'/profile',
		ctx.key,
		{ method: 'GET' },
	);
	const parsed = LexofficeEndpointOutputSchemas.profileGet.parse(response);
	await logEventFromContext(
		ctx,
		'lexoffice.profile.get',
		{ organizationId: parsed.organizationId },
		'completed',
	);
	return parsed;
};
