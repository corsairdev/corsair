import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** Retrieve Quota Templates */
/** Official: GET /api/v2/quotaTemplates/ (`quotaTemplates_list`) */
export const quotaTemplatesList: DatarobotEndpoints['quotaTemplatesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/quotaTemplates/', input);
		const { query } = splitDatarobotInput(input, [], ['offset', 'limit']);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.quotaTemplatesList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.quotaTemplates.quotaTemplatesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve Quota Templates by quota template ID */
/** Official: GET /api/v2/quotaTemplates/{quotaTemplateId}/ (`quotaTemplates_retrieve`) */
export const quotaTemplatesRetrieve: DatarobotEndpoints['quotaTemplatesRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/quotaTemplates/{quotaTemplateId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['quotaTemplateId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.quotaTemplatesRetrieve.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.quotaTemplates.quotaTemplatesRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};
