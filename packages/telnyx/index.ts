import type {
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { Calls, Messages, MessagingProfiles, PhoneNumbers } from './endpoints';
import type {
	TelnyxEndpointInputs,
	TelnyxEndpointOutputs,
} from './endpoints/types';
import {
	TelnyxEndpointInputSchemas,
	TelnyxEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { TelnyxSchema } from './schema';

export type TelnyxPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalTelnyxPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof telnyxEndpointsNested>;
};

export type TelnyxContext = CorsairPluginContext<
	typeof TelnyxSchema,
	TelnyxPluginOptions
>;

export type TelnyxKeyBuilderContext = KeyBuilderContext<TelnyxPluginOptions>;

export type TelnyxBoundEndpoints = BindEndpoints<typeof telnyxEndpointsNested>;

type TelnyxEndpoint<K extends keyof TelnyxEndpointOutputs> = CorsairEndpoint<
	TelnyxContext,
	TelnyxEndpointInputs[K],
	TelnyxEndpointOutputs[K]
>;

export type TelnyxEndpoints = {
	messagesSend: TelnyxEndpoint<'messagesSend'>;
	messagesGet: TelnyxEndpoint<'messagesGet'>;
	messagesRemove: TelnyxEndpoint<'messagesRemove'>;
	messagingProfilesList: TelnyxEndpoint<'messagingProfilesList'>;
	messagingProfilesGet: TelnyxEndpoint<'messagingProfilesGet'>;
	messagingProfilesCreate: TelnyxEndpoint<'messagingProfilesCreate'>;
	messagingProfilesUpdate: TelnyxEndpoint<'messagingProfilesUpdate'>;
	messagingProfilesRemove: TelnyxEndpoint<'messagingProfilesRemove'>;
	phoneNumbersList: TelnyxEndpoint<'phoneNumbersList'>;
	phoneNumbersGet: TelnyxEndpoint<'phoneNumbersGet'>;
	phoneNumbersUpdate: TelnyxEndpoint<'phoneNumbersUpdate'>;
	phoneNumbersRemove: TelnyxEndpoint<'phoneNumbersRemove'>;
	availablePhoneNumbersList: TelnyxEndpoint<'availablePhoneNumbersList'>;
	callsCreate: TelnyxEndpoint<'callsCreate'>;
	callsGet: TelnyxEndpoint<'callsGet'>;
	callsHangup: TelnyxEndpoint<'callsHangup'>;
	callsSpeak: TelnyxEndpoint<'callsSpeak'>;
	callControlApplicationsList: TelnyxEndpoint<'callControlApplicationsList'>;
	callControlApplicationsGet: TelnyxEndpoint<'callControlApplicationsGet'>;
	callControlApplicationsCreate: TelnyxEndpoint<'callControlApplicationsCreate'>;
	callControlApplicationsUpdate: TelnyxEndpoint<'callControlApplicationsUpdate'>;
	callControlApplicationsRemove: TelnyxEndpoint<'callControlApplicationsRemove'>;
};

const telnyxEndpointsNested = {
	messages: {
		send: Messages.messagesSend,
		get: Messages.messagesGet,
		delete: Messages.messagesRemove,
	},
	messagingProfiles: {
		list: MessagingProfiles.list,
		get: MessagingProfiles.get,
		create: MessagingProfiles.create,
		update: MessagingProfiles.update,
		delete: MessagingProfiles.remove,
	},
	phoneNumbers: {
		list: PhoneNumbers.list,
		get: PhoneNumbers.get,
		update: PhoneNumbers.update,
		delete: PhoneNumbers.remove,
	},
	availablePhoneNumbers: {
		list: PhoneNumbers.availableList,
	},
	calls: {
		create: Calls.callsCreate,
		get: Calls.callsGet,
		hangup: Calls.callsHangup,
		speak: Calls.callsSpeak,
	},
	callControlApplications: {
		list: Calls.applicationsList,
		get: Calls.applicationsGet,
		create: Calls.applicationsCreate,
		update: Calls.applicationsUpdate,
		delete: Calls.applicationsRemove,
	},
} as const;

export const telnyxEndpointSchemas = {
	'messages.send': {
		input: TelnyxEndpointInputSchemas.messagesSend,
		output: TelnyxEndpointOutputSchemas.messagesSend,
	},
	'messages.get': {
		input: TelnyxEndpointInputSchemas.messagesGet,
		output: TelnyxEndpointOutputSchemas.messagesGet,
	},
	'messages.delete': {
		input: TelnyxEndpointInputSchemas.messagesRemove,
		output: TelnyxEndpointOutputSchemas.messagesRemove,
	},
	'messagingProfiles.list': {
		input: TelnyxEndpointInputSchemas.messagingProfilesList,
		output: TelnyxEndpointOutputSchemas.messagingProfilesList,
	},
	'messagingProfiles.get': {
		input: TelnyxEndpointInputSchemas.messagingProfilesGet,
		output: TelnyxEndpointOutputSchemas.messagingProfilesGet,
	},
	'messagingProfiles.create': {
		input: TelnyxEndpointInputSchemas.messagingProfilesCreate,
		output: TelnyxEndpointOutputSchemas.messagingProfilesCreate,
	},
	'messagingProfiles.update': {
		input: TelnyxEndpointInputSchemas.messagingProfilesUpdate,
		output: TelnyxEndpointOutputSchemas.messagingProfilesUpdate,
	},
	'messagingProfiles.delete': {
		input: TelnyxEndpointInputSchemas.messagingProfilesRemove,
		output: TelnyxEndpointOutputSchemas.messagingProfilesRemove,
	},
	'phoneNumbers.list': {
		input: TelnyxEndpointInputSchemas.phoneNumbersList,
		output: TelnyxEndpointOutputSchemas.phoneNumbersList,
	},
	'phoneNumbers.get': {
		input: TelnyxEndpointInputSchemas.phoneNumbersGet,
		output: TelnyxEndpointOutputSchemas.phoneNumbersGet,
	},
	'phoneNumbers.update': {
		input: TelnyxEndpointInputSchemas.phoneNumbersUpdate,
		output: TelnyxEndpointOutputSchemas.phoneNumbersUpdate,
	},
	'phoneNumbers.delete': {
		input: TelnyxEndpointInputSchemas.phoneNumbersRemove,
		output: TelnyxEndpointOutputSchemas.phoneNumbersRemove,
	},
	'availablePhoneNumbers.list': {
		input: TelnyxEndpointInputSchemas.availablePhoneNumbersList,
		output: TelnyxEndpointOutputSchemas.availablePhoneNumbersList,
	},
	'calls.create': {
		input: TelnyxEndpointInputSchemas.callsCreate,
		output: TelnyxEndpointOutputSchemas.callsCreate,
	},
	'calls.get': {
		input: TelnyxEndpointInputSchemas.callsGet,
		output: TelnyxEndpointOutputSchemas.callsGet,
	},
	'calls.hangup': {
		input: TelnyxEndpointInputSchemas.callsHangup,
		output: TelnyxEndpointOutputSchemas.callsHangup,
	},
	'calls.speak': {
		input: TelnyxEndpointInputSchemas.callsSpeak,
		output: TelnyxEndpointOutputSchemas.callsSpeak,
	},
	'callControlApplications.list': {
		input: TelnyxEndpointInputSchemas.callControlApplicationsList,
		output: TelnyxEndpointOutputSchemas.callControlApplicationsList,
	},
	'callControlApplications.get': {
		input: TelnyxEndpointInputSchemas.callControlApplicationsGet,
		output: TelnyxEndpointOutputSchemas.callControlApplicationsGet,
	},
	'callControlApplications.create': {
		input: TelnyxEndpointInputSchemas.callControlApplicationsCreate,
		output: TelnyxEndpointOutputSchemas.callControlApplicationsCreate,
	},
	'callControlApplications.update': {
		input: TelnyxEndpointInputSchemas.callControlApplicationsUpdate,
		output: TelnyxEndpointOutputSchemas.callControlApplicationsUpdate,
	},
	'callControlApplications.delete': {
		input: TelnyxEndpointInputSchemas.callControlApplicationsRemove,
		output: TelnyxEndpointOutputSchemas.callControlApplicationsRemove,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof telnyxEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const telnyxEndpointMeta = {
	'messages.send': {
		riskLevel: 'destructive',
		description:
			'Send an SMS or MMS from a Telnyx number, charging the account per part; text or at least one media URL is required',
	},
	'messages.get': {
		riskLevel: 'read',
		description:
			'Read one message with its delivery status, parts, cost and the errors Telnyx recorded',
	},
	'messages.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Cancel a scheduled message before Telnyx sends it; a message that already went out cannot be cancelled',
	},
	'messagingProfiles.list': {
		riskLevel: 'read',
		description:
			'List the messaging profiles with their webhook destination and enabled state',
	},
	'messagingProfiles.get': {
		riskLevel: 'read',
		description: 'Read one messaging profile by ID',
	},
	'messagingProfiles.create': {
		riskLevel: 'write',
		description:
			'Create a messaging profile, which groups numbers and sets where inbound messages are delivered',
	},
	'messagingProfiles.update': {
		riskLevel: 'write',
		description:
			"Change a profile's name, webhook destination or whitelisted destinations",
	},
	'messagingProfiles.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a messaging profile, which detaches its numbers and stops inbound delivery',
	},
	'phoneNumbers.list': {
		riskLevel: 'read',
		description:
			'List the numbers on the account with their connection and messaging profile',
	},
	'phoneNumbers.get': {
		riskLevel: 'read',
		description: 'Read one phone number record by ID',
	},
	'phoneNumbers.update': {
		riskLevel: 'write',
		description:
			'Attach a number to a call control or messaging application, set its emergency address, or retag it',
	},
	'phoneNumbers.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Release a phone number from the account; it cannot be recovered once released',
	},
	'availablePhoneNumbers.list': {
		riskLevel: 'read',
		description:
			'Search the numbers available to buy in a country, filtered by area code, locality or type',
	},
	'calls.create': {
		riskLevel: 'destructive',
		description:
			'Place an outbound call through a call control application, which dials the number and bills per minute',
	},
	'calls.get': {
		riskLevel: 'read',
		description: 'Read one call with its state, direction and timestamps',
	},
	'calls.hangup': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Hang up an active call, ending it for both legs',
	},
	'calls.speak': {
		riskLevel: 'destructive',
		description: 'Read text aloud on an active call using text to speech',
	},
	'callControlApplications.list': {
		riskLevel: 'read',
		description: 'List the call control applications with their webhook URLs',
	},
	'callControlApplications.get': {
		riskLevel: 'read',
		description: 'Read one call control application by ID',
	},
	'callControlApplications.create': {
		riskLevel: 'write',
		description:
			'Create a call control application, which is what calls.create dials through',
	},
	'callControlApplications.update': {
		riskLevel: 'write',
		description: "Change an application's webhook URL, name or active state",
	},
	'callControlApplications.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a call control application; calls that reference it stop working',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof telnyxEndpointsNested>;

export type BaseTelnyxPlugin<T extends TelnyxPluginOptions> = CorsairPlugin<
	'telnyx',
	typeof TelnyxSchema,
	typeof telnyxEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalTelnyxPlugin = BaseTelnyxPlugin<TelnyxPluginOptions>;

export type ExternalTelnyxPlugin<T extends TelnyxPluginOptions> =
	BaseTelnyxPlugin<T>;

export function telnyx<const T extends TelnyxPluginOptions>(
	incomingOptions: TelnyxPluginOptions & T = {} as TelnyxPluginOptions & T,
): ExternalTelnyxPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'telnyx',
		schema: TelnyxSchema,
		options: options,
		hooks: options.hooks,
		endpoints: telnyxEndpointsNested,
		webhooks: {},
		endpointMeta: telnyxEndpointMeta,
		endpointSchemas: telnyxEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: TelnyxKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('telnyx', ctx.authType ?? 'api_key');
		},
	} satisfies InternalTelnyxPlugin;
}

export type { TelnyxErrorDetails } from './client';
export { telnyxErrorDetails } from './client';

export type {
	AvailablePhoneNumbersListInput,
	AvailablePhoneNumbersListResponse,
	CallActionResponse,
	CallControlApplicationsCreateInput,
	CallControlApplicationsListResponse,
	CallControlApplicationsUpdateInput,
	CallsCreateInput,
	CallsCreateResponse,
	CallsGetResponse,
	CallsSpeakInput,
	MessagesSendInput,
	MessagesSendResponse,
	MessagingProfilesCreateInput,
	MessagingProfilesListResponse,
	MessagingProfilesUpdateInput,
	PhoneNumbersListResponse,
	PhoneNumbersUpdateInput,
	TelnyxCall,
	TelnyxCallControlApplication,
	TelnyxEndpointInputs,
	TelnyxEndpointOutputs,
	TelnyxMessage,
	TelnyxMessagingProfile,
	TelnyxPhoneNumber,
} from './endpoints/types';
