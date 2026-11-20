import type { StormboardEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	StormboardEndpointInputSchemas as Inputs,
	StormboardEndpointOutputSchemas as Outputs,
} from './types';

export const create: StormboardEndpoints['ideasCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'ideas.create',
			input: Inputs.ideasCreate,
			output: Outputs.ideasCreate,
		},
		input,
		(body) => ({
			method: 'POST',
			path: '/ideas',
			body,
		}),
		{
			log: (_, result) => ({ ideaId: result.id ?? undefined }),
		},
	);

export const update: StormboardEndpoints['ideasUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'ideas.update',
			input: Inputs.ideasUpdate,
			output: Outputs.ideasUpdate,
		},
		input,
		({ ideaId, ...body }) => ({
			method: 'PUT',
			path: `/ideas/${segment(ideaId)}`,
			body,
		}),
	);

export const get: StormboardEndpoints['ideasGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'ideas.get',
			input: Inputs.ideasGet,
			output: Outputs.ideasGet,
		},
		input,
		({ ideaId }) => ({
			method: 'GET',
			path: `/ideas/${segment(ideaId)}`,
		}),
		{
			log: (_, result) => ({ ideaId: result.idea.id ?? undefined }),
		},
	);

export const remove: StormboardEndpoints['ideasDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'ideas.delete',
			input: Inputs.ideasDelete,
			output: Outputs.ideasDelete,
		},
		input,
		({ ideaId }) => ({
			method: 'DELETE',
			path: `/ideas/${segment(ideaId)}`,
		}),
		{
			log: () => ({ deleted: true }),
		},
	);

export const addVote: StormboardEndpoints['ideasAddVote'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'ideas.addVote',
			input: Inputs.ideasAddVote,
			output: Outputs.ideasAddVote,
		},
		input,
		({ ideaId }) => ({
			method: 'POST',
			path: `/ideas/${segment(ideaId)}/vote`,
			body: {},
		}),
		{
			log: (_, result) => ({
				totalVotes: result.idea?.totalvotes ?? undefined,
			}),
		},
	);

export const removeVote: StormboardEndpoints['ideasRemoveVote'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'ideas.removeVote',
			input: Inputs.ideasRemoveVote,
			output: Outputs.ideasRemoveVote,
		},
		input,
		({ ideaId }) => ({
			method: 'DELETE',
			path: `/ideas/${segment(ideaId)}/vote`,
		}),
		{
			log: (_, result) => ({
				totalVotes: result.idea?.totalvotes ?? undefined,
			}),
		},
	);

export const createComment: StormboardEndpoints['ideasCreateComment'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'ideas.createComment',
			input: Inputs.ideasCreateComment,
			output: Outputs.ideasCreateComment,
		},
		input,
		({ ideaId, comment }) => ({
			method: 'POST',
			path: `/ideas/${segment(ideaId)}/comments`,
			body: { comment },
		}),
		{
			log: (_, result) => ({ commentId: result.comment?.id ?? undefined }),
		},
	);

export const updateComment: StormboardEndpoints['ideasUpdateComment'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'ideas.updateComment',
			input: Inputs.ideasUpdateComment,
			output: Outputs.ideasUpdateComment,
		},
		input,
		({ ideaId, commentId, comment }) => ({
			method: 'PUT',
			path: `/ideas/${segment(ideaId)}/comments/${segment(commentId)}`,
			body: { comment },
		}),
	);

export const deleteComment: StormboardEndpoints['ideasDeleteComment'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'ideas.deleteComment',
			input: Inputs.ideasDeleteComment,
			output: Outputs.ideasDeleteComment,
		},
		input,
		({ ideaId, commentId }) => ({
			method: 'DELETE',
			path: `/ideas/${segment(ideaId)}/comments/${segment(commentId)}`,
		}),
		{
			log: () => ({ deleted: true }),
		},
	);

export const listComments: StormboardEndpoints['ideasListComments'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'ideas.listComments',
			input: Inputs.ideasListComments,
			output: Outputs.ideasListComments,
		},
		input,
		({ ideaId, order, avatars }) => ({
			method: 'GET',
			path: `/ideas/${segment(ideaId)}/comments`,
			query: { order, avatars },
		}),
		{
			log: (_, result) => ({ count: result.comments.length }),
		},
	);

export const createConnector: StormboardEndpoints['ideasCreateConnector'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'ideas.createConnector',
			input: Inputs.ideasCreateConnector,
			output: Outputs.ideasCreateConnector,
		},
		input,
		(body) => ({
			method: 'POST',
			path: '/ideas/connector',
			body,
		}),
		{
			log: (_, result) => ({
				connectorId: result.connector?.id ?? undefined,
			}),
		},
	);

export const updateConnector: StormboardEndpoints['ideasUpdateConnector'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'ideas.updateConnector',
			input: Inputs.ideasUpdateConnector,
			output: Outputs.ideasUpdateConnector,
		},
		input,
		({ connectorId, ...body }) => ({
			method: 'PUT',
			path: `/ideas/connector/${segment(connectorId)}`,
			body,
		}),
	);

export const deleteConnector: StormboardEndpoints['ideasDeleteConnector'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'ideas.deleteConnector',
			input: Inputs.ideasDeleteConnector,
			output: Outputs.ideasDeleteConnector,
		},
		input,
		({ connectorId }) => ({
			method: 'DELETE',
			path: `/ideas/connector/${segment(connectorId)}`,
		}),
		{
			log: () => ({ deleted: true }),
		},
	);

export const deleteConnectorBetween: StormboardEndpoints['ideasDeleteConnectorBetween'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'ideas.deleteConnectorBetween',
				input: Inputs.ideasDeleteConnectorBetween,
				output: Outputs.ideasDeleteConnectorBetween,
			},
			input,
			({ from_idea_id, to_idea_id }) => ({
				method: 'DELETE',
				path: '/ideas/connector',
				// The API reads the two idea ids from a JSON body; as query
				// parameters it answers 400 "from_idea_id and to_idea_id are
				// both required" (checked live 11-20).
				body: { from_idea_id, to_idea_id },
			}),
			{
				log: () => ({ deleted: true }),
			},
		);

export const updateTask: StormboardEndpoints['ideasUpdateTask'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'ideas.updateTask',
			input: Inputs.ideasUpdateTask,
			output: Outputs.ideasUpdateTask,
		},
		input,
		({ ideaId, ...body }) => ({
			method: 'PUT',
			path: `/ideas/${segment(ideaId)}/task`,
			body,
		}),
		{
			log: (_, result) => ({ status: result.task.status ?? undefined }),
		},
	);
