import {
	CoverageResponseSchema,
	CreditsResponseSchema,
	VerifyResponseSchema,
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
			VerifyResponseSchema.parse({
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
			VerifyResponseSchema.parse({
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

	it('rejects a verify response with the wrong field types', () => {
		expect(() =>
			VerifyResponseSchema.parse({ status: 42, phone_valid: 'yes' }),
		).toThrow();
	});

	it('accepts a documented credits response', () => {
		const parsed = CreditsResponseSchema.parse({
			email: 'user@example.com',
			counter: 10,
			active: true,
			payg: 0,
			limit: 100,
			plan: 'FREE',
			renew: 15,
		});
		expect(parsed.active).toBe(true);
		expect(parsed.counter).toBe(10);
	});

	it('accepts a documented coverage response', () => {
		const parsed = CoverageResponseSchema.parse({
			countries: [
				{ iso: 'US', covered: true },
				{ iso: 'CA', covered: true },
			],
			updatedAt: '2026-07-04T04:15:00Z',
		});
		expect(parsed.countries).toHaveLength(2);
	});

	it('rejects a coverage response missing countries', () => {
		expect(() => CoverageResponseSchema.parse({})).toThrow();
	});
});
