import { request } from 'corsair/http';
import { GoogleDriveFile } from '../schema/database';
import { filesAndFolders } from './search';
import { GoogleDriveEndpointInputSchemas } from './types';

jest.mock('corsair/http', () => ({
	...jest.requireActual('corsair/http'),
	request: jest.fn(),
}));

const mockRequest = request as jest.Mock;

const full = {
	id: 'file-1',
	name: 'Budget',
	mimeType: 'application/pdf',
	modifiedTime: '2026-10-02T11:00:00.000Z',
	owners: [{ displayName: 'Ada', emailAddress: 'ada@example.com' }],
	webViewLink: 'https://drive.google.com/file/d/file-1/view',
};

function ctx() {
	const stored: Record<string, Record<string, unknown>> = {};
	const files = {
		findByEntityId: jest.fn(async (id: string) =>
			stored[id] ? { data: stored[id] } : null,
		),
		upsertByEntityId: jest.fn(async (id: string, data: unknown) => {
			stored[id] = GoogleDriveFile.parse(data);
		}),
	};
	// The endpoint reads only key and db here.
	return { stored, ctx: { key: 'test-token', db: { files } } as never };
}

beforeEach(() => mockRequest.mockReset());

describe('googledrive search.filesAndFolders fields', () => {
	it('keeps fields when it parses the input', () => {
		const parsed = GoogleDriveEndpointInputSchemas.searchFilesAndFolders.parse({
			q: "name contains 'budget'",
			fields: 'files(id,name)',
		});
		expect(parsed.fields).toBe('files(id,name)');
	});

	it('passes fields through and keeps nextPageToken', async () => {
		mockRequest.mockResolvedValue({ files: [] });
		await filesAndFolders(ctx().ctx, { q: 'x', fields: 'files(id,name)' });
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				query: expect.objectContaining({
					fields: 'nextPageToken,files(id,name)',
				}),
			}),
		);
	});

	it('lays a partial result over the saved row instead of erasing it', async () => {
		const { ctx: c, stored } = ctx();
		mockRequest.mockResolvedValue({ files: [full] });
		await filesAndFolders(c, { q: 'x' });

		mockRequest.mockResolvedValue({ files: [{ id: 'file-1', name: 'New' }] });
		await filesAndFolders(c, { q: 'x', fields: 'files(id,name)' });

		expect(stored['file-1']).toMatchObject({
			name: 'New',
			owners: full.owners,
			webViewLink: full.webViewLink,
		});
	});
});
