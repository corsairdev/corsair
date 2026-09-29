import * as ContactsModule from './contacts';
import * as ListsModule from './lists';
import * as MessagesModule from './messages';
import * as ReportsModule from './reports';
import * as SignupModule from './signup';
import * as WebformsModule from './webforms';

export const Lists = {
	getLists: ListsModule.getLists,
	updateList: ListsModule.updateList,
	deleteList: ListsModule.deleteList,
};

export const Contacts = {
	getContacts: ContactsModule.getContacts,
	getContact: ContactsModule.getContact,
	createContact: ContactsModule.createContact,
	deleteContact: ContactsModule.deleteContact,
	unsubscribeContact: ContactsModule.unsubscribeContact,
};

export const Messages = {
	getMessages: MessagesModule.getMessages,
	getMessageStatistics: MessagesModule.getMessageStatistics,
};

export const Reports = {
	getReports: ReportsModule.getReports,
};

export const Webforms = {
	getWebforms: WebformsModule.getWebforms,
	getWebform: WebformsModule.getWebform,
	deleteWebform: WebformsModule.deleteWebform,
};

export const Signup = {
	signup: SignupModule.signup,
};

export * from './types';
