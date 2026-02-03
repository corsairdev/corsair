import { makePostHogRequest } from './client';
import type {
	CreateAliasResponse,
	CreateEventResponse,
	CreateIdentityResponse,
	TrackPageResponse,
	TrackScreenResponse,
} from './endpoints/types';
import { PostHogEndpointOutputSchemas } from './endpoints/types';
import dotenv from 'dotenv';
dotenv.config();

type AssertExactType<T, U> = T extends U ? (U extends T ? true : never) : never;

const TEST_API_KEY = process.env.POSTHOG_API_KEY!;
const TEST_DISTINCT_ID = `test-${Date.now()}`;

describe('PostHog API Type Tests', () => {
	describe('events', () => {
		it('eventCreate returns correct type', async () => {
			const response = await makePostHogRequest<CreateEventResponse>(
				'/capture/',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						api_key: TEST_API_KEY,
						event: 'test_event',
						distinct_id: TEST_DISTINCT_ID,
						properties: {
							test_property: 'test_value',
						},
					},
				},
			);
			const result = response;
			
			PostHogEndpointOutputSchemas.eventCreate.parse(result);
			
		});

		it('aliasCreate returns correct type', async () => {
			const alias = `alias-${Date.now()}`;
			const response = await makePostHogRequest<CreateAliasResponse>(
				'/capture/',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						api_key: TEST_API_KEY,
						event: '$create_alias',
						properties: {
							distinct_id: TEST_DISTINCT_ID,
							alias: alias,
						},
						distinct_id: TEST_DISTINCT_ID,
					},
				},
			);
			const result = response;
			
			PostHogEndpointOutputSchemas.aliasCreate.parse(result);
			
		});

		it('identityCreate returns correct type', async () => {
			const response = await makePostHogRequest<CreateIdentityResponse>(
				'/capture/',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						api_key: TEST_API_KEY,
						event: '$identify',
						properties: {
							distinct_id: TEST_DISTINCT_ID,
							name: 'Test User',
							email: 'test@example.com',
						},
						distinct_id: TEST_DISTINCT_ID,
					},
				},
			);
			const result = response;
			
			PostHogEndpointOutputSchemas.identityCreate.parse(result);
			
		});

		it('trackPage returns correct type', async () => {
			const response = await makePostHogRequest<TrackPageResponse>(
				'/capture/',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						api_key: TEST_API_KEY,
						event: '$pageview',
						properties: {
							$current_url: 'https://example.com/test',
							distinct_id: TEST_DISTINCT_ID,
						},
						distinct_id: TEST_DISTINCT_ID,
					},
				},
			);
			const result = response;
			
			PostHogEndpointOutputSchemas.trackPage.parse(result);
			
		});

		it('trackScreen returns correct type', async () => {
			const response = await makePostHogRequest<TrackScreenResponse>(
				'/capture/',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						api_key: TEST_API_KEY,
						event: '$screen',
						properties: {
							$screen_name: 'Test Screen',
							distinct_id: TEST_DISTINCT_ID,
						},
						distinct_id: TEST_DISTINCT_ID,
					},
				},
			);
			const result = response;
			
			PostHogEndpointOutputSchemas.trackScreen.parse(result);
			
		});
	});
});
