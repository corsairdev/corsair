import { ApiError } from 'corsair/http';
import {
	MONEYBIRD_RATE_LIMIT_CONFIG,
	moneybirdErrorMessage,
	resolveAdministrationId,
} from './client';
import { moneybirdEndpointsNested } from './endpoints/catalog';
import {
	moneybirdDefinitions,
	moneybirdOperations,
} from './endpoints/manifest';
import {
	fileNameFor,
	isUsableFile,
	nextPageOf,
	queryEntries,
} from './endpoints/operations';
import type { MoneybirdContext } from './index';

// Every call goes through the real client and core transport; only fetch is fake.

type Captured = {
	url: string;
	method: string;
	headers: Record<string, string>;
	// `unknown` because the sent body is a JSON string or a FormData.
	body: unknown;
};

let calls: Captured[] = [];

function reply(
	status: number,
	// `unknown` because each case answers its own JSON body.
	body: unknown,
	contentType = 'application/json',
	extraHeaders: Record<string, string> = {},
) {
	jest.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
		const headers: Record<string, string> = {};
		new Headers(init?.headers).forEach((value, key) => {
			headers[key] = value;
		});
		calls.push({
			url: String(input),
			method: init?.method ?? 'GET',
			headers,
			body: init?.body,
		});
		const payload =
			body instanceof Uint8Array
				? body
				: body === undefined
					? null
					: JSON.stringify(body);
		return new Response(payload, {
			status,
			headers: {
				...(body === undefined ? {} : { 'content-type': contentType }),
				...extraHeaders,
			},
		});
	});
}

/** A reply with a raw body string (or none) and a content type. */
function replyRaw(status: number, text: string | null, contentType?: string) {
	jest.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
		calls.push({
			url: String(input),
			method: init?.method ?? 'GET',
			headers: {},
			body: init?.body,
		});
		return new Response(text, {
			status,
			headers: contentType ? { 'content-type': contentType } : {},
		});
	});
}

// jest-yaml-transform turns the yaml into a plain object.
const docs = require('./plugin-docs.yaml') as {
	// `unknown` because example args are free-form YAML values.
	apiExamples: Record<string, { args: Record<string, unknown> }>;
};

const ADMIN = '123456789';

function ctx(
	administrationId: string | undefined = ADMIN,
	stored: string | null = '987654321',
): MoneybirdContext {
	return {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: 'mb_test_token',
		options: administrationId ? { administrationId } : {},
		keys: {
			get_api_key: () => Promise.resolve('mb_test_token'),
			get_administration_id: () => Promise.resolve(stored),
		},
		db: {},
		// `unknown` because a test context fills only the fields the endpoints read.
	} as unknown as MoneybirdContext;
}

// `unknown` because the endpoint tree holds functions of many input types.
type AnyEndpoint = (ctx: MoneybirdContext, input: unknown) => Promise<unknown>;

function endpointFor(id: string): AnyEndpoint {
	// `unknown` because the walk goes through nested groups of endpoints.
	let node: unknown = moneybirdEndpointsNested;
	for (const part of id.split('.')) {
		node = (node as Record<string, unknown>)[part];
	}
	if (typeof node !== 'function') throw new Error(`no endpoint ${id}`);
	return node as AnyEndpoint;
}

const BASE = 'https://moneybird.com/api/v2';

beforeEach(() => {
	calls = [];
});

afterEach(() => {
	jest.restoreAllMocks();
	jest.useRealTimers();
});

describe('requests', () => {
	it('sends a GET under the administration with Bearer auth', async () => {
		reply(200, { id: '7', company_name: 'Beachy BV' });
		const out = await endpointFor('contacts.get')(ctx(), { id: '7' });
		expect(out).toEqual({ id: '7', company_name: 'Beachy BV' });
		expect(calls[0]?.url).toBe(`${BASE}/${ADMIN}/contacts/7.json`);
		expect(calls[0]?.method).toBe('GET');
		expect(calls[0]?.headers.authorization).toBe('Bearer mb_test_token');
	});

	it('lists administrations above the administration scope', async () => {
		reply(200, [{ id: '1', name: 'Books' }]);
		await endpointFor('administrations.list')(ctx(undefined, null), {});
		expect(calls[0]?.url).toBe(`${BASE}/administrations.json`);
	});

	it('takes the administration from the call, then options, then the account', async () => {
		reply(200, []);
		await endpointFor('taxRates.list')(ctx(), { administration_id: '555' });
		await endpointFor('taxRates.list')(ctx(), {});
		await endpointFor('taxRates.list')(ctx(''), {});
		expect(calls.map((call) => new URL(call.url).pathname)).toEqual([
			'/api/v2/555/tax_rates.json',
			`/api/v2/${ADMIN}/tax_rates.json`,
			'/api/v2/987654321/tax_rates.json',
		]);
	});

	it('asks for an administration id before sending anything', async () => {
		reply(200, []);
		await expect(
			endpointFor('taxRates.list')(ctx('', null), {}),
		).rejects.toThrow(/administration id is required/);
		expect(calls).toHaveLength(0);
	});

	it('refuses an administration id that is not digits', async () => {
		await expect(
			resolveAdministrationId(
				{ key: 'k', options: { administrationId: '../123' }, keys: {} },
				undefined,
			),
		).rejects.toThrow(/digit string/);
		reply(200, []);
		await expect(
			endpointFor('taxRates.list')(ctx(), { administration_id: '1/../2' }),
		).rejects.toThrow(/Invalid input/);
		expect(calls).toHaveLength(0);
	});

	it('accepts ids as digit strings or numbers and refuses anything else', async () => {
		reply(200, { id: '7' });
		await endpointFor('contacts.get')(ctx(), { id: 7 });
		expect(calls[0]?.url).toBe(`${BASE}/${ADMIN}/contacts/7.json`);
		await expect(
			endpointFor('contacts.get')(ctx(), { id: '7/../../x' }),
		).rejects.toThrow(/Invalid input/);
		expect(calls).toHaveLength(1);
	});

	it('encodes free-text path values', async () => {
		reply(200, { id: '9' });
		await endpointFor('salesInvoices.getByReference')(ctx(), {
			reference: 'PO 42/../x',
		});
		expect(calls[0]?.url).toBe(
			`${BASE}/${ADMIN}/sales_invoices/find_by_reference/PO%2042%2F..%2Fx.json`,
		);
	});

	it('sends the wrapped body as documented and keeps path ids out of it', async () => {
		reply(201, { id: '9' });
		await endpointFor('contacts.contactPeople.create')(ctx(), {
			contact_id: '12',
			contact_person: { firstname: 'Jana', lastname: 'Berger' },
		});
		expect(calls[0]?.url).toBe(
			`${BASE}/${ADMIN}/contacts/12/contact_people.json`,
		);
		expect(calls[0]?.method).toBe('POST');
		expect(calls[0]?.headers['content-type']).toBe('application/json');
		expect(JSON.parse(String(calls[0]?.body))).toEqual({
			contact_person: { firstname: 'Jana', lastname: 'Berger' },
		});
	});

	it('refuses a body field Moneybird does not document', async () => {
		reply(201, { id: '9' });
		await expect(
			endpointFor('contacts.create')(ctx(), {
				contact: { company_name: 'Beachy BV', not_a_field: true },
			}),
		).rejects.toThrow(/Invalid input for moneybird contacts.create/);
		await expect(
			endpointFor('contacts.create')(ctx(), { company_name: 'Beachy BV' }),
		).rejects.toThrow(/contact: Invalid input/);
		expect(calls).toHaveLength(0);
	});

	it('writes list query values the way Rails reads them', async () => {
		expect(queryEntries('includes', ['a', 'b'])).toEqual({
			'includes[]': ['a', 'b'],
		});
		expect(queryEntries('page', 2)).toEqual({ page: 2 });
		reply(200, { id: '4' });
		await endpointFor('estimates.get')(ctx(), {
			id: '4',
			includes: ['notes', 'attachments'],
		});
		const url = new URL(String(calls[0]?.url));
		expect(url.searchParams.getAll('includes[]')).toEqual([
			'notes',
			'attachments',
		]);
	});

	it('passes a list filter through the query string', async () => {
		reply(200, []);
		await endpointFor('salesInvoices.list')(ctx(), {
			filter: 'state:open|late,period:this_year',
			per_page: 100,
		});
		const url = new URL(String(calls[0]?.url));
		expect(url.pathname).toBe(`/api/v2/${ADMIN}/sales_invoices.json`);
		expect(url.searchParams.get('filter')).toBe(
			'state:open|late,period:this_year',
		);
		expect(url.searchParams.get('per_page')).toBe('100');
	});

	it('sends a sales invoice with the sending options as a PATCH', async () => {
		reply(200, { id: '77', state: 'open' });
		await endpointFor('salesInvoices.send')(ctx(), {
			id: '77',
			sales_invoice_sending: {
				delivery_method: 'Email',
				email_address: 'billing@example.com',
			},
		});
		expect(calls[0]?.method).toBe('PATCH');
		expect(calls[0]?.url).toBe(
			`${BASE}/${ADMIN}/sales_invoices/77/send_invoice.json`,
		);
		expect(JSON.parse(String(calls[0]?.body))).toEqual({
			sales_invoice_sending: {
				delivery_method: 'Email',
				email_address: 'billing@example.com',
			},
		});
	});

	it('uploads an attachment as multipart', async () => {
		reply(200, 200);
		await endpointFor('salesInvoices.attachments.create')(ctx(), {
			id: '8',
			file: {
				base64: Buffer.from('%PDF-1.4').toString('base64'),
				filename: 'r.pdf',
			},
		});
		expect(calls[0]?.method).toBe('POST');
		expect(calls[0]?.url).toBe(
			`${BASE}/${ADMIN}/sales_invoices/8/attachments.json`,
		);
		expect(calls[0]?.body).toBeInstanceOf(FormData);
		expect((calls[0]?.body as FormData).get('file')).toBeInstanceOf(Blob);
	});
});

describe('responses', () => {
	it('returns a list page as items with the next page number', async () => {
		reply(
			200,
			Array.from({ length: 2 }, (_, i) => ({ id: String(i + 1) })),
		);
		const full = await endpointFor('contacts.list')(ctx(), {
			page: 3,
			per_page: 2,
		});
		expect(full).toEqual({
			items: [{ id: '1' }, { id: '2' }],
			next_page: 4,
		});
		expect(new URL(String(calls[0]?.url)).searchParams.get('page')).toBe('3');
	});

	it('asks for 100 when per_page is left out, so a full page means more', async () => {
		// Moneybird's own default differs per route (30 for task lists); a
		// full default page must not read as the last one.
		reply(200, [{ id: '1' }]);
		const last = await endpointFor('taskLists.list')(ctx(), {});
		expect(last).toEqual({ items: [{ id: '1' }], next_page: null });
		expect(new URL(String(calls[0]?.url)).searchParams.get('per_page')).toBe(
			'100',
		);
		reply(
			200,
			Array.from({ length: 100 }, (_, i) => ({ id: String(i) })),
		);
		const full = (await endpointFor('products.list')(ctx(), {})) as {
			next_page: number | null;
		};
		expect(full.next_page).toBe(2);
		expect(nextPageOf({}, 100)).toBe(2);
		expect(nextPageOf({}, 99)).toBeNull();
		expect(nextPageOf({ page: '4', per_page: '10' }, 10)).toBe(5);
	});

	it('keeps paging duplicate contacts while a page has groups', async () => {
		// contacts.listDuplicates takes no per_page and Moneybird sizes its pages
		// by contacts, not by the groups it returns: only an empty page is the last.
		reply(200, [{ contacts: [{ id: '1' }, { id: '2' }] }]);
		const first = await endpointFor('contacts.listDuplicates')(ctx(), {
			page: 2,
		});
		expect(first).toEqual({
			items: [{ contacts: [{ id: '1' }, { id: '2' }] }],
			next_page: 3,
		});
		const url = new URL(String(calls[0]?.url));
		expect(url.searchParams.get('page')).toBe('2');
		expect(url.searchParams.has('per_page')).toBe(false);
		reply(200, []);
		await expect(
			endpointFor('contacts.listDuplicates')(ctx(), { page: 3 }),
		).resolves.toEqual({ items: [], next_page: null });
	});

	it('returns a bare list for routes Moneybird does not page', async () => {
		reply(200, [{ id: '1', name: 'Revenue' }]);
		await expect(
			endpointFor('ledgerAccounts.list')(ctx(), {}),
		).resolves.toEqual([{ id: '1', name: 'Revenue' }]);
	});

	it('answers success for a delete with no body', async () => {
		reply(204, undefined);
		await expect(
			endpointFor('contacts.delete')(ctx(), { id: '4' }),
		).resolves.toEqual({ success: true });
		expect(calls[0]?.method).toBe('DELETE');
		expect(calls[0]?.url).toBe(`${BASE}/${ADMIN}/contacts/4.json`);
	});

	it('returns the status code a document delete answers with', async () => {
		// The spec documents a 200 with an integer body for document deletes.
		reply(200, 200);
		await expect(
			endpointFor('documents.receipts.delete')(ctx(), { id: '4' }),
		).resolves.toBe(200);
	});

	it('answers success for a 204 on an action route', async () => {
		reply(204, undefined);
		await expect(
			endpointFor('contacts.archive')(ctx(), { id: '4' }),
		).resolves.toEqual({ success: true });
		expect(calls[0]?.method).toBe('PATCH');
		expect(calls[0]?.url).toBe(`${BASE}/${ADMIN}/contacts/4/archive.json`);
	});

	it('refuses a body that is not JSON instead of calling it a success', async () => {
		replyRaw(200, '{"email":"person@exam', 'application/json');
		const error = (await endpointFor('documents.receipts.delete')(ctx(), {
			id: '3',
		}).catch((e: unknown) => e)) as Error;
		expect(error.message).toBe(
			'Moneybird documents.receipts.delete answered with a body that is not JSON',
		);
		expect(error.message).not.toContain('person');
	});

	it('refuses a body that does not match the documented response', async () => {
		reply(200, 'not json at all', 'text/plain');
		await expect(
			endpointFor('contacts.get')(ctx(), { id: '1' }),
		).rejects.toThrow(/did not match its documented schema/);
	});

	it('keeps fields Moneybird adds and accepts documented nulls', async () => {
		reply(200, {
			id: '77',
			contact_id: '12',
			invoice_id: null,
			details: [{ id: '1', description: 'Design', price: '100.0' }],
			a_new_field: true,
		});
		const invoice = (await endpointFor('salesInvoices.get')(ctx(), {
			id: '77',
		})) as Record<string, unknown>;
		expect(invoice.a_new_field).toBe(true);
		expect(invoice.invoice_id).toBeNull();
	});
});

describe('downloads', () => {
	it('follows the redirect and returns the PDF as a file', async () => {
		reply(200, new Uint8Array([37, 80, 68, 70]), 'application/pdf');
		const out = (await endpointFor('salesInvoices.downloadPdf')(ctx(), {
			id: '77',
		})) as { filename?: string; contentType?: string; byteLength?: number };
		// No `.json` on file routes: the format suffix picks the JSON answer.
		expect(calls[0]?.url).toBe(
			`${BASE}/${ADMIN}/sales_invoices/77/download_pdf`,
		);
		expect(out).toMatchObject({
			contentType: 'application/pdf',
			byteLength: 4,
			filename: 'moneybird-sales-invoices-download-pdf-77.pdf',
		});
	});

	it('returns UBL as an XML file', async () => {
		reply(
			200,
			new TextEncoder().encode('<?xml version="1.0"?><Invoice/>'),
			'application/xml',
		);
		const out = (await endpointFor('salesInvoices.downloadUbl')(ctx(), {
			id: '77',
		})) as { filename?: string };
		expect(out.filename).toBe('moneybird-sales-invoices-download-ubl-77.xml');
	});

	it.each([
		['an empty body', new Uint8Array(), 'application/pdf'],
		[
			'an HTML page',
			new TextEncoder().encode('<!doctype html><p>Sign in</p>'),
			'text/html',
		],
		[
			'bytes that are not a PDF',
			new TextEncoder().encode('not a pdf'),
			'application/pdf',
		],
	])('refuses %s on a PDF route', async (_what, bytes, type) => {
		reply(200, bytes, type);
		await expect(
			endpointFor('salesInvoices.downloadPdf')(ctx(), { id: '77' }),
		).rejects.toThrow(
			'Moneybird salesInvoices.downloadPdf answered without a file',
		);
	});

	it('accepts any non-HTML bytes for an attachment', () => {
		const png = new Uint8Array([137, 80, 78, 71]);
		expect(
			isUsableFile('salesInvoices.attachments.download', png, 'image/png'),
		).toBe(true);
		expect(
			fileNameFor(
				'salesInvoices.attachments.download',
				{ sales_invoice_id: '1', id: '9' },
				'image/png',
			),
		).toBe('moneybird-sales-invoices-attachments-download-9.png');
	});
});

describe('errors', () => {
	it('keeps the status and Moneybird reason and drops the request data', async () => {
		reply(422, {
			error: {
				company_name: ['is required'],
				email: ['Secret Person is taken'],
			},
			details: { company_name: [{ error: 'required' }] },
		});
		const error = (await endpointFor('contacts.create')(ctx(), {
			contact: { firstname: 'Secret', lastname: 'Person' },
		}).catch((e: unknown) => e)) as ApiError;
		expect(error).toBeInstanceOf(ApiError);
		expect(error.status).toBe(422);
		expect(error.message).toContain('Moneybird 422: company_name: is required');
		expect(error.message).not.toContain('Secret');
		expect(JSON.stringify(error.request)).not.toContain('Secret');
		expect(JSON.stringify(error.request)).not.toContain('mb_test_token');
		expect(error.url).toBe(`${BASE}/{administration_id}/contacts.json`);
	});

	it('reads the symbolic error body', async () => {
		reply(400, {
			error: 'Contact is required',
			symbolic: { contact: 'required' },
		});
		const error = (await endpointFor('contacts.create')(ctx(), {
			contact: { company_name: 'Beachy BV' },
		}).catch((e: unknown) => e)) as ApiError;
		expect(error.status).toBe(400);
		expect(error.message).toBe('Moneybird 400: Contact is required');
	});

	it('drops the token if Moneybird ever echoes it', async () => {
		reply(401, { error: 'access token mb_test_token invalid' });
		const error = (await endpointFor('contacts.get')(ctx(), { id: '1' }).catch(
			(e: unknown) => e,
		)) as ApiError;
		expect(error.status).toBe(401);
		expect(error.message).not.toContain('mb_test_token');
		expect(JSON.stringify(error.body)).not.toContain('mb_test_token');
	});

	it('reads the bare 429 string', () => {
		expect(moneybirdErrorMessage(429, 'Too Many Requests', 'Retry later')).toBe(
			'Moneybird 429: Retry later',
		);
	});

	it('rejects bad input before sending anything', async () => {
		reply(200, {});
		await expect(
			endpointFor('contacts.list')(ctx(), { per_page: 500 }),
		).rejects.toThrow(/Invalid input for moneybird contacts.list/);
		expect(calls).toHaveLength(0);
	});

	it('applies the same range to a page size sent as a digit string', async () => {
		reply(200, []);
		for (const per_page of ['101', '0']) {
			await expect(
				endpointFor('contacts.list')(ctx(), { per_page }),
			).rejects.toThrow(/Invalid input for moneybird contacts.list/);
		}
		expect(calls).toHaveLength(0);
		await endpointFor('contacts.list')(ctx(), { per_page: '100' });
		expect(new URL(String(calls[0]?.url)).searchParams.get('per_page')).toBe(
			'100',
		);
	});
});

describe('rate limits', () => {
	it("reads the 429's Retry-After as the epoch the window resets at", () => {
		expect(MONEYBIRD_RATE_LIMIT_CONFIG.headerNames.retryAfter).toBeUndefined();
		expect(MONEYBIRD_RATE_LIMIT_CONFIG.headerNames.resetTime).toBe(
			'retry-after',
		);
		expect(MONEYBIRD_RATE_LIMIT_CONFIG.maxRetries).toBe(3);
	});

	it('waits for an epoch Retry-After instead of decades', async () => {
		jest.useFakeTimers({ now: new Date('2026-11-26T10:00:00Z') });
		let n = 0;
		jest.spyOn(globalThis, 'fetch').mockImplementation(async () => {
			n += 1;
			return n === 1
				? new Response(JSON.stringify('Retry later'), {
						status: 429,
						headers: {
							'content-type': 'application/json',
							'retry-after': String(
								Math.floor(Date.parse('2026-11-26T10:00:02Z') / 1000),
							),
						},
					})
				: new Response(JSON.stringify([]), {
						status: 200,
						headers: { 'content-type': 'application/json' },
					});
		});
		const pending = endpointFor('ledgerAccounts.list')(ctx(), {});
		await jest.advanceTimersByTimeAsync(2_000);
		await expect(pending).resolves.toEqual([]);
		expect(n).toBe(2);
	});

	it('falls back to a short backoff when Retry-After is a delay', async () => {
		jest.useFakeTimers({ now: new Date('2026-11-26T10:00:00Z') });
		let n = 0;
		jest.spyOn(globalThis, 'fetch').mockImplementation(async () => {
			n += 1;
			return n === 1
				? new Response(JSON.stringify('Retry later'), {
						status: 429,
						headers: {
							'content-type': 'application/json',
							'retry-after': '30',
						},
					})
				: new Response(JSON.stringify([]), {
						status: 200,
						headers: { 'content-type': 'application/json' },
					});
		});
		const pending = endpointFor('ledgerAccounts.list')(ctx(), {});
		await jest.advanceTimersByTimeAsync(1_000);
		await expect(pending).resolves.toEqual([]);
		expect(n).toBe(2);
	});
});

// `unknown` because a resolved schema is any JSON Schema document.
function resolveSchema(schema: unknown): Record<string, unknown> {
	let current = schema as Record<string, unknown> | undefined;
	for (
		let depth = 0;
		depth < 10 && typeof current?.$ref === 'string';
		depth++
	) {
		current = moneybirdDefinitions[current.$ref as string];
	}
	return current ?? {};
}

describe('every operation', () => {
	it.each(moneybirdOperations.map((o) => [o.id, o] as const))(
		'%s sends its documented method and route',
		async (id, operation) => {
			const output = resolveSchema(operation.output);
			if (operation.response === 'file') {
				if (/Ubl|purchaseTransactionBatches/.test(id)) {
					reply(
						200,
						new TextEncoder().encode('<?xml version="1.0"?><a/>'),
						'application/xml',
					);
				} else {
					reply(200, new Uint8Array([37, 80, 68, 70]), 'application/pdf');
				}
			} else if (operation.response === 'empty') {
				reply(204, undefined);
			} else {
				reply(
					200,
					output.type === 'array'
						? []
						: output.type === 'integer'
							? 200
							: output.type === 'string'
								? 'https://moneybird.com/example'
								: {},
				);
			}
			const args = docs.apiExamples[id]?.args ?? {};
			const result = await endpointFor(id)(ctx(), args);
			expect(calls).toHaveLength(1);
			if (operation.response === 'empty') {
				expect(result).toEqual({ success: true });
			} else if (operation.paginated) {
				expect(result).toEqual({ items: [], next_page: null });
			}
			const url = new URL(String(calls[0]?.url));
			const route = operation.path.replace(/\{(\w+)\}/g, (_, name: string) =>
				name === 'administration_id'
					? ADMIN
					: encodeURIComponent(String(args[name])),
			);
			expect(url.host).toBe('moneybird.com');
			expect(decodeURIComponent(url.pathname)).toBe(
				decodeURIComponent(`/api/v2${route}`),
			);
			expect(url.pathname.endsWith('.json')).toBe(
				operation.response !== 'file',
			);
			expect(calls[0]?.method).toBe(operation.method);
			expect(calls[0]?.headers.authorization).toBe('Bearer mb_test_token');
			if (operation.request === 'json') {
				const body = JSON.parse(String(calls[0]?.body ?? '{}'));
				const located = new Map(
					Object.entries(operation.input.properties ?? {}).map(
						// `unknown` because property schemas are raw JSON Schema documents.
						([name, schema]) => [
							name,
							(schema as Record<string, unknown>)['x-corsair-in'] ?? 'body',
						],
					),
				);
				for (const [name, value] of Object.entries(args)) {
					if (located.get(name) === 'body') {
						// Every body field of the example goes out as sent.
						expect([name, body[name]]).toEqual([name, value]);
					} else {
						expect(body).not.toHaveProperty(name);
					}
				}
			}
			// Every query field of the example reaches the URL (lists as `name[]`).
			for (const [name, value] of Object.entries(args)) {
				const where = (
					operation.input.properties as
						| Record<string, Record<string, unknown>>
						| undefined
				)?.[name]?.['x-corsair-in'];
				if (where !== 'query') continue;
				if (Array.isArray(value)) {
					expect([name, url.searchParams.getAll(`${name}[]`)]).toEqual([
						name,
						value.map(String),
					]);
				} else if (typeof value !== 'object' || value === null) {
					expect([name, url.searchParams.get(name)]).toEqual([
						name,
						String(value),
					]);
				}
			}
		},
	);
});

// Expectations written by hand from Moneybird's API reference
// (developer.moneybird.com), not read from the manifest, so a wrong route in
// the manifest fails here.
describe('routes checked by hand', () => {
	it.each([
		['contacts.list', {}, 'GET', '/contacts.json'],
		[
			'contacts.filter',
			{ filter: 'created_after:2026-01-01' },
			'GET',
			'/contacts/filter.json',
		],
		[
			'contacts.getByCustomerId',
			{ customer_id: 'C-1' },
			'GET',
			'/contacts/customer_id/C-1.json',
		],
		[
			'contacts.notes.create',
			{ contact_id: '5', note: { note: 'Hi' } },
			'POST',
			'/contacts/5/notes.json',
		],
		[
			'salesInvoices.create',
			{ sales_invoice: { contact_id: '5' } },
			'POST',
			'/sales_invoices.json',
		],
		[
			'salesInvoices.update',
			{ id: '6', sales_invoice: { reference: 'x' } },
			'PATCH',
			'/sales_invoices/6.json',
		],
		['salesInvoices.delete', { id: '6' }, 'DELETE', '/sales_invoices/6.json'],
		[
			'salesInvoices.payments.create',
			{
				sales_invoice_id: '6',
				payment: { price: '1.00', payment_date: '2026-01-01' },
			},
			'POST',
			'/sales_invoices/6/payments.json',
		],
		[
			'salesInvoices.getByInvoiceId',
			{ invoice_id: '2026-0001' },
			'GET',
			'/sales_invoices/find_by_invoice_id/2026-0001.json',
		],
		[
			'salesInvoices.listVersions',
			{},
			'GET',
			'/sales_invoices/synchronization.json',
		],
		[
			'salesInvoices.fetchByIds',
			{ ids: ['1', '2'] },
			'POST',
			'/sales_invoices/synchronization.json',
		],
		['estimates.send', { id: '6' }, 'PATCH', '/estimates/6/send_estimate.json'],
		[
			'documents.purchaseInvoices.list',
			{},
			'GET',
			'/documents/purchase_invoices.json',
		],
		[
			'documents.receipts.payments.create',
			{ id: '6', payment: { price: '1.00', payment_date: '2026-01-01' } },
			'POST',
			'/documents/receipts/6/payments.json',
		],
		[
			'financialMutations.linkBooking',
			{ id: '6', booking_type: 'Payment', booking_id: '7', price_base: '1.00' },
			'PATCH',
			'/financial_mutations/6/link_booking.json',
		],
		['ledgerAccounts.list', {}, 'GET', '/ledger_accounts.json'],
		['timeEntries.stop', { id: '6' }, 'PATCH', '/time_entries/6/stop.json'],
		[
			'webhooks.create',
			{ url: 'https://example.com/h' },
			'POST',
			'/webhooks.json',
		],
		['webhooks.delete', { id: '6' }, 'DELETE', '/webhooks/6.json'],
		['reports.profitLoss', {}, 'GET', '/reports/profit_loss.json'],
		['customFields.list', {}, 'GET', '/custom_fields.json'],
		['workflows.list', {}, 'GET', '/workflows.json'],
		['users.list', {}, 'GET', '/users.json'],
	])('%s', async (id, args, method, path) => {
		reply(
			method === 'DELETE' ? 204 : 200,
			method === 'DELETE' ? undefined : [],
		);
		await endpointFor(id)(ctx(), args).catch(() => undefined);
		expect(calls[0]?.method).toBe(method);
		expect(new URL(String(calls[0]?.url)).pathname).toBe(
			`/api/v2/${ADMIN}${path}`,
		);
	});
});
