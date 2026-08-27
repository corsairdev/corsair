import * as Agents from './agents';
import * as Calls from './calls';
import * as Contacts from './contacts';
import * as KnowledgeBases from './knowledge-bases';

export const AgentsEndpoints = {
	create: Agents.create,
	list: Agents.list,
};

export const CallsEndpoints = {
	create: Calls.create,
	list: Calls.list,
};

export const ContactsEndpoints = {
	create: Contacts.create,
};

export const KnowledgeBasesEndpoints = {
	attach: KnowledgeBases.attach,
};

export * from './types';
