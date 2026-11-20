import { logEventFromContext } from 'corsair/core';
import { Contacts, Documents, Folders, Templates, Webhooks } from './endpoints';
import {
	contact,
	createdDocument,
	document,
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

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('document output parsing', () => {
	it('parses a list page and keeps null dates as null', async () => {
		respond({
			results: [document, { ...document, id: 'b2', date_sent: null }],
		});
		const page = (await invoke(Documents.list, { page: 1 })) as {
			results: Array<{ id: string; date_sent: string | null }>;
		};
		expect(page.results).toHaveLength(2);
		expect(page.results[1]?.date_sent).toBeNull();
	});

	it('parses document details with recipients and tokens', async () => {
		respond(document);
		const doc = (await invoke(Documents.get, {
			id: 'XjV64iXRJMerjSpk428QSF',
		})) as { uuid: string; recipients: Array<{ email: string }> };
		expect(doc.uuid).toBeDefined();
		expect(doc.recipients[0]?.email).toBe('jane@example.com');
	});

	it('parses a created document in create_pending', async () => {
		respond(createdDocument, 201);
		const doc = (await invoke(Documents.create, {
			template_uuid: 'ustHNnVaPCD6MzuoNBbZ8L',
			recipients: [{ email: 'jane@example.com' }],
		})) as { status: string };
		expect(doc.status).toBe('document.create_pending');
	});

	it('parses a sent document', async () => {
		respond(sentDocument);
		const doc = (await invoke(Documents.send, {
			id: 'RsXrKarV524iCpjci9CMGa',
			message: 'Sign please',
		})) as { status: string };
		expect(doc.status).toBe('document.sent');
	});

	it('rejects a document with no id', async () => {
		respond({ name: 'No id', status: 'document.draft' });
		await rejects(Documents.get, { id: 'x' }, 'id');
	});

	it('rejects a list page whose results are bare strings', async () => {
		respond({ results: ['row1', 'row2'] });
		await rejects(Documents.list, {}, 'expected object');
	});
});

describe('document input validation', () => {
	it('rejects a create with neither template_uuid nor url', async () => {
		await rejects(
			Documents.create,
			{ name: 'no source' },
			'template_uuid (create from template) or url',
		);
	});

	it('rejects a create with both template_uuid and url', async () => {
		await rejects(
			Documents.create,
			{
				template_uuid: 'ustHNnVaPCD6MzuoNBbZ8L',
				url: 'https://example.com/file.pdf',
				recipients: [{ email: 'jane@example.com' }],
			},
			'not both',
		);
	});

	it('rejects a template create without recipients', async () => {
		await rejects(
			Documents.create,
			{ template_uuid: 'ustHNnVaPCD6MzuoNBbZ8L' },
			'recipients is required',
		);
	});

	it('rejects a PDF create without a name', async () => {
		await rejects(
			Documents.create,
			{ url: 'https://example.com/file.pdf' },
			'name is required',
		);
	});

	it('rejects a list whose metadata filter lacks the prefix', async () => {
		await rejects(
			Documents.list,
			{ metadata: ['opportunity_id=2181432'] },
			'metadata_key=value',
		);
	});

	it('rejects a list whose createdTo precedes createdFrom', async () => {
		await rejects(
			Documents.list,
			{
				createdFrom: '2024-02-01T00:00:00.000Z',
				createdTo: '2024-01-01T00:00:00.000Z',
			},
			'must not be earlier',
		);
	});

	it('rejects a count above the documented maximum', async () => {
		await rejects(Documents.list, { count: 101 }, '100');
	});

	it('rejects a download watermark opacity outside 0-100', async () => {
		await rejects(
			Documents.download,
			{ id: 'x', watermark_opacity: 150 },
			'100',
		);
	});

	it('rejects a field whose type the API does not document', async () => {
		await rejects(
			Documents.createFields,
			{
				id: 'x',
				fields: [
					{
						type: 'stamp_plus',
						layout: {
							page: 1,
							position: { offset_x: 1, offset_y: 1, anchor_point: 'top_left' },
							style: { width: 2, height: 2 },
						},
					},
				],
			},
			'type',
		);
	});
});

describe('template output parsing', () => {
	it('parses a template page', async () => {
		respond({ results: [templateListItem] });
		const page = (await invoke(Templates.list, {})) as {
			results: Array<{ id: string }>;
		};
		expect(page.results[0]?.id).toBe('ustHNnVaPCD6MzuoNBbZ8L');
	});

	it('parses template details with roles and tokens', async () => {
		respond(templateDetails);
		const template = (await invoke(Templates.get, {
			id: 'ustHNnVaPCD6MzuoNBbZ8L',
			// unknown: the fixture carries provider-defined field definitions,
			// so the cast keeps them open rather than naming them wrong.
		})) as { roles: Array<{ name?: string }>; tokens: unknown[] };
		expect(template.roles[0]?.name).toBe('Signer');
		expect(template.tokens).toHaveLength(1);
	});
});

describe('contact output parsing', () => {
	it('parses a contact with all fields', async () => {
		respond(contact);
		const parsed = (await invoke(Contacts.get, {
			id: 'SyoufNkJiHRn24LpuJ7RXb',
		})) as { email: string; company: string | null };
		expect(parsed.email).toBe('nobody@example.com');
	});

	it('rejects a contact with no id', async () => {
		respond({ email: 'nobody@example.com' });
		await rejects(Contacts.get, { id: 'x' }, 'id');
	});

	it('rejects a create with neither email nor a name', async () => {
		await rejects(
			Contacts.create,
			{ company: 'Acme' },
			'email address or a first/last name',
		);
	});
});

describe('folder output parsing', () => {
	it('parses a folder page', async () => {
		respond({ results: [folder] });
		const page = (await invoke(Folders.list, {})) as {
			results: Array<{ uuid: string }>;
		};
		expect(page.results[0]?.uuid).toBe('Zugfh5DZNREisAVyLcVyCJ');
	});

	it('rejects a folder with no uuid', async () => {
		respond({ results: [{ name: 'No uuid' }] });
		await rejects(Folders.list, {}, 'uuid');
	});
});

describe('webhook endpoint output parsing', () => {
	it('parses the subscriptions list with a shared key', async () => {
		respond({ items: [webhookSubscription] });
		const result = (await invoke(Webhooks.listSubscriptions, {})) as {
			items: Array<{ shared_key?: string }>;
		};
		expect(result.items[0]?.shared_key).toBe('whsec_shared_key_value');
	});

	it('parses a webhook event', async () => {
		respond(webhookEvent);
		const event = (await invoke(Webhooks.getEvent, { id: 'd0' })) as {
			event: string;
		};
		expect(event.event).toBe('document_state_changed');
	});
});

describe('204 responses', () => {
	it('rejects a delete that answers a body instead of the documented 204', async () => {
		respond({ message: 'not really deleted' });
		await rejects(Documents.remove, { id: 'x' }, 'unexpected body');
	});

	it('rejects a move that answers a body', async () => {
		respond({ ok: true });
		await rejects(
			Documents.move,
			{ id: 'x', folderId: 'f' },
			'unexpected body',
		);
	});

	it('accepts an empty 204 for a delete', async () => {
		respond(undefined, 204);
		const result = (await invoke(Documents.remove, { id: 'x' })) as {
			success: boolean;
		};
		expect(result.success).toBe(true);
	});
});
