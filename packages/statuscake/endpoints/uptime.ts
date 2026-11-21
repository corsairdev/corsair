import type { StatusCakeEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import { tagQuery } from './heartbeat';
import {
	StatusCakeEndpointInputSchemas as Inputs,
	StatusCakeEndpointOutputSchemas as Outputs,
} from './types';

export const list: StatusCakeEndpoints['uptimeList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'uptime.list',
			input: Inputs.uptimeList,
			output: Outputs.uptimeList,
		},
		input,
		({ status, page, limit, tags, matchany }) => ({
			method: 'GET',
			path: '/uptime',
			query: { status, page, limit, ...tagQuery(tags, matchany) },
		}),
		{
			log: (_, result) => ({
				count: result.data.length,
				totalCount: result.metadata.total_count ?? undefined,
			}),
		},
	);

export const create: StatusCakeEndpoints['uptimeCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'uptime.create',
			input: Inputs.uptimeCreate,
			output: Outputs.uptimeCreate,
		},
		input,
		({
			name,
			test_type,
			website_url,
			check_rate,
			basic_username,
			basic_password,
			confirmation,
			contact_groups,
			custom_header,
			do_not_find,
			dns_ips,
			dns_server,
			enable_ssl_alert,
			final_endpoint,
			find_string,
			follow_redirects,
			host,
			include_header,
			paused,
			port,
			post_body,
			post_raw,
			regions,
			status_codes_csv,
			tags,
			timeout,
			trigger_rate,
			use_jar,
			user_agent,
		}) => ({
			method: 'POST',
			path: '/uptime',
			form: {
				name,
				test_type,
				website_url,
				check_rate,
				basic_username,
				basic_password,
				confirmation,
				contact_groups,
				custom_header,
				do_not_find,
				dns_ips,
				dns_server,
				enable_ssl_alert,
				final_endpoint,
				find_string,
				follow_redirects,
				host,
				include_header,
				paused,
				port,
				post_body,
				post_raw,
				regions,
				status_codes_csv,
				tags,
				timeout,
				trigger_rate,
				use_jar,
				user_agent,
			},
		}),
		{
			log: (_, result) => ({ newId: result.data.new_id ?? undefined }),
		},
	);

export const get: StatusCakeEndpoints['uptimeGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'uptime.get',
			input: Inputs.uptimeGet,
			output: Outputs.uptimeGet,
		},
		input,
		({ test_id }) => ({
			method: 'GET',
			path: `/uptime/${segment(test_id)}`,
		}),
		{
			log: (_, result) => ({
				id: result.data.id ?? undefined,
				status: result.data.status ?? undefined,
			}),
		},
	);

export const update: StatusCakeEndpoints['uptimeUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'uptime.update',
			input: Inputs.uptimeUpdate,
			output: Outputs.uptimeUpdate,
		},
		input,
		({
			test_id,
			name,
			website_url,
			check_rate,
			basic_username,
			basic_password,
			confirmation,
			contact_groups,
			custom_header,
			do_not_find,
			dns_ips,
			dns_server,
			enable_ssl_alert,
			final_endpoint,
			find_string,
			follow_redirects,
			host,
			include_header,
			paused,
			port,
			post_body,
			post_raw,
			regions,
			status_codes_csv,
			tags,
			timeout,
			trigger_rate,
			use_jar,
			user_agent,
		}) => ({
			method: 'PUT',
			path: `/uptime/${segment(test_id)}`,
			form: {
				name,
				website_url,
				check_rate,
				basic_username,
				basic_password,
				confirmation,
				contact_groups,
				custom_header,
				do_not_find,
				dns_ips,
				dns_server,
				enable_ssl_alert,
				final_endpoint,
				find_string,
				follow_redirects,
				host,
				include_header,
				paused,
				port,
				post_body,
				post_raw,
				regions,
				status_codes_csv,
				tags,
				timeout,
				trigger_rate,
				use_jar,
				user_agent,
			},
		}),
		{
			shape: (_raw, { test_id }) => ({ success: true, id: test_id }),
			log: ({ test_id }) => ({ id: test_id }),
		},
	);

// `delete` is a reserved word, so the function is named remove and the
// nested map registers it under the delete key.
export const remove: StatusCakeEndpoints['uptimeDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'uptime.delete',
			input: Inputs.uptimeDelete,
			output: Outputs.uptimeDelete,
		},
		input,
		({ test_id }) => ({
			method: 'DELETE',
			path: `/uptime/${segment(test_id)}`,
		}),
		{
			shape: (_raw, { test_id }) => ({ success: true, id: test_id }),
			log: ({ test_id }) => ({ id: test_id }),
		},
	);

export const alerts: StatusCakeEndpoints['uptimeAlerts'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'uptime.alerts',
			input: Inputs.uptimeAlerts,
			output: Outputs.uptimeAlerts,
		},
		input,
		({ test_id, limit, before, after }) => ({
			method: 'GET',
			path: `/uptime/${segment(test_id)}/alerts`,
			query: { limit, before, after },
		}),
		{
			log: (_, result) => ({
				count: result.data.length,
				hasMore: result.links.next !== undefined,
			}),
		},
	);

export const history: StatusCakeEndpoints['uptimeHistory'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'uptime.history',
			input: Inputs.uptimeHistory,
			output: Outputs.uptimeHistory,
		},
		input,
		({ test_id, limit, before, after }) => ({
			method: 'GET',
			path: `/uptime/${segment(test_id)}/history`,
			query: { limit, before, after },
		}),
		{
			log: (_, result) => ({
				count: result.data.length,
				hasMore: result.links.next !== undefined,
			}),
		},
	);

export const periods: StatusCakeEndpoints['uptimePeriods'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'uptime.periods',
			input: Inputs.uptimePeriods,
			output: Outputs.uptimePeriods,
		},
		input,
		({ test_id, limit, before, after }) => ({
			method: 'GET',
			path: `/uptime/${segment(test_id)}/periods`,
			query: { limit, before, after },
		}),
		{
			log: (_, result) => ({
				count: result.data.length,
				hasMore: result.links.next !== undefined,
			}),
		},
	);
