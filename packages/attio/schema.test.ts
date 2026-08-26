import { AttioSchema } from './schema';
import { AttioRecord, AttioWorkspaceMember } from './schema/database';

describe('Attio schema', () => {
	it('declares a semver version', () => {
		expect(AttioSchema.version).toBeDefined();
		expect(AttioSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof AttioSchema.entities).toBe('object');
		expect(AttioSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(AttioSchema.entities))).toBe(true);
		for (const entity of Object.values(AttioSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	it('parses a workspace member with a structured id', () => {
		const parsed = AttioWorkspaceMember.parse({
			id: {
				workspace_id: 'ws-1',
				workspace_member_id: 'mem-1',
			},
			email_address: 'ada@example.com',
		});
		expect(parsed.id).toEqual({
			workspace_id: 'ws-1',
			workspace_member_id: 'mem-1',
		});
		expect(parsed.email_address).toBe('ada@example.com');
	});

	it('parses a record with a structured id', () => {
		const parsed = AttioRecord.parse({
			id: {
				workspace_id: 'ws-1',
				object_id: 'obj-1',
				record_id: 'rec-1',
			},
			values: { name: [{ value: 'Acme' }] },
		});
		expect(parsed.id).toEqual({
			workspace_id: 'ws-1',
			object_id: 'obj-1',
			record_id: 'rec-1',
		});
	});

	it('rejects a record without an id', () => {
		expect(() => AttioRecord.parse({ values: {} })).toThrow();
	});
});
