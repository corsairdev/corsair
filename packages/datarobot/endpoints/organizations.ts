import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** List organization jobs by organization ID */
/** Official: GET /api/v2/organizations/{organizationId}/jobs/ (`organizationsJobs_list`) */
export const organizationsJobsList: DatarobotEndpoints['organizationsJobsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/organizations/{organizationId}/jobs/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['organizationId'],
			['offset', 'limit'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.organizationsJobsList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.organizations.organizationsJobsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List organizations. */
/** Official: GET /api/v2/organizations/ (`organizations_list`) */
export const organizationsList: DatarobotEndpoints['organizationsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/organizations/', input);
		const { query } = splitDatarobotInput(
			input,
			[],
			[
				'offset',
				'limit',
				'id',
				'namePart',
				'includeDeleted',
				'includePermadeleted',
				'deletedOnly',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.organizationsList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.organizations.organizationsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve an organization by organization ID */
/** Official: GET /api/v2/organizations/{organizationId}/ (`organizations_retrieve`) */
export const organizationsRetrieve: DatarobotEndpoints['organizationsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/organizations/{organizationId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['organizationId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.organizationsRetrieve.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.organizations.organizationsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Add user by organization ID */
/** Official: POST /api/v2/organizations/{organizationId}/users/ (`organizationsUsers_create`) */
export const organizationsUsersCreate: DatarobotEndpoints['organizationsUsersCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/organizations/{organizationId}/users/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['organizationId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.organizationsUsersCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.organizations.organizationsUsersCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List organization users by organization ID */
/** Official: GET /api/v2/organizations/{organizationId}/users/ (`organizationsUsers_list`) */
export const organizationsUsersList: DatarobotEndpoints['organizationsUsersList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/organizations/{organizationId}/users/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['organizationId'],
			['offset', 'limit', 'ids'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.organizationsUsersList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.organizations.organizationsUsersList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Patch an organization user by organization ID */
/** Official: PATCH /api/v2/organizations/{organizationId}/users/{userId}/ (`organizationsUsers_patch`) */
export const organizationsUsersPatch: DatarobotEndpoints['organizationsUsersPatch'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/organizations/{organizationId}/users/{userId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['organizationId', 'userId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.organizationsUsersPatch.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.organizations.organizationsUsersPatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve a user by organization ID */
/** Official: GET /api/v2/organizations/{organizationId}/users/{userId}/ (`organizationsUsers_retrieve`) */
export const organizationsUsersRetrieve: DatarobotEndpoints['organizationsUsersRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/organizations/{organizationId}/users/{userId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['organizationId', 'userId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.organizationsUsersRetrieve.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.organizations.organizationsUsersRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};
