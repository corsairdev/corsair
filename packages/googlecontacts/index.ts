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
} from 'corsair/core';
import { AuthMissingError, getOAuthAccessToken } from 'corsair/core';
import {
	ContactGroupsEndpoints,
	ContactsEndpoints,
	OtherContactsEndpoints,
} from './endpoints';
import type {
	GoogleContactsEndpointInputs,
	GoogleContactsEndpointOutputs,
} from './endpoints/types';
import {
	GoogleContactsEndpointInputSchemas,
	GoogleContactsEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { GoogleContactsSchema } from './schema';

export type GoogleContactsPluginOptions = {
	authType?: PickAuth<'oauth_2'>;
	key?: string;
	hooks?: InternalGoogleContactsPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	/**
	 * Permission configuration for the Google Contacts plugin.
	 * Controls what the AI agent is allowed to do.
	 * Overrides use dot-notation paths from the Google Contacts endpoint tree — invalid paths are type errors.
	 */
	permissions?: PluginPermissionsConfig<typeof googleContactsEndpointsNested>;
};

export type GoogleContactsContext = CorsairPluginContext<
	typeof GoogleContactsSchema,
	GoogleContactsPluginOptions
>;

export type GoogleContactsKeyBuilderContext =
	KeyBuilderContext<GoogleContactsPluginOptions>;

type GoogleContactsEndpoint<K extends keyof GoogleContactsEndpointOutputs> =
	CorsairEndpoint<
		GoogleContactsContext,
		GoogleContactsEndpointInputs[K],
		GoogleContactsEndpointOutputs[K]
	>;

export type GoogleContactsEndpoints = {
	contactsList: GoogleContactsEndpoint<'contactsList'>;
	contactsGet: GoogleContactsEndpoint<'contactsGet'>;
	contactsSearch: GoogleContactsEndpoint<'contactsSearch'>;
	contactsCreate: GoogleContactsEndpoint<'contactsCreate'>;
	contactsUpdate: GoogleContactsEndpoint<'contactsUpdate'>;
	contactsDelete: GoogleContactsEndpoint<'contactsDelete'>;
	contactsUpdatePhoto: GoogleContactsEndpoint<'contactsUpdatePhoto'>;
	contactsDeletePhoto: GoogleContactsEndpoint<'contactsDeletePhoto'>;
	otherContactsList: GoogleContactsEndpoint<'otherContactsList'>;
	otherContactsSearch: GoogleContactsEndpoint<'otherContactsSearch'>;
	otherContactsCopyToContacts: GoogleContactsEndpoint<'otherContactsCopyToContacts'>;
	contactGroupsList: GoogleContactsEndpoint<'contactGroupsList'>;
	contactGroupsGet: GoogleContactsEndpoint<'contactGroupsGet'>;
	contactGroupsCreate: GoogleContactsEndpoint<'contactGroupsCreate'>;
	contactGroupsUpdate: GoogleContactsEndpoint<'contactGroupsUpdate'>;
	contactGroupsDelete: GoogleContactsEndpoint<'contactGroupsDelete'>;
	contactGroupsModifyMembers: GoogleContactsEndpoint<'contactGroupsModifyMembers'>;
};

export type GoogleContactsBoundEndpoints = BindEndpoints<
	typeof googleContactsEndpointsNested
>;

const googleContactsEndpointsNested = {
	contacts: {
		list: ContactsEndpoints.list,
		get: ContactsEndpoints.get,
		search: ContactsEndpoints.search,
		create: ContactsEndpoints.create,
		update: ContactsEndpoints.update,
		delete: ContactsEndpoints.delete,
		updatePhoto: ContactsEndpoints.updatePhoto,
		deletePhoto: ContactsEndpoints.deletePhoto,
	},
	otherContacts: {
		list: OtherContactsEndpoints.list,
		search: OtherContactsEndpoints.search,
		copyToContacts: OtherContactsEndpoints.copyToContacts,
	},
	contactGroups: {
		list: ContactGroupsEndpoints.list,
		get: ContactGroupsEndpoints.get,
		create: ContactGroupsEndpoints.create,
		update: ContactGroupsEndpoints.update,
		delete: ContactGroupsEndpoints.delete,
		modifyMembers: ContactGroupsEndpoints.modifyMembers,
	},
} as const;

export const googlecontactsEndpointSchemas = {
	'contacts.list': {
		input: GoogleContactsEndpointInputSchemas.contactsList,
		output: GoogleContactsEndpointOutputSchemas.contactsList,
	},
	'contacts.get': {
		input: GoogleContactsEndpointInputSchemas.contactsGet,
		output: GoogleContactsEndpointOutputSchemas.contactsGet,
	},
	'contacts.search': {
		input: GoogleContactsEndpointInputSchemas.contactsSearch,
		output: GoogleContactsEndpointOutputSchemas.contactsSearch,
	},
	'contacts.create': {
		input: GoogleContactsEndpointInputSchemas.contactsCreate,
		output: GoogleContactsEndpointOutputSchemas.contactsCreate,
	},
	'contacts.update': {
		input: GoogleContactsEndpointInputSchemas.contactsUpdate,
		output: GoogleContactsEndpointOutputSchemas.contactsUpdate,
	},
	'contacts.delete': {
		input: GoogleContactsEndpointInputSchemas.contactsDelete,
		output: GoogleContactsEndpointOutputSchemas.contactsDelete,
	},
	'contacts.updatePhoto': {
		input: GoogleContactsEndpointInputSchemas.contactsUpdatePhoto,
		output: GoogleContactsEndpointOutputSchemas.contactsUpdatePhoto,
	},
	'contacts.deletePhoto': {
		input: GoogleContactsEndpointInputSchemas.contactsDeletePhoto,
		output: GoogleContactsEndpointOutputSchemas.contactsDeletePhoto,
	},
	'otherContacts.list': {
		input: GoogleContactsEndpointInputSchemas.otherContactsList,
		output: GoogleContactsEndpointOutputSchemas.otherContactsList,
	},
	'otherContacts.search': {
		input: GoogleContactsEndpointInputSchemas.otherContactsSearch,
		output: GoogleContactsEndpointOutputSchemas.otherContactsSearch,
	},
	'otherContacts.copyToContacts': {
		input: GoogleContactsEndpointInputSchemas.otherContactsCopyToContacts,
		output: GoogleContactsEndpointOutputSchemas.otherContactsCopyToContacts,
	},
	'contactGroups.list': {
		input: GoogleContactsEndpointInputSchemas.contactGroupsList,
		output: GoogleContactsEndpointOutputSchemas.contactGroupsList,
	},
	'contactGroups.get': {
		input: GoogleContactsEndpointInputSchemas.contactGroupsGet,
		output: GoogleContactsEndpointOutputSchemas.contactGroupsGet,
	},
	'contactGroups.create': {
		input: GoogleContactsEndpointInputSchemas.contactGroupsCreate,
		output: GoogleContactsEndpointOutputSchemas.contactGroupsCreate,
	},
	'contactGroups.update': {
		input: GoogleContactsEndpointInputSchemas.contactGroupsUpdate,
		output: GoogleContactsEndpointOutputSchemas.contactGroupsUpdate,
	},
	'contactGroups.delete': {
		input: GoogleContactsEndpointInputSchemas.contactGroupsDelete,
		output: GoogleContactsEndpointOutputSchemas.contactGroupsDelete,
	},
	'contactGroups.modifyMembers': {
		input: GoogleContactsEndpointInputSchemas.contactGroupsModifyMembers,
		output: GoogleContactsEndpointOutputSchemas.contactGroupsModifyMembers,
	},
} as const;

const defaultAuthType = 'oauth_2' as const;

/**
 * Risk-level metadata for each Google Contacts endpoint.
 * Used by the MCP server permission system to decide allow / deny / require_approval.
 */
const googleContactsEndpointMeta = {
	'contacts.list': {
		riskLevel: 'read',
		description: "List the user's contacts",
	},
	'contacts.get': { riskLevel: 'read', description: 'Get a single contact' },
	'contacts.search': {
		riskLevel: 'read',
		description:
			'Search contacts by name, email or phone. Google warms this index per account, so the first call after authorizing can return nothing; retry.',
	},
	'contacts.create': {
		riskLevel: 'write',
		description: 'Create a new contact',
	},
	'contacts.update': {
		riskLevel: 'write',
		description: 'Update an existing contact',
	},
	'contacts.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently delete a contact [DESTRUCTIVE · IRREVERSIBLE]',
	},
	'contacts.updatePhoto': {
		riskLevel: 'write',
		description: "Set or replace a contact's photo",
	},
	'contacts.deletePhoto': {
		riskLevel: 'destructive',
		description: "Remove a contact's photo [DESTRUCTIVE]",
	},
	'otherContacts.list': {
		riskLevel: 'read',
		description: 'List auto-saved contacts the user never filed',
	},
	'otherContacts.search': {
		riskLevel: 'read',
		description: 'Search auto-saved contacts',
	},
	'otherContacts.copyToContacts': {
		riskLevel: 'write',
		description: 'Copy an auto-saved contact into the saved contacts',
	},
	'contactGroups.list': {
		riskLevel: 'read',
		description: 'List contact groups',
	},
	'contactGroups.get': {
		riskLevel: 'read',
		description: 'Get a single contact group',
	},
	'contactGroups.create': {
		riskLevel: 'write',
		description: 'Create a contact group',
	},
	'contactGroups.update': {
		riskLevel: 'write',
		description: 'Rename a contact group',
	},
	'contactGroups.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a contact group, optionally with its contacts [DESTRUCTIVE · IRREVERSIBLE]',
	},
	'contactGroups.modifyMembers': {
		riskLevel: 'write',
		description: 'Add or remove contacts from a group',
	},
} satisfies RequiredPluginEndpointMeta<typeof googleContactsEndpointsNested>;

export const googleContactsAuthConfig = {
	oauth_2: {
		account: ['resource_name'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseGoogleContactsPlugin<T extends GoogleContactsPluginOptions> =
	CorsairPlugin<
		'googlecontacts',
		typeof GoogleContactsSchema,
		typeof googleContactsEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType
	>;

export type InternalGoogleContactsPlugin =
	BaseGoogleContactsPlugin<GoogleContactsPluginOptions>;

export type ExternalGoogleContactsPlugin<
	T extends GoogleContactsPluginOptions,
> = BaseGoogleContactsPlugin<T>;

export function googlecontacts<const T extends GoogleContactsPluginOptions>(
	incomingOptions: GoogleContactsPluginOptions &
		T = {} as GoogleContactsPluginOptions & T,
): ExternalGoogleContactsPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'googlecontacts',
		authConfig: googleContactsAuthConfig,
		schema: GoogleContactsSchema,
		options: options,
		oauthConfig: {
			providerName: 'Google',
			authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
			tokenUrl: 'https://oauth2.googleapis.com/token',
			scopes: [
				// contacts covers every read the readonly scope would, plus the writes.
				'https://www.googleapis.com/auth/contacts',
				// The only scope Google accepts for the otherContacts resource.
				'https://www.googleapis.com/auth/contacts.other.readonly',
			],
			authParams: { access_type: 'offline', prompt: 'consent' },
		},
		hooks: options.hooks,
		endpoints: googleContactsEndpointsNested,
		webhooks: {},
		endpointMeta: googleContactsEndpointMeta,
		endpointSchemas: googlecontactsEndpointSchemas,
		webhookSchemas: {},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: GoogleContactsKeyBuilderContext) => {
			if (options.key) {
				return options.key;
			}

			if (ctx.authType === 'oauth_2') {
				return getOAuthAccessToken(ctx, {
					plugin: 'googlecontacts',
					tokenUrl: 'https://oauth2.googleapis.com/token',
				});
			}

			throw new AuthMissingError('googlecontacts', 'oauth_2');
		},
	} satisfies InternalGoogleContactsPlugin;
}

export type {
	GoogleContactsEndpointInputs,
	GoogleContactsEndpointOutputs,
} from './endpoints/types';
export type * from './types';
