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
	Contacts,
	Letters,
	Postcards,
	SelfMailers,
	Templates,
	Trackers,
} from './endpoints';
import type {
	PostgridEndpointInputs,
	PostgridEndpointOutputs,
} from './endpoints/types';
import {
	PostgridEndpointInputSchemas,
	PostgridEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { PostgridSchema } from './schema';

export const postgridAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type PostgridPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** The key from the dashboard. Overrides the stored `api_key`. */
	key?: string;
	hooks?: InternalPostgridPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof postgridEndpointsNested>;
};

export type PostgridContext = CorsairPluginContext<
	typeof PostgridSchema,
	PostgridPluginOptions,
	undefined,
	typeof postgridAuthConfig
>;

export type PostgridKeyBuilderContext = KeyBuilderContext<
	PostgridPluginOptions,
	typeof postgridAuthConfig
>;

export type PostgridBoundEndpoints = BindEndpoints<
	typeof postgridEndpointsNested
>;

type PostgridEndpoint<K extends keyof PostgridEndpointOutputs> =
	CorsairEndpoint<
		PostgridContext,
		PostgridEndpointInputs[K],
		PostgridEndpointOutputs[K]
	>;

export type PostgridEndpoints = {
	contactsList: PostgridEndpoint<'contactsList'>;
	contactsGet: PostgridEndpoint<'contactsGet'>;
	contactsCreate: PostgridEndpoint<'contactsCreate'>;
	contactsDelete: PostgridEndpoint<'contactsDelete'>;
	templatesList: PostgridEndpoint<'templatesList'>;
	templatesGet: PostgridEndpoint<'templatesGet'>;
	templatesCreate: PostgridEndpoint<'templatesCreate'>;
	templatesUpdate: PostgridEndpoint<'templatesUpdate'>;
	templatesDelete: PostgridEndpoint<'templatesDelete'>;
	lettersList: PostgridEndpoint<'lettersList'>;
	lettersGet: PostgridEndpoint<'lettersGet'>;
	lettersCreate: PostgridEndpoint<'lettersCreate'>;
	lettersCancel: PostgridEndpoint<'lettersCancel'>;
	postcardsList: PostgridEndpoint<'postcardsList'>;
	postcardsGet: PostgridEndpoint<'postcardsGet'>;
	postcardsCreate: PostgridEndpoint<'postcardsCreate'>;
	postcardsCancel: PostgridEndpoint<'postcardsCancel'>;
	selfMailersList: PostgridEndpoint<'selfMailersList'>;
	selfMailersGet: PostgridEndpoint<'selfMailersGet'>;
	selfMailersCreate: PostgridEndpoint<'selfMailersCreate'>;
	trackersGet: PostgridEndpoint<'trackersGet'>;
};

const postgridEndpointsNested = {
	contacts: {
		list: Contacts.list,
		get: Contacts.get,
		create: Contacts.create,
		delete: Contacts.remove,
	},
	templates: {
		list: Templates.list,
		get: Templates.get,
		create: Templates.create,
		update: Templates.update,
		delete: Templates.remove,
	},
	letters: {
		list: Letters.list,
		get: Letters.get,
		create: Letters.create,
		cancel: Letters.cancel,
	},
	postcards: {
		list: Postcards.list,
		get: Postcards.get,
		create: Postcards.create,
		cancel: Postcards.cancel,
	},
	selfMailers: {
		list: SelfMailers.list,
		get: SelfMailers.get,
		create: SelfMailers.create,
	},
	trackers: {
		get: Trackers.get,
	},
} as const;

export const postgridEndpointSchemas = {
	'contacts.list': {
		input: PostgridEndpointInputSchemas.contactsList,
		output: PostgridEndpointOutputSchemas.contactsList,
	},
	'contacts.get': {
		input: PostgridEndpointInputSchemas.contactsGet,
		output: PostgridEndpointOutputSchemas.contactsGet,
	},
	'contacts.create': {
		input: PostgridEndpointInputSchemas.contactsCreate,
		output: PostgridEndpointOutputSchemas.contactsCreate,
	},
	'contacts.delete': {
		input: PostgridEndpointInputSchemas.contactsDelete,
		output: PostgridEndpointOutputSchemas.contactsDelete,
	},
	'templates.list': {
		input: PostgridEndpointInputSchemas.templatesList,
		output: PostgridEndpointOutputSchemas.templatesList,
	},
	'templates.get': {
		input: PostgridEndpointInputSchemas.templatesGet,
		output: PostgridEndpointOutputSchemas.templatesGet,
	},
	'templates.create': {
		input: PostgridEndpointInputSchemas.templatesCreate,
		output: PostgridEndpointOutputSchemas.templatesCreate,
	},
	'templates.update': {
		input: PostgridEndpointInputSchemas.templatesUpdate,
		output: PostgridEndpointOutputSchemas.templatesUpdate,
	},
	'templates.delete': {
		input: PostgridEndpointInputSchemas.templatesDelete,
		output: PostgridEndpointOutputSchemas.templatesDelete,
	},
	'letters.list': {
		input: PostgridEndpointInputSchemas.lettersList,
		output: PostgridEndpointOutputSchemas.lettersList,
	},
	'letters.get': {
		input: PostgridEndpointInputSchemas.lettersGet,
		output: PostgridEndpointOutputSchemas.lettersGet,
	},
	'letters.create': {
		input: PostgridEndpointInputSchemas.lettersCreate,
		output: PostgridEndpointOutputSchemas.lettersCreate,
	},
	'letters.cancel': {
		input: PostgridEndpointInputSchemas.lettersCancel,
		output: PostgridEndpointOutputSchemas.lettersCancel,
	},
	'postcards.list': {
		input: PostgridEndpointInputSchemas.postcardsList,
		output: PostgridEndpointOutputSchemas.postcardsList,
	},
	'postcards.get': {
		input: PostgridEndpointInputSchemas.postcardsGet,
		output: PostgridEndpointOutputSchemas.postcardsGet,
	},
	'postcards.create': {
		input: PostgridEndpointInputSchemas.postcardsCreate,
		output: PostgridEndpointOutputSchemas.postcardsCreate,
	},
	'postcards.cancel': {
		input: PostgridEndpointInputSchemas.postcardsCancel,
		output: PostgridEndpointOutputSchemas.postcardsCancel,
	},
	'selfMailers.list': {
		input: PostgridEndpointInputSchemas.selfMailersList,
		output: PostgridEndpointOutputSchemas.selfMailersList,
	},
	'selfMailers.get': {
		input: PostgridEndpointInputSchemas.selfMailersGet,
		output: PostgridEndpointOutputSchemas.selfMailersGet,
	},
	'selfMailers.create': {
		input: PostgridEndpointInputSchemas.selfMailersCreate,
		output: PostgridEndpointOutputSchemas.selfMailersCreate,
	},
	'trackers.get': {
		input: PostgridEndpointInputSchemas.trackersGet,
		output: PostgridEndpointOutputSchemas.trackersGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof postgridEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const postgridEndpointMeta = {
	'contacts.list': {
		riskLevel: 'read',
		description:
			'List contacts, optionally with a plain or structured search, paged by `skip` and `limit`',
	},
	'contacts.get': {
		riskLevel: 'read',
		description: 'Read one contact with its address verification status',
	},
	'contacts.create': {
		riskLevel: 'write',
		description:
			'Create a contact. PostGrid corrects and verifies the address, so the stored one may differ from the one sent',
	},
	'contacts.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a contact. Orders already created from it keep their own copy of the address',
	},
	'templates.list': {
		riskLevel: 'read',
		description: 'List print templates, paged by `skip` and `limit`',
	},
	'templates.get': {
		riskLevel: 'read',
		description: 'Read one template and its HTML',
	},
	'templates.create': {
		riskLevel: 'write',
		description:
			'Create a template whose `{{variableName}}` marks are filled from merge variables',
	},
	'templates.update': {
		riskLevel: 'write',
		description: "Change a template's HTML, description or metadata",
	},
	'templates.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a template. Orders already created from it are unaffected',
	},
	'letters.list': {
		riskLevel: 'read',
		description: 'List letters with their status, paged by `skip` and `limit`',
	},
	'letters.get': {
		riskLevel: 'read',
		description:
			'Read one letter, optionally with its template expanded inline',
	},
	'letters.create': {
		riskLevel: 'destructive',
		description:
			'Print and mail a letter, which costs postage and cannot be recalled once it leaves `ready`. Pass `idempotencyKey` so a retry prints one letter, not two',
	},
	'letters.cancel': {
		riskLevel: 'destructive',
		description:
			'Cancel a letter while it is still `ready`. After that it is already printing',
	},
	'postcards.list': {
		riskLevel: 'read',
		description:
			'List postcards with their status, paged by `skip` and `limit`',
	},
	'postcards.get': {
		riskLevel: 'read',
		description: 'Read one postcard, optionally with its template expanded',
	},
	'postcards.create': {
		riskLevel: 'destructive',
		description:
			'Print and mail a postcard with a front and a back face, which costs postage and cannot be recalled once printing',
	},
	'postcards.cancel': {
		riskLevel: 'destructive',
		description: 'Cancel a postcard while it is still `ready`',
	},
	'selfMailers.list': {
		riskLevel: 'read',
		description:
			'List self mailers with their status, paged by `skip` and `limit`',
	},
	'selfMailers.get': {
		riskLevel: 'read',
		description: 'Read one self mailer, optionally with its template expanded',
	},
	'selfMailers.create': {
		riskLevel: 'destructive',
		description:
			'Print and mail a folded self mailer with inside and outside panels, which costs postage and cannot be recalled once printing',
	},
	'trackers.get': {
		riskLevel: 'read',
		description:
			"Read one order's position in its lifecycle, and on live US mail the USPS intelligent-mail stage",
	},
} as const satisfies RequiredPluginEndpointMeta<typeof postgridEndpointsNested>;

export type BasePostgridPlugin<T extends PostgridPluginOptions> = CorsairPlugin<
	'postgrid',
	typeof PostgridSchema,
	typeof postgridEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType,
	typeof postgridAuthConfig
>;

export type InternalPostgridPlugin = BasePostgridPlugin<PostgridPluginOptions>;

export type ExternalPostgridPlugin<T extends PostgridPluginOptions> =
	BasePostgridPlugin<T>;

export function postgrid<const T extends PostgridPluginOptions>(
	incomingOptions: PostgridPluginOptions & T = {} as PostgridPluginOptions & T,
): ExternalPostgridPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'postgrid',
		authConfig: postgridAuthConfig,
		schema: PostgridSchema,
		options,
		hooks: options.hooks,
		endpoints: postgridEndpointsNested,
		webhooks: {},
		endpointMeta: postgridEndpointMeta,
		endpointSchemas: postgridEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: PostgridKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('postgrid', ctx.authType ?? 'api_key');
		},
	} satisfies InternalPostgridPlugin;
}

export { PostgridAPIError } from './client';
export type {
	ContactsCreateInput,
	ContactsDeleteInput,
	ContactsGetInput,
	ContactsListInput,
	ContactsListOutput,
	LettersCancelInput,
	LettersCreateInput,
	LettersGetInput,
	LettersListInput,
	LettersListOutput,
	PostcardsCancelInput,
	PostcardsCreateInput,
	PostcardsGetInput,
	PostcardsListInput,
	PostcardsListOutput,
	PostgridContact,
	PostgridDeletedOutput,
	PostgridEndpointInputs,
	PostgridEndpointOutputs,
	PostgridLetter,
	PostgridPostcard,
	PostgridSelfMailer,
	PostgridTemplate,
	PostgridTracker,
	SelfMailersCreateInput,
	SelfMailersGetInput,
	SelfMailersListInput,
	SelfMailersListOutput,
	TemplatesCreateInput,
	TemplatesDeleteInput,
	TemplatesGetInput,
	TemplatesListInput,
	TemplatesListOutput,
	TemplatesUpdateInput,
	TrackersGetInput,
} from './endpoints/types';
