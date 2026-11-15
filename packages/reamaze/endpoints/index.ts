import * as Articles from './articles';
import * as Channels from './channels';
import * as Contacts from './contacts';
import * as Conversations from './conversations';
import * as Identities from './identities';
import * as Incidents from './incidents';
import * as Messages from './messages';
import * as Notes from './notes';
import * as Reports from './reports';
import * as ResponseTemplates from './response-templates';
import * as Satisfaction from './satisfaction';
import * as Staff from './staff';
import * as Systems from './systems';

export const ConversationsEndpoints = {
	list: Conversations.list,
	get: Conversations.get,
	create: Conversations.create,
	update: Conversations.update,
};

export const MessagesEndpoints = {
	list: Messages.list,
	create: Messages.create,
};

export const ContactsEndpoints = {
	list: Contacts.list,
	create: Contacts.create,
	update: Contacts.update,
};

export const IdentitiesEndpoints = {
	list: Identities.list,
	create: Identities.create,
};

export const NotesEndpoints = {
	list: Notes.list,
	create: Notes.create,
	update: Notes.update,
	delete: Notes.remove,
};

export const ChannelsEndpoints = {
	list: Channels.list,
	get: Channels.get,
};

export const ArticlesEndpoints = {
	list: Articles.list,
	get: Articles.get,
	create: Articles.create,
	update: Articles.update,
};

export const ReportsEndpoints = {
	volume: Reports.volume,
	responseTime: Reports.responseTime,
	staff: Reports.staff,
	tags: Reports.tags,
	channelSummary: Reports.channelSummary,
};

export const ResponseTemplatesEndpoints = {
	list: ResponseTemplates.list,
	get: ResponseTemplates.get,
	create: ResponseTemplates.create,
	update: ResponseTemplates.update,
};

export const StaffEndpoints = {
	list: Staff.list,
	create: Staff.create,
};

export const SatisfactionEndpoints = {
	list: Satisfaction.list,
};

export const IncidentsEndpoints = {
	list: Incidents.list,
	get: Incidents.get,
	create: Incidents.create,
	update: Incidents.update,
};

export const SystemsEndpoints = {
	list: Systems.list,
};

export * from './types';
