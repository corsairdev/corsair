import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** Create a guard configuration. */
/** Official: POST /api/v2/guardConfigurations/ (`guardConfigurations_create`) */
export const guardConfigurationsCreate: DatarobotEndpoints['guardConfigurationsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/guardConfigurations/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.guardConfigurationsCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.guardConfigurations.guardConfigurationsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete a guard config by config ID */
/** Official: DELETE /api/v2/guardConfigurations/{configId}/ (`guardConfigurations_delete`) */
export const guardConfigurationsDelete: DatarobotEndpoints['guardConfigurationsDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/guardConfigurations/{configId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['configId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.guardConfigurationsDelete.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.guardConfigurations.guardConfigurationsDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** The list of resource tags. */
/** Official: GET /api/v2/guardConfigurations/ (`guardConfigurations_list`) */
export const guardConfigurationsList: DatarobotEndpoints['guardConfigurationsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/guardConfigurations/', input);
		const { query } = splitDatarobotInput(
			input,
			[],
			['offset', 'limit', 'entityId', 'entityType'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.guardConfigurationsList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.guardConfigurations.guardConfigurationsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Update a guard config by config ID */
/** Official: PATCH /api/v2/guardConfigurations/{configId}/ (`guardConfigurations_patch`) */
export const guardConfigurationsPatch: DatarobotEndpoints['guardConfigurationsPatch'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/guardConfigurations/{configId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['configId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.guardConfigurationsPatch.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.guardConfigurations.guardConfigurationsPatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Show the prediction environments in use */
/** Official: GET /api/v2/guardConfigurations/predictionEnvironmentsInUse/ (`guardConfigurationsPredictionEnvironmentsInUse_list`) */
export const guardConfigurationsPredictionEnvironmentsInUseList: DatarobotEndpoints['guardConfigurationsPredictionEnvironmentsInUseList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/guardConfigurations/predictionEnvironmentsInUse/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			[],
			['offset', 'limit', 'customModelVersionId'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.guardConfigurationsPredictionEnvironmentsInUseList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.guardConfigurations.guardConfigurationsPredictionEnvironmentsInUseList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve info about a guard configuration by config ID */
/** Official: GET /api/v2/guardConfigurations/{configId}/ (`guardConfigurations_retrieve`) */
export const guardConfigurationsRetrieve: DatarobotEndpoints['guardConfigurationsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/guardConfigurations/{configId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['configId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.guardConfigurationsRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.guardConfigurations.guardConfigurationsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Apply moderation configuration */
/** Official: POST /api/v2/guardConfigurations/toNewCustomModelVersion/ (`guardConfigurationsToNewCustomModelVersion_create`) */
export const guardConfigurationsToNewCustomModelVersionCreate: DatarobotEndpoints['guardConfigurationsToNewCustomModelVersionCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/guardConfigurations/toNewCustomModelVersion/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.guardConfigurationsToNewCustomModelVersionCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.guardConfigurations.guardConfigurationsToNewCustomModelVersionCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};
