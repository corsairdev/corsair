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
import {
	apiWebhooksCreate,
	apiWebhooksRemove,
	apiWebhooksSearch,
	apiWebhooksUpdate,
	attributesCreate,
	attributesRemove,
	attributesSearch,
	automationsSearch,
	channelsSearch,
	contactsCreate,
	contactsSearch,
	labelsCreate,
	labelsRemove,
	labelsSearch,
	messageTemplatesSearch,
} from './endpoints';
import type {
	HeyyEndpointInputs,
	HeyyEndpointOutputs,
} from './endpoints/types';
import {
	HeyyEndpointInputSchemas,
	HeyyEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { HeyySchema } from './schema';

export type HeyyPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalHeyyPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof heyyEndpointsNested>;
};

export type HeyyContext = CorsairPluginContext<
	typeof HeyySchema,
	HeyyPluginOptions
>;

export type HeyyKeyBuilderContext = KeyBuilderContext<HeyyPluginOptions>;

export type HeyyBoundEndpoints = BindEndpoints<typeof heyyEndpointsNested>;

type HeyyEndpoint<K extends keyof HeyyEndpointOutputs> = CorsairEndpoint<
	HeyyContext,
	HeyyEndpointInputs[K],
	HeyyEndpointOutputs[K]
>;

export type HeyyEndpoints = {
	contactsSearch: HeyyEndpoint<'contactsSearch'>;
	contactsCreate: HeyyEndpoint<'contactsCreate'>;
	attributesSearch: HeyyEndpoint<'attributesSearch'>;
	attributesCreate: HeyyEndpoint<'attributesCreate'>;
	attributesRemove: HeyyEndpoint<'attributesRemove'>;
	labelsSearch: HeyyEndpoint<'labelsSearch'>;
	labelsCreate: HeyyEndpoint<'labelsCreate'>;
	labelsRemove: HeyyEndpoint<'labelsRemove'>;
	apiWebhooksCreate: HeyyEndpoint<'apiWebhooksCreate'>;
	apiWebhooksSearch: HeyyEndpoint<'apiWebhooksSearch'>;
	apiWebhooksUpdate: HeyyEndpoint<'apiWebhooksUpdate'>;
	apiWebhooksRemove: HeyyEndpoint<'apiWebhooksRemove'>;
	channelsSearch: HeyyEndpoint<'channelsSearch'>;
	automationsSearch: HeyyEndpoint<'automationsSearch'>;
	messageTemplatesSearch: HeyyEndpoint<'messageTemplatesSearch'>;
};

const heyyEndpointsNested = {
	contacts: {
		search: contactsSearch,
		create: contactsCreate,
	},
	attributes: {
		search: attributesSearch,
		create: attributesCreate,
		remove: attributesRemove,
	},
	labels: {
		search: labelsSearch,
		create: labelsCreate,
		remove: labelsRemove,
	},
	apiWebhooks: {
		create: apiWebhooksCreate,
		search: apiWebhooksSearch,
		update: apiWebhooksUpdate,
		remove: apiWebhooksRemove,
	},
	channels: {
		search: channelsSearch,
	},
	automations: {
		search: automationsSearch,
	},
	messageTemplates: {
		search: messageTemplatesSearch,
	},
} as const;

export const heyyEndpointSchemas = {
	'contacts.search': {
		input: HeyyEndpointInputSchemas.contactsSearch,
		output: HeyyEndpointOutputSchemas.contactsSearch,
	},
	'contacts.create': {
		input: HeyyEndpointInputSchemas.contactsCreate,
		output: HeyyEndpointOutputSchemas.contactsCreate,
	},
	'attributes.search': {
		input: HeyyEndpointInputSchemas.attributesSearch,
		output: HeyyEndpointOutputSchemas.attributesSearch,
	},
	'attributes.create': {
		input: HeyyEndpointInputSchemas.attributesCreate,
		output: HeyyEndpointOutputSchemas.attributesCreate,
	},
	'attributes.remove': {
		input: HeyyEndpointInputSchemas.attributesRemove,
		output: HeyyEndpointOutputSchemas.attributesRemove,
	},
	'labels.search': {
		input: HeyyEndpointInputSchemas.labelsSearch,
		output: HeyyEndpointOutputSchemas.labelsSearch,
	},
	'labels.create': {
		input: HeyyEndpointInputSchemas.labelsCreate,
		output: HeyyEndpointOutputSchemas.labelsCreate,
	},
	'labels.remove': {
		input: HeyyEndpointInputSchemas.labelsRemove,
		output: HeyyEndpointOutputSchemas.labelsRemove,
	},
	'apiWebhooks.create': {
		input: HeyyEndpointInputSchemas.apiWebhooksCreate,
		output: HeyyEndpointOutputSchemas.apiWebhooksCreate,
	},
	'apiWebhooks.search': {
		input: HeyyEndpointInputSchemas.apiWebhooksSearch,
		output: HeyyEndpointOutputSchemas.apiWebhooksSearch,
	},
	'apiWebhooks.update': {
		input: HeyyEndpointInputSchemas.apiWebhooksUpdate,
		output: HeyyEndpointOutputSchemas.apiWebhooksUpdate,
	},
	'apiWebhooks.remove': {
		input: HeyyEndpointInputSchemas.apiWebhooksRemove,
		output: HeyyEndpointOutputSchemas.apiWebhooksRemove,
	},
	'channels.search': {
		input: HeyyEndpointInputSchemas.channelsSearch,
		output: HeyyEndpointOutputSchemas.channelsSearch,
	},
	'automations.search': {
		input: HeyyEndpointInputSchemas.automationsSearch,
		output: HeyyEndpointOutputSchemas.automationsSearch,
	},
	'messageTemplates.search': {
		input: HeyyEndpointInputSchemas.messageTemplatesSearch,
		output: HeyyEndpointOutputSchemas.messageTemplatesSearch,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof heyyEndpointsNested>;

const defaultAuthType = 'api_key' as const;

const heyyEndpointMeta = {
	'contacts.search': {
		riskLevel: 'read',
		description:
			'Search contacts with a structured filter, free-text search, sorting and paging; returns the matched contacts with their labels and attribute values',
	},
	'contacts.create': {
		riskLevel: 'write',
		description:
			'Create a contact with a name, phone number or email, attach labels by id and set custom attribute values',
	},
	'attributes.search': {
		riskLevel: 'read',
		description:
			'Search the custom contact attributes defined on the workspace, with their type, options and where they appear in Heyy',
	},
	'attributes.create': {
		riskLevel: 'write',
		description:
			'Define a custom contact attribute: text, number, select or date, with the options a select needs and where it appears',
	},
	'attributes.remove': {
		riskLevel: 'destructive',
		description:
			'Delete a custom contact attribute by id; the values contacts had for it are gone and cannot be restored. An id that does not exist fails with 404 attribute_not_found',
		irreversible: true,
	},
	'labels.search': {
		riskLevel: 'read',
		description: 'Search the labels used to group contacts, with their colours',
	},
	'labels.create': {
		riskLevel: 'write',
		description: 'Create a label with a name and a hex colour',
	},
	'labels.remove': {
		riskLevel: 'destructive',
		description:
			'Delete a label by id; it is detached from every contact that carried it',
		irreversible: true,
	},
	'apiWebhooks.create': {
		riskLevel: 'write',
		description:
			'Register an HTTPS endpoint for message events on the channels named in each event; Heyy then POSTs every matching message, with its content and sender, to that URL',
	},
	'apiWebhooks.search': {
		riskLevel: 'read',
		description:
			'List the registered webhook endpoints with their URL, status and subscribed events',
	},
	'apiWebhooks.update': {
		riskLevel: 'write',
		description:
			"Change a webhook's URL or events, or pause deliveries by setting it inactive",
	},
	'apiWebhooks.remove': {
		riskLevel: 'destructive',
		description:
			'Delete a webhook endpoint by id; Heyy stops delivering to it immediately',
		irreversible: true,
	},
	'channels.search': {
		riskLevel: 'read',
		description:
			'List the connected channels (WhatsApp, Instagram, Messenger, SMS or live chat) with their type and connection status',
	},
	'automations.search': {
		riskLevel: 'read',
		description:
			'List the automation workflows on the workspace with their status: draft, active or paused',
	},
	'messageTemplates.search': {
		riskLevel: 'read',
		description:
			'List the message templates available for a channel, with their status, content and variables',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof heyyEndpointsNested>;

export type BaseHeyyPlugin<T extends HeyyPluginOptions> = CorsairPlugin<
	'heyy',
	typeof HeyySchema,
	typeof heyyEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalHeyyPlugin = BaseHeyyPlugin<HeyyPluginOptions>;

export type ExternalHeyyPlugin<T extends HeyyPluginOptions> = BaseHeyyPlugin<T>;

export function heyy<const T extends HeyyPluginOptions>(
	incomingOptions: HeyyPluginOptions & T = {} as HeyyPluginOptions & T,
): ExternalHeyyPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'heyy',
		schema: HeyySchema,
		options: options,
		hooks: options.hooks,
		endpoints: heyyEndpointsNested,
		// Heyy delivers webhooks but documents no signature or shared secret, so
		// a delivery cannot be told apart from a forged one. The plugin therefore
		// exposes no inbound route; `apiWebhooks.*` manages the endpoints Heyy
		// itself calls.
		webhooks: {},
		endpointMeta: heyyEndpointMeta,
		endpointSchemas: heyyEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: HeyyKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('heyy', ctx.authType ?? 'api_key');
		},
	} satisfies InternalHeyyPlugin;
}

export { HeyyAPIError } from './client';

export type {
	ApiWebhooksCreateInput,
	ApiWebhooksCreateResponse,
	ApiWebhooksRemoveInput,
	ApiWebhooksRemoveResponse,
	ApiWebhooksSearchInput,
	ApiWebhooksSearchResponse,
	ApiWebhooksUpdateInput,
	ApiWebhooksUpdateResponse,
	AttributesCreateInput,
	AttributesCreateResponse,
	AttributesRemoveInput,
	AttributesRemoveResponse,
	AttributesSearchInput,
	AttributesSearchResponse,
	AutomationsSearchInput,
	AutomationsSearchResponse,
	ChannelsSearchInput,
	ChannelsSearchResponse,
	ContactsCreateInput,
	ContactsCreateResponse,
	ContactsSearchInput,
	ContactsSearchResponse,
	HeyyAttribute,
	HeyyAutomation,
	HeyyChannel,
	HeyyContact,
	HeyyEndpointInputs,
	HeyyEndpointOutputs,
	HeyyLabel,
	HeyyMessageTemplate,
	HeyyPagination,
	HeyyWebhook,
	LabelsCreateInput,
	LabelsCreateResponse,
	LabelsRemoveInput,
	LabelsRemoveResponse,
	LabelsSearchInput,
	LabelsSearchResponse,
	MessageTemplatesSearchInput,
	MessageTemplatesSearchResponse,
} from './endpoints/types';
