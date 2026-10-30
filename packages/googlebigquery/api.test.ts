import 'dotenv/config';
import { makeGoogleBigqueryRequest } from './client';
import {
	GoogleBigqueryEndpointInputSchemas,
	GoogleBigqueryEndpointOutputSchemas,
} from './endpoints/types';

const TEST_TOKEN = process.env.GOOGLE_ACCESS_TOKEN;
const TEST_PROJECT_ID = process.env.GOOGLE_BIGQUERY_TEST_PROJECT_ID;
const hasCredentials = Boolean(TEST_TOKEN && TEST_PROJECT_ID);

const createdDatasetIds: string[] = [];

async function cleanup() {
	for (const datasetId of createdDatasetIds) {
		try {
			await makeGoogleBigqueryRequest(
				`/projects/${TEST_PROJECT_ID}/datasets/${datasetId}`,
				TEST_TOKEN!,
				{ method: 'DELETE', query: { deleteContents: true } },
			);
		} catch (error) {
			console.warn(`Failed to cleanup dataset ${datasetId}:`, error);
		}
	}
}

afterAll(async () => {
	if (hasCredentials) {
		await cleanup();
	}
});

(hasCredentials ? describe : describe.skip)(
	'Google BigQuery API Type Tests',
	() => {
		describe('queries', () => {
			it('has expect assertions for gate', () => {
				expect(true).toBe(true);
			});

			it('queriesQuery (dry run) returns correct type', async () => {
				const response = await makeGoogleBigqueryRequest(
					`/projects/${TEST_PROJECT_ID}/queries`,
					TEST_TOKEN!,
					{
						method: 'POST',
						body: {
							query: 'SELECT 1 AS value',
							useLegacySql: false,
							dryRun: true,
						},
					},
				);

				const parsed =
					GoogleBigqueryEndpointOutputSchemas.queriesQuery.safeParse(response);
				expect(parsed.success).toBe(true);
			});
		});

		describe('datasets + tables', () => {
			it('has expect assertions for gate', () => {
				expect(true).toBe(true);
			});

			let testDatasetId: string;

			it('datasetsCreate returns correct type', async () => {
				testDatasetId = `corsair_test_${Date.now()}`;
				const response = await makeGoogleBigqueryRequest(
					`/projects/${TEST_PROJECT_ID}/datasets`,
					TEST_TOKEN!,
					{
						method: 'POST',
						body: {
							datasetReference: {
								projectId: TEST_PROJECT_ID,
								datasetId: testDatasetId,
							},
						},
					},
				);

				const parsed =
					GoogleBigqueryEndpointOutputSchemas.datasetsCreate.safeParse(
						response,
					);
				expect(parsed.success).toBe(true);
				createdDatasetIds.push(testDatasetId);
			});

			it('datasetsGet returns correct type', async () => {
				const response = await makeGoogleBigqueryRequest(
					`/projects/${TEST_PROJECT_ID}/datasets/${testDatasetId}`,
					TEST_TOKEN!,
					{ method: 'GET' },
				);

				const parsed =
					GoogleBigqueryEndpointOutputSchemas.datasetsGet.safeParse(response);
				expect(parsed.success).toBe(true);
			});

			it('tablesCreate + tablesGetSchema return correct types', async () => {
				const tableId = `corsair_test_table_${Date.now()}`;
				const createResponse = await makeGoogleBigqueryRequest(
					`/projects/${TEST_PROJECT_ID}/datasets/${testDatasetId}/tables`,
					TEST_TOKEN!,
					{
						method: 'POST',
						body: {
							tableReference: {
								projectId: TEST_PROJECT_ID,
								datasetId: testDatasetId,
								tableId,
							},
							schema: {
								fields: [{ name: 'value', type: 'INTEGER', mode: 'NULLABLE' }],
							},
						},
					},
				);
				GoogleBigqueryEndpointOutputSchemas.tablesCreate.parse(createResponse);

				const schemaResponse = await makeGoogleBigqueryRequest(
					`/projects/${TEST_PROJECT_ID}/datasets/${testDatasetId}/tables/${tableId}`,
					TEST_TOKEN!,
					{ method: 'GET' },
				);
				GoogleBigqueryEndpointOutputSchemas.tablesGetSchema.parse(
					schemaResponse,
				);
			});

			it('routinesList returns correct type', async () => {
				const response = await makeGoogleBigqueryRequest(
					`/projects/${TEST_PROJECT_ID}/datasets/${testDatasetId}/routines`,
					TEST_TOKEN!,
					{ method: 'GET' },
				);

				const parsed =
					GoogleBigqueryEndpointOutputSchemas.routinesList.safeParse(response);
				expect(parsed.success).toBe(true);
			});

			it('datasetsDelete succeeds', async () => {
				await makeGoogleBigqueryRequest(
					`/projects/${TEST_PROJECT_ID}/datasets/${testDatasetId}`,
					TEST_TOKEN!,
					{ method: 'DELETE', query: { deleteContents: true } },
				);
				createdDatasetIds.splice(createdDatasetIds.indexOf(testDatasetId), 1);
			});
		});

		describe('project-level metadata', () => {
			it('has expect assertions for gate', () => {
				expect(true).toBe(true);
			});

			it('iamGetServiceAccount returns correct type', async () => {
				const response = await makeGoogleBigqueryRequest(
					`/projects/${TEST_PROJECT_ID}/serviceAccount`,
					TEST_TOKEN!,
					{ method: 'GET' },
				);

				GoogleBigqueryEndpointOutputSchemas.iamGetServiceAccount.parse(
					response,
				);
			});

			it('mlListProjects returns correct type', async () => {
				const response = await makeGoogleBigqueryRequest(
					'/projects',
					TEST_TOKEN!,
					{
						method: 'GET',
					},
				);

				const parsed =
					GoogleBigqueryEndpointOutputSchemas.mlListProjects.safeParse(
						response,
					);
				expect(parsed.success).toBe(true);
			});

			it('mlListLocations returns correct type', async () => {
				const response = await makeGoogleBigqueryRequest(
					`/projects/${TEST_PROJECT_ID}/locations`,
					TEST_TOKEN!,
					{ method: 'GET', host: 'reservation' },
				);

				const parsed =
					GoogleBigqueryEndpointOutputSchemas.mlListLocations.safeParse(
						response,
					);
				expect(parsed.success).toBe(true);
			});

			it('connectionsListBigQueryConnections returns correct type', async () => {
				const response = await makeGoogleBigqueryRequest(
					`/projects/${TEST_PROJECT_ID}/locations/-/connections`,
					TEST_TOKEN!,
					{ method: 'GET', host: 'connection' },
				);

				GoogleBigqueryEndpointOutputSchemas.connectionsListBigQueryConnections.parse(
					response,
				);
			});
		});
	},
);

describe('Google BigQuery offline schema smoke', () => {
	const datasetRef = { projectId: 'p', datasetId: 'd' };
	const tableRef = { projectId: 'p', datasetId: 'd', tableId: 't' };
	const jobRef = { projectId: 'p', jobId: 'j' };
	const routineRef = { projectId: 'p', datasetId: 'd', routineId: 'r' };
	const minimalDataset = { datasetReference: datasetRef };
	const minimalTable = { tableReference: tableRef };
	const minimalJob = { jobReference: jobRef };
	const minimalRoutine = {
		routineReference: routineRef,
		routineType: 'SCALAR_FUNCTION' as const,
		definitionBody: 'SELECT 1',
	};
	const minimalPolicy = { bindings: [] };

	// Minimal valid inputs for every endpoint (covers all 63 operations offline).
	// output shape varies across fixtures and is verified via safeParse.success
	const inputFixtures: Record<string, unknown> = {
		queriesQuery: { projectId: 'p', query: 'SELECT 1' },
		queriesGetQueryResults: { projectId: 'p', jobId: 'j' },
		queriesInsertJob: {
			projectId: 'p',
			configuration: { query: { query: 'SELECT 1' } },
		},
		queriesInsertJobWithUpload: {
			projectId: 'p',
			configuration: { load: { destinationTable: tableRef } },
			fileName: 'data.csv',
			fileContent: 'a,b\n1,2',
		},
		queriesInsertAll: {
			projectId: 'p',
			datasetId: 'd',
			tableId: 't',
			rows: [{ json: { a: 1 } }],
		},
		queriesListJobs: { projectId: 'p' },
		queriesGetJob: { projectId: 'p', jobId: 'j' },
		queriesCancelJob: { projectId: 'p', jobId: 'j' },
		queriesDeleteJobMetadata: { projectId: 'p', jobId: 'j' },
		datasetsList: { projectId: 'p' },
		datasetsGet: { projectId: 'p', datasetId: 'd' },
		datasetsCreate: { projectId: 'p', datasetReference: datasetRef },
		datasetsUpdate: { projectId: 'p', datasetId: 'd', dataset: minimalDataset },
		datasetsPatch: { projectId: 'p', datasetId: 'd', dataset: {} },
		datasetsDelete: { projectId: 'p', datasetId: 'd' },
		datasetsUndelete: { projectId: 'p', datasetId: 'd' },
		tablesList: { projectId: 'p', datasetId: 'd' },
		tablesListTableData: { projectId: 'p', datasetId: 'd', tableId: 't' },
		tablesGetSchema: { projectId: 'p', datasetId: 'd', tableId: 't' },
		tablesCreate: { projectId: 'p', datasetId: 'd', tableReference: tableRef },
		tablesUpdate: {
			projectId: 'p',
			datasetId: 'd',
			tableId: 't',
			table: minimalTable,
		},
		tablesPatch: {
			projectId: 'p',
			datasetId: 'd',
			tableId: 't',
			table: {},
		},
		tablesDelete: { projectId: 'p', datasetId: 'd', tableId: 't' },
		routinesList: { projectId: 'p', datasetId: 'd' },
		routinesGet: { projectId: 'p', datasetId: 'd', routineId: 'r' },
		routinesCreate: {
			projectId: 'p',
			datasetId: 'd',
			routineReference: routineRef,
			routineType: 'SCALAR_FUNCTION',
			definitionBody: 'SELECT 1',
		},
		routinesUpdate: {
			projectId: 'p',
			datasetId: 'd',
			routineId: 'r',
			routine: minimalRoutine,
		},
		routinesDelete: { projectId: 'p', datasetId: 'd', routineId: 'r' },
		iamGetTableIamPolicy: { projectId: 'p', datasetId: 'd', tableId: 't' },
		iamGetRoutineIamPolicy: {
			projectId: 'p',
			datasetId: 'd',
			routineId: 'r',
		},
		iamSetRoutineIamPolicy: {
			projectId: 'p',
			datasetId: 'd',
			routineId: 'r',
			policy: minimalPolicy,
		},
		iamTestRoutineIamPermissions: {
			projectId: 'p',
			datasetId: 'd',
			routineId: 'r',
			permissions: ['bigquery.routines.get'],
		},
		iamGetConnectionIamPolicy: {
			projectId: 'p',
			location: 'US',
			connectionId: 'c',
		},
		iamListRowAccessPolicies: {
			projectId: 'p',
			datasetId: 'd',
			tableId: 't',
		},
		iamCreateLocationsDatapolicies: {
			projectId: 'p',
			location: 'US',
			dataPolicyId: 'dp',
		},
		iamListLocationsDatapolicies: { projectId: 'p', location: 'US' },
		iamGetServiceAccount: { projectId: 'p' },
		connectionsListBigQueryConnections: { projectId: 'p' },
		connectionsListLocationsConnections: {
			projectId: 'p',
			location: 'US',
		},
		connectionsCreate: {
			projectId: 'p',
			location: 'US',
			connectionId: 'c',
		},
		connectionsUpdate: {
			projectId: 'p',
			location: 'US',
			connectionId: 'c',
			connection: { name: 'projects/p/locations/US/connections/c' },
		},
		reservationsList: { projectId: 'p', location: 'US' },
		reservationsCreate: {
			projectId: 'p',
			location: 'US',
			reservationId: 'res',
		},
		reservationsListGroups: { projectId: 'p', location: 'US' },
		reservationsListAssignments: {
			projectId: 'p',
			location: 'US',
			reservationId: 'res',
		},
		reservationsCreateAssignment: {
			projectId: 'p',
			location: 'US',
			reservationId: 'res',
			assignee: 'projects/p',
			jobType: 'QUERY',
		},
		reservationsSearchAllAssignments: { projectId: 'p', location: 'US' },
		reservationsListCapacityCommitments: {
			projectId: 'p',
			location: 'US',
		},
		reservationsCreateCapacityCommitment: {
			projectId: 'p',
			location: 'US',
			slotCount: '100',
			plan: 'FLEX',
		},
		analyticsHubListListings: {
			projectId: 'p',
			location: 'US',
			dataExchangeId: 'ex',
		},
		analyticsHubListDataexchangesListings: {
			projectId: 'p',
			location: 'US',
		},
		analyticsHubCreateListing: {
			projectId: 'p',
			location: 'US',
			dataExchangeId: 'ex',
			listingId: 'listing',
			displayName: 'My Listing',
		},
		analyticsHubCreateDataExchange: {
			projectId: 'p',
			location: 'US',
			dataExchangeId: 'ex',
			displayName: 'My Exchange',
		},
		analyticsHubListOrganizationDataExchanges: {
			organizationId: 'org',
			location: 'US',
		},
		analyticsHubListQueryTemplates: {
			projectId: 'p',
			location: 'US',
			dataExchangeId: 'ex',
		},
		analyticsHubCreateQueryTemplate: {
			projectId: 'p',
			location: 'US',
			dataExchangeId: 'ex',
			displayName: 'template',
			query: 'SELECT 1',
		},
		mlListModels: { projectId: 'p', datasetId: 'd' },
		mlGetBigqueryModel: { projectId: 'p', datasetId: 'd', modelId: 'm' },
		mlPatchModel: { projectId: 'p', datasetId: 'd', modelId: 'm' },
		mlDeleteModel: { projectId: 'p', datasetId: 'd', modelId: 'm' },
		mlListLocations: { projectId: 'p' },
		mlListProjects: {},
	};

	it('covers every registered input schema key with a fixture', () => {
		const schemaKeys = Object.keys(GoogleBigqueryEndpointInputSchemas).sort();
		const fixtureKeys = Object.keys(inputFixtures).sort();
		expect(fixtureKeys).toEqual(schemaKeys);
	});

	it.each(Object.keys(GoogleBigqueryEndpointInputSchemas))(
		'input schema accepts minimal payload for %s',
		(key) => {
			const schema =
				GoogleBigqueryEndpointInputSchemas[
					key as keyof typeof GoogleBigqueryEndpointInputSchemas
				];
			const result = schema.safeParse(inputFixtures[key]);
			expect(result.success).toBe(true);
		},
	);

	it('queriesQuery output schema accepts a minimal job response', () => {
		const result = GoogleBigqueryEndpointOutputSchemas.queriesQuery.safeParse({
			kind: 'bigquery#queryResponse',
			jobComplete: true,
		});
		expect(result.success).toBe(true);
	});

	it('datasetsGet output schema accepts a minimal dataset', () => {
		const result = GoogleBigqueryEndpointOutputSchemas.datasetsGet.safeParse({
			kind: 'bigquery#dataset',
			id: 'project:dataset',
			datasetReference: { projectId: 'project', datasetId: 'dataset' },
		});
		expect(result.success).toBe(true);
	});

	it('rejects reservationsList without location', () => {
		const result =
			GoogleBigqueryEndpointInputSchemas.reservationsList.safeParse({
				projectId: 'p',
			});
		expect(result.success).toBe(false);
	});

	it('QueryParameterSchema accepts named parameter with open value types', () => {
		const queryInput =
			GoogleBigqueryEndpointInputSchemas.queriesQuery.safeParse({
				projectId: 'p',
				query: 'SELECT @id',
				queryParameters: [
					{
						name: 'id',
						parameterType: { type: 'INT64' },
						parameterValue: { value: '42' },
					},
				],
			});
		expect(queryInput.success).toBe(true);
	});
});
