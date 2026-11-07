import { logEventFromContext } from 'corsair/core';
import { Cache, Files, FileVersions, Folders, Metadata } from './endpoints';
import {
	bulkDeleted,
	bulkJob,
	bulkJobCompleted,
	bulkPartiallyUpdated,
	bulkUpdated,
	file,
	fileNotFound,
	folder,
	metadata,
	purgeAccepted,
	purgeCompleted,
	renamedPurgeFailed,
	renamedWithPurge,
	serverError,
	upload,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'ik-test-key';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Each endpoint returns its own output type,
// so the shared return is unknown.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts.
async function invoke<T = unknown>(
	endpoint: AnyEndpoint,
	input: unknown,
): Promise<T> {
	// The fake context only carries what the endpoints read (ctx.key).
	return endpoint({ key: API_KEY } as never, input as never) as Promise<T>;
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

function respondEmpty(status: number) {
	fetchMock.mockResolvedValueOnce(new Response(null, { status }));
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		origin: parsed.origin,
		path: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams),
		method: init.method,
		headers: new Headers(init.headers),
		// unknown: the request body is whatever the endpoint serialized.
		body:
			init.body instanceof FormData
				? init.body
				: init.body
					? (JSON.parse(String(init.body)) as unknown)
					: undefined,
	};
}

function expectAuthenticated() {
	const sent = lastRequest();
	expect(sent.origin).toBe('https://api.imagekit.io');
	expect(sent.headers.get('authorization')).toBe(
		`Basic ${Buffer.from(`${API_KEY}:`).toString('base64')}`,
	);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('files.upload', () => {
	it('POSTs multipart to /api/v1/files/upload and parses the upload', async () => {
		respond(upload);

		const result = await invoke<{ fileId: string }>(Files.upload, {
			file: 'https://example.com/product-photo.jpg',
			fileName: 'product-photo.jpg',
			folder: '/products/',
			tags: ['summer'],
			customMetadata: { campaign: 'summer-drop' },
		});

		expect(result.fileId).toBe(upload.fileId);
		expectAuthenticated();
		const sent = lastRequest();
		expect(sent.path).toBe('/api/v1/files/upload');
		const form = sent.body as FormData;
		expect(form.get('file')).toBe('https://example.com/product-photo.jpg');
		expect(form.get('fileName')).toBe('product-photo.jpg');
		// Tags go in as one comma-separated field.
		expect(form.get('tags')).toBe('summer');
		expect(form.get('customMetadata')).toBe('{"campaign":"summer-drop"}');
	});

	it('rejects a malformed upload answer', async () => {
		respond({ fileId: 42 }, 200);
		await expect(
			invoke(Files.upload, {
				file: 'https://example.com/photo.jpg',
				fileName: 'photo.jpg',
			}),
		).rejects.toThrow();
	});

	it('rejects an upload without a fileName', async () => {
		await expect(
			invoke(Files.upload, { file: 'https://example.com/photo.jpg' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('files.list', () => {
	it('GETs /v1/files with paging and filters', async () => {
		respond([file, folder]);

		const result = await invoke<unknown[]>(Files.list, {
			path: '/products/',
			limit: 25,
			skip: 25,
			fileType: 'image',
			sort: 'createdAt ASC',
		});

		expect(result).toHaveLength(2);
		expectAuthenticated();
		const sent = lastRequest();
		expect(sent.path).toBe('/v1/files');
		expect(sent.query.path).toBe('/products/');
		expect(sent.query.limit).toBe('25');
		expect(sent.query.skip).toBe('25');
		expect(sent.query.fileType).toBe('image');
	});

	it('does not parse an error body as an empty page', async () => {
		respond(fileNotFound, 404);
		await expect(invoke(Files.list, {})).rejects.toThrow();
	});

	it('parses a folder entry', async () => {
		respond([folder]);
		const result = await invoke<unknown[]>(Files.list, {});
		expect(result[0]).toMatchObject({ folderId: folder.folderId });
	});
});

describe('files.getDetails and files.updateDetails', () => {
	it('GETs details by ID', async () => {
		respond(file);

		const result = await invoke<{ fileId: string; tags?: string[] }>(
			Files.getDetails,
			{
				fileId: file.fileId,
			},
		);

		expect(result.fileId).toBe(file.fileId);
		expect(result.tags).toEqual(['summer', 'sale']);
		expectAuthenticated();
		expect(lastRequest().path).toBe(`/v1/files/${file.fileId}/details`);
	});

	it('PATCHes details with a replacement tag list', async () => {
		respond(file);

		await invoke(Files.updateDetails, {
			fileId: file.fileId,
			tags: ['spring'],
			isPublished: false,
		});

		expectAuthenticated();
		const sent = lastRequest();
		expect(sent.method).toBe('PATCH');
		expect(sent.path).toBe(`/v1/files/${file.fileId}/details`);
		expect(sent.body).toEqual({ tags: ['spring'], isPublished: false });
	});

	it('rejects details without a fileId', async () => {
		await expect(invoke(Files.getDetails, {})).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('files.delete and files.bulkDelete', () => {
	it('DELETEs a file and parses the empty 204', async () => {
		respondEmpty(204);

		await invoke(Files.delete, { fileId: file.fileId });

		expectAuthenticated();
		const sent = lastRequest();
		expect(sent.method).toBe('DELETE');
		expect(sent.path).toBe(`/v1/files/${file.fileId}`);
	});

	it('rejects a 404 on delete', async () => {
		respond(fileNotFound, 404);
		await expect(invoke(Files.delete, { fileId: 'nope' })).rejects.toThrow();
	});

	it('parses a bulk delete answer', async () => {
		respond(bulkDeleted);

		const result = await invoke<{ successfullyDeletedFileIds: string[] }>(
			Files.bulkDelete,
			{
				fileIds: [file.fileId, '598821f949c0a938d57563be'],
			},
		);

		expect(result.successfullyDeletedFileIds).toHaveLength(2);
		expectAuthenticated();
		expect(lastRequest().body).toEqual({
			fileIds: [file.fileId, '598821f949c0a938d57563be'],
		});
	});

	it('rejects a bulk delete answer without the id list', async () => {
		respond({ somethingElse: true }, 200);
		await expect(
			invoke(Files.bulkDelete, { fileIds: [file.fileId] }),
		).rejects.toThrow();
	});
});

describe('files.copy, files.move and files.rename', () => {
	it('POSTs a copy with source and destination', async () => {
		respondEmpty(204);

		await invoke(Files.copy, {
			sourceFilePath: '/products/photo.jpg',
			destinationPath: '/archive/',
		});

		const sent = lastRequest();
		expect(sent.path).toBe('/v1/files/copy');
		expect(sent.body).toEqual({
			sourceFilePath: '/products/photo.jpg',
			destinationPath: '/archive/',
			includeFileVersions: undefined,
		});
	});

	it('POSTs a move', async () => {
		respondEmpty(204);

		await invoke(Files.move, {
			sourceFilePath: '/products/photo.jpg',
			destinationPath: '/archive/',
		});

		const sent = lastRequest();
		expect(sent.path).toBe('/v1/files/move');
		expect(sent.body).toEqual({
			sourceFilePath: '/products/photo.jpg',
			destinationPath: '/archive/',
		});
	});

	it('PUTs a rename and parses the purge request id', async () => {
		respond(renamedWithPurge);

		const result = await invoke<{ purgeRequestId?: string | null }>(
			Files.rename,
			{
				filePath: '/products/old.jpg',
				newFileName: 'new.jpg',
				purgeCache: true,
			},
		);

		expect(result.purgeRequestId).toBe(renamedWithPurge.purgeRequestId);
		const sent = lastRequest();
		expect(sent.method).toBe('PUT');
		expect(sent.path).toBe('/v1/files/rename');
	});

	it('parses a rename whose purge failed, a 207', async () => {
		respond(renamedPurgeFailed);

		const result = await invoke<{
			reason?: string | null;
			message?: string | null;
		}>(Files.rename, {
			filePath: '/products/old.jpg',
			newFileName: 'new.jpg',
		});

		expect(result.reason).toBe('PURGE_FAILED');
		expect(result.message).toContain('renamed');
	});
});

describe('bulk tags', () => {
	it.each([
		['addTags', '/v1/files/addTags', 'tags'],
		['removeTags', '/v1/files/removeTags', 'tags'],
		['removeAITags', '/v1/files/removeAITags', 'AITags'],
	])('%s posts to %s with the %s field', async (fn, path, field) => {
		respond(bulkUpdated);

		const endpoint =
			fn === 'addTags'
				? Files.addTags
				: fn === 'removeTags'
					? Files.removeTags
					: Files.removeAITags;
		const tagArg =
			field === 'tags' ? { tags: ['summer'] } : { AITags: ['product'] };

		const result = await invoke<{ successfullyUpdatedFileIds: string[] }>(
			endpoint,
			{
				fileIds: [file.fileId],
				...tagArg,
			},
		);

		expect(result.successfullyUpdatedFileIds).toEqual([file.fileId]);
		expectAuthenticated();
		const sent = lastRequest();
		expect(sent.path).toBe(path);
		expect(sent.body).toEqual({ fileIds: [file.fileId], ...tagArg });
	});

	it('parses a 207 partial success with per-file errors', async () => {
		respond(bulkPartiallyUpdated, 207);

		const result = await invoke<{
			successfullyUpdatedFileIds: string[];
			errors?: { fileId: string; error: string }[];
		}>(Files.addTags, {
			fileIds: [file.fileId, '598821f949c0a938d57563be'],
			tags: ['summer'],
		});

		expect(result.successfullyUpdatedFileIds).toEqual([file.fileId]);
		expect(result.errors?.[0]).toEqual({
			fileId: '598821f949c0a938d57563be',
			error: 'No file found.',
		});
	});

	it('rejects more than 50 fileIds without calling the API', async () => {
		const ids = Array.from({ length: 51 }, (_, i) => `id-${i}`);
		await expect(
			invoke(Files.addTags, { fileIds: ids, tags: ['summer'] }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('file versions', () => {
	it('lists versions as a bare array', async () => {
		respond([file]);

		const result = await invoke<unknown[]>(FileVersions.list, {
			fileId: file.fileId,
		});

		expect(result).toHaveLength(1);
		expectAuthenticated();
		expect(lastRequest().path).toBe(`/v1/files/${file.fileId}/versions`);
	});

	it('reads one version', async () => {
		respond(file);

		const result = await invoke<{ fileId: string }>(FileVersions.getDetails, {
			fileId: file.fileId,
			versionId: '598821f949c0a938d57563bf',
		});

		expect(result.fileId).toBe(file.fileId);
		expect(lastRequest().path).toBe(
			`/v1/files/${file.fileId}/versions/598821f949c0a938d57563bf`,
		);
	});

	it('deletes a version and parses the empty 204', async () => {
		respondEmpty(204);

		await invoke(FileVersions.delete, {
			fileId: file.fileId,
			versionId: '598821f949c0a938d57563bf',
		});

		const sent = lastRequest();
		expect(sent.method).toBe('DELETE');
	});

	it('restores a version and parses the file', async () => {
		respond(file);

		const result = await invoke<{ fileId: string }>(FileVersions.restore, {
			fileId: file.fileId,
			versionId: '598821f949c0a938d57563bf',
		});

		expect(result.fileId).toBe(file.fileId);
		expect(lastRequest().path).toContain('/restore');
	});
});

describe('metadata', () => {
	it('reads metadata by fileId', async () => {
		respond(metadata);

		const result = await invoke<{ width?: number; format?: string }>(
			Metadata.getByFileId,
			{
				fileId: file.fileId,
			},
		);

		expect(result.width).toBe(1200);
		expect(result.format).toBe('jpeg');
		expect(lastRequest().path).toBe(`/v1/files/${file.fileId}/metadata`);
	});

	it('reads metadata by URL with a query parameter', async () => {
		respond(metadata);

		await invoke(Metadata.getByUrl, {
			url: 'https://ik.imagekit.io/your_imagekit_id/photo.jpg?tr=w-200',
		});

		const sent = lastRequest();
		expect(sent.path).toBe('/v1/metadata');
		expect(sent.query.url).toBe(
			'https://ik.imagekit.io/your_imagekit_id/photo.jpg?tr=w-200',
		);
	});

	it('rejects a malformed metadata answer', async () => {
		respond({ width: 'wide' }, 200);
		await expect(
			invoke(Metadata.getByFileId, { fileId: file.fileId }),
		).rejects.toThrow();
	});
});

describe('folders', () => {
	it('creates a folder', async () => {
		respondEmpty(201);

		await invoke(Folders.create, {
			folderName: 'spring',
			parentFolderPath: '/products/',
		});

		const sent = lastRequest();
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe('/v1/folder');
		expect(sent.body).toEqual({
			folderName: 'spring',
			parentFolderPath: '/products/',
		});
	});

	it('deletes a folder', async () => {
		respondEmpty(204);

		await invoke(Folders.delete, { folderPath: '/products/spring/' });

		const sent = lastRequest();
		expect(sent.method).toBe('DELETE');
		expect(sent.body).toEqual({ folderPath: '/products/spring/' });
	});

	it.each([
		['copy', '/v1/bulkJobs/copyFolder'],
		['move', '/v1/bulkJobs/moveFolder'],
	])('%s submits a bulk job and returns its jobId', async (fn, path) => {
		respond(bulkJob);

		const endpoint = fn === 'copy' ? Folders.copy : Folders.move;

		const result = await invoke<{ jobId: string }>(endpoint, {
			sourceFolderPath: '/products/spring',
			destinationPath: '/archive/',
		});

		expect(result.jobId).toBe(bulkJob.jobId);
		expectAuthenticated();
		expect(lastRequest().path).toBe(path);
	});

	it('renames a folder as a job', async () => {
		respond(bulkJob);

		const result = await invoke<{ jobId: string }>(Folders.rename, {
			folderPath: '/products/spring',
			newFolderName: 'summer',
		});

		expect(result.jobId).toBe(bulkJob.jobId);
		expect(lastRequest().path).toBe('/v1/bulkJobs/renameFolder');
	});

	it('reads the job status', async () => {
		respond(bulkJobCompleted);

		const result = await invoke<{ status: string }>(Folders.getJobStatus, {
			jobId: bulkJob.jobId,
		});

		expect(result.status).toBe('Completed');
		expect(lastRequest().path).toBe(`/v1/bulkJobs/${bulkJob.jobId}`);
	});

	it('rejects a job status without a status field', async () => {
		respond({ jobId: bulkJob.jobId }, 200);
		await expect(
			invoke(Folders.getJobStatus, { jobId: bulkJob.jobId }),
		).rejects.toThrow();
	});
});

describe('cache', () => {
	it('purges a URL and returns the requestId', async () => {
		respond(purgeAccepted, 201);

		const result = await invoke<{ requestId: string }>(Cache.purge, {
			url: 'https://ik.imagekit.io/your_imagekit_id/photo.jpg',
		});

		expect(result.requestId).toBe(purgeAccepted.requestId);
		expectAuthenticated();
		const sent = lastRequest();
		expect(sent.path).toBe('/v1/files/purge');
		expect(sent.body).toEqual({
			url: 'https://ik.imagekit.io/your_imagekit_id/photo.jpg',
		});
	});

	it('reads the purge status', async () => {
		respond(purgeCompleted);

		const result = await invoke<{ status: string }>(Cache.getPurgeStatus, {
			requestId: purgeAccepted.requestId,
		});

		expect(result.status).toBe('Completed');
		expect(lastRequest().path).toBe(
			`/v1/files/purge/${purgeAccepted.requestId}`,
		);
	});

	it('rejects a purge without a url', async () => {
		await expect(invoke(Cache.purge, {})).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('error transport', () => {
	it('surfaces a 503 as an ImageKitAPIError without parsing it as output', async () => {
		respond(serverError, 503);
		await expect(
			invoke(Files.getDetails, { fileId: file.fileId }),
		).rejects.toMatchObject({ status: 503 });
	});
});
