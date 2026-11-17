import type { SimplesatEndpoints } from '..';
import { segment } from '../client';
import { call, pageShape, parseNextLink } from './shared';
import type { SimplesatAnswer, SimplesatPage } from './types';
import {
	SimplesatEndpointInputSchemas as Inputs,
	SimplesatEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Search is a POST because the body takes a filter list and a date range. The
 * page links come from the query string, so a `next` path is followed as a GET
 * against that path, not as another POST.
 */
export const search: SimplesatEndpoints['answersSearch'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'answers.search',
			input: Inputs.answersSearch,
			output: Outputs.answersSearch,
		},
		input,
		(parsed) => {
			const path = parsed.next ? parseNextLink(parsed.next) : null;
			if (parsed.next && !path) {
				throw new Error(
					'answers.search needs the `next` path Simplesat returned, such as /api/v1/answers/search?page=2.',
				);
			}
			return path
				? { method: 'GET', path }
				: {
						method: 'POST',
						path: '/api/v1/answers/search',
						query: { page: parsed.page, page_size: parsed.page_size },
						body: {
							start_date: parsed.start_date,
							end_date: parsed.end_date,
							filters: parsed.filters,
						},
					};
		},
		{
			shape: (raw) => pageShape<SimplesatPage<SimplesatAnswer>>(raw, 'answers'),
			log: (_, result) => ({
				count: result.results.length,
				total: result.count ?? undefined,
			}),
		},
	);

export const get: SimplesatEndpoints['answersGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'answers.get',
			input: Inputs.answersGet,
			output: Outputs.answersGet,
		},
		input,
		({ answer_id }) => ({
			method: 'GET',
			path: `/api/v1/answers/${segment(answer_id)}`,
		}),
		{ log: ({ answer_id }) => ({ answerId: answer_id }) },
	);

/**
 * Only the answer's own values change here. Which question it belongs to and
 * its survey are fixed once the response exists.
 */
export const update: SimplesatEndpoints['answersUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'answers.update',
			input: Inputs.answersUpdate,
			output: Outputs.answersUpdate,
		},
		input,
		({ answer_id, ...body }) => ({
			method: 'PUT',
			path: `/api/v1/answers/${segment(answer_id)}`,
			body,
		}),
		{ log: ({ answer_id }) => ({ answerId: answer_id }) },
	);
