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
import { AuthMissingError } from 'corsair/core';
import { Contacts, Fields, Lists, Tags } from './endpoints';
import type {
	ActiveCampaignEndpointInputs,
	ActiveCampaignEndpointOutputs,
} from './endpoints/types';
import {
	ActiveCampaignEndpointInputSchemas,
	ActiveCampaignEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ActiveCampaignSchema } from './schema';

export type ActiveCampaignPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	/**
	 * The account slug - the subdomain of the account's API URL,
	 * `https://<account>.api-us1.com`. ActiveCampaign hosts every account on
	 * its own subdomain, so this is required alongside the API token and
	 * cannot be derived from it.
	 */
	account?: string;
	hooks?: InternalActiveCampaignPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof activecampaignEndpointsNested>;
};

/**
 * Declaring `account: ['account']` generates `ctx.keys.get_account()`, which is
 * how the second half of the credential reaches an endpoint when it is not
 * passed as a plugin option.
 */
export const activecampaignAuthConfig = {
	api_key: {
		account: ['account'] as const,
	},
} as const satisfies PluginAuthConfig;

export type ActiveCampaignContext = CorsairPluginContext<
	typeof ActiveCampaignSchema,
	ActiveCampaignPluginOptions,
	undefined,
	typeof activecampaignAuthConfig
>;

export type ActiveCampaignKeyBuilderContext = KeyBuilderContext<
	ActiveCampaignPluginOptions,
	typeof activecampaignAuthConfig
>;

export type ActiveCampaignBoundEndpoints = BindEndpoints<
	typeof activecampaignEndpointsNested
>;

type ActiveCampaignEndpoint<K extends keyof ActiveCampaignEndpointOutputs> =
	CorsairEndpoint<
		ActiveCampaignContext,
		ActiveCampaignEndpointInputs[K],
		ActiveCampaignEndpointOutputs[K]
	>;

export type ActiveCampaignEndpoints = {
	contactsList: ActiveCampaignEndpoint<'contactsList'>;
	contactsGet: ActiveCampaignEndpoint<'contactsGet'>;
	contactsFind: ActiveCampaignEndpoint<'contactsFind'>;
	contactsCreateOrUpdate: ActiveCampaignEndpoint<'contactsCreateOrUpdate'>;
	contactsUpdate: ActiveCampaignEndpoint<'contactsUpdate'>;
	contactsDelete: ActiveCampaignEndpoint<'contactsDelete'>;
	contactsGetLists: ActiveCampaignEndpoint<'contactsGetLists'>;
	contactsGetTags: ActiveCampaignEndpoint<'contactsGetTags'>;
	contactsGetFieldValues: ActiveCampaignEndpoint<'contactsGetFieldValues'>;
	contactsGetAutomations: ActiveCampaignEndpoint<'contactsGetAutomations'>;
	contactsGetGeoIps: ActiveCampaignEndpoint<'contactsGetGeoIps'>;
	contactsGetScoreValues: ActiveCampaignEndpoint<'contactsGetScoreValues'>;
	contactsGetDeals: ActiveCampaignEndpoint<'contactsGetDeals'>;
	listsList: ActiveCampaignEndpoint<'listsList'>;
	listsGet: ActiveCampaignEndpoint<'listsGet'>;
	listsCreate: ActiveCampaignEndpoint<'listsCreate'>;
	listsDelete: ActiveCampaignEndpoint<'listsDelete'>;
	listsUpdateSubscription: ActiveCampaignEndpoint<'listsUpdateSubscription'>;
	contactListsList: ActiveCampaignEndpoint<'contactListsList'>;
	tagsList: ActiveCampaignEndpoint<'tagsList'>;
	tagsGet: ActiveCampaignEndpoint<'tagsGet'>;
	tagsCreate: ActiveCampaignEndpoint<'tagsCreate'>;
	tagsUpdate: ActiveCampaignEndpoint<'tagsUpdate'>;
	tagsDelete: ActiveCampaignEndpoint<'tagsDelete'>;
	tagsAddToContact: ActiveCampaignEndpoint<'tagsAddToContact'>;
	tagsRemoveFromContact: ActiveCampaignEndpoint<'tagsRemoveFromContact'>;
	contactTagsList: ActiveCampaignEndpoint<'contactTagsList'>;
	fieldsList: ActiveCampaignEndpoint<'fieldsList'>;
	fieldsGet: ActiveCampaignEndpoint<'fieldsGet'>;
	fieldsCreate: ActiveCampaignEndpoint<'fieldsCreate'>;
	fieldsUpdate: ActiveCampaignEndpoint<'fieldsUpdate'>;
	fieldsDelete: ActiveCampaignEndpoint<'fieldsDelete'>;
	fieldOptionsCreateBulk: ActiveCampaignEndpoint<'fieldOptionsCreateBulk'>;
	fieldValuesList: ActiveCampaignEndpoint<'fieldValuesList'>;
	fieldValuesGet: ActiveCampaignEndpoint<'fieldValuesGet'>;
	fieldValuesSetForContact: ActiveCampaignEndpoint<'fieldValuesSetForContact'>;
	fieldValuesUpdate: ActiveCampaignEndpoint<'fieldValuesUpdate'>;
	fieldValuesDelete: ActiveCampaignEndpoint<'fieldValuesDelete'>;
	fieldRelsList: ActiveCampaignEndpoint<'fieldRelsList'>;
	fieldRelsCreate: ActiveCampaignEndpoint<'fieldRelsCreate'>;
	fieldRelsDelete: ActiveCampaignEndpoint<'fieldRelsDelete'>;
	groupMembersList: ActiveCampaignEndpoint<'groupMembersList'>;
	groupMembersCreate: ActiveCampaignEndpoint<'groupMembersCreate'>;
	groupMembersUpdate: ActiveCampaignEndpoint<'groupMembersUpdate'>;
	groupMembersDelete: ActiveCampaignEndpoint<'groupMembersDelete'>;
};

/**
 * The nested tree is grouped by API resource, and each leaf is named so that
 * `<group>.<leaf>` camel-cased gives exactly the operation key used by the
 * schema registry - `fieldValues.setForContact` -> `fieldValuesSetForContact`.
 * `endpoints.test.ts` asserts that mapping holds for every path, because the
 * retry-safety check depends on translating one into the other.
 */
const activecampaignEndpointsNested = {
	contacts: {
		list: Contacts.list,
		get: Contacts.get,
		find: Contacts.find,
		createOrUpdate: Contacts.createOrUpdate,
		update: Contacts.update,
		delete: Contacts.remove,
		getLists: Contacts.getLists,
		getTags: Contacts.getTags,
		getFieldValues: Contacts.getFieldValues,
		getAutomations: Contacts.getAutomations,
		getGeoIps: Contacts.getGeoIps,
		getScoreValues: Contacts.getScoreValues,
		getDeals: Contacts.getDeals,
	},
	lists: {
		list: Lists.list,
		get: Lists.get,
		create: Lists.create,
		delete: Lists.remove,
		updateSubscription: Lists.updateSubscription,
	},
	contactLists: {
		list: Lists.listContactLists,
	},
	tags: {
		list: Tags.list,
		get: Tags.get,
		create: Tags.create,
		update: Tags.update,
		delete: Tags.remove,
		addToContact: Tags.addToContact,
		removeFromContact: Tags.removeFromContact,
	},
	contactTags: {
		list: Tags.listContactTags,
	},
	fields: {
		list: Fields.list,
		get: Fields.get,
		create: Fields.create,
		update: Fields.update,
		delete: Fields.remove,
	},
	fieldOptions: {
		createBulk: Fields.createOptionsBulk,
	},
	fieldValues: {
		list: Fields.listValues,
		get: Fields.getValue,
		setForContact: Fields.setValueForContact,
		update: Fields.updateValue,
		delete: Fields.removeValue,
	},
	fieldRels: {
		list: Fields.listRels,
		create: Fields.createRel,
		delete: Fields.removeRel,
	},
	groupMembers: {
		list: Fields.listGroupMembers,
		create: Fields.createGroupMember,
		update: Fields.updateGroupMember,
		delete: Fields.removeGroupMember,
	},
} as const;

const I = ActiveCampaignEndpointInputSchemas;
const O = ActiveCampaignEndpointOutputSchemas;

export const activecampaignEndpointSchemas = {
	'contacts.list': { input: I.contactsList, output: O.contactsList },
	'contacts.get': { input: I.contactsGet, output: O.contactsGet },
	'contacts.find': { input: I.contactsFind, output: O.contactsFind },
	'contacts.createOrUpdate': {
		input: I.contactsCreateOrUpdate,
		output: O.contactsCreateOrUpdate,
	},
	'contacts.update': { input: I.contactsUpdate, output: O.contactsUpdate },
	'contacts.delete': { input: I.contactsDelete, output: O.contactsDelete },
	'contacts.getLists': { input: I.contactsGetLists, output: O.contactsGetLists },
	'contacts.getTags': { input: I.contactsGetTags, output: O.contactsGetTags },
	'contacts.getFieldValues': {
		input: I.contactsGetFieldValues,
		output: O.contactsGetFieldValues,
	},
	'contacts.getAutomations': {
		input: I.contactsGetAutomations,
		output: O.contactsGetAutomations,
	},
	'contacts.getGeoIps': {
		input: I.contactsGetGeoIps,
		output: O.contactsGetGeoIps,
	},
	'contacts.getScoreValues': {
		input: I.contactsGetScoreValues,
		output: O.contactsGetScoreValues,
	},
	'contacts.getDeals': { input: I.contactsGetDeals, output: O.contactsGetDeals },
	'lists.list': { input: I.listsList, output: O.listsList },
	'lists.get': { input: I.listsGet, output: O.listsGet },
	'lists.create': { input: I.listsCreate, output: O.listsCreate },
	'lists.delete': { input: I.listsDelete, output: O.listsDelete },
	'lists.updateSubscription': {
		input: I.listsUpdateSubscription,
		output: O.listsUpdateSubscription,
	},
	'contactLists.list': { input: I.contactListsList, output: O.contactListsList },
	'tags.list': { input: I.tagsList, output: O.tagsList },
	'tags.get': { input: I.tagsGet, output: O.tagsGet },
	'tags.create': { input: I.tagsCreate, output: O.tagsCreate },
	'tags.update': { input: I.tagsUpdate, output: O.tagsUpdate },
	'tags.delete': { input: I.tagsDelete, output: O.tagsDelete },
	'tags.addToContact': { input: I.tagsAddToContact, output: O.tagsAddToContact },
	'tags.removeFromContact': {
		input: I.tagsRemoveFromContact,
		output: O.tagsRemoveFromContact,
	},
	'contactTags.list': { input: I.contactTagsList, output: O.contactTagsList },
	'fields.list': { input: I.fieldsList, output: O.fieldsList },
	'fields.get': { input: I.fieldsGet, output: O.fieldsGet },
	'fields.create': { input: I.fieldsCreate, output: O.fieldsCreate },
	'fields.update': { input: I.fieldsUpdate, output: O.fieldsUpdate },
	'fields.delete': { input: I.fieldsDelete, output: O.fieldsDelete },
	'fieldOptions.createBulk': {
		input: I.fieldOptionsCreateBulk,
		output: O.fieldOptionsCreateBulk,
	},
	'fieldValues.list': { input: I.fieldValuesList, output: O.fieldValuesList },
	'fieldValues.get': { input: I.fieldValuesGet, output: O.fieldValuesGet },
	'fieldValues.setForContact': {
		input: I.fieldValuesSetForContact,
		output: O.fieldValuesSetForContact,
	},
	'fieldValues.update': {
		input: I.fieldValuesUpdate,
		output: O.fieldValuesUpdate,
	},
	'fieldValues.delete': {
		input: I.fieldValuesDelete,
		output: O.fieldValuesDelete,
	},
	'fieldRels.list': { input: I.fieldRelsList, output: O.fieldRelsList },
	'fieldRels.create': { input: I.fieldRelsCreate, output: O.fieldRelsCreate },
	'fieldRels.delete': { input: I.fieldRelsDelete, output: O.fieldRelsDelete },
	'groupMembers.list': { input: I.groupMembersList, output: O.groupMembersList },
	'groupMembers.create': {
		input: I.groupMembersCreate,
		output: O.groupMembersCreate,
	},
	'groupMembers.update': {
		input: I.groupMembersUpdate,
		output: O.groupMembersUpdate,
	},
	'groupMembers.delete': {
		input: I.groupMembersDelete,
		output: O.groupMembersDelete,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof activecampaignEndpointsNested
>;

/**
 * ActiveCampaign does offer webhooks, but this plugin exposes no Corsair
 * triggers - the webhook operations in the catalog manage subscriptions rather
 * than deliver events here. The tree is declared empty so the plugin still
 * satisfies the webhook-shaped generics, and the matcher returns false so no
 * incoming request is ever routed to this plugin.
 */
const activecampaignWebhooksNested = {} as const;

const defaultAuthType: AuthTypes = 'api_key' as const;

const activecampaignEndpointMeta = {
	'contacts.list': {
		riskLevel: 'read',
		description: 'List contacts with pagination and filters',
	},
	'contacts.get': {
		riskLevel: 'read',
		description: 'Retrieve a contact by its ID',
	},
	'contacts.find': {
		riskLevel: 'read',
		description: 'Find a contact by email address',
	},
	'contacts.createOrUpdate': {
		riskLevel: 'write',
		description: 'Create a contact, or update it if the email already exists',
	},
	'contacts.update': {
		riskLevel: 'write',
		description: 'Update an existing contact by its ID',
	},
	'contacts.delete': {
		riskLevel: 'destructive',
		description: 'Delete a contact by its ID',
	},
	'contacts.getLists': {
		riskLevel: 'read',
		description: 'List the list memberships of a contact',
	},
	'contacts.getTags': {
		riskLevel: 'read',
		description: 'List the tags applied to a contact',
	},
	'contacts.getFieldValues': {
		riskLevel: 'read',
		description: 'List the custom field values of a contact',
	},
	'contacts.getAutomations': {
		riskLevel: 'read',
		description: 'List the automations a contact is enrolled in',
	},
	'contacts.getGeoIps': {
		riskLevel: 'read',
		description: 'List the geo IP records associated with a contact',
	},
	'contacts.getScoreValues': {
		riskLevel: 'read',
		description: 'List the score values of a contact',
	},
	'contacts.getDeals': {
		riskLevel: 'read',
		description: 'List the deals associated with a contact',
	},
	'lists.list': {
		riskLevel: 'read',
		description: 'List mailing lists with pagination',
	},
	'lists.get': {
		riskLevel: 'read',
		description: 'Retrieve a mailing list by its ID',
	},
	'lists.create': {
		riskLevel: 'write',
		description: 'Create a new mailing list',
	},
	'lists.delete': {
		riskLevel: 'destructive',
		description: 'Delete a mailing list by its ID',
	},
	'lists.updateSubscription': {
		riskLevel: 'write',
		description: 'Subscribe or unsubscribe a contact to or from a list',
	},
	'contactLists.list': {
		riskLevel: 'read',
		description: 'List all contact-to-list memberships',
	},
	'tags.list': {
		riskLevel: 'read',
		description: 'List tags with pagination and search',
	},
	'tags.get': {
		riskLevel: 'read',
		description: 'Retrieve a tag by its ID',
	},
	'tags.create': {
		riskLevel: 'write',
		description: 'Create a new tag',
	},
	'tags.update': {
		riskLevel: 'write',
		description: 'Update an existing tag by its ID',
	},
	'tags.delete': {
		riskLevel: 'destructive',
		description: 'Delete a tag by its ID',
	},
	'tags.addToContact': {
		riskLevel: 'write',
		description: 'Apply a tag to a contact',
	},
	'tags.removeFromContact': {
		riskLevel: 'destructive',
		description: 'Remove a tag from a contact by its contactTag ID',
	},
	'contactTags.list': {
		riskLevel: 'read',
		description: 'List all contact-to-tag associations',
	},
	'fields.list': {
		riskLevel: 'read',
		description: 'List custom field definitions with pagination',
	},
	'fields.get': {
		riskLevel: 'read',
		description: 'Retrieve a custom field definition by its ID',
	},
	'fields.create': {
		riskLevel: 'write',
		description: 'Create a new custom contact field',
	},
	'fields.update': {
		riskLevel: 'write',
		description: 'Update an existing custom field definition',
	},
	'fields.delete': {
		riskLevel: 'destructive',
		description: 'Delete a custom field and every value stored against it',
	},
	'fieldOptions.createBulk': {
		riskLevel: 'write',
		description: 'Create options in bulk for a dropdown or listbox field',
	},
	'fieldValues.list': {
		riskLevel: 'read',
		description: 'List custom field values across all contacts',
	},
	'fieldValues.get': {
		riskLevel: 'read',
		description: 'Retrieve a single custom field value by its ID',
	},
	'fieldValues.setForContact': {
		riskLevel: 'write',
		description: 'Set a custom field value on a contact',
	},
	'fieldValues.update': {
		riskLevel: 'write',
		description: 'Update an existing custom field value by its ID',
	},
	'fieldValues.delete': {
		riskLevel: 'destructive',
		description: 'Delete a custom field value by its ID',
	},
	'fieldRels.list': {
		riskLevel: 'read',
		description: 'List relationships between custom fields and lists',
	},
	'fieldRels.create': {
		riskLevel: 'write',
		description: 'Associate a custom field with a list',
	},
	'fieldRels.delete': {
		riskLevel: 'destructive',
		description: 'Remove the association between a custom field and a list',
	},
	'groupMembers.list': {
		riskLevel: 'read',
		description: 'List which custom fields belong to which display groups',
	},
	'groupMembers.create': {
		riskLevel: 'write',
		description: 'Add a custom field to a display group so it becomes visible',
	},
	'groupMembers.update': {
		riskLevel: 'write',
		description: 'Change the display group or ordering of a custom field',
	},
	'groupMembers.delete': {
		riskLevel: 'destructive',
		description: 'Remove a custom field from its display group',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof activecampaignEndpointsNested
>;

export type BaseActiveCampaignPlugin<T extends ActiveCampaignPluginOptions> =
	CorsairPlugin<
		'activecampaign',
		typeof ActiveCampaignSchema,
		typeof activecampaignEndpointsNested,
		typeof activecampaignWebhooksNested,
		T,
		typeof defaultAuthType,
		typeof activecampaignAuthConfig
	>;

export type InternalActiveCampaignPlugin =
	BaseActiveCampaignPlugin<ActiveCampaignPluginOptions>;

export type ExternalActiveCampaignPlugin<
	T extends ActiveCampaignPluginOptions,
> = BaseActiveCampaignPlugin<T>;

export function activecampaign<const T extends ActiveCampaignPluginOptions>(
	incomingOptions: ActiveCampaignPluginOptions & T = {} as ActiveCampaignPluginOptions &
		T,
): ExternalActiveCampaignPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'activecampaign',
		schema: ActiveCampaignSchema,
		options: options,
		hooks: options.hooks,
		endpoints: activecampaignEndpointsNested,
		webhooks: activecampaignWebhooksNested,
		authConfig: activecampaignAuthConfig,
		endpointMeta: activecampaignEndpointMeta,
		endpointSchemas: activecampaignEndpointSchemas,
		webhookSchemas: {},
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ActiveCampaignKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('activecampaign', 'api_key');
				}
				return res;
			}
			throw new AuthMissingError('activecampaign', 'api_key');
		},
	};
}

export { activecampaignEndpointMeta };
export type { ActiveCampaignEndpointInputs, ActiveCampaignEndpointOutputs };
