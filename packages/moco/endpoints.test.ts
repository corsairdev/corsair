import { ApiError } from 'corsair/http';
import { mocoEndpointsNested } from './endpoints/catalog';
import { fileNameFor, nextPageOf, queryEntries } from './endpoints/operations';
import type { MocoContext } from './index';

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
			headers: body === undefined ? {} : { 'content-type': contentType },
		});
	});
}

function ctx(subdomain: string | undefined = 'acme'): MocoContext {
	return {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: 'moco_test_key',
		options: subdomain ? { subdomain } : {},
		keys: {
			get_api_key: () => Promise.resolve('moco_test_key'),
			get_subdomain: () => Promise.resolve('stored-sub'),
		},
		db: {},
		// `unknown` because a test context fills only the fields the endpoints read.
	} as unknown as MocoContext;
}

// `unknown` because the endpoint tree holds functions of many input types.
type AnyEndpoint = (ctx: MocoContext, input: unknown) => Promise<unknown>;

function endpointFor(id: string): AnyEndpoint {
	// `unknown` because the walk goes through nested groups of endpoints.
	let node: unknown = mocoEndpointsNested;
	for (const part of id.split('.')) {
		node = (node as Record<string, unknown>)[part];
	}
	return node as AnyEndpoint;
}

beforeEach(() => {
	calls = [];
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('requests', () => {
	it('sends a GET to the account host with Token auth', async () => {
		reply(200, { id: 7, name: 'Relaunch' });
		const out = await endpointFor('projects.get')(ctx(), { id: 7 });
		expect(out).toEqual({ id: 7, name: 'Relaunch' });
		expect(calls[0]?.url).toBe('https://acme.mocoapp.com/api/v1/projects/7');
		expect(calls[0]?.method).toBe('GET');
		expect(calls[0]?.headers.authorization).toBe('Token token=moco_test_key');
	});

	it('reads the subdomain from the account when options leave it out', async () => {
		reply(200, { id: 1, uuid: 'u' });
		await endpointFor('session.verify')(ctx(''), {});
		expect(calls[0]?.url).toBe('https://stored-sub.mocoapp.com/api/v1/session');
	});

	it('refuses a subdomain that is not one DNS label', async () => {
		reply(200, {});
		await expect(
			endpointFor('session.verify')(ctx('evil.com/x'), {}),
		).rejects.toThrow(/one DNS label/);
		expect(calls).toHaveLength(0);
	});

	it('fills nested path ids and sends the rest as the JSON body', async () => {
		reply(201, { id: 9, name: 'Design' });
		await endpointFor('projects.tasks.create')(ctx(), {
			project_id: 12,
			name: 'Design',
			billable: true,
		});
		expect(calls[0]?.url).toBe(
			'https://acme.mocoapp.com/api/v1/projects/12/tasks',
		);
		expect(calls[0]?.method).toBe('POST');
		expect(JSON.parse(String(calls[0]?.body))).toEqual({
			name: 'Design',
			billable: true,
		});
	});

	it('sends the impersonation header when asked', async () => {
		reply(201, { id: 3 });
		await endpointFor('activities.create')(ctx(), {
			date: '2026-04-09',
			project_id: 1,
			task_id: 2,
			seconds: 1800,
			impersonate_user_id: 55,
		});
		expect(calls[0]?.headers['x-impersonate-user-id']).toBe('55');
		expect(JSON.parse(String(calls[0]?.body))).not.toHaveProperty(
			'impersonate_user_id',
		);
	});

	it('writes lists and custom property maps the way Rails reads them', () => {
		expect(queryEntries('kinds', ['a', 'b'])).toEqual({
			'kinds[]': ['a', 'b'],
		});
		expect(
			queryEntries('custom_properties', { Region: 'North', Tags: ['x', 'y'] }),
		).toEqual({
			'custom_properties[Region]': 'North',
			'custom_properties[Tags][]': ['x', 'y'],
		});
		expect(queryEntries('page', 2)).toEqual({ page: 2 });
	});

	it('puts list filters in the query string', async () => {
		reply(200, []);
		await endpointFor('reports.finance')(ctx(), {
			from: '2026-01-01',
			to: '2026-01-31',
			kinds: ['incoming_invoices', 'outgoing_purchases'],
		});
		const url = new URL(String(calls[0]?.url));
		expect(url.pathname).toBe('/api/v1/report/finance');
		expect(url.searchParams.getAll('kinds[]')).toEqual([
			'incoming_invoices',
			'outgoing_purchases',
		]);
	});
});

describe('responses', () => {
	it('returns a list page as items with the next page number', async () => {
		reply(
			200,
			Array.from({ length: 2 }, (_, i) => ({ id: i + 1 })),
		);
		const full = await endpointFor('projects.list')(ctx(), {
			page: 3,
			per_page: 2,
		});
		expect(full).toEqual({ items: [{ id: 1 }, { id: 2 }], next_page: 4 });
		expect(new URL(String(calls[0]?.url)).searchParams.get('page')).toBe('3');
	});

	it('ends paging on a short page', async () => {
		reply(200, [{ id: 1 }]);
		const last = await endpointFor('companies.list')(ctx(), {});
		expect(last).toEqual({ items: [{ id: 1 }], next_page: null });
		expect(nextPageOf({}, 100)).toBe(2);
		expect(nextPageOf({ page: 4 }, 99)).toBeNull();
	});

	it('answers success for a 204', async () => {
		reply(204, undefined);
		const out = await endpointFor('invoices.updateStatus')(ctx(), {
			id: 5,
			status: 'sent',
		});
		expect(out).toEqual({ success: true });
		expect(calls[0]?.method).toBe('PUT');
		expect(calls[0]?.url).toBe(
			'https://acme.mocoapp.com/api/v1/invoices/5/update_status',
		);
	});

	it('answers success for a delete with no body', async () => {
		reply(204, undefined);
		await expect(
			endpointFor('activities.delete')(ctx(), { id: 4 }),
		).resolves.toEqual({ success: true });
	});

	it('returns a PDF as a file output', async () => {
		reply(200, new Uint8Array([37, 80, 68, 70]), 'application/pdf');
		const out = (await endpointFor('invoices.getPdf')(ctx(), { id: 77 })) as {
			filename?: string;
			contentType?: string;
			byteLength?: number;
		};
		expect(calls[0]?.url).toBe(
			'https://acme.mocoapp.com/api/v1/invoices/77.pdf',
		);
		expect(out).toMatchObject({
			contentType: 'application/pdf',
			byteLength: 4,
			filename: 'moco-invoices-77.pdf',
		});
		expect(fileNameFor('invoices.getPdf', { id: 77 })).toBe(
			'moco-invoices-77.pdf',
		);
		expect(fileNameFor('invoices.getTimesheetPdf', { id: 77 })).toBe(
			'moco-invoices-timesheet-77.pdf',
		);
	});

	it('uploads a purchase document as multipart', async () => {
		reply(200, undefined);
		await endpointFor('purchases.storeDocument')(ctx(), {
			id: 8,
			file: {
				base64: Buffer.from('%PDF-1.4').toString('base64'),
				filename: 'r.pdf',
			},
		});
		expect(calls[0]?.method).toBe('PATCH');
		expect(calls[0]?.body).toBeInstanceOf(FormData);
		expect((calls[0]?.body as FormData).get('file')).toBeInstanceOf(Blob);
	});

	it('refuses a body that does not match the documented response', async () => {
		reply(200, 'not json at all', 'text/plain');
		await expect(endpointFor('projects.get')(ctx(), { id: 1 })).rejects.toThrow(
			/did not match its documented schema/,
		);
	});
});

describe('errors', () => {
	it('keeps the status and MOCO reason and drops the request data', async () => {
		reply(422, {
			errors: {
				name: ['muss ausgefüllt werden'],
				email: ['Secret Person is taken'],
			},
		});
		const error = (await endpointFor('contacts.create')(ctx(), {
			firstname: 'Secret',
			lastname: 'Person',
			gender: 'F',
		}).catch((e: unknown) => e)) as ApiError;
		expect(error).toBeInstanceOf(ApiError);
		expect(error.status).toBe(422);
		expect(error.message).toContain('MOCO 422: name: muss ausgefüllt werden');
		expect(error.message).not.toContain('Secret');
		expect(JSON.stringify(error.request)).not.toContain('Secret');
		expect(JSON.stringify(error.request)).not.toContain('moco_test_key');
		expect(error.url).toBe('https://acme.mocoapp.com/api/v1/contacts/people');
	});

	it('uses the message body for a 404', async () => {
		reply(404, { message: 'Not found' });
		const error = (await endpointFor('deals.get')(ctx(), { id: 1 }).catch(
			(e: unknown) => e,
		)) as ApiError;
		expect(error.status).toBe(404);
		expect(error.message).toBe('MOCO 404: Not found');
		expect(error.url).toBe('https://acme.mocoapp.com/api/v1/deals/{id}');
	});

	it('rejects bad input before sending anything', async () => {
		reply(200, {});
		await expect(
			endpointFor('invoices.updateStatus')(ctx(), {
				id: 1,
				status: 'paid-ish',
			}),
		).rejects.toThrow(/Invalid input for moco invoices.updateStatus/);
		expect(calls).toHaveLength(0);
	});
});
