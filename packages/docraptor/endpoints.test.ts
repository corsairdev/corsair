import { Documents, Ips } from './endpoints';
import { DocRaptorEndpointOutputSchemas as Outputs } from './endpoints/types';
import {
	asyncCreated,
	completedStatus,
	completedStatusWithMessage,
	documentListRow,
	failedStatus,
	hostedDoc,
	ips,
	workingStatus,
} from './test-fixtures';

const API_KEY = 'dr-endpoints-test-key';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant, so the shared return stays unknown.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: inputs arrive pre-validated only inside the endpoint, so the test
// passes raw caller values.
function invoke(endpoint: AnyEndpoint, input: unknown) {
	// The fake context only carries what the endpoints read (ctx.key).
	return endpoint({ key: API_KEY } as never, input as never);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON or text.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('output parsing', () => {
	it('parses a queued answer with no other fields', async () => {
		respond({ status: 'queued' });

		await expect(
			invoke(Documents.status, { statusId: 'abc' }),
		).resolves.toEqual({ status: 'queued' });
	});

	it('parses a working answer, another in-progress value', async () => {
		respond(workingStatus);

		await expect(
			invoke(Documents.status, { statusId: 'abc' }),
		).resolves.toEqual(workingStatus);
	});

	it('parses a completed answer without a message', async () => {
		respond(completedStatus);

		const result = (await invoke(Documents.status, {
			statusId: 'abc',
		})) as ReturnType<typeof Outputs.documentsStatus.parse>;
		expect(result.download_url).toBe(completedStatus.download_url);
		expect(result.download_id).toBe(completedStatus.download_id);
		expect(result.number_of_pages).toBe(1);
		expect(result.message).toBeUndefined();
		expect(result.validation_errors).toBeUndefined();
	});

	it('parses the docs example, whose completed answer carries a message and omits download_id', async () => {
		respond(completedStatusWithMessage);

		const result = Outputs.documentsStatus.parse(completedStatusWithMessage);
		expect(result.message).toContain('Completed at');
		expect(result.download_id).toBeUndefined();
	});

	it('parses a failed answer with validation errors', async () => {
		respond(failedStatus);

		const result = (await invoke(Documents.status, {
			statusId: 'abc',
		})) as ReturnType<typeof Outputs.documentsStatus.parse>;
		expect(result.status).toBe('failed');
		expect(result.validation_errors).toContain("can't be blank");
	});

	it('parses an async creation', async () => {
		respond(asyncCreated);

		await expect(
			invoke(Documents.createAsync, {
				type: 'pdf',
				document_content: '<html></html>',
			}),
		).resolves.toEqual({ status_id: asyncCreated.status_id });
	});

	it('parses a hosted creation', async () => {
		respond(hostedDoc);

		await expect(
			invoke(Documents.createHosted, {
				type: 'pdf',
				document_content: '<html></html>',
				hosted_download_limit: 3,
			}),
		).resolves.toEqual(hostedDoc);
	});

	it('parses a hosted async creation', async () => {
		respond(asyncCreated);

		await expect(
			invoke(Documents.createHostedAsync, {
				type: 'pdf',
				document_content: '<html></html>',
			}),
		).resolves.toEqual({ status_id: asyncCreated.status_id });
	});

	it('parses a document listing page', async () => {
		respond([documentListRow, { id: 2, name: 'other' }]);

		const result = (await invoke(Documents.list, {
			page: 1,
		})) as ReturnType<typeof Outputs.documentsList.parse>;
		expect(result.documents).toHaveLength(2);
		expect(result.next_page).toBeNull();
	});

	it('parses the ip list', async () => {
		respond(ips);

		await expect(invoke(Ips.list, {})).resolves.toEqual({ ips });
	});
});

describe('input rejections', () => {
	it('rejects a create with neither content source', async () => {
		await expect(
			Documents.createAsync(
				{ key: API_KEY } as never,
				{
					type: 'pdf',
					test: true,
				} as never,
			),
		).rejects.toThrow(/Exactly one of document_content or document_url/);
	});

	it('rejects a create with both content sources', async () => {
		await expect(
			Documents.createAsync(
				{ key: API_KEY } as never,
				{
					type: 'pdf',
					document_content: '<html></html>',
					document_url: 'https://example.com/doc.html',
				} as never,
			),
		).rejects.toThrow(/Exactly one of document_content or document_url/);
	});

	it('rejects a document type outside the documented three', async () => {
		await expect(
			Documents.createAsync(
				{ key: API_KEY } as never,
				{
					type: 'docx',
					document_content: '<html></html>',
				} as never,
			),
		).rejects.toThrow();
	});

	it('rejects a hosted expiry that is not an ISO 8601 datetime with an offset', async () => {
		await expect(
			Documents.createHosted(
				{ key: API_KEY } as never,
				{
					type: 'pdf',
					document_content: '<html></html>',
					hosted_expires_at: '2027-01-23',
				} as never,
			),
		).rejects.toThrow();
	});

	it('rejects a prince key_bits outside the documented pair', async () => {
		await expect(
			Documents.createAsync(
				{ key: API_KEY } as never,
				{
					type: 'pdf',
					document_content: '<html></html>',
					prince_options: { key_bits: 256 },
				} as never,
			),
		).rejects.toThrow();
	});

	it('rejects a hosted download limit below one', async () => {
		await expect(
			Documents.createHosted(
				{ key: API_KEY } as never,
				{
					type: 'pdf',
					document_content: '<html></html>',
					hosted_download_limit: 0,
				} as never,
			),
		).rejects.toThrow();
	});
});

describe('response rejections', () => {
	it('rejects a status body without the status field', async () => {
		respond({ download_id: 'abc' });

		await expect(
			invoke(Documents.status, { statusId: 'abc' }),
		).rejects.toThrow();
	});

	it('rejects a status body where number_of_pages is a string', async () => {
		respond({ status: 'completed', number_of_pages: '1' });

		await expect(
			invoke(Documents.status, { statusId: 'abc' }),
		).rejects.toThrow();
	});

	it('rejects an async creation without status_id', async () => {
		respond({ id: 'not-the-field' });

		await expect(
			invoke(Documents.createAsync, {
				type: 'pdf',
				document_content: '<html></html>',
			}),
		).rejects.toThrow();
	});

	it('rejects a hosted creation without download_url', async () => {
		respond({ download_id: '123' });

		await expect(
			invoke(Documents.createHosted, {
				type: 'pdf',
				document_content: '<html></html>',
			}),
		).rejects.toThrow();
	});

	it('rejects a document listing that is not a bare array', async () => {
		respond({ documents: [documentListRow] });

		await expect(invoke(Documents.list, {})).rejects.toThrow();
	});

	it('rejects an ip list with a non-string entry', async () => {
		respond(['18.208.30.169', 42]);

		await expect(invoke(Ips.list, {})).rejects.toThrow();
	});
});

describe('file operations', () => {
	function respondFile(bytes: number[], contentType: string) {
		fetchMock.mockResolvedValueOnce(
			new Response(new Uint8Array(bytes), {
				status: 200,
				headers: { 'Content-Type': contentType },
			}),
		);
	}

	it('documents.create posts to /docs and returns the PDF as a file', async () => {
		respondFile([0x25, 0x50, 0x44, 0x46, 0x2d], 'application/pdf');

		const result = (await invoke(Documents.create, {
			type: 'pdf',
			name: 'invoice',
			test: true,
			document_content: '<h1>Invoice</h1>',
		})) as {
			contentType: string;
			byteLength: number;
			filename: string;
			contentBase64: string;
		};

		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe('https://api.docraptor.com/docs');
		expect(init.method).toBe('POST');
		expect(JSON.parse(String(init.body))).toMatchObject({
			type: 'pdf',
			test: true,
			document_content: '<h1>Invoice</h1>',
		});
		expect(result).toMatchObject({
			contentType: 'application/pdf',
			byteLength: 5,
			filename: 'invoice.pdf',
		});
		expect(Buffer.from(result.contentBase64, 'base64').toString()).toBe(
			'%PDF-',
		);
	});

	it('documents.create refuses input without a content source before any request', async () => {
		await expect(invoke(Documents.create, { type: 'pdf' })).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('documents.download reads /download/{id} as a file', async () => {
		respondFile([0x25, 0x50, 0x44, 0x46], 'application/pdf');

		const result = (await invoke(Documents.download, {
			downloadId: 'a b/c',
		})) as { filename: string; byteLength: number };

		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe('https://api.docraptor.com/download/a%20b%2Fc');
		expect(init.method).toBe('GET');
		expect(result).toMatchObject({ filename: 'a b/c.pdf', byteLength: 4 });
	});

	it('documents.download names an Excel file .xlsx', async () => {
		respondFile(
			[0x50, 0x4b],
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
		);
		const result = (await invoke(Documents.download, {
			downloadId: 'x1',
		})) as { filename: string };
		expect(result.filename).toBe('x1.xlsx');
	});
});
