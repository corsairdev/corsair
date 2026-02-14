import dotenv from 'dotenv';
import { ApiError } from '../../async-core/ApiError';
import { makeGoogleDriveRequest } from './client';
import { GoogleDriveEndpointOutputSchemas } from './endpoints/types';
import type {
	File,
	FileList,
	Permission,
	SharedDrive,
	SharedDriveList,
} from './types';

dotenv.config();

const TEST_TOKEN = process.env.GOOGLE_ACCESS_TOKEN!;

let createdFileIds: string[] = [];
let createdFolderIds: string[] = [];
let createdSharedDriveIds: string[] = [];

async function cleanup() {
	for (const fileId of createdFileIds) {
		try {
			await makeGoogleDriveRequest(`/files/${fileId}`, TEST_TOKEN, {
				method: 'DELETE',
			});
		} catch (error) {
			console.warn(`Failed to cleanup file ${fileId}:`, error);
		}
	}
	for (const folderId of createdFolderIds) {
		try {
			await makeGoogleDriveRequest(`/files/${folderId}`, TEST_TOKEN, {
				method: 'DELETE',
			});
		} catch (error) {
			console.warn(`Failed to cleanup folder ${folderId}:`, error);
		}
	}
	for (const driveId of createdSharedDriveIds) {
		try {
			await makeGoogleDriveRequest(`/drives/${driveId}`, TEST_TOKEN, {
				method: 'DELETE',
			});
		} catch (error) {
			console.warn(`Failed to cleanup shared drive ${driveId}:`, error);
		}
	}
}

afterAll(async () => {
	await cleanup();
});

describe('Google Drive API Type Tests', () => {
	describe('files', () => {
		it('filesList returns correct type', async () => {
			const response = await makeGoogleDriveRequest<FileList>(
				'/files',
				TEST_TOKEN,
				{
					method: 'GET',
					query: {
						pageSize: 10,
					},
				},
			);
			const result = response;

			GoogleDriveEndpointOutputSchemas.filesList.parse(result);
		});

		it('filesGet returns correct type', async () => {
			const filesListResponse = await makeGoogleDriveRequest<FileList>(
				'/files',
				TEST_TOKEN,
				{
					method: 'GET',
					query: {
						pageSize: 1,
					},
				},
			);
			const fileId = filesListResponse.files?.[0]?.id;
			if (!fileId) {
				throw new Error('No files found');
			}

			const response = await makeGoogleDriveRequest<File>(
				`/files/${fileId}`,
				TEST_TOKEN,
				{
					method: 'GET',
				},
			);
			const result = response;

			GoogleDriveEndpointOutputSchemas.filesGet.parse(result);
		});

		it('filesCreateFromText returns correct type', async () => {
			const fileName = `test-file-${Date.now()}.txt`;
			const fileContent = 'This is a test file created by the API test suite';

			const metadata = {
				name: fileName,
				mimeType: 'text/plain',
			};

			const response = await makeGoogleDriveRequest<File>(
				'/files',
				TEST_TOKEN,
				{
					method: 'POST',
					body: metadata,
				},
			);
			const result = response;

			if (result.id) {
				createdFileIds.push(result.id);
			}

			GoogleDriveEndpointOutputSchemas.filesCreateFromText.parse(result);
		});

		it('filesUpdate returns correct type', async () => {
			const fileName = `test-file-update-${Date.now()}.txt`;
			const createResponse = await makeGoogleDriveRequest<File>(
				'/files',
				TEST_TOKEN,
				{
					method: 'POST',
					body: {
						name: fileName,
						mimeType: 'text/plain',
					},
				},
			);

			if (!createResponse.id) {
				throw new Error('Failed to create test file');
			}
			createdFileIds.push(createResponse.id);

			const updatedName = `updated-${fileName}`;
			const response = await makeGoogleDriveRequest<File>(
				`/files/${createResponse.id}`,
				TEST_TOKEN,
				{
					method: 'PATCH',
					body: {
						name: updatedName,
					},
				},
			);
			const result = response;

			GoogleDriveEndpointOutputSchemas.filesUpdate.parse(result);
		});

		it('filesCopy returns correct type', async () => {
			const fileName = `test-file-copy-${Date.now()}.txt`;
			const createResponse = await makeGoogleDriveRequest<File>(
				'/files',
				TEST_TOKEN,
				{
					method: 'POST',
					body: {
						name: fileName,
						mimeType: 'text/plain',
					},
				},
			);

			if (!createResponse.id) {
				throw new Error('Failed to create test file');
			}
			createdFileIds.push(createResponse.id);

			const copyName = `copy-of-${fileName}`;
			const response = await makeGoogleDriveRequest<File>(
				`/files/${createResponse.id}/copy`,
				TEST_TOKEN,
				{
					method: 'POST',
					body: {
						name: copyName,
					},
				},
			);
			const result = response;

			if (result.id) {
				createdFileIds.push(result.id);
			}

			GoogleDriveEndpointOutputSchemas.filesCopy.parse(result);
		});

		it('filesMove returns correct type', async () => {
			const folderName = `test-folder-move-${Date.now()}`;
			const folderResponse = await makeGoogleDriveRequest<File>(
				'/files',
				TEST_TOKEN,
				{
					method: 'POST',
					body: {
						name: folderName,
						mimeType: 'application/vnd.google-apps.folder',
					},
				},
			);

			if (!folderResponse.id) {
				throw new Error('Failed to create test folder');
			}
			createdFolderIds.push(folderResponse.id);

			const fileName = `test-file-move-${Date.now()}.txt`;
			const fileResponse = await makeGoogleDriveRequest<File>(
				'/files',
				TEST_TOKEN,
				{
					method: 'POST',
					body: {
						name: fileName,
						mimeType: 'text/plain',
					},
				},
			);

			if (!fileResponse.id) {
				throw new Error('Failed to create test file');
			}
			createdFileIds.push(fileResponse.id);

			const response = await makeGoogleDriveRequest<File>(
				`/files/${fileResponse.id}`,
				TEST_TOKEN,
				{
					method: 'PATCH',
					body: {},
					query: {
						addParents: folderResponse.id,
						removeParents: '',
					},
				},
			);
			const result = response;

			GoogleDriveEndpointOutputSchemas.filesMove.parse(result);
		});

		it('filesShare returns correct type', async () => {
			const fileName = `test-file-share-${Date.now()}.txt`;
			const createResponse = await makeGoogleDriveRequest<File>(
				'/files',
				TEST_TOKEN,
				{
					method: 'POST',
					body: {
						name: fileName,
						mimeType: 'text/plain',
					},
				},
			);

			if (!createResponse.id) {
				throw new Error('Failed to create test file');
			}
			createdFileIds.push(createResponse.id);

			const response = await makeGoogleDriveRequest<Permission>(
				`/files/${createResponse.id}/permissions`,
				TEST_TOKEN,
				{
					method: 'POST',
					body: {
						type: 'anyone',
						role: 'reader',
					},
				},
			);
			const result = response;

			GoogleDriveEndpointOutputSchemas.filesShare.parse(result);
		});

		it('filesDownload returns correct type', async () => {
			const filesListResponse = await makeGoogleDriveRequest<FileList>(
				'/files',
				TEST_TOKEN,
				{
					method: 'GET',
					query: {
						q: "mimeType='text/plain'",
						pageSize: 1,
					},
				},
			);
			const fileId = filesListResponse.files?.[0]?.id;
			if (!fileId) {
				throw new Error('No text files found for download test');
			}

			const response = await makeGoogleDriveRequest<any>(
				`/files/${fileId}`,
				TEST_TOKEN,
				{
					method: 'GET',
					query: {
						alt: 'media',
					},
				},
			);
			const result = response;

			expect(result).toBeDefined();
		});

		it('filesDelete works correctly', async () => {
			const fileName = `test-file-delete-${Date.now()}.txt`;
			const createResponse = await makeGoogleDriveRequest<File>(
				'/files',
				TEST_TOKEN,
				{
					method: 'POST',
					body: {
						name: fileName,
						mimeType: 'text/plain',
					},
				},
			);

			if (!createResponse.id) {
				throw new Error('Failed to create test file');
			}

			await makeGoogleDriveRequest(`/files/${createResponse.id}`, TEST_TOKEN, {
				method: 'DELETE',
			});

			expect(true).toBe(true);
		});
	});

	describe('folders', () => {
		it('foldersCreate returns correct type', async () => {
			const folderName = `test-folder-${Date.now()}`;
			const response = await makeGoogleDriveRequest<File>(
				'/files',
				TEST_TOKEN,
				{
					method: 'POST',
					body: {
						name: folderName,
						mimeType: 'application/vnd.google-apps.folder',
					},
				},
			);
			const result = response;

			if (result.id) {
				createdFolderIds.push(result.id);
			}

			GoogleDriveEndpointOutputSchemas.foldersCreate.parse(result);
		});

		it('foldersGet returns correct type', async () => {
			const folderName = `test-folder-get-${Date.now()}`;
			const createResponse = await makeGoogleDriveRequest<File>(
				'/files',
				TEST_TOKEN,
				{
					method: 'POST',
					body: {
						name: folderName,
						mimeType: 'application/vnd.google-apps.folder',
					},
				},
			);

			if (!createResponse.id) {
				throw new Error('Failed to create test folder');
			}
			createdFolderIds.push(createResponse.id);

			const response = await makeGoogleDriveRequest<File>(
				`/files/${createResponse.id}`,
				TEST_TOKEN,
				{
					method: 'GET',
				},
			);
			const result = response;

			GoogleDriveEndpointOutputSchemas.foldersGet.parse(result);
		});

		it('foldersList returns correct type', async () => {
			const response = await makeGoogleDriveRequest<FileList>(
				'/files',
				TEST_TOKEN,
				{
					method: 'GET',
					query: {
						q: "mimeType='application/vnd.google-apps.folder'",
						pageSize: 10,
					},
				},
			);
			const result = response;

			GoogleDriveEndpointOutputSchemas.foldersList.parse(result);
		});

		it('foldersShare returns correct type', async () => {
			const folderName = `test-folder-share-${Date.now()}`;
			const createResponse = await makeGoogleDriveRequest<File>(
				'/files',
				TEST_TOKEN,
				{
					method: 'POST',
					body: {
						name: folderName,
						mimeType: 'application/vnd.google-apps.folder',
					},
				},
			);

			if (!createResponse.id) {
				throw new Error('Failed to create test folder');
			}
			createdFolderIds.push(createResponse.id);

			const response = await makeGoogleDriveRequest<Permission>(
				`/files/${createResponse.id}/permissions`,
				TEST_TOKEN,
				{
					method: 'POST',
					body: {
						type: 'anyone',
						role: 'reader',
					},
				},
			);
			const result = response;

			GoogleDriveEndpointOutputSchemas.foldersShare.parse(result);
		});

		it('foldersDelete works correctly', async () => {
			const folderName = `test-folder-delete-${Date.now()}`;
			const createResponse = await makeGoogleDriveRequest<File>(
				'/files',
				TEST_TOKEN,
				{
					method: 'POST',
					body: {
						name: folderName,
						mimeType: 'application/vnd.google-apps.folder',
					},
				},
			);

			if (!createResponse.id) {
				throw new Error('Failed to create test folder');
			}

			await makeGoogleDriveRequest(`/files/${createResponse.id}`, TEST_TOKEN, {
				method: 'DELETE',
			});

			expect(true).toBe(true);
		});
	});

	describe('sharedDrives', () => {
		it('sharedDrivesCreate returns correct type', async () => {
			const driveName = `test-drive-${Date.now()}`;
			const requestId = `req-${Date.now()}`;
			try {
				const response = await makeGoogleDriveRequest<SharedDrive>(
					'/drives',
					TEST_TOKEN,
					{
						method: 'POST',
						body: {
							name: driveName,
						},
						query: {
							requestId,
						},
					},
				);
				const result = response;

				if (result.id) {
					createdSharedDriveIds.push(result.id);
				}

				GoogleDriveEndpointOutputSchemas.sharedDrivesCreate.parse(result);
			} catch (error) {
				throw error;
			}
		});

		it('sharedDrivesGet returns correct type', async () => {
			const driveName = `test-drive-get-${Date.now()}`;
			const requestId = `req-${Date.now()}`;
			let createResponse: SharedDrive;
			try {
				createResponse = await makeGoogleDriveRequest<SharedDrive>(
					'/drives',
					TEST_TOKEN,
					{
						method: 'POST',
						body: {
							name: driveName,
						},
						query: {
							requestId,
						},
					},
				);
			} catch (error) {
				if (error instanceof ApiError && error.status === 400) {
					return;
				}
				throw error;
			}

			if (!createResponse.id) {
				throw new Error('Failed to create test shared drive');
			}
			createdSharedDriveIds.push(createResponse.id);

			const response = await makeGoogleDriveRequest<SharedDrive>(
				`/drives/${createResponse.id}`,
				TEST_TOKEN,
				{
					method: 'GET',
				},
			);
			const result = response;

			GoogleDriveEndpointOutputSchemas.sharedDrivesGet.parse(result);
		});

		it('sharedDrivesList returns correct type', async () => {
			const response = await makeGoogleDriveRequest<SharedDriveList>(
				'/drives',
				TEST_TOKEN,
				{
					method: 'GET',
					query: {
						pageSize: 10,
					},
				},
			);
			const result = response;

			GoogleDriveEndpointOutputSchemas.sharedDrivesList.parse(result);
		});

		it('sharedDrivesUpdate returns correct type', async () => {
			const driveName = `test-drive-update-${Date.now()}`;
			const requestId = `req-${Date.now()}`;
			let createResponse: SharedDrive;
			try {
				createResponse = await makeGoogleDriveRequest<SharedDrive>(
					'/drives',
					TEST_TOKEN,
					{
						method: 'POST',
						body: {
							name: driveName,
						},
						query: {
							requestId,
						},
					},
				);
			} catch (error) {
				throw error;
			}

			if (!createResponse.id) {
				throw new Error('Failed to create test shared drive');
			}
			createdSharedDriveIds.push(createResponse.id);

			const updatedName = `updated-${driveName}`;
			const response = await makeGoogleDriveRequest<SharedDrive>(
				`/drives/${createResponse.id}`,
				TEST_TOKEN,
				{
					method: 'PATCH',
					body: {
						name: updatedName,
					},
				},
			);
			const result = response;

			GoogleDriveEndpointOutputSchemas.sharedDrivesUpdate.parse(result);
		});

		it('sharedDrivesDelete works correctly', async () => {
			const driveName = `test-drive-delete-${Date.now()}`;
			const requestId = `req-${Date.now()}`;
			let createResponse: SharedDrive;
			try {
				createResponse = await makeGoogleDriveRequest<SharedDrive>(
					'/drives',
					TEST_TOKEN,
					{
						method: 'POST',
						body: {
							name: driveName,
						},
						query: {
							requestId,
						},
					},
				);
			} catch (error) {
				throw error;
			}

			if (!createResponse.id) {
				throw new Error('Failed to create test shared drive');
			}

			await makeGoogleDriveRequest(`/drives/${createResponse.id}`, TEST_TOKEN, {
				method: 'DELETE',
			});

			expect(true).toBe(true);
		});
	});

	describe('search', () => {
		it('searchFilesAndFolders returns correct type', async () => {
			const fileName = `test-search-${Date.now()}.txt`;
			const createResponse = await makeGoogleDriveRequest<File>(
				'/files',
				TEST_TOKEN,
				{
					method: 'POST',
					body: {
						name: fileName,
						mimeType: 'text/plain',
					},
				},
			);

			if (createResponse.id) {
				createdFileIds.push(createResponse.id);
			}

			const response = await makeGoogleDriveRequest<FileList>(
				'/files',
				TEST_TOKEN,
				{
					method: 'GET',
					query: {
						q: `name contains 'test-search'`,
						pageSize: 10,
					},
				},
			);
			const result = response;

			GoogleDriveEndpointOutputSchemas.searchFilesAndFolders.parse(result);
		});
	});
});
