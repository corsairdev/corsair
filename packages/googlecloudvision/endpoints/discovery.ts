import { logEventFromContext } from 'corsair/core';
import { makeGoogleCloudVisionRequest } from '../client';
import type { GoogleCloudVisionEndpoints } from '../index';
import type { GoogleCloudVisionEndpointOutputs } from './types';

export const listLocations: GoogleCloudVisionEndpoints['locationsList'] =
	async (ctx, input) => {
		const response = await makeGoogleCloudVisionRequest<
			GoogleCloudVisionEndpointOutputs['locationsList']
		>(`${input.name}/locations`, ctx, {
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
			{ name: input.name },
			'completed',
		);
		return response;
	};
