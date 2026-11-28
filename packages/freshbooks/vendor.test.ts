import { clearFreshBooksIdentityCache, freshbooksPathDefault } from './auth';
import { freshbooksEndpointsNested } from './endpoints/catalog';
import type { FreshBooksContext } from './index';
import {
	freshbooksSignedText,
	freshbooksWebhooksNested,
	matchFreshBooksWebhook,
	verifyFreshBooksSignature,
} from './webhooks';

// FreshBooks specifics on top of the generic suites: the account and business
// ids filled in from users.me, the { response: { result } } envelope and its
// errors, the update route run with fixed fields (send, delete), FreshBooks'
// query keys, the ledger API version header, and webhook signatures checked
// against vectors computed with Python's json.dumps, as FreshBooks' own
// verifier sample does.

type Captured = {
	url: string;
	method: string;
	headers: Headers;
	body: unknown;
};
let calls: Captured[] = [];

function replies(...bodies: Array<[number, unknown]>) {
	let i = 0;
	jest.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
		calls.push({
			url: String(input),
			method: init?.method ?? 'GET',
			headers: new Headers(init?.headers),
			body: init?.body,
		});
		const [status, body] = bodies[Math.min(i++, bodies.length - 1)] as [
			number,
			unknown,
		];
		return new Response(body === undefined ? null : JSON.stringify(body), {
			status,
			headers: body === undefined ? {} : { 'content-type': 'application/json' },
		});
	});
}

const TOKEN = 'fb-access-token-vendor-test';

function ctx(
	options: Record<string, string> = {},
	key = TOKEN,
): FreshBooksContext {
	return {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key,
		options,
		keys: {},
		db: {},
		// `unknown` because a test context fills only the fields the endpoints read.
	} as unknown as FreshBooksContext;
}

const ME = {
	response: {
		id: 43210,
		email: 'owner@example.com',
		business_memberships: [
			{
				role: 'owner',
				business: {
					id: 77001,
					business_uuid: '5e9a0c1d-2b3c-4d5e-8f90-a1b2c3d4e5f6',
					account_id: 'LJArJ4',
					name: 'Analytical Engines',
				},
			},
		],
	},
};

beforeEach(() => {
	calls = [];
	clearFreshBooksIdentityCache();
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('account and business ids', () => {
	it('reads a missing account id from users.me once per token', async () => {
		replies(
			[200, ME],
			[200, { response: { result: { clients: [], page: 1 } } }],
		);
		const first = await freshbooksEndpointsNested.clients.list(ctx(), {});
		expect(first).toEqual({ clients: [], page: 1 });
		await freshbooksEndpointsNested.clients.list(ctx(), {});
		expect(calls.map((c) => new URL(c.url).pathname)).toEqual([
			'/auth/api/v1/users/me',
			'/accounting/account/LJArJ4/users/clients',
			'/accounting/account/LJArJ4/users/clients',
		]);
	});

	it('fills the business id and uuid the same way', async () => {
		replies([200, ME], [200, { projects: [], meta: {} }], [200, {}]);
		await freshbooksEndpointsNested.projects.list(ctx(), {});
		await freshbooksEndpointsNested.ledgerAccounts.list(ctx(), {});
		expect(new URL(String(calls[1]?.url)).pathname).toBe(
			'/projects/business/77001/projects',
		);
		expect(new URL(String(calls[2]?.url)).pathname).toBe(
			'/accounting/businesses/5e9a0c1d-2b3c-4d5e-8f90-a1b2c3d4e5f6/ledger_accounts/accounts',
		);
	});

	it('uses the option or the input over users.me', async () => {
		replies([200, { response: { result: { client: { id: 1 } } } }]);
		await freshbooksEndpointsNested.clients.get(ctx({ accountId: 'OPT123' }), {
			clientId: 1,
		});
		await freshbooksEndpointsNested.clients.get(ctx({ accountId: 'OPT123' }), {
			accountId: 'IN456',
			clientId: 1,
		});
		expect(calls.map((c) => new URL(c.url).pathname)).toEqual([
			'/accounting/account/OPT123/users/clients/1',
			'/accounting/account/IN456/users/clients/1',
		]);
	});

	it('asks which business when the login has several', async () => {
		const two = structuredClone(ME);
		two.response.business_memberships.push({
			role: 'owner',
			business: {
				id: 77002,
				business_uuid: 'other',
				account_id: 'XYZ789',
				name: 'Second',
			},
		});
		replies([200, two]);
		await expect(freshbooksPathDefault(ctx(), 'accountId')).rejects.toThrow(
			/belongs to 2 businesses.*accountId/,
		);
	});
});

describe('envelope and errors', () => {
	it('unwraps the accounting result', async () => {
		replies([
			200,
			{ response: { result: { client: { id: 31006, fname: 'Ada' } } } },
		]);
		const out = await freshbooksEndpointsNested.clients.get(
			ctx({ accountId: 'A1' }),
			{
				clientId: '31006',
			},
		);
		expect(out).toEqual({ client: { id: 31006, fname: 'Ada' } });
	});

	it('fails a 200 that carries response.errors', async () => {
		replies([
			200,
			{
				response: {
					errors: [
						{ errno: 1012, field: 'clientid', message: 'Client not found.' },
					],
				},
			},
		]);
		await expect(
			freshbooksEndpointsNested.clients.get(ctx({ accountId: 'A1' }), {
				clientId: 9,
			}),
		).rejects.toThrow(
			'FreshBooks clients.get failed (errno 1012): Client not found.',
		);
	});

	it('names the errno of a 4xx and keeps the token out of the error', async () => {
		replies([
			422,
			{
				response: {
					errors: [
						{
							errno: 1001,
							field: 'email',
							message: 'Required field email missing',
						},
					],
				},
			},
		]);
		const error = (await freshbooksEndpointsNested.clients
			.create(ctx({ accountId: 'A1' }), { client: { fname: 'Ada' } })
			.then(
				() => undefined,
				(e: unknown) => e,
			)) as Error & { status?: number };
		expect(error.status).toBe(422);
		expect(error.message).toBe(
			'FreshBooks 422 (errno 1001): Required field email missing',
		);
		expect(JSON.stringify(error)).not.toContain(TOKEN);
	});
});

describe('requests', () => {
	it('sends the bearer token and the resource-wrapped body', async () => {
		replies([200, { response: { result: { client: { id: 1 } } } }]);
		await freshbooksEndpointsNested.clients.create(ctx({ accountId: 'A1' }), {
			client: { fname: 'Ada', email: 'ada@example.com' },
		});
		expect(calls[0]?.headers.get('authorization')).toBe(`Bearer ${TOKEN}`);
		expect(calls[0]?.method).toBe('POST');
		expect(JSON.parse(String(calls[0]?.body))).toEqual({
			client: { fname: 'Ada', email: 'ada@example.com' },
		});
	});

	it('runs send by email and delete as the update route with fixed fields', async () => {
		replies([200, { response: { result: { invoice: { id: 5 } } } }]);
		await freshbooksEndpointsNested.invoices.sendEmail(
			ctx({ accountId: 'A1' }),
			{
				invoiceId: 5,
				invoice: { email_recipients: ['billing@example.com'] },
			},
		);
		await freshbooksEndpointsNested.invoices.delete(ctx({ accountId: 'A1' }), {
			invoiceId: 5,
		});
		expect(calls.map((c) => [c.method, new URL(c.url).pathname])).toEqual([
			['PUT', '/accounting/account/A1/invoices/invoices/5'],
			['PUT', '/accounting/account/A1/invoices/invoices/5'],
		]);
		expect(JSON.parse(String(calls[0]?.body))).toEqual({
			invoice: {
				email_recipients: ['billing@example.com'],
				action_email: true,
			},
		});
		expect(JSON.parse(String(calls[1]?.body))).toEqual({
			invoice: { vis_state: 1 },
		});
	});

	it('refuses an email action on a plain update', async () => {
		replies([200, { response: { result: { invoice: { id: 5 } } } }]);
		await expect(
			freshbooksEndpointsNested.invoices.update(ctx({ accountId: 'A1' }), {
				invoiceId: 5,
				invoice: { action_email: true },
			}),
		).rejects.toThrow(/use invoices.sendEmail/);
		expect(calls).toHaveLength(0);
	});

	it('writes include[] and search[...] the way FreshBooks reads them', async () => {
		replies([200, { response: { result: { invoices: [] } } }]);
		await freshbooksEndpointsNested.invoices.list(ctx({ accountId: 'A1' }), {
			page: 2,
			per_page: 100,
			include: ['lines', 'contacts'],
			search: { customerid: 31006, date_min: '2026-01-01' },
		});
		const url = new URL(String(calls[0]?.url));
		expect(url.searchParams.getAll('include[]')).toEqual(['lines', 'contacts']);
		expect(url.searchParams.get('search[customerid]')).toBe('31006');
		expect(url.searchParams.get('search[date_min]')).toBe('2026-01-01');
		expect(url.searchParams.get('per_page')).toBe('100');
	});

	it('sends the ledger API version on journal entry routes', async () => {
		replies([200, { journal_entries: [] }]);
		await freshbooksEndpointsNested.adjustmentJournalEntries.list(
			ctx({ businessUuid: 'u-1' }),
			{},
		);
		expect(calls[0]?.headers.get('x-api-version')).toBe('2023-09-25');
	});
});

// Python: json.dumps(OrderedDict(fields)), hmac sha256 keyed with the verifier, base64.
const VERIFIER = 'scADVVi5QuKuj5qTjVkbJNYQe7V7USpGd';
const VECTORS = [
	{
		form: 'name=invoice.create&object_id=1234567&account_id=6BApk&business_id=6543&identity_id=1234&user_id=1',
		text: '{"name": "invoice.create", "object_id": "1234567", "account_id": "6BApk", "business_id": "6543", "identity_id": "1234", "user_id": "1"}',
		signature: '/S03vyYmI7CekM4YXBHUhs9o5rnMtqGLrW3aA8S9gPc=',
	},
	{
		form: `name=client.update&object_id=31006&account_id=6BApk&note=${encodeURIComponent('Café ☕ "q"')}`,
		text: '{"name": "client.update", "object_id": "31006", "account_id": "6BApk", "note": "Caf\\u00e9 \\u2615 \\"q\\""}',
		signature: 'X1vlX0CtuXx0EHjMWHLdVoRcAwpU/tkKvkVkENPNIU8=',
	},
];

function delivery(form: string, signature?: string) {
	return {
		headers: {
			'content-type': 'application/x-www-form-urlencoded',
			...(signature ? { 'X-FreshBooks-Hmac-SHA256': signature } : {}),
		},
		body: form,
		rawBody: form,
		payload: Object.fromEntries(new URLSearchParams(form)),
	};
}

describe('webhooks', () => {
	it.each(VECTORS)('signs the fields as Python json.dumps does', (v) => {
		expect(freshbooksSignedText([...new URLSearchParams(v.form)])).toBe(v.text);
		expect(
			verifyFreshBooksSignature(delivery(v.form, v.signature), VERIFIER),
		).toBe(true);
		expect(
			verifyFreshBooksSignature(delivery(v.form, v.signature), 'other'),
		).toBe(false);
	});

	it('accepts any of several stored verifiers (one per callback)', () => {
		const [v] = VECTORS as [(typeof VECTORS)[number]];
		expect(
			verifyFreshBooksSignature(
				delivery(v.form, v.signature),
				`otherVerifier1, ${VERIFIER}\notherVerifier2`,
			),
		).toBe(true);
		expect(
			verifyFreshBooksSignature(delivery(v.form, v.signature), 'a, b'),
		).toBe(false);
	});

	it('routes a signed delivery to its event and checks the signature', async () => {
		const [v] = VECTORS as [(typeof VECTORS)[number]];
		const request = delivery(v.form, v.signature);
		expect(matchFreshBooksWebhook(request)).toBe(true);
		expect(freshbooksWebhooksNested.invoice.create.match(request)).toBe(true);
		expect(freshbooksWebhooksNested.invoice.update.match(request)).toBe(false);
		const ok = await freshbooksWebhooksNested.invoice.create.handler(
			{ ...ctx(), key: VERIFIER } as never,
			request as never,
		);
		expect(ok).toMatchObject({
			success: true,
			data: {
				name: 'invoice.create',
				object_id: '1234567',
				account_id: '6BApk',
			},
		});
		const tampered = await freshbooksWebhooksNested.invoice.create.handler(
			{ ...ctx(), key: VERIFIER } as never,
			delivery(v.form.replace('1234567', '7654321'), v.signature) as never,
		);
		expect(tampered).toMatchObject({ success: false, statusCode: 401 });
		const noSecret = await freshbooksWebhooksNested.invoice.create.handler(
			{ ...ctx(), key: '' } as never,
			request as never,
		);
		expect(noSecret).toMatchObject({ success: false, statusCode: 401 });
	});

	it('ignores an unsigned event other than callback.verify', () => {
		expect(matchFreshBooksWebhook(delivery(VECTORS[0]?.form ?? ''))).toBe(
			false,
		);
	});

	it('hands over callback.verify unsigned, with its verifier', async () => {
		const request = delivery(
			`name=callback.verify&object_id=2001&verifier=${VERIFIER}&user_id=1`,
		);
		expect(matchFreshBooksWebhook(request)).toBe(true);
		expect(freshbooksWebhooksNested.callback.verify.match(request)).toBe(true);
		const out = await freshbooksWebhooksNested.callback.verify.handler(
			{ ...ctx(), key: '' } as never,
			request as never,
		);
		expect(out).toMatchObject({
			success: true,
			data: { name: 'callback.verify', object_id: '2001', verifier: VERIFIER },
		});
	});

	it('covers every documented event', () => {
		const groups = Object.entries(freshbooksWebhooksNested).flatMap(
			([noun, verbs]) => Object.keys(verbs).map((verb) => `${noun}.${verb}`),
		);
		expect(groups).toHaveLength(48);
		expect(groups).toEqual(
			expect.arrayContaining([
				'timeEntry.create',
				'creditNote.delete',
				'estimate.sendByEmail',
			]),
		);
	});
});
