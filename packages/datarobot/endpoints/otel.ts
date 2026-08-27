import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** Delete all OpenTelemetry logs by entitytype */
/** Official: DELETE /api/v2/otel/{entityType}/{entityId}/logs/ (`otelLogs_deleteMany`) */
export const otelLogsDeleteMany: DatarobotEndpoints['otelLogsDeleteMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/otel/{entityType}/{entityId}/logs/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['entityType', 'entityId'],
			['startTime', 'endTime', 'searchKeys', 'searchValues'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.otelLogsDeleteMany.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.otel.otelLogsDeleteMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve OpenTelemetry logs by entitytype */
/** Official: GET /api/v2/otel/{entityType}/{entityId}/logs/ (`otelLogs_list`) */
export const otelLogsList: DatarobotEndpoints['otelLogsList'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath(
		'/api/v2/otel/{entityType}/{entityId}/logs/',
		input,
	);
	const { query } = splitDatarobotInput(
		input,
		['entityType', 'entityId'],
		[
			'offset',
			'limit',
			'startTime',
			'endTime',
			'searchKeys',
			'searchValues',
			'level',
			'includes',
			'excludes',
			'spanId',
			'traceId',
		],
	);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'GET',
		query,
	});
	const parsed = DatarobotEndpointOutputSchemas.otelLogsList.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.otel.otelLogsList',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** List pods and containers found by entitytype */
/** Official: GET /api/v2/otel/{entityType}/{entityId}/logs/podInfo/ (`otelLogsPodInfo_list`) */
export const otelLogsPodInfoList: DatarobotEndpoints['otelLogsPodInfoList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/otel/{entityType}/{entityId}/logs/podInfo/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['entityType', 'entityId'],
			['startTime', 'endTime', 'searchKeys', 'searchValues'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.otelLogsPodInfoList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.otel.otelLogsPodInfoList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get aggregated values of OpenTelemetry metrics that DataRobot automatically collects by entitytype */
/** Official: GET /api/v2/otel/{entityType}/{entityId}/metrics/autocollectedValues/ (`otelMetricsAutocollectedValues_list`) */
export const otelMetricsAutocollectedValuesList: DatarobotEndpoints['otelMetricsAutocollectedValuesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/otel/{entityType}/{entityId}/metrics/autocollectedValues/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['entityType', 'entityId'],
			['startTime', 'endTime', 'searchKeys', 'searchValues'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.otelMetricsAutocollectedValuesList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.otel.otelMetricsAutocollectedValuesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create an OpenTelemetry metric configuration by entitytype */
/** Official: POST /api/v2/otel/{entityType}/{entityId}/metrics/configs/ (`otelMetricsConfigs_create`) */
export const otelMetricsConfigsCreate: DatarobotEndpoints['otelMetricsConfigsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/otel/{entityType}/{entityId}/metrics/configs/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['entityType', 'entityId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.otelMetricsConfigsCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.otel.otelMetricsConfigsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete an OpenTelemetry metric configuration by entitytype */
/** Official: DELETE /api/v2/otel/{entityType}/{entityId}/metrics/configs/{otelMetricId}/ (`otelMetricsConfigs_delete`) */
export const otelMetricsConfigsDelete: DatarobotEndpoints['otelMetricsConfigsDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/otel/{entityType}/{entityId}/metrics/configs/{otelMetricId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['entityType', 'entityId', 'otelMetricId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.otelMetricsConfigsDelete.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.otel.otelMetricsConfigsDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List the OpenTelemetry metric configurations by entitytype */
/** Official: GET /api/v2/otel/{entityType}/{entityId}/metrics/configs/ (`otelMetricsConfigs_list`) */
export const otelMetricsConfigsList: DatarobotEndpoints['otelMetricsConfigsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/otel/{entityType}/{entityId}/metrics/configs/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['entityType', 'entityId'],
			['offset', 'limit'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.otelMetricsConfigsList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.otel.otelMetricsConfigsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Update an OpenTelemetry metric configuration by entitytype */
/** Official: PATCH /api/v2/otel/{entityType}/{entityId}/metrics/configs/{otelMetricId}/ (`otelMetricsConfigs_patch`) */
export const otelMetricsConfigsPatch: DatarobotEndpoints['otelMetricsConfigsPatch'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/otel/{entityType}/{entityId}/metrics/configs/{otelMetricId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['entityType', 'entityId', 'otelMetricId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.otelMetricsConfigsPatch.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.otel.otelMetricsConfigsPatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Set all the OpenTelemetry metric configurations by entitytype */
/** Official: PUT /api/v2/otel/{entityType}/{entityId}/metrics/configs/ (`otelMetricsConfigs_putMany`) */
export const otelMetricsConfigsPutMany: DatarobotEndpoints['otelMetricsConfigsPutMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/otel/{entityType}/{entityId}/metrics/configs/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['entityType', 'entityId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PUT',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.otelMetricsConfigsPutMany.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.otel.otelMetricsConfigsPutMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get the OpenTelemetry metric configuration by entitytype */
/** Official: GET /api/v2/otel/{entityType}/{entityId}/metrics/configs/{otelMetricId}/ (`otelMetricsConfigs_retrieve`) */
export const otelMetricsConfigsRetrieve: DatarobotEndpoints['otelMetricsConfigsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/otel/{entityType}/{entityId}/metrics/configs/{otelMetricId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['entityType', 'entityId', 'otelMetricId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.otelMetricsConfigsRetrieve.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.otel.otelMetricsConfigsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve resource consumers by entitytype */
/** Official: GET /api/v2/otel/{entityType}/{entityId}/metrics/consumers/ (`otelMetricsConsumers_list`) */
export const otelMetricsConsumersList: DatarobotEndpoints['otelMetricsConsumersList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/otel/{entityType}/{entityId}/metrics/consumers/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['entityType', 'entityId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.otelMetricsConsumersList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.otel.otelMetricsConsumersList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete all OpenTelemetry metrics by entitytype */
/** Official: DELETE /api/v2/otel/{entityType}/{entityId}/metrics/ (`otelMetrics_deleteMany`) */
export const otelMetricsDeleteMany: DatarobotEndpoints['otelMetricsDeleteMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/otel/{entityType}/{entityId}/metrics/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['entityType', 'entityId'],
			['startTime', 'endTime', 'searchKeys', 'searchValues'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.otelMetricsDeleteMany.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.otel.otelMetricsDeleteMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve pod info by ID */
/** Official: GET /api/v2/otel/{entityType}/{entityId}/metrics/podInfo/ (`otelMetricsPodInfo_list`) */
export const otelMetricsPodInfoList: DatarobotEndpoints['otelMetricsPodInfoList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/otel/{entityType}/{entityId}/metrics/podInfo/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['entityType', 'entityId'],
			['startTime', 'endTime', 'searchKeys', 'searchValues'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.otelMetricsPodInfoList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.otel.otelMetricsPodInfoList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List reported OpenTelemetry metrics of the specified entity by entitytype */
/** Official: GET /api/v2/otel/{entityType}/{entityId}/metrics/summary/ (`otelMetricsSummary_list`) */
export const otelMetricsSummaryList: DatarobotEndpoints['otelMetricsSummaryList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/otel/{entityType}/{entityId}/metrics/summary/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['entityType', 'entityId'],
			['search', 'metricType'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.otelMetricsSummaryList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.otel.otelMetricsSummaryList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get a single OpenTelemetry metric value of the specified entity over time by entitytype */
/** Official: GET /api/v2/otel/{entityType}/{entityId}/metrics/valueOverTime/ (`otelMetricsValueOverTime_list`) */
export const otelMetricsValueOverTimeList: DatarobotEndpoints['otelMetricsValueOverTimeList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/otel/{entityType}/{entityId}/metrics/valueOverTime/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['entityType', 'entityId'],
			[
				'startTime',
				'endTime',
				'searchKeys',
				'searchValues',
				'resolution',
				'otelName',
				'aggregation',
				'units',
				'displayName',
				'percentile',
				'bucketInterval',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.otelMetricsValueOverTimeList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.otel.otelMetricsValueOverTimeList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get OpenTelemetry metrics values of the specified entity over a single time by entitytype */
/** Official: GET /api/v2/otel/{entityType}/{entityId}/metrics/values/ (`otelMetricsValues_list`) */
export const otelMetricsValuesList: DatarobotEndpoints['otelMetricsValuesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/otel/{entityType}/{entityId}/metrics/values/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['entityType', 'entityId'],
			[
				'startTime',
				'endTime',
				'searchKeys',
				'searchValues',
				'histogramBuckets',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.otelMetricsValuesList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.otel.otelMetricsValuesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get OpenTelemetry configured metrics values of the specified entity over time by entitytype */
/** Official: GET /api/v2/otel/{entityType}/{entityId}/metrics/valuesOverTime/ (`otelMetricsValuesOverTime_list`) */
export const otelMetricsValuesOverTimeList: DatarobotEndpoints['otelMetricsValuesOverTimeList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/otel/{entityType}/{entityId}/metrics/valuesOverTime/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['entityType', 'entityId'],
			['startTime', 'endTime', 'searchKeys', 'searchValues', 'resolution'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.otelMetricsValuesOverTimeList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.otel.otelMetricsValuesOverTimeList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get OpenTelemetry metric values by entitytype */
/** Official: POST /api/v2/otel/{entityType}/{entityId}/metrics/valuesOverTime/segments/ (`otelMetricsValuesOverTimeSegments_create`) */
export const otelMetricsValuesOverTimeSegmentsCreate: DatarobotEndpoints['otelMetricsValuesOverTimeSegmentsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/otel/{entityType}/{entityId}/metrics/valuesOverTime/segments/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['entityType', 'entityId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.otelMetricsValuesOverTimeSegmentsCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.otel.otelMetricsValuesOverTimeSegmentsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get OpenTelemetry metric values, grouped by segment attribute by entitytype */
/** Official: GET /api/v2/otel/{entityType}/{entityId}/metrics/valuesOverTime/segments/{segmentAttribute}/ (`otelMetricsValuesOverTimeSegments_retrieve`) */
export const otelMetricsValuesOverTimeSegmentsRetrieve: DatarobotEndpoints['otelMetricsValuesOverTimeSegmentsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/otel/{entityType}/{entityId}/metrics/valuesOverTime/segments/{segmentAttribute}/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['entityType', 'entityId', 'segmentAttribute'],
			[
				'segmentValue',
				'segmentLimit',
				'otelName',
				'aggregation',
				'startTime',
				'endTime',
				'searchKeys',
				'searchValues',
				'resolution',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.otelMetricsValuesOverTimeSegmentsRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.otel.otelMetricsValuesOverTimeSegmentsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get OpenTelemetry metric values, grouped by entitytype */
/** Official: GET /api/v2/otel/{entityType}/{entityId}/metrics/values/segments/{segmentAttribute}/ (`otelMetricsValuesSegments_retrieve`) */
export const otelMetricsValuesSegmentsRetrieve: DatarobotEndpoints['otelMetricsValuesSegmentsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/otel/{entityType}/{entityId}/metrics/values/segments/{segmentAttribute}/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['entityType', 'entityId', 'segmentAttribute'],
			[
				'segmentValue',
				'segmentLimit',
				'otelName',
				'aggregation',
				'startTime',
				'endTime',
				'searchKeys',
				'searchValues',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.otelMetricsValuesSegmentsRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.otel.otelMetricsValuesSegmentsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Gets OTel statistics */
/** Official: GET /api/v2/otel/stats/ (`otelStats_list`) */
export const otelStatsList: DatarobotEndpoints['otelStatsList'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/otel/stats/', input);
	const { query } = splitDatarobotInput(
		input,
		[],
		['offset', 'limit', 'serviceName', 'userId', 'startTime', 'endTime'],
	);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'GET',
		query,
	});
	const parsed = DatarobotEndpointOutputSchemas.otelStatsList.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.otel.otelStatsList',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** Delete OpenTelemetry traces by entitytype */
/** Official: DELETE /api/v2/otel/{entityType}/{entityId}/traces/ (`otelTraces_deleteMany`) */
export const otelTracesDeleteMany: DatarobotEndpoints['otelTracesDeleteMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/otel/{entityType}/{entityId}/traces/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['entityType', 'entityId'],
			['startTime', 'endTime', 'searchKeys', 'searchValues'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.otelTracesDeleteMany.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.otel.otelTracesDeleteMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List OpenTelemetry traces by entitytype */
/** Official: GET /api/v2/otel/{entityType}/{entityId}/traces/ (`tracing_list`) */
export const tracingList: DatarobotEndpoints['tracingList'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath(
		'/api/v2/otel/{entityType}/{entityId}/traces/',
		input,
	);
	const { query } = splitDatarobotInput(
		input,
		['entityType', 'entityId'],
		[
			'offset',
			'limit',
			'startTime',
			'endTime',
			'searchKeys',
			'searchValues',
			'minSpanDuration',
			'maxSpanDuration',
			'minTraceDuration',
			'minTraceCost',
			'maxTraceCost',
			'rootSpanName',
			'status',
			'sortBy',
			'sortDirection',
			'traceType',
			'tools',
		],
	);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'GET',
		query,
	});
	const parsed = DatarobotEndpointOutputSchemas.tracingList.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.otel.tracingList',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** Retrieve the specified OpenTelemetry trace by entitytype */
/** Official: GET /api/v2/otel/{entityType}/{entityId}/traces/{traceId}/ (`tracing_retrieve`) */
export const tracingRetrieve: DatarobotEndpoints['tracingRetrieve'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath(
		'/api/v2/otel/{entityType}/{entityId}/traces/{traceId}/',
		input,
	);
	const { query } = splitDatarobotInput(
		input,
		['entityType', 'entityId', 'traceId'],
		['offset', 'limit'],
	);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'GET',
		query,
	});
	const parsed = DatarobotEndpointOutputSchemas.tracingRetrieve.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.otel.tracingRetrieve',
		input ?? {},
		'completed',
	);
	return parsed;
};
