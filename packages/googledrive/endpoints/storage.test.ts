import { request } from 'corsair/http';
import { getQuota } from './storage';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const mockRequest = request as jest.Mock;

const quota = {
	limit: '1000',
	usage: '100',
	usageInDrive: '80',
	usageInDriveTrash: '20',
};

function ctx() {
	return {
		key: 'test-token',
		$getAccountId: async () => 'account-1',
	} as never;
}

describe('storage.getQuota', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('GETs /about with fields=storageQuota and returns the quota', async () => {
		mockRequest.mockResolvedValue({ storageQuota: quota });

		const result = await getQuota(ctx(), {});

		expect(result).toEqual(quota);
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: '/about',
				query: { fields: 'storageQuota' },
			}),
		);
	});

	it('throws when storageQuota is missing', async () => {
		mockRequest.mockResolvedValue({});

		await expect(getQuota(ctx(), {})).rejects.toMatchObject({
			name: 'GoogleDriveAPIError',
			message: 'Google Drive about.get returned no storageQuota',
			code: 502,
		});
	});

	it('throws when storageQuota is empty', async () => {
		mockRequest.mockResolvedValue({ storageQuota: {} });

		await expect(getQuota(ctx(), {})).rejects.toMatchObject({
			name: 'GoogleDriveAPIError',
			code: 502,
		});
	});
});
