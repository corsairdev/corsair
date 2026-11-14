import { logEventFromContext } from 'corsair/core';
import type { MondayMcpEndpoints } from '..';
import { makeMondayMcpToolCall } from '../client';
import { safeEventPayload } from '../safe-event';
import {
	MondayMcpEndpointInputSchemas,
	MondayMcpEndpointOutputSchemas,
} from './types';

// Automations & Workflows family: list_automations, manage_automations,
// create_automation, invoke_process_planner (workflows.plan), create_workflow,
// invoke_workflow_expert (workflows.update). monday retired publish_workflow
// from the hosted server; workflows are published from the workflow editor.
export const automationsList: MondayMcpEndpoints['automations.list'] = async (
	ctx,
	input,
) => {
	const parsed = MondayMcpEndpointInputSchemas['automations.list'].parse(input);
	const result = await makeMondayMcpToolCall(
		ctx.key,
		'list_automations',
		parsed,
	);
	const output =
		MondayMcpEndpointOutputSchemas['automations.list'].parse(result);
	await logEventFromContext(
		ctx,
		'mondaymcp.automations.list',
		{ ...safeEventPayload(parsed) },
		'completed',
	);
	return output;
};

export const automationsManage: MondayMcpEndpoints['automations.manage'] =
	async (ctx, input) => {
		const parsed =
			MondayMcpEndpointInputSchemas['automations.manage'].parse(input);
		const result = await makeMondayMcpToolCall(
			ctx.key,
			'manage_automations',
			parsed,
		);
		const output =
			MondayMcpEndpointOutputSchemas['automations.manage'].parse(result);
		await logEventFromContext(
			ctx,
			'mondaymcp.automations.manage',
			{ ...safeEventPayload(parsed) },
			'completed',
		);
		return output;
	};

export const automationsCreate: MondayMcpEndpoints['automations.create'] =
	async (ctx, input) => {
		const parsed =
			MondayMcpEndpointInputSchemas['automations.create'].parse(input);
		const result = await makeMondayMcpToolCall(
			ctx.key,
			'create_automation',
			parsed,
		);
		const output =
			MondayMcpEndpointOutputSchemas['automations.create'].parse(result);
		await logEventFromContext(
			ctx,
			'mondaymcp.automations.create',
			{ ...safeEventPayload(parsed) },
			'completed',
		);
		return output;
	};

export const workflowsPlan: MondayMcpEndpoints['workflows.plan'] = async (
	ctx,
	input,
) => {
	const parsed = MondayMcpEndpointInputSchemas['workflows.plan'].parse(input);
	const result = await makeMondayMcpToolCall(
		ctx.key,
		'invoke_process_planner',
		parsed,
	);
	const output = MondayMcpEndpointOutputSchemas['workflows.plan'].parse(result);
	await logEventFromContext(
		ctx,
		'mondaymcp.workflows.plan',
		{ ...safeEventPayload(parsed) },
		'completed',
	);
	return output;
};

export const workflowsCreate: MondayMcpEndpoints['workflows.create'] = async (
	ctx,
	input,
) => {
	const parsed = MondayMcpEndpointInputSchemas['workflows.create'].parse(input);
	const result = await makeMondayMcpToolCall(
		ctx.key,
		'create_workflow',
		parsed,
	);
	const output =
		MondayMcpEndpointOutputSchemas['workflows.create'].parse(result);
	await logEventFromContext(
		ctx,
		'mondaymcp.workflows.create',
		{ ...safeEventPayload(parsed) },
		'completed',
	);
	return output;
};

export const workflowsUpdate: MondayMcpEndpoints['workflows.update'] = async (
	ctx,
	input,
) => {
	const parsed = MondayMcpEndpointInputSchemas['workflows.update'].parse(input);
	const result = await makeMondayMcpToolCall(
		ctx.key,
		'invoke_workflow_expert',
		parsed,
	);
	const output =
		MondayMcpEndpointOutputSchemas['workflows.update'].parse(result);
	await logEventFromContext(
		ctx,
		'mondaymcp.workflows.update',
		{ ...safeEventPayload(parsed) },
		'completed',
	);
	return output;
};
