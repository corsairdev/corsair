import { byteforms } from './index';
import { ByteFormsSchema } from './schema';

describe('ByteForms schema', () => {
	it('declares a semver version', () => {
		expect(ByteFormsSchema.version).toBeDefined();
		expect(ByteFormsSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof ByteFormsSchema.entities).toBe('object');
		expect(ByteFormsSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(ByteFormsSchema.entities))).toBe(true);
		for (const entity of Object.values(ByteFormsSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	it('marks form delete as destructive', () => {
		const plugin = byteforms({ key: 'test' });
		const meta = plugin.endpointMeta as Record<string, { riskLevel: string }>;
		expect(meta['forms.delete']?.riskLevel).toBe('destructive');
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
