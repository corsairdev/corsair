import type { NetSuiteBase } from '../client';

export type BodySource = 'none' | 'body' | 'data' | 'record_body' | 'input';

export type RouteSpec = {
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	path: string;
	pathParams?: string[];
	query?: string[];
	headers?: Record<string, string[]>;
	body?: BodySource;
	bodyFromInput?: string[];
	staticBody?: Record<string, unknown>;
	formBody?: Record<string, string>;
	staticForm?: Record<string, string>;
	basicAuth?: [string, string];
	// Send basicAuth only when a client secret is present (confidential
	// clients); public clients send client_id in the form body instead.
	basicAuthIfSecret?: boolean;
	base?: NetSuiteBase;
	auth?: 'none';
	accept?: string;
	acceptFromInput?: boolean;
	responseHeader?: string;
	parseJsonText?: boolean;
	preferTransient?: boolean;
	defaults?: Record<string, string>;
	riskLevel: 'read' | 'write' | 'destructive';
	metaDescription: string;
	custom?:
		| 'authorize-account'
		| 'authorize-system'
		| 'jwt-client-assertion'
		| 'reference-select';
};

const listQuery = ['q', 'limit', 'offset'];
const getQuery = ['fields', 'expandSubResources', 'simpleEnumFormat'];
const validationHeaders = {
	'X-NetSuite-Idempotency-Key': [
		'X-NetSuite-Idempotency-Key',
		'idempotency_key',
	],
	'X-NetSuite-PropertyNameValidation': [
		'X-NetSuite-PropertyNameValidation',
		'property_name_validation',
	],
	'X-NetSuite-PropertyValueValidation': [
		'X-NetSuite-PropertyValueValidation',
		'property_value_validation',
	],
};
const writeHeaders = {
	Prefer: ['Prefer', 'prefer'],
	...validationHeaders,
};
const updateQuery = ['replace', 'replaceSelectedFields'];

function list(resource: string, description: string): RouteSpec {
	return {
		method: 'GET',
		path: `/record/v1/${resource}`,
		query: listQuery,
		riskLevel: 'read',
		metaDescription: description,
	};
}

function get(
	resource: string,
	description: string,
	query = getQuery,
): RouteSpec {
	return {
		method: 'GET',
		path: `/record/v1/${resource}/{id}`,
		pathParams: ['id'],
		query,
		riskLevel: 'read',
		metaDescription: description,
	};
}

function create(
	resource: string,
	description: string,
	body: BodySource = 'body',
): RouteSpec {
	return {
		method: 'POST',
		path: `/record/v1/${resource}`,
		query: ['replace'],
		headers: writeHeaders,
		// NetSuite answers record writes with 204 + Location. Ask the shared
		// transport for that header so the new record reference is not lost.
		responseHeader: 'Location',
		body,
		riskLevel: 'write',
		metaDescription: description,
	};
}

function update(resource: string, description: string): RouteSpec {
	return {
		method: 'PATCH',
		path: `/record/v1/${resource}/{id}`,
		pathParams: ['id'],
		query: updateQuery,
		headers: writeHeaders,
		responseHeader: 'Location',
		body: 'data',
		riskLevel: 'write',
		metaDescription: description,
	};
}

function remove(resource: string, description: string): RouteSpec {
	return {
		method: 'DELETE',
		path: `/record/v1/${resource}/{id}`,
		pathParams: ['id'],
		headers: writeHeaders,
		// With Prefer: respond-async, NetSuite answers deletions with 202 + Location (job URL).
		// Capture that header so callers receive the job reference for polling.
		responseHeader: 'Location',
		riskLevel: 'destructive',
		metaDescription: description,
	};
}

export const netSuiteSpecs = {
	asyncGetJobStatus: {
		method: 'GET',
		path: '/async/v1/job/{jobId}',
		pathParams: ['jobId'],
		riskLevel: 'read',
		metaDescription: 'Retrieve the status of an asynchronous NetSuite REST job',
	},
	asyncGetJobTask: {
		method: 'GET',
		path: '/async/v1/job/{jobId}/task/{taskId}',
		pathParams: ['jobId', 'taskId'],
		riskLevel: 'read',
		metaDescription:
			'Retrieve the task reference and status for an asynchronous job',
	},
	asyncGetJobTaskResult: {
		method: 'GET',
		path: '/async/v1/job/{jobId}/task/{taskId}/result',
		pathParams: ['jobId', 'taskId'],
		riskLevel: 'read',
		metaDescription: 'Retrieve the result of an asynchronous job task',
	},
	createCustomer: create('customer', 'Create a NetSuite customer record'),
	createCustomerPayment: create(
		'customerPayment',
		'Create a NetSuite customer payment record',
	),
	createEmployee: create('employee', 'Create a NetSuite employee record'),
	createInvoice: create('invoice', 'Create a NetSuite invoice record'),
	createItem: {
		...create('{record_type}', 'Create a NetSuite item record'),
		pathParams: ['record_type'],
		defaults: { record_type: 'inventoryItem' },
	},
	createJournalEntry: create(
		'journalEntry',
		'Create a NetSuite journal entry record',
	),
	createJwtClientAssertion: {
		method: 'POST',
		path: '',
		body: 'none',
		// It signs with the plugin's private key and returns a usable credential,
		// so it needs the same permission as the token exchange.
		riskLevel: 'write',
		metaDescription:
			'Create a signed JWT client assertion for OAuth 2.0 client credentials',
		custom: 'jwt-client-assertion',
	},
	createPurchaseOrder: create(
		'purchaseOrder',
		'Create a NetSuite purchase order',
		'input',
	),
	createRecord: {
		...create('{record_type}', 'Create a record of any exposed NetSuite type'),
		pathParams: ['record_type'],
	},
	createSalesOrder: create(
		'salesOrder',
		'Create a NetSuite sales order',
		'input',
	),
	createVendor: create('vendor', 'Create a NetSuite vendor record'),
	createVendorBill: create(
		'vendorBill',
		'Create a NetSuite vendor bill record',
	),
	deleteCustomer: remove('customer', 'Delete a NetSuite customer record'),
	deleteCustomerPayment: remove(
		'customerPayment',
		'Delete a NetSuite customer payment record',
	),
	deleteEmployee: remove('employee', 'Delete a NetSuite employee record'),
	deleteInvoice: remove('invoice', 'Delete a NetSuite invoice record'),
	deleteItem: {
		...remove('{item_record_type}', 'Delete a NetSuite item record'),
		pathParams: ['item_record_type', 'id'],
		defaults: { item_record_type: 'inventoryItem' },
	},
	deleteItemFulfillment: remove(
		'itemFulfillment',
		'Delete a NetSuite item fulfillment record',
	),
	deleteItemReceipt: remove(
		'itemReceipt',
		'Delete a NetSuite item receipt record',
	),
	deleteJournalEntry: remove(
		'journalEntry',
		'Delete a NetSuite journal entry record',
	),
	deletePurchaseOrder: remove(
		'purchaseOrder',
		'Delete a NetSuite purchase order record',
	),
	deleteSalesOrder: remove(
		'salesOrder',
		'Delete a NetSuite sales order record',
	),
	deleteVendorPayment: remove(
		'vendorPayment',
		'Delete a NetSuite vendor payment record',
	),
	executeDataset: {
		method: 'GET',
		path: '/query/v1/dataset/{dataset_id}/result',
		pathParams: ['dataset_id'],
		query: ['limit', 'offset'],
		riskLevel: 'read',
		metaDescription: 'Execute a SuiteAnalytics Workbook dataset',
	},
	getCustomer: get('customer', 'Get a NetSuite customer record by internal ID'),
	getCustomerPayment: get(
		'customerPayment',
		'Get a NetSuite customer payment record by ID',
	),
	getDatacenterUrls: {
		method: 'GET',
		path: '/rest/datacenterurls',
		query: ['c', 'account'],
		base: 'datacenter',
		auth: 'none',
		riskLevel: 'read',
		metaDescription: 'Discover account-specific NetSuite service domains',
	},
	getEmployee: get('employee', 'Get a NetSuite employee record by internal ID'),
	getGovernanceLimits: {
		method: 'GET',
		path: '/system/v1/governanceLimits',
		riskLevel: 'read',
		metaDescription:
			'Retrieve NetSuite account and integration concurrency limits',
	},
	getInvoice: get('invoice', 'Get a NetSuite invoice record by internal ID'),
	getItem: {
		method: 'GET',
		path: '/record/v1/{itemRecordType}/{id}',
		pathParams: ['itemRecordType', 'id'],
		query: ['fields', 'expandSubResources'],
		riskLevel: 'read',
		metaDescription: 'Get a NetSuite item record by internal ID',
	},
	getItemFulfillment: get(
		'itemFulfillment',
		'Get a NetSuite item fulfillment record by ID',
	),
	getItemReceipt: get(
		'itemReceipt',
		'Get a NetSuite item receipt record by internal ID',
	),
	getJournalEntry: get(
		'journalEntry',
		'Get a NetSuite journal entry record by internal ID',
	),
	getPurchaseOrder: get(
		'purchaseOrder',
		'Get a NetSuite purchase order by internal ID',
	),
	getRecordMetadata: {
		method: 'GET',
		path: '/record/v1/metadata-catalog/{record_type}',
		pathParams: ['record_type'],
		riskLevel: 'read',
		metaDescription: 'Retrieve the metadata schema for a NetSuite record type',
		accept: 'application/schema+json',
		acceptFromInput: true,
		parseJsonText: true,
	},
	getReferenceSelectField: {
		method: 'GET',
		path: '',
		body: 'none',
		riskLevel: 'read',
		metaDescription: 'Retrieve the record referenced by a select-type field',
		custom: 'reference-select',
	},
	getSalesOrder: get(
		'salesOrder',
		'Get a NetSuite sales order record by internal ID',
	),
	getServerTime: {
		method: 'GET',
		path: '/system/v1/serverTime',
		riskLevel: 'read',
		metaDescription: 'Retrieve the current NetSuite server time in UTC',
	},
	getSublistCollection: {
		method: 'GET',
		path: '/record/v1/{record_type}/{id}/{sublist_name}',
		pathParams: ['record_type', 'id', 'sublist_name'],
		query: ['limit', 'offset'],
		riskLevel: 'read',
		metaDescription: 'Retrieve a sublist collection from a NetSuite record',
	},
	getSublistLine: {
		method: 'GET',
		path: '/record/v1/{record_type}/{id}/{sublist_name}/{line_id}',
		pathParams: ['record_type', 'id', 'sublist_name', 'line_id'],
		query: ['expandSubResources'],
		riskLevel: 'read',
		metaDescription: 'Retrieve a specific line from a NetSuite sublist',
	},
	getSubrecord: {
		method: 'GET',
		path: '/record/v1/{record_type}/{id}/{subrecord_name}',
		pathParams: ['record_type', 'id', 'subrecord_name'],
		riskLevel: 'read',
		metaDescription: 'Retrieve a subrecord from a NetSuite parent record',
	},
	getVendor: get(
		'vendor',
		'Get a single NetSuite vendor record by internal ID',
	),
	getVendorBill: get(
		'vendorBill',
		'Retrieve a NetSuite vendor bill by internal ID',
	),
	getVendorPayment: get(
		'vendorPayment',
		'Retrieve a NetSuite vendor payment by internal ID',
	),
	listCustomerPayments: list(
		'customerPayment',
		'List NetSuite customer payment records',
	),
	listDatasets: {
		method: 'GET',
		path: '/query/v1/dataset',
		query: ['limit', 'offset'],
		riskLevel: 'read',
		metaDescription: 'List SuiteAnalytics Workbook datasets',
	},
	listEmployees: list('employee', 'List NetSuite employee records'),
	listInvoices: list('invoice', 'List NetSuite invoice records'),
	listItemFulfillments: list(
		'itemFulfillment',
		'List NetSuite item fulfillment records',
	),
	listItemReceipts: list('itemReceipt', 'List NetSuite item receipt records'),
	listJournalEntries: list(
		'journalEntry',
		'List NetSuite journal entry records',
	),
	listMetadataCatalog: {
		method: 'GET',
		path: '/record/v1/metadata-catalog',
		query: ['select'],
		riskLevel: 'read',
		metaDescription: 'List metadata for all exposed NetSuite record types',
		accept: 'application/json',
		acceptFromInput: true,
		parseJsonText: true,
	},
	listPurchaseOrders: list(
		'purchaseOrder',
		'List NetSuite purchase order records',
	),
	listRecords: {
		...list('{record_type}', 'List records of any exposed NetSuite type'),
		pathParams: ['record_type'],
	},
	listSalesOrders: list('salesOrder', 'List NetSuite sales order records'),
	listVendorPayments: list(
		'vendorPayment',
		'List NetSuite vendor payment records',
	),
	oauth2AuthorizeAccountDomain: {
		method: 'GET',
		path: '',
		body: 'none',
		riskLevel: 'read',
		metaDescription:
			'Build an OAuth 2.0 authorization URL on the account domain',
		custom: 'authorize-account',
	},
	oauth2AuthorizeSystemDomain: {
		method: 'GET',
		path: '',
		body: 'none',
		riskLevel: 'read',
		metaDescription:
			'Build an OAuth 2.0 authorization URL on the system domain',
		custom: 'authorize-system',
	},
	oauth2GetJwksKeys: {
		method: 'GET',
		path: '/auth/oauth2/v1/keys',
		auth: 'none',
		riskLevel: 'read',
		metaDescription: 'Retrieve NetSuite OAuth 2.0 JWKS public keys',
	},
	oauth2Logout: {
		method: 'GET',
		path: '/auth/oauth2/v1/logout',
		query: ['id_token_hint'],
		auth: 'none',
		riskLevel: 'write',
		metaDescription: 'Log out an OAuth 2.0 session using an ID token hint',
	},
	oauth2RevokeRefreshToken: {
		method: 'POST',
		path: '/auth/oauth2/v1/revoke',
		formBody: { token: 'token', client_id: 'client_id' },
		basicAuth: ['client_id', 'client_secret'],
		basicAuthIfSecret: true,
		auth: 'none',
		// A revoked refresh token (and its access tokens) cannot be restored.
		riskLevel: 'destructive',
		metaDescription: 'Revoke a NetSuite OAuth 2.0 refresh token',
	},
	oauth2TokenAuthorizationCode: {
		method: 'POST',
		path: '/auth/oauth2/v1/token',
		formBody: {
			grant_type: 'grant_type',
			code: 'code',
			client_id: 'client_id',
			redirect_uri: 'redirect_uri',
			code_verifier: 'code_verifier',
		},
		staticForm: { grant_type: 'authorization_code' },
		basicAuth: ['client_id', 'client_secret'],
		basicAuthIfSecret: true,
		auth: 'none',
		riskLevel: 'write',
		metaDescription: 'Exchange an OAuth 2.0 authorization code for tokens',
	},
	oauth2TokenClientCredentials: {
		method: 'POST',
		path: '/auth/oauth2/v1/token',
		formBody: {
			grant_type: 'grant_type',
			client_assertion: 'client_assertion',
			client_assertion_type: 'client_assertion_type',
		},
		staticForm: { grant_type: 'client_credentials' },
		defaults: {
			client_assertion_type:
				'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
		},
		auth: 'none',
		riskLevel: 'write',
		metaDescription:
			'Exchange a JWT client assertion for an OAuth 2.0 access token',
	},
	oauth2TokenRefresh: {
		method: 'POST',
		path: '/auth/oauth2/v1/token',
		formBody: {
			grant_type: 'grant_type',
			refresh_token: 'refresh_token',
			client_id: 'client_id',
		},
		staticForm: { grant_type: 'refresh_token' },
		basicAuth: ['client_id', 'client_secret'],
		basicAuthIfSecret: true,
		auth: 'none',
		riskLevel: 'write',
		metaDescription: 'Refresh a NetSuite OAuth 2.0 access token',
	},
	runSuiteqlQuery: {
		method: 'POST',
		path: '/query/v1/suiteql',
		query: ['limit', 'offset'],
		body: 'none',
		bodyFromInput: ['q'],
		preferTransient: true,
		riskLevel: 'read',
		metaDescription: 'Run a SuiteQL query against NetSuite data',
	},
	transformRecord: {
		method: 'POST',
		path: '/record/v1/{source_record_type}/{record_id}/!transform/{target_record_type}',
		pathParams: ['source_record_type', 'record_id', 'target_record_type'],
		query: ['replace'],
		headers: writeHeaders,
		responseHeader: 'Location',
		body: 'record_body',
		// Creates a new record and changes the source record's status (for
		// example billing a sales order), which a delete does not undo.
		riskLevel: 'destructive',
		metaDescription: 'Transform a NetSuite record into another record type',
	},
	updateCustomer: update('customer', 'Update a NetSuite customer record'),
	updateCustomerPayment: update(
		'customerPayment',
		'Update a NetSuite customer payment record',
	),
	updateEmployee: update('employee', 'Update a NetSuite employee record'),
	updateInvoice: update('invoice', 'Update a NetSuite invoice record'),
	updateItem: {
		...update('{item_type}', 'Update a NetSuite item record'),
		pathParams: ['item_type', 'id'],
	},
	updateItemFulfillment: update(
		'itemFulfillment',
		'Update a NetSuite item fulfillment record',
	),
	updateItemReceipt: update(
		'itemReceipt',
		'Update a NetSuite item receipt record',
	),
	updateJournalEntry: update(
		'journalEntry',
		'Update a NetSuite journal entry record',
	),
	updatePurchaseOrder: update(
		'purchaseOrder',
		'Update a NetSuite purchase order record',
	),
	updateSalesOrder: update(
		'salesOrder',
		'Update a NetSuite sales order record',
	),
	updateVendor: update('vendor', 'Update a NetSuite vendor record'),
	updateVendorBill: update(
		'vendorBill',
		'Update a NetSuite vendor bill record',
	),
	updateVendorPayment: update(
		'vendorPayment',
		'Update a NetSuite vendor payment record',
	),
	upsertRecordByExternalId: {
		method: 'PUT',
		path: '/record/v1/{record_type}/eid:{external_id}',
		pathParams: ['record_type', 'external_id'],
		query: ['replace'],
		headers: writeHeaders,
		responseHeader: 'Location',
		body: 'body',
		riskLevel: 'write',
		metaDescription: 'Upsert a NetSuite record by external ID',
	},
} as const satisfies Record<string, RouteSpec>;

export type NetSuiteSpecKey = keyof typeof netSuiteSpecs;
