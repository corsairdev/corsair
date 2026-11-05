import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

export const datasetsAllFeaturesDetailsList: DatarobotEndpoints['datasetsAllFeaturesDetailsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/datasets/{datasetId}/allFeaturesDetails/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['datasetId'],
			[
				'limit',
				'offset',
				'orderBy',
				'includePlot',
				'searchFor',
				'featurelistId',
				'includeDataQuality',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetsAllFeaturesDetailsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.datasets.datasetsAllFeaturesDetailsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

export const datasetsDelete: DatarobotEndpoints['datasetsDelete'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/datasets/{datasetId}/', input);
	const { query, body } = splitDatarobotInput(input, ['datasetId'], []);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'DELETE',
		query: undefined,
	});
	const parsed = DatarobotEndpointOutputSchemas.datasetsDelete.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.datasets.datasetsDelete',
		input ?? {},
		'completed',
	);
	return parsed;
};

export const datasetsFeaturelistsList: DatarobotEndpoints['datasetsFeaturelistsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/datasets/{datasetId}/featurelists/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['datasetId'],
			['limit', 'offset', 'orderBy', 'searchFor'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetsFeaturelistsList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.datasets.datasetsFeaturelistsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

export const datasetsFileList: DatarobotEndpoints['datasetsFileList'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/datasets/{datasetId}/file/', input);
	const { query, body } = splitDatarobotInput(input, ['datasetId'], []);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'GET',
		query: undefined,
	});
	const parsed =
		DatarobotEndpointOutputSchemas.datasetsFileList.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.datasets.datasetsFileList',
		input ?? {},
		'completed',
	);
	return parsed;
};

export const datasetsFromDataSourceCreate: DatarobotEndpoints['datasetsFromDataSourceCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/datasets/fromDataSource/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetsFromDataSourceCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.datasets.datasetsFromDataSourceCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

export const datasetsFromFileCreate: DatarobotEndpoints['datasetsFromFileCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/datasets/fromFile/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetsFromFileCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.datasets.datasetsFromFileCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

export const datasetsFromURLCreate: DatarobotEndpoints['datasetsFromURLCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/datasets/fromURL/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetsFromURLCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.datasets.datasetsFromURLCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

export const datasetsList: DatarobotEndpoints['datasetsList'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/datasets/', input);
	const { query } = splitDatarobotInput(
		input,
		[],
		[
			'category',
			'orderBy',
			'limit',
			'offset',
			'filterFailed',
			'datasetVersionIds',
			'useCaseIds',
			'vectorDatabaseEligibleOnly',
			'vectorDatabaseMetadataEligibleOnly',
			'isDeleted',
		],
	);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'GET',
		query,
	});
	const parsed = DatarobotEndpointOutputSchemas.datasetsList.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.datasets.datasetsList',
		input ?? {},
		'completed',
	);
	return parsed;
};

export const datasetsPatch: DatarobotEndpoints['datasetsPatch'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/datasets/{datasetId}/', input);
	const { query, body } = splitDatarobotInput(input, ['datasetId'], []);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'PATCH',
		query,
		body,
	});
	const parsed = DatarobotEndpointOutputSchemas.datasetsPatch.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.datasets.datasetsPatch',
		input ?? {},
		'completed',
	);
	return parsed;
};

export const datasetsProjectsList: DatarobotEndpoints['datasetsProjectsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/datasets/{datasetId}/projects/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['datasetId'],
			['limit', 'offset'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetsProjectsList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.datasets.datasetsProjectsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

export const datasetsRetrieve: DatarobotEndpoints['datasetsRetrieve'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/datasets/{datasetId}/', input);
	const { query, body } = splitDatarobotInput(input, ['datasetId'], []);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'GET',
		query: undefined,
	});
	const parsed =
		DatarobotEndpointOutputSchemas.datasetsRetrieve.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.datasets.datasetsRetrieve',
		input ?? {},
		'completed',
	);
	return parsed;
};

export const datasetsVersionsDelete: DatarobotEndpoints['datasetsVersionsDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/datasets/{datasetId}/versions/{datasetVersionId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['datasetId', 'datasetVersionId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetsVersionsDelete.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.datasets.datasetsVersionsDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

export const datasetsVersionsFromFileCreate: DatarobotEndpoints['datasetsVersionsFromFileCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/datasets/{datasetId}/versions/fromFile/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['datasetId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetsVersionsFromFileCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.datasets.datasetsVersionsFromFileCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

export const datasetsVersionsFromURLCreate: DatarobotEndpoints['datasetsVersionsFromURLCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/datasets/{datasetId}/versions/fromURL/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['datasetId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetsVersionsFromURLCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.datasets.datasetsVersionsFromURLCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

export const datasetsVersionsList: DatarobotEndpoints['datasetsVersionsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/datasets/{datasetId}/versions/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['datasetId'],
			['category', 'orderBy', 'limit', 'offset', 'filterFailed'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetsVersionsList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.datasets.datasetsVersionsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

export const datasetsVersionsRetrieve: DatarobotEndpoints['datasetsVersionsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/datasets/{datasetId}/versions/{datasetVersionId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['datasetId', 'datasetVersionId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetsVersionsRetrieve.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.datasets.datasetsVersionsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};
