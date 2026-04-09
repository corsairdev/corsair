import 'dotenv/config';
import { DROPBOX_CONTENT_BASE, makeDropboxRequest } from './client';
import type { DropboxEndpointOutputs } from './endpoints/types';
import { DropboxEndpointOutputSchemas } from './endpoints/types';

const TEST_TOKEN = process.env.DROPBOX_ACCESS_TOKEN ?? '';
const TEST_FOLDER_PATH = process.env.TEST_DROPBOX_FOLDER ?? '';

describe('Dropbox API Type Tests', () => {
	beforeAll(() => {
		if (!process.env.DROPBOX_ACCESS_TOKEN) {
			throw new Error(
				'DROPBOX_ACCESS_TOKEN environment variable is required to run integration tests',
			);
		}
	});

	describe('folders', () => {
		const createdPaths: string[] = [];

		afterAll(async () => {
			await Promise.allSettled(
				createdPaths.map((path) =>
					makeDropboxRequest('files/delete_v2', TEST_TOKEN, {
						method: 'POST',
						body: { path },
					}),
				),
			);
		});

		it('foldersList returns correct type', async () => {
			const result = await makeDropboxRequest<
				DropboxEndpointOutputs['foldersList']
			>('files/list_folder', TEST_TOKEN, {
				method: 'POST',
				body: { path: TEST_FOLDER_PATH },
			});

			DropboxEndpointOutputSchemas.foldersList.parse(result);

			expect(result).toHaveProperty('entries');
			expect(result).toHaveProperty('cursor');
			expect(result).toHaveProperty('has_more');
			expect(Array.isArray(result.entries)).toBe(true);
		});

		it('foldersCreate returns correct type', async () => {
			const folderPath = `/test-corsair-folder-${Date.now()}`;
			createdPaths.push(folderPath);

			const result = await makeDropboxRequest<
				DropboxEndpointOutputs['foldersCreate']
			>('files/create_folder_v2', TEST_TOKEN, {
				method: 'POST',
				body: { path: folderPath, autorename: true },
			});

			DropboxEndpointOutputSchemas.foldersCreate.parse(result);

			expect(result).toHaveProperty('metadata');
			expect(result.metadata).toHaveProperty('id');
			expect(result.metadata).toHaveProperty('name');
		});

		it('foldersCopy returns correct type', async () => {
			const fromPath = `/test-corsair-copy-src-${Date.now()}`;
			const toPath = `/test-corsair-copy-dst-${Date.now()}`;
			createdPaths.push(fromPath, toPath);

			await makeDropboxRequest('files/create_folder_v2', TEST_TOKEN, {
				method: 'POST',
				body: { path: fromPath },
			});

			const result = await makeDropboxRequest<
				DropboxEndpointOutputs['foldersCopy']
			>('files/copy_v2', TEST_TOKEN, {
				method: 'POST',
				body: { from_path: fromPath, to_path: toPath },
			});

			DropboxEndpointOutputSchemas.foldersCopy.parse(result);

			expect(result).toHaveProperty('metadata');
		});

		it('foldersMove returns correct type', async () => {
			const fromPath = `/test-corsair-move-src-${Date.now()}`;
			const toPath = `/test-corsair-move-dst-${Date.now()}`;
			// Push both: if the move fails midway fromPath still exists; if it
			// succeeds only toPath exists. allSettled silently ignores not-found.
			createdPaths.push(fromPath, toPath);

			await makeDropboxRequest('files/create_folder_v2', TEST_TOKEN, {
				method: 'POST',
				body: { path: fromPath },
			});

			const result = await makeDropboxRequest<
				DropboxEndpointOutputs['foldersMove']
			>('files/move_v2', TEST_TOKEN, {
				method: 'POST',
				body: { from_path: fromPath, to_path: toPath },
			});

			DropboxEndpointOutputSchemas.foldersMove.parse(result);

			expect(result).toHaveProperty('metadata');
		});

		it('foldersDelete returns correct type', async () => {
			const folderPath = `/test-corsair-delete-${Date.now()}`;

			await makeDropboxRequest('files/create_folder_v2', TEST_TOKEN, {
				method: 'POST',
				body: { path: folderPath },
			});

			const result = await makeDropboxRequest<
				DropboxEndpointOutputs['foldersDelete']
			>('files/delete_v2', TEST_TOKEN, {
				method: 'POST',
				body: { path: folderPath },
			});

			DropboxEndpointOutputSchemas.foldersDelete.parse(result);

			expect(result).toHaveProperty('metadata');
		});
	});

	describe('files', () => {
		let testFilePath: string;
		const createdPaths: string[] = [];

		beforeAll(async () => {
			testFilePath = `/test-corsair-file-${Date.now()}.txt`;
			createdPaths.push(testFilePath);
			await makeDropboxRequest('files/upload', TEST_TOKEN, {
				method: 'POST',
				baseUrl: DROPBOX_CONTENT_BASE,
				extraHeaders: {
					'Dropbox-API-Arg': JSON.stringify({
						path: testFilePath,
						mode: 'add',
					}),
					'Content-Type': 'application/octet-stream',
				},
				body: 'Hello from Corsair test',
			});
		});

		afterAll(async () => {
			await Promise.allSettled(
				createdPaths.map((path) =>
					makeDropboxRequest('files/delete_v2', TEST_TOKEN, {
						method: 'POST',
						body: { path },
					}),
				),
			);
		});

		it('filesUpload returns correct type', async () => {
			const uploadPath = `/test-corsair-upload-${Date.now()}.txt`;
			createdPaths.push(uploadPath);

			const result = await makeDropboxRequest<
				DropboxEndpointOutputs['filesUpload']
			>('files/upload', TEST_TOKEN, {
				method: 'POST',
				baseUrl: DROPBOX_CONTENT_BASE,
				extraHeaders: {
					'Dropbox-API-Arg': JSON.stringify({
						path: uploadPath,
						mode: 'add',
					}),
					'Content-Type': 'application/octet-stream',
				},
				body: 'Test content from Corsair',
			});

			DropboxEndpointOutputSchemas.filesUpload.parse(result);

			expect(result).toHaveProperty('id');
			expect(result).toHaveProperty('name');
			expect(result).toHaveProperty('path_lower');
		});

		it('filesCopy returns correct type', async () => {
			const toPath = `/test-corsair-copy-${Date.now()}.txt`;
			createdPaths.push(toPath);

			const result = await makeDropboxRequest<
				DropboxEndpointOutputs['filesCopy']
			>('files/copy_v2', TEST_TOKEN, {
				method: 'POST',
				body: { from_path: testFilePath, to_path: toPath },
			});

			DropboxEndpointOutputSchemas.filesCopy.parse(result);

			expect(result).toHaveProperty('metadata');
		});

		it('filesMove returns correct type', async () => {
			const srcPath = `/test-corsair-move-file-${Date.now()}.txt`;
			const dstPath = `/test-corsair-moved-file-${Date.now()}.txt`;
			// Push both: allSettled silently ignores not-found if the move succeeded
			createdPaths.push(srcPath, dstPath);

			await makeDropboxRequest('files/upload', TEST_TOKEN, {
				method: 'POST',
				baseUrl: DROPBOX_CONTENT_BASE,
				extraHeaders: {
					'Dropbox-API-Arg': JSON.stringify({ path: srcPath, mode: 'add' }),
					'Content-Type': 'application/octet-stream',
				},
				body: 'move test',
			});

			const result = await makeDropboxRequest<
				DropboxEndpointOutputs['filesMove']
			>('files/move_v2', TEST_TOKEN, {
				method: 'POST',
				body: { from_path: srcPath, to_path: dstPath },
			});

			DropboxEndpointOutputSchemas.filesMove.parse(result);

			expect(result).toHaveProperty('metadata');
		});

		it('filesDelete returns correct type', async () => {
			const deletePath = `/test-corsair-delete-file-${Date.now()}.txt`;

			await makeDropboxRequest('files/upload', TEST_TOKEN, {
				method: 'POST',
				baseUrl: DROPBOX_CONTENT_BASE,
				extraHeaders: {
					'Dropbox-API-Arg': JSON.stringify({
						path: deletePath,
						mode: 'add',
					}),
					'Content-Type': 'application/octet-stream',
				},
				body: 'delete test',
			});

			const result = await makeDropboxRequest<
				DropboxEndpointOutputs['filesDelete']
			>('files/delete_v2', TEST_TOKEN, {
				method: 'POST',
				body: { path: deletePath },
			});

			DropboxEndpointOutputSchemas.filesDelete.parse(result);

			expect(result).toHaveProperty('metadata');
		});
	});

	describe('search', () => {
		it('searchQuery returns correct type', async () => {
			const result = await makeDropboxRequest<
				DropboxEndpointOutputs['searchQuery']
			>('files/search_v2', TEST_TOKEN, {
				method: 'POST',
				body: {
					query: 'test',
					options: {
						max_results: 5,
					},
				},
			});

			DropboxEndpointOutputSchemas.searchQuery.parse(result);

			expect(result).toHaveProperty('matches');
			expect(result).toHaveProperty('has_more');
			expect(Array.isArray(result.matches)).toBe(true);
		});

		it('searchQuery with path filter returns correct type', async () => {
			const result = await makeDropboxRequest<
				DropboxEndpointOutputs['searchQuery']
			>('files/search_v2', TEST_TOKEN, {
				method: 'POST',
				body: {
					query: 'corsair',
					options: {
						path: TEST_FOLDER_PATH,
						max_results: 10,
					},
				},
			});

			DropboxEndpointOutputSchemas.searchQuery.parse(result);

			expect(Array.isArray(result.matches)).toBe(true);
		});
	});
});
