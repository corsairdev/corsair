import { makeAuthenticatedZohoInventoryRequest } from '../client';
import type { ZohoInventoryContext } from '../index';
import type { RouteSpec } from './call';
import { runZohoInventory } from './call';
import type { ZohoInventoryEndpointInputs } from './types';

function handle(
	event: string,
	spec: RouteSpec,
): (
	ctx: ZohoInventoryContext,
	input: Record<string, unknown>,
) => Promise<Record<string, unknown>> {
	return (ctx, input) => runZohoInventory(ctx, event, input, spec);
}

export const OrganizationsEndpoints = {
	list: handle('zohoinventory.organizations.list', {
		method: 'GET',
		path: '/organizations',
		org: false,
	}),
};

export const ItemsEndpoints = {
	list: handle('zohoinventory.items.list', {
		method: 'GET',
		path: '/items',
		query: ['page', 'per_page', 'search_text'],
	}),
	create: handle('zohoinventory.items.create', {
		method: 'POST',
		path: '/items',
	}),
	deactivate: handle('zohoinventory.items.deactivate', {
		method: 'POST',
		path: '/items/:item_id/inactive',
		params: ['item_id'],
	}),
	delete: handle('zohoinventory.items.delete', {
		method: 'DELETE',
		path: '/items/:item_id',
		params: ['item_id'],
	}),
	deleteImage: handle('zohoinventory.items.deleteImage', {
		method: 'DELETE',
		path: '/items/:item_id/image',
		params: ['item_id'],
	}),
};

export const ItemGroupsEndpoints = {
	list: handle('zohoinventory.itemGroups.list', {
		method: 'GET',
		path: '/itemgroups',
		query: ['page', 'per_page', 'search_text'],
	}),
	create: handle('zohoinventory.itemGroups.create', {
		method: 'POST',
		path: '/itemgroups',
	}),
	deactivate: handle('zohoinventory.itemGroups.deactivate', {
		method: 'POST',
		path: '/itemgroups/:itemgroup_id/inactive',
		params: ['itemgroup_id'],
	}),
	delete: handle('zohoinventory.itemGroups.delete', {
		method: 'DELETE',
		path: '/itemgroups/:itemgroup_id',
		params: ['itemgroup_id'],
	}),
};

export const CompositeItemsEndpoints = {
	delete: handle('zohoinventory.compositeItems.delete', {
		method: 'DELETE',
		path: '/compositeitems/:composite_item_id',
		params: ['composite_item_id'],
	}),
};

export const ContactsEndpoints = {
	list: handle('zohoinventory.contacts.list', {
		method: 'GET',
		path: '/contacts',
		query: ['page', 'per_page', 'search_text', 'contact_type'],
	}),
	create: handle('zohoinventory.contacts.create', {
		method: 'POST',
		path: '/contacts',
	}),
	get: handle('zohoinventory.contacts.get', {
		method: 'GET',
		path: '/contacts/:contact_id',
		params: ['contact_id'],
	}),
	getAddress: handle('zohoinventory.contacts.getAddress', {
		method: 'GET',
		path: '/contacts/:contact_id/address',
		params: ['contact_id'],
	}),
	deactivate: handle('zohoinventory.contacts.deactivate', {
		method: 'POST',
		path: '/contacts/:contact_id/inactive',
		params: ['contact_id'],
	}),
	delete: handle('zohoinventory.contacts.delete', {
		method: 'DELETE',
		path: '/contacts/:contact_id',
		params: ['contact_id'],
	}),
	email: handle('zohoinventory.contacts.email', {
		method: 'POST',
		path: '/contacts/:contact_id/email',
		params: ['contact_id'],
	}),
	emailStatement: handle('zohoinventory.contacts.emailStatement', {
		method: 'POST',
		path: '/contacts/:contact_id/statements/email',
		params: ['contact_id'],
	}),
	createPerson: handle('zohoinventory.contacts.createPerson', {
		method: 'POST',
		path: '/contacts/:contact_id/contactpersons',
		params: ['contact_id'],
	}),
	deletePerson: handle('zohoinventory.contacts.deletePerson', {
		method: 'DELETE',
		path: '/contacts/contactpersons/:contact_person_id',
		params: ['contact_person_id'],
	}),
};

export const CurrenciesEndpoints = {
	list: handle('zohoinventory.currencies.list', {
		method: 'GET',
		path: '/settings/currencies',
	}),
};

export const UsersEndpoints = {
	getCurrent: handle('zohoinventory.users.getCurrent', {
		method: 'GET',
		path: '/users/me',
	}),
};

export const SalesOrdersEndpoints = {
	list: handle('zohoinventory.salesOrders.list', {
		method: 'GET',
		path: '/salesorders',
		query: ['page', 'per_page', 'search_text'],
	}),
	get: handle('zohoinventory.salesOrders.get', {
		method: 'GET',
		path: '/salesorders/:salesorder_id',
		params: ['salesorder_id'],
	}),
	create: handle('zohoinventory.salesOrders.create', {
		method: 'POST',
		path: '/salesorders',
	}),
	delete: handle('zohoinventory.salesOrders.delete', {
		method: 'DELETE',
		path: '/salesorders/:salesorder_id',
		params: ['salesorder_id'],
	}),
	bulkDelete: handle('zohoinventory.salesOrders.bulkDelete', {
		method: 'DELETE',
		path: '/salesorders',
		query: ['salesorder_ids'],
	}),
};

async function bulkEmailInvoices(
	ctx: ZohoInventoryContext,
	input: ZohoInventoryEndpointInputs['invoicesBulkEmail'],
): Promise<Record<string, unknown>> {
	let contactId = input.contact_id;
	if (!contactId) {
		const first = await makeAuthenticatedZohoInventoryRequest<{
			invoice?: { customer_id?: string };
		}>('/invoices/{invoice_id}', ctx, {
			method: 'GET',
			region: ctx.options.region,
			apiDomain: ctx.options.apiDomain,
			query: { organization_id: input.organization_id },
			path: { invoice_id: String(input.invoice_ids[0] ?? '') },
		});
		contactId = first.invoice?.customer_id;
	}
	return runZohoInventory(
		ctx,
		'zohoinventory.invoices.bulkEmail',
		{
			...input,
			contact_id: contactId,
		},
		{
			method: 'POST',
			path: '/invoices/email',
			query: ['invoice_ids', 'contact_id'],
		},
	);
}

export const InvoicesEndpoints = {
	list: handle('zohoinventory.invoices.list', {
		method: 'GET',
		path: '/invoices',
		query: ['page', 'per_page', 'search_text'],
	}),
	create: handle('zohoinventory.invoices.create', {
		method: 'POST',
		path: '/invoices',
	}),
	delete: handle('zohoinventory.invoices.delete', {
		method: 'DELETE',
		path: '/invoices/:invoice_id',
		params: ['invoice_id'],
	}),
	addComment: handle('zohoinventory.invoices.addComment', {
		method: 'POST',
		path: '/invoices/:invoice_id/comments',
		params: ['invoice_id'],
	}),
	deleteComment: handle('zohoinventory.invoices.deleteComment', {
		method: 'DELETE',
		path: '/invoices/:invoice_id/comments/:comment_id',
		params: ['invoice_id', 'comment_id'],
	}),
	addAttachment: handle('zohoinventory.invoices.addAttachment', {
		method: 'POST',
		path: '/invoices/:invoice_id/attachment',
		params: ['invoice_id'],
		form: 'invoice_attachment',
	}),
	deleteAttachment: handle('zohoinventory.invoices.deleteAttachment', {
		method: 'DELETE',
		path: '/invoices/:invoice_id/attachment',
		params: ['invoice_id'],
	}),
	email: handle('zohoinventory.invoices.email', {
		method: 'POST',
		path: '/invoices/:invoice_id/email',
		params: ['invoice_id'],
	}),
	bulkEmail: bulkEmailInvoices,
	bulkExport: handle('zohoinventory.invoices.bulkExport', {
		method: 'GET',
		path: '/invoices/pdf',
		query: ['invoice_ids'],
		binary: true,
	}),
	bulkPrint: handle('zohoinventory.invoices.bulkPrint', {
		method: 'GET',
		path: '/invoices/print',
		query: ['invoice_ids'],
		binary: true,
	}),
	cancelWriteOff: handle('zohoinventory.invoices.cancelWriteOff', {
		method: 'POST',
		path: '/invoices/:invoice_id/writeoff/cancel',
		params: ['invoice_id'],
	}),
	disablePaymentReminder: handle(
		'zohoinventory.invoices.disablePaymentReminder',
		{
			method: 'POST',
			path: '/invoices/:invoice_id/paymentreminder/disable',
			params: ['invoice_id'],
		},
	),
	enablePaymentReminder: handle(
		'zohoinventory.invoices.enablePaymentReminder',
		{
			method: 'POST',
			path: '/invoices/:invoice_id/paymentreminder/enable',
			params: ['invoice_id'],
		},
	),
	listPayments: handle('zohoinventory.invoices.listPayments', {
		method: 'GET',
		path: '/invoices/:invoice_id/payments',
		params: ['invoice_id'],
	}),
};

export const CreditNotesEndpoints = {
	list: handle('zohoinventory.creditNotes.list', {
		method: 'GET',
		path: '/creditnotes',
		query: ['page', 'per_page', 'search_text', 'status', 'customer_id'],
	}),
	get: handle('zohoinventory.creditNotes.get', {
		method: 'GET',
		path: '/creditnotes/:creditnote_id',
		params: ['creditnote_id'],
	}),
	create: handle('zohoinventory.creditNotes.create', {
		method: 'POST',
		path: '/creditnotes',
	}),
	addComment: handle('zohoinventory.creditNotes.addComment', {
		method: 'POST',
		path: '/creditnotes/:creditnote_id/comments',
		params: ['creditnote_id'],
	}),
	email: handle('zohoinventory.creditNotes.email', {
		method: 'POST',
		path: '/creditnotes/:creditnote_id/email',
		params: ['creditnote_id'],
	}),
	getEmailContent: handle('zohoinventory.creditNotes.getEmailContent', {
		method: 'GET',
		path: '/creditnotes/:creditnote_id/email',
		params: ['creditnote_id'],
	}),
	applyCredits: handle('zohoinventory.creditNotes.applyCredits', {
		method: 'POST',
		path: '/creditnotes/:creditnote_id/invoices',
		params: ['creditnote_id'],
	}),
};

export const PackagesEndpoints = {
	create: handle('zohoinventory.packages.create', {
		method: 'POST',
		path: '/packages',
		query: ['salesorder_id'],
	}),
	delete: handle('zohoinventory.packages.delete', {
		method: 'DELETE',
		path: '/packages/:package_id',
		params: ['package_id'],
	}),
	bulkPrint: handle('zohoinventory.packages.bulkPrint', {
		method: 'GET',
		path: '/packages/print',
		query: ['package_ids'],
		binary: true,
	}),
};

export const PurchaseOrdersEndpoints = {
	list: handle('zohoinventory.purchaseOrders.list', {
		method: 'GET',
		path: '/purchaseorders',
		query: ['page', 'per_page', 'search_text'],
	}),
	create: handle('zohoinventory.purchaseOrders.create', {
		method: 'POST',
		path: '/purchaseorders',
	}),
};

export const BillsEndpoints = {
	list: handle('zohoinventory.bills.list', {
		method: 'GET',
		path: '/bills',
		query: ['page', 'per_page', 'search_text'],
	}),
	create: handle('zohoinventory.bills.create', {
		method: 'POST',
		path: '/bills',
	}),
};

export const CustomerPaymentsEndpoints = {
	create: handle('zohoinventory.customerPayments.create', {
		method: 'POST',
		path: '/customerpayments',
	}),
};
