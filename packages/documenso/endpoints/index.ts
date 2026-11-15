import type { DocumensoContext } from '../index';
import {
	documentAttachmentCreate,
	documentAttachmentDelete,
	documentAttachmentFind,
	documentAttachmentUpdate,
	documentCreate,
	documentCreateDocumentTemporary,
	documentDelete,
	documentDistribute,
	documentDownload,
	documentDownloadBeta,
	documentDuplicate,
	documentFind,
	documentGet,
	documentGetMany,
	documentRedistribute,
	documentUpdate,
	embeddingPresignCreateEmbeddingPresignToken,
	embeddingPresignVerifyEmbeddingPresignToken,
	envelopeAttachmentCreate,
	envelopeAttachmentDelete,
	envelopeAttachmentFind,
	envelopeAttachmentUpdate,
	envelopeAuditLogDownloadPdf,
	envelopeAuditLogFind,
	envelopeCancel,
	envelopeCertificateDownloadPdf,
	envelopeCreate,
	envelopeDelete,
	envelopeDistribute,
	envelopeDuplicate,
	envelopeFieldCreateMany,
	envelopeFieldDelete,
	envelopeFieldGet,
	envelopeFieldUpdateMany,
	envelopeFind,
	envelopeGet,
	envelopeGetMany,
	envelopeItemCreateMany,
	envelopeItemDelete,
	envelopeItemDownload,
	envelopeItemUpdateMany,
	envelopeRecipientCreateMany,
	envelopeRecipientDelete,
	envelopeRecipientGet,
	envelopeRecipientRejectOnBehalfOf,
	envelopeRecipientUpdateMany,
	envelopeRedistribute,
	envelopeUpdate,
	envelopeUse,
	fieldCreateDocumentField,
	fieldCreateDocumentFields,
	fieldCreateTemplateField,
	fieldCreateTemplateFields,
	fieldDeleteDocumentField,
	fieldDeleteTemplateField,
	fieldGetDocumentField,
	fieldGetTemplateField,
	fieldUpdateDocumentField,
	fieldUpdateDocumentFields,
	fieldUpdateTemplateField,
	fieldUpdateTemplateFields,
	folderCreateFolder,
	folderDeleteFolder,
	folderFindFolders,
	folderUpdateFolder,
	recipientCreateDocumentRecipient,
	recipientCreateDocumentRecipients,
	recipientCreateTemplateRecipient,
	recipientCreateTemplateRecipients,
	recipientDeleteDocumentRecipient,
	recipientDeleteTemplateRecipient,
	recipientGetDocumentRecipient,
	recipientGetTemplateRecipient,
	recipientUpdateDocumentRecipient,
	recipientUpdateDocumentRecipients,
	recipientUpdateTemplateRecipient,
	recipientUpdateTemplateRecipients,
	templateCreateDocumentFromTemplate,
	templateCreateTemplate,
	templateCreateTemplateDirectLink,
	templateCreateTemplateTemporary,
	templateDeleteTemplate,
	templateDeleteTemplateDirectLink,
	templateDuplicateTemplate,
	templateFindTemplates,
	templateGetMany,
	templateGetTemplateById,
	templateToggleTemplateDirectLink,
	templateUpdateTemplate,
} from './operations';
import { DocumensoEndpointInputSchemas } from './types';

export const Documenso = {
	envelopes: {
		attachments: {
			find: { get: envelopeAttachmentFind },
			create: { post: envelopeAttachmentCreate },
			update: { post: envelopeAttachmentUpdate },
			delete: { post: envelopeAttachmentDelete },
		},
		items: {
			createMany: { post: envelopeItemCreateMany },
			updateMany: { post: envelopeItemUpdateMany },
			delete: { post: envelopeItemDelete },
			download: { get: envelopeItemDownload },
		},
		recipients: {
			get: { get: envelopeRecipientGet },
			createMany: { post: envelopeRecipientCreateMany },
			updateMany: { post: envelopeRecipientUpdateMany },
			delete: { post: envelopeRecipientDelete },
			recipientRejectOnBehalfOf: { post: envelopeRecipientRejectOnBehalfOf },
		},
		fields: {
			get: { get: envelopeFieldGet },
			createMany: { post: envelopeFieldCreateMany },
			updateMany: { post: envelopeFieldUpdateMany },
			delete: { post: envelopeFieldDelete },
		},
		find: { get: envelopeFind },
		auditLogFind: { get: envelopeAuditLogFind },
		auditLogDownloadPdf: { get: envelopeAuditLogDownloadPdf },
		certificateDownloadPdf: { get: envelopeCertificateDownloadPdf },
		get: { get: envelopeGet },
		getMany: { post: envelopeGetMany },
		create: { post: envelopeCreate },
		use: { post: envelopeUse },
		update: { post: envelopeUpdate },
		delete: { post: envelopeDelete },
		cancel: { post: envelopeCancel },
		duplicate: { post: envelopeDuplicate },
		distribute: { post: envelopeDistribute },
		redistribute: { post: envelopeRedistribute },
	},
	documents: {
		get: { get: documentGet },
		getMany: { post: documentGetMany },
		find: { get: documentFind },
		create: { post: documentCreate },
		update: { post: documentUpdate },
		delete: { post: documentDelete },
		duplicate: { post: documentDuplicate },
		distribute: { post: documentDistribute },
		redistribute: { post: documentRedistribute },
		download: { get: documentDownload },
		documentDownload: { get: documentDownloadBeta },
		createV0: { post: documentCreateDocumentTemporary },
		attachments: {
			create: { post: documentAttachmentCreate },
			update: { post: documentAttachmentUpdate },
			delete: { post: documentAttachmentDelete },
			find: { get: documentAttachmentFind },
		},
		fields: {
			get: { get: fieldGetDocumentField },
			create: { post: fieldCreateDocumentField },
			createMany: { post: fieldCreateDocumentFields },
			update: { post: fieldUpdateDocumentField },
			updateMany: { post: fieldUpdateDocumentFields },
			delete: { post: fieldDeleteDocumentField },
		},
		recipients: {
			get: { get: recipientGetDocumentRecipient },
			create: { post: recipientCreateDocumentRecipient },
			createMany: { post: recipientCreateDocumentRecipients },
			update: { post: recipientUpdateDocumentRecipient },
			updateMany: { post: recipientUpdateDocumentRecipients },
			delete: { post: recipientDeleteDocumentRecipient },
		},
	},
	templates: {
		fields: {
			create: { post: fieldCreateTemplateField },
			get: { get: fieldGetTemplateField },
			createMany: { post: fieldCreateTemplateFields },
			update: { post: fieldUpdateTemplateField },
			updateMany: { post: fieldUpdateTemplateFields },
			delete: { post: fieldDeleteTemplateField },
		},
		recipients: {
			get: { get: recipientGetTemplateRecipient },
			create: { post: recipientCreateTemplateRecipient },
			createMany: { post: recipientCreateTemplateRecipients },
			update: { post: recipientUpdateTemplateRecipient },
			updateMany: { post: recipientUpdateTemplateRecipients },
			delete: { post: recipientDeleteTemplateRecipient },
		},
		find: { get: templateFindTemplates },
		get: { get: templateGetTemplateById },
		getMany: { post: templateGetMany },
		create: { post: templateCreateTemplate },
		createTemplateTemporary: { post: templateCreateTemplateTemporary },
		update: { post: templateUpdateTemplate },
		duplicate: { post: templateDuplicateTemplate },
		delete: { post: templateDeleteTemplate },
		use: { post: templateCreateDocumentFromTemplate },
		directLinks: {
			create: { post: templateCreateTemplateDirectLink },
			delete: { post: templateDeleteTemplateDirectLink },
			toggle: { post: templateToggleTemplateDirectLink },
		},
	},
	folders: {
		find: { get: folderFindFolders },
		create: { post: folderCreateFolder },
		update: { post: folderUpdateFolder },
		delete: { post: folderDeleteFolder },
	},
	embedding: {
		presignCreateEmbeddingPresignToken: {
			post: embeddingPresignCreateEmbeddingPresignToken,
		},
		presignVerifyEmbeddingPresignToken: {
			post: embeddingPresignVerifyEmbeddingPresignToken,
		},
	},
} as const;

// `unknown` in test runners because dynamically selected operations receive runtime fixture input, which the matching schema parses before dispatch.
export const documensoEndpointTestRunners: Record<
	string,
	(ctx: DocumensoContext, input: unknown) => Promise<unknown>
> = {
	'envelopes.attachments.find.get': async (ctx, input) =>
		Documenso.envelopes.attachments.find.get(
			ctx,
			DocumensoEndpointInputSchemas.envelopeAttachmentFind.parse(input),
		),
	'envelopes.attachments.create.post': async (ctx, input) =>
		Documenso.envelopes.attachments.create.post(
			ctx,
			DocumensoEndpointInputSchemas.envelopeAttachmentCreate.parse(input),
		),
	'envelopes.attachments.update.post': async (ctx, input) =>
		Documenso.envelopes.attachments.update.post(
			ctx,
			DocumensoEndpointInputSchemas.envelopeAttachmentUpdate.parse(input),
		),
	'envelopes.attachments.delete.post': async (ctx, input) =>
		Documenso.envelopes.attachments.delete.post(
			ctx,
			DocumensoEndpointInputSchemas.envelopeAttachmentDelete.parse(input),
		),
	'envelopes.items.createMany.post': async (ctx, input) =>
		Documenso.envelopes.items.createMany.post(
			ctx,
			DocumensoEndpointInputSchemas.envelopeItemCreateMany.parse(input),
		),
	'envelopes.items.updateMany.post': async (ctx, input) =>
		Documenso.envelopes.items.updateMany.post(
			ctx,
			DocumensoEndpointInputSchemas.envelopeItemUpdateMany.parse(input),
		),
	'envelopes.items.delete.post': async (ctx, input) =>
		Documenso.envelopes.items.delete.post(
			ctx,
			DocumensoEndpointInputSchemas.envelopeItemDelete.parse(input),
		),
	'envelopes.items.download.get': async (ctx, input) =>
		Documenso.envelopes.items.download.get(
			ctx,
			DocumensoEndpointInputSchemas.envelopeItemDownload.parse(input),
		),
	'envelopes.recipients.get.get': async (ctx, input) =>
		Documenso.envelopes.recipients.get.get(
			ctx,
			DocumensoEndpointInputSchemas.envelopeRecipientGet.parse(input),
		),
	'envelopes.recipients.createMany.post': async (ctx, input) =>
		Documenso.envelopes.recipients.createMany.post(
			ctx,
			DocumensoEndpointInputSchemas.envelopeRecipientCreateMany.parse(input),
		),
	'envelopes.recipients.updateMany.post': async (ctx, input) =>
		Documenso.envelopes.recipients.updateMany.post(
			ctx,
			DocumensoEndpointInputSchemas.envelopeRecipientUpdateMany.parse(input),
		),
	'envelopes.recipients.delete.post': async (ctx, input) =>
		Documenso.envelopes.recipients.delete.post(
			ctx,
			DocumensoEndpointInputSchemas.envelopeRecipientDelete.parse(input),
		),
	'envelopes.recipients.recipientRejectOnBehalfOf.post': async (ctx, input) =>
		Documenso.envelopes.recipients.recipientRejectOnBehalfOf.post(
			ctx,
			DocumensoEndpointInputSchemas.envelopeRecipientRejectOnBehalfOf.parse(
				input,
			),
		),
	'envelopes.fields.get.get': async (ctx, input) =>
		Documenso.envelopes.fields.get.get(
			ctx,
			DocumensoEndpointInputSchemas.envelopeFieldGet.parse(input),
		),
	'envelopes.fields.createMany.post': async (ctx, input) =>
		Documenso.envelopes.fields.createMany.post(
			ctx,
			DocumensoEndpointInputSchemas.envelopeFieldCreateMany.parse(input),
		),
	'envelopes.fields.updateMany.post': async (ctx, input) =>
		Documenso.envelopes.fields.updateMany.post(
			ctx,
			DocumensoEndpointInputSchemas.envelopeFieldUpdateMany.parse(input),
		),
	'envelopes.fields.delete.post': async (ctx, input) =>
		Documenso.envelopes.fields.delete.post(
			ctx,
			DocumensoEndpointInputSchemas.envelopeFieldDelete.parse(input),
		),
	'envelopes.find.get': async (ctx, input) =>
		Documenso.envelopes.find.get(
			ctx,
			DocumensoEndpointInputSchemas.envelopeFind.parse(input),
		),
	'envelopes.auditLogFind.get': async (ctx, input) =>
		Documenso.envelopes.auditLogFind.get(
			ctx,
			DocumensoEndpointInputSchemas.envelopeAuditLogFind.parse(input),
		),
	'envelopes.auditLogDownloadPdf.get': async (ctx, input) =>
		Documenso.envelopes.auditLogDownloadPdf.get(
			ctx,
			DocumensoEndpointInputSchemas.envelopeAuditLogDownloadPdf.parse(input),
		),
	'envelopes.certificateDownloadPdf.get': async (ctx, input) =>
		Documenso.envelopes.certificateDownloadPdf.get(
			ctx,
			DocumensoEndpointInputSchemas.envelopeCertificateDownloadPdf.parse(input),
		),
	'envelopes.get.get': async (ctx, input) =>
		Documenso.envelopes.get.get(
			ctx,
			DocumensoEndpointInputSchemas.envelopeGet.parse(input),
		),
	'envelopes.getMany.post': async (ctx, input) =>
		Documenso.envelopes.getMany.post(
			ctx,
			DocumensoEndpointInputSchemas.envelopeGetMany.parse(input),
		),
	'envelopes.create.post': async (ctx, input) =>
		Documenso.envelopes.create.post(
			ctx,
			DocumensoEndpointInputSchemas.envelopeCreate.parse(input),
		),
	'envelopes.use.post': async (ctx, input) =>
		Documenso.envelopes.use.post(
			ctx,
			DocumensoEndpointInputSchemas.envelopeUse.parse(input),
		),
	'envelopes.update.post': async (ctx, input) =>
		Documenso.envelopes.update.post(
			ctx,
			DocumensoEndpointInputSchemas.envelopeUpdate.parse(input),
		),
	'envelopes.delete.post': async (ctx, input) =>
		Documenso.envelopes.delete.post(
			ctx,
			DocumensoEndpointInputSchemas.envelopeDelete.parse(input),
		),
	'envelopes.cancel.post': async (ctx, input) =>
		Documenso.envelopes.cancel.post(
			ctx,
			DocumensoEndpointInputSchemas.envelopeCancel.parse(input),
		),
	'envelopes.duplicate.post': async (ctx, input) =>
		Documenso.envelopes.duplicate.post(
			ctx,
			DocumensoEndpointInputSchemas.envelopeDuplicate.parse(input),
		),
	'envelopes.distribute.post': async (ctx, input) =>
		Documenso.envelopes.distribute.post(
			ctx,
			DocumensoEndpointInputSchemas.envelopeDistribute.parse(input),
		),
	'envelopes.redistribute.post': async (ctx, input) =>
		Documenso.envelopes.redistribute.post(
			ctx,
			DocumensoEndpointInputSchemas.envelopeRedistribute.parse(input),
		),
	'documents.get.get': async (ctx, input) =>
		Documenso.documents.get.get(
			ctx,
			DocumensoEndpointInputSchemas.documentGet.parse(input),
		),
	'documents.getMany.post': async (ctx, input) =>
		Documenso.documents.getMany.post(
			ctx,
			DocumensoEndpointInputSchemas.documentGetMany.parse(input),
		),
	'documents.find.get': async (ctx, input) =>
		Documenso.documents.find.get(
			ctx,
			DocumensoEndpointInputSchemas.documentFind.parse(input),
		),
	'documents.create.post': async (ctx, input) =>
		Documenso.documents.create.post(
			ctx,
			DocumensoEndpointInputSchemas.documentCreate.parse(input),
		),
	'documents.update.post': async (ctx, input) =>
		Documenso.documents.update.post(
			ctx,
			DocumensoEndpointInputSchemas.documentUpdate.parse(input),
		),
	'documents.delete.post': async (ctx, input) =>
		Documenso.documents.delete.post(
			ctx,
			DocumensoEndpointInputSchemas.documentDelete.parse(input),
		),
	'documents.duplicate.post': async (ctx, input) =>
		Documenso.documents.duplicate.post(
			ctx,
			DocumensoEndpointInputSchemas.documentDuplicate.parse(input),
		),
	'documents.distribute.post': async (ctx, input) =>
		Documenso.documents.distribute.post(
			ctx,
			DocumensoEndpointInputSchemas.documentDistribute.parse(input),
		),
	'documents.redistribute.post': async (ctx, input) =>
		Documenso.documents.redistribute.post(
			ctx,
			DocumensoEndpointInputSchemas.documentRedistribute.parse(input),
		),
	'documents.download.get': async (ctx, input) =>
		Documenso.documents.download.get(
			ctx,
			DocumensoEndpointInputSchemas.documentDownload.parse(input),
		),
	'documents.documentDownload.get': async (ctx, input) =>
		Documenso.documents.documentDownload.get(
			ctx,
			DocumensoEndpointInputSchemas.documentDownloadBeta.parse(input),
		),
	'documents.createV0.post': async (ctx, input) =>
		Documenso.documents.createV0.post(
			ctx,
			DocumensoEndpointInputSchemas.documentCreateDocumentTemporary.parse(
				input,
			),
		),
	'documents.attachments.create.post': async (ctx, input) =>
		Documenso.documents.attachments.create.post(
			ctx,
			DocumensoEndpointInputSchemas.documentAttachmentCreate.parse(input),
		),
	'documents.attachments.update.post': async (ctx, input) =>
		Documenso.documents.attachments.update.post(
			ctx,
			DocumensoEndpointInputSchemas.documentAttachmentUpdate.parse(input),
		),
	'documents.attachments.delete.post': async (ctx, input) =>
		Documenso.documents.attachments.delete.post(
			ctx,
			DocumensoEndpointInputSchemas.documentAttachmentDelete.parse(input),
		),
	'documents.attachments.find.get': async (ctx, input) =>
		Documenso.documents.attachments.find.get(
			ctx,
			DocumensoEndpointInputSchemas.documentAttachmentFind.parse(input),
		),
	'documents.fields.get.get': async (ctx, input) =>
		Documenso.documents.fields.get.get(
			ctx,
			DocumensoEndpointInputSchemas.fieldGetDocumentField.parse(input),
		),
	'documents.fields.create.post': async (ctx, input) =>
		Documenso.documents.fields.create.post(
			ctx,
			DocumensoEndpointInputSchemas.fieldCreateDocumentField.parse(input),
		),
	'documents.fields.createMany.post': async (ctx, input) =>
		Documenso.documents.fields.createMany.post(
			ctx,
			DocumensoEndpointInputSchemas.fieldCreateDocumentFields.parse(input),
		),
	'documents.fields.update.post': async (ctx, input) =>
		Documenso.documents.fields.update.post(
			ctx,
			DocumensoEndpointInputSchemas.fieldUpdateDocumentField.parse(input),
		),
	'documents.fields.updateMany.post': async (ctx, input) =>
		Documenso.documents.fields.updateMany.post(
			ctx,
			DocumensoEndpointInputSchemas.fieldUpdateDocumentFields.parse(input),
		),
	'documents.fields.delete.post': async (ctx, input) =>
		Documenso.documents.fields.delete.post(
			ctx,
			DocumensoEndpointInputSchemas.fieldDeleteDocumentField.parse(input),
		),
	'templates.fields.create.post': async (ctx, input) =>
		Documenso.templates.fields.create.post(
			ctx,
			DocumensoEndpointInputSchemas.fieldCreateTemplateField.parse(input),
		),
	'templates.fields.get.get': async (ctx, input) =>
		Documenso.templates.fields.get.get(
			ctx,
			DocumensoEndpointInputSchemas.fieldGetTemplateField.parse(input),
		),
	'templates.fields.createMany.post': async (ctx, input) =>
		Documenso.templates.fields.createMany.post(
			ctx,
			DocumensoEndpointInputSchemas.fieldCreateTemplateFields.parse(input),
		),
	'templates.fields.update.post': async (ctx, input) =>
		Documenso.templates.fields.update.post(
			ctx,
			DocumensoEndpointInputSchemas.fieldUpdateTemplateField.parse(input),
		),
	'templates.fields.updateMany.post': async (ctx, input) =>
		Documenso.templates.fields.updateMany.post(
			ctx,
			DocumensoEndpointInputSchemas.fieldUpdateTemplateFields.parse(input),
		),
	'templates.fields.delete.post': async (ctx, input) =>
		Documenso.templates.fields.delete.post(
			ctx,
			DocumensoEndpointInputSchemas.fieldDeleteTemplateField.parse(input),
		),
	'folders.find.get': async (ctx, input) =>
		Documenso.folders.find.get(
			ctx,
			DocumensoEndpointInputSchemas.folderFindFolders.parse(input),
		),
	'folders.create.post': async (ctx, input) =>
		Documenso.folders.create.post(
			ctx,
			DocumensoEndpointInputSchemas.folderCreateFolder.parse(input),
		),
	'folders.update.post': async (ctx, input) =>
		Documenso.folders.update.post(
			ctx,
			DocumensoEndpointInputSchemas.folderUpdateFolder.parse(input),
		),
	'folders.delete.post': async (ctx, input) =>
		Documenso.folders.delete.post(
			ctx,
			DocumensoEndpointInputSchemas.folderDeleteFolder.parse(input),
		),
	'documents.recipients.get.get': async (ctx, input) =>
		Documenso.documents.recipients.get.get(
			ctx,
			DocumensoEndpointInputSchemas.recipientGetDocumentRecipient.parse(input),
		),
	'documents.recipients.create.post': async (ctx, input) =>
		Documenso.documents.recipients.create.post(
			ctx,
			DocumensoEndpointInputSchemas.recipientCreateDocumentRecipient.parse(
				input,
			),
		),
	'documents.recipients.createMany.post': async (ctx, input) =>
		Documenso.documents.recipients.createMany.post(
			ctx,
			DocumensoEndpointInputSchemas.recipientCreateDocumentRecipients.parse(
				input,
			),
		),
	'documents.recipients.update.post': async (ctx, input) =>
		Documenso.documents.recipients.update.post(
			ctx,
			DocumensoEndpointInputSchemas.recipientUpdateDocumentRecipient.parse(
				input,
			),
		),
	'documents.recipients.updateMany.post': async (ctx, input) =>
		Documenso.documents.recipients.updateMany.post(
			ctx,
			DocumensoEndpointInputSchemas.recipientUpdateDocumentRecipients.parse(
				input,
			),
		),
	'documents.recipients.delete.post': async (ctx, input) =>
		Documenso.documents.recipients.delete.post(
			ctx,
			DocumensoEndpointInputSchemas.recipientDeleteDocumentRecipient.parse(
				input,
			),
		),
	'templates.recipients.get.get': async (ctx, input) =>
		Documenso.templates.recipients.get.get(
			ctx,
			DocumensoEndpointInputSchemas.recipientGetTemplateRecipient.parse(input),
		),
	'templates.recipients.create.post': async (ctx, input) =>
		Documenso.templates.recipients.create.post(
			ctx,
			DocumensoEndpointInputSchemas.recipientCreateTemplateRecipient.parse(
				input,
			),
		),
	'templates.recipients.createMany.post': async (ctx, input) =>
		Documenso.templates.recipients.createMany.post(
			ctx,
			DocumensoEndpointInputSchemas.recipientCreateTemplateRecipients.parse(
				input,
			),
		),
	'templates.recipients.update.post': async (ctx, input) =>
		Documenso.templates.recipients.update.post(
			ctx,
			DocumensoEndpointInputSchemas.recipientUpdateTemplateRecipient.parse(
				input,
			),
		),
	'templates.recipients.updateMany.post': async (ctx, input) =>
		Documenso.templates.recipients.updateMany.post(
			ctx,
			DocumensoEndpointInputSchemas.recipientUpdateTemplateRecipients.parse(
				input,
			),
		),
	'templates.recipients.delete.post': async (ctx, input) =>
		Documenso.templates.recipients.delete.post(
			ctx,
			DocumensoEndpointInputSchemas.recipientDeleteTemplateRecipient.parse(
				input,
			),
		),
	'templates.find.get': async (ctx, input) =>
		Documenso.templates.find.get(
			ctx,
			DocumensoEndpointInputSchemas.templateFindTemplates.parse(input),
		),
	'templates.get.get': async (ctx, input) =>
		Documenso.templates.get.get(
			ctx,
			DocumensoEndpointInputSchemas.templateGetTemplateById.parse(input),
		),
	'templates.getMany.post': async (ctx, input) =>
		Documenso.templates.getMany.post(
			ctx,
			DocumensoEndpointInputSchemas.templateGetMany.parse(input),
		),
	'templates.create.post': async (ctx, input) =>
		Documenso.templates.create.post(
			ctx,
			DocumensoEndpointInputSchemas.templateCreateTemplate.parse(input),
		),
	'templates.createTemplateTemporary.post': async (ctx, input) =>
		Documenso.templates.createTemplateTemporary.post(
			ctx,
			DocumensoEndpointInputSchemas.templateCreateTemplateTemporary.parse(
				input,
			),
		),
	'templates.update.post': async (ctx, input) =>
		Documenso.templates.update.post(
			ctx,
			DocumensoEndpointInputSchemas.templateUpdateTemplate.parse(input),
		),
	'templates.duplicate.post': async (ctx, input) =>
		Documenso.templates.duplicate.post(
			ctx,
			DocumensoEndpointInputSchemas.templateDuplicateTemplate.parse(input),
		),
	'templates.delete.post': async (ctx, input) =>
		Documenso.templates.delete.post(
			ctx,
			DocumensoEndpointInputSchemas.templateDeleteTemplate.parse(input),
		),
	'templates.use.post': async (ctx, input) =>
		Documenso.templates.use.post(
			ctx,
			DocumensoEndpointInputSchemas.templateCreateDocumentFromTemplate.parse(
				input,
			),
		),
	'templates.directLinks.create.post': async (ctx, input) =>
		Documenso.templates.directLinks.create.post(
			ctx,
			DocumensoEndpointInputSchemas.templateCreateTemplateDirectLink.parse(
				input,
			),
		),
	'templates.directLinks.delete.post': async (ctx, input) =>
		Documenso.templates.directLinks.delete.post(
			ctx,
			DocumensoEndpointInputSchemas.templateDeleteTemplateDirectLink.parse(
				input,
			),
		),
	'templates.directLinks.toggle.post': async (ctx, input) =>
		Documenso.templates.directLinks.toggle.post(
			ctx,
			DocumensoEndpointInputSchemas.templateToggleTemplateDirectLink.parse(
				input,
			),
		),
	'embedding.presignCreateEmbeddingPresignToken.post': async (ctx, input) =>
		Documenso.embedding.presignCreateEmbeddingPresignToken.post(
			ctx,
			DocumensoEndpointInputSchemas.embeddingPresignCreateEmbeddingPresignToken.parse(
				input,
			),
		),
	'embedding.presignVerifyEmbeddingPresignToken.post': async (ctx, input) =>
		Documenso.embedding.presignVerifyEmbeddingPresignToken.post(
			ctx,
			DocumensoEndpointInputSchemas.embeddingPresignVerifyEmbeddingPresignToken.parse(
				input,
			),
		),
};

export type {
	DocumensoEndpointInputs,
	DocumensoEndpointOutputs,
} from './types';
export {
	DocumensoEndpointInputSchemas,
	DocumensoEndpointOutputSchemas,
} from './types';
