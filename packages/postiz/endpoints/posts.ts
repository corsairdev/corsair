import type { PostizEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	PostizEndpointInputSchemas as Inputs,
	PostizEndpointOutputSchemas as Outputs,
} from './types';

export const list: PostizEndpoints['postsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'posts.list',
			input: Inputs.postsList,
			output: Outputs.postsList,
		},
		input,
		({ startDate, endDate, customer }) => ({
			method: 'GET',
			path: '/posts',
			query: { startDate, endDate, customer },
		}),
		{ log: (_, result) => ({ count: result.posts.length }) },
	);

export const create: PostizEndpoints['postsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'posts.create',
			input: Inputs.postsCreate,
			output: Outputs.postsCreate,
		},
		input,
		({ type, date, shortLink, tags, posts, inter }) => ({
			method: 'POST',
			path: '/posts',
			body: { type, date, shortLink, tags, posts, inter },
		}),
		{
			log: (parsed, result) => ({
				count: result.posts.length,
				type: parsed.type,
				channels: parsed.posts?.length ?? 0,
			}),
		},
	);

export const remove: PostizEndpoints['postsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'posts.delete',
			input: Inputs.postsDelete,
			output: Outputs.postsDelete,
		},
		input,
		({ id }) => ({ method: 'DELETE', path: `/posts/${segment(id)}` }),
		{ log: ({ id }) => ({ postId: id }) },
	);

export const changeStatus: PostizEndpoints['postsChangeStatus'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'posts.changeStatus',
			input: Inputs.postsChangeStatus,
			output: Outputs.postsChangeStatus,
		},
		input,
		({ id, status }) => ({
			method: 'PUT',
			path: `/posts/${segment(id)}/status`,
			body: { status },
		}),
		{
			log: ({ id }, result) => ({
				postId: id,
				state: result.state ?? undefined,
			}),
		},
	);
