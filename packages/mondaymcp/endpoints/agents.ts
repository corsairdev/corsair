import { logEventFromContext } from 'corsair/core';
import type { MondayMcpEndpoints } from '..';
import { makeMondayMcpToolCall } from '../client';
import {
	MondayMcpEndpointInputSchemas,
	MondayMcpEndpointOutputSchemas,
} from './types';

// Agents family: manage_agent, manage_agent_triggers, manage_agent_skills,
// manage_agent_knowledge, agent_catalog.
export const agentsManage: MondayMcpEndpoints['agents.manage'] = async (
	ctx,
	input,
) => {
	const parsed = MondayMcpEndpointInputSchemas['agents.manage'].parse(input);
	const result = await makeMondayMcpToolCall(ctx.key, 'manage_agent', parsed);
	const output = MondayMcpEndpointOutputSchemas['agents.manage'].parse(result);
	await logEventFromContext(
		ctx,
		'mondaymcp.agents.manage',
		{ ...parsed },
		'completed',
	);
	return output;
};

export const agentsManageTriggers: MondayMcpEndpoints['agents.manageTriggers'] =
	async (ctx, input) => {
		const parsed =
			MondayMcpEndpointInputSchemas['agents.manageTriggers'].parse(input);
		const result = await makeMondayMcpToolCall(
			ctx.key,
			'manage_agent_triggers',
			parsed,
		);
		const output =
			MondayMcpEndpointOutputSchemas['agents.manageTriggers'].parse(result);
		await logEventFromContext(
			ctx,
			'mondaymcp.agents.manageTriggers',
			{ ...parsed },
			'completed',
		);
		return output;
	};

export const agentsManageSkills: MondayMcpEndpoints['agents.manageSkills'] =
	async (ctx, input) => {
		const parsed =
			MondayMcpEndpointInputSchemas['agents.manageSkills'].parse(input);
		const result = await makeMondayMcpToolCall(
			ctx.key,
			'manage_agent_skills',
			parsed,
		);
		const output =
			MondayMcpEndpointOutputSchemas['agents.manageSkills'].parse(result);
		await logEventFromContext(
			ctx,
			'mondaymcp.agents.manageSkills',
			{ ...parsed },
			'completed',
		);
		return output;
	};

export const agentsManageKnowledge: MondayMcpEndpoints['agents.manageKnowledge'] =
	async (ctx, input) => {
		const parsed =
			MondayMcpEndpointInputSchemas['agents.manageKnowledge'].parse(input);
		const result = await makeMondayMcpToolCall(
			ctx.key,
			'manage_agent_knowledge',
			parsed,
		);
		const output =
			MondayMcpEndpointOutputSchemas['agents.manageKnowledge'].parse(result);
		await logEventFromContext(
			ctx,
			'mondaymcp.agents.manageKnowledge',
			{ ...parsed },
			'completed',
		);
		return output;
	};

export const agentsCatalog: MondayMcpEndpoints['agents.catalog'] = async (
	ctx,
	input,
) => {
	const parsed = MondayMcpEndpointInputSchemas['agents.catalog'].parse(input);
	const result = await makeMondayMcpToolCall(ctx.key, 'agent_catalog', parsed);
	const output = MondayMcpEndpointOutputSchemas['agents.catalog'].parse(result);
	await logEventFromContext(
		ctx,
		'mondaymcp.agents.catalog',
		{ ...parsed },
		'completed',
	);
	return output;
};
