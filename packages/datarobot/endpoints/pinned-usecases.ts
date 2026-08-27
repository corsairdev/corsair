import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** Retrieve Pinned Usecases */
/** Official: GET /api/v2/pinnedUsecases/ (`pinnedUsecases_list`) */
export const pinnedUsecasesList: DatarobotEndpoints['pinnedUsecasesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/pinnedUsecases/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.pinnedUsecasesList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.pinnedUsecases.pinnedUsecasesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Modify Pinned Usecases */
/** Official: PATCH /api/v2/pinnedUsecases/ (`pinnedUsecases_patchMany`) */
export const pinnedUsecasesPatchMany: DatarobotEndpoints['pinnedUsecasesPatchMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/pinnedUsecases/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.pinnedUsecasesPatchMany.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.pinnedUsecases.pinnedUsecasesPatchMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};
