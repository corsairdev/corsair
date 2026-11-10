import { defineEndpoint } from './factory';

export const contactsCreate = defineEndpoint('contacts.create');
export const contactsDelete = defineEndpoint('contacts.delete');
export const contactsCustomfields = defineEndpoint('contacts.customfields');
export const contactsCustomFieldAttributes = defineEndpoint(
	'contacts.customFieldAttributes',
);
export const contactsListItems = defineEndpoint('contacts.listItems');
export const contactsGet = defineEndpoint('contacts.get');
export const contactsListFields = defineEndpoint('contacts.listFields');
export const contactsUndelete = defineEndpoint('contacts.undelete');
export const contactsUpdate = defineEndpoint('contacts.update');
export const contactsList = defineEndpoint('contacts.list');
export const contactsCreateCustomField = defineEndpoint(
	'contacts.createCustomField',
);

export const endpoints = {
	contacts: {
		create: contactsCreate,
		delete: contactsDelete,
		customfields: contactsCustomfields,
		customFieldAttributes: contactsCustomFieldAttributes,
		listItems: contactsListItems,
		get: contactsGet,
		listFields: contactsListFields,
		undelete: contactsUndelete,
		update: contactsUpdate,
		list: contactsList,
		createCustomField: contactsCreateCustomField,
	},
} as const;
