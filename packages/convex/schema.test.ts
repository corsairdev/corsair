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

	it('registers the three Management API entities', () => {
		expect(Object.keys(ConvexSchema.entities).sort()).toEqual([
			'deployKeys',
			'deployments',
			'projects',
		]);
	});

	it('accepts official Management API objects with integer identifiers', () => {
		expect(
			ConvexProjectSchema.safeParse({
				id: 123,
				name: 'Demo',
				slug: 'demo',
				teamId: 41,
				teamSlug: 'acme',
				createTime: 1710000000000,
				prodDeploymentName: null,
			}).success,
		).toBe(true);
		expect(
			ConvexDeploymentSchema.safeParse({
				id: 7,
				name: 'happy-otter-123',
				createTime: 1710000000000,
				deploymentType: 'dev',
				projectId: 123,
				region: 'aws-us-east-1',
				isDefault: true,
				reference: 'dev/alice',
				deploymentUrl: 'https://happy-otter-123.convex.cloud',
				class: 's16',
				kind: 'cloud',
			}).success,
		).toBe(true);
		expect(
			ConvexDeployKeySchema.safeParse({
				id: 99,
				deploymentName: 'happy-otter-123',
				name: 'ci',
				creationTime: 1710000000000,
				managedBy: { oauthApp: 'my-app' },
				allowedActions: ['deployment:deploy'],
			}).success,
		).toBe(true);
	});

	it('rejects string identifiers and unknown deployment types', () => {
		expect(
			ConvexProjectSchema.safeParse({
				id: '123',
				name: 'Demo',
				slug: 'demo',
				teamId: 41,
				teamSlug: 'acme',
				createTime: 1,
			}).success,
		).toBe(false);
		expect(
			ConvexDeploymentSchema.safeParse({
				name: 'x',
				createTime: 1,
				deploymentType: 'staging',
				projectId: 1,
				kind: 'cloud',
			}).success,
		).toBe(false);
	});
});
