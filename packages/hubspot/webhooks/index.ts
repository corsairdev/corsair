import { companyCreated, companyDeleted, companyUpdated } from './companies';
import { contactCreated, contactDeleted, contactUpdated } from './contacts';
import { dealCreated, dealDeleted, dealUpdated } from './deals';
import { ticketCreated, ticketDeleted, ticketUpdated } from './tickets';

export const ContactWebhooks = {
	created: contactCreated,
	updated: contactUpdated,
	deleted: contactDeleted,
};

export const CompanyWebhooks = {
	created: companyCreated,
	updated: companyUpdated,
	deleted: companyDeleted,
};

export const DealWebhooks = {
	created: dealCreated,
	updated: dealUpdated,
	deleted: dealDeleted,
};

export const TicketWebhooks = {
	created: ticketCreated,
	updated: ticketUpdated,
	deleted: ticketDeleted,
};

export * from './types';
