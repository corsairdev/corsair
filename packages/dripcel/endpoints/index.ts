import * as Catalog from './catalog';
import * as Contacts from './contacts';
import * as Messaging from './messaging';

export const ContactsEndpoints = {
	get: Contacts.get,
	create: Contacts.create,
	upsert: Contacts.upsert,
	delete: Contacts.deleteContact,
	addTags: Contacts.addTags,
	optOut: Contacts.optOut,
};

export const CatalogEndpoints = {
	getBalance: Catalog.getBalance,
	listCampaigns: Catalog.listCampaigns,
	listEmailTemplates: Catalog.listEmailTemplates,
	uploadSales: Catalog.uploadSales,
	listTags: Catalog.listTags,
	deleteTag: Catalog.deleteTag,
};

export const MessagingEndpoints = {
	checkSend: Messaging.checkSend,
	listDeliveries: Messaging.listDeliveries,
	searchReplies: Messaging.searchReplies,
	searchSendLogs: Messaging.searchSendLogs,
	sms: Messaging.sms,
	bulkEmail: Messaging.bulkEmail,
};

export * from './types';
