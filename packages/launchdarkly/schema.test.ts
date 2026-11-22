import {
	AccessTokensCreateInputSchema,
	AccessTokensListOutputSchema,
	AccountMembersInviteInputSchema,
	AccountMembersListOutputSchema,
	AuditLogListOutputSchema,
	ContextsSearchInputSchema,
	CustomRolesCreateInputSchema,
	EnvironmentsCreateInputSchema,
	EnvironmentsListOutputSchema,
	FeatureFlagsCreateInputSchema,
	FeatureFlagsListOutputSchema,
	JSONPatchOperationSchema,
	LaunchDarklyEndpointInputSchemas,
	LaunchDarklyEndpointOutputSchemas,
	ProjectsCreateInputSchema,
	ProjectsListOutputSchema,
	RootGetOutputSchema,
	SegmentsCreateInputSchema,
	SegmentsListOutputSchema,
	TagsListOutputSchema,
	TeamsCreateInputSchema,
	TeamsListOutputSchema,
	UserSegmentSchema,
	UsersListOutputSchema,
} from './endpoints/types';
import {
	launchdarklyEndpointMeta,
	launchdarklyEndpointSchemas,
	launchdarklyEndpointsNested,
} from './index';
import { LaunchDarklySchema } from './schema';

describe('LaunchDarkly schemas', () => {
	it('declares a semver version and an empty entities map', () => {
		expect(LaunchDarklySchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(typeof LaunchDarklySchema.entities).toBe('object');
		expect(Object.keys(LaunchDarklySchema.entities).length).toBe(0);
	});

	it('keeps registry, schema map and metadata key sets in exact sync', () => {
		const nestedOps: string[] = [];
		for (const [group, methods] of Object.entries(
			launchdarklyEndpointsNested,
		)) {
			for (const action of Object.keys(methods)) {
				nestedOps.push(`${group}.${action}`);
			}
		}

		const schemaKeys = Object.keys(launchdarklyEndpointSchemas).sort();
		const metaKeys = Object.keys(launchdarklyEndpointMeta).sort();
		const sortedNested = nestedOps.sort();

		expect(schemaKeys).toEqual(sortedNested);
		expect(metaKeys).toEqual(sortedNested);
	});

	it('rejects undocumented properties in every endpoint input schema', () => {
		for (const schema of Object.values(LaunchDarklyEndpointInputSchemas)) {
			expect(schema.safeParse({ undocumented: true }).success).toBe(false);
		}
	});

	it('validates empty responses for every DELETE operation', () => {
		const deleteSchemas = Object.entries(
			LaunchDarklyEndpointOutputSchemas,
		).filter(([operation]) => operation.endsWith('Delete'));
		expect(deleteSchemas).toHaveLength(8);
		for (const [, schema] of deleteSchemas) {
			expect(schema.safeParse(undefined).success).toBe(true);
			expect(schema.safeParse({}).success).toBe(false);
		}
	});

	describe('JSONPatchOperationSchema', () => {
		it('validates standard JSON Patch operations with arbitrary value types', () => {
			const validOps = [
				{ op: 'replace', path: '/name', value: 'Updated Project' },
				{ op: 'add', path: '/tags/-', value: 'new-tag' },
				{ op: 'remove', path: '/description' },
				{ op: 'move', from: '/old', path: '/new' },
				{ op: 'copy', from: '/source', path: '/dest' },
				{ op: 'test', path: '/active', value: true },
			];

			for (const operation of validOps) {
				const parsed = JSONPatchOperationSchema.safeParse(operation);
				expect(parsed.success).toBe(true);
			}
		});

		it('rejects unsupported JSON patch verbs', () => {
			const invalid = JSONPatchOperationSchema.safeParse({
				op: 'invalid_op',
				path: '/name',
			});
			expect(invalid.success).toBe(false);
		});
	});

	describe('Projects schemas', () => {
		it('validates ProjectsCreateInputSchema and enforces strict input fields', () => {
			const valid = ProjectsCreateInputSchema.safeParse({
				key: 'mobile-app',
				name: 'Mobile App',
				includeInSnippetByDefault: true,
				tags: ['ios', 'android'],
			});
			expect(valid.success).toBe(true);

			const extraField = ProjectsCreateInputSchema.safeParse({
				key: 'web-app',
				name: 'Web App',
				unsupportedField: 'rejected',
			});
			expect(extraField.success).toBe(false);

			const missingRequired = ProjectsCreateInputSchema.safeParse({
				name: 'Missing Key',
			});
			expect(missingRequired.success).toBe(false);
		});

		it('parses ProjectsListOutputSchema correctly', () => {
			const validOutput = {
				items: [
					{
						_id: '12345',
						key: 'mobile-app',
						name: 'Mobile App',
						tags: ['mobile'],
						_links: {
							self: {
								href: '/api/v2/projects/mobile-app',
								type: 'application/json',
							},
						},
					},
				],
				totalCount: 1,
			};

			const parsed = ProjectsListOutputSchema.safeParse(validOutput);
			expect(parsed.success).toBe(true);
			expect(
				ProjectsListOutputSchema.safeParse({ items: 'not-an-array' }).success,
			).toBe(false);
		});
	});

	describe('Environments schemas', () => {
		it('validates EnvironmentsCreateInputSchema', () => {
			const valid = EnvironmentsCreateInputSchema.safeParse({
				projectKey: 'proj-1',
				key: 'staging',
				name: 'Staging Environment',
				color: 'FF9900',
				defaultTtl: 60,
				secureMode: true,
			});
			expect(valid.success).toBe(true);

			const missingColor = EnvironmentsCreateInputSchema.safeParse({
				projectKey: 'proj-1',
				key: 'staging',
				name: 'Staging Environment',
			});
			expect(missingColor.success).toBe(false);
		});

		it('parses EnvironmentsListOutputSchema', () => {
			const output = {
				items: [
					{
						_id: 'env-1',
						key: 'production',
						name: 'Production',
						color: '417505',
						critical: true,
						apiKey: 'sdk-12345',
						mobileKey: 'mob-12345',
					},
				],
				totalCount: 1,
			};
			expect(EnvironmentsListOutputSchema.safeParse(output).success).toBe(true);
		});
	});

	describe('FeatureFlags schemas', () => {
		it('validates FeatureFlagsCreateInputSchema with multivariate variations', () => {
			const valid = FeatureFlagsCreateInputSchema.safeParse({
				projectKey: 'core',
				key: 'dark-mode',
				name: 'Dark Mode',
				variations: [
					{ value: 'light', name: 'Light' },
					{ value: 'dark', name: 'Dark' },
					{ value: 'system', name: 'System Default' },
				],
			});
			expect(valid.success).toBe(true);
		});

		it('parses FeatureFlagsListOutputSchema', () => {
			const output = {
				items: [
					{
						key: 'enable-checkout',
						name: 'Enable Checkout',
						kind: 'boolean',
						temporary: false,
						tags: ['checkout'],
					},
				],
				totalCount: 1,
			};
			expect(FeatureFlagsListOutputSchema.safeParse(output).success).toBe(true);
		});
	});

	describe('Segments schemas', () => {
		it('validates SegmentsCreateInputSchema and SegmentsListOutputSchema', () => {
			const input = {
				projectKey: 'core',
				environmentKey: 'production',
				key: 'beta-users',
				name: 'Beta Users',
				tags: ['beta'],
			};
			expect(SegmentsCreateInputSchema.safeParse(input).success).toBe(true);

			const output = {
				items: [
					{
						key: 'beta-users',
						name: 'Beta Users',
						included: ['user-1', 'user-2'],
					},
				],
				totalCount: 1,
			};
			expect(SegmentsListOutputSchema.safeParse(output).success).toBe(true);
		});

		it('accepts a documented null segment description', () => {
			expect(
				UserSegmentSchema.safeParse({
					key: 'beta-users',
					name: 'Beta Users',
					description: null,
				}).success,
			).toBe(true);
		});

		it('rejects undocumented segment expansion parameters', () => {
			expect(
				LaunchDarklyEndpointInputSchemas.segmentsList.safeParse({
					projectKey: 'core',
					environmentKey: 'production',
					expand: 'flags',
				}).success,
			).toBe(false);
		});
	});

	describe('Audit Log schemas', () => {
		it('parses AuditLogListOutputSchema', () => {
			const output = {
				items: [
					{
						_id: 'audit-1',
						date: 1700000000000,
						kind: 'flag',
						name: 'Turned on flag',
						shortDescription: 'Flag changed',
					},
				],
			};
			expect(AuditLogListOutputSchema.safeParse(output).success).toBe(true);
		});
	});

	describe('Account Members schemas', () => {
		it('validates AccountMembersInviteInputSchema and AccountMembersListOutputSchema', () => {
			const invite = {
				members: [
					{
						email: 'engineer@example.com',
						role: 'writer',
					},
				],
			};
			expect(AccountMembersInviteInputSchema.safeParse(invite).success).toBe(
				true,
			);

			const output = {
				items: [
					{
						_id: 'mem-1',
						email: 'admin@example.com',
						role: 'admin',
						_verified: true,
					},
				],
				totalCount: 1,
			};
			expect(AccountMembersListOutputSchema.safeParse(output).success).toBe(
				true,
			);
		});

		it('requires a base or custom role and caps invitation batches at 50', () => {
			expect(
				AccountMembersInviteInputSchema.safeParse({
					members: [{ email: 'member@example.com' }],
				}).success,
			).toBe(false);
			const members = Array.from({ length: 51 }, (_, index) => ({
				email: `member-${index}@example.com`,
				role: 'reader',
			}));
			expect(
				AccountMembersInviteInputSchema.safeParse({ members }).success,
			).toBe(false);
		});
	});

	describe('Teams schemas', () => {
		it('validates TeamsCreateInputSchema and TeamsListOutputSchema', () => {
			const create = {
				key: 'core-infra',
				name: 'Core Infrastructure',
				description: 'Platform team',
				memberIDs: ['mem-1', 'mem-2'],
			};
			expect(TeamsCreateInputSchema.safeParse(create).success).toBe(true);

			const output = {
				items: [
					{
						key: 'core-infra',
						name: 'Core Infrastructure',
						memberIDs: ['mem-1'],
					},
				],
				totalCount: 1,
			};
			expect(TeamsListOutputSchema.safeParse(output).success).toBe(true);
		});
	});

	describe('Custom Roles schemas', () => {
		it('validates CustomRolesCreateInputSchema with policy statements', () => {
			const create = {
				key: 'flag-admin',
				name: 'Flag Admin',
				policy: [
					{
						effect: 'allow',
						actions: ['*'],
						resources: ['proj/*:env/*:flag/*'],
					},
				],
				basePermissions: 'reader',
			};
			expect(CustomRolesCreateInputSchema.safeParse(create).success).toBe(true);
		});
	});

	describe('Contexts schemas', () => {
		it('validates ContextsSearchInputSchema', () => {
			const searchInput = {
				projectKey: 'core',
				environmentKey: 'production',
				filter: 'kind anyOf ["user"]',
				limit: 25,
			};
			expect(ContextsSearchInputSchema.safeParse(searchInput).success).toBe(
				true,
			);
		});
	});

	describe('Users schemas', () => {
		it('parses UsersListOutputSchema', () => {
			const output = {
				items: [
					{
						user: {
							key: 'user-123',
							email: 'user@example.com',
							name: 'Example User',
						},
						lastPing: '2026-11-14T00:00:00Z',
					},
				],
				totalCount: 1,
			};
			expect(UsersListOutputSchema.safeParse(output).success).toBe(true);
		});
	});

	describe('Access Tokens schemas', () => {
		it('validates AccessTokensCreateInputSchema and AccessTokensListOutputSchema', () => {
			const create = {
				name: 'Automation Token',
				role: 'writer',
				serviceToken: true,
			};
			expect(AccessTokensCreateInputSchema.safeParse(create).success).toBe(
				true,
			);

			const output = {
				items: [
					{
						_id: 'tok-1',
						name: 'Automation Token',
						role: 'writer',
					},
				],
				totalCount: 1,
			};
			expect(AccessTokensListOutputSchema.safeParse(output).success).toBe(true);
		});
	});

	describe('Tags schemas', () => {
		it('parses TagsListOutputSchema', () => {
			const output = {
				items: ['backend', 'frontend', 'mobile'],
				totalCount: 3,
			};
			expect(TagsListOutputSchema.safeParse(output).success).toBe(true);
		});
	});

	describe('Root schema', () => {
		it('parses RootGetOutputSchema', () => {
			const output = {
				links: {
					flags: { href: '/api/v2/flags', type: 'application/json' },
					projects: { href: '/api/v2/projects', type: 'application/json' },
				},
			};
			expect(RootGetOutputSchema.safeParse(output).success).toBe(true);
		});
	});

	describe('All registered schemas dictionary', () => {
		it('contains matching input and output schemas for every operation', () => {
			const inputKeys = Object.keys(LaunchDarklyEndpointInputSchemas).sort();
			const outputKeys = Object.keys(LaunchDarklyEndpointOutputSchemas).sort();
			expect(inputKeys).toEqual(outputKeys);
			expect(inputKeys.length).toBe(53);
		});
	});
});
