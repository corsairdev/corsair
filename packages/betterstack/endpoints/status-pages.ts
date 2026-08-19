import { logEventFromContext } from 'corsair/core';
import { makeBetterstackRequest } from '../client';
import type { BetterstackEndpoints } from '../index';
import { auditPayload } from './logging';
import { cacheStatusPages, cacheStatusPagesList } from './persist';
import { buildPath, withPagination } from './shared';
import type { BetterstackEndpointOutputs } from './types';

export const get: BetterstackEndpoints['statusPagesGet'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['statusPagesGet']
	>(
		buildPath('/api/v2/status-pages/{status_page_id}', {
			status_page_id: input.status_page_id,
		}),
		ctx.key,
		{
			method: 'GET',
		},
	);

	await cacheStatusPages(ctx.db.statusPages, result?.data);

	await logEventFromContext(
		ctx,
		'betterstack.statusPages.get',
		auditPayload(input, ['status_page_id']),
		'completed',
	);
	return result;
};

export const list: BetterstackEndpoints['statusPagesList'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['statusPagesList']
	>('/api/v2/status-pages', ctx.key, {
		method: 'GET',
		query: withPagination(input),
	});

	await cacheStatusPagesList(ctx.db.statusPages, result?.data);

	await logEventFromContext(
		ctx,
		'betterstack.statusPages.list',
		auditPayload(input, []),
		'completed',
	);
	return result;
};

export const update: BetterstackEndpoints['statusPagesUpdate'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['statusPagesUpdate']
	>(
		buildPath('/api/v2/status-pages/{status_page_id}', {
			status_page_id: input.status_page_id,
		}),
		ctx.key,
		{
			method: 'PATCH',
			body: {
				history: input.history,
				company_name: input.company_name,
				company_url: input.company_url,
				contact_url: input.contact_url,
				logo_url: input.logo_url,
				dark_logo_url: input.dark_logo_url,
				whitelabeled: input.whitelabeled,
				timezone: input.timezone,
				subdomain: input.subdomain,
				custom_domain: input.custom_domain,
				min_incident_length: input.min_incident_length,
				subscribable: input.subscribable,
				hide_from_search_engines: input.hide_from_search_engines,
				custom_css: input.custom_css,
				custom_javascript: input.custom_javascript,
				design: input.design,
				navigation_links: input.navigation_links,
				theme: input.theme,
				layout: input.layout,
				google_analytics_id: input.google_analytics_id,
				announcement: input.announcement,
				announcement_embed_visible: input.announcement_embed_visible,
				announcement_embed_link: input.announcement_embed_link,
				announcement_embed_custom_css: input.announcement_embed_custom_css,
				automatic_reports: input.automatic_reports,
				published: input.published,
				password_enabled: input.password_enabled,
				password: input.password,
				require_sso: input.require_sso,
				ip_allowlist: input.ip_allowlist,
				status_page_group_id: input.status_page_group_id,
			},
		},
	);

	await cacheStatusPages(ctx.db.statusPages, result?.data);

	await logEventFromContext(
		ctx,
		'betterstack.statusPages.update',
		auditPayload(input, ['status_page_id', 'status_page_group_id']),
		'completed',
	);
	return result;
};
