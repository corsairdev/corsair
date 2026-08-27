import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** List deleted deployments */
/** Official: GET /api/v2/deletedDeployments/ (`deletedDeployments_list`) */
export const deletedDeploymentsList: DatarobotEndpoints['deletedDeploymentsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/deletedDeployments/', input);
		const { query } = splitDatarobotInput(input, [], ['offset', 'limit']);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deletedDeploymentsList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.deletedDeployments.deletedDeploymentsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Erase deleted deployments */
/** Official: PATCH /api/v2/deletedDeployments/ (`deletedDeployments_patchMany`) */
export const deletedDeploymentsPatchMany: DatarobotEndpoints['deletedDeploymentsPatchMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/deletedDeployments/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deletedDeploymentsPatchMany.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deletedDeployments.deletedDeploymentsPatchMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};
