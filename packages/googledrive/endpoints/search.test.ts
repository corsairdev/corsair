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

type Rows = Record<string, Record<string, unknown>>;

function table(rows: Rows) {
	return {
		findByEntityId: jest.fn(async (id: string) =>
			rows[id] ? { data: rows[id] } : null,
		),
		// unknown: the mock stores whatever the schema parses; the test reads it back as a plain row.
		upsertByEntityId: jest.fn(async (id: string, data: unknown) => {
			rows[id] = GoogleDriveFile.parse(data);
		}),
	};
}

function ctx() {
	const stored: Rows = {};
	const folders: Rows = {};
	// The endpoint reads only key and db here.
	return {
		stored,
		folders,
		ctx: {
			key: 'test-token',
			db: { files: table(stored), folders: table(folders) },
		} as never,
	};
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

	it('keeps saved details when a search returns only Drive default fields', async () => {
		const { ctx: c, stored } = ctx();
		mockRequest.mockResolvedValue({ files: [full] });
		await filesAndFolders(c, { q: 'x', fields: 'files(*)' });

		mockRequest.mockResolvedValue({
			files: [{ id: 'file-1', name: 'Budget', mimeType: 'application/pdf' }],
		});
		await filesAndFolders(c, { q: 'x' });

		expect(stored['file-1']).toMatchObject({
			owners: full.owners,
			webViewLink: full.webViewLink,
		});
	});

	it('saves a folder to the folders table when the mask has no mimeType', async () => {
		const { ctx: c, stored, folders } = ctx();
		mockRequest.mockResolvedValue({
			files: [
				{
					id: 'dir-1',
					name: 'Plans',
					mimeType: 'application/vnd.google-apps.folder',
				},
			],
		});
		await filesAndFolders(c, { q: 'x' });

		mockRequest.mockResolvedValue({
			files: [{ id: 'dir-1', name: 'Plans 2' }],
		});
		await filesAndFolders(c, { q: 'x', fields: 'files(id,name)' });

		expect(folders['dir-1']).toMatchObject({ name: 'Plans 2' });
		expect(stored['dir-1']).toBeUndefined();
	});
});
