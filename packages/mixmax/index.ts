import type {
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import type { AuthTypes } from 'corsair/core';
import type {
	MixmaxEndpointInputs,
	MixmaxEndpointOutputs,
} from './endpoints/types';
import {
	MixmaxEndpointInputSchemas,
	MixmaxEndpointOutputSchemas,
} from './endpoints/types';
import type {
	MixmaxWebhookOutputs,
	MixmaxEvent,
} from './webhooks/types';
import { MixmaxEventSchema } from './webhooks/types';
import { Messages, Sequences, Snippets, Users } from './endpoints';
import { MixmaxSchema } from './schema';
import { MixmaxWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchMixmaxTenantWebhook } from './webhooks/tenant-matcher';
import { resolveMixmaxOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type MixmaxPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalMixmaxPlugin['hooks'];
	webhookHooks?: InternalMixmaxPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof mixmaxEndpointsNested>;
};

export type MixmaxContext = CorsairPluginContext<
	typeof MixmaxSchema,
	MixmaxPluginOptions
>;

export type MixmaxKeyBuilderContext = KeyBuilderContext<MixmaxPluginOptions>;

export type MixmaxBoundEndpoints = BindEndpoints<typeof mixmaxEndpointsNested>;

type MixmaxEndpoint<
	K extends keyof MixmaxEndpointOutputs,
> = CorsairEndpoint<
	MixmaxContext,
	MixmaxEndpointInputs[K],
	MixmaxEndpointOutputs[K]
>;

export type MixmaxEndpoints = {
	messagesList: MixmaxEndpoint<'messagesList'>;
	messagesCreate: MixmaxEndpoint<'messagesCreate'>;
	messagesGet: MixmaxEndpoint<'messagesGet'>;
	messagesUpdate: MixmaxEndpoint<'messagesUpdate'>;
	messagesSend: MixmaxEndpoint<'messagesSend'>;
	messagesSchedule: MixmaxEndpoint<'messagesSchedule'>;
	messagesUnschedule: MixmaxEndpoint<'messagesUnschedule'>;
	messagesTest: MixmaxEndpoint<'messagesTest'>;
	messagesSendPlain: MixmaxEndpoint<'messagesSendPlain'>;
	sequencesList: MixmaxEndpoint<'sequencesList'>;
	sequencesGetRecipients: MixmaxEndpoint<'sequencesGetRecipients'>;
	sequencesAddRecipients: MixmaxEndpoint<'sequencesAddRecipients'>;
	sequencesGet: MixmaxEndpoint<'sequencesGet'>;
	sequencesCreate: MixmaxEndpoint<'sequencesCreate'>;
	sequencesUpdate: MixmaxEndpoint<'sequencesUpdate'>;
	sequencesDelete: MixmaxEndpoint<'sequencesDelete'>;
	sequencesPause: MixmaxEndpoint<'sequencesPause'>;
	sequencesResume: MixmaxEndpoint<'sequencesResume'>;
	snippetsList: MixmaxEndpoint<'snippetsList'>;
	snippetsGet: MixmaxEndpoint<'snippetsGet'>;
	snippetsCreate: MixmaxEndpoint<'snippetsCreate'>;
	snippetsUpdate: MixmaxEndpoint<'snippetsUpdate'>;
	snippetsDelete: MixmaxEndpoint<'snippetsDelete'>;
	usersGetMe: MixmaxEndpoint<'usersGetMe'>;
	userPreferencesGet: MixmaxEndpoint<'userPreferencesGet'>;
	userPreferencesUpdate: MixmaxEndpoint<'userPreferencesUpdate'>;
	usersGet: MixmaxEndpoint<'usersGet'>;
	usersUpdatePassword: MixmaxEndpoint<'usersUpdatePassword'>;
	usersUpdateSubscription: MixmaxEndpoint<'usersUpdateSubscription'>;
};

type MixmaxWebhook<K extends keyof MixmaxWebhookOutputs, TEvent> =
	CorsairWebhook<MixmaxContext, TEvent, MixmaxWebhookOutputs[K]>;

export type MixmaxWebhooks = {
	example: MixmaxWebhook<'example', MixmaxEvent>;
};

export type MixmaxBoundWebhooks = BindWebhooks<MixmaxWebhooks>;

const mixmaxEndpointsNested = {
	messages: {
		list: Messages.list,
		create: Messages.create,
		get: Messages.get,
		update: Messages.update,
		send: Messages.send,
		schedule: Messages.schedule,
		unschedule: Messages.unschedule,
		test: Messages.test,
		sendPlain: Messages.sendPlain,
	},
	sequences: {
		list: Sequences.list,
		getRecipients: Sequences.getRecipients,
		addRecipients: Sequences.addRecipients,
		get: Sequences.get,
		create: Sequences.create,
		update: Sequences.update,
		delete: Sequences.delete,
		pause: Sequences.pause,
		resume: Sequences.resume,
	},
	snippets: {
		list: Snippets.list,
		get: Snippets.get,
		create: Snippets.create,
		update: Snippets.update,
		delete: Snippets.delete,
	},
	users: {
		getMe: Users.getMe,
		preferences: {
			get: Users.preferences.get,
			update: Users.preferences.update,
		},
		get: Users.get,
		updatePassword: Users.updatePassword,
		updateSubscription: Users.updateSubscription,
	},
} as const;

const mixmaxWebhooksNested = {
	example: {
		example: MixmaxWebhooks.example,
	},
} as const;

export const mixmaxEndpointSchemas = {
	'messages.list': {
		input: MixmaxEndpointInputSchemas.messagesList,
		output: MixmaxEndpointOutputSchemas.messagesList,
	},
	'messages.create': {
		input: MixmaxEndpointInputSchemas.messagesCreate,
		output: MixmaxEndpointOutputSchemas.messagesCreate,
	},
	'messages.get': {
		input: MixmaxEndpointInputSchemas.messagesGet,
		output: MixmaxEndpointOutputSchemas.messagesGet,
	},
	'messages.update': {
		input: MixmaxEndpointInputSchemas.messagesUpdate,
		output: MixmaxEndpointOutputSchemas.messagesUpdate,
	},
	'messages.send': {
		input: MixmaxEndpointInputSchemas.messagesSend,
		output: MixmaxEndpointOutputSchemas.messagesSend,
	},
	'messages.schedule': {
		input: MixmaxEndpointInputSchemas.messagesSchedule,
		output: MixmaxEndpointOutputSchemas.messagesSchedule,
	},
	'messages.unschedule': {
		input: MixmaxEndpointInputSchemas.messagesUnschedule,
		output: MixmaxEndpointOutputSchemas.messagesUnschedule,
	},
	'messages.test': {
		input: MixmaxEndpointInputSchemas.messagesTest,
		output: MixmaxEndpointOutputSchemas.messagesTest,
	},
	'messages.sendPlain': {
		input: MixmaxEndpointInputSchemas.messagesSendPlain,
		output: MixmaxEndpointOutputSchemas.messagesSendPlain,
	},
	'sequences.list': {
		input: MixmaxEndpointInputSchemas.sequencesList,
		output: MixmaxEndpointOutputSchemas.sequencesList,
	},
	'sequences.getRecipients': {
		input: MixmaxEndpointInputSchemas.sequencesGetRecipients,
		output: MixmaxEndpointOutputSchemas.sequencesGetRecipients,
	},
	'sequences.addRecipients': {
		input: MixmaxEndpointInputSchemas.sequencesAddRecipients,
		output: MixmaxEndpointOutputSchemas.sequencesAddRecipients,
	},
	'snippets.list': {
		input: MixmaxEndpointInputSchemas.snippetsList,
		output: MixmaxEndpointOutputSchemas.snippetsList,
	},
	'snippets.get': {
		input: MixmaxEndpointInputSchemas.snippetsGet,
		output: MixmaxEndpointOutputSchemas.snippetsGet,
	},
	'users.getMe': {
		input: MixmaxEndpointInputSchemas.usersGetMe,
		output: MixmaxEndpointOutputSchemas.usersGetMe,
	},
	'userPreferences.get': {
		input: MixmaxEndpointInputSchemas.userPreferencesGet,
		output: MixmaxEndpointOutputSchemas.userPreferencesGet,
	},
	'userPreferences.update': {
		input: MixmaxEndpointInputSchemas.userPreferencesUpdate,
		output: MixmaxEndpointOutputSchemas.userPreferencesUpdate,
	},
	'sequences.get': {
		input: MixmaxEndpointInputSchemas.sequencesGet,
		output: MixmaxEndpointOutputSchemas.sequencesGet,
	},
	'sequences.create': {
		input: MixmaxEndpointInputSchemas.sequencesCreate,
		output: MixmaxEndpointOutputSchemas.sequencesCreate,
	},
	'sequences.update': {
		input: MixmaxEndpointInputSchemas.sequencesUpdate,
		output: MixmaxEndpointOutputSchemas.sequencesUpdate,
	},
	'sequences.delete': {
		input: MixmaxEndpointInputSchemas.sequencesDelete,
		output: MixmaxEndpointOutputSchemas.sequencesDelete,
	},
	'sequences.pause': {
		input: MixmaxEndpointInputSchemas.sequencesPause,
		output: MixmaxEndpointOutputSchemas.sequencesPause,
	},
	'sequences.resume': {
		input: MixmaxEndpointInputSchemas.sequencesResume,
		output: MixmaxEndpointOutputSchemas.sequencesResume,
	},
	'snippets.create': {
		input: MixmaxEndpointInputSchemas.snippetsCreate,
		output: MixmaxEndpointOutputSchemas.snippetsCreate,
	},
	'snippets.update': {
		input: MixmaxEndpointInputSchemas.snippetsUpdate,
		output: MixmaxEndpointOutputSchemas.snippetsUpdate,
	},
	'snippets.delete': {
		input: MixmaxEndpointInputSchemas.snippetsDelete,
		output: MixmaxEndpointOutputSchemas.snippetsDelete,
	},
	'users.get': {
		input: MixmaxEndpointInputSchemas.usersGet,
		output: MixmaxEndpointOutputSchemas.usersGet,
	},
	'users.updatePassword': {
		input: MixmaxEndpointInputSchemas.usersUpdatePassword,
		output: MixmaxEndpointOutputSchemas.usersUpdatePassword,
	},
	'users.updateSubscription': {
		input: MixmaxEndpointInputSchemas.usersUpdateSubscription,
		output: MixmaxEndpointOutputSchemas.usersUpdateSubscription,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof mixmaxEndpointsNested
>;

export const mixmaxEndpointMeta = {
	'messages.list': {
		riskLevel: 'read',
		description: 'List Mixmax messages',
	},
	'messages.create': {
		riskLevel: 'write',
		description: 'Create a Mixmax draft message',
	},
	'messages.get': {
		riskLevel: 'read',
		description: 'Get a Mixmax message by ID',
	},
	'messages.update': {
		riskLevel: 'write',
		description: 'Update a Mixmax message',
	},
	'messages.send': {
		riskLevel: 'write',
		description: 'Send a saved Mixmax draft message',
	},
	'messages.schedule': {
		riskLevel: 'write',
		description: 'Schedule a Mixmax message to send later',
	},
	'messages.unschedule': {
		riskLevel: 'write',
		description: 'Cancel a scheduled Mixmax message send',
	},
	'messages.test': {
		riskLevel: 'write',
		description: 'Send a test email to yourself via Mixmax',
	},
	'messages.sendPlain': {
		riskLevel: 'write',
		description: 'Send a plain email via Mixmax',
	},
	'sequences.list': {
		riskLevel: 'read',
		description: 'List Mixmax sequences',
	},
	'sequences.getRecipients': {
		riskLevel: 'read',
		description: 'Get recipients of a Mixmax sequence',
	},
	'sequences.addRecipients': {
		riskLevel: 'write',
		description: 'Add recipients to a Mixmax sequence',
	},
	'snippets.list': {
		riskLevel: 'read',
		description: 'List Mixmax templates (snippets)',
	},
	'snippets.get': {
		riskLevel: 'read',
		description: 'Get a Mixmax template by ID',
	},
	'users.getMe': {
		riskLevel: 'read',
		description: 'Get the current Mixmax user',
	},
	'userPreferences.get': {
		riskLevel: 'read',
		description: 'Get Mixmax user preferences',
	},
	'userPreferences.update': {
		riskLevel: 'write',
		description: 'Update Mixmax user preferences',
	},
	'sequences.get': {
		riskLevel: 'read',
		description: 'Get a Mixmax sequence by ID',
	},
	'sequences.create': {
		riskLevel: 'write',
		description: 'Create a Mixmax sequence',
	},
	'sequences.update': {
		riskLevel: 'write',
		description: 'Update a Mixmax sequence',
	},
	'sequences.delete': {
		riskLevel: 'write',
		description: 'Delete a Mixmax sequence',
	},
	'sequences.pause': {
		riskLevel: 'write',
		description: 'Pause a Mixmax sequence',
	},
	'sequences.resume': {
		riskLevel: 'write',
		description: 'Resume a Mixmax sequence',
	},
	'snippets.create': {
		riskLevel: 'write',
		description: 'Create a Mixmax snippet',
	},
	'snippets.update': {
		riskLevel: 'write',
		description: 'Update a Mixmax snippet',
	},
	'snippets.delete': {
		riskLevel: 'write',
		description: 'Delete a Mixmax snippet',
	},
	'users.get': {
		riskLevel: 'read',
		description: 'Get a Mixmax user by ID',
	},
	'users.updatePassword': {
		riskLevel: 'write',
		description: 'Update a Mixmax user password',
	},
	'users.updateSubscription': {
		riskLevel: 'write',
		description: 'Update a Mixmax user subscription plan',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof mixmaxEndpointsNested
>;

export const mixmaxAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseMixmaxPlugin<T extends MixmaxPluginOptions> = CorsairPlugin<
	'mixmax',
	typeof MixmaxSchema,
	typeof mixmaxEndpointsNested,
	typeof mixmaxWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalMixmaxPlugin = BaseMixmaxPlugin<MixmaxPluginOptions>;

export type ExternalMixmaxPlugin<T extends MixmaxPluginOptions> =
	BaseMixmaxPlugin<T>;

export function mixmax<const T extends MixmaxPluginOptions>(
	incomingOptions: MixmaxPluginOptions & T = {} as MixmaxPluginOptions & T,
): ExternalMixmaxPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'mixmax',
		authConfig: mixmaxAuthConfig,
		schema: MixmaxSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: mixmaxEndpointsNested,
		webhooks: mixmaxWebhooksNested,
		endpointMeta: mixmaxEndpointMeta,
		endpointSchemas: mixmaxEndpointSchemas,
		webhookSchemas: mixmaxWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			return 'x-mixmax-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchMixmaxTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveMixmaxOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: MixmaxKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();
				return res ?? '';
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				const res = await ctx.keys.get_access_token();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalMixmaxPlugin;
}

export type {
	MixmaxEvent,
	MixmaxWebhookOutputs,
} from './webhooks/types';

export type {
	MixmaxEndpointInputs,
	MixmaxEndpointOutputs,
} from './endpoints/types';