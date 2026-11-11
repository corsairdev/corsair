import { asRecord } from 'corsair/core';
import type { LeigaEndpoints } from '..';
import { call, wrapList } from './call';
import {
	LeigaEndpointInputSchemas as Inputs,
	LeigaEndpointOutputSchemas as Outputs,
} from './types';

export const list: LeigaEndpoints['issuesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'issues.list',
			input: Inputs.issuesList,
			output: Outputs.issuesList,
		},
		input,
		({
			projectId,
			pageNumber,
			pageSize,
			summary,
			orderBy,
			sort,
			statusTypes,
		}) => ({
			// A POST, not a GET: Leiga's issue query takes its filters in a body.
			method: 'POST',
			path: '/issue/page',
			body: {
				projectId,
				...(pageNumber === undefined ? {} : { pageNumber }),
				...(pageSize === undefined ? {} : { pageSize }),
				...(summary === undefined ? {} : { summary }),
				...(orderBy === undefined ? {} : { orderBy }),
				...(sort === undefined ? {} : { sort }),
				...(statusTypes === undefined ? {} : { statusTypes }),
			},
		}),
		{
			// `{ total, list }`, unlike the bare arrays the other lists return.
			shape: (raw) => {
				const page = asRecord(raw);
				if (!page) {
					throw new Error('Leiga returned an unexpected issue page body');
				}
				const total = page.total;
				if (typeof total !== 'number') {
					throw new Error(
						'Leiga returned an issue page without a numeric total',
					);
				}
				return { issues: wrapList(page.list, 'issue page'), total };
			},
			log: (_, result) => ({
				count: result.issues.length,
				total: result.total,
			}),
		},
	);

/**
 * Flattens the double wrap on an issue detail. Leiga answers
 * `{ data: { data: {...}, id, projectId, createTime, updateTime } }`, and the
 * outer fields are worth keeping, so the inner object wins on conflict and the
 * outer audit fields fill in whatever it lacks.
 */
export function flattenIssueDetail(raw: unknown): unknown {
	const outer = asRecord(raw);
	if (!outer) {
		throw new Error('Leiga returned an unexpected issue detail body');
	}
	const inner = asRecord(outer.data);
	if (!inner) {
		throw new Error('Leiga returned an issue detail with no data object');
	}
	return { ...outer, ...inner };
}

export const get: LeigaEndpoints['issuesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'issues.get',
			input: Inputs.issuesGet,
			output: Outputs.issuesGet,
		},
		input,
		({ issueId }) => ({
			method: 'GET',
			path: '/issue/get',
			query: { id: issueId },
		}),
		{
			shape: (raw) => flattenIssueDetail(raw),
			log: (_, result) => ({ issueId: result.id }),
		},
	);

export const getByNumber: LeigaEndpoints['issuesGetByNumber'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'issues.getByNumber',
			input: Inputs.issuesGetByNumber,
			output: Outputs.issuesGetByNumber,
		},
		input,
		({ issueNumber }) => ({
			method: 'GET',
			path: '/issue/get-by-issue-number',
			query: { issueNumber },
		}),
		{
			shape: (raw) => flattenIssueDetail(raw),
			log: (_, result) => ({ issueId: result.id }),
		},
	);

export const types: LeigaEndpoints['issuesTypes'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'issues.types',
			input: Inputs.issuesTypes,
			output: Outputs.issuesTypes,
		},
		input,
		({ projectId }) => ({
			method: 'GET',
			path: '/issue/type-list',
			query: { projectId },
		}),
		{
			shape: (raw) => ({ issueTypes: wrapList(raw, 'issue type list') }),
			log: (_, result) => ({ count: result.issueTypes.length }),
		},
	);

export const fields: LeigaEndpoints['issuesFields'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'issues.fields',
			input: Inputs.issuesFields,
			output: Outputs.issuesFields,
		},
		input,
		({ projectId, issueTypeId }) => ({
			method: 'GET',
			path: '/issue/issue-fields',
			query: { projectId, issueTypeId },
		}),
		{
			// Wrapped: `{ fields: [...] }`, unlike the bare arrays the other
			// lists return. A bare array here means the body changed.
			shape: (raw) => {
				const body = asRecord(raw);
				if (!body) {
					throw new Error('Leiga returned an unexpected issue field body');
				}
				return { fields: wrapList(body.fields, 'issue field list') };
			},
			log: (_, result) => ({ count: result.fields.length }),
		},
	);
