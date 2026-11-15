import { quickbooks } from './index';
import { QuickBooksSchema } from './schema';

describe('QuickBooks scaffold', () => {
	it('does not expose unverified API or auth behavior', () => {
		const plugin = quickbooks();

		expect(plugin.endpoints).toEqual({});
		expect(plugin.webhooks).toEqual({});
		expect(plugin.endpointMeta).toEqual({});
		expect(plugin.endpointSchemas).toBeUndefined();
		expect(plugin.authConfig).toBeUndefined();
		expect(plugin.oauthConfig).toBeUndefined();
		expect(plugin.keyBuilder).toBeUndefined();
	});

	it('declares a semver schema version', () => {
		expect(QuickBooksSchema.version).toBeDefined();
		expect(QuickBooksSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('has no persistence entities until their contract is known', () => {
		expect(typeof QuickBooksSchema.entities).toBe('object');
		expect(QuickBooksSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(QuickBooksSchema.entities))).toBe(true);
		expect(QuickBooksSchema.entities).toEqual({});
	});
});
