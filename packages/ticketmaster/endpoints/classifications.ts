import { segment } from '../client';
import type { TicketmasterEndpoints } from '../index';
import { call } from './call';
import { readEmbedded, readPage, searchQuery } from './helpers';
import {
	TicketmasterEndpointInputSchemas as Inputs,
	nextPage,
	TicketmasterEndpointOutputSchemas as Outputs,
} from './types';

export const search: TicketmasterEndpoints['classificationsSearch'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'classifications.search',
			input: Inputs.classificationsSearch,
			output: Outputs.classificationsSearch,
		},
		input,
		(parsed) => ({ path: '/classifications.json', query: searchQuery(parsed) }),
		{
			shape: (raw, parsed) => {
				const page = readPage(raw);
				return {
					classifications: readEmbedded(raw, 'classifications'),
					page,
					next_page: nextPage(page, parsed),
				};
			},
			log: (parsed, result) => ({
				page: parsed.page ?? 0,
				count: result.classifications.length,
				total: result.page?.totalElements ?? undefined,
			}),
		},
	);

export const get: TicketmasterEndpoints['classificationsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'classifications.get',
			input: Inputs.classificationsGet,
			output: Outputs.classificationsGet,
		},
		input,
		({ id, ...query }) => ({
			path: `/classifications/${segment(id)}.json`,
			query,
		}),
		{
			log: ({ id }) => ({ classificationId: id }),
		},
	);
