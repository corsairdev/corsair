import {
	create as contactsCreate,
	deleteContact as contactsDelete,
	get as contactsGet,
	list as contactsList,
	update as contactsUpdate,
} from './contacts';
import {
	deleteDomain,
	create as domainsCreate,
	get as domainsGet,
	list as domainsList,
	verify as domainsVerify,
} from './domains';
import {
	batch as emailsBatch,
	cancel as emailsCancel,
	get as emailsGet,
	list as emailsList,
	send as emailsSend,
} from './emails';

export const Emails = {
	send: emailsSend,
	get: emailsGet,
	list: emailsList,
	batch: emailsBatch,
	cancel: emailsCancel,
};

export const Domains = {
	create: domainsCreate,
	get: domainsGet,
	list: domainsList,
	delete: deleteDomain,
	verify: domainsVerify,
};

export const Contacts = {
	create: contactsCreate,
	get: contactsGet,
	list: contactsList,
	update: contactsUpdate,
	delete: contactsDelete,
};

export * from './types';
