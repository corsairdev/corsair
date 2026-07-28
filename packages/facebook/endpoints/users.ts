import { makeFacebookRequest } from '../client';
import type { FacebookEndpoints } from '../index';
import {
	buildPaginationQuery,
	logFacebookEvent,
	upsertPageEntity,
} from './shared';
import type { FacebookEndpointOutputs } from './types';

export const getCurrentUser: FacebookEndpoints['getCurrentUser'] = async (
	ctx,
	input,
) => {
	const result = await makeFacebookRequest<
		FacebookEndpointOutputs['getCurrentUser']
	>('/me', ctx.key, {
		query: {
			fields: input.fields ?? 'id,name,email',
		},
	});

	if (result.id) {
		try {
			await ctx.db.users.upsertByEntityId(result.id, {
				facebookUserId: result.id,
				name: result.name,
				email: result.email,
			});
		} catch {
			// Non-fatal cache write
		}
	}

	await logFacebookEvent(ctx, 'facebook.users.getCurrentUser', { ...input });
	return result;
};

export const getUserPages: FacebookEndpoints['getUserPages'] = async (
	ctx,
	input,
) => {
	const result = await makeFacebookRequest<
		FacebookEndpointOutputs['getUserPages']
	>('/me/accounts', ctx.key, {
		query: buildPaginationQuery({
			fields:
				input.fields ?? 'id,name,access_token,category,category_list,tasks',
			limit: input.limit,
			after: input.after,
			before: input.before,
		}),
	});

	await logFacebookEvent(ctx, 'facebook.users.getUserPages', { ...input });
	return result;
};

export const listManagedPages: FacebookEndpoints['listManagedPages'] = async (
	ctx,
	input,
) => {
	const result = await makeFacebookRequest<
		FacebookEndpointOutputs['listManagedPages']
	>('/me/accounts', ctx.key, {
		query: buildPaginationQuery({
			fields:
				input.fields ?? 'id,name,access_token,category,category_list,tasks',
			limit: input.limit,
			after: input.after,
			before: input.before,
		}),
	});

	if (result.data) {
		for (const page of result.data) {
			if (!page.id) continue;
			await upsertPageEntity(ctx, page.id, {
				facebookId: page.id,
				name: page.name,
				accessToken: page.access_token,
				category: page.category,
				tasks: page.tasks,
			});
		}
	}

	await logFacebookEvent(ctx, 'facebook.pages.listManaged', { ...input });
	return result;
};
