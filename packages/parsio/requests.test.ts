import { logEventFromContext } from 'corsair/core';
import { Data, Documents, Mailboxes, Webhooks } from './endpoints';
import {
	fileBase64,
	mailbox,
	parsedDocument,
	parsingDocument,
	tableField,
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

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		origin: parsed.origin,
		path: decodeURIComponent(parsed.pathname),
		query: Object.fromEntries(parsed.searchParams),
		method: init.method,
		headers: new Headers(init.headers),
		body: init.body === undefined ? undefined : String(init.body),
	};
}

function expectAuthenticated(path: string, method = 'GET') {
	const sent = lastRequest();
	expect(sent.origin).toBe('https://api.parsio.io');
	expect(sent.path).toBe(path);
	expect(sent.method).toBe(method);
	expect(sent.headers.get('x-api-key')).toBe(API_KEY);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('mailboxes', () => {
	it('list GETs all mailboxes', async () => {
		respond([mailbox]);
		const result = (await invoke(Mailboxes.list, {})) as unknown[]; // unknown: mailbox objects are provider-shaped
		expect(result).toHaveLength(1);
		expectAuthenticated('/mailboxes');
	});

	it('get reads one mailbox', async () => {
		respond(mailbox);
		await invoke(Mailboxes.get, { mailboxId: 'mbx_1' });
		expectAuthenticated('/mailboxes/mbx_1');
	});

	it('create POSTs the mailbox body', async () => {
		respond(mailbox, 201);
		await invoke(Mailboxes.create, { name: 'Invoices', preset: 'invoice' });
		const sent = lastRequest();
		expectAuthenticated('/mailboxes/create', 'POST');
		expect(JSON.parse(sent.body as string)).toEqual({
			name: 'Invoices',
			preset: 'invoice',
		});
	});

	it('update POSTs the settings to the mailbox path', async () => {
		respond(mailbox);
		await invoke(Mailboxes.update, {
			mailboxId: 'mbx_1',
			process_attachments: true,
		});
		const sent = lastRequest();
		expectAuthenticated('/mailboxes/mbx_1', 'POST');
		expect(JSON.parse(sent.body as string)).toEqual({
			process_attachments: true,
		});
	});

	it('delete DELETEs the mailbox', async () => {
		respond(undefined, 204);
		const result = (await invoke(Mailboxes.remove, { mailboxId: 'mbx_1' })) as {
			mailboxId: string;
			success: boolean;
		};
		expect(result).toEqual({ mailboxId: 'mbx_1', success: true });
		expectAuthenticated('/mailboxes/mbx_1', 'DELETE');
	});

	it('tableFields GETs the table fields', async () => {
		respond([tableField]);
		const result = (await invoke(Mailboxes.tableFields, {
			mailboxId: 'mbx_1',
			// unknown: table field objects are provider-shaped.
		})) as unknown[];
		expect(result).toHaveLength(1);
		expectAuthenticated('/mailboxes/mbx_1/tableFields');
	});
});

describe('documents', () => {
	it('createSync POSTs the content to doc-sync', async () => {
		respond(parsedDocument);
		await invoke(Documents.createSync, {
			mailboxId: 'mbx_1',
			text: 'Invoice total 42.00',
		});
		const sent = lastRequest();
		expectAuthenticated('/mailboxes/mbx_1/doc-sync', 'POST');
		expect(JSON.parse(sent.body as string)).toEqual({
			text: 'Invoice total 42.00',
		});
	});

	it('createAsync POSTs the content to doc', async () => {
		respond(parsingDocument, 200);
		await invoke(Documents.createAsync, {
			mailboxId: 'mbx_1',
			html: '<p>hi</p>',
		});
		expectAuthenticated('/mailboxes/mbx_1/doc', 'POST');
	});

	it('uploadSync sends a multipart body with the decoded file', async () => {
		respond(parsedDocument);
		await invoke(Documents.uploadSync, {
			mailboxId: 'mbx_1',
			filename: 'receipt.pdf',
			contentBase64: fileBase64,
		});
		const sent = lastRequest();
		expectAuthenticated('/mailboxes/mbx_1/upload-sync', 'POST');
		const form = fetchMock.mock.calls.at(-1)?.[1].body;
		expect(form).toBeInstanceOf(FormData);
		expect((form as FormData).get('filename')).toBe('receipt.pdf');
	});

	it('uploadAsync sends a multipart body', async () => {
		respond(parsingDocument);
		await invoke(Documents.uploadAsync, {
			mailboxId: 'mbx_1',
			filename: 'receipts.zip',
			contentBase64: fileBase64,
		});
		expectAuthenticated('/mailboxes/mbx_1/upload', 'POST');
	});

	it('list GETs the mailbox documents with its filters', async () => {
		respond([parsedDocument]);
		await invoke(Documents.list, {
			mailboxId: 'mbx_1',
			page: 2,
			per_page: 100,
			from: '2026-04-01',
			status: ['parsed'],
		});
		const sent = lastRequest();
		expectAuthenticated('/mailboxes/mbx_1/docs');
		expect(sent.query['page']).toBe('2');
		expect(sent.query['per_page']).toBe('100');
		expect(sent.query['from']).toBe('2026-04-01');
		expect(sent.query['status']).toBe('parsed');
	});

	it('get reads one document', async () => {
		respond(parsedDocument);
		await invoke(Documents.get, { documentId: 'DOC_ID' });
		expectAuthenticated('/docs/DOC_ID');
	});

	it('reparse POSTs to the parse route', async () => {
		respond(parsingDocument);
		await invoke(Documents.reparse, { documentId: 'DOC_ID' });
		expectAuthenticated('/docs/DOC_ID/parse', 'POST');
	});

	it('skipMany POSTs the ids', async () => {
		respond(undefined, 204);
		const result = (await invoke(Documents.skipMany, {
			mailboxId: 'mbx_1',
			ids: ['DOC_ID', 'DOC_2'],
		})) as { count: number; success: boolean };
		expect(result).toEqual({ count: 2, success: true });
		expect(JSON.parse(lastRequest().body as string)).toEqual({
			ids: ['DOC_ID', 'DOC_2'],
		});
	});
});

describe('webhooks', () => {
	it('listForMailbox GETs the mailbox webhooks', async () => {
		respond([webhook]);
		const result = (await invoke(Webhooks.listForMailbox, {
			mailboxId: 'mbx_1',
			// unknown: webhook objects are provider-shaped.
		})) as unknown[];
		expect(result).toHaveLength(1);
		expectAuthenticated('/webhooks/mb/mbx_1');
	});

	it('get reads one webhook', async () => {
		respond(webhook);
		await invoke(Webhooks.get, { webhookId: 'wh_1' });
		expectAuthenticated('/webhooks/wh_1');
	});

	it('create POSTs the webhook body to the mailbox path', async () => {
		respond(webhook, 201);
		await invoke(Webhooks.create, {
			mailboxId: 'mbx_1',
			url: 'https://example.com/webhooks/parsio',
			event: 'doc.parsed',
			enabled: true,
		});
		const sent = lastRequest();
		expectAuthenticated('/webhooks/mbx_1', 'POST');
		expect(JSON.parse(sent.body as string)).toEqual({
			url: 'https://example.com/webhooks/parsio',
			event: 'doc.parsed',
			enabled: true,
		});
	});

	it('update POSTs the _id to /webhooks', async () => {
		respond(webhook);
		await invoke(Webhooks.update, { webhookId: 'wh_1', enabled: false });
		const sent = lastRequest();
		expectAuthenticated('/webhooks', 'POST');
		expect(JSON.parse(sent.body as string)).toEqual({
			_id: 'wh_1',
			enabled: false,
		});
	});

	it('delete DELETEs with the ids body', async () => {
		respond(undefined, 204);
		const result = (await invoke(Webhooks.remove, { ids: ['wh_1'] })) as {
			ids: string[];
			success: boolean;
		};
		expect(result).toEqual({ ids: ['wh_1'], success: true });
		expectAuthenticated('/webhooks', 'DELETE');
	});
});

describe('data', () => {
	it('getParsed GETs the parsed data with its filters', async () => {
		respond([{ doc_id: 'DOC_ID' }]);
		await invoke(Data.getParsed, {
			mailboxId: 'mbx_1',
			page: 1,
			to: '2026-04-02',
		});
		const sent = lastRequest();
		expectAuthenticated('/mailboxes/mbx_1/parsed');
		expect(sent.query['page']).toBe('1');
		expect(sent.query['to']).toBe('2026-04-02');
	});

	it('listEmails GETs the collected emails', async () => {
		respond([{ email: 'jane@example.com' }]);
		await invoke(Data.listEmails, { mailboxId: 'mbx_1' });
		expectAuthenticated('/mailboxes/mbx_1/emails');
	});
});
