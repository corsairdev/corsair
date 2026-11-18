import * as contacts from './contacts';
import * as creditNotes from './credit-notes';
import * as invoices from './invoices';
import * as profile from './profile';
import * as vouchers from './vouchers';

export const Contacts = {
	list: contacts.list,
	get: contacts.get,
	create: contacts.create,
	update: contacts.update,
};

export const Invoices = {
	list: invoices.list,
	get: invoices.get,
	create: invoices.create,
	render: invoices.render,
};

export const Vouchers = {
	list: vouchers.list,
	get: vouchers.get,
	create: vouchers.create,
};

export const Profile = {
	get: profile.get,
};

export const CreditNotes = {
	list: creditNotes.list,
	get: creditNotes.get,
};

export * from './types';
