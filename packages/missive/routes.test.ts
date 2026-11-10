import { createCorsair } from 'corsair/core';
import { MISSIVE_BASE_URL } from './client';
import { missive, missiveEndpointSchemas } from './index';
import type { MissiveOperationKey } from './operations';
import { MISSIVE_OPERATIONS } from './operations';

const TOKEN = 'missive_pat-test-token';

type Handler = (
	// unknown: handlers are walked out of the bound public tree at runtime, so
	// their precise per-operation input/output types cannot be recovered here;
	// each call is schema-validated separately before the handler runs.
	input: unknown,
) => Promise<unknown>;

type CapturedRequest = {
	url: URL;
	method: string;
	headers: Headers;
	// unknown: the captured body is whatever the transport serialized for the
	// operation under test (JSON object, array, or none); assertions compare
	// it structurally rather than by a single type.
	body: unknown;
};

function endpointHandlers(tree: object, prefix = ''): Map<string, Handler> {
	return new Map(
		Object.entries(tree).flatMap(([name, value]) => {
			const key = prefix ? `${prefix}.${name}` : name;
			if (typeof value === 'function') {
				return [[key, value as Handler]];
			}
			if (value && typeof value === 'object') {
				return [...endpointHandlers(value, key)];
			}
			return [];
		}),
	);
}

const corsair = createCorsair({
	plugins: [missive({ key: TOKEN })],
});
// Corsair's database/API result is a union; this assertion selects the API
// branch because the test invokes the public HTTP endpoints only.
const publicApi = (corsair.missive as unknown as { api: object }).api;
const handlers = endpointHandlers(publicApi);

// Spec-derived input fixtures: the minimal valid request each reference-page
// example shows. Written by hand so a mistaken schema can never bend the
// fixture into passing itself.
const INPUT_FIXTURES: Record<MissiveOperationKey, unknown> = {
	'analytics.createReport': {
		body: {
			organization: '0d9bab85-a74f-4ece-9142-0f9b9f36ff92',
			start: 1691812800,
			end: 1692371867,
			time_zone: 'America/Montreal',
		},
	},
	'analytics.getReport': { id: '8441d4a0-a0ad-4f0f-aa9c-1cc881057e42' },
	'contacts.create': {
		body: [
			{
				contact_book: '551b8675-11e9-49c3-aac0-01fb8510d862',
				first_name: 'Philippe',
				last_name: 'Lehoux',
				infos: [
					{
						kind: 'email',
						label: 'home',
						value: 'philippe@missiveapp.com',
					},
				],
			},
		],
	},
	'contacts.update': {
		ids: ['ee31f156-db95-4158-923f-b26450e0dbf7'],
		body: [{ id: 'ee31f156-db95-4158-923f-b26450e0dbf7', last_name: 'Lehoux' }],
	},
	'contacts.list': {
		contact_book: '487bc080-6631-4edc-830e-1d114eef4ab0',
		limit: 50,
		search: 'Lehoux',
	},
	'contacts.get': { id: '5960dcd2-3382-4430-aa70-955a2c62040a' },
	'contactBooks.list': {},
	'contactGroups.list': {
		contact_book: '487bc080-6631-4edc-830e-1d114eef4ab0',
		kind: 'organization',
	},
	'conversations.list': { inbox: true, limit: 25 },
	'conversations.get': {
		id: '6d3c9b1c-7067-4a28-8ea6-ea91340b67cc',
	},
	'conversations.update': {
		ids: ['6d3c9b1c-7067-4a28-8ea6-ea91340b67cc'],
		body: [
			{
				id: '6d3c9b1c-7067-4a28-8ea6-ea91340b67cc',
				subject: 'Refund approved',
				close: true,
			},
		],
	},
	'conversations.listMessages': {
		id: '6d3c9b1c-7067-4a28-8ea6-ea91340b67cc',
		limit: 10,
	},
	'conversations.listComments': {
		id: '6d3c9b1c-7067-4a28-8ea6-ea91340b67cc',
	},
	'conversations.listDrafts': {
		id: '6d3c9b1c-7067-4a28-8ea6-ea91340b67cc',
	},
	'conversations.listPosts': {
		id: '6d3c9b1c-7067-4a28-8ea6-ea91340b67cc',
	},
	'conversations.merge': {
		id: '6d3c9b1c-7067-4a28-8ea6-ea91340b67cc',
		body: { target: '3fa4bcf5-e57e-47a4-9422-de2cce5f802e' },
	},
	'drafts.create': {
		body: {
			send: true,
			subject: 'Hello',
			body: 'World!',
			to_fields: [{ address: 'paul@acme.com' }],
			from_field: { address: 'philippe@missiveapp.com' },
		},
	},
	'drafts.delete': { id: '3fa4bcf5-e57e-47a4-9422-de2cce5f802e' },
	'messages.create': {
		body: {
			account: 'fbf74c47-d0a0-4d77-bf3c-2118025d8102',
			from_field: {
				id: '12345',
				username: '@philippe',
				name: 'Philippe Lehoux',
			},
			to_fields: [{ id: '54321', username: '@missiveapp', name: 'Missive' }],
			body: 'Hello <b>world</b>!',
		},
	},
	'messages.get': { ids: ['3fa4bcf5-e57e-47a4-9422-de2cce5f802e'] },
	'messages.list': { email_message_id: '<0f1ab2d8@missiveapp.com>' },
	'organizations.list': { limit: 50 },
	'responses.list': { organization: '84f876cc-ef7c-41cd-9711-7ab9cf9f26a5' },
	'responses.get': { id: '75ad834a-9bd6-4008-b9e6-fc9fa2e7770b' },
	'responses.create': {
		body: [
			{
				title: 'Welcome email template',
				body: '<p>Welcome to our service!</p>',
				organization: '0d9bab85-a74f-4ece-9142-0f9b9f36ff92',
			},
		],
	},
	'responses.update': {
		ids: ['75ad834a-9bd6-4008-b9e6-fc9fa2e7770b'],
		body: [{ id: '75ad834a-9bd6-4008-b9e6-fc9fa2e7770b', title: 'Updated' }],
	},
	'responses.delete': { ids: ['75ad834a-9bd6-4008-b9e6-fc9fa2e7770b'] },
	'posts.create': {
		body: {
			conversation: '00f78fe9-f11a-4b4e-a502-67e6138d3b0f',
			notification: { title: 'Ticket resolved', body: 'Marked as resolved' },
			username: 'Support System',
			text: 'Ticket #1234 was resolved and marked as complete.',
			close: true,
		},
	},
	'posts.delete': { id: 'ee31f156-db95-4158-923f-b26450e0dbf7' },
	'sharedLabels.create': {
		body: [
			{
				name: 'Heroku',
				organization: '0d9bab85-a74f-4ece-9142-0f9b9f36ff92',
				color: '#430098',
			},
		],
	},
	'sharedLabels.update': {
		ids: ['ee31f156-db95-4158-923f-b26450e0dbf7'],
		body: [
			{ id: 'ee31f156-db95-4158-923f-b26450e0dbf7', name: 'Updated Label' },
		],
	},
	'sharedLabels.list': { organization: '0d9bab85-a74f-4ece-9142-0f9b9f36ff92' },
	'teams.list': { organization: '0d9bab85-a74f-4ece-9142-0f9b9f36ff92' },
	'teams.create': {
		body: [
			{
				name: 'Support',
				organization: '0d9bab85-a74f-4ece-9142-0f9b9f36ff92',
				active_members: ['1ce8117e-ae42-4304-b953-c81656da4bd1'],
			},
		],
	},
	'teams.update': {
		ids: ['d75aecb6-96a2-4b5f-afa6-19d1916052ea'],
		body: [
			{ id: 'd75aecb6-96a2-4b5f-afa6-19d1916052ea', name: 'Customer Support' },
		],
	},
	'users.list': { limit: 50 },
	'tasks.list': {
		organization: '0d9bab85-a74f-4ece-9142-0f9b9f36ff92',
		state: 'todo',
	},
	'tasks.get': { id: '75ad834a-9bd6-4008-b9e6-fc9fa2e7770b' },
	'tasks.create': {
		body: {
			organization: '0d9bab85-a74f-4ece-9142-0f9b9f36ff92',
			title: 'Review pull request',
			team: '0e24f298-965d-4475-9220-b32636a1e2c3',
		},
	},
	'tasks.update': {
		id: '75ad834a-9bd6-4008-b9e6-fc9fa2e7770b',
		body: { state: 'in_progress' },
	},
	'hooks.create': {
		body: {
			type: 'new_comment',
			url: 'https://hooks.example.com/callback',
			organization: '0d9bab85-a74f-4ece-9142-0f9b9f36ff92',
		},
	},
	'hooks.delete': { id: 'd75aecb6-96a2-4b5f-afa6-19d1916052ea' },
};

// Spec-derived response fixtures: the envelope each reference-page example
// returns, trimmed to its documented top-level shape.
const RESPONSE_FIXTURES: Record<MissiveOperationKey, unknown> = {
	'analytics.createReport': {
		reports: { id: '8441d4a0-a0ad-4f0f-aa9c-1cc881057e42' },
	},
	'analytics.getReport': {
		conversations_created: { total: 10 },
	},
	'contacts.create': {
		contacts: [
			{
				id: '5960dcd2-3382-4430-aa70-955a2c62040a',
				first_name: 'Philippe',
				last_name: 'Lehoux',
			},
		],
	},
	'contacts.update': {
		contacts: [
			{ id: 'ee31f156-db95-4158-923f-b26450e0dbf7', last_name: 'Lehoux' },
		],
	},
	'contacts.list': {
		contacts: [{ id: '183382b8-fb70-4a35-bf22-4ebae1450553' }],
	},
	'contacts.get': {
		contacts: [{ id: '5960dcd2-3382-4430-aa70-955a2c62040a' }],
	},
	'contactBooks.list': {
		contact_books: [{ id: '6a012cec-c2e2-4e21-91e3-a36dba6930e7', name: 'HR' }],
	},
	'contactGroups.list': {
		contact_groups: [
			{ id: '6a012cec-c2e2-4e21-91e3-a36dba6930e7', name: 'VIPs' },
		],
	},
	'conversations.list': {
		conversations: [
			{
				id: '6d3c9b1c-7067-4a28-8ea6-ea91340b67cc',
				created_at: 1654544954,
				last_activity_at: 1654544954,
			},
		],
	},
	'conversations.get': {
		conversations: [
			{ id: '6d3c9b1c-7067-4a28-8ea6-ea91340b67cc', created_at: 1654544954 },
		],
	},
	'conversations.update': {
		conversations: [
			{
				id: '6d3c9b1c-7067-4a28-8ea6-ea91340b67cc',
				subject: 'Refund approved',
			},
		],
	},
	'conversations.listMessages': {
		messages: [
			{
				id: '3fa4bcf5-e57e-47a4-9422-de2cce5f802e',
				type: 'email',
				delivered_at: 1563806347,
			},
		],
	},
	'conversations.listComments': {
		comments: [
			{
				id: '3fa4bcf5-e57e-47a4-9422-de2cce5f802e',
				body: 'This is a comment',
				created_at: 1563806347,
			},
		],
	},
	'conversations.listDrafts': {
		drafts: [
			{
				id: '3fa4bcf5-e57e-47a4-9422-de2cce5f802e',
				draft: true,
			},
		],
	},
	'conversations.listPosts': {
		posts: [
			{
				id: 'ee31f156-db95-4158-923f-b26450e0dbf7',
				created_at: 1563806347,
			},
		],
	},
	'conversations.merge': {
		conversations: [
			{
				id: '3fa4bcf5-e57e-47a4-9422-de2cce5f802e',
				created_at: 1654544954,
			},
		],
	},
	// The create-draft and create-message bodies are undocumented; the mock
	// uses the envelope form of the documented tolerant union. Delete routes
	// answer empty bodies.
	'drafts.create': {
		drafts: { id: '3fa4bcf5-e57e-47a4-9422-de2cce5f802e', draft: true },
	},
	'drafts.delete': undefined,
	'messages.create': {
		messages: { id: '3fa4bcf5-e57e-47a4-9422-de2cce5f802e' },
	},
	'messages.get': {
		messages: {
			id: '3fa4bcf5-e57e-47a4-9422-de2cce5f802e',
			type: 'email',
			delivered_at: 1563806347,
		},
	},
	'messages.list': {
		messages: [
			{
				id: '3fa4bcf5-e57e-47a4-9422-de2cce5f802e',
				type: 'email',
				delivered_at: 1563806347,
			},
		],
	},
	'organizations.list': {
		organizations: [
			{ id: '0d9bab85-a74f-4ece-9142-0f9b9f36ff92', name: 'Conference Badge' },
		],
	},
	'responses.list': {
		responses: [
			{ id: '75ad834a-9bd6-4008-b9e6-fc9fa2e7770b', title: 'A test response' },
		],
	},
	'responses.get': {
		responses: [
			{ id: '75ad834a-9bd6-4008-b9e6-fc9fa2e7770b', title: 'A test response' },
		],
	},
	'responses.create': {
		responses: [
			{
				id: '75ad834a-9bd6-4008-b9e6-fc9fa2e7770b',
				title: 'Welcome email template',
			},
		],
	},
	'responses.update': {
		responses: [
			{ id: '75ad834a-9bd6-4008-b9e6-fc9fa2e7770b', title: 'Updated' },
		],
	},
	'responses.delete': undefined,
	'posts.create': {
		posts: {
			conversation: '00f78fe9-f11a-4b4e-a502-67e6138d3b0f',
			id: 'ee31f156-db95-4158-923f-b26450e0dbf7',
		},
	},
	'posts.delete': undefined,
	'sharedLabels.create': {
		shared_labels: [
			{
				id: '6960dfv2-4382-4230-aa70-933a1c62040b',
				name: 'Heroku',
				name_with_parent_names: 'Invoices/Heroku',
			},
		],
	},
	'sharedLabels.update': {
		shared_labels: [
			{ id: 'ee31f156-db95-4158-923f-b26450e0dbf7', name: 'Updated Label' },
		],
	},
	'sharedLabels.list': {
		shared_labels: [
			{
				id: 'b45a00fd-353s-89l2-a487-2465c35c3r91',
				name: 'Invoices',
				name_with_parent_names: 'Invoices',
			},
		],
	},
	'teams.list': {
		teams: [
			{
				id: 'd75aecb6-96a2-4b5f-afa6-19d1916052ea',
				name: 'Sales',
				active_members: [],
				observers: [],
				team_inbox_enabled: true,
				chat_room_enabled: true,
				team_mention_behavior: 'all_members',
				user_reply_behavior: 'assign_user',
				received_reply_behavior: 'show_in_assignee_inbox',
				team_sidebar_behavior: 'show_team_space',
			},
		],
	},
	'teams.create': {
		teams: [{ id: 'd75aecb6-96a2-4b5f-afa6-19d1916052ea', name: 'Support' }],
	},
	'teams.update': {
		teams: [
			{
				id: 'd75aecb6-96a2-4b5f-afa6-19d1916052ea',
				name: 'Customer Support',
			},
		],
	},
	'users.list': {
		users: [
			{
				id: 'a41a00fd-453d-49d7-a487-9765c35a3b70',
				me: true,
				name: 'Philippe Lehoux',
			},
		],
	},
	'tasks.list': {
		tasks: [
			{
				id: '75ad834a-9bd6-4008-b9e6-fc9fa2e7770b',
				title: 'Review pull request',
				state: 'todo',
				type: 'task',
				assignees: ['1ce8117e-ae42-4304-b953-c81656da4bd1'],
			},
		],
	},
	'tasks.get': {
		tasks: {
			id: '75ad834a-9bd6-4008-b9e6-fc9fa2e7770b',
			title: 'Review pull request',
			state: 'todo',
			type: 'task',
			assignees: [
				{ id: '1ce8117e-ae42-4304-b953-c81656da4bd1', name: 'John Doe' },
			],
			team: {
				id: '0e24f298-965d-4475-9220-b32636a1e2c3',
				name: 'Engineering',
			},
		},
	},
	'tasks.create': {
		tasks: {
			id: '75ad834a-9bd6-4008-b9e6-fc9fa2e7770b',
			title: 'Review pull request',
			state: 'todo',
			type: 'task',
			assignees: ['1ce8117e-ae42-4304-b953-c81656da4bd1'],
		},
	},
	'tasks.update': {
		tasks: {
			id: '75ad834a-9bd6-4008-b9e6-fc9fa2e7770b',
			title: 'Updated task title',
			state: 'in_progress',
			type: 'task',
			assignees: ['1ce8117e-ae42-4304-b953-c81656da4bd1'],
		},
	},
	'hooks.create': {
		hooks: { id: 'd75aecb6-96a2-4b5f-afa6-19d1916052ea' },
	},
	'hooks.delete': undefined,
};

// Independently written expected requests, transcribed by hand from
// https://missiveapp.com/docs/developers/rest-api/endpoints and paired with the
// hand-written INPUT_FIXTURES above. They are deliberately NOT derived from
// MISSIVE_OPERATIONS: a wrong catalog entry must change the wire request
// without also rewriting the expectation, or the test could never catch it.
type ExpectedBody = { wrapper: string } | { raw: true };
type ExpectedRequest = {
	method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
	path: string;
	query?: Record<string, string>;
	body?: ExpectedBody;
};

const EXPECTED_REQUESTS: Record<MissiveOperationKey, ExpectedRequest> = {
	'analytics.createReport': {
		method: 'POST',
		path: '/v1/analytics/reports',
		body: { wrapper: 'reports' },
	},
	'analytics.getReport': {
		method: 'GET',
		path: '/v1/analytics/reports/8441d4a0-a0ad-4f0f-aa9c-1cc881057e42',
	},
	'contacts.create': {
		method: 'POST',
		path: '/v1/contacts',
		body: { wrapper: 'contacts' },
	},
	'contacts.update': {
		method: 'PATCH',
		path: '/v1/contacts/ee31f156-db95-4158-923f-b26450e0dbf7',
		body: { wrapper: 'contacts' },
	},
	'contacts.list': {
		method: 'GET',
		path: '/v1/contacts',
		query: {
			contact_book: '487bc080-6631-4edc-830e-1d114eef4ab0',
			limit: '50',
			search: 'Lehoux',
		},
	},
	'contacts.get': {
		method: 'GET',
		path: '/v1/contacts/5960dcd2-3382-4430-aa70-955a2c62040a',
	},
	'contactBooks.list': {
		method: 'GET',
		path: '/v1/contact_books',
	},
	'contactGroups.list': {
		method: 'GET',
		path: '/v1/contact_groups',
		query: {
			contact_book: '487bc080-6631-4edc-830e-1d114eef4ab0',
			kind: 'organization',
		},
	},
	'conversations.list': {
		method: 'GET',
		path: '/v1/conversations',
		query: { inbox: 'true', limit: '25' },
	},
	'conversations.get': {
		method: 'GET',
		path: '/v1/conversations/6d3c9b1c-7067-4a28-8ea6-ea91340b67cc',
	},
	'conversations.update': {
		method: 'PATCH',
		path: '/v1/conversations/6d3c9b1c-7067-4a28-8ea6-ea91340b67cc',
		body: { wrapper: 'conversations' },
	},
	'conversations.listMessages': {
		method: 'GET',
		path: '/v1/conversations/6d3c9b1c-7067-4a28-8ea6-ea91340b67cc/messages',
		query: { limit: '10' },
	},
	'conversations.listComments': {
		method: 'GET',
		path: '/v1/conversations/6d3c9b1c-7067-4a28-8ea6-ea91340b67cc/comments',
	},
	'conversations.listDrafts': {
		method: 'GET',
		path: '/v1/conversations/6d3c9b1c-7067-4a28-8ea6-ea91340b67cc/drafts',
	},
	'conversations.listPosts': {
		method: 'GET',
		path: '/v1/conversations/6d3c9b1c-7067-4a28-8ea6-ea91340b67cc/posts',
	},
	'conversations.merge': {
		method: 'POST',
		path: '/v1/conversations/6d3c9b1c-7067-4a28-8ea6-ea91340b67cc/merge',
		body: { raw: true },
	},
	'drafts.create': {
		method: 'POST',
		path: '/v1/drafts',
		body: { wrapper: 'drafts' },
	},
	'drafts.delete': {
		method: 'DELETE',
		path: '/v1/drafts/3fa4bcf5-e57e-47a4-9422-de2cce5f802e',
	},
	'messages.create': {
		method: 'POST',
		path: '/v1/messages',
		body: { wrapper: 'messages' },
	},
	'messages.get': {
		method: 'GET',
		path: '/v1/messages/3fa4bcf5-e57e-47a4-9422-de2cce5f802e',
	},
	'messages.list': {
		method: 'GET',
		path: '/v1/messages',
		query: { email_message_id: '<0f1ab2d8@missiveapp.com>' },
	},
	'organizations.list': {
		method: 'GET',
		path: '/v1/organizations',
		query: { limit: '50' },
	},
	'responses.list': {
		method: 'GET',
		path: '/v1/responses',
		query: { organization: '84f876cc-ef7c-41cd-9711-7ab9cf9f26a5' },
	},
	'responses.get': {
		method: 'GET',
		path: '/v1/responses/75ad834a-9bd6-4008-b9e6-fc9fa2e7770b',
	},
	'responses.create': {
		method: 'POST',
		path: '/v1/responses',
		body: { wrapper: 'responses' },
	},
	'responses.update': {
		method: 'PATCH',
		path: '/v1/responses/75ad834a-9bd6-4008-b9e6-fc9fa2e7770b',
		body: { wrapper: 'responses' },
	},
	'responses.delete': {
		method: 'DELETE',
		path: '/v1/responses/75ad834a-9bd6-4008-b9e6-fc9fa2e7770b',
	},
	'posts.create': {
		method: 'POST',
		path: '/v1/posts',
		body: { wrapper: 'posts' },
	},
	'posts.delete': {
		method: 'DELETE',
		path: '/v1/posts/ee31f156-db95-4158-923f-b26450e0dbf7',
	},
	'sharedLabels.create': {
		method: 'POST',
		path: '/v1/shared_labels',
		body: { wrapper: 'shared_labels' },
	},
	'sharedLabels.update': {
		method: 'PATCH',
		path: '/v1/shared_labels/ee31f156-db95-4158-923f-b26450e0dbf7',
		body: { wrapper: 'shared_labels' },
	},
	'sharedLabels.list': {
		method: 'GET',
		path: '/v1/shared_labels',
		query: { organization: '0d9bab85-a74f-4ece-9142-0f9b9f36ff92' },
	},
	'teams.list': {
		method: 'GET',
		path: '/v1/teams',
		query: { organization: '0d9bab85-a74f-4ece-9142-0f9b9f36ff92' },
	},
	'teams.create': {
		method: 'POST',
		path: '/v1/teams',
		body: { wrapper: 'teams' },
	},
	'teams.update': {
		method: 'PATCH',
		path: '/v1/teams/d75aecb6-96a2-4b5f-afa6-19d1916052ea',
		body: { wrapper: 'teams' },
	},
	'users.list': {
		method: 'GET',
		path: '/v1/users',
		query: { limit: '50' },
	},
	'tasks.list': {
		method: 'GET',
		path: '/v1/tasks',
		query: {
			organization: '0d9bab85-a74f-4ece-9142-0f9b9f36ff92',
			state: 'todo',
		},
	},
	'tasks.get': {
		method: 'GET',
		path: '/v1/tasks/75ad834a-9bd6-4008-b9e6-fc9fa2e7770b',
	},
	'tasks.create': {
		method: 'POST',
		path: '/v1/tasks',
		body: { wrapper: 'tasks' },
	},
	'tasks.update': {
		method: 'PATCH',
		path: '/v1/tasks/75ad834a-9bd6-4008-b9e6-fc9fa2e7770b',
		body: { wrapper: 'tasks' },
	},
	'hooks.create': {
		method: 'POST',
		path: '/v1/hooks',
		body: { wrapper: 'hooks' },
	},
	'hooks.delete': {
		method: 'DELETE',
		path: '/v1/hooks/d75aecb6-96a2-4b5f-afa6-19d1916052ea',
	},
};

const AUTH_HEADER = `Bearer ${TOKEN}`;

describe('Missive REST endpoint contract', () => {
	it('matches the shipped operation catalog', () => {
		expect(MISSIVE_OPERATIONS).toHaveLength(42);
		expect(handlers.size).toBe(42);
		expect([...handlers.keys()].sort()).toEqual(
			MISSIVE_OPERATIONS.map(({ key }) => key).sort(),
		);
		expect(new Set(MISSIVE_OPERATIONS.map(({ key }) => key)).size).toBe(42);
		expect(
			new Set(MISSIVE_OPERATIONS.map(({ method, path }) => `${method} ${path}`))
				.size,
		).toBe(42);
	});

	it('uses documented Missive API paths (hardcoded against the provider spec)', () => {
		// These paths come from https://missiveapp.com/docs/developers/rest-api/endpoints.
		// They are hardcoded so that a drift in operations.ts is caught by the test
		// instead of being silently self-validated through operation.path.
		const expectedPaths: Record<string, string> = {
			'analytics.createReport': 'POST /analytics/reports',
			'analytics.getReport': 'GET /analytics/reports/{id}',
			'contacts.create': 'POST /contacts',
			'contacts.update': 'PATCH /contacts/{ids}',
			'contacts.list': 'GET /contacts',
			'contacts.get': 'GET /contacts/{id}',
			'contactBooks.list': 'GET /contact_books',
			'contactGroups.list': 'GET /contact_groups',
			'conversations.list': 'GET /conversations',
			'conversations.get': 'GET /conversations/{id}',
			'conversations.update': 'PATCH /conversations/{ids}',
			'conversations.listMessages': 'GET /conversations/{id}/messages',
			'conversations.listComments': 'GET /conversations/{id}/comments',
			'conversations.listDrafts': 'GET /conversations/{id}/drafts',
			'conversations.listPosts': 'GET /conversations/{id}/posts',
			'conversations.merge': 'POST /conversations/{id}/merge',
			'drafts.create': 'POST /drafts',
			'drafts.delete': 'DELETE /drafts/{id}',
			'messages.create': 'POST /messages',
			'messages.get': 'GET /messages/{ids}',
			'messages.list': 'GET /messages',
			'organizations.list': 'GET /organizations',
			'responses.list': 'GET /responses',
			'responses.get': 'GET /responses/{id}',
			'responses.create': 'POST /responses',
			'responses.update': 'PATCH /responses/{ids}',
			'responses.delete': 'DELETE /responses/{ids}',
			'posts.create': 'POST /posts',
			'posts.delete': 'DELETE /posts/{id}',
			'sharedLabels.create': 'POST /shared_labels',
			'sharedLabels.update': 'PATCH /shared_labels/{ids}',
			'sharedLabels.list': 'GET /shared_labels',
			'teams.list': 'GET /teams',
			'teams.create': 'POST /teams',
			'teams.update': 'PATCH /teams/{ids}',
			'users.list': 'GET /users',
			'tasks.list': 'GET /tasks',
			'tasks.get': 'GET /tasks/{id}',
			'tasks.create': 'POST /tasks',
			'tasks.update': 'PATCH /tasks/{id}',
			'hooks.create': 'POST /hooks',
			'hooks.delete': 'DELETE /hooks/{id}',
		};
		for (const operation of MISSIVE_OPERATIONS) {
			const expected = `${operation.method} ${operation.path}`;
			expect(expected).toBe(expectedPaths[operation.key]);
		}
	});

	it.each(Object.entries(INPUT_FIXTURES))(
		'%s sends its documented request',
		async (key) => {
			const expected = EXPECTED_REQUESTS[key as MissiveOperationKey];
			const schema = missiveEndpointSchemas[key as MissiveOperationKey];
			const input = INPUT_FIXTURES[key as MissiveOperationKey];
			const response = RESPONSE_FIXTURES[key as MissiveOperationKey];

			const captures: CapturedRequest[] = [];
			const mockFetch = jest
				.spyOn(global, 'fetch')
				.mockImplementation(async (url, init) => {
					captures.push({
						url: new URL(String(url)),
						method: init?.method ?? 'GET',
						headers: new Headers(init?.headers),
						body: init?.body,
					});
					// Routes without a response body answer 204.
					if (response === undefined) {
						return new Response(null, { status: 204 });
					}
					return new Response(JSON.stringify(response), {
						status: 200,
						headers: { 'content-type': 'application/json' },
					});
				});

			try {
				const expectedUrl = new URL(expected.path, MISSIVE_BASE_URL);
				const handler = handlers.get(key);
				expect(handler).toBeDefined();
				const result = await handler?.(input);
				expect(mockFetch).toHaveBeenCalledTimes(1);
				expect(captures).toHaveLength(1);
				const request = captures[0];
				if (!request) {
					throw new Error(`No request captured for ${key}`);
				}
				expect(request.method).toBe(expected.method);
				expect(request.url.origin).toBe(expectedUrl.origin);
				expect(request.url.pathname).toBe(expectedUrl.pathname);
				expect(request.headers.get('authorization')).toBe(AUTH_HEADER);
				expect(Object.fromEntries(request.url.searchParams)).toEqual(
					expected.query ?? {},
				);

				if (expected.body) {
					const rawBody = (input as Record<string, unknown>).body;
					const expectedBody =
						'wrapper' in expected.body
							? { [expected.body.wrapper]: rawBody }
							: rawBody;
					expect(request.body).toBeDefined();
					expect(JSON.parse(String(request.body))).toEqual(expectedBody);
					expect(request.headers.get('content-type')).toContain(
						'application/json',
					);
				} else {
					expect(request.body).toBeUndefined();
				}

				expect(schema.output.safeParse(result).success).toBe(true);
			} finally {
				mockFetch.mockRestore();
			}
		},
	);

	it.each(
		MISSIVE_OPERATIONS.filter(
			(operation) => operation.pathParams.length > 0 || operation.bodyRequired,
		),
	)(
		'%s rejects missing required path/body values before sending a request',
		async (operation) => {
			const schema = missiveEndpointSchemas[operation.key];
			const input = INPUT_FIXTURES[operation.key];
			const record = input as Record<string, unknown>;
			const missing = new Set([
				...operation.pathParams,
				...(operation.bodyRequired ? ['body'] : []),
			]);
			const invalidInput = Object.fromEntries(
				Object.entries(record).filter(([name]) => !missing.has(name)),
			);
			expect(schema.input.safeParse(invalidInput).success).toBe(false);

			// Prove the rejection happens at the public boundary: the bound
			// handler must throw before any HTTP request is attempted.
			const fetchSpy = jest
				.spyOn(global, 'fetch')
				.mockImplementation(async () => {
					throw new Error(
						`fetch must not be called for invalid ${operation.key} input`,
					);
				});
			try {
				const handler = handlers.get(operation.key);
				expect(handler).toBeDefined();
				await expect(handler?.(invalidInput)).rejects.toThrow();
				expect(fetchSpy).not.toHaveBeenCalled();
			} finally {
				fetchSpy.mockRestore();
			}
		},
	);

	it('encodes reserved characters and traversal in path ids', async () => {
		const captures: CapturedRequest[] = [];
		const mockFetch = jest
			.spyOn(global, 'fetch')
			.mockImplementation(async (url, init) => {
				captures.push({
					url: new URL(String(url)),
					method: init?.method ?? 'GET',
					headers: new Headers(init?.headers),
					body: init?.body,
				});
				return new Response(JSON.stringify(RESPONSE_FIXTURES['contacts.get']), {
					status: 200,
					headers: { 'content-type': 'application/json' },
				});
			});
		try {
			const handler = handlers.get('contacts.get');
			expect(handler).toBeDefined();
			await handler?.({ id: '../../users' });
			const request = captures[0];
			if (!request) throw new Error('No request captured');
			// The guard is percent-encoding: traversal segments stay inside the
			// contacts path instead of escaping it.
			expect(request.url.pathname).toBe('/v1/contacts/..%2F..%2Fusers');
		} finally {
			mockFetch.mockRestore();
		}
	});
});
