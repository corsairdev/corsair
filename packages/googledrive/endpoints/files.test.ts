import { request } from 'corsair/http';
import { GoogleDriveFile } from '../schema/database';
import { get, list } from './files';
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
	return {
		stored,
		ctx: {
			key: 'test-token',
			db: { files, folders: { upsertByEntityId: jest.fn() } },
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
