import { logEventFromContext } from 'corsair/core';
import type { MondayMcpEndpoints } from '..';
import { makeMondayMcpToolCall } from '../client';
import {
	MondayMcpEndpointInputSchemas,
	MondayMcpEndpointOutputSchemas,
} from './types';

// Automations & Workflows family: list_automations, manage_automations,
// create_automation, plan_workflow, create_workflow, update_workflow,
// publish_workflow.
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
		{ ...parsed },
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
			{ ...parsed },
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
			{ ...parsed },
			'completed',
		);
		return output;
	};

export const workflowsPlan: MondayMcpEndpoints['workflows.plan'] = async (
	ctx,
	input,
) => {
	const parsed = MondayMcpEndpointInputSchemas['workflows.plan'].parse(input);
	const result = await makeMondayMcpToolCall(ctx.key, 'plan_workflow', parsed);
	const output = MondayMcpEndpointOutputSchemas['workflows.plan'].parse(result);
	await logEventFromContext(
		ctx,
		'mondaymcp.workflows.plan',
		{ ...parsed },
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
		{ ...parsed },
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
		'update_workflow',
		parsed,
	);
	const output =
		MondayMcpEndpointOutputSchemas['workflows.update'].parse(result);
	await logEventFromContext(
		ctx,
		'mondaymcp.workflows.update',
		{ ...parsed },
		'completed',
	);
	return output;
};

export const workflowsPublish: MondayMcpEndpoints['workflows.publish'] = async (
	ctx,
	input,
) => {
	const parsed =
		MondayMcpEndpointInputSchemas['workflows.publish'].parse(input);
	const result = await makeMondayMcpToolCall(
		ctx.key,
		'publish_workflow',
		parsed,
	);
	const output =
		MondayMcpEndpointOutputSchemas['workflows.publish'].parse(result);
	await logEventFromContext(
		ctx,
		'mondaymcp.workflows.publish',
		{ ...parsed },
		'completed',
	);
	return output;
};
