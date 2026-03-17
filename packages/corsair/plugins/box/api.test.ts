import dotenv from 'dotenv';
import { makeBoxRequest } from './client';
import type {
	FilesCopyResponse,
	FilesDeleteResponse,
	FilesDownloadResponse,
	FilesGetResponse,
	FilesSearchResponse,
	FilesShareResponse,
	FilesUploadResponse,
	FoldersCreateResponse,
	FoldersDeleteResponse,
	FoldersGetResponse,
	FoldersSearchResponse,
	FoldersShareResponse,
	FoldersUpdateResponse,
} from './endpoints/types';
import { BoxEndpointOutputSchemas } from './endpoints/types';

dotenv.config();

const TEST_TOKEN = process.env.BOX_ACCESS_TOKEN!;
const TEST_FILE_ID = process.env.TEST_BOX_FILE_ID;
const TEST_FOLDER_ID = process.env.TEST_BOX_FOLDER_ID || '0';

describe('Box API Type Tests', () => {
	describe('files', () => {
		it('filesGet returns correct type', async () => {
			if (!TEST_FILE_ID) {
				const searchResponse = await makeBoxRequest<FilesSearchResponse>(
					'search',
					TEST_TOKEN,
					{
						method: 'GET',
						query: { query: 'test', type: 'file', limit: 1 },
					},
				);

				BoxEndpointOutputSchemas.filesSearch.parse(searchResponse);

				const fileId = searchResponse.entries?.[0]?.id;
				if (!fileId) {
					console.warn('No files found to test filesGet');
					return;
				}

				const response = await makeBoxRequest<FilesGetResponse>(
					`files/${fileId}`,
					TEST_TOKEN,
					{ method: 'GET' },
				);

				BoxEndpointOutputSchemas.filesGet.parse(response);
			} else {
				const response = await makeBoxRequest<FilesGetResponse>(
					`files/${TEST_FILE_ID}`,
					TEST_TOKEN,
					{ method: 'GET' },
				);

				BoxEndpointOutputSchemas.filesGet.parse(response);
			}
		});

		it('filesSearch returns correct type', async () => {
			const response = await makeBoxRequest<FilesSearchResponse>(
				'search',
				TEST_TOKEN,
				{
					method: 'GET',
					query: { query: 'test', type: 'file', limit: 5 },
				},
			);

			BoxEndpointOutputSchemas.filesSearch.parse(response);
		});

		it('filesUpload returns correct type', async () => {
			const fileName = `test-file-${Date.now()}.txt`;
			const response = await makeBoxRequest<FilesUploadResponse>(
				'files/content',
				TEST_TOKEN,
				{
					method: 'POST',
					body: {
						attributes: {
							name: fileName,
							parent: { id: TEST_FOLDER_ID },
						},
						content: 'test content',
					} as Record<string, unknown>,
				},
			);

			BoxEndpointOutputSchemas.filesUpload.parse(response);
		});

		it('filesShare returns correct type', async () => {
			if (!TEST_FILE_ID) {
				console.warn('Skipping filesShare test — set TEST_BOX_FILE_ID');
				return;
			}

			const response = await makeBoxRequest<FilesShareResponse>(
				`files/${TEST_FILE_ID}`,
				TEST_TOKEN,
				{
					method: 'PUT',
					body: {
						shared_link: {
							access: 'open',
						},
					},
					query: { fields: 'shared_link' },
				},
			);

			BoxEndpointOutputSchemas.filesShare.parse(response);
		});

		it('filesCopy returns correct type', async () => {
			if (!TEST_FILE_ID) {
				console.warn('Skipping filesCopy test — set TEST_BOX_FILE_ID');
				return;
			}

			const response = await makeBoxRequest<FilesCopyResponse>(
				`files/${TEST_FILE_ID}/copy`,
				TEST_TOKEN,
				{
					method: 'POST',
					body: {
						parent: { id: TEST_FOLDER_ID },
						name: `copy-${Date.now()}.txt`,
					},
				},
			);

			BoxEndpointOutputSchemas.filesCopy.parse(response);
		});

		it('filesDownload returns correct type', async () => {
			if (!TEST_FILE_ID) {
				console.warn('Skipping filesDownload test — set TEST_BOX_FILE_ID');
				return;
			}

			const response = await makeBoxRequest<FilesDownloadResponse>(
				`files/${TEST_FILE_ID}/content`,
				TEST_TOKEN,
				{ method: 'GET' },
			);

			BoxEndpointOutputSchemas.filesDownload.parse(response);
		});

		it('filesDelete returns correct type', async () => {
			const uploadResponse = await makeBoxRequest<FilesUploadResponse>(
				'files/content',
				TEST_TOKEN,
				{
					method: 'POST',
					body: {
						attributes: {
							name: `delete-me-${Date.now()}.txt`,
							parent: { id: TEST_FOLDER_ID },
						},
						content: 'to be deleted',
					} as Record<string, unknown>,
				},
			);

			const fileId = uploadResponse.entries?.[0]?.id;
			if (!fileId) {
				console.warn('No file to delete');
				return;
			}

			await makeBoxRequest<void>(`files/${fileId}`, TEST_TOKEN, {
				method: 'DELETE',
			});

			const result: FilesDeleteResponse = { success: true };
			BoxEndpointOutputSchemas.filesDelete.parse(result);
		});
	});

	describe('folders', () => {
		let createdFolderId: string | undefined;

		it('foldersGet returns correct type', async () => {
			const response = await makeBoxRequest<FoldersGetResponse>(
				`folders/${TEST_FOLDER_ID}`,
				TEST_TOKEN,
				{ method: 'GET' },
			);

			BoxEndpointOutputSchemas.foldersGet.parse(response);
		});

		it('foldersSearch returns correct type', async () => {
			const response = await makeBoxRequest<FoldersSearchResponse>(
				'search',
				TEST_TOKEN,
				{
					method: 'GET',
					query: { query: 'test', type: 'folder', limit: 5 },
				},
			);

			BoxEndpointOutputSchemas.foldersSearch.parse(response);
		});

		it('foldersCreate returns correct type', async () => {
			const folderName = `test-folder-${Date.now()}`;
			const response = await makeBoxRequest<FoldersCreateResponse>(
				'folders',
				TEST_TOKEN,
				{
					method: 'POST',
					body: {
						name: folderName,
						parent: { id: TEST_FOLDER_ID },
					},
				},
			);

			BoxEndpointOutputSchemas.foldersCreate.parse(response);

			if (response.id) {
				createdFolderId = response.id;
			}
		});

		it('foldersUpdate returns correct type', async () => {
			if (!createdFolderId) {
				console.warn('Skipping foldersUpdate test — no folder was created');
				return;
			}

			const response = await makeBoxRequest<FoldersUpdateResponse>(
				`folders/${createdFolderId}`,
				TEST_TOKEN,
				{
					method: 'PUT',
					body: {
						description: 'Updated by api.test.ts',
					},
				},
			);

			BoxEndpointOutputSchemas.foldersUpdate.parse(response);
		});

		it('foldersShare returns correct type', async () => {
			if (!createdFolderId) {
				console.warn('Skipping foldersShare test — no folder was created');
				return;
			}

			const response = await makeBoxRequest<FoldersShareResponse>(
				`folders/${createdFolderId}`,
				TEST_TOKEN,
				{
					method: 'PUT',
					body: {
						shared_link: {
							access: 'open',
						},
					},
					query: { fields: 'shared_link' },
				},
			);

			BoxEndpointOutputSchemas.foldersShare.parse(response);
		});

		it('foldersDelete returns correct type', async () => {
			if (!createdFolderId) {
				console.warn('Skipping foldersDelete test — no folder was created');
				return;
			}

			await makeBoxRequest<void>(`folders/${createdFolderId}`, TEST_TOKEN, {
				method: 'DELETE',
				query: { recursive: false },
			});

			const result: FoldersDeleteResponse = { success: true };
			BoxEndpointOutputSchemas.foldersDelete.parse(result);
		});
	});
});
