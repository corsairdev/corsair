import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** Retrieve Notebook Execution Environments */
/** Official: GET /api/v2/notebookExecutionEnvironments/ (`notebookExecutionEnvironments_list`) */
export const notebookExecutionEnvironmentsList: DatarobotEndpoints['notebookExecutionEnvironmentsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/notebookExecutionEnvironments/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.notebookExecutionEnvironmentsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.notebookExecutionEnvironments.notebookExecutionEnvironmentsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve Machines */
/** Official: GET /api/v2/notebookExecutionEnvironments/machines/ (`notebookExecutionEnvironments_machines_list`) */
export const notebookExecutionEnvironmentsMachinesList: DatarobotEndpoints['notebookExecutionEnvironmentsMachinesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/notebookExecutionEnvironments/machines/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.notebookExecutionEnvironmentsMachinesList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.notebookExecutionEnvironments.notebookExecutionEnvironmentsMachinesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve Notebooks by environment ID */
/** Official: GET /api/v2/notebookExecutionEnvironments/{environmentId}/notebooks/ (`notebookExecutionEnvironments_notebooks_list`) */
export const notebookExecutionEnvironmentsNotebooksList: DatarobotEndpoints['notebookExecutionEnvironmentsNotebooksList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/notebookExecutionEnvironments/{environmentId}/notebooks/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['environmentId'],
			['ExecutionEnvironmentUsageByNotebooksQuery'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.notebookExecutionEnvironmentsNotebooksList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.notebookExecutionEnvironments.notebookExecutionEnvironmentsNotebooksList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Modify Notebook Execution Environments by notebook ID */
/** Official: PATCH /api/v2/notebookExecutionEnvironments/{notebookId}/ (`notebookExecutionEnvironments_patch`) */
export const notebookExecutionEnvironmentsPatch: DatarobotEndpoints['notebookExecutionEnvironmentsPatch'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/notebookExecutionEnvironments/{notebookId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['notebookId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.notebookExecutionEnvironmentsPatch.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.notebookExecutionEnvironments.notebookExecutionEnvironmentsPatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create Ports by notebook ID */
/** Official: POST /api/v2/notebookExecutionEnvironments/{notebookId}/ports/ (`notebookExecutionEnvironments_ports_create`) */
export const notebookExecutionEnvironmentsPortsCreate: DatarobotEndpoints['notebookExecutionEnvironmentsPortsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/notebookExecutionEnvironments/{notebookId}/ports/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['notebookId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.notebookExecutionEnvironmentsPortsCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.notebookExecutionEnvironments.notebookExecutionEnvironmentsPortsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete Ports by notebook ID */
/** Official: DELETE /api/v2/notebookExecutionEnvironments/{notebookId}/ports/ (`notebookExecutionEnvironments_ports_delete`) */
export const notebookExecutionEnvironmentsPortsDelete: DatarobotEndpoints['notebookExecutionEnvironmentsPortsDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/notebookExecutionEnvironments/{notebookId}/ports/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['notebookId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.notebookExecutionEnvironmentsPortsDelete.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.notebookExecutionEnvironments.notebookExecutionEnvironmentsPortsDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete ports by ID */
/** Official: DELETE /api/v2/notebookExecutionEnvironments/{notebookId}/ports/{portId}/ (`notebookExecutionEnvironments_ports_delete`) */
export const notebookExecutionEnvironmentsPortsDelete2: DatarobotEndpoints['notebookExecutionEnvironmentsPortsDelete2'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/notebookExecutionEnvironments/{notebookId}/ports/{portId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['notebookId', 'portId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.notebookExecutionEnvironmentsPortsDelete2.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.notebookExecutionEnvironments.notebookExecutionEnvironmentsPortsDelete2',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve Ports by notebook ID */
/** Official: GET /api/v2/notebookExecutionEnvironments/{notebookId}/ports/ (`notebookExecutionEnvironments_ports_list`) */
export const notebookExecutionEnvironmentsPortsList: DatarobotEndpoints['notebookExecutionEnvironmentsPortsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/notebookExecutionEnvironments/{notebookId}/ports/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['notebookId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.notebookExecutionEnvironmentsPortsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.notebookExecutionEnvironments.notebookExecutionEnvironmentsPortsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Modify Ports by notebook ID */
/** Official: PATCH /api/v2/notebookExecutionEnvironments/{notebookId}/ports/{portId}/ (`notebookExecutionEnvironments_ports_patch`) */
export const notebookExecutionEnvironmentsPortsPatch: DatarobotEndpoints['notebookExecutionEnvironmentsPortsPatch'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/notebookExecutionEnvironments/{notebookId}/ports/{portId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['notebookId', 'portId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.notebookExecutionEnvironmentsPortsPatch.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.notebookExecutionEnvironments.notebookExecutionEnvironmentsPortsPatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve Notebook Execution Environments by notebook ID */
/** Official: GET /api/v2/notebookExecutionEnvironments/{notebookId}/ (`notebookExecutionEnvironments_retrieve`) */
export const notebookExecutionEnvironmentsRetrieve: DatarobotEndpoints['notebookExecutionEnvironmentsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/notebookExecutionEnvironments/{notebookId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['notebookId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.notebookExecutionEnvironmentsRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.notebookExecutionEnvironments.notebookExecutionEnvironmentsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List Notebook Execution Environments versions by environment ID */
/** Official: GET /api/v2/notebookExecutionEnvironments/{environmentId}/versions/ (`notebookExecutionEnvironments_versions_list`) */
export const notebookExecutionEnvironmentsVersionsList: DatarobotEndpoints['notebookExecutionEnvironmentsVersionsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/notebookExecutionEnvironments/{environmentId}/versions/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['environmentId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.notebookExecutionEnvironmentsVersionsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.notebookExecutionEnvironments.notebookExecutionEnvironmentsVersionsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};
