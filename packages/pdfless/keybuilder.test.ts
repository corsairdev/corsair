import { AuthMissingError } from 'corsair/core';
import { pdfless } from './index';

describe('PDFLess keyBuilder and risk levels', () => {
	const plugin = pdfless();
	// unknown: the test calls keyBuilder with a minimal context double.
	const build = plugin.keyBuilder as unknown as (
		ctx: unknown,
		source: string,
	) => Promise<string>;

	it('returns the stored API key', async () => {
		const ctx = {
			authType: 'api_key',
			keys: { get_api_key: async () => 'stored' },
		};
		await expect(build(ctx, 'endpoint')).resolves.toBe('stored');
	});

	it('throws AuthMissingError when no key is stored', async () => {
		const ctx = {
			authType: 'api_key',
			keys: { get_api_key: async () => null },
		};
		await expect(build(ctx, 'endpoint')).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});

	it('marks PDF generation destructive and the reads read', () => {
		const meta = plugin.endpointMeta as Record<string, { riskLevel: string }>;
		expect(Object.keys(meta).sort()).toEqual([
			'pdfs.generate',
			'templates.list',
			'workspace.get',
		]);
		expect(meta['pdfs.generate']?.riskLevel).toBe('destructive');
		expect(meta['templates.list']?.riskLevel).toBe('read');
	});
});
