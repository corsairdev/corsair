import { defineEndpoint } from './factory';

export const accountsCustomFieldAttributes = defineEndpoint(
	'accounts.customFieldAttributes',
);
export const accountsCreate = defineEndpoint('accounts.create');
export const accountsUndelete = defineEndpoint('accounts.undelete');
export const accountsDelete = defineEndpoint('accounts.delete');
export const accountsCustomfields = defineEndpoint('accounts.customfields');
export const accountsUpdate = defineEndpoint('accounts.update');
export const accountsListFields = defineEndpoint('accounts.listFields');
export const accountsCreateCustomField = defineEndpoint(
	'accounts.createCustomField',
);
export const accountsGet = defineEndpoint('accounts.get');
export const accountsList = defineEndpoint('accounts.list');
export const accountsListItems = defineEndpoint('accounts.listItems');

export const endpoints = {
	accounts: {
		customFieldAttributes: accountsCustomFieldAttributes,
		create: accountsCreate,
		undelete: accountsUndelete,
		delete: accountsDelete,
		customfields: accountsCustomfields,
		update: accountsUpdate,
		listFields: accountsListFields,
		createCustomField: accountsCreateCustomField,
		get: accountsGet,
		list: accountsList,
		listItems: accountsListItems,
	},
} as const;
