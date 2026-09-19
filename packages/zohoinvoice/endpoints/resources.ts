import { logEventFromContext } from 'corsair/core';
import type { ZohoInvoiceEndpoints } from '..';
import { makeZohoInvoiceRequest } from '../client';
import type {
	ZohoInvoiceEndpointInputs,
	ZohoInvoiceEndpointOutputs,
} from './types';
import {
	ZohoInvoiceEndpointInputSchemas,
	ZohoInvoiceEndpointOutputSchemas,
} from './types';

type EndpointKey = keyof ZohoInvoiceEndpointInputs;
type RequestContext = Parameters<ZohoInvoiceEndpoints[EndpointKey]>[0];

type RequestDefinition = {
	path: (input: Record<string, unknown>) => string;
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
	body?: (
		input: Record<string, unknown>,
	) => Record<string, unknown> | undefined;
	query?: (
		input: Record<string, unknown>,
	) => Record<string, string | number | boolean | undefined> | undefined;
};

function describeInput(
	input: Record<string, unknown>,
): Record<string, unknown> {
	const described: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(input)) {
		if (key === 'body') {
			if (value !== undefined) described.hasBody = true;
			continue;
		}
		if (key === 'query') {
			if (value !== undefined && typeof value === 'object') {
				described.queryKeys = Object.keys(value as object).sort();
			}
			continue;
		}
		described[key] = value;
	}
	return described;
}

function pathId(value: unknown): string {
	return encodeURIComponent(String(value));
}

function endpoint<K extends EndpointKey>(
	name: K,
	definition: RequestDefinition,
) {
	return async (
		ctx: RequestContext,
		input: ZohoInvoiceEndpointInputs[K],
	): Promise<ZohoInvoiceEndpointOutputs[K]> => {
		const parsedInput = ZohoInvoiceEndpointInputSchemas[name].parse(
			input,
		) as Record<string, unknown>;
		const page =
			typeof parsedInput.page === 'number' ? parsedInput.page : undefined;
		const perPage =
			typeof parsedInput.perPage === 'number' ? parsedInput.perPage : undefined;
		const query = {
			...(definition.query?.(parsedInput) ?? {}),
			page,
			per_page: perPage,
		};
		const response = await makeZohoInvoiceRequest<unknown>(
			definition.path(parsedInput),
			ctx.key,
			{
				method: definition.method,
				body: definition.body?.(parsedInput),
				query,
				organizationId: String(parsedInput.organizationId),
				region: ctx.options.region,
			},
		);
		const parsedOutput = ZohoInvoiceEndpointOutputSchemas[name].parse(
			response,
		) as ZohoInvoiceEndpointOutputs[K];
		await logEventFromContext(
			ctx,
			`zohoinvoice.${String(name)}`,
			describeInput(parsedInput),
			'completed',
		);
		return parsedOutput;
	};
}

const body = (input: Record<string, unknown>) =>
	input.body as Record<string, unknown>;
const query = (input: Record<string, unknown>) =>
	input.query as
		| Record<string, string | number | boolean | undefined>
		| undefined;

export const Customers = {
	list: endpoint('customersList', { path: () => '/contacts', query }),
	get: endpoint('customersGet', {
		path: (input) => `/contacts/${pathId(input.contactId)}`,
	}),
	create: endpoint('customersCreate', {
		path: () => '/contacts',
		method: 'POST',
		body,
	}),
	update: endpoint('customersUpdate', {
		path: (input) => `/contacts/${pathId(input.contactId)}`,
		method: 'PUT',
		body,
	}),
};

export const Invoices = {
	list: endpoint('invoicesList', { path: () => '/invoices', query }),
	get: endpoint('invoicesGet', {
		path: (input) => `/invoices/${pathId(input.invoiceId)}`,
	}),
	create: endpoint('invoicesCreate', {
		path: () => '/invoices',
		method: 'POST',
		body,
	}),
	update: endpoint('invoicesUpdate', {
		path: (input) => `/invoices/${pathId(input.invoiceId)}`,
		method: 'PUT',
		body,
	}),
	delete: endpoint('invoicesDelete', {
		path: (input) => `/invoices/${pathId(input.invoiceId)}`,
		method: 'DELETE',
	}),
};

export const Items = {
	list: endpoint('itemsList', { path: () => '/items', query }),
	get: endpoint('itemsGet', {
		path: (input) => `/items/${pathId(input.itemId)}`,
	}),
	create: endpoint('itemsCreate', {
		path: () => '/items',
		method: 'POST',
		body,
	}),
	update: endpoint('itemsUpdate', {
		path: (input) => `/items/${pathId(input.itemId)}`,
		method: 'PUT',
		body,
	}),
};

export const Payments = {
	list: endpoint('paymentsList', { path: () => '/customerpayments', query }),
	get: endpoint('paymentsGet', {
		path: (input) => `/customerpayments/${pathId(input.paymentId)}`,
	}),
};

export const Estimates = {
	list: endpoint('estimatesList', { path: () => '/estimates', query }),
	get: endpoint('estimatesGet', {
		path: (input) => `/estimates/${pathId(input.estimateId)}`,
	}),
	create: endpoint('estimatesCreate', {
		path: () => '/estimates',
		method: 'POST',
		body,
	}),
	update: endpoint('estimatesUpdate', {
		path: (input) => `/estimates/${pathId(input.estimateId)}`,
		method: 'PUT',
		body,
	}),
};
