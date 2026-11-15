import { endpoints as analyticsEndpoints } from './analytics';
import { endpoints as contactBooksEndpoints } from './contact-books';
import { endpoints as contactGroupsEndpoints } from './contact-groups';
import { endpoints as contactsEndpoints } from './contacts';
import { endpoints as conversationsEndpoints } from './conversations';
import { endpoints as draftsEndpoints } from './drafts';
import { endpoints as hooksEndpoints } from './hooks';
import { endpoints as messagesEndpoints } from './messages';
import { endpoints as organizationsEndpoints } from './organizations';
import { endpoints as postsEndpoints } from './posts';
import { endpoints as responsesEndpoints } from './responses';
import { endpoints as sharedLabelsEndpoints } from './shared-labels';
import { endpoints as tasksEndpoints } from './tasks';
import { endpoints as teamsEndpoints } from './teams';
import {
	MissiveEndpointInputSchemas,
	MissiveEndpointOutputSchemas,
} from './types';
import { endpoints as usersEndpoints } from './users';

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
	sharedLabels: sharedLabelsEndpoints,
	teams: teamsEndpoints,
	users: usersEndpoints,
	tasks: tasksEndpoints,
	hooks: hooksEndpoints,
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
			'List or search the contacts of a contact book, ordered by last name unless order is last_modified',
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
			'Create an email, SMS, WhatsApp, or live chat draft in a new or existing conversation; send true delivers it to the real recipients at once and send_at schedules it, and a delivered message cannot be recalled',
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
			'Create a post in a new or existing conversation to inject content and close, reopen, assign, or label the conversation with a visible trace; every teammate with access sees the post and gets its notification',
	},
	'posts.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a post from its conversation',
	},
	'sharedLabels.create': {
		riskLevel: 'write',
		description: 'Create one or more shared labels in an organization',
	},
	'sharedLabels.update': {
		riskLevel: 'write',
		description:
			'Update one or more shared labels; visibility and sharing are admin-only fields',
	},
	'sharedLabels.list': {
		riskLevel: 'read',
		description:
			'List shared labels in organizations the authenticated user has access to',
	},
	'teams.list': {
		riskLevel: 'read',
		description:
			'List teams in organizations the authenticated user has access to',
	},
	'teams.create': {
		riskLevel: 'write',
		description:
			'Create a team in an organization; the token owner must be an admin or owner',
	},
	'teams.update': {
		riskLevel: 'write',
		description:
			'Update one or more teams; the token owner must be an admin or owner',
	},
	'users.list': {
		riskLevel: 'read',
		description:
			'List users in organizations the authenticated user is part of; user status is not exposed by the API',
	},
	'tasks.list': {
		riskLevel: 'read',
		description:
			'List tasks the token owner has access to, filtered by organization, team, assignee, state, type, or due window',
	},
	'tasks.get': {
		riskLevel: 'read',
		description: 'Fetch a task with full assignee and team details by id',
	},
	'tasks.create': {
		riskLevel: 'write',
		description:
			'Create a standalone task, tasked conversation, or conversation subtask',
	},
	'tasks.update': {
		riskLevel: 'write',
		description:
			'Update a task title, description, state, assignees, team, or due date',
	},
	'hooks.create': {
		riskLevel: 'write',
		description:
			'Create a webhook subscription for incoming-message or new-comment events, backed by a Missive rule',
	},
	'hooks.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a webhook subscription and its backing rule',
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
	'sharedLabels.create': {
		input: MissiveEndpointInputSchemas['sharedLabels.create'],
		output: MissiveEndpointOutputSchemas['sharedLabels.create'],
	},
	'sharedLabels.update': {
		input: MissiveEndpointInputSchemas['sharedLabels.update'],
		output: MissiveEndpointOutputSchemas['sharedLabels.update'],
	},
	'sharedLabels.list': {
		input: MissiveEndpointInputSchemas['sharedLabels.list'],
		output: MissiveEndpointOutputSchemas['sharedLabels.list'],
	},
	'teams.list': {
		input: MissiveEndpointInputSchemas['teams.list'],
		output: MissiveEndpointOutputSchemas['teams.list'],
	},
	'teams.create': {
		input: MissiveEndpointInputSchemas['teams.create'],
		output: MissiveEndpointOutputSchemas['teams.create'],
	},
	'teams.update': {
		input: MissiveEndpointInputSchemas['teams.update'],
		output: MissiveEndpointOutputSchemas['teams.update'],
	},
	'users.list': {
		input: MissiveEndpointInputSchemas['users.list'],
		output: MissiveEndpointOutputSchemas['users.list'],
	},
	'tasks.list': {
		input: MissiveEndpointInputSchemas['tasks.list'],
		output: MissiveEndpointOutputSchemas['tasks.list'],
	},
	'tasks.get': {
		input: MissiveEndpointInputSchemas['tasks.get'],
		output: MissiveEndpointOutputSchemas['tasks.get'],
	},
	'tasks.create': {
		input: MissiveEndpointInputSchemas['tasks.create'],
		output: MissiveEndpointOutputSchemas['tasks.create'],
	},
	'tasks.update': {
		input: MissiveEndpointInputSchemas['tasks.update'],
		output: MissiveEndpointOutputSchemas['tasks.update'],
	},
	'hooks.create': {
		input: MissiveEndpointInputSchemas['hooks.create'],
		output: MissiveEndpointOutputSchemas['hooks.create'],
	},
	'hooks.delete': {
		input: MissiveEndpointInputSchemas['hooks.delete'],
		output: MissiveEndpointOutputSchemas['hooks.delete'],
	},
} as const;

export * from './types';
