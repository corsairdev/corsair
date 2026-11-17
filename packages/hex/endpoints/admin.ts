import { logEventFromContext } from 'corsair/core';
import type { HexEndpoints } from '..';
import { compactQuery, makeHexRequest } from '../client';
import type { HexEndpointOutputs } from './types';
import { HexEndpointInputSchemas, HexEndpointOutputSchemas } from './types';

/** List per-agent-run credit usage for the workspace, most recent run first. Requires workspace admin, or a workspace token with the agent usage read scope. Each row aggregates one agent run's credit consumption. */
export const adminListAgentUsage: HexEndpoints['adminListAgentUsage'] = async (
	ctx,
	input,
) => {
	const parsedInput = HexEndpointInputSchemas.adminListAgentUsage.parse(input);
	const response = await makeHexRequest<
		HexEndpointOutputs['adminListAgentUsage']
	>(`/v1/agent-usage`, ctx.key, {
		method: 'GET',
		query: compactQuery({
			startingAt: parsedInput.startingAt,
			endingAt: parsedInput.endingAt,
			userIds: parsedInput.userIds,
			threadIds: parsedInput.threadIds,
			limit: parsedInput.limit,
			after: parsedInput.after,
			before: parsedInput.before,
		}),
	});
	const parsed = HexEndpointOutputSchemas.adminListAgentUsage.parse(response);
	await logEventFromContext(
		ctx,
		'hex.admin.listAgentUsage',
		{ operation: 'admin.listAgentUsage' },
		'completed',
	);
	return parsed;
};

/** List thread topics in the workspace, sorted by name. */
export const adminListTopics: HexEndpoints['adminListTopics'] = async (
	ctx,
	input,
) => {
	const parsedInput = HexEndpointInputSchemas.adminListTopics.parse(input);
	const response = await makeHexRequest<HexEndpointOutputs['adminListTopics']>(
		`/v1/context/topics`,
		ctx.key,
		{
			method: 'GET',
			query: compactQuery({
				after: parsedInput.after,
				before: parsedInput.before,
				limit: parsedInput.limit,
			}),
		},
	);
	const parsed = HexEndpointOutputSchemas.adminListTopics.parse(response);
	await logEventFromContext(
		ctx,
		'hex.admin.listTopics',
		{ operation: 'admin.listTopics' },
		'completed',
	);
	return parsed;
};

/** List the workspace's credit grants, most recent first. Requires workspace admin, or a workspace token with the agent usage read scope. Each row is one credit grant. */
export const adminListCreditGrants: HexEndpoints['adminListCreditGrants'] =
	async (ctx, input) => {
		const parsedInput =
			HexEndpointInputSchemas.adminListCreditGrants.parse(input);
		const response = await makeHexRequest<
			HexEndpointOutputs['adminListCreditGrants']
		>(`/v1/credit-grants`, ctx.key, {
			method: 'GET',
			query: compactQuery({
				startingAt: parsedInput.startingAt,
				endingAt: parsedInput.endingAt,
				limit: parsedInput.limit,
				after: parsedInput.after,
				before: parsedInput.before,
			}),
		});
		const parsed =
			HexEndpointOutputSchemas.adminListCreditGrants.parse(response);
		await logEventFromContext(
			ctx,
			'hex.admin.listCreditGrants',
			{ operation: 'admin.listCreditGrants' },
			'completed',
		);
		return parsed;
	};
