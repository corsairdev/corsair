import type { EndpointRiskLevel } from 'corsair/core';

export type MissiveMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

export type MissiveOperationDefinition = {
	key: string;
	group: string;
	method: MissiveMethod;
	path: string;
	pathParams: readonly string[];
	// Batch routes take comma-separated ids in one path segment
	// (`/contacts/:id1,:id2`): the input field is an array of ids and the
	// factory encodes each id and joins them with commas.
	joinIds?: boolean;
	queryParams: readonly string[];
	hasBody: boolean;
	bodyRequired: boolean;
	// Missive wraps write payloads in the resource's plural key
	// (`{"reports": {...}}`); when set, the factory wraps the validated body.
	bodyWrapper?: string;
	hasResponseBody: boolean;
	responseEncoding: 'json';
	riskLevel: EndpointRiskLevel;
	irreversible?: boolean;
	description: string;
};

// Reconciled against the current Missive REST reference
// (https://missiveapp.com/docs/developers/rest-api/endpoints). The API has no
// deprecated routes; all 42 current operations ship across three parts, with
// part one covering analytics, contacts, contact books, contact groups, and
// conversations.
export const MISSIVE_OPERATIONS = [
	{
		key: 'analytics.createReport',
		group: 'analytics',
		method: 'POST',
		path: '/analytics/reports',
		pathParams: [],
		queryParams: [],
		hasBody: true,
		bodyRequired: true,
		bodyWrapper: 'reports',
		hasResponseBody: true,
		responseEncoding: 'json',
		riskLevel: 'write',
		description:
			'Queue an analytics report for a period and optional team, user, label, and account filters, and get the report id to poll',
	},
	{
		key: 'analytics.getReport',
		group: 'analytics',
		method: 'GET',
		path: '/analytics/reports/{id}',
		pathParams: ['id'],
		queryParams: [],
		hasBody: false,
		bodyRequired: false,
		hasResponseBody: true,
		responseEncoding: 'json',
		riskLevel: 'read',
		description:
			'Fetch a queued analytics report by id; an empty 404 means it is still generating or already expired',
	},
	{
		key: 'contacts.create',
		group: 'contacts',
		method: 'POST',
		path: '/contacts',
		pathParams: [],
		queryParams: [],
		hasBody: true,
		bodyRequired: true,
		bodyWrapper: 'contacts',
		hasResponseBody: true,
		responseEncoding: 'json',
		riskLevel: 'write',
		description: 'Create one or more contacts in a contact book',
	},
	{
		key: 'contacts.update',
		group: 'contacts',
		method: 'PATCH',
		path: '/contacts/{ids}',
		pathParams: ['ids'],
		joinIds: true,
		queryParams: [],
		hasBody: true,
		bodyRequired: true,
		bodyWrapper: 'contacts',
		hasResponseBody: true,
		responseEncoding: 'json',
		riskLevel: 'write',
		description:
			'Update one or more contacts; infos and memberships replace the current ones when passed',
	},
	{
		key: 'contacts.list',
		group: 'contacts',
		method: 'GET',
		path: '/contacts',
		pathParams: [],
		queryParams: [
			'contact_book',
			'order',
			'limit',
			'offset',
			'modified_since',
			'include_deleted',
			'search',
		],
		hasBody: false,
		bodyRequired: false,
		hasResponseBody: true,
		responseEncoding: 'json',
		riskLevel: 'read',
		description:
			'List or search the contacts of a contact book, newest modifications first',
	},
	{
		key: 'contacts.get',
		group: 'contacts',
		method: 'GET',
		path: '/contacts/{id}',
		pathParams: ['id'],
		queryParams: [],
		hasBody: false,
		bodyRequired: false,
		hasResponseBody: true,
		responseEncoding: 'json',
		riskLevel: 'read',
		description: 'Fetch a contact by id; deleted contacts answer 404',
	},
	{
		key: 'contactBooks.list',
		group: 'contactBooks',
		method: 'GET',
		path: '/contact_books',
		pathParams: [],
		queryParams: [],
		hasBody: false,
		bodyRequired: false,
		hasResponseBody: true,
		responseEncoding: 'json',
		riskLevel: 'read',
		description:
			'List contact books the authenticated user has access to; a book id is required to create contacts',
	},
	{
		key: 'contactGroups.list',
		group: 'contactGroups',
		method: 'GET',
		path: '/contact_groups',
		pathParams: [],
		queryParams: ['contact_book', 'kind', 'limit', 'offset'],
		hasBody: false,
		bodyRequired: false,
		hasResponseBody: true,
		responseEncoding: 'json',
		riskLevel: 'read',
		description: 'List the groups or organizations linked to a contact book',
	},
	{
		key: 'conversations.list',
		group: 'conversations',
		method: 'GET',
		path: '/conversations',
		pathParams: [],
		queryParams: [
			'limit',
			'until',
			'inbox',
			'all',
			'assigned',
			'closed',
			'snoozed',
			'flagged',
			'trashed',
			'junked',
			'drafts',
			'shared_label',
			'team_inbox',
			'team_closed',
			'team_all',
			'organization',
			'email',
			'domain',
			'contact_organization',
		],
		hasBody: false,
		bodyRequired: false,
		hasResponseBody: true,
		responseEncoding: 'json',
		riskLevel: 'read',
		description:
			'List conversations of one mailbox, shared label, or team, newest activity first',
	},
	{
		key: 'conversations.get',
		group: 'conversations',
		method: 'GET',
		path: '/conversations/{id}',
		pathParams: ['id'],
		queryParams: [],
		hasBody: false,
		bodyRequired: false,
		hasResponseBody: true,
		responseEncoding: 'json',
		riskLevel: 'read',
		description:
			'Fetch a conversation by id; a merged old id answers with the current conversation',
	},
	{
		key: 'conversations.update',
		group: 'conversations',
		method: 'PATCH',
		path: '/conversations/{ids}',
		pathParams: ['ids'],
		joinIds: true,
		queryParams: [],
		hasBody: true,
		bodyRequired: true,
		bodyWrapper: 'conversations',
		hasResponseBody: true,
		responseEncoding: 'json',
		riskLevel: 'write',
		description:
			'Silently close, reopen, move, assign, label, recolor, or rename one or more conversations without adding a post',
	},
	{
		key: 'conversations.listMessages',
		group: 'conversations',
		method: 'GET',
		path: '/conversations/{id}/messages',
		pathParams: ['id'],
		queryParams: ['limit', 'until'],
		hasBody: false,
		bodyRequired: false,
		hasResponseBody: true,
		responseEncoding: 'json',
		riskLevel: 'read',
		description:
			'List the messages of a conversation, newest first; drafts are excluded',
	},
	{
		key: 'conversations.listComments',
		group: 'conversations',
		method: 'GET',
		path: '/conversations/{id}/comments',
		pathParams: ['id'],
		queryParams: ['limit', 'until'],
		hasBody: false,
		bodyRequired: false,
		hasResponseBody: true,
		responseEncoding: 'json',
		riskLevel: 'read',
		description: 'List the internal comments of a conversation, newest first',
	},
	{
		key: 'conversations.listDrafts',
		group: 'conversations',
		method: 'GET',
		path: '/conversations/{id}/drafts',
		pathParams: ['id'],
		queryParams: ['limit', 'until'],
		hasBody: false,
		bodyRequired: false,
		hasResponseBody: true,
		responseEncoding: 'json',
		riskLevel: 'read',
		description: 'List the draft messages of a conversation, newest first',
	},
	{
		key: 'conversations.listPosts',
		group: 'conversations',
		method: 'GET',
		path: '/conversations/{id}/posts',
		pathParams: ['id'],
		queryParams: ['limit', 'until'],
		hasBody: false,
		bodyRequired: false,
		hasResponseBody: true,
		responseEncoding: 'json',
		riskLevel: 'read',
		description: 'List the posts of a conversation, newest first',
	},
	{
		key: 'conversations.merge',
		group: 'conversations',
		method: 'POST',
		path: '/conversations/{id}/merge',
		pathParams: ['id'],
		queryParams: [],
		hasBody: true,
		bodyRequired: true,
		hasResponseBody: true,
		responseEncoding: 'json',
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Merge a conversation into a target conversation; the source is marked as replaced',
	},
] as const satisfies readonly MissiveOperationDefinition[];

export type MissiveOperationKey = (typeof MISSIVE_OPERATIONS)[number]['key'];

export function getMissiveOperation(
	key: MissiveOperationKey,
): MissiveOperationDefinition {
	const operation = MISSIVE_OPERATIONS.find((entry) => entry.key === key);
	if (!operation) {
		throw new Error(`Unknown Missive operation: ${key}`);
	}
	return operation;
}
