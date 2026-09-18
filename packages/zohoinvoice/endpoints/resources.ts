import { logEventFromContext } from 'corsair/core';
import type { ZohoInvoiceEndpoints } from '..';
import { makeZohoInvoiceRequest } from '../client';
import type {
	ZohoInvoiceEndpointInputs,
	ZohoInvoiceEndpointOutputs,
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

function endpoint<K extends EndpointKey>(
	name: K,
	definition: RequestDefinition,
) {
	return async (
		ctx: RequestContext,
		input: ZohoInvoiceEndpointInputs[K],
	): Promise<ZohoInvoiceEndpointOutputs[K]> => {
		const values = input as unknown as Record<string, unknown>;
		const page = typeof values.page === 'number' ? values.page : undefined;
		const perPage =
			typeof values.perPage === 'number' ? values.perPage : undefined;
		const query = {
			...(definition.query?.(values) ?? {}),
			page,
			per_page: perPage,
		};
		const response = await makeZohoInvoiceRequest<
			ZohoInvoiceEndpointOutputs[K]
		>(definition.path(values), ctx.key, {
			method: definition.method,
			body: definition.body?.(values),
			query,
			organizationId: String(values.organizationId),
			region: ctx.options.region,
		});
		await logEventFromContext(
			ctx,
			`zohoinvoice.${String(name)}`,
			values,
			'completed',
		);
		return response;
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
		path: (input) => `/contacts/${input.contactId}`,
	}),
	create: endpoint('customersCreate', {
		path: () => '/contacts',
		method: 'POST',
		body,
	}),
	update: endpoint('customersUpdate', {
		path: (input) => `/contacts/${input.contactId}`,
		method: 'PUT',
		body,
	}),
};

export const Invoices = {
	list: endpoint('invoicesList', { path: () => '/invoices', query }),
	get: endpoint('invoicesGet', {
		path: (input) => `/invoices/${input.invoiceId}`,
	}),
	create: endpoint('invoicesCreate', {
		path: () => '/invoices',
		method: 'POST',
		body,
	}),
	update: endpoint('invoicesUpdate', {
		path: (input) => `/invoices/${input.invoiceId}`,
		method: 'PUT',
		body,
	}),
	delete: endpoint('invoicesDelete', {
		path: (input) => `/invoices/${input.invoiceId}`,
		method: 'DELETE',
	}),
};

export const Items = {
	list: endpoint('itemsList', { path: () => '/items', query }),
	get: endpoint('itemsGet', { path: (input) => `/items/${input.itemId}` }),
	create: endpoint('itemsCreate', {
		path: () => '/items',
		method: 'POST',
		body,
	}),
	update: endpoint('itemsUpdate', {
		path: (input) => `/items/${input.itemId}`,
		method: 'PUT',
		body,
	}),
};

export const Payments = {
	list: endpoint('paymentsList', { path: () => '/customerpayments', query }),
	get: endpoint('paymentsGet', {
		path: (input) => `/customerpayments/${input.paymentId}`,
	}),
};

export const Estimates = {
	list: endpoint('estimatesList', { path: () => '/estimates', query }),
	get: endpoint('estimatesGet', {
		path: (input) => `/estimates/${input.estimateId}`,
	}),
	create: endpoint('estimatesCreate', {
		path: () => '/estimates',
		method: 'POST',
		body,
	}),
	update: endpoint('estimatesUpdate', {
		path: (input) => `/estimates/${input.estimateId}`,
		method: 'PUT',
		body,
	}),
};
