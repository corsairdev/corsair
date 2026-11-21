import type { StatusCakeEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	StatusCakeEndpointInputSchemas as Inputs,
	StatusCakeEndpointOutputSchemas as Outputs,
} from './types';

export const list: StatusCakeEndpoints['sslList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'ssl.list',
			input: Inputs.sslList,
			output: Outputs.sslList,
		},
		input,
		({ page, limit }) => ({
			method: 'GET',
			path: '/ssl',
			query: { page, limit },
		}),
		{
			log: (_, result) => ({
				count: result.data.length,
				totalCount: result.metadata.total_count ?? undefined,
			}),
		},
	);

export const create: StatusCakeEndpoints['sslCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'ssl.create',
			input: Inputs.sslCreate,
			output: Outputs.sslCreate,
		},
		input,
		({
			website_url,
			check_rate,
			alert_at,
			alert_broken,
			alert_expiry,
			alert_mixed,
			alert_reminder,
			contact_groups,
			follow_redirects,
			hostname,
			paused,
			user_agent,
		}) => ({
			method: 'POST',
			path: '/ssl',
			form: {
				website_url,
				check_rate,
				alert_at,
				alert_broken,
				alert_expiry,
				alert_mixed,
				alert_reminder,
				contact_groups,
				follow_redirects,
				hostname,
				paused,
				user_agent,
			},
		}),
		{
			log: (_, result) => ({ newId: result.data.new_id ?? undefined }),
		},
	);

export const get: StatusCakeEndpoints['sslGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'ssl.get',
			input: Inputs.sslGet,
			output: Outputs.sslGet,
		},
		input,
		({ test_id }) => ({
			method: 'GET',
			path: `/ssl/${segment(test_id)}`,
		}),
		{
			log: (_, result) => ({
				id: result.data.id ?? undefined,
				validUntil: result.data.valid_until ?? undefined,
			}),
		},
	);

export const update: StatusCakeEndpoints['sslUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'ssl.update',
			input: Inputs.sslUpdate,
			output: Outputs.sslUpdate,
		},
		input,
		({
			test_id,
			website_url,
			check_rate,
			alert_at,
			alert_broken,
			alert_expiry,
			alert_mixed,
			alert_reminder,
			contact_groups,
			follow_redirects,
			hostname,
			paused,
			user_agent,
		}) => ({
			method: 'PUT',
			path: `/ssl/${segment(test_id)}`,
			form: {
				website_url,
				check_rate,
				alert_at,
				alert_broken,
				alert_expiry,
				alert_mixed,
				alert_reminder,
				contact_groups,
				follow_redirects,
				hostname,
				paused,
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
export const remove: StatusCakeEndpoints['sslDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'ssl.delete',
			input: Inputs.sslDelete,
			output: Outputs.sslDelete,
		},
		input,
		({ test_id }) => ({
			method: 'DELETE',
			path: `/ssl/${segment(test_id)}`,
		}),
		{
			shape: (_raw, { test_id }) => ({ success: true, id: test_id }),
			log: ({ test_id }) => ({ id: test_id }),
		},
	);
