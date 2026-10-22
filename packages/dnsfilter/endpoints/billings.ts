import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import type { DnsfilterEndpointOutputs } from './types';

// Get a billing - GET /v1/billing
export const billingsGet: DnsfilterEndpoints['billingsGet'] = async (
	ctx,
	input,
) => {
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['billingsGet']
	>('/v1/billing', ctx.key, {
		method: 'GET',
		query: {
			organization_id: input.organization_id,
		},
	});
	await logEventFromContext(
		ctx,
		'dnsfilter.billings.get',
		input ?? {},
		'completed',
	);
	return response;
};

// Create a billing - POST /v1/billing
export const billingsCreate: DnsfilterEndpoints['billingsCreate'] = async (
	ctx,
	input,
) => {
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['billingsCreate']
	>('/v1/billing', ctx.key, {
		method: 'POST',
		body: {
			organization_id: input.organization_id,
			payment_token: input.payment_token,
		},
	});
	await logEventFromContext(
		ctx,
		'dnsfilter.billings.create',
		input ?? {},
		'completed',
	);
	return response;
};

// Address show for billings - GET /v1/billing/address/{organization_id}
export const billingsAddressShow: DnsfilterEndpoints['billingsAddressShow'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['billingsAddressShow']
		>('/v1/billing/address/{organization_id}', ctx.key, {
			method: 'GET',
			path: {
				organization_id: input.organization_id,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.billings.addressShow',
			input ?? {},
			'completed',
		);
		return response;
	};

// Address update for billings - PATCH /v1/billing/address/{organization_id}
export const billingsAddressUpdate: DnsfilterEndpoints['billingsAddressUpdate'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['billingsAddressUpdate']
		>('/v1/billing/address/{organization_id}', ctx.key, {
			method: 'PATCH',
			path: {
				organization_id: input.organization_id,
			},
			body: {
				billing_address: input.billing_address,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.billings.addressUpdate',
			input ?? {},
			'completed',
		);
		return response;
	};
