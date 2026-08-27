import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** Retrieve all the available events */
/** Official: GET /api/v2/eventLogs/events/ (`eventLogsEvents_list`) */
export const eventLogsEventsList: DatarobotEndpoints['eventLogsEventsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/eventLogs/events/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.eventLogsEventsList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.eventLogs.eventLogsEventsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve one page of audit log records. */
/** Official: GET /api/v2/eventLogs/ (`eventLogs_list`) */
export const eventLogsList: DatarobotEndpoints['eventLogsList'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/eventLogs/', input);
	const { query } = splitDatarobotInput(
		input,
		[],
		[
			'projectId',
			'userId',
			'orgId',
			'event',
			'minTimestamp',
			'maxTimestamp',
			'offset',
			'order',
			'includeIdentifyingFields',
			'auditReportType',
		],
	);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'GET',
		query,
	});
	const parsed = DatarobotEndpointOutputSchemas.eventLogsList.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.eventLogs.eventLogsList',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** Retrieve prediction usage data. */
/** Official: GET /api/v2/eventLogs/predictionUsage/ (`eventLogsPredictionUsage_list`) */
export const eventLogsPredictionUsageList: DatarobotEndpoints['eventLogsPredictionUsageList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/eventLogs/predictionUsage/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			[],
			[
				'projectId',
				'userId',
				'minTimestamp',
				'maxTimestamp',
				'order',
				'offset',
				'includeIdentifyingFields',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.eventLogsPredictionUsageList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.eventLogs.eventLogsPredictionUsageList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get the audit record by ID by record ID */
/** Official: GET /api/v2/eventLogs/{recordId}/ (`eventLogs_retrieve`) */
export const eventLogsRetrieve: DatarobotEndpoints['eventLogsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/eventLogs/{recordId}/', input);
		const { query } = splitDatarobotInput(
			input,
			['recordId'],
			['includeIdentifyingFields'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.eventLogsRetrieve.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.eventLogs.eventLogsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};
