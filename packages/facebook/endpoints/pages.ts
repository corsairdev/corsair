import { makeFacebookRequest, makePageFacebookRequest } from '../client';
import type { FacebookEndpoints } from '../index';
import {
	buildPaginationQuery,
	logFacebookEvent,
	omitUndefined,
	upsertPageEntity,
} from './shared';
import type { FacebookEndpointOutputs } from './types';

function formatMetric(metric: string | string[]): string {
	return Array.isArray(metric) ? metric.join(',') : metric;
}

export const getDetails: FacebookEndpoints['getPageDetails'] = async (
	ctx,
	input,
) => {
	const result = await makePageFacebookRequest<
		FacebookEndpointOutputs['getPageDetails']
	>(`/${input.page_id}`, ctx, input.page_id, {
		query: {
			fields:
				input.fields ??
				'id,name,category,category_list,about,link,phone,website,emails,picture',
		},
	});

	if (result.id) {
		await upsertPageEntity(ctx, result.id, {
			facebookId: result.id,
			name: result.name,
			category: result.category,
			about: result.about,
			link: result.link,
			phone: result.phone,
			website: result.website,
		});
	}

	await logFacebookEvent(ctx, 'facebook.pages.getDetails', { ...input });
	return result;
};

export const search: FacebookEndpoints['searchPages'] = async (ctx, input) => {
	const result = await makeFacebookRequest<
		FacebookEndpointOutputs['searchPages']
	>('/pages/search', ctx.key, {
		query: {
			q: input.q,
			fields: input.fields ?? 'id,name,category,link',
			limit: input.limit,
			after: input.after,
		},
	});

	await logFacebookEvent(ctx, 'facebook.pages.search', { ...input });
	return result;
};

export const updateSettings: FacebookEndpoints['updatePageSettings'] = async (
	ctx,
	input,
) => {
	const { page_id, ...settings } = input;
	const result = await makePageFacebookRequest<
		FacebookEndpointOutputs['updatePageSettings']
	>(`/${page_id}`, ctx, page_id, {
		method: 'POST',
		body: omitUndefined(settings),
	});

	await logFacebookEvent(ctx, 'facebook.pages.updateSettings', { ...input });
	return result;
};

export const getInsights: FacebookEndpoints['getPageInsights'] = async (
	ctx,
	input,
) => {
	const { page_id, metric, period, since, until } = input;
	const result = await makePageFacebookRequest<
		FacebookEndpointOutputs['getPageInsights']
	>(`/${page_id}/insights`, ctx, page_id, {
		query: omitUndefined({
			metric: formatMetric(metric),
			period,
			since,
			until,
		}),
	});

	if (result.data) {
		for (const insight of result.data) {
			const insightId =
				insight.id ?? `${page_id}:${insight.name}:${period ?? 'default'}`;
			try {
				await ctx.db.insights.upsertByEntityId(insightId, {
					insightId,
					objectId: page_id,
					name: insight.name,
					period: insight.period ?? period,
					value: insight.values?.[0]?.value,
					endTime: insight.values?.[0]?.end_time,
				});
			} catch {
				// Non-fatal cache write
			}
		}
	}

	await logFacebookEvent(ctx, 'facebook.pages.getInsights', { ...input });
	return result;
};

export const getRoles: FacebookEndpoints['getPageRoles'] = async (
	ctx,
	input,
) => {
	const result = await makePageFacebookRequest<
		FacebookEndpointOutputs['getPageRoles']
	>(`/${input.page_id}/roles`, ctx, input.page_id, {
		query: buildPaginationQuery({
			fields: input.fields ?? 'id,name,role',
			limit: input.limit,
			after: input.after,
			before: input.before,
		}),
	});

	if (result.data) {
		for (const role of result.data) {
			if (!role.id) continue;
			try {
				await ctx.db.pageRoles.upsertByEntityId(`${input.page_id}:${role.id}`, {
					pageId: input.page_id,
					userId: role.id,
					name: role.name,
					role: role.role,
				});
			} catch {
				// Non-fatal cache write
			}
		}
	}

	await logFacebookEvent(ctx, 'facebook.pages.getRoles', { ...input });
	return result;
};

export const assignTask: FacebookEndpoints['assignPageTask'] = async (
	ctx,
	input,
) => {
	const { page_id, user, tasks } = input;
	const result = await makePageFacebookRequest<
		FacebookEndpointOutputs['assignPageTask']
	>(`/${page_id}/assigned_users`, ctx, page_id, {
		method: 'POST',
		body: { user, tasks },
	});

	await logFacebookEvent(ctx, 'facebook.pages.assignTask', { ...input });
	return result;
};

export const removeTask: FacebookEndpoints['removePageTask'] = async (
	ctx,
	input,
) => {
	const { page_id, user } = input;
	const result = await makePageFacebookRequest<
		FacebookEndpointOutputs['removePageTask']
	>(`/${page_id}/assigned_users`, ctx, page_id, {
		method: 'DELETE',
		query: { user },
	});

	await logFacebookEvent(ctx, 'facebook.pages.removeTask', { ...input });
	return result;
};
