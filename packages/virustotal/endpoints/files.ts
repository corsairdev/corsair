import type { VirustotalEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	VirustotalEndpointInputSchemas as Inputs,
	VirustotalEndpointOutputSchemas as Outputs,
} from './types';

/** The malicious count, which is the number a caller acts on. */
function verdict(
	stats: { malicious?: number | null } | null | undefined,
): number {
	return stats?.malicious ?? 0;
}

export const get: VirustotalEndpoints['filesGet'] = (ctx, input) =>
	call(
		ctx,
		{ event: 'files.get', input: Inputs.filesGet, output: Outputs.filesGet },
		input,
		({ id, relationships }) => ({
			method: 'GET',
			path: `/files/${segment(id)}`,
			query: { relationships },
		}),
		{
			log: (_, result) => ({
				id: result.data?.id ?? undefined,
				malicious: verdict(result.data?.attributes?.last_analysis_stats),
				size: result.data?.attributes?.size ?? undefined,
			}),
		},
	);

/**
 * Reanalyses a file already in the database, answering a descriptor for the new
 * analysis. Poll it with `analyses.get`.
 */
export const rescan: VirustotalEndpoints['filesRescan'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'files.rescan',
			input: Inputs.filesRescan,
			output: Outputs.filesRescan,
		},
		input,
		({ id }) => ({ method: 'POST', path: `/files/${segment(id)}/analyse` }),
		{
			log: (parsed, result) => ({
				id: parsed.id,
				analysis: result.data?.id ?? undefined,
			}),
		},
	);

export const comments: VirustotalEndpoints['filesComments'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'files.comments',
			input: Inputs.filesComments,
			output: Outputs.filesComments,
		},
		input,
		({ id, limit, cursor }) => ({
			method: 'GET',
			path: `/files/${segment(id)}/comments`,
			query: { limit, cursor },
		}),
		{
			log: (_, result) => ({
				count: result.data?.length ?? 0,
				hasMore: result.meta?.cursor != null,
			}),
		},
	);

/**
 * Posts a comment. The body is the JSON:API form the docs show —
 * `{ data: { type: 'comment', attributes: { text } } }` — not a bare string.
 * A word starting with `#` becomes a tag.
 */
export const addComment: VirustotalEndpoints['filesAddComment'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'files.addComment',
			input: Inputs.filesAddComment,
			output: Outputs.filesAddComment,
		},
		input,
		({ id, text }) => ({
			method: 'POST',
			path: `/files/${segment(id)}/comments`,
			body: { data: { type: 'comment', attributes: { text } } },
		}),
		{
			log: (_, result) => ({ id: result.data?.id ?? undefined }),
		},
	);

export const votes: VirustotalEndpoints['filesVotes'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'files.votes',
			input: Inputs.filesVotes,
			output: Outputs.filesVotes,
		},
		input,
		({ id, limit, cursor }) => ({
			method: 'GET',
			path: `/files/${segment(id)}/votes`,
			query: { limit, cursor },
		}),
		{
			log: (_, result) => ({
				count: result.data?.length ?? 0,
				hasMore: result.meta?.cursor != null,
			}),
		},
	);

/** A vote is `harmless` or `malicious`; there is no abstention. */
export const vote: VirustotalEndpoints['filesVote'] = (ctx, input) =>
	call(
		ctx,
		{ event: 'files.vote', input: Inputs.filesVote, output: Outputs.filesVote },
		input,
		({ id, verdict: choice }) => ({
			method: 'POST',
			path: `/files/${segment(id)}/votes`,
			body: {
				data: { type: 'vote', attributes: { verdict: choice } },
			},
		}),
		{
			log: (parsed, result) => ({
				id: parsed.id,
				verdict: result.data?.attributes?.verdict ?? undefined,
			}),
		},
	);
