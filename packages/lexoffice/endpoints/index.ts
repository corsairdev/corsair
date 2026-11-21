import * as contacts from './contacts';
import * as creditNotes from './credit-notes';
import * as downPaymentInvoices from './down-payment-invoices';
import * as files from './files';
import * as invoices from './invoices';
import * as payments from './payments';
import * as postingCategories from './posting-categories';
import * as profile from './profile';
import * as voucherlist from './voucherlist';
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
	download: invoices.download,
};

export const Vouchers = {
	list: vouchers.list,
	get: vouchers.get,
	create: vouchers.create,
	update: vouchers.update,
	attachFile: vouchers.attachFile,
};

export const Profile = {
	get: profile.get,
};

export const CreditNotes = {
	list: creditNotes.list,
	get: creditNotes.get,
	create: creditNotes.create,
	render: creditNotes.render,
	download: creditNotes.download,
};

export const Voucherlist = { list: voucherlist.list };

export const DownPaymentInvoices = {
	get: downPaymentInvoices.get,
	download: downPaymentInvoices.download,
};

export const Payments = { get: payments.get };

export const PostingCategories = { list: postingCategories.list };

export const Files = { upload: files.upload, download: files.download };

export * from './types';
