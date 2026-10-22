import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import type { DnsfilterEndpointOutputs } from './types';

// Current for invoices - GET /v1/invoices/current
export const invoicesCurrent: DnsfilterEndpoints['invoicesCurrent'] = async (
	ctx,
	input,
) => {
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['invoicesCurrent']
	>('/v1/invoices/current', ctx.key, {
		method: 'GET',
	});
	await logEventFromContext(
		ctx,
		'dnsfilter.invoices.current',
		input ?? {},
		'completed',
	);
	return response;
};

// List invoices - GET /v1/invoices
export const invoicesList: DnsfilterEndpoints['invoicesList'] = async (
	ctx,
	input,
) => {
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['invoicesList']
	>('/v1/invoices', ctx.key, {
		method: 'GET',
		query: {
			organization_id: input.organization_id,
		},
	});
	await logEventFromContext(
		ctx,
		'dnsfilter.invoices.list',
		input ?? {},
		'completed',
	);
	return response;
};

// Get an invoice - GET /v1/invoices/{id}
export const invoicesGet: DnsfilterEndpoints['invoicesGet'] = async (
	ctx,
	input,
) => {
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['invoicesGet']
	>('/v1/invoices/{id}', ctx.key, {
		method: 'GET',
		path: {
			id: input.id,
		},
		query: {
			organization_id: input.organization_id,
		},
	});
	await logEventFromContext(
		ctx,
		'dnsfilter.invoices.get',
		input ?? {},
		'completed',
	);
	return response;
};
