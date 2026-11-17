import { TwoCaptchaSchema } from './schema';

describe('2Captcha schema', () => {
	it('declares a semver version', () => {
		expect(TwoCaptchaSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('stores no entities', () => {
		// A solved token is single-use and short-lived, so storing one would
		// only ever hand a caller an expired value.
		expect(Array.isArray(TwoCaptchaSchema.entities)).toBe(false);
		expect(TwoCaptchaSchema.entities).toEqual({});
	});
});
