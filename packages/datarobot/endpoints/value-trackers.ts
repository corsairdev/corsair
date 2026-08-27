import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** Retrieve the activities of a value tracker by value tracker ID */
/** Official: GET /api/v2/valueTrackers/{valueTrackerId}/activities/ (`valueTrackersActivities_list`) */
export const valueTrackersActivitiesList: DatarobotEndpoints['valueTrackersActivitiesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/valueTrackers/{valueTrackerId}/activities/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['valueTrackerId'],
			['offset', 'limit'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.valueTrackersActivitiesList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.valueTrackers.valueTrackersActivitiesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Attach the list of resources by value tracker ID */
/** Official: POST /api/v2/valueTrackers/{valueTrackerId}/attachments/ (`valueTrackersAttachments_create`) */
export const valueTrackersAttachmentsCreate: DatarobotEndpoints['valueTrackersAttachmentsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/valueTrackers/{valueTrackerId}/attachments/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['valueTrackerId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.valueTrackersAttachmentsCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.valueTrackers.valueTrackersAttachmentsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Removes a resource by value tracker ID */
/** Official: DELETE /api/v2/valueTrackers/{valueTrackerId}/attachments/{attachmentId}/ (`valueTrackersAttachments_delete`) */
export const valueTrackersAttachmentsDelete: DatarobotEndpoints['valueTrackersAttachmentsDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/valueTrackers/{valueTrackerId}/attachments/{attachmentId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['valueTrackerId', 'attachmentId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.valueTrackersAttachmentsDelete.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.valueTrackers.valueTrackersAttachmentsDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get the list of resources attached by value tracker ID */
/** Official: GET /api/v2/valueTrackers/{valueTrackerId}/attachments/ (`valueTrackersAttachments_list`) */
export const valueTrackersAttachmentsList: DatarobotEndpoints['valueTrackersAttachmentsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/valueTrackers/{valueTrackerId}/attachments/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['valueTrackerId'],
			['offset', 'limit', 'type'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.valueTrackersAttachmentsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.valueTrackers.valueTrackersAttachmentsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get a resource that is attached by value tracker ID */
/** Official: GET /api/v2/valueTrackers/{valueTrackerId}/attachments/{attachmentId}/ (`valueTrackersAttachments_retrieve`) */
export const valueTrackersAttachmentsRetrieve: DatarobotEndpoints['valueTrackersAttachmentsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/valueTrackers/{valueTrackerId}/attachments/{attachmentId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['valueTrackerId', 'attachmentId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.valueTrackersAttachmentsRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.valueTrackers.valueTrackersAttachmentsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create a new value tracker. */
/** Official: POST /api/v2/valueTrackers/ (`valueTrackers_create`) */
export const valueTrackersCreate: DatarobotEndpoints['valueTrackersCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/valueTrackers/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.valueTrackersCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.valueTrackers.valueTrackersCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete a value tracker by value tracker ID */
/** Official: DELETE /api/v2/valueTrackers/{valueTrackerId}/ (`valueTrackers_delete`) */
export const valueTrackersDelete: DatarobotEndpoints['valueTrackersDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/valueTrackers/{valueTrackerId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['valueTrackerId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.valueTrackersDelete.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.valueTrackers.valueTrackersDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List value trackers the requesting user has access to. */
/** Official: GET /api/v2/valueTrackers/ (`valueTrackers_list`) */
export const valueTrackersList: DatarobotEndpoints['valueTrackersList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/valueTrackers/', input);
		const { query } = splitDatarobotInput(
			input,
			[],
			['offset', 'limit', 'orderBy', 'namePart', 'stage'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.valueTrackersList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.valueTrackers.valueTrackersList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Update a value tracker by value tracker ID */
/** Official: PATCH /api/v2/valueTrackers/{valueTrackerId}/ (`valueTrackers_patch`) */
export const valueTrackersPatch: DatarobotEndpoints['valueTrackersPatch'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/valueTrackers/{valueTrackerId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['valueTrackerId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.valueTrackersPatch.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.valueTrackers.valueTrackersPatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve realized value information by value tracker ID */
/** Official: GET /api/v2/valueTrackers/{valueTrackerId}/realizedValueOverTime/ (`valueTrackersRealizedValueOverTime_list`) */
export const valueTrackersRealizedValueOverTimeList: DatarobotEndpoints['valueTrackersRealizedValueOverTimeList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/valueTrackers/{valueTrackerId}/realizedValueOverTime/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['valueTrackerId'],
			['start', 'end', 'bucketSize'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.valueTrackersRealizedValueOverTimeList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.valueTrackers.valueTrackersRealizedValueOverTimeList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve a value tracker by value tracker ID */
/** Official: GET /api/v2/valueTrackers/{valueTrackerId}/ (`valueTrackers_retrieve`) */
export const valueTrackersRetrieve: DatarobotEndpoints['valueTrackersRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/valueTrackers/{valueTrackerId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['valueTrackerId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.valueTrackersRetrieve.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.valueTrackers.valueTrackersRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get the list of users, groups and organizations that have access by value tracker ID */
/** Official: GET /api/v2/valueTrackers/{valueTrackerId}/sharedRoles/ (`valueTrackersSharedRoles_list`) */
export const valueTrackersSharedRolesList: DatarobotEndpoints['valueTrackersSharedRolesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/valueTrackers/{valueTrackerId}/sharedRoles/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['valueTrackerId'],
			['id', 'offset', 'limit', 'name', 'shareRecipientType'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.valueTrackersSharedRolesList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.valueTrackers.valueTrackersSharedRolesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Share a value tracker by value tracker ID */
/** Official: PATCH /api/v2/valueTrackers/{valueTrackerId}/sharedRoles/ (`valueTrackersSharedRoles_patchMany`) */
export const valueTrackersSharedRolesPatchMany: DatarobotEndpoints['valueTrackersSharedRolesPatchMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/valueTrackers/{valueTrackerId}/sharedRoles/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['valueTrackerId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.valueTrackersSharedRolesPatchMany.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.valueTrackers.valueTrackersSharedRolesPatchMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};
