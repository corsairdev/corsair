import type { z } from 'zod';
import { endpoints as deskEndpoints } from './desk';
import { endpoints as doctypesEndpoints } from './doctypes';
import { endpoints as documentsEndpoints } from './documents';
import { endpoints as erpEndpoints } from './erp';
import { endpoints as filesEndpoints } from './files';
import { endpoints as peopleEndpoints } from './people';
import {
	ErpnextEndpointInputSchemas,
	ErpnextEndpointOutputSchemas,
} from './registry';
import { endpoints as systemEndpoints } from './system';
import { endpoints as timesheetsEndpoints } from './timesheets';
import { endpoints as webhooksEndpoints } from './webhooks';
import { endpoints as workflowEndpoints } from './workflow';

export const erpnextEndpoints = {
	documents: documentsEndpoints,
	doctypes: doctypesEndpoints,
	system: systemEndpoints,
	workflow: workflowEndpoints,
	desk: deskEndpoints,
	webhooks: webhooksEndpoints,
	people: peopleEndpoints,
	timesheets: timesheetsEndpoints,
	erp: erpEndpoints,
	files: filesEndpoints,
} as const;

export const erpnextEndpointMeta = {
	'documents.create': {
		riskLevel: 'write',
		description:
			'Create a document of any DocType from its field values; the response carries the created document',
	},
	'documents.insert': {
		riskLevel: 'write',
		description:
			'Insert a document through the frappe.client RPC, passing the full document object including its doctype field',
	},
	'documents.saveDocument': {
		riskLevel: 'write',
		description:
			'Save an existing document through the frappe.client RPC, passing the complete document object with its changes',
	},
	'documents.saveDocs': {
		riskLevel: 'write',
		description:
			'Save, submit, cancel, or update a document by sending its docstatus and fields through the frappe.client RPC',
	},
	'documents.insertMany': {
		riskLevel: 'write',
		description:
			'Insert multiple documents in one call for efficiency; each item carries its doctype and field values',
	},
	'documents.get': {
		riskLevel: 'read',
		description: 'Read one document of a DocType by its name',
	},
	'documents.getClient': {
		riskLevel: 'read',
		description:
			'Read a single document through the frappe.client RPC by doctype and name',
	},
	'documents.getWithMeta': {
		riskLevel: 'read',
		description:
			'Read a document with its desk metadata: attachments, comments, activity logs, and related information',
	},
	'documents.list': {
		riskLevel: 'read',
		description:
			'List documents of a DocType with field selection, filters, ordering, and pagination',
	},
	'documents.getList': {
		riskLevel: 'read',
		description:
			'Query documents through the frappe.client RPC with filtering, field selection, and pagination',
	},
	'documents.update': {
		riskLevel: 'write',
		description:
			'Update a document by name; the body carries the fields to change',
	},
	'documents.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a document of a DocType by its name',
	},
	'documents.setValue': {
		riskLevel: 'write',
		description:
			'Set one field value on a document without loading or rewriting the whole document',
	},
	'documents.getValue': {
		riskLevel: 'read',
		description:
			'Read specific field values from documents matching filters without loading the whole document',
	},
	'documents.getCount': {
		riskLevel: 'read',
		description: 'Count the documents of a DocType matching optional filters',
	},
	'documents.renameDoc': {
		riskLevel: 'write',
		description:
			'Rename a document by changing its primary identifier, optionally merging into an existing name',
	},
	'documents.searchLink': {
		riskLevel: 'read',
		description:
			'Search documents of a DocType for Link-field autocomplete suggestions by name or text',
	},
	'doctypes.list': {
		riskLevel: 'read',
		description:
			'List the DocTypes available on the instance with optional filtering and pagination',
	},
	'doctypes.getMeta': {
		riskLevel: 'read',
		description:
			'Read the complete metadata of a DocType: field definitions, types, permissions, and configuration',
	},
	'system.getLoggedUser': {
		riskLevel: 'read',
		description: 'Get the user account the token authenticates as',
	},
	'system.ping': {
		riskLevel: 'read',
		description: 'Check that the site answers authenticated API requests',
	},
	'system.getFrameworkVersion': {
		riskLevel: 'read',
		description:
			'Get the Frappe framework version and all installed app versions; requires a desk user',
	},
	'system.getAllLanguages': {
		riskLevel: 'read',
		description:
			'List the languages available on the instance for translation and localization; pass limit_page_length 0 for all',
	},
	'system.getAllRoles': {
		riskLevel: 'read',
		description: 'List the roles defined on the instance',
	},
	'system.getUserRoles': {
		riskLevel: 'read',
		description:
			'List role assignments (the Has Role child records) with optional user and role filters',
	},
	'documents.submit': {
		riskLevel: 'write',
		description:
			'Submit a submittable document, moving it from draft to submitted through the frappe.client RPC',
	},
	'documents.cancel': {
		riskLevel: 'write',
		description:
			'Cancel a submitted document by doctype and name through the frappe.client RPC',
	},
	'workflow.apply': {
		riskLevel: 'write',
		description:
			'Apply a workflow action to a document, transitioning it through its configured workflow states',
	},
	'workflow.getTransitions': {
		riskLevel: 'read',
		description:
			'List the workflow transitions available for a document, optionally scoped to a role',
	},
	'desk.addComment': {
		riskLevel: 'write',
		description:
			'Add a comment to any document; the caller supplies the reference, content, and commenter identity',
	},
	'desk.addTag': {
		riskLevel: 'write',
		description:
			'Add a tag to a document, optionally with a color, for organization and filtering',
	},
	'desk.searchGlobal': {
		riskLevel: 'read',
		description:
			'Search a DocType by text across its searchable fields, with optional custom search method, filters, and result limit',
	},
	'webhooks.list': {
		riskLevel: 'read',
		description: 'List the configured webhook subscriptions on the instance',
	},
	'webhooks.create': {
		riskLevel: 'write',
		description:
			'Create a webhook subscription that fires on a DocType event such as create, update, or submit',
	},
	'people.listEmployees': {
		riskLevel: 'read',
		description: 'List the employees recorded on the instance',
	},
	'people.listProjects': {
		riskLevel: 'read',
		description: 'List the projects recorded on the instance',
	},
	'timesheets.list': {
		riskLevel: 'read',
		description: 'List the timesheets recorded on the instance',
	},
	'timesheets.create': {
		riskLevel: 'write',
		description:
			'Create a timesheet with time log entries for an employee or project',
	},
	'system.getTimezones': {
		riskLevel: 'read',
		description:
			'List all timezone identifiers available for user configuration and scheduling',
	},
	'system.getFiscalYear': {
		riskLevel: 'read',
		description:
			'List the fiscal years configured on the instance for accounting periods',
	},
	'erp.getExchangeRate': {
		riskLevel: 'read',
		description:
			'Get the exchange rate between two currencies on an optional date; Frappe requires the date when the currencies differ',
	},
	'erp.getItemDetails': {
		riskLevel: 'read',
		description:
			'Get the pricing, tax, and stock details ERPNext computes for an item in a selling or buying context',
	},
	'erp.getPartyDetails': {
		riskLevel: 'read',
		description:
			'Get the address, contact, currency, and payment-term details ERPNext attaches to a customer or supplier',
	},
	'erp.getPaymentEntry': {
		riskLevel: 'read',
		description:
			'Get a prefilled payment entry draft for an outstanding sales invoice, purchase invoice, or order',
	},
	'erp.getStockBalance': {
		riskLevel: 'read',
		description:
			'Get the available stock balance of an item in a warehouse as of an optional posting date',
	},
	'erp.makeSalesInvoice': {
		riskLevel: 'write',
		description:
			'Map a sales order into a draft sales invoice, preserving the linked item rows',
	},
	'erp.makeDeliveryNote': {
		riskLevel: 'write',
		description:
			'Map a sales order into a draft delivery note, preserving the linked item rows',
	},
	'erp.makePurchaseOrder': {
		riskLevel: 'write',
		description:
			'Map a sales order or material request into draft purchase orders grouped by supplier',
	},
	'erp.makeStockEntry': {
		riskLevel: 'write',
		description:
			'Create a stock entry for material transfers, receipts, or issues between warehouses',
	},
	'files.downloadPdf': {
		riskLevel: 'read',
		description:
			'Download a document as PDF through a print format; the plugin returns the bytes base64-encoded',
	},
	'files.downloadFile': {
		riskLevel: 'read',
		description:
			'Download a stored file by its URL path; the plugin returns the bytes base64-encoded',
	},
} as const;

// Dotted-key registry the plugin assembly and the runtime schema wrapper
// read; keyed by the public `family.action` operation ids. Derived from the
// aggregated schema maps so the compiler keeps the registry and the tree in
// step through the satisfies gates in index.ts.
export const erpnextEndpointSchemas = Object.fromEntries(
	Object.keys(ErpnextEndpointInputSchemas).map((key) => [
		key,
		{
			input:
				ErpnextEndpointInputSchemas[
					key as keyof typeof ErpnextEndpointInputSchemas
				],
			output:
				ErpnextEndpointOutputSchemas[
					key as keyof typeof ErpnextEndpointOutputSchemas
				],
		},
	]),
) as {
	[K in keyof typeof ErpnextEndpointInputSchemas]: {
		input: (typeof ErpnextEndpointInputSchemas)[K];
		output: (typeof ErpnextEndpointOutputSchemas)[K];
	};
};

// unknown: the runtime wrapper looks schemas up by a dotted path built at
// runtime, so the lookup table is widened to string keys.
export type ErpnextRuntimeSchemas = Record<
	string,
	{ input: z.ZodType; output: z.ZodType } | undefined
>;

export { ErpnextEndpointInputSchemas, ErpnextEndpointOutputSchemas };
export type {
	ErpnextEndpointInputs,
	ErpnextEndpointOutputs,
} from './registry';
export * from './registry';
