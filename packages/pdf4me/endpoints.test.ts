import { logEventFromContext } from 'corsair/core';
import { Jobs, Pdf } from './endpoints';
import {
	fileAnswer,
	jobDone,
	jobFailed,
	jobPending,
	mergedPdfBytes,
	pdfInfo,
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

	it('parses a job in each documented state', async () => {
		for (const [fixture, field] of [
			[jobPending, 'isWorking'],
			[jobDone, 'isSuccess'],
			[jobFailed, 'hasFailed'],
		] as const) {
			respond(fixture);
			const job = (await invoke(Jobs.status, { jobId: 'job-1' })) as Record<
				string,
				unknown
			>;
			expect(job[field]).toBe(true);
		}
	});

	it('parses the JSON file answer shape', async () => {
		respond(fileAnswer);
		const file = (await invoke(Pdf.compress, {
			docContent: 'AAAA',
			docName: 'in.pdf',
		})) as { fileName?: string };
		expect(file.fileName).toBe('output.pdf');
	});

	it('rejects a job status whose booleans are strings', async () => {
		respond({ jobId: 'job-1', isWorking: 'yes' });
		await rejects(Jobs.status, { jobId: 'x' }, 'boolean');
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
