import { logEventFromContext } from 'corsair/core';
import { makeCannyRequest } from '../client';
import type { CannyEndpoints } from '../index';
import type { CannyEndpointOutputs } from './types';

export const list: CannyEndpoints['votesList'] = async (ctx, input) => {
	const response = await makeCannyRequest<CannyEndpointOutputs['votesList']>(
		'votes/list',
		ctx.key,
		{
			method: 'POST',
			body: input ? { ...input } : {},
		},
	);

	if (ctx.db.votes && response.votes) {
		for (const vote of response.votes) {
			try {
				await ctx.db.votes.upsertByEntityId(vote.id, {
					id: vote.id,
					created: new Date(vote.created),
					postID: vote.post?.id,
					voterID: vote.voter?.id,
					boardID: vote.board?.id,
				});
			} catch (error) {
				console.warn('Failed to persist vote to database:', error);
			}
		}
	}

	await logEventFromContext(ctx, 'canny.votes.list', { ...input }, 'completed');
	return response;
};

export const create: CannyEndpoints['votesCreate'] = async (ctx, input) => {
	const response = await makeCannyRequest<CannyEndpointOutputs['votesCreate']>(
		'votes/create',
		ctx.key,
		{
			method: 'POST',
			body: { ...input },
		},
	);

	await logEventFromContext(
		ctx,
		'canny.votes.create',
		{ ...input },
		'completed',
	);
	return response;
};

export const deleteVote: CannyEndpoints['votesDelete'] = async (ctx, input) => {
	const response = await makeCannyRequest<CannyEndpointOutputs['votesDelete']>(
		'votes/delete',
		ctx.key,
		{
			method: 'POST',
			body: {
				postID: input.postID,
				voterID: input.voterID,
			},
		},
	);

	if (ctx.db.votes) {
		try {
			await ctx.db.votes.deleteByEntityId(`${input.postID}_${input.voterID}`);
		} catch (error) {
			console.warn('Failed to delete vote from database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'canny.votes.delete',
		{ ...input },
		'completed',
	);
	return response;
};

export const Votes = {
	list,
	create,
	delete: deleteVote,
};
