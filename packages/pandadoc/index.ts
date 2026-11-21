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
import { Contacts, Documents, Folders, Templates, Webhooks } from './endpoints';
import type {
	PandadocEndpointInputs,
	PandadocEndpointOutputs,
} from './endpoints/types';
import {
	PandadocEndpointInputSchemas,
	PandadocEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { PandadocSchema } from './schema';
import { event } from './webhooks';
import {
	matchPandadocWebhook,
	PandadocWebhookPayloadSchema,
} from './webhooks/types';

export type PandadocPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalPandadocPlugin['hooks'];
	webhookHooks?: InternalPandadocPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof pandadocEndpointsNested>;
};

export type PandadocContext = CorsairPluginContext<
	typeof PandadocSchema,
	PandadocPluginOptions,
	undefined,
	typeof pandadocAuthConfig
>;

export type PandadocKeyBuilderContext = KeyBuilderContext<
	PandadocPluginOptions,
	typeof pandadocAuthConfig
>;

export type PandadocBoundEndpoints = BindEndpoints<
	typeof pandadocEndpointsNested
>;

type PandadocEndpoint<K extends keyof PandadocEndpointOutputs> =
	CorsairEndpoint<
		PandadocContext,
		PandadocEndpointInputs[K],
		PandadocEndpointOutputs[K]
	>;

export type PandadocEndpoints = {
	[K in keyof PandadocEndpointOutputs]: PandadocEndpoint<K>;
};

export type PandadocBoundWebhooks = BindWebhooks<typeof pandadocWebhooksNested>;

const pandadocEndpointsNested = {
	documents: {
		list: Documents.list,
		get: Documents.get,
		create: Documents.create,
		send: Documents.send,
		update: Documents.update,
		delete: Documents.remove,
		download: Documents.download,
		downloadProtected: Documents.downloadProtected,
		listFields: Documents.listFields,
		createFields: Documents.createFields,
		move: Documents.move,
	},
	templates: {
		list: Templates.list,
		get: Templates.get,
		delete: Templates.remove,
	},
	contacts: {
		list: Contacts.list,
		get: Contacts.get,
		create: Contacts.create,
		update: Contacts.update,
		delete: Contacts.remove,
	},
	folders: {
		list: Folders.list,
		create: Folders.create,
		rename: Folders.rename,
	},
	webhooks: {
		listSubscriptions: Webhooks.listSubscriptions,
		createSubscription: Webhooks.createSubscription,
		deleteSubscription: Webhooks.deleteSubscription,
		getEvent: Webhooks.getEvent,
	},
} as const;

export const pandadocWebhooksNested = {
	pandadoc: {
		event,
	},
} as const;

export const pandadocEndpointSchemas = {
	'documents.list': {
		input: PandadocEndpointInputSchemas.documentsList,
		output: PandadocEndpointOutputSchemas.documentsList,
	},
	'documents.get': {
		input: PandadocEndpointInputSchemas.documentsGet,
		output: PandadocEndpointOutputSchemas.documentsGet,
	},
	'documents.create': {
		input: PandadocEndpointInputSchemas.documentsCreate,
		output: PandadocEndpointOutputSchemas.documentsCreate,
	},
	'documents.send': {
		input: PandadocEndpointInputSchemas.documentsSend,
		output: PandadocEndpointOutputSchemas.documentsSend,
	},
	'documents.update': {
		input: PandadocEndpointInputSchemas.documentsUpdate,
		output: PandadocEndpointOutputSchemas.documentsUpdate,
	},
	'documents.delete': {
		input: PandadocEndpointInputSchemas.documentsDelete,
		output: PandadocEndpointOutputSchemas.documentsDelete,
	},
	'documents.download': {
		input: PandadocEndpointInputSchemas.documentsDownload,
		output: PandadocEndpointOutputSchemas.documentsDownload,
	},
	'documents.downloadProtected': {
		input: PandadocEndpointInputSchemas.documentsDownloadProtected,
		output: PandadocEndpointOutputSchemas.documentsDownloadProtected,
	},
	'documents.listFields': {
		input: PandadocEndpointInputSchemas.documentsListFields,
		output: PandadocEndpointOutputSchemas.documentsListFields,
	},
	'documents.createFields': {
		input: PandadocEndpointInputSchemas.documentsCreateFields,
		output: PandadocEndpointOutputSchemas.documentsCreateFields,
	},
	'documents.move': {
		input: PandadocEndpointInputSchemas.documentsMove,
		output: PandadocEndpointOutputSchemas.documentsMove,
	},
	'templates.list': {
		input: PandadocEndpointInputSchemas.templatesList,
		output: PandadocEndpointOutputSchemas.templatesList,
	},
	'templates.get': {
		input: PandadocEndpointInputSchemas.templatesGet,
		output: PandadocEndpointOutputSchemas.templatesGet,
	},
	'templates.delete': {
		input: PandadocEndpointInputSchemas.templatesDelete,
		output: PandadocEndpointOutputSchemas.templatesDelete,
	},
	'contacts.list': {
		input: PandadocEndpointInputSchemas.contactsList,
		output: PandadocEndpointOutputSchemas.contactsList,
	},
	'contacts.get': {
		input: PandadocEndpointInputSchemas.contactsGet,
		output: PandadocEndpointOutputSchemas.contactsGet,
	},
	'contacts.create': {
		input: PandadocEndpointInputSchemas.contactsCreate,
		output: PandadocEndpointOutputSchemas.contactsCreate,
	},
	'contacts.update': {
		input: PandadocEndpointInputSchemas.contactsUpdate,
		output: PandadocEndpointOutputSchemas.contactsUpdate,
	},
	'contacts.delete': {
		input: PandadocEndpointInputSchemas.contactsDelete,
		output: PandadocEndpointOutputSchemas.contactsDelete,
	},
	'folders.list': {
		input: PandadocEndpointInputSchemas.foldersList,
		output: PandadocEndpointOutputSchemas.foldersList,
	},
	'folders.create': {
		input: PandadocEndpointInputSchemas.foldersCreate,
		output: PandadocEndpointOutputSchemas.foldersCreate,
	},
	'folders.rename': {
		input: PandadocEndpointInputSchemas.foldersRename,
		output: PandadocEndpointOutputSchemas.foldersRename,
	},
	'webhooks.listSubscriptions': {
		input: PandadocEndpointInputSchemas.webhooksListSubscriptions,
		output: PandadocEndpointOutputSchemas.webhooksListSubscriptions,
	},
	'webhooks.createSubscription': {
		input: PandadocEndpointInputSchemas.webhooksCreateSubscription,
		output: PandadocEndpointOutputSchemas.webhooksCreateSubscription,
	},
	'webhooks.deleteSubscription': {
		input: PandadocEndpointInputSchemas.webhooksDeleteSubscription,
		output: PandadocEndpointOutputSchemas.webhooksDeleteSubscription,
	},
	'webhooks.getEvent': {
		input: PandadocEndpointInputSchemas.webhooksGetEvent,
		output: PandadocEndpointOutputSchemas.webhooksGetEvent,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof pandadocEndpointsNested
>;

const pandadocWebhookSchemas = {
	'pandadoc.event': {
		description: 'A PandaDoc event delivery: an array of event objects',
		payload: PandadocWebhookPayloadSchema,
		response: PandadocWebhookPayloadSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof pandadocWebhooksNested
>;

const pandadocEndpointMeta = {
	'documents.list': {
		riskLevel: 'read',
		description:
			'List documents, filtered by status, folder, contact, dates or metadata',
	},
	'documents.get': {
		riskLevel: 'read',
		description: 'Read one document with its recipients, status and metadata',
	},
	'documents.create': {
		riskLevel: 'write',
		description:
			'Create a draft document from a template or from a public PDF URL',
	},
	'documents.send': {
		riskLevel: 'destructive',
		description:
			'Send a document to its recipients for signing; emails go out that cannot be recalled',
		irreversible: true,
	},
	'documents.update': {
		riskLevel: 'write',
		description:
			'Update a draft document: name, recipients, fields, tokens, metadata or tags',
	},
	'documents.delete': {
		riskLevel: 'destructive',
		description: 'Delete a document, optionally permanently (forever)',
		irreversible: true,
	},
	'documents.download': {
		riskLevel: 'read',
		description: 'Download a document as PDF, with optional watermarking',
	},
	'documents.downloadProtected': {
		riskLevel: 'read',
		description: 'Download a completed document as a protected (flattened) PDF',
	},
	'documents.listFields': {
		riskLevel: 'read',
		description: 'Read the fields placed on a document with their coordinates',
	},
	'documents.createFields': {
		riskLevel: 'write',
		description: 'Place new fields on a document',
	},
	'documents.move': {
		riskLevel: 'write',
		description: 'Move a document into a folder',
	},
	'templates.list': {
		riskLevel: 'read',
		description:
			'List templates, filtered by name, folder, tag or shared state',
	},
	'templates.get': {
		riskLevel: 'read',
		description: 'Read one template with its fields, tokens and roles',
	},
	'templates.delete': {
		riskLevel: 'destructive',
		description: 'Delete a template',
		irreversible: true,
	},
	'contacts.list': {
		riskLevel: 'read',
		description: 'List contacts, optionally filtered by exact email address',
	},
	'contacts.get': {
		riskLevel: 'read',
		description: 'Read one contact by id',
	},
	'contacts.create': {
		riskLevel: 'write',
		description: 'Create a contact',
	},
	'contacts.update': {
		riskLevel: 'write',
		description: 'Update a contact',
	},
	'contacts.delete': {
		riskLevel: 'destructive',
		description: 'Delete a contact',
		irreversible: true,
	},
	'folders.list': {
		riskLevel: 'read',
		description: 'List document folders, optionally under one parent folder',
	},
	'folders.create': {
		riskLevel: 'write',
		description: 'Create a documents folder',
	},
	'folders.rename': {
		riskLevel: 'write',
		description: 'Rename a documents folder',
	},
	'webhooks.listSubscriptions': {
		riskLevel: 'read',
		description:
			'List the workspace webhook subscriptions, including their shared keys',
	},
	'webhooks.createSubscription': {
		riskLevel: 'write',
		description: 'Create a webhook subscription for the events you choose',
	},
	'webhooks.deleteSubscription': {
		riskLevel: 'destructive',
		description:
			'Delete a webhook subscription; deliveries stop until it is created again',
		irreversible: true,
	},
	'webhooks.getEvent': {
		riskLevel: 'read',
		description: 'Read one webhook event by the id a delivery carries',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof pandadocEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const pandadocAuthConfig = {
	api_key: {
		// PandaDoc issues one key per workspace on the Developer Dashboard; no
		// account-level field is needed beside it.
		account: [] as const,
	},
} as const satisfies PluginAuthConfig;

export type BasePandadocPlugin<T extends PandadocPluginOptions> = CorsairPlugin<
	'pandadoc',
	typeof PandadocSchema,
	typeof pandadocEndpointsNested,
	typeof pandadocWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof pandadocAuthConfig
>;

export type InternalPandadocPlugin = BasePandadocPlugin<PandadocPluginOptions>;

export type ExternalPandadocPlugin<T extends PandadocPluginOptions> =
	BasePandadocPlugin<T>;

export function pandadoc<const T extends PandadocPluginOptions>(
	incomingOptions: PandadocPluginOptions & T = {} as PandadocPluginOptions & T,
): ExternalPandadocPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'pandadoc',
		authConfig: pandadocAuthConfig,
		schema: PandadocSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: pandadocEndpointsNested,
		webhooks: pandadocWebhooksNested,
		endpointMeta: pandadocEndpointMeta,
		endpointSchemas: pandadocEndpointSchemas,
		webhookSchemas: pandadocWebhookSchemas,
		pluginWebhookMatcher: matchPandadocWebhook,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: PandadocKeyBuilderContext, source) => {
			if (source === 'webhook') {
				// Every PandaDoc delivery is signed with the subscription's
				// shared key, so an empty secret makes the handler reject
				// deliveries with 401 rather than accept them unverified.
				if (options.webhookSecret) return options.webhookSecret;
				const stored = await ctx.keys.get_webhook_signature();
				return stored ?? '';
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('pandadoc', ctx.authType ?? 'api_key');
		},
	} satisfies InternalPandadocPlugin;
}
