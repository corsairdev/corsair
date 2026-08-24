import * as Documents from './documents';
import * as Templates from './templates';
import * as Types from './types';

export const Template = {
	listTemplateCards: Templates.listTemplateCards,
	getTemplate: Templates.getTemplate,
	createTemplate: Templates.createTemplate,
	updateTemplate: Templates.updateTemplate,
	deleteTemplate: Templates.deleteTemplate,
};

export const Document = {
	createDocument: Documents.createDocument,
	createDocumentSync: Documents.createDocumentSync,
	getDocumentCard: Documents.getDocumentCard,
	listDocumentCards: Documents.listDocumentCards,
	getDocument: Documents.getDocument,
	updateDocument: Documents.updateDocument,
	deleteDocument: Documents.deleteDocument,
};

export * from './types';
