import { logEventFromContext } from 'corsair/core';
import type { ChMeetingsEndpoints } from '..';
import { ChMeetingsAPIError, makeChMeetingsRequest } from '../client';
import type { ChMeetingsEndpointOutputs } from './types';

export const get: ChMeetingsEndpoints['personGet'] = async (ctx, input) => {
	// ChMeetings wraps successful responses in a
	// `{ status_code, errors, data }` envelope; the useful payload is the
	// unwrapped `data` object.
	const response = await makeChMeetingsRequest<{
		status_code?: number;
		errors?: string[] | null;
		data?: ChMeetingsEndpointOutputs['personGet'];
	}>(`people/${input.id}`, ctx.key, { method: 'GET' });

	if (!response.data) {
		throw new ChMeetingsAPIError(
			`Person ${input.id} not found${response.errors ? `: ${response.errors.join(', ')}` : ''}`,
		);
	}

	await logEventFromContext(
		ctx,
		'chmeetings.person.get',
		{ ...input },
		'completed',
	);
	return response.data;
};
