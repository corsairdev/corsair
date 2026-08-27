import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** Use an endpoint */
/** Official: GET /api/v2/useCasesWithShortenedInfo/ (`useCasesWithShortenedInfo_list`) */
export const useCasesWithShortenedInfoList: DatarobotEndpoints['useCasesWithShortenedInfoList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/useCasesWithShortenedInfo/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			[],
			[
				'offset',
				'limit',
				'search',
				'projectId',
				'applicationId',
				'entityId',
				'entityType',
				'sort',
				'orderBy',
				'usecaseType',
				'riskLevel',
				'stage',
				'createdBy',
				'showOrgUseCases',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.useCasesWithShortenedInfoList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.useCasesWithShortenedInfo.useCasesWithShortenedInfoList',
			input ?? {},
			'completed',
		);
		return parsed;
	};
