import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** Create a data stage */
/** Official: POST /api/v2/dataStages/ (`dataStages_create`) */
export const dataStagesCreate: DatarobotEndpoints['dataStagesCreate'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/dataStages/', input);
	const { query, body } = splitDatarobotInput(input, [], []);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'POST',
		query,
		body,
	});
	const parsed =
		DatarobotEndpointOutputSchemas.dataStagesCreate.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.dataStages.dataStagesCreate',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** Finalize a data stage by data stage ID */
/** Official: POST /api/v2/dataStages/{dataStageId}/finalize/ (`dataStagesFinalize_create`) */
export const dataStagesFinalizeCreate: DatarobotEndpoints['dataStagesFinalizeCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/dataStages/{dataStageId}/finalize/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['dataStageId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.dataStagesFinalizeCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.dataStages.dataStagesFinalizeCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Upload a part by data stage ID */
/** Official: PUT /api/v2/dataStages/{dataStageId}/parts/{partNumber}/ (`dataStagesParts_put`) */
export const dataStagesPartsPut: DatarobotEndpoints['dataStagesPartsPut'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/dataStages/{dataStageId}/parts/{partNumber}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['dataStageId', 'partNumber'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PUT',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.dataStagesPartsPut.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.dataStages.dataStagesPartsPut',
			input ?? {},
			'completed',
		);
		return parsed;
	};
