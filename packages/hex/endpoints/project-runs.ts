import { logEventFromContext } from 'corsair/core';
import type { HexEndpoints } from '..';
import { compactQuery, makeHexRequest } from '../client';
import type { HexEndpointOutputs } from './types';
import { HexEndpointInputSchemas, HexEndpointOutputSchemas } from './types';

/** Get the status of runs of a project. By default, all run types are returned (API-triggered, scheduled, and publish/refresh runs). Use the `runTriggerFilter` parameter to filter to a specific type. */
export const projectRunsList: HexEndpoints['projectRunsList'] = async (
	ctx,
	input,
) => {
	const parsedInput = HexEndpointInputSchemas.projectRunsList.parse(input);
	const response = await makeHexRequest<HexEndpointOutputs['projectRunsList']>(
		`/v1/projects/${encodeURIComponent(String(parsedInput.projectId))}/runs`,
		ctx.key,
		{
			method: 'GET',
			query: compactQuery({
				limit: parsedInput.limit,
				offset: parsedInput.offset,
				statusFilter: parsedInput.statusFilter,
				runTriggerFilter: parsedInput.runTriggerFilter,
			}),
		},
	);
	const parsed = HexEndpointOutputSchemas.projectRunsList.parse(response);
	await logEventFromContext(
		ctx,
		'hex.projectRuns.list',
		{ operation: 'projectRuns.list' },
		'completed',
	);
	return parsed;
};

/** Trigger a run of the latest published version of a project. */
export const projectRunsRun: HexEndpoints['projectRunsRun'] = async (
	ctx,
	input,
) => {
	const parsedInput = HexEndpointInputSchemas.projectRunsRun.parse(input);
	const response = await makeHexRequest<HexEndpointOutputs['projectRunsRun']>(
		`/v1/projects/${encodeURIComponent(String(parsedInput.projectId))}/runs`,
		ctx.key,
		{
			method: 'POST',
			body: {
				inputParams: parsedInput.inputParams,
				dryRun: parsedInput.dryRun,
				updateCache: parsedInput.updateCache,
				notifications: parsedInput.notifications,
				updatePublishedResults: parsedInput.updatePublishedResults,
				useCachedSqlResults: parsedInput.useCachedSqlResults,
				viewId: parsedInput.viewId,
			},
		},
	);
	const parsed = HexEndpointOutputSchemas.projectRunsRun.parse(response);
	await logEventFromContext(
		ctx,
		'hex.projectRuns.run',
		{ operation: 'projectRuns.run' },
		'completed',
	);
	return parsed;
};

/** Cancel a project run. */
export const projectRunsCancel: HexEndpoints['projectRunsCancel'] = async (
	ctx,
	input,
) => {
	const parsedInput = HexEndpointInputSchemas.projectRunsCancel.parse(input);
	const response = await makeHexRequest<
		HexEndpointOutputs['projectRunsCancel']
	>(
		`/v1/projects/${encodeURIComponent(String(parsedInput.projectId))}/runs/${encodeURIComponent(String(parsedInput.runId))}`,
		ctx.key,
		{
			method: 'DELETE',
		},
	);
	const parsed = HexEndpointOutputSchemas.projectRunsCancel.parse(response);
	await logEventFromContext(
		ctx,
		'hex.projectRuns.cancel',
		{ operation: 'projectRuns.cancel' },
		'completed',
	);
	return parsed;
};

/** Get the status of a project run. */
export const projectRunsGetStatus: HexEndpoints['projectRunsGetStatus'] =
	async (ctx, input) => {
		const parsedInput =
			HexEndpointInputSchemas.projectRunsGetStatus.parse(input);
		const response = await makeHexRequest<
			HexEndpointOutputs['projectRunsGetStatus']
		>(
			`/v1/projects/${encodeURIComponent(String(parsedInput.projectId))}/runs/${encodeURIComponent(String(parsedInput.runId))}`,
			ctx.key,
			{
				method: 'GET',
				headers: {
					'enable-expanded-stats':
						parsedInput.enableExpandedStats !== undefined
							? String(parsedInput.enableExpandedStats)
							: undefined,
				},
			},
		);
		const parsed =
			HexEndpointOutputSchemas.projectRunsGetStatus.parse(response);
		await logEventFromContext(
			ctx,
			'hex.projectRuns.getStatus',
			{ operation: 'projectRuns.getStatus' },
			'completed',
		);
		return parsed;
	};

/** Get the rendered PNG image of a chart cell from a completed run by staticCellId. */
export const projectRunsGetChartImage: HexEndpoints['projectRunsGetChartImage'] =
	async (ctx, input) => {
		const parsedInput =
			HexEndpointInputSchemas.projectRunsGetChartImage.parse(input);
		const response = await makeHexRequest<
			HexEndpointOutputs['projectRunsGetChartImage']
		>(
			`/v1/projects/${encodeURIComponent(String(parsedInput.projectId))}/runs/${encodeURIComponent(String(parsedInput.runId))}/cells/${encodeURIComponent(String(parsedInput.staticId))}/image`,
			ctx.key,
			{
				method: 'GET',
				query: compactQuery({
					width: parsedInput.width,
					height: parsedInput.height,
					includeTitle: parsedInput.includeTitle,
				}),
			},
		);
		const parsed =
			HexEndpointOutputSchemas.projectRunsGetChartImage.parse(response);
		await logEventFromContext(
			ctx,
			'hex.projectRuns.getChartImage',
			{ operation: 'projectRuns.getChartImage' },
			'completed',
		);
		return parsed;
	};
