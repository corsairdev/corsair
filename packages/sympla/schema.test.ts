import { SymplaSchema } from './schema';
import { SymplaEventEntity } from './schema/database';

describe('Sympla schema', () => {
	it('declares a semver version and the events entity', () => {
		expect(SymplaSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(Object.keys(SymplaSchema.entities)).toEqual(['events']);
	});

	it('accepts an event row and rejects one with no id', () => {
		const parsed = SymplaEventEntity.parse({ id: '1', name: 'Show' });
		expect(parsed).toEqual({ id: '1', name: 'Show' });
		expect(SymplaEventEntity.safeParse({ name: 'Show' }).success).toBe(false);
		expect(SymplaEventEntity.safeParse({ id: '' }).success).toBe(false);
	});
});
