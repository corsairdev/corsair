import { z } from 'zod';
import type { BorneoOperationName } from '../operations';

/**
 * Operation-specific schemas generated from Composio Borneo toolkit
 * metadata version 20260429_00.
 *
 * Source:
 * GET /api/v3.1/tools/{tool_slug}?version=20260429_00
 */
export const BorneoEndpointInputSchemas = {
	getCloudAccountById: z
		.object({
			cloudAccountId: z
				.string()
				.describe(
					'The cloud-provider specific account ID, e.g. a 12-digit AWS account ID.',
				),
		})
		.strict(),
	postAccountsWithFilterAndSortOptions: z
		.object({
			pageSize: z
				.number()
				.int()
				.describe(
					'The maximum number of records to return per API call. If more records are available, the response will be truncated and will contain a "nextToken" value, which can be used to return additional records.',
				)
				.optional(),
			nextToken: z
				.string()
				.describe('Optional "nextToken" value from the last API response.')
				.optional(),
			sort__order: z.enum(['ASC', 'DESC']).describe('Order').optional(),
			filter__type: z
				.string()
				.describe('Filter accounts by account type.')
				.optional(),
			sort__column: z
				.string()
				.describe('The column name to sort on.')
				.optional(),
			filter__search: z
				.string()
				.describe('Search for accounts by name.')
				.optional(),
			filter__status: z
				.array(z.string())
				.describe('Filter accounts by status.')
				.optional(),
			filter__accountId: z
				.array(z.string())
				.describe('Filter accounts by the Borneo account ID.')
				.optional(),
			filter__activeStates: z
				.boolean()
				.describe(
					'Filters out accounts which are not in deleting or deleted states',
				)
				.optional(),
			filter__cloudAccountId: z
				.array(z.string())
				.describe('Filter accounts by the cloud-provider specific account ID.')
				.optional(),
		})
		.strict(),
	retrieveAccountDetailsById: z
		.object({ accountId: z.string().describe('The unique Borneo account ID.') })
		.strict(),
	createNewAsset: z
		.object({
			name: z.string().describe('Name of the asset to create'),
			type: z
				.enum([
					'applications',
					'cloudServices',
					'communications',
					'dataInformation',
					'externalStorage',
					'filingRoom',
					'furniture',
					'hardware',
					'hosting',
					'other',
					'paperDocumentation',
					'printer',
					'server',
					'shredder',
					'videoSurveillance',
				])
				.describe(
					'Indicates the type of the asset. An asset can be one of the several options.',
				),
			tomIds: z.array(z.string()).describe('Tomids').optional(),
			createdAt: z.number().int().describe('Createdat').optional(),
			locationId: z.string().describe('Locationid').optional(),
			locationType: z
				.enum(['external', 'office', 'remote'])
				.describe('Locationtype')
				.optional(),
		})
		.strict(),
	deleteAssetById: z
		.object({ assetId: z.string().describe('Identifier of the asset') })
		.strict(),
	filterAndSortAssetsList: z
		.object({
			nextToken: z
				.string()
				.describe(
					'The `nextToken` from the last page of results to retrieve the next page of results.',
				)
				.optional(),
			maxResults: z
				.number()
				.int()
				.describe(
					'The maximum number of records to return per API call. If more records are available, the response will be truncated and will contain a "nextToken" value, which can be used to return additional records.',
				)
				.optional(),
			sort__order: z.enum(['ASC', 'DESC']).describe('Order').optional(),
			filter__type: z
				.array(
					z.enum([
						'applications',
						'cloudServices',
						'communications',
						'dataInformation',
						'externalStorage',
						'filingRoom',
						'furniture',
						'hardware',
						'hosting',
						'other',
						'paperDocumentation',
						'printer',
						'server',
						'shredder',
						'videoSurveillance',
					]),
				)
				.describe('Type')
				.optional(),
			sort__column: z
				.string()
				.describe('The column name to sort on.')
				.optional(),
			filter__search: z
				.string()
				.describe('Free-form text search to apply to the asset name.')
				.optional(),
		})
		.strict(),
	retrieveAssetById: z
		.object({ assetId: z.string().describe('Identifier of the asset') })
		.strict(),
	updateAssetInformationById: z
		.object({
			name: z.string().describe('Name of the asset'),
			type: z
				.enum([
					'applications',
					'cloudServices',
					'communications',
					'dataInformation',
					'externalStorage',
					'filingRoom',
					'furniture',
					'hardware',
					'hosting',
					'other',
					'paperDocumentation',
					'printer',
					'server',
					'shredder',
					'videoSurveillance',
				])
				.describe(
					'Indicates the type of the asset. An asset can be one of the several options.',
				),
			tomIds: z.array(z.string()).describe('Tomids').optional(),
			assetId: z.string().describe('Identifier of the asset'),
			locationId: z.string().describe('Locationid').optional(),
			locationType: z
				.enum(['external', 'office', 'remote'])
				.describe('Locationtype')
				.optional(),
		})
		.strict(),
	listEventsWithFilters: z
		.object({
			select: z.array(z.string()).describe('Select').optional(),
			pageSize: z.number().int().describe('Pagesize').optional(),
			nextToken: z.string().describe('Nexttoken').optional(),
			sort__order: z.enum(['ASC', 'DESC']).describe('Order').optional(),
			sort__column: z
				.string()
				.describe('The column name to sort on.')
				.optional(),
			filter__scanId: z.array(z.string()).describe('Scanid').optional(),
			filter__search: z.string().describe('Search').optional(),
			filter__userId: z.array(z.string()).describe('Userid').optional(),
			filter__eventId: z.array(z.string()).describe('Eventid').optional(),
			filter__issueId: z.array(z.string()).describe('Issueid').optional(),
			filter__issueType: z.array(z.string()).describe('Issuetype').optional(),
			filter__resourceId: z.array(z.string()).describe('Resourceid').optional(),
			filter__newInfotypeFound: z
				.boolean()
				.describe('Newinfotypefound')
				.optional(),
		})
		.strict(),
	postFilteredAccessLogs: z
		.object({
			pageSize: z
				.number()
				.int()
				.describe('The maximum number of logs to return per API call.')
				.optional(),
			nextToken: z
				.string()
				.describe(
					'The `nextToken` from the last page of results to retrieve the next page of results.',
				)
				.optional(),
			filter__end: z
				.string()
				.describe(
					'List logs ending in between a specific timestamps with nonoseconds eg. 1715076399359944184.',
				)
				.optional(),
			filter__email: z
				.string()
				.describe('Filters all logs with user email eg. "user@example.com".')
				.optional(),
			filter__start: z
				.string()
				.describe(
					'List logs starting in between a specific timestamps with nonoseconds eg. 1715076388657800827.',
				)
				.optional(),
			filter__search: z
				.string()
				.describe('Free-text search on the logs.')
				.optional(),
			filter__requestId: z
				.string()
				.describe(
					'List logs from a specific requestId eg. "clvuywyoq009407rj61sxcrpc"',
				)
				.optional(),
			filter__operationName: z
				.string()
				.describe(
					'List logs based on operation type eg. "ListConnectors", "CreateOktaConnection".',
				)
				.optional(),
		})
		.strict(),
	postLogAuditRecordsWithFilterCriteria: z
		.object({
			pageSize: z
				.number()
				.int()
				.describe('The maximum number of logs to return per API call.')
				.optional(),
			nextToken: z
				.string()
				.describe(
					'The `nextToken` from the last page of results to retrieve the next page of results.',
				)
				.optional(),
			filter__end: z
				.string()
				.describe(
					'List logs ending in between a specific timestamps with nonoseconds eg. 1715076399359944184.',
				)
				.optional(),
			filter__start: z
				.string()
				.describe(
					'List logs starting in between a specific timestamps with nonoseconds eg. 1715076388657800827.',
				)
				.optional(),
			filter__scanId: z
				.string()
				.describe('List logs for a specific scan')
				.optional(),
			filter__search: z
				.string()
				.describe('Free-text search on the logs.')
				.optional(),
			filter__category: z
				.enum([
					'cloudAWS',
					'cloudAzure',
					'cloudGCP',
					'connector',
					'dataPlane',
					'notification',
					'scan',
				])
				.describe('Category')
				.optional(),
			filter__accountId: z
				.string()
				.describe('List logs for a specific AWS account')
				.optional(),
			filter__connectorId: z
				.string()
				.describe('List logs for a specific connector')
				.optional(),
			filter__dataPlaneId: z
				.string()
				.describe('List logs for a specific dataPlane')
				.optional(),
			filter__gcpProjectId: z
				.string()
				.describe('List logs for a specific GCP project')
				.optional(),
			filter__gcpConnectionId: z
				.string()
				.describe('List logs for a specific GCP connection')
				.optional(),
			filter__azureConnectionId: z
				.string()
				.describe('List logs for a specific Azure connection')
				.optional(),
			filter__azureSubscriptionId: z
				.string()
				.describe('List logs for a specific Azure project')
				.optional(),
		})
		.strict(),
	deleteDataBreachById: z
		.object({ dataBreachId: z.string().describe('Databreachid') })
		.strict(),
	evaluateDataBreachImpact: z
		.object({
			role: z
				.enum([
					'controller',
					'independent_controller',
					'joint_controller',
					'processor',
					'sub_processor',
				])
				.describe('Role of the recipient.')
				.optional(),
			evaluation: z.string().describe('Evaluation').optional(),
			saveAsDraft: z.boolean().describe('Saveasdraft'),
			dataBreachId: z.string().describe('Identifier of the DataBreach'),
			reportLanguage: z
				.enum([
					'ar',
					'de',
					'en',
					'es',
					'es-EC',
					'es-MX',
					'fr',
					'hi',
					'it',
					'ja',
					'pt',
					'zh',
				])
				.describe('Reportlanguage')
				.optional(),
			companiesAffected: z.string().describe('Companiesaffected').optional(),
			processorNotified: z.boolean().describe('Processornotified').optional(),
			dataBreachLocation: z
				.enum(['ourOrganisation', 'thirdPartyProcessor'])
				.describe('Databreachlocation')
				.optional(),
			processorsInvolved: z.string().describe('Processorsinvolved').optional(),
			authoritiesNotified: z
				.boolean()
				.describe('Authoritiesnotified')
				.optional(),
			dataBreachController: z
				.string()
				.describe('Databreachcontroller')
				.optional(),
			dataSubjectsNotified: z
				.boolean()
				.describe('Datasubjectsnotified')
				.optional(),
		})
		.strict(),
	fetchDataBreachEvaluation: z
		.object({
			dataBreachId: z.string().describe('Identifier of the DataBreach'),
		})
		.strict(),
	listDataBreachFilters: z
		.object({ filterType: z.enum(['owner', 'status']).describe('Filtertype') })
		.strict(),
	listDataBreachesWithFilters: z
		.object({
			pageSize: z
				.number()
				.int()
				.describe(
					'The maximum number of records to return per API call. If more records are available, the response will be truncated and will contain a "nextToken" value, which can be used to return additional records.',
				)
				.optional(),
			nextToken: z
				.string()
				.describe(
					'The `nextToken` from the last page of results to retrieve the next page of results.',
				)
				.optional(),
			sort__order: z.enum(['ASC', 'DESC']).describe('Order').optional(),
			sort__column: z
				.string()
				.describe('The column name to sort on.')
				.optional(),
			filter__owner: z.array(z.string()).describe('Owner').optional(),
			filter__search: z
				.string()
				.describe(
					'Free-form text search to apply to data breaches short description.',
				)
				.optional(),
			filter__status: z.array(z.string()).describe('Status').optional(),
			filter__authoritiesNotified: z
				.array(z.boolean())
				.describe('Authoritiesnotified')
				.optional(),
		})
		.strict(),
	postDataBreachInformation: z
		.object({
			language: z
				.enum([
					'ar',
					'de',
					'en',
					'es',
					'es-EC',
					'es-MX',
					'fr',
					'hi',
					'it',
					'ja',
					'pt',
					'zh',
				])
				.describe('Language')
				.optional(),
			createdAt: z.number().int().describe('Createdat').optional(),
			createdBy: z.string().describe('Createdby').optional(),
			kindOfData: z.string().describe('Kindofdata').optional(),
			occurredAt: z.number().int().describe('Occurredat').optional(),
			description: z.string().describe('Description').optional(),
			saveAsDraft: z.boolean().describe('Saveasdraft'),
			consequences: z.string().describe('Consequences').optional(),
			discoveredAt: z.number().int().describe('Discoveredat').optional(),
			howDiscovered: z.string().describe('Howdiscovered').optional(),
			peopleInformed: z.string().describe('Peopleinformed').optional(),
			wasIntentional: z.string().describe('Wasintentional').optional(),
			shortDescription: z.string().describe('Shortdescription'),
			measuresToPrevent: z.string().describe('Measurestoprevent').optional(),
			affectedPeopleFrom: z.string().describe('Affectedpeoplefrom').optional(),
			authoritiesInformed: z
				.string()
				.describe('Authoritiesinformed')
				.optional(),
			numberAffectedPeople: z
				.number()
				.int()
				.describe('Numberaffectedpeople')
				.optional(),
			additionalInformation: z
				.array(z.string())
				.describe('Additionalinformation')
				.optional(),
			profilePeopleAffected: z
				.string()
				.describe('Profilepeopleaffected')
				.optional(),
			compromisedSensitiveData: z
				.string()
				.describe('Compromisedsensitivedata')
				.optional(),
			problemOfSecurityMeasures: z
				.string()
				.describe('Problemofsecuritymeasures')
				.optional(),
			securityMeasuresOrProtocols: z
				.string()
				.describe('Securitymeasuresorprotocols')
				.optional(),
		})
		.strict(),
	retrieveDataBreachById: z
		.object({
			dataBreachId: z.string().describe('Identifier of the DataBreach'),
		})
		.strict(),
	updateDataBreachEntry: z
		.object({
			createdBy: z.string().describe('Createdby').optional(),
			kindOfData: z.string().describe('Kindofdata').optional(),
			occurredAt: z.number().int().describe('Occurredat').optional(),
			description: z.string().describe('Description').optional(),
			saveAsDraft: z.boolean().describe('Saveasdraft'),
			consequences: z.string().describe('Consequences').optional(),
			dataBreachId: z.string().describe('Identifier of the DataBreach'),
			discoveredAt: z.number().int().describe('Discoveredat').optional(),
			howDiscovered: z.string().describe('Howdiscovered').optional(),
			peopleInformed: z.string().describe('Peopleinformed').optional(),
			wasIntentional: z.string().describe('Wasintentional').optional(),
			shortDescription: z.string().describe('Shortdescription'),
			measuresToPrevent: z.string().describe('Measurestoprevent').optional(),
			affectedPeopleFrom: z.string().describe('Affectedpeoplefrom').optional(),
			authoritiesInformed: z
				.string()
				.describe('Authoritiesinformed')
				.optional(),
			numberAffectedPeople: z
				.number()
				.int()
				.describe('Numberaffectedpeople')
				.optional(),
			additionalInformation: z
				.array(z.string())
				.describe('Additionalinformation')
				.optional(),
			profilePeopleAffected: z
				.string()
				.describe('Profilepeopleaffected')
				.optional(),
			compromisedSensitiveData: z
				.string()
				.describe('Compromisedsensitivedata')
				.optional(),
			problemOfSecurityMeasures: z
				.string()
				.describe('Problemofsecuritymeasures')
				.optional(),
			securityMeasuresOrProtocols: z
				.string()
				.describe('Securitymeasuresorprotocols')
				.optional(),
		})
		.strict(),
	createNewInfotypeCategory: z
		.object({
			infotypes: z
				.array(z.string())
				.describe('The list of infotypes that belong to this category.'),
			description: z
				.string()
				.describe('Description of the infotype category.')
				.optional(),
			categoryLabel: z.string().describe('The name of the infotype category.'),
		})
		.strict(),
	deleteCategoryByLabel: z
		.object({
			categoryLabel: z.string().describe('The name of the infotype category.'),
		})
		.strict(),
	getCategoryByLabel: z
		.object({
			categoryLabel: z.string().describe('The name of the infotype category.'),
		})
		.strict(),
	updateCategoryInfotypes: z
		.object({
			infotypes: z
				.array(z.string())
				.describe('The list of infotypes that belong to this category.'),
			description: z
				.string()
				.describe('The description of the infotype category.')
				.optional(),
			categoryLabel: z.string().describe('The name of the infotype category.'),
		})
		.strict(),
	postConnectorWithFilteringOptions: z
		.object({
			pageSize: z
				.number()
				.int()
				.describe(
					'The maximum number of records to return per API call. If more records are available, the response will be truncated and will contain a "nextToken" value, which can be used to return additional records.',
				)
				.optional(),
			nextToken: z
				.string()
				.describe('Optional "nextToken" value from the last API response.')
				.optional(),
			sort__order: z.enum(['ASC', 'DESC']).describe('Order').optional(),
			sort__column: z
				.string()
				.describe('The column name to sort on.')
				.optional(),
			filter__names: z
				.array(z.string())
				.describe('Filter based on connector name.')
				.optional(),
			filter__search: z
				.string()
				.describe('Search for connectors by name.')
				.optional(),
			filter__states: z
				.array(z.string())
				.describe('Filter based on connector state.')
				.optional(),
			filter__resourceIds: z
				.array(z.string())
				.describe(
					'Filter based on the resource ID of the data source instance associated with the connector.',
				)
				.optional(),
			filter__activeStates: z
				.boolean()
				.describe(
					'Filters out connectors which are not in destroying or destroyed states',
				)
				.optional(),
			filter__connectorIds: z
				.array(z.string())
				.describe('Filter based on the connector IDs.')
				.optional(),
			filter__dataPlaneIds: z
				.array(z.string())
				.describe(
					'Filter based on the data plane in which the connector is deployed.',
				)
				.optional(),
			filter__resourceTypes: z
				.array(z.string())
				.describe(
					'Filter based on the resource type that the connector supports.',
				)
				.optional(),
			filter__connectorTypes: z
				.array(z.string())
				.describe('Filter based on the connector type.')
				.optional(),
		})
		.strict(),
	retrieveConnectorById: z
		.object({
			connectorId: z.string().describe('The unique Borneo connector ID.'),
		})
		.strict(),
	createDashboardUser: z
		.object({
			name: z.string().describe('Name').optional(),
			email: z.string().describe('Email'),
			roles: z
				.array(
					z.enum([
						'borneo_admin',
						'borneo_analyst',
						'borneo_engineer',
						'compliance_engineer',
						'data_engineer',
						'department_coordinator',
						'no_access_role',
						'privacy_supervisor',
					]),
				)
				.describe('Roles')
				.optional(),
			filter__id: z.string().describe('Id').optional(),
			filter__type: z.enum(['GCP', 'OKTA']).describe('Type').optional(),
			organisations: z
				.array(
					z
						.object({
							roles: z
								.array(
									z.enum([
										'borneo_admin',
										'borneo_analyst',
										'borneo_engineer',
										'compliance_engineer',
										'data_engineer',
										'department_coordinator',
										'no_access_role',
										'privacy_supervisor',
									]),
								)
								.describe('Roles'),
							departments: z
								.array(z.string())
								.describe('Departments')
								.optional(),
							organisationId: z
								.number()
								.int()
								.describe('Organisationid')
								.optional(),
						})
						.passthrough()
						.describe('Request schema for `CreateDashboardUserorganisations`'),
				)
				.describe('Organisations')
				.optional(),
		})
		.strict(),
	deleteDashboardReportById: z
		.object({ dashboardReportId: z.string().describe('Dashboardreportid') })
		.strict(),
	disableDashboardUserByUsername: z
		.object({ username: z.string().describe('Username') })
		.strict(),
	downloadDashboardReport: z
		.object({
			reportType: z
				.enum([
					'DATA_DISCOVERY_DASHBOARD',
					'PRIVACY_OPS_DASHBOARD',
					'PRIVACY_OPS_DATA_FLOW',
				])
				.describe('Reporttype'),
		})
		.strict(),
	downloadDashboardReportEdition: z
		.object({ reportEditionId: z.string().describe('Reporteditionid') })
		.strict(),
	enableDashboardUser: z
		.object({ username: z.string().describe('Username') })
		.strict(),
	fetchDashboardReportById: z
		.object({ dashboardReportId: z.string().describe('Dashboardreportid') })
		.strict(),
	getDashboardReportEditionById: z
		.object({ reportEditionId: z.string().describe('Reporteditionid') })
		.strict(),
	listDashboardReportEditions: z
		.object({
			pageSize: z
				.number()
				.int()
				.describe(
					'The maximum number of records to return per API call. If more records are available, the response will be truncated and will contain a "nextToken" value, which can be used to return additional records.',
				)
				.optional(),
			nextToken: z.string().describe('Nexttoken').optional(),
			sort__order: z.enum(['ASC', 'DESC']).describe('Order').optional(),
			sort__column: z
				.string()
				.describe('The column name to sort on.')
				.optional(),
			dashboardReportId: z
				.string()
				.describe(
					'The `nextToken` from the last page of results to retrieve the next page of results.',
				),
		})
		.strict(),
	listDashboardReportsWithFilters: z
		.object({
			pageSize: z
				.number()
				.int()
				.describe(
					'The maximum number of records to return per API call. If more records are available, the response will be truncated and will contain a "nextToken" value, which can be used to return additional records.',
				)
				.optional(),
			nextToken: z
				.string()
				.describe(
					'The `nextToken` from the last page of results to retrieve the next page of results.',
				)
				.optional(),
			sort__order: z.enum(['ASC', 'DESC']).describe('Order').optional(),
			filter__type: z
				.array(
					z.enum([
						'DATA_DISCOVERY_DASHBOARD',
						'PRIVACY_OPS_DASHBOARD',
						'PRIVACY_OPS_DATA_FLOW',
					]),
				)
				.describe('Type')
				.optional(),
			sort__column: z
				.string()
				.describe('The column name to sort on.')
				.optional(),
			filter__search: z
				.string()
				.describe('Free-form text search to apply to the scan name.')
				.optional(),
			filter__frequency: z
				.array(
					z.enum([
						'*/30 * * * *',
						'0 */1 * * *',
						'0 */12 * * *',
						'0 */4 * * *',
						'0 */6 * * *',
						'0 */8 * * *',
						'0 0 * * *',
						'0 0 * * 0',
						'0 0 1 * *',
						'0 0 1 1,4,7,10 *',
						'0 0 1 1,7 *',
					]),
				)
				.describe('Frequency')
				.optional(),
		})
		.strict(),
	listDashboardUsersWithFilters: z
		.object({
			filter__roles: z
				.array(
					z.enum([
						'borneo_admin',
						'borneo_analyst',
						'borneo_engineer',
						'compliance_engineer',
						'data_engineer',
						'department_coordinator',
						'no_access_role',
						'privacy_supervisor',
					]),
				)
				.describe('Roles')
				.optional(),
			filter__tenantId: z.string().describe('Tenantid').optional(),
			filter__departments: z
				.array(z.string())
				.describe('Departments')
				.optional(),
			filter__organisationId: z
				.number()
				.int()
				.describe('Organisationid')
				.optional(),
		})
		.strict(),
	postCurrentDashboardUser: z.object({}).strict(),
	postDashboardReport: z
		.object({
			name: z.string().describe('Name'),
			roles: z
				.array(
					z.enum([
						'borneo_admin',
						'borneo_analyst',
						'borneo_engineer',
						'compliance_engineer',
						'data_engineer',
						'department_coordinator',
						'no_access_role',
						'privacy_supervisor',
					]),
				)
				.describe('Roles')
				.optional(),
			status: z.enum(['DELETED', 'ONCE', 'SCHEDULED']).describe('Status'),
			createdBy: z.string().describe('Createdby').optional(),
			frequency: z
				.enum([
					'*/30 * * * *',
					'0 */1 * * *',
					'0 */12 * * *',
					'0 */4 * * *',
					'0 */6 * * *',
					'0 */8 * * *',
					'0 0 * * *',
					'0 0 * * 0',
					'0 0 1 * *',
					'0 0 1 1,4,7,10 *',
					'0 0 1 1,7 *',
				])
				.describe(
					'The cron schedule expression to use for a recurring scan. Only a fixed set of cron expressions can be used to run scans at 30 minute, 1 hour, 1 day, or 1 week intervals.',
				)
				.optional(),
			reportTypes: z
				.array(
					z.enum([
						'DATA_DISCOVERY_DASHBOARD',
						'PRIVACY_OPS_DASHBOARD',
						'PRIVACY_OPS_DATA_FLOW',
					]),
				)
				.describe('Reporttypes'),
			externalEmail: z.array(z.string()).describe('Externalemail').optional(),
			recipientsEmail: z
				.array(z.string())
				.describe('Recipientsemail')
				.optional(),
			triggerImmediately: z.boolean().describe('Triggerimmediately'),
		})
		.strict(),
	removeDashboardUserByUsername: z
		.object({ username: z.string().describe('Username') })
		.strict(),
	resetDashboardUserPassword: z
		.object({ username: z.string().describe('Username') })
		.strict(),
	triggerDashboardReportByReportId: z
		.object({ dashboardReportId: z.string().describe('Dashboardreportid') })
		.strict(),
	updateDashboardUserDetails: z
		.object({
			name: z.string().describe('Name'),
			username: z.string().describe('Username'),
		})
		.strict(),
	updateDashboardUserRoles: z
		.object({
			username: z.string().describe('Username'),
			organisations: z
				.array(
					z
						.object({
							roles: z
								.array(
									z.enum([
										'borneo_admin',
										'borneo_analyst',
										'borneo_engineer',
										'compliance_engineer',
										'data_engineer',
										'department_coordinator',
										'no_access_role',
										'privacy_supervisor',
									]),
								)
								.describe('Roles'),
							departments: z
								.array(z.string())
								.describe('Departments')
								.optional(),
							organisationId: z
								.number()
								.int()
								.describe('Organisationid')
								.optional(),
						})
						.passthrough()
						.describe(
							'Request schema for `UpdateDashboardUserRolesorganisations`',
						),
				)
				.describe('Organisations'),
		})
		.strict(),
	createDepartmentWithTranslations: z
		.object({
			name: z.string().describe('Name').optional(),
			translations: z
				.object({ additionalProperties: z.object({}).passthrough().optional() })
				.passthrough()
				.describe('Translations')
				.optional(),
		})
		.strict(),
	deleteDepartmentById: z
		.object({
			departmentId: z.string().describe('Identifier of the department.'),
		})
		.strict(),
	getDepartmentFilterList: z.object({}).strict(),
	listDepartmentsWithSortAndPagination: z
		.object({
			pageSize: z
				.number()
				.int()
				.describe(
					'The maximum number of records to return per API call. If more records are available, the response will be truncated and will contain a "nextToken" value, which can be used to return additional records.',
				)
				.optional(),
			nextToken: z
				.string()
				.describe(
					'The `nextToken` from the last page of results to retrieve the next page of results.',
				)
				.optional(),
			sort__order: z.enum(['ASC', 'DESC']).describe('Order').optional(),
			sort__column: z
				.string()
				.describe('The column name to sort on.')
				.optional(),
			filter__search: z
				.string()
				.describe('Free-form text search to apply to the department name.')
				.optional(),
		})
		.strict(),
	retrieveDepartmentInformation: z
		.object({
			departmentId: z.string().describe('Identifier of the department.'),
		})
		.strict(),
	updateDepartmentName: z
		.object({
			name: z.string().describe('Name').optional(),
			departmentId: z.string().describe('Identifier of the department.'),
		})
		.strict(),
	createLegalDocumentEntry: z
		.object({
			name: z.string().describe('Name'),
			type: z
				.enum(['DATA_PROCESSING', 'PRIVACY_POLICY'])
				.describe('Type')
				.optional(),
			region: z.string().describe('Region'),
			source: z.string().describe('Source').optional(),
			documentLink: z.string().describe('Documentlink'),
			isDiscoverInfotype: z.boolean().describe('Isdiscoverinfotype'),
			fromDiscoveredDocumentId: z
				.string()
				.describe('Fromdiscovereddocumentid')
				.optional(),
		})
		.strict(),
	deleteLegalDocumentById: z
		.object({ documentId: z.string().describe('Documentid') })
		.strict(),
	listDiscoveredDocument: z
		.object({
			pageSize: z
				.number()
				.int()
				.describe(
					'The maximum number of records to return per API call. If more records are available, the response will be truncated and will contain a "nextToken" value, which can be used to return additional records.',
				)
				.optional(),
			nextToken: z
				.string()
				.describe(
					'The `nextToken` from the last page of results to retrieve the next page of results.',
				)
				.optional(),
			sort__order: z.enum(['ASC', 'DESC']).describe('Order').optional(),
			sort__column: z
				.string()
				.describe('The column name to sort on.')
				.optional(),
			filter__search: z
				.string()
				.describe('Free-form text search to apply to the scan name.')
				.optional(),
			filter__status: z
				.enum(['ADDED', 'DELETED', 'DOMAIN_DELETED', 'IGNORED', 'NEW'])
				.describe('Status')
				.optional(),
		})
		.strict(),
	listLegalDocumentsWithPagination: z
		.object({
			pageSize: z
				.number()
				.int()
				.describe(
					'The maximum number of records to return per API call. If more records are available, the response will be truncated and will contain a "nextToken" value, which can be used to return additional records.',
				)
				.optional(),
			nextToken: z
				.string()
				.describe(
					'The `nextToken` from the last page of results to retrieve the next page of results.',
				)
				.optional(),
			sort__order: z.enum(['ASC', 'DESC']).describe('Order').optional(),
			sort__column: z
				.string()
				.describe('The column name to sort on.')
				.optional(),
			filter__search: z
				.string()
				.describe('Free-form text search to apply to the scan name.')
				.optional(),
			filter__status: z
				.enum(['CREATED', 'DELETED', 'SCANNING'])
				.describe('Status')
				.optional(),
		})
		.strict(),
	retrieveDiscoveredDocumentById: z
		.object({
			discoveredDocumentId: z.string().describe('Discovereddocumentid'),
		})
		.strict(),
	retrieveLegalDocumentById: z
		.object({ documentId: z.string().describe('Documentid') })
		.strict(),
	updateDiscoveredDocumentStatus: z
		.object({
			status: z
				.enum(['ADDED', 'DELETED', 'DOMAIN_DELETED', 'IGNORED', 'NEW'])
				.describe('Status'),
			discoveredDocumentId: z.string().describe('Discovereddocumentid'),
		})
		.strict(),
	createDomainWithPollingFrequency: z
		.object({
			name: z.string().describe('Name of the domain.'),
			frequency: z
				.enum(['12h', '1d', '1w', '30d', '6h', 'manual'])
				.describe(
					'Frequency of polling for a domain. Manual polling means that this domain will not be polled automatically.',
				),
		})
		.strict(),
	deleteDomainById: z
		.object({ domainId: z.string().describe('Identifier of the domain.') })
		.strict(),
	getDomainById: z
		.object({ domainId: z.string().describe('Identifier of the domain.') })
		.strict(),
	listDomainsWithPaginationAndSorting: z
		.object({
			pageSize: z
				.number()
				.int()
				.describe(
					'The maximum number of records to return per API call. If more records are available, the response will be truncated and will contain a "nextToken" value, which can be used to return additional records.',
				)
				.optional(),
			nextToken: z
				.string()
				.describe(
					'The `nextToken` from the last page of results to retrieve the next page of results.',
				)
				.optional(),
			sort__order: z.enum(['ASC', 'DESC']).describe('Order').optional(),
			sort__column: z
				.string()
				.describe('The column name to sort on.')
				.optional(),
		})
		.strict(),
	pollDomainById: z
		.object({ domainId: z.string().describe('Identifier of the domain.') })
		.strict(),
	updateDomainDetails: z
		.object({
			name: z.string().describe('Name of the domain.'),
			domainId: z.string().describe('Identifier of the domain.'),
			frequency: z
				.enum(['12h', '1d', '1w', '30d', '6h', 'manual'])
				.describe(
					'Frequency of polling for a domain. Manual polling means that this domain will not be polled automatically.',
				),
		})
		.strict(),
	createEmployeeWithJsonPayload: z
		.object({
			nif: z.string().describe('The NIF of the employee').optional(),
			name: z.string().describe('The name of the employee'),
			email: z.string().describe('the email of the employee').optional(),
			endDate: z
				.string()
				.describe('Date when the employee end to work in your company')
				.optional(),
			manager: z
				.string()
				.describe('employeeId of the employee who is manager of the employee')
				.optional(),
			surname: z.string().describe('The surname of the employee'),
			position: z
				.string()
				.describe('The position of the employee in the company.')
				.optional(),
			createdBy: z.string().describe('Createdby'),
			startDate: z
				.string()
				.describe('Date when the employee began to work in your company')
				.optional(),
			department: z
				.string()
				.describe('the department of the employee')
				.optional(),
			referenceId: z
				.string()
				.describe('Internal identifier to synchronize with external APIS')
				.optional(),
		})
		.strict(),
	deleteEmployeeById: z
		.object({ employeeId: z.string().describe('Identifier of the employee') })
		.strict(),
	filterEmployeeList: z
		.object({
			pageSize: z
				.number()
				.int()
				.describe(
					'The maximum number of records to return per API call. If more records are available, the response will be truncated and will contain a "nextToken" value, which can be used to return additional records.',
				)
				.optional(),
			nextToken: z
				.string()
				.describe(
					'The `nextToken` from the last page of results to retrieve the next page of results.',
				)
				.optional(),
			sort__order: z.enum(['ASC', 'DESC']).describe('Order').optional(),
			sort__column: z
				.string()
				.describe('The column name to sort on.')
				.optional(),
			filter__search: z
				.string()
				.describe('Free-form text search to apply to the employee name.')
				.optional(),
			filter__department: z.array(z.string()).describe('Department').optional(),
		})
		.strict(),
	listEmployeesWithFilters: z
		.object({
			pageSize: z
				.number()
				.int()
				.describe(
					'The maximum number of records to return per API call. If more records are available, the response will be truncated and will contain a "nextToken" value, which can be used to return additional records.',
				)
				.optional(),
			nextToken: z
				.string()
				.describe(
					'The `nextToken` from the last page of results to retrieve the next page of results.',
				)
				.optional(),
			sort__order: z.enum(['ASC', 'DESC']).describe('Order').optional(),
			sort__column: z
				.string()
				.describe('The column name to sort on.')
				.optional(),
			filter__search: z
				.string()
				.describe('Free-form text search to apply to the employee name.')
				.optional(),
			filter__department: z.array(z.string()).describe('Department').optional(),
		})
		.strict(),
	retrieveEmployeeDetailsById: z
		.object({ employeeId: z.string().describe('Identifier of the employee') })
		.strict(),
	updateEmployeeById: z
		.object({
			nif: z
				.string()
				.describe('The NIF (Spanish Tax Identification Number) of the employee')
				.optional(),
			name: z.string().describe('The name of the employee').optional(),
			email: z
				.string()
				.describe(
					'The email of the employee. Has to be unique within the company.',
				)
				.optional(),
			endDate: z
				.string()
				.describe('Date when the employee end to work in your company')
				.optional(),
			manager: z.string().describe('The employee"s direct manager.').optional(),
			surname: z.string().describe('The surname of the employee').optional(),
			position: z
				.string()
				.describe('The position in the company of the employee')
				.optional(),
			startDate: z
				.string()
				.describe('Date when the employee began to work in your company')
				.optional(),
			department: z
				.string()
				.describe('The department of the employee')
				.optional(),
			employeeId: z.string().describe('Identifier of the employee'),
		})
		.strict(),
	createHeadquarterEntry: z
		.object({
			city: z.string().describe('The locality of the headquarter'),
			name: z.string().describe('The name of the headquarter'),
			tomIds: z.array(z.string()).describe('Tomids').optional(),
			address: z.string().describe('The address of the headquarter'),
			country: z.string().describe('2 letter code that identifies a country.'),
			zipcode: z.string().describe('The zipcode of the headquarter').optional(),
		})
		.strict(),
	deleteHeadquartersById: z
		.object({
			headquarterId: z.string().describe('The identifier of the headquarter'),
		})
		.strict(),
	getHeadquartersById: z
		.object({
			headquarterId: z.string().describe('The identifier of the headquarter'),
		})
		.strict(),
	listHeadquartersWithSorting: z
		.object({
			pageSize: z
				.number()
				.int()
				.describe(
					'The maximum number of records to return per API call. If more records are available, the response will be truncated and will contain a "nextToken" value, which can be used to return additional records.',
				)
				.optional(),
			nextToken: z
				.string()
				.describe(
					'The `nextToken` from the last page of results to retrieve the next page of results.',
				)
				.optional(),
			sort__order: z.enum(['ASC', 'DESC']).describe('Order').optional(),
			sort__column: z
				.string()
				.describe('The column name to sort on.')
				.optional(),
		})
		.strict(),
	updateHeadquarterDetailsById: z
		.object({
			city: z.string().describe('The locality of the headquarter'),
			name: z.string().describe('The name of the headquarter'),
			tomIds: z.array(z.string()).describe('Tomids').optional(),
			address: z.string().describe('The address of the headquarter'),
			country: z.string().describe('2 letter code that identifies a country.'),
			zipcode: z.string().describe('The zipcode of the headquarter').optional(),
			headquarterId: z.string().describe('The identifier of the headquarter'),
		})
		.strict(),
	listDiscoveredInfotypes: z
		.object({
			pageSize: z
				.number()
				.int()
				.describe(
					'The maximum number of records to return per API call. If more records are available, the response will be truncated and will contain a "nextToken" value, which can be used to return additional records.',
				)
				.optional(),
			nextToken: z
				.string()
				.describe(
					'The `nextToken` from the last page of results to retrieve the next page of results.',
				)
				.optional(),
			sort__order: z.enum(['ASC', 'DESC']).describe('Order').optional(),
			sort__column: z
				.string()
				.describe('The column name to sort on.')
				.optional(),
			filter__search: z
				.string()
				.describe('Free-form text search to apply to the scan name.')
				.optional(),
			filter__status: z
				.enum([
					'APPROVED',
					'APPROVED_AUTOMATICALLY',
					'DELETED',
					'IGNORED',
					'NEW',
					'NOT_PRESENT',
					'REQUESTED',
				])
				.describe('Status')
				.optional(),
		})
		.strict(),
	retrieveDiscoveredInfotypeById: z
		.object({
			discoveredInfotypeId: z.string().describe('Discoveredinfotypeid'),
		})
		.strict(),
	updateDiscoveredInfotypeStatus: z
		.object({
			status: z
				.enum([
					'APPROVED',
					'APPROVED_AUTOMATICALLY',
					'DELETED',
					'IGNORED',
					'NEW',
					'NOT_PRESENT',
					'REQUESTED',
				])
				.describe('Status'),
			discoveredInfotypeId: z.string().describe('Discoveredinfotypeid'),
		})
		.strict(),
	listFilteredSortedCategories: z
		.object({
			sort__order: z.enum(['ASC', 'DESC']).describe('Order').optional(),
			sort__column: z
				.string()
				.describe('The column name to sort on.')
				.optional(),
			filter__categories: z.array(z.string()).describe('Categories').optional(),
		})
		.strict(),
	listIssuesWithFilters: z
		.object({
			select: z
				.array(z.string())
				.describe('List of column names to include in the response.')
				.optional(),
			include: z
				.object({ additionalProperties: z.boolean().optional() })
				.passthrough()
				.describe(
					'The set of related resources that should be included in the response using a join-query.',
				)
				.optional(),
			pageSize: z
				.number()
				.int()
				.describe(
					'The maximum number of records to return per API call. If more records are available, the response will be truncated and will contain a "nextToken" value, which can be used to return additional records.',
				)
				.optional(),
			nextToken: z
				.string()
				.describe(
					'The `nextToken` from the last page of results to retrieve the next page of results.',
				)
				.optional(),
			sort__order: z.enum(['ASC', 'DESC']).describe('Order').optional(),
			sort__column: z
				.string()
				.describe('The column name to sort on.')
				.optional(),
			filter__search: z
				.string()
				.describe('Free-text search on the resource name.')
				.optional(),
			filter__states: z
				.array(z.string())
				.describe('List of isssue states to filter by.')
				.optional(),
			filter__resources: z
				.array(z.string())
				.describe('List of resource IDs to filter by.')
				.optional(),
			filter__severities: z
				.array(z.string())
				.describe('List of issue severities to filter by.')
				.optional(),
			filter__resourceTypes: z
				.array(z.string())
				.describe('List of resource types to filter by.')
				.optional(),
			filter__failedControls: z
				.array(z.string())
				.describe('List of failed controls to filter by.')
				.optional(),
			filter__cloudAccountIds: z
				.array(z.string())
				.describe('List of cloud provider account IDs to filter by.')
				.optional(),
			filter__cloudAccountTypes: z
				.array(z.string())
				.describe('List of cloud provider account types to filter by.')
				.optional(),
		})
		.strict(),
	retrieveErrorDetailsById: z
		.object({ errorId: z.string().describe('The unique resource ID.') })
		.strict(),
	retrieveIssueById: z
		.object({ issueId: z.string().describe('The unique issue ID.') })
		.strict(),
	submitChatFeedback: z
		.object({
			postId: z.string().describe('Postid').optional(),
			rating: z.number().int().describe('Rating').optional(),
		})
		.strict(),
	createDpiaForProcessingActivity: z
		.object({
			status: z
				.enum(['activated', 'draft'])
				.describe(
					'The status of the DPIA. If a DPIA is saved as activated, several fields are required',
				),
			createdAt: z.number().int().describe('Createdat').optional(),
			updatedAt: z.number().int().describe('Updatedat').optional(),
			translations: z
				.object({ additionalProperties: z.object({}).passthrough().optional() })
				.passthrough()
				.describe('Translations')
				.optional(),
			integrity__impacts: z
				.array(
					z
						.object({
							id: z
								.string()
								.describe(
									'Identifier for the impact of confidentiality risk. Can be an UUID if it"s a custom impact or one of the keys of the default impacts that we offer',
								),
							name: z.string().describe('Name').optional(),
						})
						.passthrough()
						.describe(
							'Request schema for `CreateDpiaForProcessingActivityimpacts`',
						),
				)
				.describe(
					'List of impacts that integrity risk can have. At least one element is necessary DPIA is saved as activated',
				)
				.optional(),
			integrity__threats: z
				.array(
					z
						.object({
							id: z
								.string()
								.describe(
									'Identifier for the threat of confidentiality risk. Can be an UUID if it"s a custom threat or one of the keys of the default threats that we offer',
								),
							name: z.string().describe('Name').optional(),
						})
						.passthrough()
						.describe(
							'Request schema for `CreateDpiaForProcessingActivitythreats`',
						),
				)
				.describe(
					'List of threats that integrity risk can have. At least one element is necessary DPIA is saved as activated',
				)
				.optional(),
			processingActivityId: z
				.string()
				.describe(
					'Identifier of the processing activity for which we are creating a DPIA',
				),
			additionalInformation: z
				.string()
				.describe('Additionalinformation')
				.optional(),
			availability__impacts: z
				.array(
					z
						.object({
							id: z
								.string()
								.describe(
									'Identifier for the impact of confidentiality risk. Can be an UUID if it"s a custom impact or one of the keys of the default impacts that we offer',
								),
							name: z.string().describe('Name').optional(),
						})
						.passthrough()
						.describe(
							'Request schema for `CreateDpiaForProcessingActivityimpacts`',
						),
				)
				.describe(
					'List of impacts that availability risk can have. At least one element is necessary DPIA is saved as activated',
				)
				.optional(),
			availability__threats: z
				.array(
					z
						.object({
							id: z
								.string()
								.describe(
									'Identifier for the threat of confidentiality risk. Can be an UUID if it"s a custom threat or one of the keys of the default threats that we offer',
								),
							name: z.string().describe('Name').optional(),
						})
						.passthrough()
						.describe(
							'Request schema for `CreateDpiaForProcessingActivitythreats`',
						),
				)
				.describe(
					'List of threats that availability risk can have. At least one element is necessary DPIA is saved as activated',
				)
				.optional(),
			integrity__plannedToms: z
				.array(z.string())
				.describe(
					'List of TOMs that are planned to be implemented to prevent integrity risk. At least one element is necessary DPIA is saved as activated',
				)
				.optional(),
			integrity__riskSources: z
				.array(
					z
						.object({
							id: z
								.string()
								.describe(
									'Identifier for the risk source of a risk. Can be an UUID if it"s a custom risk source or one of the keys of the default risk sources that we offer',
								),
							name: z.string().describe('Name of the risk source').optional(),
						})
						.passthrough()
						.describe(
							'Request schema for `CreateDpiaForProcessingActivityriskSources`',
						),
				)
				.describe(
					'List of risk sources that integrity risk can have. At least one element is necessary DPIA is saved as activated',
				)
				.optional(),
			confidentiality__impacts: z
				.array(
					z
						.object({
							id: z
								.string()
								.describe(
									'Identifier for the impact of confidentiality risk. Can be an UUID if it"s a custom impact or one of the keys of the default impacts that we offer',
								),
							name: z.string().describe('Name').optional(),
						})
						.passthrough()
						.describe(
							'Request schema for `CreateDpiaForProcessingActivityimpacts`',
						),
				)
				.describe(
					'List of impacts that confidentiality risk can have. At least one element is necessary DPIA is saved as activated',
				)
				.optional(),
			confidentiality__threats: z
				.array(
					z
						.object({
							id: z
								.string()
								.describe(
									'Identifier for the threat of confidentiality risk. Can be an UUID if it"s a custom threat or one of the keys of the default threats that we offer',
								),
							name: z.string().describe('Name').optional(),
						})
						.passthrough()
						.describe(
							'Request schema for `CreateDpiaForProcessingActivitythreats`',
						),
				)
				.describe(
					'List of threats that confidentiality risk can have. At least one element is necessary DPIA is saved as activated',
				)
				.optional(),
			availability__plannedToms: z
				.array(z.string())
				.describe(
					'List of TOMs planned to be implemented and that applies to the availability risk. At least one element is necessary DPIA is saved as activated',
				)
				.optional(),
			availability__riskSources: z
				.array(
					z
						.object({
							id: z
								.string()
								.describe(
									'Identifier for the risk source of a risk. Can be an UUID if it"s a custom risk source or one of the keys of the default risk sources that we offer',
								),
							name: z.string().describe('Name of the risk source').optional(),
						})
						.passthrough()
						.describe(
							'Request schema for `CreateDpiaForProcessingActivityriskSources`',
						),
				)
				.describe(
					'List of risk sources that availability risk can have. At least one element is necessary DPIA is saved as activated',
				)
				.optional(),
			integrity__impactsComment: z
				.string()
				.describe(
					'Comment to add additional information about the integrity impacts',
				)
				.optional(),
			integrity__threatsComment: z
				.string()
				.describe(
					'Comment to add additional information about the integrity threats',
				)
				.optional(),
			privacyFramework__consent: z
				.string()
				.describe(
					'Field to describe the measures to ensure that the consent of the data subjects has been obtained and how the given consent can be revoked Mandatory if DPIA is saved as activated and the lawfulness "consent_person_concerned" selected',
				)
				.optional(),
			additionalInformationFiles: z
				.array(z.string())
				.describe('Additionalinformationfiles')
				.optional(),
			integrity__baselineComment: z
				.string()
				.describe(
					'Comment to add additional information about the baseline risk of the integrity',
				)
				.optional(),
			integrity__implementedToms: z
				.array(z.string())
				.describe(
					'List of TOMs that are implemented to prevent integrity risk. At least one element is necessary DPIA is saved as activated',
				)
				.optional(),
			privacyFramework__accuracy: z
				.string()
				.describe(
					'Field to explain if the data processed is accurate, high quality and up-to-date Mandatory if DPIA is saved as activated',
				)
				.optional(),
			integrity__baselineSeverity: z
				.enum(['high', 'low', 'medium', 'very_high', 'very_low'])
				.describe('Represents the severity of a risk')
				.optional(),
			privacyFramework__retention: z
				.boolean()
				.describe(
					'Is the retention period lawful and clearly defined? Mandatory if DPIA is saved as activated',
				)
				.optional(),
			availability__impactsComment: z
				.string()
				.describe('Comment to add additional information about the impact')
				.optional(),
			availability__threatsComment: z
				.string()
				.describe('Comment to add additional information about the threat')
				.optional(),
			confidentiality__plannedToms: z
				.array(z.string())
				.describe(
					'List of TOMs that are planned to be implemented to prevent confidentiality risk. At least one element is necessary DPIA is saved as activated',
				)
				.optional(),
			confidentiality__riskSources: z
				.array(
					z
						.object({
							id: z
								.string()
								.describe(
									'Identifier for the risk source of a risk. Can be an UUID if it"s a custom risk source or one of the keys of the default risk sources that we offer',
								),
							name: z.string().describe('Name of the risk source').optional(),
						})
						.passthrough()
						.describe(
							'Request schema for `CreateDpiaForProcessingActivityriskSources`',
						),
				)
				.describe(
					'List of risk sources that confidentiality risk can have. At least one element is necessary DPIA is saved as activated',
				)
				.optional(),
			availability__baselineComment: z
				.string()
				.describe(
					'Comment to add additional information about the baseline risk of the availablity',
				)
				.optional(),
			availability__implementedToms: z
				.array(z.string())
				.describe(
					'List of implemented TOMs that applies to the availability risk. At least one element is necessary DPIA is saved as activated',
				)
				.optional(),
			integrity__baselineLikelihood: z
				.enum(['likely', 'limited', 'maximum', 'negligible', 'unlikely'])
				.describe('Baselinelikelihood')
				.optional(),
			integrity__plannedTomsComment: z
				.string()
				.describe(
					'Comment to add additional information about planned TOMs to prevent integrity risk',
				)
				.optional(),
			integrity__riskSourcesComment: z
				.string()
				.describe(
					'Comment to add additional information about the integrity risk sources',
				)
				.optional(),
			availability__baselineSeverity: z
				.enum(['high', 'low', 'medium', 'very_high', 'very_low'])
				.describe('Represents the severity of a risk')
				.optional(),
			integrity__residualRiskComment: z
				.string()
				.describe(
					'Comment to add additional information about the residual risk of the integrity',
				)
				.optional(),
			privacyFramework__transparency: z
				.string()
				.describe(
					'Field to describe what kind of notice information is given to data subjects about this processing, and how is it provided to the data subjects? Mandatory if DPIA is saved as activated',
				)
				.optional(),
			confidentiality__impactsComment: z
				.string()
				.describe(
					'Comment to add additional information about the confidentiality risk impacts',
				)
				.optional(),
			confidentiality__threatsComment: z
				.string()
				.describe(
					'Comment to add additional information about the confidentiality risk threats',
				)
				.optional(),
			integrity__residualRiskSeverity: z
				.enum(['high', 'low', 'medium', 'very_high', 'very_low'])
				.describe('Represents the severity of a risk')
				.optional(),
			availability__baselineLikelihood: z
				.enum(['likely', 'limited', 'maximum', 'negligible', 'unlikely'])
				.describe('Baselinelikelihood')
				.optional(),
			availability__plannedTomsComment: z
				.string()
				.describe(
					'Comment to add additional information about the planned TOMs',
				)
				.optional(),
			availability__riskSourcesComment: z
				.string()
				.describe(
					'Comment to add additional information about the availability risk sources',
				)
				.optional(),
			confidentiality__baselineComment: z
				.string()
				.describe(
					'Comment to add additional information about the baseline risk of the confidentiality',
				)
				.optional(),
			confidentiality__implementedToms: z
				.array(z.string())
				.describe(
					'List of TOMs that are implemented to prevent confidentiality risk. At least one element is necessary DPIA is saved as activated',
				)
				.optional(),
			availability__residualRiskComment: z
				.string()
				.describe(
					'Comment to add additional information about the residual risk of the availability',
				)
				.optional(),
			confidentiality__baselineSeverity: z
				.enum(['high', 'low', 'medium', 'very_high', 'very_low'])
				.describe('Represents the severity of a risk')
				.optional(),
			integrity__implementedTomsComment: z
				.string()
				.describe(
					'Comment to add additional information about implemented TOMs to prevent integrity risk',
				)
				.optional(),
			integrity__residualRiskLikelihood: z
				.enum(['likely', 'limited', 'maximum', 'negligible', 'unlikely'])
				.describe('Residualrisklikelihood')
				.optional(),
			availability__residualRiskSeverity: z
				.enum(['high', 'low', 'medium', 'very_high', 'very_low'])
				.describe('Represents the severity of a risk')
				.optional(),
			privacyFramework__dataMinimisation: z
				.string()
				.describe(
					'Field to explain if the data collected adequate, relevant, and limited to what is necessary concerning the purposes for which it is processed Mandatory if DPIA is saved as activated',
				)
				.optional(),
			privacyFramework__retentionComment: z
				.string()
				.describe('Field to add comment on the retention period')
				.optional(),
			confidentiality__baselineLikelihood: z
				.enum(['likely', 'limited', 'maximum', 'negligible', 'unlikely'])
				.describe('Baselinelikelihood')
				.optional(),
			confidentiality__plannedTomsComment: z
				.string()
				.describe(
					'Comment to add additional information about planned TOMs to prevent confidentiality risk',
				)
				.optional(),
			confidentiality__riskSourcesComment: z
				.string()
				.describe(
					'Comment to add additional information about the confidentiality risk sources',
				)
				.optional(),
			privacyFramework__additionalComment: z
				.string()
				.describe(
					'Field to add more information related to the privacy framework of the DPIA',
				)
				.optional(),
			privacyFramework__purposeLimitation: z
				.string()
				.describe(
					'Field to explain the clear, specific and legitimate purpose of conducting the processing activity. Mandatory if DPIA is saved as activated',
				)
				.optional(),
			availability__implementedTomsComment: z
				.string()
				.describe(
					'Comment to add additional information about the implemented TOMs',
				)
				.optional(),
			availability__residualRiskLikelihood: z
				.enum(['likely', 'limited', 'maximum', 'negligible', 'unlikely'])
				.describe('Residualrisklikelihood')
				.optional(),
			confidentiality__residualRiskComment: z
				.string()
				.describe(
					'Comment to add additional information about the residual risk of the confidentiality',
				)
				.optional(),
			confidentiality__residualRiskSeverity: z
				.enum(['high', 'low', 'medium', 'very_high', 'very_low'])
				.describe('Represents the severity of a risk')
				.optional(),
			privacyFramework__dataRightsExercised: z
				.string()
				.describe(
					'Field to describe how do data subjects exercise their data subject rights? Mandatory if DPIA is saved as activated',
				)
				.optional(),
			confidentiality__implementedTomsComment: z
				.string()
				.describe(
					'Comment to add additional information about implemented TOMs to prevent confidentiality risk',
				)
				.optional(),
			confidentiality__residualRiskLikelihood: z
				.enum(['likely', 'limited', 'maximum', 'negligible', 'unlikely'])
				.describe('Residualrisklikelihood')
				.optional(),
		})
		.strict(),
	createProcessingActivity: z
		.object({
			name: z.string().describe('Name of the processing activity'),
			owner: z.string().describe('Owner').optional(),
			active: z
				.boolean()
				.describe(
					'Flag to create the processing activity as activated or draft',
				),
			assets: z
				.array(z.string())
				.describe('List assets ids related to the processing activity.')
				.optional(),
			modelId: z.string().describe('Modelid').optional(),
			purpose: z.string().describe('Purpose').optional(),
			language: z
				.enum([
					'ar',
					'de',
					'en',
					'es',
					'es-EC',
					'es-MX',
					'fr',
					'hi',
					'it',
					'ja',
					'pt',
					'zh',
				])
				.describe('Language')
				.optional(),
			createdAt: z.number().int().describe('Createdat').optional(),
			dataTypes: z.array(z.string()).describe('Datatypes').optional(),
			infotypes: z
				.array(z.string())
				.describe('List of info types related with the processing activity.')
				.optional(),
			updatedAt: z.number().int().describe('Updatedat').optional(),
			recipients: z
				.array(
					z
						.object({
							role: z
								.array(
									z.enum([
										'controller',
										'independent_controller',
										'joint_controller',
										'processor',
										'sub_processor',
									]),
								)
								.describe(
									'Role of the recipient for this processing activity. The role of a recipient can be different between processing activities',
								),
							comment: z.string().describe('Comment').optional(),
							recipientId: z.string().describe('Identifier of the recipient'),
						})
						.passthrough()
						.describe(
							'Request schema for `CreateProcessingActivityrecipients`',
						),
				)
				.describe('List of recipients related with the processing activity.')
				.optional(),
			companyRole: z
				.array(
					z.enum([
						'controller',
						'independent_controller',
						'joint_controller',
						'processor',
						'sub_processor',
					]),
				)
				.describe('Companyrole')
				.optional(),
			dataSources: z.array(z.string()).describe('Datasources').optional(),
			departments: z
				.array(z.string())
				.describe('List departments related with the processing activity.')
				.optional(),
			lawfulBasis: z
				.array(
					z
						.object({
							comment: z.string().describe('Comment').optional(),
							lawfulnessType: z
								.enum([
									'consent_person_concerned',
									'contract',
									'legal_obligation',
									'legitimate_interest',
									'public_interest',
									'stakeholder_vital_interest',
								])
								.describe('Represents a Lawful Basis'),
						})
						.passthrough()
						.describe(
							'Request schema for `CreateProcessingActivitylawfulBasis`',
						),
				)
				.describe('List of Lawfulness types affected by a processing activity')
				.optional(),
			dataSubjects: z
				.array(z.string())
				.describe('List of Data Subjects affected by the processing activity')
				.optional(),
			isDataStored: z
				.boolean()
				.describe('Indicates if you store the data.')
				.optional(),
			translations: z
				.object({ additionalProperties: z.object({}).passthrough().optional() })
				.passthrough()
				.describe('Translations')
				.optional(),
			contactPerson: z
				.string()
				.describe('Contact person for the processing activity.')
				.optional(),
			additionalInfo: z
				.string()
				.describe('Text to add more information about the processing activity')
				.optional(),
			infotypeVolume: z
				.enum(['0-1000', '1000-10000', '10000-100000', '100000+'])
				.describe('Ranges of the processed infotype volume.')
				.optional(),
			managementMethods: z
				.array(
					z
						.object({
							email: z.string().describe('Email').optional(),
							methodType: z
								.enum(['email', 'postal'])
								.describe(
									'Management method type of data subject access requests.',
								),
							postalAddress__city: z.string().describe('City').optional(),
							postalAddress__street: z.string().describe('Street').optional(),
							postalAddress__country: z
								.string()
								.describe('2 letter code that identifies a country.')
								.optional(),
							postalAddress__zipcode: z
								.string()
								.describe('The zipcode of the headquarter')
								.optional(),
						})
						.passthrough()
						.describe(
							'Request schema for `CreateProcessingActivitymanagementMethods`',
						),
				)
				.describe('Managementmethods')
				.optional(),
			infotypeCategories: z
				.array(z.string())
				.describe(
					'List of info types categories related with the processing activity.',
				)
				.optional(),
			showOnRopaDocument: z.boolean().describe('Showonropadocument').optional(),
			additionalInfoFiles: z
				.array(z.string())
				.describe('List of uploaded file ids.')
				.optional(),
			processingFrequency: z
				.enum(['is_systematic', 'not_systematic'])
				.describe('Data processing frequency.')
				.optional(),
			dataFlowRelationships: z
				.array(
					z
						.object({
							to__type: z
								.enum([
									'MyOrganisation',
									'dataSource',
									'recipient',
									'specificProcessingActivity',
								])
								.describe('Type')
								.optional(),
							to__value: z.string().describe('Value').optional(),
							from__type: z
								.enum([
									'MyOrganisation',
									'dataSource',
									'recipient',
									'specificProcessingActivity',
								])
								.describe('Type')
								.optional(),
							from__value: z.string().describe('Value').optional(),
						})
						.passthrough()
						.describe(
							'Request schema for `CreateProcessingActivitydataFlowRelationships`',
						),
				)
				.describe('Dataflowrelationships')
				.optional(),
			retentionPeriod__unit: z
				.enum(['day', 'month', 'week', 'year'])
				.describe('Unit of time that is used for retention period')
				.optional(),
			retentionPeriodComment: z
				.string()
				.describe('Retentionperiodcomment')
				.optional(),
			retentionPeriod__value: z.number().int().describe('Value').optional(),
			areAccessRequestsManaged: z
				.boolean()
				.describe('Indicates if the data subject access requests are managed.')
				.optional(),
			processingFrequencyComment: z
				.string()
				.describe('Processingfrequencycomment')
				.optional(),
			processingActivitiesAsDataSources: z
				.array(z.string())
				.describe('Processingactivitiesasdatasources')
				.optional(),
		})
		.strict(),
	createProcessingActivityThreshold: z
		.object({
			status: z
				.enum(['activated', 'draft'])
				.describe('Status of the threshold. Can be draft or activated.')
				.optional(),
			comment: z
				.string()
				.describe('Additional information related to the Threshold')
				.optional(),
			additionalComment: z.boolean().describe('Additionalcomment').optional(),
			processingActivityId: z
				.string()
				.describe(
					'Identifier of the processing activity for which the threshold will be created',
				),
			largeScaleObservation: z
				.boolean()
				.describe('Largescaleobservation')
				.optional(),
			sensitiveOrSpecialData: z
				.boolean()
				.describe('Sensitiveorspecialdata')
				.optional(),
			rightsRiskProcessingData: z
				.boolean()
				.describe('Rightsriskprocessingdata')
				.optional(),
			freedomRiskProcessingData: z
				.boolean()
				.describe('Freedomriskprocessingdata')
				.optional(),
			innovativeTechnologiesUsed: z
				.boolean()
				.describe('Innovativetechnologiesused')
				.optional(),
			processingPersonalDataRisk: z
				.boolean()
				.describe('Processingpersonaldatarisk')
				.optional(),
			specialCategoryDataProcessed: z
				.boolean()
				.describe('Specialcategorydataprocessed')
				.optional(),
			systematicPersonalAssessment: z
				.boolean()
				.describe('Systematicpersonalassessment')
				.optional(),
			processingVulnerableDataSubject: z
				.boolean()
				.describe('Processingvulnerabledatasubject')
				.optional(),
		})
		.strict(),
	createThresholdForProcessingActivity: z
		.object({
			status: z
				.enum(['activated', 'draft'])
				.describe('Status of the threshold. Can be draft or activated.')
				.optional(),
			comment: z
				.string()
				.describe('Additional information related to the Threshold')
				.optional(),
			blacklist: z
				.boolean()
				.describe(
					'Indicates if the data processing is included in a black list',
				)
				.optional(),
			createdAt: z.number().int().describe('Createdat').optional(),
			updatedAt: z.number().int().describe('Updatedat').optional(),
			translations: z
				.object({ additionalProperties: z.object({}).passthrough().optional() })
				.passthrough()
				.describe('Translations')
				.optional(),
			processingActivityId: z
				.string()
				.describe(
					'Identifier of the processing activity for which the threshold will be created',
				),
			classifyingDataSubject: z
				.boolean()
				.describe(
					'Indicates if this data processing is assessing or classifying data subjects',
				)
				.optional(),
			automatedDecisionMaking: z
				.boolean()
				.describe(
					'Indicates if there is automated decision-making with legal effect, or similarly significant effect involved',
				)
				.optional(),
			largeScaleDataProcessing: z
				.boolean()
				.describe('Indicates if is a large scale data processing')
				.optional(),
			innovativeTechnologiesUsed: z
				.boolean()
				.describe('Indicates if there are innovative technologies used')
				.optional(),
			matchingMergingRecordsInvolved: z
				.boolean()
				.describe(
					'Indicates if there is matching or merging of the records involved',
				)
				.optional(),
			processingVulnerableDataSubject: z
				.boolean()
				.describe(
					'Indicates if there is processing of data of vulnerable data subjects',
				)
				.optional(),
			systematicMonitoringDataSubject: z
				.boolean()
				.describe(
					'Indicates if there is systematic monitoring of data subjects involved',
				)
				.optional(),
			largeScaleProcessingSensitiveData: z
				.boolean()
				.describe(
					'Indicates if the data processing is large scale processing of sensitive data.',
				)
				.optional(),
			monitoringPubliclyAccessibleAreas: z
				.boolean()
				.describe(
					'Indicates if the data processing is systematic and large scale monitoring of publicly accessible areas involved.',
				)
				.optional(),
			processingConfidentialSensitiveData: z
				.boolean()
				.describe(
					'Indicates if there is processing of confidential or sensitive data',
				)
				.optional(),
			preventDataSubjectsExercisingTheirRights: z
				.boolean()
				.describe(
					'Indicates if the data processing prevents the data subjects from exercising their rights, using a service or performing a contract',
				)
				.optional(),
			extensiveAutomatedEvaluationCharacteristics: z
				.boolean()
				.describe(
					'Indicates if the data processing involve any systematic, extensive and automated evaluation of personal characteristics with effect for the data subjects.',
				)
				.optional(),
		})
		.strict(),
	deleteDpiaById: z
		.object({ dpiaId: z.string().describe('Identifier of the DPIA') })
		.strict(),
	deleteLopdpThresholdById: z
		.object({
			lopdpThresholdId: z.string().describe('Identifier of the Threshold'),
		})
		.strict(),
	deleteProcessingActivityById: z
		.object({
			processingActivityId: z
				.string()
				.describe('Identifier of the Processing Activity'),
		})
		.strict(),
	deleteThresholdById: z
		.object({ thresholdId: z.string().describe('Identifier of the Threshold') })
		.strict(),
	exportProcessingActivitiesList: z
		.object({
			language: z
				.enum([
					'ar',
					'de',
					'en',
					'es',
					'es-EC',
					'es-MX',
					'fr',
					'hi',
					'it',
					'ja',
					'pt',
					'zh',
				])
				.describe('Language'),
			exportTypes: z
				.array(z.enum(['csv', 'doc', 'pdf']))
				.describe('Exporttypes'),
			filter__owners: z.array(z.string()).describe('Owners').optional(),
			filter__search: z.string().describe('Search').optional(),
			filter__status: z.array(z.string()).describe('Status').optional(),
			filter__employees: z.array(z.string()).describe('Employees').optional(),
			filter__infotypes: z.array(z.string()).describe('Infotypes').optional(),
			filter__recipients: z.array(z.string()).describe('Recipients').optional(),
			filter__departments: z
				.array(z.string())
				.describe('Departments')
				.optional(),
			filter__dataSubjects: z
				.array(z.string())
				.describe('Datasubjects')
				.optional(),
			filter__processingActivityId: z
				.string()
				.describe('Processingactivityid')
				.optional(),
		})
		.strict(),
	getThresholdById: z
		.object({ thresholdId: z.string().describe('Identifier of the Threshold') })
		.strict(),
	listProcessingActivities: z
		.object({
			pageSize: z
				.number()
				.int()
				.describe(
					'The maximum number of records to return per API call. If more records are available, the response will be truncated and will contain a "nextToken" value, which can be used to return additional records.',
				)
				.optional(),
			nextToken: z
				.string()
				.describe(
					'The `nextToken` from the last page of results to retrieve the next page of results.',
				)
				.optional(),
			sort__order: z.enum(['ASC', 'DESC']).describe('Order').optional(),
			sort__column: z
				.string()
				.describe('The column name to sort on.')
				.optional(),
			filter__assets: z.array(z.string()).describe('Assets').optional(),
			filter__owners: z.array(z.string()).describe('Owners').optional(),
			filter__search: z
				.string()
				.describe('Free-form text search to apply to processing activity name.')
				.optional(),
			filter__status: z.array(z.string()).describe('Status').optional(),
			filter__dataTypes: z.array(z.string()).describe('Datatypes').optional(),
			filter__employees: z.array(z.string()).describe('Employees').optional(),
			filter__infotypes: z.array(z.string()).describe('Infotypes').optional(),
			filter__languages: z.array(z.string()).describe('Languages').optional(),
			filter__recipients: z.array(z.string()).describe('Recipients').optional(),
			filter__dataSources: z
				.array(z.string())
				.describe('Datasources')
				.optional(),
			filter__departments: z
				.array(z.string())
				.describe('Departments')
				.optional(),
			filter__companyRoles: z
				.array(z.string())
				.describe('Companyroles')
				.optional(),
			filter__dataSubjects: z
				.array(z.string())
				.describe('Datasubjects')
				.optional(),
			filter__paAsDataSource: z
				.array(z.string())
				.describe('Paasdatasource')
				.optional(),
			filter__infotypeCategories: z
				.array(z.string())
				.describe('Infotypecategories')
				.optional(),
		})
		.strict(),
	listProcessingActivitiesFilters: z
		.object({
			filterType: z
				.enum([
					'asset',
					'companyRole',
					'dataSubject',
					'department',
					'employee',
					'owner',
					'recipient',
					'status',
				])
				.describe('Type of filter to retrieve options for'),
		})
		.strict(),
	listTomsWithFilterAndPaginationOptions: z
		.object({
			pageSize: z
				.number()
				.int()
				.describe(
					'The maximum number of records to return per API call. If more records are available, the response will be truncated and will contain a "nextToken" value, which can be used to return additional records.',
				)
				.optional(),
			nextToken: z
				.string()
				.describe(
					'The `nextToken` from the last page of results to retrieve the next page of results.',
				)
				.optional(),
			sort__order: z.enum(['ASC', 'DESC']).describe('Order').optional(),
			filter__list: z.array(z.string()).describe('List').optional(),
			filter__type: z.array(z.string()).describe('Type').optional(),
			sort__column: z
				.string()
				.describe('The column name to sort on.')
				.optional(),
			filter__tomId: z.array(z.string()).describe('Tomid').optional(),
			filter__search: z
				.string()
				.describe('Free-form text search to apply to the toms name.')
				.optional(),
			filter__status: z.array(z.string()).describe('Status').optional(),
			filter__category: z.array(z.string()).describe('Category').optional(),
			filter__objectCategory: z
				.array(z.string())
				.describe('Objectcategory')
				.optional(),
		})
		.strict(),
	putTomStatusAndNote: z
		.object({
			note: z.string().describe('Note').optional(),
			tomId: z.string().describe('Tomid'),
			status: z
				.enum(['available', 'implemented', 'pendingToImplement'])
				.describe(
					'Status of the TOM, i.e. whether the TOM is already implemented, implementation is pending, or the TOM is not implemented.',
				),
			documentFiles: z
				.array(z.string())
				.describe('Uploaded file id list.')
				.optional(),
		})
		.strict(),
	retrieveDpiaById: z
		.object({ dpiaId: z.string().describe('Identifier of the DPIA') })
		.strict(),
	retrieveLopdpThresholdById: z
		.object({
			lopdpThresholdId: z.string().describe('Identifier of the Threshold'),
		})
		.strict(),
	retrieveProcessingActivityById: z
		.object({
			processingActivityId: z
				.string()
				.describe('Identifier of the Processing Activity'),
		})
		.strict(),
	retrieveTomById: z
		.object({ tomId: z.string().describe('Identifier of the TOM') })
		.strict(),
	updateDpiaById: z
		.object({
			dpiaId: z.string().describe('Identifier of the DPIA'),
			status: z
				.enum(['activated', 'draft'])
				.describe(
					'The status of the DPIA. If a DPIA is saved as activated, several fields are required',
				),
			translations: z
				.object({ additionalProperties: z.object({}).passthrough().optional() })
				.passthrough()
				.describe('Translations')
				.optional(),
			integrity__impacts: z
				.array(
					z
						.object({
							id: z
								.string()
								.describe(
									'Identifier for the impact of confidentiality risk. Can be an UUID if it"s a custom impact or one of the keys of the default impacts that we offer',
								),
							name: z.string().describe('Name').optional(),
						})
						.passthrough()
						.describe('Request schema for `UpdateDpiaByIdimpacts`'),
				)
				.describe(
					'List of impacts that integrity risk can have. At least one element is necessary DPIA is saved as activated',
				)
				.optional(),
			integrity__threats: z
				.array(
					z
						.object({
							id: z
								.string()
								.describe(
									'Identifier for the threat of confidentiality risk. Can be an UUID if it"s a custom threat or one of the keys of the default threats that we offer',
								),
							name: z.string().describe('Name').optional(),
						})
						.passthrough()
						.describe('Request schema for `UpdateDpiaByIdthreats`'),
				)
				.describe(
					'List of threats that integrity risk can have. At least one element is necessary DPIA is saved as activated',
				)
				.optional(),
			additionalInformation: z
				.string()
				.describe('Additionalinformation')
				.optional(),
			availability__impacts: z
				.array(
					z
						.object({
							id: z
								.string()
								.describe(
									'Identifier for the impact of confidentiality risk. Can be an UUID if it"s a custom impact or one of the keys of the default impacts that we offer',
								),
							name: z.string().describe('Name').optional(),
						})
						.passthrough()
						.describe('Request schema for `UpdateDpiaByIdimpacts`'),
				)
				.describe(
					'List of impacts that availability risk can have. At least one element is necessary DPIA is saved as activated',
				)
				.optional(),
			availability__threats: z
				.array(
					z
						.object({
							id: z
								.string()
								.describe(
									'Identifier for the threat of confidentiality risk. Can be an UUID if it"s a custom threat or one of the keys of the default threats that we offer',
								),
							name: z.string().describe('Name').optional(),
						})
						.passthrough()
						.describe('Request schema for `UpdateDpiaByIdthreats`'),
				)
				.describe(
					'List of threats that availability risk can have. At least one element is necessary DPIA is saved as activated',
				)
				.optional(),
			integrity__plannedToms: z
				.array(z.string())
				.describe(
					'List of TOMs that are planned to be implemented to prevent integrity risk. At least one element is necessary DPIA is saved as activated',
				)
				.optional(),
			integrity__riskSources: z
				.array(
					z
						.object({
							id: z
								.string()
								.describe(
									'Identifier for the risk source of a risk. Can be an UUID if it"s a custom risk source or one of the keys of the default risk sources that we offer',
								),
							name: z.string().describe('Name of the risk source').optional(),
						})
						.passthrough()
						.describe('Request schema for `UpdateDpiaByIdriskSources`'),
				)
				.describe(
					'List of risk sources that integrity risk can have. At least one element is necessary DPIA is saved as activated',
				)
				.optional(),
			confidentiality__impacts: z
				.array(
					z
						.object({
							id: z
								.string()
								.describe(
									'Identifier for the impact of confidentiality risk. Can be an UUID if it"s a custom impact or one of the keys of the default impacts that we offer',
								),
							name: z.string().describe('Name').optional(),
						})
						.passthrough()
						.describe('Request schema for `UpdateDpiaByIdimpacts`'),
				)
				.describe(
					'List of impacts that confidentiality risk can have. At least one element is necessary DPIA is saved as activated',
				)
				.optional(),
			confidentiality__threats: z
				.array(
					z
						.object({
							id: z
								.string()
								.describe(
									'Identifier for the threat of confidentiality risk. Can be an UUID if it"s a custom threat or one of the keys of the default threats that we offer',
								),
							name: z.string().describe('Name').optional(),
						})
						.passthrough()
						.describe('Request schema for `UpdateDpiaByIdthreats`'),
				)
				.describe(
					'List of threats that confidentiality risk can have. At least one element is necessary DPIA is saved as activated',
				)
				.optional(),
			availability__plannedToms: z
				.array(z.string())
				.describe(
					'List of TOMs planned to be implemented and that applies to the availability risk. At least one element is necessary DPIA is saved as activated',
				)
				.optional(),
			availability__riskSources: z
				.array(
					z
						.object({
							id: z
								.string()
								.describe(
									'Identifier for the risk source of a risk. Can be an UUID if it"s a custom risk source or one of the keys of the default risk sources that we offer',
								),
							name: z.string().describe('Name of the risk source').optional(),
						})
						.passthrough()
						.describe('Request schema for `UpdateDpiaByIdriskSources`'),
				)
				.describe(
					'List of risk sources that availability risk can have. At least one element is necessary DPIA is saved as activated',
				)
				.optional(),
			integrity__impactsComment: z
				.string()
				.describe(
					'Comment to add additional information about the integrity impacts',
				)
				.optional(),
			integrity__threatsComment: z
				.string()
				.describe(
					'Comment to add additional information about the integrity threats',
				)
				.optional(),
			privacyFramework__consent: z
				.string()
				.describe(
					'Field to describe the measures to ensure that the consent of the data subjects has been obtained and how the given consent can be revoked Mandatory if DPIA is saved as activated and the lawfulness "consent_person_concerned" selected',
				)
				.optional(),
			additionalInformationFiles: z
				.array(z.string())
				.describe('Additionalinformationfiles')
				.optional(),
			integrity__baselineComment: z
				.string()
				.describe(
					'Comment to add additional information about the baseline risk of the integrity',
				)
				.optional(),
			integrity__implementedToms: z
				.array(z.string())
				.describe(
					'List of TOMs that are implemented to prevent integrity risk. At least one element is necessary DPIA is saved as activated',
				)
				.optional(),
			privacyFramework__accuracy: z
				.string()
				.describe(
					'Field to explain if the data processed is accurate, high quality and up-to-date Mandatory if DPIA is saved as activated',
				)
				.optional(),
			integrity__baselineSeverity: z
				.enum(['high', 'low', 'medium', 'very_high', 'very_low'])
				.describe('Represents the severity of a risk')
				.optional(),
			privacyFramework__retention: z
				.boolean()
				.describe(
					'Is the retention period lawful and clearly defined? Mandatory if DPIA is saved as activated',
				)
				.optional(),
			availability__impactsComment: z
				.string()
				.describe('Comment to add additional information about the impact')
				.optional(),
			availability__threatsComment: z
				.string()
				.describe('Comment to add additional information about the threat')
				.optional(),
			confidentiality__plannedToms: z
				.array(z.string())
				.describe(
					'List of TOMs that are planned to be implemented to prevent confidentiality risk. At least one element is necessary DPIA is saved as activated',
				)
				.optional(),
			confidentiality__riskSources: z
				.array(
					z
						.object({
							id: z
								.string()
								.describe(
									'Identifier for the risk source of a risk. Can be an UUID if it"s a custom risk source or one of the keys of the default risk sources that we offer',
								),
							name: z.string().describe('Name of the risk source').optional(),
						})
						.passthrough()
						.describe('Request schema for `UpdateDpiaByIdriskSources`'),
				)
				.describe(
					'List of risk sources that confidentiality risk can have. At least one element is necessary DPIA is saved as activated',
				)
				.optional(),
			availability__baselineComment: z
				.string()
				.describe(
					'Comment to add additional information about the baseline risk of the availablity',
				)
				.optional(),
			availability__implementedToms: z
				.array(z.string())
				.describe(
					'List of implemented TOMs that applies to the availability risk. At least one element is necessary DPIA is saved as activated',
				)
				.optional(),
			integrity__baselineLikelihood: z
				.enum(['likely', 'limited', 'maximum', 'negligible', 'unlikely'])
				.describe('Baselinelikelihood')
				.optional(),
			integrity__plannedTomsComment: z
				.string()
				.describe(
					'Comment to add additional information about planned TOMs to prevent integrity risk',
				)
				.optional(),
			integrity__riskSourcesComment: z
				.string()
				.describe(
					'Comment to add additional information about the integrity risk sources',
				)
				.optional(),
			availability__baselineSeverity: z
				.enum(['high', 'low', 'medium', 'very_high', 'very_low'])
				.describe('Represents the severity of a risk')
				.optional(),
			integrity__residualRiskComment: z
				.string()
				.describe(
					'Comment to add additional information about the residual risk of the integrity',
				)
				.optional(),
			privacyFramework__transparency: z
				.string()
				.describe(
					'Field to describe what kind of notice information is given to data subjects about this processing, and how is it provided to the data subjects? Mandatory if DPIA is saved as activated',
				)
				.optional(),
			confidentiality__impactsComment: z
				.string()
				.describe(
					'Comment to add additional information about the confidentiality risk impacts',
				)
				.optional(),
			confidentiality__threatsComment: z
				.string()
				.describe(
					'Comment to add additional information about the confidentiality risk threats',
				)
				.optional(),
			integrity__residualRiskSeverity: z
				.enum(['high', 'low', 'medium', 'very_high', 'very_low'])
				.describe('Represents the severity of a risk')
				.optional(),
			availability__baselineLikelihood: z
				.enum(['likely', 'limited', 'maximum', 'negligible', 'unlikely'])
				.describe('Baselinelikelihood')
				.optional(),
			availability__plannedTomsComment: z
				.string()
				.describe(
					'Comment to add additional information about the planned TOMs',
				)
				.optional(),
			availability__riskSourcesComment: z
				.string()
				.describe(
					'Comment to add additional information about the availability risk sources',
				)
				.optional(),
			confidentiality__baselineComment: z
				.string()
				.describe(
					'Comment to add additional information about the baseline risk of the confidentiality',
				)
				.optional(),
			confidentiality__implementedToms: z
				.array(z.string())
				.describe(
					'List of TOMs that are implemented to prevent confidentiality risk. At least one element is necessary DPIA is saved as activated',
				)
				.optional(),
			availability__residualRiskComment: z
				.string()
				.describe(
					'Comment to add additional information about the residual risk of the availability',
				)
				.optional(),
			confidentiality__baselineSeverity: z
				.enum(['high', 'low', 'medium', 'very_high', 'very_low'])
				.describe('Represents the severity of a risk')
				.optional(),
			integrity__implementedTomsComment: z
				.string()
				.describe(
					'Comment to add additional information about implemented TOMs to prevent integrity risk',
				)
				.optional(),
			integrity__residualRiskLikelihood: z
				.enum(['likely', 'limited', 'maximum', 'negligible', 'unlikely'])
				.describe('Residualrisklikelihood')
				.optional(),
			availability__residualRiskSeverity: z
				.enum(['high', 'low', 'medium', 'very_high', 'very_low'])
				.describe('Represents the severity of a risk')
				.optional(),
			privacyFramework__dataMinimisation: z
				.string()
				.describe(
					'Field to explain if the data collected adequate, relevant, and limited to what is necessary concerning the purposes for which it is processed Mandatory if DPIA is saved as activated',
				)
				.optional(),
			privacyFramework__retentionComment: z
				.string()
				.describe('Field to add comment on the retention period')
				.optional(),
			confidentiality__baselineLikelihood: z
				.enum(['likely', 'limited', 'maximum', 'negligible', 'unlikely'])
				.describe('Baselinelikelihood')
				.optional(),
			confidentiality__plannedTomsComment: z
				.string()
				.describe(
					'Comment to add additional information about planned TOMs to prevent confidentiality risk',
				)
				.optional(),
			confidentiality__riskSourcesComment: z
				.string()
				.describe(
					'Comment to add additional information about the confidentiality risk sources',
				)
				.optional(),
			privacyFramework__additionalComment: z
				.string()
				.describe(
					'Field to add more information related to the privacy framework of the DPIA',
				)
				.optional(),
			privacyFramework__purposeLimitation: z
				.string()
				.describe(
					'Field to explain the clear, specific and legitimate purpose of conducting the processing activity. Mandatory if DPIA is saved as activated',
				)
				.optional(),
			availability__implementedTomsComment: z
				.string()
				.describe(
					'Comment to add additional information about the implemented TOMs',
				)
				.optional(),
			availability__residualRiskLikelihood: z
				.enum(['likely', 'limited', 'maximum', 'negligible', 'unlikely'])
				.describe('Residualrisklikelihood')
				.optional(),
			confidentiality__residualRiskComment: z
				.string()
				.describe(
					'Comment to add additional information about the residual risk of the confidentiality',
				)
				.optional(),
			confidentiality__residualRiskSeverity: z
				.enum(['high', 'low', 'medium', 'very_high', 'very_low'])
				.describe('Represents the severity of a risk')
				.optional(),
			privacyFramework__dataRightsExercised: z
				.string()
				.describe(
					'Field to describe how do data subjects exercise their data subject rights? Mandatory if DPIA is saved as activated',
				)
				.optional(),
			confidentiality__implementedTomsComment: z
				.string()
				.describe(
					'Comment to add additional information about implemented TOMs to prevent confidentiality risk',
				)
				.optional(),
			confidentiality__residualRiskLikelihood: z
				.enum(['likely', 'limited', 'maximum', 'negligible', 'unlikely'])
				.describe('Residualrisklikelihood')
				.optional(),
		})
		.strict(),
	updateLopdpThresholdById: z
		.object({
			status: z
				.enum(['activated', 'draft'])
				.describe('Status of the threshold. Can be draft or activated.')
				.optional(),
			comment: z
				.string()
				.describe('Additional information related to the Threshold')
				.optional(),
			lopdpThresholdId: z.string().describe('Identifier of the Threshold'),
			additionalComment: z.boolean().describe('Additionalcomment').optional(),
			largeScaleObservation: z
				.boolean()
				.describe('Largescaleobservation')
				.optional(),
			sensitiveOrSpecialData: z
				.boolean()
				.describe('Sensitiveorspecialdata')
				.optional(),
			rightsRiskProcessingData: z
				.boolean()
				.describe('Rightsriskprocessingdata')
				.optional(),
			freedomRiskProcessingData: z
				.boolean()
				.describe('Freedomriskprocessingdata')
				.optional(),
			innovativeTechnologiesUsed: z
				.boolean()
				.describe('Innovativetechnologiesused')
				.optional(),
			processingPersonalDataRisk: z
				.boolean()
				.describe('Processingpersonaldatarisk')
				.optional(),
			specialCategoryDataProcessed: z
				.boolean()
				.describe('Specialcategorydataprocessed')
				.optional(),
			systematicPersonalAssessment: z
				.boolean()
				.describe('Systematicpersonalassessment')
				.optional(),
			processingVulnerableDataSubject: z
				.boolean()
				.describe('Processingvulnerabledatasubject')
				.optional(),
		})
		.strict(),
	updateProcessingActivityDetails: z
		.object({
			name: z.string().describe('Name of the processing activity'),
			owner: z.string().describe('Owner').optional(),
			active: z
				.boolean()
				.describe(
					'Flag to create the processing activity as activated or draft',
				),
			assets: z
				.array(z.string())
				.describe('List assets ids related to the processing activity.')
				.optional(),
			modelId: z.string().describe('Modelid').optional(),
			purpose: z
				.string()
				.describe('Purpose of the processing activity')
				.optional(),
			dataTypes: z.array(z.string()).describe('Datatypes').optional(),
			infotypes: z
				.array(z.string())
				.describe('List of info types related with the processing activity.')
				.optional(),
			recipients: z
				.array(
					z
						.object({
							role: z
								.array(
									z.enum([
										'controller',
										'independent_controller',
										'joint_controller',
										'processor',
										'sub_processor',
									]),
								)
								.describe(
									'Role of the recipient for this processing activity. The role of a recipient can be different between processing activities',
								),
							comment: z.string().describe('Comment').optional(),
							recipientId: z.string().describe('Identifier of the recipient'),
						})
						.passthrough()
						.describe(
							'Request schema for `UpdateProcessingActivityDetailsrecipients`',
						),
				)
				.describe('List of recipients related with the processing activity.')
				.optional(),
			companyRole: z
				.array(
					z.enum([
						'controller',
						'independent_controller',
						'joint_controller',
						'processor',
						'sub_processor',
					]),
				)
				.describe('Companyrole')
				.optional(),
			dataSources: z.array(z.string()).describe('Datasources').optional(),
			departments: z
				.array(z.string())
				.describe('List departments related with the processing activity.')
				.optional(),
			lawfulBasis: z
				.array(
					z
						.object({
							comment: z.string().describe('Comment').optional(),
							lawfulnessType: z
								.enum([
									'consent_person_concerned',
									'contract',
									'legal_obligation',
									'legitimate_interest',
									'public_interest',
									'stakeholder_vital_interest',
								])
								.describe('Represents a Lawful Basis'),
						})
						.passthrough()
						.describe(
							'Request schema for `UpdateProcessingActivityDetailslawfulBasis`',
						),
				)
				.describe('List of Lawfulness types affected by a processing activity')
				.optional(),
			dataSubjects: z
				.array(z.string())
				.describe('List of Data Subjects affected by the processing activity')
				.optional(),
			isDataStored: z
				.boolean()
				.describe('Indicates if you store the data.')
				.optional(),
			translations: z
				.object({ additionalProperties: z.object({}).passthrough().optional() })
				.passthrough()
				.describe('Translations')
				.optional(),
			contactPerson: z
				.string()
				.describe('Contact person for the processing activity.')
				.optional(),
			additionalInfo: z
				.string()
				.describe('Text to add more information about the processing activity')
				.optional(),
			infotypeVolume: z
				.enum(['0-1000', '1000-10000', '10000-100000', '100000+'])
				.describe('Ranges of the processed infotype volume.')
				.optional(),
			managementMethods: z
				.array(
					z
						.object({
							email: z.string().describe('Email').optional(),
							methodType: z
								.enum(['email', 'postal'])
								.describe(
									'Management method type of data subject access requests.',
								),
							postalAddress__city: z.string().describe('City').optional(),
							postalAddress__street: z.string().describe('Street').optional(),
							postalAddress__country: z
								.string()
								.describe('2 letter code that identifies a country.')
								.optional(),
							postalAddress__zipcode: z
								.string()
								.describe('The zipcode of the headquarter')
								.optional(),
						})
						.passthrough()
						.describe(
							'Request schema for `UpdateProcessingActivityDetailsmanagementMethods`',
						),
				)
				.describe('Managementmethods')
				.optional(),
			infotypeCategories: z
				.array(z.string())
				.describe(
					'List of info types categories related with the processing activity.',
				)
				.optional(),
			showOnRopaDocument: z.boolean().describe('Showonropadocument').optional(),
			additionalInfoFiles: z
				.array(z.string())
				.describe('List of uploaded file ids.')
				.optional(),
			processingFrequency: z
				.enum(['is_systematic', 'not_systematic'])
				.describe('Data processing frequency.')
				.optional(),
			processingActivityId: z
				.string()
				.describe('Identifier of the Processing Activity'),
			dataFlowRelationships: z
				.array(
					z
						.object({
							to__type: z
								.enum([
									'MyOrganisation',
									'dataSource',
									'recipient',
									'specificProcessingActivity',
								])
								.describe('Type')
								.optional(),
							to__value: z.string().describe('Value').optional(),
							from__type: z
								.enum([
									'MyOrganisation',
									'dataSource',
									'recipient',
									'specificProcessingActivity',
								])
								.describe('Type')
								.optional(),
							from__value: z.string().describe('Value').optional(),
						})
						.passthrough()
						.describe(
							'Request schema for `UpdateProcessingActivityDetailsdataFlowRelationships`',
						),
				)
				.describe('Dataflowrelationships')
				.optional(),
			retentionPeriod__unit: z
				.enum(['day', 'month', 'week', 'year'])
				.describe('Unit of time that is used for retention period')
				.optional(),
			retentionPeriodComment: z
				.string()
				.describe('Additional information related to the retention period')
				.optional(),
			retentionPeriod__value: z.number().int().describe('Value').optional(),
			areAccessRequestsManaged: z
				.boolean()
				.describe('Indicates if the data subject access requests are managed.')
				.optional(),
			processingFrequencyComment: z
				.string()
				.describe('Processingfrequencycomment')
				.optional(),
			processingActivitiesAsDataSources: z
				.array(z.string())
				.describe('Processingactivitiesasdatasources')
				.optional(),
		})
		.strict(),
	updateThresholdById: z
		.object({
			status: z
				.enum(['activated', 'draft'])
				.describe('Status of the threshold. Can be draft or activated.')
				.optional(),
			comment: z
				.string()
				.describe('Additional information related to the Threshold')
				.optional(),
			blacklist: z
				.boolean()
				.describe(
					'Indicates if the data processing is included in a black list',
				)
				.optional(),
			thresholdId: z.string().describe('Identifier of the Threshold'),
			translations: z
				.object({ additionalProperties: z.object({}).passthrough().optional() })
				.passthrough()
				.describe('Translations')
				.optional(),
			classifyingDataSubject: z
				.boolean()
				.describe(
					'Indicates if this data processing is assessing or classifying data subjects',
				)
				.optional(),
			automatedDecisionMaking: z
				.boolean()
				.describe(
					'Indicates if there is automated decision-making with legal effect, or similarly significant effect involved',
				)
				.optional(),
			largeScaleDataProcessing: z
				.boolean()
				.describe('Indicates if is a large scale data processing')
				.optional(),
			innovativeTechnologiesUsed: z
				.boolean()
				.describe('Indicates if there are innovative technologies used')
				.optional(),
			matchingMergingRecordsInvolved: z
				.boolean()
				.describe(
					'Indicates if there is matching or merging of the records involved',
				)
				.optional(),
			processingVulnerableDataSubject: z
				.boolean()
				.describe(
					'Indicates if there is processing of data of vulnerable data subjects',
				)
				.optional(),
			systematicMonitoringDataSubject: z
				.boolean()
				.describe(
					'Indicates if there is systematic monitoring of data subjects involved',
				)
				.optional(),
			largeScaleProcessingSensitiveData: z
				.boolean()
				.describe(
					'Indicates if the data processing is large scale processing of sensitive data.',
				)
				.optional(),
			monitoringPubliclyAccessibleAreas: z
				.boolean()
				.describe(
					'Indicates if the data processing is systematic and large scale monitoring of publicly accessible areas involved.',
				)
				.optional(),
			processingConfidentialSensitiveData: z
				.boolean()
				.describe(
					'Indicates if there is processing of confidential or sensitive data',
				)
				.optional(),
			preventDataSubjectsExercisingTheirRights: z
				.boolean()
				.describe(
					'Indicates if the data processing prevents the data subjects from exercising their rights, using a service or performing a contract',
				)
				.optional(),
			extensiveAutomatedEvaluationCharacteristics: z
				.boolean()
				.describe(
					'Indicates if the data processing involve any systematic, extensive and automated evaluation of personal characteristics with effect for the data subjects.',
				)
				.optional(),
		})
		.strict(),
	addDiscoveredRecipients: z
		.object({
			discoveredRecipientIds: z
				.array(z.string())
				.describe(
					'Identifiers of the discovered recipients to add as recipients.',
				),
		})
		.strict(),
	archiveDiscoveredRecipient: z
		.object({
			discoveredRecipientId: z
				.string()
				.describe('Identifier of the discovered recipient.'),
		})
		.strict(),
	createRecipientWithDetails: z
		.object({
			dpa: z
				.string()
				.describe('The url to the DPA of the recipient')
				.optional(),
			name: z
				.string()
				.describe(
					'Name of the recipient. Has to be unique, 2 different recipients can"t have the same name.',
				),
			role: z
				.array(
					z.enum([
						'controller',
						'independent_controller',
						'joint_controller',
						'processor',
						'sub_processor',
					]),
				)
				.describe('Role')
				.optional(),
			state: z
				.enum([
					'AK',
					'AL',
					'AR',
					'AZ',
					'CA',
					'CO',
					'CT',
					'DC',
					'DE',
					'FL',
					'GA',
					'HI',
					'IA',
					'ID',
					'IL',
					'IN',
					'KS',
					'KY',
					'LA',
					'MA',
					'MD',
					'ME',
					'MI',
					'MN',
					'MO',
					'MS',
					'MT',
					'NC',
					'ND',
					'NE',
					'NH',
					'NJ',
					'NM',
					'NV',
					'NY',
					'OH',
					'OK',
					'OR',
					'PA',
					'RI',
					'SC',
					'SD',
					'TN',
					'TX',
					'UT',
					'VA',
					'VT',
					'WA',
					'WI',
					'WV',
					'WY',
				])
				.describe(
					'2 letter code that identifies the state of the recipient. It only applies when the recipient country is US',
				)
				.optional(),
			status: z
				.enum(['archived', 'validated'])
				.describe('The status of the recipient. Can be archived or validated.'),
			country: z
				.string()
				.describe('2 letter code that identifies a country.')
				.optional(),
			dpaFiles: z
				.array(z.string())
				.describe('List of uploaded file ids.')
				.optional(),
			createdAt: z.number().int().describe('Createdat').optional(),
			dpaStatus: z
				.enum(['attached', 'notRequired', 'requested'])
				.describe(
					'The status of the DPA of the recipient. Attached if the DPA is provided. Not required when it"s not necessary to provide the information. Requested when we ask for the DPA and we are waiting for it.',
				)
				.optional(),
			updatedAt: z.number().int().describe('Updatedat').optional(),
			categories: z
				.array(
					z.enum([
						'ITInfrastructure',
						'accountingSoftware',
						'adminDepartment',
						'advertising',
						'airlines',
						'analytics',
						'apps',
						'artificialIntelligenceAi',
						'assetManagement',
						'audit',
						'automotive',
						'b2b',
						'bankCards',
						'bigData',
						'businessDevelopment',
						'businessIntelligence',
						'businessManagement',
						'chat',
						'cloudComputing',
						'cloudDataServices',
						'cloudManagement',
						'cloudSecurity',
						'cloudStorage',
						'communities',
						'compliance',
						'construction',
						'consulting',
						'consumerElectronics',
						'content',
						'coreBankingSystem',
						'crmSoftware',
						'cryptoCurrency',
						'customerServiceProvider',
						'customerSupport',
						'cyberSecurity',
						'dataIntegration',
						'dataManagement',
						'dataStorage',
						'dataVisualization',
						'database',
						'developerTools',
						'devops',
						'digitalMedia',
						'documentManagement',
						'e-learning',
						'eCommerce',
						'edtech',
						'education',
						'electronics',
						'emailMarketing',
						'emailServices',
						'energy',
						'enterprise',
						'enterpriseSoftware',
						'erpSoftware',
						'events',
						'eventsSoftware',
						'fileSharing',
						'financialCrime',
						'financialServices',
						'fintech',
						'fitness',
						'foodAndBeverage',
						'government',
						'healthCare',
						'hospitality',
						'hosting',
						'identityManagement',
						'informationTechnology',
						'insurance',
						'insurtech',
						'internalDepartment',
						'internetOfThings',
						'itDepartment',
						'lawEnforcement',
						'lawServices',
						'legalDepartment',
						'logistics',
						'machineLearning',
						'management',
						'marketResearch',
						'marketingAutomation',
						'marketingDepartment',
						'marketingSoftware',
						'marketingTools',
						'marketplace',
						'medical',
						'messagingServices',
						'mobileApps',
						'mobilityEquipment',
						'networkSecurity',
						'news',
						'nonProfit',
						'officeApplications',
						'officesApps',
						'onlinePortals',
						'orderingSoftware',
						'other',
						'outsourcing',
						'passwordManagement',
						'paymentPlatform',
						'payrollServices',
						'pharmaceuticals',
						'physicalSecurity',
						'physicalStorage',
						'prDepartment',
						'preventionRisks',
						'productionDepartment',
						'productivityTools',
						'professionalServices',
						'projectManagement',
						'propertyAdministration',
						'publicAdministration',
						'publishing',
						'realEstate',
						'regulatoryReporting',
						'retail',
						'riskManagement',
						'rrhhDepartment',
						'rrhhManagement',
						'rrhhSoftware',
						'saas',
						'searchEngine',
						'security',
						'securityServices',
						'sellDepartment',
						'servicesPlatform',
						'smallAndMediumBusinesses',
						'socialMedia',
						'supplyChainManagement',
						'taxManagement',
						'telecommunications',
						'ticServices',
						'tourism',
						'tracking',
						'trading',
						'training',
						'transportation',
						'travel',
						'ventureCapital',
						'video',
						'videoStreaming',
						'voip',
						'webDesign',
						'wellness',
					]),
				)
				.describe('list of recipient category')
				.optional(),
			businessName: z
				.string()
				.describe('Business name of the recipient')
				.optional(),
			recipientState: z
				.enum(['active', 'assessment'])
				.describe('Recipientstate')
				.optional(),
			subProcessorIds: z
				.array(z.string())
				.describe('Subprocessorids')
				.optional(),
			recipientModelId: z
				.string()
				.describe(
					'Identifier of the Recipient Model in case that the Recipient is created bases in a Recipient Model',
				)
				.optional(),
			dataStorageLocation: z
				.array(z.string())
				.describe(
					'List of countries where the data related to this recipient are stored',
				),
			recipientWarranties: z
				.array(z.string())
				.describe('List of lawful basis types that applies to the recipient.'),
			fromDiscoveredRecipientId: z
				.string()
				.describe('Fromdiscoveredrecipientid')
				.optional(),
		})
		.strict(),
	deleteRecipientById: z
		.object({ recipientId: z.string().describe('Identifier of the Recipient') })
		.strict(),
	exportRecipientsListWithFilter: z
		.object({
			exportTypes: z
				.array(z.enum(['csv', 'doc', 'pdf']))
				.describe('Exporttypes'),
			filter__role: z.array(z.string()).describe('Role').optional(),
			filter__search: z
				.string()
				.describe('Free-form text search to apply to the Recipient name.')
				.optional(),
			filter__status: z
				.enum(['archived', 'validated'])
				.describe('The status of the recipient. Can be archived or validated.')
				.optional(),
			filter__usedIn: z.object({}).passthrough().describe('Usedin').optional(),
			filter__categories: z
				.array(
					z.enum([
						'ITInfrastructure',
						'accountingSoftware',
						'adminDepartment',
						'advertising',
						'airlines',
						'analytics',
						'apps',
						'artificialIntelligenceAi',
						'assetManagement',
						'audit',
						'automotive',
						'b2b',
						'bankCards',
						'bigData',
						'businessDevelopment',
						'businessIntelligence',
						'businessManagement',
						'chat',
						'cloudComputing',
						'cloudDataServices',
						'cloudManagement',
						'cloudSecurity',
						'cloudStorage',
						'communities',
						'compliance',
						'construction',
						'consulting',
						'consumerElectronics',
						'content',
						'coreBankingSystem',
						'crmSoftware',
						'cryptoCurrency',
						'customerServiceProvider',
						'customerSupport',
						'cyberSecurity',
						'dataIntegration',
						'dataManagement',
						'dataStorage',
						'dataVisualization',
						'database',
						'developerTools',
						'devops',
						'digitalMedia',
						'documentManagement',
						'e-learning',
						'eCommerce',
						'edtech',
						'education',
						'electronics',
						'emailMarketing',
						'emailServices',
						'energy',
						'enterprise',
						'enterpriseSoftware',
						'erpSoftware',
						'events',
						'eventsSoftware',
						'fileSharing',
						'financialCrime',
						'financialServices',
						'fintech',
						'fitness',
						'foodAndBeverage',
						'government',
						'healthCare',
						'hospitality',
						'hosting',
						'identityManagement',
						'informationTechnology',
						'insurance',
						'insurtech',
						'internalDepartment',
						'internetOfThings',
						'itDepartment',
						'lawEnforcement',
						'lawServices',
						'legalDepartment',
						'logistics',
						'machineLearning',
						'management',
						'marketResearch',
						'marketingAutomation',
						'marketingDepartment',
						'marketingSoftware',
						'marketingTools',
						'marketplace',
						'medical',
						'messagingServices',
						'mobileApps',
						'mobilityEquipment',
						'networkSecurity',
						'news',
						'nonProfit',
						'officeApplications',
						'officesApps',
						'onlinePortals',
						'orderingSoftware',
						'other',
						'outsourcing',
						'passwordManagement',
						'paymentPlatform',
						'payrollServices',
						'pharmaceuticals',
						'physicalSecurity',
						'physicalStorage',
						'prDepartment',
						'preventionRisks',
						'productionDepartment',
						'productivityTools',
						'professionalServices',
						'projectManagement',
						'propertyAdministration',
						'publicAdministration',
						'publishing',
						'realEstate',
						'regulatoryReporting',
						'retail',
						'riskManagement',
						'rrhhDepartment',
						'rrhhManagement',
						'rrhhSoftware',
						'saas',
						'searchEngine',
						'security',
						'securityServices',
						'sellDepartment',
						'servicesPlatform',
						'smallAndMediumBusinesses',
						'socialMedia',
						'supplyChainManagement',
						'taxManagement',
						'telecommunications',
						'ticServices',
						'tourism',
						'tracking',
						'trading',
						'training',
						'transportation',
						'travel',
						'ventureCapital',
						'video',
						'videoStreaming',
						'voip',
						'webDesign',
						'wellness',
					]),
				)
				.describe('list of recipient category')
				.optional(),
			filter__departments: z
				.array(z.string())
				.describe('Departments')
				.optional(),
			filter__recipientIds: z
				.array(z.string())
				.describe('Recipientids')
				.optional(),
			filter__recipientState: z
				.array(z.string())
				.describe('Recipientstate')
				.optional(),
			filter__discoverySource: z
				.array(z.string())
				.describe('Discoverysource')
				.optional(),
			filter__subProcessorIds: z
				.array(z.string())
				.describe('Subprocessorids')
				.optional(),
			filter__automationStatus: z
				.array(z.string())
				.describe('Automationstatus')
				.optional(),
			filter__recipientWarranties: z
				.array(z.string())
				.describe('Recipientwarranties')
				.optional(),
			filter__withNoProcessingActivity: z
				.boolean()
				.describe('Withnoprocessingactivity')
				.optional(),
		})
		.strict(),
	filterRecipientsList: z.object({}).strict(),
	listDiscoveredRecipients: z
		.object({
			pageSize: z
				.number()
				.int()
				.describe(
					'The maximum number of records to return per API call. If more records are available, the response will be truncated and will contain a "nextToken" value, which can be used to return additional records.',
				)
				.optional(),
			nextToken: z
				.string()
				.describe(
					'The `nextToken` from the last page of results to retrieve the next page of results.',
				)
				.optional(),
			sort__order: z.enum(['ASC', 'DESC']).describe('Order').optional(),
			sort__column: z
				.string()
				.describe('The column name to sort on.')
				.optional(),
			filter__search: z
				.string()
				.describe(
					'Free-form text search to apply to the DiscoveredRecipient name.',
				)
				.optional(),
			filter__status: z
				.enum(['ignored', 'new'])
				.describe(
					'Status of the discovered recipient. Can be new or ignored if it"s marked as ignored.',
				)
				.optional(),
			filter__discoverySource: z
				.array(z.string())
				.describe('Discoverysource')
				.optional(),
		})
		.strict(),
	listFilterOptionsForRecipients: z
		.object({
			filterType: z.enum(['categories', 'role']).describe('Filtertype'),
		})
		.strict(),
	listOrFilterRecipients: z
		.object({
			pageSize: z
				.number()
				.int()
				.describe(
					'The maximum number of records to return per API call. If more records are available, the response will be truncated and will contain a "nextToken" value, which can be used to return additional records.',
				)
				.optional(),
			nextToken: z
				.string()
				.describe(
					'The `nextToken` from the last page of results to retrieve the next page of results.',
				)
				.optional(),
			sort__order: z.enum(['ASC', 'DESC']).describe('Order').optional(),
			filter__role: z.array(z.string()).describe('Role').optional(),
			sort__column: z
				.string()
				.describe('The column name to sort on.')
				.optional(),
			filter__search: z
				.string()
				.describe('Free-form text search to apply to the Recipient name.')
				.optional(),
			filter__status: z
				.enum(['archived', 'validated'])
				.describe('The status of the recipient. Can be archived or validated.')
				.optional(),
			filter__usedIn: z.object({}).passthrough().describe('Usedin').optional(),
			filter__categories: z
				.array(
					z.enum([
						'ITInfrastructure',
						'accountingSoftware',
						'adminDepartment',
						'advertising',
						'airlines',
						'analytics',
						'apps',
						'artificialIntelligenceAi',
						'assetManagement',
						'audit',
						'automotive',
						'b2b',
						'bankCards',
						'bigData',
						'businessDevelopment',
						'businessIntelligence',
						'businessManagement',
						'chat',
						'cloudComputing',
						'cloudDataServices',
						'cloudManagement',
						'cloudSecurity',
						'cloudStorage',
						'communities',
						'compliance',
						'construction',
						'consulting',
						'consumerElectronics',
						'content',
						'coreBankingSystem',
						'crmSoftware',
						'cryptoCurrency',
						'customerServiceProvider',
						'customerSupport',
						'cyberSecurity',
						'dataIntegration',
						'dataManagement',
						'dataStorage',
						'dataVisualization',
						'database',
						'developerTools',
						'devops',
						'digitalMedia',
						'documentManagement',
						'e-learning',
						'eCommerce',
						'edtech',
						'education',
						'electronics',
						'emailMarketing',
						'emailServices',
						'energy',
						'enterprise',
						'enterpriseSoftware',
						'erpSoftware',
						'events',
						'eventsSoftware',
						'fileSharing',
						'financialCrime',
						'financialServices',
						'fintech',
						'fitness',
						'foodAndBeverage',
						'government',
						'healthCare',
						'hospitality',
						'hosting',
						'identityManagement',
						'informationTechnology',
						'insurance',
						'insurtech',
						'internalDepartment',
						'internetOfThings',
						'itDepartment',
						'lawEnforcement',
						'lawServices',
						'legalDepartment',
						'logistics',
						'machineLearning',
						'management',
						'marketResearch',
						'marketingAutomation',
						'marketingDepartment',
						'marketingSoftware',
						'marketingTools',
						'marketplace',
						'medical',
						'messagingServices',
						'mobileApps',
						'mobilityEquipment',
						'networkSecurity',
						'news',
						'nonProfit',
						'officeApplications',
						'officesApps',
						'onlinePortals',
						'orderingSoftware',
						'other',
						'outsourcing',
						'passwordManagement',
						'paymentPlatform',
						'payrollServices',
						'pharmaceuticals',
						'physicalSecurity',
						'physicalStorage',
						'prDepartment',
						'preventionRisks',
						'productionDepartment',
						'productivityTools',
						'professionalServices',
						'projectManagement',
						'propertyAdministration',
						'publicAdministration',
						'publishing',
						'realEstate',
						'regulatoryReporting',
						'retail',
						'riskManagement',
						'rrhhDepartment',
						'rrhhManagement',
						'rrhhSoftware',
						'saas',
						'searchEngine',
						'security',
						'securityServices',
						'sellDepartment',
						'servicesPlatform',
						'smallAndMediumBusinesses',
						'socialMedia',
						'supplyChainManagement',
						'taxManagement',
						'telecommunications',
						'ticServices',
						'tourism',
						'tracking',
						'trading',
						'training',
						'transportation',
						'travel',
						'ventureCapital',
						'video',
						'videoStreaming',
						'voip',
						'webDesign',
						'wellness',
					]),
				)
				.describe('list of recipient category')
				.optional(),
			filter__departments: z
				.array(z.string())
				.describe('Departments')
				.optional(),
			filter__recipientIds: z
				.array(z.string())
				.describe('Recipientids')
				.optional(),
			filter__recipientState: z
				.array(z.string())
				.describe('Recipientstate')
				.optional(),
			filter__discoverySource: z
				.array(z.string())
				.describe('Discoverysource')
				.optional(),
			filter__subProcessorIds: z
				.array(z.string())
				.describe('Subprocessorids')
				.optional(),
			filter__automationStatus: z
				.array(z.string())
				.describe('Automationstatus')
				.optional(),
			filter__recipientWarranties: z
				.array(z.string())
				.describe('Recipientwarranties')
				.optional(),
			filter__withNoProcessingActivity: z
				.boolean()
				.describe('Withnoprocessingactivity')
				.optional(),
		})
		.strict(),
	postDiscoveredRecipientById: z
		.object({
			discoveredRecipientId: z.string().describe('Discoveredrecipientid'),
		})
		.strict(),
	retrieveDiscoveredRecipientById: z
		.object({
			discoveredRecipientId: z
				.string()
				.describe('Identifier of the discovered recipient.'),
		})
		.strict(),
	retrieveRecipientDetails: z
		.object({ recipientId: z.string().describe('Identifier of the Recipient') })
		.strict(),
	retrieveRecipientProcessingActivities: z
		.object({
			pageSize: z
				.number()
				.int()
				.describe(
					'The maximum number of records to return per API call. If more records are available, the response will be truncated and will contain a "nextToken" value, which can be used to return additional records.',
				)
				.optional(),
			nextToken: z
				.string()
				.describe(
					'The `nextToken` from the last page of results to retrieve the next page of results.',
				)
				.optional(),
			recipientId: z.string().describe('Identifier of the Recipient'),
			sort__order: z.enum(['ASC', 'DESC']).describe('Order').optional(),
			sort__column: z
				.string()
				.describe('The column name to sort on.')
				.optional(),
		})
		.strict(),
	updateDashboardReportFrequencyAndRecipients: z
		.object({
			roles: z
				.array(
					z.enum([
						'borneo_admin',
						'borneo_analyst',
						'borneo_engineer',
						'compliance_engineer',
						'data_engineer',
						'department_coordinator',
						'no_access_role',
						'privacy_supervisor',
					]),
				)
				.describe('Roles')
				.optional(),
			frequency: z
				.enum([
					'*/30 * * * *',
					'0 */1 * * *',
					'0 */12 * * *',
					'0 */4 * * *',
					'0 */6 * * *',
					'0 */8 * * *',
					'0 0 * * *',
					'0 0 * * 0',
					'0 0 1 * *',
					'0 0 1 1,4,7,10 *',
					'0 0 1 1,7 *',
				])
				.describe(
					'The cron schedule expression to use for a recurring scan. Only a fixed set of cron expressions can be used to run scans at 30 minute, 1 hour, 1 day, or 1 week intervals.',
				)
				.optional(),
			externalEmail: z.array(z.string()).describe('Externalemail').optional(),
			recipientsEmail: z
				.array(z.string())
				.describe('Recipientsemail')
				.optional(),
			dashboardReportId: z.string().describe('Dashboardreportid'),
		})
		.strict(),
	updateRecipientDetailsById: z
		.object({
			dpa: z
				.string()
				.describe('The url to the DPA of the recipient')
				.optional(),
			name: z
				.string()
				.describe(
					'Name of the recipient. Has to be unique, 2 different recipients can"t have the same name.',
				),
			role: z
				.array(
					z.enum([
						'controller',
						'independent_controller',
						'joint_controller',
						'processor',
						'sub_processor',
					]),
				)
				.describe('Role')
				.optional(),
			state: z
				.enum([
					'AK',
					'AL',
					'AR',
					'AZ',
					'CA',
					'CO',
					'CT',
					'DC',
					'DE',
					'FL',
					'GA',
					'HI',
					'IA',
					'ID',
					'IL',
					'IN',
					'KS',
					'KY',
					'LA',
					'MA',
					'MD',
					'ME',
					'MI',
					'MN',
					'MO',
					'MS',
					'MT',
					'NC',
					'ND',
					'NE',
					'NH',
					'NJ',
					'NM',
					'NV',
					'NY',
					'OH',
					'OK',
					'OR',
					'PA',
					'RI',
					'SC',
					'SD',
					'TN',
					'TX',
					'UT',
					'VA',
					'VT',
					'WA',
					'WI',
					'WV',
					'WY',
				])
				.describe(
					'2 letter code that identifies the state of the recipient. It only applies when the recipient country is US',
				)
				.optional(),
			status: z
				.enum(['archived', 'validated'])
				.describe('The status of the recipient. Can be archived or validated.'),
			country: z
				.string()
				.describe('2 letter code that identifies a country.')
				.optional(),
			dpaFiles: z
				.array(z.string())
				.describe('List of uploaded file ids.')
				.optional(),
			dpaStatus: z
				.enum(['attached', 'notRequired', 'requested'])
				.describe(
					'The status of the DPA of the recipient. Attached if the DPA is provided. Not required when it"s not necessary to provide the information. Requested when we ask for the DPA and we are waiting for it.',
				)
				.optional(),
			categories: z
				.array(
					z.enum([
						'ITInfrastructure',
						'accountingSoftware',
						'adminDepartment',
						'advertising',
						'airlines',
						'analytics',
						'apps',
						'artificialIntelligenceAi',
						'assetManagement',
						'audit',
						'automotive',
						'b2b',
						'bankCards',
						'bigData',
						'businessDevelopment',
						'businessIntelligence',
						'businessManagement',
						'chat',
						'cloudComputing',
						'cloudDataServices',
						'cloudManagement',
						'cloudSecurity',
						'cloudStorage',
						'communities',
						'compliance',
						'construction',
						'consulting',
						'consumerElectronics',
						'content',
						'coreBankingSystem',
						'crmSoftware',
						'cryptoCurrency',
						'customerServiceProvider',
						'customerSupport',
						'cyberSecurity',
						'dataIntegration',
						'dataManagement',
						'dataStorage',
						'dataVisualization',
						'database',
						'developerTools',
						'devops',
						'digitalMedia',
						'documentManagement',
						'e-learning',
						'eCommerce',
						'edtech',
						'education',
						'electronics',
						'emailMarketing',
						'emailServices',
						'energy',
						'enterprise',
						'enterpriseSoftware',
						'erpSoftware',
						'events',
						'eventsSoftware',
						'fileSharing',
						'financialCrime',
						'financialServices',
						'fintech',
						'fitness',
						'foodAndBeverage',
						'government',
						'healthCare',
						'hospitality',
						'hosting',
						'identityManagement',
						'informationTechnology',
						'insurance',
						'insurtech',
						'internalDepartment',
						'internetOfThings',
						'itDepartment',
						'lawEnforcement',
						'lawServices',
						'legalDepartment',
						'logistics',
						'machineLearning',
						'management',
						'marketResearch',
						'marketingAutomation',
						'marketingDepartment',
						'marketingSoftware',
						'marketingTools',
						'marketplace',
						'medical',
						'messagingServices',
						'mobileApps',
						'mobilityEquipment',
						'networkSecurity',
						'news',
						'nonProfit',
						'officeApplications',
						'officesApps',
						'onlinePortals',
						'orderingSoftware',
						'other',
						'outsourcing',
						'passwordManagement',
						'paymentPlatform',
						'payrollServices',
						'pharmaceuticals',
						'physicalSecurity',
						'physicalStorage',
						'prDepartment',
						'preventionRisks',
						'productionDepartment',
						'productivityTools',
						'professionalServices',
						'projectManagement',
						'propertyAdministration',
						'publicAdministration',
						'publishing',
						'realEstate',
						'regulatoryReporting',
						'retail',
						'riskManagement',
						'rrhhDepartment',
						'rrhhManagement',
						'rrhhSoftware',
						'saas',
						'searchEngine',
						'security',
						'securityServices',
						'sellDepartment',
						'servicesPlatform',
						'smallAndMediumBusinesses',
						'socialMedia',
						'supplyChainManagement',
						'taxManagement',
						'telecommunications',
						'ticServices',
						'tourism',
						'tracking',
						'trading',
						'training',
						'transportation',
						'travel',
						'ventureCapital',
						'video',
						'videoStreaming',
						'voip',
						'webDesign',
						'wellness',
					]),
				)
				.describe('list of recipient category')
				.optional(),
			recipientId: z.string().describe('Identifier of the Recipient'),
			businessName: z
				.string()
				.describe('Business name of the recipient')
				.optional(),
			recipientState: z
				.enum(['active', 'assessment'])
				.describe('Recipientstate')
				.optional(),
			subProcessorIds: z
				.array(z.string())
				.describe('Subprocessorids')
				.optional(),
			automationStatus: z
				.enum(['created', 'ignored', 'new'])
				.describe('Automationstatus')
				.optional(),
			dataStorageLocation: z
				.array(z.string())
				.describe(
					'List of countries where the data related to this recipient are stored',
				),
			recipientWarranties: z
				.array(z.string())
				.describe('List of lawful basis types that applies to the recipient.'),
		})
		.strict(),
	updateRecipientStatusViaId: z
		.object({
			status: z
				.enum(['archived', 'validated'])
				.describe('The status of the recipient. Can be archived or validated.')
				.optional(),
			recipientId: z.string().describe('Identifier of the Recipient'),
			automationStatus: z
				.enum(['created', 'ignored', 'new'])
				.describe('Automationstatus')
				.optional(),
		})
		.strict(),
	deleteTagFromResource: z
		.object({
			tagKey: z.string().describe('Tagkey'),
			tagValue: z.string().describe('Tagvalue').optional(),
			tagResources: z.object({}).passthrough().describe('Tagresources'),
		})
		.strict(),
	exportFilteredLeafResources: z
		.object({
			detailed: z
				.boolean()
				.describe(
					'Set to `true` if the results exported to have detailed column level information of the detected infotypes.',
				)
				.optional(),
			sourceType: z
				.string()
				.describe(
					'Filter resource based on the source type. eg: "MYSQL", "RDS_MYSQL", "S3", "PRESTO", etc.',
				)
				.optional(),
			sort__order: z.enum(['ASC', 'DESC']).describe('Order').optional(),
			sort__column: z
				.string()
				.describe('The column name to sort on.')
				.optional(),
			filter__region: z
				.array(z.string())
				.describe('One or more cloud provider regions.')
				.optional(),
			filter__schema: z
				.array(z.string())
				.describe(
					'List tables from a specific schema. Supported for the following resource types: Presto.',
				)
				.optional(),
			filter__search: z
				.string()
				.describe('Free-text search on the resource name.')
				.optional(),
			filter__status: z
				.array(z.string())
				.describe('Filter the resources based on list of status.')
				.optional(),
			filter__account: z
				.array(z.string())
				.describe('One or more cloud provider account IDs.')
				.optional(),
			filter__dataset: z
				.array(z.string())
				.describe(
					'List tables from a specific dataset. Supported for on the following resource types: BigQuery.',
				)
				.optional(),
			filter__driveId: z
				.array(z.string())
				.describe(
					'List drives from a specific driveId. Supported for the following resource types: Gdrive.',
				)
				.optional(),
			filter__noOwner: z
				.boolean()
				.describe(
					'Include only resources that have not been assigned an owner.',
				)
				.optional(),
			filter__scanned: z
				.boolean()
				.describe('Include only resources that have been scanned.')
				.optional(),
			filter__database: z
				.array(z.string())
				.describe(
					'List tables from a specific database. Supported for the following resource types: (RDS) PostgreSQL, (RDS) MySQL, MongoDB.',
				)
				.optional(),
			filter__hasOwner: z
				.boolean()
				.describe('Include only resources that have been assigned an owner.')
				.optional(),
			filter__instance: z
				.array(z.string())
				.describe(
					'One or more resource IDs of the instances to which the resources belong, i.e. the parent resource ID.',
				)
				.optional(),
			filter__parentId: z
				.string()
				.describe('Filter the resources which has the specified parent ID.')
				.optional(),
			filter__driveType: z
				.array(z.string())
				.describe(
					'List drives from a specific drive type. Supported for the following resource types: Gdrive.',
				)
				.optional(),
			filter__firstSeen: z
				.object({ additionalProperties: z.number().int().optional() })
				.passthrough()
				.describe('Set of conditions for comparing two timestamps.')
				.optional(),
			filter__orgUnitId: z
				.array(z.string())
				.describe(
					'List orgUnits from a specific orgUnitIds. Supported for the following resource types: Gdrive.',
				)
				.optional(),
			filter__spaceType: z
				.array(z.string())
				.describe('Filter conlfluences based on type')
				.optional(),
			filter__categories: z
				.array(z.string())
				.describe('Filter the resources matching with the list of categories.')
				.optional(),
			filter__resourceId: z
				.array(z.string())
				.describe('Filter the resources with the specified resource IDs.')
				.optional(),
			filter__spaceStatus: z
				.array(z.string())
				.describe('Filter conlfluences based on status')
				.optional(),
			filter__resourceTags: z
				.array(
					z
						.object({
							source: z.string().describe('Source'),
							tagKey: z.string().describe('Tagkey'),
							tagValue: z.string().describe('Tagvalue'),
						})
						.passthrough()
						.describe(
							'Request schema for `ExportFilteredLeafResourcesresourceTags`',
						),
				)
				.describe('Filter the resources based on tags')
				.optional(),
			filter__resourceType: z
				.array(z.string())
				.describe('Filter the resources which can be scanned by Borneo.')
				.optional(),
			filter__severityScore: z
				.array(z.enum(['CRITICAL', 'HIGH', 'INFORMATIONAL', 'LOW', 'MEDIUM']))
				.describe(
					'Filter the resources based on the assigned risk severity score; "critical" = 4, "high" = 3, "medium" = 2, "low" = 1.',
				)
				.optional(),
			filter__classification: z
				.array(z.string())
				.describe(
					'Filter the resources matching with the list of classifications.',
				)
				.optional(),
			filter__infoTypes__ops: z.enum(['AND', 'OR']).describe('Ops').optional(),
			filter__infoTypes__infoTypes: z
				.array(z.string())
				.describe('The list of infotypes to filter on.')
				.optional(),
		})
		.strict(),
	exportInventoryResourceList: z
		.object({
			select: z
				.array(z.string())
				.describe(
					'A list of property names to return in the response. If not specified, all resource properties will be returned.',
				)
				.optional(),
			pageSize: z
				.number()
				.int()
				.describe(
					'The maximum number of records to return per API call. If more records are available, the response will be truncated and will contain a "nextToken" value, which can be used to return additional records.',
				)
				.optional(),
			nextToken: z
				.string()
				.describe('Optional "nextToken" value from the last API response.')
				.optional(),
			sort__order: z.enum(['ASC', 'DESC']).describe('Order').optional(),
			sort__column: z
				.string()
				.describe('The column name to sort on.')
				.optional(),
			filter__hasPii: z
				.boolean()
				.describe(
					'Include only resources that have a high likelihood of containing PII based on the resource metadata.',
				)
				.optional(),
			filter__region: z
				.string()
				.describe(
					'The region of the cloud account to which the resoure belongs.',
				)
				.optional(),
			filter__search: z
				.string()
				.describe('Free-text search on the resource name.')
				.optional(),
			filter__noOwner: z
				.boolean()
				.describe(
					'Include only resources that have not been assigned an owner.',
				)
				.optional(),
			filter__regions: z
				.array(z.string())
				.describe(
					'List of regions to which the resoure belongs to in that cloud account.',
				)
				.optional(),
			filter__hasOwner: z
				.boolean()
				.describe('Include only resources that have been assigned an owner.')
				.optional(),
			filter__parentId: z
				.string()
				.describe(
					'The parent Id of the resource. E.g. Borneo-specific GCP subscription ID for GCP resources',
				)
				.optional(),
			filter__accountId: z
				.string()
				.describe(
					'The account ID of the cloud account to which the resoure belongs. E.g. a 12-digit AWS account ID.',
				)
				.optional(),
			filter__dataRisks: z
				.array(z.string())
				.describe('Filter the resources that has data risks.')
				.optional(),
			filter__firstSeen: z
				.object({ additionalProperties: z.number().int().optional() })
				.passthrough()
				.describe('Set of conditions for comparing two timestamps.')
				.optional(),
			filter__resourceIds: z
				.array(z.string())
				.describe('One or more resource IDs to return.')
				.optional(),
			filter__resourceTags: z
				.array(
					z
						.object({
							source: z.string().describe('Source'),
							tagKey: z.string().describe('Tagkey'),
							tagValue: z.string().describe('Tagvalue'),
						})
						.passthrough()
						.describe(
							'Request schema for `ExportInventoryResourceListresourceTags`',
						),
				)
				.describe('Filter the resources based on tags')
				.optional(),
			filter__resourceType: z
				.string()
				.describe('Filter the resources based on the resource type.')
				.optional(),
			filter__severityScore: z
				.array(z.number().int())
				.describe(
					'Filter the resources based on the assigned risk severity score; "critical" = 4, "high" = 3, "medium" = 2, "low" = 1.',
				)
				.optional(),
			filter__classification: z
				.array(z.string())
				.describe(
					'Filter the resources based on classification and are non-compliant. eg "PII_L1", "PII_L2", "PII_L3". Custom added classifications is also supported.',
				)
				.optional(),
			include__violationMetrics: z
				.boolean()
				.describe(
					'Include violation count by severity for resource and child resources.',
				)
				.optional(),
			filter__hideBorneoResources: z
				.boolean()
				.describe(
					'Whether to hide resources that are part of the Borneo data plane.',
				)
				.optional(),
			filter__dataSourceCategories: z
				.array(
					z.enum([
						'AWSDataStores',
						'AzureDataStores',
						'CloudApplications',
						'DiscoveredApplications',
						'GCPDataStores',
						'StandaloneDataStores',
					]),
				)
				.describe(
					'Filter the resources based on the data source category Current supported values: AWS_DATA_STORES, GCP_DATA_STORES, STANDALONE_DATA_STORES, CLOUD_APPLICATIONS, DISCOVERED_APPLICATIONS',
				)
				.optional(),
			filter__scannableResourceTypes: z
				.boolean()
				.describe('Filter the resources that are scannable')
				.optional(),
			include__frameworkExceptionsCount: z
				.boolean()
				.describe(
					'Include framework exceptions count for the resource and its children',
				)
				.optional(),
			include__childResourceStats__scans: z
				.boolean()
				.describe('Include aggregate scan stats from child resources.')
				.optional(),
			include__childResourceStats__dataSize: z
				.boolean()
				.describe('Include aggregate data size stats from child resources.')
				.optional(),
		})
		.strict(),
	getResourceInventoryById: z
		.object({ resourceId: z.string().describe('The unique resource ID.') })
		.strict(),
	listInventoryResourcesWithFilters: z
		.object({
			select: z
				.array(z.string())
				.describe(
					'A list of property names to return in the response. If not specified, all resource properties will be returned.',
				)
				.optional(),
			pageSize: z
				.number()
				.int()
				.describe(
					'The maximum number of records to return per API call. If more records are available, the response will be truncated and will contain a "nextToken" value, which can be used to return additional records.',
				)
				.optional(),
			nextToken: z
				.string()
				.describe('Optional "nextToken" value from the last API response.')
				.optional(),
			sort__order: z.enum(['ASC', 'DESC']).describe('Order').optional(),
			sort__column: z
				.string()
				.describe('The column name to sort on.')
				.optional(),
			filter__hasPii: z
				.boolean()
				.describe(
					'Include only resources that have a high likelihood of containing PII based on the resource metadata.',
				)
				.optional(),
			filter__region: z
				.string()
				.describe(
					'The region of the cloud account to which the resoure belongs.',
				)
				.optional(),
			filter__search: z
				.string()
				.describe('Free-text search on the resource name.')
				.optional(),
			filter__noOwner: z
				.boolean()
				.describe(
					'Include only resources that have not been assigned an owner.',
				)
				.optional(),
			filter__regions: z
				.array(z.string())
				.describe(
					'List of regions to which the resoure belongs to in that cloud account.',
				)
				.optional(),
			filter__hasOwner: z
				.boolean()
				.describe('Include only resources that have been assigned an owner.')
				.optional(),
			filter__parentId: z
				.string()
				.describe(
					'The parent Id of the resource. E.g. Borneo-specific GCP subscription ID for GCP resources',
				)
				.optional(),
			filter__accountId: z
				.string()
				.describe(
					'The account ID of the cloud account to which the resoure belongs. E.g. a 12-digit AWS account ID.',
				)
				.optional(),
			filter__dataRisks: z
				.array(z.string())
				.describe('Filter the resources that has data risks.')
				.optional(),
			filter__firstSeen: z
				.object({ additionalProperties: z.number().int().optional() })
				.passthrough()
				.describe('Set of conditions for comparing two timestamps.')
				.optional(),
			filter__resourceIds: z
				.array(z.string())
				.describe('One or more resource IDs to return.')
				.optional(),
			filter__resourceTags: z
				.array(
					z
						.object({
							source: z.string().describe('Source'),
							tagKey: z.string().describe('Tagkey'),
							tagValue: z.string().describe('Tagvalue'),
						})
						.passthrough()
						.describe(
							'Request schema for `ListInventoryResourcesWithFiltersresourceTags`',
						),
				)
				.describe('Filter the resources based on tags')
				.optional(),
			filter__resourceType: z
				.string()
				.describe('Filter the resources based on the resource type.')
				.optional(),
			filter__severityScore: z
				.array(z.number().int())
				.describe(
					'Filter the resources based on the assigned risk severity score; "critical" = 4, "high" = 3, "medium" = 2, "low" = 1.',
				)
				.optional(),
			filter__classification: z
				.array(z.string())
				.describe(
					'Filter the resources based on classification and are non-compliant. eg "PII_L1", "PII_L2", "PII_L3". Custom added classifications is also supported.',
				)
				.optional(),
			include__violationMetrics: z
				.boolean()
				.describe(
					'Include violation count by severity for resource and child resources.',
				)
				.optional(),
			filter__hideBorneoResources: z
				.boolean()
				.describe(
					'Whether to hide resources that are part of the Borneo data plane.',
				)
				.optional(),
			filter__dataSourceCategories: z
				.array(
					z.enum([
						'AWSDataStores',
						'AzureDataStores',
						'CloudApplications',
						'DiscoveredApplications',
						'GCPDataStores',
						'StandaloneDataStores',
					]),
				)
				.describe(
					'Filter the resources based on the data source category Current supported values: AWS_DATA_STORES, GCP_DATA_STORES, STANDALONE_DATA_STORES, CLOUD_APPLICATIONS, DISCOVERED_APPLICATIONS',
				)
				.optional(),
			filter__scannableResourceTypes: z
				.boolean()
				.describe('Filter the resources that are scannable')
				.optional(),
			include__frameworkExceptionsCount: z
				.boolean()
				.describe(
					'Include framework exceptions count for the resource and its children',
				)
				.optional(),
			include__childResourceStats__scans: z
				.boolean()
				.describe('Include aggregate scan stats from child resources.')
				.optional(),
			include__childResourceStats__dataSize: z
				.boolean()
				.describe('Include aggregate data size stats from child resources.')
				.optional(),
		})
		.strict(),
	listLeafResourcesWithFilters: z
		.object({
			pageSize: z
				.number()
				.int()
				.describe(
					'The maximum number of records to return per API call. If more records are available, the response will be truncated and will contain a "nextToken" value, which can be used to return additional records.',
				)
				.optional(),
			nextToken: z
				.string()
				.describe('Optional "nextToken" value from the last API response.')
				.optional(),
			sourceType: z
				.string()
				.describe('Filter resource based on the resource type.')
				.optional(),
			sort__order: z.enum(['ASC', 'DESC']).describe('Order').optional(),
			sort__column: z
				.string()
				.describe('The column name to sort on.')
				.optional(),
			filter__region: z
				.array(z.string())
				.describe('One or more cloud provider regions.')
				.optional(),
			filter__schema: z
				.array(z.string())
				.describe(
					'List tables from a specific schema. Supported for the following resource types: Presto.',
				)
				.optional(),
			filter__search: z
				.string()
				.describe('Free-text search on the resource name.')
				.optional(),
			filter__status: z
				.array(z.string())
				.describe('Filter the resources based on list of status.')
				.optional(),
			filter__account: z
				.array(z.string())
				.describe('One or more cloud provider account IDs.')
				.optional(),
			filter__dataset: z
				.array(z.string())
				.describe(
					'List tables from a specific dataset. Supported for on the following resource types: BigQuery.',
				)
				.optional(),
			filter__driveId: z
				.array(z.string())
				.describe(
					'List drives from a specific driveId. Supported for the following resource types: Gdrive.',
				)
				.optional(),
			filter__noOwner: z
				.boolean()
				.describe(
					'Include only resources that have not been assigned an owner.',
				)
				.optional(),
			filter__scanned: z
				.boolean()
				.describe('Include only resources that have been scanned.')
				.optional(),
			filter__database: z
				.array(z.string())
				.describe(
					'List tables from a specific database. Supported for the following resource types: (RDS) PostgreSQL, (RDS) MySQL, MongoDB.',
				)
				.optional(),
			filter__hasOwner: z
				.boolean()
				.describe('Include only resources that have been assigned an owner.')
				.optional(),
			filter__instance: z
				.array(z.string())
				.describe(
					'One or more resource IDs of the instances to which the resources belong, i.e. the parent resource ID.',
				)
				.optional(),
			filter__parentId: z
				.string()
				.describe('Filter the resources which has the specified parent ID.')
				.optional(),
			filter__driveType: z
				.array(z.string())
				.describe(
					'List drives from a specific drive type. Supported for the following resource types: Gdrive.',
				)
				.optional(),
			filter__firstSeen: z
				.object({ additionalProperties: z.number().int().optional() })
				.passthrough()
				.describe('Set of conditions for comparing two timestamps.')
				.optional(),
			filter__orgUnitId: z
				.array(z.string())
				.describe(
					'List orgUnits from a specific orgUnitIds. Supported for the following resource types: Gdrive.',
				)
				.optional(),
			filter__spaceType: z
				.array(z.string())
				.describe('Filter conlfluences based on type')
				.optional(),
			filter__categories: z
				.array(z.string())
				.describe('Filter the resources matching with the list of categories.')
				.optional(),
			filter__resourceId: z
				.array(z.string())
				.describe('Filter the resources with the specified resource IDs.')
				.optional(),
			filter__spaceStatus: z
				.array(z.string())
				.describe('Filter conlfluences based on status')
				.optional(),
			filter__resourceTags: z
				.array(
					z
						.object({
							source: z.string().describe('Source'),
							tagKey: z.string().describe('Tagkey'),
							tagValue: z.string().describe('Tagvalue'),
						})
						.passthrough()
						.describe(
							'Request schema for `ListLeafResourcesWithFiltersresourceTags`',
						),
				)
				.describe('Filter the resources based on tags')
				.optional(),
			filter__resourceType: z
				.array(z.string())
				.describe('Filter the resources which can be scanned by Borneo.')
				.optional(),
			filter__severityScore: z
				.array(z.enum(['CRITICAL', 'HIGH', 'INFORMATIONAL', 'LOW', 'MEDIUM']))
				.describe(
					'Filter the resources based on the assigned risk severity score; "critical" = 4, "high" = 3, "medium" = 2, "low" = 1.',
				)
				.optional(),
			filter__classification: z
				.array(z.string())
				.describe(
					'Filter the resources matching with the list of classifications.',
				)
				.optional(),
			filter__infoTypes__ops: z.enum(['AND', 'OR']).describe('Ops').optional(),
			include__violationSummary: z
				.boolean()
				.describe('Violationsummary')
				.optional(),
			filter__infoTypes__infoTypes: z
				.array(z.string())
				.describe('The list of infotypes to filter on.')
				.optional(),
			include__frameworkExceptionsCount: z
				.boolean()
				.describe('Frameworkexceptionscount')
				.optional(),
		})
		.strict(),
	postClassificationStats: z
		.object({
			filter__classification: z.string().describe('Classification').optional(),
		})
		.strict(),
	postResourceLineageFilter: z
		.object({
			filter__resourceId: z.string().describe('Resourceid').optional(),
			filter__upstreamDepth: z
				.number()
				.int()
				.describe('Upstreamdepth')
				.optional(),
			filter__downstreamDepth: z
				.number()
				.int()
				.describe('Downstreamdepth')
				.optional(),
		})
		.strict(),
	postResourceStatsWithDeletedResources: z
		.object({
			includeDeletedResources: z
				.boolean()
				.describe('Includedeletedresources')
				.optional(),
		})
		.strict(),
	retrieveDataResourceStatistics: z
		.object({ sourceType: z.string().describe('Sourcetype').optional() })
		.strict(),
	retrieveResourceCatalogById: z
		.object({
			resourceId: z.string().describe('The unique resource ID.'),
			includeParentDetails: z
				.boolean()
				.describe('Includeparentdetails')
				.optional(),
		})
		.strict(),
	retrieveResourceColumns: z
		.object({
			dataspace: z.array(z.string()).describe('Dataspace').optional(),
			searchKey: z.string().describe('Searchkey').optional(),
			resourceId: z.array(z.string()).describe('Resourceid').optional(),
			sourceType: z.string().describe('Sourcetype').optional(),
			parentResourceId: z.string().describe('Parentresourceid'),
		})
		.strict(),
	accessScanIterationById: z
		.object({ scanIterationId: z.string().describe('The unique resource ID.') })
		.strict(),
	createAndScheduleCloudResourceScan: z
		.object({
			cron: z
				.enum([
					'*/30 * * * *',
					'0 */1 * * *',
					'0 */12 * * *',
					'0 */4 * * *',
					'0 */6 * * *',
					'0 */8 * * *',
					'0 0 * * *',
					'0 0 * * 0',
					'0 0 1 * *',
					'0 0 1 1,4,7,10 *',
					'0 0 1 1,7 *',
				])
				.describe(
					'The cron schedule expression to use for a recurring scan. Only a fixed set of cron expressions can be used to run scans at 30 minute, 1 hour, 1 day, or 1 week intervals.',
				)
				.optional(),
			name: z.string().describe('The name of the scan.').optional(),
			scanType: z
				.enum(['full', 'sample'])
				.describe(
					'The type of scan to perform, i.e. either full scan or sample scan.',
				)
				.optional(),
			scanFilter: z
				.array(
					z
						.object({
							type: z
								.enum([
									'fileExtensions',
									'internalDomains',
									'jiraProjects',
									'lastModifiedGreaterThan',
									'lastModifiedLessThan',
									'onlyIncludeKeys',
									'prefix',
									'scanAttachments',
									'visibilityFilter',
									'zendeskGroups',
								])
								.describe(
									'The type of filter to apply. Not all connector types support all filter types.',
								)
								.optional(),
							filters: z
								.array(z.string())
								.describe(
									'One or more filter values to apply. The number and type of values depends on the filter type.',
								)
								.optional(),
						})
						.passthrough()
						.describe(
							'Request schema for `CreateAndScheduleCloudResourceScanscanFilter`',
						),
				)
				.describe('Filter conditions to apply to the scan.')
				.optional(),
			connectorId: z
				.string()
				.describe(
					'The ID of the connector to use for the scan. The connector type must match the resource type.',
				)
				.optional(),
			resourceType: z
				.string()
				.describe('The type of resource to scan.')
				.optional(),
			scheduleType: z
				.enum(['cron', 'once'])
				.describe(
					'A schedule type of "once" indicates that the scan will be executed once immediately at the time it is created or once as per the scheduled calendar time. A schedule type of "cron" creates a recurring scan that will be executed at the specified cron schedule.',
				),
			resources__all: z
				.boolean()
				.describe(
					'Set this to `true` to determine the set of resources to scan based on the filter conditions in the `resources` property. If set to `false`, a static set of `resourceIds` must be specified.',
				)
				.optional(),
			resources__name: z.array(z.string()).describe('Name').optional(),
			resources__tags: z
				.array(
					z
						.object({
							action: z.enum(['exclude', 'include']).describe('Action'),
							tagKey: z.string().describe('Tagkey'),
							tagValue: z.string().describe('Tagvalue').optional(),
						})
						.passthrough()
						.describe(
							'Request schema for `CreateAndScheduleCloudResourceScantags`',
						),
				)
				.describe('Filter the resources which have teh tags')
				.optional(),
			resources__region: z
				.string()
				.describe(
					'The region of the cloud account to which the resoure belongs.',
				)
				.optional(),
			resources__schema: z
				.array(z.string())
				.describe(
					'Filter the resources with the list of schemas for selected connector types',
				)
				.optional(),
			resources__search: z
				.string()
				.describe('Free-text search on the resource name.')
				.optional(),
			resources__teamId: z
				.string()
				.describe('Slack Workspace id in Slack Enterprise Connector')
				.optional(),
			resources__dataset: z
				.array(z.string())
				.describe(
					'Filter the resources with the list of datasetss for selected connector types',
				)
				.optional(),
			resources__driveId: z
				.array(z.string())
				.describe(
					'Filter the resources with the list of driveIds for gdrive connector types',
				)
				.optional(),
			resources__regions: z
				.array(z.string())
				.describe(
					'List of regions to which the resoure belongs to in that cloud account.',
				)
				.optional(),
			resources__teamUrl: z
				.string()
				.describe('Slack Workspace URL in Slack Enterprise Connector')
				.optional(),
			schedule__timezone: z
				.string()
				.describe('time zone to be considered for the schedule')
				.optional(),
			resources__database: z
				.array(z.string())
				.describe(
					'Filter the resources with the list of databaseses for selected connector types',
				)
				.optional(),
			resources__isPublic: z
				.boolean()
				.describe('Filter the resources which are public.')
				.optional(),
			resources__parentId: z
				.string()
				.describe('Filter the resources which has the specified parent id.')
				.optional(),
			resources__teamName: z
				.string()
				.describe('Slack Workspace name in Slack Enterprise Connector')
				.optional(),
			schedule__calendars: z
				.array(
					z
						.object({
							hour: z.number().int().describe('Hour').optional(),
							year: z.number().int().describe('Year').optional(),
							month: z
								.enum([
									'APRIL',
									'AUGUST',
									'DECEMBER',
									'FEBRUARY',
									'JANUARY',
									'JULY',
									'JUNE',
									'MARCH',
									'MAY',
									'NOVEMBER',
									'OCTOBER',
									'SEPTEMBER',
								])
								.describe('Month')
								.optional(),
							minute: z.number().int().describe('Minute').optional(),
							second: z.number().int().describe('Second').optional(),
							dayOfMonth: z.number().int().describe('Dayofmonth').optional(),
						})
						.passthrough()
						.describe(
							'Request schema for `CreateAndScheduleCloudResourceScancalendars`',
						),
				)
				.describe('List of schedules')
				.optional(),
			resources__accountId: z
				.string()
				.describe(
					'The account ID of the cloud account to which the resoure belongs. E.g. a 12-digit AWS account ID.',
				)
				.optional(),
			resources__driveType: z
				.array(z.string())
				.describe(
					'Filter the resources with the list of driveTypes for gdrive connector types',
				)
				.optional(),
			resources__isPrivate: z
				.boolean()
				.describe('Private channels, for Slack Enterprise Connector')
				.optional(),
			resources__orgUnitId: z
				.array(z.string())
				.describe(
					'Filter the resources with the list of orgUnits for gdrive connector types',
				)
				.optional(),
			resources__spaceType: z
				.array(z.string())
				.describe('Filter conlfluences based on type')
				.optional(),
			resources__isArchived: z
				.boolean()
				.describe(
					'Filter the channels marked as archived for Slack connector types',
				)
				.optional(),
			resources__isExternal: z
				.boolean()
				.describe(
					'Filter the channels marked as external for Slack connector types',
				)
				.optional(),
			resources__resourceIds: z
				.array(z.string())
				.describe('One or more resource IDs to return.')
				.optional(),
			resources__spaceStatus: z
				.array(z.string())
				.describe('Filter conlfluences based on status')
				.optional(),
			resources__googleGroups: z
				.array(z.string())
				.describe('Googlegroups')
				.optional(),
			resources__resourceType: z
				.string()
				.describe('Filter the resources based on the resource type.')
				.optional(),
			resources__isUnencrypted: z
				.boolean()
				.describe('Filter the resources which are un-unencrypted.')
				.optional(),
			resources__infoTypes__ops: z
				.enum(['AND', 'OR'])
				.describe('Ops')
				.optional(),
			resources__zendeskGroupId: z
				.array(z.number().int())
				.describe('Zendeskgroupid')
				.optional(),
			scanLimits__itemsPerBatch: z
				.number()
				.int()
				.describe(
					'Maximum number of item (records, objects, etc.) to scan per resource. Supported for sample scans on the following resource types: S3, DynamoDB, PostgreSQL, MySQL, Presto, MongoDB, BigQuery, Cassandra.',
				)
				.optional(),
			inspectionPolicy__infotypes: z
				.array(z.string())
				.describe(
					'List of infotypes to scan for. If empty, all enabled infotypes will be included.',
				)
				.optional(),
			inspectionPolicy__compliance: z
				.array(z.string())
				.describe(
					'List of infotype categories to scan for. All enabled infotypes included in the specified categories will be used in the scan. If `infotypes` is also specified, this list of infotype categories will be ignored.',
				)
				.optional(),
			scanLimits__samplePercentage: z
				.number()
				.int()
				.describe(
					'Percentage of data to scan per resource. Supported for full scans on the following resource types: S3, BigQuery.',
				)
				.optional(),
			inspectionPolicy__maskDetails: z
				.boolean()
				.describe(
					'If true, the matched tokens captured as part of the detailed scan results will be masked. If false, the raw, unmasked tokens will be captured. Use with caution. Only applicable if `detailed` scan results are enabled.',
				)
				.optional(),
			inspectionPolicy__collectTokens: z
				.boolean()
				.describe(
					'If true, the scan will capture details about every infotype match, including the matched token, and exact location of the token. If false, the scan will capture only aggregate results (a.k.a. "snapshot" results).',
				)
				.optional(),
			resources__infoTypes__infoTypes: z
				.array(z.string())
				.describe('The list of infotypes to filter on.')
				.optional(),
			resources__isSlackDirectMessages: z
				.boolean()
				.describe('Fetch DMs, for Slack Enterprise Connector')
				.optional(),
			scanLimits__sampleDurationMinutes: z
				.number()
				.int()
				.describe('Sampledurationminutes')
				.optional(),
			scanLimits__maxCumulativeDataSizeMb: z
				.number()
				.int()
				.describe(
					'Maximum data size to scan per resource in MB. Supported for full scans on the following resource types: PostgreSQL, MySQL.',
				)
				.optional(),
		})
		.strict(),
	exportInsightPageUsingScanId: z
		.object({
			scanId: z.string().describe('The unique scan ID.'),
			detailed: z
				.boolean()
				.describe(
					'Set to `true` if the results exported to have detailed column level information of the detected infotypes  with masked tokens if captured.',
				)
				.optional(),
			filter__pageId: z
				.string()
				.describe('Unique page ID. Only applicable to page-level results.')
				.optional(),
			filter__scanId: z.string().describe('Unique scan ID.').optional(),
			filter__search: z
				.string()
				.describe('Free-text search on the resource name.')
				.optional(),
			filter__status: z
				.array(
					z.enum([
						'deleted',
						'failed',
						'paused',
						'scanning',
						'success',
						'terminated',
					]),
				)
				.describe('Status')
				.optional(),
			filter__categories: z
				.array(z.string())
				.describe('infotype categories')
				.optional(),
			filter__userEmails: z.array(z.string()).describe('Useremails').optional(),
			filter__resourceIds: z
				.array(z.string())
				.describe(
					'One or more resource IDs for which to retrieve results. Only applicable to page-level results.',
				)
				.optional(),
			filter__resourceType: z
				.string()
				.describe('Resource type to filter results by.')
				.optional(),
			filter__fileExtension: z
				.array(z.string())
				.describe('Fileextension')
				.optional(),
			filter__infoTypes__ops: z.enum(['AND', 'OR']).describe('Ops').optional(),
			filter__scanIterationId: z
				.string()
				.describe(
					'Unique scan iteration ID to fetch results for a specific run of',
				)
				.optional(),
			filter__infotypeConfidence: z
				.array(z.enum(['certain', 'likely', 'potential']))
				.describe('Infotypeconfidence')
				.optional(),
			filter__infoTypes__infoTypes: z
				.array(z.string())
				.describe('The list of infotypes to filter on.')
				.optional(),
		})
		.strict(),
	filterAndListInspectionResults: z
		.object({
			type: z
				.enum(['page', 'scan'])
				.describe(
					'Type of inspection result, i.e. scan-level or page-level results.',
				),
			pageSize: z
				.number()
				.int()
				.describe(
					'The maximum number of records to return per API call. If more records are available, the response will be truncated and will contain a "nextToken" value, which can be used to return additional records.',
				)
				.optional(),
			nextToken: z
				.string()
				.describe(
					'The `nextToken` from the last page of results to retrieve the next page of results.',
				)
				.optional(),
			sort__order: z.enum(['ASC', 'DESC']).describe('Order').optional(),
			sort__column: z
				.string()
				.describe('The column name to sort on.')
				.optional(),
			filter__pageId: z
				.string()
				.describe('Unique page ID. Only applicable to page-level results.')
				.optional(),
			filter__scanId: z.string().describe('Unique scan ID.').optional(),
			filter__search: z
				.string()
				.describe('Free-text search on the resource name.')
				.optional(),
			filter__status: z
				.array(
					z.enum([
						'deleted',
						'failed',
						'paused',
						'scanning',
						'success',
						'terminated',
					]),
				)
				.describe('Status')
				.optional(),
			filter__categories: z
				.array(z.string())
				.describe('infotype categories')
				.optional(),
			filter__userEmails: z.array(z.string()).describe('Useremails').optional(),
			filter__resourceIds: z
				.array(z.string())
				.describe(
					'One or more resource IDs for which to retrieve results. Only applicable to page-level results.',
				)
				.optional(),
			filter__resourceType: z
				.string()
				.describe('Resource type to filter results by.')
				.optional(),
			filter__fileExtension: z
				.array(z.string())
				.describe('Fileextension')
				.optional(),
			filter__infoTypes__ops: z.enum(['AND', 'OR']).describe('Ops').optional(),
			filter__scanIterationId: z
				.string()
				.describe(
					'Unique scan iteration ID to fetch results for a specific run of',
				)
				.optional(),
			filter__infotypeConfidence: z
				.array(z.enum(['certain', 'likely', 'potential']))
				.describe('Infotypeconfidence')
				.optional(),
			filter__infoTypes__infoTypes: z
				.array(z.string())
				.describe('The list of infotypes to filter on.')
				.optional(),
		})
		.strict(),
	getInsightByTypeAndId: z
		.object({
			id: z
				.string()
				.describe('The unique ID of the inspection result to fetch.'),
			type: z
				.enum(['page', 'scan'])
				.describe('The type of inspection result to fetch.'),
		})
		.strict(),
	getScanByScanId: z.object({ scanId: z.string().describe('Scanid') }).strict(),
	listErrorDetailsFromFilteredScanIterations: z
		.object({
			select: z
				.array(z.string())
				.describe('List of column names to include in the response.')
				.optional(),
			pageSize: z
				.number()
				.int()
				.describe(
					'The maximum number of records to return per API call. If more records are available, the response will be truncated and will contain a "nextToken" value, which can be used to return additional records.',
				)
				.optional(),
			nextToken: z
				.string()
				.describe(
					'The `nextToken` from the last page of results to retrieve the next page of results.',
				)
				.optional(),
			sort__order: z.enum(['ASC', 'DESC']).describe('Order').optional(),
			sort__column: z
				.string()
				.describe('The column name to sort on.')
				.optional(),
			filter__scanId: z.string().describe('Scanid').optional(),
			filter__accountId: z.string().describe('Accountid').optional(),
			filter__resourceId: z.string().describe('Resourceid').optional(),
			filter__scanExecutionId: z
				.string()
				.describe('Scanexecutionid')
				.optional(),
			filter__scanIterationId: z
				.string()
				.describe('Scaniterationid')
				.optional(),
		})
		.strict(),
	listInsightFilters: z
		.object({
			scanId: z.string().describe('Scanid').optional(),
			filterType: z.literal('fileExtension').describe('Filtertype').optional(),
		})
		.strict(),
	listScanExecutionResults: z
		.object({
			pageSize: z
				.number()
				.int()
				.describe(
					'The maximum number of records to return per API call. If more records are available, the response will be truncated and will contain a "nextToken" value, which can be used to return additional records.',
				)
				.optional(),
			nextToken: z.string().describe('Nexttoken').optional(),
			sort__order: z.enum(['ASC', 'DESC']).describe('Order').optional(),
			sort__column: z
				.string()
				.describe('The column name to sort on.')
				.optional(),
			filter__scanId: z.string().describe('Unique scan ID.').optional(),
			filter__search: z
				.string()
				.describe('Free-text search on the resource name.')
				.optional(),
			filter__statuses: z
				.array(
					z.enum([
						'deleted',
						'failed',
						'paused',
						'scanning',
						'success',
						'terminated',
					]),
				)
				.describe('Statuses')
				.optional(),
			filter__resourceIds: z
				.array(z.string())
				.describe(
					'One or more resource IDs for which to retrieve results. Only applicable to page-level results.',
				)
				.optional(),
			filter__infoTypes__ops: z.enum(['AND', 'OR']).describe('Ops').optional(),
			filter__scanIterationId: z
				.string()
				.describe('Scaniterationid')
				.optional(),
			filter__infotypeConfidence: z
				.array(z.enum(['certain', 'likely', 'potential']))
				.describe('One or more confidence matches for the scan.')
				.optional(),
			filter__infoTypes__infoTypes: z
				.array(z.string())
				.describe('The list of infotypes to filter on.')
				.optional(),
		})
		.strict(),
	listScanIterationsWithFilter: z
		.object({
			select: z
				.array(z.string())
				.describe('List of column names to include in the response.')
				.optional(),
			pageSize: z
				.number()
				.int()
				.describe(
					'The maximum number of records to return per API call. If more records are available, the response will be truncated and will contain a "nextToken" value, which can be used to return additional records.',
				)
				.optional(),
			nextToken: z
				.string()
				.describe(
					'The `nextToken` from the last page of results to retrieve the next page of results.',
				)
				.optional(),
			sort__order: z.enum(['ASC', 'DESC']).describe('Order').optional(),
			sort__column: z
				.string()
				.describe('The column name to sort on.')
				.optional(),
			filter__scanId: z.string().describe('Scanid').optional(),
			filter__resourceId: z.string().describe('Resourceid').optional(),
			filter__scanIterationId: z
				.string()
				.describe('Scaniterationid')
				.optional(),
		})
		.strict(),
	listScansWithFilters: z
		.object({
			select: z
				.array(z.string())
				.describe('List of column names to include in the response.')
				.optional(),
			pageSize: z
				.number()
				.int()
				.describe(
					'The maximum number of records to return per API call. If more records are available, the response will be truncated and will contain a "nextToken" value, which can be used to return additional records.',
				)
				.optional(),
			nextToken: z
				.string()
				.describe(
					'The `nextToken` from the last page of results to retrieve the next page of results.',
				)
				.optional(),
			sort__order: z.enum(['ASC', 'DESC']).describe('Order').optional(),
			sort__column: z
				.string()
				.describe('The column name to sort on.')
				.optional(),
			filter__search: z
				.string()
				.describe('Free-form text search to apply to the scan name.')
				.optional(),
			filter__status: z
				.array(z.string())
				.describe(
					'One or more scan statuses (e.g. `inprogress`, `completed`, etc.) to filter results by.',
				)
				.optional(),
			filter__scanType: z
				.array(z.string())
				.describe(
					'One or more scan types (i.e. "full" or "sample") to filter results by.',
				)
				.optional(),
			getNextExecution: z
				.boolean()
				.describe(
					'IF true, nextExecution will be populated for postponed and repeated scans',
				)
				.optional(),
			filter__accountId: z
				.array(z.string())
				.describe('One or more AWS accounts to filter results by.')
				.optional(),
			filter__resources: z
				.array(z.string())
				.describe('One or more resource IDs to filter results by.')
				.optional(),
			filter__connectorId: z
				.array(z.string())
				.describe('One or more connector IDs to filter results by.')
				.optional(),
			filter__dataPlaneId: z
				.array(z.string())
				.describe('One or more data plane IDs to filter results by.')
				.optional(),
			filter__gcpProjectId: z
				.array(z.string())
				.describe('One or more GCP projects to filter results by.')
				.optional(),
			filter__resourceType: z
				.array(z.string())
				.describe('One or moreresource types to filter results by.')
				.optional(),
			filter__dataPlaneName: z
				.array(z.string())
				.describe('One or more data plane names to filter results by.')
				.optional(),
			filter__infoTypes__ops: z.enum(['AND', 'OR']).describe('Ops').optional(),
			filter__infoTypes__infoTypes: z
				.array(z.string())
				.describe('The list of infotypes to filter on.')
				.optional(),
		})
		.strict(),
	markScanFalsePositivesById: z
		.object({
			scanId: z.string().describe('The unique scan ID.'),
			reports: z.array(z.string()).describe('Reports').optional(),
		})
		.strict(),
	pauseScanById: z
		.object({ scanId: z.string().describe('The unique scan ID.') })
		.strict(),
	postScanResourceStatus: z
		.object({
			scanId: z.string().describe('The unique scan ID.'),
			pageSize: z
				.number()
				.int()
				.describe(
					'The maximum number of records to return per API call. If more records are available, the response will be truncated and will contain a "nextToken" value, which can be used to return additional records.',
				)
				.optional(),
			nextToken: z
				.string()
				.describe(
					'The `nextToken` from the last page of results to retrieve the next page of results.',
				)
				.optional(),
			filter__name: z.string().describe('Name').optional(),
		})
		.strict(),
	resumeScanById: z
		.object({ scanId: z.string().describe('The unique scan ID.') })
		.strict(),
	scanLegalDocumentById: z
		.object({ documentId: z.string().describe('Documentid') })
		.strict(),
	stopScanViaScanId: z
		.object({ scanId: z.string().describe('The unique scan ID.') })
		.strict(),
	submitDetailedScanResults: z
		.object({
			pageId: z
				.string()
				.describe('Page ID for one of the pages produced by the scan.')
				.optional(),
			scanId: z
				.string()
				.describe('Scan ID of the scan that produced the inspection result.'),
			resourceId: z
				.string()
				.describe(
					'Resource ID for the resource for which the page was produced.',
				),
			scanIterationId: z
				.string()
				.describe(
					'ScanIteration ID of the scan that produced the inspection result.',
				),
		})
		.strict(),
	postSupportChatQuery: z
		.object({
			query: z.string().describe('Query'),
			sessionId: z.string().describe('Sessionid').optional(),
		})
		.strict(),
	getUserProfileById: z
		.object({ userId: z.string().describe('Userid') })
		.strict(),
	listUserProfileWithFiltersAndSorting: z
		.object({
			select: z.array(z.string()).describe('Select').optional(),
			pageSize: z.number().int().describe('Pagesize').optional(),
			nextToken: z.string().describe('Nexttoken').optional(),
			sort__order: z.enum(['ASC', 'DESC']).describe('Order').optional(),
			sort__column: z
				.string()
				.describe('The column name to sort on.')
				.optional(),
			filter__search: z.string().describe('Search').optional(),
		})
		.strict(),
	verifyEmailWithIdAndToken: z
		.object({
			token: z.string().describe('Token'),
			verificationId: z.string().describe('Verificationid'),
		})
		.strict(),
} as const satisfies Record<BorneoOperationName, z.ZodTypeAny>;

export const BorneoEndpointOutputSchemas = {
	getCloudAccountById: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	postAccountsWithFilterAndSortOptions: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	retrieveAccountDetailsById: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	createNewAsset: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	deleteAssetById: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	filterAndSortAssetsList: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	retrieveAssetById: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	updateAssetInformationById: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	listEventsWithFilters: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	postFilteredAccessLogs: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	postLogAuditRecordsWithFilterCriteria: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	deleteDataBreachById: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	evaluateDataBreachImpact: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	fetchDataBreachEvaluation: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	listDataBreachFilters: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	listDataBreachesWithFilters: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	postDataBreachInformation: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	retrieveDataBreachById: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	updateDataBreachEntry: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	createNewInfotypeCategory: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	deleteCategoryByLabel: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	getCategoryByLabel: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	updateCategoryInfotypes: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	postConnectorWithFilteringOptions: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	retrieveConnectorById: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	createDashboardUser: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	deleteDashboardReportById: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	disableDashboardUserByUsername: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	downloadDashboardReport: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	downloadDashboardReportEdition: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	enableDashboardUser: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	fetchDashboardReportById: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	getDashboardReportEditionById: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	listDashboardReportEditions: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	listDashboardReportsWithFilters: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	listDashboardUsersWithFilters: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	postCurrentDashboardUser: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	postDashboardReport: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	removeDashboardUserByUsername: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	resetDashboardUserPassword: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	triggerDashboardReportByReportId: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	updateDashboardUserDetails: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	updateDashboardUserRoles: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	createDepartmentWithTranslations: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	deleteDepartmentById: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	getDepartmentFilterList: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	listDepartmentsWithSortAndPagination: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	retrieveDepartmentInformation: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	updateDepartmentName: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	createLegalDocumentEntry: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	deleteLegalDocumentById: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	listDiscoveredDocument: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	listLegalDocumentsWithPagination: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	retrieveDiscoveredDocumentById: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	retrieveLegalDocumentById: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	updateDiscoveredDocumentStatus: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	createDomainWithPollingFrequency: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	deleteDomainById: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	getDomainById: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	listDomainsWithPaginationAndSorting: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	pollDomainById: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	updateDomainDetails: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	createEmployeeWithJsonPayload: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	deleteEmployeeById: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	filterEmployeeList: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	listEmployeesWithFilters: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	retrieveEmployeeDetailsById: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	updateEmployeeById: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	createHeadquarterEntry: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	deleteHeadquartersById: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	getHeadquartersById: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	listHeadquartersWithSorting: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	updateHeadquarterDetailsById: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	listDiscoveredInfotypes: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	retrieveDiscoveredInfotypeById: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	updateDiscoveredInfotypeStatus: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	listFilteredSortedCategories: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	listIssuesWithFilters: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	retrieveErrorDetailsById: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	retrieveIssueById: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	submitChatFeedback: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	createDpiaForProcessingActivity: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	createProcessingActivity: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	createProcessingActivityThreshold: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	createThresholdForProcessingActivity: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	deleteDpiaById: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	deleteLopdpThresholdById: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	deleteProcessingActivityById: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	deleteThresholdById: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	exportProcessingActivitiesList: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	getThresholdById: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	listProcessingActivities: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	listProcessingActivitiesFilters: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	listTomsWithFilterAndPaginationOptions: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	putTomStatusAndNote: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	retrieveDpiaById: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	retrieveLopdpThresholdById: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	retrieveProcessingActivityById: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	retrieveTomById: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	updateDpiaById: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	updateLopdpThresholdById: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	updateProcessingActivityDetails: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	updateThresholdById: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	addDiscoveredRecipients: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	archiveDiscoveredRecipient: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	createRecipientWithDetails: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	deleteRecipientById: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	exportRecipientsListWithFilter: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	filterRecipientsList: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	listDiscoveredRecipients: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	listFilterOptionsForRecipients: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	listOrFilterRecipients: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	postDiscoveredRecipientById: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	retrieveDiscoveredRecipientById: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	retrieveRecipientDetails: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	retrieveRecipientProcessingActivities: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	updateDashboardReportFrequencyAndRecipients: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	updateRecipientDetailsById: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	updateRecipientStatusViaId: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	deleteTagFromResource: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	exportFilteredLeafResources: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	exportInventoryResourceList: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	getResourceInventoryById: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	listInventoryResourcesWithFilters: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	listLeafResourcesWithFilters: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	postClassificationStats: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	postResourceLineageFilter: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	postResourceStatsWithDeletedResources: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	retrieveDataResourceStatistics: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	retrieveResourceCatalogById: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	retrieveResourceColumns: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	accessScanIterationById: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	createAndScheduleCloudResourceScan: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	exportInsightPageUsingScanId: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	filterAndListInspectionResults: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	getInsightByTypeAndId: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	getScanByScanId: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	listErrorDetailsFromFilteredScanIterations: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	listInsightFilters: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	listScanExecutionResults: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	listScanIterationsWithFilter: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	listScansWithFilters: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	markScanFalsePositivesById: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	pauseScanById: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	postScanResourceStatus: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	resumeScanById: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	scanLegalDocumentById: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	stopScanViaScanId: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	submitDetailedScanResults: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	postSupportChatQuery: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	getUserProfileById: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	listUserProfileWithFiltersAndSorting: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
	verifyEmailWithIdAndToken: z
		.object({
			data: z
				.object({
					data: z
						.unknown()
						.describe('Data from the action execution')
						.optional(),
					error: z
						.string()
						.describe(
							'Error if any occurred during the execution of the action',
						)
						.optional(),
					successful: z
						.boolean()
						.describe(
							'Whether or not the action execution was successful or not',
						)
						.optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			error: z.unknown().optional(),
			successful: z.boolean().optional(),
			log_id: z.string().optional(),
		})
		.passthrough(),
} as const satisfies Record<BorneoOperationName, z.ZodTypeAny>;

export type BorneoEndpointInputs = {
	[K in BorneoOperationName]: z.infer<(typeof BorneoEndpointInputSchemas)[K]>;
};

export type BorneoEndpointOutputs = {
	[K in BorneoOperationName]: z.infer<(typeof BorneoEndpointOutputSchemas)[K]>;
};

export type BorneoToolInput = BorneoEndpointInputs[BorneoOperationName];

export type BorneoToolResponse = BorneoEndpointOutputs[BorneoOperationName];
