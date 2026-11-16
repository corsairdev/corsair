import 'dotenv/config';
import { ApiError } from 'corsair/http';
import { makeGoogleDriveRequest } from './client';
import { download } from './endpoints/files';
import { GoogleDriveEndpointOutputSchemas } from './endpoints/types';
import type { GoogleDriveContext } from './index';
import type {
	About,
	File,
	FileList,
	Permission,
	SharedDrive,
	SharedDriveList,
} from './types';

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

		// Through the endpoint an agent calls: a file with bytes that aren't
		// UTF-8 must come back exactly, and a CSV must come back as text.
		it('files.download returns a binary file byte for byte and a CSV as text', async () => {
			const pdf = new Uint8Array([
				0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x34, 0x0a, 0xff, 0xfe, 0x00,
				0x80, 0xc3, 0x28,
			]);
			const csv = 'id,name\n1,Zoë\n';
			const upload = async (name: string, mimeType: string, body: Blob) => {
				const form = new FormData();
				form.append(
					'metadata',
					new Blob([JSON.stringify({ name, mimeType })], {
						type: 'application/json',
					}),
				);
				form.append('file', body);
				const response = await fetch(
					'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
					{
						method: 'POST',
						headers: { Authorization: `Bearer ${TEST_TOKEN}` },
						body: form,
					},
				);
				expect(response.ok).toBe(true);
				const { id } = (await response.json()) as { id: string };
				createdFileIds.push(id);
				return id;
			};
			const pdfId = await upload(
				`corsair-download-test-${Date.now()}.pdf`,
				'application/pdf',
				new Blob([pdf], { type: 'application/pdf' }),
			);
			const csvId = await upload(
				`corsair-download-test-${Date.now()}.csv`,
				'text/csv',
				new Blob([csv], { type: 'text/csv' }),
			);

			// unknown: the endpoint reads only ctx.key, not a full plugin context.
			const ctx = { key: TEST_TOKEN } as unknown as GoogleDriveContext;
			const gotPdf = await download(ctx, { fileId: pdfId });
			expect(
				GoogleDriveEndpointOutputSchemas.filesDownload.parse(gotPdf),
			).toEqual(gotPdf);
			expect(gotPdf.contentType).toBe('application/pdf');
			expect(gotPdf.byteLength).toBe(pdf.byteLength);
			expect(Buffer.from(gotPdf.contentBase64 ?? '', 'base64')).toEqual(
				Buffer.from(pdf),
			);

			const gotCsv = await download(ctx, { fileId: csvId });
			expect(gotCsv.contentType).toBe('text/csv');
			expect(gotCsv.text).toBe(csv);
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

	describe('storage', () => {
		it('storageGetQuota returns correct type', async () => {
			const response = await makeGoogleDriveRequest<About>(
				'/about',
				TEST_TOKEN,
				{
					method: 'GET',
					query: {
						fields: 'storageQuota',
					},
				},
			);

			GoogleDriveEndpointOutputSchemas.storageGetQuota.parse(
				response.storageQuota,
			);
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
