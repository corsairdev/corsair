import 'dotenv/config';
import { makeGoogleDocsRequest, makeGoogleDriveRequest } from './client';
import { GoogleDocsEndpointOutputSchemas } from './endpoints/types';
import type { Document, DriveFileList } from './types';

const TEST_TOKEN = process.env.GOOGLE_ACCESS_TOKEN;
const describeMaybe = TEST_TOKEN ? describe : describe.skip;

let createdDocumentIds: string[] = [];

async function cleanup() {
	for (const documentId of createdDocumentIds) {
		try {
			await makeGoogleDriveRequest(`/files/${documentId}`, TEST_TOKEN!, {
				method: 'DELETE',
			});
		} catch (error) {
			console.warn(`Failed to cleanup document ${documentId}:`, error);
		}
	}
}

afterAll(async () => {
	await cleanup();
});

describeMaybe('Google Docs API type tests', () => {
	it('createDocument returns a parseable Document', async () => {
		const document = await makeGoogleDocsRequest<Document>(
			'/documents',
			TEST_TOKEN!,
			{ method: 'POST', body: { title: 'Corsair Docs API Test' } },
		);

		if (document.documentId) {
			createdDocumentIds.push(document.documentId);
		}

		GoogleDocsEndpointOutputSchemas.createDocument.parse(document);
	});

	it('searchDocuments returns a parseable DriveFileList', async () => {
		const result = await makeGoogleDriveRequest<DriveFileList>(
			'/files',
			TEST_TOKEN!,
			{
				method: 'GET',
				query: {
					q: "mimeType='application/vnd.google-apps.document'",
					pageSize: 5,
					fields: 'nextPageToken,files(id,name,mimeType,modifiedTime)',
				},
			},
		);

		GoogleDocsEndpointOutputSchemas.searchDocuments.parse(result);
	});
});
