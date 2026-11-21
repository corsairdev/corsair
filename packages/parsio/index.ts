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
import { Data, Documents, Mailboxes, Webhooks } from './endpoints';
import type {
	ParsioEndpointInputs,
	ParsioEndpointOutputs,
} from './endpoints/types';
import {
	ParsioEndpointInputSchemas,
	ParsioEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { ParsioSchema } from './schema';
import { event } from './webhooks';
import {
	matchParsioWebhook,
	ParsioWebhookPayloadSchema,
} from './webhooks/types';

export type ParsioPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalParsioPlugin['hooks'];
	webhookHooks?: InternalParsioPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof parsioEndpointsNested>;
};

export type ParsioContext = CorsairPluginContext<
	typeof ParsioSchema,
	ParsioPluginOptions,
	undefined,
	typeof parsioAuthConfig
>;

export type ParsioKeyBuilderContext = KeyBuilderContext<
	ParsioPluginOptions,
	typeof parsioAuthConfig
>;

export type ParsioBoundEndpoints = BindEndpoints<typeof parsioEndpointsNested>;

type ParsioEndpoint<K extends keyof ParsioEndpointOutputs> = CorsairEndpoint<
	ParsioContext,
	ParsioEndpointInputs[K],
	ParsioEndpointOutputs[K]
>;

export type ParsioEndpoints = {
	[K in keyof ParsioEndpointOutputs]: ParsioEndpoint<K>;
};

export type ParsioBoundWebhooks = BindWebhooks<typeof parsioWebhooksNested>;

const parsioEndpointsNested = {
	mailboxes: {
		list: Mailboxes.list,
		get: Mailboxes.get,
		create: Mailboxes.create,
		update: Mailboxes.update,
		delete: Mailboxes.remove,
		tableFields: Mailboxes.tableFields,
	},
	documents: {
		createSync: Documents.createSync,
		createAsync: Documents.createAsync,
		uploadSync: Documents.uploadSync,
		uploadAsync: Documents.uploadAsync,
		list: Documents.list,
		get: Documents.get,
		reparse: Documents.reparse,
		skipMany: Documents.skipMany,
	},
	webhooks: {
		listForMailbox: Webhooks.listForMailbox,
		get: Webhooks.get,
		create: Webhooks.create,
		update: Webhooks.update,
		delete: Webhooks.remove,
	},
	data: {
		getParsed: Data.getParsed,
		listEmails: Data.listEmails,
	},
} as const;

export const parsioWebhooksNested = {
	parsio: {
		event,
	},
} as const;

export const parsioEndpointSchemas = {
	'mailboxes.list': {
		input: ParsioEndpointInputSchemas.mailboxesList,
		output: ParsioEndpointOutputSchemas.mailboxesList,
	},
	'mailboxes.get': {
		input: ParsioEndpointInputSchemas.mailboxesGet,
		output: ParsioEndpointOutputSchemas.mailboxesGet,
	},
	'mailboxes.create': {
		input: ParsioEndpointInputSchemas.mailboxesCreate,
		output: ParsioEndpointOutputSchemas.mailboxesCreate,
	},
	'mailboxes.update': {
		input: ParsioEndpointInputSchemas.mailboxesUpdate,
		output: ParsioEndpointOutputSchemas.mailboxesUpdate,
	},
	'mailboxes.delete': {
		input: ParsioEndpointInputSchemas.mailboxesDelete,
		output: ParsioEndpointOutputSchemas.mailboxesDelete,
	},
	'mailboxes.tableFields': {
		input: ParsioEndpointInputSchemas.mailboxesTableFields,
		output: ParsioEndpointOutputSchemas.mailboxesTableFields,
	},
	'documents.createSync': {
		input: ParsioEndpointInputSchemas.documentsCreateSync,
		output: ParsioEndpointOutputSchemas.documentsCreateSync,
	},
	'documents.createAsync': {
		input: ParsioEndpointInputSchemas.documentsCreateAsync,
		output: ParsioEndpointOutputSchemas.documentsCreateAsync,
	},
	'documents.uploadSync': {
		input: ParsioEndpointInputSchemas.documentsUploadSync,
		output: ParsioEndpointOutputSchemas.documentsUploadSync,
	},
	'documents.uploadAsync': {
		input: ParsioEndpointInputSchemas.documentsUploadAsync,
		output: ParsioEndpointOutputSchemas.documentsUploadAsync,
	},
	'documents.list': {
		input: ParsioEndpointInputSchemas.documentsList,
		output: ParsioEndpointOutputSchemas.documentsList,
	},
	'documents.get': {
		input: ParsioEndpointInputSchemas.documentsGet,
		output: ParsioEndpointOutputSchemas.documentsGet,
	},
	'documents.reparse': {
		input: ParsioEndpointInputSchemas.documentsReparse,
		output: ParsioEndpointOutputSchemas.documentsReparse,
	},
	'documents.skipMany': {
		input: ParsioEndpointInputSchemas.documentsSkipMany,
		output: ParsioEndpointOutputSchemas.documentsSkipMany,
	},
	'webhooks.listForMailbox': {
		input: ParsioEndpointInputSchemas.webhooksListForMailbox,
		output: ParsioEndpointOutputSchemas.webhooksListForMailbox,
	},
	'webhooks.get': {
		input: ParsioEndpointInputSchemas.webhooksGet,
		output: ParsioEndpointOutputSchemas.webhooksGet,
	},
	'webhooks.create': {
		input: ParsioEndpointInputSchemas.webhooksCreate,
		output: ParsioEndpointOutputSchemas.webhooksCreate,
	},
	'webhooks.update': {
		input: ParsioEndpointInputSchemas.webhooksUpdate,
		output: ParsioEndpointOutputSchemas.webhooksUpdate,
	},
	'webhooks.delete': {
		input: ParsioEndpointInputSchemas.webhooksDelete,
		output: ParsioEndpointOutputSchemas.webhooksDelete,
	},
	'data.getParsed': {
		input: ParsioEndpointInputSchemas.dataGetParsed,
		output: ParsioEndpointOutputSchemas.dataGetParsed,
	},
	'data.listEmails': {
		input: ParsioEndpointInputSchemas.dataListEmails,
		output: ParsioEndpointOutputSchemas.dataListEmails,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof parsioEndpointsNested
>;

const parsioWebhookSchemas = {
	'parsio.event': {
		description: 'A parsed document Parsio delivered to a webhook subscription',
		payload: ParsioWebhookPayloadSchema,
		response: ParsioWebhookPayloadSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof parsioWebhooksNested>;

// An async import parses in the background; documents.get reports the
// status. The docs pin `parsed` and `parsing` as codes; the other states
// (no template, skipped, quota exceeded, exception) are described in prose
// without published codes, so failed stays empty rather than guessing them.
const IMPORT_JOB = {
	idPath: 'doc_id',
	status: {
		op: 'documents.get',
		idArg: 'documentId',
		statusPath: 'status',
		done: ['parsed'],
		failed: [],
	},
} as const;

const parsioEndpointMeta = {
	'mailboxes.list': {
		riskLevel: 'read',
		description: 'List all mailboxes available to the authenticated user',
	},
	'mailboxes.get': {
		riskLevel: 'read',
		description: 'Read one mailbox with its settings and configuration',
	},
	'mailboxes.create': {
		riskLevel: 'write',
		description: 'Create a mailbox with a parser preset',
	},
	'mailboxes.update': {
		riskLevel: 'write',
		description:
			'Update mailbox settings: name, email prefix, attachments, alerts',
	},
	'mailboxes.delete': {
		riskLevel: 'destructive',
		description: 'Delete a mailbox',
		irreversible: true,
	},
	'mailboxes.tableFields': {
		riskLevel: 'read',
		description: 'List the table fields configured in a mailbox',
	},
	'documents.createSync': {
		riskLevel: 'write',
		description:
			'Parse HTML or text content and wait for the result; template and GPT parsers only, each parse consumes credits',
	},
	'documents.createAsync': {
		riskLevel: 'write',
		description:
			'Parse HTML or text content asynchronously; poll documents.get for the result',
		job: IMPORT_JOB,
	},
	'documents.uploadSync': {
		riskLevel: 'write',
		description:
			'Upload one file (max 20MB, no ZIP) and wait for the parsed result',
	},
	'documents.uploadAsync': {
		riskLevel: 'write',
		description:
			'Upload one file (max 50MB, ZIP supported) and parse it asynchronously',
		job: IMPORT_JOB,
	},
	'documents.list': {
		riskLevel: 'read',
		description:
			'List the documents of a mailbox, filtered by date, name or status',
	},
	'documents.get': {
		riskLevel: 'read',
		description:
			'Read one parsed document; this is the payload Parsio webhooks deliver',
	},
	'documents.reparse': {
		riskLevel: 'write',
		description:
			'Queue a document for reprocessing; each reparse consumes credits',
	},
	'documents.skipMany': {
		riskLevel: 'write',
		description: 'Skip parsing for the given documents',
	},
	'webhooks.listForMailbox': {
		riskLevel: 'read',
		description: 'List the webhook subscriptions of a mailbox',
	},
	'webhooks.get': {
		riskLevel: 'read',
		description: 'Read one webhook subscription',
	},
	'webhooks.create': {
		riskLevel: 'write',
		description:
			'Create a webhook subscription for doc.parsed, doc.fail, doc.received or table.parsed events',
	},
	'webhooks.update': {
		riskLevel: 'write',
		description: 'Update a webhook subscription',
	},
	'webhooks.delete': {
		riskLevel: 'destructive',
		description:
			'Delete webhook subscriptions; deliveries stop until they are created again',
		irreversible: true,
	},
	'data.getParsed': {
		riskLevel: 'read',
		description: 'Read the parsed data records of a mailbox, paged by date',
	},
	'data.listEmails': {
		riskLevel: 'read',
		description: 'List the email addresses the mailbox collected',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof parsioEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const parsioAuthConfig = {
	api_key: {
		// Parsio issues one API key per account; no account-level field is
		// needed beside it.
		account: [] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseParsioPlugin<T extends ParsioPluginOptions> = CorsairPlugin<
	'parsio',
	typeof ParsioSchema,
	typeof parsioEndpointsNested,
	typeof parsioWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof parsioAuthConfig
>;

export type InternalParsioPlugin = BaseParsioPlugin<ParsioPluginOptions>;

export type ExternalParsioPlugin<T extends ParsioPluginOptions> =
	BaseParsioPlugin<T>;

export function parsio<const T extends ParsioPluginOptions>(
	incomingOptions: ParsioPluginOptions & T = {} as ParsioPluginOptions & T,
): ExternalParsioPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'parsio',
		authConfig: parsioAuthConfig,
		schema: ParsioSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: parsioEndpointsNested,
		webhooks: parsioWebhooksNested,
		endpointMeta: parsioEndpointMeta,
		endpointSchemas: parsioEndpointSchemas,
		webhookSchemas: parsioWebhookSchemas,
		pluginWebhookMatcher: matchParsioWebhook,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: ParsioKeyBuilderContext, source) => {
			if (source === 'webhook') {
				// Every Parsio delivery is signed with the webhook's signing
				// secret, so an empty secret makes the handler reject
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

			throw new AuthMissingError('parsio', ctx.authType ?? 'api_key');
		},
	} satisfies InternalParsioPlugin;
}

export type {
	Mailbox,
	ParsioDocument,
	ParsioEndpointInputs,
	ParsioEndpointOutputs,
	Webhook,
} from './endpoints/types';
export type { ParsioWebhookPayload } from './webhooks/types';
export {
	matchParsioWebhook,
	PARSIO_SIGNATURE_HEADER,
	verifyParsioWebhook,
} from './webhooks/types';
