import {
	CoverageResponseSchema,
	CreditsResponseSchema,
	GetExamplePhoneNumberResponseSchema,
	VerifyPhoneNumberResponseSchema,
} from './endpoints/types';
import { VeriphoneSchema } from './schema';

describe('Veriphone schema', () => {
	it('declares a semver version', () => {
		expect(VeriphoneSchema.version).toBeDefined();
		expect(VeriphoneSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof VeriphoneSchema.entities).toBe('object');
		expect(VeriphoneSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(VeriphoneSchema.entities))).toBe(true);
		for (const entity of Object.values(VeriphoneSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Endpoints call these schemas on the raw provider response at runtime
// (see the `.parse(response)` calls in endpoints/*.ts).
describe('runtime output validation rejects malformed provider responses', () => {
	it('accepts a documented static verify response', () => {
		expect(() =>
			VerifyPhoneNumberResponseSchema.parse({
				status: 'success',
				phone: '+14169670000',
				phone_valid: true,
				phone_type: 'fixed_line',
				phone_region: 'Toronto, ON',
				country: 'Canada',
				country_code: 'CA',
				country_prefix: '1',
				international_number: '+1 416-967-0000',
				local_number: '(416) 967-0000',
				e164: '+14169670000',
				carrier: 'Bell',
				mode: 'static',
				timezone: ['America/Toronto'],
				geographical: true,
			}),
		).not.toThrow();
	});

	it('accepts a current-mode verify response with portability fields', () => {
		expect(() =>
			VerifyPhoneNumberResponseSchema.parse({
				status: 'success',
				phone: '+14169670000',
				phone_valid: true,
				mode: 'current',
				original_carrier: 'Bell',
				original_line_type: 'fixed_line',
				current_carrier: 'Comwave Networks',
				current_line_type: 'fixed_line',
				current_mccmnc: null,
				ported: true,
				carrier_data_source: 'registry',
			}),
		).not.toThrow();
	});

	it('accepts an invalid-number verify response with a reason', () => {
		const parsed = VerifyPhoneNumberResponseSchema.parse({
			status: 'success',
			phone: '+1 123 456 7890',
			phone_valid: false,
			reason: 'unrecognized_range',
		});
		expect(parsed.phone_valid).toBe(false);
		expect(parsed.reason).toBe('unrecognized_range');
	});

	it('rejects a verify response with the wrong field types', () => {
		expect(() =>
			VerifyPhoneNumberResponseSchema.parse({
				status: 42,
				phone_valid: 'yes',
			}),
		).toThrow();
	});

	it('rejects a verify response missing phone_valid', () => {
		expect(() =>
			VerifyPhoneNumberResponseSchema.parse({ status: 'success' }),
		).toThrow();
	});

	it('accepts a documented example-number response', () => {
		const parsed = GetExamplePhoneNumberResponseSchema.parse({
			status: 'success',
			phone_type: 'fixed_line',
			country_code: 'FR',
			country_prefix: '33',
			international_number: '+33 1 23 45 67 89',
			local_number: '01 23 45 67 89',
			e164: '+33123456789',
		});
		expect(parsed.phone_type).toBe('fixed_line');
		expect(parsed.country_code).toBe('FR');
	});

	it('accepts an example-number response with an uppercase E164 key', () => {
		const parsed = GetExamplePhoneNumberResponseSchema.parse({
			status: 'success',
			phone_type: 'mobile',
			country_code: 'US',
			E164: '+12025550143',
		});
		expect(parsed.E164).toBe('+12025550143');
	});

	it('normalizes an uppercase phone_type from the live example endpoint', () => {
		const parsed = GetExamplePhoneNumberResponseSchema.parse({
			status: 'success',
			phone_type: 'MOBILE',
			country_code: 'US',
		});
		expect(parsed.phone_type).toBe('mobile');
	});

	it('rejects an example-number response with an unknown status', () => {
		expect(() =>
			GetExamplePhoneNumberResponseSchema.parse({ status: 'bogus' }),
		).toThrow();
	});

	it('accepts a live-shaped credits response', () => {
		const parsed = CreditsResponseSchema.parse({
			email: 'user@example.com',
			counter: 5,
			active: true,
			payg: 0,
			limit: 1000,
			plan: 'FREE',
			renew: 5,
			last_reset: { seconds: 1788596342, nanos: 415000000 },
			usage: {
				static: { count: 5, credits: 5 },
				current: { count: 0, credits: 0 },
			},
		});
		expect(parsed.active).toBe(true);
		expect(parsed.counter).toBe(5);
		expect(parsed.usage?.static?.credits).toBe(5);
	});

	it('accepts a v2-shaped credits last_reset string', () => {
		const parsed = CreditsResponseSchema.parse({
			email: 'user@example.com',
			counter: 1250,
			active: true,
			payg: 0,
			limit: 5000,
			plan: 'FREE',
			renew: 15,
			last_reset: '2026-03-01T00:00:00Z',
		});
		expect(parsed.last_reset).toBe('2026-03-01T00:00:00Z');
	});

	it('rejects a credits response with the wrong field types', () => {
		expect(() => CreditsResponseSchema.parse({ counter: 'many' })).toThrow();
	});

	it('accepts a live-shaped coverage response', () => {
		const parsed = CoverageResponseSchema.parse({
			countries: [
				{ iso: 'US', covered: true },
				{ iso: 'CA', covered: true },
			],
			updatedAt: '2026-09-09T17:08:41.510849670Z',
		});
		expect(parsed.countries).toHaveLength(2);
	});

	it('rejects a coverage response missing countries', () => {
		expect(() => CoverageResponseSchema.parse({})).toThrow();
	});
});
