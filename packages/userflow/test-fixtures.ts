// Response bodies built from the examples in https://userflow.com/docs/api, with
// made-up people and companies. They were not captured from the live API.

export const user = {
	id: '2a845972-4cde-4cb4-ba14-5cb2fc15ec4c',
	object: 'user',
	attributes: {
		email: 'evelyn@example.com',
		name: 'Evelyn Reichert',
		project_count: 17,
		signed_up_at: '2022-09-29T12:34:56.000+00:00',
	},
	created_at: '2022-10-17T12:34:56.000+00:00',
	groups: null,
	memberships: null,
};

/** With `?expand=memberships.group`, both fields are filled in. */
export const userWithMemberships = {
	...user,
	memberships: [
		{
			id: 'e9b32bd0-63cb-415e-9c4f-477c85b92f97',
			object: 'group_membership',
			attributes: { role: 'admin' },
			created_at: '2022-10-17T12:34:56.000+00:00',
			group: {
				id: 'ab82c312-b3a4-4feb-870c-53dd336f955e',
				object: 'group',
				attributes: { name: 'Acme Inc.', billing_plan: 'plus' },
				created_at: '2022-10-17T12:34:56.000+00:00',
			},
			group_id: 'ab82c312-b3a4-4feb-870c-53dd336f955e',
			user: null,
			user_id: '2a845972-4cde-4cb4-ba14-5cb2fc15ec4c',
		},
	],
};

export const usersPage = {
	object: 'list',
	data: [user],
	has_more: true,
	url: '/users',
	next_page_url: '/users?starting_after=2a845972-4cde-4cb4-ba14-5cb2fc15ec4c',
};

export const usersLastPage = {
	object: 'list',
	data: [user],
	has_more: false,
	url: '/users',
	next_page_url: '/users?starting_after=2a845972-4cde-4cb4-ba14-5cb2fc15ec4c',
};

export const group = {
	id: 'ab82c312-b3a4-4feb-870c-53dd336f955e',
	object: 'group',
	attributes: {
		name: 'Acme Inc.',
		billing_plan: 'plus',
		signed_up_at: '2022-09-29T12:34:56.000+00:00',
	},
	created_at: '2022-10-17T12:34:56.000+00:00',
	memberships: null,
	users: null,
};

export const groupsPage = {
	object: 'list',
	data: [group],
	has_more: false,
	url: '/groups',
	next_page_url: '/groups?starting_after=ab82c312-b3a4-4feb-870c-53dd336f955e',
};

export const event = {
	id: '4738382',
	object: 'event',
	attributes: { plan_name: 'plus', plan_price: 199 },
	created_at: '2022-11-29T12:34:56.000+00:00',
	group_id: null,
	group: null,
	name: 'subscription_activated',
	time: '2022-11-29T12:34:56.000+00:00',
	user_id: 'c2dfad13-ee7d-4fb2-9b4f-d450716b4791',
	user: null,
};

export const content = {
	id: '54bce034-1303-4200-a09a-780a2eee355d',
	object: 'content',
	created_at: '2022-10-17T12:34:56.000+00:00',
	draft_version_id: '152a63cc-0a49-475a-a8e4-5f89bee94fe6',
	draft_version: null,
	labels: ['Survey'],
	name: 'Example flow',
	published_version_id: 'c8eeb97b-43aa-47d9-bed2-a3d964900977',
	published_version: null,
	type: 'flow',
};

export const contentPage = {
	object: 'list',
	data: [content],
	has_more: false,
	url: '/content',
	next_page_url: '/content?starting_after=54bce034-1303-4200-a09a-780a2eee355d',
};

export const contentVersion = {
	id: '152a63cc-0a49-475a-a8e4-5f89bee94fe6',
	object: 'content_version',
	created_at: '2022-10-17T12:34:56.000+00:00',
	description: 'Optional example description',
	edited_at: '2022-06-29T23:45:56.000+00:00',
	number: 3,
	questions: null,
	tasks: null,
};

export const contentVersionsPage = {
	object: 'list',
	data: [contentVersion],
	has_more: false,
	url: '/content_versions',
	next_page_url:
		'/content_versions?starting_after=152a63cc-0a49-475a-a8e4-5f89bee94fe6',
};

export const contentSession = {
	id: '33af21fd-f025-43fc-a492-cf5179b38ee3',
	object: 'content_session',
	answers: null,
	completed_at: '2022-10-17T12:35:56.000+00:00',
	completed: true,
	content_id: '54bce034-1303-4200-a09a-780a2eee355d',
	content: null,
	created_at: '2022-10-17T12:34:56.000+00:00',
	group_id: null,
	group: null,
	is_preview: false,
	last_activity_at: '2022-10-17T12:35:56.000+00:00',
	launcher_activated: false,
	progress: '1',
	user_id: '34907ae0-24e0-4261-ac31-3c7299a354c0',
	user: null,
	version_id: '152a63cc-0a49-475a-a8e4-5f89bee94fe6',
	version: null,
};

export const contentSessionsPage = {
	object: 'list',
	data: [contentSession],
	has_more: false,
	url: '/content_sessions',
	next_page_url:
		'/content_sessions?starting_after=33af21fd-f025-43fc-a492-cf5179b38ee3',
};

export const attributeDefinition = {
	id: 'dfb0c3ed-a8d1-4e73-8b95-b307fa322c3a',
	object: 'attribute_definition',
	created_at: '2022-10-17T12:34:56.000+00:00',
	data_type: 'datetime',
	description: 'When user first signed up in your app',
	display_name: 'Signed Up',
	name: 'signed_up_at',
	scope: 'user',
};

export const attributeDefinitionsPage = {
	object: 'list',
	data: [attributeDefinition],
	has_more: false,
	url: '/attribute_definitions',
	next_page_url:
		'/attribute_definitions?starting_after=dfb0c3ed-a8d1-4e73-8b95-b307fa322c3a',
};

export const eventDefinition = {
	id: '9cf1de05-9a3a-4719-b8a9-75316a5f86ce',
	object: 'event_definition',
	created_at: '2022-10-17T12:34:56.000+00:00',
	description: 'A Userflow flow was started',
	display_name: 'Flow Started',
	name: 'flow_started',
};

export const eventDefinitionsPage = {
	object: 'list',
	data: [eventDefinition],
	has_more: false,
	url: '/event_definitions',
	next_page_url:
		'/event_definitions?starting_after=9cf1de05-9a3a-4719-b8a9-75316a5f86ce',
};

export const webhookSubscription = {
	id: 'c8783643-7f16-4a02-b736-4f5a327f8231',
	object: 'webhook_subscription',
	api_version: '2020-01-03',
	created_at: '2022-10-17T12:34:56.000+00:00',
	disabled: false,
	topics: ['user', 'event'],
	url: 'https://example.com/hooks/userflow',
};

/**
 * The secret is only ever returned on create and update. The value is a
 * placeholder that keeps the `whsec_` shape without resembling a real signing
 * key, so a secret scanner does not flag the fixture.
 */
export const webhookSubscriptionWithSecret = {
	...webhookSubscription,
	secret: 'whsec_test_fixture_not_a_real_signing_key',
};

export const webhookSubscriptionsPage = {
	object: 'list',
	data: [webhookSubscription],
	has_more: false,
	url: '/webhook_subscriptions',
	next_page_url:
		'/webhook_subscriptions?starting_after=c8783643-7f16-4a02-b736-4f5a327f8231',
};

export const account = {
	id: '3f2a4b56-7c8d-9e0f-1a2b-3c4d5e6f7a8b',
	object: 'account',
	name: 'Acme Inc.',
	slug: 'acme-inc',
	created_at: '2023-01-01T00:00:00.000Z',
	is_2fa_enforced: true,
	environments: null,
};

/** With `?expand=environments`. */
export const accountWithEnvironments = {
	...account,
	environments: [
		{
			object: 'environment',
			id: '9a3c5e3e-7c4f-4a83-88be-86a3c85fa0e4',
			name: 'Production',
			slug: 'production',
			created_at: '2023-01-01T00:00:01.000+00:00',
			is_primary: true,
			is_deactivated: false,
			region: 'US',
		},
	],
};

export const accountsPage = {
	object: 'list',
	data: [account],
	has_more: false,
	url: '/accounts',
	next_page_url:
		'/accounts?starting_after=3f2a4b56-7c8d-9e0f-1a2b-3c4d5e6f7a8b',
};

export const member = {
	id: '3d7f23a1-0c24-4b94-9e39-57b93ccfa08e',
	object: 'member',
	name: 'John Doe',
	email: 'john@example.com',
	created_at: '2023-11-19T11:34:48.000+00:00',
	avatar_url: 'https://storage.googleapis.com/avatar.jpg',
	is_2fa_enabled: true,
	has_sso: true,
	has_password: false,
	role: 'editor',
	permissions: [
		{
			action: 'publish_flow',
			subject: 'environment',
			subject_id: '9a3c5e3e-7c4f-4a83-88be-86a3c85fa0e4',
		},
	],
};

export const membersPage = {
	object: 'list',
	data: [member],
	has_more: false,
	url: '/accounts/3f2a4b56/members',
	next_page_url: '/accounts/3f2a4b56/members?starting_after=3d7f23a1',
};

export const invite = {
	id: 'e4d9916e-c5c3-4aa7-998b-8a7b1ff014c2',
	object: 'invite',
	name: 'Jane Doe',
	email: 'jane@example.com',
	sender_id: '3d7f23a1-0c24-4b94-9e39-57b93ccfa08e',
	created_at: '2022-10-17T12:34:56.000+00:00',
	is_expired: false,
	role: 'editor',
	permissions: [],
};

export const invitesPage = {
	object: 'list',
	data: [invite],
	has_more: false,
	url: '/accounts/3f2a4b56/invites',
	next_page_url: '/accounts/3f2a4b56/invites?starting_after=e4d9916e',
};

/** The error body every failure uses. */
export const invalidEnvKey = {
	error: {
		code: 'invalid_api_key',
		message: 'Invalid API key provided: BADKEY',
		doc_url: 'https://userflow.com/docs/api#users-api-authentication',
		// The live API nests request_id inside error (seen 11-12).
		request_id: 'GOblteh_bhb6oJMOA4PD',
	},
};

/** The Accounts API reports a wrong key type with its own code. */
export const invalidPersonalKey = {
	error: {
		code: 'invalid_pak',
		message: 'Invalid Personal API Key provided: BADKEY',
		doc_url: 'https://userflow.com/docs/api#accounts-api-authentication',
		request_id: 'GObltkzMcod',
	},
};

export const pendingInvite = {
	error: {
		code: 'invite_already_pending',
		message: 'A pending invite already exists for this email.',
		doc_url: 'https://userflow.com/docs/api',
	},
};

export const rateLimited = {
	error: {
		code: 'rate_limited',
		message: 'Too many requests. Please try again later.',
		doc_url: 'https://userflow.com/docs/api#rate-limits',
	},
};
