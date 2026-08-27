import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** Clone an application template into a codespace by application template ID */
/** Official: POST /api/v2/applicationTemplates/{applicationTemplateId}/clone/ (`applicationTemplatesClone_create`) */
export const applicationTemplatesCloneCreate: DatarobotEndpoints['applicationTemplatesCloneCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/applicationTemplates/{applicationTemplateId}/clone/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['applicationTemplateId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.applicationTemplatesCloneCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.applicationTemplates.applicationTemplatesCloneCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create an application template. */
/** Official: POST /api/v2/applicationTemplates/ (`applicationTemplates_create`) */
export const applicationTemplatesCreate: DatarobotEndpoints['applicationTemplatesCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/applicationTemplates/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.applicationTemplatesCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.applicationTemplates.applicationTemplatesCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete an application template by application template ID */
/** Official: DELETE /api/v2/applicationTemplates/{applicationTemplateId}/ (`applicationTemplates_delete`) */
export const applicationTemplatesDelete: DatarobotEndpoints['applicationTemplatesDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/applicationTemplates/{applicationTemplateId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['applicationTemplateId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.applicationTemplatesDelete.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.applicationTemplates.applicationTemplatesDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List the application templates the user has access to. */
/** Official: GET /api/v2/applicationTemplates/ (`applicationTemplates_list`) */
export const applicationTemplatesList: DatarobotEndpoints['applicationTemplatesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/applicationTemplates/', input);
		const { query } = splitDatarobotInput(input, [], ['offset', 'limit']);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.applicationTemplatesList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.applicationTemplates.applicationTemplatesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Upload an application template image/gif.  by application template ID */
/** Official: POST /api/v2/applicationTemplates/{applicationTemplateId}/media/ (`applicationTemplatesMedia_create`) */
export const applicationTemplatesMediaCreate: DatarobotEndpoints['applicationTemplatesMediaCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/applicationTemplates/{applicationTemplateId}/media/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['applicationTemplateId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.applicationTemplatesMediaCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.applicationTemplates.applicationTemplatesMediaCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete an application template image/gif.  by application template ID */
/** Official: DELETE /api/v2/applicationTemplates/{applicationTemplateId}/media/ (`applicationTemplatesMedia_deleteMany`) */
export const applicationTemplatesMediaDeleteMany: DatarobotEndpoints['applicationTemplatesMediaDeleteMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/applicationTemplates/{applicationTemplateId}/media/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['applicationTemplateId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.applicationTemplatesMediaDeleteMany.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.applicationTemplates.applicationTemplatesMediaDeleteMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve an application template image by application template ID */
/** Official: GET /api/v2/applicationTemplates/{applicationTemplateId}/media/ (`applicationTemplatesMedia_list`) */
export const applicationTemplatesMediaList: DatarobotEndpoints['applicationTemplatesMediaList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/applicationTemplates/{applicationTemplateId}/media/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['applicationTemplateId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.applicationTemplatesMediaList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.applicationTemplates.applicationTemplatesMediaList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Update an application template by application template ID */
/** Official: PATCH /api/v2/applicationTemplates/{applicationTemplateId}/ (`applicationTemplates_patch`) */
export const applicationTemplatesPatch: DatarobotEndpoints['applicationTemplatesPatch'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/applicationTemplates/{applicationTemplateId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['applicationTemplateId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.applicationTemplatesPatch.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.applicationTemplates.applicationTemplatesPatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get the resolved clone URL by application template ID */
/** Official: GET /api/v2/applicationTemplates/{applicationTemplateId}/repositoryUrls/ (`applicationTemplatesRepositoryUrls_list`) */
export const applicationTemplatesRepositoryUrlsList: DatarobotEndpoints['applicationTemplatesRepositoryUrlsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/applicationTemplates/{applicationTemplateId}/repositoryUrls/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['applicationTemplateId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.applicationTemplatesRepositoryUrlsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.applicationTemplates.applicationTemplatesRepositoryUrlsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};
