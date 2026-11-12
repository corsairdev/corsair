import type {
	AuthTypes,
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
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
	AgentActions,
	Assets,
	Datasets,
	Documents,
	Schemas,
	Webhooks,
} from './endpoints';
import type {
	SanityEndpointInputs,
	SanityEndpointOutputs,
} from './endpoints/types';
import {
	SanityEndpointInputSchemas,
	SanityEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { SanitySchema } from './schema';
import { DocumentWebhooks, matchSanityTenantWebhook } from './webhooks';
import type {
	DocumentChangedPayload,
	SanityWebhookOutputs,
} from './webhooks/types';
import {
	DocumentChangedEventSchema,
	DocumentChangedPayloadSchema,
	isSanityWebhook,
} from './webhooks/types';

export type SanityPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** A Sanity API token (sanity.io/manage > API > Tokens). Overrides the stored one. */
	key?: string;
	/** The project id. Overrides the account's stored `project_id`. */
	projectId?: string;
	/** The default dataset. Overrides the account's stored `dataset`; `production` when neither is set. */
	dataset?: string;
	/**
	 * The secret set on the Sanity webhook, for accounts with none stored. A
	 * secret stored with keys.set_webhook_signature takes precedence.
	 */
	webhookSecret?: string;
	hooks?: InternalSanityPlugin['hooks'];
	webhookHooks?: InternalSanityPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof sanityEndpointsNested>;
};

/**
 * A token belongs to one project, and the project's id is part of every API
 * host, so the account stores it next to the token. `project_id` is also how a
 * webhook delivery finds its account (webhooks/tenant-matcher.ts). `dataset` is
 * the default dataset for calls that don't name one.
 */
export const sanityAuthConfig = {
	api_key: {
		account: ['project_id', 'dataset'] as const,
	},
} as const satisfies PluginAuthConfig;

export type SanityContext = CorsairPluginContext<
	typeof SanitySchema,
	SanityPluginOptions,
	undefined,
	typeof sanityAuthConfig
>;

export type SanityKeyBuilderContext = KeyBuilderContext<
	SanityPluginOptions,
	typeof sanityAuthConfig
>;

export type SanityBoundEndpoints = BindEndpoints<typeof sanityEndpointsNested>;

type SanityEndpoint<K extends keyof SanityEndpointOutputs> = CorsairEndpoint<
	SanityContext,
	SanityEndpointInputs[K],
	SanityEndpointOutputs[K]
>;

export type SanityEndpoints = {
	documentsQuery: SanityEndpoint<'documentsQuery'>;
	documentsGet: SanityEndpoint<'documentsGet'>;
	documentsCreate: SanityEndpoint<'documentsCreate'>;
	documentsEdit: SanityEndpoint<'documentsEdit'>;
	documentsPatch: SanityEndpoint<'documentsPatch'>;
	documentsPublish: SanityEndpoint<'documentsPublish'>;
	documentsUnpublish: SanityEndpoint<'documentsUnpublish'>;
	documentsDiscardDraft: SanityEndpoint<'documentsDiscardDraft'>;
	documentsDelete: SanityEndpoint<'documentsDelete'>;
	documentsMutate: SanityEndpoint<'documentsMutate'>;
	documentsHistory: SanityEndpoint<'documentsHistory'>;
	documentsTransactions: SanityEndpoint<'documentsTransactions'>;
	assetsUpload: SanityEndpoint<'assetsUpload'>;
	datasetsList: SanityEndpoint<'datasetsList'>;
	datasetsCreate: SanityEndpoint<'datasetsCreate'>;
	datasetsDelete: SanityEndpoint<'datasetsDelete'>;
	schemasList: SanityEndpoint<'schemasList'>;
	agentActionsGenerate: SanityEndpoint<'agentActionsGenerate'>;
	agentActionsTransform: SanityEndpoint<'agentActionsTransform'>;
	agentActionsTranslate: SanityEndpoint<'agentActionsTranslate'>;
	agentActionsPrompt: SanityEndpoint<'agentActionsPrompt'>;
	webhooksList: SanityEndpoint<'webhooksList'>;
	webhooksCreate: SanityEndpoint<'webhooksCreate'>;
	webhooksUpdate: SanityEndpoint<'webhooksUpdate'>;
	webhooksDelete: SanityEndpoint<'webhooksDelete'>;
	webhooksAttempts: SanityEndpoint<'webhooksAttempts'>;
};

type SanityWebhook<
	K extends keyof SanityWebhookOutputs,
	TEvent,
> = CorsairWebhook<SanityContext, TEvent, SanityWebhookOutputs[K]>;

export type SanityWebhooks = {
	documentChanged: SanityWebhook<'documentChanged', DocumentChangedPayload>;
};

export type SanityBoundWebhooks = BindWebhooks<typeof sanityWebhooksNested>;

const sanityEndpointsNested = {
	documents: {
		query: Documents.query,
		get: Documents.get,
		create: Documents.create,
		edit: Documents.edit,
		patch: Documents.patch,
		publish: Documents.publish,
		unpublish: Documents.unpublish,
		discardDraft: Documents.discardDraft,
		delete: Documents.delete,
		mutate: Documents.mutate,
		history: Documents.history,
		transactions: Documents.transactions,
	},
	assets: {
		upload: Assets.upload,
	},
	datasets: {
		list: Datasets.list,
		create: Datasets.create,
		delete: Datasets.delete,
	},
	schemas: {
		list: Schemas.list,
	},
	agentActions: {
		generate: AgentActions.generate,
		transform: AgentActions.transform,
		translate: AgentActions.translate,
		prompt: AgentActions.prompt,
	},
	webhooks: {
		list: Webhooks.list,
		create: Webhooks.create,
		update: Webhooks.update,
		delete: Webhooks.delete,
		attempts: Webhooks.attempts,
	},
} as const;

const sanityWebhooksNested = {
	documents: {
		changed: DocumentWebhooks.changed,
	},
} as const;

const schemaOf = <K extends keyof typeof SanityEndpointInputSchemas>(key: K) =>
	({
		input: SanityEndpointInputSchemas[key],
		output: SanityEndpointOutputSchemas[key],
	}) as const;

export const sanityEndpointSchemas = {
	'documents.query': schemaOf('documentsQuery'),
	'documents.get': schemaOf('documentsGet'),
	'documents.create': schemaOf('documentsCreate'),
	'documents.edit': schemaOf('documentsEdit'),
	'documents.patch': schemaOf('documentsPatch'),
	'documents.publish': schemaOf('documentsPublish'),
	'documents.unpublish': schemaOf('documentsUnpublish'),
	'documents.discardDraft': schemaOf('documentsDiscardDraft'),
	'documents.delete': schemaOf('documentsDelete'),
	'documents.mutate': schemaOf('documentsMutate'),
	'documents.history': schemaOf('documentsHistory'),
	'documents.transactions': schemaOf('documentsTransactions'),
	'assets.upload': schemaOf('assetsUpload'),
	'datasets.list': schemaOf('datasetsList'),
	'datasets.create': schemaOf('datasetsCreate'),
	'datasets.delete': schemaOf('datasetsDelete'),
	'schemas.list': schemaOf('schemasList'),
	'agentActions.generate': schemaOf('agentActionsGenerate'),
	'agentActions.transform': schemaOf('agentActionsTransform'),
	'agentActions.translate': schemaOf('agentActionsTranslate'),
	'agentActions.prompt': schemaOf('agentActionsPrompt'),
	'webhooks.list': schemaOf('webhooksList'),
	'webhooks.create': schemaOf('webhooksCreate'),
	'webhooks.update': schemaOf('webhooksUpdate'),
	'webhooks.delete': schemaOf('webhooksDelete'),
	'webhooks.attempts': schemaOf('webhooksAttempts'),
} as const satisfies RequiredPluginEndpointSchemas<
	typeof sanityEndpointsNested
>;

const sanityWebhookSchemas = {
	'documents.changed': {
		description:
			"A GROQ-powered webhook fired: a document matching its filter was created, updated or deleted. The body is the webhook's projection; the operation, document id and dataset come from its headers. Only signed deliveries are accepted.",
		payload: DocumentChangedPayloadSchema,
		response: DocumentChangedEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof sanityWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const sanityEndpointMeta = {
	'documents.query': {
		riskLevel: 'read',
		description:
			'Run a GROQ query against a dataset and get its result. Reads published documents unless perspective says otherwise. Pass user input as params.',
	},
	'documents.get': {
		riskLevel: 'read',
		description:
			'Fetch up to 100 documents by exact id (drafts.<id> for a draft). Ids that are missing or unreadable come back in omitted.',
	},
	'documents.create': {
		riskLevel: 'write',
		description:
			'Create a document as a draft (default) or, with publish: true, publish it at once. Returns its id and draft id.',
	},
	'documents.edit': {
		riskLevel: 'write',
		description:
			'Change a document the way the Studio does: the patch goes to its draft, made from the published version if needed, and nothing goes live until documents.publish (or publish: true).',
	},
	'documents.patch': {
		riskLevel: 'write',
		description:
			"Patch one exact document id directly and get it back. A published id changes the live document at once; use documents.edit to go through a draft. ifRevisionId guards against overwriting someone else's change.",
	},
	'documents.publish': {
		riskLevel: 'write',
		description:
			"Publish a document's draft: the draft replaces the published version and goes away. Fails when there is no draft.",
	},
	'documents.unpublish': {
		riskLevel: 'write',
		description:
			'Take a published document off the published perspective; its content stays as a draft.',
	},
	'documents.discardDraft': {
		riskLevel: 'destructive',
		description:
			"Throw away a document's unpublished changes (its draft). The published version stays. With purge, the draft also leaves the history.",
	},
	'documents.delete': {
		riskLevel: 'destructive',
		description:
			'Delete up to 100 documents, published and draft together. Documents that reference them must drop the references first. With purge, they also leave the history.',
	},
	'documents.mutate': {
		riskLevel: 'destructive',
		description:
			"Apply raw Sanity mutations (create, createOrReplace, createIfNotExists, patch, delete, by id or by query) in one transaction. For anything documents.create, edit, patch and delete can't express.",
	},
	'documents.history': {
		riskLevel: 'read',
		description:
			"A document as it stood at a revision or a point in time. How far back depends on the plan's history retention.",
	},
	'documents.transactions': {
		riskLevel: 'read',
		description:
			'The transactions that changed some documents: when, by whom and which revisions, optionally with each mutation.',
	},
	'assets.upload': {
		riskLevel: 'write',
		description:
			'Upload an image or file (base64, up to 25 MB) as a Sanity asset and get its asset document and CDN URL, ready to reference from a document.',
	},
	'datasets.list': {
		riskLevel: 'read',
		description: "The project's datasets and whether each is public.",
	},
	'datasets.create': {
		riskLevel: 'write',
		description:
			'Create an empty dataset in the project. Needs an administrator token.',
	},
	'datasets.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a dataset with every document and asset in it, for good. Needs the name twice and an administrator token.',
	},
	'schemas.list': {
		riskLevel: 'read',
		description:
			"The schemas deployed to a dataset: their ids (the schemaId Agent Actions take) and each type's fields. Pass type for one type's full definition. Read this before writing documents of a type you don't know.",
	},
	'agentActions.generate': {
		riskLevel: 'write',
		description:
			"Have Sanity's AI write content into a document's fields from an instruction, following the schema. Writes to the draft unless forcePublishedWrite; noWrite returns it without saving. Costs one Sanity AI credit.",
	},
	'agentActions.transform': {
		riskLevel: 'write',
		description:
			"Have Sanity's AI rewrite a document's existing content by an instruction (tone, length, style), in place or into another document. Costs one Sanity AI credit.",
	},
	'agentActions.translate': {
		riskLevel: 'write',
		description:
			"Have Sanity's AI translate a document into another language, usually into a new document. Costs one Sanity AI credit.",
	},
	'agentActions.prompt': {
		riskLevel: 'read',
		description:
			"Ask Sanity's AI a question, optionally about documents passed as params, and get text or JSON back. Writes nothing. Costs one Sanity AI credit.",
	},
	'webhooks.list': {
		riskLevel: 'read',
		description:
			"The project's GROQ-powered webhooks: url, dataset, filter, projection and whether each is signed (never the secret).",
	},
	'webhooks.create': {
		riskLevel: 'write',
		description:
			'Create a webhook that POSTs to a URL when documents matching a GROQ filter are created, updated or deleted. Set a secret so deliveries can be verified.',
	},
	'webhooks.update': {
		riskLevel: 'write',
		description:
			"Change a webhook's url, filter, projection, events or secret, or pause and resume it with disabled.",
	},
	'webhooks.delete': {
		riskLevel: 'destructive',
		description: 'Delete a webhook; deliveries stop at once.',
	},
	'webhooks.attempts': {
		riskLevel: 'read',
		description:
			'Recent delivery attempts of a webhook with the status your endpoint answered, to debug failing deliveries.',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof sanityEndpointsNested>;

export type BaseSanityPlugin<T extends SanityPluginOptions> = CorsairPlugin<
	'sanity',
	typeof SanitySchema,
	typeof sanityEndpointsNested,
	typeof sanityWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof sanityAuthConfig
>;

export type InternalSanityPlugin = BaseSanityPlugin<SanityPluginOptions>;

export type ExternalSanityPlugin<T extends SanityPluginOptions> =
	BaseSanityPlugin<T>;

/**
 * Core's messages for an account that can't hold a stored secret yet: no
 * account row, or no data key (nothing has been stored). Only these fall back
 * to the webhookSecret option. Any other failure, such as a secret that won't
 * decrypt, stops the delivery: falling back there would let the option's
 * secret stand in for a tenant that has its own. If core rewords these
 * messages, deliveries are refused rather than accepted.
 */
const NOTHING_STORED = [
	/^No DEK found for account/,
	/^Account not found for tenant/,
];

async function storedWebhookSecret(
	keys: { get_webhook_signature: () => Promise<string | null> } | undefined,
): Promise<string | null> {
	// No database or kek: core gives no key manager, so only the option exists.
	if (!keys) return null;
	try {
		return await keys.get_webhook_signature();
	} catch (error) {
		if (
			error instanceof Error &&
			NOTHING_STORED.some((pattern) => pattern.test(error.message))
		) {
			return null;
		}
		throw error;
	}
}

/**
 * Core takes the first handler whose match says yes, in key order, so anything
 * added after DEFAULT might never run. A custom DEFAULT replaces this plugin's,
 * and every other custom handler sits ahead of it.
 */
function mergeErrorHandlers(custom: CorsairErrorHandler = {}) {
	const { DEFAULT: ownDefault, ...own } = errorHandlers;
	const { DEFAULT: customDefault, ...named } = custom;
	return { ...own, ...named, DEFAULT: customDefault ?? ownDefault };
}

export function sanity<const T extends SanityPluginOptions>(
	incomingOptions: SanityPluginOptions & T = {} as SanityPluginOptions & T,
): ExternalSanityPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'sanity',
		authConfig: sanityAuthConfig,
		schema: SanitySchema,
		options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: sanityEndpointsNested,
		webhooks: sanityWebhooksNested,
		endpointMeta: sanityEndpointMeta,
		endpointSchemas: sanityEndpointSchemas,
		webhookSchemas: sanityWebhookSchemas,
		pluginWebhookMatcher: isSanityWebhook,
		pluginTenantWebhookMatcher: matchSanityTenantWebhook,
		errorHandlers: mergeErrorHandlers(options.errorHandlers),
		keyBuilder: async (ctx: SanityKeyBuilderContext, source) => {
			if (source === 'webhook') {
				// The tenant's own secret comes first. Letting the option override it
				// would let a delivery signed for one tenant verify under another
				// tenant's id whenever the option holds the first tenant's secret.
				const stored = await storedWebhookSecret(ctx.keys);
				return stored || options.webhookSecret || '';
			}

			if (options.key) return options.key;

			if (ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (!key) throw new AuthMissingError('sanity', 'api_key');
				return key;
			}

			throw new AuthMissingError('sanity', 'api_key');
		},
	} satisfies InternalSanityPlugin;
}

export { SanityAPIError, SanityError } from './client';

export type * from './endpoints/types';
export {
	matchSanityTenantWebhook,
	verifySanityWebhookSignature,
} from './webhooks';
export type {
	DocumentChangedEvent,
	DocumentChangedPayload,
	SanityVerifyOptions,
	SanityWebhookOutputs,
} from './webhooks/types';
