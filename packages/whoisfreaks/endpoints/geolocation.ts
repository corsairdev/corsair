import { logEventFromContext } from 'corsair/core';
import type { WhoisfreaksEndpoints } from '..';
import { makeWhoisfreaksRequest } from '../client';
import type { WhoisfreaksEndpointOutputs } from './types';

export const geolocationLookup: WhoisfreaksEndpoints['geolocationLookup'] =
	async (ctx, input) => {
		const response = await makeWhoisfreaksRequest<
			WhoisfreaksEndpointOutputs['geolocationLookup']
		>('/v1.0/geolocation', ctx.key, {
			method: 'GET',
			query: {
				ip: input.ip,
			},
		});

		await logEventFromContext(
			ctx,
			'whoisfreaks.geolocation.lookup',
			{
				ip: input.ip,
			},
			'completed',
		);

		return response;
	};

export const bulkGeolocationLookup: WhoisfreaksEndpoints['bulkGeolocationLookup'] =
	async (ctx, input) => {
		const response = await makeWhoisfreaksRequest<
			WhoisfreaksEndpointOutputs['bulkGeolocationLookup']
		>('/v1.0/geolocation', ctx.key, {
			method: 'POST',
			body: {
				ips: input.ips,
			},
		});

		await logEventFromContext(
			ctx,
			'whoisfreaks.geolocation.bulk_lookup',
			{
				ipCount: input.ips.length,
			},
			'completed',
		);

		return response;
	};

export const Geolocation = {
	lookup: geolocationLookup,
	bulkLookup: bulkGeolocationLookup,
};
