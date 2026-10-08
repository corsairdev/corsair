import type { KeyBuilderContext } from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import type { ExtractaaiContext, ExtractaaiPluginOptions } from './index';
import { extractaai, extractaaiEndpointSchemas } from './index';

// Test-double justification: endpoint handlers require the full
// CorsairPluginContext (bound endpoints, key managers, DB clients) which unit
// tests cannot construct structurally. This single cast is confined to test
// setup and mirrors the precedent in packages/agiled/endpoints.test.ts.
// Plugin source files contain zero type assertions.
function createMockContext(key: string): ExtractaaiContext {
	const mock = {
		key,
		$getAccountId: (): Promise<string> => Promise.resolve('test-account-id'),
	};
	return mock as unknown as ExtractaaiContext;
}

// Same justification as above: the account key manager carries the full
// BaseKeyManager surface, so the manager is faked with only the accessor the
// keyBuilder uses. The helper is generic over the plugin options so the
// returned context matches each plugin instance's keyBuilder parameter
// exactly, including the zero-arg `extractaai()` overload.
function createKeyBuilderContext<T extends ExtractaaiPluginOptions>(
	options: T,
	getApiKey: () => Promise<string | null>,
): KeyBuilderContext<T, undefined> {
	const ctx = {
		authType: 'api_key',
		options,
		tenantId: 'default',
		keys: { get_api_key: getApiKey },
	};
	return ctx as unknown as KeyBuilderContext<T, undefined>;
}

const LIVE_API_KEY: string | undefined = process.env['EXTRACTAAI_API_KEY'];
const liveDescribe = LIVE_API_KEY === undefined ? describe.skip : describe;

describe('Extracta.ai plugin wiring', () => {
	it('registers all 10 operations with schemas and metadata', () => {
		const plugin = extractaai({ key: 'test-api-key' });

		expect(plugin.id).toBe('extractaai');
		expect(plugin.options?.key).toBe('test-api-key');
		expect(plugin.authConfig).toEqual({ api_key: { account: [] } });
		expect(plugin.endpoints?.extraction.create).toBeDefined();
		expect(plugin.endpoints?.extraction.view).toBeDefined();
		expect(plugin.endpoints?.extraction.update).toBeDefined();
		expect(plugin.endpoints?.extraction.delete).toBeDefined();
		expect(plugin.endpoints?.extraction.getBatchResults).toBeDefined();
		expect(plugin.endpoints?.classification.create).toBeDefined();
		expect(plugin.endpoints?.classification.view).toBeDefined();
		expect(plugin.endpoints?.classification.update).toBeDefined();
		expect(plugin.endpoints?.classification.delete).toBeDefined();
		expect(plugin.endpoints?.credits.get).toBeDefined();
		expect(plugin.webhooks).toEqual({});
		expect(Object.keys(extractaaiEndpointSchemas)).toHaveLength(10);
	});

	it('marks reads, writes, and destructive operations correctly', () => {
		const plugin = extractaai({ key: 'test-api-key' });

		expect(plugin.endpointMeta?.['credits.get']?.riskLevel).toBe('read');
		expect(plugin.endpointMeta?.['extraction.view']?.riskLevel).toBe('read');
		expect(plugin.endpointMeta?.['extraction.getBatchResults']?.riskLevel).toBe(
			'read',
		);
		expect(plugin.endpointMeta?.['extraction.create']?.riskLevel).toBe('write');
		expect(plugin.endpointMeta?.['extraction.delete']?.riskLevel).toBe(
			'destructive',
		);
		expect(plugin.endpointMeta?.['classification.delete']?.riskLevel).toBe(
			'destructive',
		);
	});

	it('supports api_key auth only', () => {
		const plugin = extractaai({ key: 'test-api-key' });
		expect(Object.keys(plugin.authConfig ?? {})).toEqual(['api_key']);
		expect(plugin.pluginWebhookMatcher?.({ headers: {}, body: '' })).toBe(
			false,
		);
	});

	it('keyBuilder returns the configured static key', async () => {
		const options: { key: string; authType: 'api_key' } = {
			key: 'static-key',
			authType: 'api_key',
		};
		const plugin = extractaai(options);

		const key = await plugin.keyBuilder?.(
			createKeyBuilderContext(options, () =>
				Promise.resolve('key-manager-key'),
			),
			'endpoint',
		);
		expect(key).toBe('static-key');
	});

	it('keyBuilder falls back to the key manager', async () => {
		const options: ExtractaaiPluginOptions = {};
		const plugin = extractaai(options);

		const key = await plugin.keyBuilder?.(
			createKeyBuilderContext(options, () => Promise.resolve('stored-key')),
			'endpoint',
		);
		expect(key).toBe('stored-key');
	});

	it('keyBuilder throws AuthMissingError without any key', async () => {
		const options: ExtractaaiPluginOptions = {};
		const plugin = extractaai(options);

		await expect(
			plugin.keyBuilder?.(
				createKeyBuilderContext(options, () => Promise.resolve(null)),
				'endpoint',
			),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});

liveDescribe('Extracta.ai live API (requires EXTRACTAAI_API_KEY)', () => {
	it('reads the account credit balance', async () => {
		if (LIVE_API_KEY === undefined) {
			throw new Error('EXTRACTAAI_API_KEY is required for live tests');
		}
		const ctx = createMockContext(LIVE_API_KEY);
		const plugin = extractaai({ key: LIVE_API_KEY });

		const result = await plugin.endpoints?.credits.get(ctx, {});

		expect(result?.status).toBe('ok');
		expect(typeof result?.credits).toBe('number');
	});

	it('runs the extraction lifecycle: create, view, update, delete', async () => {
		if (LIVE_API_KEY === undefined) {
			throw new Error('EXTRACTAAI_API_KEY is required for live tests');
		}
		const ctx = createMockContext(LIVE_API_KEY);
		const plugin = extractaai({ key: LIVE_API_KEY });
		const extraction = plugin.endpoints?.extraction;
		if (extraction === undefined) {
			throw new Error('extraction endpoints are not registered');
		}

		const created = await extraction.create(ctx, {
			extractionDetails: {
				name: 'Corsair live test extraction',
				description: 'Created by the automated live test, deleted after.',
				language: 'English',
				options: { hasTable: false },
				fields: [
					{ key: 'name', description: '', example: '' },
					{
						key: 'email',
						description: 'the email of the person',
						example: 'john@email.com',
					},
				],
			},
		});
		try {
			expect(created.status).toBe('created');
			const viewed = await extraction.view(ctx, {
				extractionId: created.extractionId,
			});
			expect(viewed.extractionId).toBe(created.extractionId);
			expect(viewed.extractionDetails.name).toBe(
				'Corsair live test extraction',
			);

			const updated = await extraction.update(ctx, {
				extractionId: created.extractionId,
				extractionDetails: { description: 'Updated by live test.' },
			});
			expect(updated.status).toBe('updated');

			await expect(
				extraction.getBatchResults(ctx, {
					extractionId: created.extractionId,
					batchId: 'batch_that_does_not_exist',
				}),
			).rejects.toThrow();
		} finally {
			const deleted = await extraction.delete(ctx, {
				extractionId: created.extractionId,
			});
			expect(deleted.status).toBe('deleted');
		}
	});

	it('runs the classification lifecycle: create, view, update, delete', async () => {
		if (LIVE_API_KEY === undefined) {
			throw new Error('EXTRACTAAI_API_KEY is required for live tests');
		}
		const ctx = createMockContext(LIVE_API_KEY);
		const plugin = extractaai({ key: LIVE_API_KEY });
		const classification = plugin.endpoints?.classification;
		if (classification === undefined) {
			throw new Error('classification endpoints are not registered');
		}

		const created = await classification.create(ctx, {
			classificationDetails: {
				name: 'Corsair live test classifier',
				description: 'Created by the automated live test, deleted after.',
				documentTypes: [
					{
						name: 'Invoice',
						description: 'Standard commercial invoice.',
						uniqueWords: ['invoice number', 'bill to', 'total amount'],
					},
				],
			},
		});
		try {
			expect(created.status).toBe('created');
			const viewed = await classification.view(ctx, {
				classificationId: created.classificationId,
			});
			expect(viewed.classificationId).toBe(created.classificationId);
			expect(viewed.classificationDetails.name).toBe(
				'Corsair live test classifier',
			);

			const updated = await classification.update(ctx, {
				classificationId: created.classificationId,
				classificationDetails: {
					name: 'Corsair live test classifier - updated',
					description: 'Updated by the automated live test.',
					documentTypes: [
						{
							name: 'Invoice',
							description: 'Standard commercial invoice.',
							uniqueWords: ['invoice number', 'bill to', 'total amount'],
						},
					],
				},
			});
			expect(updated.status).toBe('updated');
		} finally {
			const deleted = await classification.delete(ctx, {
				classificationId: created.classificationId,
			});
			expect(deleted.status).toBe('success');
		}
	});
});
