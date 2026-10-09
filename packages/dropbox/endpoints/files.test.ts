import * as client from '../client';
import type { DropboxContext } from '../index';
import { deleteFile } from './files';
import type { DropboxEndpointOutputs } from './types';

jest.mock('../client', () => {
	const actual = jest.requireActual('../client');
	return {
		...actual,
		makeAuthenticatedDropboxRequest: jest.fn(),
	};
});

const mockMakeAuthenticatedDropboxRequest = jest.mocked(
	client.makeAuthenticatedDropboxRequest,
);

// Endpoint handlers receive a full CorsairPluginContext. These tests only need
// the database stores used by files.delete plus the account resolver used by
// event logging, so keep the test double intentionally narrow.
function createMockContext(options: { files?: boolean; folders?: boolean } = {}) {
	const fileDelete = jest.fn(async (_id: string) => true);
	const folderDelete = jest.fn(async (_id: string) => true);
	const mock = {
		key: 'test-token',
		db: {
			...(options.files === false
				? {}
				: { files: { deleteByEntityId: fileDelete } }),
			...(options.folders === false
				? {}
				: { folders: { deleteByEntityId: folderDelete } }),
		},
		$getAccountId: (): Promise<string> => Promise.resolve('test-account-id'),
	};

	return {
		ctx: mock as unknown as DropboxContext,
		fileDelete,
		folderDelete,
	};
}

describe('files.delete local database cleanup', () => {
	beforeEach(() => {
		mockMakeAuthenticatedDropboxRequest.mockReset();
	});

	it('deletes a folder row even when only the folders store is configured', async () => {
		const response: DropboxEndpointOutputs['filesDelete'] = {
			metadata: {
				'.tag': 'folder',
				id: 'id:folder-1',
				name: 'Folder',
			},
		};
		mockMakeAuthenticatedDropboxRequest.mockResolvedValueOnce(response);
		const { ctx, fileDelete, folderDelete } = createMockContext({
			files: false,
		});

		const result = await deleteFile(ctx, { path: '/Folder' });

		expect(result).toEqual(response);
		expect(folderDelete).toHaveBeenCalledTimes(1);
		expect(folderDelete).toHaveBeenCalledWith('id:folder-1');
		expect(fileDelete).not.toHaveBeenCalled();
		expect(mockMakeAuthenticatedDropboxRequest).toHaveBeenCalledWith(
			'files/delete_v2',
			ctx,
			{
				method: 'POST',
				body: { path: '/Folder' },
			},
		);
	});

	it('continues deleting file rows when only the files store is configured', async () => {
		const response: DropboxEndpointOutputs['filesDelete'] = {
			metadata: {
				'.tag': 'file',
				id: 'id:file-1',
				name: 'file.txt',
			},
		};
		mockMakeAuthenticatedDropboxRequest.mockResolvedValueOnce(response);
		const { ctx, fileDelete, folderDelete } = createMockContext({
			folders: false,
		});

		const result = await deleteFile(ctx, { path: '/file.txt' });

		expect(result).toEqual(response);
		expect(fileDelete).toHaveBeenCalledTimes(1);
		expect(fileDelete).toHaveBeenCalledWith('id:file-1');
		expect(folderDelete).not.toHaveBeenCalled();
		expect(mockMakeAuthenticatedDropboxRequest).toHaveBeenCalledWith(
			'files/delete_v2',
			ctx,
			{
				method: 'POST',
				body: { path: '/file.txt' },
			},
		);
	});
});
