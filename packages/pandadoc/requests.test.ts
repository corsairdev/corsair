import { logEventFromContext } from 'corsair/core';
import { Contacts, Documents, Folders, Templates, Webhooks } from './endpoints';
import {
	contact,
	createdDocument,
	document,
	documentFields,
	folder,
	sentDocument,
	templateDetails,
	templateListItem,
	webhookEvent,
	webhookSubscription,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'pd-test-key';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant.
// unknown: each endpoint returns its own output type, so the shared return
// has no narrower type.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts.
function invoke(endpoint: AnyEndpoint, input: unknown) {
	// The fake context only carries what the endpoints read (ctx.key).
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

// A binary response, as core builds it for responseType: 'binary'.
function respondBinary(bytes: Uint8Array, contentType: string) {
	fetchMock.mockResolvedValueOnce(
		new Response(new Blob([bytes]), {
			status: 200,
			headers: { 'Content-Type': contentType },
		}),
	);
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		origin: parsed.origin,
		path: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams),
		method: init.method,
		headers: new Headers(init.headers),
		body: init.body === undefined ? undefined : String(init.body),
	};
}

function expectAuthenticated() {
	const sent = lastRequest();
	expect(sent.origin).toBe('https://api.pandadoc.com');
	expect(sent.headers.get('authorization')).toBe(`API-Key ${API_KEY}`);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('documents', () => {
	it('list GETs documents with the filters it was given', async () => {
		respond({ results: [document] });

		const page = await invoke(Documents.list, {
			count: 25,
			page: 3,
			status: 2,
			statusNe: 4,
			deleted: false,
			q: 'contract',
			id: 'XjV64iXRJMerjSpk428QSF',
			folderUuid: 'Zugfh5DZNREisAVyLcVyCJ',
			templateId: 'ustHNnVaPCD6MzuoNBbZ8L',
			contactId: 'SyoufNkJiHRn24LpuJ7RXb',
			orderBy: '-date_created',
			createdFrom: '2024-01-01T00:00:00.000Z',
			completedTo: '2024-12-31T00:00:00.000Z',
			metadata: ['metadata_opportunity_id=2181432'],
			tag: 'legal',
		});
		// unknown: the shared invoke helper returns unknown, so each test
		// narrows to the fields it asserts on.
		expect((page as { results: unknown[] }).results).toHaveLength(1);

		const sent = lastRequest();
		expectAuthenticated();
		expect(sent.path).toBe('/public/v1/documents');
		expect(sent.query['count']).toBe('25');
		expect(sent.query['page']).toBe('3');
		expect(sent.query['status']).toBe('2');
		expect(sent.query['status__ne']).toBe('4');
		expect(sent.query['deleted']).toBe('false');
		expect(sent.query['q']).toBe('contract');
		expect(sent.query['id']).toBe('XjV64iXRJMerjSpk428QSF');
		expect(sent.query['folder_uuid']).toBe('Zugfh5DZNREisAVyLcVyCJ');
		expect(sent.query['template_id']).toBe('ustHNnVaPCD6MzuoNBbZ8L');
		expect(sent.query['contact_id']).toBe('SyoufNkJiHRn24LpuJ7RXb');
		expect(sent.query['order_by']).toBe('-date_created');
		expect(sent.query['created_from']).toBe('2024-01-01T00:00:00.000Z');
		expect(sent.query['completed_to']).toBe('2024-12-31T00:00:00.000Z');
		expect(sent.query['metadata']).toBe('metadata_opportunity_id=2181432');
		expect(sent.query['tag']).toBe('legal');
		expect(sent.body).toBeUndefined();
	});

	it('list omits unset filters', async () => {
		respond({ results: [] });
		await invoke(Documents.list, {});
		const sent = lastRequest();
		expect(`${sent.origin}${sent.path}`).toBe(
			'https://api.pandadoc.com/public/v1/documents',
		);
	});

	it('get reads one document by id', async () => {
		respond(document);
		await invoke(Documents.get, { id: 'XjV64iXRJMerjSpk428QSF' });

		const sent = lastRequest();
		expectAuthenticated();
		expect(sent.method).toBe('GET');
		expect(sent.path).toBe(
			'/public/v1/documents/XjV64iXRJMerjSpk428QSF/details',
		);
	});

	it('create posts the template body to documents', async () => {
		respond(createdDocument, 201);
		await invoke(Documents.create, {
			template_uuid: 'ustHNnVaPCD6MzuoNBbZ8L',
			name: 'Contract for Acme Corp',
			recipients: [{ email: 'jane@example.com', role: 'Signer' }],
			tokens: [{ name: 'cosigner', value: 'Mia' }],
			metadata: { opportunity_id: '2181432' },
		});

		const sent = lastRequest();
		expectAuthenticated();
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe('/public/v1/documents');
		// unknown: the request body is parsed JSON whose keys are
		// provider-defined, so the test narrows per assertion.
		const body = JSON.parse(sent.body as string) as Record<string, unknown>;
		expect(body['template_uuid']).toBe('ustHNnVaPCD6MzuoNBbZ8L');
		expect(body['recipients']).toEqual([
			{ email: 'jane@example.com', role: 'Signer' },
		]);
	});

	it('create posts the PDF URL body', async () => {
		respond(createdDocument, 201);
		await invoke(Documents.create, {
			url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
			name: 'From file',
		});
		// unknown: parsed JSON with provider-defined keys.
		const body = JSON.parse(lastRequest().body as string) as Record<
			string,
			unknown
		>;
		expect(body['url']).toContain('dummy.pdf');
		expect(body['name']).toBe('From file');
	});

	it('send posts to the send route with the message fields', async () => {
		respond(sentDocument);
		await invoke(Documents.send, {
			id: 'RsXrKarV524iCpjci9CMGa',
			message: 'Please sign',
			subject: 'Contract',
			silent: true,
			reply_to: 'sales@example.com',
			forwarding_settings: { forwarding_allowed: false },
		});

		const sent = lastRequest();
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe('/public/v1/documents/RsXrKarV524iCpjci9CMGa/send');
		// unknown: parsed JSON with provider-defined keys.
		const body = JSON.parse(sent.body as string) as Record<string, unknown>;
		expect(body['message']).toBe('Please sign');
		expect(body['silent']).toBe(true);
		expect(body['forwarding_settings']).toEqual({ forwarding_allowed: false });
		// The id must not leak into the body.
		expect(body['id']).toBeUndefined();
	});

	it('update PATCHes the document and accepts the documented empty 204', async () => {
		respond(undefined, 204);
		const result = await invoke(Documents.update, {
			id: 'RsXrKarV524iCpjci9CMGa',
			name: 'Renamed',
			tags: ['legal'],
		});
		expect(result).toEqual({ id: 'RsXrKarV524iCpjci9CMGa', success: true });
		const sent = lastRequest();
		expect(sent.method).toBe('PATCH');
		expect(sent.path).toBe('/public/v1/documents/RsXrKarV524iCpjci9CMGa');
		expect(JSON.parse(sent.body as string)).toEqual({
			name: 'Renamed',
			tags: ['legal'],
		});
	});

	it('delete DELETEs with the forever flag only when asked', async () => {
		respond(undefined, 204);
		const result = await invoke(Documents.remove, {
			id: 'RsXrKarV524iCpjci9CMGa',
			forever: true,
		});
		expect(result).toEqual({ id: 'RsXrKarV524iCpjci9CMGa', success: true });

		const sent = lastRequest();
		expect(sent.method).toBe('DELETE');
		expect(sent.path).toBe('/public/v1/documents/RsXrKarV524iCpjci9CMGa');
		expect(sent.query['forever']).toBe('true');
	});

	it('delete sends no forever flag by default', async () => {
		respond(undefined, 204);
		await invoke(Documents.remove, { id: 'RsXrKarV524iCpjci9CMGa' });
		expect('forever' in lastRequest().query).toBe(false);
	});

	it('download requests the binary PDF', async () => {
		respondBinary(new Uint8Array([0x25, 0x50, 0x44, 0x46]), 'application/pdf');
		const file = (await invoke(Documents.download, {
			id: 'RsXrKarV524iCpjci9CMGa',
			watermark_text: 'CONFIDENTIAL',
		})) as {
			contentType: string;
			byteLength: number;
			contentBase64: string;
			pending: boolean;
		};

		expect(file.pending).toBe(false);
		expect(file.contentType).toBe('application/pdf');
		expect(file.byteLength).toBe(4);
		expect(Buffer.from(file.contentBase64, 'base64').toString()).toBe('%PDF');

		const sent = lastRequest();
		expect(sent.path).toBe(
			'/public/v1/documents/RsXrKarV524iCpjci9CMGa/download',
		);
		expect(sent.query['watermark_text']).toBe('CONFIDENTIAL');
	});

	it('download reports a 202 render as pending, not as an empty file', async () => {
		respondBinary(new Uint8Array([]), 'application/pdf');
		const file = (await invoke(Documents.download, {
			id: 'RsXrKarV524iCpjci9CMGa',
		})) as { pending: boolean; contentBase64?: string };
		expect(file.pending).toBe(true);
		expect(file.contentBase64).toBeUndefined();
	});

	it('download refuses a non-PDF body instead of returning it as the file', async () => {
		respondBinary(new TextEncoder().encode('<html>oops</html>'), 'text/html');
		await expect(
			invoke(Documents.download, { id: 'RsXrKarV524iCpjci9CMGa' }),
		).rejects.toThrow('unexpected text/html');
	});

	it('downloadProtected requests the protected PDF', async () => {
		respondBinary(new Uint8Array([1, 2, 3]), 'application/pdf');
		const file = (await invoke(Documents.downloadProtected, {
			id: 'RsXrKarV524iCpjci9CMGa',
			separate_files: true,
		})) as { byteLength: number };
		expect(file.byteLength).toBe(3);
		const sent = lastRequest();
		expect(sent.path).toBe(
			'/public/v1/documents/RsXrKarV524iCpjci9CMGa/download-protected',
		);
		expect(sent.query['separate_files']).toBe('true');
	});

	it('listFields reads the document fields', async () => {
		respond(documentFields);
		const result = (await invoke(Documents.listFields, {
			id: 'RsXrKarV524iCpjci9CMGa',
			// unknown: field objects are provider-defined, so the cast keeps
			// them open.
		})) as { fields: unknown[] };
		expect(result.fields).toHaveLength(2);
		expect(lastRequest().path).toBe(
			'/public/v1/documents/RsXrKarV524iCpjci9CMGa/fields',
		);
	});

	it('createFields posts the field list', async () => {
		respond(documentFields);
		await invoke(Documents.createFields, {
			id: 'RsXrKarV524iCpjci9CMGa',
			fields: [
				{
					type: 'signature',
					layout: {
						page: 1,
						position: { offset_x: 10, offset_y: 20, anchor_point: 'topleft' },
						style: { width: 10, height: 5 },
					},
				},
			],
		});
		const sent = lastRequest();
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe(
			'/public/v1/documents/RsXrKarV524iCpjci9CMGa/fields',
		);
		// unknown: parsed JSON whose field list is provider-defined.
		const body = JSON.parse(sent.body as string) as { fields: unknown[] };
		expect(body.fields).toHaveLength(1);
	});

	it('move POSTs to the move-to-folder route', async () => {
		respond(undefined, 204);
		const result = (await invoke(Documents.move, {
			id: 'RsXrKarV524iCpjci9CMGa',
			folderId: 'Zugfh5DZNREisAVyLcVyCJ',
		})) as { id: string; folderId: string; success: boolean };
		expect(result).toEqual({
			id: 'RsXrKarV524iCpjci9CMGa',
			folderId: 'Zugfh5DZNREisAVyLcVyCJ',
			success: true,
		});
		expect(lastRequest().path).toBe(
			'/public/v1/documents/RsXrKarV524iCpjci9CMGa/move-to-folder/Zugfh5DZNREisAVyLcVyCJ',
		);
	});
});

describe('templates', () => {
	it('list GETs templates with its filters', async () => {
		respond({ results: [templateListItem] });
		await invoke(Templates.list, {
			count: 10,
			q: 'nda',
			shared: true,
			fields: ['content_date_modified'],
		});

		const sent = lastRequest();
		expect(sent.path).toBe('/public/v1/templates');
		expect(sent.query['count']).toBe('10');
		expect(sent.query['q']).toBe('nda');
		expect(sent.query['shared']).toBe('true');
		expect(sent.query['fields']).toBe('content_date_modified');
	});

	it('get reads template details', async () => {
		respond(templateDetails);
		await invoke(Templates.get, { id: 'ustHNnVaPCD6MzuoNBbZ8L' });
		expect(lastRequest().path).toBe(
			'/public/v1/templates/ustHNnVaPCD6MzuoNBbZ8L/details',
		);
	});

	it('delete DELETEs the template', async () => {
		respond(undefined, 204);
		const result = (await invoke(Templates.remove, {
			id: 'ustHNnVaPCD6MzuoNBbZ8L',
		})) as { id: string; success: boolean };
		expect(result).toEqual({ id: 'ustHNnVaPCD6MzuoNBbZ8L', success: true });
		expect(lastRequest().method).toBe('DELETE');
	});
});

describe('contacts', () => {
	it('list filters by email', async () => {
		respond({ results: [contact] });
		await invoke(Contacts.list, { email: 'nobody@example.com' });
		const sent = lastRequest();
		expect(sent.path).toBe('/public/v1/contacts');
		expect(sent.query['email']).toBe('nobody@example.com');
	});

	it('get reads one contact', async () => {
		respond(contact);
		await invoke(Contacts.get, { id: 'SyoufNkJiHRn24LpuJ7RXb' });
		expect(lastRequest().path).toBe(
			'/public/v1/contacts/SyoufNkJiHRn24LpuJ7RXb',
		);
	});

	it('create posts the contact body', async () => {
		respond(contact, 201);
		await invoke(Contacts.create, {
			email: 'nobody@example.com',
			first_name: 'FName',
			last_name: 'LName',
		});
		const sent = lastRequest();
		expect(sent.method).toBe('POST');
		expect(JSON.parse(sent.body as string)).toEqual({
			email: 'nobody@example.com',
			first_name: 'FName',
			last_name: 'LName',
		});
	});

	it('update PATCHes the contact without touching the email', async () => {
		respond(contact);
		await invoke(Contacts.update, {
			id: 'SyoufNkJiHRn24LpuJ7RXb',
			job_title: 'Director',
		});
		const sent = lastRequest();
		expect(sent.method).toBe('PATCH');
		expect(sent.path).toBe('/public/v1/contacts/SyoufNkJiHRn24LpuJ7RXb');
		expect(JSON.parse(sent.body as string)).toEqual({ job_title: 'Director' });
	});

	it('delete DELETEs the contact', async () => {
		respond(undefined, 204);
		const result = (await invoke(Contacts.remove, {
			id: 'SyoufNkJiHRn24LpuJ7RXb',
		})) as { id: string; success: boolean };
		expect(result).toEqual({ id: 'SyoufNkJiHRn24LpuJ7RXb', success: true });
	});
});

describe('folders', () => {
	it('list GETs folders under a parent', async () => {
		respond({ results: [folder] });
		await invoke(Folders.list, {
			parentUuid: 'Zugfh5DZNREisAVyLcVyCJ',
			page: 2,
		});
		const sent = lastRequest();
		expect(sent.path).toBe('/public/v1/documents/folders');
		expect(sent.query['parent_uuid']).toBe('Zugfh5DZNREisAVyLcVyCJ');
		expect(sent.query['page']).toBe('2');
	});

	it('create posts the folder body', async () => {
		respond(folder, 201);
		await invoke(Folders.create, { name: 'Contracts' });
		expect(JSON.parse(lastRequest().body as string)).toEqual({
			name: 'Contracts',
		});
	});

	it('rename PUTs the new name', async () => {
		respond({ ...folder, name: 'Signed' });
		await invoke(Folders.rename, {
			id: 'Zugfh5DZNREisAVyLcVyCJ',
			name: 'Signed',
		});
		const sent = lastRequest();
		expect(sent.method).toBe('PUT');
		expect(sent.path).toBe(
			'/public/v1/documents/folders/Zugfh5DZNREisAVyLcVyCJ',
		);
		expect(JSON.parse(sent.body as string)).toEqual({ name: 'Signed' });
	});
});

describe('webhooks', () => {
	it('listSubscriptions GETs the subscriptions', async () => {
		respond({ items: [webhookSubscription] });
		const result = (await invoke(Webhooks.listSubscriptions, {})) as {
			// unknown: subscription objects are provider-defined, so the cast
			// keeps them open.
			items: unknown[];
		};
		expect(result.items).toHaveLength(1);
		expect(lastRequest().path).toBe('/public/v1/webhook-subscriptions');
	});

	it('createSubscription POSTs the subscription body', async () => {
		respond(webhookSubscription, 201);
		await invoke(Webhooks.createSubscription, {
			name: 'Deal desk deliveries',
			url: 'https://example.com/webhooks/pandadoc',
			triggers: ['document_state_changed'],
			payload: ['metadata'],
		});
		const sent = lastRequest();
		expect(sent.method).toBe('POST');
		expect(JSON.parse(sent.body as string)).toEqual({
			name: 'Deal desk deliveries',
			url: 'https://example.com/webhooks/pandadoc',
			triggers: ['document_state_changed'],
			payload: ['metadata'],
		});
	});

	it('deleteSubscription DELETEs by uuid', async () => {
		respond(undefined, 204);
		const result = (await invoke(Webhooks.deleteSubscription, {
			id: 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5e',
		})) as { id: string; success: boolean };
		expect(result).toEqual({
			id: 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5e',
			success: true,
		});
	});

	it('getEvent reads one event by id', async () => {
		respond(webhookEvent);
		await invoke(Webhooks.getEvent, {
			id: 'd0c1b2a3-4e5f-6a7b-8c9d-0e1f2a3b4c5f',
		});
		expect(lastRequest().path).toBe(
			'/public/v1/webhook-events/d0c1b2a3-4e5f-6a7b-8c9d-0e1f2a3b4c5f',
		);
	});
});
