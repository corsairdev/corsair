import 'dotenv/config';
import { makeGoogleMeetRequest } from './client';
import { GoogleMeetEndpointOutputSchemas } from './endpoints/types';

const TEST_TOKEN = process.env.GOOGLE_ACCESS_TOKEN!;

describe('Google Meet API Type Tests', () => {
	describe('conferenceRecords', () => {
		it('conferenceRecordsList returns correct type', async () => {
			const response = await makeGoogleMeetRequest<{ conferenceRecords?: unknown[] }>(
				'/v2/conferenceRecords',
				TEST_TOKEN,
				{
					method: 'GET',
					query: {
						pageSize: 10,
					},
				},
			);

			GoogleMeetEndpointOutputSchemas.conferenceRecordsList.parse(response);
		});
	});
});
