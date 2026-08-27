import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** List guard templates. */
/** Official: GET /api/v2/guardTemplates/ (`guardTemplates_list`) */
export const guardTemplatesList: DatarobotEndpoints['guardTemplatesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/guardTemplates/', input);
		const { query } = splitDatarobotInput(
			input,
			[],
			[
				'offset',
				'limit',
				'includeAgentic',
				'isAgentic',
				'forPlayground',
				'forProduction',
				'name',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.guardTemplatesList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.guardTemplates.guardTemplatesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve information about a guard template by template ID */
/** Official: GET /api/v2/guardTemplates/{templateId}/ (`guardTemplates_retrieve`) */
export const guardTemplatesRetrieve: DatarobotEndpoints['guardTemplatesRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/guardTemplates/{templateId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['templateId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.guardTemplatesRetrieve.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.guardTemplates.guardTemplatesRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};
