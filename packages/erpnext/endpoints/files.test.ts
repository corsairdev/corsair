import { createCorsair } from 'corsair/core';
import { ErpnextAPIError, fetchErpnextBinary } from '../client';
import { erpnext, erpnextEndpointSchemas } from '../index';
import type { ErpnextOperationKey } from '../operations';
import { ERPNEXT_OPERATIONS } from '../operations';
import { FilesOutputSchemas } from './files-types';

const BASE_URL = 'https://test.example.com';
const AUTH_HEADER = 'token test-key:test-secret';

// The files family under test; the dotted keys look up the shared schema
// registry and the bound public tree.
type FilesOperationKey = Extract<ErpnextOperationKey, `files.${string}`>;

const FILES_OPERATIONS = ERPNEXT_OPERATIONS.filter(
	(
		operation,
	): operation is (typeof ERPNEXT_OPERATIONS)[number] & {
		key: FilesOperationKey;
	} => operation.key.startsWith('files.'),
);

const FILES_ACTIONS = ['downloadPdf', 'downloadFile'] as const;

type Handler = (
	// unknown: handlers are walked out of the bound public tree at runtime, so
	// their precise per-operation input/output types cannot be recovered here;
	// each call is schema-validated separately before the handler runs.
	input: unknown,
) => Promise<unknown>;

type CapturedRequest = {
	url: URL;
	method: string;
	headers: Headers;
	// unknown: the captured body is whatever the transport serialized for the
	// operation under test (JSON object, array, or none); assertions compare
	// it structurally rather than by a single type.
	body: unknown;
};

function endpointHandlers(tree: object, prefix = ''): Map<string, Handler> {
	return new Map(
		Object.entries(tree).flatMap(([name, value]) => {
			const key = prefix ? `${prefix}.${name}` : name;
			if (typeof value === 'function') {
				return [[key, value as Handler]];
			}
			if (value && typeof value === 'object') {
				return [...endpointHandlers(value, key)];
			}
			return [];
		}),
	);
}

const corsair = createCorsair({
	plugins: [erpnext({ key: 'test-key:test-secret', baseUrl: BASE_URL })],
	// No database in API-only tests; the config type requires a KEK and the
	// runtime only uses it alongside a database for envelope encryption.
	kek: 'test-kek',
});
// Corsair's database/API result is a union; this assertion selects the API
// branch because the test invokes the public HTTP endpoints only.
// unknown: the bound client exposes the plugin namespaces only at runtime.
const publicApi = (corsair.erpnext as unknown as { api: object }).api;
const handlers = endpointHandlers(publicApi);

// Fixed binary payload: the first bytes of a PDF, chosen so a text-decoded
// response would be visibly mangled and a wrong base64 encoding would fail
// the equality below.
const PDF_BYTES = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e]);

// Spec-derived input fixtures: the minimal valid request each frappe source
// signature shows. Written by hand so a mistaken schema can never bend the
// fixture into passing itself.
const INPUT_FIXTURES: Record<FilesOperationKey, unknown> = {
	// frappe/utils/print_format.py: def download_pdf(doctype, name, format,
	// doc, no_letterhead, language, letterhead, ...) — the catalog carries
	// doctype, name, format, no_letterhead, letterhead.
	'files.downloadPdf': {
		doctype: 'Sales Invoice',
		name: 'ACC-SINV-2026-00001',
		format: 'Standard',
		no_letterhead: true,
		letterhead: 'Blue Header',
	},
	// frappe/handler.py: def download_file(file_url) — the single required
	// query key is the stored file's URL path.
	'files.downloadFile': {
		file_url: '/private/files/Invoice.pdf',
	},
};

// Independently written expected requests, transcribed by hand from the
// Frappe wire contract (the frappe.utils.print_format.download_pdf and the
// top-level download_file methods) and paired with the hand-written
// INPUT_FIXTURES above. They are deliberately NOT derived from
// ERPNEXT_OPERATIONS: a wrong catalog entry must change the wire request
// without also rewriting the expectation, or the test could never catch it.
type ExpectedRequest = {
	method: 'GET';
	url: string;
	query?: Record<string, string>;
	authHeader: string;
};

const EXPECTED_REQUESTS: Record<FilesOperationKey, ExpectedRequest> = {
	'files.downloadPdf': {
		method: 'GET',
		url: 'https://test.example.com/api/method/frappe.utils.print_format.download_pdf',
		query: {
			doctype: 'Sales Invoice',
			name: 'ACC-SINV-2026-00001',
			format: 'Standard',
			// Boolean query values reach Frappe as strings; the provider reads
			// no_letterhead with cint(), where "true"/"false" both convert to
			// 0, so the handler sends the cint-compatible 1/0 form.
			no_letterhead: '1',
			letterhead: 'Blue Header',
		},
		authHeader: AUTH_HEADER,
	},
	'files.downloadFile': {
		method: 'GET',
		url: 'https://test.example.com/api/method/download_file',
		query: {
			file_url: '/private/files/Invoice.pdf',
		},
		authHeader: AUTH_HEADER,
	},
};

describe('ERPNext files endpoint contract', () => {
	it('binds exactly the 2 documented files handlers', () => {
		expect(FILES_OPERATIONS).toHaveLength(2);
		expect(FILES_OPERATIONS.map(({ key }) => key).sort()).toEqual(
			FILES_ACTIONS.map((action) => `files.${action}`).sort(),
		);
		// The bound public tree exposes exactly the documented action keys;
		// these define the dotted operation ids with the `files` prefix.
		// unknown: the bound tree is walked by group name at runtime; the
		// files group must exist once the family is registered.
		const filesApi = (publicApi as Record<string, unknown>).files;
		expect(filesApi).toBeDefined();
		expect(Object.keys(filesApi as object).sort()).toEqual(
			[...FILES_ACTIONS].sort(),
		);
		// And the bound public tree carries one schema-wrapped handler per action.
		expect([...endpointHandlers(filesApi as object).keys()].sort()).toEqual(
			[...FILES_ACTIONS].sort(),
		);
	});

	it.each(Object.entries(INPUT_FIXTURES))(
		'%s sends its documented request and returns the bytes base64-encoded',
		async (key) => {
			const operationKey = key as FilesOperationKey;
			const expected = EXPECTED_REQUESTS[operationKey];
			const schema = erpnextEndpointSchemas[operationKey];
			const input = INPUT_FIXTURES[operationKey];

			const captures: CapturedRequest[] = [];
			const mockFetch = jest
				.spyOn(global, 'fetch')
				.mockImplementation(async (url, init) => {
					captures.push({
						url: new URL(String(url)),
						method: init?.method ?? 'GET',
						headers: new Headers(init?.headers),
						body: init?.body,
					});
					// Binary downloads answer raw bytes, not the JSON envelope.
					return new Response(PDF_BYTES, {
						status: 200,
						headers: { 'content-type': 'application/pdf' },
					});
				});

			try {
				const expectedUrl = new URL(expected.url);
				// The registry schema must accept the fixture at the boundary.
				const parsedInput = schema.input.parse(input);
				const handler = handlers.get(operationKey);
				expect(handler).toBeDefined();
				const result = await handler?.(parsedInput);
				expect(mockFetch).toHaveBeenCalledTimes(1);
				expect(captures).toHaveLength(1);
				const request = captures[0];
				if (!request) {
					throw new Error(`No request captured for ${operationKey}`);
				}
				expect(request.method).toBe(expected.method);
				expect(request.url.origin).toBe(expectedUrl.origin);
				expect(request.url.pathname).toBe(expectedUrl.pathname);
				expect(request.headers.get('authorization')).toBe(expected.authHeader);
				expect(Object.fromEntries(request.url.searchParams)).toEqual(
					expected.query ?? {},
				);

				// The output schema is the plugin's own { base64 } envelope.
				expect(result).toEqual({
					base64: Buffer.from(PDF_BYTES).toString('base64'),
				});
				expect(schema.output.safeParse(result).success).toBe(true);
			} finally {
				mockFetch.mockRestore();
			}
		},
	);

	// no_letterhead rides the cint() form in both directions: true → 1
	// (letterhead suppressed), false → 0 (letterhead kept).
	it.each([
		{ no_letterhead: true, expected: '1' },
		{ no_letterhead: false, expected: '0' },
	])(
		'serializes no_letterhead $no_letterhead as $expected on the wire',
		async ({ no_letterhead, expected }) => {
			const captures: CapturedRequest[] = [];
			const mockFetch = jest
				.spyOn(global, 'fetch')
				.mockImplementation(async (url, init) => {
					captures.push({
						url: new URL(String(url)),
						method: init?.method ?? 'GET',
						headers: new Headers(init?.headers),
						body: init?.body,
					});
					return new Response(PDF_BYTES, {
						status: 200,
						headers: { 'content-type': 'application/pdf' },
					});
				});
			try {
				const handler = handlers.get('files.downloadPdf');
				expect(handler).toBeDefined();
				await handler?.({
					doctype: 'Sales Invoice',
					name: 'ACC-SINV-2026-00001',
					no_letterhead,
				});
				expect(mockFetch).toHaveBeenCalledTimes(1);
				const request = captures[0];
				if (!request) {
					throw new Error('No request captured');
				}
				expect(request.url.searchParams.get('no_letterhead')).toBe(expected);
			} finally {
				mockFetch.mockRestore();
			}
		},
	);

	// Optional query keys are appended only when set, so the wire request
	// carries exactly the caller's input.
	it('omits unset optional downloadPdf query keys', async () => {
		const captures: CapturedRequest[] = [];
		const mockFetch = jest
			.spyOn(global, 'fetch')
			.mockImplementation(async (url, init) => {
				captures.push({
					url: new URL(String(url)),
					method: init?.method ?? 'GET',
					headers: new Headers(init?.headers),
					body: init?.body,
				});
				return new Response(PDF_BYTES, {
					status: 200,
					headers: { 'content-type': 'application/pdf' },
				});
			});
		try {
			const handler = handlers.get('files.downloadPdf');
			expect(handler).toBeDefined();
			await handler?.({
				doctype: 'Sales Invoice',
				name: 'ACC-SINV-2026-00001',
			});
			expect(mockFetch).toHaveBeenCalledTimes(1);
			const request = captures[0];
			if (!request) {
				throw new Error('No request captured');
			}
			expect(Object.fromEntries(request.url.searchParams)).toEqual({
				doctype: 'Sales Invoice',
				name: 'ACC-SINV-2026-00001',
			});
		} finally {
			mockFetch.mockRestore();
		}
	});

	// A failed download must keep the response status (and any Retry-After)
	// on the wrapped error so the endpoint error handlers can classify it.
	// Asserted at the client seam: a read-rate-limited download goes through
	// the shared binder's retry replay, which is core behavior, not the
	// plugin's, and would sleep out the provider delay here.
	it('preserves the status and Retry-After of a failed binary download', async () => {
		const mockFetch = jest
			.spyOn(global, 'fetch')
			.mockImplementation(async () => {
				return new Response('Too Many Requests', {
					status: 429,
					headers: { 'content-type': 'text/plain', 'Retry-After': '7' },
				});
			});
		try {
			const error = (await fetchErpnextBinary(
				'/api/method/frappe.utils.print_format.download_pdf?doctype=Sales%20Invoice&name=ACC-SINV-2026-00001',
				BASE_URL,
				'test-key:test-secret',
			).catch((caught: unknown) => caught)) as ErpnextAPIError;
			expect(error).toBeInstanceOf(ErpnextAPIError);
			expect(error.status).toBe(429);
			// The header is in seconds on the wire and milliseconds once
			// wrapped, matching the shared transport's JSON-path behavior.
			expect(error.retryAfter).toBe(7000);
		} finally {
			mockFetch.mockRestore();
		}
	});

	// Both downloads require their query identifiers; the strict schemas
	// reject their absence before the handler touches fetch.
	it.each([
		{
			key: 'files.downloadPdf' as FilesOperationKey,
			name: 'a query without doctype',
			input: { name: 'ACC-SINV-2026-00001' },
		},
		{
			key: 'files.downloadPdf' as FilesOperationKey,
			name: 'a query without name',
			input: { doctype: 'Sales Invoice' },
		},
		{
			key: 'files.downloadPdf' as FilesOperationKey,
			name: 'an unknown query key',
			input: {
				doctype: 'Sales Invoice',
				name: 'ACC-SINV-2026-00001',
				language: 'en',
			},
		},
		{
			key: 'files.downloadFile' as FilesOperationKey,
			name: 'a query without file_url',
			input: {},
		},
	])(
		'rejects $key with $name before sending a request',
		async ({ key, input }) => {
			const fetchSpy = jest
				.spyOn(global, 'fetch')
				.mockImplementation(async () => {
					throw new Error(`fetch must not be called for invalid ${key} input`);
				});
			try {
				const schema = erpnextEndpointSchemas[key];
				expect(schema.input.safeParse(input).success).toBe(false);
				// Prove the rejection happens at the public boundary: the bound
				// handler must throw before any HTTP request is attempted.
				const handler = handlers.get(key);
				expect(handler).toBeDefined();
				await expect(handler?.(input)).rejects.toThrow();
				expect(fetchSpy).not.toHaveBeenCalled();
			} finally {
				fetchSpy.mockRestore();
			}
		},
	);
});

// A zero-byte stored file (or an empty render result) downloads successfully
// as an empty base64 string; the output schema must accept it as a success
// (Greptile round 2: "Empty files fail to download").
describe('ERPNext files output contract', () => {
	it('accepts an empty base64 payload for stored-file downloads', () => {
		const parsed = FilesOutputSchemas['files.downloadFile'].parse({
			base64: '',
		});
		expect(parsed.base64).toBe('');
	});

	it('accepts an empty base64 payload for PDF downloads', () => {
		const parsed = FilesOutputSchemas['files.downloadPdf'].parse({
			base64: '',
		});
		expect(parsed.base64).toBe('');
	});
});
