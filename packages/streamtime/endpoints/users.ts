import { logEventFromContext } from 'corsair/core';
import type { StreamtimeEndpoints } from '..';
import { makeStreamtimeRequest } from '../client';
import {
	StreamtimeEndpointInputSchemas,
	StreamtimeEndpointOutputSchemas,
} from './types';

export const listSavedSegments: StreamtimeEndpoints['listSavedSegments'] =
	async (ctx, input) => {
		const parsedInput =
			StreamtimeEndpointInputSchemas.listSavedSegments.parse(input);
		const response = await makeStreamtimeRequest<unknown>(
			`users/${parsedInput.user_id}/saved_segments`,
			ctx.key,
			{ method: 'GET' },
		);

		const parsed =
			StreamtimeEndpointOutputSchemas.listSavedSegments.parse(response);
		await logEventFromContext(
			ctx,
			'streamtime.users.listSavedSegments',
			{ ...parsedInput },
			'completed',
		);
		return parsed;
	};
