import { request } from 'corsair/http';
import { gongEndpointSchemas } from '../index';
import { addCallRecording } from './calls';
import { uploadCrmObjects } from './crm';
import { uploadAssignments } from './targets';

// The real resolveFileInput, with links served from memory instead of the network.
jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return {
		...actual,
		request: jest.fn(),
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

const mockedRequest = jest.mocked(request);
const ctx = {
	key: 'access-key:secret',
	options: { authType: 'api_key' as const },
	$getAccountId: async () => 'account-id',
} as never;

const AUDIO = new Uint8Array([0x49, 0x44, 0x33, 0x04, 0x00, 0xff]);
const LDJSON = new TextEncoder().encode('{"objectId":"1"}\n{"objectId":"2"}\n');
const CSV = new TextEncoder().encode('target_id,value\n1,10\n');

/** The multipart field the last request carried. */
function sentPart(field: string): Blob {
	const options = mockedRequest.mock.calls.at(-1)?.[1] as {
		formData?: Record<string, Blob | string>;
	};
	const part = options.formData?.[field];
	if (!(part instanceof Blob)) throw new Error(`No ${field} part was sent`);
	return part;
}

async function bytesOf(part: Blob): Promise<number[]> {
	return Array.from(new Uint8Array(await part.arrayBuffer()));
}

// Each upload with the field it fills and how to call it.
const uploads = [
	{
		name: 'calls.addRecording',
		field: 'mediaFile',
		url: '/v2/calls/123/media',
		bytes: AUDIO,
		type: 'audio/mpeg',
		filename: 'call.mp3',
		send: (file: unknown) =>
			addCallRecording(ctx, { id: '123', mediaFile: file } as never),
	},
	{
		name: 'crm.uploadObjects',
		field: 'dataFile',
		url: '/v2/crm/entities',
		bytes: LDJSON,
		type: 'application/x-ndjson',
		filename: 'accounts.ldjson',
		send: (file: unknown) =>
			uploadCrmObjects(ctx, {
				integrationId: 1,
				objectType: 'ACCOUNT',
				clientRequestId: 'req-1',
				dataFile: file,
			} as never),
	},
	{
		name: 'targets.uploadAssignments',
		field: 'file',
		url: '/v2/targets/7/assignments',
		bytes: CSV,
		type: 'text/csv',
		filename: 'targets.csv',
		send: (file: unknown) =>
			uploadAssignments(ctx, {
				targetId: '7',
				workspaceId: 1,
				file,
			} as never),
	},
];

describe('Gong uploads take a link, base64 or a Blob', () => {
	beforeEach(() => {
		mockedRequest.mockReset();
		mockedRequest.mockResolvedValue({ requestId: 'r' });
		mockLinks.served.clear();
	});

	it.each(uploads)(
		'$name downloads a link and sends it as the $field part',
		async ({ field, url, bytes, type, filename, send }) => {
			const link = `https://files.example.com/exports/${filename}`;
			mockLinks.served.set(link, { body: bytes, type });
			await send(link);
			expect(mockedRequest).toHaveBeenCalledWith(
				expect.any(Object),
				expect.objectContaining({ url }),
			);
			const part = sentPart(field);
			expect(part).toBeInstanceOf(File);
			expect((part as File).name).toBe(filename);
			expect(part.type).toBe(type);
			expect(await bytesOf(part)).toEqual(Array.from(bytes));
		},
	);

	it.each(uploads)(
		'$name takes {url, filename, contentType} and names the part from it',
		async ({ field, bytes, type, send }) => {
			const link = 'https://files.example.com/download?id=42';
			mockLinks.served.set(link, {
				body: bytes,
				type: 'application/octet-stream',
			});
			await send({ url: link, filename: 'named.bin', contentType: type });
			const part = sentPart(field) as File;
			expect(part.name).toBe('named.bin');
			expect(part.type).toBe(type);
			expect(await bytesOf(part)).toEqual(Array.from(bytes));
		},
	);

	it.each(uploads)(
		'$name decodes {base64, filename, contentType} into the $field part',
		async ({ field, bytes, type, filename, send }) => {
			await send({
				base64: Buffer.from(bytes).toString('base64'),
				filename,
				contentType: type,
			});
			const part = sentPart(field);
			expect(part).toBeInstanceOf(File);
			expect((part as File).name).toBe(filename);
			expect(part.type).toBe(type);
			expect(await bytesOf(part)).toEqual(Array.from(bytes));
		},
	);

	it.each(uploads)(
		'$name still sends a Blob exactly as given',
		async ({ field, bytes, type, send }) => {
			const blob = new Blob([bytes], { type });
			await send(blob);
			expect(sentPart(field)).toBe(blob);
		},
	);

	it.each(uploads)(
		'$name refuses a private address before any Gong request',
		async ({ send }) => {
			for (const link of [
				'https://127.0.0.1/x',
				'http://169.254.169.254/latest/meta-data/',
				'file:///etc/passwd',
			]) {
				await expect(send(link)).rejects.toThrow(/file URL/);
			}
			expect(mockedRequest).not.toHaveBeenCalled();
		},
	);

	it('accepts the file forms in each upload schema and refuses other values', () => {
		const inputs = {
			'calls.addRecording': (file: unknown) => ({ id: '123', mediaFile: file }),
			'crm.uploadObjects': (file: unknown) => ({
				integrationId: 1,
				objectType: 'ACCOUNT',
				clientRequestId: 'req-1',
				dataFile: file,
			}),
			'targets.uploadAssignments': (file: unknown) => ({
				targetId: '7',
				workspaceId: 1,
				file,
			}),
		};
		for (const [name, build] of Object.entries(inputs)) {
			const schema =
				gongEndpointSchemas[name as keyof typeof gongEndpointSchemas].input;
			for (const file of [
				'https://files.example.com/a.csv',
				'fil_abc123',
				{ url: 'https://files.example.com/a.csv', filename: 'a.csv' },
				{ base64: 'aGVsbG8=', contentType: 'text/csv' },
				new Blob(['x']),
			]) {
				expect(schema.safeParse(build(file)).success).toBe(true);
			}
			for (const file of [undefined, '', 42, { path: '/tmp/a.csv' }]) {
				expect(schema.safeParse(build(file)).success).toBe(false);
			}
		}
	});
});
