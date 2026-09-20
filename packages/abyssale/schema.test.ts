import { AbyssaleSchema } from './schema';
import {
	AbyssaleBanner,
	AbyssaleDesign,
	AbyssaleFont,
	AbyssaleProject,
} from './schema/database';

describe('Abyssale database schema', () => {
	it('declares a semver version', () => {
		expect(AbyssaleSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('registers the cacheable resources', () => {
		expect(Object.keys(AbyssaleSchema.entities).sort()).toEqual([
			'banners',
			'designs',
			'fonts',
			'projects',
		]);
	});

	it('parses a live project payload', () => {
		// Captured from GET /projects
		expect(() =>
			AbyssaleProject.parse({
				id: '0e6b46e8-e926-4a50-afe9-155ff8d254e7',
				name: 'd',
				category_name: 'd',
				created_at_ts: 1787317134,
			}),
		).not.toThrow();
	});

	it('parses a live font payload, including italic weight strings', () => {
		// Captured from GET /fonts — the reference says integers, but the API
		// also returns italic variants as strings.
		const parsed = AbyssaleFont.parse({
			id: '32d5ddea-d00e-11ef-959f-95b8d711cdd0',
			name: 'ABeeZee',
			type: 'google',
			available_weights: [400, '400-italic'],
		});
		expect(parsed.available_weights).toEqual([400, '400-italic']);
	});

	it('keeps the deprecated design aliases the API still returns', () => {
		const parsed = AbyssaleDesign.parse({
			id: '11111111-1111-1111-1111-111111111111',
			template_id: '11111111-1111-1111-1111-111111111111',
			name: 'Banner',
			type: 'static',
			project_id: '22222222-2222-2222-2222-222222222222',
			project_name: 'Campaign',
			category_id: '33333333-3333-3333-3333-333333333333',
			category_name: 'Campaign',
			version: 'v1',
			created_at: 1787317134,
			updated_at: 1787317134,
			preview_url: 'https://example.com/p.png',
		});
		expect(parsed.template_id).toBeDefined();
		expect(parsed.category_name).toBeDefined();
		expect(parsed.version).toBe('v1');
	});

	it('accepts newer fields without rejecting the response', () => {
		const parsed = AbyssaleProject.parse({
			id: 'p',
			name: 'n',
			brand_new_field: 1,
		});
		expect(parsed.brand_new_field).toBe(1);
	});

	it('parses a generated banner, including HTML5 output without a cdn_url', () => {
		const parsed = AbyssaleBanner.parse({
			id: '64238d01-d402-474b-8c2d-fbc957e9d290',
			version: 3,
			sharing_id: '5fcec999-2bfb-4dd7-ba38-2d9e16c49149',
			file: {
				type: 'zip',
				url: 'https://cdn.abyssale.com/banner.zip',
				fallback_image_url: 'https://cdn.abyssale.com/banner.jpeg',
			},
			format: { width: 1200, height: 628 },
			template: {
				id: '46d22c62-d134-44d3-a040-138e4ea9ea08',
				name: 'Summer campaign',
			},
		});
		expect(parsed.file?.fallback_image_url).toBe(
			'https://cdn.abyssale.com/banner.jpeg',
		);
		expect(parsed.format?.id).toBeUndefined();
	});
});
