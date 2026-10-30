import { logEventFromContext } from 'corsair/core';
import { makeAuthenticatedGoogleBigqueryRequest } from '../client';
import type { GoogleBigqueryEndpoints } from '../index';
import type { GoogleBigqueryEndpointOutputs } from './types';

export const getTableIamPolicy: GoogleBigqueryEndpoints['iamGetTableIamPolicy'] =
	async (ctx, input) => {
		const { projectId, datasetId, tableId, requestedPolicyVersion } = input;
		const result = await makeAuthenticatedGoogleBigqueryRequest<
			GoogleBigqueryEndpointOutputs['iamGetTableIamPolicy']
		>(
			`/projects/${projectId}/datasets/${datasetId}/tables/${tableId}:getIamPolicy`,
			ctx,
			{
				method: 'POST',
				body: requestedPolicyVersion
					? { options: { requestedPolicyVersion } }
					: {},
			},
		);

		await logEventFromContext(
			ctx,
			'googlebigquery.iam.getTableIamPolicy',
			{ ...input },
			'completed',
		);
		return result;
	};

export const getRoutineIamPolicy: GoogleBigqueryEndpoints['iamGetRoutineIamPolicy'] =
	async (ctx, input) => {
		const { projectId, datasetId, routineId, requestedPolicyVersion } = input;
		const result = await makeAuthenticatedGoogleBigqueryRequest<
			GoogleBigqueryEndpointOutputs['iamGetRoutineIamPolicy']
		>(
			`/projects/${projectId}/datasets/${datasetId}/routines/${routineId}:getIamPolicy`,
			ctx,
			{
				method: 'POST',
				body: requestedPolicyVersion
					? { options: { requestedPolicyVersion } }
					: {},
			},
		);

		await logEventFromContext(
			ctx,
			'googlebigquery.iam.getRoutineIamPolicy',
			{ ...input },
			'completed',
		);
		return result;
	};

export const setRoutineIamPolicy: GoogleBigqueryEndpoints['iamSetRoutineIamPolicy'] =
	async (ctx, input) => {
		const { projectId, datasetId, routineId, policy, updateMask } = input;
		const result = await makeAuthenticatedGoogleBigqueryRequest<
			GoogleBigqueryEndpointOutputs['iamSetRoutineIamPolicy']
		>(
			`/projects/${projectId}/datasets/${datasetId}/routines/${routineId}:setIamPolicy`,
			ctx,
			{ method: 'POST', body: { policy, updateMask } },
		);

		await logEventFromContext(
			ctx,
			'googlebigquery.iam.setRoutineIamPolicy',
			{ ...input },
			'completed',
		);
		return result;
	};

export const testRoutineIamPermissions: GoogleBigqueryEndpoints['iamTestRoutineIamPermissions'] =
	async (ctx, input) => {
		const { projectId, datasetId, routineId, permissions } = input;
		const result = await makeAuthenticatedGoogleBigqueryRequest<
			GoogleBigqueryEndpointOutputs['iamTestRoutineIamPermissions']
		>(
			`/projects/${projectId}/datasets/${datasetId}/routines/${routineId}:testIamPermissions`,
			ctx,
			{ method: 'POST', body: { permissions } },
		);

		await logEventFromContext(
			ctx,
			'googlebigquery.iam.testRoutineIamPermissions',
			{ ...input },
			'completed',
		);
		return result;
	};

export const getConnectionIamPolicy: GoogleBigqueryEndpoints['iamGetConnectionIamPolicy'] =
	async (ctx, input) => {
		const { projectId, location, connectionId, requestedPolicyVersion } = input;
		const result = await makeAuthenticatedGoogleBigqueryRequest<
			GoogleBigqueryEndpointOutputs['iamGetConnectionIamPolicy']
		>(
			`/projects/${projectId}/locations/${location}/connections/${connectionId}:getIamPolicy`,
			ctx,
			{
				method: 'POST',
				host: 'connection',
				body: requestedPolicyVersion
					? { options: { requestedPolicyVersion } }
					: {},
			},
		);

		await logEventFromContext(
			ctx,
			'googlebigquery.iam.getConnectionIamPolicy',
			{ ...input },
			'completed',
		);
		return result;
	};

export const listRowAccessPolicies: GoogleBigqueryEndpoints['iamListRowAccessPolicies'] =
	async (ctx, input) => {
		const { projectId, datasetId, tableId, ...query } = input;
		const result = await makeAuthenticatedGoogleBigqueryRequest<
			GoogleBigqueryEndpointOutputs['iamListRowAccessPolicies']
		>(
			`/projects/${projectId}/datasets/${datasetId}/tables/${tableId}/rowAccessPolicies`,
			ctx,
			{ method: 'GET', query },
		);

		await logEventFromContext(
			ctx,
			'googlebigquery.iam.listRowAccessPolicies',
			{ ...input },
			'completed',
		);
		return result;
	};

export const createLocationsDatapolicies: GoogleBigqueryEndpoints['iamCreateLocationsDatapolicies'] =
	async (ctx, input) => {
		const { projectId, location, ...body } = input;
		const result = await makeAuthenticatedGoogleBigqueryRequest<
			GoogleBigqueryEndpointOutputs['iamCreateLocationsDatapolicies']
		>(`/projects/${projectId}/locations/${location}/dataPolicies`, ctx, {
			method: 'POST',
			host: 'dataPolicy',
			body,
		});

		await logEventFromContext(
			ctx,
			'googlebigquery.iam.createLocationsDatapolicies',
			{ ...input },
			'completed',
		);
		return result;
	};

export const listLocationsDatapolicies: GoogleBigqueryEndpoints['iamListLocationsDatapolicies'] =
	async (ctx, input) => {
		const { projectId, location, ...query } = input;
		const result = await makeAuthenticatedGoogleBigqueryRequest<
			GoogleBigqueryEndpointOutputs['iamListLocationsDatapolicies']
		>(`/projects/${projectId}/locations/${location}/dataPolicies`, ctx, {
			method: 'GET',
			host: 'dataPolicy',
			query,
		});

		await logEventFromContext(
			ctx,
			'googlebigquery.iam.listLocationsDatapolicies',
			{ ...input },
			'completed',
		);
		return result;
	};

export const getServiceAccount: GoogleBigqueryEndpoints['iamGetServiceAccount'] =
	async (ctx, input) => {
		const { projectId } = input;
		const result = await makeAuthenticatedGoogleBigqueryRequest<
			GoogleBigqueryEndpointOutputs['iamGetServiceAccount']
		>(`/projects/${projectId}/serviceAccount`, ctx, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'googlebigquery.iam.getServiceAccount',
			{ ...input },
			'completed',
		);
		return result;
	};
