import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** Retrieve the list of soft-deleted projects. */
/** Official: GET /api/v2/deletedProjects/ (`deletedProjects_list`) */
export const deletedProjectsList: DatarobotEndpoints['deletedProjectsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/deletedProjects/', input);
		const { query } = splitDatarobotInput(
			input,
			[],
			[
				'searchFor',
				'creator',
				'organization',
				'deletedBefore',
				'deletedAfter',
				'projectId',
				'limit',
				'offset',
				'orderBy',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deletedProjectsList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.deletedProjects.deletedProjectsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Recover soft-deleted project by project ID */
/** Official: PATCH /api/v2/deletedProjects/{projectId}/ (`deletedProjects_patch`) */
export const deletedProjectsPatch: DatarobotEndpoints['deletedProjectsPatch'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deletedProjects/{projectId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['projectId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deletedProjectsPatch.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.deletedProjects.deletedProjectsPatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};
