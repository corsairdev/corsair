import { logEventFromContext } from 'corsair/core';
import type { BrowseaiEndpoints } from '../index';
import {
	auditPayload,
	browseaiCall,
	compactBody,
	compactQuery,
	robotPath,
} from './shared';
import {
	BrowseaiEndpointInputSchemas,
	BrowseaiEndpointOutputSchemas,
} from './types';

export const getStatus: BrowseaiEndpoints['systemGetStatus'] = async (
	ctx,
	input,
) => {
	BrowseaiEndpointInputSchemas.systemGetStatus.parse(input);
	const result = await browseaiCall(
		ctx,
		'status',
		BrowseaiEndpointOutputSchemas.systemGetStatus,
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
	BrowseaiEndpointInputSchemas.robotsList.parse(input);
	const result = await browseaiCall(
		ctx,
		'robots',
		BrowseaiEndpointOutputSchemas.robotsList,
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
	const parsed = BrowseaiEndpointInputSchemas.robotsRun.parse(input);
	const result = await browseaiCall(
		ctx,
		robotPath(parsed.robotId, '/tasks'),
		BrowseaiEndpointOutputSchemas.robotsRun,
		{
			method: 'POST',
			body: compactBody({
				recordVideo: parsed.recordVideo,
				inputParameters: parsed.inputParameters,
			}),
		},
	);
	await logEventFromContext(
		ctx,
		'browseai.robots.run',
		auditPayload(parsed, ['robotId']),
		'completed',
	);
	return result;
};

export const bulkRun: BrowseaiEndpoints['robotsBulkRun'] = async (
	ctx,
	input,
) => {
	const parsed = BrowseaiEndpointInputSchemas.robotsBulkRun.parse(input);
	const result = await browseaiCall(
		ctx,
		robotPath(parsed.robotId, '/bulk-runs'),
		BrowseaiEndpointOutputSchemas.robotsBulkRun,
		{
			method: 'POST',
			body: compactBody({
				title: parsed.title,
				inputParameters: parsed.inputParameters,
			}),
		},
	);
	await logEventFromContext(
		ctx,
		'browseai.robots.bulkRun',
		auditPayload(parsed, ['robotId']),
		'completed',
	);
	return result;
};

export const listTasks: BrowseaiEndpoints['tasksList'] = async (ctx, input) => {
	const parsed = BrowseaiEndpointInputSchemas.tasksList.parse(input);
	const result = await browseaiCall(
		ctx,
		robotPath(parsed.robotId, '/tasks'),
		BrowseaiEndpointOutputSchemas.tasksList,
		{
			query: compactQuery({
				page: parsed.page,
				pageSize: parsed.pageSize,
				status: parsed.status,
				robotBulkRunId: parsed.robotBulkRunId,
				sort: parsed.sort,
				includeRetried: parsed.includeRetried,
				fromDate: parsed.fromDate,
				toDate: parsed.toDate,
			}),
		},
	);
	await logEventFromContext(
		ctx,
		'browseai.tasks.list',
		auditPayload(parsed, ['robotId']),
		'completed',
	);
	return result;
};

export const getTask: BrowseaiEndpoints['tasksGet'] = async (ctx, input) => {
	const parsed = BrowseaiEndpointInputSchemas.tasksGet.parse(input);
	const result = await browseaiCall(
		ctx,
		`${robotPath(parsed.robotId, '/tasks')}/${encodeURIComponent(parsed.taskId)}`,
		BrowseaiEndpointOutputSchemas.tasksGet,
	);
	await logEventFromContext(
		ctx,
		'browseai.tasks.get',
		auditPayload(parsed, ['robotId', 'taskId']),
		'completed',
	);
	return result;
};

export const createMonitor: BrowseaiEndpoints['monitorsCreate'] = async (
	ctx,
	input,
) => {
	const parsed = BrowseaiEndpointInputSchemas.monitorsCreate.parse(input);
	const result = await browseaiCall(
		ctx,
		robotPath(parsed.robotId, '/monitors'),
		BrowseaiEndpointOutputSchemas.monitorsCreate,
		{
			method: 'POST',
			body: compactBody({
				name: parsed.name,
				inputParameters: parsed.inputParameters,
				notifyOnCapturedScreenshotChange:
					parsed.notifyOnCapturedScreenshotChange,
				notifyOnCapturedTextChange: parsed.notifyOnCapturedTextChange,
				capturedScreenshotNotificationThreshold:
					parsed.capturedScreenshotNotificationThreshold,
				schedule: parsed.schedule,
				schedules: parsed.schedules,
			}),
		},
	);
	await logEventFromContext(
		ctx,
		'browseai.monitors.create',
		auditPayload(parsed, ['robotId']),
		'completed',
	);
	return result;
};

export const deleteMonitor: BrowseaiEndpoints['monitorsDelete'] = async (
	ctx,
	input,
) => {
	const parsed = BrowseaiEndpointInputSchemas.monitorsDelete.parse(input);
	const result = await browseaiCall(
		ctx,
		`${robotPath(parsed.robotId, '/monitors')}/${encodeURIComponent(parsed.monitorId)}`,
		BrowseaiEndpointOutputSchemas.monitorsDelete,
		{ method: 'DELETE' },
	);
	await logEventFromContext(
		ctx,
		'browseai.monitors.delete',
		auditPayload(parsed, ['robotId', 'monitorId']),
		'completed',
	);
	return result;
};

export const createWebhook: BrowseaiEndpoints['webhooksCreate'] = async (
	ctx,
	input,
) => {
	const parsed = BrowseaiEndpointInputSchemas.webhooksCreate.parse(input);
	const result = await browseaiCall(
		ctx,
		robotPath(parsed.robotId, '/webhooks'),
		BrowseaiEndpointOutputSchemas.webhooksCreate,
		{
			method: 'POST',
			body: {
				hookUrl: parsed.hookUrl,
				eventType: parsed.eventType,
			},
		},
	);
	await logEventFromContext(
		ctx,
		'browseai.webhooks.create',
		auditPayload(parsed, ['robotId']),
		'completed',
	);
	return result;
};

export const listWebhooks: BrowseaiEndpoints['webhooksList'] = async (
	ctx,
	input,
) => {
	const parsed = BrowseaiEndpointInputSchemas.webhooksList.parse(input);
	const result = await browseaiCall(
		ctx,
		robotPath(parsed.robotId, '/webhooks'),
		BrowseaiEndpointOutputSchemas.webhooksList,
	);
	await logEventFromContext(
		ctx,
		'browseai.webhooks.list',
		auditPayload(parsed, ['robotId']),
		'completed',
	);
	return result;
};
