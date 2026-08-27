import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** Stream CSV data by batch job ID */
/** Official: PUT /api/v2/batchJobs/{batchJobId}/csvUpload/ (`batchJobsCsvUpload_putMany`) */
export const batchJobsCsvUploadPutMany: DatarobotEndpoints['batchJobsCsvUploadPutMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/batchJobs/{batchJobId}/csvUpload/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['batchJobId', 'partNumber'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PUT',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.batchJobsCsvUploadPutMany.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.batchJobs.batchJobsCsvUploadPutMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Cancel a Batch job by batch job ID */
/** Official: DELETE /api/v2/batchJobs/{batchJobId}/ (`batchJobs_delete`) */
export const batchJobsDelete: DatarobotEndpoints['batchJobsDelete'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/batchJobs/{batchJobId}/', input);
	const { query, body } = splitDatarobotInput(
		input,
		['batchJobId', 'partNumber'],
		[],
	);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'DELETE',
		query: undefined,
	});
	const parsed = DatarobotEndpointOutputSchemas.batchJobsDelete.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.batchJobs.batchJobsDelete',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** Download the scored data set of a batch job by batch job ID */
/** Official: GET /api/v2/batchJobs/{batchJobId}/download/ (`batchJobsDownload_list`) */
export const batchJobsDownloadList: DatarobotEndpoints['batchJobsDownloadList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/batchJobs/{batchJobId}/download/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['batchJobId', 'partNumber'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.batchJobsDownloadList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.batchJobs.batchJobsDownloadList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Launch a Batch job */
/** Official: POST /api/v2/batchJobs/fromJobDefinition/ (`batchJobsFromJobDefinition_create`) */
export const batchJobsFromJobDefinitionCreate: DatarobotEndpoints['batchJobsFromJobDefinitionCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/batchJobs/fromJobDefinition/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.batchJobsFromJobDefinitionCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.batchJobs.batchJobsFromJobDefinitionCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List batch jobs */
/** Official: GET /api/v2/batchJobs/ (`batchJobs_list`) */
export const batchJobsList: DatarobotEndpoints['batchJobsList'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/batchJobs/', input);
	const { query } = splitDatarobotInput(
		input,
		[],
		[
			'offset',
			'limit',
			'status',
			'source',
			'deploymentId',
			'modelId',
			'jobId',
			'orderBy',
			'allJobs',
			'cutoffHours',
			'startDateTime',
			'endDateTime',
			'batchPredictionJobDefinitionId',
			'hostname',
			'batchJobType',
			'intakeType',
			'outputType',
		],
	);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'GET',
		query,
	});
	const parsed = DatarobotEndpointOutputSchemas.batchJobsList.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.batchJobs.batchJobsList',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** Retrieve Batch job by batch job ID */
/** Official: GET /api/v2/batchJobs/{batchJobId}/ (`batchJobs_retrieve`) */
export const batchJobsRetrieve: DatarobotEndpoints['batchJobsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/batchJobs/{batchJobId}/', input);
		const { query, body } = splitDatarobotInput(
			input,
			['batchJobId', 'partNumber'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.batchJobsRetrieve.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.batchJobs.batchJobsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};
