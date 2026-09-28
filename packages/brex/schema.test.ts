import { BrexSchema } from './schema';
import { BrexCompany, BrexUser } from './schema/database';

describe('Brex schema', () => {
	it('declares a semver version', () => {
		expect(BrexSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares official entities', () => {
		expect(Object.keys(BrexSchema.entities).length).toBeGreaterThan(5);
		for (const entity of Object.values(BrexSchema.entities)) {
			expect(entity).toBeDefined();
		}
		expect(BrexUser.parse({ id: 'user_1', email: 'ada@example.com' }).id).toBe(
			'user_1',
		);
		expect(BrexCompany.parse({ id: 'cuacc_1', legal_name: 'Acme' }).id).toBe(
			'cuacc_1',
		);
	});
});
