import * as Account from './account';
import * as Addressbook from './addressbook';
import * as Automations from './automations';
import * as Billing from './billing';
import * as Campaigns from './campaigns';
import * as ContactsEndpoint from './contacts';
import * as Email from './email';
import * as Fax from './fax';
import * as Geo from './geo';
import * as Messaging from './messaging';
import * as Mms from './mms';
import * as Numbers from './numbers';
import * as Post from './post';
import * as Sms from './sms';
import * as Uploads from './uploads';
import * as Voice from './voice';

export const ContactLists = {
	getAll: ContactsEndpoint.getAllLists,
	create: ContactsEndpoint.createList,
	update: Addressbook.updateContactList,
	delete: Addressbook.deleteContactList,
	get: Addressbook.getContactList,
};

export const Contacts = {
	create: ContactsEndpoint.createContact,
	list: ContactsEndpoint.listContacts,
	get: Addressbook.getContact,
	update: Addressbook.updateContact,
	delete: Addressbook.deleteContact,
	copy: Addressbook.copyContact,
	transfer: Addressbook.transferContact,
	import: Addressbook.importContacts,
	importFields: Addressbook.listImportFields,
	importPreview: Addressbook.previewCsvImport,
	removeOptedOut: Addressbook.removeOptedOutContacts,
	search: Addressbook.searchContactsLists,
	suggestions: Addressbook.getContactSuggestions,
};

export {
	Account,
	Addressbook,
	Automations,
	Billing,
	Campaigns,
	Email,
	Fax,
	Geo,
	Messaging,
	Mms,
	Numbers,
	Post,
	Sms,
	Uploads,
	Voice,
};
