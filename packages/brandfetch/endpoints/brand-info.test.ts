import { makeBrandfetchRequest } from '../client';
import {
	getBrandInfo,
	getCdnLogo,
	getTransactionInfo,
	getViewer,
	searchBrands,
} from './brand-info';
import {
	BrandfetchEndpointInputSchemas,
	BrandfetchEndpointOutputSchemas,
} from './types';

jest.mock('../client', () => ({
	BrandfetchAPIError: class BrandfetchAPIError extends Error {},
	makeBrandfetchRequest: jest.fn(),
}));

const ctx = {
	key: 'test-api-key',
	options: {
		clientId: 'test-client-id',
	},
	$getAccountId: async () => 'test-account-id',
	database: {
		db: {
			insertInto: () => ({
				values: () => ({
					execute: async () => undefined,
				}),
			}),
		},
	},
} as any;

beforeEach(() => {
	jest.clearAllMocks();
});

describe('Brandfetch brand endpoints', () => {
	it('fetches brand information by domain', async () => {
		const mockResponse = {
			id: 'brand_123',
			name: 'Example',
			domain: 'example.com',
			claimed: true,
			description: null,
			longDescription: null,
			links: [],
			logos: [],
			colors: [],
			fonts: [],
			images: [],
			qualityScore: 1,
			company: null,
			isNsfw: false,
			urn: 'urn:brandfetch:example',
		};

		(makeBrandfetchRequest as jest.Mock).mockResolvedValue(mockResponse);

		const input = {
			domain: 'example.com',
		};

		const result = await getBrandInfo(ctx, input);

		expect(makeBrandfetchRequest).toHaveBeenCalledWith(
			'/v2/brands/domain/example.com',
			'test-api-key',
			{ method: 'GET' },
		);

		expect(result).toEqual(mockResponse);
	});

	it('searches brands with the clientId query parameter and compact response schema', async () => {
		const mockResponse = [
			{
				icon: 'https://asset.brandfetch.io/example/icon.png',
				name: 'Example',
				domain: 'example.com',
				claimed: true,
				brandId: 'id_example',
			},
			{
				icon: null,
				name: null,
				domain: 'example.org',
				claimed: false,
				brandId: 'id_example_org',
			},
		];
		(makeBrandfetchRequest as jest.Mock).mockResolvedValue(mockResponse);

		const result = await searchBrands(ctx, { query: 'example' });

		expect(makeBrandfetchRequest).toHaveBeenCalledWith(
			'/v2/search/example',
			'test-api-key',
			{ method: 'GET', query: { c: 'test-client-id' } },
		);
		expect(BrandfetchEndpointOutputSchemas.searchBrands.parse(result)).toEqual(
			mockResponse,
		);
	});

	it('uses an input clientId for brand search when provided', async () => {
		(makeBrandfetchRequest as jest.Mock).mockResolvedValue([]);

		await searchBrands(ctx, { query: 'example', clientId: 'input-client-id' });

		expect(makeBrandfetchRequest).toHaveBeenCalledWith(
			'/v2/search/example',
			'test-api-key',
			{ method: 'GET', query: { c: 'input-client-id' } },
		);
	});

	it('constructs a Brandfetch CDN logo URL without calling the REST API', async () => {
		const result = await getCdnLogo(ctx, { domain: 'example.com' });

		expect(makeBrandfetchRequest).not.toHaveBeenCalled();
		expect(result).toEqual({
			url: 'https://cdn.brandfetch.io/domain/example.com?c=test-client-id',
		});
	});

	it('requires a clientId for CDN logo URLs', async () => {
		await expect(
			getCdnLogo({ ...ctx, options: {} }, { domain: 'example.com' }),
		).rejects.toThrow('clientId is required');
	});

	it('enriches transactions with the documented POST body', async () => {
		const mockResponse = {
			id: 'brand_123',
			name: 'Starbucks',
			domain: 'starbucks.com',
			claimed: true,
			description: null,
			longDescription: null,
			links: [],
			logos: [],
			colors: [],
			fonts: [],
			images: [],
			qualityScore: 1,
			company: null,
			isNsfw: false,
			urn: 'urn:brandfetch:brand:id123',
		};
		(makeBrandfetchRequest as jest.Mock).mockResolvedValue(mockResponse);

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
		expect(result).toEqual(mockResponse);
	});

	it('validates transaction countryCode as ISO 3166-1 alpha-2 uppercase', () => {
		expect(() =>
			BrandfetchEndpointInputSchemas.getTransactionInfo.parse({
				transactionLabel: 'STARBUCKS',
				countryCode: 'USA',
			}),
		).toThrow();
		expect(() =>
			BrandfetchEndpointInputSchemas.getTransactionInfo.parse({
				transactionLabel: 'STARBUCKS',
				countryCode: 'us',
			}),
		).toThrow();
	});
});

describe('Brandfetch viewer endpoint', () => {
	it('returns API key viewer identity', async () => {
		const mockResponse = {
			type: 'api-key' as const,
			id: 'id5ZQvmz9A',
			urn: 'urn:brandfetch:organization:cl5s9fps1275071ol9h7gs072m:api-key:id5ZQvmz9A',
			name: 'Production key',
			createdAt: '2026-05-12T09:14:07.000Z',
			usage: {
				used: 1234,
				quota: 250000,
			},
			organization: {
				id: 'cl5s9fps1275071ol9h7gs072m',
				urn: 'urn:brandfetch:organization:cl5s9fps1275071ol9h7gs072m',
				name: 'Acme Inc.',
			},
		};

		(makeBrandfetchRequest as jest.Mock).mockResolvedValue(mockResponse);

		const result = await getViewer(ctx, {});

		expect(makeBrandfetchRequest).toHaveBeenCalledWith(
			'/v2/viewer',
			'test-api-key',
			{ method: 'GET' },
		);
		expect(result).toEqual(mockResponse);
		expect(result.type).toBe('api-key');
	});

	it('returns user viewer identity', async () => {
		const mockResponse = {
			type: 'user' as const,
			id: 'cl2xkl6h90007w135197r5abc',
			urn: 'urn:brandfetch:user:cl2xkl6h90007w135197r5abc',
			name: 'Jane Doe',
			email: 'jane@acme.com',
			createdAt: '2025-11-02T16:41:12.000Z',
		};

		(makeBrandfetchRequest as jest.Mock).mockResolvedValue(mockResponse);

		const result = await getViewer(ctx, {});

		expect(makeBrandfetchRequest).toHaveBeenCalledWith(
			'/v2/viewer',
			'test-api-key',
			{ method: 'GET' },
		);
		expect(result).toEqual(mockResponse);
		expect(result.type).toBe('user');
	});

	it('validates viewer response schema for API key type', () => {
		const apiKeyResponse = {
			type: 'api-key',
			id: 'id5ZQvmz9A',
			urn: 'urn:brandfetch:organization:org123:api-key:id5ZQvmz9A',
			name: 'Test key',
			createdAt: '2026-01-01T00:00:00.000Z',
			usage: { used: 100, quota: 10000 },
			organization: {
				id: 'org123',
				urn: 'urn:brandfetch:organization:org123',
				name: 'Test Org',
			},
		};
		expect(() =>
			BrandfetchEndpointOutputSchemas.getViewer.parse(apiKeyResponse),
		).not.toThrow();
	});

	it('validates viewer response schema for user type', () => {
		const userResponse = {
			type: 'user',
			id: 'user123',
			urn: 'urn:brandfetch:user:user123',
			name: 'Test User',
			email: 'test@example.com',
			createdAt: '2026-01-01T00:00:00.000Z',
		};
		expect(() =>
			BrandfetchEndpointOutputSchemas.getViewer.parse(userResponse),
		).not.toThrow();
	});
});
