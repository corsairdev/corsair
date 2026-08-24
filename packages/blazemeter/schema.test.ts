/**
 * Field names below are the official JSON keys from
 * https://help.blazemeter.com/apidocs/ (performance workspace/project/test
 * objects, GET /user, workspace user list, and Test Data asset create).
 */
import { BlazemeterSchema } from './schema';
import {
	BlazemeterAccountEntity,
	BlazemeterAssetEntity,
	BlazemeterPackageEntity,
	BlazemeterProjectEntity,
	BlazemeterTestEntity,
	BlazemeterUserEntity,
	BlazemeterWorkspaceEntity,
	BlazemeterWorkspaceUserEntity,
} from './schema/database';

const DOC_KEYS = {
	accounts: ['id', 'name', 'owner'],
	workspaces: [
		'id',
		'name',
		'userId',
		'created',
		'updated',
		'enabled',
		'dedicatedIpsEnabled',
		'privateLocationsEnabled',
		'owner',
		'membersCount',
		'allowance',
		'accountId',
		'locations',
		'activeMember',
		'features',
	],
	projects: [
		'id',
		'name',
		'userId',
		'description',
		'created',
		'updated',
		'workspaceId',
		'testsCount',
	],
	tests: [
		'id',
		'name',
		'description',
		'isNewTest',
		'lastRunTime',
		'userId',
		'creatorClientId',
		'overrideExecutions',
		'executions',
		'hasThreadGroupsToOverride',
		'hasNonRegularThreadGroup',
		'shouldSendReportEmail',
		'dependencies',
		'tags',
		'created',
		'updated',
		'projectId',
		'lastUpdatedById',
		'configuration',
	],
	users: [
		'id',
		'email',
		'access',
		'login',
		'firstName',
		'lastName',
		'timezone',
		'enabled',
		'roles',
	],
	workspaceUsers: [
		'id',
		'email',
		'displayName',
		'firstName',
		'lastName',
		'login',
		'access',
		'roles',
		'enabled',
		'lastAccess',
		'type',
	],
	assets: [
		'id',
		'name',
		'displayName',
		'type',
		'accountId',
		'workspaceId',
		'packageId',
		'metadata',
		'createdAt',
		'updatedAt',
		'createdBy',
		'updatedBy',
		'dependencies',
	],
	packages: [
		'id',
		'name',
		'displayName',
		'version',
		'accountId',
		'workspaceId',
		'dependencies',
		'createdAt',
		'updatedAt',
	],
} as const;

function shapeKeys(schema: { shape: Record<string, unknown> }) {
	return Object.keys(schema.shape);
}

describe('BlazeMeter schema', () => {
	it('declares a semver version', () => {
		expect(BlazemeterSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('registers the mirrored entities', () => {
		expect(Object.keys(BlazemeterSchema.entities).sort()).toEqual([
			'accounts',
			'assets',
			'packages',
			'projects',
			'tests',
			'users',
			'workspaceUsers',
			'workspaces',
		]);
	});

	it('declares every official key on each entity', () => {
		const schemas = {
			accounts: BlazemeterAccountEntity,
			workspaces: BlazemeterWorkspaceEntity,
			projects: BlazemeterProjectEntity,
			tests: BlazemeterTestEntity,
			users: BlazemeterUserEntity,
			workspaceUsers: BlazemeterWorkspaceUserEntity,
			assets: BlazemeterAssetEntity,
			packages: BlazemeterPackageEntity,
		};
		for (const [name, keys] of Object.entries(DOC_KEYS)) {
			const declared = shapeKeys(
				schemas[name as keyof typeof schemas] as unknown as {
					shape: Record<string, unknown>;
				},
			);
			for (const key of keys) {
				expect(declared).toContain(key);
			}
		}
	});

	it('accepts the documented sample payloads', () => {
		expect(
			BlazemeterUserEntity.safeParse({
				id: 123456,
				email: 'my.name@my_email.com',
				access: 1522676762,
				login: 1521724222,
				firstName: 'my',
				lastName: 'name',
				timezone: 0,
				enabled: true,
				roles: ['user', 'new-billing', 'authenticated'],
			}).success,
		).toBe(true);

		expect(
			BlazemeterProjectEntity.safeParse({
				id: 123456,
				name: 'Default project',
				userId: 123456,
				description: null,
				created: 1488987563,
				updated: 1488987563,
				workspaceId: 123456,
				testsCount: 417,
			}).success,
		).toBe(true);

		expect(
			BlazemeterWorkspaceEntity.safeParse({
				id: 123456,
				name: 'Default workspace',
				userId: 123456,
				created: 1488987561,
				updated: 1573503519,
				enabled: true,
				dedicatedIpsEnabled: true,
				privateLocationsEnabled: true,
				owner: {
					id: 123456,
					email: 'my.user@myDomain.com',
					displayName: 'My User',
				},
				membersCount: 7,
				allowance: { amount: 17678, type: 'credits' },
				accountId: 123456,
			}).success,
		).toBe(true);

		expect(
			BlazemeterTestEntity.safeParse({
				id: 1234567,
				name: 'Minimum_Required_Configuration_Sample',
				isNewTest: true,
				userId: 123456,
				created: 1551391783,
				updated: 1551391783,
				creatorClientId: 'api',
				overrideExecutions: [],
				shouldSendReportEmail: true,
				projectId: 123456,
				lastUpdatedById: 123456,
				configuration: {
					type: 'taurus',
					executionType: 'taurusCloud',
					filename: 'DemoTest.jmx',
					testMode: 'script',
					scriptType: 'jmeter',
				},
			}).success,
		).toBe(true);
	});

	it('does not persist generated file content on assets', () => {
		expect(shapeKeys(BlazemeterAssetEntity)).not.toContain('data');
	});
});
