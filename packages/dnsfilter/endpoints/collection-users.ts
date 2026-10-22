import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import { redactSensitive } from '../redact';
import type { DnsfilterEndpointOutputs } from './types';
import {
	DnsfilterEndpointInputSchemas,
	DnsfilterEndpointOutputSchemas,
} from './types';

// List collection users - GET /v1/collections/{collection_id}/users
export const collectionUsersList: DnsfilterEndpoints['collectionUsersList'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.collectionUsersList.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['collectionUsersList']
		>('/v1/collections/{collection_id}/users', ctx.key, {
			method: 'GET',
			path: {
				collection_id: values.collection_id,
			},
			query: {
				name: values.name,
				page: values.page,
				sort: values.sort,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.collectionUsersList.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.collectionUsers.list',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Create a collection user - POST /v1/collections/{collection_id}/users
export const collectionUsersCreate: DnsfilterEndpoints['collectionUsersCreate'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.collectionUsersCreate.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['collectionUsersCreate']
		>('/v1/collections/{collection_id}/users', ctx.key, {
			method: 'POST',
			path: {
				collection_id: values.collection_id,
			},
			body: values.body,
		});
		const result =
			DnsfilterEndpointOutputSchemas.collectionUsersCreate.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.collectionUsers.create',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Get a collection user - GET /v1/collections/{collection_id}/users/{id}
export const collectionUsersGet: DnsfilterEndpoints['collectionUsersGet'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.collectionUsersGet.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['collectionUsersGet']
		>('/v1/collections/{collection_id}/users/{id}', ctx.key, {
			method: 'GET',
			path: {
				collection_id: values.collection_id,
				id: values.id,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.collectionUsersGet.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.collectionUsers.get',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Delete a collection user - DELETE /v1/collections/{collection_id}/users/{id}
export const collectionUsersDelete: DnsfilterEndpoints['collectionUsersDelete'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.collectionUsersDelete.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['collectionUsersDelete']
		>('/v1/collections/{collection_id}/users/{id}', ctx.key, {
			method: 'DELETE',
			path: {
				collection_id: values.collection_id,
				id: values.id,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.collectionUsersDelete.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.collectionUsers.delete',
			redactSensitive(values),
			'completed',
		);
		return result;
	};
