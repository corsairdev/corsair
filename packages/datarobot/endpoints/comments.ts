import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** Post a comment */
/** Official: POST /api/v2/comments/ (`comments_create`) */
export const commentsCreate: DatarobotEndpoints['commentsCreate'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/comments/', input);
	const { query, body } = splitDatarobotInput(input, [], []);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'POST',
		query,
		body,
	});
	const parsed = DatarobotEndpointOutputSchemas.commentsCreate.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.comments.commentsCreate',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** Delete a comment by comment ID */
/** Official: DELETE /api/v2/comments/{commentId}/ (`comments_delete`) */
export const commentsDelete: DatarobotEndpoints['commentsDelete'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/comments/{commentId}/', input);
	const { query, body } = splitDatarobotInput(input, ['commentId'], []);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'DELETE',
		query: undefined,
	});
	const parsed = DatarobotEndpointOutputSchemas.commentsDelete.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.comments.commentsDelete',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** List comments by entitytype */
/** Official: GET /api/v2/comments/{entityType}/{entityId}/ (`comments_list`) */
export const commentsList: DatarobotEndpoints['commentsList'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath(
		'/api/v2/comments/{entityType}/{entityId}/',
		input,
	);
	const { query } = splitDatarobotInput(
		input,
		['entityType', 'entityId'],
		['offset', 'limit', 'orderBy'],
	);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'GET',
		query,
	});
	const parsed = DatarobotEndpointOutputSchemas.commentsList.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.comments.commentsList',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** Update a comment by comment ID */
/** Official: PATCH /api/v2/comments/{commentId}/ (`comments_patch`) */
export const commentsPatch: DatarobotEndpoints['commentsPatch'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/comments/{commentId}/', input);
	const { query, body } = splitDatarobotInput(input, ['commentId'], []);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'PATCH',
		query,
		body,
	});
	const parsed = DatarobotEndpointOutputSchemas.commentsPatch.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.comments.commentsPatch',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** Retrieve a comment by comment ID */
/** Official: GET /api/v2/comments/{commentId}/ (`comments_retrieve`) */
export const commentsRetrieve: DatarobotEndpoints['commentsRetrieve'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/comments/{commentId}/', input);
	const { query, body } = splitDatarobotInput(input, ['commentId'], []);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'GET',
		query: undefined,
	});
	const parsed =
		DatarobotEndpointOutputSchemas.commentsRetrieve.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.comments.commentsRetrieve',
		input ?? {},
		'completed',
	);
	return parsed;
};
