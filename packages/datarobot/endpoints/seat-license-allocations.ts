import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** Allocate seat licenses. */
/** Official: POST /api/v2/seatLicenseAllocations/ (`seatLicenseAllocations_create`) */
export const seatLicenseAllocationsCreate: DatarobotEndpoints['seatLicenseAllocationsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/seatLicenseAllocations/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.seatLicenseAllocationsCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.seatLicenseAllocations.seatLicenseAllocationsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete a seat license allocation by allocation ID */
/** Official: DELETE /api/v2/seatLicenseAllocations/{allocationId}/ (`seatLicenseAllocations_delete`) */
export const seatLicenseAllocationsDelete: DatarobotEndpoints['seatLicenseAllocationsDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/seatLicenseAllocations/{allocationId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['allocationId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.seatLicenseAllocationsDelete.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.seatLicenseAllocations.seatLicenseAllocationsDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Evaluate the seat license */
/** Official: POST /api/v2/seatLicenseAllocations/evaluate/ (`seatLicenseAllocationsEvaluate_create`) */
export const seatLicenseAllocationsEvaluateCreate: DatarobotEndpoints['seatLicenseAllocationsEvaluateCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/seatLicenseAllocations/evaluate/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.seatLicenseAllocationsEvaluateCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.seatLicenseAllocations.seatLicenseAllocationsEvaluateCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List seat license allocations. */
/** Official: GET /api/v2/seatLicenseAllocations/ (`seatLicenseAllocations_list`) */
export const seatLicenseAllocationsList: DatarobotEndpoints['seatLicenseAllocationsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/seatLicenseAllocations/', input);
		const { query } = splitDatarobotInput(
			input,
			[],
			['offset', 'limit', 'ids', 'orgId', 'seatLicenseIds', 'subjectIds'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.seatLicenseAllocationsList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.seatLicenseAllocations.seatLicenseAllocationsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Update a seat license allocation by allocation ID */
/** Official: PATCH /api/v2/seatLicenseAllocations/{allocationId}/ (`seatLicenseAllocations_patch`) */
export const seatLicenseAllocationsPatch: DatarobotEndpoints['seatLicenseAllocationsPatch'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/seatLicenseAllocations/{allocationId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['allocationId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.seatLicenseAllocationsPatch.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.seatLicenseAllocations.seatLicenseAllocationsPatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve a seat license allocation by allocation ID */
/** Official: GET /api/v2/seatLicenseAllocations/{allocationId}/ (`seatLicenseAllocations_retrieve`) */
export const seatLicenseAllocationsRetrieve: DatarobotEndpoints['seatLicenseAllocationsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/seatLicenseAllocations/{allocationId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['allocationId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.seatLicenseAllocationsRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.seatLicenseAllocations.seatLicenseAllocationsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};
