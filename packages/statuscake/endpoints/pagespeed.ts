import type { StatusCakeEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	StatusCakeEndpointInputSchemas as Inputs,
	StatusCakeEndpointOutputSchemas as Outputs,
} from './types';

export const list: StatusCakeEndpoints['pagespeedList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'pagespeed.list',
			input: Inputs.pagespeedList,
			output: Outputs.pagespeedList,
		},
		input,
		({ page, limit }) => ({
			method: 'GET',
			path: '/pagespeed',
			query: { page, limit },
		}),
		{
			log: (_, result) => ({
				count: result.data.length,
				totalCount: result.metadata.total_count ?? undefined,
			}),
		},
	);

export const create: StatusCakeEndpoints['pagespeedCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'pagespeed.create',
			input: Inputs.pagespeedCreate,
			output: Outputs.pagespeedCreate,
		},
		input,
		({
			name,
			website_url,
			check_rate,
			region,
			alert_bigger,
			alert_slower,
			alert_smaller,
			contact_groups,
			paused,
		}) => ({
			method: 'POST',
			path: '/pagespeed',
			form: {
				name,
				website_url,
				check_rate,
				region,
				alert_bigger,
				alert_slower,
				alert_smaller,
				contact_groups,
				paused,
			},
		}),
		{
			log: (_, result) => ({ newId: result.data.new_id ?? undefined }),
		},
	);

export const get: StatusCakeEndpoints['pagespeedGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'pagespeed.get',
			input: Inputs.pagespeedGet,
			output: Outputs.pagespeedGet,
		},
		input,
		({ test_id }) => ({
			method: 'GET',
			path: `/pagespeed/${segment(test_id)}`,
		}),
		{
			log: (_, result) => ({ id: result.data.id ?? undefined }),
		},
	);

export const update: StatusCakeEndpoints['pagespeedUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'pagespeed.update',
			input: Inputs.pagespeedUpdate,
			output: Outputs.pagespeedUpdate,
		},
		input,
		({
			test_id,
			name,
			website_url,
			check_rate,
			region,
			alert_bigger,
			alert_slower,
			alert_smaller,
			contact_groups,
			paused,
		}) => ({
			method: 'PUT',
			path: `/pagespeed/${segment(test_id)}`,
			form: {
				name,
				website_url,
				check_rate,
				region,
				alert_bigger,
				alert_slower,
				alert_smaller,
				contact_groups,
				paused,
			},
		}),
		{
			shape: (_raw, { test_id }) => ({ success: true, id: test_id }),
			log: ({ test_id }) => ({ id: test_id }),
		},
	);

// `delete` is a reserved word, so the function is named remove and the
// nested map registers it under the delete key.
export const remove: StatusCakeEndpoints['pagespeedDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'pagespeed.delete',
			input: Inputs.pagespeedDelete,
			output: Outputs.pagespeedDelete,
		},
		input,
		({ test_id }) => ({
			method: 'DELETE',
			path: `/pagespeed/${segment(test_id)}`,
		}),
		{
			shape: (_raw, { test_id }) => ({ success: true, id: test_id }),
			log: ({ test_id }) => ({ id: test_id }),
		},
	);

export const history: StatusCakeEndpoints['pagespeedHistory'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'pagespeed.history',
			input: Inputs.pagespeedHistory,
			output: Outputs.pagespeedHistory,
		},
		input,
		({ test_id, limit, before, after }) => ({
			method: 'GET',
			path: `/pagespeed/${segment(test_id)}/history`,
			query: { limit, before, after },
		}),
		{
			log: (_, result) => ({
				count: result.data.length,
				hasMore: result.links.next !== undefined,
			}),
		},
	);
