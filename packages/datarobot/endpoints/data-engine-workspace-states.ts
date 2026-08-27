import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** Create Data Engine workspace state. */
/** Official: POST /api/v2/dataEngineWorkspaceStates/ (`dataEngineWorkspaceStates_create`) */
export const dataEngineWorkspaceStatesCreate: DatarobotEndpoints['dataEngineWorkspaceStatesCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/dataEngineWorkspaceStates/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.dataEngineWorkspaceStatesCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.dataEngineWorkspaceStates.dataEngineWorkspaceStatesCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create Data Engine workspace state */
/** Official: POST /api/v2/dataEngineWorkspaceStates/fromDataEngineQueryGenerator/ (`dataEngineWorkspaceStatesFromDataEngineQueryGenerator_create`) */
export const dataEngineWorkspaceStatesFromDataEngineQueryGeneratorCreate: DatarobotEndpoints['dataEngineWorkspaceStatesFromDataEngineQueryGeneratorCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/dataEngineWorkspaceStates/fromDataEngineQueryGenerator/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.dataEngineWorkspaceStatesFromDataEngineQueryGeneratorCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.dataEngineWorkspaceStates.dataEngineWorkspaceStatesFromDataEngineQueryGeneratorCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Read Data Engine workspace state by workspace state ID */
/** Official: GET /api/v2/dataEngineWorkspaceStates/{workspaceStateId}/ (`dataEngineWorkspaceStates_retrieve`) */
export const dataEngineWorkspaceStatesRetrieve: DatarobotEndpoints['dataEngineWorkspaceStatesRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/dataEngineWorkspaceStates/{workspaceStateId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['workspaceStateId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.dataEngineWorkspaceStatesRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.dataEngineWorkspaceStates.dataEngineWorkspaceStatesRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};
