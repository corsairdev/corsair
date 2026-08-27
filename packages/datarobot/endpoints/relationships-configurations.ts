import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** Create a relationships configuration */
/** Official: POST /api/v2/relationshipsConfigurations/ (`relationshipsConfigurations_create`) */
export const relationshipsConfigurationsCreate: DatarobotEndpoints['relationshipsConfigurationsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/relationshipsConfigurations/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.relationshipsConfigurationsCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.relationshipsConfigurations.relationshipsConfigurationsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete a relationships configuration by relationships configuration ID */
/** Official: DELETE /api/v2/relationshipsConfigurations/{relationshipsConfigurationId}/ (`relationshipsConfigurations_delete`) */
export const relationshipsConfigurationsDelete: DatarobotEndpoints['relationshipsConfigurationsDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/relationshipsConfigurations/{relationshipsConfigurationId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['relationshipsConfigurationId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.relationshipsConfigurationsDelete.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.relationshipsConfigurations.relationshipsConfigurationsDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Replace a relationships configuration by relationships configuration ID */
/** Official: PUT /api/v2/relationshipsConfigurations/{relationshipsConfigurationId}/ (`relationshipsConfigurations_put`) */
export const relationshipsConfigurationsPut: DatarobotEndpoints['relationshipsConfigurationsPut'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/relationshipsConfigurations/{relationshipsConfigurationId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['relationshipsConfigurationId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PUT',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.relationshipsConfigurationsPut.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.relationshipsConfigurations.relationshipsConfigurationsPut',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve a relationships configuration by relationships configuration ID */
/** Official: GET /api/v2/relationshipsConfigurations/{relationshipsConfigurationId}/ (`relationshipsConfigurations_retrieve`) */
export const relationshipsConfigurationsRetrieve: DatarobotEndpoints['relationshipsConfigurationsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/relationshipsConfigurations/{relationshipsConfigurationId}/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['relationshipsConfigurationId'],
			['includeRelationshipQuality'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.relationshipsConfigurationsRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.relationshipsConfigurations.relationshipsConfigurationsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve the relationships configuration by relationships configuration ID */
/** Official: GET /api/v2/relationshipsConfigurations/{relationshipsConfigurationId}/projects/{projectId}/ (`relationshipsConfigurations_retrieveExtended`) */
export const relationshipsConfigurationsRetrieveExtended: DatarobotEndpoints['relationshipsConfigurationsRetrieveExtended'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/relationshipsConfigurations/{relationshipsConfigurationId}/projects/{projectId}/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['relationshipsConfigurationId', 'projectId'],
			['includeRelationshipQuality'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.relationshipsConfigurationsRetrieveExtended.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.relationshipsConfigurations.relationshipsConfigurationsRetrieveExtended',
			input ?? {},
			'completed',
		);
		return parsed;
	};
