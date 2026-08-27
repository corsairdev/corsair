import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** Create a user blueprint. */
/** Official: POST /api/v2/userBlueprints/ (`userBlueprints_create`) */
export const userBlueprintsCreate: DatarobotEndpoints['userBlueprintsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/userBlueprints/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.userBlueprintsCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.userBlueprints.userBlueprintsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete a user blueprint by user blueprint ID */
/** Official: DELETE /api/v2/userBlueprints/{userBlueprintId}/ (`userBlueprints_delete`) */
export const userBlueprintsDelete: DatarobotEndpoints['userBlueprintsDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/userBlueprints/{userBlueprintId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['userBlueprintId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.userBlueprintsDelete.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.userBlueprints.userBlueprintsDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete user blueprints. */
/** Official: DELETE /api/v2/userBlueprints/ (`userBlueprints_deleteMany`) */
export const userBlueprintsDeleteMany: DatarobotEndpoints['userBlueprintsDeleteMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/userBlueprints/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.userBlueprintsDeleteMany.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.userBlueprints.userBlueprintsDeleteMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Clone a blueprint */
/** Official: POST /api/v2/userBlueprints/fromBlueprintId/ (`userBlueprintsFromBlueprintId_create`) */
export const userBlueprintsFromBlueprintIdCreate: DatarobotEndpoints['userBlueprintsFromBlueprintIdCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/userBlueprints/fromBlueprintId/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.userBlueprintsFromBlueprintIdCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.userBlueprints.userBlueprintsFromBlueprintIdCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create a user blueprint */
/** Official: POST /api/v2/userBlueprints/fromCustomTaskVersionId/ (`userBlueprintsFromCustomTaskVersionId_create`) */
export const userBlueprintsFromCustomTaskVersionIdCreate: DatarobotEndpoints['userBlueprintsFromCustomTaskVersionIdCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/userBlueprints/fromCustomTaskVersionId/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.userBlueprintsFromCustomTaskVersionIdCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.userBlueprints.userBlueprintsFromCustomTaskVersionIdCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Clone a user blueprint. */
/** Official: POST /api/v2/userBlueprints/fromUserBlueprintId/ (`userBlueprintsFromUserBlueprintId_create`) */
export const userBlueprintsFromUserBlueprintIdCreate: DatarobotEndpoints['userBlueprintsFromUserBlueprintIdCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/userBlueprints/fromUserBlueprintId/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.userBlueprintsFromUserBlueprintIdCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.userBlueprints.userBlueprintsFromUserBlueprintIdCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List user blueprints. */
/** Official: GET /api/v2/userBlueprints/ (`userBlueprints_list`) */
export const userBlueprintsList: DatarobotEndpoints['userBlueprintsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/userBlueprints/', input);
		const { query } = splitDatarobotInput(
			input,
			[],
			['offset', 'limit', 'projectId'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.userBlueprintsList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.userBlueprints.userBlueprintsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Update a user blueprint by user blueprint ID */
/** Official: PATCH /api/v2/userBlueprints/{userBlueprintId}/ (`userBlueprints_patch`) */
export const userBlueprintsPatch: DatarobotEndpoints['userBlueprintsPatch'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/userBlueprints/{userBlueprintId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['userBlueprintId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.userBlueprintsPatch.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.userBlueprints.userBlueprintsPatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve a user blueprint by user blueprint ID */
/** Official: GET /api/v2/userBlueprints/{userBlueprintId}/ (`userBlueprints_retrieve`) */
export const userBlueprintsRetrieve: DatarobotEndpoints['userBlueprintsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/userBlueprints/{userBlueprintId}/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['userBlueprintId'],
			[
				'editMode',
				'decompressedBlueprint',
				'projectId',
				'isInplaceEditor',
				'getDynamicLabels',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.userBlueprintsRetrieve.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.userBlueprints.userBlueprintsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get the list of users, groups and organizations by user blueprint ID */
/** Official: GET /api/v2/userBlueprints/{userBlueprintId}/sharedRoles/ (`userBlueprintsSharedRoles_list`) */
export const userBlueprintsSharedRolesList: DatarobotEndpoints['userBlueprintsSharedRolesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/userBlueprints/{userBlueprintId}/sharedRoles/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['userBlueprintId'],
			['id', 'offset', 'limit', 'name', 'shareRecipientType'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.userBlueprintsSharedRolesList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.userBlueprints.userBlueprintsSharedRolesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Share a user blueprint by user blueprint ID */
/** Official: PATCH /api/v2/userBlueprints/{userBlueprintId}/sharedRoles/ (`userBlueprintsSharedRoles_patchMany`) */
export const userBlueprintsSharedRolesPatchMany: DatarobotEndpoints['userBlueprintsSharedRolesPatchMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/userBlueprints/{userBlueprintId}/sharedRoles/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['userBlueprintId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.userBlueprintsSharedRolesPatchMany.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.userBlueprints.userBlueprintsSharedRolesPatchMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};
