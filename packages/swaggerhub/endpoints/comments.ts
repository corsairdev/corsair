import type { SwaggerhubEndpoints } from '..';
import { segment, specPath } from '../client';
import { call, isEmptyBody, readBareArray } from './call';
import {
	SwaggerhubEndpointInputSchemas as Inputs,
	SwaggerhubEndpointOutputSchemas as Outputs,
} from './types';

/** Comments hang off one version at `/comments`. */
function commentsPath(
	owner: string,
	api: string,
	version: string,
	comment?: string,
): string {
	const base = `${specPath('apis', owner, api, version)}/comments`;
	return comment === undefined ? base : `${base}/${segment(comment)}`;
}

/**
 * Answers a **bare array** of comments, and a 204 with no body when the version
 * has none. A 204 is a real answer, not a missing resource, so it reads as an
 * empty list rather than a failure.
 */
export const list: SwaggerhubEndpoints['commentsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'comments.list',
			input: Inputs.commentsList,
			output: Outputs.commentsList,
		},
		input,
		({ owner, api, version }) => ({
			method: 'GET',
			path: commentsPath(owner, api, version),
		}),
		{
			shape: (raw, parsed) => ({
				owner: parsed.owner,
				api: parsed.api,
				version: parsed.version,
				// 204 (no body) means no comments; any other non-array is an error.
				comments: isEmptyBody(raw) ? [] : readBareArray(raw, 'comment list'),
				empty: isEmptyBody(raw) || (Array.isArray(raw) && raw.length === 0),
			}),
			log: (_, result) => ({ count: result.comments.length }),
		},
	);

export const create: SwaggerhubEndpoints['commentsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'comments.create',
			input: Inputs.commentsCreate,
			output: Outputs.commentsCreate,
		},
		input,
		({ owner, api, version, body, range }) => ({
			method: 'POST',
			path: commentsPath(owner, api, version),
			body: {
				body,
				// The route documents `replies` as required, even when it is empty.
				replies: [],
				...(range === undefined ? {} : { range }),
			},
		}),
		{
			log: (parsed, result) => ({
				owner: parsed.owner,
				api: parsed.api,
				commentId: result.id,
			}),
		},
	);

export const update: SwaggerhubEndpoints['commentsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'comments.update',
			input: Inputs.commentsUpdate,
			output: Outputs.commentsUpdate,
		},
		input,
		({ owner, api, version, comment, body }) => ({
			method: 'PATCH',
			path: commentsPath(owner, api, version, comment),
			body: { body },
		}),
		{
			log: (parsed) => ({
				owner: parsed.owner,
				api: parsed.api,
				commentId: parsed.comment,
			}),
		},
	);

export const remove: SwaggerhubEndpoints['commentsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'comments.delete',
			input: Inputs.commentsDelete,
			output: Outputs.commentsDelete,
		},
		input,
		({ owner, api, version, comment }) => ({
			method: 'DELETE',
			path: commentsPath(owner, api, version, comment),
		}),
		{
			shape: (_, parsed) => ({
				owner: parsed.owner,
				api: parsed.api,
				version: parsed.version,
				comment: parsed.comment,
				deleted: true,
			}),
			log: (parsed) => ({
				owner: parsed.owner,
				api: parsed.api,
				commentId: parsed.comment,
			}),
		},
	);

export const reply: SwaggerhubEndpoints['commentsReply'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'comments.reply',
			input: Inputs.commentsReply,
			output: Outputs.commentsReply,
		},
		input,
		({ owner, api, version, comment, body }) => ({
			method: 'POST',
			path: `${commentsPath(owner, api, version, comment)}/replies`,
			body: { body },
		}),
		{
			log: (parsed, result) => ({
				owner: parsed.owner,
				api: parsed.api,
				commentId: parsed.comment,
				replyId: result.id,
			}),
		},
	);
