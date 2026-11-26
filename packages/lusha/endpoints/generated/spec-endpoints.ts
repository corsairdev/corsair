// Generated with spec-schemas.ts: the generated operations by group.
import { specEndpoint } from '../spec';
import {
	LushaSpecInputSchemas as Inputs,
	LushaSpecOutputSchemas as Outputs,
} from './spec-schemas';

export const LushaSpecEndpoints = {
	person: {
		prospectContacts: specEndpoint('personProspectContacts'),
		getContactLookalikes: specEndpoint('personGetContactLookalikes'),
		getContactRecommendations: specEndpoint('personGetContactRecommendations'),
		getContactRecommendationFilters: specEndpoint(
			'personGetContactRecommendationFilters',
		),
		getBuyingGroup: specEndpoint('personGetBuyingGroup'),
		getContactSignals: specEndpoint('personGetContactSignals'),
		getContactSignalTypes: specEndpoint('personGetContactSignalTypes'),
		getContactSignalScores: specEndpoint('personGetContactSignalScores'),
		getContactIcpFitScores: specEndpoint('personGetContactIcpFitScores'),
		getContactFilterTypes: specEndpoint('personGetContactFilterTypes'),
		getContactFilterValues: specEndpoint('personGetContactFilterValues'),
	},
	company: {
		prospectCompanies: specEndpoint('companyProspectCompanies'),
		getCompanyLookalikes: specEndpoint('companyGetCompanyLookalikes'),
		getCompanyRecommendations: specEndpoint('companyGetCompanyRecommendations'),
		getCompanyRecommendationFilters: specEndpoint(
			'companyGetCompanyRecommendationFilters',
		),
		getCompanySignals: specEndpoint('companyGetCompanySignals'),
		getCompanySignalTypes: specEndpoint('companyGetCompanySignalTypes'),
		getCompanySignalFilters: specEndpoint('companyGetCompanySignalFilters'),
		getCompanySignalFilterValues: specEndpoint(
			'companyGetCompanySignalFilterValues',
		),
		getCompanySignalScores: specEndpoint('companyGetCompanySignalScores'),
		getCompanyIcpFitScores: specEndpoint('companyGetCompanyIcpFitScores'),
		getWebsiteVisits: specEndpoint('companyGetWebsiteVisits'),
		getCompanyFilterTypes: specEndpoint('companyGetCompanyFilterTypes'),
		getCompanyFilterValues: specEndpoint('companyGetCompanyFilterValues'),
	},
	contactTables: {
		create: specEndpoint('contactTablesCreate'),
		list: specEndpoint('contactTablesList'),
		getColumnCatalog: specEndpoint('contactTablesGetColumnCatalog'),
		get: specEndpoint('contactTablesGet'),
		update: specEndpoint('contactTablesUpdate'),
		delete: specEndpoint('contactTablesDelete'),
		listEntities: specEndpoint('contactTablesListEntities'),
		addEntities: specEndpoint('contactTablesAddEntities'),
		removeEntities: specEndpoint('contactTablesRemoveEntities'),
		listColumns: specEndpoint('contactTablesListColumns'),
		addColumns: specEndpoint('contactTablesAddColumns'),
		removeColumn: specEndpoint('contactTablesRemoveColumn'),
		runColumn: specEndpoint('contactTablesRunColumn'),
	},
	companyTables: {
		create: specEndpoint('companyTablesCreate'),
		list: specEndpoint('companyTablesList'),
		getColumnCatalog: specEndpoint('companyTablesGetColumnCatalog'),
		get: specEndpoint('companyTablesGet'),
		update: specEndpoint('companyTablesUpdate'),
		delete: specEndpoint('companyTablesDelete'),
		listEntities: specEndpoint('companyTablesListEntities'),
		addEntities: specEndpoint('companyTablesAddEntities'),
		removeEntities: specEndpoint('companyTablesRemoveEntities'),
		removeColumn: specEndpoint('companyTablesRemoveColumn'),
		runColumn: specEndpoint('companyTablesRunColumn'),
	},
	icp: {
		listProfiles: specEndpoint('icpListProfiles'),
	},
	subscriptions: {
		create: specEndpoint('subscriptionsCreate'),
		list: specEndpoint('subscriptionsList'),
		get: specEndpoint('subscriptionsGet'),
		update: specEndpoint('subscriptionsUpdate'),
		test: specEndpoint('subscriptionsTest'),
		delete: specEndpoint('subscriptionsDelete'),
		createOptOut: specEndpoint('subscriptionsCreateOptOut'),
	},
	auditLogs: {
		list: specEndpoint('auditLogsList'),
		getStats: specEndpoint('auditLogsGetStats'),
	},
	conversations: {
		search: specEndpoint('conversationsSearch'),
		getTranscript: specEndpoint('conversationsGetTranscript'),
	},
} as const;

export const lushaSpecEndpointSchemas = {
	'person.prospectContacts': {
		get input() {
			return Inputs.personProspectContacts;
		},
		get output() {
			return Outputs.personProspectContacts;
		},
	},
	'company.prospectCompanies': {
		get input() {
			return Inputs.companyProspectCompanies;
		},
		get output() {
			return Outputs.companyProspectCompanies;
		},
	},
	'person.getContactLookalikes': {
		get input() {
			return Inputs.personGetContactLookalikes;
		},
		get output() {
			return Outputs.personGetContactLookalikes;
		},
	},
	'company.getCompanyLookalikes': {
		get input() {
			return Inputs.companyGetCompanyLookalikes;
		},
		get output() {
			return Outputs.companyGetCompanyLookalikes;
		},
	},
	'person.getContactRecommendations': {
		get input() {
			return Inputs.personGetContactRecommendations;
		},
		get output() {
			return Outputs.personGetContactRecommendations;
		},
	},
	'company.getCompanyRecommendations': {
		get input() {
			return Inputs.companyGetCompanyRecommendations;
		},
		get output() {
			return Outputs.companyGetCompanyRecommendations;
		},
	},
	'person.getContactRecommendationFilters': {
		get input() {
			return Inputs.personGetContactRecommendationFilters;
		},
		get output() {
			return Outputs.personGetContactRecommendationFilters;
		},
	},
	'company.getCompanyRecommendationFilters': {
		get input() {
			return Inputs.companyGetCompanyRecommendationFilters;
		},
		get output() {
			return Outputs.companyGetCompanyRecommendationFilters;
		},
	},
	'person.getBuyingGroup': {
		get input() {
			return Inputs.personGetBuyingGroup;
		},
		get output() {
			return Outputs.personGetBuyingGroup;
		},
	},
	'contactTables.create': {
		get input() {
			return Inputs.contactTablesCreate;
		},
		get output() {
			return Outputs.contactTablesCreate;
		},
	},
	'contactTables.list': {
		get input() {
			return Inputs.contactTablesList;
		},
		get output() {
			return Outputs.contactTablesList;
		},
	},
	'contactTables.getColumnCatalog': {
		get input() {
			return Inputs.contactTablesGetColumnCatalog;
		},
		get output() {
			return Outputs.contactTablesGetColumnCatalog;
		},
	},
	'contactTables.get': {
		get input() {
			return Inputs.contactTablesGet;
		},
		get output() {
			return Outputs.contactTablesGet;
		},
	},
	'contactTables.update': {
		get input() {
			return Inputs.contactTablesUpdate;
		},
		get output() {
			return Outputs.contactTablesUpdate;
		},
	},
	'contactTables.delete': {
		get input() {
			return Inputs.contactTablesDelete;
		},
		get output() {
			return Outputs.contactTablesDelete;
		},
	},
	'contactTables.listEntities': {
		get input() {
			return Inputs.contactTablesListEntities;
		},
		get output() {
			return Outputs.contactTablesListEntities;
		},
	},
	'contactTables.addEntities': {
		get input() {
			return Inputs.contactTablesAddEntities;
		},
		get output() {
			return Outputs.contactTablesAddEntities;
		},
	},
	'contactTables.removeEntities': {
		get input() {
			return Inputs.contactTablesRemoveEntities;
		},
		get output() {
			return Outputs.contactTablesRemoveEntities;
		},
	},
	'contactTables.listColumns': {
		get input() {
			return Inputs.contactTablesListColumns;
		},
		get output() {
			return Outputs.contactTablesListColumns;
		},
	},
	'contactTables.addColumns': {
		get input() {
			return Inputs.contactTablesAddColumns;
		},
		get output() {
			return Outputs.contactTablesAddColumns;
		},
	},
	'contactTables.removeColumn': {
		get input() {
			return Inputs.contactTablesRemoveColumn;
		},
		get output() {
			return Outputs.contactTablesRemoveColumn;
		},
	},
	'contactTables.runColumn': {
		get input() {
			return Inputs.contactTablesRunColumn;
		},
		get output() {
			return Outputs.contactTablesRunColumn;
		},
	},
	'companyTables.create': {
		get input() {
			return Inputs.companyTablesCreate;
		},
		get output() {
			return Outputs.companyTablesCreate;
		},
	},
	'companyTables.list': {
		get input() {
			return Inputs.companyTablesList;
		},
		get output() {
			return Outputs.companyTablesList;
		},
	},
	'companyTables.getColumnCatalog': {
		get input() {
			return Inputs.companyTablesGetColumnCatalog;
		},
		get output() {
			return Outputs.companyTablesGetColumnCatalog;
		},
	},
	'companyTables.get': {
		get input() {
			return Inputs.companyTablesGet;
		},
		get output() {
			return Outputs.companyTablesGet;
		},
	},
	'companyTables.update': {
		get input() {
			return Inputs.companyTablesUpdate;
		},
		get output() {
			return Outputs.companyTablesUpdate;
		},
	},
	'companyTables.delete': {
		get input() {
			return Inputs.companyTablesDelete;
		},
		get output() {
			return Outputs.companyTablesDelete;
		},
	},
	'companyTables.listEntities': {
		get input() {
			return Inputs.companyTablesListEntities;
		},
		get output() {
			return Outputs.companyTablesListEntities;
		},
	},
	'companyTables.addEntities': {
		get input() {
			return Inputs.companyTablesAddEntities;
		},
		get output() {
			return Outputs.companyTablesAddEntities;
		},
	},
	'companyTables.removeEntities': {
		get input() {
			return Inputs.companyTablesRemoveEntities;
		},
		get output() {
			return Outputs.companyTablesRemoveEntities;
		},
	},
	'companyTables.removeColumn': {
		get input() {
			return Inputs.companyTablesRemoveColumn;
		},
		get output() {
			return Outputs.companyTablesRemoveColumn;
		},
	},
	'companyTables.runColumn': {
		get input() {
			return Inputs.companyTablesRunColumn;
		},
		get output() {
			return Outputs.companyTablesRunColumn;
		},
	},
	'person.getContactSignals': {
		get input() {
			return Inputs.personGetContactSignals;
		},
		get output() {
			return Outputs.personGetContactSignals;
		},
	},
	'company.getCompanySignals': {
		get input() {
			return Inputs.companyGetCompanySignals;
		},
		get output() {
			return Outputs.companyGetCompanySignals;
		},
	},
	'person.getContactSignalTypes': {
		get input() {
			return Inputs.personGetContactSignalTypes;
		},
		get output() {
			return Outputs.personGetContactSignalTypes;
		},
	},
	'company.getCompanySignalTypes': {
		get input() {
			return Inputs.companyGetCompanySignalTypes;
		},
		get output() {
			return Outputs.companyGetCompanySignalTypes;
		},
	},
	'company.getCompanySignalFilters': {
		get input() {
			return Inputs.companyGetCompanySignalFilters;
		},
		get output() {
			return Outputs.companyGetCompanySignalFilters;
		},
	},
	'company.getCompanySignalFilterValues': {
		get input() {
			return Inputs.companyGetCompanySignalFilterValues;
		},
		get output() {
			return Outputs.companyGetCompanySignalFilterValues;
		},
	},
	'company.getCompanySignalScores': {
		get input() {
			return Inputs.companyGetCompanySignalScores;
		},
		get output() {
			return Outputs.companyGetCompanySignalScores;
		},
	},
	'person.getContactSignalScores': {
		get input() {
			return Inputs.personGetContactSignalScores;
		},
		get output() {
			return Outputs.personGetContactSignalScores;
		},
	},
	'icp.listProfiles': {
		get input() {
			return Inputs.icpListProfiles;
		},
		get output() {
			return Outputs.icpListProfiles;
		},
	},
	'company.getCompanyIcpFitScores': {
		get input() {
			return Inputs.companyGetCompanyIcpFitScores;
		},
		get output() {
			return Outputs.companyGetCompanyIcpFitScores;
		},
	},
	'person.getContactIcpFitScores': {
		get input() {
			return Inputs.personGetContactIcpFitScores;
		},
		get output() {
			return Outputs.personGetContactIcpFitScores;
		},
	},
	'company.getWebsiteVisits': {
		get input() {
			return Inputs.companyGetWebsiteVisits;
		},
		get output() {
			return Outputs.companyGetWebsiteVisits;
		},
	},
	'person.getContactFilterTypes': {
		get input() {
			return Inputs.personGetContactFilterTypes;
		},
		get output() {
			return Outputs.personGetContactFilterTypes;
		},
	},
	'person.getContactFilterValues': {
		get input() {
			return Inputs.personGetContactFilterValues;
		},
		get output() {
			return Outputs.personGetContactFilterValues;
		},
	},
	'company.getCompanyFilterTypes': {
		get input() {
			return Inputs.companyGetCompanyFilterTypes;
		},
		get output() {
			return Outputs.companyGetCompanyFilterTypes;
		},
	},
	'company.getCompanyFilterValues': {
		get input() {
			return Inputs.companyGetCompanyFilterValues;
		},
		get output() {
			return Outputs.companyGetCompanyFilterValues;
		},
	},
	'subscriptions.create': {
		get input() {
			return Inputs.subscriptionsCreate;
		},
		get output() {
			return Outputs.subscriptionsCreate;
		},
	},
	'subscriptions.list': {
		get input() {
			return Inputs.subscriptionsList;
		},
		get output() {
			return Outputs.subscriptionsList;
		},
	},
	'subscriptions.get': {
		get input() {
			return Inputs.subscriptionsGet;
		},
		get output() {
			return Outputs.subscriptionsGet;
		},
	},
	'subscriptions.update': {
		get input() {
			return Inputs.subscriptionsUpdate;
		},
		get output() {
			return Outputs.subscriptionsUpdate;
		},
	},
	'subscriptions.test': {
		get input() {
			return Inputs.subscriptionsTest;
		},
		get output() {
			return Outputs.subscriptionsTest;
		},
	},
	'subscriptions.delete': {
		get input() {
			return Inputs.subscriptionsDelete;
		},
		get output() {
			return Outputs.subscriptionsDelete;
		},
	},
	'auditLogs.list': {
		get input() {
			return Inputs.auditLogsList;
		},
		get output() {
			return Outputs.auditLogsList;
		},
	},
	'auditLogs.getStats': {
		get input() {
			return Inputs.auditLogsGetStats;
		},
		get output() {
			return Outputs.auditLogsGetStats;
		},
	},
	'subscriptions.createOptOut': {
		get input() {
			return Inputs.subscriptionsCreateOptOut;
		},
		get output() {
			return Outputs.subscriptionsCreateOptOut;
		},
	},
	'conversations.search': {
		get input() {
			return Inputs.conversationsSearch;
		},
		get output() {
			return Outputs.conversationsSearch;
		},
	},
	'conversations.getTranscript': {
		get input() {
			return Inputs.conversationsGetTranscript;
		},
		get output() {
			return Outputs.conversationsGetTranscript;
		},
	},
} as const;
