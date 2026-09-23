import * as Contacts from './contacts';
import * as Deadlines from './deadlines';
import * as Documents from './documents';
import * as Identity from './identity';
import * as Notes from './notes';
import * as Projects from './projects';
import * as Tasks from './tasks';
import * as Webhooks from './webhooks';

export const ProjectsEndpoints = {
	list: Projects.list,
	get: Projects.get,
	create: Projects.create,
	update: Projects.update,
};

export const ContactsEndpoints = {
	list: Contacts.list,
	get: Contacts.get,
	create: Contacts.create,
	attach: Contacts.attach,
};

export const DocumentsEndpoints = {
	list: Documents.list,
	get: Documents.get,
	upload: Documents.upload,
};

export const NotesEndpoints = {
	list: Notes.list,
	create: Notes.create,
	update: Notes.update,
};

export const DeadlinesEndpoints = {
	list: Deadlines.list,
	create: Deadlines.create,
};

export const TasksEndpoints = {
	list: Tasks.list,
	create: Tasks.create,
	update: Tasks.update,
};

export const WebhooksEndpoints = {
	list: Webhooks.list,
	create: Webhooks.create,
	delete: Webhooks.del,
};

export const IdentityEndpoints = {
	getAccessToken: Identity.getAccessToken,
	getUserOrgsWithToken: Identity.getUserOrgsWithToken,
};

export * from './types';
