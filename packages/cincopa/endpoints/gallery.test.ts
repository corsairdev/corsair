import { makeCincopaRequest } from '../client';
import { get } from './gallery';

jest.mock('../client', () => ({
	makeCincopaRequest: jest.fn(),
}));

const mockedMakeCincopaRequest = jest.mocked(makeCincopaRequest);

describe('Cincopa gallery.list', () => {
	it('lists galleries with mapped query parameters', async () => {
		const response = {
			success: true,
			runtime: 10,
			galleries: [],
			tag_cloud: {},
			items_data: {
				page: 2,
				items_per_page: 25,
				items_count: 0,
				pages_count: 1,
			},
		};

		mockedMakeCincopaRequest.mockResolvedValue(response);

		const ctx = {
			key: 'test-api-token',
			$getAccountId: () => 'test-account-id',
		} as any;

		const input = {
			search: 'photos',
			page: 2,
			itemsPerPage: 25,
			filterTags: 'travel',
		};

		const result = await get(ctx, input);

		expect(mockedMakeCincopaRequest).toHaveBeenCalledWith(
			'gallery.list.json',
			'test-api-token',
			{
				method: 'GET',
				query: {
					search: 'photos',
					page: 2,
					items_per_page: 25,
					filter_tags: 'travel',
				},
			},
		);

		expect(result).toEqual(response);
	});

	it('rejects invalid inputs failing Zod validation', async () => {
		const ctx = {
			key: 'test-api-token',
			$getAccountId: () => 'test-account-id',
		} as any;

		await expect(get(ctx, { itemsPerPage: 200 } as any)).rejects.toThrow();

		await expect(get(ctx, { page: 0 } as any)).rejects.toThrow();
	});

	it('rejects malformed provider output failing Zod validation', async () => {
		mockedMakeCincopaRequest.mockResolvedValue({
			success: true,
			// missing runtime, galleries, items_data, etc.
		} as any);

		const ctx = {
			key: 'test-api-token',
			$getAccountId: () => 'test-account-id',
		} as any;

		await expect(get(ctx, {})).rejects.toThrow();
	});
});
