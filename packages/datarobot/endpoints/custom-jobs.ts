import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** Create a custom job. */
/** Official: POST /api/v2/customJobs/ (`customJobs_create`) */
export const customJobsCreate: DatarobotEndpoints['customJobsCreate'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/customJobs/', input);
	const { query, body } = splitDatarobotInput(input, [], []);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'POST',
		query,
		body,
	});
	const parsed =
		DatarobotEndpointOutputSchemas.customJobsCreate.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.customJobs.customJobsCreate',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** Delete a custom metric associated by custom job ID */
/** Official: DELETE /api/v2/customJobs/{customJobId}/customMetrics/{customMetricId}/ (`customJobsCustomMetrics_delete`) */
export const customJobsCustomMetricsDelete: DatarobotEndpoints['customJobsCustomMetricsDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customJobs/{customJobId}/customMetrics/{customMetricId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['customJobId', 'customMetricId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customJobsCustomMetricsDelete.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.customJobs.customJobsCustomMetricsDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List all of the custom metrics associated by custom job ID */
/** Official: GET /api/v2/customJobs/{customJobId}/customMetrics/ (`customJobsCustomMetrics_list`) */
export const customJobsCustomMetricsList: DatarobotEndpoints['customJobsCustomMetricsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customJobs/{customJobId}/customMetrics/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['customJobId'],
			['offset', 'limit'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customJobsCustomMetricsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.customJobs.customJobsCustomMetricsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Update custom metric associated by custom job ID */
/** Official: PATCH /api/v2/customJobs/{customJobId}/customMetrics/{customMetricId}/ (`customJobsCustomMetrics_patch`) */
export const customJobsCustomMetricsPatch: DatarobotEndpoints['customJobsCustomMetricsPatch'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customJobs/{customJobId}/customMetrics/{customMetricId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['customJobId', 'customMetricId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customJobsCustomMetricsPatch.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.customJobs.customJobsCustomMetricsPatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete custom job by custom job ID */
/** Official: DELETE /api/v2/customJobs/{customJobId}/ (`customJobs_delete`) */
export const customJobsDelete: DatarobotEndpoints['customJobsDelete'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/customJobs/{customJobId}/', input);
	const { query, body } = splitDatarobotInput(input, ['customJobId'], []);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'DELETE',
		query: undefined,
	});
	const parsed =
		DatarobotEndpointOutputSchemas.customJobsDelete.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.customJobs.customJobsDelete',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** Create a custom jobs from a gallery template */
/** Official: POST /api/v2/customJobs/fromGalleryTemplate/ (`customJobsFromGalleryTemplate_create`) */
export const customJobsFromGalleryTemplateCreate: DatarobotEndpoints['customJobsFromGalleryTemplateCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customJobs/fromGalleryTemplate/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customJobsFromGalleryTemplateCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.customJobs.customJobsFromGalleryTemplateCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Creates a custom job */
/** Official: POST /api/v2/customJobs/fromHostedCustomMetricGalleryTemplate/ (`customJobsFromHostedCustomMetricGalleryTemplate_create`) */
export const customJobsFromHostedCustomMetricGalleryTemplateCreate: DatarobotEndpoints['customJobsFromHostedCustomMetricGalleryTemplateCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customJobs/fromHostedCustomMetricGalleryTemplate/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customJobsFromHostedCustomMetricGalleryTemplateCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.customJobs.customJobsFromHostedCustomMetricGalleryTemplateCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Creates a template by custom job ID */
/** Official: POST /api/v2/customJobs/{customJobId}/hostedCustomMetricTemplate/ (`customJobsHostedCustomMetricTemplate_create`) */
export const customJobsHostedCustomMetricTemplateCreate: DatarobotEndpoints['customJobsHostedCustomMetricTemplateCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customJobs/{customJobId}/hostedCustomMetricTemplate/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['customJobId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customJobsHostedCustomMetricTemplateCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.customJobs.customJobsHostedCustomMetricTemplateCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve a template by custom job ID */
/** Official: GET /api/v2/customJobs/{customJobId}/hostedCustomMetricTemplate/ (`customJobsHostedCustomMetricTemplate_list`) */
export const customJobsHostedCustomMetricTemplateList: DatarobotEndpoints['customJobsHostedCustomMetricTemplateList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customJobs/{customJobId}/hostedCustomMetricTemplate/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['customJobId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customJobsHostedCustomMetricTemplateList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.customJobs.customJobsHostedCustomMetricTemplateList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Updates a template by custom job ID */
/** Official: PATCH /api/v2/customJobs/{customJobId}/hostedCustomMetricTemplate/ (`customJobsHostedCustomMetricTemplate_patchMany`) */
export const customJobsHostedCustomMetricTemplatePatchMany: DatarobotEndpoints['customJobsHostedCustomMetricTemplatePatchMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customJobs/{customJobId}/hostedCustomMetricTemplate/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['customJobId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customJobsHostedCustomMetricTemplatePatchMany.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.customJobs.customJobsHostedCustomMetricTemplatePatchMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve custom job file content by custom job ID */
/** Official: GET /api/v2/customJobs/{customJobId}/items/{itemId}/ (`customJobsItems_retrieve`) */
export const customJobsItemsRetrieve: DatarobotEndpoints['customJobsItemsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customJobs/{customJobId}/items/{itemId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['customJobId', 'itemId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customJobsItemsRetrieve.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.customJobs.customJobsItemsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List custom jobs. */
/** Official: GET /api/v2/customJobs/ (`customJobs_list`) */
export const customJobsList: DatarobotEndpoints['customJobsList'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/customJobs/', input);
	const { query } = splitDatarobotInput(
		input,
		[],
		['offset', 'limit', 'onlyRunning', 'search', 'jobType'],
	);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'GET',
		query,
	});
	const parsed = DatarobotEndpointOutputSchemas.customJobsList.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.customJobs.customJobsList',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** Update custom job by custom job ID */
/** Official: PATCH /api/v2/customJobs/{customJobId}/ (`customJobs_patch`) */
export const customJobsPatch: DatarobotEndpoints['customJobsPatch'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/customJobs/{customJobId}/', input);
	const { query, body } = splitDatarobotInput(input, ['customJobId'], []);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'PATCH',
		query,
		body,
	});
	const parsed = DatarobotEndpointOutputSchemas.customJobsPatch.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.customJobs.customJobsPatch',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** Retrieve custom job by custom job ID */
/** Official: GET /api/v2/customJobs/{customJobId}/ (`customJobs_retrieve`) */
export const customJobsRetrieve: DatarobotEndpoints['customJobsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/customJobs/{customJobId}/', input);
		const { query, body } = splitDatarobotInput(input, ['customJobId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customJobsRetrieve.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.customJobs.customJobsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create a custom job run by custom job ID */
/** Official: POST /api/v2/customJobs/{customJobId}/runs/ (`customJobsRuns_create`) */
export const customJobsRunsCreate: DatarobotEndpoints['customJobsRunsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customJobs/{customJobId}/runs/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['customJobId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customJobsRunsCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.customJobs.customJobsRunsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Cancel custom job run by custom job ID */
/** Official: DELETE /api/v2/customJobs/{customJobId}/runs/{customJobRunId}/ (`customJobsRuns_delete`) */
export const customJobsRunsDelete: DatarobotEndpoints['customJobsRunsDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customJobs/{customJobId}/runs/{customJobRunId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['customJobId', 'customJobRunId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customJobsRunsDelete.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.customJobs.customJobsRunsDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve custom job run file content by custom job ID */
/** Official: GET /api/v2/customJobs/{customJobId}/runs/{customJobRunId}/items/{itemId}/ (`customJobsRunsItems_retrieve`) */
export const customJobsRunsItemsRetrieve: DatarobotEndpoints['customJobsRunsItemsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customJobs/{customJobId}/runs/{customJobRunId}/items/{itemId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['customJobId', 'customJobRunId', 'itemId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customJobsRunsItemsRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.customJobs.customJobsRunsItemsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List custom job runs by custom job ID */
/** Official: GET /api/v2/customJobs/{customJobId}/runs/ (`customJobsRuns_list`) */
export const customJobsRunsList: DatarobotEndpoints['customJobsRunsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customJobs/{customJobId}/runs/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['customJobId'],
			['offset', 'limit', 'scheduledJobId'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customJobsRunsList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.customJobs.customJobsRunsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** De,ete custom job run logs by custom job ID */
/** Official: DELETE /api/v2/customJobs/{customJobId}/runs/{customJobRunId}/logs/ (`customJobsRunsLogs_deleteMany`) */
export const customJobsRunsLogsDeleteMany: DatarobotEndpoints['customJobsRunsLogsDeleteMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customJobs/{customJobId}/runs/{customJobRunId}/logs/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['customJobId', 'customJobRunId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customJobsRunsLogsDeleteMany.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.customJobs.customJobsRunsLogsDeleteMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve custom job run logs by custom job ID */
/** Official: GET /api/v2/customJobs/{customJobId}/runs/{customJobRunId}/logs/ (`customJobsRunsLogs_list`) */
export const customJobsRunsLogsList: DatarobotEndpoints['customJobsRunsLogsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customJobs/{customJobId}/runs/{customJobRunId}/logs/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['customJobId', 'customJobRunId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customJobsRunsLogsList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.customJobs.customJobsRunsLogsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Update custom job run by custom job ID */
/** Official: PATCH /api/v2/customJobs/{customJobId}/runs/{customJobRunId}/ (`customJobsRuns_patch`) */
export const customJobsRunsPatch: DatarobotEndpoints['customJobsRunsPatch'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customJobs/{customJobId}/runs/{customJobRunId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['customJobId', 'customJobRunId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customJobsRunsPatch.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.customJobs.customJobsRunsPatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve custom job run by custom job ID */
/** Official: GET /api/v2/customJobs/{customJobId}/runs/{customJobRunId}/ (`customJobsRuns_retrieve`) */
export const customJobsRunsRetrieve: DatarobotEndpoints['customJobsRunsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customJobs/{customJobId}/runs/{customJobRunId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['customJobId', 'customJobRunId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customJobsRunsRetrieve.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.customJobs.customJobsRunsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get Custom Job's access control list by custom job ID */
/** Official: GET /api/v2/customJobs/{customJobId}/sharedRoles/ (`customJobsSharedRoles_list`) */
export const customJobsSharedRolesList: DatarobotEndpoints['customJobsSharedRolesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customJobs/{customJobId}/sharedRoles/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['customJobId'],
			['id', 'offset', 'limit', 'name', 'shareRecipientType'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customJobsSharedRolesList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.customJobs.customJobsSharedRolesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Update Custom Job's controls by custom job ID */
/** Official: PATCH /api/v2/customJobs/{customJobId}/sharedRoles/ (`customJobsSharedRoles_patchMany`) */
export const customJobsSharedRolesPatchMany: DatarobotEndpoints['customJobsSharedRolesPatchMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customJobs/{customJobId}/sharedRoles/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['customJobId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customJobsSharedRolesPatchMany.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.customJobs.customJobsSharedRolesPatchMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};
