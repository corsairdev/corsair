import 'dotenv/config';
import { makeZoomRequest } from './client';
import type {
	DeviceListResponse,
	MeetingGetResponse,
	MeetingListResponse,
	RecordingListAllResponse,
	ReportDailyUsageResponse,
	WebinarListResponse,
} from './endpoints/types';
import { ZoomEndpointOutputSchemas } from './endpoints/types';

const TEST_TOKEN: string | undefined = process.env.ZOOM_ACCESS_TOKEN;
if (!TEST_TOKEN) {
	throw new Error(
		'ZOOM_ACCESS_TOKEN env var is not set — integration tests cannot run',
	);
}

async function getFirstMeetingId(): Promise<number | undefined> {
	const response = await makeZoomRequest<MeetingListResponse>(
		'users/me/meetings',
		// Type assertion because the token is defined in the env var
		TEST_TOKEN as string,
		{ query: { page_size: 1 } },
	);
	return response.meetings?.[0]?.id;
}

describe('Zoom API Type Tests', () => {
	describe('meetings', () => {
		it('meetingsList returns correct type', async () => {
			const response = await makeZoomRequest<MeetingListResponse>(
				'users/me/meetings',
				TEST_TOKEN,
				{ query: { page_size: 10 } },
			);

			ZoomEndpointOutputSchemas.meetingsList.parse(response);
		});

		it('meetingsGet returns correct type', async () => {
			const meetingId = await getFirstMeetingId();
			if (!meetingId) {
				throw new Error('No meetings found');
			}

			const response = await makeZoomRequest<MeetingGetResponse>(
				`meetings/${meetingId}`,
				TEST_TOKEN,
			);

			ZoomEndpointOutputSchemas.meetingsGet.parse(response);
		});
	});

	describe('recordings', () => {
		it('recordingsListAll returns correct type', async () => {
			const now = new Date();
			const from = new Date(now);
			from.setDate(from.getDate() - 30);

			const response = await makeZoomRequest<RecordingListAllResponse>(
				'users/me/recordings',
				TEST_TOKEN,
				{
					query: {
						from: from.toISOString().split('T')[0],
						to: now.toISOString().split('T')[0],
						page_size: 10,
					},
				},
			);

			ZoomEndpointOutputSchemas.recordingsListAll.parse(response);
		});
	});

	describe('webinars', () => {
		it('webinarsList returns correct type', async () => {
			const response = await makeZoomRequest<WebinarListResponse>(
				'users/me/webinars',
				TEST_TOKEN,
				{ query: { page_size: 10 } },
			);

			ZoomEndpointOutputSchemas.webinarsList.parse(response);
		});
	});

	describe('reports', () => {
		it('reportsDailyUsage returns correct type', async () => {
			const now = new Date();
			const year = now.getFullYear();
			const month = now.getMonth() + 1;

			const response = await makeZoomRequest<ReportDailyUsageResponse>(
				'report/daily',
				TEST_TOKEN,
				{
					query: {
						year,
						month,
					},
				},
			);

			ZoomEndpointOutputSchemas.reportsDailyUsage.parse(response);
		});
	});

	describe('devices', () => {
		it('devicesList returns correct type', async () => {
			const response = await makeZoomRequest<DeviceListResponse>(
				'devices',
				TEST_TOKEN,
				{ query: { page_size: 10 } },
			);

			ZoomEndpointOutputSchemas.devicesList.parse(response);
		});
	});
});
