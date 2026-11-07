import { ImageKitAPIError, makeImageKitRequest, segment } from './client';
import { file, fileNotFound, sourceFileMissing } from './test-fixtures';

const API_KEY = 'private-ik-test-key';

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON or text.
function respond(
	body: unknown,
	status: number,
	headers: Record<string, string> = {},
) {
	fetchMock.mockResolvedValueOnce(
		new Response(typeof body === 'string' ? body : JSON.stringify(body), {
			status,
			headers: {
				'Content-Type':
					typeof body === 'string' ? 'text/plain' : 'application/json',
				...headers,
			},
		}),
	);
}

function respondEmpty(status: number) {
	fetchMock.mockResolvedValueOnce(new Response(null, { status }));
}

// unknown: a rejection can be any value until the instanceof check narrows it.
async function failure(promise: Promise<unknown>): Promise<ImageKitAPIError> {
	const error = await promise.catch((e: unknown) => e);
	expect(error).toBeInstanceOf(ImageKitAPIError);
	if (!(error instanceof ImageKitAPIError)) throw error;
	return error;
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('makeImageKitRequest', () => {
	it('authenticates with Basic base64(key + colon)', async () => {
		respond([file], 200);

		const result = await makeImageKitRequest(API_KEY, {
			method: 'GET',
			path: '/v1/files',
			query: { limit: 25, skip: undefined },
		});

		expect(result).toEqual([file]);
		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe('https://api.imagekit.io/v1/files?limit=25');
		expect(init.method).toBe('GET');
		const headers = new Headers(init.headers);
		expect(headers.get('authorization')).toBe(
			`Basic ${Buffer.from(`${API_KEY}:`).toString('base64')}`,
		);
	});

	it('does not leak the key when the request has no key', async () => {
		respond({ message: 'missing' }, 200);
		await makeImageKitRequest('', { method: 'GET', path: '/v1/files' });
		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(new Headers(init.headers).get('authorization')).toBe(
			`Basic ${Buffer.from(':').toString('base64')}`,
		);
	});

	it('POSTs a JSON body with a JSON content type', async () => {
		respond({ requestId: 'req-1' }, 201);

		await makeImageKitRequest(API_KEY, {
			method: 'POST',
			path: '/v1/files/purge',
			body: { url: 'https://ik.imagekit.io/your_imagekit_id/photo.jpg' },
		});

		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(new Headers(init.headers).get('content-type')).toBe(
			'application/json',
		);
		expect(JSON.parse(String(init.body))).toEqual({
			url: 'https://ik.imagekit.io/your_imagekit_id/photo.jpg',
		});
	});

	it('sends multipart fields with a multipart content type', async () => {
		respond({}, 200);

		await makeImageKitRequest(API_KEY, {
			method: 'POST',
			path: '/api/v1/files/upload',
			formData: {
				file: 'https://example.com/photo.jpg',
				fileName: 'photo.jpg',
			},
		});

		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(init.body).toBeInstanceOf(FormData);
		const form = init.body as FormData;
		expect(form.get('file')).toBe('https://example.com/photo.jpg');
		expect(form.get('fileName')).toBe('photo.jpg');
	});

	it('carries replaySafe onto the thrown error', async () => {
		respond({ message: 'boom' }, 503);

		const error = await failure(
			makeImageKitRequest(API_KEY, {
				method: 'GET',
				path: '/v1/files',
				replaySafe: true,
			}),
		);
		expect(error.replaySafe).toBe(true);
		expect(error.status).toBe(503);

		respond({ message: 'boom' }, 503);
		const writeError = await failure(
			makeImageKitRequest(API_KEY, {
				method: 'DELETE',
				path: '/v1/files/abc',
			}),
		);
		expect(writeError.replaySafe).toBe(false);
	});

	it('reads message, reason and help from a `{ message, help }` error body', async () => {
		respond(fileNotFound, 404);

		const error = await failure(
			makeImageKitRequest(API_KEY, {
				method: 'GET',
				path: '/v1/files/abc/details',
			}),
		);
		expect(error.status).toBe(404);
		expect(error.code).toBeUndefined();
		expect(error.message).toContain('ImageKit 404');
		expect(error.message).toContain('does not exist');
		expect(error.message).toContain('support@imagekit.io');
	});

	it('reads the reason slug of a `{ reason, message }` error body', async () => {
		respond(sourceFileMissing, 404);

		const error = await failure(
			makeImageKitRequest(API_KEY, {
				method: 'POST',
				path: '/v1/files/copy',
				body: { sourceFilePath: '/a.jpg', destinationPath: '/b/' },
			}),
		);
		expect(error.status).toBe(404);
		expect(error.code).toBe('SOURCE_FILE_MISSING');
	});

	it('does not include the key in any error surface', async () => {
		respond(fileNotFound, 404);

		const error = await failure(
			makeImageKitRequest(API_KEY, {
				method: 'GET',
				path: '/v1/files/abc/details',
			}),
		);
		expect(error.message).not.toContain(API_KEY);
		expect(JSON.stringify(error)).not.toContain(API_KEY);
		expect(JSON.stringify(error.cause)).not.toContain(API_KEY);
	});

	it('percent-encodes path segments', () => {
		expect(segment('/weird/name.jpg')).toBe('%2Fweird%2Fname.jpg');
		expect(segment('plain-id')).toBe('plain-id');
	});
});
