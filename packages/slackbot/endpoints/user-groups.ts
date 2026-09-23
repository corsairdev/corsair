import { logEventFromContext } from 'corsair/core';
import { makeSlackbotRequest } from '../client';
import type { SlackbotEndpoints } from '../index';
import type { SlackbotEndpointOutputs } from './types';

function csv(values: readonly string[] | undefined): string | undefined {
	return values?.length ? values.join(',') : undefined;
}

export const create: SlackbotEndpoints['userGroupsCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackbotRequest<
		SlackbotEndpointOutputs['userGroupsCreate']
	>('usergroups.create', ctx.key, {
		method: 'POST',
		body: { ...input, channels: csv(input.channels) },
	});
	await logEventFromContext(
		ctx,
		'slackbot.userGroups.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const update: SlackbotEndpoints['userGroupsUpdate'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackbotRequest<
		SlackbotEndpointOutputs['userGroupsUpdate']
	>('usergroups.update', ctx.key, {
		method: 'POST',
		body: { ...input, channels: csv(input.channels) },
	});
	await logEventFromContext(
		ctx,
		'slackbot.userGroups.update',
		{ ...input },
		'completed',
	);
	return result;
};

export const disable: SlackbotEndpoints['userGroupsDisable'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackbotRequest<
		SlackbotEndpointOutputs['userGroupsDisable']
	>('usergroups.disable', ctx.key, { method: 'POST', body: input });
	await logEventFromContext(
		ctx,
		'slackbot.userGroups.disable',
		{ ...input },
		'completed',
	);
	return result;
};

export const enable: SlackbotEndpoints['userGroupsEnable'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackbotRequest<
		SlackbotEndpointOutputs['userGroupsEnable']
	>('usergroups.enable', ctx.key, { method: 'POST', body: input });
	await logEventFromContext(
		ctx,
		'slackbot.userGroups.enable',
		{ ...input },
		'completed',
	);
	return result;
};

export const list: SlackbotEndpoints['userGroupsList'] = async (ctx, input) => {
	const result = await makeSlackbotRequest<
		SlackbotEndpointOutputs['userGroupsList']
	>('usergroups.list', ctx.key, { method: 'GET', query: input });
	await logEventFromContext(
		ctx,
		'slackbot.userGroups.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const usersList: SlackbotEndpoints['userGroupsUsersList'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackbotRequest<
		SlackbotEndpointOutputs['userGroupsUsersList']
	>('usergroups.users.list', ctx.key, { method: 'GET', query: input });
	await logEventFromContext(
		ctx,
		'slackbot.userGroups.usersList',
		{ ...input },
		'completed',
	);
	return result;
};

/**
 * Replaces the group's membership wholesale — Slack has no incremental add or
 * remove, so callers must send the complete desired member list.
 */
export const usersUpdate: SlackbotEndpoints['userGroupsUsersUpdate'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackbotRequest<
		SlackbotEndpointOutputs['userGroupsUsersUpdate']
	>('usergroups.users.update', ctx.key, {
		method: 'POST',
		body: { ...input, users: csv(input.users) },
	});
	await logEventFromContext(
		ctx,
		'slackbot.userGroups.usersUpdate',
		{ ...input },
		'completed',
	);
	return result;
};
