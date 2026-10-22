import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import { redactSensitive } from '../redact';
import type { DnsfilterEndpointOutputs } from './types';
import {
	DnsfilterEndpointInputSchemas,
	DnsfilterEndpointOutputSchemas,
} from './types';

// Get a billing - GET /v1/billing
export const billingsGet: DnsfilterEndpoints['billingsGet'] = async (
	ctx,
	input,
) => {
	const values = DnsfilterEndpointInputSchemas.billingsGet.parse(input ?? {});
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['billingsGet']
	>('/v1/billing', ctx.key, {
		method: 'GET',
		query: {
			organization_id: values.organization_id,
		},
	});
	const result = DnsfilterEndpointOutputSchemas.billingsGet.parse(response);
	await logEventFromContext(
		ctx,
		'dnsfilter.billings.get',
		redactSensitive(values),
		'completed',
	);
	return result;
};

// Create a billing - POST /v1/billing
export const billingsCreate: DnsfilterEndpoints['billingsCreate'] = async (
	ctx,
	input,
) => {
	const values = DnsfilterEndpointInputSchemas.billingsCreate.parse(
		input ?? {},
	);
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['billingsCreate']
	>('/v1/billing', ctx.key, {
		method: 'POST',
		body: {
			organization_id: values.organization_id,
			payment_token: values.payment_token,
		},
	});
	const result = DnsfilterEndpointOutputSchemas.billingsCreate.parse(response);
	await logEventFromContext(
		ctx,
		'dnsfilter.billings.create',
		redactSensitive(values),
		'completed',
	);
	return result;
};

// Address show for billings - GET /v1/billing/address/{organization_id}
export const billingsAddressShow: DnsfilterEndpoints['billingsAddressShow'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.billingsAddressShow.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['billingsAddressShow']
		>('/v1/billing/address/{organization_id}', ctx.key, {
			method: 'GET',
			path: {
				organization_id: values.organization_id,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.billingsAddressShow.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.billings.addressShow',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Address update for billings - PATCH /v1/billing/address/{organization_id}
export const billingsAddressUpdate: DnsfilterEndpoints['billingsAddressUpdate'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.billingsAddressUpdate.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['billingsAddressUpdate']
		>('/v1/billing/address/{organization_id}', ctx.key, {
			method: 'PATCH',
			path: {
				organization_id: values.organization_id,
			},
			body: {
				billing_address: values.billing_address,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.billingsAddressUpdate.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.billings.addressUpdate',
			redactSensitive(values),
			'completed',
		);
		return result;
	};
