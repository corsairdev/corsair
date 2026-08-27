import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** Get entity tag. */
/** Official: POST /api/v2/entityTags/ (`entityTags_create`) */
export const entityTagsCreate: DatarobotEndpoints['entityTagsCreate'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/entityTags/', input);
	const { query, body } = splitDatarobotInput(input, [], []);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'POST',
		query,
		body,
	});
	const parsed =
		DatarobotEndpointOutputSchemas.entityTagsCreate.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.entityTags.entityTagsCreate',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** Delete an entity tag by entity tag ID */
/** Official: DELETE /api/v2/entityTags/{entityTagId}/ (`entityTags_delete`) */
export const entityTagsDelete: DatarobotEndpoints['entityTagsDelete'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/entityTags/{entityTagId}/', input);
	const { query, body } = splitDatarobotInput(input, ['entityTagId'], []);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'DELETE',
		query: undefined,
	});
	const parsed =
		DatarobotEndpointOutputSchemas.entityTagsDelete.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.entityTags.entityTagsDelete',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** Retrieve the list of entity tags. */
/** Official: GET /api/v2/entityTags/ (`entityTags_list`) */
export const entityTagsList: DatarobotEndpoints['entityTagsList'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/entityTags/', input);
	const { query } = splitDatarobotInput(
		input,
		[],
		['offset', 'limit', 'search', 'entityType', 'orderBy'],
	);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'GET',
		query,
	});
	const parsed = DatarobotEndpointOutputSchemas.entityTagsList.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.entityTags.entityTagsList',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** Update entity tag by entity tag ID */
/** Official: PATCH /api/v2/entityTags/{entityTagId}/ (`entityTags_patch`) */
export const entityTagsPatch: DatarobotEndpoints['entityTagsPatch'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/entityTags/{entityTagId}/', input);
	const { query, body } = splitDatarobotInput(input, ['entityTagId'], []);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'PATCH',
		query,
		body,
	});
	const parsed = DatarobotEndpointOutputSchemas.entityTagsPatch.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.entityTags.entityTagsPatch',
		input ?? {},
		'completed',
	);
	return parsed;
};
