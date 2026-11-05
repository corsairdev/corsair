import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

export const modelPackagesFeaturesList: DatarobotEndpoints['modelPackagesFeaturesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/modelPackages/{modelPackageId}/features/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['modelPackageId'],
			[
				'offset',
				'limit',
				'includeNonPredictionFeatures',
				'forSegmentedAnalysis',
				'search',
				'orderBy',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.modelPackagesFeaturesList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.modelPackages.modelPackagesFeaturesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

export const modelPackagesFromLeaderboardCreate: DatarobotEndpoints['modelPackagesFromLeaderboardCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/modelPackages/fromLeaderboard/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.modelPackagesFromLeaderboardCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.modelPackages.modelPackagesFromLeaderboardCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

export const modelPackagesList: DatarobotEndpoints['modelPackagesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/modelPackages/', input);
		const { query } = splitDatarobotInput(
			input,
			[],
			[
				'offset',
				'limit',
				'modelId',
				'similarTo',
				'forChallenger',
				'search',
				'predictionThreshold',
				'imported',
				'predictionEnvironmentId',
				'modelKind',
				'buildStatus',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.modelPackagesList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.modelPackages.modelPackagesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

export const modelPackagesRetrieve: DatarobotEndpoints['modelPackagesRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/modelPackages/{modelPackageId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['modelPackageId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.modelPackagesRetrieve.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.modelPackages.modelPackagesRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};
