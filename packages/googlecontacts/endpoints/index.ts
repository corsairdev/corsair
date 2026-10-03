import * as ContactGroups from './contact-groups';
import * as Contacts from './contacts';
import * as OtherContacts from './other-contacts';

export const ContactsEndpoints = {
	list: Contacts.list,
	get: Contacts.get,
	search: Contacts.search,
	create: Contacts.create,
	update: Contacts.update,
	delete: Contacts.deleteContact,
	updatePhoto: Contacts.updatePhoto,
	deletePhoto: Contacts.deletePhoto,
};

export const OtherContactsEndpoints = {
	list: OtherContacts.list,
	search: OtherContacts.search,
	copyToContacts: OtherContacts.copyToContacts,
};

export const ContactGroupsEndpoints = {
	list: ContactGroups.list,
	get: ContactGroups.get,
	create: ContactGroups.create,
	update: ContactGroups.update,
	delete: ContactGroups.deleteGroup,
	modifyMembers: ContactGroups.modifyMembers,
};

export * from './types';
