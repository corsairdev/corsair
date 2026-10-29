import { logEventFromContext } from 'corsair/core';
import type { TimelinkEndpoints } from '..';
import { makeTimelinkRequest } from '../client';
import {
	TimelinkEndpointInputSchemas,
	TimelinkEndpointOutputSchemas,
} from './types';

export const deletePerson: TimelinkEndpoints['deletePerson'] = async (
	ctx,
	input,
) => {
	const parsed = TimelinkEndpointInputSchemas.deletePerson.parse(input);

	const response = await makeTimelinkRequest(
		`clients/${encodeURIComponent(parsed.id)}`,
		ctx.key,
		{
			method: 'DELETE',
		},
	);

	await logEventFromContext(ctx, 'timelink.delete.person', parsed, 'completed');

	return TimelinkEndpointOutputSchemas.deletePerson.parse(response);
};
