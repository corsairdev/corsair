import 'dotenv/config';
import { AMPLITUDE_HTTP_API_BASE, makeAmplitudeRequest } from './client';
import type {
	AnnotationsCreateResponse,
	AnnotationsListResponse,
	ChartsGetResponse,
	CohortsGetResponse,
	CohortsListResponse,
	DashboardsGetResponse,
	DashboardsListResponse,
	EventsGetListResponse,
	EventsIdentifyUserResponse,
	EventsUploadBatchResponse,
	EventsUploadResponse,
	ExportsGetDataResponse,
	UsersGetActivityResponse,
	UsersGetProfileResponse,
	UsersSearchResponse,
} from './endpoints/types';
import { AmplitudeEndpointOutputSchemas } from './endpoints/types';

const apiKey = process.env.AMPLITUDE_API_KEY!;
const secretKey = process.env.AMPLITUDE_SECRET_KEY!;
const credentials =
	apiKey && secretKey
		? `${apiKey}:${secretKey}`
		: process.env.AMPLITUDE_CREDENTIALS!;

describe('Amplitude API Type Tests', () => {
	describe('events', () => {
		it('eventsUpload returns correct type', async () => {
			const response = await makeAmplitudeRequest<EventsUploadResponse>(
				'/2/httpapi',
				credentials,
				{
					method: 'POST',
					body: {
						api_key: apiKey,
						events: [
							{
								event_type: 'test_event',
								user_id: `test-user-${Date.now()}`,
								time: Math.floor(Date.now() / 1000),
							},
						],
					},
					baseUrl: AMPLITUDE_HTTP_API_BASE,
				},
			);
			AmplitudeEndpointOutputSchemas.eventsUpload.parse(response);
		});

		it('eventsUploadBatch returns correct type', async () => {
			const response = await makeAmplitudeRequest<EventsUploadBatchResponse>(
				'/batch',
				credentials,
				{
					method: 'POST',
					body: {
						api_key: apiKey,
						events: [
							{
								event_type: 'test_batch_event',
								user_id: `test-user-${Date.now()}`,
								time: Math.floor(Date.now() / 1000),
							},
						],
					},
					baseUrl: AMPLITUDE_HTTP_API_BASE,
				},
			);
			AmplitudeEndpointOutputSchemas.eventsUploadBatch.parse(response);
		});

		it('eventsIdentifyUser returns correct type', async () => {
			const response = await makeAmplitudeRequest<EventsIdentifyUserResponse>(
				'/identify',
				credentials,
				{
					method: 'POST',
					body: {
						api_key: apiKey,
						identification: [
							{
								user_id: `test-user-${Date.now()}`,
								user_properties: { $set: { test_prop: 'test_value' } },
							},
						],
					},
					baseUrl: AMPLITUDE_HTTP_API_BASE,
				},
			);
			AmplitudeEndpointOutputSchemas.eventsIdentifyUser.parse(response);
		});

		it('eventsGetList returns correct type', async () => {
			const response = await makeAmplitudeRequest<EventsGetListResponse>(
				'/api/2/events/list',
				credentials,
				{ method: 'GET' },
			);
			AmplitudeEndpointOutputSchemas.eventsGetList.parse(response);
		});
	});

	describe('users', () => {
		it('usersSearch returns correct type', async () => {
			const userQuery = process.env.AMPLITUDE_TEST_USER_QUERY;
			if (!userQuery) {
				return;
			}
			const response = await makeAmplitudeRequest<UsersSearchResponse>(
				'/api/2/usersearch',
				credentials,
				{
					method: 'GET',
					query: { user: userQuery, limit: 10 },
				},
			);
			AmplitudeEndpointOutputSchemas.usersSearch.parse(response);
		});

		it('usersGetProfile returns correct type', async () => {
			const userId = process.env.AMPLITUDE_TEST_USER_ID;
			const amplitudeId = process.env.AMPLITUDE_TEST_AMPLITUDE_ID;
			const userQuery = process.env.AMPLITUDE_TEST_USER_QUERY;

			if (!userId && !amplitudeId) {
				if (!userQuery) {
					return;
				}
				const searchResponse = await makeAmplitudeRequest<UsersSearchResponse>(
					'/api/2/usersearch',
					credentials,
					{ method: 'GET', query: { user: userQuery, limit: 1 } },
				);
				const match = searchResponse.matches?.[0];
				if (!match) {
					throw new Error('No users found for getProfile test');
				}
				const response = await makeAmplitudeRequest<UsersGetProfileResponse>(
					'/api/2/userprofile',
					credentials,
					{
						method: 'GET',
						query: match.user_id
							? { user_id: match.user_id }
							: { amplitude_id: match.amplitude_id },
					},
				);
				AmplitudeEndpointOutputSchemas.usersGetProfile.parse(response);
			} else {
				const response = await makeAmplitudeRequest<UsersGetProfileResponse>(
					'/api/2/userprofile',
					credentials,
					{
						method: 'GET',
						query: userId
							? { user_id: userId }
							: { amplitude_id: Number(amplitudeId) },
					},
				);
				AmplitudeEndpointOutputSchemas.usersGetProfile.parse(response);
			}
		});

		it('usersGetActivity returns correct type', async () => {
			const amplitudeIdEnv = process.env.AMPLITUDE_TEST_AMPLITUDE_ID;
			const userQuery = process.env.AMPLITUDE_TEST_USER_QUERY;
			let amplitudeId: number;

			if (amplitudeIdEnv) {
				amplitudeId = Number(amplitudeIdEnv);
			} else {
				if (!userQuery) {
					return;
				}
				const searchResponse = await makeAmplitudeRequest<UsersSearchResponse>(
					'/api/2/usersearch',
					credentials,
					{ method: 'GET', query: { user: userQuery, limit: 1 } },
				);
				const match = searchResponse.matches?.[0];
				if (!match?.amplitude_id) {
					throw new Error('No users found for getActivity test');
				}
				amplitudeId = match.amplitude_id;
			}

			const response = await makeAmplitudeRequest<UsersGetActivityResponse>(
				'/api/2/useractivity',
				credentials,
				{
					method: 'GET',
					query: { user: amplitudeId, limit: 10 },
				},
			);
			AmplitudeEndpointOutputSchemas.usersGetActivity.parse(response);
		});
	});

	describe('cohorts', () => {
		it('cohortsList returns correct type', async () => {
			const response = await makeAmplitudeRequest<CohortsListResponse>(
				'/api/3/cohorts',
				credentials,
				{ method: 'GET' },
			);
			AmplitudeEndpointOutputSchemas.cohortsList.parse(response);
		});

		it('cohortsGet returns correct type', async () => {
			const cohortId = process.env.AMPLITUDE_TEST_COHORT_ID;

			if (!cohortId) {
				const listResponse = await makeAmplitudeRequest<CohortsListResponse>(
					'/api/3/cohorts',
					credentials,
					{ method: 'GET' },
				);
				const firstId = listResponse.cohorts?.[0]?.id;
				if (!firstId) {
					throw new Error('No cohorts found for get test');
				}
				const response = await makeAmplitudeRequest<CohortsGetResponse>(
					`/api/3/cohorts/${firstId}`,
					credentials,
					{ method: 'GET' },
				);
				AmplitudeEndpointOutputSchemas.cohortsGet.parse(response);
			} else {
				const response = await makeAmplitudeRequest<CohortsGetResponse>(
					`/api/3/cohorts/${cohortId}`,
					credentials,
					{ method: 'GET' },
				);
				AmplitudeEndpointOutputSchemas.cohortsGet.parse(response);
			}
		});
	});

	describe('charts', () => {
		it('chartsGet returns correct type', async () => {
			const chartId = process.env.AMPLITUDE_TEST_CHART_ID;

			if (!chartId) {
				const dashResponse = await makeAmplitudeRequest<DashboardsListResponse>(
					'/api/3/dashboards',
					credentials,
					{ method: 'GET' },
				);
				const firstDashboardId = dashResponse.dashboards?.[0]?.id;
				if (!firstDashboardId) {
					throw new Error('No dashboards found for chart test');
				}
				const dashboardResponse =
					await makeAmplitudeRequest<DashboardsGetResponse>(
						`/api/3/dashboards/${firstDashboardId}`,
						credentials,
						{ method: 'GET' },
					);
				const firstChartId = dashboardResponse.dashboard?.charts?.[0]?.id;
				if (!firstChartId) {
					throw new Error('No charts found for get test');
				}
				const response = await makeAmplitudeRequest<ChartsGetResponse>(
					`/api/3/chart/${firstChartId}`,
					credentials,
					{ method: 'GET' },
				);
				AmplitudeEndpointOutputSchemas.chartsGet.parse(response);
			} else {
				const response = await makeAmplitudeRequest<ChartsGetResponse>(
					`/api/3/chart/${chartId}`,
					credentials,
					{ method: 'GET' },
				);
				AmplitudeEndpointOutputSchemas.chartsGet.parse(response);
			}
		});
	});

	describe('dashboards', () => {
		it('dashboardsList returns correct type', async () => {
			const response = await makeAmplitudeRequest<DashboardsListResponse>(
				'/api/3/dashboards',
				credentials,
				{ method: 'GET' },
			);
			AmplitudeEndpointOutputSchemas.dashboardsList.parse(response);
		});

		it('dashboardsGet returns correct type', async () => {
			const dashboardIdEnv = process.env.AMPLITUDE_TEST_DASHBOARD_ID;

			if (!dashboardIdEnv) {
				const listResponse = await makeAmplitudeRequest<DashboardsListResponse>(
					'/api/3/dashboards',
					credentials,
					{ method: 'GET' },
				);
				const firstId = listResponse.dashboards?.[0]?.id;
				if (!firstId) {
					throw new Error('No dashboards found for get test');
				}
				const response = await makeAmplitudeRequest<DashboardsGetResponse>(
					`/api/3/dashboards/${firstId}`,
					credentials,
					{ method: 'GET' },
				);
				AmplitudeEndpointOutputSchemas.dashboardsGet.parse(response);
			} else {
				const response = await makeAmplitudeRequest<DashboardsGetResponse>(
					`/api/3/dashboards/${Number(dashboardIdEnv)}`,
					credentials,
					{ method: 'GET' },
				);
				AmplitudeEndpointOutputSchemas.dashboardsGet.parse(response);
			}
		});
	});

	describe('annotations', () => {
		it('annotationsList returns correct type', async () => {
			const appId = process.env.AMPLITUDE_TEST_APP_ID;
			const response = await makeAmplitudeRequest<AnnotationsListResponse>(
				'/api/2/annotations',
				credentials,
				{
					method: 'GET',
					query: appId ? { app_id: Number(appId) } : undefined,
				},
			);
			AmplitudeEndpointOutputSchemas.annotationsList.parse(response);
		});

		it('annotationsCreate returns correct type', async () => {
			const date =
				process.env.AMPLITUDE_TEST_ANNOTATION_DATE ??
				new Date().toISOString().slice(0, 10);
			const label =
				process.env.AMPLITUDE_TEST_ANNOTATION_LABEL ??
				`test-annotation-${Date.now()}`;
			const appId = process.env.AMPLITUDE_TEST_APP_ID;

			const response = await makeAmplitudeRequest<AnnotationsCreateResponse>(
				'/api/2/annotations',
				credentials,
				{
					method: 'POST',
					body: {
						date,
						label,
						...(appId && { app_id: Number(appId) }),
					},
				},
			);
			AmplitudeEndpointOutputSchemas.annotationsCreate.parse(response);
		});
	});

	describe('exports', () => {
		it('exportsGetData returns correct type', async () => {
			const start =
				process.env.AMPLITUDE_TEST_EXPORT_START ??
				new Date(Date.now() - 86400000).toISOString().slice(0, 10);
			const end =
				process.env.AMPLITUDE_TEST_EXPORT_END ??
				new Date().toISOString().slice(0, 10);

			const response = await makeAmplitudeRequest<ExportsGetDataResponse>(
				'/api/2/export',
				credentials,
				{
					method: 'GET',
					query: { start, end },
				},
			);
			AmplitudeEndpointOutputSchemas.exportsGetData.parse(response);
		});
	});
});
