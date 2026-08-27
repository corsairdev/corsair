import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** Create a new compliance documentation template */
/** Official: POST /api/v2/complianceDocTemplates/ (`complianceDocTemplates_create`) */
export const complianceDocTemplatesCreate: DatarobotEndpoints['complianceDocTemplatesCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/complianceDocTemplates/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.complianceDocTemplatesCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.complianceDocTemplates.complianceDocTemplatesCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve the default documentation template */
/** Official: GET /api/v2/complianceDocTemplates/default/ (`complianceDocTemplatesDefault_list`) */
export const complianceDocTemplatesDefaultList: DatarobotEndpoints['complianceDocTemplatesDefaultList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/complianceDocTemplates/default/',
			input,
		);
		const { query } = splitDatarobotInput(input, [], ['type']);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.complianceDocTemplatesDefaultList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.complianceDocTemplates.complianceDocTemplatesDefaultList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete a compliance documentation template by template ID */
/** Official: DELETE /api/v2/complianceDocTemplates/{templateId}/ (`complianceDocTemplates_delete`) */
export const complianceDocTemplatesDelete: DatarobotEndpoints['complianceDocTemplatesDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/complianceDocTemplates/{templateId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['templateId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.complianceDocTemplatesDelete.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.complianceDocTemplates.complianceDocTemplatesDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List compliance documentation templates */
/** Official: GET /api/v2/complianceDocTemplates/ (`complianceDocTemplates_list`) */
export const complianceDocTemplatesList: DatarobotEndpoints['complianceDocTemplatesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/complianceDocTemplates/', input);
		const { query } = splitDatarobotInput(
			input,
			[],
			['offset', 'limit', 'namePart', 'orderBy', 'labels', 'projectType'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.complianceDocTemplatesList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.complianceDocTemplates.complianceDocTemplatesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Update an existing model compliance documentation template by template ID */
/** Official: PATCH /api/v2/complianceDocTemplates/{templateId}/ (`complianceDocTemplates_patch`) */
export const complianceDocTemplatesPatch: DatarobotEndpoints['complianceDocTemplatesPatch'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/complianceDocTemplates/{templateId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['templateId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.complianceDocTemplatesPatch.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.complianceDocTemplates.complianceDocTemplatesPatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve a documentation template by template ID */
/** Official: GET /api/v2/complianceDocTemplates/{templateId}/ (`complianceDocTemplates_retrieve`) */
export const complianceDocTemplatesRetrieve: DatarobotEndpoints['complianceDocTemplatesRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/complianceDocTemplates/{templateId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['templateId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.complianceDocTemplatesRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.complianceDocTemplates.complianceDocTemplatesRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get the template's access control list by template ID */
/** Official: GET /api/v2/complianceDocTemplates/{templateId}/sharedRoles/ (`complianceDocTemplatesSharedRoles_list`) */
export const complianceDocTemplatesSharedRolesList: DatarobotEndpoints['complianceDocTemplatesSharedRolesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/complianceDocTemplates/{templateId}/sharedRoles/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['templateId'],
			['id', 'offset', 'limit', 'name', 'shareRecipientType'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.complianceDocTemplatesSharedRolesList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.complianceDocTemplates.complianceDocTemplatesSharedRolesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Update the template's access controls by template ID */
/** Official: PATCH /api/v2/complianceDocTemplates/{templateId}/sharedRoles/ (`complianceDocTemplatesSharedRoles_patchMany`) */
export const complianceDocTemplatesSharedRolesPatchMany: DatarobotEndpoints['complianceDocTemplatesSharedRolesPatchMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/complianceDocTemplates/{templateId}/sharedRoles/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['templateId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.complianceDocTemplatesSharedRolesPatchMany.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.complianceDocTemplates.complianceDocTemplatesSharedRolesPatchMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};
