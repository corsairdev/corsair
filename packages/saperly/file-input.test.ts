import { makeSaperlyRequest } from './client';
import { Voices } from './endpoints';
import { CreateCustomVoiceInputSchema } from './endpoints/types';
import type { SaperlyContext } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(undefined),
}));
jest.mock('./client', () => ({
	...jest.requireActual('./client'),
	makeSaperlyRequest: jest.fn(),
}));
// The real resolveFileInput, with links served from memory instead of the network.
jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return {
		...actual,
		resolveFileInput: (input: unknown, options: unknown, deps?: unknown) =>
			actual.resolveFileInput(input, options, deps ?? mockLinks.deps),
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

const mockRequest = jest.mocked(makeSaperlyRequest);
const ctx = { key: 'x_key_test', options: {} } as SaperlyContext;

// A WAV header, then a byte that is not valid UTF-8.
const WAV = new Uint8Array([
	0x52, 0x49, 0x46, 0x46, 0x24, 0x00, 0x00, 0x00, 0xff,
]);
const fields = {
	name: 'Mine',
	language: 'en',
	gender: 'neutral' as const,
	idempotencyKey: 'upload-1',
};

/** The multipart fields of the last upload. */
function sent(): Record<string, unknown> {
	const options = mockRequest.mock.calls.at(-1)?.[2] as {
		formData?: Record<string, unknown>;
	};
	if (!options?.formData) throw new Error('No multipart upload was sent');
	return options.formData;
}

describe('Saperly custom voice upload takes a link, base64 or a Blob', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue({
			id: 'cv_1',
			name: 'Mine',
			language: 'en',
			gender: 'neutral',
			status: 'pending',
			failureReason: null,
			createdAt: '2026-01-01T00:00:00.000Z',
			updatedAt: '2026-01-01T00:00:00.000Z',
		});
		mockLinks.served.clear();
	});

	it('downloads a link and sends it as the audio part', async () => {
		mockLinks.served.set('https://files.example.com/samples/me.wav', {
			body: WAV,
			type: 'audio/wav',
		});
		await Voices.createCustom(ctx, {
			...fields,
			audio: 'https://files.example.com/samples/me.wav',
		});
		expect(mockRequest.mock.calls.at(-1)?.[0]).toBe('/custom-voices');
		const { audio, ...rest } = sent();
		expect(rest).toEqual({ name: 'Mine', language: 'en', gender: 'neutral' });
		expect(audio).toBeInstanceOf(File);
		const file = audio as File;
		expect(file.name).toBe('me.wav');
		expect(file.type).toBe('audio/wav');
		expect(new Uint8Array(await file.arrayBuffer())).toEqual(WAV);
	});

	it('takes {url, filename, contentType} and names the part from it', async () => {
		mockLinks.served.set('https://files.example.com/get?id=9', {
			body: WAV,
			type: 'application/octet-stream',
		});
		await Voices.createCustom(ctx, {
			...fields,
			audio: {
				url: 'https://files.example.com/get?id=9',
				filename: 'sample.wav',
				contentType: 'audio/wav',
			},
		});
		const file = sent().audio as File;
		expect(file.name).toBe('sample.wav');
		expect(file.type).toBe('audio/wav');
	});

	it('decodes {base64, filename, contentType} into the audio part', async () => {
		await Voices.createCustom(ctx, {
			...fields,
			audio: {
				base64: Buffer.from(WAV).toString('base64'),
				filename: 'me.wav',
				contentType: 'audio/wav',
			},
		});
		const file = sent().audio as File;
		expect(file).toBeInstanceOf(File);
		expect(file.name).toBe('me.wav');
		expect(file.type).toBe('audio/wav');
		expect(new Uint8Array(await file.arrayBuffer())).toEqual(WAV);
	});

	it('still sends a Blob exactly as given', async () => {
		const audio = new Blob([WAV], { type: 'audio/wav' });
		await Voices.createCustom(ctx, { ...fields, audio });
		expect(sent().audio).toBe(audio);
	});

	it('refuses a private address before any Saperly request', async () => {
		for (const audio of [
			'https://127.0.0.1/x.wav',
			'http://169.254.169.254/latest/meta-data/',
			'file:///etc/passwd',
		]) {
			await expect(
				Voices.createCustom(ctx, { ...fields, audio }),
			).rejects.toThrow(/file URL/);
		}
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('accepts the file forms in the input schema and refuses other values', () => {
		for (const audio of [
			'https://files.example.com/a.wav',
			'fil_abc123',
			{ url: 'https://files.example.com/a.wav' },
			{ base64: 'UklGRg==', contentType: 'audio/wav' },
			new Blob(['a']),
		]) {
			expect(
				CreateCustomVoiceInputSchema.safeParse({ ...fields, audio }).success,
			).toBe(true);
		}
		for (const audio of [undefined, '', 42, { path: '/tmp/a.wav' }]) {
			expect(
				CreateCustomVoiceInputSchema.safeParse({ ...fields, audio }).success,
			).toBe(false);
		}
	});
});
