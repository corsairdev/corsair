import { jest } from '@jest/globals';
import { api2pdf, api2pdfEndpointSchemas } from './index';

/**
 * `index.ts` only needs `AuthMissingError` from `corsair/core` at runtime.
 * Loading the real barrel pulls in the hub tunnel, which cannot be evaluated
 * inside jest.
 */
jest.mock('corsair/core', () => {
	class AuthMissingError extends Error {
		constructor(plugin: string, authType: string) {
			super(`Missing ${authType} auth for ${plugin}`);
			this.name = 'AuthMissingError';
		}
	}

	return { AuthMissingError, logEventFromContext: jest.fn() };
});

/**
 * The plugin declares its operations in four places: the nested endpoint map,
 * the endpoint schemas, the endpoint metadata, and the exported types. These
 * assertions keep those in lockstep — drift between them previously shipped
 * operations that had metadata but no implementation.
 */
const EXPECTED_OPERATIONS = [
	'chrome.addHeaderFooter',
	'libreoffice.libreOfficePdfToHtml',
	'libreoffice.libreOfficeThumbnail',
	'pdfsharp.extractPages',
	'pdfsharp.mergePdfs',
	'pdfsharp.optimizePdf',
	'pdfsharp.watermarkPdf',
	'utility.checkStatus',
	'utility.deletePdf',
	'zebra.generateBarcode',
];

/** `keyBuilder` is optional on the shared plugin type; assert it is wired here. */
function keyBuilderOf(plugin: { keyBuilder?: unknown }) {
	const keyBuilder = plugin.keyBuilder;
	if (typeof keyBuilder !== 'function') {
		throw new Error('keyBuilder is not registered');
	}
	return keyBuilder as (ctx: unknown, source: string) => Promise<string>;
}

function flattenEndpoints(plugin: ReturnType<typeof api2pdf>): string[] {
	const groups = plugin.endpoints as unknown as Record<
		string,
		Record<string, unknown>
	>;
	return Object.entries(groups)
		.flatMap(([group, ops]) => Object.keys(ops).map((op) => `${group}.${op}`))
		.sort();
}

describe('api2pdf plugin registration', () => {
	const plugin = api2pdf();

	it('exposes exactly the ten documented operations', () => {
		expect(flattenEndpoints(plugin)).toEqual(EXPECTED_OPERATIONS);
	});

	it('registers every endpoint as a callable function', () => {
		const groups = plugin.endpoints as unknown as Record<
			string,
			Record<string, unknown>
		>;
		for (const ops of Object.values(groups)) {
			for (const [name, fn] of Object.entries(ops)) {
				expect(typeof fn).toBe(`function`);
				expect(name).not.toHaveLength(0);
			}
		}
	});

	it('has an input and output schema for every endpoint', () => {
		expect(Object.keys(api2pdfEndpointSchemas).sort()).toEqual(
			EXPECTED_OPERATIONS,
		);

		for (const [name, schemas] of Object.entries(api2pdfEndpointSchemas)) {
			expect(schemas.input).toBeDefined();
			expect(schemas.output).toBeDefined();
			expect(typeof schemas.input.parse).toBe(`function`);
			expect(typeof schemas.output.parse).toBe(`function`);
			expect(name).not.toHaveLength(0);
		}
	});

	it('has metadata with a risk level and description for every endpoint', () => {
		const meta = plugin.endpointMeta as unknown as Record<
			string,
			{ riskLevel: string; description: string }
		>;
		expect(Object.keys(meta).sort()).toEqual(EXPECTED_OPERATIONS);

		for (const entry of Object.values(meta)) {
			expect(['read', 'write']).toContain(entry.riskLevel);
			expect(entry.description.length).toBeGreaterThan(0);
		}
	});

	it('marks only the health check as a read operation', () => {
		const meta = plugin.endpointMeta as unknown as Record<
			string,
			{ riskLevel: string }
		>;
		const reads = Object.entries(meta)
			.filter(([, entry]) => entry.riskLevel === 'read')
			.map(([name]) => name);

		expect(reads).toEqual(['utility.checkStatus']);
	});

	it('accepts negative extract-pages offsets in the input schema', () => {
		const schema = api2pdfEndpointSchemas['pdfsharp.extractPages'].input;
		expect(() =>
			schema.parse({ url: 'https://example.com/a.pdf', start: -1, end: -1 }),
		).not.toThrow();
	});

	it('declares api_key auth and registers no webhooks', () => {
		expect(plugin.id).toBe('api2pdf');
		expect(plugin.authConfig).toHaveProperty('api_key');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
	});

	it('resolves a statically configured key without touching the key store', async () => {
		const configured = api2pdf({ key: 'static-key' });
		const ctx = {
			authType: 'api_key',
			keys: {
				get_api_key: async () => {
					throw new Error('key store should not be consulted');
				},
			},
		};

		await expect(keyBuilderOf(configured)(ctx, 'endpoint')).resolves.toBe(
			'static-key',
		);
	});

	it('throws AuthMissingError when no key is configured or stored', async () => {
		const ctx = {
			authType: 'api_key',
			keys: { get_api_key: async () => undefined },
		};

		await expect(keyBuilderOf(plugin)(ctx, 'endpoint')).rejects.toThrow();
	});
});
