import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** Create an entity notification policy template. */
/** Official: POST /api/v2/entityNotificationPolicyTemplates/ (`entityNotificationPolicyTemplates_create`) */
export const entityNotificationPolicyTemplatesCreate: DatarobotEndpoints['entityNotificationPolicyTemplatesCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/entityNotificationPolicyTemplates/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.entityNotificationPolicyTemplatesCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.entityNotificationPolicyTemplates.entityNotificationPolicyTemplatesCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete an entity notification policy template by relatedentitytype */
/** Official: DELETE /api/v2/entityNotificationPolicyTemplates/{relatedEntityType}/{policyId}/ (`entityNotificationPolicyTemplates_delete`) */
export const entityNotificationPolicyTemplatesDelete: DatarobotEndpoints['entityNotificationPolicyTemplatesDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/entityNotificationPolicyTemplates/{relatedEntityType}/{policyId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['relatedEntityType', 'policyId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.entityNotificationPolicyTemplatesDelete.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.entityNotificationPolicyTemplates.entityNotificationPolicyTemplatesDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List entity notification policy templates by relatedentitytype */
/** Official: GET /api/v2/entityNotificationPolicyTemplates/{relatedEntityType}/ (`entityNotificationPolicyTemplates_list`) */
export const entityNotificationPolicyTemplatesList: DatarobotEndpoints['entityNotificationPolicyTemplatesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/entityNotificationPolicyTemplates/{relatedEntityType}/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['relatedEntityType'],
			['offset', 'limit', 'channelId', 'namePart', 'eventGroup'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.entityNotificationPolicyTemplatesList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.entityNotificationPolicyTemplates.entityNotificationPolicyTemplatesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Update an entity notification policy template by relatedentitytype */
/** Official: PUT /api/v2/entityNotificationPolicyTemplates/{relatedEntityType}/{policyId}/ (`entityNotificationPolicyTemplates_put`) */
export const entityNotificationPolicyTemplatesPut: DatarobotEndpoints['entityNotificationPolicyTemplatesPut'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/entityNotificationPolicyTemplates/{relatedEntityType}/{policyId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['relatedEntityType', 'policyId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PUT',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.entityNotificationPolicyTemplatesPut.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.entityNotificationPolicyTemplates.entityNotificationPolicyTemplatesPut',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve list of all policies that are created from this template and are visible by relatedentitytype */
/** Official: GET /api/v2/entityNotificationPolicyTemplates/{relatedEntityType}/{policyId}/relatedPolicies/ (`entityNotificationPolicyTemplatesRelatedPolicies_list`) */
export const entityNotificationPolicyTemplatesRelatedPoliciesList: DatarobotEndpoints['entityNotificationPolicyTemplatesRelatedPoliciesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/entityNotificationPolicyTemplates/{relatedEntityType}/{policyId}/relatedPolicies/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['relatedEntityType', 'policyId'],
			['offset', 'limit'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.entityNotificationPolicyTemplatesRelatedPoliciesList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.entityNotificationPolicyTemplates.entityNotificationPolicyTemplatesRelatedPoliciesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve an entity notification policy template by relatedentitytype */
/** Official: GET /api/v2/entityNotificationPolicyTemplates/{relatedEntityType}/{policyId}/ (`entityNotificationPolicyTemplates_retrieve`) */
export const entityNotificationPolicyTemplatesRetrieve: DatarobotEndpoints['entityNotificationPolicyTemplatesRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/entityNotificationPolicyTemplates/{relatedEntityType}/{policyId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['relatedEntityType', 'policyId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.entityNotificationPolicyTemplatesRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.entityNotificationPolicyTemplates.entityNotificationPolicyTemplatesRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get the registered model access control list by relatedentitytype */
/** Official: GET /api/v2/entityNotificationPolicyTemplates/{relatedEntityType}/{policyId}/sharedRoles/ (`entityNotificationPolicyTemplatesSharedRoles_list`) */
export const entityNotificationPolicyTemplatesSharedRolesList: DatarobotEndpoints['entityNotificationPolicyTemplatesSharedRolesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/entityNotificationPolicyTemplates/{relatedEntityType}/{policyId}/sharedRoles/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['relatedEntityType', 'policyId'],
			['id', 'offset', 'limit', 'name', 'shareRecipientType'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.entityNotificationPolicyTemplatesSharedRolesList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.entityNotificationPolicyTemplates.entityNotificationPolicyTemplatesSharedRolesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Update the registered model controls by relatedentitytype */
/** Official: PATCH /api/v2/entityNotificationPolicyTemplates/{relatedEntityType}/{policyId}/sharedRoles/ (`entityNotificationPolicyTemplatesSharedRoles_patchMany`) */
export const entityNotificationPolicyTemplatesSharedRolesPatchMany: DatarobotEndpoints['entityNotificationPolicyTemplatesSharedRolesPatchMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/entityNotificationPolicyTemplates/{relatedEntityType}/{policyId}/sharedRoles/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['relatedEntityType', 'policyId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.entityNotificationPolicyTemplatesSharedRolesPatchMany.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.entityNotificationPolicyTemplates.entityNotificationPolicyTemplatesSharedRolesPatchMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};
