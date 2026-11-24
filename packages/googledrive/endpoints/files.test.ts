import { ApiError, request } from 'corsair/http';
import { GoogleDriveFile, GoogleDriveFileContents } from '../schema/database';
import type { File } from '../types';
import type { DocsTab } from './files';
import { deleteFile, exportText, get, list } from './files';
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

const driveFile: File = {
	id: 'file-1',
	name: 'Meeting notes',
	mimeType: 'application/vnd.google-apps.document',
	createdTime: '2026-10-01T10:00:00.000Z',
	modifiedTime: '2026-10-02T11:00:00.000Z',
	owners: [{ displayName: 'Ada', emailAddress: 'ada@example.com' }],
	webViewLink: 'https://docs.google.com/document/d/file-1/edit',
	parents: ['folder-1'],
};

// Stored rows are kept as the schemas parse them; `unknown` is the honest input
// type for an upsert, since each test checks the row against the real schema.
type Row = Record<string, unknown>;

function ctx() {
	const stored: Record<string, Row> = {};
	const files = {
		findByEntityId: jest.fn(async (id: string) =>
			stored[id] ? { data: stored[id] } : null,
		),
		upsertByEntityId: jest.fn(async (id: string, data: unknown) => {
			stored[id] = GoogleDriveFile.parse(data);
		}),
		deleteByEntityId: jest.fn(async (id: string) => {
			delete stored[id];
		}),
	};
	const fileContents = {
		upsertByEntityId: jest.fn(async (id: string, data: unknown) => {
			stored[`contents:${id}`] = GoogleDriveFileContents.parse(data);
		}),
		deleteByEntityId: jest.fn(async (id: string) => {
			delete stored[`contents:${id}`];
		}),
	};
	return {
		stored,
		// The endpoints read only key, db and the account id; a full plugin context
		// carries the whole runtime, so this stand-in is cast once, here.
		ctx: {
			key: 'test-token',
			db: {
				files,
				fileContents,
				folders: {
					findByEntityId: jest.fn(async () => null),
					upsertByEntityId: jest.fn(),
				},
			},
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

	it('adds nextPageToken when the caller fields omit it', async () => {
		mockRequest.mockResolvedValue({ files: [] });
		const { ctx: c } = ctx();

		await list(c, { fields: 'files(id,name)' });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				query: expect.objectContaining({
					fields: 'nextPageToken,files(id,name)',
				}),
			}),
		);
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

	it('lays a partial read over the saved row instead of erasing it', async () => {
		const { ctx: c, stored } = ctx();
		mockRequest.mockResolvedValue(driveFile);
		await get(c, { fileId: 'file-1' });

		mockRequest.mockResolvedValue({ id: 'file-1', name: 'Renamed' });
		await get(c, { fileId: 'file-1', fields: 'id,name' });

		expect(stored['file-1']).toMatchObject({
			name: 'Renamed',
			owners: driveFile.owners,
			webViewLink: driveFile.webViewLink,
		});
	});

	it('deletes the saved Docs text with its file', async () => {
		const { ctx: c, stored } = ctx();
		stored['file-1'] = { id: 'file-1' };
		stored['contents:file-1'] = { id: 'file-1', text: 'secret' };
		mockRequest.mockResolvedValue({});

		await deleteFile(c, { fileId: 'file-1' });

		expect(stored['file-1']).toBeUndefined();
		expect(stored['contents:file-1']).toBeUndefined();
	});
});

function paragraph(text: string) {
	return { paragraph: { elements: [{ textRun: { content: text } }] } };
}

function tab(
	title: string,
	lines: string[],
	childTabs: DocsTab[] = [],
): DocsTab {
	return {
		tabProperties: { title },
		documentTab: { body: { content: lines.map(paragraph) } },
		childTabs,
	};
}

function mockDoc(tabs: DocsTab[], meta: File = driveFile) {
	mockRequest.mockImplementation(async (config: { BASE: string }) =>
		config.BASE === 'https://docs.googleapis.com/v1' ? { tabs } : meta,
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

	it('keeps the text of a table of contents', async () => {
		mockDoc([
			{
				tabProperties: { title: 'Notes' },
				documentTab: {
					body: {
						content: [
							{ tableOfContents: { content: [paragraph('1. Intro\n')] } },
							paragraph('Intro body\n'),
						],
					},
				},
			},
		]);
		const { ctx: c } = ctx();

		const { text } = await exportText(c, { fileId: 'file-1' });

		expect(text).toBe('# Notes\n1. Intro\nIntro body\n');
	});

	it('keeps the text of person, rich link and date chips', async () => {
		mockDoc([
			{
				tabProperties: { title: 'Notes' },
				documentTab: {
					body: {
						content: [
							{
								paragraph: {
									elements: [
										{ textRun: { content: 'Attendees: ' } },
										{
											person: {
												personProperties: {
													name: 'Ada Lovelace',
													email: 'ada@example.com',
												},
											},
										},
										{ textRun: { content: ', ' } },
										{
											person: {
												personProperties: { email: 'bob@example.com' },
											},
										},
										{ textRun: { content: ' see ' } },
										{
											richLink: {
												richLinkProperties: {
													title: 'Q4 plan',
													uri: 'https://docs.google.com/x',
												},
											},
										},
										{ textRun: { content: ' on ' } },
										{
											dateElement: {
												dateElementProperties: { displayText: 'Oct 23, 2026' },
											},
										},
										{ textRun: { content: '\n' } },
									],
								},
							},
						],
					},
				},
			},
		]);
		const { ctx: c } = ctx();

		const { text } = await exportText(c, { fileId: 'file-1' });

		expect(text).toBe(
			'# Notes\nAttendees: Ada Lovelace, bob@example.com see Q4 plan on Oct 23, 2026\n',
		);
	});

	it('surfaces the Docs API message on a 403', async () => {
		const message =
			'Google Docs API has not been used in project 123 before or it is disabled. Enable it by visiting https://console.developers.google.com/apis/api/docs.googleapis.com/overview?project=123';
		mockRequest.mockImplementation(async (config: { BASE: string }) => {
			if (config.BASE !== 'https://docs.googleapis.com/v1') return driveFile;
			throw new ApiError(
				{ method: 'GET', url: '/documents/file-1' },
				{
					url: 'https://docs.googleapis.com/v1/documents/file-1',
					ok: false,
					status: 403,
					statusText: 'Forbidden',
					body: {
						error: { code: 403, message, status: 'PERMISSION_DENIED' },
					},
				},
				'Forbidden',
			);
		});
		const { ctx: c } = ctx();

		const error = await exportText(c, { fileId: 'file-1' }).catch((e) => e);
		expect(error).toBeInstanceOf(ApiError);
		expect(error).toMatchObject({ message, status: 403 });
	});

	it('never ends the capped text on half a surrogate pair', async () => {
		const header = '# Transcript\n';
		mockDoc([
			tab('Transcript', [
				`${'x'.repeat(500_000 - header.length - 1)}\u{1F600}tail`,
			]),
		]);
		const { ctx: c } = ctx();

		const { text } = await exportText(c, { fileId: 'file-1' });

		expect(text).toHaveLength(499_999);
		expect(text.endsWith('x')).toBe(true);
	});

	it('rejects input its schema does not allow', async () => {
		const { ctx: c } = ctx();
		// A wrong type on purpose: the schema, not TypeScript, must refuse it at runtime.
		await expect(
			exportText(c, { fileId: 42 as unknown as string }),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
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
