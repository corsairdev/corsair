import {
	add as sequenceContactsAdd,
	bulkRemove as sequenceContactsBulkRemove,
	listExtended as sequenceContactsListExtended,
	remove as sequenceContactsRemove,
} from './sequence-contacts';
import {
	connectGmail as emailAccountsConnectGmail,
	connectOffice365 as emailAccountsConnectOffice365,
	deleteEmailAccount as emailAccountsDelete,
	list as emailAccountsList,
	listDisconnected as emailAccountsListDisconnected,
	update as emailAccountsUpdate,
} from './email-accounts';
import {
	clearStatus as contactsClearStatus,
	create as contactsCreate,
	deleteContact as contactsDelete,
	get as contactsGet,
	getStatus as contactsGetStatus,
	list as contactsList,
	searchByEmail as contactsSearchByEmail,
	setStatus as contactsSetStatus,
	update as contactsUpdate,
} from './contacts';
import { list as contactListsList } from './contact-lists';
import { deleteSchedule as schedulesDelete } from './schedules';
import {
	create as stepsCreate,
	get as stepsGet,
	list as stepsList,
} from './sequence-steps';
import {
	archive as sequencesArchive,
	deleteSequence as sequencesDelete,
	get as sequencesGet,
	list as sequencesList,
	pause as sequencesPause,
	start as sequencesStart,
} from './sequences';
import {
	getCurrent as usersGetCurrent,
	listTeam as usersListTeam,
} from './users';

export const Contacts = {
	create: contactsCreate,
	get: contactsGet,
	update: contactsUpdate,
	delete: contactsDelete,
	list: contactsList,
	searchByEmail: contactsSearchByEmail,
	getStatus: contactsGetStatus,
	setStatus: contactsSetStatus,
	clearStatus: contactsClearStatus,
};

export const Sequences = {
	list: sequencesList,
	get: sequencesGet,
	delete: sequencesDelete,
	start: sequencesStart,
	pause: sequencesPause,
	archive: sequencesArchive,
};

export const Steps = {
	list: stepsList,
	get: stepsGet,
	create: stepsCreate,
};

export const SequenceContacts = {
	add: sequenceContactsAdd,
	remove: sequenceContactsRemove,
	bulkRemove: sequenceContactsBulkRemove,
	listExtended: sequenceContactsListExtended,
};

export const EmailAccounts = {
	list: emailAccountsList,
	listDisconnected: emailAccountsListDisconnected,
	update: emailAccountsUpdate,
	delete: emailAccountsDelete,
	connectGmail: emailAccountsConnectGmail,
	connectOffice365: emailAccountsConnectOffice365,
};

export const Schedules = {
	delete: schedulesDelete,
};

export const Users = {
	getCurrent: usersGetCurrent,
	listTeam: usersListTeam,
};

export const ContactLists = {
	list: contactListsList,
};

export * from './types';
