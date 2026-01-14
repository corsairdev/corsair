import { logEvent } from '../../utils/events';
import type { SlackEndpoints } from '..';
import { makeSlackRequest } from '../client';
import type { SlackEndpointOutputs } from './types';

export const create: SlackEndpoints['userGroupsCreate'] = async (
	ctx,
	input,
) => {
	try {
		const result = await makeSlackRequest<
			SlackEndpointOutputs['userGroupsCreate']
		>('userGroups.create', ctx.options.botToken, {
			method: 'POST',
			body: {
				name: input.name,
				channels: input.channels,
				description: input.description,
				handle: input.handle,
				include_count: input.include_count,
				team_id: input.team_id,
			},
		});

		if (result.ok && result.usergroup && ctx.db.userGroups) {
			try {
				await ctx.db.userGroups.upsert(result.usergroup.id, {
					id: result.usergroup.id,
					name: result.usergroup.name,
					description: input.description,
					handle: input.handle,
					date_create: Date.now(),
				});
			} catch (error) {
				console.warn('Failed to save usergroup to database:', error);
			}
		}

		await logEvent(
			ctx.database,
			'slack.userGroups.create',
			{ ...input },
			'completed',
		);
		return result;
	} catch (error) {
		await logEvent(
			ctx.database,
			'slack.userGroups.create',
			{ ...input },
			'failed',
		);
		throw error;
	}
};

export const disable: SlackEndpoints['userGroupsDisable'] = async (
	ctx,
	input,
) => {
	try {
		const result = await makeSlackRequest<
			SlackEndpointOutputs['userGroupsDisable']
		>('userGroups.disable', ctx.options.botToken, {
			method: 'POST',
			body: {
				usergroup: input.usergroup,
				include_count: input.include_count,
				team_id: input.team_id,
			},
		});

		if (result.ok && result.usergroup && ctx.db.userGroups) {
			try {
				const existing = await ctx.db.userGroups.findByResourceId(
					input.usergroup,
				);
				await ctx.db.userGroups.upsert(result.usergroup.id, {
					...(existing?.data || { id: result.usergroup.id }),
					date_update: Date.now(),
				});
			} catch (error) {
				console.warn('Failed to update usergroup in database:', error);
			}
		}

		await logEvent(
			ctx.database,
			'slack.userGroups.disable',
			{ ...input },
			'completed',
		);
		return result;
	} catch (error) {
		await logEvent(
			ctx.database,
			'slack.userGroups.disable',
			{ ...input },
			'failed',
		);
		throw error;
	}
};

export const enable: SlackEndpoints['userGroupsEnable'] = async (
	ctx,
	input,
) => {
	try {
		const result = await makeSlackRequest<
			SlackEndpointOutputs['userGroupsEnable']
		>('userGroups.enable', ctx.options.botToken, {
			method: 'POST',
			body: {
				usergroup: input.usergroup,
				include_count: input.include_count,
				team_id: input.team_id,
			},
		});

		if (result.ok && result.usergroup && ctx.db.userGroups) {
			try {
				const existing = await ctx.db.userGroups.findByResourceId(
					input.usergroup,
				);
				await ctx.db.userGroups.upsert(result.usergroup.id, {
					...(existing?.data || { id: result.usergroup.id }),
					date_update: Date.now(),
				});
			} catch (error) {
				console.warn('Failed to update usergroup in database:', error);
			}
		}

		await logEvent(
			ctx.database,
			'slack.userGroups.enable',
			{ ...input },
			'completed',
		);
		return result;
	} catch (error) {
		await logEvent(
			ctx.database,
			'slack.userGroups.enable',
			{ ...input },
			'failed',
		);
		throw error;
	}
};

export const list: SlackEndpoints['userGroupsList'] = async (ctx, input) => {
	try {
		const result = await makeSlackRequest<
			SlackEndpointOutputs['userGroupsList']
		>('userGroups.list', ctx.options.botToken, {
			method: 'GET',
			query: {
				include_count: input.include_count,
				include_disabled: input.include_disabled,
				include_users: input.include_users,
				team_id: input.team_id,
			},
		});

		if (result.ok && result.userGroups && ctx.db.userGroups) {
			try {
				for (const usergroup of result.userGroups) {
					if (usergroup.id) {
						await ctx.db.userGroups.upsert(usergroup.id, {
							id: usergroup.id,
							name: usergroup.name,
						});
					}
				}
			} catch (error) {
				console.warn('Failed to save userGroups to database:', error);
			}
		}

		await logEvent(
			ctx.database,
			'slack.userGroups.list',
			{ ...input },
			'completed',
		);
		return result;
	} catch (error) {
		await logEvent(
			ctx.database,
			'slack.userGroups.list',
			{ ...input },
			'failed',
		);
		throw error;
	}
};

export const update: SlackEndpoints['userGroupsUpdate'] = async (
	ctx,
	input,
) => {
	try {
		const result = await makeSlackRequest<
			SlackEndpointOutputs['userGroupsUpdate']
		>('userGroups.update', ctx.options.botToken, {
			method: 'POST',
			body: {
				usergroup: input.usergroup,
				name: input.name,
				channels: input.channels,
				description: input.description,
				handle: input.handle,
				include_count: input.include_count,
				team_id: input.team_id,
			},
		});

		if (result.ok && result.usergroup && ctx.db.userGroups) {
			try {
				const existing = await ctx.db.userGroups.findByResourceId(
					input.usergroup,
				);
				await ctx.db.userGroups.upsert(result.usergroup.id, {
					...(existing?.data || { id: result.usergroup.id }),
					name: result.usergroup.name || input.name,
					description: input.description,
					handle: input.handle,
					date_update: Date.now(),
				});
			} catch (error) {
				console.warn('Failed to update usergroup in database:', error);
			}
		}

		await logEvent(
			ctx.database,
			'slack.userGroups.update',
			{ ...input },
			'completed',
		);
		return result;
	} catch (error) {
		await logEvent(
			ctx.database,
			'slack.userGroups.update',
			{ ...input },
			'failed',
		);
		throw error;
	}
};
