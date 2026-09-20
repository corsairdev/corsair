import * as BootstrapModule from './bootstrap';
import * as Documents from './documents';
import * as ExportConfigs from './export-configs';
import * as Mailboxes from './mailboxes';
import * as Templates from './templates';
import * as WebhooksModule from './webhooks';

export const Mailbox = {
	listMailboxes: Mailboxes.listMailboxes,
	createMailbox: Mailboxes.createMailbox,
	getMailbox: Mailboxes.getMailbox,
	updateMailbox: Mailboxes.updateMailbox,
	deleteMailbox: Mailboxes.deleteMailbox,
	getMailboxSchema: Mailboxes.getMailboxSchema,
	copyMailbox: Mailboxes.copyMailbox,
};

export const Document = {
	listDocuments: Documents.listDocuments,
	getDocument: Documents.getDocument,
	deleteDocument: Documents.deleteDocument,
	getDocumentLogs: Documents.getDocumentLogs,
	uploadDocument: Documents.uploadDocument,
	createEmailDocument: Documents.createEmailDocument,
	processDocument: Documents.processDocument,
	skipDocument: Documents.skipDocument,
	copyDocument: Documents.copyDocument,
};

export const Template = {
	listTemplates: Templates.listTemplates,
	getTemplate: Templates.getTemplate,
	deleteTemplate: Templates.deleteTemplate,
	copyTemplate: Templates.copyTemplate,
};

export const ExportConfig = {
	listExportConfigs: ExportConfigs.listExportConfigs,
	createExportConfig: ExportConfigs.createExportConfig,
	updateExportConfig: ExportConfigs.updateExportConfig,
	deleteExportConfig: ExportConfigs.deleteExportConfig,
};

export const Webhook = {
	createWebhook: WebhooksModule.createWebhook,
	enableWebhook: WebhooksModule.enableWebhook,
	disableWebhook: WebhooksModule.disableWebhook,
	deleteWebhook: WebhooksModule.deleteWebhook,
	listWebhooks: WebhooksModule.listWebhooks,
};

export const Bootstrap = {
	getBootstrap: BootstrapModule.getBootstrap,
};

export * from './types';
