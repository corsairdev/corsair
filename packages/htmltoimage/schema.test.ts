import { HtmlToImageSchema } from './schema';

describe('HtmlToImage schema', () => {
	it('declares a semver version', () => {
		expect(HtmlToImageSchema.version).toBeDefined();
		expect(HtmlToImageSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an empty entities map', () => {
		expect(HtmlToImageSchema.entities).toEqual({});
	});
});
