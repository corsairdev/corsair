import type { VirustotalEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	VirustotalEndpointInputSchemas as Inputs,
	VirustotalEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Submits a URL for analysis.
 *
 * This is the one route that takes a form body rather than JSON, which is why
 * the request names its own media type. The answer is an analysis descriptor:
 * poll `analyses.get` until its status is `completed`.
 *
 * Submitting a URL also adds it to the public dataset, which the plugin cannot
 * undo — so this is a write that cannot be withdrawn.
 */
export const scan: VirustotalEndpoints['urlsScan'] = (ctx, input) =>
	call(
		ctx,
		{ event: 'urls.scan', input: Inputs.urlsScan, output: Outputs.urlsScan },
		input,
		({ url }) => ({
			method: 'POST',
			path: '/urls',
			// VirusTotal documents this route as form-encoded, not JSON.
			body: `url=${encodeURIComponent(url)}`,
			mediaType: 'application/x-www-form-urlencoded',
		}),
		{
			log: (parsed, result) => ({
				// The URL itself is the indicator, not the response, so it is logged
				// only as the analysis it produced.
				analysis: result.data?.id ?? undefined,
				submitted: parsed.url.length > 0,
			}),
		},
	);

/**
 * Reads a URL report. The id is the unpadded base64url identifier (`urlId()`
 * converts a raw URL) or the SHA-256 id a URL report returns; VirusTotal
 * resolves both. The base64url form decodes back to the full URL.
 */
export const get: VirustotalEndpoints['urlsGet'] = (ctx, input) =>
	call(
		ctx,
		{ event: 'urls.get', input: Inputs.urlsGet, output: Outputs.urlsGet },
		input,
		({ id }) => ({ method: 'GET', path: `/urls/${segment(id)}` }),
		{
			log: (_, result) => ({
				id: result.data?.id ?? undefined,
				malicious: result.data?.attributes?.last_analysis_stats?.malicious ?? 0,
			}),
		},
	);

export const rescan: VirustotalEndpoints['urlsRescan'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'urls.rescan',
			input: Inputs.urlsRescan,
			output: Outputs.urlsRescan,
		},
		input,
		({ id }) => ({ method: 'POST', path: `/urls/${segment(id)}/analyse` }),
		{
			// The id is the URL in base64url, so it would log the URL, query tokens
			// and all. Like urls.scan, only the analysis it produced is logged.
			log: (_, result) => ({
				analysis: result.data?.id ?? undefined,
			}),
		},
	);

export const comments: VirustotalEndpoints['urlsComments'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'urls.comments',
			input: Inputs.urlsComments,
			output: Outputs.urlsComments,
		},
		input,
		({ id, limit, cursor }) => ({
			method: 'GET',
			path: `/urls/${segment(id)}/comments`,
			query: { limit, cursor },
		}),
		{
			log: (_, result) => ({
				count: result.data?.length ?? 0,
				hasMore: result.meta?.cursor != null,
			}),
		},
	);

export const addComment: VirustotalEndpoints['urlsAddComment'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'urls.addComment',
			input: Inputs.urlsAddComment,
			output: Outputs.urlsAddComment,
		},
		input,
		({ id, text }) => ({
			method: 'POST',
			path: `/urls/${segment(id)}/comments`,
			body: { data: { type: 'comment', attributes: { text } } },
		}),
		{
			log: (_, result) => ({ id: result.data?.id ?? undefined }),
		},
	);
