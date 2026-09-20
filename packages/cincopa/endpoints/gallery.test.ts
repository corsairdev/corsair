import { makeCincopaRequest } from '../client';
import { abortUploadFromUrl, getUploadFromUrlStatus, uploadFromUrl } from './assets';
import { get } from './gallery';
import { ping } from './general';

jest.mock('../client', () => ({
	CINCOPA_API_BASE: 'https://api.cincopa.com/v2/',
	CincopaAPIError: class CincopaAPIError extends Error {
		constructor(
			message: string,
			public readonly code?: string,
		) {
			super(message);
			this.name = 'CincopaAPIError';
		}
	},
	makeCincopaRequest: jest.fn(),
}));

const mockedMakeCincopaRequest = jest.mocked(makeCincopaRequest);
type Ctx = Parameters<typeof get>[0];

function ctx(): Ctx {
	return {
		key: 'test-api-token',
		$getAccountId: () => 'test-account-id',
	} as unknown as Ctx;
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

		const result = await get(ctx(), {
			search: 'photos',
			page: 2,
			itemsPerPage: 25,
			filterTags: 'travel',
		});

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
		await expect(get(ctx(), { itemsPerPage: 200 })).rejects.toThrow();
		await expect(get(ctx(), { page: 0 })).rejects.toThrow();
	});

	it('rejects malformed provider output failing Zod validation', async () => {
		mockedMakeCincopaRequest.mockResolvedValue({
			success: true,
		} as never);

		await expect(get(ctx(), {})).rejects.toThrow();
	});
});

describe('Cincopa general.ping', () => {
	it('GETs ping.json', async () => {
		mockedMakeCincopaRequest.mockResolvedValue({
			success: true,
			ping: 'pong',
			runtime: 12,
		});

		const result = await ping(ctx(), {});
		expect(mockedMakeCincopaRequest).toHaveBeenCalledWith(
			'ping.json',
			'test-api-token',
			{ method: 'GET' },
		);
		expect(result.ping).toBe('pong');
	});
});

describe('Cincopa asset upload-from-url', () => {
	it('starts an upload', async () => {
		mockedMakeCincopaRequest.mockResolvedValue({
			success: true,
			runtime: 5,
			status_id: 'status-1',
		});

		const result = await uploadFromUrl(ctx(), {
			input: 'https://example.com/a.jpg',
			fid: 'fid-1',
		});

		expect(mockedMakeCincopaRequest).toHaveBeenCalledWith(
			'asset.upload_from_url.json',
			'test-api-token',
			{
				method: 'POST',
				query: {
					input: 'https://example.com/a.jpg',
					fid: 'fid-1',
					rid: undefined,
					type: undefined,
				},
			},
		);
		expect(result.status_id).toBe('status-1');
	});

	it('gets upload status', async () => {
		mockedMakeCincopaRequest.mockResolvedValue({
			success: true,
			status: 'inprogress',
			progress: 1,
		});

		const result = await getUploadFromUrlStatus(ctx(), { statusId: 'status-1' });
		expect(mockedMakeCincopaRequest).toHaveBeenCalledWith(
			'asset.upload_from_url_get_status.json',
			'test-api-token',
			{ method: 'GET', query: { status_id: 'status-1' } },
		);
		expect(result.status).toBe('inprogress');
	});

	it('aborts an upload', async () => {
		mockedMakeCincopaRequest.mockResolvedValue({
			success: true,
			status_id: 'status-1',
		});

		const result = await abortUploadFromUrl(ctx(), { statusId: 'status-1' });
		expect(mockedMakeCincopaRequest).toHaveBeenCalledWith(
			'asset.upload_from_url_abort.json',
			'test-api-token',
			{ method: 'POST', query: { status_id: 'status-1' } },
		);
		expect(result.success).toBe(true);
	});
});
