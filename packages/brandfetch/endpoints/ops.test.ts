import { makeBrandfetchGraphqlRequest, makeBrandfetchRequest } from '../client';
import type { BrandfetchContext } from '../index';
import {
	getGraphqlVersion,
	getTaxonomy,
	listSubscribableEvents,
	listWebhooks,
} from './graphql';
import {
	buildCdnLogoUrl,
	getBrandInfo,
	getCdnLogo,
	getCompanyInfo,
	getTransactionInfo,
	searchBrands,
} from './rest';
import {
	BrandfetchEndpointInputSchemas,
	BrandfetchEndpointOutputSchemas,
} from './types';

jest.mock('../client', () => {
	const actual = jest.requireActual('../client') as typeof import('../client');
	return {
		...actual,
		makeBrandfetchRequest: jest.fn(),
		makeBrandfetchGraphqlRequest: jest.fn(),
	};
});

const brandResponse = {
	id: 'idL0iThUh6',
	name: 'Brandfetch',
	domain: 'brandfetch.com',
	claimed: true,
	description: 'Brand data',
	longDescription: null,
	links: [{ name: 'twitter', url: 'https://twitter.com/brandfetch' }],
	logos: [
		{
			theme: 'dark',
			formats: [
				{
					src: 'https://asset.brandfetch.io/icon.svg',
					format: 'svg',
					height: 128,
					width: 128,
					size: 1024,
					background: 'transparent',
				},
			],
			tags: [],
			type: 'icon',
		},
	],
	colors: [{ hex: '#000000', type: 'dark', brightness: 0 }],
	fonts: [{ name: 'Inter', type: 'body', origin: 'google', originId: 'inter' }],
	images: [
		{
			formats: [
				{
					src: 'https://asset.brandfetch.io/banner.png',
					format: 'png',
					height: 200,
					width: 800,
					size: 2048,
				},
			],
			tags: [],
			type: 'banner',
		},
	],
	qualityScore: 0.9,
	company: {
		employees: 201,
		financialIdentifiers: { isin: [], ticker: [] },
		foundedYear: 2017,
		industries: [
			{
				id: 'ind_1',
				score: 0.9,
				slug: 'software',
				name: 'Software',
				emoji: '💻',
			},
		],
		kind: 'PRIVATELY_HELD',
		location: {
			city: null,
			country: 'Ireland',
			countryCode: 'IE',
			region: 'Europe',
			state: null,
			subregion: null,
		},
	},
	isNsfw: false,
	urn: 'urn:brandfetch:brand:idL0iThUh6',
};

const ctx = {
	key: 'test-api-key',
	options: { clientId: 'test-client-id' },
	db: {},
	$getAccountId: async () => 'test-account',
} as unknown as BrandfetchContext;

beforeEach(() => {
	jest.clearAllMocks();
});

describe('getBrandInfo', () => {
	it('GETs /v2/brands/domain/{identifier} and validates BrandResponse', async () => {
		(makeBrandfetchRequest as jest.Mock).mockResolvedValue(brandResponse);

		const result = await getBrandInfo(ctx, {
			identifier: 'brandfetch.com',
			identifierType: 'domain',
		});

		expect(makeBrandfetchRequest).toHaveBeenCalledWith(
			'/v2/brands/domain/brandfetch.com',
			'test-api-key',
			{ method: 'GET', query: { allowNsfw: undefined } },
		);
		expect(BrandfetchEndpointOutputSchemas.getBrandInfo.parse(result).id).toBe(
			'idL0iThUh6',
		);
	});

	it('uses the auto-detect route when identifierType is omitted', async () => {
		(makeBrandfetchRequest as jest.Mock).mockResolvedValue(brandResponse);
		await getBrandInfo(ctx, { identifier: 'idL0iThUh6' });
		expect(makeBrandfetchRequest).toHaveBeenCalledWith(
			'/v2/brands/idL0iThUh6',
			'test-api-key',
			{ method: 'GET', query: { allowNsfw: undefined } },
		);
	});
});

describe('getCompanyInfo', () => {
	it('returns BrandResponse.company from the same Brand API call', async () => {
		(makeBrandfetchRequest as jest.Mock).mockResolvedValue(brandResponse);
		const result = await getCompanyInfo(ctx, {
			identifier: 'brandfetch.com',
			identifierType: 'domain',
		});
		expect(result?.kind).toBe('PRIVATELY_HELD');
		expect(result?.location?.countryCode).toBe('IE');
	});
});

describe('searchBrands', () => {
	it('GETs /v2/search/{name}?c=clientId without a bearer token', async () => {
		const mockResponse = [
			{
				icon: null,
				name: 'Brandfetch',
				domain: 'brandfetch.com',
				claimed: true,
				brandId: 'idL0iThUh6',
			},
		];
		(makeBrandfetchRequest as jest.Mock).mockResolvedValue(mockResponse);

		const result = await searchBrands(ctx, { name: 'Brandfetch' });

		expect(makeBrandfetchRequest).toHaveBeenCalledWith(
			'/v2/search/Brandfetch',
			'',
			{ method: 'GET', query: { c: 'test-client-id' }, bearer: false },
		);
		expect(BrandfetchEndpointOutputSchemas.searchBrands.parse(result)).toEqual(
			mockResponse,
		);
	});

	it('requires a clientId', async () => {
		await expect(
			searchBrands({ ...ctx, options: {} } as BrandfetchContext, {
				name: 'Brandfetch',
			}),
		).rejects.toThrow('clientId is required');
	});
});

describe('getCdnLogo', () => {
	it('builds the documented CDN URL without calling REST', async () => {
		const result = await getCdnLogo(ctx, {
			identifier: 'nike.com',
			identifierType: 'domain',
			w: 400,
			h: 400,
			theme: 'dark',
			fallback: 'lettermark',
			logoType: 'icon',
		});
		expect(makeBrandfetchRequest).not.toHaveBeenCalled();
		expect(result.url).toBe(
			'https://cdn.brandfetch.io/domain/nike.com/w/400/h/400/theme/dark/fallback/lettermark/type/icon?c=test-client-id',
		);
	});

	it('buildCdnLogoUrl uses auto-detect when identifierType is omitted', () => {
		expect(buildCdnLogoUrl({ identifier: 'nike.com' }, 'abc')).toBe(
			'https://cdn.brandfetch.io/nike.com?c=abc',
		);
	});
});

describe('getTransactionInfo', () => {
	it('POSTs transactionLabel and countryCode to /v2/brands/transaction', async () => {
		(makeBrandfetchRequest as jest.Mock).mockResolvedValue(brandResponse);
		const result = await getTransactionInfo(ctx, {
			transactionLabel: 'STARBUCKS 1523 OMAHA NE',
			countryCode: 'US',
		});
		expect(makeBrandfetchRequest).toHaveBeenCalledWith(
			'/v2/brands/transaction',
			'test-api-key',
			{
				method: 'POST',
				body: {
					transactionLabel: 'STARBUCKS 1523 OMAHA NE',
					countryCode: 'US',
				},
			},
		);
		expect(result.domain).toBe('brandfetch.com');
	});

	it('rejects a non ISO-3166-1-alpha-2 countryCode', () => {
		expect(() =>
			BrandfetchEndpointInputSchemas.getTransactionInfo.parse({
				transactionLabel: 'STARBUCKS',
				countryCode: 'USA',
			}),
		).toThrow();
	});
});

describe('GraphQL operations', () => {
	it('getTaxonomy queries taxonomy.industries/countries/geographicRegions', async () => {
		const taxonomy = {
			industries: [
				{
					id: '1',
					urn: 'urn:brandfetch:industry:1',
					name: 'Software',
					slug: 'software',
					emoji: '💻',
					depth: 1,
					banner: null,
					parent: null,
					children: [],
				},
			],
			countries: [
				{
					code: 'US',
					name: 'United States',
					slug: 'united-states',
					emoji: '🇺🇸',
					latitude: 0,
					longitude: 0,
				},
			],
			geographicRegions: [
				{
					name: 'Americas',
					slug: 'americas',
					emoji: '🌎',
					depth: 0,
					parent: null,
				},
			],
		};
		(makeBrandfetchGraphqlRequest as jest.Mock).mockResolvedValue({ taxonomy });

		const result = await getTaxonomy(ctx, {});
		expect(makeBrandfetchGraphqlRequest).toHaveBeenCalled();
		expect(result.industries[0]?.slug).toBe('software');
		expect(result.countries[0]?.code).toBe('US');
	});

	it('getGraphqlVersion returns { version }', async () => {
		(makeBrandfetchGraphqlRequest as jest.Mock).mockResolvedValue({
			version: '2024-01-01',
		});
		const result = await getGraphqlVersion(ctx, {});
		expect(result.version).toBe('2024-01-01');
	});

	it('listSubscribableEvents returns official event names', async () => {
		(makeBrandfetchGraphqlRequest as jest.Mock).mockResolvedValue({
			subscribableEvents: [
				{
					namespace: 'brand',
					name: 'brand.updated',
					description: "Triggered anytime a brand's data is updated.",
					subscriptionScope: 'urn:brandfetch:brand:',
				},
			],
		});
		const result = await listSubscribableEvents(ctx, {});
		expect(result.subscribableEvents[0]?.name).toBe('brand.updated');
	});

	it('listWebhooks pages with first/after', async () => {
		(makeBrandfetchGraphqlRequest as jest.Mock).mockResolvedValue({
			webhooks: {
				nodes: [
					{
						urn: 'urn:brandfetch:organization:1:webhook:2',
						url: 'https://example.com/hook',
						description: null,
						enabled: true,
						events: ['brand.updated'],
					},
				],
				pageInfo: { hasNextPage: false, endCursor: null },
			},
		});
		const result = await listWebhooks(ctx, { first: 10, after: 'cursor' });
		expect(makeBrandfetchGraphqlRequest).toHaveBeenCalledWith(
			'test-api-key',
			expect.stringContaining('ListWebhooks'),
			{ first: 10, after: 'cursor' },
		);
		expect(result.nodes).toHaveLength(1);
		expect(result.pageInfo.hasNextPage).toBe(false);
	});
});

describe('output schemas reject malformed payloads', () => {
	it('rejects a brand response missing required BrandResponse fields', () => {
		expect(() =>
			BrandfetchEndpointOutputSchemas.getBrandInfo.parse({ id: 'x' }),
		).toThrow();
	});
});
