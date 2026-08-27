import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** Apply entitlement set leases. */
/** Official: POST /api/v2/entitlements/applyEntitlementSets/ (`entitlementsApplyEntitlementSets_create`) */
export const entitlementsApplyEntitlementSetsCreate: DatarobotEndpoints['entitlementsApplyEntitlementSetsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/entitlements/applyEntitlementSets/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.entitlementsApplyEntitlementSetsCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.entitlements.entitlementsApplyEntitlementSetsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve entitlement set leases. */
/** Official: GET /api/v2/entitlements/entitlementSetLeases/ (`entitlementsEntitlementSetLeases_list`) */
export const entitlementsEntitlementSetLeasesList: DatarobotEndpoints['entitlementsEntitlementSetLeasesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/entitlements/entitlementSetLeases/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.entitlementsEntitlementSetLeasesList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.entitlements.entitlementsEntitlementSetLeasesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Evaluate entitlements. */
/** Official: POST /api/v2/entitlements/evaluate/ (`entitlementsEvaluate_create`) */
export const entitlementsEvaluateCreate: DatarobotEndpoints['entitlementsEvaluateCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/entitlements/evaluate/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.entitlementsEvaluateCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.entitlements.entitlementsEvaluateCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};
