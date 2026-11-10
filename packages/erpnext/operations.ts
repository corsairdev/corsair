import type { EndpointRiskLevel } from 'corsair/core';

export type ErpnextMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type ErpnextOperationDefinition = {
	key: string;
	group: string;
	method: ErpnextMethod;
	// Full path from the site origin. Frappe serves the generic resource API
	// under /api/resource and whitelisted Python methods under /api/method.
	path: string;
	pathParams: readonly string[];
	queryParams: readonly string[];
	hasBody: boolean;
	bodyRequired: boolean;
	hasResponseBody: boolean;
	responseEncoding: 'json' | 'bytes';
	riskLevel: EndpointRiskLevel;
	irreversible?: boolean;
	description: string;
};

// Part 1 of the requested 51-operation scope (issue #2172): the
// doctype-parameterized document family, DocType metadata, and system
// lookups — 25 operations. Wire mappings verified against frappe@develop
// sources: frappe/client.py (client RPC whitelist), frappe/api (resource
// routes), frappe/handler.py and frappe/__init__.py (top-level methods),
// frappe/desk/search.py and frappe/desk/form/load.py (desk endpoints), and
// frappe/utils/change_log.py. Aliased OSS tools are kept as distinct public
// operations 1:1 with the requested scope; the underlying wire call is noted
// in each entry.
export const ERPNEXT_OPERATIONS = [
	{
		key: 'documents.create',
		group: 'documents',
		method: 'POST',
		path: '/api/resource/{doctype}',
		pathParams: ['doctype'],
		queryParams: [],
		hasBody: true,
		bodyRequired: true,
		hasResponseBody: true,
		responseEncoding: 'json',
		riskLevel: 'write',
		description:
			'Create a document of any DocType from its field values; the response carries the created document',
	},
	{
		key: 'documents.insert',
		group: 'documents',
		method: 'POST',
		path: '/api/method/frappe.client.insert',
		pathParams: [],
		queryParams: [],
		hasBody: true,
		bodyRequired: true,
		hasResponseBody: true,
		responseEncoding: 'json',
		riskLevel: 'write',
		description:
			'Insert a document through the frappe.client RPC, passing the full document object including its doctype field',
	},
	{
		key: 'documents.saveDocument',
		group: 'documents',
		method: 'POST',
		path: '/api/method/frappe.client.save',
		pathParams: [],
		queryParams: [],
		hasBody: true,
		bodyRequired: true,
		hasResponseBody: true,
		responseEncoding: 'json',
		riskLevel: 'write',
		description:
			'Save an existing document through the frappe.client RPC, passing the complete document object with its changes',
	},
	{
		key: 'documents.saveDocs',
		group: 'documents',
		method: 'POST',
		path: '/api/method/frappe.client.save',
		pathParams: [],
		queryParams: [],
		hasBody: true,
		bodyRequired: true,
		hasResponseBody: true,
		responseEncoding: 'json',
		riskLevel: 'write',
		description:
			'Save, submit, cancel, or update a document by sending its docstatus and fields through the frappe.client RPC',
	},
	{
		key: 'documents.insertMany',
		group: 'documents',
		method: 'POST',
		path: '/api/method/frappe.client.insert_many',
		pathParams: [],
		queryParams: [],
		hasBody: true,
		bodyRequired: true,
		hasResponseBody: true,
		responseEncoding: 'json',
		riskLevel: 'write',
		description:
			'Insert multiple documents in one call for efficiency; each item carries its doctype and field values',
	},
	{
		key: 'documents.get',
		group: 'documents',
		method: 'GET',
		path: '/api/resource/{doctype}/{name}',
		pathParams: ['doctype', 'name'],
		queryParams: [],
		hasBody: false,
		bodyRequired: false,
		hasResponseBody: true,
		responseEncoding: 'json',
		riskLevel: 'read',
		description: 'Read one document of a DocType by its name',
	},
	{
		key: 'documents.getClient',
		group: 'documents',
		method: 'GET',
		path: '/api/method/frappe.client.get',
		pathParams: [],
		queryParams: ['doctype', 'name'],
		hasBody: false,
		bodyRequired: false,
		hasResponseBody: true,
		responseEncoding: 'json',
		riskLevel: 'read',
		description:
			'Read a single document through the frappe.client RPC by doctype and name',
	},
	{
		key: 'documents.getWithMeta',
		group: 'documents',
		method: 'GET',
		path: '/api/method/frappe.desk.form.load.getdoc',
		pathParams: [],
		queryParams: ['doctype', 'name'],
		hasBody: false,
		bodyRequired: false,
		hasResponseBody: true,
		responseEncoding: 'json',
		riskLevel: 'read',
		description:
			'Read a document with its desk metadata: attachments, comments, activity logs, and related information',
	},
	{
		key: 'documents.list',
		group: 'documents',
		method: 'GET',
		path: '/api/resource/{doctype}',
		pathParams: ['doctype'],
		queryParams: [
			'fields',
			'filters',
			'order_by',
			'limit_start',
			'limit_page_length',
		],
		hasBody: false,
		bodyRequired: false,
		hasResponseBody: true,
		responseEncoding: 'json',
		riskLevel: 'read',
		description:
			'List documents of a DocType with field selection, filters, ordering, and pagination',
	},
	{
		key: 'documents.getList',
		group: 'documents',
		method: 'GET',
		path: '/api/method/frappe.client.get_list',
		pathParams: [],
		queryParams: [
			'doctype',
			'fields',
			'filters',
			'order_by',
			'limit_start',
			'limit_page_length',
		],
		hasBody: false,
		bodyRequired: false,
		hasResponseBody: true,
		responseEncoding: 'json',
		riskLevel: 'read',
		description:
			'Query documents through the frappe.client RPC with filtering, field selection, and pagination',
	},
	{
		key: 'documents.update',
		group: 'documents',
		method: 'PUT',
		path: '/api/resource/{doctype}/{name}',
		pathParams: ['doctype', 'name'],
		queryParams: [],
		hasBody: true,
		bodyRequired: true,
		hasResponseBody: true,
		responseEncoding: 'json',
		riskLevel: 'write',
		description:
			'Update a document by name; the body carries the fields to change',
	},
	{
		key: 'documents.delete',
		group: 'documents',
		method: 'DELETE',
		path: '/api/resource/{doctype}/{name}',
		pathParams: ['doctype', 'name'],
		queryParams: [],
		hasBody: false,
		bodyRequired: false,
		hasResponseBody: true,
		responseEncoding: 'json',
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a document of a DocType by its name',
	},
	{
		key: 'documents.setValue',
		group: 'documents',
		method: 'POST',
		path: '/api/method/frappe.client.set_value',
		pathParams: [],
		queryParams: [],
		hasBody: true,
		bodyRequired: true,
		hasResponseBody: true,
		responseEncoding: 'json',
		riskLevel: 'write',
		description:
			'Set one field value on a document without loading or rewriting the whole document',
	},
	{
		key: 'documents.getValue',
		group: 'documents',
		method: 'GET',
		path: '/api/method/frappe.client.get_value',
		pathParams: [],
		queryParams: ['doctype', 'fieldname', 'filters'],
		hasBody: false,
		bodyRequired: false,
		hasResponseBody: true,
		responseEncoding: 'json',
		riskLevel: 'read',
		description:
			'Read specific field values from documents matching filters without loading the whole document',
	},
	{
		key: 'documents.getCount',
		group: 'documents',
		method: 'GET',
		path: '/api/method/frappe.client.get_count',
		pathParams: [],
		queryParams: ['doctype', 'filters'],
		hasBody: false,
		bodyRequired: false,
		hasResponseBody: true,
		responseEncoding: 'json',
		riskLevel: 'read',
		description: 'Count the documents of a DocType matching optional filters',
	},
	{
		key: 'documents.renameDoc',
		group: 'documents',
		method: 'POST',
		path: '/api/method/frappe.client.rename_doc',
		pathParams: [],
		queryParams: [],
		hasBody: true,
		bodyRequired: true,
		hasResponseBody: true,
		responseEncoding: 'json',
		riskLevel: 'write',
		description:
			'Rename a document by changing its primary identifier, optionally merging into an existing name',
	},
	{
		key: 'documents.searchLink',
		group: 'documents',
		method: 'GET',
		path: '/api/method/frappe.desk.search.search_link',
		pathParams: [],
		queryParams: ['doctype', 'txt'],
		hasBody: false,
		bodyRequired: false,
		hasResponseBody: true,
		responseEncoding: 'json',
		riskLevel: 'read',
		description:
			'Search documents of a DocType for Link-field autocomplete suggestions by name or text',
	},
	{
		key: 'doctypes.list',
		group: 'doctypes',
		method: 'GET',
		path: '/api/resource/DocType',
		pathParams: [],
		queryParams: ['filters', 'limit_start', 'limit_page_length'],
		hasBody: false,
		bodyRequired: false,
		hasResponseBody: true,
		responseEncoding: 'json',
		riskLevel: 'read',
		description:
			'List the DocTypes available on the instance with optional filtering and pagination',
	},
	{
		key: 'doctypes.getMeta',
		group: 'doctypes',
		method: 'GET',
		path: '/api/method/frappe.desk.form.load.getdoctype',
		pathParams: [],
		queryParams: ['doctype', 'with_parent'],
		hasBody: false,
		bodyRequired: false,
		hasResponseBody: true,
		responseEncoding: 'json',
		riskLevel: 'read',
		description:
			'Read the complete metadata of a DocType: field definitions, types, permissions, and configuration',
	},
	{
		key: 'system.getLoggedUser',
		group: 'system',
		method: 'GET',
		path: '/api/method/frappe.auth.get_logged_user',
		pathParams: [],
		queryParams: [],
		hasBody: false,
		bodyRequired: false,
		hasResponseBody: true,
		responseEncoding: 'json',
		riskLevel: 'read',
		description: 'Get the user account the token authenticates as',
	},
	{
		key: 'system.ping',
		group: 'system',
		method: 'GET',
		path: '/api/method/ping',
		pathParams: [],
		queryParams: [],
		hasBody: false,
		bodyRequired: false,
		hasResponseBody: true,
		responseEncoding: 'json',
		riskLevel: 'read',
		description: 'Check that the site answers authenticated API requests',
	},
	{
		key: 'system.getFrameworkVersion',
		group: 'system',
		method: 'GET',
		path: '/api/method/frappe.utils.change_log.get_versions',
		pathParams: [],
		queryParams: [],
		hasBody: false,
		bodyRequired: false,
		hasResponseBody: true,
		responseEncoding: 'json',
		riskLevel: 'read',
		description:
			'Get the Frappe framework version and all installed app versions; requires a desk user',
	},
	{
		key: 'system.getAllLanguages',
		group: 'system',
		method: 'GET',
		path: '/api/resource/Language',
		pathParams: [],
		queryParams: ['fields', 'limit_page_length'],
		hasBody: false,
		bodyRequired: false,
		hasResponseBody: true,
		responseEncoding: 'json',
		riskLevel: 'read',
		description:
			'List the languages available on the instance for translation and localization; pass limit_page_length 0 for all',
	},
	{
		key: 'system.getAllRoles',
		group: 'system',
		method: 'GET',
		path: '/api/resource/Role',
		pathParams: [],
		queryParams: ['fields', 'filters', 'limit_start', 'limit_page_length'],
		hasBody: false,
		bodyRequired: false,
		hasResponseBody: true,
		responseEncoding: 'json',
		riskLevel: 'read',
		description: 'List the roles defined on the instance',
	},
	{
		key: 'system.getUserRoles',
		group: 'system',
		method: 'GET',
		path: '/api/resource/Has Role',
		pathParams: [],
		queryParams: ['fields', 'filters', 'limit_start', 'limit_page_length'],
		hasBody: false,
		bodyRequired: false,
		hasResponseBody: true,
		responseEncoding: 'json',
		riskLevel: 'read',
		description:
			'List role assignments (the Has Role child records) with optional user and role filters',
	},
] as const satisfies readonly ErpnextOperationDefinition[];

export type ErpnextOperationKey = (typeof ERPNEXT_OPERATIONS)[number]['key'];

export function getErpnextOperation(
	key: ErpnextOperationKey,
): ErpnextOperationDefinition {
	const operation = ERPNEXT_OPERATIONS.find((entry) => entry.key === key);
	if (!operation) {
		throw new Error(`Unknown ERPNext operation: ${key}`);
	}
	return operation;
}
