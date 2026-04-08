import 'dotenv/config';
import { makePagerdutyRequest } from './client';
import type {
	IncidentNotesCreateResponse,
	IncidentNotesListResponse,
	IncidentsCreateResponse,
	IncidentsGetResponse,
	IncidentsListResponse,
	IncidentsUpdateResponse,
	LogEntriesGetResponse,
	LogEntriesListResponse,
	UsersGetResponse,
} from './endpoints/types';
import { PagerdutyEndpointOutputSchemas } from './endpoints/types';

const TEST_TOKEN = process.env.PAGERDUTY_API_KEY!;
const TEST_SERVICE_ID = process.env.PAGERDUTY_SERVICE_ID!;
const TEST_FROM_EMAIL = process.env.PAGERDUTY_FROM_EMAIL!;

describe('PagerDuty API Type Tests', () => {
	describe('incidents', () => {
		it('incidentsList returns correct type', async () => {
			const result = await makePagerdutyRequest<IncidentsListResponse>(
				'incidents',
				TEST_TOKEN,
				{ query: { limit: 10, offset: 0 } },
			);

			PagerdutyEndpointOutputSchemas.incidentsList.parse(result);
		});

		it('incidentsGet returns correct type', async () => {
			const listResponse = await makePagerdutyRequest<IncidentsListResponse>(
				'incidents',
				TEST_TOKEN,
				{ query: { limit: 1, offset: 0 } },
			);
			const incidentId = listResponse.incidents[0]?.id;
			if (!incidentId) {
				throw new Error('No incidents found');
			}

			const result = await makePagerdutyRequest<IncidentsGetResponse>(
				`incidents/${incidentId}`,
				TEST_TOKEN,
			);

			PagerdutyEndpointOutputSchemas.incidentsGet.parse(result);
		});

		it('incidentsCreate returns correct type', async () => {
			const result = await makePagerdutyRequest<IncidentsCreateResponse>(
				'incidents',
				TEST_TOKEN,
				{
					method: 'POST',
					from: TEST_FROM_EMAIL,
					body: {
						incident: {
							type: 'incident',
							title: 'Test incident from API test',
							service: {
								id: TEST_SERVICE_ID,
								type: 'service_reference',
							},
							urgency: 'low',
							body: {
								type: 'incident_body',
								details:
									'This is a test incident created by the API test suite',
							},
						},
					},
				},
			);

			PagerdutyEndpointOutputSchemas.incidentsCreate.parse(result);
		});

		it('incidentsUpdate returns correct type', async () => {
			const listResponse = await makePagerdutyRequest<IncidentsListResponse>(
				'incidents',
				TEST_TOKEN,
				{ query: { limit: 1, offset: 0, 'statuses[]': 'triggered' } },
			);
			const incidentId = listResponse.incidents[0]?.id;
			if (!incidentId) {
				throw new Error('No triggered incidents found');
			}

			const result = await makePagerdutyRequest<IncidentsUpdateResponse>(
				`incidents/${incidentId}`,
				TEST_TOKEN,
				{
					method: 'PUT',
					from: TEST_FROM_EMAIL,
					body: {
						incident: {
							type: 'incident',
							status: 'acknowledged',
						},
					},
				},
			);

			PagerdutyEndpointOutputSchemas.incidentsUpdate.parse(result);
		});
	});

	describe('incidentNotes', () => {
		it('incidentNotesList returns correct type', async () => {
			const listResponse = await makePagerdutyRequest<IncidentsListResponse>(
				'incidents',
				TEST_TOKEN,
				{ query: { limit: 1, offset: 0 } },
			);
			const incidentId = listResponse.incidents[0]?.id;
			if (!incidentId) {
				throw new Error('No incidents found');
			}

			const result = await makePagerdutyRequest<IncidentNotesListResponse>(
				`incidents/${incidentId}/notes`,
				TEST_TOKEN,
			);

			PagerdutyEndpointOutputSchemas.incidentNotesList.parse(result);
		});

		it('incidentNotesCreate returns correct type', async () => {
			const listResponse = await makePagerdutyRequest<IncidentsListResponse>(
				'incidents',
				TEST_TOKEN,
				{ query: { limit: 1, offset: 0 } },
			);
			const incidentId = listResponse.incidents[0]?.id;
			if (!incidentId) {
				throw new Error('No incidents found');
			}

			const result = await makePagerdutyRequest<IncidentNotesCreateResponse>(
				`incidents/${incidentId}/notes`,
				TEST_TOKEN,
				{
					method: 'POST',
					from: TEST_FROM_EMAIL,
					body: {
						note: {
							content: 'Test note from API test',
						},
					},
				},
			);

			PagerdutyEndpointOutputSchemas.incidentNotesCreate.parse(result);
		});
	});

	describe('logEntries', () => {
		it('logEntriesList returns correct type', async () => {
			const result = await makePagerdutyRequest<LogEntriesListResponse>(
				'log_entries',
				TEST_TOKEN,
				{ query: { limit: 10, offset: 0 } },
			);

			PagerdutyEndpointOutputSchemas.logEntriesList.parse(result);
		});

		it('logEntriesGet returns correct type', async () => {
			const listResponse = await makePagerdutyRequest<LogEntriesListResponse>(
				'log_entries',
				TEST_TOKEN,
				{ query: { limit: 1, offset: 0 } },
			);
			const logEntryId = listResponse.log_entries[0]?.id;
			if (!logEntryId) {
				throw new Error('No log entries found');
			}

			const result = await makePagerdutyRequest<LogEntriesGetResponse>(
				`log_entries/${logEntryId}`,
				TEST_TOKEN,
			);

			PagerdutyEndpointOutputSchemas.logEntriesGet.parse(result);
		});
	});

	describe('users', () => {
		it('usersGet returns correct type', async () => {
			const listResponse = await makePagerdutyRequest<IncidentsListResponse>(
				'incidents',
				TEST_TOKEN,
				{ query: { limit: 10, offset: 0 } },
			);
			const userId = listResponse.incidents
				.flatMap((incident) => incident.assignments ?? [])
				.map((assignment) => assignment.assignee.id)[0];
			if (!userId) {
				throw new Error('No users found in incident assignments');
			}

			const result = await makePagerdutyRequest<UsersGetResponse>(
				`users/${userId}`,
				TEST_TOKEN,
			);

			PagerdutyEndpointOutputSchemas.usersGet.parse(result);
		});
	});
});
