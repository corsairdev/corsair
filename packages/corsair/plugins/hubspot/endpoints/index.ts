import * as Companies from './companies';
import * as ContactLists from './contact-lists';
import * as Contacts from './contacts';
import * as Deals from './deals';
import * as Engagements from './engagements';
import * as Tickets from './tickets';

export const ContactsEndpoints = {
	get: Contacts.get,
	getMany: Contacts.getMany,
	createOrUpdate: Contacts.createOrUpdate,
	delete: Contacts.deleteContact,
	getRecentlyCreated: Contacts.getRecentlyCreated,
	getRecentlyUpdated: Contacts.getRecentlyUpdated,
	search: Contacts.search,
};

export const CompaniesEndpoints = {
	get: Companies.get,
	getMany: Companies.getMany,
	create: Companies.create,
	update: Companies.update,
	delete: Companies.deleteCompany,
	getRecentlyCreated: Companies.getRecentlyCreated,
	getRecentlyUpdated: Companies.getRecentlyUpdated,
	searchByDomain: Companies.searchByDomain,
};

export const DealsEndpoints = {
	get: Deals.get,
	getMany: Deals.getMany,
	create: Deals.create,
	update: Deals.update,
	delete: Deals.deleteDeal,
	getRecentlyCreated: Deals.getRecentlyCreated,
	getRecentlyUpdated: Deals.getRecentlyUpdated,
	search: Deals.search,
};

export const TicketsEndpoints = {
	get: Tickets.get,
	getMany: Tickets.getMany,
	create: Tickets.create,
	update: Tickets.update,
	delete: Tickets.deleteTicket,
};

export const EngagementsEndpoints = {
	get: Engagements.get,
	getMany: Engagements.getMany,
	create: Engagements.create,
	delete: Engagements.deleteEngagement,
};

export const ContactListsEndpoints = {
	addContact: ContactLists.addContact,
	removeContact: ContactLists.removeContact,
};

export * from './types';
