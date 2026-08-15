import type {
	AuthTypes,
	BindEndpoints,
	BindWebhooks,
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
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	Account,
	ActionClasses,
	ClientApi,
	Contacts,
	Organization,
	Responses,
	Storage,
	Surveys,
	Webhooks,
} from './endpoints';
import type {
	FormbricksEndpointInputs,
	FormbricksEndpointOutputs,
} from './endpoints/types';
import {
	FormbricksEndpointInputSchemas,
	FormbricksEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { FormbricksSchema } from './schema';

export type FormbricksPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	/**
	 * Overrides the API host, for a self-hosted Formbricks instance.
	 *
	 * Cloud is the default and is what this plugin is verified against. Self-hosting is supported
	 * upstream but needs an Ubuntu VM, a custom domain and ports 80/443, so it was not exercised
	 * here - the option exists because the only difference is the host.
	 */
	host?: string;
	hooks?: InternalFormbricksPlugin['hooks'];
	webhookHooks?: InternalFormbricksPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof formbricksEndpointsNested>;
};

/**
 * Formbricks authenticates with a personal API key presented as an `x-api-key` header.
 *
 * One credential and no resolution chain: the key identifies the account, and both OpenAPI
 * documents declare `apiKeyAuth` as the only security scheme. There is no OAuth surface in the
 * catalog, so `api_key` is the only auth type declared.
 *
 * **A key's scope matters more here than on most providers.** A key can be organization-scoped or
 * workspace-scoped, and an organization-scoped key returns 401 on every workspace-scoped management
 * route - which is most of them. `me.get` reports which it is, and the `AUTH_ERROR` handler says so,
 * because the failure otherwise looks like a bad key rather than a mis-scoped one.
 */
export const formbricksAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type FormbricksContext = CorsairPluginContext<
	typeof FormbricksSchema,
	FormbricksPluginOptions,
	undefined,
	typeof formbricksAuthConfig
>;

export type FormbricksKeyBuilderContext =
	KeyBuilderContext<FormbricksPluginOptions>;

export type FormbricksBoundEndpoints = BindEndpoints<
	typeof formbricksEndpointsNested
>;

type FormbricksEndpoint<K extends keyof FormbricksEndpointOutputs> =
	CorsairEndpoint<
		FormbricksContext,
		FormbricksEndpointInputs[K],
		FormbricksEndpointOutputs[K]
	>;

export type FormbricksEndpoints = {
	[K in keyof FormbricksEndpointOutputs]: FormbricksEndpoint<K>;
};

/**
 * Formbricks sends outbound webhooks when a response arrives, and the five webhook operations in
 * this plugin manage those subscriptions - but they are **endpoints, not Corsair triggers**.
 *
 * The catalog lists zero triggers and its Webhooks section reads "No webhooks", so no webhook
 * handler is registered and the generated webhook scaffolding was removed rather than left as dead
 * code.
 */
export type FormbricksWebhooks = Record<string, never>;

export type FormbricksBoundWebhooks = BindWebhooks<FormbricksWebhooks>;

/**
 * The endpoint registry - **47 operations covering all 46 catalog ids, over 38 distinct routes.**
 *
 * The three numbers differ, and the difference is the honest part rather than an inconsistency:
 *
 * **Four operations are aliases.** Formbricks renamed "people" to "contacts" and "attribute classes"
 * to "contact attribute keys" and deleted the old routes, but the catalog still lists both names. So
 * `contacts.listPeople`, `contacts.getPerson`, `contactAttributeKeys.listClasses` and
 * `contactAttributeKeys.getClass` call the **same URLs** as `contacts.list`, `contacts.get`,
 * `contactAttributeKeys.list` and `contactAttributeKeys.get`. They exist so that no catalog id 404s
 * for a caller working from the older entries - not because there is a second capability behind them,
 * and the registry descriptions say so on each one. `endpoints.test.ts` asserts every alias still
 * points at its primary's route, and that each emits its own audit event so the two stay
 * distinguishable in a log.
 *
 * **Three more removed-route ids are real capabilities**, not aliases, and are implemented against
 * the current routes: `DELETE_PERSON` as `contacts.delete`, `CREATE_ATTRIBUTE_CLASS` as
 * `contactAttributeKeys.create`, `DELETE_ATTRIBUTE_CLASS` as `contactAttributeKeys.delete`.
 *
 * **`UPDATE_CONTACT_ATTRIBUTES` has no management route at all** - five candidates answer 404 or 405 -
 * so `contacts.updateAttributes` serves it over the client user route, which upserts by `userId`.
 *
 * **One operation claims no catalog id**: `contactAttributeKeys.update`, which edits an attribute
 * key's *definition*. The catalog has no id for it; it is kept because the capability is real.
 *
 * Aliases are not the only operations sharing a URL - the two health ids, the two v1 `me` ids and the
 * three that post to the client user route do too - which is why 47 operations resolve to 38 routes.
 */
const formbricksEndpointsNested = {
	surveys: {
		list: Surveys.list,
		create: Surveys.create,
		update: Surveys.update,
		delete: Surveys.remove,
	},
	responses: {
		list: Responses.list,
		create: Responses.create,
		update: Responses.update,
		delete: Responses.remove,
	},
	actionClasses: {
		list: ActionClasses.list,
		create: ActionClasses.create,
	},
	contacts: {
		list: Contacts.list,
		// `LIST_MANAGEMENT_PEOPLE` and `GET_PERSON_BY_ID` - the same two routes as `list` and `get`,
		// under the names the catalog still carries from before "people" became "contacts".
		listPeople: Contacts.listPeople,
		get: Contacts.get,
		getPerson: Contacts.getPerson,
		create: Contacts.create,
		updateAttributes: Contacts.updateAttributes,
		uploadBulk: Contacts.uploadBulk,
		delete: Contacts.remove,
	},
	contactAttributeKeys: {
		list: Contacts.listAttributeKeys,
		// `LIST_ATTRIBUTE_CLASSES` and `GET_ATTRIBUTE_CLASS` - same routes, former names.
		listClasses: Contacts.listAttributeClasses,
		get: Contacts.getAttributeKey,
		getClass: Contacts.getAttributeClass,
		create: Contacts.createAttributeKey,
		update: Contacts.updateAttributeKey,
		delete: Contacts.removeAttributeKey,
	},
	contactAttributes: {
		list: Contacts.listAttributes,
	},
	webhooks: {
		list: Webhooks.list,
		get: Webhooks.get,
		create: Webhooks.create,
		update: Webhooks.update,
		delete: Webhooks.remove,
	},
	teams: {
		list: Organization.listTeams,
		delete: Organization.removeTeam,
		listWorkspaceTeams: Organization.listWorkspaceTeams,
	},
	roles: {
		list: Organization.listRoles,
	},
	me: {
		get: Account.getMe,
		getManagement: Account.getManagementMe,
		getAccountInfo: Account.getAccountInfo,
	},
	health: {
		check: Account.checkHealth,
		list: Account.listHealth,
	},
	client: {
		createDisplay: ClientApi.createDisplay,
		createUser: ClientApi.createUser,
		identifyUser: ClientApi.identifyUser,
		environment: ClientApi.environment,
		contactsState: ClientApi.contactsState,
	},
	storage: {
		uploadPublic: Storage.uploadPublic,
		uploadPrivate: Storage.uploadPrivate,
	},
} as const;

const formbricksWebhooksNested = {} as const;

export const formbricksEndpointSchemas = {
	'surveys.list': {
		input: FormbricksEndpointInputSchemas.surveysList,
		output: FormbricksEndpointOutputSchemas.surveysList,
	},
	'surveys.create': {
		input: FormbricksEndpointInputSchemas.surveysCreate,
		output: FormbricksEndpointOutputSchemas.surveysCreate,
	},
	'surveys.update': {
		input: FormbricksEndpointInputSchemas.surveysUpdate,
		output: FormbricksEndpointOutputSchemas.surveysUpdate,
	},
	'surveys.delete': {
		input: FormbricksEndpointInputSchemas.surveysDelete,
		output: FormbricksEndpointOutputSchemas.surveysDelete,
	},

	'responses.list': {
		input: FormbricksEndpointInputSchemas.responsesList,
		output: FormbricksEndpointOutputSchemas.responsesList,
	},
	'responses.create': {
		input: FormbricksEndpointInputSchemas.responsesCreate,
		output: FormbricksEndpointOutputSchemas.responsesCreate,
	},
	'responses.update': {
		input: FormbricksEndpointInputSchemas.responsesUpdate,
		output: FormbricksEndpointOutputSchemas.responsesUpdate,
	},
	'responses.delete': {
		input: FormbricksEndpointInputSchemas.responsesDelete,
		output: FormbricksEndpointOutputSchemas.responsesDelete,
	},

	'actionClasses.list': {
		input: FormbricksEndpointInputSchemas.actionClassesList,
		output: FormbricksEndpointOutputSchemas.actionClassesList,
	},
	'actionClasses.create': {
		input: FormbricksEndpointInputSchemas.actionClassesCreate,
		output: FormbricksEndpointOutputSchemas.actionClassesCreate,
	},

	'contacts.list': {
		input: FormbricksEndpointInputSchemas.contactsList,
		output: FormbricksEndpointOutputSchemas.contactsList,
	},
	'contacts.listPeople': {
		input: FormbricksEndpointInputSchemas.contactsListPeople,
		output: FormbricksEndpointOutputSchemas.contactsListPeople,
	},
	'contacts.get': {
		input: FormbricksEndpointInputSchemas.contactsGet,
		output: FormbricksEndpointOutputSchemas.contactsGet,
	},
	'contacts.getPerson': {
		input: FormbricksEndpointInputSchemas.contactsGetPerson,
		output: FormbricksEndpointOutputSchemas.contactsGetPerson,
	},
	'contacts.updateAttributes': {
		input: FormbricksEndpointInputSchemas.contactsUpdateAttributes,
		output: FormbricksEndpointOutputSchemas.contactsUpdateAttributes,
	},
	'contacts.create': {
		input: FormbricksEndpointInputSchemas.contactsCreate,
		output: FormbricksEndpointOutputSchemas.contactsCreate,
	},
	'contacts.uploadBulk': {
		input: FormbricksEndpointInputSchemas.contactsUploadBulk,
		output: FormbricksEndpointOutputSchemas.contactsUploadBulk,
	},
	'contacts.delete': {
		input: FormbricksEndpointInputSchemas.contactsDelete,
		output: FormbricksEndpointOutputSchemas.contactsDelete,
	},

	'contactAttributeKeys.list': {
		input: FormbricksEndpointInputSchemas.contactAttributeKeysList,
		output: FormbricksEndpointOutputSchemas.contactAttributeKeysList,
	},
	'contactAttributeKeys.listClasses': {
		input: FormbricksEndpointInputSchemas.contactAttributeKeysListClasses,
		output: FormbricksEndpointOutputSchemas.contactAttributeKeysListClasses,
	},
	'contactAttributeKeys.get': {
		input: FormbricksEndpointInputSchemas.contactAttributeKeysGet,
		output: FormbricksEndpointOutputSchemas.contactAttributeKeysGet,
	},
	'contactAttributeKeys.getClass': {
		input: FormbricksEndpointInputSchemas.contactAttributeKeysGetClass,
		output: FormbricksEndpointOutputSchemas.contactAttributeKeysGetClass,
	},
	'contactAttributeKeys.create': {
		input: FormbricksEndpointInputSchemas.contactAttributeKeysCreate,
		output: FormbricksEndpointOutputSchemas.contactAttributeKeysCreate,
	},
	'contactAttributeKeys.update': {
		input: FormbricksEndpointInputSchemas.contactAttributeKeysUpdate,
		output: FormbricksEndpointOutputSchemas.contactAttributeKeysUpdate,
	},
	'contactAttributeKeys.delete': {
		input: FormbricksEndpointInputSchemas.contactAttributeKeysDelete,
		output: FormbricksEndpointOutputSchemas.contactAttributeKeysDelete,
	},

	'contactAttributes.list': {
		input: FormbricksEndpointInputSchemas.contactAttributesList,
		output: FormbricksEndpointOutputSchemas.contactAttributesList,
	},

	'webhooks.list': {
		input: FormbricksEndpointInputSchemas.webhooksList,
		output: FormbricksEndpointOutputSchemas.webhooksList,
	},
	'webhooks.get': {
		input: FormbricksEndpointInputSchemas.webhooksGet,
		output: FormbricksEndpointOutputSchemas.webhooksGet,
	},
	'webhooks.create': {
		input: FormbricksEndpointInputSchemas.webhooksCreate,
		output: FormbricksEndpointOutputSchemas.webhooksCreate,
	},
	'webhooks.update': {
		input: FormbricksEndpointInputSchemas.webhooksUpdate,
		output: FormbricksEndpointOutputSchemas.webhooksUpdate,
	},
	'webhooks.delete': {
		input: FormbricksEndpointInputSchemas.webhooksDelete,
		output: FormbricksEndpointOutputSchemas.webhooksDelete,
	},

	'teams.list': {
		input: FormbricksEndpointInputSchemas.teamsList,
		output: FormbricksEndpointOutputSchemas.teamsList,
	},
	'teams.delete': {
		input: FormbricksEndpointInputSchemas.teamsDelete,
		output: FormbricksEndpointOutputSchemas.teamsDelete,
	},
	'teams.listWorkspaceTeams': {
		input: FormbricksEndpointInputSchemas.teamsListWorkspaceTeams,
		output: FormbricksEndpointOutputSchemas.teamsListWorkspaceTeams,
	},

	'roles.list': {
		input: FormbricksEndpointInputSchemas.rolesList,
		output: FormbricksEndpointOutputSchemas.rolesList,
	},

	'me.get': {
		input: FormbricksEndpointInputSchemas.meGet,
		output: FormbricksEndpointOutputSchemas.meGet,
	},
	'me.getManagement': {
		input: FormbricksEndpointInputSchemas.meGetManagement,
		output: FormbricksEndpointOutputSchemas.meGetManagement,
	},
	'me.getAccountInfo': {
		input: FormbricksEndpointInputSchemas.meGetAccountInfo,
		output: FormbricksEndpointOutputSchemas.meGetAccountInfo,
	},

	'health.check': {
		input: FormbricksEndpointInputSchemas.healthCheck,
		output: FormbricksEndpointOutputSchemas.healthCheck,
	},
	'health.list': {
		input: FormbricksEndpointInputSchemas.healthList,
		output: FormbricksEndpointOutputSchemas.healthList,
	},

	'client.createDisplay': {
		input: FormbricksEndpointInputSchemas.clientCreateDisplay,
		output: FormbricksEndpointOutputSchemas.clientCreateDisplay,
	},
	'client.createUser': {
		input: FormbricksEndpointInputSchemas.clientCreateUser,
		output: FormbricksEndpointOutputSchemas.clientCreateUser,
	},
	'client.identifyUser': {
		input: FormbricksEndpointInputSchemas.clientIdentifyUser,
		output: FormbricksEndpointOutputSchemas.clientIdentifyUser,
	},
	'client.environment': {
		input: FormbricksEndpointInputSchemas.clientEnvironment,
		output: FormbricksEndpointOutputSchemas.clientEnvironment,
	},
	'client.contactsState': {
		input: FormbricksEndpointInputSchemas.clientContactsState,
		output: FormbricksEndpointOutputSchemas.clientContactsState,
	},

	'storage.uploadPublic': {
		input: FormbricksEndpointInputSchemas.storageUploadPublic,
		output: FormbricksEndpointOutputSchemas.storageUploadPublic,
	},
	'storage.uploadPrivate': {
		input: FormbricksEndpointInputSchemas.storageUploadPrivate,
		output: FormbricksEndpointOutputSchemas.storageUploadPrivate,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof formbricksEndpointsNested
>;

export const formbricksWebhookSchemas =
	{} as const satisfies RequiredPluginWebhookSchemas<
		typeof formbricksWebhooksNested
	>;

/**
 * Risk levels follow what an operation can destroy, not which HTTP method it uses.
 *
 * Most assignments are obvious. These are not, and are worth stating:
 *
 * - **`surveys.delete` is destructive rather than a write** because it takes the survey's collected
 *   responses with it - respondent data, not just configuration.
 * - **`webhooks.delete` is destructive** because re-creating the subscription issues a *new* signing
 *   secret, so every receiver verifying signatures has to be updated. The blast radius is larger
 *   than the record.
 * - **`teams.delete` is destructive** because the team may be what granted members access to a
 *   workspace, so people can lose access as a side effect.
 * - **`responses.delete` is destructive** and is also the operation a workspace owner would use to
 *   honour an erasure request, so it needs to report accurately rather than optimistically.
 * - **`contacts.delete` is destructive** - it removes a person's identity and unlinks their
 *   responses.
 * - **`contacts.uploadBulk` is a write, not a read**, and the highest-volume one here: it creates
 *   many people at once, and a replay duplicates the whole batch.
 */
export const formbricksEndpointMeta = {
	'surveys.list': {
		riskLevel: 'read',
		description: 'List the surveys in a workspace',
	},
	'surveys.create': { riskLevel: 'write', description: 'Create a survey' },
	'surveys.update': { riskLevel: 'write', description: 'Update a survey' },
	'surveys.delete': {
		riskLevel: 'destructive',
		description: 'Delete a survey and the responses collected against it',
	},

	'responses.list': {
		riskLevel: 'read',
		description: 'List survey responses, optionally for one survey',
	},
	'responses.create': {
		riskLevel: 'write',
		description: 'Record a survey response',
	},
	'responses.update': {
		riskLevel: 'write',
		description: 'Update a survey response',
	},
	'responses.delete': {
		riskLevel: 'destructive',
		description:
			"Delete a survey response, erasing a respondent's submitted answers",
	},

	'actionClasses.list': {
		riskLevel: 'read',
		description: 'List the action classes that can trigger a survey',
	},
	'actionClasses.create': {
		riskLevel: 'write',
		description: 'Create an action class',
	},

	'contacts.list': {
		riskLevel: 'read',
		description: 'List the contacts in a workspace',
	},
	/**
	 * The description says "same as contacts.list" on purpose. These four alias operations exist so
	 * that every catalog id resolves, and the one thing they must not do is read as a separate
	 * capability to whoever is choosing between them.
	 */
	'contacts.listPeople': {
		riskLevel: 'read',
		description:
			'List contacts under the catalog\'s former "people" name - same route as contacts.list',
	},
	'contacts.get': { riskLevel: 'read', description: 'Get a single contact' },
	'contacts.getPerson': {
		riskLevel: 'read',
		description:
			'Get a contact under the catalog\'s former "person" name - same route as contacts.get',
	},
	'contacts.create': { riskLevel: 'write', description: 'Create a contact' },
	/**
	 * `write`, and the description says it creates, because the only route that sets a contact's
	 * attribute values upserts by `userId` - an unknown id is created rather than rejected. Calling
	 * this an "update" without saying so would let it through on the assumption that the contact must
	 * already exist.
	 */
	'contacts.updateAttributes': {
		riskLevel: 'write',
		description:
			"Set a contact's attribute values by userId, creating the contact if it is new",
	},
	'contacts.uploadBulk': {
		riskLevel: 'write',
		description: 'Create many contacts in one request',
	},
	'contacts.delete': {
		riskLevel: 'destructive',
		description: "Delete a contact, removing a respondent's identity",
	},

	'contactAttributeKeys.list': {
		riskLevel: 'read',
		description: 'List the contact attribute keys a workspace defines',
	},
	'contactAttributeKeys.listClasses': {
		riskLevel: 'read',
		description:
			'List attribute keys under the catalog\'s former "attribute class" name - same route as contactAttributeKeys.list',
	},
	'contactAttributeKeys.get': {
		riskLevel: 'read',
		description: 'Get a single contact attribute key',
	},
	'contactAttributeKeys.getClass': {
		riskLevel: 'read',
		description:
			'Get an attribute key under the catalog\'s former "attribute class" name - same route as contactAttributeKeys.get',
	},
	'contactAttributeKeys.create': {
		riskLevel: 'write',
		description: 'Create a contact attribute key',
	},
	/**
	 * Names the *definition* explicitly. This operation edits an attribute key's display name and
	 * description; it does not touch any contact's stored value - see `contacts.updateAttributes` for
	 * that. The two were conflated once already.
	 */
	'contactAttributeKeys.update': {
		riskLevel: 'write',
		description:
			"Update a contact attribute key's definition - not any contact's values",
	},
	'contactAttributeKeys.delete': {
		riskLevel: 'destructive',
		description: 'Delete a contact attribute key',
	},

	'contactAttributes.list': {
		riskLevel: 'read',
		description: 'List contact attribute values across contacts',
	},

	'webhooks.list': {
		riskLevel: 'read',
		description: 'List the webhooks on a workspace',
	},
	'webhooks.get': { riskLevel: 'read', description: 'Get a single webhook' },
	'webhooks.create': {
		riskLevel: 'write',
		description: 'Create a webhook and receive its signing secret',
	},
	'webhooks.update': { riskLevel: 'write', description: 'Update a webhook' },
	'webhooks.delete': {
		riskLevel: 'destructive',
		description: 'Delete a webhook, invalidating its signing secret',
	},

	'teams.list': {
		riskLevel: 'read',
		description: 'List the teams in an organization',
	},
	'teams.delete': {
		riskLevel: 'destructive',
		description: 'Delete a team, removing the workspace access it granted',
	},
	'teams.listWorkspaceTeams': {
		riskLevel: 'read',
		description: 'List which teams have access to which workspace',
	},

	'roles.list': {
		riskLevel: 'read',
		description: 'List the organization roles a member can hold',
	},

	'me.get': {
		riskLevel: 'read',
		description: "Get the API key's identity, workspaces and organization",
	},
	'me.getManagement': {
		riskLevel: 'read',
		description: 'Get the v1 account payload, for a workspace-scoped key only',
	},
	'me.getAccountInfo': {
		riskLevel: 'read',
		description: 'Get account information',
	},

	'health.check': { riskLevel: 'read', description: 'Check service health' },
	'health.list': {
		riskLevel: 'read',
		description: 'Read service health status',
	},

	'client.createDisplay': {
		riskLevel: 'write',
		description: 'Record that a survey was displayed to someone',
	},
	'client.createUser': {
		riskLevel: 'write',
		description: 'Create a client user',
	},
	'client.identifyUser': {
		riskLevel: 'write',
		description: 'Create or identify a client user',
	},
	'client.environment': {
		riskLevel: 'read',
		description: 'Read the client environment bundle for a workspace',
	},
	/**
	 * **`write`, not `read`, despite reading state.** The only route that returns a respondent's state
	 * is `POST client/{workspaceId}/user`, which upserts: a `userId` Formbricks has not seen before is
	 * created rather than reported missing. Every `GET` spelling of this is a 404.
	 *
	 * So an operation that looks like a lookup can add a contact, and marking it `read` would let it
	 * through a read-only permission grant. It was marked `read` while it pointed at the environment
	 * bundle, and correcting the route makes the risk level wrong too.
	 */
	'client.contactsState': {
		riskLevel: 'write',
		description:
			"Read a respondent's state, creating the contact if the userId is new",
	},

	'storage.uploadPublic': {
		riskLevel: 'write',
		description: 'Request an upload for a public file',
	},
	'storage.uploadPrivate': {
		riskLevel: 'write',
		description: 'Request an upload for a private respondent file',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof formbricksEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export type BaseFormbricksPlugin<T extends FormbricksPluginOptions> =
	CorsairPlugin<
		'formbricks',
		typeof FormbricksSchema,
		typeof formbricksEndpointsNested,
		typeof formbricksWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalFormbricksPlugin =
	BaseFormbricksPlugin<FormbricksPluginOptions>;

export type ExternalFormbricksPlugin<T extends FormbricksPluginOptions> =
	BaseFormbricksPlugin<T>;

/**
 * Builds the Formbricks plugin.
 *
 * Formbricks authenticates with a personal API key sent as `x-api-key`. Nothing else is required -
 * but note that a key must be **workspace-scoped** to reach most operations; see
 * `formbricksAuthConfig`.
 */
export function formbricks<const T extends FormbricksPluginOptions>(
	incomingOptions: FormbricksPluginOptions & T = {} as FormbricksPluginOptions &
		T,
): ExternalFormbricksPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'formbricks',
		authConfig: formbricksAuthConfig,
		schema: FormbricksSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: formbricksEndpointsNested,
		webhooks: formbricksWebhooksNested,
		endpointMeta: formbricksEndpointMeta,
		endpointSchemas: formbricksEndpointSchemas,
		webhookSchemas: formbricksWebhookSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: FormbricksKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys?.get_api_key();
				if (!res) {
					throw new AuthMissingError('formbricks', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('formbricks', 'api_key');
		},
	} satisfies InternalFormbricksPlugin;
}

export type {
	FormbricksEndpointInputs,
	FormbricksEndpointOutputs,
} from './endpoints/types';
export type {
	FormbricksActionClassEntity,
	FormbricksContactAttributeKeyEntity,
	FormbricksSurveyEntity,
	FormbricksTeamEntity,
	FormbricksWebhookEntity,
} from './schema/database';
