import type { HoneybadgerEndpoints } from '..';
import { segment } from '../client';
import { call, confirmDeleted } from './call';
import {
	HoneybadgerEndpointInputSchemas as Inputs,
	HoneybadgerEndpointOutputSchemas as Outputs,
} from './types';

function faultPath(projectId: string, faultId: string): string {
	return `/projects/${segment(projectId)}/faults/${segment(faultId)}`;
}

export const commentsList: HoneybadgerEndpoints['commentsList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'comments.list',
			input: Inputs['comments.list'],
			output: Outputs['comments.list'],
		},
		input,
		({ project_id, fault_id, limit, before, after }) => ({
			method: 'GET',
			path: `${faultPath(project_id, fault_id)}/comments`,
			query: { limit, before, after },
		}),
		{ log: (_, result) => ({ count: result.data.length }) },
	);

export const commentsGet: HoneybadgerEndpoints['commentsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'comments.get',
			input: Inputs['comments.get'],
			output: Outputs['comments.get'],
		},
		input,
		({ project_id, fault_id, comment_id }) => ({
			method: 'GET',
			path: `${faultPath(project_id, fault_id)}/comments/${segment(comment_id)}`,
		}),
		{
			log: ({ fault_id, comment_id }) => ({
				faultId: fault_id,
				commentId: comment_id,
			}),
		},
	);

export const commentsCreate: HoneybadgerEndpoints['commentsCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'comments.create',
			input: Inputs['comments.create'],
			output: Outputs['comments.create'],
		},
		input,
		({ project_id, fault_id, body }) => ({
			method: 'POST',
			path: `${faultPath(project_id, fault_id)}/comments`,
			body: { body },
			// A comment posted twice appears twice, and @mentions notify again.
			replayable: false,
		}),
		{
			// The comment text is written by the caller and is not logged.
			log: ({ fault_id }) => ({ faultId: fault_id }),
		},
	);

export const commentsUpdate: HoneybadgerEndpoints['commentsUpdate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'comments.update',
			input: Inputs['comments.update'],
			output: Outputs['comments.update'],
		},
		input,
		({ project_id, fault_id, comment_id, body }) => ({
			method: 'PATCH',
			path: `${faultPath(project_id, fault_id)}/comments/${segment(comment_id)}`,
			body: { body },
			// The body replaces the text, so the same request twice leaves the
			// same result.
			replayable: true,
		}),
		{
			log: ({ fault_id, comment_id }) => ({
				faultId: fault_id,
				commentId: comment_id,
			}),
		},
	);

export const commentsDelete: HoneybadgerEndpoints['commentsDelete'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'comments.delete',
			input: Inputs['comments.delete'],
			output: Outputs['comments.delete'],
		},
		input,
		({ project_id, fault_id, comment_id }) => ({
			method: 'DELETE',
			path: `${faultPath(project_id, fault_id)}/comments/${segment(comment_id)}`,
		}),
		{
			shape: (raw, { project_id, fault_id, comment_id }) =>
				confirmDeleted(raw, { project_id, fault_id, comment_id }),
			log: ({ fault_id, comment_id }) => ({
				faultId: fault_id,
				commentId: comment_id,
			}),
		},
	);
