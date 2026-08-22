import { logEventFromContext } from 'corsair/core';
import type { ZoominfoContext } from '..';
import { makeZoominfoRequest } from '../client';
import type { ZoominfoEndpointOutputs } from './types';

export const searchCompanies = async (
	ctx: ZoominfoContext,
	input: {
		companyName?: string;
		industry?: string;
		location?: string;
		employeeCountMin?: number;
		employeeCountMax?: number;
	},
): Promise<ZoominfoEndpointOutputs['searchCompanies']> => {
	const response = await makeZoominfoRequest<
		ZoominfoEndpointOutputs['searchCompanies']
	>('contacts/search', ctx.key, {
		method: 'POST',
		body: { ...input },
	});

	await logEventFromContext(
		ctx,
		'zoominfo.searchCompanies',
		{ ...input },
		'completed',
	);

	return response;
};
