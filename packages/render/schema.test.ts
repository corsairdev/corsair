import { render, renderEndpointSchemas } from './index';
import { RenderSchema } from './schema';

jest.mock('./client', () => ({
	makeRenderRequest: jest.fn(),
}));

import { makeRenderRequest } from './client';

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

	it('enforces endpoint schemas at the bound endpoint boundary', async () => {
		const request = jest.mocked(makeRenderRequest);
		request.mockResolvedValue([]);
		const plugin = render({ key: 'secret' });
		const ctx = { key: 'secret' } as never;
		if (!plugin.endpoints) throw new Error('Render endpoints are missing');

		await expect(
			plugin.endpoints.services.list(ctx, { limit: 0 } as never),
		).rejects.toThrow();
		expect(request).not.toHaveBeenCalled();

		await expect(plugin.endpoints.services.list(ctx, {})).resolves.toEqual([]);
	});

	it('provides executable input and output contracts for every operation', () => {
		for (const schemas of Object.values(renderEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
