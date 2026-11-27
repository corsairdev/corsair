import { ApiError } from 'corsair/http';
import { clearPaypalTokens, paypalErrorMessage, routeUrl } from './client';
import { paypalEndpointsNested } from './endpoints/catalog';
import { paypalDefinitions, paypalOperations } from './endpoints/manifest';
import type { PaypalContext } from './index';

// Every call goes through the real client and core transport; only fetch is fake.

type Captured = {
	url: string;
	method: string;
	headers: Record<string, string>;
	// `unknown` because the sent body is JSON text or a FormData.
	body: unknown;
};

let calls: Captured[] = [];
let tokenCalls = 0;

type Answer = { status: number; body?: unknown; contentType?: string };

function reply(answer: (url: string) => Answer) {
	jest.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
		const url = String(input);
		const headers: Record<string, string> = {};
		new Headers(init?.headers).forEach((value, key) => {
			headers[key] = value;
		});
		if (url.endsWith('/v1/oauth2/token')) {
			tokenCalls++;
			if (
				new URL(url).hostname === 'api-m.paypal.com' &&
				headers.authorization?.includes(
					Buffer.from('sandbox-app:').toString('base64').slice(0, 8),
				)
			) {
				return Response.json(
					{
						error: 'invalid_client',
						error_description: 'Client Authentication failed',
					},
					{ status: 401 },
				);
			}
			return Response.json({
				access_token: `token-${tokenCalls}`,
				expires_in: 32400,
			});
		}
		calls.push({
			url,
			method: init?.method ?? 'GET',
			headers,
			body: init?.body,
		});
		const { status, body, contentType = 'application/json' } = answer(url);
		const payload =
			body === undefined
				? null
				: body instanceof Uint8Array || typeof body === 'string'
					? body
					: JSON.stringify(body);
		return new Response(payload, {
			status,
			headers: body === undefined ? {} : { 'content-type': contentType },
		});
	});
}

function ctx(
	clientId = 'live-app',
	environment?: 'live' | 'sandbox',
): PaypalContext {
	return {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: 'app-secret-value',
		options: { clientId, ...(environment ? { environment } : {}) },
		keys: {},
		db: {},
		// `unknown` because a test context fills only the fields the endpoints read.
	} as unknown as PaypalContext;
}

// `unknown` because the endpoint tree holds functions of many input types.
type AnyEndpoint = (ctx: PaypalContext, input: unknown) => Promise<unknown>;

function endpointFor(id: string): AnyEndpoint {
	// `unknown` because the walk goes through nested groups of endpoints.
	let node: unknown = paypalEndpointsNested;
	for (const part of id.split('.')) {
		node = (node as Record<string, unknown>)[part];
	}
	if (typeof node !== 'function') throw new Error(`no endpoint ${id}`);
	return node as AnyEndpoint;
}

/** Whether a documented response (or the definition it names) is a list. */
// `unknown` because the output is raw JSON Schema.
function isList(schema: unknown): boolean {
	let node = schema as { type?: string; $ref?: string } | undefined;
	if (node?.$ref) node = paypalDefinitions[node.$ref] as typeof node;
	return node?.type === 'array';
}

const call = (id: string, input: unknown, c = ctx()) =>
	endpointFor(id)(c, input);

// jest-yaml-transform turns the yaml into a plain object.
const docs = require('./plugin-docs.yaml') as {
	// `unknown` because example args are free-form YAML values.
	apiExamples: Record<string, { args: Record<string, unknown> }>;
};

beforeEach(() => {
	calls = [];
	tokenCalls = 0;
	clearPaypalTokens();
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('every operation', () => {
	it.each(paypalOperations.map((o) => o.id))(
		'%s sends its documented method and path',
		async (id) => {
			const operation = paypalOperations.find((o) => o.id === id);
			if (!operation) throw new Error(id);
			reply(() =>
				operation.response === 'empty'
					? { status: 204 }
					: operation.response === 'file'
						? { status: 200, body: 'iVBORw0KGgo=', contentType: 'text/plain' }
						: {
								status: 200,
								body: isList(operation.output) ? [] : {},
							},
			);
			const args = docs.apiExamples[id]?.args ?? {};
			await call(id, args, ctx('live-app', 'live'));
			const sent = calls[0];
			expect(sent?.method).toBe(operation.method);
			const pattern = new RegExp(
				`^${operation.path.replace(/{[^}]+}/g, '[^/]+')}$`,
			);
			expect(new URL(sent?.url ?? '').pathname).toMatch(pattern);
			expect(new URL(sent?.url ?? '').origin).toBe('https://api-m.paypal.com');
		},
	);
});

describe('auth', () => {
	it('reuses a token and tries sandbox when live does not know the app', async () => {
		reply(() => ({ status: 200, body: { id: 'X' } }));
		await call('orders.get', { id: 'X' }, ctx('sandbox-app'));
		await call('orders.get', { id: 'Y' }, ctx('sandbox-app'));
		expect(tokenCalls).toBe(2); // live refused once, sandbox issued once
		expect(
			calls.every((c) => c.url.startsWith('https://api-m.sandbox.paypal.com/')),
		).toBe(true);
		expect(calls[1]?.headers.authorization).toBe('Bearer token-2');
	});

	it('gets a new token once when PayPal answers 401', async () => {
		let first = true;
		reply(() => {
			if (first) {
				first = false;
				return {
					status: 401,
					body: { name: 'AUTHENTICATION_FAILURE', message: 'expired' },
				};
			}
			return { status: 200, body: { id: 'X' } };
		});
		await expect(
			call('orders.get', { id: 'X' }, ctx('live-app', 'live')),
		).resolves.toMatchObject({ id: 'X' });
		expect(tokenCalls).toBe(2);
	});
});

describe('requests', () => {
	it('sends headers, a JSON body, a JSON Patch list and empty bodies', async () => {
		reply((url) =>
			url.includes('/v2/checkout/orders/')
				? { status: 204 }
				: { status: 201, body: { id: 'O1' } },
		);
		await call(
			'orders.create',
			{
				intent: 'CAPTURE',
				purchase_units: [{ amount: { currency_code: 'USD', value: '1.00' } }],
				paypal_request_id: 'req-1',
				prefer: 'return=representation',
			},
			ctx('live-app', 'live'),
		);
		expect(calls[0]?.headers['paypal-request-id']).toBe('req-1');
		expect(calls[0]?.headers.prefer).toBe('return=representation');
		expect(JSON.parse(String(calls[0]?.body))).toEqual({
			intent: 'CAPTURE',
			purchase_units: [{ amount: { currency_code: 'USD', value: '1.00' } }],
		});
		const patch = [{ op: 'replace', path: '/intent', value: 'AUTHORIZE' }];
		await expect(
			call('orders.update', { id: 'O1', patch }, ctx('live-app', 'live')),
		).resolves.toEqual({ success: true });
		expect(calls[1]?.method).toBe('PATCH');
		expect(JSON.parse(String(calls[1]?.body))).toEqual(patch);
	});

	it('asks invoicing creates for the representation, not a bare link', async () => {
		reply(() => ({ status: 201, body: { id: 'TEMP-1', name: 'Monthly' } }));
		await expect(
			call(
				'invoices.templates.create',
				{
					name: 'Monthly',
					template_info: { detail: { currency_code: 'USD' } },
				},
				ctx('live-app', 'live'),
			),
		).resolves.toMatchObject({ id: 'TEMP-1' });
		expect(calls[0]?.headers.prefer).toBe('return=representation');
		await call('orders.get', { id: 'O1' }, ctx('live-app', 'live'));
		expect(calls[1]?.headers.prefer).toBeUndefined();
	});

	it('sends dispute evidence as a multipart form with a JSON part', async () => {
		reply(() => ({ status: 200, body: { links: [] } }));
		await call(
			'disputes.provideEvidence',
			{
				id: 'PP-D-1',
				input: { evidences: [{ evidence_type: 'PROOF_OF_FULFILLMENT' }] },
				'evidence-file': {
					base64: Buffer.from('%PDF').toString('base64'),
					filename: 'proof.pdf',
					contentType: 'application/pdf',
				},
			},
			ctx('live-app', 'live'),
		);
		const form = calls[0]?.body as FormData;
		expect(form).toBeInstanceOf(FormData);
		const input = form.get('input') as Blob;
		expect(input.type).toBe('application/json');
		expect(JSON.parse(await input.text())).toEqual({
			evidences: [{ evidence_type: 'PROOF_OF_FULFILLMENT' }],
		});
		expect((form.get('evidence-file') as File).name).toBe('proof.pdf');
	});

	it('returns the invoice QR code as a PNG file', async () => {
		reply(() => ({
			status: 200,
			body: Buffer.from('png-bytes').toString('base64'),
			contentType: 'text/plain',
		}));
		const file = (await call(
			'invoices.generateQrCode',
			{ invoice_id: 'INV2-1' },
			ctx('live-app', 'live'),
		)) as {
			contentType?: string;
			filename?: string;
		};
		expect(file).toMatchObject({
			contentType: 'image/png',
			filename: 'paypal-invoices-generateQrCode.png',
		});
	});

	it('unwraps the multipart QR answer the live API sends and accepts any type', async () => {
		const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 1, 2, 3]);
		const boundary = '07351a55-5cc4-4964-98da-4c0bda9d7f2e';
		reply(() => ({
			status: 200,
			body: `--${boundary}\r\nContent-Disposition: form-data; name="image"\r\nContent-Type: text/plain\r\n\r\n${png.toString('base64')}\r\n--${boundary}--`,
			contentType: `multipart/form-data; boundary=${boundary}`,
		}));
		const file = (await call(
			'invoices.generateQrCode',
			{ invoice_id: 'INV2-1' },
			ctx('live-app', 'live'),
		)) as { contentBase64?: string; byteLength?: number };
		expect(calls[0]?.headers.accept).toBe('*/*');
		expect(file.byteLength).toBe(png.byteLength);
		expect(file.contentBase64).toBe(png.toString('base64'));
	});
});

describe('errors', () => {
	it('builds the message from name, details and debug_id without sent values or the token', async () => {
		reply(() => ({
			status: 422,
			body: {
				name: 'UNPROCESSABLE_ENTITY',
				message: 'The requested action could not be performed.',
				debug_id: 'f00ba4',
				details: [
					{
						field: '/purchase_units/0/payee/email_address',
						value: 'ada@private.example',
						issue: 'PAYEE_ACCOUNT_INVALID',
					},
				],
			},
		}));
		const error = (await call(
			'orders.create',
			{
				intent: 'CAPTURE',
				purchase_units: [
					{
						amount: { currency_code: 'USD', value: '1.00' },
						payee: { email_address: 'ada@private.example' },
					},
				],
			},
			ctx('live-app', 'live'),
		).catch((e) => e)) as ApiError;
		expect(error).toBeInstanceOf(ApiError);
		expect(error.status).toBe(422);
		expect(error.message).toBe(
			'PayPal 422: UNPROCESSABLE_ENTITY: The requested action could not be performed.; /purchase_units/0/payee/email_address PAYEE_ACCOUNT_INVALID; debug_id f00ba4',
		);
		const text = JSON.stringify({ body: error.body, request: error.request });
		expect(text).not.toContain('ada@private');
		expect(text).not.toContain('token-');
		expect(text).not.toContain('app-secret');
	});

	it('formats OAuth errors and keeps the route only in the URL', () => {
		expect(
			paypalErrorMessage(401, '', {
				error: 'invalid_client',
				error_description: 'Client Authentication failed',
			}),
		).toBe('PayPal 401: invalid_client: Client Authentication failed');
		expect(
			routeUrl(
				'https://api-m.paypal.com/v2/checkout/orders/ABC?fields=x',
				'/v2/checkout/orders/{id}',
			),
		).toBe('https://api-m.paypal.com/v2/checkout/orders/{id}?[REDACTED]');
	});
});
