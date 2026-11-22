import { AuthMissingError } from 'corsair/core';
import type { InternalPdf4mePlugin } from './index';
import { pdf4me, pdf4meEndpointSchemas } from './index';

type KeyBuilder = (
	ctx: {
		authType: string;
		keys: { get_api_key: () => Promise<string | null> };
	},
	source: 'endpoint' | 'webhook',
) => string | Promise<string>;

const keyBuilderOf = (candidate: {
	// unknown: keyBuilder sits behind the plugin's optional type parameter, so
	// the test widens it to the shape it actually runs as.
	keyBuilder?: unknown;
}): KeyBuilder => candidate.keyBuilder as KeyBuilder;

function fixture(key?: string | null) {
	// unknown: the runtime key manager carries many more methods than the
	// fixture implements, so the object is widened through unknown.
	return {
		authType: 'api_key',
		key: undefined,
		keys: { get_api_key: () => Promise.resolve(key ?? null) },
		tenantId: 'default',
		// unknown: the runtime key manager carries many more methods than the
		// fixture implements, so the object is widened through unknown.
	} as unknown as Parameters<KeyBuilder>[0];
}

describe('pdf4me plugin', () => {
	it('declares the plugin id and api_key auth', () => {
		const instance: InternalPdf4mePlugin = pdf4me({});
		expect(instance.id).toBe('pdf4me');
		expect(instance.options?.authType).toBe('api_key');
	});

	it('exposes 12 operations across 4 groups', () => {
		const groups = pdf4me({}).endpoints!;
		const totals = Object.entries(groups).map(
			([group, ops]) => [group, Object.keys(ops).length] as const,
		);
		expect(totals).toEqual([
			['pdf', 6],
			['convert', 3],
			['extract', 2],
			['jobs', 1],
		]);
	});

	it('registers a schema and meta for every operation', () => {
		const instance = pdf4me({});
		const meta = instance.endpointMeta!;
		for (const [group, ops] of Object.entries(instance.endpoints!)) {
			for (const op of Object.keys(ops)) {
				const key = `${group}.${op}`;
				expect(
					pdf4meEndpointSchemas[key as keyof typeof pdf4meEndpointSchemas],
				).toBeDefined();
				expect(meta[key as keyof typeof meta]).toBeDefined();
			}
		}
	});

	it('marks every credit-billed file-producing call destructive (R8 paid jobs), metered reads read', () => {
		const meta = pdf4me({}).endpointMeta!;
		for (const op of [
			'pdf.merge',
			'pdf.split',
			'pdf.compress',
			'pdf.extractPages',
			'pdf.deletePages',
			'convert.pdfToWord',
			'convert.htmlToPdf',
			'convert.ocrPdf',
		] as const) {
			expect(meta[op]).toMatchObject({ riskLevel: 'destructive' });
		}
		expect(meta['pdf.deletePages']).not.toHaveProperty('irreversible');
		expect(meta['extract.tableFromPdf']).toMatchObject({ riskLevel: 'read' });
		expect(meta['pdf.getInfo']).toMatchObject({ riskLevel: 'read' });
		expect(meta['jobs.status']).toMatchObject({ riskLevel: 'read' });
	});

	it('registers no webhooks, because PDF4me notifies via the callBackUrl body field instead', () => {
		const instance: InternalPdf4mePlugin = pdf4me({});
		expect(instance.webhooks).toEqual({});
	});
});

describe('pdf4me keyBuilder', () => {
	it('uses the inline key first', async () => {
		await expect(
			keyBuilderOf(pdf4me({ key: 'inline-key' }))(
				fixture('stored-key'),
				'endpoint',
			),
		).resolves.toBe('inline-key');
	});

	it('falls back to the stored key', async () => {
		await expect(
			keyBuilderOf(pdf4me({}))(fixture('stored-key'), 'endpoint'),
		).resolves.toBe('stored-key');
	});

	it('throws AuthMissingError when no key exists', async () => {
		await expect(
			keyBuilderOf(pdf4me({}))(fixture(null), 'endpoint'),
		).rejects.toThrow(AuthMissingError);
	});
});
