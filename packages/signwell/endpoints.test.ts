import { logEventFromContext } from 'corsair/core';
import { SIGNWELL_API_BASE, SignwellAPIError, segment } from './client';
import {
	Account,
	ApiApplications,
	BulkSends,
	Documents,
	Me,
	Templates,
	Webhooks,
} from './endpoints';
import type { UnknownJson } from './json';
import {
	APPLICATION_ID,
	account,
	apiApplication,
	authErrorBody,
	bulkSend,
	bulkSendList,
	DOCUMENT_ID,
	document,
	me,
	TEMPLATE_ID,
	template,
	validationErrorBody,
	WEBHOOK_ID,
	webhook,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'signwell-test-token';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Each endpoint returns its own output type,
// so the shared return type is the widest one.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>; // unknown: per endpoint

// unknown: negative cases pass values no schema accepts, so the input has no
// static type at this call boundary.
function invoke(endpoint: AnyEndpoint, input: UnknownJson) {
	return endpoint({ key: API_KEY } as never, input as never);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(body: UnknownJson, status = 200) {
	// unknown: any response body
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

function respondEmpty(status = 204) {
	fetchMock.mockResolvedValueOnce(new Response(null, { status }));
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		origin: parsed.origin,
		path: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams),
		allQuery: parsed.searchParams,
		method: init.method,
		headers: new Headers(init.headers),
		// unknown: the request body is whatever the endpoint serialized.
		body: init.body
			? (JSON.parse(String(init.body)) as unknown) // unknown: parsed JSON
			: undefined,
	};
}

function expectAuthenticated() {
	const sent = lastRequest();
	expect(sent.origin).toBe('https://www.signwell.com');
	// SignWell uses a literal header, not a Bearer token.
	expect(sent.headers.get('x-api-key')).toBe(API_KEY);
	expect(sent.headers.get('authorization')).toBeNull();
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('me.get', () => {
	it('GETs v1/me with the API key header', async () => {
		respond(me);

		const result = await invoke(Me.get, {});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/api/v1/me',
			body: undefined,
		});
		expect(result).toMatchObject({ role: 'owner' });
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'signwell.me.get',
			{ role: 'owner' },
			'completed',
		);
	});

	it('keeps the request path relative to the api base', () => {
		expect(SIGNWELL_API_BASE).toBe('https://www.signwell.com/api');
	});
});

describe('account', () => {
	it('GETs v1/account', async () => {
		respond(account);

		const result = await invoke(Account.get, {});

		expect(lastRequest().path).toBe('/api/v1/account');
		expect(result).toMatchObject({ plan_tier: 'premium' });
	});

	it('PUTs only the fields supplied', async () => {
		respond(account);

		await invoke(Account.update, {
			name: 'Acme Corp',
			date_format: 'DD/MM/YYYY',
		});

		const sent = lastRequest();
		expect(sent.method).toBe('PUT');
		expect(sent.path).toBe('/api/v1/account');
		expect(sent.body).toEqual({ name: 'Acme Corp', date_format: 'DD/MM/YYYY' });
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'signwell.account.update',
			{ fields: 'date_format,name' },
			'completed',
		);
	});

	it('rejects a date format SignWell does not accept', async () => {
		await expect(
			invoke(Account.update, { date_format: 'ISO-8601' }),
		).rejects.toThrow(/date_format/);
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('documents.get', () => {
	it('encodes the id and returns the document', async () => {
		respond(document);

		const result = await invoke(Documents.get, { id: DOCUMENT_ID });

		expectAuthenticated();
		expect(lastRequest().path).toBe(`/api/v1/documents/${DOCUMENT_ID}`);
		expect(result).toMatchObject({ id: DOCUMENT_ID, status: 'Sent' });
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'signwell.documents.get',
			{ documentId: DOCUMENT_ID, status: 'Sent' },
			'completed',
		);
	});

	it('encodes a slash so an id cannot escape its path segment', () => {
		expect(segment('a/b')).toBe('a%2Fb');
	});
});

describe('documents.create', () => {
	it('POSTs the document body and the test-mode header', async () => {
		respond({ ...document, test_mode: true }, 201);

		const result = await invoke(Documents.create, {
			files: [{ name: 'offer.pdf', file_base64: 'JVBERi0xLjQK' }],
			recipients: [{ id: '1', name: 'Jane Doe', email: 'jane@example.com' }],
			name: 'Offer letter',
			test_mode: true,
		});

		const sent = lastRequest();
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe('/api/v1/documents');
		expect(sent.headers.get('x-testmode-enabled')).toBe('true');
		expect(sent.body).toEqual({
			files: [{ name: 'offer.pdf', file_base64: 'JVBERi0xLjQK' }],
			recipients: [{ id: '1', name: 'Jane Doe', email: 'jane@example.com' }],
			name: 'Offer letter',
			test_mode: true,
		});
		expect(result).toMatchObject({ id: DOCUMENT_ID, test_mode: true });
	});

	it('omits the test-mode header when test_mode is not set', async () => {
		respond(document, 201);

		await invoke(Documents.create, {
			files: [{ name: 'offer.pdf', file_url: 'https://acme.test/offer.pdf' }],
			recipients: [{ id: '1', name: 'Jane Doe', email: 'jane@example.com' }],
		});

		expect(lastRequest().headers.get('x-testmode-enabled')).toBeNull();
	});

	it('rejects a file with both file_url and file_base64', async () => {
		await expect(
			invoke(Documents.create, {
				files: [
					{
						name: 'offer.pdf',
						file_url: 'https://acme.test/offer.pdf',
						file_base64: 'JVBERi0xLjQK',
					},
				],
				recipients: [{ id: '1', name: 'Jane Doe', email: 'jane@example.com' }],
			}),
		).rejects.toThrow(/exactly one of file_url or file_base64/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a create with no recipients', async () => {
		await expect(
			invoke(Documents.create, {
				files: [{ name: 'offer.pdf', file_url: 'https://acme.test/a.pdf' }],
				recipients: [],
			}),
		).rejects.toThrow(/recipients/);
	});
});

describe('documents.createFromTemplate', () => {
	it('POSTs to the template documents route', async () => {
		respond(document, 201);

		await invoke(Documents.createFromTemplate, {
			template_id: TEMPLATE_ID,
			recipients: [{ id: '1', name: 'Jane Doe', email: 'jane@example.com' }],
		});

		expect(lastRequest().path).toBe('/api/v1/document_templates/documents');
		expect(lastRequest().body).toEqual({
			template_id: TEMPLATE_ID,
			recipients: [{ id: '1', name: 'Jane Doe', email: 'jane@example.com' }],
		});
	});

	it('rejects both template_id and template_ids together', async () => {
		await expect(
			invoke(Documents.createFromTemplate, {
				template_id: TEMPLATE_ID,
				template_ids: [TEMPLATE_ID],
				recipients: [{ id: '1', name: 'Jane Doe', email: 'jane@example.com' }],
			}),
		).rejects.toThrow(/exactly one of template_id or template_ids/);
	});
});

describe('documents.send', () => {
	it('POSTs to the send route with test mode carried over', async () => {
		respond({ ...document, status: 'Sent' }, 201);

		await invoke(Documents.send, {
			id: DOCUMENT_ID,
			test_mode: false,
			subject: 'Please sign',
		});

		const sent = lastRequest();
		expect(sent.path).toBe(`/api/v1/documents/${DOCUMENT_ID}/send`);
		expect(sent.headers.get('x-testmode-enabled')).toBe('false');
		expect(sent.body).toEqual({ subject: 'Please sign', test_mode: false });
	});
});

describe('documents.updateRecipients and updateAuthentication', () => {
	it('PATCHes recipients', async () => {
		respond(document);

		await invoke(Documents.updateRecipients, {
			id: DOCUMENT_ID,
			recipients: [
				{ id: '1', name: 'Jane Smith', email: 'jane.smith@example.com' },
			],
		});

		const sent = lastRequest();
		expect(sent.method).toBe('PATCH');
		expect(sent.path).toBe(`/api/v1/documents/${DOCUMENT_ID}/recipients`);
		expect(sent.body).toEqual({
			recipients: [
				{ id: '1', name: 'Jane Smith', email: 'jane.smith@example.com' },
			],
		});
	});

	it('PATCHes authentication without logging the passcode', async () => {
		respond(document);

		await invoke(Documents.updateAuthentication, {
			id: DOCUMENT_ID,
			recipients: [
				{
					id: '1',
					passcode: 'super-secret-passcode',
					passcode_delivery: { enabled: true },
				},
			],
		});

		expect(lastRequest().path).toBe(
			`/api/v1/documents/${DOCUMENT_ID}/authentication`,
		);
		const logged = JSON.stringify(mockLog.mock.calls);
		expect(logged).not.toContain('super-secret-passcode');
	});
});

describe('documents.sendReminder', () => {
	it('POSTs to the remind route', async () => {
		respond({ message: 'Reminder sent' }, 201);

		const result = await invoke(Documents.sendReminder, { id: DOCUMENT_ID });

		const sent = lastRequest();
		expect(sent.path).toBe(`/api/v1/documents/${DOCUMENT_ID}/remind`);
		expect(sent.body).toEqual({});
		expect(result).toMatchObject({ message: 'Reminder sent' });
	});

	it('sends the named recipients when given', async () => {
		respond({ message: 'ok' }, 201);

		await invoke(Documents.sendReminder, {
			id: DOCUMENT_ID,
			recipients: [{ email: 'jane@example.com' }],
		});

		expect(lastRequest().body).toEqual({
			recipients: [{ email: 'jane@example.com' }],
		});
	});
});

describe('documents.delete', () => {
	it('DELETEs the document and reports the id', async () => {
		respondEmpty();

		const result = await invoke(Documents.remove, { id: DOCUMENT_ID });

		expect(lastRequest()).toMatchObject({
			method: 'DELETE',
			path: `/api/v1/documents/${DOCUMENT_ID}`,
		});
		expect(result).toEqual({ id: DOCUMENT_ID, deleted: true });
	});

	it('throws when a delete answers a body', async () => {
		respond({ ok: true });

		await expect(invoke(Documents.remove, { id: DOCUMENT_ID })).rejects.toThrow(
			/documents this route as bodyless/,
		);
	});
});

describe('documents.getCompletedPdf', () => {
	it('asks for a download URL rather than the binary', async () => {
		respond({ file_url: 'https://www.signwell.com/download/abc' });

		const result = await invoke(Documents.getCompletedPdf, {
			id: DOCUMENT_ID,
			audit_page: true,
			file_format: 'zip',
		});

		const sent = lastRequest();
		expect(sent.path).toBe(`/api/v1/documents/${DOCUMENT_ID}/completed_pdf`);
		expect(sent.query).toEqual({
			url_only: 'true',
			audit_page: 'true',
			file_format: 'zip',
		});
		expect(result).toEqual({
			file_url: 'https://www.signwell.com/download/abc',
			document_id: DOCUMENT_ID,
		});
	});

	it('throws when SignWell returns no URL', async () => {
		respond({});

		await expect(
			invoke(Documents.getCompletedPdf, { id: DOCUMENT_ID }),
		).rejects.toThrow(/asked SignWell for a download URL/);
	});
});

describe('documents.getNom151Certificate', () => {
	it('asks for a download URL', async () => {
		respond({ file_url: 'https://www.signwell.com/nom151/abc.zip' });

		const result = await invoke(Documents.getNom151Certificate, {
			id: DOCUMENT_ID,
		});

		expect(lastRequest().query).toEqual({ url_only: 'true' });
		expect(result).toEqual({
			file_url: 'https://www.signwell.com/nom151/abc.zip',
			document_id: DOCUMENT_ID,
		});
	});
});

describe('templates', () => {
	it('GETs one template', async () => {
		respond(template);

		const result = await invoke(Templates.get, { id: TEMPLATE_ID });

		expect(lastRequest().path).toBe(
			`/api/v1/document_templates/${TEMPLATE_ID}`,
		);
		expect(result).toMatchObject({
			id: TEMPLATE_ID,
			name: 'Employment contract',
		});
	});

	it('POSTs a template with placeholders', async () => {
		respond(template, 201);

		await invoke(Templates.create, {
			files: [{ name: 'contract.pdf', file_url: 'https://acme.test/c.pdf' }],
			placeholders: [
				{ id: '1', name: 'Employee' },
				{ id: '2', name: 'Manager' },
			],
			name: 'Employment contract',
		});

		const sent = lastRequest();
		expect(sent.path).toBe('/api/v1/document_templates');
		expect(sent.body).toEqual({
			files: [{ name: 'contract.pdf', file_url: 'https://acme.test/c.pdf' }],
			placeholders: [
				{ id: '1', name: 'Employee' },
				{ id: '2', name: 'Manager' },
			],
			name: 'Employment contract',
		});
	});

	it('rejects a template with no placeholders', async () => {
		await expect(
			invoke(Templates.create, {
				files: [{ name: 'contract.pdf', file_url: 'https://acme.test/c.pdf' }],
				placeholders: [],
			}),
		).rejects.toThrow(/placeholders/);
	});

	it('PUTs the changes', async () => {
		respond(template);

		await invoke(Templates.update, {
			id: TEMPLATE_ID,
			name: 'Renamed',
		});

		const sent = lastRequest();
		expect(sent.method).toBe('PUT');
		expect(sent.path).toBe(`/api/v1/document_templates/${TEMPLATE_ID}`);
		expect(sent.body).toEqual({ name: 'Renamed' });
	});

	it('DELETEs the template', async () => {
		respondEmpty();

		const result = await invoke(Templates.remove, { id: TEMPLATE_ID });

		expect(result).toEqual({ id: TEMPLATE_ID, deleted: true });
	});
});

describe('webhooks', () => {
	it('wraps the bare webhook array', async () => {
		respond([webhook]);

		const result = await invoke(Webhooks.list, {});

		expect(lastRequest().path).toBe('/api/v1/hooks');
		expect(result).toEqual({ webhooks: [webhook] });
	});

	it('rejects a body that is not an array', async () => {
		respond({ webhooks: [] });

		await expect(invoke(Webhooks.list, {})).rejects.toThrow(
			'webhooks.list expected an array of webhooks from SignWell.',
		);
	});

	it('POSTs the callback URL and logs the id, not the URL', async () => {
		respond(webhook, 201);

		const result = await invoke(Webhooks.create, {
			callback_url: 'https://acme.test/hooks/signwell',
		});

		expect(lastRequest().body).toEqual({
			callback_url: 'https://acme.test/hooks/signwell',
		});
		expect(result).toEqual({ ...webhook });
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'signwell.webhooks.create',
			{ webhookId: WEBHOOK_ID },
			'completed',
		);
		const logged = JSON.stringify(mockLog.mock.calls);
		expect(logged).not.toContain('acme.test');
	});

	it('DELETEs the webhook', async () => {
		respondEmpty();

		const result = await invoke(Webhooks.remove, { id: WEBHOOK_ID });

		expect(lastRequest().path).toBe(`/api/v1/hooks/${WEBHOOK_ID}`);
		expect(result).toEqual({ id: WEBHOOK_ID, deleted: true });
	});
});

describe('apiApplications', () => {
	it('GETs one application', async () => {
		respond(apiApplication);

		const result = await invoke(ApiApplications.get, { id: APPLICATION_ID });

		expect(lastRequest().path).toBe(
			`/api/v1/api_applications/${APPLICATION_ID}`,
		);
		expect(result).toMatchObject({ id: APPLICATION_ID, name: 'Acme app' });
	});

	it('DELETEs the application', async () => {
		respondEmpty();

		const result = await invoke(ApiApplications.remove, { id: APPLICATION_ID });

		expect(result).toEqual({ id: APPLICATION_ID, deleted: true });
	});
});

describe('bulkSends', () => {
	it('lists with the paging query', async () => {
		respond(bulkSendList);

		const result = await invoke(BulkSends.list, { page: 2, limit: 25 });

		expect(lastRequest().path).toBe('/api/v1/bulk_sends');
		expect(lastRequest().query).toEqual({ page: '2', limit: '25' });
		expect(result).toMatchObject({ current_page: 1, total_pages: 2 });
	});

	it('reads one bulk send', async () => {
		respond(bulkSend);

		const result = await invoke(BulkSends.get, {
			id: '5a67dbd7-928a-4ea0-a7e2-e476a0eb045f',
		});

		expect(lastRequest().path).toBe(
			'/api/v1/bulk_sends/5a67dbd7-928a-4ea0-a7e2-e476a0eb045f',
		);
		expect(result).toMatchObject({ documents_count: 10 });
	});

	it('lists the documents of a bulk send', async () => {
		respond({
			id: '5a67dbd7-928a-4ea0-a7e2-e476a0eb045f',
			documents: [document],
			current_page: 1,
			next_page: null,
			previous_page: null,
			total_count: 1,
			total_pages: 1,
		});

		const result = await invoke(BulkSends.getDocuments, {
			id: '5a67dbd7-928a-4ea0-a7e2-e476a0eb045f',
			page: 1,
		});

		expect(lastRequest().query).toEqual({ page: '1' });
		expect(result).toMatchObject({ total_count: 1 });
	});

	it('POSTs a bulk send', async () => {
		respond(bulkSend, 201);

		await invoke(BulkSends.create, {
			template_ids: [TEMPLATE_ID],
			bulk_send_csv: 'bmFtZSxlbWFpbApUZXN0LHRlc3RAZXhhbXBsZS5jb20K',
		});

		expect(lastRequest().path).toBe('/api/v1/bulk_sends');
		expect(lastRequest().body).toEqual({
			template_ids: [TEMPLATE_ID],
			bulk_send_csv: 'bmFtZSxlbWFpbApUZXN0LHRlc3RAZXhhbXBsZS5jb20K',
		});
	});

	it('sends the CSV template ids as repeated template_ids[] parameters', async () => {
		respond({ data: 'Y29sdW1ucwo=' });

		await invoke(BulkSends.getCsvTemplate, {
			template_ids: [TEMPLATE_ID, 'd7315111-c671-4b15-8354-c9a19bbaefa1'],
		});

		const sent = lastRequest();
		expect(sent.path).toBe('/api/v1/bulk_sends/csv_template');
		expect(sent.allQuery.getAll('template_ids[]')).toEqual([
			TEMPLATE_ID,
			'd7315111-c671-4b15-8354-c9a19bbaefa1',
		]);
	});

	it('POSTs a CSV for validation', async () => {
		respond({
			bulk_send_csv: 'Y3N2',
			template_ids: [TEMPLATE_ID],
		});

		const result = await invoke(BulkSends.validateCsv, {
			template_ids: [TEMPLATE_ID],
			bulk_send_csv: 'Y3N2',
		});

		expect(lastRequest().path).toBe('/api/v1/bulk_sends/validate_csv');
		expect(result).toMatchObject({ template_ids: [TEMPLATE_ID] });
	});
});

describe('client error handling', () => {
	it('describes a 422 from its field errors', async () => {
		respond(validationErrorBody, 422);

		const error = await invoke(Documents.get, { id: DOCUMENT_ID }).catch(
			// unknown: a rejection reason has no static type; narrowed below.
			(caught: unknown) => caught, // unknown: rejection reason, narrowed below
		);

		expect(error).toBeInstanceOf(SignwellAPIError);
		const failure = error as SignwellAPIError;
		expect(failure.status).toBe(422);
		expect(failure.fieldErrors).toEqual({
			recipients: ['Recipient email is required'],
			'files[0]': ['Either file_url or file_base64 must be present'],
		});
		expect(failure.message).toContain(
			'recipients: Recipient email is required',
		);
	});

	it('classifies a 401 body code as an auth error', async () => {
		respond(authErrorBody, 401);

		const error = await invoke(Me.get, {}).catch(
			// unknown: a rejection reason has no static type; narrowed below.
			(caught: unknown) => caught, // unknown: rejection reason, narrowed below
		);

		const failure = error as SignwellAPIError;
		expect(failure.isAuthError).toBe(true);
		expect(failure.code).toBe('api_key_unauthorized_error');
	});

	it('keeps the API key out of util.inspect', async () => {
		respond(authErrorBody, 401);
		const util = await import('node:util');

		const error = await invoke(Me.get, {}).catch(
			// unknown: a rejection reason has no static type; narrowed below.
			(caught: unknown) => caught, // unknown: rejection reason, narrowed below
		);

		expect(util.inspect(error)).not.toContain(API_KEY);
		expect((error as Error).message).not.toContain(API_KEY);
	});
});
