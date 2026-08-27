import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** Create a notification channel template. */
/** Official: POST /api/v2/notificationChannelTemplates/ (`notificationChannelTemplates_create`) */
export const notificationChannelTemplatesCreate: DatarobotEndpoints['notificationChannelTemplatesCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/notificationChannelTemplates/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.notificationChannelTemplatesCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.notificationChannelTemplates.notificationChannelTemplatesCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete a notification channel template by channel ID */
/** Official: DELETE /api/v2/notificationChannelTemplates/{channelId}/ (`notificationChannelTemplates_delete`) */
export const notificationChannelTemplatesDelete: DatarobotEndpoints['notificationChannelTemplatesDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/notificationChannelTemplates/{channelId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['channelId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.notificationChannelTemplatesDelete.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.notificationChannelTemplates.notificationChannelTemplatesDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List notification channel templates. */
/** Official: GET /api/v2/notificationChannelTemplates/ (`notificationChannelTemplates_list`) */
export const notificationChannelTemplatesList: DatarobotEndpoints['notificationChannelTemplatesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/notificationChannelTemplates/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			[],
			['offset', 'limit', 'namePart'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.notificationChannelTemplatesList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.notificationChannelTemplates.notificationChannelTemplatesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve list of all policy templates that are using this channel and are visible by channel ID */
/** Official: GET /api/v2/notificationChannelTemplates/{channelId}/policyTemplates/ (`notificationChannelTemplatesPolicyTemplates_list`) */
export const notificationChannelTemplatesPolicyTemplatesList: DatarobotEndpoints['notificationChannelTemplatesPolicyTemplatesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/notificationChannelTemplates/{channelId}/policyTemplates/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['channelId'],
			['offset', 'limit'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.notificationChannelTemplatesPolicyTemplatesList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.notificationChannelTemplates.notificationChannelTemplatesPolicyTemplatesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Update a notification channel template by channel ID */
/** Official: PUT /api/v2/notificationChannelTemplates/{channelId}/ (`notificationChannelTemplates_put`) */
export const notificationChannelTemplatesPut: DatarobotEndpoints['notificationChannelTemplatesPut'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/notificationChannelTemplates/{channelId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['channelId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PUT',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.notificationChannelTemplatesPut.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.notificationChannelTemplates.notificationChannelTemplatesPut',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve list of all policies that are created from this template and are visible by channel ID */
/** Official: GET /api/v2/notificationChannelTemplates/{channelId}/relatedPolicies/ (`notificationChannelTemplatesRelatedPolicies_list`) */
export const notificationChannelTemplatesRelatedPoliciesList: DatarobotEndpoints['notificationChannelTemplatesRelatedPoliciesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/notificationChannelTemplates/{channelId}/relatedPolicies/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['channelId'],
			['offset', 'limit'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.notificationChannelTemplatesRelatedPoliciesList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.notificationChannelTemplates.notificationChannelTemplatesRelatedPoliciesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve a notification channel template by channel ID */
/** Official: GET /api/v2/notificationChannelTemplates/{channelId}/ (`notificationChannelTemplates_retrieve`) */
export const notificationChannelTemplatesRetrieve: DatarobotEndpoints['notificationChannelTemplatesRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/notificationChannelTemplates/{channelId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['channelId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.notificationChannelTemplatesRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.notificationChannelTemplates.notificationChannelTemplatesRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get the channel template access control list by channel ID */
/** Official: GET /api/v2/notificationChannelTemplates/{channelId}/sharedRoles/ (`notificationChannelTemplatesSharedRoles_list`) */
export const notificationChannelTemplatesSharedRolesList: DatarobotEndpoints['notificationChannelTemplatesSharedRolesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/notificationChannelTemplates/{channelId}/sharedRoles/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['channelId'],
			['id', 'offset', 'limit', 'name', 'shareRecipientType'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.notificationChannelTemplatesSharedRolesList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.notificationChannelTemplates.notificationChannelTemplatesSharedRolesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Update the channel template controls by channel ID */
/** Official: PATCH /api/v2/notificationChannelTemplates/{channelId}/sharedRoles/ (`notificationChannelTemplatesSharedRoles_patchMany`) */
export const notificationChannelTemplatesSharedRolesPatchMany: DatarobotEndpoints['notificationChannelTemplatesSharedRolesPatchMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/notificationChannelTemplates/{channelId}/sharedRoles/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['channelId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.notificationChannelTemplatesSharedRolesPatchMany.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.notificationChannelTemplates.notificationChannelTemplatesSharedRolesPatchMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};
