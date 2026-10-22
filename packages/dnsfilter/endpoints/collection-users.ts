import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import type { DnsfilterEndpointOutputs } from './types';

// List collection users - GET /v1/collections/{collection_id}/users
export const collectionUsersList: DnsfilterEndpoints['collectionUsersList'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['collectionUsersList']
		>('/v1/collections/{collection_id}/users', ctx.key, {
			method: 'GET',
			path: {
				collection_id: input.collection_id,
			},
			query: {
				name: input.name,
				page: input.page,
				sort: input.sort,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.collectionUsers.list',
			input ?? {},
			'completed',
		);
		return response;
	};

// Create a collection user - POST /v1/collections/{collection_id}/users
export const collectionUsersCreate: DnsfilterEndpoints['collectionUsersCreate'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['collectionUsersCreate']
		>('/v1/collections/{collection_id}/users', ctx.key, {
			method: 'POST',
			path: {
				collection_id: input.collection_id,
			},
			body: {
				body: input.body,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.collectionUsers.create',
			input ?? {},
			'completed',
		);
		return response;
	};

// Get a collection user - GET /v1/collections/{collection_id}/users/{id}
export const collectionUsersGet: DnsfilterEndpoints['collectionUsersGet'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['collectionUsersGet']
		>('/v1/collections/{collection_id}/users/{id}', ctx.key, {
			method: 'GET',
			path: {
				collection_id: input.collection_id,
				id: input.id,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.collectionUsers.get',
			input ?? {},
			'completed',
		);
		return response;
	};

// Delete a collection user - DELETE /v1/collections/{collection_id}/users/{id}
export const collectionUsersDelete: DnsfilterEndpoints['collectionUsersDelete'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['collectionUsersDelete']
		>('/v1/collections/{collection_id}/users/{id}', ctx.key, {
			method: 'DELETE',
			path: {
				collection_id: input.collection_id,
				id: input.id,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.collectionUsers.delete',
			input ?? {},
			'completed',
		);
		return response;
	};
