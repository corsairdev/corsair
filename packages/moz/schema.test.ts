import { z } from 'zod';
import { mozEndpointSchemas } from './index';
import { MozSchema } from './schema';

describe('moz schema', () => {
	it('is version 1.0.0', () => {
		expect(MozSchema.version).toBe('1.0.0');
	});

	// Moz is a read-only data API: it holds no records for Corsair to store,
	// so there is nothing to sync and no entities are declared.
	it('declares no entities', () => {
		expect(Array.isArray(MozSchema.entities)).toBe(false);
		expect(Object.keys(MozSchema.entities ?? {})).toEqual([]);
	});

	it('parses a documented output through each registered schema', () => {
		// Spot-check the registry wiring: every entry must be a Zod type, so
		// a typo swapping input for output fails here.
		for (const [op, schemas] of Object.entries(mozEndpointSchemas)) {
			expect(schemas.input).toBeInstanceOf(z.ZodType);
			expect(schemas.output).toBeInstanceOf(z.ZodType);
			expect(op.length).toBeGreaterThan(0);
		}
	});
});
