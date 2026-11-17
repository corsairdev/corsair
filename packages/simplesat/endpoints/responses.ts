import type { SimplesatEndpoints } from '..';
import { segment } from '../client';
import { call, pageShape, parseNextLink } from './shared';
import type { SimplesatPage, SimplesatResponse } from './types';
import {
	SimplesatEndpointInputSchemas as Inputs,
	SimplesatEndpointOutputSchemas as Outputs,
} from './types';

export const search: SimplesatEndpoints['responsesSearch'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'responses.search',
			input: Inputs.responsesSearch,
			output: Outputs.responsesSearch,
		},
		input,
		(parsed) => {
			const path = parsed.next ? parseNextLink(parsed.next) : null;
			if (parsed.next && !path) {
				throw new Error(
					'responses.search needs the `next` path Simplesat returned, such as /api/v1/responses/search?page=2.',
				);
			}
			return path
				? { method: 'GET', path }
				: {
						method: 'POST',
						path: '/api/v1/responses/search',
						query: { page: parsed.page, page_size: parsed.page_size },
						body: {
							start_date: parsed.start_date,
							created_start_date: parsed.created_start_date,
							end_date: parsed.end_date,
							created_end_date: parsed.created_end_date,
							modified_start_date: parsed.modified_start_date,
							modified_end_date: parsed.modified_end_date,
							filters: parsed.filters,
						},
					};
		},
		{
			shape: (raw) =>
				pageShape<SimplesatPage<SimplesatResponse>>(raw, 'responses'),
			log: (_, result) => ({
				count: result.results.length,
				total: result.count ?? undefined,
			}),
		},
	);

/**
 * Creates a response, or updates the one matching it when one already exists.
 * Supplying `created` backdates it, which is how a survey answered elsewhere is
 * imported.
 */
export const create: SimplesatEndpoints['responsesCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'responses.create',
			input: Inputs.responsesCreate,
			output: Outputs.responsesCreate,
		},
		input,
		(body) => ({
			method: 'POST',
			path: '/api/v1/responses/create-or-update',
			body,
		}),
		{
			log: (parsed, result) => ({
				responseId: result.id ?? undefined,
				surveyId: parsed.survey_id,
				answers: parsed.answers?.length ?? 0,
			}),
		},
	);

export const get: SimplesatEndpoints['responsesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'responses.get',
			input: Inputs.responsesGet,
			output: Outputs.responsesGet,
		},
		input,
		({ response_id }) => ({
			method: 'GET',
			path: `/api/v1/responses/${segment(response_id)}`,
		}),
		{ log: ({ response_id }) => ({ responseId: response_id }) },
	);

export const update: SimplesatEndpoints['responsesUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'responses.update',
			input: Inputs.responsesUpdate,
			output: Outputs.responsesUpdate,
		},
		input,
		({ response_id, ...body }) => ({
			method: 'PUT',
			path: `/api/v1/responses/${segment(response_id)}/update`,
			body,
		}),
		{ log: ({ response_id }) => ({ responseId: response_id }) },
	);
