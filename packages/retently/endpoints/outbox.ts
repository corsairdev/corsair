import type { RetentlyEndpoints } from '..';
import { attributesQuery, call } from './call';
import {
	RetentlyEndpointInputSchemas as Inputs,
	RetentlyEndpointOutputSchemas as Outputs,
} from './types';

export const list: RetentlyEndpoints['outboxList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'outbox.list',
			input: Inputs.outboxList,
			output: Outputs.outboxList,
		},
		input,
		({
			email,
			campaignId,
			page,
			limit,
			sort,
			startDate,
			endDate,
			channel,
			sentBy,
			attributes,
			match,
		}) => ({
			method: 'GET',
			path: '/outbox',
			query: {
				email,
				campaignId,
				page,
				limit,
				sort,
				startDate,
				endDate,
				channel,
				sentBy,
				match,
				...attributesQuery(attributes),
			},
			replayable: true,
		}),
		{
			log: (_, result) => ({
				count: result.data?.surveys?.length ?? 0,
				total: result.data?.total ?? undefined,
			}),
		},
	);
