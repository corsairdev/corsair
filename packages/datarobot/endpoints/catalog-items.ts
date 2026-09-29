import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

export const catalogItemsList: DatarobotEndpoints['catalogItemsList'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/catalogItems/', input);
	const { query } = splitDatarobotInput(
		input,
		[],
		[
			'offset',
			'limit',
			'initialCacheSize',
			'useCache',
			'orderBy',
			'searchFor',
			'tag',
			'accessType',
			'datasourceType',
			'category',
			'filterFailed',
			'ownerUserId',
			'ownerUsername',
			'type',
			'isUxrPreviewable',
		],
	);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'GET',
		query,
	});
	const parsed =
		DatarobotEndpointOutputSchemas.catalogItemsList.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.catalogItems.catalogItemsList',
		input ?? {},
		'completed',
	);
	return parsed;
};

export const catalogItemsRetrieve: DatarobotEndpoints['catalogItemsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/catalogItems/{catalogId}/', input);
		const { query, body } = splitDatarobotInput(input, ['catalogId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.catalogItemsRetrieve.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.catalogItems.catalogItemsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};
