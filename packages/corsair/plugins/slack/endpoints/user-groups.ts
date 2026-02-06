import { logEventFromContext } from '../../utils/events';
import type { SlackEndpoints } from '..';
import { makeSlackRequest } from '../client';
import type { SlackEndpointOutputs } from './types';

export const create: SlackEndpoints['userGroupsCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackRequest<
		SlackEndpointOutputs['userGroupsCreate']
	>('userGroups.create', ctx.key, {
		method: 'POST',
		body: input,
	});

	if (result.ok && result.usergroup && ctx.db.userGroups) {
		try {
			await ctx.db.userGroups.upsertByEntityId(result.usergroup.id, {
				...result.usergroup,
			});
		} catch (error) {
			console.warn('Failed to save usergroup to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'slack.userGroups.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const disable: SlackEndpoints['userGroupsDisable'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackRequest<
		SlackEndpointOutputs['userGroupsDisable']
	>('userGroups.disable', ctx.key, {
		method: 'POST',
		body: input,
	});

	if (result.ok && result.usergroup && ctx.db.userGroups) {
		try {
			await ctx.db.userGroups.upsertByEntityId(result.usergroup.id, {
				...result.usergroup,
			});
		} catch (error) {
			console.warn('Failed to update usergroup in database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'slack.userGroups.disable',
		{ ...input },
		'completed',
	);
	return result;
};

export const enable: SlackEndpoints['userGroupsEnable'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackRequest<
		SlackEndpointOutputs['userGroupsEnable']
	>('userGroups.enable', ctx.key, {
		method: 'POST',
		body: input,
	});

	if (result.ok && result.usergroup && ctx.db.userGroups) {
		try {
			await ctx.db.userGroups.upsertByEntityId(result.usergroup.id, {
				...result.usergroup,
			});
		} catch (error) {
			console.warn('Failed to update usergroup in database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'slack.userGroups.enable',
		{ ...input },
		'completed',
	);
	return result;
};

export const list: SlackEndpoints['userGroupsList'] = async (ctx, input) => {
	const result = await makeSlackRequest<SlackEndpointOutputs['userGroupsList']>(
		'userGroups.list',
		ctx.key,
		{
			method: 'GET',
			query: input,
		},
	);

	if (result.ok && result.userGroups && ctx.db.userGroups) {
		try {
			for (const usergroup of result.userGroups) {
				if (usergroup.id) {
					await ctx.db.userGroups.upsertByEntityId(usergroup.id, {
						...usergroup,
					});
				}
			}
		} catch (error) {
			console.warn('Failed to save userGroups to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'slack.userGroups.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const update: SlackEndpoints['userGroupsUpdate'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackRequest<
		SlackEndpointOutputs['userGroupsUpdate']
	>('userGroups.update', ctx.key, {
		method: 'POST',
		body: input,
	});

	if (result.ok && result.usergroup && ctx.db.userGroups) {
		try {
			await ctx.db.userGroups.upsertByEntityId(result.usergroup.id, {
				...result.usergroup,
			});
		} catch (error) {
			console.warn('Failed to update usergroup in database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'slack.userGroups.update',
		{ ...input },
		'completed',
	);
	return result;
};
