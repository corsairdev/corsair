import { z } from 'zod';
import type { BorneoOperationName } from '../operations';

/**
 * Per-operation Composio execution outputs for toolkit 20260429_00.
 * Envelope fields come from the published tool output tables; inner
 * result keys are the operation's documented request fields plus list
 * page tokens when the tool is a list/filter/export.
 */
export const BorneoEndpointOutputSchemas = {
	getCloudAccountById: z
		.object({
			data: z
				.object({
					data: z
						.object({
							cloudAccountId: z
								.string()
								.describe(
									'The cloud-provider specific account ID, e.g. a 12-digit AWS account ID.',
								)
								.optional(),
						})
						.describe(
							'Inner result for Get cloud account by id. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	postAccountsWithFilterAndSortOptions: z
		.object({
			data: z
				.object({
					data: z
						.object({
							pageSize: z
								.number()
								.describe(
									'The maximum number of records to return per API call. If more records are available, the response will be truncated and will contain a "nextToken" value, which can be used to return additional records.',
								)
								.optional(),
							nextToken: z
								.string()
								.describe(
									'Optional "nextToken" value from the last API response.',
								)
								.optional(),
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
								.string()
								.describe('Filter accounts by status.')
								.optional(),
							filter__accountId: z
								.string()
								.describe('Filter accounts by the Borneo account ID.')
								.optional(),
							filter__activeStates: z
								.boolean()
								.describe(
									'Filters out accounts which are not in deleting or deleted states',
								)
								.optional(),
							filter__cloudAccountId: z
								.string()
								.describe(
									'Filter accounts by the cloud-provider specific account ID.',
								)
								.optional(),
							items: z
								.array(z.string())
								.describe(
									'Result rows returned by Post accounts with filter and sort options.',
								)
								.optional(),
						})
						.describe(
							'Inner result for Post accounts with filter and sort options. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	retrieveAccountDetailsById: z
		.object({
			data: z
				.object({
					data: z
						.object({
							id: z
								.string()
								.describe(
									'Identifier returned by Retrieve account details by id.',
								)
								.optional(),
						})
						.describe(
							'Inner result for Retrieve account details by id. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	createNewAsset: z
		.object({
			data: z
				.object({
					data: z
						.object({
							type: z
								.string()
								.describe(
									'Indicates the type of the asset. An asset can be one of the several options.',
								)
								.optional(),
							locationType: z.string().describe('Locationtype').optional(),
						})
						.describe('Inner result for Create new asset. Toolkit 20260429_00.')
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	deleteAssetById: z
		.object({
			data: z
				.object({
					data: z
						.object({
							id: z
								.string()
								.describe('Identifier returned by Delete asset by id.')
								.optional(),
						})
						.describe(
							'Inner result for Delete asset by id. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	filterAndSortAssetsList: z
		.object({
			data: z
				.object({
					data: z
						.object({
							nextToken: z
								.string()
								.describe(
									'The `nextToken` from the last page of results to retrieve the next page of results.',
								)
								.optional(),
							maxResults: z
								.number()
								.describe(
									'The maximum number of records to return per API call. If more records are available, the response will be truncated and will contain a "nextToken" value, which can be used to return additional records.',
								)
								.optional(),
							filter__type: z.string().describe('Type').optional(),
							sort__column: z
								.string()
								.describe('The column name to sort on.')
								.optional(),
							filter__search: z
								.string()
								.describe('Free-form text search to apply to the asset name.')
								.optional(),
							items: z
								.array(z.string())
								.describe(
									'Result rows returned by Filter and sort assets list.',
								)
								.optional(),
						})
						.describe(
							'Inner result for Filter and sort assets list. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	retrieveAssetById: z
		.object({
			data: z
				.object({
					data: z
						.object({
							id: z
								.string()
								.describe('Identifier returned by Retrieve asset by id.')
								.optional(),
						})
						.describe(
							'Inner result for Retrieve asset by id. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	updateAssetInformationById: z
		.object({
			data: z
				.object({
					data: z
						.object({
							type: z
								.string()
								.describe(
									'Indicates the type of the asset. An asset can be one of the several options.',
								)
								.optional(),
							locationType: z.string().describe('Locationtype').optional(),
						})
						.describe(
							'Inner result for Update asset information by id. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	listEventsWithFilters: z
		.object({
			data: z
				.object({
					data: z
						.object({
							sort__column: z
								.string()
								.describe('The column name to sort on.')
								.optional(),
							filter__newInfotypeFound: z
								.boolean()
								.describe('Newinfotypefound')
								.optional(),
							nextToken: z
								.string()
								.describe(
									'Optional "nextToken" value from the last API response.',
								)
								.optional(),
							items: z
								.array(z.string())
								.describe('Result rows returned by List events with filters.')
								.optional(),
						})
						.describe(
							'Inner result for List events with filters. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	postFilteredAccessLogs: z
		.object({
			data: z
				.object({
					data: z
						.object({
							pageSize: z
								.number()
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
								.describe(
									'Filters all logs with user email eg. "user@example.com".',
								)
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
							items: z
								.array(z.string())
								.describe('Result rows returned by Post filtered access logs.')
								.optional(),
						})
						.describe(
							'Inner result for Post filtered access logs. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	postLogAuditRecordsWithFilterCriteria: z
		.object({
			data: z
				.object({
					data: z
						.object({
							pageSize: z
								.number()
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
							filter__category: z.string().describe('Category').optional(),
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
							items: z
								.array(z.string())
								.describe(
									'Result rows returned by Post log audit records with filter criteria.',
								)
								.optional(),
						})
						.describe(
							'Inner result for Post log audit records with filter criteria. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	deleteDataBreachById: z
		.object({
			data: z
				.object({
					data: z
						.object({
							id: z
								.string()
								.describe('Identifier returned by Delete data breach by id.')
								.optional(),
						})
						.describe(
							'Inner result for Delete data breach by id. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	evaluateDataBreachImpact: z
		.object({
			data: z
				.object({
					data: z
						.object({
							role: z.string().describe('Role of the recipient.').optional(),
							reportLanguage: z.string().describe('Reportlanguage').optional(),
							dataBreachLocation: z
								.string()
								.describe('Databreachlocation')
								.optional(),
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
						.describe(
							'Inner result for Evaluate data breach impact. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	fetchDataBreachEvaluation: z
		.object({
			data: z
				.object({
					data: z
						.object({
							id: z
								.string()
								.describe(
									'Identifier returned by Fetch data breach evaluation.',
								)
								.optional(),
						})
						.describe(
							'Inner result for Fetch data breach evaluation. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	listDataBreachFilters: z
		.object({
			data: z
				.object({
					data: z
						.object({
							nextToken: z
								.string()
								.describe(
									'Optional "nextToken" value from the last API response.',
								)
								.optional(),
							items: z
								.array(z.string())
								.describe('Result rows returned by List data breach filters.')
								.optional(),
						})
						.describe(
							'Inner result for List data breach filters. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	listDataBreachesWithFilters: z
		.object({
			data: z
				.object({
					data: z
						.object({
							pageSize: z
								.number()
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
							sort__column: z
								.string()
								.describe('The column name to sort on.')
								.optional(),
							filter__search: z
								.string()
								.describe(
									'Free-form text search to apply to data breaches short description.',
								)
								.optional(),
							filter__authoritiesNotified: z
								.boolean()
								.describe('Authoritiesnotified')
								.optional(),
							items: z
								.array(z.string())
								.describe(
									'Result rows returned by List data breaches with filters.',
								)
								.optional(),
						})
						.describe(
							'Inner result for List data breaches with filters. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	postDataBreachInformation: z
		.object({
			data: z
				.object({
					data: z
						.object({
							language: z.string().describe('Language').optional(),
							authoritiesInformed: z
								.string()
								.describe('Authoritiesinformed')
								.optional(),
							numberAffectedPeople: z
								.number()
								.describe('Numberaffectedpeople')
								.optional(),
							additionalInformation: z
								.string()
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
						.describe(
							'Inner result for Post data breach information. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	retrieveDataBreachById: z
		.object({
			data: z
				.object({
					data: z
						.object({
							id: z
								.string()
								.describe('Identifier returned by Retrieve data breach by id.')
								.optional(),
						})
						.describe(
							'Inner result for Retrieve data breach by id. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	updateDataBreachEntry: z
		.object({
			data: z
				.object({
					data: z
						.object({
							authoritiesInformed: z
								.string()
								.describe('Authoritiesinformed')
								.optional(),
							numberAffectedPeople: z
								.number()
								.describe('Numberaffectedpeople')
								.optional(),
							additionalInformation: z
								.string()
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
						.describe(
							'Inner result for Update data breach entry. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	createNewInfotypeCategory: z
		.object({
			data: z
				.object({
					data: z
						.object({
							infotypes: z
								.string()
								.describe('The list of infotypes that belong to this category.')
								.optional(),
							description: z
								.string()
								.describe('Description of the infotype category.')
								.optional(),
						})
						.describe(
							'Inner result for Create new infotype category. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	deleteCategoryByLabel: z
		.object({
			data: z
				.object({
					data: z
						.object({
							id: z
								.string()
								.describe('Identifier returned by Delete category by label.')
								.optional(),
						})
						.describe(
							'Inner result for Delete category by label. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	getCategoryByLabel: z
		.object({
			data: z
				.object({
					data: z
						.object({
							id: z
								.string()
								.describe('Identifier returned by Get category by label.')
								.optional(),
						})
						.describe(
							'Inner result for Get category by label. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	updateCategoryInfotypes: z
		.object({
			data: z
				.object({
					data: z
						.object({
							infotypes: z
								.string()
								.describe('The list of infotypes that belong to this category.')
								.optional(),
							description: z
								.string()
								.describe('The description of the infotype category.')
								.optional(),
						})
						.describe(
							'Inner result for Update category infotypes. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	postConnectorWithFilteringOptions: z
		.object({
			data: z
				.object({
					data: z
						.object({
							pageSize: z
								.number()
								.describe(
									'The maximum number of records to return per API call. If more records are available, the response will be truncated and will contain a "nextToken" value, which can be used to return additional records.',
								)
								.optional(),
							nextToken: z
								.string()
								.describe(
									'Optional "nextToken" value from the last API response.',
								)
								.optional(),
							sort__column: z
								.string()
								.describe('The column name to sort on.')
								.optional(),
							filter__names: z
								.string()
								.describe('Filter based on connector name.')
								.optional(),
							filter__search: z
								.string()
								.describe('Search for connectors by name.')
								.optional(),
							filter__states: z
								.string()
								.describe('Filter based on connector state.')
								.optional(),
							filter__resourceIds: z
								.string()
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
								.string()
								.describe('Filter based on the connector IDs.')
								.optional(),
							filter__dataPlaneIds: z
								.string()
								.describe(
									'Filter based on the data plane in which the connector is deployed.',
								)
								.optional(),
							filter__resourceTypes: z
								.string()
								.describe(
									'Filter based on the resource type that the connector supports.',
								)
								.optional(),
							filter__connectorTypes: z
								.string()
								.describe('Filter based on the connector type.')
								.optional(),
							items: z
								.array(z.string())
								.describe(
									'Result rows returned by Post connector with filtering options.',
								)
								.optional(),
						})
						.describe(
							'Inner result for Post connector with filtering options. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	retrieveConnectorById: z
		.object({
			data: z
				.object({
					data: z
						.object({
							id: z
								.string()
								.describe('Identifier returned by Retrieve connector by id.')
								.optional(),
						})
						.describe(
							'Inner result for Retrieve connector by id. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	createDashboardUser: z
		.object({
			data: z
				.object({
					data: z
						.object({
							roles: z.string().describe('Roles').optional(),
							organisations: z.string().describe('Roles').optional(),
						})
						.describe(
							'Inner result for Create dashboard user. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	deleteDashboardReportById: z
		.object({
			data: z
				.object({
					data: z
						.object({
							id: z
								.string()
								.describe(
									'Identifier returned by Delete dashboard report by id.',
								)
								.optional(),
						})
						.describe(
							'Inner result for Delete dashboard report by id. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	disableDashboardUserByUsername: z
		.object({
			data: z
				.object({
					data: z
						.object({
							id: z
								.string()
								.describe(
									'Identifier returned by Disable dashboard user by username.',
								)
								.optional(),
						})
						.describe(
							'Inner result for Disable dashboard user by username. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	downloadDashboardReport: z
		.object({
			data: z
				.object({
					data: z
						.object({
							reportType: z.string().describe('Reporttype').optional(),
						})
						.describe(
							'Inner result for Download dashboard report. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	downloadDashboardReportEdition: z
		.object({
			data: z
				.object({
					data: z
						.object({
							id: z
								.string()
								.describe(
									'Identifier returned by Download dashboard report edition.',
								)
								.optional(),
						})
						.describe(
							'Inner result for Download dashboard report edition. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	enableDashboardUser: z
		.object({
			data: z
				.object({
					data: z
						.object({
							id: z
								.string()
								.describe('Identifier returned by Enable dashboard user.')
								.optional(),
						})
						.describe(
							'Inner result for Enable dashboard user. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	fetchDashboardReportById: z
		.object({
			data: z
				.object({
					data: z
						.object({
							id: z
								.string()
								.describe(
									'Identifier returned by Fetch dashboard report by id.',
								)
								.optional(),
						})
						.describe(
							'Inner result for Fetch dashboard report by id. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	getDashboardReportEditionById: z
		.object({
			data: z
				.object({
					data: z
						.object({
							id: z
								.string()
								.describe(
									'Identifier returned by Get dashboard report edition by id.',
								)
								.optional(),
						})
						.describe(
							'Inner result for Get dashboard report edition by id. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	listDashboardReportEditions: z
		.object({
			data: z
				.object({
					data: z
						.object({
							pageSize: z
								.number()
								.describe(
									'The maximum number of records to return per API call. If more records are available, the response will be truncated and will contain a "nextToken" value, which can be used to return additional records.',
								)
								.optional(),
							sort__column: z
								.string()
								.describe('The column name to sort on.')
								.optional(),
							dashboardReportId: z
								.string()
								.describe(
									'The `nextToken` from the last page of results to retrieve the next page of results.',
								)
								.optional(),
							nextToken: z
								.string()
								.describe(
									'Optional "nextToken" value from the last API response.',
								)
								.optional(),
							items: z
								.array(z.string())
								.describe(
									'Result rows returned by List dashboard report editions.',
								)
								.optional(),
						})
						.describe(
							'Inner result for List dashboard report editions. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	listDashboardReportsWithFilters: z
		.object({
			data: z
				.object({
					data: z
						.object({
							pageSize: z
								.number()
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
							filter__type: z.string().describe('Type').optional(),
							sort__column: z
								.string()
								.describe('The column name to sort on.')
								.optional(),
							filter__search: z
								.string()
								.describe('Free-form text search to apply to the scan name.')
								.optional(),
							filter__frequency: z.string().describe('Frequency').optional(),
							items: z
								.array(z.string())
								.describe(
									'Result rows returned by List dashboard reports with filters.',
								)
								.optional(),
						})
						.describe(
							'Inner result for List dashboard reports with filters. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	listDashboardUsersWithFilters: z
		.object({
			data: z
				.object({
					data: z
						.object({
							filter__roles: z.string().describe('Roles').optional(),
							filter__departments: z
								.string()
								.describe('Departments')
								.optional(),
							filter__organisationId: z
								.number()
								.describe('Organisationid')
								.optional(),
							nextToken: z
								.string()
								.describe(
									'Optional "nextToken" value from the last API response.',
								)
								.optional(),
							items: z
								.array(z.string())
								.describe(
									'Result rows returned by List dashboard users with filters.',
								)
								.optional(),
						})
						.describe(
							'Inner result for List dashboard users with filters. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	postCurrentDashboardUser: z
		.object({
			data: z
				.object({
					data: z
						.object({
							id: z
								.string()
								.describe('Identifier returned by Post current dashboard user.')
								.optional(),
						})
						.describe(
							'Inner result for Post current dashboard user. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	postDashboardReport: z
		.object({
			data: z
				.object({
					data: z
						.object({
							roles: z.string().describe('Roles').optional(),
							frequency: z
								.string()
								.describe(
									'The cron schedule expression to use for a recurring scan. Only a fixed set of cron expressions can be used to run scans at 30 minute, 1 hour, 1 day, or 1 week intervals.',
								)
								.optional(),
							reportTypes: z.string().describe('Reporttypes').optional(),
							recipientsEmail: z
								.string()
								.describe('Recipientsemail')
								.optional(),
						})
						.describe(
							'Inner result for Post dashboard report. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	removeDashboardUserByUsername: z
		.object({
			data: z
				.object({
					data: z
						.object({
							id: z
								.string()
								.describe(
									'Identifier returned by Remove dashboard user by username.',
								)
								.optional(),
						})
						.describe(
							'Inner result for Remove dashboard user by username. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	resetDashboardUserPassword: z
		.object({
			data: z
				.object({
					data: z
						.object({
							id: z
								.string()
								.describe(
									'Identifier returned by Reset dashboard user password.',
								)
								.optional(),
						})
						.describe(
							'Inner result for Reset dashboard user password. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	triggerDashboardReportByReportId: z
		.object({
			data: z
				.object({
					data: z
						.object({
							id: z
								.string()
								.describe(
									'Identifier returned by Trigger dashboard report by report id.',
								)
								.optional(),
						})
						.describe(
							'Inner result for Trigger dashboard report by report id. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	updateDashboardUserDetails: z
		.object({
			data: z
				.object({
					data: z
						.object({
							id: z
								.string()
								.describe(
									'Identifier returned by Update dashboard user details.',
								)
								.optional(),
						})
						.describe(
							'Inner result for Update dashboard user details. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	updateDashboardUserRoles: z
		.object({
			data: z
				.object({
					data: z
						.object({
							organisations: z.string().describe('Roles').optional(),
						})
						.describe(
							'Inner result for Update dashboard user roles. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	createDepartmentWithTranslations: z
		.object({
			data: z
				.object({
					data: z
						.object({
							translations: z.string().describe('Translations').optional(),
						})
						.describe(
							'Inner result for Create department with translations. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	deleteDepartmentById: z
		.object({
			data: z
				.object({
					data: z
						.object({
							id: z
								.string()
								.describe('Identifier returned by Delete department by id.')
								.optional(),
						})
						.describe(
							'Inner result for Delete department by id. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	getDepartmentFilterList: z
		.object({
			data: z
				.object({
					data: z
						.object({
							nextToken: z
								.string()
								.describe(
									'Optional "nextToken" value from the last API response.',
								)
								.optional(),
							items: z
								.array(z.string())
								.describe('Result rows returned by Get department filter list.')
								.optional(),
						})
						.describe(
							'Inner result for Get department filter list. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	listDepartmentsWithSortAndPagination: z
		.object({
			data: z
				.object({
					data: z
						.object({
							pageSize: z
								.number()
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
							sort__column: z
								.string()
								.describe('The column name to sort on.')
								.optional(),
							filter__search: z
								.string()
								.describe(
									'Free-form text search to apply to the department name.',
								)
								.optional(),
							items: z
								.array(z.string())
								.describe(
									'Result rows returned by List departments with sort and pagination.',
								)
								.optional(),
						})
						.describe(
							'Inner result for List departments with sort and pagination. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	retrieveDepartmentInformation: z
		.object({
			data: z
				.object({
					data: z
						.object({
							id: z
								.string()
								.describe(
									'Identifier returned by Retrieve department information.',
								)
								.optional(),
						})
						.describe(
							'Inner result for Retrieve department information. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	updateDepartmentName: z
		.object({
			data: z
				.object({
					data: z
						.object({
							id: z
								.string()
								.describe('Identifier returned by Update department name.')
								.optional(),
						})
						.describe(
							'Inner result for Update department name. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	createLegalDocumentEntry: z
		.object({
			data: z
				.object({
					data: z
						.object({
							type: z.string().describe('Type').optional(),
							fromDiscoveredDocumentId: z
								.string()
								.describe('Fromdiscovereddocumentid')
								.optional(),
						})
						.describe(
							'Inner result for Create legal document entry. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	deleteLegalDocumentById: z
		.object({
			data: z
				.object({
					data: z
						.object({
							id: z
								.string()
								.describe('Identifier returned by Delete legal document by id.')
								.optional(),
						})
						.describe(
							'Inner result for Delete legal document by id. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	listDiscoveredDocument: z
		.object({
			data: z
				.object({
					data: z
						.object({
							pageSize: z
								.number()
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
							sort__column: z
								.string()
								.describe('The column name to sort on.')
								.optional(),
							filter__search: z
								.string()
								.describe('Free-form text search to apply to the scan name.')
								.optional(),
							filter__status: z.string().describe('Status').optional(),
							items: z
								.array(z.string())
								.describe('Result rows returned by List discovered document.')
								.optional(),
						})
						.describe(
							'Inner result for List discovered document. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	listLegalDocumentsWithPagination: z
		.object({
			data: z
				.object({
					data: z
						.object({
							pageSize: z
								.number()
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
							sort__column: z
								.string()
								.describe('The column name to sort on.')
								.optional(),
							filter__search: z
								.string()
								.describe('Free-form text search to apply to the scan name.')
								.optional(),
							filter__status: z.string().describe('Status').optional(),
							items: z
								.array(z.string())
								.describe(
									'Result rows returned by List legal documents with pagination.',
								)
								.optional(),
						})
						.describe(
							'Inner result for List legal documents with pagination. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	retrieveDiscoveredDocumentById: z
		.object({
			data: z
				.object({
					data: z
						.object({
							id: z
								.string()
								.describe(
									'Identifier returned by Retrieve discovered document by id.',
								)
								.optional(),
						})
						.describe(
							'Inner result for Retrieve discovered document by id. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	retrieveLegalDocumentById: z
		.object({
			data: z
				.object({
					data: z
						.object({
							id: z
								.string()
								.describe(
									'Identifier returned by Retrieve legal document by id.',
								)
								.optional(),
						})
						.describe(
							'Inner result for Retrieve legal document by id. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	updateDiscoveredDocumentStatus: z
		.object({
			data: z
				.object({
					data: z
						.object({
							status: z.string().describe('Status').optional(),
						})
						.describe(
							'Inner result for Update discovered document status. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	createDomainWithPollingFrequency: z
		.object({
			data: z
				.object({
					data: z
						.object({
							frequency: z
								.string()
								.describe(
									'Frequency of polling for a domain. Manual polling means that this domain will not be polled automatically.',
								)
								.optional(),
						})
						.describe(
							'Inner result for Create domain with polling frequency. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	deleteDomainById: z
		.object({
			data: z
				.object({
					data: z
						.object({
							id: z
								.string()
								.describe('Identifier returned by Delete domain by id.')
								.optional(),
						})
						.describe(
							'Inner result for Delete domain by id. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	getDomainById: z
		.object({
			data: z
				.object({
					data: z
						.object({
							id: z
								.string()
								.describe('Identifier returned by Get domain by id.')
								.optional(),
						})
						.describe('Inner result for Get domain by id. Toolkit 20260429_00.')
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	listDomainsWithPaginationAndSorting: z
		.object({
			data: z
				.object({
					data: z
						.object({
							pageSize: z
								.number()
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
							sort__column: z
								.string()
								.describe('The column name to sort on.')
								.optional(),
							items: z
								.array(z.string())
								.describe(
									'Result rows returned by List domains with pagination and sorting.',
								)
								.optional(),
						})
						.describe(
							'Inner result for List domains with pagination and sorting. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	pollDomainById: z
		.object({
			data: z
				.object({
					data: z
						.object({
							id: z
								.string()
								.describe('Identifier returned by Poll domain by id.')
								.optional(),
						})
						.describe(
							'Inner result for Poll domain by id. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	updateDomainDetails: z
		.object({
			data: z
				.object({
					data: z
						.object({
							frequency: z
								.string()
								.describe(
									'Frequency of polling for a domain. Manual polling means that this domain will not be polled automatically.',
								)
								.optional(),
						})
						.describe(
							'Inner result for Update domain details. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	createEmployeeWithJsonPayload: z
		.object({
			data: z
				.object({
					data: z
						.object({
							endDate: z
								.string()
								.describe('Date when the employee end to work in your company')
								.optional(),
							manager: z
								.string()
								.describe(
									'employeeId of the employee who is manager of the employee',
								)
								.optional(),
							position: z
								.string()
								.describe('The position of the employee in the company.')
								.optional(),
							startDate: z
								.string()
								.describe(
									'Date when the employee began to work in your company',
								)
								.optional(),
							department: z
								.string()
								.describe('the department of the employee')
								.optional(),
							referenceId: z
								.string()
								.describe(
									'Internal identifier to synchronize with external APIS',
								)
								.optional(),
						})
						.describe(
							'Inner result for Create employee with json payload. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	deleteEmployeeById: z
		.object({
			data: z
				.object({
					data: z
						.object({
							id: z
								.string()
								.describe('Identifier returned by Delete employee by id.')
								.optional(),
						})
						.describe(
							'Inner result for Delete employee by id. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	filterEmployeeList: z
		.object({
			data: z
				.object({
					data: z
						.object({
							pageSize: z
								.number()
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
							sort__column: z
								.string()
								.describe('The column name to sort on.')
								.optional(),
							filter__search: z
								.string()
								.describe(
									'Free-form text search to apply to the employee name.',
								)
								.optional(),
							items: z
								.array(z.string())
								.describe('Result rows returned by Filter employee list.')
								.optional(),
						})
						.describe(
							'Inner result for Filter employee list. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	listEmployeesWithFilters: z
		.object({
			data: z
				.object({
					data: z
						.object({
							pageSize: z
								.number()
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
							sort__column: z
								.string()
								.describe('The column name to sort on.')
								.optional(),
							filter__search: z
								.string()
								.describe(
									'Free-form text search to apply to the employee name.',
								)
								.optional(),
							items: z
								.array(z.string())
								.describe(
									'Result rows returned by List employees with filters.',
								)
								.optional(),
						})
						.describe(
							'Inner result for List employees with filters. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	retrieveEmployeeDetailsById: z
		.object({
			data: z
				.object({
					data: z
						.object({
							id: z
								.string()
								.describe(
									'Identifier returned by Retrieve employee details by id.',
								)
								.optional(),
						})
						.describe(
							'Inner result for Retrieve employee details by id. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	updateEmployeeById: z
		.object({
			data: z
				.object({
					data: z
						.object({
							nif: z
								.string()
								.describe(
									'The NIF (Spanish Tax Identification Number) of the employee',
								)
								.optional(),
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
							position: z
								.string()
								.describe('The position in the company of the employee')
								.optional(),
							startDate: z
								.string()
								.describe(
									'Date when the employee began to work in your company',
								)
								.optional(),
							department: z
								.string()
								.describe('The department of the employee')
								.optional(),
						})
						.describe(
							'Inner result for Update employee by id. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	createHeadquarterEntry: z
		.object({
			data: z
				.object({
					data: z
						.object({
							id: z
								.string()
								.describe('Identifier returned by Create headquarter entry.')
								.optional(),
						})
						.describe(
							'Inner result for Create headquarter entry. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	deleteHeadquartersById: z
		.object({
			data: z
				.object({
					data: z
						.object({
							id: z
								.string()
								.describe('Identifier returned by Delete headquarters by id.')
								.optional(),
						})
						.describe(
							'Inner result for Delete headquarters by id. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	getHeadquartersById: z
		.object({
			data: z
				.object({
					data: z
						.object({
							id: z
								.string()
								.describe('Identifier returned by Get headquarters by id.')
								.optional(),
						})
						.describe(
							'Inner result for Get headquarters by id. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	listHeadquartersWithSorting: z
		.object({
			data: z
				.object({
					data: z
						.object({
							pageSize: z
								.number()
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
							sort__column: z
								.string()
								.describe('The column name to sort on.')
								.optional(),
							items: z
								.array(z.string())
								.describe(
									'Result rows returned by List headquarters with sorting.',
								)
								.optional(),
						})
						.describe(
							'Inner result for List headquarters with sorting. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	updateHeadquarterDetailsById: z
		.object({
			data: z
				.object({
					data: z
						.object({
							id: z
								.string()
								.describe(
									'Identifier returned by Update headquarter details by id.',
								)
								.optional(),
						})
						.describe(
							'Inner result for Update headquarter details by id. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	listDiscoveredInfotypes: z
		.object({
			data: z
				.object({
					data: z
						.object({
							pageSize: z
								.number()
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
							sort__column: z
								.string()
								.describe('The column name to sort on.')
								.optional(),
							filter__search: z
								.string()
								.describe('Free-form text search to apply to the scan name.')
								.optional(),
							filter__status: z.string().describe('Status').optional(),
							items: z
								.array(z.string())
								.describe('Result rows returned by List discovered infotypes.')
								.optional(),
						})
						.describe(
							'Inner result for List discovered infotypes. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	retrieveDiscoveredInfotypeById: z
		.object({
			data: z
				.object({
					data: z
						.object({
							id: z
								.string()
								.describe(
									'Identifier returned by Retrieve discovered infotype by id.',
								)
								.optional(),
						})
						.describe(
							'Inner result for Retrieve discovered infotype by id. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	updateDiscoveredInfotypeStatus: z
		.object({
			data: z
				.object({
					data: z
						.object({
							status: z.string().describe('Status').optional(),
						})
						.describe(
							'Inner result for Update discovered infotype status. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	listFilteredSortedCategories: z
		.object({
			data: z
				.object({
					data: z
						.object({
							sort__column: z
								.string()
								.describe('The column name to sort on.')
								.optional(),
							nextToken: z
								.string()
								.describe(
									'Optional "nextToken" value from the last API response.',
								)
								.optional(),
							items: z
								.array(z.string())
								.describe(
									'Result rows returned by List filtered sorted categories.',
								)
								.optional(),
						})
						.describe(
							'Inner result for List filtered sorted categories. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	listIssuesWithFilters: z
		.object({
			data: z
				.object({
					data: z
						.object({
							select: z
								.string()
								.describe('List of column names to include in the response.')
								.optional(),
							include: z
								.boolean()
								.describe(
									'The set of related resources that should be included in the response using a join-query.',
								)
								.optional(),
							pageSize: z
								.number()
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
							sort__column: z
								.string()
								.describe('The column name to sort on.')
								.optional(),
							filter__search: z
								.string()
								.describe('Free-text search on the resource name.')
								.optional(),
							filter__states: z
								.string()
								.describe('List of isssue states to filter by.')
								.optional(),
							filter__resources: z
								.string()
								.describe('List of resource IDs to filter by.')
								.optional(),
							filter__severities: z
								.string()
								.describe('List of issue severities to filter by.')
								.optional(),
							filter__resourceTypes: z
								.string()
								.describe('List of resource types to filter by.')
								.optional(),
							filter__failedControls: z
								.string()
								.describe('List of failed controls to filter by.')
								.optional(),
							filter__cloudAccountIds: z
								.string()
								.describe('List of cloud provider account IDs to filter by.')
								.optional(),
							filter__cloudAccountTypes: z
								.string()
								.describe('List of cloud provider account types to filter by.')
								.optional(),
							items: z
								.array(z.string())
								.describe('Result rows returned by List issues with filters.')
								.optional(),
						})
						.describe(
							'Inner result for List issues with filters. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	retrieveErrorDetailsById: z
		.object({
			data: z
				.object({
					data: z
						.object({
							id: z
								.string()
								.describe(
									'Identifier returned by Retrieve error details by id.',
								)
								.optional(),
						})
						.describe(
							'Inner result for Retrieve error details by id. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	retrieveIssueById: z
		.object({
			data: z
				.object({
					data: z
						.object({
							id: z
								.string()
								.describe('Identifier returned by Retrieve issue by id.')
								.optional(),
						})
						.describe(
							'Inner result for Retrieve issue by id. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	submitChatFeedback: z
		.object({
			data: z
				.object({
					data: z
						.object({
							id: z
								.string()
								.describe('Identifier returned by Submit chat feedback.')
								.optional(),
						})
						.describe(
							'Inner result for Submit chat feedback. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	createDpiaForProcessingActivity: z
		.object({
			data: z
				.object({
					data: z
						.object({
							status: z
								.string()
								.describe(
									'The status of the DPIA. If a DPIA is saved as activated, several fields are required',
								)
								.optional(),
							translations: z.string().describe('Translations').optional(),
							integrity__impacts: z
								.string()
								.describe(
									'Identifier for the impact of confidentiality risk. Can be an UUID if it"s a custom impact or one of the keys of the default impacts that we offer',
								)
								.optional(),
							integrity__threats: z
								.string()
								.describe(
									'Identifier for the threat of confidentiality risk. Can be an UUID if it"s a custom threat or one of the keys of the default threats that we offer',
								)
								.optional(),
							processingActivityId: z
								.string()
								.describe(
									'Identifier of the processing activity for which we are creating a DPIA',
								)
								.optional(),
							additionalInformation: z
								.string()
								.describe('Additionalinformation')
								.optional(),
							availability__impacts: z
								.string()
								.describe(
									'Identifier for the impact of confidentiality risk. Can be an UUID if it"s a custom impact or one of the keys of the default impacts that we offer',
								)
								.optional(),
							availability__threats: z
								.string()
								.describe(
									'Identifier for the threat of confidentiality risk. Can be an UUID if it"s a custom threat or one of the keys of the default threats that we offer',
								)
								.optional(),
							integrity__plannedToms: z
								.string()
								.describe(
									'List of TOMs that are planned to be implemented to prevent integrity risk. At least one element is necessary DPIA is saved as activated',
								)
								.optional(),
							integrity__riskSources: z
								.string()
								.describe(
									'Identifier for the risk source of a risk. Can be an UUID if it"s a custom risk source or one of the keys of the default risk sources that we offer',
								)
								.optional(),
							confidentiality__impacts: z
								.string()
								.describe(
									'Identifier for the impact of confidentiality risk. Can be an UUID if it"s a custom impact or one of the keys of the default impacts that we offer',
								)
								.optional(),
							confidentiality__threats: z
								.string()
								.describe(
									'Identifier for the threat of confidentiality risk. Can be an UUID if it"s a custom threat or one of the keys of the default threats that we offer',
								)
								.optional(),
							availability__plannedToms: z
								.string()
								.describe(
									'List of TOMs planned to be implemented and that applies to the availability risk. At least one element is necessary DPIA is saved as activated',
								)
								.optional(),
							availability__riskSources: z
								.string()
								.describe(
									'Identifier for the risk source of a risk. Can be an UUID if it"s a custom risk source or one of the keys of the default risk sources that we offer',
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
								.string()
								.describe('Additionalinformationfiles')
								.optional(),
							integrity__baselineComment: z
								.string()
								.describe(
									'Comment to add additional information about the baseline risk of the integrity',
								)
								.optional(),
							integrity__implementedToms: z
								.string()
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
								.string()
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
								.describe(
									'Comment to add additional information about the impact',
								)
								.optional(),
							availability__threatsComment: z
								.string()
								.describe(
									'Comment to add additional information about the threat',
								)
								.optional(),
							confidentiality__plannedToms: z
								.string()
								.describe(
									'List of TOMs that are planned to be implemented to prevent confidentiality risk. At least one element is necessary DPIA is saved as activated',
								)
								.optional(),
							confidentiality__riskSources: z
								.string()
								.describe(
									'Identifier for the risk source of a risk. Can be an UUID if it"s a custom risk source or one of the keys of the default risk sources that we offer',
								)
								.optional(),
							availability__baselineComment: z
								.string()
								.describe(
									'Comment to add additional information about the baseline risk of the availablity',
								)
								.optional(),
							availability__implementedToms: z
								.string()
								.describe(
									'List of implemented TOMs that applies to the availability risk. At least one element is necessary DPIA is saved as activated',
								)
								.optional(),
							integrity__baselineLikelihood: z
								.string()
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
								.string()
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
								.string()
								.describe('Represents the severity of a risk')
								.optional(),
							availability__baselineLikelihood: z
								.string()
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
								.string()
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
								.string()
								.describe('Represents the severity of a risk')
								.optional(),
							integrity__implementedTomsComment: z
								.string()
								.describe(
									'Comment to add additional information about implemented TOMs to prevent integrity risk',
								)
								.optional(),
							integrity__residualRiskLikelihood: z
								.string()
								.describe('Residualrisklikelihood')
								.optional(),
							availability__residualRiskSeverity: z
								.string()
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
								.string()
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
								.string()
								.describe('Residualrisklikelihood')
								.optional(),
							confidentiality__residualRiskComment: z
								.string()
								.describe(
									'Comment to add additional information about the residual risk of the confidentiality',
								)
								.optional(),
							confidentiality__residualRiskSeverity: z
								.string()
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
								.string()
								.describe('Residualrisklikelihood')
								.optional(),
						})
						.describe(
							'Inner result for Create dpia for processing activity. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	createProcessingActivity: z
		.object({
			data: z
				.object({
					data: z
						.object({
							active: z
								.boolean()
								.describe(
									'Flag to create the processing activity as activated or draft',
								)
								.optional(),
							assets: z
								.string()
								.describe('List assets ids related to the processing activity.')
								.optional(),
							language: z.string().describe('Language').optional(),
							infotypes: z
								.string()
								.describe(
									'List of info types related with the processing activity.',
								)
								.optional(),
							recipients: z
								.string()
								.describe(
									'Role of the recipient for this processing activity. The role of a recipient can be different between processing activities',
								)
								.optional(),
							companyRole: z.string().describe('Companyrole').optional(),
							departments: z
								.string()
								.describe(
									'List departments related with the processing activity.',
								)
								.optional(),
							lawfulBasis: z.string().describe('Comment').optional(),
							dataSubjects: z
								.string()
								.describe(
									'List of Data Subjects affected by the processing activity',
								)
								.optional(),
							isDataStored: z
								.boolean()
								.describe('Indicates if you store the data.')
								.optional(),
							translations: z.string().describe('Translations').optional(),
							contactPerson: z
								.string()
								.describe('Contact person for the processing activity.')
								.optional(),
							additionalInfo: z
								.string()
								.describe(
									'Text to add more information about the processing activity',
								)
								.optional(),
							infotypeVolume: z
								.string()
								.describe('Ranges of the processed infotype volume.')
								.optional(),
							managementMethods: z.string().describe('Email').optional(),
							infotypeCategories: z
								.string()
								.describe(
									'List of info types categories related with the processing activity.',
								)
								.optional(),
							additionalInfoFiles: z
								.string()
								.describe('List of uploaded file ids.')
								.optional(),
							processingFrequency: z
								.string()
								.describe('Data processing frequency.')
								.optional(),
							dataFlowRelationships: z.string().describe('Type').optional(),
							retentionPeriod__unit: z
								.string()
								.describe('Unit of time that is used for retention period')
								.optional(),
							retentionPeriodComment: z
								.string()
								.describe('Retentionperiodcomment')
								.optional(),
							areAccessRequestsManaged: z
								.boolean()
								.describe(
									'Indicates if the data subject access requests are managed.',
								)
								.optional(),
							processingFrequencyComment: z
								.string()
								.describe('Processingfrequencycomment')
								.optional(),
							processingActivitiesAsDataSources: z
								.string()
								.describe('Processingactivitiesasdatasources')
								.optional(),
						})
						.describe(
							'Inner result for Create processing activity. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	createProcessingActivityThreshold: z
		.object({
			data: z
				.object({
					data: z
						.object({
							status: z
								.string()
								.describe('Status of the threshold. Can be draft or activated.')
								.optional(),
							comment: z
								.string()
								.describe('Additional information related to the Threshold')
								.optional(),
							processingActivityId: z
								.string()
								.describe(
									'Identifier of the processing activity for which the threshold will be created',
								)
								.optional(),
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
						.describe(
							'Inner result for Create processing activity threshold. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	createThresholdForProcessingActivity: z
		.object({
			data: z
				.object({
					data: z
						.object({
							status: z
								.string()
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
							translations: z.string().describe('Translations').optional(),
							processingActivityId: z
								.string()
								.describe(
									'Identifier of the processing activity for which the threshold will be created',
								)
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
						.describe(
							'Inner result for Create threshold for processing activity. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	deleteDpiaById: z
		.object({
			data: z
				.object({
					data: z
						.object({
							id: z
								.string()
								.describe('Identifier returned by Delete dpia by id.')
								.optional(),
						})
						.describe(
							'Inner result for Delete dpia by id. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	deleteLopdpThresholdById: z
		.object({
			data: z
				.object({
					data: z
						.object({
							id: z
								.string()
								.describe(
									'Identifier returned by Delete lopdp threshold by id.',
								)
								.optional(),
						})
						.describe(
							'Inner result for Delete lopdp threshold by id. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	deleteProcessingActivityById: z
		.object({
			data: z
				.object({
					data: z
						.object({
							processingActivityId: z
								.string()
								.describe('Identifier of the Processing Activity')
								.optional(),
						})
						.describe(
							'Inner result for Delete processing activity by id. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	deleteThresholdById: z
		.object({
			data: z
				.object({
					data: z
						.object({
							id: z
								.string()
								.describe('Identifier returned by Delete threshold by id.')
								.optional(),
						})
						.describe(
							'Inner result for Delete threshold by id. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	exportProcessingActivitiesList: z
		.object({
			data: z
				.object({
					data: z
						.object({
							language: z.string().describe('Language').optional(),
							exportTypes: z.string().describe('Exporttypes').optional(),
							filter__departments: z
								.string()
								.describe('Departments')
								.optional(),
							filter__dataSubjects: z
								.string()
								.describe('Datasubjects')
								.optional(),
							filter__processingActivityId: z
								.string()
								.describe('Processingactivityid')
								.optional(),
							nextToken: z
								.string()
								.describe(
									'Optional "nextToken" value from the last API response.',
								)
								.optional(),
							items: z
								.array(z.string())
								.describe(
									'Result rows returned by Export processing activities list.',
								)
								.optional(),
						})
						.describe(
							'Inner result for Export processing activities list. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	getThresholdById: z
		.object({
			data: z
				.object({
					data: z
						.object({
							id: z
								.string()
								.describe('Identifier returned by Get threshold by id.')
								.optional(),
						})
						.describe(
							'Inner result for Get threshold by id. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	listProcessingActivities: z
		.object({
			data: z
				.object({
					data: z
						.object({
							pageSize: z
								.number()
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
							sort__column: z
								.string()
								.describe('The column name to sort on.')
								.optional(),
							filter__search: z
								.string()
								.describe(
									'Free-form text search to apply to processing activity name.',
								)
								.optional(),
							filter__dataSources: z
								.string()
								.describe('Datasources')
								.optional(),
							filter__departments: z
								.string()
								.describe('Departments')
								.optional(),
							filter__companyRoles: z
								.string()
								.describe('Companyroles')
								.optional(),
							filter__dataSubjects: z
								.string()
								.describe('Datasubjects')
								.optional(),
							filter__paAsDataSource: z
								.string()
								.describe('Paasdatasource')
								.optional(),
							filter__infotypeCategories: z
								.string()
								.describe('Infotypecategories')
								.optional(),
							items: z
								.array(z.string())
								.describe('Result rows returned by List processing activities.')
								.optional(),
						})
						.describe(
							'Inner result for List processing activities. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	listProcessingActivitiesFilters: z
		.object({
			data: z
				.object({
					data: z
						.object({
							filterType: z
								.string()
								.describe('Type of filter to retrieve options for')
								.optional(),
							nextToken: z
								.string()
								.describe(
									'Optional "nextToken" value from the last API response.',
								)
								.optional(),
							items: z
								.array(z.string())
								.describe(
									'Result rows returned by List processing activities filters.',
								)
								.optional(),
						})
						.describe(
							'Inner result for List processing activities filters. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	listTomsWithFilterAndPaginationOptions: z
		.object({
			data: z
				.object({
					data: z
						.object({
							pageSize: z
								.number()
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
							sort__column: z
								.string()
								.describe('The column name to sort on.')
								.optional(),
							filter__search: z
								.string()
								.describe('Free-form text search to apply to the toms name.')
								.optional(),
							filter__objectCategory: z
								.string()
								.describe('Objectcategory')
								.optional(),
							items: z
								.array(z.string())
								.describe(
									'Result rows returned by List toms with filter and pagination options.',
								)
								.optional(),
						})
						.describe(
							'Inner result for List toms with filter and pagination options. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	putTomStatusAndNote: z
		.object({
			data: z
				.object({
					data: z
						.object({
							status: z
								.string()
								.describe(
									'Status of the TOM, i.e. whether the TOM is already implemented, implementation is pending, or the TOM is not implemented.',
								)
								.optional(),
							documentFiles: z
								.string()
								.describe('Uploaded file id list.')
								.optional(),
						})
						.describe(
							'Inner result for Put tom status and note. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	retrieveDpiaById: z
		.object({
			data: z
				.object({
					data: z
						.object({
							id: z
								.string()
								.describe('Identifier returned by Retrieve dpia by id.')
								.optional(),
						})
						.describe(
							'Inner result for Retrieve dpia by id. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	retrieveLopdpThresholdById: z
		.object({
			data: z
				.object({
					data: z
						.object({
							id: z
								.string()
								.describe(
									'Identifier returned by Retrieve lopdp threshold by id.',
								)
								.optional(),
						})
						.describe(
							'Inner result for Retrieve lopdp threshold by id. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	retrieveProcessingActivityById: z
		.object({
			data: z
				.object({
					data: z
						.object({
							processingActivityId: z
								.string()
								.describe('Identifier of the Processing Activity')
								.optional(),
						})
						.describe(
							'Inner result for Retrieve processing activity by id. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	retrieveTomById: z
		.object({
			data: z
				.object({
					data: z
						.object({
							id: z
								.string()
								.describe('Identifier returned by Retrieve tom by id.')
								.optional(),
						})
						.describe(
							'Inner result for Retrieve tom by id. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	updateDpiaById: z
		.object({
			data: z
				.object({
					data: z
						.object({
							status: z
								.string()
								.describe(
									'The status of the DPIA. If a DPIA is saved as activated, several fields are required',
								)
								.optional(),
							translations: z.string().describe('Translations').optional(),
							integrity__impacts: z
								.string()
								.describe(
									'Identifier for the impact of confidentiality risk. Can be an UUID if it"s a custom impact or one of the keys of the default impacts that we offer',
								)
								.optional(),
							integrity__threats: z
								.string()
								.describe(
									'Identifier for the threat of confidentiality risk. Can be an UUID if it"s a custom threat or one of the keys of the default threats that we offer',
								)
								.optional(),
							additionalInformation: z
								.string()
								.describe('Additionalinformation')
								.optional(),
							availability__impacts: z
								.string()
								.describe(
									'Identifier for the impact of confidentiality risk. Can be an UUID if it"s a custom impact or one of the keys of the default impacts that we offer',
								)
								.optional(),
							availability__threats: z
								.string()
								.describe(
									'Identifier for the threat of confidentiality risk. Can be an UUID if it"s a custom threat or one of the keys of the default threats that we offer',
								)
								.optional(),
							integrity__plannedToms: z
								.string()
								.describe(
									'List of TOMs that are planned to be implemented to prevent integrity risk. At least one element is necessary DPIA is saved as activated',
								)
								.optional(),
							integrity__riskSources: z
								.string()
								.describe(
									'Identifier for the risk source of a risk. Can be an UUID if it"s a custom risk source or one of the keys of the default risk sources that we offer',
								)
								.optional(),
							confidentiality__impacts: z
								.string()
								.describe(
									'Identifier for the impact of confidentiality risk. Can be an UUID if it"s a custom impact or one of the keys of the default impacts that we offer',
								)
								.optional(),
							confidentiality__threats: z
								.string()
								.describe(
									'Identifier for the threat of confidentiality risk. Can be an UUID if it"s a custom threat or one of the keys of the default threats that we offer',
								)
								.optional(),
							availability__plannedToms: z
								.string()
								.describe(
									'List of TOMs planned to be implemented and that applies to the availability risk. At least one element is necessary DPIA is saved as activated',
								)
								.optional(),
							availability__riskSources: z
								.string()
								.describe(
									'Identifier for the risk source of a risk. Can be an UUID if it"s a custom risk source or one of the keys of the default risk sources that we offer',
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
								.string()
								.describe('Additionalinformationfiles')
								.optional(),
							integrity__baselineComment: z
								.string()
								.describe(
									'Comment to add additional information about the baseline risk of the integrity',
								)
								.optional(),
							integrity__implementedToms: z
								.string()
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
								.string()
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
								.describe(
									'Comment to add additional information about the impact',
								)
								.optional(),
							availability__threatsComment: z
								.string()
								.describe(
									'Comment to add additional information about the threat',
								)
								.optional(),
							confidentiality__plannedToms: z
								.string()
								.describe(
									'List of TOMs that are planned to be implemented to prevent confidentiality risk. At least one element is necessary DPIA is saved as activated',
								)
								.optional(),
							confidentiality__riskSources: z
								.string()
								.describe(
									'Identifier for the risk source of a risk. Can be an UUID if it"s a custom risk source or one of the keys of the default risk sources that we offer',
								)
								.optional(),
							availability__baselineComment: z
								.string()
								.describe(
									'Comment to add additional information about the baseline risk of the availablity',
								)
								.optional(),
							availability__implementedToms: z
								.string()
								.describe(
									'List of implemented TOMs that applies to the availability risk. At least one element is necessary DPIA is saved as activated',
								)
								.optional(),
							integrity__baselineLikelihood: z
								.string()
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
								.string()
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
								.string()
								.describe('Represents the severity of a risk')
								.optional(),
							availability__baselineLikelihood: z
								.string()
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
								.string()
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
								.string()
								.describe('Represents the severity of a risk')
								.optional(),
							integrity__implementedTomsComment: z
								.string()
								.describe(
									'Comment to add additional information about implemented TOMs to prevent integrity risk',
								)
								.optional(),
							integrity__residualRiskLikelihood: z
								.string()
								.describe('Residualrisklikelihood')
								.optional(),
							availability__residualRiskSeverity: z
								.string()
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
								.string()
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
								.string()
								.describe('Residualrisklikelihood')
								.optional(),
							confidentiality__residualRiskComment: z
								.string()
								.describe(
									'Comment to add additional information about the residual risk of the confidentiality',
								)
								.optional(),
							confidentiality__residualRiskSeverity: z
								.string()
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
								.string()
								.describe('Residualrisklikelihood')
								.optional(),
						})
						.describe(
							'Inner result for Update dpia by id. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	updateLopdpThresholdById: z
		.object({
			data: z
				.object({
					data: z
						.object({
							status: z
								.string()
								.describe('Status of the threshold. Can be draft or activated.')
								.optional(),
							comment: z
								.string()
								.describe('Additional information related to the Threshold')
								.optional(),
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
						.describe(
							'Inner result for Update lopdp threshold by id. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	updateProcessingActivityDetails: z
		.object({
			data: z
				.object({
					data: z
						.object({
							active: z
								.boolean()
								.describe(
									'Flag to create the processing activity as activated or draft',
								)
								.optional(),
							assets: z
								.string()
								.describe('List assets ids related to the processing activity.')
								.optional(),
							purpose: z
								.string()
								.describe('Purpose of the processing activity')
								.optional(),
							infotypes: z
								.string()
								.describe(
									'List of info types related with the processing activity.',
								)
								.optional(),
							recipients: z
								.string()
								.describe(
									'Role of the recipient for this processing activity. The role of a recipient can be different between processing activities',
								)
								.optional(),
							companyRole: z.string().describe('Companyrole').optional(),
							departments: z
								.string()
								.describe(
									'List departments related with the processing activity.',
								)
								.optional(),
							lawfulBasis: z.string().describe('Comment').optional(),
							dataSubjects: z
								.string()
								.describe(
									'List of Data Subjects affected by the processing activity',
								)
								.optional(),
							isDataStored: z
								.boolean()
								.describe('Indicates if you store the data.')
								.optional(),
							translations: z.string().describe('Translations').optional(),
							contactPerson: z
								.string()
								.describe('Contact person for the processing activity.')
								.optional(),
							additionalInfo: z
								.string()
								.describe(
									'Text to add more information about the processing activity',
								)
								.optional(),
							infotypeVolume: z
								.string()
								.describe('Ranges of the processed infotype volume.')
								.optional(),
							managementMethods: z.string().describe('Email').optional(),
							infotypeCategories: z
								.string()
								.describe(
									'List of info types categories related with the processing activity.',
								)
								.optional(),
							additionalInfoFiles: z
								.string()
								.describe('List of uploaded file ids.')
								.optional(),
							processingFrequency: z
								.string()
								.describe('Data processing frequency.')
								.optional(),
							processingActivityId: z
								.string()
								.describe('Identifier of the Processing Activity')
								.optional(),
							dataFlowRelationships: z.string().describe('Type').optional(),
							retentionPeriod__unit: z
								.string()
								.describe('Unit of time that is used for retention period')
								.optional(),
							retentionPeriodComment: z
								.string()
								.describe(
									'Additional information related to the retention period',
								)
								.optional(),
							areAccessRequestsManaged: z
								.boolean()
								.describe(
									'Indicates if the data subject access requests are managed.',
								)
								.optional(),
							processingFrequencyComment: z
								.string()
								.describe('Processingfrequencycomment')
								.optional(),
							processingActivitiesAsDataSources: z
								.string()
								.describe('Processingactivitiesasdatasources')
								.optional(),
						})
						.describe(
							'Inner result for Update processing activity details. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	updateThresholdById: z
		.object({
			data: z
				.object({
					data: z
						.object({
							status: z
								.string()
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
							translations: z.string().describe('Translations').optional(),
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
						.describe(
							'Inner result for Update threshold by id. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	addDiscoveredRecipients: z
		.object({
			data: z
				.object({
					data: z
						.object({
							discoveredRecipientIds: z
								.string()
								.describe(
									'Identifiers of the discovered recipients to add as recipients.',
								)
								.optional(),
						})
						.describe(
							'Inner result for Add discovered recipients. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	archiveDiscoveredRecipient: z
		.object({
			data: z
				.object({
					data: z
						.object({
							discoveredRecipientId: z
								.string()
								.describe('Identifier of the discovered recipient.')
								.optional(),
						})
						.describe(
							'Inner result for Archive discovered recipient. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	createRecipientWithDetails: z
		.object({
			data: z
				.object({
					data: z
						.object({
							dpa: z
								.string()
								.describe('The url to the DPA of the recipient')
								.optional(),
							name: z
								.string()
								.describe(
									'Name of the recipient. Has to be unique, 2 different recipients can"t have the same name.',
								)
								.optional(),
							role: z.string().describe('Role').optional(),
							state: z
								.string()
								.describe(
									'2 letter code that identifies the state of the recipient. It only applies when the recipient country is US',
								)
								.optional(),
							status: z
								.string()
								.describe(
									'The status of the recipient. Can be archived or validated.',
								)
								.optional(),
							country: z
								.string()
								.describe('2 letter code that identifies a country.')
								.optional(),
							dpaFiles: z
								.string()
								.describe('List of uploaded file ids.')
								.optional(),
							dpaStatus: z
								.string()
								.describe(
									'The status of the DPA of the recipient. Attached if the DPA is provided. Not required when it"s not necessary to provide the information. Requested when we ask for the DPA and we are waiting for it.',
								)
								.optional(),
							categories: z
								.string()
								.describe('list of recipient category')
								.optional(),
							businessName: z
								.string()
								.describe('Business name of the recipient')
								.optional(),
							recipientState: z.string().describe('Recipientstate').optional(),
							subProcessorIds: z
								.string()
								.describe('Subprocessorids')
								.optional(),
							recipientModelId: z
								.string()
								.describe(
									'Identifier of the Recipient Model in case that the Recipient is created bases in a Recipient Model',
								)
								.optional(),
							dataStorageLocation: z
								.string()
								.describe(
									'List of countries where the data related to this recipient are stored',
								)
								.optional(),
							recipientWarranties: z
								.string()
								.describe(
									'List of lawful basis types that applies to the recipient.',
								)
								.optional(),
							fromDiscoveredRecipientId: z
								.string()
								.describe('Fromdiscoveredrecipientid')
								.optional(),
						})
						.describe(
							'Inner result for Create recipient with details. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	deleteRecipientById: z
		.object({
			data: z
				.object({
					data: z
						.object({
							id: z
								.string()
								.describe('Identifier returned by Delete recipient by id.')
								.optional(),
						})
						.describe(
							'Inner result for Delete recipient by id. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	exportRecipientsListWithFilter: z
		.object({
			data: z
				.object({
					data: z
						.object({
							exportTypes: z.string().describe('Exporttypes').optional(),
							filter__search: z
								.string()
								.describe(
									'Free-form text search to apply to the Recipient name.',
								)
								.optional(),
							filter__status: z
								.string()
								.describe(
									'The status of the recipient. Can be archived or validated.',
								)
								.optional(),
							filter__categories: z
								.string()
								.describe('list of recipient category')
								.optional(),
							filter__departments: z
								.string()
								.describe('Departments')
								.optional(),
							filter__recipientIds: z
								.string()
								.describe('Recipientids')
								.optional(),
							filter__recipientState: z
								.string()
								.describe('Recipientstate')
								.optional(),
							filter__discoverySource: z
								.string()
								.describe('Discoverysource')
								.optional(),
							filter__subProcessorIds: z
								.string()
								.describe('Subprocessorids')
								.optional(),
							filter__automationStatus: z
								.string()
								.describe('Automationstatus')
								.optional(),
							filter__recipientWarranties: z
								.string()
								.describe('Recipientwarranties')
								.optional(),
							filter__withNoProcessingActivity: z
								.boolean()
								.describe('Withnoprocessingactivity')
								.optional(),
							nextToken: z
								.string()
								.describe(
									'Optional "nextToken" value from the last API response.',
								)
								.optional(),
							items: z
								.array(z.string())
								.describe(
									'Result rows returned by Export recipients list with filter.',
								)
								.optional(),
						})
						.describe(
							'Inner result for Export recipients list with filter. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	filterRecipientsList: z
		.object({
			data: z
				.object({
					data: z
						.object({
							nextToken: z
								.string()
								.describe(
									'Optional "nextToken" value from the last API response.',
								)
								.optional(),
							items: z
								.array(z.string())
								.describe('Result rows returned by Filter recipients list.')
								.optional(),
						})
						.describe(
							'Inner result for Filter recipients list. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	listDiscoveredRecipients: z
		.object({
			data: z
				.object({
					data: z
						.object({
							pageSize: z
								.number()
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
								.string()
								.describe(
									'Status of the discovered recipient. Can be new or ignored if it"s marked as ignored.',
								)
								.optional(),
							filter__discoverySource: z
								.string()
								.describe('Discoverysource')
								.optional(),
							items: z
								.array(z.string())
								.describe('Result rows returned by List discovered recipients.')
								.optional(),
						})
						.describe(
							'Inner result for List discovered recipients. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	listFilterOptionsForRecipients: z
		.object({
			data: z
				.object({
					data: z
						.object({
							nextToken: z
								.string()
								.describe(
									'Optional "nextToken" value from the last API response.',
								)
								.optional(),
							items: z
								.array(z.string())
								.describe(
									'Result rows returned by List filter options for recipients.',
								)
								.optional(),
						})
						.describe(
							'Inner result for List filter options for recipients. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	listOrFilterRecipients: z
		.object({
			data: z
				.object({
					data: z
						.object({
							pageSize: z
								.number()
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
							sort__column: z
								.string()
								.describe('The column name to sort on.')
								.optional(),
							filter__search: z
								.string()
								.describe(
									'Free-form text search to apply to the Recipient name.',
								)
								.optional(),
							filter__status: z
								.string()
								.describe(
									'The status of the recipient. Can be archived or validated.',
								)
								.optional(),
							filter__categories: z
								.string()
								.describe('list of recipient category')
								.optional(),
							filter__departments: z
								.string()
								.describe('Departments')
								.optional(),
							filter__recipientIds: z
								.string()
								.describe('Recipientids')
								.optional(),
							filter__recipientState: z
								.string()
								.describe('Recipientstate')
								.optional(),
							filter__discoverySource: z
								.string()
								.describe('Discoverysource')
								.optional(),
							filter__subProcessorIds: z
								.string()
								.describe('Subprocessorids')
								.optional(),
							filter__automationStatus: z
								.string()
								.describe('Automationstatus')
								.optional(),
							filter__recipientWarranties: z
								.string()
								.describe('Recipientwarranties')
								.optional(),
							filter__withNoProcessingActivity: z
								.boolean()
								.describe('Withnoprocessingactivity')
								.optional(),
							items: z
								.array(z.string())
								.describe('Result rows returned by List or filter recipients.')
								.optional(),
						})
						.describe(
							'Inner result for List or filter recipients. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	postDiscoveredRecipientById: z
		.object({
			data: z
				.object({
					data: z
						.object({
							id: z
								.string()
								.describe(
									'Identifier returned by Post discovered recipient by id.',
								)
								.optional(),
						})
						.describe(
							'Inner result for Post discovered recipient by id. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	retrieveDiscoveredRecipientById: z
		.object({
			data: z
				.object({
					data: z
						.object({
							discoveredRecipientId: z
								.string()
								.describe('Identifier of the discovered recipient.')
								.optional(),
						})
						.describe(
							'Inner result for Retrieve discovered recipient by id. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	retrieveRecipientDetails: z
		.object({
			data: z
				.object({
					data: z
						.object({
							id: z
								.string()
								.describe('Identifier returned by Retrieve recipient details.')
								.optional(),
						})
						.describe(
							'Inner result for Retrieve recipient details. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	retrieveRecipientProcessingActivities: z
		.object({
			data: z
				.object({
					data: z
						.object({
							pageSize: z
								.number()
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
							sort__column: z
								.string()
								.describe('The column name to sort on.')
								.optional(),
						})
						.describe(
							'Inner result for Retrieve recipient processing activities. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	updateDashboardReportFrequencyAndRecipients: z
		.object({
			data: z
				.object({
					data: z
						.object({
							roles: z.string().describe('Roles').optional(),
							frequency: z
								.string()
								.describe(
									'The cron schedule expression to use for a recurring scan. Only a fixed set of cron expressions can be used to run scans at 30 minute, 1 hour, 1 day, or 1 week intervals.',
								)
								.optional(),
							recipientsEmail: z
								.string()
								.describe('Recipientsemail')
								.optional(),
						})
						.describe(
							'Inner result for Update dashboard report frequency and recipients. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	updateRecipientDetailsById: z
		.object({
			data: z
				.object({
					data: z
						.object({
							dpa: z
								.string()
								.describe('The url to the DPA of the recipient')
								.optional(),
							name: z
								.string()
								.describe(
									'Name of the recipient. Has to be unique, 2 different recipients can"t have the same name.',
								)
								.optional(),
							role: z.string().describe('Role').optional(),
							state: z
								.string()
								.describe(
									'2 letter code that identifies the state of the recipient. It only applies when the recipient country is US',
								)
								.optional(),
							status: z
								.string()
								.describe(
									'The status of the recipient. Can be archived or validated.',
								)
								.optional(),
							country: z
								.string()
								.describe('2 letter code that identifies a country.')
								.optional(),
							dpaFiles: z
								.string()
								.describe('List of uploaded file ids.')
								.optional(),
							dpaStatus: z
								.string()
								.describe(
									'The status of the DPA of the recipient. Attached if the DPA is provided. Not required when it"s not necessary to provide the information. Requested when we ask for the DPA and we are waiting for it.',
								)
								.optional(),
							categories: z
								.string()
								.describe('list of recipient category')
								.optional(),
							businessName: z
								.string()
								.describe('Business name of the recipient')
								.optional(),
							recipientState: z.string().describe('Recipientstate').optional(),
							subProcessorIds: z
								.string()
								.describe('Subprocessorids')
								.optional(),
							automationStatus: z
								.string()
								.describe('Automationstatus')
								.optional(),
							dataStorageLocation: z
								.string()
								.describe(
									'List of countries where the data related to this recipient are stored',
								)
								.optional(),
							recipientWarranties: z
								.string()
								.describe(
									'List of lawful basis types that applies to the recipient.',
								)
								.optional(),
						})
						.describe(
							'Inner result for Update recipient details by id. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	updateRecipientStatusViaId: z
		.object({
			data: z
				.object({
					data: z
						.object({
							status: z
								.string()
								.describe(
									'The status of the recipient. Can be archived or validated.',
								)
								.optional(),
							automationStatus: z
								.string()
								.describe('Automationstatus')
								.optional(),
						})
						.describe(
							'Inner result for Update recipient status via id. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	deleteTagFromResource: z
		.object({
			data: z
				.object({
					data: z
						.object({
							id: z
								.string()
								.describe('Identifier returned by Delete tag from resource.')
								.optional(),
						})
						.describe(
							'Inner result for Delete tag from resource. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	exportFilteredLeafResources: z
		.object({
			data: z
				.object({
					data: z
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
							sort__column: z
								.string()
								.describe('The column name to sort on.')
								.optional(),
							filter__region: z
								.string()
								.describe('One or more cloud provider regions.')
								.optional(),
							filter__schema: z
								.string()
								.describe(
									'List tables from a specific schema. Supported for the following resource types: Presto.',
								)
								.optional(),
							filter__search: z
								.string()
								.describe('Free-text search on the resource name.')
								.optional(),
							filter__status: z
								.string()
								.describe('Filter the resources based on list of status.')
								.optional(),
							filter__account: z
								.string()
								.describe('One or more cloud provider account IDs.')
								.optional(),
							filter__dataset: z
								.string()
								.describe(
									'List tables from a specific dataset. Supported for on the following resource types: BigQuery.',
								)
								.optional(),
							filter__driveId: z
								.string()
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
								.string()
								.describe(
									'List tables from a specific database. Supported for the following resource types: (RDS) PostgreSQL, (RDS) MySQL, MongoDB.',
								)
								.optional(),
							filter__hasOwner: z
								.boolean()
								.describe(
									'Include only resources that have been assigned an owner.',
								)
								.optional(),
							filter__instance: z
								.string()
								.describe(
									'One or more resource IDs of the instances to which the resources belong, i.e. the parent resource ID.',
								)
								.optional(),
							filter__parentId: z
								.string()
								.describe(
									'Filter the resources which has the specified parent ID.',
								)
								.optional(),
							filter__driveType: z
								.string()
								.describe(
									'List drives from a specific drive type. Supported for the following resource types: Gdrive.',
								)
								.optional(),
							filter__firstSeen: z
								.number()
								.describe('Set of conditions for comparing two timestamps.')
								.optional(),
							filter__orgUnitId: z
								.string()
								.describe(
									'List orgUnits from a specific orgUnitIds. Supported for the following resource types: Gdrive.',
								)
								.optional(),
							filter__spaceType: z
								.string()
								.describe('Filter conlfluences based on type')
								.optional(),
							filter__categories: z
								.string()
								.describe(
									'Filter the resources matching with the list of categories.',
								)
								.optional(),
							filter__resourceId: z
								.string()
								.describe(
									'Filter the resources with the specified resource IDs.',
								)
								.optional(),
							filter__spaceStatus: z
								.string()
								.describe('Filter conlfluences based on status')
								.optional(),
							filter__resourceTags: z.string().describe('Source').optional(),
							filter__resourceType: z
								.string()
								.describe(
									'Filter the resources which can be scanned by Borneo.',
								)
								.optional(),
							filter__severityScore: z
								.string()
								.describe(
									'Filter the resources based on the assigned risk severity score; "critical" = 4, "high" = 3, "medium" = 2, "low" = 1.',
								)
								.optional(),
							filter__classification: z
								.string()
								.describe(
									'Filter the resources matching with the list of classifications.',
								)
								.optional(),
							filter__infoTypes__infoTypes: z
								.string()
								.describe('The list of infotypes to filter on.')
								.optional(),
							nextToken: z
								.string()
								.describe(
									'Optional "nextToken" value from the last API response.',
								)
								.optional(),
							items: z
								.array(z.string())
								.describe(
									'Result rows returned by Export filtered leaf resources.',
								)
								.optional(),
						})
						.describe(
							'Inner result for Export filtered leaf resources. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	exportInventoryResourceList: z
		.object({
			data: z
				.object({
					data: z
						.object({
							select: z
								.string()
								.describe(
									'A list of property names to return in the response. If not specified, all resource properties will be returned.',
								)
								.optional(),
							pageSize: z
								.number()
								.describe(
									'The maximum number of records to return per API call. If more records are available, the response will be truncated and will contain a "nextToken" value, which can be used to return additional records.',
								)
								.optional(),
							nextToken: z
								.string()
								.describe(
									'Optional "nextToken" value from the last API response.',
								)
								.optional(),
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
								.string()
								.describe(
									'List of regions to which the resoure belongs to in that cloud account.',
								)
								.optional(),
							filter__hasOwner: z
								.boolean()
								.describe(
									'Include only resources that have been assigned an owner.',
								)
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
								.string()
								.describe('Filter the resources that has data risks.')
								.optional(),
							filter__firstSeen: z
								.number()
								.describe('Set of conditions for comparing two timestamps.')
								.optional(),
							filter__resourceIds: z
								.string()
								.describe('One or more resource IDs to return.')
								.optional(),
							filter__resourceTags: z.string().describe('Source').optional(),
							filter__resourceType: z
								.string()
								.describe('Filter the resources based on the resource type.')
								.optional(),
							filter__severityScore: z
								.number()
								.describe(
									'Filter the resources based on the assigned risk severity score; "critical" = 4, "high" = 3, "medium" = 2, "low" = 1.',
								)
								.optional(),
							filter__classification: z
								.string()
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
								.string()
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
								.describe(
									'Include aggregate data size stats from child resources.',
								)
								.optional(),
							items: z
								.array(z.string())
								.describe(
									'Result rows returned by Export inventory resource list.',
								)
								.optional(),
						})
						.describe(
							'Inner result for Export inventory resource list. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	getResourceInventoryById: z
		.object({
			data: z
				.object({
					data: z
						.object({
							id: z
								.string()
								.describe(
									'Identifier returned by Get resource inventory by id.',
								)
								.optional(),
						})
						.describe(
							'Inner result for Get resource inventory by id. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	listInventoryResourcesWithFilters: z
		.object({
			data: z
				.object({
					data: z
						.object({
							select: z
								.string()
								.describe(
									'A list of property names to return in the response. If not specified, all resource properties will be returned.',
								)
								.optional(),
							pageSize: z
								.number()
								.describe(
									'The maximum number of records to return per API call. If more records are available, the response will be truncated and will contain a "nextToken" value, which can be used to return additional records.',
								)
								.optional(),
							nextToken: z
								.string()
								.describe(
									'Optional "nextToken" value from the last API response.',
								)
								.optional(),
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
								.string()
								.describe(
									'List of regions to which the resoure belongs to in that cloud account.',
								)
								.optional(),
							filter__hasOwner: z
								.boolean()
								.describe(
									'Include only resources that have been assigned an owner.',
								)
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
								.string()
								.describe('Filter the resources that has data risks.')
								.optional(),
							filter__firstSeen: z
								.number()
								.describe('Set of conditions for comparing two timestamps.')
								.optional(),
							filter__resourceIds: z
								.string()
								.describe('One or more resource IDs to return.')
								.optional(),
							filter__resourceTags: z.string().describe('Source').optional(),
							filter__resourceType: z
								.string()
								.describe('Filter the resources based on the resource type.')
								.optional(),
							filter__severityScore: z
								.number()
								.describe(
									'Filter the resources based on the assigned risk severity score; "critical" = 4, "high" = 3, "medium" = 2, "low" = 1.',
								)
								.optional(),
							filter__classification: z
								.string()
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
								.string()
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
								.describe(
									'Include aggregate data size stats from child resources.',
								)
								.optional(),
							items: z
								.array(z.string())
								.describe(
									'Result rows returned by List inventory resources with filters.',
								)
								.optional(),
						})
						.describe(
							'Inner result for List inventory resources with filters. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	listLeafResourcesWithFilters: z
		.object({
			data: z
				.object({
					data: z
						.object({
							pageSize: z
								.number()
								.describe(
									'The maximum number of records to return per API call. If more records are available, the response will be truncated and will contain a "nextToken" value, which can be used to return additional records.',
								)
								.optional(),
							nextToken: z
								.string()
								.describe(
									'Optional "nextToken" value from the last API response.',
								)
								.optional(),
							sourceType: z
								.string()
								.describe('Filter resource based on the resource type.')
								.optional(),
							sort__column: z
								.string()
								.describe('The column name to sort on.')
								.optional(),
							filter__region: z
								.string()
								.describe('One or more cloud provider regions.')
								.optional(),
							filter__schema: z
								.string()
								.describe(
									'List tables from a specific schema. Supported for the following resource types: Presto.',
								)
								.optional(),
							filter__search: z
								.string()
								.describe('Free-text search on the resource name.')
								.optional(),
							filter__status: z
								.string()
								.describe('Filter the resources based on list of status.')
								.optional(),
							filter__account: z
								.string()
								.describe('One or more cloud provider account IDs.')
								.optional(),
							filter__dataset: z
								.string()
								.describe(
									'List tables from a specific dataset. Supported for on the following resource types: BigQuery.',
								)
								.optional(),
							filter__driveId: z
								.string()
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
								.string()
								.describe(
									'List tables from a specific database. Supported for the following resource types: (RDS) PostgreSQL, (RDS) MySQL, MongoDB.',
								)
								.optional(),
							filter__hasOwner: z
								.boolean()
								.describe(
									'Include only resources that have been assigned an owner.',
								)
								.optional(),
							filter__instance: z
								.string()
								.describe(
									'One or more resource IDs of the instances to which the resources belong, i.e. the parent resource ID.',
								)
								.optional(),
							filter__parentId: z
								.string()
								.describe(
									'Filter the resources which has the specified parent ID.',
								)
								.optional(),
							filter__driveType: z
								.string()
								.describe(
									'List drives from a specific drive type. Supported for the following resource types: Gdrive.',
								)
								.optional(),
							filter__firstSeen: z
								.number()
								.describe('Set of conditions for comparing two timestamps.')
								.optional(),
							filter__orgUnitId: z
								.string()
								.describe(
									'List orgUnits from a specific orgUnitIds. Supported for the following resource types: Gdrive.',
								)
								.optional(),
							filter__spaceType: z
								.string()
								.describe('Filter conlfluences based on type')
								.optional(),
							filter__categories: z
								.string()
								.describe(
									'Filter the resources matching with the list of categories.',
								)
								.optional(),
							filter__resourceId: z
								.string()
								.describe(
									'Filter the resources with the specified resource IDs.',
								)
								.optional(),
							filter__spaceStatus: z
								.string()
								.describe('Filter conlfluences based on status')
								.optional(),
							filter__resourceTags: z.string().describe('Source').optional(),
							filter__resourceType: z
								.string()
								.describe(
									'Filter the resources which can be scanned by Borneo.',
								)
								.optional(),
							filter__severityScore: z
								.string()
								.describe(
									'Filter the resources based on the assigned risk severity score; "critical" = 4, "high" = 3, "medium" = 2, "low" = 1.',
								)
								.optional(),
							filter__classification: z
								.string()
								.describe(
									'Filter the resources matching with the list of classifications.',
								)
								.optional(),
							include__violationSummary: z
								.boolean()
								.describe('Violationsummary')
								.optional(),
							filter__infoTypes__infoTypes: z
								.string()
								.describe('The list of infotypes to filter on.')
								.optional(),
							include__frameworkExceptionsCount: z
								.boolean()
								.describe('Frameworkexceptionscount')
								.optional(),
							items: z
								.array(z.string())
								.describe(
									'Result rows returned by List leaf resources with filters.',
								)
								.optional(),
						})
						.describe(
							'Inner result for List leaf resources with filters. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	postClassificationStats: z
		.object({
			data: z
				.object({
					data: z
						.object({
							id: z
								.string()
								.describe('Identifier returned by Post classification stats.')
								.optional(),
						})
						.describe(
							'Inner result for Post classification stats. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	postResourceLineageFilter: z
		.object({
			data: z
				.object({
					data: z
						.object({
							filter__upstreamDepth: z
								.number()
								.describe('Upstreamdepth')
								.optional(),
							filter__downstreamDepth: z
								.number()
								.describe('Downstreamdepth')
								.optional(),
							nextToken: z
								.string()
								.describe(
									'Optional "nextToken" value from the last API response.',
								)
								.optional(),
							items: z
								.array(z.string())
								.describe(
									'Result rows returned by Post resource lineage filter.',
								)
								.optional(),
						})
						.describe(
							'Inner result for Post resource lineage filter. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	postResourceStatsWithDeletedResources: z
		.object({
			data: z
				.object({
					data: z
						.object({
							includeDeletedResources: z
								.boolean()
								.describe('Includedeletedresources')
								.optional(),
						})
						.describe(
							'Inner result for Post resource stats with deleted resources. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	retrieveDataResourceStatistics: z
		.object({
			data: z
				.object({
					data: z
						.object({
							id: z
								.string()
								.describe(
									'Identifier returned by Retrieve data resource statistics.',
								)
								.optional(),
						})
						.describe(
							'Inner result for Retrieve data resource statistics. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	retrieveResourceCatalogById: z
		.object({
			data: z
				.object({
					data: z
						.object({
							includeParentDetails: z
								.boolean()
								.describe('Includeparentdetails')
								.optional(),
						})
						.describe(
							'Inner result for Retrieve resource catalog by id. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	retrieveResourceColumns: z
		.object({
			data: z
				.object({
					data: z
						.object({
							id: z
								.string()
								.describe('Identifier returned by Retrieve resource columns.')
								.optional(),
						})
						.describe(
							'Inner result for Retrieve resource columns. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	accessScanIterationById: z
		.object({
			data: z
				.object({
					data: z
						.object({
							id: z
								.string()
								.describe('Identifier returned by Access scan iteration by id.')
								.optional(),
						})
						.describe(
							'Inner result for Access scan iteration by id. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	createAndScheduleCloudResourceScan: z
		.object({
			data: z
				.object({
					data: z
						.object({
							cron: z
								.string()
								.describe(
									'The cron schedule expression to use for a recurring scan. Only a fixed set of cron expressions can be used to run scans at 30 minute, 1 hour, 1 day, or 1 week intervals.',
								)
								.optional(),
							scanType: z
								.string()
								.describe(
									'The type of scan to perform, i.e. either full scan or sample scan.',
								)
								.optional(),
							scanFilter: z
								.string()
								.describe(
									'The type of filter to apply. Not all connector types support all filter types.',
								)
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
								.string()
								.describe(
									'A schedule type of "once" indicates that the scan will be executed once immediately at the time it is created or once as per the scheduled calendar time. A schedule type of "cron" creates a recurring scan that will be executed at the specified cron schedule.',
								)
								.optional(),
							resources__all: z
								.boolean()
								.describe(
									'Set this to `true` to determine the set of resources to scan based on the filter conditions in the `resources` property. If set to `false`, a static set of `resourceIds` must be specified.',
								)
								.optional(),
							resources__tags: z.string().describe('Action').optional(),
							resources__region: z
								.string()
								.describe(
									'The region of the cloud account to which the resoure belongs.',
								)
								.optional(),
							resources__schema: z
								.string()
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
								.string()
								.describe(
									'Filter the resources with the list of datasetss for selected connector types',
								)
								.optional(),
							resources__driveId: z
								.string()
								.describe(
									'Filter the resources with the list of driveIds for gdrive connector types',
								)
								.optional(),
							resources__regions: z
								.string()
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
								.string()
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
								.describe(
									'Filter the resources which has the specified parent id.',
								)
								.optional(),
							resources__teamName: z
								.string()
								.describe('Slack Workspace name in Slack Enterprise Connector')
								.optional(),
							schedule__calendars: z.number().describe('Hour').optional(),
							resources__accountId: z
								.string()
								.describe(
									'The account ID of the cloud account to which the resoure belongs. E.g. a 12-digit AWS account ID.',
								)
								.optional(),
							resources__driveType: z
								.string()
								.describe(
									'Filter the resources with the list of driveTypes for gdrive connector types',
								)
								.optional(),
							resources__isPrivate: z
								.boolean()
								.describe('Private channels, for Slack Enterprise Connector')
								.optional(),
							resources__orgUnitId: z
								.string()
								.describe(
									'Filter the resources with the list of orgUnits for gdrive connector types',
								)
								.optional(),
							resources__spaceType: z
								.string()
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
								.string()
								.describe('One or more resource IDs to return.')
								.optional(),
							resources__spaceStatus: z
								.string()
								.describe('Filter conlfluences based on status')
								.optional(),
							resources__googleGroups: z
								.string()
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
							resources__infoTypes__ops: z.string().describe('Ops').optional(),
							resources__zendeskGroupId: z
								.number()
								.describe('Zendeskgroupid')
								.optional(),
							scanLimits__itemsPerBatch: z
								.number()
								.describe(
									'Maximum number of item (records, objects, etc.) to scan per resource. Supported for sample scans on the following resource types: S3, DynamoDB, PostgreSQL, MySQL, Presto, MongoDB, BigQuery, Cassandra.',
								)
								.optional(),
							inspectionPolicy__infotypes: z
								.string()
								.describe(
									'List of infotypes to scan for. If empty, all enabled infotypes will be included.',
								)
								.optional(),
							inspectionPolicy__compliance: z
								.string()
								.describe(
									'List of infotype categories to scan for. All enabled infotypes included in the specified categories will be used in the scan. If `infotypes` is also specified, this list of infotype categories will be ignored.',
								)
								.optional(),
							scanLimits__samplePercentage: z
								.number()
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
								.string()
								.describe('The list of infotypes to filter on.')
								.optional(),
							resources__isSlackDirectMessages: z
								.boolean()
								.describe('Fetch DMs, for Slack Enterprise Connector')
								.optional(),
							scanLimits__sampleDurationMinutes: z
								.number()
								.describe('Sampledurationminutes')
								.optional(),
							scanLimits__maxCumulativeDataSizeMb: z
								.number()
								.describe(
									'Maximum data size to scan per resource in MB. Supported for full scans on the following resource types: PostgreSQL, MySQL.',
								)
								.optional(),
						})
						.describe(
							'Inner result for Create and schedule cloud resource scan. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	exportInsightPageUsingScanId: z
		.object({
			data: z
				.object({
					data: z
						.object({
							detailed: z
								.boolean()
								.describe(
									'Set to `true` if the results exported to have detailed column level information of the detected infotypes  with masked tokens if captured.',
								)
								.optional(),
							filter__pageId: z
								.string()
								.describe(
									'Unique page ID. Only applicable to page-level results.',
								)
								.optional(),
							filter__search: z
								.string()
								.describe('Free-text search on the resource name.')
								.optional(),
							filter__status: z.string().describe('Status').optional(),
							filter__categories: z
								.string()
								.describe('infotype categories')
								.optional(),
							filter__resourceIds: z
								.string()
								.describe(
									'One or more resource IDs for which to retrieve results. Only applicable to page-level results.',
								)
								.optional(),
							filter__resourceType: z
								.string()
								.describe('Resource type to filter results by.')
								.optional(),
							filter__fileExtension: z
								.string()
								.describe('Fileextension')
								.optional(),
							filter__scanIterationId: z
								.string()
								.describe(
									'Unique scan iteration ID to fetch results for a specific run of',
								)
								.optional(),
							filter__infotypeConfidence: z
								.string()
								.describe('Infotypeconfidence')
								.optional(),
							filter__infoTypes__infoTypes: z
								.string()
								.describe('The list of infotypes to filter on.')
								.optional(),
							nextToken: z
								.string()
								.describe(
									'Optional "nextToken" value from the last API response.',
								)
								.optional(),
							items: z
								.array(z.string())
								.describe(
									'Result rows returned by Export insight page using scanid.',
								)
								.optional(),
						})
						.describe(
							'Inner result for Export insight page using scanid. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	filterAndListInspectionResults: z
		.object({
			data: z
				.object({
					data: z
						.object({
							type: z
								.string()
								.describe(
									'Type of inspection result, i.e. scan-level or page-level results.',
								)
								.optional(),
							pageSize: z
								.number()
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
							sort__column: z
								.string()
								.describe('The column name to sort on.')
								.optional(),
							filter__pageId: z
								.string()
								.describe(
									'Unique page ID. Only applicable to page-level results.',
								)
								.optional(),
							filter__search: z
								.string()
								.describe('Free-text search on the resource name.')
								.optional(),
							filter__status: z.string().describe('Status').optional(),
							filter__categories: z
								.string()
								.describe('infotype categories')
								.optional(),
							filter__resourceIds: z
								.string()
								.describe(
									'One or more resource IDs for which to retrieve results. Only applicable to page-level results.',
								)
								.optional(),
							filter__resourceType: z
								.string()
								.describe('Resource type to filter results by.')
								.optional(),
							filter__fileExtension: z
								.string()
								.describe('Fileextension')
								.optional(),
							filter__scanIterationId: z
								.string()
								.describe(
									'Unique scan iteration ID to fetch results for a specific run of',
								)
								.optional(),
							filter__infotypeConfidence: z
								.string()
								.describe('Infotypeconfidence')
								.optional(),
							filter__infoTypes__infoTypes: z
								.string()
								.describe('The list of infotypes to filter on.')
								.optional(),
							items: z
								.array(z.string())
								.describe(
									'Result rows returned by Filter and list inspection results.',
								)
								.optional(),
						})
						.describe(
							'Inner result for Filter and list inspection results. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	getInsightByTypeAndId: z
		.object({
			data: z
				.object({
					data: z
						.object({
							id: z
								.string()
								.describe('The unique ID of the inspection result to fetch.')
								.optional(),
							type: z
								.string()
								.describe('The type of inspection result to fetch.')
								.optional(),
						})
						.describe(
							'Inner result for Get insight by type and id. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	getScanByScanId: z
		.object({
			data: z
				.object({
					data: z
						.object({
							scanId: z.string().describe('Scanid').optional(),
						})
						.describe(
							'Inner result for Get scan by scanid. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	listErrorDetailsFromFilteredScanIterations: z
		.object({
			data: z
				.object({
					data: z
						.object({
							select: z
								.string()
								.describe('List of column names to include in the response.')
								.optional(),
							pageSize: z
								.number()
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
							sort__column: z
								.string()
								.describe('The column name to sort on.')
								.optional(),
							filter__scanExecutionId: z
								.string()
								.describe('Scanexecutionid')
								.optional(),
							filter__scanIterationId: z
								.string()
								.describe('Scaniterationid')
								.optional(),
							items: z
								.array(z.string())
								.describe(
									'Result rows returned by List error details from filtered scan iterations.',
								)
								.optional(),
						})
						.describe(
							'Inner result for List error details from filtered scan iterations. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	listInsightFilters: z
		.object({
			data: z
				.object({
					data: z
						.object({
							nextToken: z
								.string()
								.describe(
									'Optional "nextToken" value from the last API response.',
								)
								.optional(),
							items: z
								.array(z.string())
								.describe('Result rows returned by List insight filters.')
								.optional(),
						})
						.describe(
							'Inner result for List insight filters. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	listScanExecutionResults: z
		.object({
			data: z
				.object({
					data: z
						.object({
							pageSize: z
								.number()
								.describe(
									'The maximum number of records to return per API call. If more records are available, the response will be truncated and will contain a "nextToken" value, which can be used to return additional records.',
								)
								.optional(),
							sort__column: z
								.string()
								.describe('The column name to sort on.')
								.optional(),
							filter__search: z
								.string()
								.describe('Free-text search on the resource name.')
								.optional(),
							filter__statuses: z.string().describe('Statuses').optional(),
							filter__resourceIds: z
								.string()
								.describe(
									'One or more resource IDs for which to retrieve results. Only applicable to page-level results.',
								)
								.optional(),
							filter__scanIterationId: z
								.string()
								.describe('Scaniterationid')
								.optional(),
							filter__infotypeConfidence: z
								.string()
								.describe('One or more confidence matches for the scan.')
								.optional(),
							filter__infoTypes__infoTypes: z
								.string()
								.describe('The list of infotypes to filter on.')
								.optional(),
							nextToken: z
								.string()
								.describe(
									'Optional "nextToken" value from the last API response.',
								)
								.optional(),
							items: z
								.array(z.string())
								.describe(
									'Result rows returned by List scan execution results.',
								)
								.optional(),
						})
						.describe(
							'Inner result for List scan execution results. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	listScanIterationsWithFilter: z
		.object({
			data: z
				.object({
					data: z
						.object({
							select: z
								.string()
								.describe('List of column names to include in the response.')
								.optional(),
							pageSize: z
								.number()
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
							sort__column: z
								.string()
								.describe('The column name to sort on.')
								.optional(),
							filter__scanIterationId: z
								.string()
								.describe('Scaniterationid')
								.optional(),
							items: z
								.array(z.string())
								.describe(
									'Result rows returned by List scan iterations with filter.',
								)
								.optional(),
						})
						.describe(
							'Inner result for List scan iterations with filter. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	listScansWithFilters: z
		.object({
			data: z
				.object({
					data: z
						.object({
							select: z
								.string()
								.describe('List of column names to include in the response.')
								.optional(),
							pageSize: z
								.number()
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
							sort__column: z
								.string()
								.describe('The column name to sort on.')
								.optional(),
							filter__search: z
								.string()
								.describe('Free-form text search to apply to the scan name.')
								.optional(),
							filter__status: z
								.string()
								.describe(
									'One or more scan statuses (e.g. `inprogress`, `completed`, etc.) to filter results by.',
								)
								.optional(),
							filter__scanType: z
								.string()
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
								.string()
								.describe('One or more AWS accounts to filter results by.')
								.optional(),
							filter__resources: z
								.string()
								.describe('One or more resource IDs to filter results by.')
								.optional(),
							filter__connectorId: z
								.string()
								.describe('One or more connector IDs to filter results by.')
								.optional(),
							filter__dataPlaneId: z
								.string()
								.describe('One or more data plane IDs to filter results by.')
								.optional(),
							filter__gcpProjectId: z
								.string()
								.describe('One or more GCP projects to filter results by.')
								.optional(),
							filter__resourceType: z
								.string()
								.describe('One or moreresource types to filter results by.')
								.optional(),
							filter__dataPlaneName: z
								.string()
								.describe('One or more data plane names to filter results by.')
								.optional(),
							filter__infoTypes__infoTypes: z
								.string()
								.describe('The list of infotypes to filter on.')
								.optional(),
							items: z
								.array(z.string())
								.describe('Result rows returned by List scans with filters.')
								.optional(),
						})
						.describe(
							'Inner result for List scans with filters. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	markScanFalsePositivesById: z
		.object({
			data: z
				.object({
					data: z
						.object({
							id: z
								.string()
								.describe(
									'Identifier returned by Mark scan false positives by id.',
								)
								.optional(),
						})
						.describe(
							'Inner result for Mark scan false positives by id. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	pauseScanById: z
		.object({
			data: z
				.object({
					data: z
						.object({
							id: z
								.string()
								.describe('Identifier returned by Pause scan by id.')
								.optional(),
						})
						.describe('Inner result for Pause scan by id. Toolkit 20260429_00.')
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	postScanResourceStatus: z
		.object({
			data: z
				.object({
					data: z
						.object({
							pageSize: z
								.number()
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
						})
						.describe(
							'Inner result for Post scan resource status. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	resumeScanById: z
		.object({
			data: z
				.object({
					data: z
						.object({
							id: z
								.string()
								.describe('Identifier returned by Resume scan by id.')
								.optional(),
						})
						.describe(
							'Inner result for Resume scan by id. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	scanLegalDocumentById: z
		.object({
			data: z
				.object({
					data: z
						.object({
							id: z
								.string()
								.describe('Identifier returned by Scan legal document byid.')
								.optional(),
						})
						.describe(
							'Inner result for Scan legal document byid. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	stopScanViaScanId: z
		.object({
			data: z
				.object({
					data: z
						.object({
							id: z
								.string()
								.describe('Identifier returned by Stop scan via scanid.')
								.optional(),
						})
						.describe(
							'Inner result for Stop scan via scanid. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	submitDetailedScanResults: z
		.object({
			data: z
				.object({
					data: z
						.object({
							pageId: z
								.string()
								.describe('Page ID for one of the pages produced by the scan.')
								.optional(),
							scanId: z
								.string()
								.describe(
									'Scan ID of the scan that produced the inspection result.',
								)
								.optional(),
							resourceId: z
								.string()
								.describe(
									'Resource ID for the resource for which the page was produced.',
								)
								.optional(),
							scanIterationId: z
								.string()
								.describe(
									'ScanIteration ID of the scan that produced the inspection result.',
								)
								.optional(),
						})
						.describe(
							'Inner result for Submit detailed scan results. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	postSupportChatQuery: z
		.object({
			data: z
				.object({
					data: z
						.object({
							id: z
								.string()
								.describe('Identifier returned by Post support chat query.')
								.optional(),
						})
						.describe(
							'Inner result for Post support chat query. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	getUserProfileById: z
		.object({
			data: z
				.object({
					data: z
						.object({
							id: z
								.string()
								.describe('Identifier returned by Get user profile by id.')
								.optional(),
						})
						.describe(
							'Inner result for Get user profile by id. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	listUserProfileWithFiltersAndSorting: z
		.object({
			data: z
				.object({
					data: z
						.object({
							sort__column: z
								.string()
								.describe('The column name to sort on.')
								.optional(),
							nextToken: z
								.string()
								.describe(
									'Optional "nextToken" value from the last API response.',
								)
								.optional(),
							items: z
								.array(z.string())
								.describe(
									'Result rows returned by List user profile with filters and sorting.',
								)
								.optional(),
						})
						.describe(
							'Inner result for List user profile with filters and sorting. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
	verifyEmailWithIdAndToken: z
		.object({
			data: z
				.object({
					data: z
						.object({
							id: z
								.string()
								.describe(
									'Identifier returned by Verify email with id and token.',
								)
								.optional(),
						})
						.describe(
							'Inner result for Verify email with id and token. Toolkit 20260429_00.',
						)
						.passthrough()
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
			error: z
				.union([z.string(), z.object({ message: z.string() }).passthrough()])
				.optional(),
			successful: z.literal(true),
			log_id: z.string().optional(),
		})
		.passthrough(),
} as const satisfies Record<BorneoOperationName, z.ZodTypeAny>;
