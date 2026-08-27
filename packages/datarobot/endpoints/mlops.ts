import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** List resource bundles. */
/** Official: GET /api/v2/mlops/compute/bundles/ (`mlopsComputeBundles_list`) */
export const mlopsComputeBundlesList: DatarobotEndpoints['mlopsComputeBundlesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/mlops/compute/bundles/', input);
		const { query } = splitDatarobotInput(
			input,
			[],
			['entityId', 'entityType', 'useCases', 'offset', 'limit'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.mlopsComputeBundlesList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.mlops.mlopsComputeBundlesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve resource bundle by resource request bundle ID */
/** Official: GET /api/v2/mlops/compute/bundles/{resourceRequestBundleId}/ (`mlopsComputeBundles_retrieve`) */
export const mlopsComputeBundlesRetrieve: DatarobotEndpoints['mlopsComputeBundlesRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/mlops/compute/bundles/{resourceRequestBundleId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['resourceRequestBundleId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.mlopsComputeBundlesRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.mlops.mlopsComputeBundlesRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Downloads the latest Portable Prediction Server (PPS) Docker image */
/** Official: GET /api/v2/mlops/portablePredictionServerImage/ (`mlopsPortablePredictionServerImage_list`) */
export const mlopsPortablePredictionServerImageList: DatarobotEndpoints['mlopsPortablePredictionServerImageList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/mlops/portablePredictionServerImage/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.mlopsPortablePredictionServerImageList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.mlops.mlopsPortablePredictionServerImageList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Fetches currently active PPS Docker image metadata */
/** Official: GET /api/v2/mlops/portablePredictionServerImage/metadata/ (`mlopsPortablePredictionServerImageMetadata_list`) */
export const mlopsPortablePredictionServerImageMetadataList: DatarobotEndpoints['mlopsPortablePredictionServerImageMetadataList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/mlops/portablePredictionServerImage/metadata/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.mlopsPortablePredictionServerImageMetadataList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.mlops.mlopsPortablePredictionServerImageMetadataList',
			input ?? {},
			'completed',
		);
		return parsed;
	};
