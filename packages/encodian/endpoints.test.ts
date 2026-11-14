import {
	EncodianEndpointInputSchemas,
	EncodianOperationIds,
	EncodianOperationRoutes,
} from './endpoints/generated';
import { callEncodianOperation, encodianLogPayload } from './endpoints/runtime';
import {
	EncodianInputFixtures,
	EncodianOutputFixtures,
} from './endpoints/test-fixtures';

const API_KEY = 'encodian-endpoint-test-key';
const originalFetch = global.fetch;

// `unknown` because fixtures span object and JSON-valued body definitions from Swagger.
function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

afterEach(() => {
	global.fetch = originalFetch;
});

describe('Encodian operation requests', () => {
	it.each(EncodianOperationIds)(
		'%s sends the documented request and parses its response',
		async (operationId) => {
			let observedUrl = '';
			let observedMethod = '';
			let observedHeaders = new Headers();
			let observedBody: string | undefined;
			global.fetch = async (input, init) => {
				observedUrl = String(input);
				observedMethod = init?.method ?? '';
				observedHeaders = new Headers(init?.headers);
				observedBody = typeof init?.body === 'string' ? init.body : undefined;
				return new Response(
					JSON.stringify(EncodianOutputFixtures[operationId]),
					{
						status: 200,
						headers: { 'Content-Type': 'application/json' },
					},
				);
			};

			const result = await callEncodianOperation(
				operationId,
				API_KEY,
				EncodianInputFixtures[operationId],
			);
			const route = EncodianOperationRoutes[operationId];
			const url = new URL(observedUrl);

			expect(url.origin).toBe('https://api.apps-encodian.com');
			expect(url.pathname).toBe(route.path);
			expect(observedMethod).toBe(route.method);
			expect(observedHeaders.get('X-ApiKey')).toBe(API_KEY);
			expect(observedHeaders.get('Authorization')).toBeNull();
			// `unknown` because generated fixture values have operation-specific shapes.
			const fixture: unknown = EncodianInputFixtures[operationId];
			if (
				observedBody !== undefined &&
				isRecord(fixture) &&
				'body' in fixture
			) {
				// `unknown` because JSON.parse returns untrusted data for an assertion against generated fixtures.
				const parsedBody: unknown = JSON.parse(observedBody);
				expect(parsedBody).toEqual(fixture.body);
			}
			for (const name of route.queryNames) {
				if (
					isRecord(fixture) &&
					isRecord(fixture.query) &&
					name in fixture.query
				) {
					expect(url.searchParams.get(name)).toBe(String(fixture.query[name]));
				}
			}
			expect(result).toEqual(EncodianOutputFixtures[operationId]);
			if (operationId === 'conversion.basicConversion') {
				expect(result).toMatchObject({
					Filename: 'converted.pdf',
					FileContent: 'SGVsbG8=',
				});
			}
			if (operationId === 'conversion.convertPdfToImages') {
				expect(result).toMatchObject({
					documents: [{ fileName: 'page-1.png', fileContent: 'SGVsbG8=' }],
				});
			}
		},
	);

	it('rejects invalid input before network I/O', async () => {
		let fetchCount = 0;
		global.fetch = async () => {
			fetchCount += 1;
			return new Response('{}', {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			});
		};
		// `unknown` because this malformed value intentionally bypasses the static endpoint input type.
		const error: unknown = await callEncodianOperation(
			'barcodes.readBarcodeFromImage',
			API_KEY,
			{
				body: {
					fileContent: 'AA==',
					barcodeImageFormat: 'PNG',
					callbackUrl: 'https://invalid.invalid',
				},
			},
		).catch((caught: unknown) => caught);

		expect(error).toBeDefined();
		expect(fetchCount).toBe(0);
		expect(
			EncodianEndpointInputSchemas['barcodes.readBarcodeFromImage'].safeParse(
				{},
			).success,
		).toBe(false);
	});

	it('accepts an explicitly undefined optional query on barcode creation', async () => {
		let fetchCount = 0;
		global.fetch = async () => {
			fetchCount += 1;
			return new Response('{}', {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			});
		};

		await callEncodianOperation('barcodes.createBarcode', API_KEY, {
			body: { codeTextEncoding: 'Default', dotCodemask: 0 },
			query: undefined,
		});

		expect(fetchCount).toBe(1);
	});

	it('keeps event payloads to a route identifier rather than request data', () => {
		expect(encodianLogPayload('barcodes.readBarcodeFromImage')).toEqual({
			operationId: 'barcodes.readBarcodeFromImage',
		});
	});
});
