import * as Documents from './documents';
import * as Structure from './structure';
import * as Tables from './tables';
import * as Text from './text';

export const DocumentsEndpoints = {
	createDocument: Documents.createDocument,
	createBlankDocument: Documents.createBlankDocument,
	createDocumentMarkdown: Documents.createDocumentMarkdown,
	copyDocument: Documents.copyDocument,
	getDocument: Documents.getDocument,
	getDocumentPlaintext: Documents.getDocumentPlaintext,
	updateDocumentMarkdown: Documents.updateDocumentMarkdown,
	updateDocumentSectionMarkdown: Documents.updateDocumentSectionMarkdown,
	updateDocumentStyle: Documents.updateDocumentStyle,
	updateExistingDocument: Documents.updateExistingDocument,
	updateDocumentBatch: Documents.updateDocumentBatch,
	exportDocumentAsPdf: Documents.exportDocumentAsPdf,
	searchDocuments: Documents.searchDocuments,
	listSpreadsheetCharts: Documents.listSpreadsheetCharts,
};

export const TextEndpoints = {
	insertText: Text.insertText,
	replaceAllText: Text.replaceAllText,
	deleteContentRange: Text.deleteContentRange,
	insertInlineImage: Text.insertInlineImage,
	replaceImage: Text.replaceImage,
	insertPageBreak: Text.insertPageBreak,
};

export const StructureEndpoints = {
	createHeader: Structure.createHeader,
	createFooter: Structure.createFooter,
	createFootnote: Structure.createFootnote,
	createNamedRange: Structure.createNamedRange,
	createParagraphBullets: Structure.createParagraphBullets,
	deleteParagraphBullets: Structure.deleteParagraphBullets,
	deleteHeader: Structure.deleteHeader,
	deleteFooter: Structure.deleteFooter,
	deleteNamedRange: Structure.deleteNamedRange,
};

export const TablesEndpoints = {
	insertTable: Tables.insertTable,
	insertTableColumn: Tables.insertTableColumn,
	deleteTableColumn: Tables.deleteTableColumn,
	deleteTableRow: Tables.deleteTableRow,
	unmergeTableCells: Tables.unmergeTableCells,
	updateTableRowStyle: Tables.updateTableRowStyle,
};

export * from './types';
