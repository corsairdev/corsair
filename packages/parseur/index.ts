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

export type ParseurPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalParseurPlugin['hooks'];
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
	listWebhooks: ParseurEndpoint<'listWebhooks'>;
	getBootstrap: ParseurEndpoint<'getBootstrap'>;
};

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
		listWebhooks: Webhook.listWebhooks,
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
	'webhooks.listWebhooks': {
		input: ParseurEndpointInputSchemas.listWebhooks,
		output: ParseurEndpointOutputSchemas.listWebhooks,
	},
	'bootstrap.getBootstrap': {
		input: ParseurEndpointInputSchemas.getBootstrap,
		output: ParseurEndpointOutputSchemas.getBootstrap,
	},
} satisfies RequiredPluginEndpointSchemas<typeof parseurEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const parseurEndpointMeta = {
	'mailboxes.listMailboxes': {
		riskLevel: 'read',
		description:
			'List mailboxes (parsers) with full configuration details. Use when you need comprehensive mailbox information including field configurations, processing options, and webhook settings.',
	},
	'mailboxes.createMailbox': {
		riskLevel: 'write',
		description:
			'Create a new mailbox (parser) in Parseur. Use when you need to set up a new parser for document parsing with custom configuration.',
	},
	'mailboxes.getMailbox': {
		riskLevel: 'read',
		description:
			'Retrieve full mailbox (parser) configuration by ID, including fields, webhooks, and settings.',
	},
	'mailboxes.updateMailbox': {
		riskLevel: 'write',
		description:
			'Update a mailbox (parser) configuration such as name, AI engine, processing options, or document handling rules.',
	},
	'mailboxes.deleteMailbox': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a mailbox (parser) by ID [DESTRUCTIVE · IRREVERSIBLE]',
	},
	'mailboxes.getMailboxSchema': {
		riskLevel: 'read',
		description:
			"Retrieve the JSON schema for a mailbox's parsed fields. Use when you need the structure and types of data fields extracted by a parser.",
	},
	'mailboxes.copyMailbox': {
		riskLevel: 'write',
		description:
			'Copy a mailbox (parser) in Parseur. Creates a duplicate of the mailbox with all its configuration.',
	},
	'documents.listDocuments': {
		riskLevel: 'read',
		description:
			'List documents within a mailbox. Use when you need to paginate, search, or sort documents after obtaining the mailbox ID.',
	},
	'documents.getDocument': {
		riskLevel: 'read',
		description:
			'Retrieve full details of a document by ID: status, processing info, parsed results, and download URLs.',
	},
	'documents.deleteDocument': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a document by ID [DESTRUCTIVE · IRREVERSIBLE]',
	},
	'documents.getDocumentLogs': {
		riskLevel: 'read',
		description:
			'Get document logs for a document. Returns a paginated list of logs with status, source, and message details.',
	},
	'documents.uploadDocument': {
		riskLevel: 'write',
		description:
			'Upload a binary file to a Parseur mailbox as multipart/form-data.',
	},
	'documents.createEmailDocument': {
		riskLevel: 'write',
		description:
			'Upload an email or text document to Parseur for parsing. Requires subject, from, and recipient.',
	},
	'documents.processDocument': {
		riskLevel: 'write',
		description:
			'Reprocess a document with the current template configuration.',
	},
	'documents.skipDocument': {
		riskLevel: 'write',
		description: 'Skip a document. Marks the document with status SKIPPED.',
	},
	'documents.copyDocument': {
		riskLevel: 'write',
		description: 'Copy a document to another mailbox.',
	},
	'templates.listTemplates': {
		riskLevel: 'read',
		description: 'List all templates in a mailbox.',
	},
	'templates.getTemplate': {
		riskLevel: 'read',
		description: 'Get a template by ID.',
	},
	'templates.deleteTemplate': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a template by ID [DESTRUCTIVE · IRREVERSIBLE]',
	},
	'templates.copyTemplate': {
		riskLevel: 'write',
		description: 'Copy a template to another mailbox.',
	},
	'exportConfigs.listExportConfigs': {
		riskLevel: 'read',
		description: 'List custom downloads (export configurations) for a mailbox.',
	},
	'exportConfigs.createExportConfig': {
		riskLevel: 'write',
		description:
			'Create a custom download for a mailbox. Requires type and items (field names).',
	},
	'exportConfigs.updateExportConfig': {
		riskLevel: 'write',
		description:
			'Update a custom download field list, name, or type for an existing configuration.',
	},
	'exportConfigs.deleteExportConfig': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a custom download from a mailbox [DESTRUCTIVE · IRREVERSIBLE]',
	},
	'webhooks.createWebhook': {
		riskLevel: 'write',
		description:
			'Create a webhook. Official body uses target (URL), event, and category CUSTOM.',
	},
	'webhooks.enableWebhook': {
		riskLevel: 'write',
		description:
			'Enable a paused webhook for a mailbox. Only webhooks in available_webhook_set can be enabled.',
	},
	'webhooks.disableWebhook': {
		riskLevel: 'write',
		description:
			'Disable a webhook for a mailbox. Removes the webhook from webhook_set.',
	},
	'webhooks.deleteWebhook': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a webhook by ID [DESTRUCTIVE · IRREVERSIBLE]',
	},
	'webhooks.listWebhooks': {
		riskLevel: 'read',
		description:
			'List active (webhook_set) and paused (available_webhook_set) webhooks for a mailbox via GET /parser/{id}.',
	},
	'bootstrap.getBootstrap': {
		riskLevel: 'read',
		description:
			'Retrieve bootstrap configuration: choices, mappings, max_field_lengths, email_domain, extra_fields, and master_parser_set.',
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
	{},
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
		endpoints: parseurEndpointsNested,
		webhooks: {},
		endpointMeta: parseurEndpointMeta,
		endpointSchemas: parseurEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: (() => {
			const { DEFAULT: defaultHandler, ...specificDefaults } = errorHandlers;
			return {
				...specificDefaults,
				...(options.errorHandlers || {}),
				DEFAULT: options.errorHandlers?.DEFAULT || defaultHandler,
			};
		})(),
		keyBuilder: async (ctx: ParseurKeyBuilderContext, source) => {
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
