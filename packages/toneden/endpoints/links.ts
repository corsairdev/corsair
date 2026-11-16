import type { ToneDenEndpoints } from '..';
import { segment } from '../client';
import { call, writeBody } from './call';
import {
	ToneDenEndpointInputSchemas,
	ToneDenEndpointOutputSchemas,
} from './types';

export const list: ToneDenEndpoints['linksList'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'links.list',
			input: ToneDenEndpointInputSchemas.listLinks,
			output: ToneDenEndpointOutputSchemas.listLinks,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: 'links',
			query: {
				target_type: parsed.target_type,
				offset: parsed.offset,
				limit: parsed.limit,
			},
		}),
		{ log: (_parsed, result) => ({ links: result.links.length }) },
	);

export const listForUser: ToneDenEndpoints['linksListForUser'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'links.listForUser',
			input: ToneDenEndpointInputSchemas.listUserLinks,
			output: ToneDenEndpointOutputSchemas.listUserLinks,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `users/${segment(parsed.user_id)}/links`,
			query: {
				target_type: parsed.target_type,
				offset: parsed.offset,
				limit: parsed.limit,
			},
		}),
		{
			log: (parsed, result) => ({
				user_id: parsed.user_id,
				links: result.links.length,
			}),
		},
	);

export const get: ToneDenEndpoints['linksGet'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'links.get',
			input: ToneDenEndpointInputSchemas.getLink,
			output: ToneDenEndpointOutputSchemas.getLink,
		},
		input,
		(parsed) => ({ method: 'GET', path: `links/${segment(parsed.link_id)}` }),
		{ log: (parsed) => ({ link_id: parsed.link_id }) },
	);

export const create: ToneDenEndpoints['linksCreate'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'links.create',
			input: ToneDenEndpointInputSchemas.createLink,
			output: ToneDenEndpointOutputSchemas.createLink,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: 'links',
			body: writeBody(parsed as Record<string, unknown>, []),
		}),
		{ log: (parsed) => ({ target_type: parsed.target_type }) },
	);

export const update: ToneDenEndpoints['linksUpdate'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'links.update',
			input: ToneDenEndpointInputSchemas.updateLink,
			output: ToneDenEndpointOutputSchemas.updateLink,
		},
		input,
		(parsed) => ({
			method: 'PUT',
			path: `links/${segment(parsed.link_id)}`,
			body: writeBody(parsed as Record<string, unknown>, ['link_id']),
		}),
		{ log: (parsed) => ({ link_id: parsed.link_id }) },
	);

export const remove: ToneDenEndpoints['linksDelete'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'links.delete',
			input: ToneDenEndpointInputSchemas.deleteLink,
			output: ToneDenEndpointOutputSchemas.deleteLink,
		},
		input,
		(parsed) => ({
			method: 'DELETE',
			path: `links/${segment(parsed.link_id)}`,
		}),
		{ log: (parsed) => ({ link_id: parsed.link_id }) },
	);

export const expand: ToneDenEndpoints['linksExpand'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'links.expand',
			input: ToneDenEndpointInputSchemas.expandLink,
			output: ToneDenEndpointOutputSchemas.expandLink,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: 'links/expand',
			query: { url: parsed.url },
		}),
		{ log: (_parsed, result) => ({ services: result.services?.length ?? 0 }) },
	);

export const validPath: ToneDenEndpoints['linksValidPath'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'links.validPath',
			input: ToneDenEndpointInputSchemas.validPath,
			output: ToneDenEndpointOutputSchemas.validPath,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: 'links/validPath',
			query: {
				path: parsed.path,
				subdomain: parsed.subdomain,
				custom_domain: parsed.custom_domain,
			},
		}),
		{ log: (_parsed, result) => ({ valid: result.valid }) },
	);

export const insights: ToneDenEndpoints['linksInsights'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'links.insights',
			input: ToneDenEndpointInputSchemas.linkInsights,
			output: ToneDenEndpointOutputSchemas.linkInsights,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `links/${segment(parsed.link_id)}/insights`,
			query: {
				metric: parsed.metric,
				start_date: parsed.start_date,
				end_date: parsed.end_date,
				aggregate_interval: parsed.aggregate_interval,
				aggregate_geo: parsed.aggregate_geo,
				aggregate_by_referrer: parsed.aggregate_by_referrer,
				aggregate_by_service: parsed.aggregate_by_service,
				for_distinct_fans: parsed.for_distinct_fans,
			},
		}),
		{ log: (parsed) => ({ link_id: parsed.link_id }) },
	);

export const insightsOverview: ToneDenEndpoints['linksInsightsOverview'] =
	async (ctx, input) =>
		call(
			ctx,
			{
				event: 'links.insightsOverview',
				input: ToneDenEndpointInputSchemas.linkInsightsOverview,
				output: ToneDenEndpointOutputSchemas.linkInsightsOverview,
			},
			input,
			(parsed) => ({
				method: 'GET',
				path: `links/${segment(parsed.link_id)}/insights/overview`,
			}),
			{ log: (parsed) => ({ link_id: parsed.link_id }) },
		);
