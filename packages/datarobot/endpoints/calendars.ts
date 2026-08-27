import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** Get a list of users who have access by calendar ID */
/** Official: GET /api/v2/calendars/{calendarId}/accessControl/ (`calendarsAccessControl_list`) */
export const calendarsAccessControlList: DatarobotEndpoints['calendarsAccessControlList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/calendars/{calendarId}/accessControl/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['calendarId'],
			['username', 'userId', 'offset', 'limit'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.calendarsAccessControlList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.calendars.calendarsAccessControlList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Update the access control by calendar ID */
/** Official: PATCH /api/v2/calendars/{calendarId}/accessControl/ (`calendarsAccessControl_patchMany`) */
export const calendarsAccessControlPatchMany: DatarobotEndpoints['calendarsAccessControlPatchMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/calendars/{calendarId}/accessControl/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['calendarId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.calendarsAccessControlPatchMany.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.calendars.calendarsAccessControlPatchMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete a calendar by calendar ID */
/** Official: DELETE /api/v2/calendars/{calendarId}/ (`calendars_delete`) */
export const calendarsDelete: DatarobotEndpoints['calendarsDelete'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/calendars/{calendarId}/', input);
	const { query, body } = splitDatarobotInput(input, ['calendarId'], []);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'DELETE',
		query: undefined,
	});
	const parsed = DatarobotEndpointOutputSchemas.calendarsDelete.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.calendars.calendarsDelete',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** Create a calendar */
/** Official: POST /api/v2/calendars/fileUpload/ (`calendarsFileUpload_create`) */
export const calendarsFileUploadCreate: DatarobotEndpoints['calendarsFileUploadCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/calendars/fileUpload/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.calendarsFileUploadCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.calendars.calendarsFileUploadCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Initialize generation of preloaded calendars. */
/** Official: POST /api/v2/calendars/fromCountryCode/ (`calendarsFromCountryCode_create`) */
export const calendarsFromCountryCodeCreate: DatarobotEndpoints['calendarsFromCountryCodeCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/calendars/fromCountryCode/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.calendarsFromCountryCodeCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.calendars.calendarsFromCountryCodeCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create a calendar from a dataset */
/** Official: POST /api/v2/calendars/fromDataset/ (`calendarsFromDataset_create`) */
export const calendarsFromDatasetCreate: DatarobotEndpoints['calendarsFromDatasetCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/calendars/fromDataset/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.calendarsFromDatasetCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.calendars.calendarsFromDatasetCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List all available calendars */
/** Official: GET /api/v2/calendars/ (`calendars_list`) */
export const calendarsList: DatarobotEndpoints['calendarsList'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/calendars/', input);
	const { query } = splitDatarobotInput(
		input,
		[],
		['projectId', 'offset', 'limit'],
	);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'GET',
		query,
	});
	const parsed = DatarobotEndpointOutputSchemas.calendarsList.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.calendars.calendarsList',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** Update a calendar's name by calendar ID */
/** Official: PATCH /api/v2/calendars/{calendarId}/ (`calendars_patch`) */
export const calendarsPatch: DatarobotEndpoints['calendarsPatch'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/calendars/{calendarId}/', input);
	const { query, body } = splitDatarobotInput(input, ['calendarId'], []);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'PATCH',
		query,
		body,
	});
	const parsed = DatarobotEndpointOutputSchemas.calendarsPatch.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.calendars.calendarsPatch',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** Retrieve information about a calendar by calendar ID */
/** Official: GET /api/v2/calendars/{calendarId}/ (`calendars_retrieve`) */
export const calendarsRetrieve: DatarobotEndpoints['calendarsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/calendars/{calendarId}/', input);
		const { query, body } = splitDatarobotInput(input, ['calendarId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.calendarsRetrieve.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.calendars.calendarsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};
