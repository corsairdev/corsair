import { StoryblokSchema } from './schema';

describe('Storyblok schema', () => {
	it('declares a semver version', () => {
		expect(StoryblokSchema.version).toBeDefined();
		expect(StoryblokSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no entities, because no sync is useful', () => {
		expect(StoryblokSchema.entities).toEqual({});
	});
});
