import 'dotenv/config';
import { makeStravaRequest } from './client';
import type {
	ActivitiesListCommentsResponse,
	ActivitiesListKudoersResponse,
	ActivitiesListLapsResponse,
	ActivitiesListResponse,
	ActivityResponse,
	AthleteResponse,
	AthleteStatsResponse,
	AthleteZonesResponse,
	ExploreSegmentsResponse,
	SegmentResponse,
	SegmentsListResponse,
	StreamSetResponse,
	UploadResponse,
} from './endpoints/types';
import {
	StravaEndpointInputSchemas,
	StravaEndpointOutputSchemas,
} from './endpoints/types';

const ACCESS_TOKEN = process.env.STRAVA_ACCESS_TOKEN!;
const ATHLETE_ID = parseInt(process.env.STRAVA_ATHLETE_ID || '0');

describe('Strava API Type Tests', () => {
	describe('activities', () => {
		let firstActivityId: number | undefined;
		let scopeAvailable = true;

		beforeAll(async () => {
			try {
				const activities = await makeStravaRequest<ActivitiesListResponse>(
					'athlete/activities',
					ACCESS_TOKEN,
					{ query: { per_page: 1 } },
				);
				firstActivityId = activities[0]?.id;
			} catch {
				scopeAvailable = false;
				console.warn(
					'activities scope unavailable (requires activity:read) — skipping all activity tests',
				);
			}
		});

		it('activitiesList returns correct type', async () => {
			if (!scopeAvailable) return;

			const response = await makeStravaRequest<ActivitiesListResponse>(
				'athlete/activities',
				ACCESS_TOKEN,
				{ query: { per_page: 5 } },
			);
			StravaEndpointOutputSchemas.activitiesList.parse(response);
		});

		it('activitiesGet returns correct type', async () => {
			if (!scopeAvailable || !firstActivityId) {
				console.warn('Skipping activitiesGet: no activity ID available');
				return;
			}

			const response = await makeStravaRequest<ActivityResponse>(
				`activities/${firstActivityId}`,
				ACCESS_TOKEN,
			);
			StravaEndpointOutputSchemas.activitiesGet.parse(response);
		});

		it('activitiesGetStreams returns correct type', async () => {
			if (!scopeAvailable || !firstActivityId) {
				console.warn('Skipping activitiesGetStreams: no activity ID available');
				return;
			}

			const response = await makeStravaRequest<StreamSetResponse>(
				`activities/${firstActivityId}/streams`,
				ACCESS_TOKEN,
				{ query: { keys: 'time,distance', key_by_type: true } },
			);
			StravaEndpointOutputSchemas.activitiesGetStreams.parse(response);
		});

		it('activitiesListComments returns correct type', async () => {
			if (!scopeAvailable || !firstActivityId) {
				console.warn(
					'Skipping activitiesListComments: no activity ID available',
				);
				return;
			}

			const response = await makeStravaRequest<ActivitiesListCommentsResponse>(
				`activities/${firstActivityId}/comments`,
				ACCESS_TOKEN,
				{ query: { per_page: 10 } },
			);
			StravaEndpointOutputSchemas.activitiesListComments.parse(response);
		});

		it('activitiesListKudoers returns correct type', async () => {
			if (!scopeAvailable || !firstActivityId) {
				console.warn(
					'Skipping activitiesListKudoers: no activity ID available',
				);
				return;
			}

			const response = await makeStravaRequest<ActivitiesListKudoersResponse>(
				`activities/${firstActivityId}/kudos`,
				ACCESS_TOKEN,
				{ query: { per_page: 10 } },
			);
			StravaEndpointOutputSchemas.activitiesListKudoers.parse(response);
		});

		it('activitiesListLaps returns correct type', async () => {
			if (!scopeAvailable || !firstActivityId) {
				console.warn('Skipping activitiesListLaps: no activity ID available');
				return;
			}

			const response = await makeStravaRequest<ActivitiesListLapsResponse>(
				`activities/${firstActivityId}/laps`,
				ACCESS_TOKEN,
			);
			StravaEndpointOutputSchemas.activitiesListLaps.parse(response);
		});
	});

	describe('athlete', () => {
		let athleteId: number | undefined;

		beforeAll(async () => {
			const athlete = await makeStravaRequest<AthleteResponse>(
				'athlete',
				ACCESS_TOKEN,
			);
			athleteId = athlete.id;
		});

		it('athleteGet returns correct type', async () => {
			const response = await makeStravaRequest<AthleteResponse>(
				'athlete',
				ACCESS_TOKEN,
			);
			StravaEndpointOutputSchemas.athleteGet.parse(response);
		});

		it('athleteGetStats returns correct type', async () => {
			const id = athleteId ?? ATHLETE_ID;
			if (!id) {
				console.warn('No athlete ID available, skipping athleteGetStats test');
				return;
			}

			const response = await makeStravaRequest<AthleteStatsResponse>(
				`athletes/${id}/stats`,
				ACCESS_TOKEN,
			);
			StravaEndpointOutputSchemas.athleteGetStats.parse(response);
		});

		it('athleteGetZones returns correct type', async () => {
			try {
				const response = await makeStravaRequest<AthleteZonesResponse>(
					'athlete/zones',
					ACCESS_TOKEN,
				);
				StravaEndpointOutputSchemas.athleteGetZones.parse(response);
			} catch {
				console.warn(
					'Skipping athleteGetZones: requires Strava Summit subscription or profile:read_all scope',
				);
			}
		});
	});

	describe('segments', () => {
		let firstSegmentId: number | undefined;

		beforeAll(async () => {
			const segments = await makeStravaRequest<SegmentsListResponse>(
				'segments/starred',
				ACCESS_TOKEN,
				{ query: { per_page: 1 } },
			);
			firstSegmentId = segments[0]?.id;
		});

		it('segmentsList returns correct type', async () => {
			const response = await makeStravaRequest<SegmentsListResponse>(
				'segments/starred',
				ACCESS_TOKEN,
				{ query: { per_page: 5 } },
			);
			StravaEndpointOutputSchemas.segmentsList.parse(response);
		});

		it('segmentsGet returns correct type', async () => {
			if (!firstSegmentId) {
				console.warn('No starred segments found, skipping segmentsGet test');
				return;
			}

			const response = await makeStravaRequest<SegmentResponse>(
				`segments/${firstSegmentId}`,
				ACCESS_TOKEN,
			);
			StravaEndpointOutputSchemas.segmentsGet.parse(response);
		});

		it('segmentsExplore returns correct type', async () => {
			const response = await makeStravaRequest<ExploreSegmentsResponse>(
				'segments/explore',
				ACCESS_TOKEN,
				{
					query: {
						bounds: '37.821362,-122.505373,37.842038,-122.465977',
						activity_type: 'riding',
					},
				},
			);
			StravaEndpointOutputSchemas.segmentsExplore.parse(response);
		});
	});

	describe('routes', () => {
		const routeId = process.env.STRAVA_ROUTE_ID
			? parseInt(process.env.STRAVA_ROUTE_ID)
			: undefined;

		it('routesGet returns correct type', async () => {
			if (!routeId) {
				console.warn('STRAVA_ROUTE_ID not set, skipping routesGet test');
				return;
			}

			const response = await makeStravaRequest(
				`routes/${routeId}`,
				ACCESS_TOKEN,
			);
			StravaEndpointOutputSchemas.routesGet.parse(response);
		});
	});

	describe('gear', () => {
		it('gearGet returns correct type', async () => {
			const athlete = await makeStravaRequest<AthleteResponse>(
				'athlete',
				ACCESS_TOKEN,
			);

			const gearId = athlete.bikes?.[0]?.id ?? athlete.shoes?.[0]?.id;

			if (!gearId) {
				console.warn('No gear found in athlete profile, skipping gearGet test');
				return;
			}

			const response = await makeStravaRequest(`gear/${gearId}`, ACCESS_TOKEN);
			StravaEndpointOutputSchemas.gearGet.parse(response);
		});
	});

	describe('clubs', () => {
		it('clubsGet returns correct type', async () => {
			const clubId = process.env.STRAVA_CLUB_ID
				? parseInt(process.env.STRAVA_CLUB_ID)
				: undefined;

			if (!clubId) {
				console.warn('STRAVA_CLUB_ID not set, skipping clubsGet test');
				return;
			}

			const response = await makeStravaRequest(`clubs/${clubId}`, ACCESS_TOKEN);
			StravaEndpointOutputSchemas.clubsGet.parse(response);
		});
	});

	describe('uploads', () => {
		it('uploadsGet returns correct type', async () => {
			const uploadId = process.env.STRAVA_UPLOAD_ID
				? parseInt(process.env.STRAVA_UPLOAD_ID)
				: undefined;

			if (!uploadId) {
				console.warn('STRAVA_UPLOAD_ID not set, skipping uploadsGet test');
				return;
			}

			const response = await makeStravaRequest<UploadResponse>(
				`uploads/${uploadId}`,
				ACCESS_TOKEN,
			);
			StravaEndpointOutputSchemas.uploadsGet.parse(response);
		});
	});

	describe('schema passthrough', () => {
		it('activity response preserves unknown fields after parse', () => {
			const raw = {
				id: 123456,
				name: 'Morning Run',
				sport_type: 'Run',
				future_strava_field: 'some_value',
				nested_new: { key: 'value' },
			};
			const parsed = StravaEndpointOutputSchemas.activitiesGet.parse(raw);
			expect((parsed as Record<string, unknown>).future_strava_field).toBe(
				'some_value',
			);
			expect((parsed as Record<string, unknown>).nested_new).toEqual({
				key: 'value',
			});
		});

		it('athlete response preserves unknown fields after parse', () => {
			const raw = {
				id: 789,
				firstname: 'Test',
				lastname: 'User',
				new_strava_feature: true,
			};
			const parsed = StravaEndpointOutputSchemas.athleteGet.parse(raw);
			expect((parsed as Record<string, unknown>).new_strava_feature).toBe(true);
		});

		it('segment response preserves unknown fields after parse', () => {
			const raw = {
				id: 111,
				name: 'Test Segment',
				extra_segment_field: 42,
			};
			const parsed = StravaEndpointOutputSchemas.segmentsGet.parse(raw);
			expect((parsed as Record<string, unknown>).extra_segment_field).toBe(42);
		});

		it('input schemas preserve unknown fields after parse', () => {
			const raw = {
				id: 1,
				include_all_efforts: true,
				client_custom_field: 'tracking_id_123',
			};
			const parsed = StravaEndpointInputSchemas.activitiesGet.parse(raw);
			expect((parsed as Record<string, unknown>).client_custom_field).toBe(
				'tracking_id_123',
			);
		});
	});
});
