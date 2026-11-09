import { endpoints as analyticsEndpoints } from './analytics';
import { endpoints as contactBooksEndpoints } from './contact-books';
import { endpoints as contactGroupsEndpoints } from './contact-groups';
import { endpoints as contactsEndpoints } from './contacts';
import { endpoints as conversationsEndpoints } from './conversations';
import { endpoints as draftsEndpoints } from './drafts';
import { endpoints as messagesEndpoints } from './messages';
import { endpoints as organizationsEndpoints } from './organizations';
import { endpoints as postsEndpoints } from './posts';
import { endpoints as responsesEndpoints } from './responses';
import {
	MissiveEndpointInputSchemas,
	MissiveEndpointOutputSchemas,
} from './types';

export const missiveEndpoints = {
	analytics: analyticsEndpoints,
	contacts: contactsEndpoints,
	contactBooks: contactBooksEndpoints,
	contactGroups: contactGroupsEndpoints,
	conversations: conversationsEndpoints,
	drafts: draftsEndpoints,
	messages: messagesEndpoints,
	organizations: organizationsEndpoints,
	responses: responsesEndpoints,
	posts: postsEndpoints,
} as const;

export const missiveEndpointMeta = {
	'analytics.createReport': {
		riskLevel: 'write',
		description:
			'Queue an analytics report for a period and optional team, user, label, and account filters, and get the report id to poll',
	},
	'analytics.getReport': {
		riskLevel: 'read',
		description:
			'Fetch a queued analytics report by id; an empty 404 means it is still generating or already expired',
	},
	'contacts.create': {
		riskLevel: 'write',
		description: 'Create one or more contacts in a contact book',
	},
	'contacts.update': {
		riskLevel: 'write',
		description:
			'Update one or more contacts; infos and memberships replace the current ones when passed',
	},
	'contacts.list': {
		riskLevel: 'read',
		description:
			'List or search the contacts of a contact book, newest modifications first',
	},
	'contacts.get': {
		riskLevel: 'read',
		description: 'Fetch a contact by id; deleted contacts answer 404',
	},
	'contactBooks.list': {
		riskLevel: 'read',
		description:
			'List contact books the authenticated user has access to; a book id is required to create contacts',
	},
	'contactGroups.list': {
		riskLevel: 'read',
		description: 'List the groups or organizations linked to a contact book',
	},
	'conversations.list': {
		riskLevel: 'read',
		description:
			'List conversations of one mailbox, shared label, or team, newest activity first',
	},
	'conversations.get': {
		riskLevel: 'read',
		description:
			'Fetch a conversation by id; a merged old id answers with the current conversation',
	},
	'conversations.update': {
		riskLevel: 'write',
		description:
			'Silently close, reopen, move, assign, label, recolor, or rename one or more conversations without adding a post',
	},
	'conversations.listMessages': {
		riskLevel: 'read',
		description:
			'List the messages of a conversation, newest first; drafts are excluded',
	},
	'conversations.listComments': {
		riskLevel: 'read',
		description: 'List the internal comments of a conversation, newest first',
	},
	'conversations.listDrafts': {
		riskLevel: 'read',
		description: 'List the draft messages of a conversation, newest first',
	},
	'conversations.listPosts': {
		riskLevel: 'read',
		description: 'List the posts of a conversation, newest first',
	},
	'conversations.merge': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Merge a conversation into a target conversation; the source is marked as replaced',
	},
	'drafts.create': {
		riskLevel: 'write',
		description:
			'Create an email, SMS, WhatsApp, or live chat draft in a new or existing conversation; pass send true to send it immediately',
	},
	'drafts.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a draft from its conversation',
	},
	'messages.create': {
		riskLevel: 'write',
		description:
			'Create an incoming message in a custom channel to ingest an external conversation event',
	},
	'messages.get': {
		riskLevel: 'read',
		description:
			'Fetch one or more messages with headers, body, and attachments by message id',
	},
	'messages.list': {
		riskLevel: 'read',
		description:
			'Fetch the messages matching an email Message-ID header, latest first',
	},
	'organizations.list': {
		riskLevel: 'read',
		description: 'List organizations the authenticated user is part of',
	},
	'responses.list': {
		riskLevel: 'read',
		description:
			'List saved responses (canned replies) for the authenticated user',
	},
	'responses.get': {
		riskLevel: 'read',
		description: 'Fetch a saved response by id',
	},
	'responses.create': {
		riskLevel: 'write',
		description: 'Create one or more saved response templates',
	},
	'responses.update': {
		riskLevel: 'write',
		description:
			'Update one or more saved responses; attachments replace the current ones when passed',
	},
	'responses.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete one or more saved response templates',
	},
	'posts.create': {
		riskLevel: 'write',
		description:
			'Create a post in a new or existing conversation to inject content and close, reopen, assign, or label the conversation with a visible trace',
	},
	'posts.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a post from its conversation',
	},
} as const;

export { MissiveEndpointInputSchemas, MissiveEndpointOutputSchemas };

// Dotted-key registry the plugin assembly and the runtime schema wrapper
// read; keyed by the public `family.action` operation ids.
export const missiveEndpointSchemas = {
	'analytics.createReport': {
		input: MissiveEndpointInputSchemas['analytics.createReport'],
		output: MissiveEndpointOutputSchemas['analytics.createReport'],
	},
	'analytics.getReport': {
		input: MissiveEndpointInputSchemas['analytics.getReport'],
		output: MissiveEndpointOutputSchemas['analytics.getReport'],
	},
	'contacts.create': {
		input: MissiveEndpointInputSchemas['contacts.create'],
		output: MissiveEndpointOutputSchemas['contacts.create'],
	},
	'contacts.update': {
		input: MissiveEndpointInputSchemas['contacts.update'],
		output: MissiveEndpointOutputSchemas['contacts.update'],
	},
	'contacts.list': {
		input: MissiveEndpointInputSchemas['contacts.list'],
		output: MissiveEndpointOutputSchemas['contacts.list'],
	},
	'contacts.get': {
		input: MissiveEndpointInputSchemas['contacts.get'],
		output: MissiveEndpointOutputSchemas['contacts.get'],
	},
	'contactBooks.list': {
		input: MissiveEndpointInputSchemas['contactBooks.list'],
		output: MissiveEndpointOutputSchemas['contactBooks.list'],
	},
	'contactGroups.list': {
		input: MissiveEndpointInputSchemas['contactGroups.list'],
		output: MissiveEndpointOutputSchemas['contactGroups.list'],
	},
	'conversations.list': {
		input: MissiveEndpointInputSchemas['conversations.list'],
		output: MissiveEndpointOutputSchemas['conversations.list'],
	},
	'conversations.get': {
		input: MissiveEndpointInputSchemas['conversations.get'],
		output: MissiveEndpointOutputSchemas['conversations.get'],
	},
	'conversations.update': {
		input: MissiveEndpointInputSchemas['conversations.update'],
		output: MissiveEndpointOutputSchemas['conversations.update'],
	},
	'conversations.listMessages': {
		input: MissiveEndpointInputSchemas['conversations.listMessages'],
		output: MissiveEndpointOutputSchemas['conversations.listMessages'],
	},
	'conversations.listComments': {
		input: MissiveEndpointInputSchemas['conversations.listComments'],
		output: MissiveEndpointOutputSchemas['conversations.listComments'],
	},
	'conversations.listDrafts': {
		input: MissiveEndpointInputSchemas['conversations.listDrafts'],
		output: MissiveEndpointOutputSchemas['conversations.listDrafts'],
	},
	'conversations.listPosts': {
		input: MissiveEndpointInputSchemas['conversations.listPosts'],
		output: MissiveEndpointOutputSchemas['conversations.listPosts'],
	},
	'conversations.merge': {
		input: MissiveEndpointInputSchemas['conversations.merge'],
		output: MissiveEndpointOutputSchemas['conversations.merge'],
	},
	'drafts.create': {
		input: MissiveEndpointInputSchemas['drafts.create'],
		output: MissiveEndpointOutputSchemas['drafts.create'],
	},
	'drafts.delete': {
		input: MissiveEndpointInputSchemas['drafts.delete'],
		output: MissiveEndpointOutputSchemas['drafts.delete'],
	},
	'messages.create': {
		input: MissiveEndpointInputSchemas['messages.create'],
		output: MissiveEndpointOutputSchemas['messages.create'],
	},
	'messages.get': {
		input: MissiveEndpointInputSchemas['messages.get'],
		output: MissiveEndpointOutputSchemas['messages.get'],
	},
	'messages.list': {
		input: MissiveEndpointInputSchemas['messages.list'],
		output: MissiveEndpointOutputSchemas['messages.list'],
	},
	'organizations.list': {
		input: MissiveEndpointInputSchemas['organizations.list'],
		output: MissiveEndpointOutputSchemas['organizations.list'],
	},
	'responses.list': {
		input: MissiveEndpointInputSchemas['responses.list'],
		output: MissiveEndpointOutputSchemas['responses.list'],
	},
	'responses.get': {
		input: MissiveEndpointInputSchemas['responses.get'],
		output: MissiveEndpointOutputSchemas['responses.get'],
	},
	'responses.create': {
		input: MissiveEndpointInputSchemas['responses.create'],
		output: MissiveEndpointOutputSchemas['responses.create'],
	},
	'responses.update': {
		input: MissiveEndpointInputSchemas['responses.update'],
		output: MissiveEndpointOutputSchemas['responses.update'],
	},
	'responses.delete': {
		input: MissiveEndpointInputSchemas['responses.delete'],
		output: MissiveEndpointOutputSchemas['responses.delete'],
	},
	'posts.create': {
		input: MissiveEndpointInputSchemas['posts.create'],
		output: MissiveEndpointOutputSchemas['posts.create'],
	},
	'posts.delete': {
		input: MissiveEndpointInputSchemas['posts.delete'],
		output: MissiveEndpointOutputSchemas['posts.delete'],
	},
} as const;

export * from './types';
