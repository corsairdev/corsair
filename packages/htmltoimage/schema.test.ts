import { HtmlToImageSchema } from './schema';
import { HtmlToImageAccount, HtmlToImageRender } from './schema/database';

describe('HtmlToImage schema', () => {
	it('declares a semver version', () => {
		expect(HtmlToImageSchema.version).toBeDefined();
		expect(HtmlToImageSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares official account and render entities', () => {
		expect(Object.keys(HtmlToImageSchema.entities)).toEqual([
			'accounts',
			'renders',
		]);
	});

	it('accepts the documented GET /api/me payload', () => {
		expect(
			HtmlToImageAccount.parse({
				email: 'you@example.com',
				plan: '1k',
				plan_name: '1,000 Credits',
				active: true,
				free_plan: false,
				credits_remaining: 850,
				credits_reset_at: '2026-09-01T00:00:00+00:00',
			}),
		).toMatchObject({ credits_remaining: 850, plan: '1k' });
	});

	it('accepts a free-tier account with null plan fields', () => {
		expect(
			HtmlToImageAccount.parse({
				email: 'free@example.com',
				plan: null,
				plan_name: null,
				active: true,
				free_plan: true,
				credits_remaining: 12,
				credits_reset_at: null,
			}).credits_reset_at,
		).toBeNull();
	});

	it('accepts the documented render payload', () => {
		expect(
			HtmlToImageRender.parse({
				success: true,
				id: '8a9dda43-5f42-4b93-8ff4-cd96ed32d402',
				expires_at: null,
				credits_remaining: 950,
				url: 'https://i.html2img.com/image-1786092598870-921691.png',
			}).success,
		).toBe(true);
	});
});
