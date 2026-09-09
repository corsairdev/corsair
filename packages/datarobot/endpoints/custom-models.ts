import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

export const customModelsCreate: DatarobotEndpoints['customModelsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/customModels/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customModelsCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.customModels.customModelsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

export const customModelsDelete: DatarobotEndpoints['customModelsDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customModels/{customModelId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['customModelId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customModelsDelete.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.customModels.customModelsDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

export const customModelsList: DatarobotEndpoints['customModelsList'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/customModels/', input);
	const { query } = splitDatarobotInput(
		input,
		[],
		[
			'offset',
			'limit',
			'customModelType',
			'targetType',
			'isDeployed',
			'orderBy',
			'searchFor',
			'tagKeys',
			'tagValues',
		],
	);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'GET',
		query,
	});
	const parsed =
		DatarobotEndpointOutputSchemas.customModelsList.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.customModels.customModelsList',
		input ?? {},
		'completed',
	);
	return parsed;
};

export const customModelsRetrieve: DatarobotEndpoints['customModelsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customModels/{customModelId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['customModelId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customModelsRetrieve.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.customModels.customModelsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

export const customModelsVersionsCreate: DatarobotEndpoints['customModelsVersionsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customModels/{customModelId}/versions/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['customModelId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customModelsVersionsCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.customModels.customModelsVersionsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

export const customModelsVersionsList: DatarobotEndpoints['customModelsVersionsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customModels/{customModelId}/versions/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['customModelId'],
			['offset', 'limit', 'mainBranchCommitSha'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customModelsVersionsList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.customModels.customModelsVersionsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};
