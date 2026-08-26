import { logEventFromContext } from 'corsair/core';
import type { BrowseaiEndpoints } from '../index';
import {
	auditPayload,
	browseaiCall,
	compactBody,
	compactQuery,
	robotPath,
} from './shared';
import type { BrowseaiEndpointOutputs } from './types';

export const getStatus: BrowseaiEndpoints['systemGetStatus'] = async (
	ctx,
	input,
) => {
	const result = await browseaiCall<BrowseaiEndpointOutputs['systemGetStatus']>(
		ctx,
		'status',
	);
	await logEventFromContext(
		ctx,
		'browseai.system.getStatus',
		auditPayload(input, []),
		'completed',
	);
	return result;
};

export const listRobots: BrowseaiEndpoints['robotsList'] = async (
	ctx,
	input,
) => {
	const result = await browseaiCall<BrowseaiEndpointOutputs['robotsList']>(
		ctx,
		'robots',
	);
	await logEventFromContext(
		ctx,
		'browseai.robots.list',
		{
			...auditPayload(input, []),
			returned: result.robots?.items?.length ?? 0,
		},
		'completed',
	);
	return result;
};

export const runRobot: BrowseaiEndpoints['robotsRun'] = async (ctx, input) => {
	const result = await browseaiCall<BrowseaiEndpointOutputs['robotsRun']>(
		ctx,
		robotPath(input.robotId, '/tasks'),
		{
			method: 'POST',
			body: compactBody({
				recordVideo: input.recordVideo,
				inputParameters: input.inputParameters,
			}),
		},
	);
	await logEventFromContext(
		ctx,
		'browseai.robots.run',
		auditPayload(input, ['robotId']),
		'completed',
	);
	return result;
};

export const bulkRun: BrowseaiEndpoints['robotsBulkRun'] = async (
	ctx,
	input,
) => {
	const result = await browseaiCall<BrowseaiEndpointOutputs['robotsBulkRun']>(
		ctx,
		robotPath(input.robotId, '/bulk-runs'),
		{
			method: 'POST',
			body: compactBody({
				title: input.title,
				inputParameters: input.inputParameters,
			}),
		},
	);
	await logEventFromContext(
		ctx,
		'browseai.robots.bulkRun',
		auditPayload(input, ['robotId']),
		'completed',
	);
	return result;
};

export const listTasks: BrowseaiEndpoints['tasksList'] = async (ctx, input) => {
	const result = await browseaiCall<BrowseaiEndpointOutputs['tasksList']>(
		ctx,
		robotPath(input.robotId, '/tasks'),
		{
			query: compactQuery({
				page: input.page,
				pageSize: input.pageSize,
				status: input.status,
				robotBulkRunId: input.robotBulkRunId,
				sort: input.sort,
				includeRetried: input.includeRetried,
				fromDate: input.fromDate,
				toDate: input.toDate,
			}),
		},
	);
	await logEventFromContext(
		ctx,
		'browseai.tasks.list',
		auditPayload(input, ['robotId']),
		'completed',
	);
	return result;
};

export const getTask: BrowseaiEndpoints['tasksGet'] = async (ctx, input) => {
	const result = await browseaiCall<BrowseaiEndpointOutputs['tasksGet']>(
		ctx,
		`${robotPath(input.robotId, '/tasks')}/${encodeURIComponent(input.taskId)}`,
	);
	await logEventFromContext(
		ctx,
		'browseai.tasks.get',
		auditPayload(input, ['robotId', 'taskId']),
		'completed',
	);
	return result;
};

export const createMonitor: BrowseaiEndpoints['monitorsCreate'] = async (
	ctx,
	input,
) => {
	const result = await browseaiCall<BrowseaiEndpointOutputs['monitorsCreate']>(
		ctx,
		robotPath(input.robotId, '/monitors'),
		{
			method: 'POST',
			body: compactBody({
				name: input.name,
				inputParameters: input.inputParameters,
				notifyOnCapturedScreenshotChange:
					input.notifyOnCapturedScreenshotChange,
				notifyOnCapturedTextChange: input.notifyOnCapturedTextChange,
				capturedScreenshotNotificationThreshold:
					input.capturedScreenshotNotificationThreshold,
				schedule: input.schedule,
				schedules: input.schedules,
			}),
		},
	);
	await logEventFromContext(
		ctx,
		'browseai.monitors.create',
		auditPayload(input, ['robotId']),
		'completed',
	);
	return result;
};

export const deleteMonitor: BrowseaiEndpoints['monitorsDelete'] = async (
	ctx,
	input,
) => {
	const result = await browseaiCall<BrowseaiEndpointOutputs['monitorsDelete']>(
		ctx,
		`${robotPath(input.robotId, '/monitors')}/${encodeURIComponent(input.monitorId)}`,
		{ method: 'DELETE' },
	);
	await logEventFromContext(
		ctx,
		'browseai.monitors.delete',
		auditPayload(input, ['robotId', 'monitorId']),
		'completed',
	);
	return result;
};

export const createWebhook: BrowseaiEndpoints['webhooksCreate'] = async (
	ctx,
	input,
) => {
	const result = await browseaiCall<BrowseaiEndpointOutputs['webhooksCreate']>(
		ctx,
		robotPath(input.robotId, '/webhooks'),
		{
			method: 'POST',
			body: {
				hookUrl: input.hookUrl,
				eventType: input.eventType,
			},
		},
	);
	await logEventFromContext(
		ctx,
		'browseai.webhooks.create',
		auditPayload(input, ['robotId']),
		'completed',
	);
	return result;
};

export const listWebhooks: BrowseaiEndpoints['webhooksList'] = async (
	ctx,
	input,
) => {
	const result = await browseaiCall<BrowseaiEndpointOutputs['webhooksList']>(
		ctx,
		robotPath(input.robotId, '/webhooks'),
	);
	await logEventFromContext(
		ctx,
		'browseai.webhooks.list',
		auditPayload(input, ['robotId']),
		'completed',
	);
	return result;
};
