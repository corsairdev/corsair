// Kept apart from index.ts so error-handlers.ts can read risk levels without
// importing the plugin entry. index.ts checks it against the endpoint tree.
// read: only reads. write: creates, sends or changes something, including on
// LinkedIn. destructive: removes or withdraws something.
export const unipileEndpointMeta = {
	'accounts.list': {
		riskLevel: 'read',
		description:
			'List connected Unipile accounts (LinkedIn and others) with their acc_ IDs, provider and status; filter by provider or status',
	},
	'accounts.get': {
		riskLevel: 'read',
		description:
			'Get one connected account: provider, status (running, disconnected, errored…), lock state and connection method',
	},
	'accounts.remove': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Disconnect an account from Unipile and delete all its Unipile data. The user must link it again to use it',
	},
	'accounts.createAuthLink': {
		riskLevel: 'write',
		description:
			'Create a Hosted Auth link for a user to connect a LinkedIn (or other) account, or to reconnect one with account_id; LinkedIn sign-in can offer credentials, cookies or the UniLogin extension',
	},
	'users.getProfile': {
		riskLevel: 'read',
		description:
			"Get a LinkedIn profile by member ID or public identifier: headline, location, network distance, invitation status, and optional experience, education and skills. Each call counts toward LinkedIn's profile-view limit (about 80-100 a day), so it is not retried after a timeout or 5xx, only after Unipile's own rate limit",
	},
	'users.visitProfile': {
		riskLevel: 'write',
		description:
			"Report a profile visit to LinkedIn so the member sees you in 'Who viewed your profile', using the notify_visit_token from users.getProfile. Counts toward LinkedIn's profile-view limit and is not retried after a timeout or 5xx",
	},
	'users.listRelations': {
		riskLevel: 'read',
		description:
			"List a user's 1st-degree connections (the account owner's by default), with optional name search and paging",
	},
	'users.getChat': {
		riskLevel: 'read',
		description:
			'Find the existing 1-to-1 chat IDs with a user, to send into instead of starting a new chat',
	},
	'users.listReactions': {
		riskLevel: 'read',
		description:
			"List the posts a user reacted to (the account owner's by default), with each post",
	},
	'users.listComments': {
		riskLevel: 'read',
		description:
			"List a user's comments on posts (the account owner's by default), with each post",
	},
	'relationRequests.list': {
		riskLevel: 'read',
		description:
			'List pending LinkedIn invitations the account sent or received, with the other person and any note',
	},
	'relationRequests.create': {
		riskLevel: 'write',
		description:
			'Send a LinkedIn connection invitation to a member ID (ACo…), with an optional note. LinkedIn allows roughly 100-200 a week; pace sends and never retry a failed one blindly',
	},
	'relationRequests.cancel': {
		riskLevel: 'destructive',
		description:
			'Withdraw a sent LinkedIn invitation or decline a received one. LinkedIn may block re-inviting the same person for weeks',
	},
	'relationRequests.accept': {
		riskLevel: 'write',
		description: 'Accept a LinkedIn invitation the account received',
	},
	'chats.list': {
		riskLevel: 'read',
		description:
			"List the account's chats, newest first, filtered by type, date, unread or archived",
	},
	'chats.get': {
		riskLevel: 'read',
		description:
			'Get one chat: participants, unread count, last message and whether sending is restricted',
	},
	'chats.start': {
		riskLevel: 'write',
		description:
			'Start a LinkedIn chat with one person (or a group) by sending the first message; can send as InMail. Use messages.send when a chat already exists',
	},
	'messages.list': {
		riskLevel: 'read',
		description:
			'List the messages in a chat, newest first, with sender, read and delivery state',
	},
	'messages.send': {
		riskLevel: 'write',
		description:
			'Send a message, optionally with attachments or as a reply, in an existing chat',
	},
	'posts.list': {
		riskLevel: 'read',
		description:
			"List a user's LinkedIn posts with reaction, comment and repost counts",
	},
	'posts.listReactions': {
		riskLevel: 'read',
		description:
			'List the people who reacted to a post, with their profile summary, to find engaged leads',
	},
	'posts.listComments': {
		riskLevel: 'read',
		description:
			'List the comments on a post with each author, newest or most relevant first',
	},
	'webhookEndpoints.list': {
		riskLevel: 'read',
		description:
			'List the Unipile webhook endpoints, their URLs, events and accounts (signing secrets are never returned). Needs a Service API Key',
	},
	'webhookEndpoints.get': {
		riskLevel: 'read',
		description:
			'Get one Unipile webhook endpoint: URL, events, accounts and whether it has a signing secret (the secret is never returned). Needs a Service API Key',
	},
	'webhookEndpoints.create': {
		riskLevel: 'write',
		description:
			'Register a URL to receive Unipile events such as relation.new and message.new. Returns the signing secret once, and only here: store it as the plugin webhookSecret right away. Needs a Service API Key',
	},
	'webhookEndpoints.update': {
		riskLevel: 'write',
		description:
			"Change a webhook endpoint's URL, events, accounts or description, or enable or disable it. Keeps the signing secret, which is not returned. Needs a Service API Key",
	},
	'webhookEndpoints.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a Unipile webhook endpoint; its events stop. Needs a Service API Key',
	},
} as const;
