import { logEventFromContext } from 'corsair/core';
import { Documents, Mailboxes, Webhooks } from './endpoints';
import {
	fileBase64,
	parsedDocument,
	parsingDocument,
	webhook,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'prsio-test-key';

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

// unknown: response bodies are arbitrary JSON.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(body === undefined ? null : JSON.stringify(body), {
			status,
			headers: body === undefined ? {} : { 'Content-Type': 'application/json' },
		}),
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

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		origin: parsed.origin,
		path: decodeURIComponent(parsed.pathname),
		method: init.method,
		headers: new Headers(init.headers),
		body: init.body === undefined ? undefined : String(init.body),
	};
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('output parsing', () => {
	it('parses a parsed document with its data', async () => {
		respond(parsedDocument);
		const doc = (await invoke(Documents.get, { documentId: 'DOC_ID' })) as {
			status: string;
			// unknown: parsed data records are caller-defined open records.
			json?: Record<string, unknown>;
		};
		expect(doc.status).toBe('parsed');
		expect(doc.json?.['field1']).toBe('value1');
	});

	it('parses a deferred import with null fields', async () => {
		respond(parsingDocument);
		const doc = (await invoke(Documents.createAsync, {
			mailboxId: 'mbx_1',
			text: 'hello',
		})) as { parsing_in_progress: boolean; name: string | null };
		expect(doc.parsing_in_progress).toBe(true);
		expect(doc.name).toBeNull();
	});

	it('parses a webhook record', async () => {
		respond(webhook);
		const result = (await invoke(Webhooks.get, { webhookId: 'wh_1' })) as {
			event?: string;
		};
		expect(result.event).toBe('doc.parsed');
	});

	it('rejects a document with no doc_id', async () => {
		respond({ status: 'parsed' });
		await rejects(Documents.get, { documentId: 'x' }, 'doc_id');
	});
});

describe('input validation', () => {
	it('rejects a sync create with neither html nor text', async () => {
		await rejects(
			Documents.createSync,
			{ mailboxId: 'mbx_1' },
			'Provide html or text',
		);
	});

	it('rejects an async create with neither html nor text', async () => {
		await rejects(
			Documents.createAsync,
			{ mailboxId: 'mbx_1' },
			'Provide html or text',
		);
	});

	it('rejects a mailbox update with no fields', async () => {
		await rejects(
			Mailboxes.update,
			{ mailboxId: 'mbx_1' },
			'at least one field',
		);
	});

	it('rejects a webhook create for table.parsed without table_id', async () => {
		await rejects(
			Webhooks.create,
			{
				mailboxId: 'mbx_1',
				url: 'https://example.com/hook',
				event: 'table.parsed',
			},
			'table_id is required',
		);
	});

	it('rejects a sync upload larger than 20MB', async () => {
		const big = Buffer.alloc(21 * 1024 * 1024).toString('base64');
		await rejects(
			Documents.uploadSync,
			{ mailboxId: 'mbx_1', filename: 'big.pdf', contentBase64: big },
			'20MB',
		);
	});

	it('accepts a sync upload of 10MB', async () => {
		respond(parsedDocument);
		const medium = Buffer.alloc(10 * 1024 * 1024).toString('base64');
		const doc = (await invoke(Documents.uploadSync, {
			mailboxId: 'mbx_1',
			filename: 'ok.pdf',
			contentBase64: medium,
		})) as { doc_id: string };
		expect(doc.doc_id).toBe('DOC_ID');
	});

	it('rejects a per_page above the documented maximum', async () => {
		await rejects(Documents.list, { mailboxId: 'mbx_1', per_page: 501 }, '500');
	});

	it('decodes the file input into bytes the multipart body carries', async () => {
		respond(parsedDocument);
		await invoke(Documents.uploadAsync, {
			mailboxId: 'mbx_1',
			filename: 'receipts.zip',
			contentBase64: fileBase64,
		});
		const sent = lastRequest();
		expect(sent.method).toBe('POST');
		expect(fetchMock.mock.calls.at(-1)?.[1].body).toBeInstanceOf(FormData);
	});
});

describe('204 responses', () => {
	it('rejects a mailbox delete that answers a body instead of the documented 204', async () => {
		respond({ message: 'not really deleted' });
		await rejects(Mailboxes.remove, { mailboxId: 'mbx_1' }, 'unexpected body');
	});

	it('accepts an empty 204 for a webhook delete', async () => {
		respond(undefined, 204);
		const result = (await invoke(Webhooks.remove, { ids: ['wh_1'] })) as {
			success: boolean;
		};
		expect(result.success).toBe(true);
	});
});
