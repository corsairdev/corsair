import type { ETerminEndpointInputs } from './endpoints';
import { ETerminEndpointInputSchemas } from './endpoints/types';
import { ETerminSchema } from './schema';

describe('ETermin schema', () => {
	it('declares a semver version', () => {
		expect(ETerminSchema.version).toBeDefined();
		expect(ETerminSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof ETerminSchema.entities).toBe('object');
		expect(ETerminSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(ETerminSchema.entities))).toBe(true);
		for (const entity of Object.values(ETerminSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.

describe('eTermin language-suffixed input types', () => {
	it('keeps the declared fields typed (checked by tsc)', () => {
		// @ts-expect-error id is required on services.update
		const missingId: ETerminEndpointInputs['servicesUpdate'] = {
			servicefr: 'x',
		};
		// @ts-expect-error id is a number
		const wrongId: ETerminEndpointInputs['servicesUpdate'] = { id: 'x' };
		const ok: ETerminEndpointInputs['servicesUpdate'] = {
			id: 1,
			servicefr: 'Consultation',
		};
		const schema = ETerminEndpointInputSchemas.servicesUpdate;
		expect(schema.safeParse(ok).success).toBe(true);
		expect(schema.safeParse(missingId).success).toBe(false);
		expect(schema.safeParse(wrongId).success).toBe(false);
		expect(schema.safeParse({ id: 1, servicefr: 3 }).success).toBe(false);
		expect(schema.safeParse({ id: 1, nonsense: 'x' }).success).toBe(false);
	});
});
