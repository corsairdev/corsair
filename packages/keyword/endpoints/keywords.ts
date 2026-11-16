import { asRecord } from 'corsair/core';
import type { KeywordEndpoints } from '..';
import { definedQuery, projectSegment, segment } from '../client';
import { call, dropUndefined, resourceBody, resourcesBody } from './call';
import {
	KeywordEndpointInputSchemas as Inputs,
	KEYWORD_STATUS_CODES,
	KeywordEndpointOutputSchemas as Outputs,
} from './types';

export const list: KeywordEndpoints['keywordsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'keywords.list',
			input: Inputs.keywordsList,
			output: Outputs.keywordsList,
		},
		input,
		({ projectName, page, per_page, date }) => ({
			method: 'GET',
			path: `/groups/${projectSegment(projectName)}/keywords`,
			query: definedQuery({ page, per_page, date }),
		}),
		{
			log: ({ projectName }, result) => ({
				projectName,
				count: result.data.length,
			}),
		},
	);

export const get: KeywordEndpoints['keywordsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'keywords.get',
			input: Inputs.keywordsGet,
			output: Outputs.keywordsGet,
		},
		input,
		({ projectName, keywordId, date }) => ({
			method: 'GET',
			path: `/groups/${projectSegment(projectName)}/keywords/${segment(keywordId)}`,
			query: definedQuery({ date }),
		}),
		{
			shape: wrapBareKeyword,
			log: ({ projectName }, result) => ({
				projectName,
				keywordId: result.data.id,
			}),
		},
	);

export const add: KeywordEndpoints['keywordsAdd'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'keywords.add',
			input: Inputs.keywordsAdd,
			output: Outputs.keywordsAdd,
		},
		input,
		({ projectName, keywords }) => ({
			method: 'POST',
			path: `/groups/${projectSegment(projectName)}/keywords`,
			body: resourcesBody(
				'keyword',
				keywords.map((keyword) =>
					dropUndefined({ category: projectName, ...keyword }),
				),
			),
		}),
		{
			log: ({ projectName }, result) => ({
				projectName,
				added: result.data.length,
			}),
		},
	);

export const update: KeywordEndpoints['keywordsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'keywords.update',
			input: Inputs.keywordsUpdate,
			output: Outputs.keywordsUpdate,
		},
		input,
		({ projectName, keywordId, status, start, ...attributes }) => ({
			method: 'PATCH',
			path: `/groups/${projectSegment(projectName)}/keywords/${segment(keywordId)}`,
			body: resourceBody(
				'keyword',
				dropUndefined({
					...attributes,
					status:
						status === undefined ? undefined : KEYWORD_STATUS_CODES[status],
					baseline: start,
				}),
			),
		}),
		{
			log: ({ projectName, keywordId }) => ({
				projectName,
				keywordId: String(keywordId),
			}),
		},
	);

export const remove: KeywordEndpoints['keywordsRemove'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'keywords.delete',
			input: Inputs.keywordsRemove,
			output: Outputs.keywordsRemove,
		},
		input,
		({ projectName, keywordId }) => ({
			method: 'DELETE',
			path: `/groups/${projectSegment(projectName)}/keywords/${segment(keywordId)}`,
		}),
		{
			log: ({ projectName, keywordId }) => ({
				projectName,
				keywordId: String(keywordId),
			}),
		},
	);

// The bulk routes are scoped by project ID, which is the numeric one, rather
// than the project name the single-keyword routes use.
export const bulkRemove: KeywordEndpoints['keywordsBulkRemove'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'keywords.bulkDelete',
			input: Inputs.keywordsBulkRemove,
			output: Outputs.keywordsBulkRemove,
		},
		input,
		({ projectId, keywordIds }) => ({
			method: 'DELETE',
			path: `/projects/${segment(projectId)}/keywords`,
			body: { data: { type: 'keyword', ids: keywordIds.map(String) } },
		}),
		{
			log: ({ projectId }, result) => ({
				projectId,
				deleted: result.meta?.title,
			}),
		},
	);

export const bulkUpdate: KeywordEndpoints['keywordsBulkUpdate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'keywords.bulkUpdate',
			input: Inputs.keywordsBulkUpdate,
			output: Outputs.keywordsBulkUpdate,
		},
		input,
		({ projectId, keywordIds, changes }) => ({
			method: 'PATCH',
			path: `/projects/${segment(projectId)}/keywords`,
			body: {
				data: {
					ids: keywordIds.map(String),
					type: 'keyword',
					attributes: dropUndefined({
						...changes,
						status:
							changes.status === undefined
								? undefined
								: KEYWORD_STATUS_CODES[changes.status],
					}),
				},
			},
		}),
		{
			log: ({ projectId }, result) => ({
				projectId,
				updated: result.meta?.title,
			}),
		},
	);

export const refresh: KeywordEndpoints['keywordsRefresh'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'keywords.refresh',
			input: Inputs.keywordsRefresh,
			output: Outputs.keywordsRefresh,
		},
		input,
		({ keywordIds }) => ({
			method: 'POST',
			path: '/keywords/refresh',
			body: { data: { keyword_ids: keywordIds.map(String) } },
		}),
		// Only the count: the message names the plan's remaining quota.
		{ log: (_, result) => ({ message: result.message }) },
	);

/**
 * The read-by-ID route answers the bare keyword with a numeric `id` (live,
 * 11-14), where the docs and the list route use a JSON:API resource. The bare
 * form is wrapped so `keywords.get` returns the same shape as `keywords.list`.
 */
// unknown: raw is the response body; the output schema validates the result.
function wrapBareKeyword(raw: unknown): unknown {
	const record = asRecord(raw);
	if (!record || 'data' in record || record.id === undefined) return raw;
	const { id, ...attributes } = record;
	return { data: { type: 'keyword', id: String(id), attributes } };
}
