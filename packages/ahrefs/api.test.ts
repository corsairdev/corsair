import { makeAhrefsRequest } from './client';
import type {
	BacklinksStatsResponse,
	DomainRatingResponse,
	KeywordsOverviewResponse,
} from './endpoints/types';
import {
	AhrefsEndpointInputSchemas,
	AhrefsEndpointOutputSchemas,
} from './endpoints/types';

declare const describe: {
	(name: string, fn: () => void): void;
	skip(name: string, fn: () => void): void;
};
declare const it: (name: string, fn: () => void | Promise<void>) => void;

const TEST_API_KEY = process.env.AHREFS_API_KEY;
const describeIfApiKey = TEST_API_KEY ? describe : describe.skip;

describe('Ahrefs schemas', () => {
	it('parses domain rating input and response', () => {
		AhrefsEndpointInputSchemas.getDomainRating.parse({
			target: 'example.com',
			date: '2024-01-01',
		});

		AhrefsEndpointOutputSchemas.getDomainRating.parse({
			domain_rating: {
				ahrefs_rank: 123,
				domain_rating: 76.5,
			},
		});
	});

	it('parses backlinks stats input and response', () => {
		AhrefsEndpointInputSchemas.backlinksStats.parse({
			target: 'example.com',
			date: '2024-01-01',
			mode: 'domain',
		});

		AhrefsEndpointOutputSchemas.backlinksStats.parse({
			metrics: {
				all_time: 10,
				all_time_refdomains: 5,
				live: 8,
				live_refdomains: 4,
			},
		});
	});

	it('parses keywords overview input and response', () => {
		AhrefsEndpointInputSchemas.keywordsOverview.parse({
			keywords: ['seo tools', 'backlink checker'],
			country: 'us',
			select: 'keyword,volume,difficulty',
		});

		AhrefsEndpointOutputSchemas.keywordsOverview.parse({
			keywords: [
				{
					keyword: 'seo tools',
					volume: 1000,
					difficulty: 42,
				},
			],
		});
	});
});

describeIfApiKey('Ahrefs API type tests', () => {
	it('domain rating returns the expected shape', async () => {
		const response = await makeAhrefsRequest<DomainRatingResponse>(
			'/site-explorer/domain-rating',
			TEST_API_KEY!,
			{
				query: {
					target: 'ahrefs.com',
					date: '2024-01-01',
					protocol: 'both',
				},
			},
		);

		AhrefsEndpointOutputSchemas.getDomainRating.parse(response);
	});

	it('backlinks stats returns the expected shape', async () => {
		const response = await makeAhrefsRequest<BacklinksStatsResponse>(
			'/site-explorer/backlinks-stats',
			TEST_API_KEY!,
			{
				query: {
					target: 'ahrefs.com',
					date: '2024-01-01',
					mode: 'domain',
				},
			},
		);

		AhrefsEndpointOutputSchemas.backlinksStats.parse(response);
	});

	it('keywords overview returns the expected shape', async () => {
		const response = await makeAhrefsRequest<KeywordsOverviewResponse>(
			'/keywords-explorer/overview',
			TEST_API_KEY!,
			{
				query: {
					keywords: 'seo tools,backlink checker',
					country: 'us',
					select: 'keyword,volume,difficulty',
					limit: 10,
				},
			},
		);

		AhrefsEndpointOutputSchemas.keywordsOverview.parse(response);
	});
});
