import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** Create a new Approval Policy. */
/** Official: POST /api/v2/approvalPolicies/ (`approvalPolicies_create`) */
export const approvalPoliciesCreate: DatarobotEndpoints['approvalPoliciesCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/approvalPolicies/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.approvalPoliciesCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.approvalPolicies.approvalPoliciesCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete an Approval Policy by approval policy ID */
/** Official: DELETE /api/v2/approvalPolicies/{approvalPolicyId}/ (`approvalPolicies_delete`) */
export const approvalPoliciesDelete: DatarobotEndpoints['approvalPoliciesDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/approvalPolicies/{approvalPolicyId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['approvalPolicyId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.approvalPoliciesDelete.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.approvalPolicies.approvalPoliciesDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List Approval Policies. */
/** Official: GET /api/v2/approvalPolicies/ (`approvalPolicies_list`) */
export const approvalPoliciesList: DatarobotEndpoints['approvalPoliciesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/approvalPolicies/', input);
		const { query } = splitDatarobotInput(
			input,
			[],
			['offset', 'limit', 'entityType', 'namePart'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.approvalPoliciesList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.approvalPolicies.approvalPoliciesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Update an Approval Policy by approval policy ID */
/** Official: PUT /api/v2/approvalPolicies/{approvalPolicyId}/ (`approvalPolicies_put`) */
export const approvalPoliciesPut: DatarobotEndpoints['approvalPoliciesPut'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/approvalPolicies/{approvalPolicyId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['approvalPolicyId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PUT',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.approvalPoliciesPut.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.approvalPolicies.approvalPoliciesPut',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve an Approval Policy by approval policy ID */
/** Official: GET /api/v2/approvalPolicies/{approvalPolicyId}/ (`approvalPolicies_retrieve`) */
export const approvalPoliciesRetrieve: DatarobotEndpoints['approvalPoliciesRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/approvalPolicies/{approvalPolicyId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['approvalPolicyId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.approvalPoliciesRetrieve.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.approvalPolicies.approvalPoliciesRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve associated Change Requests Info by approval policy ID */
/** Official: GET /api/v2/approvalPolicies/{approvalPolicyId}/shareableChangeRequests/ (`approvalPoliciesShareableChangeRequests_list`) */
export const approvalPoliciesShareableChangeRequestsList: DatarobotEndpoints['approvalPoliciesShareableChangeRequestsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/approvalPolicies/{approvalPolicyId}/shareableChangeRequests/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['approvalPolicyId'],
			['offset', 'limit', 'orderBy'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.approvalPoliciesShareableChangeRequestsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.approvalPolicies.approvalPoliciesShareableChangeRequestsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};
