import { AssetsEndpoints, VideosEndpoints } from './endpoints';
import { createdVideoUrl } from './test-fixtures';
import { captureError, invoke } from './test-helpers';

// The real resolveFileInput, with its download served from mockLinks instead
// of the network: the guarded fetch, size cap and naming all still run.
jest.mock('corsair/http', () => {
	const actual = jest.requireActual(
		'corsair/http',
	) as typeof import('corsair/http');
	return {
		...actual,
		resolveFileInput: (
			input: Parameters<typeof actual.resolveFileInput>[0],
			options: Parameters<typeof actual.resolveFileInput>[1],
			deps?: Parameters<typeof actual.resolveFileInput>[2],
		) => actual.resolveFileInput(input, options, deps ?? mockLinks.deps),
	};
});

const mockLinks = {
	served: new Map<string, { body: Uint8Array; type: string }>(),
	deps: {
		resolve: async () => ['93.184.216.34'],
		transport: async (url: URL) => {
			const file = mockLinks.served.get(url.toString());
			return {
				status: file ? 200 : 404,
				headers: file ? { 'content-type': file.type } : {},
				body: (async function* () {
					if (file) yield file.body;
				})(),
			};
		},
	},
};

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON; each test passes its own.
function respond(body: unknown) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

function sentForm(): FormData {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	expect(new URL(url).origin).toBe('https://api.spotlightr.com');
	expect(init.body).toBeInstanceOf(FormData);
	return init.body as FormData;
}

const MP4 = new Uint8Array([0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70]);
const PNG = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLinks.served.clear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('videos.create file input', () => {
	it('downloads a link and uploads it as the file part with its name and type', async () => {
		mockLinks.served.set('https://files.example.com/clips/intro.mp4', {
			body: MP4,
			type: 'video/mp4',
		});
		respond(createdVideoUrl);

		await invoke(VideosEndpoints.create, {
			name: 'Intro',
			file: 'https://files.example.com/clips/intro.mp4',
		});

		const form = sentForm();
		const file = form.get('file') as File;
		expect(file).toBeInstanceOf(File);
		expect(file.name).toBe('intro.mp4');
		expect(file.type).toBe('video/mp4');
		expect(new Uint8Array(await file.arrayBuffer())).toEqual(MP4);
		expect(form.get('name')).toBe('Intro');
		expect(form.get('URL')).toBeNull();
	});

	it('decodes {base64, filename, contentType} into the file part', async () => {
		respond(createdVideoUrl);

		await invoke(VideosEndpoints.create, {
			name: 'Intro',
			file: {
				base64: Buffer.from(MP4).toString('base64'),
				filename: 'intro.mp4',
				contentType: 'video/mp4',
			},
		});

		const file = sentForm().get('file') as File;
		expect(file.name).toBe('intro.mp4');
		expect(file.type).toBe('video/mp4');
		expect(new Uint8Array(await file.arrayBuffer())).toEqual(MP4);
	});

	it('still sends a Blob as it was given', async () => {
		respond(createdVideoUrl);
		const blob = new Blob([MP4], { type: 'video/mp4' });

		await invoke(VideosEndpoints.create, { name: 'Intro', file: blob });

		const file = sentForm().get('file') as Blob;
		expect(file.type).toBe('video/mp4');
		expect(new Uint8Array(await file.arrayBuffer())).toEqual(MP4);
	});

	it('does not fetch a linked file when a url is given, since Spotlightr uses the url', async () => {
		respond(createdVideoUrl);

		await invoke(VideosEndpoints.create, {
			name: 'Intro',
			url: 'https://www.youtube.com/watch?v=abc',
			file: 'https://files.example.com/never-fetched.mp4',
		});

		const form = sentForm();
		expect(form.get('URL')).toBe('https://www.youtube.com/watch?v=abc');
		expect(form.get('file')).toBeNull();
	});

	it('refuses a private address before any request to Spotlightr', async () => {
		const error = await captureError(
			invoke(VideosEndpoints.create, {
				name: 'Intro',
				file: 'https://127.0.0.1/intro.mp4',
			}),
		);

		expect((error as Error).message).toMatch(/file URL/);
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('assets.upload file input', () => {
	it('downloads a link and uploads it as the file part with its name and type', async () => {
		mockLinks.served.set('https://files.example.com/logo.png', {
			body: PNG,
			type: 'image/png',
		});
		respond('https://cdn.spotlightr.com/asset.png');

		await invoke(AssetsEndpoints.upload, {
			file: 'https://files.example.com/logo.png',
		});

		const file = sentForm().get('file') as File;
		expect(file).toBeInstanceOf(File);
		expect(file.name).toBe('logo.png');
		expect(file.type).toBe('image/png');
		expect(new Uint8Array(await file.arrayBuffer())).toEqual(PNG);
	});

	it('decodes {base64, filename, contentType} into the file part', async () => {
		respond('https://cdn.spotlightr.com/asset.png');

		await invoke(AssetsEndpoints.upload, {
			file: {
				base64: Buffer.from(PNG).toString('base64'),
				filename: 'logo.png',
				contentType: 'image/png',
			},
		});

		const file = sentForm().get('file') as File;
		expect(file.name).toBe('logo.png');
		expect(file.type).toBe('image/png');
		expect(new Uint8Array(await file.arrayBuffer())).toEqual(PNG);
	});

	it('still sends a Blob as it was given', async () => {
		respond('https://cdn.spotlightr.com/asset.png');
		const blob = new Blob([PNG], { type: 'image/png' });

		await invoke(AssetsEndpoints.upload, { file: blob });

		const file = sentForm().get('file') as Blob;
		expect(file.type).toBe('image/png');
		expect(new Uint8Array(await file.arrayBuffer())).toEqual(PNG);
	});

	it('refuses a private address before any request to Spotlightr', async () => {
		const error = await captureError(
			invoke(AssetsEndpoints.upload, {
				file: 'http://169.254.169.254/latest/meta-data/',
			}),
		);

		expect((error as Error).message).toMatch(/file URL/);
		expect(fetchMock).not.toHaveBeenCalled();
	});
});
