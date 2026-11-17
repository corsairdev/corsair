import * as Collectors from './collectors';
import * as ContactLists from './contact-lists';
import * as Contacts from './contacts';
import * as Folders from './folders';
import * as Messages from './messages';
import * as Pages from './pages';
import * as Questions from './questions';
import * as Recipients from './recipients';
import * as Responses from './responses';
import * as Surveys from './surveys';
import * as Users from './users';
import * as Webhooks from './webhooks';

export const SurveysEndpoints = {
	list: Surveys.list,
	create: Surveys.create,
	get: Surveys.get,
	getDetails: Surveys.getDetails,
	update: Surveys.update,
	replace: Surveys.replace,
	delete: Surveys.remove,
	listCategories: Surveys.listCategories,
	listTemplates: Surveys.listTemplates,
	listLanguages: Surveys.listLanguages,
};

export const PagesEndpoints = {
	list: Pages.list,
	create: Pages.create,
	get: Pages.get,
	update: Pages.update,
	delete: Pages.remove,
};

export const QuestionsEndpoints = {
	list: Questions.list,
	create: Questions.create,
	get: Questions.get,
	update: Questions.update,
	delete: Questions.remove,
};

export const ResponsesEndpoints = {
	list: Responses.list,
	listBulk: Responses.listBulk,
	get: Responses.get,
	getDetails: Responses.getDetails,
	create: Responses.create,
	delete: Responses.remove,
	deleteAll: Responses.removeAll,
};

export const CollectorsEndpoints = {
	list: Collectors.list,
	create: Collectors.create,
	get: Collectors.get,
	update: Collectors.update,
	delete: Collectors.remove,
};

export const MessagesEndpoints = {
	list: Messages.list,
	create: Messages.create,
	get: Messages.get,
	update: Messages.update,
	send: Messages.send,
};

export const RecipientsEndpoints = {
	list: Recipients.list,
	create: Recipients.create,
	bulkCreate: Recipients.bulkCreate,
};

export const ContactListsEndpoints = {
	list: ContactLists.list,
	create: ContactLists.create,
	get: ContactLists.get,
	update: ContactLists.update,
	delete: ContactLists.remove,
	copy: ContactLists.copy,
	merge: ContactLists.merge,
};

export const ContactsEndpoints = {
	list: Contacts.list,
	create: Contacts.create,
	bulkCreate: Contacts.bulkCreate,
	get: Contacts.get,
	update: Contacts.update,
	delete: Contacts.remove,
	listFields: Contacts.listFields,
	updateField: Contacts.updateField,
};

export const WebhooksEndpoints = {
	list: Webhooks.list,
	create: Webhooks.create,
	get: Webhooks.get,
	update: Webhooks.update,
	delete: Webhooks.remove,
};

export const UsersEndpoints = {
	getMe: Users.getMe,
};

export const FoldersEndpoints = {
	list: Folders.list,
	create: Folders.create,
};

export * from './types';
