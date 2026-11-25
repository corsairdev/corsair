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
import { Apikey, Contacts, Events, Lists, Transactional } from './endpoints';
import type {
	LoopsEndpointInputs,
	LoopsEndpointOutputs,
} from './endpoints/types';
import {
	LoopsEndpointInputSchemas,
	LoopsEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { LoopsSchema } from './schema';

export type LoopsPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalLoopsPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof loopsEndpointsNested>;
};

export type LoopsContext = CorsairPluginContext<
	typeof LoopsSchema,
	LoopsPluginOptions
>;

export type LoopsKeyBuilderContext = KeyBuilderContext<LoopsPluginOptions>;

export type LoopsBoundEndpoints = BindEndpoints<typeof loopsEndpointsNested>;

type LoopsEndpoint<K extends keyof LoopsEndpointOutputs> = CorsairEndpoint<
	LoopsContext,
	LoopsEndpointInputs[K],
	LoopsEndpointOutputs[K]
>;

export type LoopsEndpoints = {
	apikeyVerifyConnection: LoopsEndpoint<'apikeyVerifyConnection'>;
	contactsFind: LoopsEndpoint<'contactsFind'>;
	contactsCreate: LoopsEndpoint<'contactsCreate'>;
	contactsUpdate: LoopsEndpoint<'contactsUpdate'>;
	contactsDelete: LoopsEndpoint<'contactsDelete'>;
	contactsListProperties: LoopsEndpoint<'contactsListProperties'>;
	contactsGetSuppression: LoopsEndpoint<'contactsGetSuppression'>;
	eventsSend: LoopsEndpoint<'eventsSend'>;
	transactionalSend: LoopsEndpoint<'transactionalSend'>;
	listsList: LoopsEndpoint<'listsList'>;
};

const loopsEndpointsNested = {
	apikey: {
		verifyConnection: Apikey.verifyConnection,
	},
	contacts: {
		find: Contacts.find,
		create: Contacts.create,
		update: Contacts.update,
		delete: Contacts.remove,
		listProperties: Contacts.listProperties,
		getSuppression: Contacts.getSuppression,
	},
	events: {
		send: Events.send,
	},
	transactional: {
		send: Transactional.send,
	},
	lists: {
		list: Lists.list,
	},
} as const;

export const loopsEndpointSchemas = {
	'apikey.verifyConnection': {
		input: LoopsEndpointInputSchemas.apikeyVerifyConnection,
		output: LoopsEndpointOutputSchemas.apikeyVerifyConnection,
	},
	'contacts.find': {
		input: LoopsEndpointInputSchemas.contactsFind,
		output: LoopsEndpointOutputSchemas.contactsFind,
	},
	'contacts.create': {
		input: LoopsEndpointInputSchemas.contactsCreate,
		output: LoopsEndpointOutputSchemas.contactsCreate,
	},
	'contacts.update': {
		input: LoopsEndpointInputSchemas.contactsUpdate,
		output: LoopsEndpointOutputSchemas.contactsUpdate,
	},
	'contacts.delete': {
		input: LoopsEndpointInputSchemas.contactsDelete,
		output: LoopsEndpointOutputSchemas.contactsDelete,
	},
	'contacts.listProperties': {
		input: LoopsEndpointInputSchemas.contactsListProperties,
		output: LoopsEndpointOutputSchemas.contactsListProperties,
	},
	'contacts.getSuppression': {
		input: LoopsEndpointInputSchemas.contactsGetSuppression,
		output: LoopsEndpointOutputSchemas.contactsGetSuppression,
	},
	'events.send': {
		input: LoopsEndpointInputSchemas.eventsSend,
		output: LoopsEndpointOutputSchemas.eventsSend,
	},
	'transactional.send': {
		input: LoopsEndpointInputSchemas.transactionalSend,
		output: LoopsEndpointOutputSchemas.transactionalSend,
	},
	'lists.list': {
		input: LoopsEndpointInputSchemas.listsList,
		output: LoopsEndpointOutputSchemas.listsList,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof loopsEndpointsNested>;

const defaultAuthType = 'api_key' as const;

const loopsEndpointMeta = {
	'apikey.verifyConnection': {
		riskLevel: 'read',
		description: 'Verify the API key and return the team name it belongs to',
	},
	'contacts.find': {
		riskLevel: 'read',
		description:
			'Find contacts by email or user ID; answers an empty array when none match',
	},
	'contacts.create': {
		riskLevel: 'write',
		description:
			'Create a contact with fixed and custom properties; answers 409 when the email or userId already exists',
	},
	'contacts.update': {
		riskLevel: 'write',
		description:
			'Update a contact found by email or userId, creating it when no match exists (upsert)',
	},
	'contacts.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Permanently delete a contact by email or userId; the contact and its subscriptions cannot be restored',
	},
	'contacts.listProperties': {
		riskLevel: 'read',
		description:
			'List the contact property definitions, all of them or only the custom ones',
	},
	'contacts.getSuppression': {
		riskLevel: 'read',
		description:
			'Read whether a contact is suppressed from emails and the quota left for removing suppressions',
	},
	'events.send': {
		riskLevel: 'write',
		description:
			'Send an event for a contact; this can trigger workflows that email real people',
	},
	'transactional.send': {
		riskLevel: 'write',
		description:
			'Send a published transactional email to a real inbox; pass an idempotencyKey (max 100 chars) to make a retry within 24 hours return 409 instead of a duplicate',
	},
	'lists.list': {
		riskLevel: 'read',
		description: 'List every mailing list in the team',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof loopsEndpointsNested>;

export type BaseLoopsPlugin<T extends LoopsPluginOptions> = CorsairPlugin<
	'loops',
	typeof LoopsSchema,
	typeof loopsEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalLoopsPlugin = BaseLoopsPlugin<LoopsPluginOptions>;

export type ExternalLoopsPlugin<T extends LoopsPluginOptions> =
	BaseLoopsPlugin<T>;

export function loops<const T extends LoopsPluginOptions>(
	incomingOptions: LoopsPluginOptions & T = {} as LoopsPluginOptions & T,
): ExternalLoopsPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'loops',
		schema: LoopsSchema,
		options: options,
		hooks: options.hooks,
		endpoints: loopsEndpointsNested,
		webhooks: {},
		endpointMeta: loopsEndpointMeta,
		endpointSchemas: loopsEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: LoopsKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('loops', ctx.authType ?? 'api_key');
		},
	} satisfies InternalLoopsPlugin;
}

export { LoopsAPIError } from './client';

export type {
	ContactsCreateInput,
	ContactsCreateResponse,
	ContactsDeleteInput,
	ContactsDeleteResponse,
	ContactsFindInput,
	ContactsFindResponse,
	ContactsGetSuppressionInput,
	ContactsGetSuppressionResponse,
	ContactsListPropertiesInput,
	ContactsListPropertiesResponse,
	ContactsUpdateInput,
	ContactsUpdateResponse,
	EventsSendInput,
	EventsSendResponse,
	ListsListInput,
	ListsListResponse,
	LoopsContact,
	LoopsEndpointInputs,
	LoopsEndpointOutputs,
	TransactionalSendInput,
	TransactionalSendResponse,
	VerifyConnectionInput,
	VerifyConnectionResponse,
} from './endpoints/types';
