import 'dotenv/config';
import { makeOuraRequest } from './client';
import type {
	ProfileGetResponse,
	SummaryGetActivityResponse,
	SummaryGetReadinessResponse,
	SummaryGetSleepResponse,
} from './endpoints/types';
import { OuraEndpointOutputSchemas } from './endpoints/types';

const TEST_TOKEN = process.env.OURA_PERSONAL_ACCESS_TOKEN!;

const DEFAULT_START_DATE = '2026-03-01';
const DEFAULT_END_DATE = '2026-03-15';

describe('Oura API Type Tests', () => {
	describe('profile', () => {
		it('profileGet returns correct type', async () => {
			const result = await makeOuraRequest<ProfileGetResponse>(
				'usercollection/personal_info',
				TEST_TOKEN,
			);

			OuraEndpointOutputSchemas.profileGet.parse(result);
		});
	});

	describe('summary', () => {
		it('summaryGetActivity returns correct type', async () => {
			const result = await makeOuraRequest<SummaryGetActivityResponse>(
				'usercollection/daily_activity',
				TEST_TOKEN,
				{
					query: {
						start_date: DEFAULT_START_DATE,
						end_date: DEFAULT_END_DATE,
					},
				},
			);

			OuraEndpointOutputSchemas.summaryGetActivity.parse(result);
		});

		it('summaryGetActivity returns data array', async () => {
			const result = await makeOuraRequest<SummaryGetActivityResponse>(
				'usercollection/daily_activity',
				TEST_TOKEN,
				{
					query: {
						start_date: DEFAULT_START_DATE,
						end_date: DEFAULT_END_DATE,
					},
				},
			);

			expect(Array.isArray(result.data)).toBe(true);
		});

		it('summaryGetReadiness returns correct type', async () => {
			const result = await makeOuraRequest<SummaryGetReadinessResponse>(
				'usercollection/daily_readiness',
				TEST_TOKEN,
				{
					query: {
						start_date: DEFAULT_START_DATE,
						end_date: DEFAULT_END_DATE,
					},
				},
			);

			OuraEndpointOutputSchemas.summaryGetReadiness.parse(result);
		});

		it('summaryGetReadiness returns data array', async () => {
			const result = await makeOuraRequest<SummaryGetReadinessResponse>(
				'usercollection/daily_readiness',
				TEST_TOKEN,
				{
					query: {
						start_date: DEFAULT_START_DATE,
						end_date: DEFAULT_END_DATE,
					},
				},
			);

			expect(Array.isArray(result.data)).toBe(true);
		});

		it('summaryGetSleep returns correct type', async () => {
			const result = await makeOuraRequest<SummaryGetSleepResponse>(
				'usercollection/daily_sleep',
				TEST_TOKEN,
				{
					query: {
						start_date: DEFAULT_START_DATE,
						end_date: DEFAULT_END_DATE,
					},
				},
			);

			OuraEndpointOutputSchemas.summaryGetSleep.parse(result);
		});

		it('summaryGetSleep returns data array', async () => {
			const result = await makeOuraRequest<SummaryGetSleepResponse>(
				'usercollection/daily_sleep',
				TEST_TOKEN,
				{
					query: {
						start_date: DEFAULT_START_DATE,
						end_date: DEFAULT_END_DATE,
					},
				},
			);

			expect(Array.isArray(result.data)).toBe(true);
		});

		it('summaryGetActivity supports next_token pagination', async () => {
			const firstPage = await makeOuraRequest<SummaryGetActivityResponse>(
				'usercollection/daily_activity',
				TEST_TOKEN,
				{
					query: {
						start_date: '2023-01-01',
						end_date: '2023-12-31',
					},
				},
			);

			OuraEndpointOutputSchemas.summaryGetActivity.parse(firstPage);

			if (firstPage.next_token) {
				const secondPage = await makeOuraRequest<SummaryGetActivityResponse>(
					'usercollection/daily_activity',
					TEST_TOKEN,
					{
						query: { next_token: firstPage.next_token },
					},
				);

				OuraEndpointOutputSchemas.summaryGetActivity.parse(secondPage);
				expect(Array.isArray(secondPage.data)).toBe(true);
			}
		});
	});
});
