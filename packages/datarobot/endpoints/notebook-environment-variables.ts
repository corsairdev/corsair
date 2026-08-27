import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** Create Notebook Environment Variables by notebook ID */
/** Official: POST /api/v2/notebookEnvironmentVariables/{notebookId}/ (`notebookEnvironmentVariables_create`) */
export const notebookEnvironmentVariablesCreate: DatarobotEndpoints['notebookEnvironmentVariablesCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/notebookEnvironmentVariables/{notebookId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['notebookId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.notebookEnvironmentVariablesCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.notebookEnvironmentVariables.notebookEnvironmentVariablesCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete Notebook Environment Variables by notebook ID */
/** Official: DELETE /api/v2/notebookEnvironmentVariables/{notebookId}/ (`notebookEnvironmentVariables_delete`) */
export const notebookEnvironmentVariablesDelete: DatarobotEndpoints['notebookEnvironmentVariablesDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/notebookEnvironmentVariables/{notebookId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['notebookId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.notebookEnvironmentVariablesDelete.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.notebookEnvironmentVariables.notebookEnvironmentVariablesDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete notebook environment variables by ID */
/** Official: DELETE /api/v2/notebookEnvironmentVariables/{notebookId}/{envVarId}/ (`notebookEnvironmentVariables_delete`) */
export const notebookEnvironmentVariablesDelete2: DatarobotEndpoints['notebookEnvironmentVariablesDelete2'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/notebookEnvironmentVariables/{notebookId}/{envVarId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['notebookId', 'envVarId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.notebookEnvironmentVariablesDelete2.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.notebookEnvironmentVariables.notebookEnvironmentVariablesDelete2',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Modify Notebook Environment Variables by notebook ID */
/** Official: PATCH /api/v2/notebookEnvironmentVariables/{notebookId}/{envVarId}/ (`notebookEnvironmentVariables_patch`) */
export const notebookEnvironmentVariablesPatch: DatarobotEndpoints['notebookEnvironmentVariablesPatch'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/notebookEnvironmentVariables/{notebookId}/{envVarId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['notebookId', 'envVarId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.notebookEnvironmentVariablesPatch.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.notebookEnvironmentVariables.notebookEnvironmentVariablesPatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve Notebook Environment Variables by notebook ID */
/** Official: GET /api/v2/notebookEnvironmentVariables/{notebookId}/ (`notebookEnvironmentVariables_retrieve`) */
export const notebookEnvironmentVariablesRetrieve: DatarobotEndpoints['notebookEnvironmentVariablesRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/notebookEnvironmentVariables/{notebookId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['notebookId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.notebookEnvironmentVariablesRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.notebookEnvironmentVariables.notebookEnvironmentVariablesRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};
