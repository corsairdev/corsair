import { request } from 'corsair/http';
import { makeGoogleDriveRequest } from './client';
import { move } from './endpoints/files';

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

	it('files.move keeps parents in query but not path-only fileId', async () => {
		mockRequest.mockResolvedValue({ id: 'file-id' });

		const ctx = {
			key: 'test-token',
			endpoints: {
				files: {
					get: jest.fn().mockResolvedValue({ id: 'file-id' }),
				},
			},
			db: {},
		};

		await move(ctx as never, {
			fileId: 'file-id',
			addParents: 'new-folder',
			removeParents: 'old-folder',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'PATCH',
				url: '/files/file-id',
				query: {
					addParents: 'new-folder',
					removeParents: 'old-folder',
					supportsAllDrives: undefined,
					supportsTeamDrives: undefined,
				},
			}),
		);
		expect(mockRequest.mock.calls[0]?.[1]?.query).not.toHaveProperty('fileId');
	});
});
