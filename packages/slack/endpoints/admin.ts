import { logEventFromContext } from 'corsair/core';
import { makeSlackRequest } from '../client';
import type { SlackEndpoints } from '../index';
import type { SlackEndpointOutputs } from './types';

export const listTeams: SlackEndpoints['adminTeamsList'] = async (
	ctx,
	input,
) => {
	const response = await makeSlackRequest<
		SlackEndpointOutputs['adminTeamsList']
	>('admin.teams.list', ctx.key, { method: 'GET', query: input });

	await logEventFromContext(
		ctx,
		'slack.admin.listTeams',
		{ ...input },
		'completed',
	);

	return response;
};

export const conversationsSearch: SlackEndpoints['adminConversationsSearch'] =
	async (ctx, input) => {
		const response = await makeSlackRequest<
			SlackEndpointOutputs['adminConversationsSearch']
		>('admin.conversations.search', ctx.key, {
			method: 'POST',
			body: input,
		});

		await logEventFromContext(
			ctx,
			'slack.admin.conversationsSearch',
			{ ...input },
			'completed',
		);

		return response;
	};

export const conversationsGetTeams: SlackEndpoints['adminConversationsGetTeams'] =
	async (ctx, input) => {
		const response = await makeSlackRequest<
			SlackEndpointOutputs['adminConversationsGetTeams']
		>('admin.conversations.getTeams', ctx.key, {
			method: 'GET',
			query: input,
		});

		await logEventFromContext(
			ctx,
			'slack.admin.conversationsGetTeams',
			{ ...input },
			'completed',
		);

		return response;
	};

export const conversationsSetTeams: SlackEndpoints['adminConversationsSetTeams'] =
	async (ctx, input) => {
		const response = await makeSlackRequest<
			SlackEndpointOutputs['adminConversationsSetTeams']
		>('admin.conversations.setTeams', ctx.key, {
			method: 'POST',
			body: input,
		});

		await logEventFromContext(
			ctx,
			'slack.admin.conversationsSetTeams',
			{ ...input },
			'completed',
		);

		return response;
	};
