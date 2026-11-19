import { createTranscription, createTranslation } from './endpoints/audio';
import { createFile } from './endpoints/containers';
import { upload } from './endpoints/files';
import { createEdit, createVariation } from './endpoints/images';
import { create as createSkill } from './endpoints/skills';
import { addPart } from './endpoints/uploads';
import { create as createVideo } from './endpoints/videos';
import type { OpenaiContext } from './index';
import { FilesUploadInputSchema } from './schema/files';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(),
}));

// The real resolveFileInput, with a resolver and transport that serve the
// links below instead of opening a socket. Redirect, size and address checks
// are core's own.
jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return {
		...actual,
		resolveFileInput: (input: unknown, options: unknown, deps?: unknown) =>
			actual.resolveFileInput(input, options, deps ?? mockLinks.deps),
	};
});

type Served = { body: Uint8Array; type: string; length?: number };

const mockLinks = {
	served: new Map<string, Served>(),
	fetched: [] as string[],
	deps: {
		resolve: async () => ['93.184.216.34'],
		transport: async (url: URL) => {
			mockLinks.fetched.push(url.toString());
			const file = mockLinks.served.get(url.toString());
			return {
				status: file ? 200 : 404,
				headers: file
					? {
							'content-type': file.type,
							'content-length': String(file.length ?? file.body.byteLength),
						}
					: {},
				body: (async function* () {
					if (file) yield file.body;
				})(),
			};
		},
	},
};

const BYTES = new Uint8Array([0x49, 0x44, 0x33, 0x04, 0x00, 0xff, 0xfe]);
const LINK = 'https://files.example.com/fil_abc123/clip.bin';

const originalFetch = global.fetch;
const sent: Array<{ url: string; body: FormData }> = [];

// unknown: the endpoints read only ctx.key here, not a full plugin context.
const ctx = { key: 'test-key' } as unknown as OpenaiContext;

beforeEach(() => {
	mockLinks.served.clear();
	mockLinks.fetched.length = 0;
	sent.length = 0;
	global.fetch = (async (url: unknown, init?: RequestInit) => {
		sent.push({ url: String(url), body: init?.body as FormData });
		return new Response(JSON.stringify({ id: 'ok', text: 'ok' }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	}) as unknown as typeof fetch;
});

afterEach(() => {
	global.fetch = originalFetch;
});

/** The part OpenAI received, with its bytes read out. */
async function part(field: string) {
	const body = sent.at(-1)?.body;
	expect(body).toBeInstanceOf(FormData);
	const value = body?.get(field);
	expect(value).toBeInstanceOf(File);
	const file = value as File;
	return {
		name: file.name,
		type: file.type,
		bytes: new Uint8Array(await file.arrayBuffer()),
	};
}

// unknown: each endpoint is called with a file input in its own field; the
// table below names the field, the multipart part and the URL path.
type Call = (file: unknown) => Promise<unknown>;

const operations: Array<{
	name: string;
	path: string;
	field: string;
	fileName: string;
	call: Call;
}> = [
	{
		name: 'files.upload',
		path: '/v1/files',
		field: 'file',
		fileName: 'batch.jsonl',
		call: (file) =>
			upload(ctx, {
				file,
				fileName: 'batch.jsonl',
				purpose: 'batch',
			} as Parameters<typeof upload>[1]),
	},
	{
		name: 'audio.createTranscription',
		path: '/v1/audio/transcriptions',
		field: 'file',
		fileName: 'call.mp3',
		call: (file) =>
			createTranscription(ctx, {
				file,
				fileName: 'call.mp3',
				model: 'whisper-1',
			} as Parameters<typeof createTranscription>[1]),
	},
	{
		name: 'audio.createTranslation',
		path: '/v1/audio/translations',
		field: 'file',
		fileName: 'call.mp3',
		call: (file) =>
			createTranslation(ctx, {
				file,
				fileName: 'call.mp3',
				model: 'whisper-1',
			} as Parameters<typeof createTranslation>[1]),
	},
	{
		name: 'images.createEdit (image)',
		path: '/v1/images/edits',
		field: 'image',
		fileName: 'photo.png',
		call: (file) =>
			createEdit(ctx, {
				image: file,
				imageFileName: 'photo.png',
				prompt: 'make it blue',
			} as Parameters<typeof createEdit>[1]),
	},
	{
		name: 'images.createEdit (mask)',
		path: '/v1/images/edits',
		field: 'mask',
		fileName: 'mask.png',
		call: (file) =>
			createEdit(ctx, {
				image: new Blob(['image']),
				imageFileName: 'photo.png',
				mask: file,
				maskFileName: 'mask.png',
				prompt: 'make it blue',
			} as Parameters<typeof createEdit>[1]),
	},
	{
		name: 'images.createVariation',
		path: '/v1/images/variations',
		field: 'image',
		fileName: 'photo.png',
		call: (file) =>
			createVariation(ctx, {
				image: file,
				imageFileName: 'photo.png',
			} as Parameters<typeof createVariation>[1]),
	},
	{
		name: 'containerFiles.create',
		path: '/v1/containers/ctr_1/files',
		field: 'file',
		fileName: 'data.csv',
		call: (file) =>
			createFile(ctx, {
				containerId: 'ctr_1',
				file,
				fileName: 'data.csv',
			} as Parameters<typeof createFile>[1]),
	},
	{
		name: 'uploads.addPart',
		path: '/v1/uploads/upload_1/parts',
		field: 'data',
		fileName: 'part-1',
		call: (file) =>
			addPart(ctx, {
				uploadId: 'upload_1',
				data: file,
				fileName: 'part-1',
			} as Parameters<typeof addPart>[1]),
	},
	{
		name: 'skills.create',
		path: '/v1/skills',
		field: 'files',
		fileName: 'skill.zip',
		call: (file) =>
			createSkill(ctx, {
				file,
				fileName: 'skill.zip',
			} as Parameters<typeof createSkill>[1]),
	},
	{
		name: 'videos.create',
		path: '/v1/videos',
		field: 'input_reference',
		fileName: 'first-frame.png',
		call: (file) =>
			createVideo(ctx, {
				prompt: 'a cat walking',
				inputReference: file,
				inputReferenceFileName: 'first-frame.png',
			} as Parameters<typeof createVideo>[1]),
	},
];

describe.each(operations)('$name', ({ path, field, fileName, call }) => {
	it('downloads a link and sends its bytes as the part, with its type', async () => {
		mockLinks.served.set(LINK, { body: BYTES, type: 'audio/mpeg' });
		await call(LINK);

		expect(mockLinks.fetched).toEqual([LINK]);
		expect(sent).toHaveLength(1);
		expect(new URL(sent[0]!.url).pathname).toBe(path);
		const got = await part(field);
		expect(got.name).toBe(fileName);
		expect(got.type).toBe('audio/mpeg');
		expect(got.bytes).toEqual(BYTES);
	});

	it('takes {url, contentType}, where the given type wins', async () => {
		mockLinks.served.set(LINK, {
			body: BYTES,
			type: 'application/octet-stream',
		});
		await call({ url: LINK, contentType: 'image/png' });

		const got = await part(field);
		expect(got.type).toBe('image/png');
		expect(got.bytes).toEqual(BYTES);
	});

	it('decodes {base64, filename, contentType}', async () => {
		await call({
			base64: Buffer.from(BYTES).toString('base64'),
			filename: 'ignored.bin',
			contentType: 'image/webp',
		});

		expect(mockLinks.fetched).toEqual([]);
		const got = await part(field);
		// The part keeps the endpoint's own file name field.
		expect(got.name).toBe(fileName);
		expect(got.type).toBe('image/webp');
		expect(got.bytes).toEqual(BYTES);
	});

	it('still sends a Blob as it was given', async () => {
		await call(new Blob([BYTES], { type: 'audio/wav' }));

		expect(mockLinks.fetched).toEqual([]);
		const got = await part(field);
		expect(got.name).toBe(fileName);
		expect(got.type).toBe('audio/wav');
		expect(got.bytes).toEqual(BYTES);
	});

	it('still sends any other string as the file text', async () => {
		await call('{"custom_id":"1"}\n');

		expect(mockLinks.fetched).toEqual([]);
		const got = await part(field);
		expect(new TextDecoder().decode(got.bytes)).toBe('{"custom_id":"1"}\n');
	});

	it('refuses a private address before calling OpenAI', async () => {
		await expect(call('https://127.0.0.1/clip.mp3')).rejects.toThrow(
			/file URL|public|private|not allowed/i,
		);
		await expect(
			call({ url: 'http://169.254.169.254/latest/meta-data/' }),
		).rejects.toThrow();
		expect(sent).toHaveLength(0);
	});
});

describe('OpenAI upload limits', () => {
	it('holds a link to the endpoint limit: a variation image over 4 MB is refused unread', async () => {
		mockLinks.served.set(LINK, {
			body: BYTES,
			type: 'image/png',
			length: 4 * 1024 * 1024 + 1,
		});
		await expect(
			createVariation(ctx, { image: LINK, imageFileName: 'photo.png' }),
		).rejects.toThrow(/4 MB limit/);
		expect(sent).toHaveLength(0);
	});

	it('lets the same link through files.upload, whose limit is 512 MB', async () => {
		mockLinks.served.set(LINK, {
			body: BYTES,
			type: 'image/png',
			length: 4 * 1024 * 1024 + 1,
		});
		await upload(ctx, { file: LINK, fileName: 'a.png', purpose: 'vision' });
		expect(mockLinks.fetched).toEqual([LINK]);
		expect(sent).toHaveLength(1);
		expect((await part('file')).bytes).toEqual(BYTES);
	});

	it('holds base64 to the limit too: an audio file over 25 MB is refused', async () => {
		const tooBig = Buffer.alloc(25 * 1024 * 1024 + 3).toString('base64');
		await expect(
			createTranscription(ctx, {
				file: { base64: tooBig },
				fileName: 'long.mp3',
				model: 'whisper-1',
			}),
		).rejects.toThrow(/25 MB limit/);
		expect(sent).toHaveLength(0);
	});
});

describe('OpenAI file input schema', () => {
	const parse = (file: unknown) =>
		FilesUploadInputSchema.safeParse({
			file,
			fileName: 'a.jsonl',
			purpose: 'batch',
		}).success;

	it('accepts a link, {url}, {base64}, a Blob and a text string', () => {
		expect(parse(LINK)).toBe(true);
		expect(parse({ url: LINK, filename: 'a.jsonl' })).toBe(true);
		expect(parse({ base64: 'aGVsbG8=', contentType: 'text/plain' })).toBe(true);
		expect(parse(new Blob(['x']))).toBe(true);
		expect(parse('{"a":1}')).toBe(true);
	});

	it('refuses an empty string, a number and an unknown object', () => {
		expect(parse('')).toBe(false);
		expect(parse(42)).toBe(false);
		expect(parse({ path: '/tmp/a.jsonl' })).toBe(false);
	});
});
