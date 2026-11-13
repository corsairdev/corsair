import type { KeywordEndpoints } from '..';
import { definedQuery } from '../client';
import { call } from './call';
import {
	KeywordEndpointInputSchemas as Inputs,
	KeywordEndpointOutputSchemas as Outputs,
} from './types';

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
