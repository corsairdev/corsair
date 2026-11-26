import type { MailerLiteEndpoints } from '..';
import { call } from './call';
import {
	MailerLiteEndpointInputSchemas as Inputs,
	MailerLiteEndpointOutputSchemas as Outputs,
} from './types';

export const list: MailerLiteEndpoints['fieldsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'fields.list',
			input: Inputs.fieldsList,
			output: Outputs.fieldsList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/fields',
			query: {
				'filter[keyword]': parsed.filterKeyword,
				'filter[type]': parsed.filterType,
				sort: parsed.sort,
				limit: parsed.limit,
				page: parsed.page,
			},
			replayable: true,
		}),
		{ log: (_, result) => ({ count: result.data.length }) },
	);
