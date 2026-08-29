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
	Bootstrap,
	Document,
	ExportConfig,
	Mailbox,
	Template,
	Webhook,
} from './endpoints';
import type {
	ParseurEndpointInputs,
	ParseurEndpointOutputs,
} from './endpoints/types';
import {
	ParseurEndpointInputSchemas,
	ParseurEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ParseurSchema } from './schema';
import { DocumentWebhooks } from './webhooks';
import { matchParseurTenantWebhook } from './webhooks/tenant-matcher';
import type {
	DocumentProcessedEvent,
	ParseurWebhookOutputs,
	ProcessFailedEvent,
	TableItemProcessedEvent,
} from './webhooks/types';
import {
	DocumentProcessedEventSchema,
	matchParseurPluginWebhook,
	ProcessFailedEventSchema,
	TableItemProcessedEventSchema,
} from './webhooks/types';

export type ParseurPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalParseurPlugin['hooks'];
	webhookHooks?: InternalParseurPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof parseurEndpointsNested>;
};

export type ParseurContext = CorsairPluginContext<
	typeof ParseurSchema,
	ParseurPluginOptions
>;

export type ParseurKeyBuilderContext = KeyBuilderContext<ParseurPluginOptions>;

export type ParseurBoundEndpoints = BindEndpoints<
	typeof parseurEndpointsNested
>;

type ParseurEndpoint<K extends keyof ParseurEndpointOutputs> = CorsairEndpoint<
	ParseurContext,
	ParseurEndpointInputs[K],
	ParseurEndpointOutputs[K]
>;

export type ParseurEndpoints = {
	listMailboxes: ParseurEndpoint<'listMailboxes'>;
	createMailbox: ParseurEndpoint<'createMailbox'>;
	getMailbox: ParseurEndpoint<'getMailbox'>;
	updateMailbox: ParseurEndpoint<'updateMailbox'>;
	deleteMailbox: ParseurEndpoint<'deleteMailbox'>;
	getMailboxSchema: ParseurEndpoint<'getMailboxSchema'>;
	copyMailbox: ParseurEndpoint<'copyMailbox'>;

	listDocuments: ParseurEndpoint<'listDocuments'>;
	getDocument: ParseurEndpoint<'getDocument'>;
	deleteDocument: ParseurEndpoint<'deleteDocument'>;
	getDocumentLogs: ParseurEndpoint<'getDocumentLogs'>;
	uploadDocument: ParseurEndpoint<'uploadDocument'>;
	createEmailDocument: ParseurEndpoint<'createEmailDocument'>;
	processDocument: ParseurEndpoint<'processDocument'>;
	skipDocument: ParseurEndpoint<'skipDocument'>;
	copyDocument: ParseurEndpoint<'copyDocument'>;

	listTemplates: ParseurEndpoint<'listTemplates'>;
	getTemplate: ParseurEndpoint<'getTemplate'>;
	deleteTemplate: ParseurEndpoint<'deleteTemplate'>;
	copyTemplate: ParseurEndpoint<'copyTemplate'>;

	listExportConfigs: ParseurEndpoint<'listExportConfigs'>;
	createExportConfig: ParseurEndpoint<'createExportConfig'>;
	updateExportConfig: ParseurEndpoint<'updateExportConfig'>;
	deleteExportConfig: ParseurEndpoint<'deleteExportConfig'>;

	createWebhook: ParseurEndpoint<'createWebhook'>;
	enableWebhook: ParseurEndpoint<'enableWebhook'>;
	disableWebhook: ParseurEndpoint<'disableWebhook'>;
	deleteWebhook: ParseurEndpoint<'deleteWebhook'>;

	getBootstrap: ParseurEndpoint<'getBootstrap'>;
};

type ParseurWebhook<
	K extends keyof ParseurWebhookOutputs,
	TEvent,
> = CorsairWebhook<ParseurContext, TEvent, ParseurWebhookOutputs[K]>;

export type ParseurWebhooks = {
	documentProcessed: ParseurWebhook<
		'documentProcessed',
		DocumentProcessedEvent
	>;
	tableItemProcessed: ParseurWebhook<
		'tableItemProcessed',
		TableItemProcessedEvent
	>;
	processFailed: ParseurWebhook<'processFailed', ProcessFailedEvent>;
};

export type ParseurBoundWebhooks = BindWebhooks<ParseurWebhooks>;

export const parseurEndpointsNested = {
	mailboxes: {
		listMailboxes: Mailbox.listMailboxes,
		createMailbox: Mailbox.createMailbox,
		getMailbox: Mailbox.getMailbox,
		updateMailbox: Mailbox.updateMailbox,
		deleteMailbox: Mailbox.deleteMailbox,
		getMailboxSchema: Mailbox.getMailboxSchema,
		copyMailbox: Mailbox.copyMailbox,
	},
	documents: {
		listDocuments: Document.listDocuments,
		getDocument: Document.getDocument,
		deleteDocument: Document.deleteDocument,
		getDocumentLogs: Document.getDocumentLogs,
		uploadDocument: Document.uploadDocument,
		createEmailDocument: Document.createEmailDocument,
		processDocument: Document.processDocument,
		skipDocument: Document.skipDocument,
		copyDocument: Document.copyDocument,
	},
	templates: {
		listTemplates: Template.listTemplates,
		getTemplate: Template.getTemplate,
		deleteTemplate: Template.deleteTemplate,
		copyTemplate: Template.copyTemplate,
	},
	exportConfigs: {
		listExportConfigs: ExportConfig.listExportConfigs,
		createExportConfig: ExportConfig.createExportConfig,
		updateExportConfig: ExportConfig.updateExportConfig,
		deleteExportConfig: ExportConfig.deleteExportConfig,
	},
	webhooks: {
		createWebhook: Webhook.createWebhook,
		enableWebhook: Webhook.enableWebhook,
		disableWebhook: Webhook.disableWebhook,
		deleteWebhook: Webhook.deleteWebhook,
	},
	bootstrap: {
		getBootstrap: Bootstrap.getBootstrap,
	},
} as const;

export const parseurEndpointSchemas = {
	'mailboxes.listMailboxes': {
		input: ParseurEndpointInputSchemas.listMailboxes,
		output: ParseurEndpointOutputSchemas.listMailboxes,
	},
	'mailboxes.createMailbox': {
		input: ParseurEndpointInputSchemas.createMailbox,
		output: ParseurEndpointOutputSchemas.createMailbox,
	},
	'mailboxes.getMailbox': {
		input: ParseurEndpointInputSchemas.getMailbox,
		output: ParseurEndpointOutputSchemas.getMailbox,
	},
	'mailboxes.updateMailbox': {
		input: ParseurEndpointInputSchemas.updateMailbox,
		output: ParseurEndpointOutputSchemas.updateMailbox,
	},
	'mailboxes.deleteMailbox': {
		input: ParseurEndpointInputSchemas.deleteMailbox,
		output: ParseurEndpointOutputSchemas.deleteMailbox,
	},
	'mailboxes.getMailboxSchema': {
		input: ParseurEndpointInputSchemas.getMailboxSchema,
		output: ParseurEndpointOutputSchemas.getMailboxSchema,
	},
	'mailboxes.copyMailbox': {
		input: ParseurEndpointInputSchemas.copyMailbox,
		output: ParseurEndpointOutputSchemas.copyMailbox,
	},

	'documents.listDocuments': {
		input: ParseurEndpointInputSchemas.listDocuments,
		output: ParseurEndpointOutputSchemas.listDocuments,
	},
	'documents.getDocument': {
		input: ParseurEndpointInputSchemas.getDocument,
		output: ParseurEndpointOutputSchemas.getDocument,
	},
	'documents.deleteDocument': {
		input: ParseurEndpointInputSchemas.deleteDocument,
		output: ParseurEndpointOutputSchemas.deleteDocument,
	},
	'documents.getDocumentLogs': {
		input: ParseurEndpointInputSchemas.getDocumentLogs,
		output: ParseurEndpointOutputSchemas.getDocumentLogs,
	},
	'documents.uploadDocument': {
		input: ParseurEndpointInputSchemas.uploadDocument,
		output: ParseurEndpointOutputSchemas.uploadDocument,
	},
	'documents.createEmailDocument': {
		input: ParseurEndpointInputSchemas.createEmailDocument,
		output: ParseurEndpointOutputSchemas.createEmailDocument,
	},
	'documents.processDocument': {
		input: ParseurEndpointInputSchemas.processDocument,
		output: ParseurEndpointOutputSchemas.processDocument,
	},
	'documents.skipDocument': {
		input: ParseurEndpointInputSchemas.skipDocument,
		output: ParseurEndpointOutputSchemas.skipDocument,
	},
	'documents.copyDocument': {
		input: ParseurEndpointInputSchemas.copyDocument,
		output: ParseurEndpointOutputSchemas.copyDocument,
	},

	'templates.listTemplates': {
		input: ParseurEndpointInputSchemas.listTemplates,
		output: ParseurEndpointOutputSchemas.listTemplates,
	},
	'templates.getTemplate': {
		input: ParseurEndpointInputSchemas.getTemplate,
		output: ParseurEndpointOutputSchemas.getTemplate,
	},
	'templates.deleteTemplate': {
		input: ParseurEndpointInputSchemas.deleteTemplate,
		output: ParseurEndpointOutputSchemas.deleteTemplate,
	},
	'templates.copyTemplate': {
		input: ParseurEndpointInputSchemas.copyTemplate,
		output: ParseurEndpointOutputSchemas.copyTemplate,
	},

	'exportConfigs.listExportConfigs': {
		input: ParseurEndpointInputSchemas.listExportConfigs,
		output: ParseurEndpointOutputSchemas.listExportConfigs,
	},
	'exportConfigs.createExportConfig': {
		input: ParseurEndpointInputSchemas.createExportConfig,
		output: ParseurEndpointOutputSchemas.createExportConfig,
	},
	'exportConfigs.updateExportConfig': {
		input: ParseurEndpointInputSchemas.updateExportConfig,
		output: ParseurEndpointOutputSchemas.updateExportConfig,
	},
	'exportConfigs.deleteExportConfig': {
		input: ParseurEndpointInputSchemas.deleteExportConfig,
		output: ParseurEndpointOutputSchemas.deleteExportConfig,
	},

	'webhooks.createWebhook': {
		input: ParseurEndpointInputSchemas.createWebhook,
		output: ParseurEndpointOutputSchemas.createWebhook,
	},
	'webhooks.enableWebhook': {
		input: ParseurEndpointInputSchemas.enableWebhook,
		output: ParseurEndpointOutputSchemas.enableWebhook,
	},
	'webhooks.disableWebhook': {
		input: ParseurEndpointInputSchemas.disableWebhook,
		output: ParseurEndpointOutputSchemas.disableWebhook,
	},
	'webhooks.deleteWebhook': {
		input: ParseurEndpointInputSchemas.deleteWebhook,
		output: ParseurEndpointOutputSchemas.deleteWebhook,
	},

	'bootstrap.getBootstrap': {
		input: ParseurEndpointInputSchemas.getBootstrap,
		output: ParseurEndpointOutputSchemas.getBootstrap,
	},
} satisfies RequiredPluginEndpointSchemas<typeof parseurEndpointsNested>;

const parseurWebhooksNested = {
	documents: {
		documentProcessed: DocumentWebhooks.documentProcessed,
		tableItemProcessed: DocumentWebhooks.tableItemProcessed,
		processFailed: DocumentWebhooks.processFailed,
	},
} as const;

export const parseurWebhookSchemas = {
	'documents.documentProcessed': {
		description: 'A document was successfully parsed and processed',
		payload: DocumentProcessedEventSchema,
		response: DocumentProcessedEventSchema,
	},
	'documents.tableItemProcessed': {
		description: 'A table item was extracted and processed from a document',
		payload: TableItemProcessedEventSchema,
		response: TableItemProcessedEventSchema,
	},
	'documents.processFailed': {
		description: 'Document parsing or processing failed',
		payload: ProcessFailedEventSchema,
		response: ProcessFailedEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof parseurWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const parseurEndpointMeta = {
	'mailboxes.listMailboxes': {
		riskLevel: 'read',
		description: 'List mailboxes (parsers) in Parseur',
	},
	'mailboxes.createMailbox': {
		riskLevel: 'write',
		description: 'Create a new mailbox (parser)',
	},
	'mailboxes.getMailbox': {
		riskLevel: 'read',
		description: 'Get details of a specific mailbox',
	},
	'mailboxes.updateMailbox': {
		riskLevel: 'write',
		description: 'Update an existing mailbox configuration',
	},
	'mailboxes.deleteMailbox': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a mailbox [DESTRUCTIVE · IRREVERSIBLE]',
	},
	'mailboxes.getMailboxSchema': {
		riskLevel: 'read',
		description: 'Get the extracted fields schema for a mailbox',
	},
	'mailboxes.copyMailbox': {
		riskLevel: 'write',
		description: 'Create a copy of a mailbox',
	},

	'documents.listDocuments': {
		riskLevel: 'read',
		description:
			'List documents in a mailbox with optional filters and pagination',
	},
	'documents.getDocument': {
		riskLevel: 'read',
		description: 'Get details and extracted fields of a document',
	},
	'documents.deleteDocument': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a document [DESTRUCTIVE · IRREVERSIBLE]',
	},
	'documents.getDocumentLogs': {
		riskLevel: 'read',
		description: 'Get processing logs for a document',
	},
	'documents.uploadDocument': {
		riskLevel: 'write',
		description: 'Upload a binary file/document for parsing',
	},
	'documents.createEmailDocument': {
		riskLevel: 'write',
		description: 'Send or ingest an email document for parsing',
	},
	'documents.processDocument': {
		riskLevel: 'write',
		description: 'Reprocess a document against mailbox templates',
	},
	'documents.skipDocument': {
		riskLevel: 'write',
		description: 'Skip document processing',
	},
	'documents.copyDocument': {
		riskLevel: 'write',
		description: 'Copy a document to another mailbox',
	},

	'templates.listTemplates': {
		riskLevel: 'read',
		description: 'List templates configured in a mailbox',
	},
	'templates.getTemplate': {
		riskLevel: 'read',
		description: 'Get details of a parsing template',
	},
	'templates.deleteTemplate': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a parsing template [DESTRUCTIVE · IRREVERSIBLE]',
	},
	'templates.copyTemplate': {
		riskLevel: 'write',
		description: 'Copy a parsing template to another mailbox',
	},

	'exportConfigs.listExportConfigs': {
		riskLevel: 'read',
		description: 'List custom download/export configurations',
	},
	'exportConfigs.createExportConfig': {
		riskLevel: 'write',
		description: 'Create a custom download/export configuration',
	},
	'exportConfigs.updateExportConfig': {
		riskLevel: 'write',
		description: 'Update a custom download/export configuration',
	},
	'exportConfigs.deleteExportConfig': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete an export configuration [DESTRUCTIVE · IRREVERSIBLE]',
	},

	'webhooks.createWebhook': {
		riskLevel: 'write',
		description: 'Create a new webhook endpoint in Parseur',
	},
	'webhooks.enableWebhook': {
		riskLevel: 'write',
		description: 'Link/enable a webhook on a mailbox',
	},
	'webhooks.disableWebhook': {
		riskLevel: 'write',
		description: 'Unlink/disable a webhook on a mailbox',
	},
	'webhooks.deleteWebhook': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a webhook endpoint [DESTRUCTIVE · IRREVERSIBLE]',
	},

	'bootstrap.getBootstrap': {
		riskLevel: 'read',
		description:
			'Get account, user profile, and mailbox summary bootstrap data',
	},
} satisfies RequiredPluginEndpointMeta<typeof parseurEndpointsNested>;

export const parseurAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseParseurPlugin<T extends ParseurPluginOptions> = CorsairPlugin<
	'parseur',
	typeof ParseurSchema,
	typeof parseurEndpointsNested,
	typeof parseurWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalParseurPlugin = BaseParseurPlugin<ParseurPluginOptions>;

export type ExternalParseurPlugin<T extends ParseurPluginOptions> =
	BaseParseurPlugin<T>;

export function parseur<const T extends ParseurPluginOptions>(
	incomingOptions: ParseurPluginOptions & T = {} as ParseurPluginOptions & T,
): ExternalParseurPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'parseur',
		authConfig: parseurAuthConfig,
		schema: ParseurSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: parseurEndpointsNested,
		webhooks: parseurWebhooksNested,
		endpointMeta: parseurEndpointMeta,
		endpointSchemas: parseurEndpointSchemas,
		webhookSchemas: parseurWebhookSchemas,
		pluginWebhookMatcher: matchParseurPluginWebhook,
		pluginTenantWebhookMatcher: matchParseurTenantWebhook,
		errorHandlers: (() => {
			const { DEFAULT: defaultHandler, ...specificDefaults } = errorHandlers;
			return {
				...specificDefaults,
				...(options.errorHandlers || {}),
				DEFAULT: options.errorHandlers?.DEFAULT || defaultHandler,
			};
		})(),
		keyBuilder: async (ctx: ParseurKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();
				if (!res) {
					throw new AuthMissingError('parseur', 'webhook_signature');
				}
				return res;
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('parseur', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('parseur', 'api_key');
		},
	} satisfies InternalParseurPlugin;
}

export type {
	ParseurEndpointInputs,
	ParseurEndpointOutputs,
} from './endpoints/types';
export type {
	DocumentProcessedEvent,
	ParseurWebhookOutputs,
	ProcessFailedEvent,
	TableItemProcessedEvent,
} from './webhooks/types';
