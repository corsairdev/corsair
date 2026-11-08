import { asRecord } from 'corsair/core';
import type { DataboxEndpoints } from '..';
import { DATABOX_METRIC_DATA_TIMEOUT_MS, segment } from '../client';
import { call } from './call';
import { envelopeData, shapeList } from './envelope';
import {
	DataboxEndpointInputSchemas as Inputs,
	DataboxEndpointOutputSchemas as Outputs,
} from './types';

export const list: DataboxEndpoints['metricsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'metrics.list',
			input: Inputs.listMetrics,
			output: Outputs.listMetrics,
		},
		input,
		({ sourceId, search, page, pageSize, accountId }) => ({
			method: 'GET',
			path: '/v2/metrics',
			query: { sourceId, search, page, pageSize },
			accountId,
			replaySafe: true,
		}),
		{
			shape: shapeList('metrics'),
			log: (_, result) => ({ count: result.metrics.length, page: result.page }),
		},
	);

export const getData: DataboxEndpoints['metricsGetData'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'metrics.getData',
			input: Inputs.getMetricData,
			output: Outputs.getMetricData,
		},
		input,
		({ id, sourceId, dateRange, dimensionIds, filters, accountId }) => ({
			method: 'POST',
			path: `/v2/metrics/${segment(id)}/data`,
			body: {
				...(sourceId !== undefined ? { sourceId } : {}),
				dateRange,
				...(dimensionIds !== undefined ? { dimensionIds } : {}),
				...(filters !== undefined ? { filters } : {}),
			},
			accountId,
			// A POST that only computes values: replaying it cannot repeat a
			// side effect. It can trigger a sync Databox would run anyway.
			replaySafe: true,
			// Databox waits for a due or first sync here, which can take up to
			// two minutes.
			timeoutMs: DATABOX_METRIC_DATA_TIMEOUT_MS,
		}),
		{
			shape: (raw) => {
				const data = envelopeData(raw);
				return {
					metric: asRecord(data?.metric),
					dataPoints: Array.isArray(data?.dataPoints) ? data.dataPoints : [],
					syncInfo: data?.syncInfo,
				};
			},
			log: ({ id }, result) => ({
				metricId: id,
				pointCount: result.dataPoints.length,
				syncStatus: result.syncInfo?.status ?? undefined,
			}),
		},
	);
