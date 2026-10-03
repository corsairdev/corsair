import { ConvexSchema } from './schema';
import {
	ConvexDeployKeySchema,
	ConvexDeploymentSchema,
	ConvexProjectSchema,
} from './schema/database';

describe('Convex schema', () => {
	it('declares a semver version', () => {
		expect(ConvexSchema.version).toBeDefined();
		expect(ConvexSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof ConvexSchema.entities).toBe('object');
		expect(ConvexSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(ConvexSchema.entities))).toBe(true);
		for (const entity of Object.values(ConvexSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	it('accepts official integer identifiers on cached entities', () => {
		expect(
			ConvexProjectSchema.safeParse({
				id: 123,
				name: 'Demo',
				slug: 'demo',
				teamId: 41,
				createTime: 1710000000000,
			}).success,
		).toBe(true);
		expect(
			ConvexDeploymentSchema.safeParse({
				id: 7,
				name: 'happy-otter-123',
				projectId: 123,
				createTime: 1710000000000,
			}).success,
		).toBe(true);
		expect(
			ConvexDeployKeySchema.safeParse({
				id: 99,
				deploymentName: 'happy-otter-123',
				name: 'ci',
				creationTime: 1710000000000,
			}).success,
		).toBe(true);
	});
});
