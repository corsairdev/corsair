import type {
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { Account, Messages, Server } from './endpoints';
import * as More from './endpoints/more';
import type {
	NtfyEndpointInputs,
	NtfyEndpointOutputs,
} from './endpoints/types';
import {
	NtfyEndpointInputSchemas,
	NtfyEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { NtfySchema } from './schema';

export type NtfyPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** A `tk_` access token, or `username:password` for HTTP Basic. */
	key?: string;
	/**
	 * A self-hosted server, e.g. `https://ntfy.example.com`. Defaults to the
	 * account's stored `base_url`, else https://ntfy.sh.
	 */
	serverUrl?: string;
	/**
	 * Send calls without credentials when no key is set or stored: anonymous
	 * publishing to open topics, and `account.create` signup (ntfy refuses
	 * signup from a signed-in user). Off by default, so a tenant without a
	 * key is asked to connect.
	 */
	anonymous?: boolean;
	hooks?: InternalNtfyPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof ntfyEndpointsNested>;
};

export const ntfyAuthConfig = {
	api_key: {
		// Optional: empty means https://ntfy.sh.
		account: ['base_url'] as const,
	},
} as const satisfies PluginAuthConfig;

export type NtfyContext = CorsairPluginContext<
	typeof NtfySchema,
	NtfyPluginOptions,
	undefined,
	typeof ntfyAuthConfig
>;

export type NtfyKeyBuilderContext = KeyBuilderContext<
	NtfyPluginOptions,
	typeof ntfyAuthConfig
>;

export type NtfyBoundEndpoints = BindEndpoints<typeof ntfyEndpointsNested>;

type NtfyEndpoint<K extends keyof NtfyEndpointOutputs> = CorsairEndpoint<
	NtfyContext,
	NtfyEndpointInputs[K],
	NtfyEndpointOutputs[K]
>;

export type NtfyEndpoints = {
	messagesSend: NtfyEndpoint<'messagesSend'>;
	messagesPoll: NtfyEndpoint<'messagesPoll'>;
	messagesUpdate: NtfyEndpoint<'messagesUpdate'>;
	messagesClear: NtfyEndpoint<'messagesClear'>;
	messagesDelete: NtfyEndpoint<'messagesDelete'>;
	accountUsage: NtfyEndpoint<'accountUsage'>;
	serverHealth: NtfyEndpoint<'serverHealth'>;
	serverStats: NtfyEndpoint<'serverStats'>;
};

const ntfyEndpointsNested = {
	messages: {
		send: Messages.send,
		sendFile: More.sendFile,
		poll: Messages.poll,
		update: Messages.update,
		clear: Messages.clear,
		// `delete` is reserved as a function name; the endpoint is `remove`.
		delete: Messages.remove,
	},
	topics: { checkAuth: More.checkAuth },
	files: { download: More.download },
	account: {
		usage: Account.usage,
		create: More.accountCreate,
		delete: More.accountDelete,
		changePassword: More.accountChangePassword,
		login: More.accountLogin,
		updateSettings: More.accountUpdateSettings,
		requestPasswordReset: More.accountRequestPasswordReset,
		resetPassword: More.accountResetPassword,
	},
	tokens: {
		create: More.tokensCreate,
		update: More.tokensUpdate,
		delete: More.tokensDelete,
	},
	subscriptions: {
		add: More.subscriptionsAdd,
		update: More.subscriptionsUpdate,
		delete: More.subscriptionsDelete,
	},
	reservations: {
		add: More.reservationsAdd,
		delete: More.reservationsDelete,
	},
	phoneNumbers: {
		sendVerification: More.phoneSendVerification,
		add: More.phoneAdd,
		delete: More.phoneDelete,
	},
	emails: {
		add: More.emailsAdd,
		verify: More.emailsVerify,
		delete: More.emailsDelete,
		setPrimary: More.emailsSetPrimary,
		resendVerification: More.emailsResendVerification,
	},
	billing: {
		tiers: More.billingTiers,
		createSubscription: More.billingCreateSubscription,
		updateSubscription: More.billingUpdateSubscription,
		cancelSubscription: More.billingCancelSubscription,
		createPortalSession: More.billingCreatePortalSession,
	},
	webPush: {
		subscribe: More.webPushSubscribe,
		unsubscribe: More.webPushUnsubscribe,
	},
	users: {
		list: More.usersList,
		create: More.usersCreate,
		update: More.usersUpdate,
		delete: More.usersDelete,
		grantAccess: More.usersGrantAccess,
		resetAccess: More.usersResetAccess,
		listTokens: More.usersListTokens,
		createToken: More.usersCreateToken,
		deleteToken: More.usersDeleteToken,
		resetPassword: More.usersResetPassword,
	},
	tiers: {
		list: More.tiersList,
		create: More.tiersCreate,
		update: More.tiersUpdate,
		delete: More.tiersDelete,
	},
	server: {
		health: Server.health,
		ready: More.ready,
		version: More.version,
		config: More.config,
		stats: Server.stats,
		metrics: More.metrics,
	},
} as const;

export const ntfyEndpointSchemas = {
	'messages.send': {
		input: NtfyEndpointInputSchemas.messagesSend,
		output: NtfyEndpointOutputSchemas.messagesSend,
	},
	'messages.poll': {
		input: NtfyEndpointInputSchemas.messagesPoll,
		output: NtfyEndpointOutputSchemas.messagesPoll,
	},
	'messages.update': {
		input: NtfyEndpointInputSchemas.messagesUpdate,
		output: NtfyEndpointOutputSchemas.messagesUpdate,
	},
	'messages.clear': {
		input: NtfyEndpointInputSchemas.messagesClear,
		output: NtfyEndpointOutputSchemas.messagesClear,
	},
	'messages.delete': {
		input: NtfyEndpointInputSchemas.messagesDelete,
		output: NtfyEndpointOutputSchemas.messagesDelete,
	},
	'account.usage': {
		input: NtfyEndpointInputSchemas.accountUsage,
		output: NtfyEndpointOutputSchemas.accountUsage,
	},
	'server.health': {
		input: NtfyEndpointInputSchemas.serverHealth,
		output: NtfyEndpointOutputSchemas.serverHealth,
	},
	'server.stats': {
		input: NtfyEndpointInputSchemas.serverStats,
		output: NtfyEndpointOutputSchemas.serverStats,
	},
	'messages.sendFile': More.sendFile.schemas,
	'topics.checkAuth': More.checkAuth.schemas,
	'files.download': More.download.schemas,
	'account.create': More.accountCreate.schemas,
	'account.delete': More.accountDelete.schemas,
	'account.changePassword': More.accountChangePassword.schemas,
	'account.login': More.accountLogin.schemas,
	'account.updateSettings': More.accountUpdateSettings.schemas,
	'account.requestPasswordReset': More.accountRequestPasswordReset.schemas,
	'account.resetPassword': More.accountResetPassword.schemas,
	'tokens.create': More.tokensCreate.schemas,
	'tokens.update': More.tokensUpdate.schemas,
	'tokens.delete': More.tokensDelete.schemas,
	'subscriptions.add': More.subscriptionsAdd.schemas,
	'subscriptions.update': More.subscriptionsUpdate.schemas,
	'subscriptions.delete': More.subscriptionsDelete.schemas,
	'reservations.add': More.reservationsAdd.schemas,
	'reservations.delete': More.reservationsDelete.schemas,
	'phoneNumbers.sendVerification': More.phoneSendVerification.schemas,
	'phoneNumbers.add': More.phoneAdd.schemas,
	'phoneNumbers.delete': More.phoneDelete.schemas,
	'emails.add': More.emailsAdd.schemas,
	'emails.verify': More.emailsVerify.schemas,
	'emails.delete': More.emailsDelete.schemas,
	'emails.setPrimary': More.emailsSetPrimary.schemas,
	'emails.resendVerification': More.emailsResendVerification.schemas,
	'billing.tiers': More.billingTiers.schemas,
	'billing.createSubscription': More.billingCreateSubscription.schemas,
	'billing.updateSubscription': More.billingUpdateSubscription.schemas,
	'billing.cancelSubscription': More.billingCancelSubscription.schemas,
	'billing.createPortalSession': More.billingCreatePortalSession.schemas,
	'webPush.subscribe': More.webPushSubscribe.schemas,
	'webPush.unsubscribe': More.webPushUnsubscribe.schemas,
	'users.list': More.usersList.schemas,
	'users.create': More.usersCreate.schemas,
	'users.update': More.usersUpdate.schemas,
	'users.delete': More.usersDelete.schemas,
	'users.grantAccess': More.usersGrantAccess.schemas,
	'users.resetAccess': More.usersResetAccess.schemas,
	'users.listTokens': More.usersListTokens.schemas,
	'users.createToken': More.usersCreateToken.schemas,
	'users.deleteToken': More.usersDeleteToken.schemas,
	'users.resetPassword': More.usersResetPassword.schemas,
	'tiers.list': More.tiersList.schemas,
	'tiers.create': More.tiersCreate.schemas,
	'tiers.update': More.tiersUpdate.schemas,
	'tiers.delete': More.tiersDelete.schemas,
	'server.ready': More.ready.schemas,
	'server.version': More.version.schemas,
	'server.config': More.config.schemas,
	'server.metrics': More.metrics.schemas,
} as const satisfies RequiredPluginEndpointSchemas<typeof ntfyEndpointsNested>;

const defaultAuthType = 'api_key' as const;

// ntfy has no inbound webhooks: subscribers poll topics, so the plugin ships
// no webhook handlers.
const ntfyEndpointMeta = {
	'messages.send': {
		riskLevel: 'destructive',
		description:
			'Publish a notification to a topic; every subscriber gets a push, so the send cannot be undone',
		irreversible: true,
	},
	'messages.poll': {
		riskLevel: 'read',
		description:
			'Read cached messages from one or more topics, optionally including scheduled ones, with since/filters',
	},
	'messages.update': {
		riskLevel: 'destructive',
		description:
			'Publish a new version of a message under an existing sequence id; the server keeps both versions and notifies again',
	},
	'messages.clear': {
		riskLevel: 'write',
		description:
			'Mark a message as read and dismissed on subscribers (sends a message_clear event)',
	},
	'messages.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a message by sequence id, sending a delete event to subscribers; the cache entry is removed',
		irreversible: true,
	},
	'account.usage': {
		riskLevel: 'read',
		description:
			'Read the account view: tier limits, messages/emails/calls used and remaining, and the daily reset time',
	},
	'server.health': {
		riskLevel: 'read',
		description: 'Read server health (healthy flag and role)',
	},
	'server.stats': {
		riskLevel: 'read',
		description: 'Read server-wide totals: message count and rate per second',
	},
	'messages.sendFile': {
		riskLevel: 'destructive',
		description:
			'Upload a file as a message attachment (PUT /{topic}); every subscriber gets a push, so the send cannot be undone',
		irreversible: true,
	},
	'topics.checkAuth': {
		riskLevel: 'read',
		description:
			'Check that the credential may read the topic(s); 200 with success true, 401/403 otherwise',
	},
	'files.download': {
		riskLevel: 'read',
		description:
			'Download a message attachment stored on the server (/file/{id}) and return the file',
	},
	'account.create': {
		riskLevel: 'write',
		description:
			'Sign up a new user on a server with signup enabled (anonymous call)',
	},
	'account.delete': {
		riskLevel: 'destructive',
		description:
			'Delete the signed-in account, its tokens and reservations, confirmed with the current password',
		irreversible: true,
	},
	'account.changePassword': {
		riskLevel: 'destructive',
		description:
			'Change the signed-in account password; the old one stops working',
	},
	'account.login': {
		riskLevel: 'write',
		description: 'Sign in with username:password and get a new session token',
	},
	'account.updateSettings': {
		riskLevel: 'write',
		description:
			'Change account preferences: language, date/time format and notification sound, minimum priority, auto-delete',
	},
	'account.requestPasswordReset': {
		riskLevel: 'destructive',
		description:
			'Email a password reset link to the account (server needs email sending)',
	},
	'account.resetPassword': {
		riskLevel: 'write',
		description: 'Set a new password with the token from a reset link',
	},
	'tokens.create': {
		riskLevel: 'write',
		description:
			'Create an access token for the signed-in account (returned once, tk_...)',
	},
	'tokens.update': {
		riskLevel: 'write',
		description: "Change an access token's label or expiry",
	},
	'tokens.delete': {
		riskLevel: 'destructive',
		description:
			'Revoke an access token (the given one, or the one making the call)',
		irreversible: true,
	},
	'subscriptions.add': {
		riskLevel: 'write',
		description:
			'Add a topic subscription to the account (synced to the web app and phone apps)',
	},
	'subscriptions.update': {
		riskLevel: 'write',
		description: "Change a synced subscription's display name",
	},
	'subscriptions.delete': {
		riskLevel: 'write',
		description: 'Remove a synced topic subscription from the account',
	},
	'reservations.add': {
		riskLevel: 'write',
		description:
			'Reserve a topic for the account and set what everyone else may do on it',
	},
	'reservations.delete': {
		riskLevel: 'destructive',
		description:
			'Release a reserved topic, optionally deleting its cached messages',
	},
	'phoneNumbers.sendVerification': {
		riskLevel: 'destructive',
		description:
			'Send a verification code to a phone number by SMS or call (needs a tier with calls)',
	},
	'phoneNumbers.add': {
		riskLevel: 'write',
		description: 'Add a phone number to the account with the code it received',
	},
	'phoneNumbers.delete': {
		riskLevel: 'destructive',
		description: 'Remove a verified phone number from the account',
	},
	'emails.add': {
		riskLevel: 'destructive',
		description:
			'Add an email address to the account and send it a verification link',
	},
	'emails.verify': {
		riskLevel: 'write',
		description:
			'Confirm an email address with the token from its verification link',
	},
	'emails.delete': {
		riskLevel: 'destructive',
		description: 'Remove an email address from the account',
	},
	'emails.setPrimary': {
		riskLevel: 'write',
		description: 'Make a verified email address the primary one',
	},
	'emails.resendVerification': {
		riskLevel: 'destructive',
		description: 'Send the verification link for a pending email address again',
	},
	'billing.tiers': {
		riskLevel: 'read',
		description:
			'List the paid tiers with their prices and limits, plus the free tier (servers with payments only)',
	},
	'billing.createSubscription': {
		riskLevel: 'destructive',
		description: 'Start a paid subscription; returns a Stripe checkout URL',
	},
	'billing.updateSubscription': {
		riskLevel: 'destructive',
		description:
			'Switch the paid subscription to another tier or interval (charges or prorates)',
	},
	'billing.cancelSubscription': {
		riskLevel: 'destructive',
		description: 'Cancel the paid subscription at the end of the period',
		irreversible: true,
	},
	'billing.createPortalSession': {
		riskLevel: 'write',
		description: 'Get a Stripe billing portal URL for the account',
	},
	'webPush.subscribe': {
		riskLevel: 'write',
		description: 'Register or update a browser push subscription for topics',
	},
	'webPush.unsubscribe': {
		riskLevel: 'write',
		description: 'Remove a browser push subscription',
	},
	'users.list': {
		riskLevel: 'read',
		description:
			'Admin: list users (or one by username) with role, tier and topic grants',
	},
	'users.create': {
		riskLevel: 'write',
		description:
			'Admin: create a user with a password or bcrypt hash and an optional tier',
	},
	'users.update': {
		riskLevel: 'write',
		description: "Admin: change a user's password or tier",
	},
	'users.delete': {
		riskLevel: 'destructive',
		description: 'Admin: delete a user and their tokens and grants',
		irreversible: true,
	},
	'users.grantAccess': {
		riskLevel: 'write',
		description:
			'Admin: grant a user (or "*" everyone) read/write/deny access to a topic or pattern',
	},
	'users.resetAccess': {
		riskLevel: 'destructive',
		description: "Admin: remove a user's topic grants (one topic or all)",
	},
	'users.listTokens': {
		riskLevel: 'read',
		description: "Admin: list a user's access tokens",
	},
	'users.createToken': {
		riskLevel: 'write',
		description: 'Admin: create an access token for a user (returned once)',
	},
	'users.deleteToken': {
		riskLevel: 'destructive',
		description: "Admin: revoke one of a user's access tokens",
		irreversible: true,
	},
	'users.resetPassword': {
		riskLevel: 'destructive',
		description:
			'Admin: make a password reset link for a user, optionally emailing it',
	},
	'tiers.list': {
		riskLevel: 'read',
		description: 'Admin: list tiers with their limits and user counts',
	},
	'tiers.create': {
		riskLevel: 'write',
		description:
			'Admin: create a tier with message, email, call, reservation and attachment limits',
	},
	'tiers.update': {
		riskLevel: 'write',
		description: "Admin: change a tier's limits",
	},
	'tiers.delete': {
		riskLevel: 'destructive',
		description: 'Admin: delete a tier that no user is on',
		irreversible: true,
	},
	'server.ready': {
		riskLevel: 'read',
		description:
			'Read whether the server is ready for traffic (load balancer check)',
	},
	'server.version': {
		riskLevel: 'read',
		description: 'Read the server version, commit and build date',
	},
	'server.config': {
		riskLevel: 'read',
		description:
			'Read the server feature flags: login, signup, payments, calls, emails, reservations, web push',
	},
	'server.metrics': {
		riskLevel: 'read',
		description:
			'Read Prometheus metrics as text (servers with metrics enabled)',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof ntfyEndpointsNested>;

export type BaseNtfyPlugin<T extends NtfyPluginOptions> = CorsairPlugin<
	'ntfy',
	typeof NtfySchema,
	typeof ntfyEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof ntfyAuthConfig
>;

export type InternalNtfyPlugin = BaseNtfyPlugin<NtfyPluginOptions>;

export type ExternalNtfyPlugin<T extends NtfyPluginOptions> = BaseNtfyPlugin<T>;

export function ntfy<const T extends NtfyPluginOptions>(
	incomingOptions: NtfyPluginOptions & T = {} as NtfyPluginOptions & T,
): ExternalNtfyPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'ntfy',
		authConfig: ntfyAuthConfig,
		schema: NtfySchema,
		options: options,
		hooks: options.hooks,
		endpoints: ntfyEndpointsNested,
		webhooks: {},
		endpointMeta: ntfyEndpointMeta,
		endpointSchemas: ntfyEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: NtfyKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			// An empty key sends no Authorization header at all. Without the
			// anonymous option an absent key throws instead: any garbage
			// Authorization header 401s on ntfy.sh, and core then asks the
			// tenant to connect.
			if (source === 'endpoint' && options.anonymous) return '';
			throw new AuthMissingError('ntfy', ctx.authType ?? 'api_key');
		},
	} satisfies InternalNtfyPlugin;
}

export { normalizeNtfyBaseUrl, ntfyErrorCode } from './client';

export type {
	AccountUsageInput,
	AccountUsageResponse,
	MessagesClearInput,
	MessagesClearResponse,
	MessagesDeleteInput,
	MessagesDeleteResponse,
	MessagesPollInput,
	MessagesPollResponse,
	MessagesSendInput,
	MessagesSendResponse,
	MessagesUpdateInput,
	MessagesUpdateResponse,
	NtfyEndpointInputs,
	NtfyEndpointOutputs,
	ServerHealthInput,
	ServerHealthResponse,
	ServerStatsInput,
	ServerStatsResponse,
} from './endpoints/types';
