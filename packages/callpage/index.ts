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
import {
	Calls,
	Managers,
	Root,
	Sms,
	Users,
	VoiceMessages,
	Widgets,
} from './endpoints';
import type {
	CallPageEndpointInputs,
	CallPageEndpointOutputs,
} from './endpoints/types';
import {
	CallPageEndpointInputSchemas,
	CallPageEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { CallPageSchema } from './schema';

export const callPageAuthConfig = {
	api_key: { account: ['tenant_external_id'] as const },
} as const satisfies PluginAuthConfig;

export type CallPagePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalCallPagePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof callPageEndpointsNested>;
};

export type CallPageContext = CorsairPluginContext<
	typeof CallPageSchema,
	CallPagePluginOptions
>;
export type CallPageKeyBuilderContext = KeyBuilderContext<
	CallPagePluginOptions,
	typeof callPageAuthConfig
>;

type CallPageEndpoint<K extends keyof CallPageEndpointOutputs> =
	CorsairEndpoint<
		CallPageContext,
		CallPageEndpointInputs[K],
		CallPageEndpointOutputs[K]
	>;

export type CallPageEndpoints = {
	callsGet: CallPageEndpoint<'callsGet'>;
	callsHistory: CallPageEndpoint<'callsHistory'>;
	usersList: CallPageEndpoint<'usersList'>;
	usersGet: CallPageEndpoint<'usersGet'>;
	usersCreate: CallPageEndpoint<'usersCreate'>;
	usersUpdate: CallPageEndpoint<'usersUpdate'>;
	usersDelete: CallPageEndpoint<'usersDelete'>;
	widgetsGet: CallPageEndpoint<'widgetsGet'>;
	widgetsCreate: CallPageEndpoint<'widgetsCreate'>;
	widgetsUpdate: CallPageEndpoint<'widgetsUpdate'>;
	widgetsDelete: CallPageEndpoint<'widgetsDelete'>;
	widgetsCall: CallPageEndpoint<'widgetsCall'>;
	widgetsCallOrSchedule: CallPageEndpoint<'widgetsCallOrSchedule'>;
	rootGet: CallPageEndpoint<'rootGet'>;
	widgetsList: CallPageEndpoint<'widgetsList'>;
	widgetsAddUsers: CallPageEndpoint<'widgetsAddUsers'>;
	managersList: CallPageEndpoint<'managersList'>;
	managersGet: CallPageEndpoint<'managersGet'>;
	managersCreate: CallPageEndpoint<'managersCreate'>;
	managersUpdate: CallPageEndpoint<'managersUpdate'>;
	managersDelete: CallPageEndpoint<'managersDelete'>;
	managersStatusStatistics: CallPageEndpoint<'managersStatusStatistics'>;
	smsList: CallPageEndpoint<'smsList'>;
	smsCreate: CallPageEndpoint<'smsCreate'>;
	smsUpdate: CallPageEndpoint<'smsUpdate'>;
	smsReset: CallPageEndpoint<'smsReset'>;
	voiceMessagesList: CallPageEndpoint<'voiceMessagesList'>;
	voiceMessagesCreate: CallPageEndpoint<'voiceMessagesCreate'>;
	voiceMessagesUpdate: CallPageEndpoint<'voiceMessagesUpdate'>;
	voiceMessagesReset: CallPageEndpoint<'voiceMessagesReset'>;
};

export type CallPageBoundEndpoints = BindEndpoints<
	typeof callPageEndpointsNested
>;

const callPageEndpointsNested = {
	root: { get: Root.get },
	calls: { get: Calls.get, history: Calls.history },
	users: {
		list: Users.list,
		get: Users.get,
		create: Users.create,
		update: Users.update,
		delete: Users.remove,
	},
	widgets: {
		get: Widgets.get,
		create: Widgets.create,
		update: Widgets.update,
		delete: Widgets.remove,
		call: Widgets.call,
		callOrSchedule: Widgets.callOrSchedule,
		list: Widgets.list,
		addUsers: Widgets.addUsers,
	},
	managers: {
		list: Managers.list,
		get: Managers.get,
		create: Managers.create,
		update: Managers.update,
		delete: Managers.remove,
		statusStatistics: Managers.statusStatistics,
	},
	sms: {
		list: Sms.list,
		create: Sms.create,
		update: Sms.update,
		reset: Sms.reset,
	},
	voiceMessages: {
		list: VoiceMessages.list,
		create: VoiceMessages.create,
		update: VoiceMessages.update,
		reset: VoiceMessages.reset,
	},
} as const;

export const callPageEndpointSchemas = {
	'calls.get': {
		input: CallPageEndpointInputSchemas.callsGet,
		output: CallPageEndpointOutputSchemas.callsGet,
	},
	'calls.history': {
		input: CallPageEndpointInputSchemas.callsHistory,
		output: CallPageEndpointOutputSchemas.callsHistory,
	},
	'users.list': {
		input: CallPageEndpointInputSchemas.usersList,
		output: CallPageEndpointOutputSchemas.usersList,
	},
	'users.get': {
		input: CallPageEndpointInputSchemas.usersGet,
		output: CallPageEndpointOutputSchemas.usersGet,
	},
	'users.create': {
		input: CallPageEndpointInputSchemas.usersCreate,
		output: CallPageEndpointOutputSchemas.usersCreate,
	},
	'users.update': {
		input: CallPageEndpointInputSchemas.usersUpdate,
		output: CallPageEndpointOutputSchemas.usersUpdate,
	},
	'users.delete': {
		input: CallPageEndpointInputSchemas.usersDelete,
		output: CallPageEndpointOutputSchemas.usersDelete,
	},
	'widgets.get': {
		input: CallPageEndpointInputSchemas.widgetsGet,
		output: CallPageEndpointOutputSchemas.widgetsGet,
	},
	'widgets.create': {
		input: CallPageEndpointInputSchemas.widgetsCreate,
		output: CallPageEndpointOutputSchemas.widgetsCreate,
	},
	'widgets.update': {
		input: CallPageEndpointInputSchemas.widgetsUpdate,
		output: CallPageEndpointOutputSchemas.widgetsUpdate,
	},
	'widgets.delete': {
		input: CallPageEndpointInputSchemas.widgetsDelete,
		output: CallPageEndpointOutputSchemas.widgetsDelete,
	},
	'widgets.call': {
		input: CallPageEndpointInputSchemas.widgetsCall,
		output: CallPageEndpointOutputSchemas.widgetsCall,
	},
	'widgets.callOrSchedule': {
		input: CallPageEndpointInputSchemas.widgetsCallOrSchedule,
		output: CallPageEndpointOutputSchemas.widgetsCallOrSchedule,
	},
	'root.get': {
		input: CallPageEndpointInputSchemas.rootGet,
		output: CallPageEndpointOutputSchemas.rootGet,
	},
	'widgets.list': {
		input: CallPageEndpointInputSchemas.widgetsList,
		output: CallPageEndpointOutputSchemas.widgetsList,
	},
	'widgets.addUsers': {
		input: CallPageEndpointInputSchemas.widgetsAddUsers,
		output: CallPageEndpointOutputSchemas.widgetsAddUsers,
	},
	'managers.list': {
		input: CallPageEndpointInputSchemas.managersList,
		output: CallPageEndpointOutputSchemas.managersList,
	},
	'managers.get': {
		input: CallPageEndpointInputSchemas.managersGet,
		output: CallPageEndpointOutputSchemas.managersGet,
	},
	'managers.create': {
		input: CallPageEndpointInputSchemas.managersCreate,
		output: CallPageEndpointOutputSchemas.managersCreate,
	},
	'managers.update': {
		input: CallPageEndpointInputSchemas.managersUpdate,
		output: CallPageEndpointOutputSchemas.managersUpdate,
	},
	'managers.delete': {
		input: CallPageEndpointInputSchemas.managersDelete,
		output: CallPageEndpointOutputSchemas.managersDelete,
	},
	'managers.statusStatistics': {
		input: CallPageEndpointInputSchemas.managersStatusStatistics,
		output: CallPageEndpointOutputSchemas.managersStatusStatistics,
	},
	'sms.list': {
		input: CallPageEndpointInputSchemas.smsList,
		output: CallPageEndpointOutputSchemas.smsList,
	},
	'sms.create': {
		input: CallPageEndpointInputSchemas.smsCreate,
		output: CallPageEndpointOutputSchemas.smsCreate,
	},
	'sms.update': {
		input: CallPageEndpointInputSchemas.smsUpdate,
		output: CallPageEndpointOutputSchemas.smsUpdate,
	},
	'sms.reset': {
		input: CallPageEndpointInputSchemas.smsReset,
		output: CallPageEndpointOutputSchemas.smsReset,
	},
	'voiceMessages.list': {
		input: CallPageEndpointInputSchemas.voiceMessagesList,
		output: CallPageEndpointOutputSchemas.voiceMessagesList,
	},
	'voiceMessages.create': {
		input: CallPageEndpointInputSchemas.voiceMessagesCreate,
		output: CallPageEndpointOutputSchemas.voiceMessagesCreate,
	},
	'voiceMessages.update': {
		input: CallPageEndpointInputSchemas.voiceMessagesUpdate,
		output: CallPageEndpointOutputSchemas.voiceMessagesUpdate,
	},
	'voiceMessages.reset': {
		input: CallPageEndpointInputSchemas.voiceMessagesReset,
		output: CallPageEndpointOutputSchemas.voiceMessagesReset,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof callPageEndpointsNested
>;

const callPageEndpointMeta = {
	'calls.get': { riskLevel: 'read', description: 'Get a CallPage call by ID.' },
	'calls.history': {
		riskLevel: 'read',
		description: 'List and filter CallPage call history.',
	},
	'users.list': { riskLevel: 'read', description: 'List CallPage users.' },
	'users.get': { riskLevel: 'read', description: 'Get a CallPage user.' },
	'users.create': {
		riskLevel: 'write',
		description: 'Create a CallPage user.',
	},
	'users.update': {
		riskLevel: 'write',
		description: 'Update a CallPage user.',
	},
	'users.delete': {
		riskLevel: 'destructive',
		description: 'Delete a CallPage user.',
	},
	'widgets.get': { riskLevel: 'read', description: 'Get a CallPage widget.' },
	'widgets.create': {
		riskLevel: 'write',
		description: 'Create a CallPage widget.',
	},
	'widgets.update': {
		riskLevel: 'write',
		description: 'Update a CallPage widget.',
	},
	'widgets.delete': {
		riskLevel: 'destructive',
		description: 'Delete a CallPage widget.',
	},
	'widgets.call': {
		riskLevel: 'write',
		description: 'Initiate a CallPage widget call.',
	},
	'widgets.callOrSchedule': {
		riskLevel: 'write',
		description: 'Initiate or schedule a CallPage widget call.',
	},
	'root.get': {
		riskLevel: 'read',
		description: 'Get the CallPage API root greeting to verify connectivity.',
	},
	'widgets.list': {
		riskLevel: 'read',
		description: 'List CallPage widgets with pagination.',
	},
	'widgets.addUsers': {
		riskLevel: 'write',
		description: 'Add users to a CallPage widget as managers.',
	},
	'managers.list': {
		riskLevel: 'read',
		description: 'List managers for a CallPage widget with pagination.',
	},
	'managers.get': {
		riskLevel: 'read',
		description: 'Get a CallPage manager by user and widget.',
	},
	'managers.create': {
		riskLevel: 'write',
		description: 'Create a CallPage manager for a widget.',
	},
	'managers.update': {
		riskLevel: 'write',
		description: 'Update a CallPage manager.',
	},
	'managers.delete': {
		riskLevel: 'destructive',
		description: 'Delete a CallPage manager from a widget.',
	},
	'managers.statusStatistics': {
		riskLevel: 'read',
		description: 'Count enabled and disabled managers for a CallPage widget.',
	},
	'sms.list': {
		riskLevel: 'read',
		description: 'List SMS messages for a CallPage widget.',
	},
	'sms.create': {
		riskLevel: 'write',
		description: 'Create a custom SMS message for a CallPage widget.',
	},
	'sms.update': {
		riskLevel: 'write',
		description: 'Update a custom SMS message for a CallPage widget.',
	},
	'sms.reset': {
		riskLevel: 'destructive',
		description: 'Reset CallPage widget SMS messages to defaults.',
	},
	'voiceMessages.list': {
		riskLevel: 'read',
		description: 'List voice messages for a CallPage widget.',
	},
	'voiceMessages.create': {
		riskLevel: 'write',
		description: 'Create a custom voice message for a CallPage widget.',
	},
	'voiceMessages.update': {
		riskLevel: 'write',
		description: 'Update a custom voice message for a CallPage widget.',
	},
	'voiceMessages.reset': {
		riskLevel: 'destructive',
		description: 'Reset CallPage widget voice messages to defaults.',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof callPageEndpointsNested>;

const defaultAuthType = 'api_key' as const;

export type BaseCallPagePlugin<T extends CallPagePluginOptions> = CorsairPlugin<
	'callpage',
	typeof CallPageSchema,
	typeof callPageEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType,
	typeof callPageAuthConfig
>;
export type InternalCallPagePlugin = BaseCallPagePlugin<CallPagePluginOptions>;
export type ExternalCallPagePlugin<T extends CallPagePluginOptions> =
	BaseCallPagePlugin<T>;

// Safe: every option is optional, so an empty object satisfies the options type.
// A narrower type is not practical because a conditional type over the generic T cannot express an empty default.
export function callpage<const T extends CallPagePluginOptions>(
	incomingOptions: CallPagePluginOptions & T = {} as CallPagePluginOptions & T,
): ExternalCallPagePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'callpage',
		schema: CallPageSchema,
		options,
		hooks: options.hooks,
		endpoints: callPageEndpointsNested,
		webhooks: {},
		authConfig: callPageAuthConfig,
		endpointMeta: callPageEndpointMeta,
		endpointSchemas: callPageEndpointSchemas,
		webhookSchemas: {},
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: CallPageKeyBuilderContext) => {
			if (options.key) return options.key;

			if (ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
				throw new AuthMissingError('callpage', 'api_key');
			}

			throw new AuthMissingError('callpage', 'api_key');
		},
	} satisfies InternalCallPagePlugin;
}
