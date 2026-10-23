import { request } from 'corsair/http';
import { GoogleDriveFile, GoogleDriveFileContents } from '../schema/database';
import { exportText, get, list } from './files';
import { GoogleDriveEndpointInputSchemas } from './types';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const mockRequest = request as jest.Mock;

const LIST_FIELDS =
	'nextPageToken,files(id,name,mimeType,createdTime,modifiedTime,owners,webViewLink,parents)';

const driveFile = {
	id: 'file-1',
	name: 'Meeting notes',
	mimeType: 'application/vnd.google-apps.document',
	createdTime: '2026-10-01T10:00:00.000Z',
	modifiedTime: '2026-10-02T11:00:00.000Z',
	owners: [{ displayName: 'Ada', emailAddress: 'ada@example.com' }],
	webViewLink: 'https://docs.google.com/document/d/file-1/edit',
	parents: ['folder-1'],
};

function ctx() {
	const stored: Record<string, Record<string, unknown>> = {};
	const files = {
		upsertByEntityId: jest.fn(async (id: string, data: unknown) => {
			stored[id] = GoogleDriveFile.parse(data);
		}),
	};
	const fileContents = {
		upsertByEntityId: jest.fn(async (id: string, data: unknown) => {
			stored[`contents:${id}`] = GoogleDriveFileContents.parse(data);
		}),
	};
	return {
		stored,
		ctx: {
			key: 'test-token',
			db: { files, fileContents, folders: { upsertByEntityId: jest.fn() } },
			$getAccountId: async () => 'account-1',
		} as never,
	};
}

describe('files fields passthrough', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('accepts fields on list and get inputs', () => {
		expect(
			GoogleDriveEndpointInputSchemas.filesList.parse({ fields: LIST_FIELDS }),
		).toEqual({ fields: LIST_FIELDS });
		expect(
			GoogleDriveEndpointInputSchemas.filesGet.parse({
				fileId: 'file-1',
				fields: 'id,name',
			}),
		).toEqual({ fileId: 'file-1', fields: 'id,name' });
	});

	it('passes fields to files.list and keeps dates, owners, link and parents', async () => {
		mockRequest.mockResolvedValue({ files: [driveFile] });
		const { ctx: c, stored } = ctx();

		await list(c, { fields: LIST_FIELDS });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				url: '/files',
				query: expect.objectContaining({ fields: LIST_FIELDS }),
			}),
		);
		expect(stored['file-1']).toMatchObject({
			createdTime: driveFile.createdTime,
			modifiedTime: driveFile.modifiedTime,
			owners: driveFile.owners,
			webViewLink: driveFile.webViewLink,
			parents: driveFile.parents,
		});
	});

	it('passes fields to files.get', async () => {
		mockRequest.mockResolvedValue(driveFile);
		const { ctx: c, stored } = ctx();

		await get(c, { fileId: 'file-1', fields: 'id,owners' });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				url: '/files/file-1',
				query: expect.objectContaining({ fields: 'id,owners' }),
			}),
		);
		expect(stored['file-1']?.owners).toEqual(driveFile.owners);
	});
});

function paragraph(text: string) {
	return { paragraph: { elements: [{ textRun: { content: text } }] } };
}

function tab(title: string, lines: string[], childTabs: unknown[] = []) {
	return {
		tabProperties: { title },
		documentTab: { body: { content: lines.map(paragraph) } },
		childTabs,
	};
}

function mockDoc(tabs: unknown[], meta: Record<string, unknown> = driveFile) {
	mockRequest.mockImplementation(async (config: { BASE: string }) =>
		config.BASE.includes('docs.googleapis.com') ? { tabs } : meta,
	);
}

describe('files.exportText', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('reads metadata, fetches the doc with all tabs and persists fileContents', async () => {
		mockDoc([tab('Notes', ['Hello ', 'world\n'])]);
		const { ctx: c, stored } = ctx();

		const result = await exportText(c, { fileId: 'file-1' });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://www.googleapis.com/drive/v3' }),
			expect.objectContaining({
				url: '/files/file-1',
				query: expect.objectContaining({
					fields: 'id,name,mimeType,createdTime,modifiedTime,webViewLink',
				}),
			}),
		);
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://docs.googleapis.com/v1' }),
			expect.objectContaining({
				url: '/documents/file-1',
				query: { includeTabsContent: true },
			}),
		);
		const expected = {
			id: 'file-1',
			name: driveFile.name,
			mimeType: driveFile.mimeType,
			createdTime: driveFile.createdTime,
			modifiedTime: driveFile.modifiedTime,
			webViewLink: driveFile.webViewLink,
			text: '# Notes\nHello world\n',
		};
		expect(result).toEqual(expected);
		expect(stored['contents:file-1']).toEqual(expected);
		expect(stored['file-1']).toBeUndefined();
	});

	it('includes every tab, child tabs too, in document order', async () => {
		mockDoc([
			tab('Notes', ['Summary\n'], [tab('Action items', ['Ship it\n'])]),
			tab('Transcript', ['Ada: hi\n']),
		]);
		const { ctx: c } = ctx();

		const { text } = await exportText(c, { fileId: 'file-1' });

		expect(text).toBe(
			'# Notes\nSummary\n\n# Action items\nShip it\n\n# Transcript\nAda: hi\n',
		);
	});

	it('rejects files that are not Google Docs', async () => {
		mockDoc([], { ...driveFile, mimeType: 'application/pdf' });
		const { ctx: c, stored } = ctx();

		await expect(exportText(c, { fileId: 'file-1' })).rejects.toThrow(
			'exportText supports Google Docs only',
		);
		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(stored['contents:file-1']).toBeUndefined();
	});

	it('caps stored text at 500k characters', async () => {
		mockDoc([tab('Transcript', ['x'.repeat(600_000)])]);
		const { ctx: c, stored } = ctx();

		const { text } = await exportText(c, { fileId: 'file-1' });

		expect(text).toHaveLength(500_000);
		expect(stored['contents:file-1']?.text).toHaveLength(500_000);
	});
});
