import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** Create an OCR job resource. */
/** Official: POST /api/v2/ocrJobResources/ (`ocrJobResources_create`) */
export const ocrJobResourcesCreate: DatarobotEndpoints['ocrJobResourcesCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/ocrJobResources/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.ocrJobResourcesCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.ocrJobResources.ocrJobResourcesCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve the OCR job error report by job resource ID */
/** Official: GET /api/v2/ocrJobResources/{jobResourceId}/errorReport/ (`ocrJobResourcesErrorReport_list`) */
export const ocrJobResourcesErrorReportList: DatarobotEndpoints['ocrJobResourcesErrorReportList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/ocrJobResources/{jobResourceId}/errorReport/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['jobResourceId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.ocrJobResourcesErrorReportList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.ocrJobResources.ocrJobResourcesErrorReportList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Save the OCR job error report by job resource ID */
/** Official: PUT /api/v2/ocrJobResources/{jobResourceId}/errorReport/ (`ocrJobResourcesErrorReport_putMany`) */
export const ocrJobResourcesErrorReportPutMany: DatarobotEndpoints['ocrJobResourcesErrorReportPutMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/ocrJobResources/{jobResourceId}/errorReport/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['jobResourceId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PUT',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.ocrJobResourcesErrorReportPutMany.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.ocrJobResources.ocrJobResourcesErrorReportPutMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve per-file OCR job progress by job resource ID */
/** Official: GET /api/v2/ocrJobResources/{jobResourceId}/jobProgress/ (`ocrJobResourcesJobProgress_list`) */
export const ocrJobResourcesJobProgressList: DatarobotEndpoints['ocrJobResourcesJobProgressList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/ocrJobResources/{jobResourceId}/jobProgress/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['jobResourceId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.ocrJobResourcesJobProgressList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.ocrJobResources.ocrJobResourcesJobProgressList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve OCR job status by job resource ID */
/** Official: GET /api/v2/ocrJobResources/{jobResourceId}/jobStatus/ (`ocrJobResourcesJobStatus_list`) */
export const ocrJobResourcesJobStatusList: DatarobotEndpoints['ocrJobResourcesJobStatusList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/ocrJobResources/{jobResourceId}/jobStatus/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['jobResourceId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.ocrJobResourcesJobStatusList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.ocrJobResources.ocrJobResourcesJobStatusList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve user's OCR job resources. */
/** Official: GET /api/v2/ocrJobResources/ (`ocrJobResources_list`) */
export const ocrJobResourcesList: DatarobotEndpoints['ocrJobResourcesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/ocrJobResources/', input);
		const { query } = splitDatarobotInput(input, [], ['offset', 'limit']);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.ocrJobResourcesList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.ocrJobResources.ocrJobResourcesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve an OCR job resource by job resource ID */
/** Official: GET /api/v2/ocrJobResources/{jobResourceId}/ (`ocrJobResources_retrieve`) */
export const ocrJobResourcesRetrieve: DatarobotEndpoints['ocrJobResourcesRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/ocrJobResources/{jobResourceId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['jobResourceId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.ocrJobResourcesRetrieve.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.ocrJobResources.ocrJobResourcesRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create/start OCR job by job resource ID */
/** Official: POST /api/v2/ocrJobResources/{jobResourceId}/start/ (`ocrJobResourcesStart_create`) */
export const ocrJobResourcesStartCreate: DatarobotEndpoints['ocrJobResourcesStartCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/ocrJobResources/{jobResourceId}/start/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['jobResourceId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.ocrJobResourcesStartCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.ocrJobResources.ocrJobResourcesStartCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};
