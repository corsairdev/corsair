import { logEventFromContext } from 'corsair/core';
import { makeCannyRequest } from '../client';
import type { CannyEndpoints } from '../index';
import { CannyEndpointInputSchemas, CannyEndpointOutputSchemas } from './types';

export const list: CannyEndpoints['votesList'] = async (ctx, input) => {
	const parsedInput = CannyEndpointInputSchemas.votesList.parse(input);
	const raw = await makeCannyRequest<unknown>('votes/list', ctx.key, {
		method: 'POST',
		body: parsedInput ? { ...parsedInput } : {},
	});
	const response = CannyEndpointOutputSchemas.votesList.parse(raw);

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

	await logEventFromContext(
		ctx,
		'canny.votes.list',
		{ ...parsedInput },
		'completed',
	);
	return response;
};

export const create: CannyEndpoints['votesCreate'] = async (ctx, input) => {
	const parsedInput = CannyEndpointInputSchemas.votesCreate.parse(input);
	const raw = await makeCannyRequest<unknown>('votes/create', ctx.key, {
		method: 'POST',
		body: { ...parsedInput },
	});
	const response = CannyEndpointOutputSchemas.votesCreate.parse(raw);

	await logEventFromContext(
		ctx,
		'canny.votes.create',
		{ ...parsedInput },
		'completed',
	);
	return response;
};

export const deleteVote: CannyEndpoints['votesDelete'] = async (ctx, input) => {
	const parsedInput = CannyEndpointInputSchemas.votesDelete.parse(input);
	const requestBody: Record<string, unknown> = {};
	if (parsedInput.id) requestBody.id = parsedInput.id;
	if (parsedInput.postID) requestBody.postID = parsedInput.postID;
	if (parsedInput.voterID) requestBody.voterID = parsedInput.voterID;

	const raw = await makeCannyRequest<unknown>('votes/delete', ctx.key, {
		method: 'POST',
		body: requestBody,
	});
	const response = CannyEndpointOutputSchemas.votesDelete.parse(raw);

	if (ctx.db.votes) {
		try {
			if (parsedInput.id) {
				await ctx.db.votes.deleteByEntityId(parsedInput.id);
			}
			if (parsedInput.postID && parsedInput.voterID) {
				await ctx.db.votes.deleteByEntityId(
					`${parsedInput.postID}_${parsedInput.voterID}`,
				);
			}
		} catch (error) {
			console.warn('Failed to delete vote from database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'canny.votes.delete',
		{ ...parsedInput },
		'completed',
	);
	return response;
};

export const Votes = {
	list,
	create,
	delete: deleteVote,
};
