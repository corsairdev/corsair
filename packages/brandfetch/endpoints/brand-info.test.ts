import { makeBrandfetchRequest } from '../client';
import { getBrandInfo } from './brand-info';

jest.mock('../client', () => ({
	makeBrandfetchRequest: jest.fn(),
}));

describe('Brandfetch getBrandInfo endpoint', () => {
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

		const ctx = {
			key: 'test-api-key',
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
});
