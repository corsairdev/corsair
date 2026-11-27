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
