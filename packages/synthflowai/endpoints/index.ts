import * as Actions from './actions';
import * as Assistants from './assistants';
import * as Calls from './calls';
import * as Contacts from './contacts';
import * as KnowledgeBases from './knowledge-bases';
import * as MemoryStores from './memory-stores';
import * as PhoneBooks from './phone-books';
import * as Voices from './voices';

export const AssistantsEndpoints = {
	create: Assistants.create,
	list: Assistants.list,
	get: Assistants.get,
	update: Assistants.update,
	delete: Assistants.deleteAssistant,
};

export const CallsEndpoints = {
	create: Calls.create,
	list: Calls.list,
	get: Calls.get,
};

export const ContactsEndpoints = {
	create: Contacts.create,
	list: Contacts.list,
	get: Contacts.get,
	update: Contacts.update,
	delete: Contacts.deleteContact,
};

export const KnowledgeBasesEndpoints = {
	create: KnowledgeBases.create,
	get: KnowledgeBases.get,
	update: KnowledgeBases.update,
	delete: KnowledgeBases.deleteKnowledgeBase,
	attach: KnowledgeBases.attach,
	detach: KnowledgeBases.detach,
};

export const MemoryStoresEndpoints = {
	create: MemoryStores.create,
	get: MemoryStores.get,
	list: MemoryStores.list,
	update: MemoryStores.update,
	delete: MemoryStores.deleteMemoryStore,
	attachToAgent: MemoryStores.attachToAgent,
	detachFromAgent: MemoryStores.detachFromAgent,
};

export const PhoneBooksEndpoints = {
	create: PhoneBooks.create,
	list: PhoneBooks.list,
	delete: PhoneBooks.deletePhoneBook,
};

export const ActionsEndpoints = {
	create: Actions.create,
	list: Actions.list,
	get: Actions.get,
	update: Actions.update,
	delete: Actions.deleteAction,
	attach: Actions.attach,
	detach: Actions.detach,
};

export const VoicesEndpoints = {
	list: Voices.list,
};

export * from './types';
