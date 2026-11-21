import { PingGetInputSchema, PingGetResponseSchema } from './endpoints/types';
import { FingertipSchema } from './schema';
import { fingertipEntities } from './schema/database';

describe('Fingertip schema', () => {
	it('declares a semver version and no local entities', () => {
		expect(FingertipSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(FingertipSchema.entities).toBe(fingertipEntities);
		expect(FingertipSchema.entities).toEqual({});
	});

	it('accepts only the empty ping input object', () => {
		expect(PingGetInputSchema.safeParse({}).success).toBe(true);
		expect(PingGetInputSchema.safeParse({ unexpected: true }).success).toBe(
			false,
		);
	});

	it('validates the documented ping message response field', () => {
		expect(PingGetResponseSchema.safeParse({ message: 'pong' }).success).toBe(
			true,
		);
		expect(PingGetResponseSchema.safeParse({}).success).toBe(false);
		expect(PingGetResponseSchema.safeParse({ message: 200 }).success).toBe(
			false,
		);
	});
});
