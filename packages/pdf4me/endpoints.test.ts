import { logEventFromContext } from 'corsair/core';
import { Convert, Jobs, Pdf } from './endpoints';
import {
	fileAnswer,
	jobAccepted,
	jobPending,
	mergedPdfBytes,
	pdfInfo,
	splitAnswer,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'pdf4me-test-key';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant.
// unknown: each endpoint returns its own output type, so the shared return
// has no narrower type.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts.
function invoke(endpoint: AnyEndpoint, input: unknown) {
	return endpoint({ key: API_KEY, options: {} } as never, input as never);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON or binary.
function respond(
	body: unknown,
	status = 200,
	contentType = 'application/json',
) {
	fetchMock.mockResolvedValueOnce(
		new Response(
			body instanceof Uint8Array
				? (body as unknown as Blob) // unknown: a binary BodyInit has no shared narrower type
				: JSON.stringify(body),
			{ status, headers: { 'Content-Type': contentType } },
		),
	);
}

// unknown: a rejection can be any value until the message check narrows it.
async function rejects(
	endpoint: AnyEndpoint,
	input: unknown,
	match: string,
): Promise<void> {
	await expect(invoke(endpoint, input)).rejects.toThrow(match);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('output parsing', () => {
	it('decodes the merged PDF answer into base64', async () => {
		respond(mergedPdfBytes, 200, 'application/pdf');
		const file = (await invoke(Pdf.merge, {
			docContent: ['AAAA', 'BBBB'],
			docName: 'out.pdf',
		})) as { fileContent?: string };
		expect(Buffer.from(file.fileContent ?? '', 'base64').toString()).toBe(
			'%PDF',
		);
	});

	it('parses PDF metadata', async () => {
		respond(pdfInfo);
		const info = (await invoke(Pdf.getInfo, {
			docContent: 'AAAA',
			docName: 'in.pdf',
		})) as { pageCount?: number };
		expect(info.pageCount).toBe(12);
	});

	it('parses a running job and a finished one, which answers its file', async () => {
		respond(jobPending);
		const running = (await invoke(Jobs.status, { jobId: 'job-1' })) as Record<
			string,
			unknown
		>;
		expect(running).toMatchObject({ jobId: 'job-1', isFinished: false });

		respond(
			new Uint8Array([0x25, 0x50, 0x44, 0x46]),
			200,
			'application/octet-stream',
		);
		const done = (await invoke(Jobs.status, { jobId: 'job-1' })) as Record<
			string,
			unknown
		>;
		expect(done).toMatchObject({
			jobId: 'job-1',
			isFinished: true,
			fileContent: Buffer.from('%PDF').toString('base64'),
		});
	});

	it('returns the job, not a file, when the API answers 202 (isAsync, PDF-to-Word, OCR)', async () => {
		respond(jobAccepted, 202, 'application/json');
		const out = (await invoke(Convert.pdfToWord, {
			docContent: 'AAAA',
			docName: 'in.pdf',
		})) as Record<string, unknown>;
		expect(out).toMatchObject({ jobId: jobAccepted.jobId, status: 'Accepted' });
		expect(out.fileContent).toBeUndefined();
	});

	it('returns the parts of a split from splitedDocuments', async () => {
		respond(splitAnswer, 200, 'application/json');
		const out = (await invoke(Pdf.split, {
			docContent: 'AAAA',
			docName: 'in.pdf',
		})) as { documents?: { fileName?: string; fileContent?: string }[] };
		expect(out.documents).toEqual([
			{ fileName: 'three 1.pdf', fileContent: 'JVBERi0xLjc=' },
			{ fileName: 'three 2-3.pdf', fileContent: 'JVBERi0xLjc=' },
		]);
	});

	it('parses the JSON file answer shape', async () => {
		respond(fileAnswer);
		const file = (await invoke(Pdf.compress, {
			docContent: 'AAAA',
			docName: 'in.pdf',
		})) as { fileName?: string };
		expect(file.fileName).toBe('output.pdf');
	});

	it('rejects a binary answer of zero bytes as no file', async () => {
		respond(new Uint8Array([]), 200, 'application/pdf');
		const file = (await invoke(Pdf.merge, {
			docContent: ['AAAA', 'BBBB'],
			docName: 'out.pdf',
		})) as { fileContent?: string };
		expect(file.fileContent).toBeUndefined();
	});
});

describe('input validation', () => {
	it('rejects a merge with fewer than two documents', async () => {
		await rejects(Pdf.merge, { docContent: ['AAAA'], docName: 'out.pdf' }, '2');
	});

	it('rejects a compression profile outside the documented four', async () => {
		await rejects(
			Pdf.compress,
			{ docContent: 'AAAA', docName: 'in.pdf', optimizeProfile: 'Turbo' },
			'invalid_value',
		);
	});

	it('rejects page numbers below one', async () => {
		await rejects(
			Pdf.extractPages,
			{ docContent: 'AAAA', docName: 'in.pdf', pageNumbers: [0] },
			'1',
		);
	});
});

describe('error envelope passthrough', () => {
	it('surfaces the documented 400 message', async () => {
		respond({ message: 'File is empty' }, 400);
		await rejects(
			Pdf.compress,
			{ docContent: 'AAAA', docName: 'in.pdf' },
			'File is empty',
		);
	});

	it('surfaces the documented profile validation message', async () => {
		respond('Invalid Optimization Profile', 400);
		await rejects(
			Pdf.compress,
			{ docContent: 'AAAA', docName: 'in.pdf', optimizeProfile: 'Web' },
			'Invalid Optimization Profile',
		);
	});
});
