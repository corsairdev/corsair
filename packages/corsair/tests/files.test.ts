import { z } from 'zod';
import {
	FILE_OUTPUT_MAX_BYTES,
	FileInputSchema,
	FileOutputSchema,
	resolveFileInput,
	toFileOutput,
} from '../async-core/files';
import type {
	DownloadDeps,
	TransportResponse,
} from '../async-core/public-download';
import {
	downloadPublicFile,
	filenameFromDisposition,
	UnsafeUrlError,
} from '../async-core/public-download';
import { request } from '../async-core/request';

// A public address, so the resolver never needs the network.
const publicResolve = async () => ['93.184.216.34'];

function body(...chunks: Uint8Array[]): AsyncIterable<Uint8Array> {
	return (async function* () {
		for (const chunk of chunks) yield chunk;
	})();
}

type Reply = Partial<Omit<TransportResponse, 'body'>> & { body?: Uint8Array };

/** A transport that answers each request from a list, and records what was asked. */
function serving(...replies: Reply[]) {
	const asked: Array<{ url: string; addresses: readonly string[] }> = [];
	let cancelled = 0;
	const deps: DownloadDeps = {
		resolve: publicResolve,
		transport: async (url, addresses) => {
			asked.push({ url: url.toString(), addresses });
			const reply = replies[asked.length - 1] ?? replies[replies.length - 1]!;
			return {
				status: reply.status ?? 200,
				headers: reply.headers ?? {},
				body: body(reply.body ?? new Uint8Array()),
				cancel: () => {
					cancelled++;
				},
			};
		},
	};
	return { deps, asked, cancelled: () => cancelled };
}

const PDF = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x00, 0xff, 0xfe]);

describe('downloadPublicFile', () => {
	it('returns the bytes as sent, with the type and name the server states', async () => {
		const { deps, asked } = serving({
			headers: {
				'content-type': 'application/pdf; charset=binary',
				'content-disposition': `attachment; filename*=UTF-8''r%C3%A9sum%C3%A9.pdf`,
			},
			body: PDF,
		});
		const got = await downloadPublicFile(
			'https://files.example.com/a/b.pdf?sig=1',
			{},
			deps,
		);
		expect(Array.from(got.bytes)).toEqual(Array.from(PDF));
		expect(got.contentType).toBe('application/pdf');
		expect(got.filename).toBe('résumé.pdf');
		expect(got.url).toBe('https://files.example.com/a/b.pdf?sig=1');
		// The socket is pinned to the address that was checked.
		expect(asked[0]!.addresses).toEqual(['93.184.216.34']);
	});

	it('refuses a host that resolves to a private address, before any request', async () => {
		const { deps, asked } = serving({ body: PDF });
		await expect(
			downloadPublicFile(
				'https://internal.example.com/x',
				{},
				{ ...deps, resolve: async () => ['93.184.216.34', '10.0.0.7'] },
			),
		).rejects.toThrow(UnsafeUrlError);
		for (const url of [
			'http://169.254.169.254/latest/meta-data/',
			'https://127.0.0.1/x',
			'https://[::1]/x',
			'file:///etc/passwd',
			'not a url',
		]) {
			await expect(downloadPublicFile(url, {}, deps)).rejects.toThrow(
				UnsafeUrlError,
			);
		}
		expect(asked).toEqual([]);
	});

	it('checks every redirect hop, and stops after three', async () => {
		const toPrivate = serving({
			status: 302,
			headers: { location: 'http://10.0.0.5/secret' },
		});
		const resolve = async (host: string) =>
			host === '10.0.0.5' ? ['10.0.0.5'] : ['93.184.216.34'];
		await expect(
			downloadPublicFile(
				'https://a.example.com/x',
				{},
				{ ...toPrivate.deps, resolve },
			),
		).rejects.toThrow(/private or reserved/);
		expect(toPrivate.asked).toHaveLength(1);
		// The redirect's own response is released; nothing is left open.
		expect(toPrivate.cancelled()).toBeGreaterThanOrEqual(1);

		const loop = serving({ status: 302, headers: { location: '/again' } });
		await expect(
			downloadPublicFile('https://a.example.com/x', {}, loop.deps),
		).rejects.toThrow(/redirected more than 3 times/);
		expect(loop.asked).toHaveLength(4);

		const once = serving(
			{ status: 301, headers: { location: 'https://cdn.example.com/f.png' } },
			{ headers: { 'content-type': 'image/png' }, body: PDF },
		);
		const got = await downloadPublicFile(
			'https://a.example.com/x',
			{},
			once.deps,
		);
		expect(got.url).toBe('https://cdn.example.com/f.png');
	});

	it("holds a download to the caller's size limit, declared or not", async () => {
		const declared = serving({
			headers: { 'content-length': '2000000' },
			body: PDF,
		});
		await expect(
			downloadPublicFile(
				'https://a.example.com/x',
				{ maxBytes: 1_000_000 },
				declared.deps,
			),
		).rejects.toThrow(/larger than the 1 MB limit/);

		const silent = serving({ body: new Uint8Array(2048) });
		await expect(
			downloadPublicFile(
				'https://a.example.com/x',
				{ maxBytes: 1024 },
				silent.deps,
			),
		).rejects.toThrow(/larger than/);
		expect(silent.cancelled()).toBe(1);
	});

	it('reports a failed download with its status', async () => {
		const { deps } = serving({ status: 404 });
		await expect(
			downloadPublicFile('https://a.example.com/x', {}, deps),
		).rejects.toThrow('Could not download the file (404)');
	});

	it('reads a file name from either Content-Disposition form', () => {
		expect(filenameFromDisposition('attachment; filename="q3 plan.pdf"')).toBe(
			'q3 plan.pdf',
		);
		expect(filenameFromDisposition('inline; filename=plain.txt')).toBe(
			'plain.txt',
		);
		expect(filenameFromDisposition('inline')).toBeUndefined();
		expect(filenameFromDisposition(undefined)).toBeUndefined();
	});
});

describe('FileInputSchema', () => {
	it('takes a URL, a URL object or a base64 object, and nothing else', () => {
		expect(FileInputSchema.safeParse('https://x.test/a.pdf').success).toBe(
			true,
		);
		expect(
			FileInputSchema.safeParse({
				url: 'https://x.test/a.pdf',
				filename: 'a.pdf',
			}).success,
		).toBe(true);
		expect(
			FileInputSchema.safeParse({
				base64: 'JVBERg==',
				contentType: 'application/pdf',
			}).success,
		).toBe(true);
		expect(FileInputSchema.safeParse({}).success).toBe(false);
		expect(FileInputSchema.safeParse('').success).toBe(false);
		expect(FileInputSchema.safeParse(42).success).toBe(false);
	});

	// A Blob has no JSON form; an agent reading the schema must see real options.
	it('shows an agent three concrete shapes', () => {
		const shown = z.toJSONSchema(FileInputSchema) as {
			anyOf: Array<{ type: string; required?: string[] }>;
			description: string;
		};
		expect(shown.anyOf.map((option) => option.type)).toEqual([
			'string',
			'object',
			'object',
		]);
		expect(shown.anyOf[1]!.required).toEqual(['url']);
		expect(shown.anyOf[2]!.required).toEqual(['base64']);
		expect(shown.description).toContain('A file');
	});
});

describe('resolveFileInput', () => {
	it('downloads a URL and names the file from the address', async () => {
		const { deps } = serving({
			headers: { 'content-type': 'application/pdf' },
			body: PDF,
		});
		const file = await resolveFileInput(
			'https://files.example.com/docs/invoice-4471.pdf?token=abc',
			{},
			deps,
		);
		expect(file.filename).toBe('invoice-4471.pdf');
		expect(file.contentType).toBe('application/pdf');
		expect(Array.from(file.bytes)).toEqual(Array.from(PDF));
		expect(file.file).toBeInstanceOf(File);
		expect(file.file.name).toBe('invoice-4471.pdf');
		expect(file.file.type).toBe('application/pdf');
		expect(file.file.size).toBe(PDF.byteLength);
	});

	it('lets the caller name and type the file, over what the server says', async () => {
		const { deps } = serving({
			headers: {
				'content-type': 'application/octet-stream',
				'content-disposition': 'attachment; filename="download"',
			},
			body: PDF,
		});
		const file = await resolveFileInput(
			{
				url: 'https://files.example.com/get/9f2',
				filename: 'contract.pdf',
				contentType: 'application/pdf',
			},
			{},
			deps,
		);
		expect([file.filename, file.contentType]).toEqual([
			'contract.pdf',
			'application/pdf',
		]);

		// With nothing better, the server's name, then the fallback.
		const served = await resolveFileInput(
			'https://files.example.com/get/9f2',
			{ fallbackName: 'upload' },
			deps,
		);
		expect(served.filename).toBe('download');
		const bare = serving({ body: PDF });
		const fallback = await resolveFileInput(
			'https://files.example.com/get/9f2',
			{ fallbackName: 'upload' },
			bare.deps,
		);
		expect(fallback.filename).toBe('upload');
	});

	it('decodes base64 and data URLs without touching the network', async () => {
		const { deps, asked } = serving({ body: PDF });
		const b64 = Buffer.from(PDF).toString('base64');
		const fromObject = await resolveFileInput(
			{ base64: b64, filename: 'a.pdf', contentType: 'application/pdf' },
			{},
			deps,
		);
		expect(Array.from(fromObject.bytes)).toEqual(Array.from(PDF));
		expect(fromObject.filename).toBe('a.pdf');

		const fromData = await resolveFileInput(
			`data:image/png;base64,${b64}`,
			{},
			deps,
		);
		expect(fromData.contentType).toBe('image/png');
		expect(Array.from(fromData.bytes)).toEqual(Array.from(PDF));

		const text = await resolveFileInput(
			'data:text/plain,hello%20there',
			{},
			deps,
		);
		expect(new TextDecoder().decode(text.bytes)).toBe('hello there');
		expect(asked).toEqual([]);
	});

	it('refuses base64 that is not, that is empty, or that is over the limit', async () => {
		await expect(resolveFileInput({ base64: 'not base64 !!' })).rejects.toThrow(
			'not valid base64',
		);
		await expect(resolveFileInput({ base64: '====' })).rejects.toThrow();
		await expect(
			resolveFileInput(
				{ base64: Buffer.alloc(2048).toString('base64') },
				{ maxBytes: 1024 },
			),
		).rejects.toThrow(/larger than/);
	});

	it('takes a File or Blob as it is, for a TypeScript caller', async () => {
		const file = await resolveFileInput(
			new File([PDF], 'scan.pdf', { type: 'application/pdf' }),
		);
		expect([file.filename, file.contentType]).toEqual([
			'scan.pdf',
			'application/pdf',
		]);
		const blob = await resolveFileInput(new Blob([PDF]), {
			fallbackName: 'upload',
		});
		expect([blob.filename, blob.contentType]).toEqual([
			'upload',
			'application/octet-stream',
		]);
		expect(Array.from(blob.bytes)).toEqual(Array.from(PDF));
	});
});

describe('toFileOutput', () => {
	it('includes the content when it fits, and always the size and type', () => {
		const out = toFileOutput(PDF, 'application/pdf; charset=binary', {
			filename: 'a.pdf',
		});
		expect(out).toEqual({
			contentBase64: Buffer.from(PDF).toString('base64'),
			contentType: 'application/pdf',
			byteLength: PDF.byteLength,
			filename: 'a.pdf',
		});
		expect(FileOutputSchema.safeParse(out).success).toBe(true);
	});

	it('leaves the content out when it is over the limit or was not asked for', () => {
		const big = new Uint8Array(FILE_OUTPUT_MAX_BYTES + 1);
		expect(toFileOutput(big, 'video/mp4')).toEqual({
			contentType: 'video/mp4',
			byteLength: FILE_OUTPUT_MAX_BYTES + 1,
			contentOmitted: 'over_limit',
		});
		expect(toFileOutput(PDF, null, { includeContent: false })).toEqual({
			contentType: 'application/octet-stream',
			byteLength: PDF.byteLength,
			contentOmitted: 'not_requested',
		});
		expect(
			toFileOutput(big, 'video/mp4', { maxBytes: big.byteLength })
				.contentBase64,
		).toBeDefined();
	});
});

describe("request with responseType 'binary'", () => {
	const config = { BASE: 'https://api.example.com', VERSION: '1' } as never;
	const realFetch = globalThis.fetch;
	afterEach(() => {
		globalThis.fetch = realFetch;
	});

	it('returns a file as the bytes that were sent', async () => {
		globalThis.fetch = (async () =>
			new Response(PDF, {
				status: 200,
				headers: { 'Content-Type': 'application/pdf' },
			})) as typeof fetch;
		const got = await request<{ bytes: Uint8Array; contentType: string }>(
			config,
			{ method: 'GET', url: '/files/1/content', responseType: 'binary' },
		);
		expect(Array.from(got.bytes)).toEqual(Array.from(PDF));
		expect(got.contentType).toBe('application/pdf');
	});

	// The behaviour this replaces: every byte that is not valid UTF-8 is lost.
	it('without it, the same response comes back as damaged text', async () => {
		globalThis.fetch = (async () =>
			new Response(PDF, {
				status: 200,
				headers: { 'Content-Type': 'application/pdf' },
			})) as typeof fetch;
		const got = await request<string>(config, {
			method: 'GET',
			url: '/files/1/content',
		});
		expect(typeof got).toBe('string');
		expect(Array.from(new TextEncoder().encode(got))).not.toEqual(
			Array.from(PDF),
		);
	});

	it('still reads an error response for its message', async () => {
		globalThis.fetch = (async () =>
			new Response(JSON.stringify({ message: 'No such file' }), {
				status: 404,
				headers: { 'Content-Type': 'application/json' },
			})) as typeof fetch;
		await expect(
			request(config, {
				method: 'GET',
				url: '/files/missing/content',
				responseType: 'binary',
			}),
		).rejects.toMatchObject({ status: 404, body: { message: 'No such file' } });
	});
});
