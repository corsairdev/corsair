import {
	getBillingUsage,
	getPermissionResources,
	listAccounts,
} from './account';
import {
	create as contactFieldsCreate,
	remove as contactFieldsDelete,
	get as contactFieldsGet,
	list as contactFieldsList,
	update as contactFieldsUpdate,
} from './contact-fields';
import {
	create as contactListsCreate,
	remove as contactListsDelete,
	get as contactListsGet,
	list as contactListsList,
	update as contactListsUpdate,
} from './contact-lists';
import {
	create as contactsCreate,
	remove as contactsDelete,
	get as contactsGet,
	update as contactsUpdate,
	createEvent,
	createExport,
	getExport,
	getImport,
	runImport,
} from './contacts';
import {
	create as emailTemplatesCreate,
	remove as emailTemplatesDelete,
	get as emailTemplatesGet,
	list as emailTemplatesList,
	update as emailTemplatesUpdate,
} from './email-templates';
import {
	clean,
	get as inboxesGet,
	list as inboxesList,
	update as inboxesUpdate,
	markAsRead,
	resetCredentials,
} from './inboxes';
import { getHtml, list as messagesList } from './messages';
import {
	remove as projectsDelete,
	get as projectsGet,
	list as projectsList,
	update as projectsUpdate,
} from './projects';
import {
	create as sendingDomainsCreate,
	remove as sendingDomainsDelete,
	get as sendingDomainsGet,
	list as sendingDomainsList,
} from './sending-domains';
import {
	byCategories,
	byDate,
	byDomains,
	byEsp,
	get as statsGet,
} from './stats';
import { list as suppressionsList } from './suppressions';

export const Account = {
	listAccounts,
	getPermissionResources,
	getBillingUsage,
};

export const Contacts = {
	create: contactsCreate,
	get: contactsGet,
	update: contactsUpdate,
	delete: contactsDelete,
	createEvent,
	createExport,
	getExport,
	import: runImport,
	getImport,
};

export const ContactLists = {
	list: contactListsList,
	create: contactListsCreate,
	get: contactListsGet,
	update: contactListsUpdate,
	delete: contactListsDelete,
};

export const ContactFields = {
	list: contactFieldsList,
	create: contactFieldsCreate,
	get: contactFieldsGet,
	update: contactFieldsUpdate,
	delete: contactFieldsDelete,
};

export const Suppressions = {
	list: suppressionsList,
};

export const EmailTemplates = {
	list: emailTemplatesList,
	create: emailTemplatesCreate,
	get: emailTemplatesGet,
	update: emailTemplatesUpdate,
	delete: emailTemplatesDelete,
};

export const SendingDomains = {
	list: sendingDomainsList,
	create: sendingDomainsCreate,
	get: sendingDomainsGet,
	delete: sendingDomainsDelete,
};

export const Stats = {
	get: statsGet,
	byDate,
	byDomains,
	byCategories,
	byEsp,
};

export const Projects = {
	list: projectsList,
	get: projectsGet,
	update: projectsUpdate,
	delete: projectsDelete,
};

export const Inboxes = {
	list: inboxesList,
	get: inboxesGet,
	update: inboxesUpdate,
	clean,
	markAsRead,
	resetCredentials,
};

export const Messages = {
	list: messagesList,
	getHtml,
};

export * from './types';
