import {
	BatchInputSchema,
	BatchResponseSchema,
	CheckInputSchema,
	CheckResponseSchema,
	CreditsInputSchema,
	CreditsResponseSchema,
	StatusInputSchema,
	StatusResponseSchema,
} from './endpoints/types';
import { TpscheckSchema } from './schema';
import { tpscheckEntities } from './schema/database';

describe('Tpscheck schema', () => {
	it('declares a semver version', () => {
		expect(TpscheckSchema.version).toBeDefined();
		expect(TpscheckSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an empty entities map', () => {
		expect(TpscheckSchema.entities).toBe(tpscheckEntities);
		expect(TpscheckSchema.entities).toEqual({});
	});
});

// Fixture shapes below mirror the v2 examples published at
// https://www.tpscheck.uk/documentation/ (check §5, batch §6,
// credits §7, status §4).

describe('Tpscheck endpoint schemas', () => {
	it('validates check input and output', () => {
		expect(CheckInputSchema.safeParse({ phone: '01829 830730' }).success).toBe(
			true,
		);
		expect(CheckInputSchema.safeParse({ phone: '' }).success).toBe(false);
		expect(CheckInputSchema.safeParse({}).success).toBe(false);

		const output = {
			input: '01829 830730',
			e164: '+441829830730',
			valid: true,
			line: {
				type: 'landline',
				original_carrier: 'BT',
				location: 'Tarporley',
				country: 'England',
				prefix: '01829',
			},
			reachability: { status: 'unknown', confidence: 'medium' },
			tps: false,
			ctps: false,
		};
		expect(CheckResponseSchema.safeParse(output).success).toBe(true);
		expect(
			CheckResponseSchema.safeParse({ input: '01829 830730' }).success,
		).toBe(false);
	});

	it('validates batch input bounds and output', () => {
		expect(
			BatchInputSchema.safeParse({ phones: ['01564 331484'] }).success,
		).toBe(true);
		expect(BatchInputSchema.safeParse({ phones: [] }).success).toBe(false);
		expect(
			BatchInputSchema.safeParse({
				phones: Array.from({ length: 101 }, (_, i) => `070000000${i}`),
			}).success,
		).toBe(false);

		const output = {
			total: 2,
			results: [
				{ input: '01564 331484', e164: '+441564331484', valid: true },
				{ input: '01953 498974', e164: '+441953498974', valid: true },
			],
		};
		expect(BatchResponseSchema.safeParse(output).success).toBe(true);
		expect(BatchResponseSchema.safeParse({ total: 2 }).success).toBe(false);
	});

	it('validates credits input and output', () => {
		expect(CreditsInputSchema.safeParse({}).success).toBe(true);

		const output = {
			requests_used: 245,
			requests_remaining: 9755,
			monthly_limit: 10000,
			plan: 'Starter',
			reset_date: '2025-07-01T00:00:00Z',
		};
		expect(CreditsResponseSchema.safeParse(output).success).toBe(true);
		expect(
			CreditsResponseSchema.safeParse({ requests_used: 245 }).success,
		).toBe(false);
	});

	it('validates status input and output', () => {
		expect(StatusInputSchema.safeParse({}).success).toBe(true);

		expect(
			StatusResponseSchema.safeParse({ status: 'ok', version: '1.0.0' })
				.success,
		).toBe(true);
		expect(StatusResponseSchema.safeParse({}).success).toBe(false);
	});
});
