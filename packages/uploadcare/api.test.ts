import { logEventFromContext } from 'corsair/core';
import {
	makeUploadcareRequest,
	publicKeyFromAuth,
	UploadcareAPIError,
} from './client';
import {
	Addons,
	Cdn,
	Files,
	Groups,
	Project,
	Upload,
	Webhooks,
} from './endpoints';
import {
	UploadcareEndpointInputSchemas,
	UploadcareEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';

jest.mock('corsair/core', () => {
	const actual =
		jest.requireActual<typeof import('corsair/core')>('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn().mockResolvedValue(undefined),
	};
});

jest.mock('./client', () => {
	const actual = jest.requireActual<typeof import('./client')>('./client');
	return {
		...actual,
		makeUploadcareRequest: jest.fn(),
		makeUploadcareUploadRequest: jest.fn(),
	};
});

const mockedRest = makeUploadcareRequest as jest.MockedFunction<
	typeof makeUploadcareRequest
>;

const { makeUploadcareUploadRequest } = jest.requireMock('./client') as {
	makeUploadcareUploadRequest: jest.Mock;
};

const ctx = { key: 'pub:secret' } as never;
const FILE = {
	uuid: '22240276-2f06-41f8-9411-755c8ce926ed',
	datetime_removed: null,
	datetime_stored: '2018-11-26T12:49:10.477888Z',
	datetime_uploaded: '2018-11-26T12:49:09.945335Z',
	is_image: true,
	is_ready: true,
	mime_type: 'image/jpeg',
	original_file_url:
		'https://ucarecdn.com/22240276-2f06-41f8-9411-755c8ce926ed/pineapple.jpg',
	original_filename: 'pineapple.jpg',
	size: 642,
	url: 'https://api.uploadcare.com/files/22240276-2f06-41f8-9411-755c8ce926ed/',
	variations: null,
	content_info: {
		mime: { mime: 'image/jpeg', type: 'image', subtype: 'jpeg' },
	},
	metadata: { pet: 'cat' },
};

describe('Uploadcare official schemas', () => {
	it('parses official REST v0.7 file info example', () => {
		const parsed = UploadcareEndpointOutputSchemas.fileGet.parse(FILE);
		expect(parsed.uuid).toBe(FILE.uuid);
		expect(parsed.original_filename).toBe('pineapple.jpg');
	});

	it('parses files list with totals', () => {
		const parsed = UploadcareEndpointOutputSchemas.filesList.parse({
			next: null,
			previous: null,
			total: 1,
			totals: { removed: 0, stored: 1, unstored: 0 },
			per_page: 1,
			results: [FILE],
		});
		expect(parsed.results).toHaveLength(1);
	});

	it('parses batch response problems field', () => {
		const parsed = UploadcareEndpointOutputSchemas.batchDeleteFiles.parse({
			status: 'ok',
			problems: { 'not-a-uuid': 'Invalid' },
			result: [FILE],
		});
		expect(parsed.problems?.['not-a-uuid']).toBe('Invalid');
	});

	it('rejects batch over 100 uuids', () => {
		expect(() =>
			UploadcareEndpointInputSchemas.batchStoreFiles.parse({
				uuids: Array.from({ length: 101 }, (_, i) => `u${i}`),
			}),
		).toThrow();
	});

	it('parses official group fields', () => {
		const parsed = UploadcareEndpointOutputSchemas.groupGet.parse({
			id: 'c5bec8c7-d4b6-4921-9e55-6edb027546bc~1',
			datetime_created: '2024-01-15T09:30:00Z',
			files_count: 1,
			cdn_url: 'https://ucarecdn.com/c5bec8c7-d4b6-4921-9e55-6edb027546bc~1/',
			url: 'https://api.uploadcare.com/groups/c5bec8c7-d4b6-4921-9e55-6edb027546bc~1/',
			files: [FILE],
		});
		expect(parsed.files_count).toBe(1);
	});
});

describe('Uploadcare endpoints', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('files.list', async () => {
		mockedRest.mockResolvedValueOnce({ results: [FILE] });
		await Files.list(ctx, { limit: 10, stored: true });
		expect(mockedRest).toHaveBeenCalledWith('/files/', 'pub:secret', {
			method: 'GET',
			query: { limit: 10, stored: true },
		});
	});

	it('files.get', async () => {
		mockedRest.mockResolvedValueOnce(FILE);
		await Files.get(ctx, { uuid: FILE.uuid, include: 'appdata' });
		expect(mockedRest).toHaveBeenCalledWith(
			`/files/${FILE.uuid}/`,
			'pub:secret',
			{
				method: 'GET',
				query: { include: 'appdata' },
			},
		);
	});

	it('files.store and files.delete', async () => {
		mockedRest.mockResolvedValue(FILE);
		await Files.store(ctx, { uuid: FILE.uuid });
		await Files.delete(ctx, { uuid: FILE.uuid });
		expect(mockedRest).toHaveBeenCalledWith(
			`/files/${FILE.uuid}/storage/`,
			'pub:secret',
			{ method: 'PUT' },
		);
		expect(mockedRest).toHaveBeenCalledWith(
			`/files/${FILE.uuid}/storage/`,
			'pub:secret',
			{ method: 'DELETE' },
		);
	});

	it('files.batchStore and files.batchDelete send uuid arrays', async () => {
		mockedRest.mockResolvedValue({ status: 'ok', result: [] });
		await Files.batchStore(ctx, { uuids: ['a', 'b'] });
		await Files.batchDelete(ctx, { uuids: ['a', 'b'] });
		expect(mockedRest).toHaveBeenCalledWith('/files/storage/', 'pub:secret', {
			method: 'PUT',
			body: ['a', 'b'],
		});
		expect(mockedRest).toHaveBeenCalledWith('/files/storage/', 'pub:secret', {
			method: 'DELETE',
			body: ['a', 'b'],
		});
	});

	it('files.copyLocal and metadata ops', async () => {
		mockedRest.mockResolvedValueOnce({ result: FILE });
		await Files.copyLocal(ctx, { source: FILE.uuid, store: true });
		mockedRest.mockResolvedValueOnce({ pet: 'cat' });
		await Files.getMetadata(ctx, { uuid: FILE.uuid });
		mockedRest.mockResolvedValueOnce('cat');
		await Files.getMetadataKey(ctx, { uuid: FILE.uuid, key: 'pet' });
		mockedRest.mockResolvedValueOnce('dog');
		await Files.updateMetadataKey(ctx, {
			uuid: FILE.uuid,
			key: 'pet',
			value: 'dog',
		});
		mockedRest.mockResolvedValueOnce(undefined);
		const deleted = await Files.deleteMetadataKey(ctx, {
			uuid: FILE.uuid,
			key: 'pet',
		});
		expect(deleted.success).toBe(true);
		expect(mockedRest).toHaveBeenCalledWith(
			'/files/local_copy/',
			'pub:secret',
			{
				method: 'POST',
				body: { source: FILE.uuid, store: true, metadata: undefined },
			},
		);
	});

	it('groups.list get delete', async () => {
		mockedRest.mockResolvedValueOnce({ results: [] });
		await Groups.list(ctx, { limit: 5 });
		mockedRest.mockResolvedValueOnce({ id: 'g~1' });
		await Groups.get(ctx, { group_id: 'g~1' });
		mockedRest.mockResolvedValueOnce(undefined);
		await Groups.delete(ctx, { group_id: 'g~1' });
		expect(mockedRest).toHaveBeenCalledWith('/groups/g~1/', 'pub:secret', {
			method: 'DELETE',
		});
	});

	it('project.get', async () => {
		mockedRest.mockResolvedValueOnce({ name: 'Demo', pub_key: 'pub' });
		await Project.get(ctx, {});
		expect(mockedRest).toHaveBeenCalledWith('/project/', 'pub:secret', {
			method: 'GET',
		});
	});

	it('webhooks list create update delete deleteByUrl', async () => {
		mockedRest.mockResolvedValueOnce([]);
		await Webhooks.list(ctx, {});
		mockedRest.mockResolvedValueOnce({ id: 1, event: 'file.uploaded' });
		await Webhooks.create(ctx, {
			target_url: 'https://example.com/hook',
			event: 'file.uploaded',
			signing_secret: 'do-not-log',
		});
		expect(logEventFromContext).toHaveBeenCalledWith(
			ctx,
			'uploadcare.webhooks.create',
			expect.not.objectContaining({ signing_secret: expect.anything() }),
			'completed',
		);
		mockedRest.mockResolvedValueOnce({ id: 1 });
		await Webhooks.update(ctx, { webhook_id: 1, is_active: false });
		mockedRest.mockResolvedValueOnce(undefined);
		await Webhooks.delete(ctx, { webhook_id: 1 });
		mockedRest.mockResolvedValueOnce(undefined);
		await Webhooks.deleteByUrl(ctx, {
			target_url: 'https://example.com/hook',
		});
		expect(mockedRest).toHaveBeenCalledWith(
			'/webhooks/unsubscribe/',
			'pub:secret',
			{
				method: 'DELETE',
				formData: { target_url: 'https://example.com/hook' },
				mediaType: 'application/x-www-form-urlencoded',
			},
		);
	});

	it('upload API ops use public key', async () => {
		makeUploadcareUploadRequest.mockResolvedValue({ token: 'tok' });
		await Upload.fromUrl(ctx, { source_url: 'https://example.com/a.jpg' });
		expect(makeUploadcareUploadRequest).toHaveBeenCalledWith('/from_url/', {
			method: 'POST',
			formData: expect.objectContaining({
				pub_key: 'pub',
				source_url: 'https://example.com/a.jpg',
			}),
		});
		makeUploadcareUploadRequest.mockResolvedValue({ status: 'progress' });
		await Upload.fromUrlStatus(ctx, { token: 'tok' });
		makeUploadcareUploadRequest.mockResolvedValue({ uuid: FILE.uuid });
		await Upload.fileInfo(ctx, { file_id: FILE.uuid });
		makeUploadcareUploadRequest.mockResolvedValue({ id: 'g~1' });
		await Upload.createGroup(ctx, { files: [FILE.uuid] });
		makeUploadcareUploadRequest.mockResolvedValue({ id: 'g~1' });
		await Upload.groupInfo(ctx, { group_id: 'g~1' });
		makeUploadcareUploadRequest.mockResolvedValue({
			uuid: FILE.uuid,
			parts: ['https://s3.example/1'],
		});
		await Upload.startMultipart(ctx, {
			filename: 'big.bin',
			size: 200_000_000,
			content_type: 'application/octet-stream',
			store: 'auto',
		});
		expect(makeUploadcareUploadRequest).toHaveBeenCalledWith(
			'/multipart/start/',
			{
				method: 'POST',
				formData: expect.objectContaining({
					UPLOADCARE_PUB_KEY: 'pub',
					UPLOADCARE_STORE: 'auto',
					filename: 'big.bin',
				}),
			},
		);
	});

	it('addons execute and status', async () => {
		mockedRest.mockResolvedValue({ request_id: 'req-1' });
		await Addons.executeClamav(ctx, { target: FILE.uuid });
		expect(mockedRest).toHaveBeenCalledWith(
			'/addons/uc_clamav_virus_scan/execute/',
			'pub:secret',
			{ method: 'POST', body: { target: FILE.uuid, params: undefined } },
		);
		mockedRest.mockResolvedValue({ status: 'done' });
		await Addons.clamavStatus(ctx, { request_id: 'req-1' });
		await Addons.rekognitionStatus(ctx, { request_id: 'req-1' });
		await Addons.rekognitionModerationStatus(ctx, { request_id: 'req-1' });
		await Addons.removeBgStatus(ctx, { request_id: 'req-1' });
	});

	it('cdn mirror and rotate', async () => {
		const mirrored = await Cdn.mirror(ctx, { uuid: FILE.uuid });
		const rotated = await Cdn.rotate(ctx, { uuid: FILE.uuid, degrees: 90 });
		expect(mirrored.url).toBe(`https://ucarecdn.com/${FILE.uuid}/-/mirror/`);
		expect(rotated.url).toBe(`https://ucarecdn.com/${FILE.uuid}/-/rotate/90/`);
	});
});

describe('client helpers', () => {
	it('splits public key from Uploadcare.Simple auth', () => {
		expect(publicKeyFromAuth('Uploadcare.Simple abc:def')).toBe('abc');
		expect(publicKeyFromAuth('abc:def')).toBe('abc');
	});
});

describe('Error Handlers', () => {
	it('matches 429 status and returns retryAfter', async () => {
		const uploadcareErr = new UploadcareAPIError(
			'Throttled',
			undefined,
			429,
			{},
			30,
		);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(uploadcareErr)).toBe(true);
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(uploadcareErr);
		expect(result.headersRetryAfterMs).toBe(30);
	});

	it('matches 401 status for auth errors', () => {
		const uploadcareErr = new UploadcareAPIError(
			'Unauthorized',
			undefined,
			401,
		);
		expect(errorHandlers.AUTH_ERROR.match(uploadcareErr)).toBe(true);
	});
});
