import { logEventFromContext } from 'corsair/core';
import type { PostmanEndpoints } from '..';
import { makePostmanRequest } from '../client';
import type { PostmanEndpointOutputs } from './types';

export const getResourceTypes: PostmanEndpoints['scimGetResourceTypes'] =
	async (ctx, input) => {
		const response = await makePostmanRequest<
			PostmanEndpointOutputs['scimGetResourceTypes']
		>('/scim/v2/ResourceTypes', ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'postman.scim.getResourceTypes',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getServiceConfig: PostmanEndpoints['scimGetServiceConfig'] =
	async (ctx, input) => {
		const response = await makePostmanRequest<
			PostmanEndpointOutputs['scimGetServiceConfig']
		>('/scim/v2/ServiceProviderConfig', ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'postman.scim.getServiceConfig',
			{ ...input },
			'completed',
		);
		return response;
	};
