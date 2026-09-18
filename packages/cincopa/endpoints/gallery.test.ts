import { makeCincopaRequest } from '../client';
import { get } from './gallery';

jest.mock('../client', () => ({
	makeCincopaRequest: jest.fn(),
}));

const mockedMakeCincopaRequest = jest.mocked(makeCincopaRequest);
type GalleryContext = Parameters<typeof get>[0];

function galleryContext(): GalleryContext {
	return {
		key: 'test-api-token',
		$getAccountId: () => 'test-account-id',
		// unknown: fixture omits unrelated runtime context fields.
	} as unknown as GalleryContext;
}

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

		const ctx = galleryContext();

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
		const ctx = galleryContext();

		await expect(get(ctx, { itemsPerPage: 200 })).rejects.toThrow();

		await expect(get(ctx, { page: 0 })).rejects.toThrow();
	});

	it('rejects malformed provider output failing Zod validation', async () => {
		mockedMakeCincopaRequest.mockResolvedValue({
			success: true,
			// missing runtime, galleries, items_data, etc.
		} as never);

		const ctx = galleryContext();

		await expect(get(ctx, {})).rejects.toThrow();
	});
});
