import type { PrismicEndpoints } from '..';
import { nextPagePath, PrismicAPIError } from '../client';
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

/**
 * Adds a `document.tags` predicate to a `q` expression. Prismic has no `tags`
 * query parameter: a tag filter is the predicate `[at(document.tags, [...])]`,
 * which every document must match alongside the caller's own predicates.
 */
export function withTagPredicate(
	q: string | undefined,
	tags: readonly string[] | undefined,
): string | undefined {
	if (!tags || tags.length === 0) return q;
	const predicate = `[at(document.tags,${JSON.stringify(tags)})]`;
	const outer = q?.trim();
	if (!outer) return `[${predicate}]`;
	// `q` is a set of predicates in one pair of brackets: `[[a][b]]`.
	if (outer.startsWith('[') && outer.endsWith(']')) {
		return `${outer.slice(0, -1)}${predicate}]`;
	}
	return `[${outer}${predicate}]`;
}

export const search: PrismicEndpoints['documentsSearch'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'documents.search',
			input: Inputs.documentsSearch,
			output: Outputs.documentsSearch,
		},
		input,
		async (
			{ page, pageSize, orderings, q, lang, tags, after, ref, nextPage },
			{ masterRef },
		) => {
			// A next page already carries the ref and every filter, so it is
			// followed as the whole request rather than rebuilt.
			if (nextPage !== undefined) {
				return { method: 'GET', api: 'content', ...nextPagePath(nextPage) };
			}
			return {
				method: 'GET',
				api: 'content',
				url: '/documents/search',
				query: {
					// Prismic answers 400 "Please specify ref" without one.
					ref: ref ?? (await masterRef()),
					q: withTagPredicate(q, tags),
					page,
					pageSize,
					orderings,
					lang,
					after,
				},
			};
		},
		{
			log: (_, result) => ({
				count: result.results.length,
				total: result.total_results_size ?? undefined,
			}),
		},
	);

/**
 * Reads one document by id. The Content API has no `/documents/:id` route, so
 * this is a search on `document.id`, across every locale unless `lang` narrows it.
 */
export const get: PrismicEndpoints['documentsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'documents.get',
			input: Inputs.documentsGet,
			output: Outputs.documentsGet,
		},
		input,
		async ({ id, ref, lang }, { masterRef }) => ({
			method: 'GET',
			api: 'content',
			url: '/documents/search',
			query: {
				ref: ref ?? (await masterRef()),
				// The input schema limits an id to Prismic's id characters, so it
				// cannot close the string or the predicate.
				q: `[[at(document.id,"${id}")]]`,
				lang: lang ?? '*',
				pageSize: 1,
			},
		}),
		{
			shape: (raw, { id }) => {
				const results = Outputs.documentsSearch.parse(raw).results;
				const document = results[0];
				if (!document) {
					throw new PrismicAPIError(
						`No published document with id ${id} at this ref.`,
					);
				}
				return document;
			},
			log: ({ id }) => ({ documentId: id }),
		},
	);
