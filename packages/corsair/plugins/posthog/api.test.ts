import { makePostHogRequest } from './client';
import type {
	CreateAliasResponse,
	CreateEventResponse,
	CreateIdentityResponse,
	PostHogEndpointOutputs,
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
			
			const validated = PostHogEndpointOutputSchemas.eventCreate.parse(result);
			
			type _Check = AssertExactType<
				typeof result,
				PostHogEndpointOutputs['eventCreate']
			>;
			const _assert: _Check = true;
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
			
			const validated = PostHogEndpointOutputSchemas.aliasCreate.parse(result);
			
			type _Check = AssertExactType<
				typeof result,
				PostHogEndpointOutputs['aliasCreate']
			>;
			const _assert: _Check = true;
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
			
			const validated = PostHogEndpointOutputSchemas.identityCreate.parse(result);
			
			type _Check = AssertExactType<
				typeof result,
				PostHogEndpointOutputs['identityCreate']
			>;
			const _assert: _Check = true;
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
			
			const validated = PostHogEndpointOutputSchemas.trackPage.parse(result);
			
			type _Check = AssertExactType<
				typeof result,
				PostHogEndpointOutputs['trackPage']
			>;
			const _assert: _Check = true;
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
			
			const validated = PostHogEndpointOutputSchemas.trackScreen.parse(result);
			
			type _Check = AssertExactType<
				typeof result,
				PostHogEndpointOutputs['trackScreen']
			>;
			const _assert: _Check = true;
		});
	});
});
