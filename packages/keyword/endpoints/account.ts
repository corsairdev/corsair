import type { KeywordEndpoints } from '..';
import { definedQuery } from '../client';
import { call } from './call';
import {
	KeywordEndpointInputSchemas as Inputs,
	KeywordEndpointOutputSchemas as Outputs,
} from './types';

// `view_type` is the one parameter Keyword spells with a space (`All alerts`),
// which the query encoder turns into `%20` for the caller.
export const list: KeywordEndpoints['alertsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'alerts.list',
			input: Inputs.alertsList,
			output: Outputs.alertsList,
		},
		input,
		({ page, per_page, sort_field, sort_direction, view_type, last }) => ({
			method: 'GET',
			path: '/alerts',
			query: definedQuery({
				page,
				per_page,
				sort_field,
				sort_direction,
				view_type,
				last,
			}),
		}),
		{ log: (_, result) => ({ count: result.data.length }) },
	);

export const account: KeywordEndpoints['accountGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'account.get',
			input: Inputs.accountGet,
			output: Outputs.accountGet,
		},
		input,
		({ include }) => ({
			method: 'GET',
			path: '/users/self',
			query: definedQuery({
				include: include && include.length > 0 ? include.join(',') : undefined,
			}),
		}),
		{
			log: (_, result) => ({
				userId: result.data.attributes.user_id ?? undefined,
			}),
		},
	);
