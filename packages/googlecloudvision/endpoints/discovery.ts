import { logEventFromContext } from 'corsair/core';
import { makeGoogleCloudVisionRequest } from '../client';
import type { GoogleCloudVisionEndpoints } from '../index';
import type { GoogleCloudVisionEndpointOutputs } from './types';

export const listLocations: GoogleCloudVisionEndpoints['locationsList'] =
	async (ctx, input) => {
		const response = await makeGoogleCloudVisionRequest<
			GoogleCloudVisionEndpointOutputs['locationsList']
		>(`${input.name}/locations`, ctx.key, {
			method: 'GET',
			query: {
				filter: input.filter,
				pageSize: input.pageSize,
				pageToken: input.pageToken,
			},
		});
		await logEventFromContext(
			ctx,
			'googlecloudvision.locations.list',
			{ ...input },
			'completed',
		);
		return response;
	};

export const listProjects: GoogleCloudVisionEndpoints['projectsList'] = async (
	ctx,
	input,
) => {
	const response = await makeGoogleCloudVisionRequest<
		GoogleCloudVisionEndpointOutputs['projectsList']
	>('v1/projects', ctx.key, {
		method: 'GET',
		baseUrl: 'https://cloudresourcemanager.googleapis.com',
		query: {
			parent: input.parent,
			pageToken: input.pageToken,
			pageSize: input.pageSize,
			showDeleted: input.showDeleted,
		},
	});
	await logEventFromContext(
		ctx,
		'googlecloudvision.projects.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const listIndexEndpoints: GoogleCloudVisionEndpoints['indexEndpointsList'] =
	async (ctx, input) => {
		// parent format: projects/{project}/locations/{location}
		const response = await makeGoogleCloudVisionRequest<
			GoogleCloudVisionEndpointOutputs['indexEndpointsList']
		>(`v1/${input.parent}/indexEndpoints`, ctx.key, {
			method: 'GET',
			baseUrl: 'https://visionai.googleapis.com',
			query: {
				pageSize: input.pageSize,
				pageToken: input.pageToken,
				filter: input.filter,
			},
		});
		await logEventFromContext(
			ctx,
			'googlecloudvision.indexEndpoints.list',
			{ ...input },
			'completed',
		);
		return response;
	};
