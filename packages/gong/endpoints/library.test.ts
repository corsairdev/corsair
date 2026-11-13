import { request } from 'corsair/http';
import { getCallsInSpecificFolder, getLibraryStructure } from './library';
import {
	GongLibraryInputSchemas,
	GongLibraryOutputSchemas,
} from './library-types';

jest.mock('corsair/http', () => ({
	ApiError: class ApiError extends Error {},
	request: jest.fn(),
}));
const mockedRequest = jest.mocked(request);
const ctx = {
	key: 'key',
	options: {
		authType: 'api_key' as const,
		accessKey: 'key',
		accessKeySecret: 'secret',
		baseUrl: 'https://tenant.api.gong.io',
	},
	$getAccountId: async () => 'account',
};

describe('Gong Library contracts', () => {
	beforeEach(() => mockedRequest.mockReset());
	it('validates both operation schemas', () => {
		expect(
			GongLibraryInputSchemas.getLibraryStructure.safeParse({}).success,
		).toBe(true);
		expect(
			GongLibraryInputSchemas.getCallsInSpecificFolder.safeParse({
				folderId: '123',
			}).success,
		).toBe(true);
		expect(
			GongLibraryInputSchemas.getCallsInSpecificFolder.safeParse({
				folderId: '../x',
			}).success,
		).toBe(false);
		expect(
			GongLibraryOutputSchemas.getLibraryStructure.safeParse({
				requestId: 'r',
				folders: [],
			}).success,
		).toBe(true);
		expect(
			GongLibraryOutputSchemas.getCallsInSpecificFolder.safeParse({
				requestId: 'r',
				id: '123',
				name: 'Folder',
				createdBy: 'u',
				updated: '2025-01-01T00:00:00Z',
				calls: [],
			}).success,
		).toBe(true);
	});
	it.each([
		[getLibraryStructure, {}, '/v2/library/folders'],
		[
			getCallsInSpecificFolder,
			{ folderId: '123' },
			'/v2/library/folder-content',
		],
	] as const)(
		'sends the documented GET query to %s',
		async (endpoint, input, path) => {
			mockedRequest.mockResolvedValue(
				path.endsWith('folder-content')
					? {
							requestId: 'r',
							id: '123',
							name: 'Folder',
							createdBy: 'u',
							updated: '2025-01-01T00:00:00Z',
							calls: [],
						}
					: { requestId: 'r', folders: [] },
			);
			await endpoint(ctx, input as never);
			expect(mockedRequest).toHaveBeenCalledWith(
				expect.any(Object),
				expect.objectContaining({ method: 'GET', url: path, query: input }),
			);
		},
	);
});
