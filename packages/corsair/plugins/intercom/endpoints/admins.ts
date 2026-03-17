import { logEventFromContext } from '../../utils/events';
import type { IntercomEndpoints } from '..';
import { makeIntercomRequest } from '../client';
import type { IntercomEndpointOutputs } from './types';

export const identify: IntercomEndpoints['adminsIdentify'] = async (ctx, input) => {
	const result = await makeIntercomRequest<IntercomEndpointOutputs['adminsIdentify']>(
		'me',
		ctx.key,
	);

	if (result && ctx.db.admins) {
		try {
			await ctx.db.admins.upsertByEntityId(result.id, result);
		} catch (error) {
			console.warn('Failed to save admin to database:', error);
		}
	}

	await logEventFromContext(ctx, 'intercom.admins.identify', {}, 'completed');
	return result;
};

export const list: IntercomEndpoints['adminsList'] = async (ctx, input) => {
	const result = await makeIntercomRequest<IntercomEndpointOutputs['adminsList']>(
		'admins',
		ctx.key,
	);

	if (result?.admins && ctx.db.admins) {
		try {
			for (const admin of result.admins) {
				await ctx.db.admins.upsertByEntityId(admin.id, admin);
			}
		} catch (error) {
			console.warn('Failed to save admins to database:', error);
		}
	}

	await logEventFromContext(ctx, 'intercom.admins.list', {}, 'completed');
	return result;
};

export const get: IntercomEndpoints['adminsGet'] = async (ctx, input) => {
	const result = await makeIntercomRequest<IntercomEndpointOutputs['adminsGet']>(
		`admins/${input.id}`,
		ctx.key,
	);

	if (result && ctx.db.admins) {
		try {
			await ctx.db.admins.upsertByEntityId(result.id, result);
		} catch (error) {
			console.warn('Failed to save admin to database:', error);
		}
	}

	await logEventFromContext(ctx, 'intercom.admins.get', { ...input }, 'completed');
	return result;
};

export const listActivityLogs: IntercomEndpoints['adminsListActivityLogs'] = async (ctx, input) => {
	const result = await makeIntercomRequest<IntercomEndpointOutputs['adminsListActivityLogs']>(
		'admins/activity_log',
		ctx.key,
		{
			query: {
				created_at_after: input.created_at_after,
				created_at_before: input.created_at_before,
				page: input.page,
				per_page: input.per_page,
			},
		},
	);

	await logEventFromContext(ctx, 'intercom.admins.listActivityLogs', {}, 'completed');
	return result;
};

export const setAway: IntercomEndpoints['adminsSetAway'] = async (ctx, input) => {
	const { id, ...body } = input;
	const result = await makeIntercomRequest<IntercomEndpointOutputs['adminsSetAway']>(
		`admins/${id}/away`,
		ctx.key,
		{
			method: 'PUT',
			body: body as Record<string, unknown>,
		},
	);

	if (result && ctx.db.admins) {
		try {
			await ctx.db.admins.upsertByEntityId(result.id, result);
		} catch (error) {
			console.warn('Failed to update admin in database:', error);
		}
	}

	await logEventFromContext(ctx, 'intercom.admins.setAway', { id }, 'completed');
	return result;
};
