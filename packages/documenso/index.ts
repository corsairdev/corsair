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
import { Documenso as endpoints } from './endpoints';
import type {
	DocumensoEndpointInputs,
	DocumensoEndpointOutputs,
} from './endpoints/types';
import {
	DocumensoEndpointInputSchemas,
	DocumensoEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { DocumensoSchema } from './schema';

export type DocumensoPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	baseUrl?: string;
	hooks?: InternalDocumensoPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof documensoEndpointsNested>;
};

export type DocumensoContext = CorsairPluginContext<
	typeof DocumensoSchema,
	DocumensoPluginOptions
>;
export type DocumensoKeyBuilderContext =
	KeyBuilderContext<DocumensoPluginOptions>;
export type DocumensoBoundEndpoints = BindEndpoints<
	typeof documensoEndpointsNested
>;

type DocumensoEndpoint<K extends keyof DocumensoEndpointOutputs> =
	CorsairEndpoint<
		DocumensoContext,
		DocumensoEndpointInputs[K],
		DocumensoEndpointOutputs[K]
	>;
export type { DocumensoEndpoint };

export type DocumensoEndpoints = {
	envelopeAttachmentFind: DocumensoEndpoint<'envelopeAttachmentFind'>;
	envelopeAttachmentCreate: DocumensoEndpoint<'envelopeAttachmentCreate'>;
	envelopeAttachmentUpdate: DocumensoEndpoint<'envelopeAttachmentUpdate'>;
	envelopeAttachmentDelete: DocumensoEndpoint<'envelopeAttachmentDelete'>;
	envelopeItemCreateMany: DocumensoEndpoint<'envelopeItemCreateMany'>;
	envelopeItemUpdateMany: DocumensoEndpoint<'envelopeItemUpdateMany'>;
	envelopeItemDelete: DocumensoEndpoint<'envelopeItemDelete'>;
	envelopeItemDownload: DocumensoEndpoint<'envelopeItemDownload'>;
	envelopeRecipientGet: DocumensoEndpoint<'envelopeRecipientGet'>;
	envelopeRecipientCreateMany: DocumensoEndpoint<'envelopeRecipientCreateMany'>;
	envelopeRecipientUpdateMany: DocumensoEndpoint<'envelopeRecipientUpdateMany'>;
	envelopeRecipientDelete: DocumensoEndpoint<'envelopeRecipientDelete'>;
	envelopeRecipientRejectOnBehalfOf: DocumensoEndpoint<'envelopeRecipientRejectOnBehalfOf'>;
	envelopeFieldGet: DocumensoEndpoint<'envelopeFieldGet'>;
	envelopeFieldCreateMany: DocumensoEndpoint<'envelopeFieldCreateMany'>;
	envelopeFieldUpdateMany: DocumensoEndpoint<'envelopeFieldUpdateMany'>;
	envelopeFieldDelete: DocumensoEndpoint<'envelopeFieldDelete'>;
	envelopeFind: DocumensoEndpoint<'envelopeFind'>;
	envelopeAuditLogFind: DocumensoEndpoint<'envelopeAuditLogFind'>;
	envelopeAuditLogDownloadPdf: DocumensoEndpoint<'envelopeAuditLogDownloadPdf'>;
	envelopeCertificateDownloadPdf: DocumensoEndpoint<'envelopeCertificateDownloadPdf'>;
	envelopeGet: DocumensoEndpoint<'envelopeGet'>;
	envelopeGetMany: DocumensoEndpoint<'envelopeGetMany'>;
	envelopeCreate: DocumensoEndpoint<'envelopeCreate'>;
	envelopeUse: DocumensoEndpoint<'envelopeUse'>;
	envelopeUpdate: DocumensoEndpoint<'envelopeUpdate'>;
	envelopeDelete: DocumensoEndpoint<'envelopeDelete'>;
	envelopeCancel: DocumensoEndpoint<'envelopeCancel'>;
	envelopeDuplicate: DocumensoEndpoint<'envelopeDuplicate'>;
	envelopeDistribute: DocumensoEndpoint<'envelopeDistribute'>;
	envelopeRedistribute: DocumensoEndpoint<'envelopeRedistribute'>;
	documentGet: DocumensoEndpoint<'documentGet'>;
	documentGetMany: DocumensoEndpoint<'documentGetMany'>;
	documentFind: DocumensoEndpoint<'documentFind'>;
	documentCreate: DocumensoEndpoint<'documentCreate'>;
	documentUpdate: DocumensoEndpoint<'documentUpdate'>;
	documentDelete: DocumensoEndpoint<'documentDelete'>;
	documentDuplicate: DocumensoEndpoint<'documentDuplicate'>;
	documentDistribute: DocumensoEndpoint<'documentDistribute'>;
	documentRedistribute: DocumensoEndpoint<'documentRedistribute'>;
	documentDownload: DocumensoEndpoint<'documentDownload'>;
	documentDownloadBeta: DocumensoEndpoint<'documentDownloadBeta'>;
	documentCreateDocumentTemporary: DocumensoEndpoint<'documentCreateDocumentTemporary'>;
	documentAttachmentCreate: DocumensoEndpoint<'documentAttachmentCreate'>;
	documentAttachmentUpdate: DocumensoEndpoint<'documentAttachmentUpdate'>;
	documentAttachmentDelete: DocumensoEndpoint<'documentAttachmentDelete'>;
	documentAttachmentFind: DocumensoEndpoint<'documentAttachmentFind'>;
	fieldGetDocumentField: DocumensoEndpoint<'fieldGetDocumentField'>;
	fieldCreateDocumentField: DocumensoEndpoint<'fieldCreateDocumentField'>;
	fieldCreateDocumentFields: DocumensoEndpoint<'fieldCreateDocumentFields'>;
	fieldUpdateDocumentField: DocumensoEndpoint<'fieldUpdateDocumentField'>;
	fieldUpdateDocumentFields: DocumensoEndpoint<'fieldUpdateDocumentFields'>;
	fieldDeleteDocumentField: DocumensoEndpoint<'fieldDeleteDocumentField'>;
	fieldCreateTemplateField: DocumensoEndpoint<'fieldCreateTemplateField'>;
	fieldGetTemplateField: DocumensoEndpoint<'fieldGetTemplateField'>;
	fieldCreateTemplateFields: DocumensoEndpoint<'fieldCreateTemplateFields'>;
	fieldUpdateTemplateField: DocumensoEndpoint<'fieldUpdateTemplateField'>;
	fieldUpdateTemplateFields: DocumensoEndpoint<'fieldUpdateTemplateFields'>;
	fieldDeleteTemplateField: DocumensoEndpoint<'fieldDeleteTemplateField'>;
	folderFindFolders: DocumensoEndpoint<'folderFindFolders'>;
	folderCreateFolder: DocumensoEndpoint<'folderCreateFolder'>;
	folderUpdateFolder: DocumensoEndpoint<'folderUpdateFolder'>;
	folderDeleteFolder: DocumensoEndpoint<'folderDeleteFolder'>;
	recipientGetDocumentRecipient: DocumensoEndpoint<'recipientGetDocumentRecipient'>;
	recipientCreateDocumentRecipient: DocumensoEndpoint<'recipientCreateDocumentRecipient'>;
	recipientCreateDocumentRecipients: DocumensoEndpoint<'recipientCreateDocumentRecipients'>;
	recipientUpdateDocumentRecipient: DocumensoEndpoint<'recipientUpdateDocumentRecipient'>;
	recipientUpdateDocumentRecipients: DocumensoEndpoint<'recipientUpdateDocumentRecipients'>;
	recipientDeleteDocumentRecipient: DocumensoEndpoint<'recipientDeleteDocumentRecipient'>;
	recipientGetTemplateRecipient: DocumensoEndpoint<'recipientGetTemplateRecipient'>;
	recipientCreateTemplateRecipient: DocumensoEndpoint<'recipientCreateTemplateRecipient'>;
	recipientCreateTemplateRecipients: DocumensoEndpoint<'recipientCreateTemplateRecipients'>;
	recipientUpdateTemplateRecipient: DocumensoEndpoint<'recipientUpdateTemplateRecipient'>;
	recipientUpdateTemplateRecipients: DocumensoEndpoint<'recipientUpdateTemplateRecipients'>;
	recipientDeleteTemplateRecipient: DocumensoEndpoint<'recipientDeleteTemplateRecipient'>;
	templateFindTemplates: DocumensoEndpoint<'templateFindTemplates'>;
	templateGetTemplateById: DocumensoEndpoint<'templateGetTemplateById'>;
	templateGetMany: DocumensoEndpoint<'templateGetMany'>;
	templateCreateTemplate: DocumensoEndpoint<'templateCreateTemplate'>;
	templateCreateTemplateTemporary: DocumensoEndpoint<'templateCreateTemplateTemporary'>;
	templateUpdateTemplate: DocumensoEndpoint<'templateUpdateTemplate'>;
	templateDuplicateTemplate: DocumensoEndpoint<'templateDuplicateTemplate'>;
	templateDeleteTemplate: DocumensoEndpoint<'templateDeleteTemplate'>;
	templateCreateDocumentFromTemplate: DocumensoEndpoint<'templateCreateDocumentFromTemplate'>;
	templateCreateTemplateDirectLink: DocumensoEndpoint<'templateCreateTemplateDirectLink'>;
	templateDeleteTemplateDirectLink: DocumensoEndpoint<'templateDeleteTemplateDirectLink'>;
	templateToggleTemplateDirectLink: DocumensoEndpoint<'templateToggleTemplateDirectLink'>;
	embeddingPresignCreateEmbeddingPresignToken: DocumensoEndpoint<'embeddingPresignCreateEmbeddingPresignToken'>;
	embeddingPresignVerifyEmbeddingPresignToken: DocumensoEndpoint<'embeddingPresignVerifyEmbeddingPresignToken'>;
};

const documensoEndpointsNested = endpoints;

export const documensoEndpointSchemas = {
	'envelopes.attachments.find.get': {
		input: DocumensoEndpointInputSchemas.envelopeAttachmentFind,
		output: DocumensoEndpointOutputSchemas.envelopeAttachmentFind,
	},
	'envelopes.attachments.create.post': {
		input: DocumensoEndpointInputSchemas.envelopeAttachmentCreate,
		output: DocumensoEndpointOutputSchemas.envelopeAttachmentCreate,
	},
	'envelopes.attachments.update.post': {
		input: DocumensoEndpointInputSchemas.envelopeAttachmentUpdate,
		output: DocumensoEndpointOutputSchemas.envelopeAttachmentUpdate,
	},
	'envelopes.attachments.delete.post': {
		input: DocumensoEndpointInputSchemas.envelopeAttachmentDelete,
		output: DocumensoEndpointOutputSchemas.envelopeAttachmentDelete,
	},
	'envelopes.items.createMany.post': {
		input: DocumensoEndpointInputSchemas.envelopeItemCreateMany,
		output: DocumensoEndpointOutputSchemas.envelopeItemCreateMany,
	},
	'envelopes.items.updateMany.post': {
		input: DocumensoEndpointInputSchemas.envelopeItemUpdateMany,
		output: DocumensoEndpointOutputSchemas.envelopeItemUpdateMany,
	},
	'envelopes.items.delete.post': {
		input: DocumensoEndpointInputSchemas.envelopeItemDelete,
		output: DocumensoEndpointOutputSchemas.envelopeItemDelete,
	},
	'envelopes.items.download.get': {
		input: DocumensoEndpointInputSchemas.envelopeItemDownload,
		output: DocumensoEndpointOutputSchemas.envelopeItemDownload,
	},
	'envelopes.recipients.get.get': {
		input: DocumensoEndpointInputSchemas.envelopeRecipientGet,
		output: DocumensoEndpointOutputSchemas.envelopeRecipientGet,
	},
	'envelopes.recipients.createMany.post': {
		input: DocumensoEndpointInputSchemas.envelopeRecipientCreateMany,
		output: DocumensoEndpointOutputSchemas.envelopeRecipientCreateMany,
	},
	'envelopes.recipients.updateMany.post': {
		input: DocumensoEndpointInputSchemas.envelopeRecipientUpdateMany,
		output: DocumensoEndpointOutputSchemas.envelopeRecipientUpdateMany,
	},
	'envelopes.recipients.delete.post': {
		input: DocumensoEndpointInputSchemas.envelopeRecipientDelete,
		output: DocumensoEndpointOutputSchemas.envelopeRecipientDelete,
	},
	'envelopes.recipients.recipientRejectOnBehalfOf.post': {
		input: DocumensoEndpointInputSchemas.envelopeRecipientRejectOnBehalfOf,
		output: DocumensoEndpointOutputSchemas.envelopeRecipientRejectOnBehalfOf,
	},
	'envelopes.fields.get.get': {
		input: DocumensoEndpointInputSchemas.envelopeFieldGet,
		output: DocumensoEndpointOutputSchemas.envelopeFieldGet,
	},
	'envelopes.fields.createMany.post': {
		input: DocumensoEndpointInputSchemas.envelopeFieldCreateMany,
		output: DocumensoEndpointOutputSchemas.envelopeFieldCreateMany,
	},
	'envelopes.fields.updateMany.post': {
		input: DocumensoEndpointInputSchemas.envelopeFieldUpdateMany,
		output: DocumensoEndpointOutputSchemas.envelopeFieldUpdateMany,
	},
	'envelopes.fields.delete.post': {
		input: DocumensoEndpointInputSchemas.envelopeFieldDelete,
		output: DocumensoEndpointOutputSchemas.envelopeFieldDelete,
	},
	'envelopes.find.get': {
		input: DocumensoEndpointInputSchemas.envelopeFind,
		output: DocumensoEndpointOutputSchemas.envelopeFind,
	},
	'envelopes.auditLogFind.get': {
		input: DocumensoEndpointInputSchemas.envelopeAuditLogFind,
		output: DocumensoEndpointOutputSchemas.envelopeAuditLogFind,
	},
	'envelopes.auditLogDownloadPdf.get': {
		input: DocumensoEndpointInputSchemas.envelopeAuditLogDownloadPdf,
		output: DocumensoEndpointOutputSchemas.envelopeAuditLogDownloadPdf,
	},
	'envelopes.certificateDownloadPdf.get': {
		input: DocumensoEndpointInputSchemas.envelopeCertificateDownloadPdf,
		output: DocumensoEndpointOutputSchemas.envelopeCertificateDownloadPdf,
	},
	'envelopes.get.get': {
		input: DocumensoEndpointInputSchemas.envelopeGet,
		output: DocumensoEndpointOutputSchemas.envelopeGet,
	},
	'envelopes.getMany.post': {
		input: DocumensoEndpointInputSchemas.envelopeGetMany,
		output: DocumensoEndpointOutputSchemas.envelopeGetMany,
	},
	'envelopes.create.post': {
		input: DocumensoEndpointInputSchemas.envelopeCreate,
		output: DocumensoEndpointOutputSchemas.envelopeCreate,
	},
	'envelopes.use.post': {
		input: DocumensoEndpointInputSchemas.envelopeUse,
		output: DocumensoEndpointOutputSchemas.envelopeUse,
	},
	'envelopes.update.post': {
		input: DocumensoEndpointInputSchemas.envelopeUpdate,
		output: DocumensoEndpointOutputSchemas.envelopeUpdate,
	},
	'envelopes.delete.post': {
		input: DocumensoEndpointInputSchemas.envelopeDelete,
		output: DocumensoEndpointOutputSchemas.envelopeDelete,
	},
	'envelopes.cancel.post': {
		input: DocumensoEndpointInputSchemas.envelopeCancel,
		output: DocumensoEndpointOutputSchemas.envelopeCancel,
	},
	'envelopes.duplicate.post': {
		input: DocumensoEndpointInputSchemas.envelopeDuplicate,
		output: DocumensoEndpointOutputSchemas.envelopeDuplicate,
	},
	'envelopes.distribute.post': {
		input: DocumensoEndpointInputSchemas.envelopeDistribute,
		output: DocumensoEndpointOutputSchemas.envelopeDistribute,
	},
	'envelopes.redistribute.post': {
		input: DocumensoEndpointInputSchemas.envelopeRedistribute,
		output: DocumensoEndpointOutputSchemas.envelopeRedistribute,
	},
	'documents.get.get': {
		input: DocumensoEndpointInputSchemas.documentGet,
		output: DocumensoEndpointOutputSchemas.documentGet,
	},
	'documents.getMany.post': {
		input: DocumensoEndpointInputSchemas.documentGetMany,
		output: DocumensoEndpointOutputSchemas.documentGetMany,
	},
	'documents.find.get': {
		input: DocumensoEndpointInputSchemas.documentFind,
		output: DocumensoEndpointOutputSchemas.documentFind,
	},
	'documents.create.post': {
		input: DocumensoEndpointInputSchemas.documentCreate,
		output: DocumensoEndpointOutputSchemas.documentCreate,
	},
	'documents.update.post': {
		input: DocumensoEndpointInputSchemas.documentUpdate,
		output: DocumensoEndpointOutputSchemas.documentUpdate,
	},
	'documents.delete.post': {
		input: DocumensoEndpointInputSchemas.documentDelete,
		output: DocumensoEndpointOutputSchemas.documentDelete,
	},
	'documents.duplicate.post': {
		input: DocumensoEndpointInputSchemas.documentDuplicate,
		output: DocumensoEndpointOutputSchemas.documentDuplicate,
	},
	'documents.distribute.post': {
		input: DocumensoEndpointInputSchemas.documentDistribute,
		output: DocumensoEndpointOutputSchemas.documentDistribute,
	},
	'documents.redistribute.post': {
		input: DocumensoEndpointInputSchemas.documentRedistribute,
		output: DocumensoEndpointOutputSchemas.documentRedistribute,
	},
	'documents.download.get': {
		input: DocumensoEndpointInputSchemas.documentDownload,
		output: DocumensoEndpointOutputSchemas.documentDownload,
	},
	'documents.documentDownload.get': {
		input: DocumensoEndpointInputSchemas.documentDownloadBeta,
		output: DocumensoEndpointOutputSchemas.documentDownloadBeta,
	},
	'documents.createV0.post': {
		input: DocumensoEndpointInputSchemas.documentCreateDocumentTemporary,
		output: DocumensoEndpointOutputSchemas.documentCreateDocumentTemporary,
	},
	'documents.attachments.create.post': {
		input: DocumensoEndpointInputSchemas.documentAttachmentCreate,
		output: DocumensoEndpointOutputSchemas.documentAttachmentCreate,
	},
	'documents.attachments.update.post': {
		input: DocumensoEndpointInputSchemas.documentAttachmentUpdate,
		output: DocumensoEndpointOutputSchemas.documentAttachmentUpdate,
	},
	'documents.attachments.delete.post': {
		input: DocumensoEndpointInputSchemas.documentAttachmentDelete,
		output: DocumensoEndpointOutputSchemas.documentAttachmentDelete,
	},
	'documents.attachments.find.get': {
		input: DocumensoEndpointInputSchemas.documentAttachmentFind,
		output: DocumensoEndpointOutputSchemas.documentAttachmentFind,
	},
	'documents.fields.get.get': {
		input: DocumensoEndpointInputSchemas.fieldGetDocumentField,
		output: DocumensoEndpointOutputSchemas.fieldGetDocumentField,
	},
	'documents.fields.create.post': {
		input: DocumensoEndpointInputSchemas.fieldCreateDocumentField,
		output: DocumensoEndpointOutputSchemas.fieldCreateDocumentField,
	},
	'documents.fields.createMany.post': {
		input: DocumensoEndpointInputSchemas.fieldCreateDocumentFields,
		output: DocumensoEndpointOutputSchemas.fieldCreateDocumentFields,
	},
	'documents.fields.update.post': {
		input: DocumensoEndpointInputSchemas.fieldUpdateDocumentField,
		output: DocumensoEndpointOutputSchemas.fieldUpdateDocumentField,
	},
	'documents.fields.updateMany.post': {
		input: DocumensoEndpointInputSchemas.fieldUpdateDocumentFields,
		output: DocumensoEndpointOutputSchemas.fieldUpdateDocumentFields,
	},
	'documents.fields.delete.post': {
		input: DocumensoEndpointInputSchemas.fieldDeleteDocumentField,
		output: DocumensoEndpointOutputSchemas.fieldDeleteDocumentField,
	},
	'templates.fields.create.post': {
		input: DocumensoEndpointInputSchemas.fieldCreateTemplateField,
		output: DocumensoEndpointOutputSchemas.fieldCreateTemplateField,
	},
	'templates.fields.get.get': {
		input: DocumensoEndpointInputSchemas.fieldGetTemplateField,
		output: DocumensoEndpointOutputSchemas.fieldGetTemplateField,
	},
	'templates.fields.createMany.post': {
		input: DocumensoEndpointInputSchemas.fieldCreateTemplateFields,
		output: DocumensoEndpointOutputSchemas.fieldCreateTemplateFields,
	},
	'templates.fields.update.post': {
		input: DocumensoEndpointInputSchemas.fieldUpdateTemplateField,
		output: DocumensoEndpointOutputSchemas.fieldUpdateTemplateField,
	},
	'templates.fields.updateMany.post': {
		input: DocumensoEndpointInputSchemas.fieldUpdateTemplateFields,
		output: DocumensoEndpointOutputSchemas.fieldUpdateTemplateFields,
	},
	'templates.fields.delete.post': {
		input: DocumensoEndpointInputSchemas.fieldDeleteTemplateField,
		output: DocumensoEndpointOutputSchemas.fieldDeleteTemplateField,
	},
	'folders.find.get': {
		input: DocumensoEndpointInputSchemas.folderFindFolders,
		output: DocumensoEndpointOutputSchemas.folderFindFolders,
	},
	'folders.create.post': {
		input: DocumensoEndpointInputSchemas.folderCreateFolder,
		output: DocumensoEndpointOutputSchemas.folderCreateFolder,
	},
	'folders.update.post': {
		input: DocumensoEndpointInputSchemas.folderUpdateFolder,
		output: DocumensoEndpointOutputSchemas.folderUpdateFolder,
	},
	'folders.delete.post': {
		input: DocumensoEndpointInputSchemas.folderDeleteFolder,
		output: DocumensoEndpointOutputSchemas.folderDeleteFolder,
	},
	'documents.recipients.get.get': {
		input: DocumensoEndpointInputSchemas.recipientGetDocumentRecipient,
		output: DocumensoEndpointOutputSchemas.recipientGetDocumentRecipient,
	},
	'documents.recipients.create.post': {
		input: DocumensoEndpointInputSchemas.recipientCreateDocumentRecipient,
		output: DocumensoEndpointOutputSchemas.recipientCreateDocumentRecipient,
	},
	'documents.recipients.createMany.post': {
		input: DocumensoEndpointInputSchemas.recipientCreateDocumentRecipients,
		output: DocumensoEndpointOutputSchemas.recipientCreateDocumentRecipients,
	},
	'documents.recipients.update.post': {
		input: DocumensoEndpointInputSchemas.recipientUpdateDocumentRecipient,
		output: DocumensoEndpointOutputSchemas.recipientUpdateDocumentRecipient,
	},
	'documents.recipients.updateMany.post': {
		input: DocumensoEndpointInputSchemas.recipientUpdateDocumentRecipients,
		output: DocumensoEndpointOutputSchemas.recipientUpdateDocumentRecipients,
	},
	'documents.recipients.delete.post': {
		input: DocumensoEndpointInputSchemas.recipientDeleteDocumentRecipient,
		output: DocumensoEndpointOutputSchemas.recipientDeleteDocumentRecipient,
	},
	'templates.recipients.get.get': {
		input: DocumensoEndpointInputSchemas.recipientGetTemplateRecipient,
		output: DocumensoEndpointOutputSchemas.recipientGetTemplateRecipient,
	},
	'templates.recipients.create.post': {
		input: DocumensoEndpointInputSchemas.recipientCreateTemplateRecipient,
		output: DocumensoEndpointOutputSchemas.recipientCreateTemplateRecipient,
	},
	'templates.recipients.createMany.post': {
		input: DocumensoEndpointInputSchemas.recipientCreateTemplateRecipients,
		output: DocumensoEndpointOutputSchemas.recipientCreateTemplateRecipients,
	},
	'templates.recipients.update.post': {
		input: DocumensoEndpointInputSchemas.recipientUpdateTemplateRecipient,
		output: DocumensoEndpointOutputSchemas.recipientUpdateTemplateRecipient,
	},
	'templates.recipients.updateMany.post': {
		input: DocumensoEndpointInputSchemas.recipientUpdateTemplateRecipients,
		output: DocumensoEndpointOutputSchemas.recipientUpdateTemplateRecipients,
	},
	'templates.recipients.delete.post': {
		input: DocumensoEndpointInputSchemas.recipientDeleteTemplateRecipient,
		output: DocumensoEndpointOutputSchemas.recipientDeleteTemplateRecipient,
	},
	'templates.find.get': {
		input: DocumensoEndpointInputSchemas.templateFindTemplates,
		output: DocumensoEndpointOutputSchemas.templateFindTemplates,
	},
	'templates.get.get': {
		input: DocumensoEndpointInputSchemas.templateGetTemplateById,
		output: DocumensoEndpointOutputSchemas.templateGetTemplateById,
	},
	'templates.getMany.post': {
		input: DocumensoEndpointInputSchemas.templateGetMany,
		output: DocumensoEndpointOutputSchemas.templateGetMany,
	},
	'templates.create.post': {
		input: DocumensoEndpointInputSchemas.templateCreateTemplate,
		output: DocumensoEndpointOutputSchemas.templateCreateTemplate,
	},
	'templates.createTemplateTemporary.post': {
		input: DocumensoEndpointInputSchemas.templateCreateTemplateTemporary,
		output: DocumensoEndpointOutputSchemas.templateCreateTemplateTemporary,
	},
	'templates.update.post': {
		input: DocumensoEndpointInputSchemas.templateUpdateTemplate,
		output: DocumensoEndpointOutputSchemas.templateUpdateTemplate,
	},
	'templates.duplicate.post': {
		input: DocumensoEndpointInputSchemas.templateDuplicateTemplate,
		output: DocumensoEndpointOutputSchemas.templateDuplicateTemplate,
	},
	'templates.delete.post': {
		input: DocumensoEndpointInputSchemas.templateDeleteTemplate,
		output: DocumensoEndpointOutputSchemas.templateDeleteTemplate,
	},
	'templates.use.post': {
		input: DocumensoEndpointInputSchemas.templateCreateDocumentFromTemplate,
		output: DocumensoEndpointOutputSchemas.templateCreateDocumentFromTemplate,
	},
	'templates.directLinks.create.post': {
		input: DocumensoEndpointInputSchemas.templateCreateTemplateDirectLink,
		output: DocumensoEndpointOutputSchemas.templateCreateTemplateDirectLink,
	},
	'templates.directLinks.delete.post': {
		input: DocumensoEndpointInputSchemas.templateDeleteTemplateDirectLink,
		output: DocumensoEndpointOutputSchemas.templateDeleteTemplateDirectLink,
	},
	'templates.directLinks.toggle.post': {
		input: DocumensoEndpointInputSchemas.templateToggleTemplateDirectLink,
		output: DocumensoEndpointOutputSchemas.templateToggleTemplateDirectLink,
	},
	'embedding.presignCreateEmbeddingPresignToken.post': {
		input:
			DocumensoEndpointInputSchemas.embeddingPresignCreateEmbeddingPresignToken,
		output:
			DocumensoEndpointOutputSchemas.embeddingPresignCreateEmbeddingPresignToken,
	},
	'embedding.presignVerifyEmbeddingPresignToken.post': {
		input:
			DocumensoEndpointInputSchemas.embeddingPresignVerifyEmbeddingPresignToken,
		output:
			DocumensoEndpointOutputSchemas.embeddingPresignVerifyEmbeddingPresignToken,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof documensoEndpointsNested
>;

const documensoEndpointMeta = {
	'envelopes.attachments.find.get': {
		riskLevel: 'read',
		description: 'GET /envelope/attachment — Find attachments.',
	},
	'envelopes.attachments.create.post': {
		riskLevel: 'write',
		description: 'POST /envelope/attachment/create — Create attachment.',
	},
	'envelopes.attachments.update.post': {
		riskLevel: 'write',
		description: 'POST /envelope/attachment/update — Update attachment.',
	},
	'envelopes.attachments.delete.post': {
		riskLevel: 'destructive',
		description: 'POST /envelope/attachment/delete — Delete attachment.',
	},
	'envelopes.items.createMany.post': {
		riskLevel: 'write',
		description: 'POST /envelope/item/create-many — Create envelope items.',
	},
	'envelopes.items.updateMany.post': {
		riskLevel: 'write',
		description: 'POST /envelope/item/update-many — Update envelope items.',
	},
	'envelopes.items.delete.post': {
		riskLevel: 'destructive',
		description: 'POST /envelope/item/delete — Delete envelope item.',
	},
	'envelopes.items.download.get': {
		riskLevel: 'read',
		description:
			'GET /envelope/item/{envelopeItemId}/download — Download an envelope item.',
	},
	'envelopes.recipients.get.get': {
		riskLevel: 'read',
		description:
			'GET /envelope/recipient/{recipientId} — Get envelope recipient.',
	},
	'envelopes.recipients.createMany.post': {
		riskLevel: 'write',
		description:
			'POST /envelope/recipient/create-many — Create envelope recipients.',
	},
	'envelopes.recipients.updateMany.post': {
		riskLevel: 'write',
		description:
			'POST /envelope/recipient/update-many — Update envelope recipients.',
	},
	'envelopes.recipients.delete.post': {
		riskLevel: 'destructive',
		description: 'POST /envelope/recipient/delete — Delete envelope recipient.',
	},
	'envelopes.recipients.recipientRejectOnBehalfOf.post': {
		riskLevel: 'destructive',
		description:
			'POST /envelope/recipient/{recipientId}/reject — Reject envelope recipient on behalf of.',
	},
	'envelopes.fields.get.get': {
		riskLevel: 'read',
		description: 'GET /envelope/field/{fieldId} — Get envelope field.',
	},
	'envelopes.fields.createMany.post': {
		riskLevel: 'write',
		description: 'POST /envelope/field/create-many — Create envelope fields.',
	},
	'envelopes.fields.updateMany.post': {
		riskLevel: 'write',
		description: 'POST /envelope/field/update-many — Update envelope fields.',
	},
	'envelopes.fields.delete.post': {
		riskLevel: 'destructive',
		description: 'POST /envelope/field/delete — Delete envelope field.',
	},
	'envelopes.find.get': {
		riskLevel: 'read',
		description: 'GET /envelope — Find envelopes.',
	},
	'envelopes.auditLogFind.get': {
		riskLevel: 'read',
		description:
			'GET /envelope/{envelopeId}/audit-log — Get envelope audit logs.',
	},
	'envelopes.auditLogDownloadPdf.get': {
		riskLevel: 'read',
		description:
			'GET /envelope/{envelopeId}/audit-log/download — Download envelope audit log PDF.',
	},
	'envelopes.certificateDownloadPdf.get': {
		riskLevel: 'read',
		description:
			'GET /envelope/{envelopeId}/certificate/download — Download envelope certificate PDF.',
	},
	'envelopes.get.get': {
		riskLevel: 'read',
		description: 'GET /envelope/{envelopeId} — Get envelope.',
	},
	'envelopes.getMany.post': {
		riskLevel: 'read',
		description: 'POST /envelope/get-many — Get multiple envelopes.',
	},
	'envelopes.create.post': {
		riskLevel: 'write',
		description: 'POST /envelope/create — Create envelope.',
	},
	'envelopes.use.post': {
		riskLevel: 'destructive',
		description: 'POST /envelope/use — Use envelope.',
	},
	'envelopes.update.post': {
		riskLevel: 'write',
		description: 'POST /envelope/update — Update envelope.',
	},
	'envelopes.delete.post': {
		riskLevel: 'destructive',
		description: 'POST /envelope/delete — Delete envelope.',
	},
	'envelopes.cancel.post': {
		riskLevel: 'destructive',
		description: 'POST /envelope/cancel — Cancel envelope.',
	},
	'envelopes.duplicate.post': {
		riskLevel: 'write',
		description: 'POST /envelope/duplicate — Duplicate envelope.',
	},
	'envelopes.distribute.post': {
		riskLevel: 'destructive',
		description: 'POST /envelope/distribute — Distribute envelope.',
	},
	'envelopes.redistribute.post': {
		riskLevel: 'destructive',
		description: 'POST /envelope/redistribute — Redistribute envelope.',
	},
	'documents.get.get': {
		riskLevel: 'read',
		description: 'GET /document/{documentId} — [Deprecated] Get document.',
	},
	'documents.getMany.post': {
		riskLevel: 'read',
		description:
			'POST /document/get-many — [Deprecated] Get multiple documents.',
	},
	'documents.find.get': {
		riskLevel: 'read',
		description: 'GET /document — [Deprecated] Find documents.',
	},
	'documents.create.post': {
		riskLevel: 'write',
		description: 'POST /document/create — [Deprecated] Create document.',
	},
	'documents.update.post': {
		riskLevel: 'write',
		description: 'POST /document/update — [Deprecated] Update document.',
	},
	'documents.delete.post': {
		riskLevel: 'destructive',
		description: 'POST /document/delete — [Deprecated] Delete document.',
	},
	'documents.duplicate.post': {
		riskLevel: 'write',
		description: 'POST /document/duplicate — [Deprecated] Duplicate document.',
	},
	'documents.distribute.post': {
		riskLevel: 'destructive',
		description:
			'POST /document/distribute — [Deprecated] Distribute document.',
	},
	'documents.redistribute.post': {
		riskLevel: 'destructive',
		description:
			'POST /document/redistribute — [Deprecated] Redistribute document.',
	},
	'documents.download.get': {
		riskLevel: 'read',
		description:
			'GET /document/{documentId}/download — [Deprecated] Download document.',
	},
	'documents.documentDownload.get': {
		riskLevel: 'read',
		description:
			'GET /document/{documentId}/download-beta — [Deprecated] Download document (beta).',
	},
	'documents.createV0.post': {
		riskLevel: 'write',
		description: 'POST /document/create/beta — [Deprecated] Create document.',
	},
	'documents.attachments.create.post': {
		riskLevel: 'write',
		description:
			'POST /document/attachment/create — [Deprecated] Create attachment.',
	},
	'documents.attachments.update.post': {
		riskLevel: 'write',
		description:
			'POST /document/attachment/update — [Deprecated] Update attachment.',
	},
	'documents.attachments.delete.post': {
		riskLevel: 'destructive',
		description:
			'POST /document/attachment/delete — [Deprecated] Delete attachment.',
	},
	'documents.attachments.find.get': {
		riskLevel: 'read',
		description:
			"GET /document/attachment — [Deprecated] Find attachments. Documenso's server currently routes this path to the get-document handler and answers 400; use envelopes.attachments.find with the document's envelopeId instead.",
	},
	'documents.fields.get.get': {
		riskLevel: 'read',
		description:
			'GET /document/field/{fieldId} — [Deprecated] Get document field.',
	},
	'documents.fields.create.post': {
		riskLevel: 'write',
		description:
			'POST /document/field/create — [Deprecated] Create document field.',
	},
	'documents.fields.createMany.post': {
		riskLevel: 'write',
		description:
			'POST /document/field/create-many — [Deprecated] Create document fields.',
	},
	'documents.fields.update.post': {
		riskLevel: 'write',
		description:
			'POST /document/field/update — [Deprecated] Update document field.',
	},
	'documents.fields.updateMany.post': {
		riskLevel: 'write',
		description:
			'POST /document/field/update-many — [Deprecated] Update document fields.',
	},
	'documents.fields.delete.post': {
		riskLevel: 'destructive',
		description:
			'POST /document/field/delete — [Deprecated] Delete document field.',
	},
	'templates.fields.create.post': {
		riskLevel: 'write',
		description:
			'POST /template/field/create — [Deprecated] Create template field.',
	},
	'templates.fields.get.get': {
		riskLevel: 'read',
		description:
			'GET /template/field/{fieldId} — [Deprecated] Get template field.',
	},
	'templates.fields.createMany.post': {
		riskLevel: 'write',
		description:
			'POST /template/field/create-many — [Deprecated] Create template fields.',
	},
	'templates.fields.update.post': {
		riskLevel: 'write',
		description:
			'POST /template/field/update — [Deprecated] Update template field.',
	},
	'templates.fields.updateMany.post': {
		riskLevel: 'write',
		description:
			'POST /template/field/update-many — [Deprecated] Update template fields.',
	},
	'templates.fields.delete.post': {
		riskLevel: 'destructive',
		description:
			'POST /template/field/delete — [Deprecated] Delete template field.',
	},
	'folders.find.get': {
		riskLevel: 'read',
		description: 'GET /folder — Find folders.',
	},
	'folders.create.post': {
		riskLevel: 'write',
		description: 'POST /folder/create — Create new folder.',
	},
	'folders.update.post': {
		riskLevel: 'write',
		description: 'POST /folder/update — Update folder.',
	},
	'folders.delete.post': {
		riskLevel: 'destructive',
		description: 'POST /folder/delete — Delete folder.',
	},
	'documents.recipients.get.get': {
		riskLevel: 'read',
		description:
			'GET /document/recipient/{recipientId} — [Deprecated] Get document recipient.',
	},
	'documents.recipients.create.post': {
		riskLevel: 'write',
		description:
			'POST /document/recipient/create — [Deprecated] Create document recipient.',
	},
	'documents.recipients.createMany.post': {
		riskLevel: 'write',
		description:
			'POST /document/recipient/create-many — [Deprecated] Create document recipients.',
	},
	'documents.recipients.update.post': {
		riskLevel: 'write',
		description:
			'POST /document/recipient/update — [Deprecated] Update document recipient.',
	},
	'documents.recipients.updateMany.post': {
		riskLevel: 'write',
		description:
			'POST /document/recipient/update-many — [Deprecated] Update document recipients.',
	},
	'documents.recipients.delete.post': {
		riskLevel: 'destructive',
		description:
			'POST /document/recipient/delete — [Deprecated] Delete document recipient.',
	},
	'templates.recipients.get.get': {
		riskLevel: 'read',
		description:
			'GET /template/recipient/{recipientId} — [Deprecated] Get template recipient.',
	},
	'templates.recipients.create.post': {
		riskLevel: 'write',
		description:
			'POST /template/recipient/create — [Deprecated] Create template recipient.',
	},
	'templates.recipients.createMany.post': {
		riskLevel: 'write',
		description:
			'POST /template/recipient/create-many — [Deprecated] Create template recipients.',
	},
	'templates.recipients.update.post': {
		riskLevel: 'write',
		description:
			'POST /template/recipient/update — [Deprecated] Update template recipient.',
	},
	'templates.recipients.updateMany.post': {
		riskLevel: 'write',
		description:
			'POST /template/recipient/update-many — [Deprecated] Update template recipients.',
	},
	'templates.recipients.delete.post': {
		riskLevel: 'destructive',
		description:
			'POST /template/recipient/delete — [Deprecated] Delete template recipient.',
	},
	'templates.find.get': {
		riskLevel: 'read',
		description: 'GET /template — [Deprecated] Find templates.',
	},
	'templates.get.get': {
		riskLevel: 'read',
		description: 'GET /template/{templateId} — [Deprecated] Get template.',
	},
	'templates.getMany.post': {
		riskLevel: 'read',
		description:
			'POST /template/get-many — [Deprecated] Get multiple templates.',
	},
	'templates.create.post': {
		riskLevel: 'write',
		description: 'POST /template/create — [Deprecated] Create template.',
	},
	'templates.createTemplateTemporary.post': {
		riskLevel: 'write',
		description: 'POST /template/create/beta — [Deprecated] Create template.',
	},
	'templates.update.post': {
		riskLevel: 'write',
		description: 'POST /template/update — [Deprecated] Update template.',
	},
	'templates.duplicate.post': {
		riskLevel: 'write',
		description: 'POST /template/duplicate — [Deprecated] Duplicate template.',
	},
	'templates.delete.post': {
		riskLevel: 'destructive',
		description: 'POST /template/delete — [Deprecated] Delete template.',
	},
	'templates.use.post': {
		riskLevel: 'destructive',
		description: 'POST /template/use — [Deprecated] Use template.',
	},
	'templates.directLinks.create.post': {
		riskLevel: 'write',
		description:
			'POST /template/direct/create — [Deprecated] Create direct link.',
	},
	'templates.directLinks.delete.post': {
		riskLevel: 'destructive',
		description:
			'POST /template/direct/delete — [Deprecated] Delete direct link.',
	},
	'templates.directLinks.toggle.post': {
		riskLevel: 'write',
		description:
			'POST /template/direct/toggle — [Deprecated] Toggle direct link.',
	},
	'embedding.presignCreateEmbeddingPresignToken.post': {
		riskLevel: 'write',
		description:
			'POST /embedding/create-presign-token — Create embedding presign token.',
	},
	'embedding.presignVerifyEmbeddingPresignToken.post': {
		riskLevel: 'read',
		description:
			'POST /embedding/verify-presign-token — Verify embedding presign token.',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof documensoEndpointsNested
>;

export const documensoAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseDocumensoPlugin<T extends DocumensoPluginOptions> =
	CorsairPlugin<
		'documenso',
		typeof DocumensoSchema,
		typeof documensoEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType
	>;
export type InternalDocumensoPlugin =
	BaseDocumensoPlugin<DocumensoPluginOptions>;
export type ExternalDocumensoPlugin<T extends DocumensoPluginOptions> =
	BaseDocumensoPlugin<T>;
const defaultAuthType: AuthTypes = 'api_key';

export function documenso<const T extends DocumensoPluginOptions>(
	incomingOptions: DocumensoPluginOptions & T = {} as DocumensoPluginOptions &
		T,
): ExternalDocumensoPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	const { DEFAULT: builtInDefault, ...builtInHandlers } = errorHandlers;
	const { DEFAULT: callerDefault, ...callerHandlers } =
		options.errorHandlers ?? {};
	const orderedErrorHandlers = {
		...callerHandlers,
		...builtInHandlers,
		...callerHandlers,
		DEFAULT: callerDefault ?? builtInDefault,
	};
	return {
		id: 'documenso',
		authConfig: documensoAuthConfig,
		schema: DocumensoSchema,
		options,
		hooks: options.hooks,
		endpoints: documensoEndpointsNested,
		webhooks: {},
		endpointMeta: documensoEndpointMeta,
		endpointSchemas: documensoEndpointSchemas,
		errorHandlers: orderedErrorHandlers,
		keyBuilder: async (ctx: DocumensoKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key !== undefined) {
				if (!options.key.trim())
					throw new AuthMissingError('documenso', 'api_key');
				return options.key;
			}
			if (!ctx.keys) throw new AuthMissingError('documenso', 'api_key');
			const key = await ctx.keys.get_api_key();
			if (!key?.trim()) throw new AuthMissingError('documenso', 'api_key');
			return key;
		},
	} satisfies InternalDocumensoPlugin;
}

export { endpoints as Documenso };
export type {
	DocumensoEndpointInputs,
	DocumensoEndpointOutputs,
} from './endpoints/types';
