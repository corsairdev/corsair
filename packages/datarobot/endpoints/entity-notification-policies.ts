import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** Create an entity notification policy. */
/** Official: POST /api/v2/entityNotificationPolicies/ (`entityNotificationPolicies_create`) */
export const entityNotificationPoliciesCreate: DatarobotEndpoints['entityNotificationPoliciesCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/entityNotificationPolicies/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.entityNotificationPoliciesCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.entityNotificationPolicies.entityNotificationPoliciesCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete an entity notification policy by relatedentitytype */
/** Official: DELETE /api/v2/entityNotificationPolicies/{relatedEntityType}/{relatedEntityId}/{policyId}/ (`entityNotificationPolicies_delete`) */
export const entityNotificationPoliciesDelete: DatarobotEndpoints['entityNotificationPoliciesDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/entityNotificationPolicies/{relatedEntityType}/{relatedEntityId}/{policyId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['relatedEntityType', 'relatedEntityId', 'policyId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.entityNotificationPoliciesDelete.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.entityNotificationPolicies.entityNotificationPoliciesDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List entity notification policies by relatedentitytype */
/** Official: GET /api/v2/entityNotificationPolicies/{relatedEntityType}/{relatedEntityId}/ (`entityNotificationPolicies_list`) */
export const entityNotificationPoliciesList: DatarobotEndpoints['entityNotificationPoliciesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/entityNotificationPolicies/{relatedEntityType}/{relatedEntityId}/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['relatedEntityType', 'relatedEntityId'],
			[
				'offset',
				'limit',
				'channelId',
				'namePart',
				'eventGroup',
				'channelScope',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.entityNotificationPoliciesList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.entityNotificationPolicies.entityNotificationPoliciesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Update an entity notification policy by relatedentitytype */
/** Official: PUT /api/v2/entityNotificationPolicies/{relatedEntityType}/{relatedEntityId}/{policyId}/ (`entityNotificationPolicies_put`) */
export const entityNotificationPoliciesPut: DatarobotEndpoints['entityNotificationPoliciesPut'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/entityNotificationPolicies/{relatedEntityType}/{relatedEntityId}/{policyId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['relatedEntityType', 'relatedEntityId', 'policyId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PUT',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.entityNotificationPoliciesPut.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.entityNotificationPolicies.entityNotificationPoliciesPut',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve an entity notification policy by relatedentitytype */
/** Official: GET /api/v2/entityNotificationPolicies/{relatedEntityType}/{relatedEntityId}/{policyId}/ (`entityNotificationPolicies_retrieve`) */
export const entityNotificationPoliciesRetrieve: DatarobotEndpoints['entityNotificationPoliciesRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/entityNotificationPolicies/{relatedEntityType}/{relatedEntityId}/{policyId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['relatedEntityType', 'relatedEntityId', 'policyId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.entityNotificationPoliciesRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.entityNotificationPolicies.entityNotificationPoliciesRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};
