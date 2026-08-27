import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** Driver configuration details by driver ID */
/** Official: GET /api/v2/externalDataDrivers/{driverId}/configuration/ (`externalDataDriversConfiguration_list`) */
export const externalDataDriversConfigurationList: DatarobotEndpoints['externalDataDriversConfigurationList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/externalDataDrivers/{driverId}/configuration/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['driverId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.externalDataDriversConfigurationList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.externalDataDrivers.externalDataDriversConfigurationList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create a new JDBC driver. */
/** Official: POST /api/v2/externalDataDrivers/ (`externalDataDrivers_create`) */
export const externalDataDriversCreate: DatarobotEndpoints['externalDataDriversCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/externalDataDrivers/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.externalDataDriversCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.externalDataDrivers.externalDataDriversCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete the driver by driver ID */
/** Official: DELETE /api/v2/externalDataDrivers/{driverId}/ (`externalDataDrivers_delete`) */
export const externalDataDriversDelete: DatarobotEndpoints['externalDataDriversDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/externalDataDrivers/{driverId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['driverId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.externalDataDriversDelete.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.externalDataDrivers.externalDataDriversDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List drivers */
/** Official: GET /api/v2/externalDataDrivers/ (`externalDataDrivers_list`) */
export const externalDataDriversList: DatarobotEndpoints['externalDataDriversList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/externalDataDrivers/', input);
		const { query } = splitDatarobotInput(input, [], ['type']);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.externalDataDriversList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.externalDataDrivers.externalDataDriversList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Update properties of an existing JDBC Driver by driver ID */
/** Official: PATCH /api/v2/externalDataDrivers/{driverId}/ (`externalDataDrivers_patch`) */
export const externalDataDriversPatch: DatarobotEndpoints['externalDataDriversPatch'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/externalDataDrivers/{driverId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['driverId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.externalDataDriversPatch.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.externalDataDrivers.externalDataDriversPatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve driver details by driver ID */
/** Official: GET /api/v2/externalDataDrivers/{driverId}/ (`externalDataDrivers_retrieve`) */
export const externalDataDriversRetrieve: DatarobotEndpoints['externalDataDriversRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/externalDataDrivers/{driverId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['driverId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.externalDataDriversRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.externalDataDrivers.externalDataDriversRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};
