import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import { redactSensitive } from '../redact';
import type { DnsfilterEndpointOutputs } from './types';
import {
	DnsfilterEndpointInputSchemas,
	DnsfilterEndpointOutputSchemas,
} from './types';

// Current for invoices - GET /v1/invoices/current
export const invoicesCurrent: DnsfilterEndpoints['invoicesCurrent'] = async (
	ctx,
	input,
) => {
	const values = DnsfilterEndpointInputSchemas.invoicesCurrent.parse(
		input ?? {},
	);
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['invoicesCurrent']
	>('/v1/invoices/current', ctx.key, {
		method: 'GET',
	});
	const result = DnsfilterEndpointOutputSchemas.invoicesCurrent.parse(response);
	await logEventFromContext(
		ctx,
		'dnsfilter.invoices.current',
		redactSensitive(values),
		'completed',
	);
	return result;
};

// List invoices - GET /v1/invoices
export const invoicesList: DnsfilterEndpoints['invoicesList'] = async (
	ctx,
	input,
) => {
	const values = DnsfilterEndpointInputSchemas.invoicesList.parse(input ?? {});
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['invoicesList']
	>('/v1/invoices', ctx.key, {
		method: 'GET',
		query: {
			organization_id: values.organization_id,
		},
	});
	const result = DnsfilterEndpointOutputSchemas.invoicesList.parse(response);
	await logEventFromContext(
		ctx,
		'dnsfilter.invoices.list',
		redactSensitive(values),
		'completed',
	);
	return result;
};

// Get an invoice - GET /v1/invoices/{id}
export const invoicesGet: DnsfilterEndpoints['invoicesGet'] = async (
	ctx,
	input,
) => {
	const values = DnsfilterEndpointInputSchemas.invoicesGet.parse(input ?? {});
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['invoicesGet']
	>('/v1/invoices/{id}', ctx.key, {
		method: 'GET',
		path: {
			id: values.id,
		},
		query: {
			organization_id: values.organization_id,
		},
	});
	const result = DnsfilterEndpointOutputSchemas.invoicesGet.parse(response);
	await logEventFromContext(
		ctx,
		'dnsfilter.invoices.get',
		redactSensitive(values),
		'completed',
	);
	return result;
};
