import 'dotenv/config';
import { makeBoxRequest, makeBoxUploadRequest } from './client';
import { download } from './endpoints/files';
import type {
	FilesCopyResponse,
	FilesDeleteResponse,
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
import type { BoxContext } from './index';

// Only logEventFromContext is used by the download endpoint; loading the real
// module pulls in core's ESM build, which this package's Jest can't parse.
jest.mock('corsair/core', () => ({ logEventFromContext: jest.fn() }));

const TEST_TOKEN = process.env.BOX_ACCESS_TOKEN!;
let TEST_FILE_ID: string | undefined;
let TEST_FOLDER_ID = '0';

beforeAll(async () => {
	// Use folder listing instead of search — search requires indexing time and new files won't appear immediately
	const rootItems = await makeBoxRequest<{
		entries: Array<{ id: string; type: string }>;
	}>('folders/0/items', TEST_TOKEN, { method: 'GET', query: { limit: 10 } });

	TEST_FILE_ID = rootItems.entries?.find((e) => e.type === 'file')?.id;
	const folder = rootItems.entries?.find((e) => e.type === 'folder');
	if (folder?.id) {
		TEST_FOLDER_ID = folder.id;
	}
});

describe('Box API Type Tests', () => {
	describe('files', () => {
		it('filesGet returns correct type', async () => {
			if (!TEST_FILE_ID) {
				console.warn('No files found to test filesGet');
				return;
			}

			const response = await makeBoxRequest<FilesGetResponse>(
				`files/${TEST_FILE_ID}`,
				TEST_TOKEN,
				{ method: 'GET' },
			);

			BoxEndpointOutputSchemas.filesGet.parse(response);
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
			const response = await makeBoxUploadRequest<FilesUploadResponse>(
				'files/content',
				TEST_TOKEN,
				{
					attributes: { name: fileName, parent: { id: TEST_FOLDER_ID } },
					content: 'test content',
					fileName,
				},
			);

			BoxEndpointOutputSchemas.filesUpload.parse(response);
		});

		it('filesShare returns correct type', async () => {
			if (!TEST_FILE_ID) {
				console.warn('Skipping filesShare test — no file found');
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
				console.warn('Skipping filesCopy test — no file found');
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

		// Through the endpoint an agent calls: a file with bytes that aren't
		// UTF-8 must come back exactly, and a CSV must come back as text.
		it('files.download returns a binary file byte for byte and a CSV as text', async () => {
			const pdf = new Uint8Array([
				0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x34, 0x0a, 0xff, 0xfe, 0x00,
				0x80, 0xc3, 0x28,
			]);
			const csv = 'id,name\n1,Zoë\n';
			const upload = async (fileName: string, content: Uint8Array) => {
				const response = await makeBoxUploadRequest<FilesUploadResponse>(
					'files/content',
					TEST_TOKEN,
					{
						attributes: { name: fileName, parent: { id: '0' } },
						content,
						fileName,
					},
				);
				const id = response.entries?.[0]?.id;
				if (!id) throw new Error('Box upload returned no file id');
				return id;
			};
			const stamp = Date.now();
			const pdfId = await upload(`corsair-download-test-${stamp}.pdf`, pdf);
			const csvId = await upload(
				`corsair-download-test-${stamp}.csv`,
				new TextEncoder().encode(csv),
			);
			try {
				// unknown: the endpoint reads only ctx.key, not a full plugin context.
				const ctx = { key: TEST_TOKEN } as unknown as BoxContext;
				const gotPdf = await download(ctx, { file_id: pdfId });
				expect(BoxEndpointOutputSchemas.filesDownload.parse(gotPdf)).toEqual(
					gotPdf,
				);
				expect(gotPdf.byteLength).toBe(pdf.byteLength);
				expect(Buffer.from(gotPdf.contentBase64 ?? '', 'base64')).toEqual(
					Buffer.from(pdf),
				);
				const gotCsv = await download(ctx, { file_id: csvId });
				expect(gotCsv.text).toBe(csv);
			} finally {
				for (const id of [pdfId, csvId]) {
					await makeBoxRequest(`files/${id}`, TEST_TOKEN, {
						method: 'DELETE',
					}).catch(() => undefined);
				}
			}
		});

		it('filesDelete returns correct type', async () => {
			const deleteName = `delete-me-${Date.now()}.txt`;
			const uploadResponse = await makeBoxUploadRequest<FilesUploadResponse>(
				'files/content',
				TEST_TOKEN,
				{
					attributes: { name: deleteName, parent: { id: TEST_FOLDER_ID } },
					content: 'to be deleted',
					fileName: deleteName,
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
