import type { PrismicEndpoints } from '..';
import { nextPagePath, segment } from '../client';
import { call } from './call';
import {
	PrismicEndpointInputSchemas as Inputs,
	PrismicEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Reads the Content API's repository metadata: its refs, custom types, languages
 * and tags. This is what a caller needs before a document query, since a query is
 * pinned to a ref.
 */
export const info: PrismicEndpoints['repositoryInfo'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'repository.info',
			input: Inputs.repositoryInfo,
			output: Outputs.repositoryInfo,
		},
		input,
		() => ({ method: 'GET', api: 'content', url: '' }),
		{
			log: (_, result) => ({
				refs: result.refs.length,
				types: Object.keys(result.types ?? {}).length,
			}),
		},
	);

export const search: PrismicEndpoints['documentsSearch'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'documents.search',
			input: Inputs.documentsSearch,
			output: Outputs.documentsSearch,
		},
		input,
		({ page, pageSize, orderings, q, lang, tags, after, ref, nextPage }) =>
			// A next page already carries the ref and every filter, so it is followed
			// as the whole request rather than rebuilt.
			nextPage !== undefined
				? { method: 'GET', api: 'content', url: nextPagePath(nextPage) }
				: {
						method: 'GET',
						api: 'content',
						url: '/documents/search',
						query: {
							page,
							pageSize,
							orderings,
							q,
							lang,
							tags,
							after,
							ref,
						},
					},
		{
			log: (_, result) => ({
				count: result.results.length,
				total: result.total_results_size ?? undefined,
			}),
		},
	);

export const get: PrismicEndpoints['documentsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'documents.get',
			input: Inputs.documentsGet,
			output: Outputs.documentsGet,
		},
		input,
		({ id, ref, lang }) => ({
			method: 'GET',
			api: 'content',
			url: `/documents/${segment(id)}`,
			query: { ref, lang },
		}),
		{ log: ({ id }) => ({ documentId: id }) },
	);
