import {
	CompaniesService,
	ContactListsService,
	ContactsService,
	DealsService,
	EngagementsService,
	TicketsService,
} from './services';

export const HubSpot = {
	Contacts: {
		get: ContactsService.getContact,
		getMany: ContactsService.getManyContacts,
		createOrUpdate: ContactsService.createOrUpdateContact,
		delete: ContactsService.deleteContact,
		getRecentlyCreated: ContactsService.getRecentlyCreatedContacts,
		getRecentlyUpdated: ContactsService.getRecentlyUpdatedContacts,
		search: ContactsService.searchContacts,
	},

	Companies: {
		get: CompaniesService.getCompany,
		getMany: CompaniesService.getManyCompanies,
		create: CompaniesService.createCompany,
		update: CompaniesService.updateCompany,
		delete: CompaniesService.deleteCompany,
		getRecentlyCreated: CompaniesService.getRecentlyCreatedCompanies,
		getRecentlyUpdated: CompaniesService.getRecentlyUpdatedCompanies,
		searchByDomain: CompaniesService.searchCompanyByDomain,
	},

	Deals: {
		get: DealsService.getDeal,
		getMany: DealsService.getManyDeals,
		create: DealsService.createDeal,
		update: DealsService.updateDeal,
		delete: DealsService.deleteDeal,
		getRecentlyCreated: DealsService.getRecentlyCreatedDeals,
		getRecentlyUpdated: DealsService.getRecentlyUpdatedDeals,
		search: DealsService.searchDeals,
	},

	Tickets: {
		get: TicketsService.getTicket,
		getMany: TicketsService.getManyTickets,
		create: TicketsService.createTicket,
		update: TicketsService.updateTicket,
		delete: TicketsService.deleteTicket,
	},

	Engagements: {
		get: EngagementsService.getEngagement,
		getMany: EngagementsService.getManyEngagements,
		create: EngagementsService.createEngagement,
		delete: EngagementsService.deleteEngagement,
	},

	ContactLists: {
		addContact: ContactListsService.addContactToList,
		removeContact: ContactListsService.removeContactFromList,
	},
};

