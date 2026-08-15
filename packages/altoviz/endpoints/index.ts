import {
	getClassifications,
	getCurrentUser,
	getSettings,
	getUnits,
	getVats,
	testApiKey,
} from './account';
import {
	get as colleaguesGet,
	list as colleaguesList,
	remove as colleaguesRemove,
	update as colleaguesUpdate,
} from './colleagues';
import {
	create as contactsCreate,
	find as contactsFind,
	get as contactsGet,
	list as contactsList,
} from './contacts';
import {
	create as customerFamiliesCreate,
	get as customerFamiliesGet,
	list as customerFamiliesList,
	remove as customerFamiliesRemove,
} from './customer-families';
import {
	create as customersCreate,
	find as customersFind,
	get as customersGet,
	getByInternalId as customersGetByInternalId,
	getContacts as customersGetContacts,
	list as customersList,
	remove as customersRemove,
	update as customersUpdate,
} from './customers';
import {
	create as productFamiliesCreate,
	get as productFamiliesGet,
	list as productFamiliesList,
	remove as productFamiliesRemove,
} from './product-families';
import {
	create as productsCreate,
	find as productsFind,
	findByNumberOrId as productsFindByNumberOrId,
	get as productsGet,
	remove as productsRemove,
} from './products';
import {
	download as purchaseInvoicesDownload,
	upload as purchaseInvoicesUpload,
} from './purchase-invoices';
import {
	create as receiptsCreate,
	find as receiptsFind,
	get as receiptsGet,
	list as receiptsList,
	remove as receiptsRemove,
	update as receiptsUpdate,
} from './receipts';
import {
	create as saleCreditsCreate,
	download as saleCreditsDownload,
	find as saleCreditsFind,
	get as saleCreditsGet,
	list as saleCreditsList,
	remove as saleCreditsRemove,
	update as saleCreditsUpdate,
} from './sale-credits';
import {
	create as saleInvoicesCreate,
	download as saleInvoicesDownload,
	find as saleInvoicesFind,
	get as saleInvoicesGet,
	list as saleInvoicesList,
	remove as saleInvoicesRemove,
} from './sale-invoices';
import {
	find as saleQuotesFind,
	list as saleQuotesList,
	remove as saleQuotesRemove,
} from './sale-quotes';
import {
	get as suppliersGet,
	getContacts as suppliersGetContacts,
	list as suppliersList,
	remove as suppliersRemove,
	update as suppliersUpdate,
} from './suppliers';
import {
	list as webhookSubscriptionsList,
	register as webhookSubscriptionsRegister,
	unregister as webhookSubscriptionsUnregister,
} from './webhook-subscriptions';

export const Customers = {
	create: customersCreate,
	update: customersUpdate,
	delete: customersRemove,
	get: customersGet,
	getByInternalId: customersGetByInternalId,
	find: customersFind,
	list: customersList,
	getContacts: customersGetContacts,
};

export const CustomerFamilies = {
	create: customerFamiliesCreate,
	get: customerFamiliesGet,
	delete: customerFamiliesRemove,
	list: customerFamiliesList,
};

export const Suppliers = {
	get: suppliersGet,
	list: suppliersList,
	update: suppliersUpdate,
	delete: suppliersRemove,
	getContacts: suppliersGetContacts,
};

export const Contacts = {
	create: contactsCreate,
	get: contactsGet,
	find: contactsFind,
	list: contactsList,
};

export const Colleagues = {
	get: colleaguesGet,
	list: colleaguesList,
	update: colleaguesUpdate,
	delete: colleaguesRemove,
};

export const Account = {
	getCurrentUser,
	testApiKey,
	getSettings,
	getUnits,
	getVats,
	getClassifications,
};

export const WebhookSubscriptions = {
	list: webhookSubscriptionsList,
	register: webhookSubscriptionsRegister,
	unregister: webhookSubscriptionsUnregister,
};

export const Products = {
	create: productsCreate,
	delete: productsRemove,
	get: productsGet,
	find: productsFind,
	findByNumberOrId: productsFindByNumberOrId,
};

export const ProductFamilies = {
	create: productFamiliesCreate,
	get: productFamiliesGet,
	delete: productFamiliesRemove,
	list: productFamiliesList,
};

export const SaleInvoices = {
	create: saleInvoicesCreate,
	get: saleInvoicesGet,
	find: saleInvoicesFind,
	list: saleInvoicesList,
	delete: saleInvoicesRemove,
	download: saleInvoicesDownload,
};

export const SaleCredits = {
	create: saleCreditsCreate,
	update: saleCreditsUpdate,
	get: saleCreditsGet,
	find: saleCreditsFind,
	list: saleCreditsList,
	delete: saleCreditsRemove,
	download: saleCreditsDownload,
};

export const SaleQuotes = {
	find: saleQuotesFind,
	list: saleQuotesList,
	delete: saleQuotesRemove,
};

export const Receipts = {
	create: receiptsCreate,
	update: receiptsUpdate,
	get: receiptsGet,
	find: receiptsFind,
	list: receiptsList,
	delete: receiptsRemove,
};

export const PurchaseInvoices = {
	upload: purchaseInvoicesUpload,
	download: purchaseInvoicesDownload,
};

export * from './types';
