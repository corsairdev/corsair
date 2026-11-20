import { Aryn } from './endpoints';
import { ArynEndpointInputSchemas } from './endpoints/types';
import type { ArynContext } from './index';

// The real resolveFileInput, with links served from memory instead of the
// network; the Aryn request itself is stubbed.
jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return {
		...actual,
		request: jest.fn(),
		// unknown: a pass-through to the real resolveFileInput, which checks its own arguments.
		resolveFileInput: (input: unknown, options: unknown, deps?: unknown) =>
			actual.resolveFileInput(input, options, deps ?? mockLinks.deps),
	};
});

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(),
}));

import { request } from 'corsair/http';

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

const mockRequest = jest.mocked(request);
const ctx = { key: 'test-api-key' } as never as ArynContext;

const PDF = new Uint8Array(Buffer.from('%PDF-1.4 annual report'));
const LINK = 'https://files.example.com/reports/annual.pdf';

beforeEach(() => {
	mockRequest.mockReset();
	mockLinks.served.set(LINK, { body: PDF, type: 'application/pdf' });
});

afterEach(() => mockLinks.served.clear());

type Sent = { url: string; formData: Record<string, unknown> };

function lastSent(): Sent {
	return mockRequest.mock.calls.at(-1)?.[1] as unknown as Sent;
}

async function expectPdfPart(part: unknown, name: string): Promise<void> {
	expect(part).toBeInstanceOf(File);
	const file = part as File;
	expect(file.name).toBe(name);
	expect(file.type).toBe('application/pdf');
	expect(new Uint8Array(await file.arrayBuffer())).toEqual(PDF);
}

const operations = [
	{
		name: 'document.partition',
		url: '/v1/document/partition',
		run: (input: Record<string, unknown>) => {
			mockRequest.mockResolvedValueOnce({ status: ['OK'] });
			return Aryn.documentPartition(ctx, input as never);
		},
	},
	{
		name: 'document.submitAsyncAdd',
		url: '/v1/async/submit/storage/docsets/ds_123/docs',
		run: (input: Record<string, unknown>) => {
			mockRequest.mockResolvedValueOnce({ task_id: 'task_1' });
			return Aryn.documentSubmitAsyncAdd(ctx, {
				docset_id: 'ds_123',
				...input,
			} as never);
		},
	},
];

describe.each(operations)('$name takes a link, base64 or a Blob', (op) => {
	it('downloads a link and sends it as the file part with its name and type', async () => {
		await op.run({ file: LINK, options: { threshold: 'auto' } });
		const sent = lastSent();
		expect(sent.url).toBe(op.url);
		await expectPdfPart(sent.formData.file, 'annual.pdf');
		expect(sent.formData.file_url).toBeUndefined();
		expect(sent.formData.options).toBe(JSON.stringify({ threshold: 'auto' }));
	});

	it('sends {base64, filename, contentType} as the file part', async () => {
		await op.run({
			file: {
				base64: Buffer.from(PDF).toString('base64'),
				filename: 'scan.pdf',
				contentType: 'application/pdf',
			},
		});
		await expectPdfPart(lastSent().formData.file, 'scan.pdf');
	});

	it('still sends a Blob exactly as it was given', async () => {
		const blob = new Blob([PDF], { type: 'application/pdf' });
		await op.run({ file: blob });
		expect(lastSent().formData.file).toBe(blob);
	});

	it('leaves file_url for Aryn to fetch itself', async () => {
		await op.run({ file_url: 'https://example.com/doc.pdf' });
		expect(lastSent().formData).toEqual({
			file_url: 'https://example.com/doc.pdf',
		});
	});

	it('refuses a private address in file before any Aryn request', async () => {
		for (const file of [
			'https://127.0.0.1/a.pdf',
			'http://169.254.169.254/latest/meta-data/',
		]) {
			await expect(op.run({ file })).rejects.toThrow(/file URL/);
		}
		expect(mockRequest).not.toHaveBeenCalled();
	});
});

describe('Aryn file input schemas', () => {
	it('take a link, {url}, {base64} or a Blob as file, and still need file or file_url', () => {
		for (const file of [
			LINK,
			{ url: LINK, filename: 'a.pdf' },
			{ base64: 'JVBERg==', contentType: 'application/pdf' },
			new Blob(['x']),
		]) {
			expect(
				ArynEndpointInputSchemas.documentPartition.safeParse({ file }).success,
			).toBe(true);
			expect(
				ArynEndpointInputSchemas.documentSubmitAsyncAdd.safeParse({
					docset_id: 'ds_123',
					file,
				}).success,
			).toBe(true);
		}
		expect(
			ArynEndpointInputSchemas.documentPartition.safeParse({ file: 42 })
				.success,
		).toBe(false);
		expect(
			ArynEndpointInputSchemas.documentPartition.safeParse({}).success,
		).toBe(false);
	});
});
