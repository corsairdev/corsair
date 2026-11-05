import { createBorneoEndpoint } from './factory';

export const createLegalDocumentEntry = createBorneoEndpoint(
	'createLegalDocumentEntry',
	'BORNEO_CREATE_LEGAL_DOCUMENT_ENTRY',
	'borneo.documents.createLegalDocumentEntry',
);

export const deleteLegalDocumentById = createBorneoEndpoint(
	'deleteLegalDocumentById',
	'BORNEO_DELETE_LEGAL_DOCUMENT_BY_ID',
	'borneo.documents.deleteLegalDocumentById',
);

export const listDiscoveredDocument = createBorneoEndpoint(
	'listDiscoveredDocument',
	'BORNEO_LIST_DISCOVERED_DOCUMENT',
	'borneo.documents.listDiscoveredDocument',
);

export const listLegalDocumentsWithPagination = createBorneoEndpoint(
	'listLegalDocumentsWithPagination',
	'BORNEO_LIST_LEGAL_DOCUMENTS_WITH_PAGINATION',
	'borneo.documents.listLegalDocumentsWithPagination',
);

export const retrieveDiscoveredDocumentById = createBorneoEndpoint(
	'retrieveDiscoveredDocumentById',
	'BORNEO_RETRIEVE_DISCOVERED_DOCUMENT_BY_ID',
	'borneo.documents.retrieveDiscoveredDocumentById',
);

export const retrieveLegalDocumentById = createBorneoEndpoint(
	'retrieveLegalDocumentById',
	'BORNEO_RETRIEVE_LEGAL_DOCUMENT_BY_ID',
	'borneo.documents.retrieveLegalDocumentById',
);

export const updateDiscoveredDocumentStatus = createBorneoEndpoint(
	'updateDiscoveredDocumentStatus',
	'BORNEO_UPDATE_DISCOVERED_DOCUMENT_STATUS',
	'borneo.documents.updateDiscoveredDocumentStatus',
);
