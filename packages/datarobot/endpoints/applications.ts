import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** Get application user role by application ID */
/** Official: GET /api/v2/applications/{applicationId}/userRole/ (`applicationUserRole_retrieve`) */
export const applicationUserRoleRetrieve: DatarobotEndpoints['applicationUserRoleRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/applications/{applicationId}/userRole/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['applicationId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.applicationUserRoleRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.applications.applicationUserRoleRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** A list of users with access by application ID */
/** Official: GET /api/v2/applications/{applicationId}/accessControl/ (`applicationsAccessControl_list`) */
export const applicationsAccessControlList: DatarobotEndpoints['applicationsAccessControlList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/applications/{applicationId}/accessControl/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['applicationId'],
			['offset', 'limit', 'username', 'userId'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.applicationsAccessControlList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.applications.applicationsAccessControlList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Update access control by application ID */
/** Official: PATCH /api/v2/applications/{applicationId}/accessControl/ (`applicationsAccessControl_patchMany`) */
export const applicationsAccessControlPatchMany: DatarobotEndpoints['applicationsAccessControlPatchMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/applications/{applicationId}/accessControl/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['applicationId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.applicationsAccessControlPatchMany.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.applications.applicationsAccessControlPatchMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create an application */
/** Official: POST /api/v2/applications/ (`applications_create`) */
export const applicationsCreate: DatarobotEndpoints['applicationsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/applications/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.applicationsCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.applications.applicationsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete an application by application ID */
/** Official: DELETE /api/v2/applications/{applicationId}/ (`applications_delete`) */
export const applicationsDelete: DatarobotEndpoints['applicationsDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/applications/{applicationId}/',
			input,
		);
		const { query } = splitDatarobotInput(input, ['applicationId'], ['hard']);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.applicationsDelete.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.applications.applicationsDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Links a deployment by application ID */
/** Official: POST /api/v2/applications/{applicationId}/deployments/ (`applicationsDeployments_create`) */
export const applicationsDeploymentsCreate: DatarobotEndpoints['applicationsDeploymentsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/applications/{applicationId}/deployments/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['applicationId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.applicationsDeploymentsCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.applications.applicationsDeploymentsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete link between application by application ID */
/** Official: DELETE /api/v2/applications/{applicationId}/deployments/{modelDeploymentId}/ (`applicationsDeployments_delete`) */
export const applicationsDeploymentsDelete: DatarobotEndpoints['applicationsDeploymentsDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/applications/{applicationId}/deployments/{modelDeploymentId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['applicationId', 'modelDeploymentId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.applicationsDeploymentsDelete.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.applications.applicationsDeploymentsDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create a duplicate of the application by application ID */
/** Official: POST /api/v2/applications/{applicationId}/duplicate/ (`applicationsDuplicate_create`) */
export const applicationsDuplicateCreate: DatarobotEndpoints['applicationsDuplicateCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/applications/{applicationId}/duplicate/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['applicationId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.applicationsDuplicateCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.applications.applicationsDuplicateCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Paginated list of applications created by the currently authenticated user. */
/** Official: GET /api/v2/applications/ (`applications_list`) */
export const applicationsList: DatarobotEndpoints['applicationsList'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/applications/', input);
	const { query } = splitDatarobotInput(input, [], ['offset', 'limit', 'lid']);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'GET',
		query,
	});
	const parsed =
		DatarobotEndpointOutputSchemas.applicationsList.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.applications.applicationsList',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** Update an application's name and/ by application ID */
/** Official: PATCH /api/v2/applications/{applicationId}/ (`applications_patch`) */
export const applicationsPatch: DatarobotEndpoints['applicationsPatch'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/applications/{applicationId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['applicationId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.applicationsPatch.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.applications.applicationsPatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve an application by application ID */
/** Official: GET /api/v2/applications/{applicationId}/ (`applications_retrieve`) */
export const applicationsRetrieve: DatarobotEndpoints['applicationsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/applications/{applicationId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['applicationId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.applicationsRetrieve.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.applications.applicationsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get a list of users, groups and organizations that have an access by application ID */
/** Official: GET /api/v2/applications/{applicationId}/sharedRoles/ (`applicationsSharedRoles_list`) */
export const applicationsSharedRolesList: DatarobotEndpoints['applicationsSharedRolesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/applications/{applicationId}/sharedRoles/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['applicationId'],
			['limit', 'offset', 'name', 'id', 'shareRecipientType'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.applicationsSharedRolesList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.applications.applicationsSharedRolesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Share an application by application ID */
/** Official: PATCH /api/v2/applications/{applicationId}/sharedRoles/ (`applicationsSharedRoles_patchMany`) */
export const applicationsSharedRolesPatchMany: DatarobotEndpoints['applicationsSharedRolesPatchMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/applications/{applicationId}/sharedRoles/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['applicationId'],
			['sendNotification', 'note', 'operation', 'roles'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.applicationsSharedRolesPatchMany.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.applications.applicationsSharedRolesPatchMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Verify ability */
/** Official: POST /api/v2/applications/verify/ (`applicationsVerify_create`) */
export const applicationsVerifyCreate: DatarobotEndpoints['applicationsVerifyCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/applications/verify/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.applicationsVerifyCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.applications.applicationsVerifyCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};
