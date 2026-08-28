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
import { Account, Campaigns, Contacts } from './endpoints';
import type {
	EmeliaEndpointInputs,
	EmeliaEndpointOutputs,
} from './endpoints/types';
import {
	EmeliaEndpointInputSchemas,
	EmeliaEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { EmeliaSchema } from './schema';

export type EmeliaPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalEmeliaPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof emeliaEndpointsNested>;
};

export type EmeliaContext = CorsairPluginContext<
	typeof EmeliaSchema,
	EmeliaPluginOptions
>;

export type EmeliaKeyBuilderContext = KeyBuilderContext<EmeliaPluginOptions>;

export type EmeliaBoundEndpoints = BindEndpoints<typeof emeliaEndpointsNested>;

type EmeliaEndpoint<K extends keyof EmeliaEndpointOutputs> = CorsairEndpoint<
	EmeliaContext,
	EmeliaEndpointInputs[K],
	EmeliaEndpointOutputs[K]
>;

export type EmeliaEndpoints = {
	accountMe: EmeliaEndpoint<'accountMe'>;
	campaignsList: EmeliaEndpoint<'campaignsList'>;
	campaignsAddContact: EmeliaEndpoint<'campaignsAddContact'>;
	campaignsRemoveContact: EmeliaEndpoint<'campaignsRemoveContact'>;
	contactsListLists: EmeliaEndpoint<'contactsListLists'>;
	contactsAddToList: EmeliaEndpoint<'contactsAddToList'>;
};

const emeliaEndpointsNested = {
	account: {
		me: Account.me,
	},
	campaigns: {
		list: Campaigns.list,
		addContact: Campaigns.addContact,
		removeContact: Campaigns.removeContact,
	},
	contacts: {
		listLists: Contacts.listLists,
		addToList: Contacts.addToList,
	},
} as const;

export const emeliaEndpointSchemas = {
	'account.me': {
		input: EmeliaEndpointInputSchemas.accountMe,
		output: EmeliaEndpointOutputSchemas.accountMe,
	},
	'campaigns.list': {
		input: EmeliaEndpointInputSchemas.campaignsList,
		output: EmeliaEndpointOutputSchemas.campaignsList,
	},
	'campaigns.addContact': {
		input: EmeliaEndpointInputSchemas.campaignsAddContact,
		output: EmeliaEndpointOutputSchemas.campaignsAddContact,
	},
	'campaigns.removeContact': {
		input: EmeliaEndpointInputSchemas.campaignsRemoveContact,
		output: EmeliaEndpointOutputSchemas.campaignsRemoveContact,
	},
	'contacts.listLists': {
		input: EmeliaEndpointInputSchemas.contactsListLists,
		output: EmeliaEndpointOutputSchemas.contactsListLists,
	},
	'contacts.addToList': {
		input: EmeliaEndpointInputSchemas.contactsAddToList,
		output: EmeliaEndpointOutputSchemas.contactsAddToList,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof emeliaEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const emeliaEndpointMeta = {
	'account.me': {
		riskLevel: 'read',
		description: 'Retrieve authenticated Emelia account details',
	},
	'campaigns.list': {
		riskLevel: 'read',
		description: 'List all cold outreach campaigns',
	},
	'campaigns.addContact': {
		riskLevel: 'write',
		description: 'Add a contact to a campaign',
	},
	'campaigns.removeContact': {
		riskLevel: 'destructive',
		description: 'Remove a contact from a campaign',
	},
	'contacts.listLists': {
		riskLevel: 'read',
		description: 'List all contact lists',
	},
	'contacts.addToList': {
		riskLevel: 'write',
		description: 'Add a contact to a contact list',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof emeliaEndpointsNested>;

export const emeliaAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseEmeliaPlugin<T extends EmeliaPluginOptions> = CorsairPlugin<
	'emelia',
	typeof EmeliaSchema,
	typeof emeliaEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType
>;

export type InternalEmeliaPlugin = BaseEmeliaPlugin<EmeliaPluginOptions>;

export type ExternalEmeliaPlugin<T extends EmeliaPluginOptions> =
	BaseEmeliaPlugin<T>;

export function emelia<const T extends EmeliaPluginOptions>(
	incomingOptions: EmeliaPluginOptions & T = {} as EmeliaPluginOptions & T,
): ExternalEmeliaPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'emelia',
		authConfig: emeliaAuthConfig,
		schema: EmeliaSchema,
		options: options,
		hooks: options.hooks,
		endpoints: emeliaEndpointsNested,
		webhooks: {},
		endpointMeta: emeliaEndpointMeta,
		endpointSchemas: emeliaEndpointSchemas,
		webhookSchemas: {},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: EmeliaKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalEmeliaPlugin;
}

export type {
	EmeliaEndpointInputs,
	EmeliaEndpointOutputs,
} from './endpoints/types';
