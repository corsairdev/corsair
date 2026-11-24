import { ApiError } from 'corsair/http';
import { mocoEndpointsNested } from './endpoints/catalog';
import { mocoDefinitions, mocoOperations } from './endpoints/manifest';
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
			endpointFor('invoices.getPdf')(ctx(), { id: 77 }),
		).rejects.toThrow('MOCO invoices.getPdf answered without a file');
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

	// Real 422 bodies from the live run (11-24): a list of field errors, and
	// field errors at the top level with no `errors` wrapper.
	it('reads a 422 list of { error_message, field_name } objects', async () => {
		reply(422, {
			errors: [
				{ error_message: 'Budgets are stored for 2026', field_name: 'base' },
			],
		});
		const error = (await endpointFor('purchases.budgets.delete')(ctx(), {
			id: 5,
		}).catch((e: unknown) => e)) as ApiError;
		expect(error.status).toBe(422);
		expect(error.message).toBe('MOCO 422: Budgets are stored for 2026');
	});

	it('names the field for a field error in the list', async () => {
		reply(422, {
			errors: [{ field_name: 'targetAmount', error_message: "can't be blank" }],
		});
		const error = (await endpointFor('purchases.budgets.updateTarget')(ctx(), {
			id: 5,
			target_amount: 1,
		}).catch((e: unknown) => e)) as ApiError;
		expect(error.message).toBe("MOCO 422: targetAmount: can't be blank");
	});

	it('reads field errors sent at the top level', async () => {
		reply(422, { currency: ["can't be blank", 'Currency is not deposited.'] });
		const error = (await endpointFor('account.expenseTemplates.create')(ctx(), {
			title: 'Hosting',
			currency: 'CHF',
		}).catch((e: unknown) => e)) as ApiError;
		expect(error.message).toBe(
			"MOCO 422: currency: can't be blank, Currency is not deposited.",
		);
	});

	it('drops a sent value echoed deep inside an error body', async () => {
		reply(422, {
			message: 'Invalid',
			errors: {
				a: { b: { c: { d: { e: { f: { g: { echo: 'Secret Person' } } } } } } },
			},
		});
		const error = (await endpointFor('contacts.create')(ctx(), {
			firstname: 'Secret',
			lastname: 'Person',
		}).catch((e: unknown) => e)) as ApiError;
		expect(error.message).toBe('MOCO 422: Invalid');
		expect(JSON.stringify(error.body)).not.toContain('Secret');
		expect(JSON.stringify(error.body)).not.toContain('Person');
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

// Found by the live run on a trial account (11-24); see kits/plugin-gen/moco
// gen.py LIVE_REQUIRED / LIVE_TIMEOUT_MS.
describe('what the live run corrected in the spec', () => {
	it.each([
		// MOCO answers 500 without frequency.
		[
			'plannedPurchases.create',
			{
				date: '2027-06-15',
				title: 'Hosting',
				net_total: 50,
				currency: 'USD',
				user_id: 1,
			},
		],
		['revenueCategories.create', { name: 'Consulting' }],
		['account.expenseTemplates.create', { title: 'Hosting' }],
		['account.customProperties.update', { id: 1, placeholder: 'x' }],
		['account.catalogServices.create', { title: 'Package', items: [] }],
		[
			'account.catalogServices.create',
			{ title: 'Package', items: [{ title: 'No type' }] },
		],
		['account.catalogServices.items.create', { catalog_service_id: 1 }],
	])('refuses %s without what MOCO needs', async (id, input) => {
		reply(200, {});
		await expect(endpointFor(id)(ctx(), input)).rejects.toThrow(
			/Invalid input/,
		);
		expect(calls).toHaveLength(0);
	});

	it('gives revenueCategories.delete a longer timeout (MOCO takes 25-90+ s)', () => {
		const slow = mocoOperations.find(
			(op) => op.id === 'revenueCategories.delete',
		);
		expect(slow?.timeoutMs).toBe(180_000);
		expect(
			mocoOperations
				.filter((op) => op.timeoutMs !== undefined)
				.map((op) => op.id),
		).toEqual(['revenueCategories.delete']);
	});
});

// Live run 11-24: an expense booked from a purchase lists its purchase items
// with net_total as a string (trimmed from the real response).
describe('decimals MOCO sends as strings', () => {
	const expense = (netTotal: unknown) => [
		{
			id: 6030210,
			title: 'Test item',
			quantity: 1,
			purchase_items: [
				{
					id: 6549532,
					title: 'Test item',
					net_total: netTotal,
					purchase_id: 5141848,
				},
			],
		},
	];

	it('reads a numeric string as its number', async () => {
		reply(200, expense('9.09'));
		const result = (await endpointFor('projects.expenses.list')(ctx(), {
			project_id: 3,
		})) as {
			items: Array<{
				purchase_items: Array<{ net_total: unknown; title: unknown }>;
			}>;
		};
		expect(result.items[0]?.purchase_items[0]?.net_total).toBe(9.09);
		// A string field that looks like a number stays a string.
		expect(result.items[0]?.purchase_items[0]?.title).toBe('Test item');
	});

	it.each([[''], [' '], [false], ['lots']])(
		'still refuses %p where a number belongs',
		async (value) => {
			reply(200, expense(value));
			await expect(
				endpointFor('projects.expenses.list')(ctx(), { project_id: 3 }),
			).rejects.toThrow(/did not match its documented schema/);
		},
	);
});

describe('routes that may answer without a body', () => {
	it('returns the JSON when there is one', async () => {
		replyRaw(200, JSON.stringify({ id: 3 }), 'application/json');
		await expect(
			endpointFor('deals.delete')(ctx(), { id: 3 }),
		).resolves.toEqual({ id: 3 });
	});

	it('answers success for an empty 200', async () => {
		replyRaw(200, '', 'application/json');
		await expect(
			endpointFor('deals.delete')(ctx(), { id: 3 }),
		).resolves.toEqual({ success: true });
	});

	it('refuses a body that is not JSON instead of calling it a success', async () => {
		replyRaw(200, '{"email":"person@exam', 'application/json');
		const error = (await endpointFor('deals.delete')(ctx(), {
			id: 3,
		}).catch((e: unknown) => e)) as Error;
		expect(error.message).toBe(
			'MOCO deals.delete answered with a body that is not JSON',
		);
		expect(error.message).not.toContain('person');
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
		current = mocoDefinitions[current.$ref as string];
	}
	return current ?? {};
}

describe('every operation', () => {
	it.each(mocoOperations.map((o) => [o.id, o] as const))(
		'%s sends its documented method and route',
		async (id, operation) => {
			const output = resolveSchema(operation.output);
			if (operation.response === 'file') {
				reply(200, new Uint8Array([37, 80, 68, 70]), 'application/pdf');
			} else if (operation.response === 'empty') {
				reply(204, undefined);
			} else {
				reply(200, output.type === 'array' ? [] : {});
			}
			const args = docs.apiExamples[id]?.args ?? {};
			const result = await endpointFor(id)(ctx(), args);
			expect(calls).toHaveLength(1);
			if (operation.response === 'empty') {
				expect(result).toEqual({ success: true });
			} else if (operation.paginated) {
				expect(result).toEqual({ items: [], next_page: null });
			} else if (operation.response === 'json') {
				expect(result).toEqual(output.type === 'array' ? [] : {});
			}
			const url = new URL(String(calls[0]?.url));
			const route = operation.path.replace(/\{(\w+)\}/g, (_, name: string) =>
				encodeURIComponent(String(args[name])),
			);
			expect(url.host).toBe('acme.mocoapp.com');
			expect(decodeURIComponent(url.pathname)).toBe(
				decodeURIComponent(`/api/v1${route}`),
			);
			expect(calls[0]?.method).toBe(operation.method);
			expect(calls[0]?.headers.authorization).toBe('Token token=moco_test_key');
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

// Expectations written by hand from MOCO's API reference, not read from the
// manifest, so a wrong route or body in the manifest fails here.
describe('routes checked by hand', () => {
	it.each([
		['activities.list', { from: '2026-04-01' }, 'GET', '/activities'],
		['contacts.get', { id: 9 }, 'GET', '/contacts/people/9'],
		[
			'projects.tasks.update',
			{ project_id: 3, id: 4, name: 'QA' },
			'PUT',
			'/projects/3/tasks/4',
		],
		[
			'invoices.sendEmail',
			{ id: 5, emails_to: 'a@example.com', subject: 's', text: 't' },
			'POST',
			'/invoices/5/send_email',
		],
		[
			'offers.customerApproval.activate',
			{ offer_id: 6 },
			'POST',
			'/offers/6/customer_approval/activate',
		],
		['users.presences.touch', {}, 'POST', '/users/presences/touch'],
		[
			'taggings.add',
			{ taggable_type: 'Project', taggable_id: 7, tags: ['Lead'] },
			'PATCH',
			'/taggings/Project/7',
		],
		[
			'taggings.replace',
			{ taggable_type: 'Project', taggable_id: 7, tags: ['Lead'] },
			'PUT',
			'/taggings/Project/7',
		],
		[
			'projects.tasks.deleteAll',
			{ project_id: 3 },
			'DELETE',
			'/projects/3/tasks/destroy_all',
		],
		[
			'account.webHooks.disable',
			{ id: 8 },
			'PUT',
			'/account/web_hooks/8/disable',
		],
		[
			'reports.plannedVsTracked',
			{ from: '2026-01-01', to: '2026-01-31' },
			'GET',
			'/report/planned_vs_tracked',
		],
	] as const)('%s', async (id, args, method, path) => {
		reply(200, {});
		await endpointFor(id)(ctx(), args).catch(() => undefined);
		expect(calls[0]?.method).toBe(method);
		expect(new URL(String(calls[0]?.url)).pathname).toBe(`/api/v1${path}`);
	});

	it('sends a bulk activity body as documented', async () => {
		reply(200, [{ id: 1 }]);
		const entry = {
			date: '2026-04-09',
			project_id: 1,
			task_id: 2,
			seconds: 1800,
			description: 'Review',
		};
		await endpointFor('activities.bulkCreate')(ctx(), { activities: [entry] });
		expect(new URL(String(calls[0]?.url)).pathname).toBe(
			'/api/v1/activities/bulk',
		);
		expect(JSON.parse(String(calls[0]?.body))).toEqual({ activities: [entry] });
	});

	it('parses a populated invoice with nested items and payments', async () => {
		reply(200, {
			id: 77,
			identifier: 'R2604-001',
			status: 'created',
			customer: { id: 1, name: 'Beachy' },
			items: [
				{ id: 1, type: 'item', title: 'Design', quantity: 2, net_total: 200 },
			],
			payments: [{ id: 3, date: '2026-04-20', paid_total: 238 }],
			reminders: [],
			gross_total: 238,
			unknown_new_field: true,
		});
		const invoice = (await endpointFor('invoices.get')(ctx(), { id: 77 })) as {
			items?: Array<{ title?: string }>;
			payments?: Array<{ paid_total?: number }>;
			unknown_new_field?: boolean;
		};
		expect(invoice.items?.[0]?.title).toBe('Design');
		expect(invoice.payments?.[0]?.paid_total).toBe(238);
		expect(invoice.unknown_new_field).toBe(true);
	});
});

describe('error bodies', () => {
	it('drops the API key if MOCO ever echoes it', async () => {
		reply(401, { message: 'Invalid API key moco_test_key.' });
		const error = (await endpointFor('projects.get')(ctx(), { id: 1 }).catch(
			(e: unknown) => e,
		)) as ApiError;
		expect(error.status).toBe(401);
		expect(error.message).not.toContain('moco_test_key');
		expect(JSON.stringify(error.body)).not.toContain('moco_test_key');
	});

	it('refuses a documented-empty route that answers bytes that are not JSON', async () => {
		replyRaw(200, '<html>proxy login</html>', 'text/html');
		await expect(
			endpointFor('invoices.updateStatus')(ctx(), { id: 5, status: 'sent' }),
		).rejects.toThrow(
			'MOCO invoices.updateStatus answered with a body that is not JSON',
		);
	});

	it('still counts a JSON answer on a documented-empty route as done', async () => {
		replyRaw(200, '{}', 'application/json');
		await expect(
			endpointFor('invoices.updateStatus')(ctx(), { id: 5, status: 'sent' }),
		).resolves.toEqual({ success: true });
	});
});
