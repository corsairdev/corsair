import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** Cancel Notebook jobs by notebook schedule ID */
/** Official: POST /api/v2/notebookJobs/{notebookScheduleId}/cancel/ (`notebookJobs_cancel_create`) */
export const notebookJobsCancelCreate: DatarobotEndpoints['notebookJobsCancelCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/notebookJobs/{notebookScheduleId}/cancel/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['notebookScheduleId'],
			['CancelScheduledJobsQuery'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.notebookJobsCancelCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.notebookJobs.notebookJobsCancelCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create Notebook jobs */
/** Official: POST /api/v2/notebookJobs/ (`notebookJobs_create`) */
export const notebookJobsCreate: DatarobotEndpoints['notebookJobsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/notebookJobs/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.notebookJobsCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.notebookJobs.notebookJobsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete Notebook jobs by notebook schedule ID */
/** Official: DELETE /api/v2/notebookJobs/{notebookScheduleId}/ (`notebookJobs_delete`) */
export const notebookJobsDelete: DatarobotEndpoints['notebookJobsDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/notebookJobs/{notebookScheduleId}/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['notebookScheduleId'],
			['DeleteScheduledJobQuery'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.notebookJobsDelete.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.notebookJobs.notebookJobsDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve Notebook jobs */
/** Official: GET /api/v2/notebookJobs/ (`notebookJobs_list`) */
export const notebookJobsList: DatarobotEndpoints['notebookJobsList'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/notebookJobs/', input);
	const { query } = splitDatarobotInput(input, [], ['ListScheduledJobQuery']);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'GET',
		query,
	});
	const parsed =
		DatarobotEndpointOutputSchemas.notebookJobsList.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.notebookJobs.notebookJobsList',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** Create Manual Run */
/** Official: POST /api/v2/notebookJobs/manualRun/ (`notebookJobs_manualRun_create`) */
export const notebookJobsManualRunCreate: DatarobotEndpoints['notebookJobsManualRunCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/notebookJobs/manualRun/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.notebookJobsManualRunCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.notebookJobs.notebookJobsManualRunCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Modify Notebook jobs by notebook schedule ID */
/** Official: PATCH /api/v2/notebookJobs/{notebookScheduleId}/ (`notebookJobs_patch`) */
export const notebookJobsPatch: DatarobotEndpoints['notebookJobsPatch'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/notebookJobs/{notebookScheduleId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['notebookScheduleId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.notebookJobsPatch.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.notebookJobs.notebookJobsPatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve Notebook jobs by notebook schedule ID */
/** Official: GET /api/v2/notebookJobs/{notebookScheduleId}/ (`notebookJobs_retrieve`) */
export const notebookJobsRetrieve: DatarobotEndpoints['notebookJobsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/notebookJobs/{notebookScheduleId}/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['notebookScheduleId'],
			['ScheduledJobQuery'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.notebookJobsRetrieve.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.notebookJobs.notebookJobsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve Run history */
/** Official: GET /api/v2/notebookJobs/runHistory/ (`notebookJobs_runHistory_list`) */
export const notebookJobsRunHistoryList: DatarobotEndpoints['notebookJobsRunHistoryList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/notebookJobs/runHistory/', input);
		const { query } = splitDatarobotInput(
			input,
			[],
			['ListScheduledRunsHistoryQuery'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.notebookJobsRunHistoryList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.notebookJobs.notebookJobsRunHistoryList',
			input ?? {},
			'completed',
		);
		return parsed;
	};
