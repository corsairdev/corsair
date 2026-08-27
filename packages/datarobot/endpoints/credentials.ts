import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** List all objects associated by credential ID */
/** Official: GET /api/v2/credentials/{credentialId}/associations/ (`credentialsAssociations_listForCredential`) */
export const credentialsAssociationsListForCredential: DatarobotEndpoints['credentialsAssociationsListForCredential'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/credentials/{credentialId}/associations/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['credentialId'],
			['offset', 'limit', 'types', 'orderBy'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.credentialsAssociationsListForCredential.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.credentials.credentialsAssociationsListForCredential',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List credentials associated by association ID */
/** Official: GET /api/v2/credentials/associations/{associationId}/ (`credentialsAssociations_listForObject`) */
export const credentialsAssociationsListForObject: DatarobotEndpoints['credentialsAssociationsListForObject'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/credentials/associations/{associationId}/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['associationId'],
			['offset', 'limit', 'orderBy'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.credentialsAssociationsListForObject.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.credentials.credentialsAssociationsListForObject',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Add objects associated by credential ID */
/** Official: PATCH /api/v2/credentials/{credentialId}/associations/ (`credentialsAssociations_patchMany`) */
export const credentialsAssociationsPatchMany: DatarobotEndpoints['credentialsAssociationsPatchMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/credentials/{credentialId}/associations/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['credentialId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.credentialsAssociationsPatchMany.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.credentials.credentialsAssociationsPatchMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Set default credentials by credential ID */
/** Official: PUT /api/v2/credentials/{credentialId}/associations/{associationId}/ (`credentialsAssociations_put`) */
export const credentialsAssociationsPut: DatarobotEndpoints['credentialsAssociationsPut'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/credentials/{credentialId}/associations/{associationId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['credentialId', 'associationId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PUT',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.credentialsAssociationsPut.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.credentials.credentialsAssociationsPut',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Store a new set of credentials which can be used */
/** Official: POST /api/v2/credentials/ (`credentials_create`) */
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

/** Delete the credentials set by credential ID */
/** Official: DELETE /api/v2/credentials/{credentialId}/ (`credentials_delete`) */
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

/** List credentials. */
/** Official: GET /api/v2/credentials/ (`credentials_list`) */
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

/** Update specified credentials by credential ID */
/** Official: PATCH /api/v2/credentials/{credentialId}/ (`credentials_patch`) */
export const credentialsPatch: DatarobotEndpoints['credentialsPatch'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/credentials/{credentialId}/', input);
	const { query, body } = splitDatarobotInput(input, ['credentialId'], []);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'PATCH',
		query,
		body,
	});
	const parsed =
		DatarobotEndpointOutputSchemas.credentialsPatch.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.credentials.credentialsPatch',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** Retrieve the credentials set by credential ID */
/** Official: GET /api/v2/credentials/{credentialId}/ (`credentials_retrieve`) */
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
