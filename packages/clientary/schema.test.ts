import { ClientarySchema } from './schema';

describe('Clientary schema', () => {
	it('declares a semver version', () => {
		expect(ClientarySchema.version).toBeDefined();
		expect(ClientarySchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof ClientarySchema.entities).toBe('object');
		expect(ClientarySchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(ClientarySchema.entities))).toBe(true);
		for (const entity of Object.values(ClientarySchema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	it('registers the primary resources as database entities', () => {
		const entityNames = Object.keys(ClientarySchema.entities);
		for (const expected of [
			'clients',
			'contacts',
			'projects',
			'invoices',
			'estimates',
			'tasks',
		]) {
			expect(entityNames).toContain(expected);
		}
	});

	it('requires an id and name on the clients entity', () => {
		const clientsEntity = ClientarySchema.entities.clients;
		expect(() => clientsEntity.parse({ name: 'No ID' })).toThrow();
		expect(() => clientsEntity.parse({ id: 1, name: 'Acme' })).not.toThrow();
	});

	it('accepts extra unknown fields on entities (loose parsing)', () => {
		expect(() =>
			ClientarySchema.entities.tasks.parse({
				id: 5,
				title: 'Ship it',
				complete: true,
				some_future_field: 'x',
			}),
		).not.toThrow();
	});
});
