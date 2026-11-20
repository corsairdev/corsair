import { logEventFromContext } from 'corsair/core';
import { Convert, Extract, Jobs, Pdf } from './endpoints';
import {
	fileAnswer,
	formFields,
	jobDone,
	jobFailed,
	jobPending,
	pdfInfo,
	tableResult,
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
			{
				status,
				headers: { 'Content-Type': contentType },
			},
		),
	);
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		origin: parsed.origin,
		path: parsed.pathname,
		method: init.method,
		headers: new Headers(init.headers),
		body: init.body === undefined ? undefined : String(init.body),
	};
}

function expectAuthenticated(path: string, method = 'POST') {
	const sent = lastRequest();
	expect(sent.origin).toBe('https://api.pdf4me.com');
	expect(sent.path).toBe(path);
	expect(sent.method).toBe(method);
	expect(sent.headers.get('authorization')).toBe(API_KEY);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('pdf', () => {
	it('merge POSTs the array of documents and decodes the binary answer', async () => {
		respond(new Uint8Array([0x25, 0x50, 0x44, 0x46]), 200, 'application/pdf');
		const file = (await invoke(Pdf.merge, {
			docContent: ['AAAA', 'BBBB'],
			docName: 'out.pdf',
		})) as { fileContent?: string };
		expect(Buffer.from(file.fileContent ?? '', 'base64').toString()).toBe(
			'%PDF',
		);

		const sent = lastRequest();
		expectAuthenticated('/api/v2/Merge');
		// unknown: the request body is parsed JSON whose keys are
		// provider-defined, so the test narrows per assertion.
		const body = JSON.parse(sent.body as string) as Record<string, unknown>;
		expect(body['docContent']).toEqual(['AAAA', 'BBBB']);
		expect(body['docName']).toBe('out.pdf');
	});

	it('split POSTs to SplitPDF', async () => {
		respond(new Uint8Array([1]), 200, 'application/pdf');
		await invoke(Pdf.split, { docContent: 'AAAA', docName: 'in.pdf' });
		expectAuthenticated('/api/v2/SplitPDF');
	});

	it('compress POSTs to Optimize with the profile', async () => {
		respond(new Uint8Array([1]), 200, 'application/pdf');
		await invoke(Pdf.compress, {
			docContent: 'AAAA',
			docName: 'in.pdf',
			optimizeProfile: 'Web',
		});
		const sent = lastRequest();
		expectAuthenticated('/api/v2/Optimize');
		// unknown: parsed JSON with provider-defined keys.
		const body = JSON.parse(sent.body as string) as Record<string, unknown>;
		expect(body['optimizeProfile']).toBe('Web');
	});

	it('extractPages POSTs to Extract', async () => {
		respond(new Uint8Array([1]), 200, 'application/pdf');
		await invoke(Pdf.extractPages, {
			docContent: 'AAAA',
			docName: 'in.pdf',
			pageNumbers: [1, 3],
		});
		expectAuthenticated('/api/v2/Extract');
	});

	it('deletePages POSTs to DeletePages', async () => {
		respond(new Uint8Array([1]), 200, 'application/pdf');
		await invoke(Pdf.deletePages, {
			docContent: 'AAAA',
			docName: 'in.pdf',
			pageNumbers: [2],
		});
		expectAuthenticated('/api/v2/DeletePages');
	});

	it('getInfo POSTs to GetPdfInformation', async () => {
		respond(pdfInfo);
		const result = (await invoke(Pdf.getInfo, {
			docContent: 'AAAA',
			docName: 'in.pdf',
		})) as { pageCount?: number };
		expect(result.pageCount).toBe(12);
		expectAuthenticated('/api/v2/GetPdfInformation');
	});
});

describe('convert', () => {
	it('pdfToWord POSTs to ConvertPdfToWord', async () => {
		respond(new Uint8Array([1]), 200, 'application/octet-stream');
		await invoke(Convert.pdfToWord, { docContent: 'AAAA', docName: 'in.pdf' });
		expectAuthenticated('/api/v2/ConvertPdfToWord');
	});

	it('htmlToPdf POSTs to ConvertHtmlToPdf', async () => {
		respond(new Uint8Array([1]), 200, 'application/pdf');
		await invoke(Convert.htmlToPdf, {
			htmlContent: '<p>hi</p>',
			docName: 'out.pdf',
		});
		const sent = lastRequest();
		expectAuthenticated('/api/v2/ConvertHtmlToPdf');
		// unknown: parsed JSON with provider-defined keys.
		const body = JSON.parse(sent.body as string) as Record<string, unknown>;
		expect(body['htmlContent']).toBe('<p>hi</p>');
	});

	it('ocrPdf POSTs to ConvertOcrPdf with the documented boolean field', async () => {
		respond(new Uint8Array([1]), 200, 'application/pdf');
		await invoke(Convert.ocrPdf, {
			docContent: 'AAAA',
			docName: 'scan.pdf',
			ocrWhenNeeded: true,
		});
		const sent = lastRequest();
		expectAuthenticated('/api/v2/ConvertOcrPdf');
		// unknown: parsed JSON with provider-defined keys.
		const body = JSON.parse(sent.body as string) as Record<string, unknown>;
		expect(body['ocrWhenNeeded']).toBe(true);
	});
});

describe('extract', () => {
	it('tableFromPdf POSTs to ExtractTableFromPdf', async () => {
		respond(tableResult);
		const result = (await invoke(Extract.tableFromPdf, {
			docContent: 'AAAA',
			docName: 'in.pdf',
			// unknown: table records are provider-shaped, so the cast keeps
			// them open.
		})) as { tables?: unknown[] };
		expect(result.tables).toHaveLength(1);
		expectAuthenticated('/api/v2/ExtractTableFromPdf');
	});

	it('pdfFormData POSTs to ExtractPdfFormData', async () => {
		respond(formFields);
		const result = (await invoke(Extract.pdfFormData, {
			docContent: 'AAAA',
			docName: 'in.pdf',
			// unknown: form field records are provider-shaped, so the cast
			// keeps them open.
		})) as { fields?: unknown[] };
		expect(result.fields).toHaveLength(1);
		expectAuthenticated('/api/v2/ExtractPdfFormData');
	});
});

describe('jobs', () => {
	it('status POSTs the jobId to GetActionStatus', async () => {
		respond(jobDone);
		const job = (await invoke(Jobs.status, { jobId: 'job-1' })) as {
			isSuccess?: boolean;
		};
		expect(job.isSuccess).toBe(true);
		expectAuthenticated('/api/v2/GetActionStatus');
		expect(JSON.parse(lastRequest().body as string)).toEqual({
			jobId: 'job-1',
		});
	});

	it('parses a pending job', async () => {
		respond(jobPending);
		const job = (await invoke(Jobs.status, { jobId: 'job-1' })) as {
			isWorking?: boolean;
		};
		expect(job.isWorking).toBe(true);
	});

	it('parses a failed job', async () => {
		respond(jobFailed);
		const job = (await invoke(Jobs.status, { jobId: 'job-1' })) as {
			hasFailed?: boolean;
		};
		expect(job.hasFailed).toBe(true);
	});
});

describe('JSON file answers', () => {
	it('parses the { File Content, File Name } answer shape', async () => {
		respond(fileAnswer, 200, 'application/json');
		const file = (await invoke(Pdf.compress, {
			docContent: 'AAAA',
			docName: 'in.pdf',
		})) as { fileName?: string; fileContent?: string };
		expect(file.fileName).toBe('output.pdf');
		expect(file.fileContent).toBe('JVBERi0=');
	});
});
