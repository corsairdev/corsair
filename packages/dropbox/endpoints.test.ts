import { request } from 'corsair/http';
import { deleteFile } from './endpoints/files';
import { deleteFolder } from './endpoints/folders';
import type { DropboxContext } from './index';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const mockRequest = request as jest.Mock;

type Store = {
	upsertByEntityId: jest.Mock;
	deleteByEntityId: jest.Mock;
};

const makeStore = (): Store => ({
	upsertByEntityId: jest.fn(async () => undefined),
	deleteByEntityId: jest.fn(async () => true),
});

function makeCtx(db: Record<string, Store>) {
	// unknown cast needed because the mock only implements the ctx subset
	// exercised by the delete handlers (key/$getAccountId/db) — building a
	// full CorsairPluginContext (hub/keys/database/oauth) is not feasible here.
	return {
		key: 'test-token',
		$getAccountId: async () => 'test-account-id',
		db,
	} as unknown as DropboxContext;
}

describe('dropbox files.delete db cleanup (issue #1874)', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		jest.spyOn(console, 'warn').mockImplementation(() => undefined);
	});

	afterEach(() => {
		(jest.spyOn(console, 'warn') as jest.Mock).mockRestore?.();
		jest.restoreAllMocks();
	});

	it('deletes a file row when metadata .tag is file', async () => {
		mockRequest.mockResolvedValue({
			metadata: { '.tag': 'file', id: 'id:file-1', name: 'a.txt' },
		});
		const files = makeStore();
		const folders = makeStore();
		const ctx = makeCtx({ files, folders });

		const result = await deleteFile(ctx, { path: '/a.txt' });

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(result.metadata).toMatchObject({ '.tag': 'file', id: 'id:file-1' });
		expect(files.deleteByEntityId).toHaveBeenCalledWith('id:file-1');
		expect(folders.deleteByEntityId).not.toHaveBeenCalled();
	});

	it('deletes a folder row when metadata .tag is folder', async () => {
		mockRequest.mockResolvedValue({
			metadata: { '.tag': 'folder', id: 'id:folder-1', name: 'docs' },
		});
		const files = makeStore();
		const folders = makeStore();
		const ctx = makeCtx({ files, folders });

		const result = await deleteFile(ctx, { path: '/docs' });

		expect(result.metadata).toMatchObject({
			'.tag': 'folder',
			id: 'id:folder-1',
		});
		expect(folders.deleteByEntityId).toHaveBeenCalledWith('id:folder-1');
		expect(files.deleteByEntityId).not.toHaveBeenCalled();
	});

	it('deletes a folder even when only the folders store exists', async () => {
		mockRequest.mockResolvedValue({
			metadata: { '.tag': 'folder', id: 'id:folder-2', name: 'only-folders' },
		});
		const folders = makeStore();
		const ctx = makeCtx({ folders });

		await deleteFile(ctx, { path: '/only-folders' });

		expect(folders.deleteByEntityId).toHaveBeenCalledWith('id:folder-2');
	});

	it('deletes a file even when only the files store exists', async () => {
		mockRequest.mockResolvedValue({
			metadata: { '.tag': 'file', id: 'id:file-2', name: 'only-files.txt' },
		});
		const files = makeStore();
		const ctx = makeCtx({ files });

		await deleteFile(ctx, { path: '/only-files.txt' });

		expect(files.deleteByEntityId).toHaveBeenCalledWith('id:file-2');
	});

	it('sends path to files/delete_v2', async () => {
		mockRequest.mockResolvedValue({
			metadata: { '.tag': 'file', id: 'id:file-3', name: 'b.txt' },
		});
		const ctx = makeCtx({ files: makeStore(), folders: makeStore() });

		await deleteFile(ctx, { path: '/b.txt' });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: expect.stringContaining('dropboxapi') }),
			expect.objectContaining({
				method: 'POST',
				url: 'files/delete_v2',
				body: { path: '/b.txt' },
			}),
			expect.anything(),
		);
	});

	it('tolerates db failures and still returns the result', async () => {
		mockRequest.mockResolvedValue({
			metadata: { '.tag': 'folder', id: 'id:folder-3', name: 'flaky' },
		});
		const files = makeStore();
		const folders = makeStore();
		folders.deleteByEntityId.mockRejectedValueOnce(new Error('db down'));
		const ctx = makeCtx({ files, folders });

		const result = await deleteFile(ctx, { path: '/flaky' });

		expect(result.metadata).toMatchObject({ id: 'id:folder-3' });
		expect(folders.deleteByEntityId).toHaveBeenCalledWith('id:folder-3');
	});
});

describe('dropbox folders.delete sanity', () => {
	beforeEach(() => {
		mockRequest.mockReset();
	});

	it('deletes the folder row', async () => {
		mockRequest.mockResolvedValue({
			metadata: { '.tag': 'folder', id: 'id:folder-9', name: 'gone' },
		});
		const folders = makeStore();
		const ctx = makeCtx({ folders });

		const result = await deleteFolder(ctx, { path: '/gone' });

		expect(result.metadata).toMatchObject({ id: 'id:folder-9' });
		expect(folders.deleteByEntityId).toHaveBeenCalledWith('id:folder-9');
	});
});
