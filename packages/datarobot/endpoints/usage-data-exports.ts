import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** Create a customer usage data artifact request */
/** Official: POST /api/v2/usageDataExports/ (`usageDataExports_create`) */
export const usageDataExportsCreate: DatarobotEndpoints['usageDataExportsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/usageDataExports/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.usageDataExportsCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.usageDataExports.usageDataExportsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve a prepared customer usage data artifact by artifact ID */
/** Official: GET /api/v2/usageDataExports/{artifactId}/ (`usageDataExports_retrieve`) */
export const usageDataExportsRetrieve: DatarobotEndpoints['usageDataExportsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/usageDataExports/{artifactId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['artifactId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.usageDataExportsRetrieve.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.usageDataExports.usageDataExportsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Describe supported available audit events with */
/** Official: GET /api/v2/usageDataExports/supportedEvents/ (`usageDataExportsSupportedEvents_list`) */
export const usageDataExportsSupportedEventsList: DatarobotEndpoints['usageDataExportsSupportedEventsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/usageDataExports/supportedEvents/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.usageDataExportsSupportedEventsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.usageDataExports.usageDataExportsSupportedEventsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};
