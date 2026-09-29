import { makeCincopaRequest } from '../client';
import {
	abortUploadFromUrl,
	getUploadFromUrlStatus,
	uploadFromUrl,
} from './assets';
import { list as galleryList } from './gallery';
import { getUploadIframe, ping } from './general';

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
type Ctx = Parameters<typeof ping>[0];

function ctx(): Ctx {
	return {
		key: 'test-api-token',
		$getAccountId: () => 'test-account-id',
		// unknown: fixture omits unrelated runtime context fields.
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

		const result = await galleryList(ctx(), {
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
		await expect(galleryList(ctx(), { itemsPerPage: 200 })).rejects.toThrow();
		await expect(galleryList(ctx(), { page: 0 })).rejects.toThrow();
	});

	it('rejects malformed provider output failing Zod validation', async () => {
		mockedMakeCincopaRequest.mockResolvedValue({
			success: true,
		} as never);

		await expect(galleryList(ctx(), {})).rejects.toThrow();
	});
});

describe('Cincopa general.ping', () => {
	it('validates connection and returns parsed account identity', async () => {
		mockedMakeCincopaRequest.mockResolvedValue({
			success: true,
			ping: 'pong',
			runtime: 12,
			accid: 'AMDA4gh2YtrO',
			accid_num: '1595450',
			accemail: 'user@example.com',
			permissions: '|asset.*|',
		});

		const result = await ping(ctx(), {});
		expect(mockedMakeCincopaRequest).toHaveBeenCalledWith(
			'ping.json',
			'test-api-token',
			{ method: 'GET' },
		);
		expect(result.ping).toBe('pong');
		expect(result.accid).toBe('AMDA4gh2YtrO');
	});

	it('rejects malformed provider ping response', async () => {
		mockedMakeCincopaRequest.mockResolvedValue({
			success: 'not-a-boolean',
		} as never);

		await expect(ping(ctx(), {})).rejects.toThrow();
	});
});

describe('Cincopa asset endpoints', () => {
	it('starts an asset upload from URL', async () => {
		mockedMakeCincopaRequest.mockResolvedValue({
			success: true,
			runtime: 5,
			status_id: 'status-uuid-1234',
		});

		const result = await uploadFromUrl(ctx(), {
			input: 'https://example.com/image.png',
			fid: 'gallery-fid-1',
		});

		expect(mockedMakeCincopaRequest).toHaveBeenCalledWith(
			'asset.upload_from_url.json',
			'test-api-token',
			{
				method: 'POST',
				query: {
					input: 'https://example.com/image.png',
					fid: 'gallery-fid-1',
					rid: undefined,
					type: undefined,
				},
			},
		);
		expect(result.status_id).toBe('status-uuid-1234');
	});

	it('rejects invalid input URL for uploadFromUrl', async () => {
		await expect(
			uploadFromUrl(ctx(), {
				input: 'not-a-valid-url',
			}),
		).rejects.toThrow();
	});

	it('retrieves asset upload status by status ID', async () => {
		mockedMakeCincopaRequest.mockResolvedValue({
			success: true,
			status: 'inprogress',
			progress: '50',
			progress_bytes: '5000',
			file_size_bytes: '10000',
			resid: 'resid-123',
		});

		const result = await getUploadFromUrlStatus(ctx(), {
			statusId: 'status-uuid-1234',
		});

		expect(mockedMakeCincopaRequest).toHaveBeenCalledWith(
			'asset.upload_from_url_get_status.json',
			'test-api-token',
			{
				method: 'GET',
				query: { status_id: 'status-uuid-1234' },
			},
		);
		expect(result.status).toBe('inprogress');
		expect(result.progress).toBe('50');
	});

	it('rejects empty statusId for getUploadFromUrlStatus', async () => {
		await expect(
			getUploadFromUrlStatus(ctx(), {
				statusId: '',
			}),
		).rejects.toThrow();
	});

	it('aborts an asset upload by status ID', async () => {
		mockedMakeCincopaRequest.mockResolvedValue({
			success: true,
			status_id: 'status-uuid-1234',
			runtime: 10,
		});

		const result = await abortUploadFromUrl(ctx(), {
			statusId: 'status-uuid-1234',
		});

		expect(mockedMakeCincopaRequest).toHaveBeenCalledWith(
			'asset.upload_from_url_abort.json',
			'test-api-token',
			{
				method: 'POST',
				query: { status_id: 'status-uuid-1234' },
			},
		);
		expect(result.success).toBe(true);
	});

	it('rejects empty statusId for abortUploadFromUrl', async () => {
		await expect(
			abortUploadFromUrl(ctx(), {
				statusId: '',
			}),
		).rejects.toThrow();
	});
});
