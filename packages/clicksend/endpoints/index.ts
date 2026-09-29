import * as Account from './account';
import * as ContactsEndpoint from './contacts';
import * as Sms from './sms';
import * as Voice from './voice';

export const ContactLists = {
	getAll: ContactsEndpoint.getAllLists,
	create: ContactsEndpoint.createList,
};

export const Contacts = {
	create: ContactsEndpoint.createContact,
	list: ContactsEndpoint.listContacts,
};

export { Account, Sms, Voice };
