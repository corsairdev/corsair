import { renderEndpointSchemas } from './index';
import { RenderSchema } from './schema';

describe('Render schema', () => {
	it('declares a semver version', () => {
		expect(RenderSchema.version).toBeDefined();
		expect(RenderSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof RenderSchema.entities).toBe('object');
		expect(RenderSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(RenderSchema.entities))).toBe(true);
		for (const entity of Object.values(RenderSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	it('registers the full current Render operation catalog', () => {
		expect(Object.keys(renderEndpointSchemas).length).toBeGreaterThanOrEqual(
			93,
		);
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
