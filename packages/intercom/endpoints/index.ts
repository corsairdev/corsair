import * as AdminsFns from './admins';
import * as ArticlesFns from './articles';
import * as CollectionsFns from './collections';
import * as CompaniesFns from './companies';
import * as ContactsFns from './contacts';
import * as ConversationsFns from './conversations';
import * as HelpCentersFns from './helpCenters';

export const Contacts = {
	get: ContactsFns.get,
	list: ContactsFns.list,
	update: ContactsFns.update,
	delete: ContactsFns.deleteContact,
	addTag: ContactsFns.addTag,
	removeTag: ContactsFns.removeTag,
	listTags: ContactsFns.listTags,
	addSubscription: ContactsFns.addSubscription,
	removeSubscription: ContactsFns.removeSubscription,
	listSubscriptions: ContactsFns.listSubscriptions,
	attachToCompany: ContactsFns.attachToCompany,
	detachFromCompany: ContactsFns.detachFromCompany,
	listAttachedCompanies: ContactsFns.listAttachedCompanies,
	listAttachedSegments: ContactsFns.listAttachedSegments,
	createNote: ContactsFns.createNote,
	listNotes: ContactsFns.listNotes,
	merge: ContactsFns.merge,
};

export const Conversations = {
	get: ConversationsFns.get,
	list: ConversationsFns.list,
	create: ConversationsFns.create,
	search: ConversationsFns.search,
	assign: ConversationsFns.assign,
	close: ConversationsFns.close,
	reopen: ConversationsFns.reopen,
	reply: ConversationsFns.reply,
};

export const Companies = {
	createOrUpdate: CompaniesFns.createOrUpdate,
	get: CompaniesFns.get,
	list: CompaniesFns.list,
	scroll: CompaniesFns.scroll,
	delete: CompaniesFns.deleteCompany,
	retrieve: CompaniesFns.retrieve,
	listAttachedContacts: CompaniesFns.listAttachedContacts,
	listAttachedSegments: CompaniesFns.listAttachedSegments,
};

export const Articles = {
	get: ArticlesFns.get,
	list: ArticlesFns.list,
	create: ArticlesFns.create,
	update: ArticlesFns.update,
	delete: ArticlesFns.deleteArticle,
	search: ArticlesFns.search,
};

export const Collections = {
	get: CollectionsFns.get,
	list: CollectionsFns.list,
	create: CollectionsFns.create,
	update: CollectionsFns.update,
	delete: CollectionsFns.deleteCollection,
};

export const Admins = {
	identify: AdminsFns.identify,
	list: AdminsFns.list,
	get: AdminsFns.get,
	listActivityLogs: AdminsFns.listActivityLogs,
	setAway: AdminsFns.setAway,
};

export const HelpCenters = {
	list: HelpCentersFns.list,
	get: HelpCentersFns.get,
};

export * from './types';
