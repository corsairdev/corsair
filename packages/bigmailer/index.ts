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
import {
	Auth,
	BrandProperties,
	Brands,
	BulkCampaigns,
	Connections,
	Contacts,
	Fields,
	Lists,
	MessageTypes,
	Segments,
	Senders,
	SuppressionLists,
	Templates,
	TransactionalCampaigns,
	Users,
} from './endpoints';
import type {
	BigmailerEndpointInputs,
	BigmailerEndpointOutputs,
} from './endpoints/types';
import {
	BigmailerEndpointInputSchemas,
	BigmailerEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BigmailerSchema } from './schema';

export type BigmailerPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalBigmailerPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof bigmailerEndpointsNested>;
};

/** BigMailer authenticates every request with a single API key, sent as `X-API-Key`. See `client.ts`. */
export const bigmailerAuthConfig = {
	api_key: { account: [] as const },
} as const satisfies PluginAuthConfig;

export type BigmailerContext = CorsairPluginContext<
	typeof BigmailerSchema,
	BigmailerPluginOptions,
	undefined,
	typeof bigmailerAuthConfig
>;

export type BigmailerKeyBuilderContext =
	KeyBuilderContext<BigmailerPluginOptions>;

export type BigmailerBoundEndpoints = BindEndpoints<
	typeof bigmailerEndpointsNested
>;

type BigmailerEndpoint<K extends keyof BigmailerEndpointOutputs> =
	CorsairEndpoint<
		BigmailerContext,
		BigmailerEndpointInputs[K],
		BigmailerEndpointOutputs[K]
	>;

export type BigmailerEndpoints = {
	brandsList: BigmailerEndpoint<'brandsList'>;
	brandsCreate: BigmailerEndpoint<'brandsCreate'>;
	brandsGet: BigmailerEndpoint<'brandsGet'>;
	brandsUpdate: BigmailerEndpoint<'brandsUpdate'>;

	brandPropertiesList: BigmailerEndpoint<'brandPropertiesList'>;
	brandPropertiesCreate: BigmailerEndpoint<'brandPropertiesCreate'>;
	brandPropertiesGet: BigmailerEndpoint<'brandPropertiesGet'>;
	brandPropertiesUpdate: BigmailerEndpoint<'brandPropertiesUpdate'>;
	brandPropertiesDelete: BigmailerEndpoint<'brandPropertiesDelete'>;

	fieldsList: BigmailerEndpoint<'fieldsList'>;
	fieldsCreate: BigmailerEndpoint<'fieldsCreate'>;
	fieldsGet: BigmailerEndpoint<'fieldsGet'>;
	fieldsUpdate: BigmailerEndpoint<'fieldsUpdate'>;
	fieldsDelete: BigmailerEndpoint<'fieldsDelete'>;

	listsList: BigmailerEndpoint<'listsList'>;
	listsCreate: BigmailerEndpoint<'listsCreate'>;
	listsGet: BigmailerEndpoint<'listsGet'>;
	listsUpdate: BigmailerEndpoint<'listsUpdate'>;
	listsDelete: BigmailerEndpoint<'listsDelete'>;

	connectionsList: BigmailerEndpoint<'connectionsList'>;

	messageTypesList: BigmailerEndpoint<'messageTypesList'>;

	sendersList: BigmailerEndpoint<'sendersList'>;

	contactsList: BigmailerEndpoint<'contactsList'>;
	contactsCreate: BigmailerEndpoint<'contactsCreate'>;
	contactsGet: BigmailerEndpoint<'contactsGet'>;
	contactsUpdate: BigmailerEndpoint<'contactsUpdate'>;
	contactsDelete: BigmailerEndpoint<'contactsDelete'>;
	contactsUpsert: BigmailerEndpoint<'contactsUpsert'>;
	contactsCreateBatch: BigmailerEndpoint<'contactsCreateBatch'>;
	contactsGetBatch: BigmailerEndpoint<'contactsGetBatch'>;

	segmentsList: BigmailerEndpoint<'segmentsList'>;
	segmentsCreate: BigmailerEndpoint<'segmentsCreate'>;
	segmentsGet: BigmailerEndpoint<'segmentsGet'>;
	segmentsUpdate: BigmailerEndpoint<'segmentsUpdate'>;
	segmentsDelete: BigmailerEndpoint<'segmentsDelete'>;

	suppressionListsList: BigmailerEndpoint<'suppressionListsList'>;
	suppressionListsCreate: BigmailerEndpoint<'suppressionListsCreate'>;
	suppressionListsGet: BigmailerEndpoint<'suppressionListsGet'>;

	templatesList: BigmailerEndpoint<'templatesList'>;
	templatesCreate: BigmailerEndpoint<'templatesCreate'>;
	templatesGet: BigmailerEndpoint<'templatesGet'>;
	templatesUpdate: BigmailerEndpoint<'templatesUpdate'>;
	templatesDelete: BigmailerEndpoint<'templatesDelete'>;

	bulkCampaignsList: BigmailerEndpoint<'bulkCampaignsList'>;
	bulkCampaignsCreate: BigmailerEndpoint<'bulkCampaignsCreate'>;
	bulkCampaignsGet: BigmailerEndpoint<'bulkCampaignsGet'>;
	bulkCampaignsUpdate: BigmailerEndpoint<'bulkCampaignsUpdate'>;

	transactionalCampaignsList: BigmailerEndpoint<'transactionalCampaignsList'>;
	transactionalCampaignsCreate: BigmailerEndpoint<'transactionalCampaignsCreate'>;
	transactionalCampaignsGet: BigmailerEndpoint<'transactionalCampaignsGet'>;
	transactionalCampaignsUpdate: BigmailerEndpoint<'transactionalCampaignsUpdate'>;

	usersList: BigmailerEndpoint<'usersList'>;
	usersCreate: BigmailerEndpoint<'usersCreate'>;
	usersGet: BigmailerEndpoint<'usersGet'>;
	usersUpdate: BigmailerEndpoint<'usersUpdate'>;
	usersDelete: BigmailerEndpoint<'usersDelete'>;

	authMe: BigmailerEndpoint<'authMe'>;
};

const bigmailerEndpointsNested = {
	brands: {
		list: Brands.list,
		create: Brands.create,
		get: Brands.get,
		update: Brands.update,
	},
	brandProperties: {
		list: BrandProperties.list,
		create: BrandProperties.create,
		get: BrandProperties.get,
		update: BrandProperties.update,
		delete: BrandProperties.remove,
	},
	fields: {
		list: Fields.list,
		create: Fields.create,
		get: Fields.get,
		update: Fields.update,
		delete: Fields.remove,
	},
	lists: {
		list: Lists.list,
		create: Lists.create,
		get: Lists.get,
		update: Lists.update,
		delete: Lists.remove,
	},
	connections: {
		list: Connections.list,
	},
	messageTypes: {
		list: MessageTypes.list,
	},
	senders: {
		list: Senders.list,
	},
	contacts: {
		list: Contacts.list,
		create: Contacts.create,
		get: Contacts.get,
		update: Contacts.update,
		delete: Contacts.remove,
		upsert: Contacts.upsert,
		createBatch: Contacts.createBatch,
		getBatch: Contacts.getBatch,
	},
	segments: {
		list: Segments.list,
		create: Segments.create,
		get: Segments.get,
		update: Segments.update,
		delete: Segments.remove,
	},
	suppressionLists: {
		list: SuppressionLists.list,
		create: SuppressionLists.create,
		get: SuppressionLists.get,
	},
	templates: {
		list: Templates.list,
		create: Templates.create,
		get: Templates.get,
		update: Templates.update,
		delete: Templates.remove,
	},
	bulkCampaigns: {
		list: BulkCampaigns.list,
		create: BulkCampaigns.create,
		get: BulkCampaigns.get,
		update: BulkCampaigns.update,
	},
	transactionalCampaigns: {
		list: TransactionalCampaigns.list,
		create: TransactionalCampaigns.create,
		get: TransactionalCampaigns.get,
		update: TransactionalCampaigns.update,
	},
	users: {
		list: Users.list,
		create: Users.create,
		get: Users.get,
		update: Users.update,
		delete: Users.remove,
	},
	auth: {
		me: Auth.me,
	},
} as const;

export const bigmailerEndpointSchemas = {
	'brands.list': {
		input: BigmailerEndpointInputSchemas.brandsList,
		output: BigmailerEndpointOutputSchemas.brandsList,
	},
	'brands.create': {
		input: BigmailerEndpointInputSchemas.brandsCreate,
		output: BigmailerEndpointOutputSchemas.brandsCreate,
	},
	'brands.get': {
		input: BigmailerEndpointInputSchemas.brandsGet,
		output: BigmailerEndpointOutputSchemas.brandsGet,
	},
	'brands.update': {
		input: BigmailerEndpointInputSchemas.brandsUpdate,
		output: BigmailerEndpointOutputSchemas.brandsUpdate,
	},

	'brandProperties.list': {
		input: BigmailerEndpointInputSchemas.brandPropertiesList,
		output: BigmailerEndpointOutputSchemas.brandPropertiesList,
	},
	'brandProperties.create': {
		input: BigmailerEndpointInputSchemas.brandPropertiesCreate,
		output: BigmailerEndpointOutputSchemas.brandPropertiesCreate,
	},
	'brandProperties.get': {
		input: BigmailerEndpointInputSchemas.brandPropertiesGet,
		output: BigmailerEndpointOutputSchemas.brandPropertiesGet,
	},
	'brandProperties.update': {
		input: BigmailerEndpointInputSchemas.brandPropertiesUpdate,
		output: BigmailerEndpointOutputSchemas.brandPropertiesUpdate,
	},
	'brandProperties.delete': {
		input: BigmailerEndpointInputSchemas.brandPropertiesDelete,
		output: BigmailerEndpointOutputSchemas.brandPropertiesDelete,
	},

	'fields.list': {
		input: BigmailerEndpointInputSchemas.fieldsList,
		output: BigmailerEndpointOutputSchemas.fieldsList,
	},
	'fields.create': {
		input: BigmailerEndpointInputSchemas.fieldsCreate,
		output: BigmailerEndpointOutputSchemas.fieldsCreate,
	},
	'fields.get': {
		input: BigmailerEndpointInputSchemas.fieldsGet,
		output: BigmailerEndpointOutputSchemas.fieldsGet,
	},
	'fields.update': {
		input: BigmailerEndpointInputSchemas.fieldsUpdate,
		output: BigmailerEndpointOutputSchemas.fieldsUpdate,
	},
	'fields.delete': {
		input: BigmailerEndpointInputSchemas.fieldsDelete,
		output: BigmailerEndpointOutputSchemas.fieldsDelete,
	},

	'lists.list': {
		input: BigmailerEndpointInputSchemas.listsList,
		output: BigmailerEndpointOutputSchemas.listsList,
	},
	'lists.create': {
		input: BigmailerEndpointInputSchemas.listsCreate,
		output: BigmailerEndpointOutputSchemas.listsCreate,
	},
	'lists.get': {
		input: BigmailerEndpointInputSchemas.listsGet,
		output: BigmailerEndpointOutputSchemas.listsGet,
	},
	'lists.update': {
		input: BigmailerEndpointInputSchemas.listsUpdate,
		output: BigmailerEndpointOutputSchemas.listsUpdate,
	},
	'lists.delete': {
		input: BigmailerEndpointInputSchemas.listsDelete,
		output: BigmailerEndpointOutputSchemas.listsDelete,
	},

	'connections.list': {
		input: BigmailerEndpointInputSchemas.connectionsList,
		output: BigmailerEndpointOutputSchemas.connectionsList,
	},

	'messageTypes.list': {
		input: BigmailerEndpointInputSchemas.messageTypesList,
		output: BigmailerEndpointOutputSchemas.messageTypesList,
	},

	'senders.list': {
		input: BigmailerEndpointInputSchemas.sendersList,
		output: BigmailerEndpointOutputSchemas.sendersList,
	},

	'contacts.list': {
		input: BigmailerEndpointInputSchemas.contactsList,
		output: BigmailerEndpointOutputSchemas.contactsList,
	},
	'contacts.create': {
		input: BigmailerEndpointInputSchemas.contactsCreate,
		output: BigmailerEndpointOutputSchemas.contactsCreate,
	},
	'contacts.get': {
		input: BigmailerEndpointInputSchemas.contactsGet,
		output: BigmailerEndpointOutputSchemas.contactsGet,
	},
	'contacts.update': {
		input: BigmailerEndpointInputSchemas.contactsUpdate,
		output: BigmailerEndpointOutputSchemas.contactsUpdate,
	},
	'contacts.delete': {
		input: BigmailerEndpointInputSchemas.contactsDelete,
		output: BigmailerEndpointOutputSchemas.contactsDelete,
	},
	'contacts.upsert': {
		input: BigmailerEndpointInputSchemas.contactsUpsert,
		output: BigmailerEndpointOutputSchemas.contactsUpsert,
	},
	'contacts.createBatch': {
		input: BigmailerEndpointInputSchemas.contactsCreateBatch,
		output: BigmailerEndpointOutputSchemas.contactsCreateBatch,
	},
	'contacts.getBatch': {
		input: BigmailerEndpointInputSchemas.contactsGetBatch,
		output: BigmailerEndpointOutputSchemas.contactsGetBatch,
	},

	'segments.list': {
		input: BigmailerEndpointInputSchemas.segmentsList,
		output: BigmailerEndpointOutputSchemas.segmentsList,
	},
	'segments.create': {
		input: BigmailerEndpointInputSchemas.segmentsCreate,
		output: BigmailerEndpointOutputSchemas.segmentsCreate,
	},
	'segments.get': {
		input: BigmailerEndpointInputSchemas.segmentsGet,
		output: BigmailerEndpointOutputSchemas.segmentsGet,
	},
	'segments.update': {
		input: BigmailerEndpointInputSchemas.segmentsUpdate,
		output: BigmailerEndpointOutputSchemas.segmentsUpdate,
	},
	'segments.delete': {
		input: BigmailerEndpointInputSchemas.segmentsDelete,
		output: BigmailerEndpointOutputSchemas.segmentsDelete,
	},

	'suppressionLists.list': {
		input: BigmailerEndpointInputSchemas.suppressionListsList,
		output: BigmailerEndpointOutputSchemas.suppressionListsList,
	},
	'suppressionLists.create': {
		input: BigmailerEndpointInputSchemas.suppressionListsCreate,
		output: BigmailerEndpointOutputSchemas.suppressionListsCreate,
	},
	'suppressionLists.get': {
		input: BigmailerEndpointInputSchemas.suppressionListsGet,
		output: BigmailerEndpointOutputSchemas.suppressionListsGet,
	},

	'templates.list': {
		input: BigmailerEndpointInputSchemas.templatesList,
		output: BigmailerEndpointOutputSchemas.templatesList,
	},
	'templates.create': {
		input: BigmailerEndpointInputSchemas.templatesCreate,
		output: BigmailerEndpointOutputSchemas.templatesCreate,
	},
	'templates.get': {
		input: BigmailerEndpointInputSchemas.templatesGet,
		output: BigmailerEndpointOutputSchemas.templatesGet,
	},
	'templates.update': {
		input: BigmailerEndpointInputSchemas.templatesUpdate,
		output: BigmailerEndpointOutputSchemas.templatesUpdate,
	},
	'templates.delete': {
		input: BigmailerEndpointInputSchemas.templatesDelete,
		output: BigmailerEndpointOutputSchemas.templatesDelete,
	},

	'bulkCampaigns.list': {
		input: BigmailerEndpointInputSchemas.bulkCampaignsList,
		output: BigmailerEndpointOutputSchemas.bulkCampaignsList,
	},
	'bulkCampaigns.create': {
		input: BigmailerEndpointInputSchemas.bulkCampaignsCreate,
		output: BigmailerEndpointOutputSchemas.bulkCampaignsCreate,
	},
	'bulkCampaigns.get': {
		input: BigmailerEndpointInputSchemas.bulkCampaignsGet,
		output: BigmailerEndpointOutputSchemas.bulkCampaignsGet,
	},
	'bulkCampaigns.update': {
		input: BigmailerEndpointInputSchemas.bulkCampaignsUpdate,
		output: BigmailerEndpointOutputSchemas.bulkCampaignsUpdate,
	},

	'transactionalCampaigns.list': {
		input: BigmailerEndpointInputSchemas.transactionalCampaignsList,
		output: BigmailerEndpointOutputSchemas.transactionalCampaignsList,
	},
	'transactionalCampaigns.create': {
		input: BigmailerEndpointInputSchemas.transactionalCampaignsCreate,
		output: BigmailerEndpointOutputSchemas.transactionalCampaignsCreate,
	},
	'transactionalCampaigns.get': {
		input: BigmailerEndpointInputSchemas.transactionalCampaignsGet,
		output: BigmailerEndpointOutputSchemas.transactionalCampaignsGet,
	},
	'transactionalCampaigns.update': {
		input: BigmailerEndpointInputSchemas.transactionalCampaignsUpdate,
		output: BigmailerEndpointOutputSchemas.transactionalCampaignsUpdate,
	},

	'users.list': {
		input: BigmailerEndpointInputSchemas.usersList,
		output: BigmailerEndpointOutputSchemas.usersList,
	},
	'users.create': {
		input: BigmailerEndpointInputSchemas.usersCreate,
		output: BigmailerEndpointOutputSchemas.usersCreate,
	},
	'users.get': {
		input: BigmailerEndpointInputSchemas.usersGet,
		output: BigmailerEndpointOutputSchemas.usersGet,
	},
	'users.update': {
		input: BigmailerEndpointInputSchemas.usersUpdate,
		output: BigmailerEndpointOutputSchemas.usersUpdate,
	},
	'users.delete': {
		input: BigmailerEndpointInputSchemas.usersDelete,
		output: BigmailerEndpointOutputSchemas.usersDelete,
	},

	'auth.me': {
		input: BigmailerEndpointInputSchemas.authMe,
		output: BigmailerEndpointOutputSchemas.authMe,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof bigmailerEndpointsNested
>;

const defaultAuthType = 'api_key' as const satisfies AuthTypes;

export const bigmailerEndpointMeta = {
	'brands.list': {
		riskLevel: 'read',
		description: 'List brands in the account',
	},
	'brands.create': { riskLevel: 'write', description: 'Create a brand' },
	'brands.get': { riskLevel: 'read', description: 'Retrieve a brand' },
	'brands.update': {
		riskLevel: 'write',
		description: "Update a brand's settings",
	},

	'brandProperties.list': {
		riskLevel: 'read',
		description: "List a brand's custom merge-tag properties",
	},
	'brandProperties.create': {
		riskLevel: 'write',
		description: 'Create a brand property',
	},
	'brandProperties.get': {
		riskLevel: 'read',
		description: 'Retrieve a brand property',
	},
	'brandProperties.update': {
		riskLevel: 'write',
		description: 'Update a brand property',
	},
	'brandProperties.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a brand property',
	},

	'fields.list': {
		riskLevel: 'read',
		description: "List a brand's custom contact fields",
	},
	'fields.create': {
		riskLevel: 'write',
		description: 'Create a custom contact field',
	},
	'fields.get': {
		riskLevel: 'read',
		description: 'Retrieve a custom contact field',
	},
	'fields.update': {
		riskLevel: 'write',
		description: "Update a custom contact field's name or sample value",
	},
	'fields.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a custom contact field',
	},

	'lists.list': {
		riskLevel: 'read',
		description: "List a brand's contact lists",
	},
	'lists.create': { riskLevel: 'write', description: 'Create a contact list' },
	'lists.get': { riskLevel: 'read', description: 'Retrieve a contact list' },
	'lists.update': { riskLevel: 'write', description: 'Rename a contact list' },
	'lists.delete': {
		riskLevel: 'destructive',
		description: 'Delete a contact list (its contacts are not deleted)',
	},

	'connections.list': {
		riskLevel: 'read',
		description: "List a brand's email-delivery connections",
	},

	'messageTypes.list': {
		riskLevel: 'read',
		description: "List a brand's message-type categories",
	},

	'senders.list': {
		riskLevel: 'read',
		description: "List a brand's verified sender identities",
	},

	'contacts.list': {
		riskLevel: 'read',
		description: "List a brand's contacts",
	},
	'contacts.create': { riskLevel: 'write', description: 'Create a contact' },
	'contacts.get': {
		riskLevel: 'read',
		description: 'Retrieve a contact by id or email address',
	},
	'contacts.update': { riskLevel: 'write', description: 'Update a contact' },
	'contacts.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a contact',
	},
	'contacts.upsert': {
		riskLevel: 'write',
		description: 'Create or update a contact by id or email address',
	},
	'contacts.createBatch': {
		riskLevel: 'write',
		description: 'Upload up to 1,000 contacts for asynchronous processing',
	},
	'contacts.getBatch': {
		riskLevel: 'read',
		description: "Check a contact batch's processing status",
	},

	'segments.list': {
		riskLevel: 'read',
		description: "List a brand's segments",
	},
	'segments.create': { riskLevel: 'write', description: 'Create a segment' },
	'segments.get': { riskLevel: 'read', description: 'Retrieve a segment' },
	'segments.update': { riskLevel: 'write', description: 'Update a segment' },
	'segments.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a segment',
	},

	'suppressionLists.list': {
		riskLevel: 'read',
		description: "List a brand's campaign suppression lists",
	},
	'suppressionLists.create': {
		riskLevel: 'write',
		description: 'Upload a campaign suppression list',
	},
	'suppressionLists.get': {
		riskLevel: 'read',
		description: 'Retrieve a campaign suppression list',
	},

	'templates.list': {
		riskLevel: 'read',
		description: "List a brand's templates",
	},
	'templates.create': { riskLevel: 'write', description: 'Create a template' },
	'templates.get': { riskLevel: 'read', description: 'Retrieve a template' },
	'templates.update': { riskLevel: 'write', description: 'Update a template' },
	'templates.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a template',
	},

	'bulkCampaigns.list': {
		riskLevel: 'read',
		description: "List a brand's bulk (marketing) campaigns",
	},
	'bulkCampaigns.create': {
		riskLevel: 'write',
		description: 'Create a bulk campaign',
	},
	'bulkCampaigns.get': {
		riskLevel: 'read',
		description: 'Retrieve a bulk campaign, including its send metrics',
	},
	'bulkCampaigns.update': {
		riskLevel: 'write',
		description:
			'Update a bulk campaign - set ready:true to activate sending or scheduling',
	},

	'transactionalCampaigns.list': {
		riskLevel: 'read',
		description: "List a brand's transactional campaigns",
	},
	'transactionalCampaigns.create': {
		riskLevel: 'write',
		description: 'Create a transactional campaign',
	},
	'transactionalCampaigns.get': {
		riskLevel: 'read',
		description:
			'Retrieve a transactional campaign, including its send metrics',
	},
	'transactionalCampaigns.update': {
		riskLevel: 'write',
		description:
			'Update a transactional campaign - set ready:true to activate it',
	},

	'users.list': { riskLevel: 'read', description: 'List account users' },
	'users.create': {
		riskLevel: 'write',
		description: 'Invite a new user to the account',
	},
	'users.get': { riskLevel: 'read', description: 'Retrieve an account user' },
	'users.update': {
		riskLevel: 'write',
		description: "Update a user's email, role, or allowed brands",
	},
	'users.delete': {
		riskLevel: 'destructive',
		description: 'Remove a user from the account',
	},

	'auth.me': {
		riskLevel: 'read',
		description: 'Check the authenticated API key and account configuration',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof bigmailerEndpointsNested
>;

export type BaseBigmailerPlugin<T extends BigmailerPluginOptions> =
	CorsairPlugin<
		'bigmailer',
		typeof BigmailerSchema,
		typeof bigmailerEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType
	>;

export type InternalBigmailerPlugin =
	BaseBigmailerPlugin<BigmailerPluginOptions>;

export type ExternalBigmailerPlugin<T extends BigmailerPluginOptions> =
	BaseBigmailerPlugin<T>;

/**
 * The BigMailer plugin - all 57 catalog operations across brands, brand
 * properties, fields, lists, connections, message types, senders, contacts,
 * segments, suppression lists, templates, bulk campaigns, transactional
 * campaigns, users, and `auth.me`.
 *
 * Every route was live-verified against a real account, including twelve
 * routing corrections a docs-only build had gotten wrong (see
 * `endpoints/types.ts`'s header comment for the list) - update is `POST`
 * across this entire API, never `PUT`/`PATCH`, confirmed live on every
 * write operation except `users.create`, which would send a real
 * invitation email to exercise and so is documented at its own declaration
 * as still unverified rather than guessed silently.
 *
 * **No webhooks, no OAuth.** The catalog declares 0 triggers and API-key-only
 * auth for this plugin - confirmed from `corsair.dev/oss`'s own catalog
 * entry - so, like Doppler, this plugin has no `webhooks/` surface at all.
 *
 * **No official downloadable OpenAPI spec.** BigMailer's docs site is
 * ReadMe.io-hosted; `docs.bigmailer.io/reference/<slug>.md` gives each
 * operation's own machine-readable page, which is where routing started -
 * every route was then confirmed or corrected against the live API rather
 * than trusted as final.
 */
export function bigmailer<const T extends BigmailerPluginOptions>(
	incomingOptions: BigmailerPluginOptions & T = {} as BigmailerPluginOptions &
		T,
): ExternalBigmailerPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'bigmailer',
		authConfig: bigmailerAuthConfig,
		schema: BigmailerSchema,
		options: options,
		hooks: options.hooks,
		endpoints: bigmailerEndpointsNested,
		webhooks: {},
		endpointMeta: bigmailerEndpointMeta,
		endpointSchemas: bigmailerEndpointSchemas,
		webhookSchemas: {},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: BigmailerKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}
			return '';
		},
	} satisfies InternalBigmailerPlugin;
}

export type {
	BigmailerEndpointInputs,
	BigmailerEndpointOutputs,
} from './endpoints/types';
