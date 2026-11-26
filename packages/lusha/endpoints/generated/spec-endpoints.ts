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
		input: Inputs.personProspectContacts,
		output: Outputs.personProspectContacts,
	},
	'company.prospectCompanies': {
		input: Inputs.companyProspectCompanies,
		output: Outputs.companyProspectCompanies,
	},
	'person.getContactLookalikes': {
		input: Inputs.personGetContactLookalikes,
		output: Outputs.personGetContactLookalikes,
	},
	'company.getCompanyLookalikes': {
		input: Inputs.companyGetCompanyLookalikes,
		output: Outputs.companyGetCompanyLookalikes,
	},
	'person.getContactRecommendations': {
		input: Inputs.personGetContactRecommendations,
		output: Outputs.personGetContactRecommendations,
	},
	'company.getCompanyRecommendations': {
		input: Inputs.companyGetCompanyRecommendations,
		output: Outputs.companyGetCompanyRecommendations,
	},
	'person.getContactRecommendationFilters': {
		input: Inputs.personGetContactRecommendationFilters,
		output: Outputs.personGetContactRecommendationFilters,
	},
	'company.getCompanyRecommendationFilters': {
		input: Inputs.companyGetCompanyRecommendationFilters,
		output: Outputs.companyGetCompanyRecommendationFilters,
	},
	'person.getBuyingGroup': {
		input: Inputs.personGetBuyingGroup,
		output: Outputs.personGetBuyingGroup,
	},
	'contactTables.create': {
		input: Inputs.contactTablesCreate,
		output: Outputs.contactTablesCreate,
	},
	'contactTables.list': {
		input: Inputs.contactTablesList,
		output: Outputs.contactTablesList,
	},
	'contactTables.getColumnCatalog': {
		input: Inputs.contactTablesGetColumnCatalog,
		output: Outputs.contactTablesGetColumnCatalog,
	},
	'contactTables.get': {
		input: Inputs.contactTablesGet,
		output: Outputs.contactTablesGet,
	},
	'contactTables.update': {
		input: Inputs.contactTablesUpdate,
		output: Outputs.contactTablesUpdate,
	},
	'contactTables.delete': {
		input: Inputs.contactTablesDelete,
		output: Outputs.contactTablesDelete,
	},
	'contactTables.listEntities': {
		input: Inputs.contactTablesListEntities,
		output: Outputs.contactTablesListEntities,
	},
	'contactTables.addEntities': {
		input: Inputs.contactTablesAddEntities,
		output: Outputs.contactTablesAddEntities,
	},
	'contactTables.removeEntities': {
		input: Inputs.contactTablesRemoveEntities,
		output: Outputs.contactTablesRemoveEntities,
	},
	'contactTables.listColumns': {
		input: Inputs.contactTablesListColumns,
		output: Outputs.contactTablesListColumns,
	},
	'contactTables.addColumns': {
		input: Inputs.contactTablesAddColumns,
		output: Outputs.contactTablesAddColumns,
	},
	'contactTables.removeColumn': {
		input: Inputs.contactTablesRemoveColumn,
		output: Outputs.contactTablesRemoveColumn,
	},
	'contactTables.runColumn': {
		input: Inputs.contactTablesRunColumn,
		output: Outputs.contactTablesRunColumn,
	},
	'companyTables.create': {
		input: Inputs.companyTablesCreate,
		output: Outputs.companyTablesCreate,
	},
	'companyTables.list': {
		input: Inputs.companyTablesList,
		output: Outputs.companyTablesList,
	},
	'companyTables.getColumnCatalog': {
		input: Inputs.companyTablesGetColumnCatalog,
		output: Outputs.companyTablesGetColumnCatalog,
	},
	'companyTables.get': {
		input: Inputs.companyTablesGet,
		output: Outputs.companyTablesGet,
	},
	'companyTables.update': {
		input: Inputs.companyTablesUpdate,
		output: Outputs.companyTablesUpdate,
	},
	'companyTables.delete': {
		input: Inputs.companyTablesDelete,
		output: Outputs.companyTablesDelete,
	},
	'companyTables.listEntities': {
		input: Inputs.companyTablesListEntities,
		output: Outputs.companyTablesListEntities,
	},
	'companyTables.addEntities': {
		input: Inputs.companyTablesAddEntities,
		output: Outputs.companyTablesAddEntities,
	},
	'companyTables.removeEntities': {
		input: Inputs.companyTablesRemoveEntities,
		output: Outputs.companyTablesRemoveEntities,
	},
	'companyTables.removeColumn': {
		input: Inputs.companyTablesRemoveColumn,
		output: Outputs.companyTablesRemoveColumn,
	},
	'companyTables.runColumn': {
		input: Inputs.companyTablesRunColumn,
		output: Outputs.companyTablesRunColumn,
	},
	'person.getContactSignals': {
		input: Inputs.personGetContactSignals,
		output: Outputs.personGetContactSignals,
	},
	'company.getCompanySignals': {
		input: Inputs.companyGetCompanySignals,
		output: Outputs.companyGetCompanySignals,
	},
	'person.getContactSignalTypes': {
		input: Inputs.personGetContactSignalTypes,
		output: Outputs.personGetContactSignalTypes,
	},
	'company.getCompanySignalTypes': {
		input: Inputs.companyGetCompanySignalTypes,
		output: Outputs.companyGetCompanySignalTypes,
	},
	'company.getCompanySignalFilters': {
		input: Inputs.companyGetCompanySignalFilters,
		output: Outputs.companyGetCompanySignalFilters,
	},
	'company.getCompanySignalFilterValues': {
		input: Inputs.companyGetCompanySignalFilterValues,
		output: Outputs.companyGetCompanySignalFilterValues,
	},
	'company.getCompanySignalScores': {
		input: Inputs.companyGetCompanySignalScores,
		output: Outputs.companyGetCompanySignalScores,
	},
	'person.getContactSignalScores': {
		input: Inputs.personGetContactSignalScores,
		output: Outputs.personGetContactSignalScores,
	},
	'icp.listProfiles': {
		input: Inputs.icpListProfiles,
		output: Outputs.icpListProfiles,
	},
	'company.getCompanyIcpFitScores': {
		input: Inputs.companyGetCompanyIcpFitScores,
		output: Outputs.companyGetCompanyIcpFitScores,
	},
	'person.getContactIcpFitScores': {
		input: Inputs.personGetContactIcpFitScores,
		output: Outputs.personGetContactIcpFitScores,
	},
	'company.getWebsiteVisits': {
		input: Inputs.companyGetWebsiteVisits,
		output: Outputs.companyGetWebsiteVisits,
	},
	'person.getContactFilterTypes': {
		input: Inputs.personGetContactFilterTypes,
		output: Outputs.personGetContactFilterTypes,
	},
	'person.getContactFilterValues': {
		input: Inputs.personGetContactFilterValues,
		output: Outputs.personGetContactFilterValues,
	},
	'company.getCompanyFilterTypes': {
		input: Inputs.companyGetCompanyFilterTypes,
		output: Outputs.companyGetCompanyFilterTypes,
	},
	'company.getCompanyFilterValues': {
		input: Inputs.companyGetCompanyFilterValues,
		output: Outputs.companyGetCompanyFilterValues,
	},
	'subscriptions.create': {
		input: Inputs.subscriptionsCreate,
		output: Outputs.subscriptionsCreate,
	},
	'subscriptions.list': {
		input: Inputs.subscriptionsList,
		output: Outputs.subscriptionsList,
	},
	'subscriptions.get': {
		input: Inputs.subscriptionsGet,
		output: Outputs.subscriptionsGet,
	},
	'subscriptions.update': {
		input: Inputs.subscriptionsUpdate,
		output: Outputs.subscriptionsUpdate,
	},
	'subscriptions.test': {
		input: Inputs.subscriptionsTest,
		output: Outputs.subscriptionsTest,
	},
	'subscriptions.delete': {
		input: Inputs.subscriptionsDelete,
		output: Outputs.subscriptionsDelete,
	},
	'auditLogs.list': {
		input: Inputs.auditLogsList,
		output: Outputs.auditLogsList,
	},
	'auditLogs.getStats': {
		input: Inputs.auditLogsGetStats,
		output: Outputs.auditLogsGetStats,
	},
	'subscriptions.createOptOut': {
		input: Inputs.subscriptionsCreateOptOut,
		output: Outputs.subscriptionsCreateOptOut,
	},
	'conversations.search': {
		input: Inputs.conversationsSearch,
		output: Outputs.conversationsSearch,
	},
	'conversations.getTranscript': {
		input: Inputs.conversationsGetTranscript,
		output: Outputs.conversationsGetTranscript,
	},
} as const;
