import { logEventFromContext } from 'corsair/core';
import type { ZohoInvoiceEndpoints } from '..';
import type { ZohoInvoiceRegion } from '../client';
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

type Entity = 'customers' | 'invoices' | 'items' | 'payments' | 'estimates';

/** Where an endpoint's records go locally, and which field holds their id. */
type Storage = {
	entity: Entity;
	/** Response key holding the record or list (contact, contacts, …). */
	key: string;
	idField: string;
	/** Delete endpoints: the input field naming the removed record. */
	deletes?: string;
};

type RequestDefinition = {
	// Zod-checked input fields, read by name.
	path: (input: Record<string, unknown>) => string;
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
	body?: (
		input: Record<string, unknown>,
	) => Record<string, unknown> | undefined;
	query?: (
		input: Record<string, unknown>,
	) => Record<string, string | number | boolean | undefined> | undefined;
	/** False for GET /organizations, which takes no organization. */
	organization?: boolean;
	storage?: Storage;
};

// Event payloads keep ids and the shape of the input, not body values
// (names, emails, addresses).
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

// A zod-checked id (string or number) from the input.
function pathId(value: unknown): string {
	return encodeURIComponent(String(value));
}

// ── Organization ──────────────────────────────────────────────────────────────

// organization_id is a string in practice; unknown until checked below.
type Organizations = { organizations?: Array<{ organization_id?: unknown }> };

/**
 * The organization to send: the input's, else the one saved when the account
 * connected, else the account's only organization (saved for next time).
 * Zoho Invoice needs one on every call except GET /organizations.
 */
async function resolveOrganizationId(
	ctx: RequestContext,
	// The parsed input's organizationId: a string or undefined.
	given: unknown,
): Promise<string> {
	if (typeof given === 'string' && given) return given;
	const keys = (
		ctx as {
			keys?: {
				get_organization_id?: () => Promise<string | null | undefined>;
				set_organization_id?: (value: string) => Promise<void>;
			};
		}
	).keys;
	const stored = await keys?.get_organization_id?.();
	if (stored) return stored;

	const body = await makeZohoInvoiceRequest<Organizations>(
		'/organizations',
		ctx.key,
		{ region: ctx.options.region as ZohoInvoiceRegion | undefined },
	);
	const ids = (body.organizations ?? [])
		.map((org) => org.organization_id)
		.filter((orgId) => orgId !== undefined && orgId !== null)
		.map(String);
	if (ids.length !== 1 || !ids[0]) {
		throw new Error(
			`Zoho Invoice: this account has ${ids.length} organizations. Pass organizationId (organizations.list lists them).`,
		);
	}
	// Only saves a later lookup, so a failed write must not fail this call.
	await keys?.set_organization_id?.(ids[0]).catch(() => undefined);
	return ids[0];
}

// ── Local storage ─────────────────────────────────────────────────────────────

type Table = {
	upsertByEntityId: (
		id: string,
		row: { id: string; data: Record<string, unknown> },
		// Return values the plugin ignores.
	) => Promise<unknown>;
	deleteByEntityId: (id: string) => Promise<unknown>;
};

// Local tables, or undefined without a database (core's stubs throw).
function table(ctx: RequestContext, entity: Entity): Table | undefined {
	// Only whether a database is configured matters here.
	const withDb = ctx as { database?: unknown; db?: Record<string, Table> };
	return withDb.database ? withDb.db?.[entity] : undefined;
}

// The parsed response, read by the storage's key.
async function store(
	ctx: RequestContext,
	storage: Storage,
	response: Record<string, unknown>,
	input: Record<string, unknown>,
) {
	const tbl = table(ctx, storage.entity);
	if (!tbl) return;
	try {
		if (storage.deletes) {
			await tbl.deleteByEntityId(String(input[storage.deletes]));
			return;
		}
		const value = response[storage.key];
		const records = Array.isArray(value) ? value : value ? [value] : [];
		for (const record of records as Array<Record<string, unknown>>) {
			const recordId = record[storage.idField];
			if (recordId === undefined || recordId === null) continue;
			await tbl.upsertByEntityId(String(recordId), {
				id: String(recordId),
				data: record,
			});
		}
	} catch {
		console.warn(`Failed to save Zoho Invoice ${storage.entity}`);
	}
}

// ── Endpoint factory ──────────────────────────────────────────────────────────

function endpoint<K extends EndpointKey>(
	name: K,
	definition: RequestDefinition,
) {
	return async (
		ctx: RequestContext,
		input: ZohoInvoiceEndpointInputs[K],
	): Promise<ZohoInvoiceEndpointOutputs[K]> => {
		const parsedInput = ZohoInvoiceEndpointInputSchemas[name].parse(
			input ?? {},
		) as Record<string, unknown>;
		const page =
			typeof parsedInput.page === 'number' ? parsedInput.page : undefined;
		const perPage =
			typeof parsedInput.perPage === 'number' ? parsedInput.perPage : undefined;
		// Top-level page/perPage win only when given, so query.page survives.
		const query = {
			...(definition.query?.(parsedInput) ?? {}),
			...(page !== undefined ? { page } : {}),
			...(perPage !== undefined ? { per_page: perPage } : {}),
		};
		const organizationId =
			definition.organization === false
				? undefined
				: await resolveOrganizationId(ctx, parsedInput.organizationId);
		// unknown until the output schema parses it below.
		const response = await makeZohoInvoiceRequest<unknown>(
			definition.path(parsedInput),
			ctx.key,
			{
				method: definition.method,
				body: definition.body?.(parsedInput),
				query,
				organizationId,
				region: ctx.options.region,
			},
		);
		const parsedOutput = ZohoInvoiceEndpointOutputSchemas[name].parse(
			response,
		) as ZohoInvoiceEndpointOutputs[K];
		if (definition.storage)
			await store(
				ctx,
				definition.storage,
				parsedOutput as Record<string, unknown>,
				parsedInput,
			);
		await logEventFromContext(
			ctx,
			`zohoinvoice.${String(name)}`,
			describeInput(parsedInput),
			'completed',
		);
		return parsedOutput;
	};
}

// Zod-checked body record from the input.
const body = (input: Record<string, unknown>) =>
	input.body as Record<string, unknown> | undefined;
const query = (input: Record<string, unknown>) =>
	input.query as
		| Record<string, string | number | boolean | undefined>
		| undefined;

const customer = (key: string): Storage => ({
	entity: 'customers',
	key,
	idField: 'contact_id',
});
const invoice = (key: string): Storage => ({
	entity: 'invoices',
	key,
	idField: 'invoice_id',
});
const item = (key: string): Storage => ({
	entity: 'items',
	key,
	idField: 'item_id',
});
const payment = (key: string): Storage => ({
	entity: 'payments',
	key,
	idField: 'payment_id',
});
const estimate = (key: string): Storage => ({
	entity: 'estimates',
	key,
	idField: 'estimate_id',
});

export const Organizations = {
	list: endpoint('organizationsList', {
		path: () => '/organizations',
		organization: false,
	}),
};

export const Customers = {
	list: endpoint('customersList', {
		path: () => '/contacts',
		query,
		storage: customer('contacts'),
	}),
	get: endpoint('customersGet', {
		path: (input) => `/contacts/${pathId(input.contactId)}`,
		storage: customer('contact'),
	}),
	create: endpoint('customersCreate', {
		path: () => '/contacts',
		method: 'POST',
		body,
		storage: customer('contact'),
	}),
	update: endpoint('customersUpdate', {
		path: (input) => `/contacts/${pathId(input.contactId)}`,
		method: 'PUT',
		body,
		storage: customer('contact'),
	}),
	delete: endpoint('customersDelete', {
		path: (input) => `/contacts/${pathId(input.contactId)}`,
		method: 'DELETE',
		storage: { ...customer('contact'), deletes: 'contactId' },
	}),
};

const invoicePath = (input: Record<string, unknown>) =>
	`/invoices/${pathId(input.invoiceId)}`;

export const Invoices = {
	list: endpoint('invoicesList', {
		path: () => '/invoices',
		query,
		storage: invoice('invoices'),
	}),
	get: endpoint('invoicesGet', {
		path: invoicePath,
		storage: invoice('invoice'),
	}),
	create: endpoint('invoicesCreate', {
		path: () => '/invoices',
		method: 'POST',
		body,
		storage: invoice('invoice'),
	}),
	update: endpoint('invoicesUpdate', {
		path: invoicePath,
		method: 'PUT',
		body,
		storage: invoice('invoice'),
	}),
	delete: endpoint('invoicesDelete', {
		path: invoicePath,
		method: 'DELETE',
		storage: { ...invoice('invoice'), deletes: 'invoiceId' },
	}),
	markSent: endpoint('invoicesMarkSent', {
		path: (input) => `${invoicePath(input)}/status/sent`,
		method: 'POST',
	}),
	void: endpoint('invoicesVoid', {
		path: (input) => `${invoicePath(input)}/status/void`,
		method: 'POST',
	}),
	email: endpoint('invoicesEmail', {
		path: (input) => `${invoicePath(input)}/email`,
		method: 'POST',
		body: (input) => body(input) ?? {},
	}),
	remind: endpoint('invoicesRemind', {
		path: (input) => `${invoicePath(input)}/paymentreminder`,
		method: 'POST',
		body: (input) => body(input) ?? {},
	}),
	listPayments: endpoint('invoicesListPayments', {
		path: (input) => `${invoicePath(input)}/payments`,
	}),
};

export const Items = {
	list: endpoint('itemsList', {
		path: () => '/items',
		query,
		storage: item('items'),
	}),
	get: endpoint('itemsGet', {
		path: (input) => `/items/${pathId(input.itemId)}`,
		storage: item('item'),
	}),
	create: endpoint('itemsCreate', {
		path: () => '/items',
		method: 'POST',
		body,
		storage: item('item'),
	}),
	update: endpoint('itemsUpdate', {
		path: (input) => `/items/${pathId(input.itemId)}`,
		method: 'PUT',
		body,
		storage: item('item'),
	}),
	delete: endpoint('itemsDelete', {
		path: (input) => `/items/${pathId(input.itemId)}`,
		method: 'DELETE',
		storage: { ...item('item'), deletes: 'itemId' },
	}),
};

export const Payments = {
	list: endpoint('paymentsList', {
		path: () => '/customerpayments',
		query,
		storage: payment('customerpayments'),
	}),
	get: endpoint('paymentsGet', {
		path: (input) => `/customerpayments/${pathId(input.paymentId)}`,
		storage: payment('payment'),
	}),
	create: endpoint('paymentsCreate', {
		path: () => '/customerpayments',
		method: 'POST',
		body,
		storage: payment('payment'),
	}),
	delete: endpoint('paymentsDelete', {
		path: (input) => `/customerpayments/${pathId(input.paymentId)}`,
		method: 'DELETE',
		storage: { ...payment('payment'), deletes: 'paymentId' },
	}),
};

const estimatePath = (input: Record<string, unknown>) =>
	`/estimates/${pathId(input.estimateId)}`;

export const Estimates = {
	list: endpoint('estimatesList', {
		path: () => '/estimates',
		query,
		storage: estimate('estimates'),
	}),
	get: endpoint('estimatesGet', {
		path: estimatePath,
		storage: estimate('estimate'),
	}),
	create: endpoint('estimatesCreate', {
		path: () => '/estimates',
		method: 'POST',
		body,
		storage: estimate('estimate'),
	}),
	update: endpoint('estimatesUpdate', {
		path: estimatePath,
		method: 'PUT',
		body,
		storage: estimate('estimate'),
	}),
	delete: endpoint('estimatesDelete', {
		path: estimatePath,
		method: 'DELETE',
		storage: { ...estimate('estimate'), deletes: 'estimateId' },
	}),
	markSent: endpoint('estimatesMarkSent', {
		path: (input) => `${estimatePath(input)}/status/sent`,
		method: 'POST',
	}),
	markAccepted: endpoint('estimatesMarkAccepted', {
		path: (input) => `${estimatePath(input)}/status/accepted`,
		method: 'POST',
	}),
	markDeclined: endpoint('estimatesMarkDeclined', {
		path: (input) => `${estimatePath(input)}/status/declined`,
		method: 'POST',
	}),
	email: endpoint('estimatesEmail', {
		path: (input) => `${estimatePath(input)}/email`,
		method: 'POST',
		body: (input) => body(input) ?? {},
	}),
};
