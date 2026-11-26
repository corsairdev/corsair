// Generated with spec-schemas.ts: one route per operation the hand-written
// endpoints do not cover. See endpoints/spec.ts for the request builder.

export const LUSHA_SPEC_ROUTES = {
	personProspectContacts: {
		op: 'person.prospectContacts',
		method: 'POST',
		path: '/v3/contacts/prospecting',
		body: ['pagination', 'filters', 'tableId', 'options'],
	},
	companyProspectCompanies: {
		op: 'company.prospectCompanies',
		method: 'POST',
		path: '/v3/companies/prospecting',
		body: ['pagination', 'filters', 'tableId', 'options'],
	},
	personGetContactLookalikes: {
		op: 'person.getContactLookalikes',
		method: 'POST',
		path: '/v3/contacts/lookalike',
		body: ['dedupeSessionId', 'seeds', 'exclude', 'limit', 'tableId'],
	},
	companyGetCompanyLookalikes: {
		op: 'company.getCompanyLookalikes',
		method: 'POST',
		path: '/v3/companies/lookalike',
		body: ['dedupeSessionId', 'seeds', 'exclude', 'limit', 'tableId'],
	},
	personGetContactRecommendations: {
		op: 'person.getContactRecommendations',
		method: 'POST',
		path: '/v3/contacts/recommendations',
		body: ['pagination', 'sort', 'filters'],
	},
	companyGetCompanyRecommendations: {
		op: 'company.getCompanyRecommendations',
		method: 'POST',
		path: '/v3/companies/recommendations',
		body: ['pagination', 'sort', 'filters'],
	},
	personGetContactRecommendationFilters: {
		op: 'person.getContactRecommendationFilters',
		method: 'GET',
		path: '/v3/contacts/recommendations/filters',
		replayable: true,
	},
	companyGetCompanyRecommendationFilters: {
		op: 'company.getCompanyRecommendationFilters',
		method: 'GET',
		path: '/v3/companies/recommendations/filters',
		replayable: true,
	},
	personGetBuyingGroup: {
		op: 'person.getBuyingGroup',
		method: 'POST',
		path: '/v3/contacts/buying-group',
		body: ['companies', 'personas', 'contactsLimit', 'pagination'],
	},
	contactTablesCreate: {
		op: 'contactTables.create',
		method: 'POST',
		path: '/v3/contacts/tables',
		body: ['name', 'visibility', 'owner', 'ids'],
	},
	contactTablesList: {
		op: 'contactTables.list',
		method: 'POST',
		path: '/v3/contacts/tables/list',
		body: ['owner', 'page', 'size', 'name', 'status'],
		replayable: true,
	},
	contactTablesGetColumnCatalog: {
		op: 'contactTables.getColumnCatalog',
		method: 'GET',
		path: '/v3/contacts/tables/columns',
		replayable: true,
	},
	contactTablesGet: {
		op: 'contactTables.get',
		method: 'GET',
		path: '/v3/contacts/tables/{table_id}',
		pathParams: { table_id: 'tableId' },
		query: { ownerEmail: 'email' },
		replayable: true,
	},
	contactTablesUpdate: {
		op: 'contactTables.update',
		method: 'PATCH',
		path: '/v3/contacts/tables/{table_id}',
		pathParams: { table_id: 'tableId' },
		body: ['name', 'visibility', 'archived', 'owner'],
	},
	contactTablesDelete: {
		op: 'contactTables.delete',
		method: 'DELETE',
		path: '/v3/contacts/tables/{table_id}',
		pathParams: { table_id: 'tableId' },
		query: { ownerEmail: 'email' },
	},
	contactTablesListEntities: {
		op: 'contactTables.listEntities',
		method: 'GET',
		path: '/v3/contacts/tables/{table_id}/entities',
		pathParams: { table_id: 'tableId' },
		query: { ownerEmail: 'email', page: 'page', size: 'size' },
	},
	contactTablesAddEntities: {
		op: 'contactTables.addEntities',
		method: 'POST',
		path: '/v3/contacts/tables/{table_id}/entities',
		pathParams: { table_id: 'tableId' },
		body: ['entityIds', 'companyIds', 'owner'],
	},
	contactTablesRemoveEntities: {
		op: 'contactTables.removeEntities',
		method: 'DELETE',
		path: '/v3/contacts/tables/{table_id}/entities',
		pathParams: { table_id: 'tableId' },
		body: ['entityIds', 'owner'],
	},
	contactTablesListColumns: {
		op: 'contactTables.listColumns',
		method: 'GET',
		path: '/v3/contacts/tables/{table_id}/columns',
		pathParams: { table_id: 'tableId' },
		query: { ownerEmail: 'email' },
		replayable: true,
	},
	contactTablesAddColumns: {
		op: 'contactTables.addColumns',
		method: 'POST',
		path: '/v3/contacts/tables/{table_id}/columns',
		pathParams: { table_id: 'tableId' },
		body: ['columns', 'columnKey', 'owner'],
	},
	contactTablesRemoveColumn: {
		op: 'contactTables.removeColumn',
		method: 'DELETE',
		path: '/v3/contacts/tables/{table_id}/columns/{column_id}',
		pathParams: { table_id: 'tableId', column_id: 'columnId' },
		query: { ownerEmail: 'email' },
	},
	contactTablesRunColumn: {
		op: 'contactTables.runColumn',
		method: 'POST',
		path: '/v3/contacts/tables/{table_id}/columns/{column_id}/run',
		pathParams: { table_id: 'tableId', column_id: 'columnId' },
		body: ['runScope', 'entityIds', 'owner'],
	},
	companyTablesCreate: {
		op: 'companyTables.create',
		method: 'POST',
		path: '/v3/companies/tables',
		body: ['name', 'visibility', 'owner', 'ids'],
	},
	companyTablesList: {
		op: 'companyTables.list',
		method: 'POST',
		path: '/v3/companies/tables/list',
		body: ['owner', 'page', 'size', 'name', 'status'],
		replayable: true,
	},
	companyTablesGetColumnCatalog: {
		op: 'companyTables.getColumnCatalog',
		method: 'GET',
		path: '/v3/companies/tables/columns',
		replayable: true,
	},
	companyTablesGet: {
		op: 'companyTables.get',
		method: 'GET',
		path: '/v3/companies/tables/{table_id}',
		pathParams: { table_id: 'tableId' },
		query: { ownerEmail: 'email' },
		replayable: true,
	},
	companyTablesUpdate: {
		op: 'companyTables.update',
		method: 'PATCH',
		path: '/v3/companies/tables/{table_id}',
		pathParams: { table_id: 'tableId' },
		body: ['name', 'visibility', 'archived', 'owner'],
	},
	companyTablesDelete: {
		op: 'companyTables.delete',
		method: 'DELETE',
		path: '/v3/companies/tables/{table_id}',
		pathParams: { table_id: 'tableId' },
		query: { ownerEmail: 'email' },
	},
	companyTablesListEntities: {
		op: 'companyTables.listEntities',
		method: 'GET',
		path: '/v3/companies/tables/{table_id}/entities',
		pathParams: { table_id: 'tableId' },
		query: { ownerEmail: 'email', page: 'page', size: 'size' },
	},
	companyTablesAddEntities: {
		op: 'companyTables.addEntities',
		method: 'POST',
		path: '/v3/companies/tables/{table_id}/entities',
		pathParams: { table_id: 'tableId' },
		body: ['entityIds', 'companyIds', 'owner'],
	},
	companyTablesRemoveEntities: {
		op: 'companyTables.removeEntities',
		method: 'DELETE',
		path: '/v3/companies/tables/{table_id}/entities',
		pathParams: { table_id: 'tableId' },
		body: ['entityIds', 'owner'],
	},
	companyTablesRemoveColumn: {
		op: 'companyTables.removeColumn',
		method: 'DELETE',
		path: '/v3/companies/tables/{table_id}/columns/{column_id}',
		pathParams: { table_id: 'tableId', column_id: 'columnId' },
		query: { ownerEmail: 'email' },
	},
	companyTablesRunColumn: {
		op: 'companyTables.runColumn',
		method: 'POST',
		path: '/v3/companies/tables/{table_id}/columns/{column_id}/run',
		pathParams: { table_id: 'tableId', column_id: 'columnId' },
		body: ['runScope', 'entityIds', 'owner'],
	},
	personGetContactSignals: {
		op: 'person.getContactSignals',
		method: 'POST',
		path: '/v3/contacts/signals',
		body: ['ids', 'signalTypes', 'startDate', 'maxResultsPerSignal', 'tableId'],
	},
	companyGetCompanySignals: {
		op: 'company.getCompanySignals',
		method: 'POST',
		path: '/v3/companies/signals',
		body: [
			'ids',
			'signalTypes',
			'startDate',
			'maxResultsPerSignal',
			'tableId',
			'filters',
		],
	},
	personGetContactSignalTypes: {
		op: 'person.getContactSignalTypes',
		method: 'GET',
		path: '/v3/contacts/signals/types',
		replayable: true,
	},
	companyGetCompanySignalTypes: {
		op: 'company.getCompanySignalTypes',
		method: 'GET',
		path: '/v3/companies/signals/types',
		replayable: true,
	},
	companyGetCompanySignalFilters: {
		op: 'company.getCompanySignalFilters',
		method: 'GET',
		path: '/v3/companies/signals/filters',
		replayable: true,
	},
	companyGetCompanySignalFilterValues: {
		op: 'company.getCompanySignalFilterValues',
		method: 'GET',
		path: '/v3/companies/signals/filters/{filterType}',
		pathParams: { filterType: 'filterType' },
		query: { query: 'query' },
		replayable: true,
	},
	companyGetCompanySignalScores: {
		op: 'company.getCompanySignalScores',
		method: 'POST',
		path: '/v3/companies/signal-score',
		body: ['companies'],
	},
	personGetContactSignalScores: {
		op: 'person.getContactSignalScores',
		method: 'POST',
		path: '/v3/contacts/signal-score',
		body: ['contacts'],
	},
	icpListProfiles: {
		op: 'icp.listProfiles',
		method: 'GET',
		path: '/v3/icp/profiles',
		query: { status: 'status', access: 'access' },
		replayable: true,
	},
	companyGetCompanyIcpFitScores: {
		op: 'company.getCompanyIcpFitScores',
		method: 'POST',
		path: '/v3/companies/icp-fit-score',
		body: ['targetProfileIds', 'companies'],
	},
	personGetContactIcpFitScores: {
		op: 'person.getContactIcpFitScores',
		method: 'POST',
		path: '/v3/contacts/icp-fit-score',
		body: ['targetProfileIds', 'contacts'],
	},
	companyGetWebsiteVisits: {
		op: 'company.getWebsiteVisits',
		method: 'POST',
		path: '/v3/companies/website-visits',
		body: ['domains', 'startDate', 'endDate', 'pagination', 'sort', 'filters'],
	},
	personGetContactFilterTypes: {
		op: 'person.getContactFilterTypes',
		method: 'GET',
		path: '/v3/contacts/prospecting/filters',
		replayable: true,
	},
	personGetContactFilterValues: {
		op: 'person.getContactFilterValues',
		method: 'GET',
		path: '/v3/contacts/prospecting/filters/{filterType}',
		pathParams: { filterType: 'filterType' },
		query: { query: 'query' },
		replayable: true,
	},
	companyGetCompanyFilterTypes: {
		op: 'company.getCompanyFilterTypes',
		method: 'GET',
		path: '/v3/companies/prospecting/filters',
		replayable: true,
	},
	companyGetCompanyFilterValues: {
		op: 'company.getCompanyFilterValues',
		method: 'GET',
		path: '/v3/companies/prospecting/filters/{filterType}',
		pathParams: { filterType: 'filterType' },
		query: { query: 'query' },
		replayable: true,
	},
	subscriptionsCreate: {
		op: 'subscriptions.create',
		method: 'POST',
		path: '/api/subscriptions',
		body: ['defaults', 'name', 'subscriptions'],
	},
	subscriptionsList: {
		op: 'subscriptions.list',
		method: 'GET',
		path: '/api/subscriptions',
		query: { limit: 'limit', offset: 'offset' },
		replayable: true,
	},
	subscriptionsGet: {
		op: 'subscriptions.get',
		method: 'GET',
		path: '/api/subscriptions/{id}',
		pathParams: { id: 'id' },
		replayable: true,
	},
	subscriptionsUpdate: {
		op: 'subscriptions.update',
		method: 'PATCH',
		path: '/api/subscriptions/{id}',
		pathParams: { id: 'id' },
		body: ['signalTypes', 'url', 'name', 'isActive'],
	},
	subscriptionsTest: {
		op: 'subscriptions.test',
		method: 'POST',
		path: '/api/subscriptions/{id}/test',
		pathParams: { id: 'id' },
		query: { mode: 'mode' },
	},
	subscriptionsDelete: {
		op: 'subscriptions.delete',
		method: 'POST',
		path: '/api/subscriptions/delete',
		body: ['ids'],
	},
	auditLogsList: {
		op: 'auditLogs.list',
		method: 'GET',
		path: '/api/audit-logs',
		query: {
			subscriptionId: 'subscriptionId',
			status: 'status',
			limit: 'limit',
			offset: 'offset',
		},
		replayable: true,
	},
	auditLogsGetStats: {
		op: 'auditLogs.getStats',
		method: 'GET',
		path: '/api/audit-logs/stats',
		query: { subscriptionId: 'subscriptionId' },
		replayable: true,
	},
	subscriptionsCreateOptOut: {
		op: 'subscriptions.createOptOut',
		method: 'POST',
		path: '/api/subscriptions/opt-out',
		body: ['entityType', 'url', 'name'],
	},
	conversationsSearch: {
		op: 'conversations.search',
		method: 'POST',
		path: '/v3/account/conversations/search',
		body: [
			'query',
			'conversationIds',
			'dateFrom',
			'dateTo',
			'contactNames',
			'companyDomains',
			'meetingTitles',
			'page',
			'pageSize',
		],
	},
	conversationsGetTranscript: {
		op: 'conversations.getTranscript',
		method: 'GET',
		path: '/v3/account/conversations/{conversationId}/transcript',
		pathParams: { conversationId: 'conversationId' },
	},
} as const;

export const LUSHA_SPEC_META = {
	'person.prospectContacts': {
		riskLevel: 'destructive',
		description:
			"Prospecting Contacts. Search for contacts that match your Ideal Customer Profile using rich filter criteria. Billing: Charged per result via 'api_search'. If signals are requested, an additional charge applies per matched signal per result.",
	},
	'company.prospectCompanies': {
		riskLevel: 'destructive',
		description:
			"Prospecting Companies. Search for companies that match your target market using rich filter criteria. Billing: Charged per result via 'api_search'. If signals are requested, an additional charge applies per matched signal per result.",
	},
	'person.getContactLookalikes': {
		riskLevel: 'destructive',
		description:
			"Contact Lookalikes. Find contacts similar to a set of seed contacts using AI-powered recommendations. Billing: Charged per result via the 'lookalikeContact' action.",
	},
	'company.getCompanyLookalikes': {
		riskLevel: 'destructive',
		description:
			"Company Lookalikes. Find companies similar to a set of seed companies using AI-powered recommendations. Billing: Charged per result via the 'lookalikeCompany' action.",
	},
	'person.getContactRecommendations': {
		riskLevel: 'destructive',
		description:
			"Contact Recommendations. Returns the recommended contacts for the calling user, ranked by Lusha against your Target Profiles and recent signals. Billing: Charged per result without an 'error', via the 'contactRecommendationsReveal' action. Results with an 'error' (e.g. 'COMPLIANCE_RESTRICTED') keep their scores but carry no personal data and are not charged.",
	},
	'company.getCompanyRecommendations': {
		riskLevel: 'destructive',
		description:
			"Company Recommendations. Returns the recommended companies for the calling user, ranked by Lusha against your Target Profiles and recent signals. Billing: Charged per result without an 'error', via the 'companyRecommendationsReveal' action.",
	},
	'person.getContactRecommendationFilters': {
		riskLevel: 'read',
		description:
			'Contact Recommendation Filters. Lists the Target Profiles and signal types that currently appear in your contact recommendations. Billing: Free.',
	},
	'company.getCompanyRecommendationFilters': {
		riskLevel: 'read',
		description:
			'Company Recommendation Filters. Lists the Target Profiles and signal types that currently appear in your company recommendations. Billing: Free.',
	},
	'person.getBuyingGroup': {
		riskLevel: 'destructive',
		description:
			"Get Buying Group Contacts. Identify the buying group within a set of target companies. Billing: 1 credit per contact record returned, via the 'buyingGroupContact' action. Credits are charged per record, not per person - if the same person appears at more than one company in the request, each record is charged.",
	},
	'contactTables.create': {
		riskLevel: 'write',
		description:
			'Create Contacts Table. Create a new, empty contacts table, optionally seeded with an initial list of contact IDs. Billing: Free.',
	},
	'contactTables.list': {
		riskLevel: 'read',
		description:
			'List Contacts Tables. List contacts tables owned by the given user, plus any tables shared with the account. Billing: Free.',
	},
	'contactTables.getColumnCatalog': {
		riskLevel: 'read',
		description:
			'Get Contacts Column Catalog. List every Lusha data column that can be added to a contacts table - 22 columns. Billing: Free - no credits charged.',
	},
	'contactTables.get': {
		riskLevel: 'read',
		description:
			"Get Contacts Table. Get a table's metadata and current processing status. Billing: Free.",
	},
	'contactTables.update': {
		riskLevel: 'write',
		description:
			'Update Contacts Table. Rename a table, change its visibility, or reassign its owner. Billing: Free.',
	},
	'contactTables.delete': {
		riskLevel: 'destructive',
		description:
			'Delete Contacts Table. Permanently delete a table and all its data. Billing: Free.',
	},
	'contactTables.listEntities': {
		riskLevel: 'destructive',
		description:
			"Get Contacts Table Entities. Read a page of rows in the table, with all column values and per-cell status. Billing: Charged per row returned via 'export_api'.",
	},
	'contactTables.addEntities': {
		riskLevel: 'write',
		description:
			'Add Entities to Contacts Table. Add up to 500 contact IDs to an existing table. Billing: Free.',
	},
	'contactTables.removeEntities': {
		riskLevel: 'destructive',
		description:
			'Remove Entities from Contacts Table. Remove specific contact IDs from a table. Billing: Free.',
	},
	'contactTables.listColumns': {
		riskLevel: 'read',
		description:
			'List Contacts Table Columns. List the columns on a table, with type and aggregated per-cell status counts. Billing: Free.',
	},
	'contactTables.addColumns': {
		riskLevel: 'write',
		description:
			"Add Columns to Contacts Table. Add up to 10 Lusha columns to a table in one call. Billing: Free today - credits aren't charged for adding columns yet.",
	},
	'contactTables.removeColumn': {
		riskLevel: 'destructive',
		description:
			'Remove Column from Contacts Table. Remove a column and delete all of its cell data across the table. Billing: Free.',
	},
	'contactTables.runColumn': {
		riskLevel: 'destructive',
		description:
			"Run Column on Contacts Table. Populate or refresh a column's data for some or all rows in the table. Billing: Charged per row processed, per the column's credit tier. Re-running with 'all' charges again for rows that already have data.",
	},
	'companyTables.create': {
		riskLevel: 'write',
		description:
			'Create Companies Table. Create a new, empty companies table, optionally seeded with an initial list of company IDs. Billing: Free.',
	},
	'companyTables.list': {
		riskLevel: 'read',
		description:
			'List Companies Tables. List companies tables owned by the given user, plus any tables shared with the account. Billing: Free.',
	},
	'companyTables.getColumnCatalog': {
		riskLevel: 'read',
		description:
			'Get Companies Column Catalog. List every Lusha data column that can be added to a companies table - 46 columns. Billing: Free - no credits charged.',
	},
	'companyTables.get': {
		riskLevel: 'read',
		description:
			"Get Companies Table. Get a table's metadata and current processing status. Billing: Free.",
	},
	'companyTables.update': {
		riskLevel: 'write',
		description:
			'Update Companies Table. Rename a table, change its visibility, or reassign its owner. Billing: Free.',
	},
	'companyTables.delete': {
		riskLevel: 'destructive',
		description:
			'Delete Companies Table. Permanently delete a table and all its data. Billing: Free.',
	},
	'companyTables.listEntities': {
		riskLevel: 'destructive',
		description:
			"Get Companies Table Entities. Read a page of rows in the table, with all column values and per-cell status. Billing: Charged per row returned via 'export_api'.",
	},
	'companyTables.addEntities': {
		riskLevel: 'destructive',
		description:
			"Add Entities to Companies Table. Add up to 500 company IDs to an existing table. Billing: Charges 'reveal_company' per newly-added company, deduped via row-count delta - duplicates and already-present companies aren't charged again.",
	},
	'companyTables.removeEntities': {
		riskLevel: 'destructive',
		description:
			'Remove Entities from Companies Table. Remove specific company IDs from a table. Billing: Free.',
	},
	'companyTables.removeColumn': {
		riskLevel: 'destructive',
		description:
			'Remove Column from Companies Table. Remove a column and delete all of its cell data across the table. Billing: Free.',
	},
	'companyTables.runColumn': {
		riskLevel: 'destructive',
		description:
			"Run Column on Companies Table. Populate or refresh a column's data for some or all rows in the table. Billing: Charged per row processed, per the column's credit tier. Company enrichment charges once per company per table - re-runs on an already-paid company in the same table are free.",
	},
	'person.getContactSignals': {
		riskLevel: 'destructive',
		description:
			"Contact Signals. Retrieve signal events for a list of contacts - job changes and promotions. Billing: Charged per matched signal per result via the 'showSignalsContact' action.",
	},
	'company.getCompanySignals': {
		riskLevel: 'destructive',
		description:
			"Company Signals. Retrieve signal events for a list of companies - hiring activity, headcount changes, web traffic, IT spend, news, and intent. Billing: Charged per matched signal per result via the 'showSignalsCompany' action. Intent signals are charged the same way as every other company signal - no matches, no charge.",
	},
	'person.getContactSignalTypes': {
		riskLevel: 'read',
		description:
			'Get Contact Signal Types. Returns the full list of supported signal types for contacts.',
	},
	'company.getCompanySignalTypes': {
		riskLevel: 'read',
		description:
			'Get Company Signal Types. Returns the full list of supported signal types for companies.',
	},
	'company.getCompanySignalFilters': {
		riskLevel: 'read',
		description:
			'Get Company Signal Filters (Discovery). Returns all available filter types for company signals and whether each requires a search query.',
	},
	'company.getCompanySignalFilterValues': {
		riskLevel: 'read',
		description:
			'Get Company Signal Filter Values. Returns valid values for a single company signal filter type. Billing: Free.',
	},
	'company.getCompanySignalScores': {
		riskLevel: 'destructive',
		description:
			"Score Companies by Signal Activity. Score companies by their active buying signals. Billing: 1 credit is charged per scored row via 'signal_score_company_reveal'. This action is currently limited-availability - while it isn't yet seeded on an account's pricebook, the endpoint stays free ('billing.creditsCharged' is '0').",
	},
	'person.getContactSignalScores': {
		riskLevel: 'destructive',
		description:
			"Score Contacts by Signal Activity. Score contacts by their active buying signals. Billing: 1 credit is charged per scored row via 'signal_score_contact_reveal'. This action is currently limited-availability - while it isn't yet seeded on an account's pricebook, the endpoint stays free ('billing.creditsCharged' is '0').",
	},
	'icp.listProfiles': {
		riskLevel: 'read',
		description:
			'List Target Profiles. Returns the Target Profiles (ICPs) you can see: your own, plus any an admin has shared with the account. Billing: Free (0 credits).',
	},
	'company.getCompanyIcpFitScores': {
		riskLevel: 'destructive',
		description:
			"Score Companies by ICP Fit. Score how well each company fits 1-3 of your Target Profiles, from '0' to '1'. Billing: 1 credit per scored company, regardless of how many profiles it's scored against. A score of '0' is charged. Error rows ('NOT_FOUND' / 'NO_SCORE') are never charged.",
	},
	'person.getContactIcpFitScores': {
		riskLevel: 'destructive',
		description:
			"Score Contacts by ICP Fit. Score how well each contact fits 1-3 of your Target Profiles, from '0' to '1'. Billing: 1 credit per scored contact, regardless of how many profiles it's scored against. A score of '0' is charged. Error rows ('NOT_FOUND' / 'NO_SCORE') are never charged.",
	},
	'company.getWebsiteVisits': {
		riskLevel: 'destructive',
		description:
			'Get Website Visitors. Returns companies ranked by website-visit signals for your tracked domains and date range. Billing: not documented; the response reports any credits charged in billing.',
	},
	'person.getContactFilterTypes': {
		riskLevel: 'read',
		description:
			'Get Contact Filter Types (Discovery). Returns all available filter types for contact prospecting and whether each requires a search query.',
	},
	'person.getContactFilterValues': {
		riskLevel: 'read',
		description:
			'Get Contact Filter Values. Returns valid values for a single contact filter type.',
	},
	'company.getCompanyFilterTypes': {
		riskLevel: 'read',
		description:
			'Get Company Filter Types (Discovery). Returns all available filter types for company prospecting and whether each requires a search query.',
	},
	'company.getCompanyFilterValues': {
		riskLevel: 'read',
		description:
			'Get Company Filter Values. Returns valid values for a single company filter type.',
	},
	'subscriptions.create': {
		riskLevel: 'destructive',
		description:
			'Create Subscription. Creates one or more webhook subscriptions for real-time signal notifications. Billing: Lusha charges credits for each signal it delivers to a subscription. Needs an account webhook secret, set in the Lusha dashboard. The secret is never returned here.',
	},
	'subscriptions.list': {
		riskLevel: 'read',
		description:
			'List Subscriptions. Returns all webhook subscriptions for your account with pagination support.',
	},
	'subscriptions.get': {
		riskLevel: 'read',
		description:
			'Get Subscription by ID. Returns a single webhook subscription by ID.',
	},
	'subscriptions.update': {
		riskLevel: 'write',
		description:
			'Update Subscription. Updates an existing webhook subscription. Setting isActive true reactivates a subscription that was disabled after failed deliveries; active subscriptions are charged per delivered signal.',
	},
	'subscriptions.test': {
		riskLevel: 'write',
		description:
			'Test Subscription. Test a webhook subscription by sending a test signal. Billing: test deliveries are free.',
	},
	'subscriptions.delete': {
		riskLevel: 'destructive',
		description:
			'Delete Subscriptions. Delete one or more webhook subscriptions. Deletes 1 to 25 subscriptions; this cannot be undone.',
	},
	'auditLogs.list': {
		riskLevel: 'read',
		description:
			'Get Audit Logs. Retrieve webhook delivery logs for your account.',
	},
	'auditLogs.getStats': {
		riskLevel: 'read',
		description:
			'Get Audit Log Statistics. Get delivery statistics for your account.',
	},
	'subscriptions.createOptOut': {
		riskLevel: 'write',
		description:
			'Create Opt-Out Subscription. Subscribe to real-time notifications when a contact opts out of data processing. Needs an account webhook secret, set in the Lusha dashboard.',
	},
	'conversations.search': {
		riskLevel: 'destructive',
		description:
			"Search Conversations. Search the sales conversations recorded by Lusha Conversations for your account. Billing: 1 credit per block of up to 25 conversations returned (1\u201325 = 1, 26\u201350 = 2, 51\u201375 = 3, 76\u2013100 = 4), via 'ci_meeting_data_export'. Charged on results returned, not the page size requested. A request that returns nothing is free.",
	},
	'conversations.getTranscript': {
		riskLevel: 'destructive',
		description:
			"Get Conversation Transcript. Returns the speaker-attributed, timestamped transcript of a single conversation. Billing: 1 credit per successful request via 'ci_transcript_analysis', including repeat requests for the same conversation. A '404' is never charged. While 'ci_transcript_analysis' isn't seeded on your account's pricebook, the endpoint stays free.",
	},
} as const;
