import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

export const credentialsCreate: DatarobotEndpoints['credentialsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/credentials/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.credentialsCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.credentials.credentialsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

export const credentialsDelete: DatarobotEndpoints['credentialsDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/credentials/{credentialId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['credentialId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.credentialsDelete.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.credentials.credentialsDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

export const credentialsList: DatarobotEndpoints['credentialsList'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/credentials/', input);
	const { query } = splitDatarobotInput(
		input,
		[],
		['offset', 'limit', 'types', 'orderBy'],
	);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'GET',
		query,
	});
	const parsed = DatarobotEndpointOutputSchemas.credentialsList.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.credentials.credentialsList',
		input ?? {},
		'completed',
	);
	return parsed;
};

export const credentialsRetrieve: DatarobotEndpoints['credentialsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/credentials/{credentialId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['credentialId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.credentialsRetrieve.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.credentials.credentialsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};
