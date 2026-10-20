import * as Agents from './agents';
import * as Analytics from './analytics';
import * as DocumentTypes from './document-types';
import * as Documents from './documents';
import * as Folders from './folders';
import * as Tables from './tables';
import * as User from './user';

export const TablesEndpoints = {
	addRow: Tables.addRow,
	delete: Tables.deleteTable,
	getData: Tables.getData,
};

export const FoldersEndpoints = {
	create: Folders.create,
};

export const DocumentTypesEndpoints = {
	getEnabled: DocumentTypes.getEnabled,
	listEnabled: DocumentTypes.listEnabled,
};

export const DocumentsEndpoints = {
	listAll: Documents.listAll,
};

export const UserEndpoints = {
	getDocumentTypes: User.getDocumentTypes,
};

export const AgentsEndpoints = {
	listExternal: Agents.listExternal,
	listCases: Agents.listCases,
};

export const AnalyticsEndpoints = {
	mcaAnalysis: Analytics.mcaAnalysis,
};

export * from './types';
