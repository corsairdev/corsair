import { logEventFromContext } from 'corsair/core';
import { makeAuthenticatedGoogleBigqueryRequest } from '../client';
import type { GoogleBigqueryEndpoints } from '../index';
import type { GoogleBigqueryEndpointOutputs } from './types';

export const listBigQueryConnections: GoogleBigqueryEndpoints['connectionsListBigQueryConnections'] =
	async (ctx, input) => {
		const { projectId, location = '-', ...query } = input;
		const result = await makeAuthenticatedGoogleBigqueryRequest<
			GoogleBigqueryEndpointOutputs['connectionsListBigQueryConnections']
		>(`/projects/${projectId}/locations/${location}/connections`, ctx, {
			method: 'GET',
			host: 'connection',
			query,
		});

		await logEventFromContext(
			ctx,
			'googlebigquery.connections.listBigQueryConnections',
			{ ...input },
			'completed',
		);
		return result;
	};

export const listLocationsConnections: GoogleBigqueryEndpoints['connectionsListLocationsConnections'] =
	async (ctx, input) => {
		const { projectId, location, ...query } = input;
		const result = await makeAuthenticatedGoogleBigqueryRequest<
			GoogleBigqueryEndpointOutputs['connectionsListLocationsConnections']
		>(`/projects/${projectId}/locations/${location}/connections`, ctx, {
			method: 'GET',
			host: 'connection',
			query,
		});

		await logEventFromContext(
			ctx,
			'googlebigquery.connections.listLocationsConnections',
			{ ...input },
			'completed',
		);
		return result;
	};

export const create: GoogleBigqueryEndpoints['connectionsCreate'] = async (
	ctx,
	input,
) => {
	const { projectId, location, connectionId, ...body } = input;
	const result = await makeAuthenticatedGoogleBigqueryRequest<
		GoogleBigqueryEndpointOutputs['connectionsCreate']
	>(`/projects/${projectId}/locations/${location}/connections`, ctx, {
		method: 'POST',
		host: 'connection',
		query: { connectionId },
		body,
	});

	// Do not log body — may contain cloudSql/aws/azure credentials
	await logEventFromContext(
		ctx,
		'googlebigquery.connections.create',
		{ projectId, location, connectionId },
		'completed',
	);
	return result;
};

export const update: GoogleBigqueryEndpoints['connectionsUpdate'] = async (
	ctx,
	input,
) => {
	const { projectId, location, connectionId, updateMask, connection } = input;
	const result = await makeAuthenticatedGoogleBigqueryRequest<
		GoogleBigqueryEndpointOutputs['connectionsUpdate']
	>(
		`/projects/${projectId}/locations/${location}/connections/${connectionId}`,
		ctx,
		{
			method: 'PATCH',
			host: 'connection',
			query: { updateMask },
			body: connection,
		},
	);

	// Do not log connection payload — may contain cloudSql/aws/azure credentials
	await logEventFromContext(
		ctx,
		'googlebigquery.connections.update',
		{ projectId, location, connectionId, updateMask },
		'completed',
	);
	return result;
};
