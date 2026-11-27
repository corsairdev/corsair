import { logEventFromContext } from 'corsair/core';
import { Documents, Responses, Retrievals } from './endpoints';
import {
	cancelledResponse,
	document,
	documentChunks,
	documentsList,
	readyDocument,
	retrieval,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);

// unknown: tests send values no schema accepts, so the input stays unknown;
// each call infers its output type from the endpoint.
async function invoke<T>(
	endpoint: (ctx: never, input: never) => Promise<T>,
	input: unknown,
): Promise<T> {
	return endpoint({ key: 'ragie-test-key' } as never, input as never);
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
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('output parsing', () => {
	it('parses a full documents.list page', async () => {
		respond(documentsList);

		const result = await invoke(Documents.list, {});

		expect(result.documents).toHaveLength(2);
		expect(result.cursor).toBe('doc_cursor_2');
	});

	it('keeps fields the schema does not name on a document read', async () => {
		respond({ ...document, brand_new_field: { nested: true } });

		const result = await invoke(Documents.get, { document_id: document.id });

		expect(
			// unknown: the field is deliberately outside the schema.
			(result as Record<string, unknown>).brand_new_field,
		).toEqual({ nested: true });
	});

	it('parses chunks with their links', async () => {
		respond(documentChunks);

		const result = await invoke(Documents.getChunks, {
			document_id: readyDocument.id,
		});

		expect(result.chunks[0]).toMatchObject({ id: 'chunk-12', index: 12 });
	});

	it('parses a retrieval with scored chunks', async () => {
		respond(retrieval);

		const result = await invoke(Retrievals.retrieve, { query: 'refund' });

		expect(result.scored_chunks[0]).toMatchObject({
			document_name: 'handbook.pdf',
			score: 0.873,
		});
	});

	it('parses a deep-search response in every terminal status', async () => {
		respond(cancelledResponse);

		const result = await invoke(Responses.get, {
			response_id: 'e613d0b7-4c9a-45ed-b32c-302d7f1c5daf',
		});

		expect(result.status).toBe('cancelled');
	});
});

describe('rejections', () => {
	it('rejects an input missing a required field', async () => {
		await expect(invoke(Retrievals.retrieve, {})).rejects.toThrow(/query/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a page_size over the documented maximum of 100', async () => {
		await expect(invoke(Documents.list, { page_size: 101 })).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a wrong-shaped list payload', async () => {
		respond({ documents: 'not-an-array' });

		await expect(invoke(Documents.list, {})).rejects.toThrow();
	});

	it('rejects a document whose status is not a documented value on the status read', async () => {
		respond({ ...readyDocument, status: 'teleported' });

		await expect(
			invoke(Documents.get, { document_id: readyDocument.id }),
		).rejects.toThrow();
	});

	it('rejects a scored chunk missing its document id', async () => {
		respond({
			scored_chunks: [{ text: 'x', score: 1, id: 'c', index: 0 }],
		});

		await expect(invoke(Retrievals.retrieve, { query: 'x' })).rejects.toThrow();
	});

	it('rejects a response whose status is outside the documented set', async () => {
		respond({ ...cancelledResponse, status: 'paused' });

		await expect(invoke(Responses.get, { response_id: 'x' })).rejects.toThrow();
	});
});
