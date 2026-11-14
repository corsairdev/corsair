import type {
	AuthTypes,
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
import { AuthMissingError, getOAuthAccessToken } from 'corsair/core';
import {
	getValidHelpScoutAccessToken,
	HELPSCOUT_AUTH_URL,
	HELPSCOUT_TOKEN_URL,
} from './client';
import {
	Conversations,
	Customers,
	CustomFields,
	Folders,
	Mailboxes,
	Reports,
	SavedReplies,
	Tags,
	Threads,
} from './endpoints';
import type {
	HelpScoutEndpointInputs,
	HelpScoutEndpointOutputs,
} from './endpoints/types';
import {
	HelpScoutEndpointInputSchemas,
	HelpScoutEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { HelpScoutSchema } from './schema';

export type HelpScoutPluginOptions = {
	authType?: PickAuth<'oauth_2'>;
	key?: string;
	/**
	 * Single-account mode for `oauth_2`: with no refresh token stored, mint a
	 * client-credentials token from the app's own id and secret (a Help Scout
	 * private app). That token reaches the account that owns the app, and the id
	 * and secret are shared by every tenant, so turn this on only when the app
	 * serves one Help Scout account. Off by default: a tenant without a refresh
	 * token must connect.
	 */
	clientCredentials?: boolean;
	hooks?: InternalHelpScoutPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof helpScoutEndpointsNested>;
};

export type HelpScoutContext = CorsairPluginContext<
	typeof HelpScoutSchema,
	HelpScoutPluginOptions
>;

/** Refresh this long before the recorded expiry. */
const TOKEN_REFRESH_BUFFER_SECONDS = 5 * 60;

export type HelpScoutKeyBuilderContext =
	KeyBuilderContext<HelpScoutPluginOptions>;

export type HelpScoutBoundEndpoints = BindEndpoints<
	typeof helpScoutEndpointsNested
>;

type HelpScoutEndpoint<K extends keyof HelpScoutEndpointOutputs> =
	CorsairEndpoint<
		HelpScoutContext,
		HelpScoutEndpointInputs[K],
		HelpScoutEndpointOutputs[K]
	>;

export type HelpScoutEndpoints = {
	[K in keyof HelpScoutEndpointOutputs]: HelpScoutEndpoint<K>;
};

const helpScoutEndpointsNested = {
	mailboxes: {
		list: Mailboxes.list,
		get: Mailboxes.get,
	},
	folders: {
		list: Folders.list,
	},
	customFields: {
		list: CustomFields.list,
	},
	conversations: {
		list: Conversations.list,
		get: Conversations.get,
		create: Conversations.create,
		update: Conversations.update,
		delete: Conversations.remove,
		updateFields: Conversations.updateFields,
		updateTags: Conversations.updateTags,
	},
	threads: {
		list: Threads.list,
		createReply: Threads.createReply,
		createNote: Threads.createNote,
		createChat: Threads.createChat,
		createPhone: Threads.createPhone,
		createCustomer: Threads.createCustomer,
		update: Threads.update,
		getOriginalSource: Threads.getOriginalSource,
	},
	customers: {
		list: Customers.list,
		get: Customers.get,
		create: Customers.create,
		update: Customers.update,
		patch: Customers.patch,
		delete: Customers.remove,
		createAddress: Customers.createAddress,
		updateAddress: Customers.updateAddress,
		deleteAddress: Customers.deleteAddress,
		createEmail: Customers.createEmail,
		updateEmail: Customers.updateEmail,
		deleteEmail: Customers.deleteEmail,
		createPhone: Customers.createPhone,
		updatePhone: Customers.updatePhone,
		deletePhone: Customers.deletePhone,
		createChat: Customers.createChat,
		updateChat: Customers.updateChat,
		deleteChat: Customers.deleteChat,
		createSocialProfile: Customers.createSocialProfile,
		updateSocialProfile: Customers.updateSocialProfile,
		deleteSocialProfile: Customers.deleteSocialProfile,
		createWebsite: Customers.createWebsite,
		updateWebsite: Customers.updateWebsite,
		deleteWebsite: Customers.deleteWebsite,
	},
	tags: {
		list: Tags.list,
		get: Tags.get,
	},
	savedReplies: {
		list: SavedReplies.list,
		get: SavedReplies.get,
		create: SavedReplies.create,
		update: SavedReplies.update,
		delete: SavedReplies.remove,
	},
	reports: {
		getConversations: Reports.getConversations,
		getCompany: Reports.getCompany,
		getEmail: Reports.getEmail,
		getChat: Reports.getChat,
		getDocs: Reports.getDocs,
	},
} as const;

export const helpScoutEndpointSchemas = {
	'mailboxes.list': {
		input: HelpScoutEndpointInputSchemas['mailboxes.list'],
		output: HelpScoutEndpointOutputSchemas['mailboxes.list'],
	},
	'mailboxes.get': {
		input: HelpScoutEndpointInputSchemas['mailboxes.get'],
		output: HelpScoutEndpointOutputSchemas['mailboxes.get'],
	},
	'folders.list': {
		input: HelpScoutEndpointInputSchemas['folders.list'],
		output: HelpScoutEndpointOutputSchemas['folders.list'],
	},
	'customFields.list': {
		input: HelpScoutEndpointInputSchemas['customFields.list'],
		output: HelpScoutEndpointOutputSchemas['customFields.list'],
	},
	'conversations.list': {
		input: HelpScoutEndpointInputSchemas['conversations.list'],
		output: HelpScoutEndpointOutputSchemas['conversations.list'],
	},
	'conversations.get': {
		input: HelpScoutEndpointInputSchemas['conversations.get'],
		output: HelpScoutEndpointOutputSchemas['conversations.get'],
	},
	'conversations.create': {
		input: HelpScoutEndpointInputSchemas['conversations.create'],
		output: HelpScoutEndpointOutputSchemas['conversations.create'],
	},
	'conversations.update': {
		input: HelpScoutEndpointInputSchemas['conversations.update'],
		output: HelpScoutEndpointOutputSchemas['conversations.update'],
	},
	'conversations.delete': {
		input: HelpScoutEndpointInputSchemas['conversations.delete'],
		output: HelpScoutEndpointOutputSchemas['conversations.delete'],
	},
	'conversations.updateFields': {
		input: HelpScoutEndpointInputSchemas['conversations.updateFields'],
		output: HelpScoutEndpointOutputSchemas['conversations.updateFields'],
	},
	'conversations.updateTags': {
		input: HelpScoutEndpointInputSchemas['conversations.updateTags'],
		output: HelpScoutEndpointOutputSchemas['conversations.updateTags'],
	},
	'threads.list': {
		input: HelpScoutEndpointInputSchemas['threads.list'],
		output: HelpScoutEndpointOutputSchemas['threads.list'],
	},
	'threads.createReply': {
		input: HelpScoutEndpointInputSchemas['threads.createReply'],
		output: HelpScoutEndpointOutputSchemas['threads.createReply'],
	},
	'threads.createNote': {
		input: HelpScoutEndpointInputSchemas['threads.createNote'],
		output: HelpScoutEndpointOutputSchemas['threads.createNote'],
	},
	'threads.createChat': {
		input: HelpScoutEndpointInputSchemas['threads.createChat'],
		output: HelpScoutEndpointOutputSchemas['threads.createChat'],
	},
	'threads.createPhone': {
		input: HelpScoutEndpointInputSchemas['threads.createPhone'],
		output: HelpScoutEndpointOutputSchemas['threads.createPhone'],
	},
	'threads.createCustomer': {
		input: HelpScoutEndpointInputSchemas['threads.createCustomer'],
		output: HelpScoutEndpointOutputSchemas['threads.createCustomer'],
	},
	'threads.update': {
		input: HelpScoutEndpointInputSchemas['threads.update'],
		output: HelpScoutEndpointOutputSchemas['threads.update'],
	},
	'threads.getOriginalSource': {
		input: HelpScoutEndpointInputSchemas['threads.getOriginalSource'],
		output: HelpScoutEndpointOutputSchemas['threads.getOriginalSource'],
	},
	'customers.list': {
		input: HelpScoutEndpointInputSchemas['customers.list'],
		output: HelpScoutEndpointOutputSchemas['customers.list'],
	},
	'customers.get': {
		input: HelpScoutEndpointInputSchemas['customers.get'],
		output: HelpScoutEndpointOutputSchemas['customers.get'],
	},
	'customers.create': {
		input: HelpScoutEndpointInputSchemas['customers.create'],
		output: HelpScoutEndpointOutputSchemas['customers.create'],
	},
	'customers.update': {
		input: HelpScoutEndpointInputSchemas['customers.update'],
		output: HelpScoutEndpointOutputSchemas['customers.update'],
	},
	'customers.patch': {
		input: HelpScoutEndpointInputSchemas['customers.patch'],
		output: HelpScoutEndpointOutputSchemas['customers.patch'],
	},
	'customers.delete': {
		input: HelpScoutEndpointInputSchemas['customers.delete'],
		output: HelpScoutEndpointOutputSchemas['customers.delete'],
	},
	'customers.createAddress': {
		input: HelpScoutEndpointInputSchemas['customers.createAddress'],
		output: HelpScoutEndpointOutputSchemas['customers.createAddress'],
	},
	'customers.updateAddress': {
		input: HelpScoutEndpointInputSchemas['customers.updateAddress'],
		output: HelpScoutEndpointOutputSchemas['customers.updateAddress'],
	},
	'customers.deleteAddress': {
		input: HelpScoutEndpointInputSchemas['customers.deleteAddress'],
		output: HelpScoutEndpointOutputSchemas['customers.deleteAddress'],
	},
	'customers.createEmail': {
		input: HelpScoutEndpointInputSchemas['customers.createEmail'],
		output: HelpScoutEndpointOutputSchemas['customers.createEmail'],
	},
	'customers.updateEmail': {
		input: HelpScoutEndpointInputSchemas['customers.updateEmail'],
		output: HelpScoutEndpointOutputSchemas['customers.updateEmail'],
	},
	'customers.deleteEmail': {
		input: HelpScoutEndpointInputSchemas['customers.deleteEmail'],
		output: HelpScoutEndpointOutputSchemas['customers.deleteEmail'],
	},
	'customers.createPhone': {
		input: HelpScoutEndpointInputSchemas['customers.createPhone'],
		output: HelpScoutEndpointOutputSchemas['customers.createPhone'],
	},
	'customers.updatePhone': {
		input: HelpScoutEndpointInputSchemas['customers.updatePhone'],
		output: HelpScoutEndpointOutputSchemas['customers.updatePhone'],
	},
	'customers.deletePhone': {
		input: HelpScoutEndpointInputSchemas['customers.deletePhone'],
		output: HelpScoutEndpointOutputSchemas['customers.deletePhone'],
	},
	'customers.createChat': {
		input: HelpScoutEndpointInputSchemas['customers.createChat'],
		output: HelpScoutEndpointOutputSchemas['customers.createChat'],
	},
	'customers.updateChat': {
		input: HelpScoutEndpointInputSchemas['customers.updateChat'],
		output: HelpScoutEndpointOutputSchemas['customers.updateChat'],
	},
	'customers.deleteChat': {
		input: HelpScoutEndpointInputSchemas['customers.deleteChat'],
		output: HelpScoutEndpointOutputSchemas['customers.deleteChat'],
	},
	'customers.createSocialProfile': {
		input: HelpScoutEndpointInputSchemas['customers.createSocialProfile'],
		output: HelpScoutEndpointOutputSchemas['customers.createSocialProfile'],
	},
	'customers.updateSocialProfile': {
		input: HelpScoutEndpointInputSchemas['customers.updateSocialProfile'],
		output: HelpScoutEndpointOutputSchemas['customers.updateSocialProfile'],
	},
	'customers.deleteSocialProfile': {
		input: HelpScoutEndpointInputSchemas['customers.deleteSocialProfile'],
		output: HelpScoutEndpointOutputSchemas['customers.deleteSocialProfile'],
	},
	'customers.createWebsite': {
		input: HelpScoutEndpointInputSchemas['customers.createWebsite'],
		output: HelpScoutEndpointOutputSchemas['customers.createWebsite'],
	},
	'customers.updateWebsite': {
		input: HelpScoutEndpointInputSchemas['customers.updateWebsite'],
		output: HelpScoutEndpointOutputSchemas['customers.updateWebsite'],
	},
	'customers.deleteWebsite': {
		input: HelpScoutEndpointInputSchemas['customers.deleteWebsite'],
		output: HelpScoutEndpointOutputSchemas['customers.deleteWebsite'],
	},
	'tags.list': {
		input: HelpScoutEndpointInputSchemas['tags.list'],
		output: HelpScoutEndpointOutputSchemas['tags.list'],
	},
	'tags.get': {
		input: HelpScoutEndpointInputSchemas['tags.get'],
		output: HelpScoutEndpointOutputSchemas['tags.get'],
	},
	'savedReplies.list': {
		input: HelpScoutEndpointInputSchemas['savedReplies.list'],
		output: HelpScoutEndpointOutputSchemas['savedReplies.list'],
	},
	'savedReplies.get': {
		input: HelpScoutEndpointInputSchemas['savedReplies.get'],
		output: HelpScoutEndpointOutputSchemas['savedReplies.get'],
	},
	'savedReplies.create': {
		input: HelpScoutEndpointInputSchemas['savedReplies.create'],
		output: HelpScoutEndpointOutputSchemas['savedReplies.create'],
	},
	'savedReplies.update': {
		input: HelpScoutEndpointInputSchemas['savedReplies.update'],
		output: HelpScoutEndpointOutputSchemas['savedReplies.update'],
	},
	'savedReplies.delete': {
		input: HelpScoutEndpointInputSchemas['savedReplies.delete'],
		output: HelpScoutEndpointOutputSchemas['savedReplies.delete'],
	},
	'reports.getConversations': {
		input: HelpScoutEndpointInputSchemas['reports.getConversations'],
		output: HelpScoutEndpointOutputSchemas['reports.getConversations'],
	},
	'reports.getCompany': {
		input: HelpScoutEndpointInputSchemas['reports.getCompany'],
		output: HelpScoutEndpointOutputSchemas['reports.getCompany'],
	},
	'reports.getEmail': {
		input: HelpScoutEndpointInputSchemas['reports.getEmail'],
		output: HelpScoutEndpointOutputSchemas['reports.getEmail'],
	},
	'reports.getChat': {
		input: HelpScoutEndpointInputSchemas['reports.getChat'],
		output: HelpScoutEndpointOutputSchemas['reports.getChat'],
	},
	'reports.getDocs': {
		input: HelpScoutEndpointInputSchemas['reports.getDocs'],
		output: HelpScoutEndpointOutputSchemas['reports.getDocs'],
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof helpScoutEndpointsNested
>;

const defaultAuthType: AuthTypes = 'oauth_2' as const;

export const helpScoutEndpointMeta = {
	'mailboxes.list': {
		riskLevel: 'read',
		description: 'List mailboxes in Help Scout',
	},
	'mailboxes.get': {
		riskLevel: 'read',
		description: 'Get details of a specific Help Scout mailbox',
	},
	'folders.list': {
		riskLevel: 'read',
		description: 'List folders belonging to a mailbox',
	},
	'customFields.list': {
		riskLevel: 'read',
		description: 'List custom fields configured on a mailbox',
	},
	'conversations.list': {
		riskLevel: 'read',
		description: 'List and filter conversations in Help Scout',
	},
	'conversations.get': {
		riskLevel: 'read',
		description: 'Get a specific Help Scout conversation by ID',
	},
	'conversations.create': {
		riskLevel: 'destructive',
		description: 'Create a new conversation with initial thread',
	},
	'conversations.update': {
		riskLevel: 'write',
		description: 'Update fields of a conversation via JSON Patch',
	},
	'conversations.delete': {
		riskLevel: 'destructive',
		description: 'Delete a conversation permanently',
	},
	'conversations.updateFields': {
		riskLevel: 'destructive',
		description: 'Update custom field values on a conversation',
	},
	'conversations.updateTags': {
		riskLevel: 'destructive',
		description: 'Update tags assigned to a conversation',
	},
	'threads.list': {
		riskLevel: 'read',
		description: 'List all threads in a conversation',
	},
	'threads.createReply': {
		riskLevel: 'destructive',
		description: 'Create a reply thread sent to the customer',
	},
	'threads.createNote': {
		riskLevel: 'write',
		description: 'Create an internal note thread on a conversation',
	},
	'threads.createChat': {
		riskLevel: 'write',
		description: 'Create a chat thread on a conversation',
	},
	'threads.createPhone': {
		riskLevel: 'write',
		description: 'Create a phone call log thread on a conversation',
	},
	'threads.createCustomer': {
		riskLevel: 'write',
		description: 'Create a customer message thread on a conversation',
	},
	'threads.update': {
		riskLevel: 'write',
		description: 'Update thread text or visibility',
	},
	'threads.getOriginalSource': {
		riskLevel: 'read',
		description: 'Get original email source of a thread',
	},
	'customers.list': {
		riskLevel: 'read',
		description: 'List and search customers in Help Scout',
	},
	'customers.get': {
		riskLevel: 'read',
		description: 'Get details of a specific customer by ID',
	},
	'customers.create': {
		riskLevel: 'write',
		description: 'Create a new customer profile',
	},
	'customers.update': {
		riskLevel: 'destructive',
		description: 'Overwrite an existing customer profile',
	},
	'customers.patch': {
		riskLevel: 'write',
		description: 'Partially update customer profile fields',
	},
	'customers.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a customer with their conversations and survey responses (cannot be undone)',
	},
	'customers.createAddress': {
		riskLevel: 'write',
		description: 'Create customer physical address',
	},
	'customers.updateAddress': {
		riskLevel: 'write',
		description: 'Update customer physical address',
	},
	'customers.deleteAddress': {
		riskLevel: 'destructive',
		description: 'Delete customer physical address',
	},
	'customers.createEmail': {
		riskLevel: 'write',
		description: 'Add an email address to a customer',
	},
	'customers.updateEmail': {
		riskLevel: 'write',
		description: 'Update an existing customer email address',
	},
	'customers.deleteEmail': {
		riskLevel: 'destructive',
		description: 'Delete an email address from a customer',
	},
	'customers.createPhone': {
		riskLevel: 'write',
		description: 'Add a phone number to a customer',
	},
	'customers.updatePhone': {
		riskLevel: 'write',
		description: 'Update an existing customer phone number',
	},
	'customers.deletePhone': {
		riskLevel: 'destructive',
		description: 'Delete a phone number from a customer',
	},
	'customers.createChat': {
		riskLevel: 'write',
		description: 'Add a chat handle to a customer',
	},
	'customers.updateChat': {
		riskLevel: 'write',
		description: 'Update an existing customer chat handle',
	},
	'customers.deleteChat': {
		riskLevel: 'destructive',
		description: 'Delete a chat handle from a customer',
	},
	'customers.createSocialProfile': {
		riskLevel: 'write',
		description: 'Add a social profile to a customer',
	},
	'customers.updateSocialProfile': {
		riskLevel: 'write',
		description: 'Update an existing customer social profile',
	},
	'customers.deleteSocialProfile': {
		riskLevel: 'destructive',
		description: 'Delete a social profile from a customer',
	},
	'customers.createWebsite': {
		riskLevel: 'write',
		description: 'Add a website URL to a customer',
	},
	'customers.updateWebsite': {
		riskLevel: 'write',
		description: 'Update an existing customer website URL',
	},
	'customers.deleteWebsite': {
		riskLevel: 'destructive',
		description: 'Delete a website URL from a customer',
	},
	'tags.list': {
		riskLevel: 'read',
		description: 'List all tags used across mailboxes',
	},
	'tags.get': {
		riskLevel: 'read',
		description: 'Get details of a tag by ID',
	},
	'savedReplies.list': {
		riskLevel: 'read',
		description: 'List saved replies for a mailbox',
	},
	'savedReplies.get': {
		riskLevel: 'read',
		description: 'Get a saved reply by ID',
	},
	'savedReplies.create': {
		riskLevel: 'write',
		description: 'Create a saved reply in a mailbox',
	},
	'savedReplies.update': {
		riskLevel: 'write',
		description: 'Update an existing saved reply',
	},
	'savedReplies.delete': {
		riskLevel: 'destructive',
		description: 'Delete a saved reply from a mailbox',
	},
	'reports.getConversations': {
		riskLevel: 'read',
		description: 'Get aggregate conversations report metrics',
	},
	'reports.getCompany': {
		riskLevel: 'read',
		description: 'Get overall company performance report metrics',
	},
	'reports.getEmail': {
		riskLevel: 'read',
		description: 'Get email channel performance report metrics',
	},
	'reports.getChat': {
		riskLevel: 'read',
		description: 'Get live chat channel report metrics',
	},
	'reports.getDocs': {
		riskLevel: 'read',
		description: 'Get Help Scout Docs knowledge base report metrics',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof helpScoutEndpointsNested
>;

// Help Scout has no API keys: apps get 2-day OAuth tokens, refreshed here.
export const helpScoutAuthConfig = {
	oauth_2: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseHelpScoutPlugin<T extends HelpScoutPluginOptions> =
	CorsairPlugin<
		'helpscout',
		typeof HelpScoutSchema,
		typeof helpScoutEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType
	>;

export type InternalHelpScoutPlugin =
	BaseHelpScoutPlugin<HelpScoutPluginOptions>;

export type ExternalHelpScoutPlugin<T extends HelpScoutPluginOptions> =
	BaseHelpScoutPlugin<T>;

export function helpscout<const T extends HelpScoutPluginOptions>(
	incomingOptions: HelpScoutPluginOptions & T = {} as HelpScoutPluginOptions &
		T,
): ExternalHelpScoutPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	const { DEFAULT: builtInDefault, ...builtIns } = errorHandlers;
	const { DEFAULT: callerDefault, ...callers } = options.errorHandlers ?? {};
	const mergedErrorHandlers = {
		...callers,
		...builtIns,
		...callers,
		DEFAULT: callerDefault ?? builtInDefault,
	};

	return {
		id: 'helpscout',
		authConfig: helpScoutAuthConfig,
		schema: HelpScoutSchema,
		options,
		oauthConfig: {
			providerName: 'Help Scout',
			authUrl: HELPSCOUT_AUTH_URL,
			tokenUrl: HELPSCOUT_TOKEN_URL,
			// Help Scout apps have no scopes; the redirect URL is set on the app
			scopes: [],
			requiresRegisteredRedirect: true,
		},
		hooks: options.hooks,
		endpoints: helpScoutEndpointsNested,
		webhooks: {},
		endpointMeta: helpScoutEndpointMeta,
		endpointSchemas: helpScoutEndpointSchemas,
		errorHandlers: mergedErrorHandlers,
		keyBuilder: async (ctx: HelpScoutKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key) return options.key;
			if (!ctx.keys || ctx.authType !== 'oauth_2') {
				throw new AuthMissingError('helpscout', 'oauth_2');
			}
			const [credentials, refreshToken] = await Promise.all([
				ctx.keys.get_integration_credentials(),
				ctx.keys.get_refresh_token(),
			]);
			// Single-account mode only: with no refresh token stored, mint a
			// client-credentials token from the app's own id and secret. That
			// token reaches the Help Scout account that owns the app, and every
			// tenant shares the id and secret, so elsewhere a tenant without a
			// refresh token gets AuthMissingError and is asked to connect.
			if (
				options.clientCredentials === true &&
				!refreshToken &&
				credentials.client_id &&
				credentials.client_secret
			) {
				const keys = ctx.keys;
				const clientId = credentials.client_id;
				const clientSecret = credentials.client_secret;
				const mint = async (): Promise<string> => {
					const token = await getValidHelpScoutAccessToken({
						clientId,
						clientSecret,
						forceRefresh: true,
					});
					// Token first, then its expiry: a new expiry beside the old
					// token would keep a dead token "fresh".
					await keys.set_access_token(token.accessToken);
					await keys.set_expires_at(String(token.expiresAt));
					return token.accessToken;
				};
				// unknown: `_refreshAuth` is read by core's request path after a
				// 401 and is not part of the declared context type.
				(ctx as Record<string, unknown>)._refreshAuth = mint;
				const [accessToken, expiresAt] = await Promise.all([
					keys.get_access_token(),
					keys.get_expires_at(),
				]);
				const now = Math.floor(Date.now() / 1000);
				if (
					accessToken &&
					expiresAt &&
					Number(expiresAt) > now + TOKEN_REFRESH_BUFFER_SECONDS
				) {
					return accessToken;
				}
				return mint();
			}
			// Authorization-code connections: core refreshes with the refresh
			// token (Help Scout takes the client id and secret in the form body),
			// or through Hub when the app secret stays there, and installs the
			// forced refresh core uses after a 401.
			return getOAuthAccessToken(ctx, {
				plugin: 'helpscout',
				tokenUrl: HELPSCOUT_TOKEN_URL,
			});
		},
	} satisfies InternalHelpScoutPlugin;
}

export type {
	HelpScoutEndpointInputs,
	HelpScoutEndpointOutputs,
} from './endpoints/types';
