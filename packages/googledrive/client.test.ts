import { request } from 'corsair/http';
import { makeGoogleDriveRequest } from './client';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const mockRequest = request as jest.Mock;

describe('Google Drive API client', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockRequest.mockResolvedValue({});
	});

	it('forwards query parameters on non-GET requests', async () => {
		const query = {
			uploadType: 'resumable',
			addParents: 'folder-id',
			removeParents: 'old-folder-id',
			supportsAllDrives: true,
		};

		await makeGoogleDriveRequest('/files/file-id', 'test-token', {
			method: 'POST',
			body: { name: 'file.txt' },
			query,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({ method: 'POST', query }),
		);
	});
});
