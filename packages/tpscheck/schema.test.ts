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
