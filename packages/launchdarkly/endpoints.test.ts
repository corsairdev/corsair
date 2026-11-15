import { logEventFromContext } from 'corsair/core';
import { makeLaunchDarklyRequest } from './client';
import {
	AccessTokens,
	AccountMembers,
	AuditLog,
	Contexts,
	CustomRoles,
	Environments,
	FeatureFlags,
	Projects,
	Root,
	Segments,
	Tags,
	Teams,
	Users,
} from './endpoints';
import type { LaunchDarklyContext } from './index';
import { launchdarklyEndpointsNested } from './index';

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return {
		...actual,
		makeLaunchDarklyRequest: jest.fn(),
	};
});

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn(),
	};
});

const mockedRequest = jest.mocked(makeLaunchDarklyRequest);
const mockedLogEvent = jest.mocked(logEventFromContext);

// `unknown` because these unused nested endpoints deliberately accept any input shape.
const unusedBoundEndpoint = async (_input: unknown): Promise<never> => {
	throw new Error('Nested endpoint is not used by this test context');
};

const dummyContext = {
	key: 'test-token-xyz',
	db: {},
	options: {},
	keys: {
		get_dek: async () => 'test-dek',
		issue_new_dek: async () => 'test-dek',
		get_api_key: async () => 'test-token-xyz',
		set_api_key: async () => undefined,
		get_webhook_signature: async () => null,
		set_webhook_signature: async () => undefined,
	},
	$getAccountId: async () => 'test-account-id',
	endpoints: {
		projects: {
			list: unusedBoundEndpoint,
			get: unusedBoundEndpoint,
			create: unusedBoundEndpoint,
			update: unusedBoundEndpoint,
			delete: unusedBoundEndpoint,
		},
		environments: {
			list: unusedBoundEndpoint,
			get: unusedBoundEndpoint,
			create: unusedBoundEndpoint,
			update: unusedBoundEndpoint,
			delete: unusedBoundEndpoint,
			resetSdkKey: unusedBoundEndpoint,
			resetMobileKey: unusedBoundEndpoint,
		},
		featureFlags: {
			list: unusedBoundEndpoint,
			get: unusedBoundEndpoint,
			create: unusedBoundEndpoint,
			update: unusedBoundEndpoint,
			delete: unusedBoundEndpoint,
			getStatus: unusedBoundEndpoint,
			listStatuses: unusedBoundEndpoint,
		},
		segments: {
			list: unusedBoundEndpoint,
			get: unusedBoundEndpoint,
			create: unusedBoundEndpoint,
			update: unusedBoundEndpoint,
			delete: unusedBoundEndpoint,
		},
		auditLog: { list: unusedBoundEndpoint, get: unusedBoundEndpoint },
		accountMembers: {
			list: unusedBoundEndpoint,
			get: unusedBoundEndpoint,
			invite: unusedBoundEndpoint,
			update: unusedBoundEndpoint,
			delete: unusedBoundEndpoint,
		},
		teams: {
			list: unusedBoundEndpoint,
			get: unusedBoundEndpoint,
			create: unusedBoundEndpoint,
			update: unusedBoundEndpoint,
			delete: unusedBoundEndpoint,
		},
		customRoles: {
			list: unusedBoundEndpoint,
			get: unusedBoundEndpoint,
			create: unusedBoundEndpoint,
			update: unusedBoundEndpoint,
			delete: unusedBoundEndpoint,
		},
		contexts: {
			search: unusedBoundEndpoint,
			get: unusedBoundEndpoint,
			listKinds: unusedBoundEndpoint,
		},
		users: {
			list: unusedBoundEndpoint,
			get: unusedBoundEndpoint,
			search: unusedBoundEndpoint,
		},
		accessTokens: {
			list: unusedBoundEndpoint,
			get: unusedBoundEndpoint,
			create: unusedBoundEndpoint,
			delete: unusedBoundEndpoint,
		},
		tags: { list: unusedBoundEndpoint },
		root: { get: unusedBoundEndpoint },
	},
} satisfies LaunchDarklyContext;

describe('LaunchDarkly endpoints', () => {
	beforeEach(() => {
		mockedRequest.mockReset();
		mockedLogEvent.mockReset();
	});

	it('rejects undocumented input properties for every endpoint before network I/O', async () => {
		for (const group of Object.values(launchdarklyEndpointsNested)) {
			for (const endpoint of Object.values(group)) {
				await expect(
					Reflect.apply(endpoint, undefined, [
						dummyContext,
						{ undocumented: true },
					]),
				).rejects.toThrow();
			}
		}
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	describe('Projects', () => {
		it('Projects.list requests GET /api/v2/projects with query params and parses result', async () => {
			mockedRequest.mockResolvedValueOnce({
				items: [{ _id: 'p1', key: 'proj-1', name: 'Project 1' }],
				totalCount: 1,
			});

			const res = await Projects.list(dummyContext, {
				limit: 10,
				filter: 'key:proj-1',
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'/api/v2/projects',
				'test-token-xyz',
				expect.objectContaining({
					method: 'GET',
					query: { limit: 10, filter: 'key:proj-1' },
				}),
			);
			expect(res.items[0]?.key).toBe('proj-1');
			expect(mockedLogEvent).toHaveBeenCalledWith(
				dummyContext,
				'launchdarkly.projects.list',
				{ count: 1 },
				'completed',
			);
		});

		it('Projects.get encodes projectKey and calls GET /api/v2/projects/{projectKey}', async () => {
			mockedRequest.mockResolvedValueOnce({
				_id: 'p1',
				key: 'proj/special',
				name: 'Special Project',
			});

			const res = await Projects.get(dummyContext, {
				projectKey: 'proj/special',
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'/api/v2/projects/proj%2Fspecial',
				'test-token-xyz',
				expect.objectContaining({ method: 'GET' }),
			);
			expect(res.name).toBe('Special Project');
		});

		it('Projects.create posts payload and parses returned project', async () => {
			mockedRequest.mockResolvedValueOnce({
				_id: 'p2',
				key: 'new-proj',
				name: 'New Project',
			});

			const res = await Projects.create(dummyContext, {
				key: 'new-proj',
				name: 'New Project',
				tags: ['infra'],
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'/api/v2/projects',
				'test-token-xyz',
				expect.objectContaining({
					method: 'POST',
					body: expect.objectContaining({
						key: 'new-proj',
						name: 'New Project',
					}),
				}),
			);
			expect(res.key).toBe('new-proj');
		});

		it('Projects.update patches project via JSON Patch', async () => {
			mockedRequest.mockResolvedValueOnce({
				_id: 'p1',
				key: 'proj-1',
				name: 'Updated Name',
			});

			const res = await Projects.update(dummyContext, {
				projectKey: 'proj-1',
				patch: [{ op: 'replace', path: '/name', value: 'Updated Name' }],
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'/api/v2/projects/proj-1',
				'test-token-xyz',
				expect.objectContaining({
					method: 'PATCH',
					body: [{ op: 'replace', path: '/name', value: 'Updated Name' }],
				}),
			);
			expect(res.name).toBe('Updated Name');
		});

		it('Projects.delete sends DELETE /api/v2/projects/{projectKey}', async () => {
			mockedRequest.mockResolvedValueOnce(undefined);

			await Projects.delete(dummyContext, { projectKey: 'old-proj' });

			expect(mockedRequest).toHaveBeenCalledWith(
				'/api/v2/projects/old-proj',
				'test-token-xyz',
				expect.objectContaining({ method: 'DELETE' }),
			);
		});

		it('rejects invalid project input before making network request', async () => {
			// Reflect.apply bypasses static input typing to exercise runtime Zod validation.
			await expect(
				Reflect.apply(Projects.get, undefined, [dummyContext, { name: 123 }]),
			).rejects.toThrow();

			expect(mockedRequest).not.toHaveBeenCalled();
		});
	});

	describe('Environments', () => {
		it('Environments.list calls GET /api/v2/projects/{projectKey}/environments', async () => {
			mockedRequest.mockResolvedValueOnce({
				items: [
					{ _id: 'e1', key: 'prod', name: 'Production', color: 'FF0000' },
				],
			});

			const res = await Environments.list(dummyContext, { projectKey: 'core' });
			expect(mockedRequest).toHaveBeenCalledWith(
				'/api/v2/projects/core/environments',
				'test-token-xyz',
				expect.objectContaining({ method: 'GET' }),
			);
			expect(res.items[0]?.key).toBe('prod');
		});

		it('Environments.get retrieves single environment', async () => {
			mockedRequest.mockResolvedValueOnce({
				_id: 'e1',
				key: 'staging',
				name: 'Staging',
				color: '00FF00',
			});

			const res = await Environments.get(dummyContext, {
				projectKey: 'core',
				environmentKey: 'staging',
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'/api/v2/projects/core/environments/staging',
				'test-token-xyz',
				expect.objectContaining({ method: 'GET' }),
			);
			expect(res.name).toBe('Staging');
		});

		it('Environments.create posts environment config', async () => {
			mockedRequest.mockResolvedValueOnce({
				_id: 'e2',
				key: 'qa',
				name: 'QA',
				color: '0000FF',
			});

			const res = await Environments.create(dummyContext, {
				projectKey: 'core',
				key: 'qa',
				name: 'QA',
				color: '0000FF',
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'/api/v2/projects/core/environments',
				'test-token-xyz',
				expect.objectContaining({
					method: 'POST',
					body: { key: 'qa', name: 'QA', color: '0000FF' },
				}),
			);
			expect(res.key).toBe('qa');
		});

		it('Environments.update sends JSON Patch to environment', async () => {
			mockedRequest.mockResolvedValueOnce({
				_id: 'e1',
				key: 'staging',
				name: 'Staging 2',
				color: '00FF00',
			});

			await Environments.update(dummyContext, {
				projectKey: 'core',
				environmentKey: 'staging',
				patch: [{ op: 'replace', path: '/name', value: 'Staging 2' }],
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'/api/v2/projects/core/environments/staging',
				'test-token-xyz',
				expect.objectContaining({ method: 'PATCH' }),
			);
		});

		it('Environments.delete calls DELETE', async () => {
			mockedRequest.mockResolvedValueOnce(undefined);

			await Environments.delete(dummyContext, {
				projectKey: 'core',
				environmentKey: 'qa',
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'/api/v2/projects/core/environments/qa',
				'test-token-xyz',
				expect.objectContaining({ method: 'DELETE' }),
			);
		});

		it('Environments.resetSdkKey calls POST .../apiKey', async () => {
			mockedRequest.mockResolvedValueOnce({
				_id: 'e1',
				key: 'prod',
				name: 'Prod',
				color: 'FF0000',
				apiKey: 'new-key',
			});

			await Environments.resetSdkKey(dummyContext, {
				projectKey: 'core',
				environmentKey: 'prod',
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'/api/v2/projects/core/environments/prod/apiKey',
				'test-token-xyz',
				expect.objectContaining({ method: 'POST' }),
			);
		});

		it('Environments.resetMobileKey calls POST .../mobileKey', async () => {
			mockedRequest.mockResolvedValueOnce({
				_id: 'e1',
				key: 'prod',
				name: 'Prod',
				color: 'FF0000',
				mobileKey: 'new-mob-key',
			});

			await Environments.resetMobileKey(dummyContext, {
				projectKey: 'core',
				environmentKey: 'prod',
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'/api/v2/projects/core/environments/prod/mobileKey',
				'test-token-xyz',
				expect.objectContaining({ method: 'POST' }),
			);
		});
	});

	describe('FeatureFlags', () => {
		it('FeatureFlags.list lists flags for project with filters', async () => {
			mockedRequest.mockResolvedValueOnce({
				items: [{ key: 'flag-1', name: 'Flag 1' }],
				totalCount: 1,
			});

			const res = await FeatureFlags.list(dummyContext, {
				projectKey: 'core',
				archived: false,
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'/api/v2/flags/core',
				'test-token-xyz',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({ archived: false }),
				}),
			);
			expect(res.items[0]?.key).toBe('flag-1');
		});

		it('FeatureFlags.get retrieves single flag', async () => {
			mockedRequest.mockResolvedValueOnce({
				key: 'checkout-v2',
				name: 'Checkout V2',
			});

			const res = await FeatureFlags.get(dummyContext, {
				projectKey: 'core',
				featureFlagKey: 'checkout-v2',
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'/api/v2/flags/core/checkout-v2',
				'test-token-xyz',
				expect.objectContaining({ method: 'GET' }),
			);
			expect(res.name).toBe('Checkout V2');
		});

		it('FeatureFlags.create creates new flag', async () => {
			mockedRequest.mockResolvedValueOnce({
				key: 'new-flag',
				name: 'New Flag',
			});

			const res = await FeatureFlags.create(dummyContext, {
				projectKey: 'core',
				key: 'new-flag',
				name: 'New Flag',
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'/api/v2/flags/core',
				'test-token-xyz',
				expect.objectContaining({
					method: 'POST',
					body: { key: 'new-flag', name: 'New Flag' },
				}),
			);
			expect(res.key).toBe('new-flag');
		});

		it('FeatureFlags.update updates flag via JSON Patch', async () => {
			mockedRequest.mockResolvedValueOnce({
				key: 'flag-1',
				name: 'Renamed Flag',
			});

			await FeatureFlags.update(dummyContext, {
				projectKey: 'core',
				featureFlagKey: 'flag-1',
				patch: [{ op: 'replace', path: '/name', value: 'Renamed Flag' }],
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'/api/v2/flags/core/flag-1',
				'test-token-xyz',
				expect.objectContaining({
					method: 'PATCH',
					body: expect.objectContaining({
						patch: [{ op: 'replace', path: '/name', value: 'Renamed Flag' }],
					}),
				}),
			);
		});

		it('FeatureFlags.delete deletes flag', async () => {
			mockedRequest.mockResolvedValueOnce(undefined);

			await FeatureFlags.delete(dummyContext, {
				projectKey: 'core',
				featureFlagKey: 'flag-1',
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'/api/v2/flags/core/flag-1',
				'test-token-xyz',
				expect.objectContaining({ method: 'DELETE' }),
			);
		});

		it('FeatureFlags.getStatus gets status for single flag in environment', async () => {
			mockedRequest.mockResolvedValueOnce({
				name: 'active',
				lastRequested: '2026-11-14T12:00:00Z',
			});

			const res = await FeatureFlags.getStatus(dummyContext, {
				projectKey: 'core',
				environmentKey: 'production',
				featureFlagKey: 'flag-1',
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'/api/v2/flag-statuses/core/production/flag-1',
				'test-token-xyz',
				expect.objectContaining({ method: 'GET' }),
			);
			expect(res.name).toBe('active');
		});

		it('FeatureFlags.listStatuses lists statuses in environment', async () => {
			mockedRequest.mockResolvedValueOnce({
				items: [{ name: 'active' }],
			});

			const res = await FeatureFlags.listStatuses(dummyContext, {
				projectKey: 'core',
				environmentKey: 'production',
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'/api/v2/flag-statuses/core/production',
				'test-token-xyz',
				expect.objectContaining({ method: 'GET' }),
			);
			expect(res.items?.[0]?.name).toBe('active');
		});
	});

	describe('Segments', () => {
		it('Segments.list lists segments', async () => {
			mockedRequest.mockResolvedValueOnce({
				items: [{ key: 'seg-1', name: 'Segment 1' }],
				totalCount: 1,
			});

			const res = await Segments.list(dummyContext, {
				projectKey: 'core',
				environmentKey: 'production',
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'/api/v2/segments/core/production',
				'test-token-xyz',
				expect.objectContaining({ method: 'GET' }),
			);
			expect(res.items[0]?.key).toBe('seg-1');
		});

		it('Segments.get gets segment', async () => {
			mockedRequest.mockResolvedValueOnce({
				key: 'seg-1',
				name: 'Segment 1',
			});

			const res = await Segments.get(dummyContext, {
				projectKey: 'core',
				environmentKey: 'production',
				segmentKey: 'seg-1',
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'/api/v2/segments/core/production/seg-1',
				'test-token-xyz',
				expect.objectContaining({ method: 'GET' }),
			);
			expect(res.name).toBe('Segment 1');
		});

		it('Segments.create creates segment', async () => {
			mockedRequest.mockResolvedValueOnce({
				key: 'new-seg',
				name: 'New Segment',
			});

			const res = await Segments.create(dummyContext, {
				projectKey: 'core',
				environmentKey: 'production',
				key: 'new-seg',
				name: 'New Segment',
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'/api/v2/segments/core/production',
				'test-token-xyz',
				expect.objectContaining({ method: 'POST' }),
			);
			expect(res.key).toBe('new-seg');
		});

		it('Segments.update updates segment', async () => {
			mockedRequest.mockResolvedValueOnce({
				key: 'seg-1',
				name: 'Renamed Segment',
			});

			await Segments.update(dummyContext, {
				projectKey: 'core',
				environmentKey: 'production',
				segmentKey: 'seg-1',
				patch: [{ op: 'replace', path: '/name', value: 'Renamed Segment' }],
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'/api/v2/segments/core/production/seg-1',
				'test-token-xyz',
				expect.objectContaining({
					method: 'PATCH',
					body: expect.objectContaining({
						patch: [{ op: 'replace', path: '/name', value: 'Renamed Segment' }],
					}),
				}),
			);
		});

		it('Segments.delete deletes segment', async () => {
			mockedRequest.mockResolvedValueOnce(undefined);

			await Segments.delete(dummyContext, {
				projectKey: 'core',
				environmentKey: 'production',
				segmentKey: 'seg-1',
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'/api/v2/segments/core/production/seg-1',
				'test-token-xyz',
				expect.objectContaining({ method: 'DELETE' }),
			);
		});
	});

	describe('Audit Log', () => {
		it('AuditLog.list requests /api/v2/auditlog', async () => {
			mockedRequest.mockResolvedValueOnce({
				items: [{ _id: 'a1', date: 12345678, kind: 'flag' }],
			});

			const res = await AuditLog.list(dummyContext, { limit: 5 });
			expect(mockedRequest).toHaveBeenCalledWith(
				'/api/v2/auditlog',
				'test-token-xyz',
				expect.objectContaining({ method: 'GET', query: { limit: 5 } }),
			);
			expect(res.items[0]?._id).toBe('a1');
		});

		it('AuditLog.get requests /api/v2/auditlog/{id}', async () => {
			mockedRequest.mockResolvedValueOnce({
				_id: 'a1',
				date: 12345678,
				kind: 'flag',
				name: 'Audit entry',
			});

			const res = await AuditLog.get(dummyContext, { id: 'a1' });
			expect(mockedRequest).toHaveBeenCalledWith(
				'/api/v2/auditlog/a1',
				'test-token-xyz',
				expect.objectContaining({ method: 'GET' }),
			);
			expect(res.name).toBe('Audit entry');
		});
	});

	describe('Account Members', () => {
		it('AccountMembers.list lists members', async () => {
			mockedRequest.mockResolvedValueOnce({
				items: [{ _id: 'm1', email: 'user@example.com', role: 'reader' }],
				totalCount: 1,
			});

			const res = await AccountMembers.list(dummyContext, {});
			expect(mockedRequest).toHaveBeenCalledWith(
				'/api/v2/members',
				'test-token-xyz',
				expect.objectContaining({ method: 'GET' }),
			);
			expect(res.items[0]?.email).toBe('user@example.com');
		});

		it('AccountMembers.get gets member by id', async () => {
			mockedRequest.mockResolvedValueOnce({
				_id: 'm1',
				email: 'admin@example.com',
				role: 'admin',
			});

			const res = await AccountMembers.get(dummyContext, { id: 'm1' });
			expect(mockedRequest).toHaveBeenCalledWith(
				'/api/v2/members/m1',
				'test-token-xyz',
				expect.objectContaining({ method: 'GET' }),
			);
			expect(res.role).toBe('admin');
		});

		it('AccountMembers.invite invites members', async () => {
			mockedRequest.mockResolvedValueOnce({
				items: [{ _id: 'm2', email: 'dev@example.com', role: 'writer' }],
				totalCount: 1,
			});

			const res = await AccountMembers.invite(dummyContext, {
				members: [{ email: 'dev@example.com', role: 'writer' }],
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'/api/v2/members',
				'test-token-xyz',
				expect.objectContaining({ method: 'POST' }),
			);
			expect(res.items[0]?.email).toBe('dev@example.com');
		});

		it('AccountMembers.update updates member via JSON Patch', async () => {
			mockedRequest.mockResolvedValueOnce({
				_id: 'm1',
				email: 'user@example.com',
				role: 'writer',
			});

			const res = await AccountMembers.update(dummyContext, {
				id: 'm1',
				patch: [{ op: 'replace', path: '/role', value: 'writer' }],
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'/api/v2/members/m1',
				'test-token-xyz',
				expect.objectContaining({ method: 'PATCH' }),
			);
			expect(res.role).toBe('writer');
		});

		it('AccountMembers.delete deletes member', async () => {
			mockedRequest.mockResolvedValueOnce(undefined);

			await AccountMembers.delete(dummyContext, { id: 'm1' });
			expect(mockedRequest).toHaveBeenCalledWith(
				'/api/v2/members/m1',
				'test-token-xyz',
				expect.objectContaining({ method: 'DELETE' }),
			);
		});
	});

	describe('Teams', () => {
		it('Teams.list lists teams', async () => {
			mockedRequest.mockResolvedValueOnce({
				items: [{ key: 'team-1', name: 'Team One' }],
				totalCount: 1,
			});

			const res = await Teams.list(dummyContext, {});
			expect(mockedRequest).toHaveBeenCalledWith(
				'/api/v2/teams',
				'test-token-xyz',
				expect.objectContaining({ method: 'GET' }),
			);
			expect(res.items[0]?.key).toBe('team-1');
		});

		it('Teams.get gets team', async () => {
			mockedRequest.mockResolvedValueOnce({
				key: 'team-1',
				name: 'Team One',
			});

			const res = await Teams.get(dummyContext, { teamKey: 'team-1' });
			expect(mockedRequest).toHaveBeenCalledWith(
				'/api/v2/teams/team-1',
				'test-token-xyz',
				expect.objectContaining({ method: 'GET' }),
			);
			expect(res.name).toBe('Team One');
		});

		it('Teams.create creates team', async () => {
			mockedRequest.mockResolvedValueOnce({
				key: 'team-2',
				name: 'Team Two',
			});

			const res = await Teams.create(dummyContext, {
				key: 'team-2',
				name: 'Team Two',
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'/api/v2/teams',
				'test-token-xyz',
				expect.objectContaining({ method: 'POST' }),
			);
			expect(res.key).toBe('team-2');
		});

		it('Teams.update updates team with instructions', async () => {
			mockedRequest.mockResolvedValueOnce({
				key: 'team-1',
				name: 'Renamed Team',
			});

			await Teams.update(dummyContext, {
				teamKey: 'team-1',
				instructions: [{ kind: 'updateName', value: 'Renamed Team' }],
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'/api/v2/teams/team-1',
				'test-token-xyz',
				expect.objectContaining({
					method: 'PATCH',
					body: expect.objectContaining({
						instructions: [{ kind: 'updateName', value: 'Renamed Team' }],
					}),
					mediaType:
						'application/json; domain-model=launchdarkly.semanticpatch',
				}),
			);
		});

		it('Teams.delete deletes team', async () => {
			mockedRequest.mockResolvedValueOnce(undefined);

			await Teams.delete(dummyContext, { teamKey: 'team-1' });
			expect(mockedRequest).toHaveBeenCalledWith(
				'/api/v2/teams/team-1',
				'test-token-xyz',
				expect.objectContaining({ method: 'DELETE' }),
			);
		});
	});

	describe('Custom Roles', () => {
		it('CustomRoles.list lists roles', async () => {
			mockedRequest.mockResolvedValueOnce({
				items: [{ _id: 'r1', key: 'role-1', name: 'Role 1' }],
				totalCount: 1,
			});

			const res = await CustomRoles.list(dummyContext, {});
			expect(mockedRequest).toHaveBeenCalledWith(
				'/api/v2/roles',
				'test-token-xyz',
				expect.objectContaining({ method: 'GET' }),
			);
			expect(res.items[0]?.key).toBe('role-1');
		});

		it('CustomRoles.get gets role', async () => {
			mockedRequest.mockResolvedValueOnce({
				_id: 'r1',
				key: 'role-1',
				name: 'Role 1',
			});

			const res = await CustomRoles.get(dummyContext, {
				customRoleKey: 'role-1',
			});
			expect(mockedRequest).toHaveBeenCalledWith(
				'/api/v2/roles/role-1',
				'test-token-xyz',
				expect.objectContaining({ method: 'GET' }),
			);
			expect(res.name).toBe('Role 1');
		});

		it('CustomRoles.create creates role', async () => {
			mockedRequest.mockResolvedValueOnce({
				_id: 'r2',
				key: 'role-2',
				name: 'Role 2',
			});

			const res = await CustomRoles.create(dummyContext, {
				key: 'role-2',
				name: 'Role 2',
				policy: [{ effect: 'allow', actions: ['*'], resources: ['*'] }],
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'/api/v2/roles',
				'test-token-xyz',
				expect.objectContaining({ method: 'POST' }),
			);
			expect(res.key).toBe('role-2');
		});

		it('CustomRoles.update patches role', async () => {
			mockedRequest.mockResolvedValueOnce({
				_id: 'r1',
				key: 'role-1',
				name: 'Renamed Role',
			});

			await CustomRoles.update(dummyContext, {
				customRoleKey: 'role-1',
				patch: [{ op: 'replace', path: '/name', value: 'Renamed Role' }],
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'/api/v2/roles/role-1',
				'test-token-xyz',
				expect.objectContaining({
					method: 'PATCH',
					body: expect.objectContaining({
						patch: [{ op: 'replace', path: '/name', value: 'Renamed Role' }],
					}),
				}),
			);
		});

		it('CustomRoles.delete deletes role', async () => {
			mockedRequest.mockResolvedValueOnce(undefined);

			await CustomRoles.delete(dummyContext, { customRoleKey: 'role-1' });
			expect(mockedRequest).toHaveBeenCalledWith(
				'/api/v2/roles/role-1',
				'test-token-xyz',
				expect.objectContaining({ method: 'DELETE' }),
			);
		});
	});

	describe('Contexts', () => {
		it('Contexts.search posts context search query', async () => {
			mockedRequest.mockResolvedValueOnce({
				items: [{ key: 'ctx-1', kind: 'user' }],
				totalCount: 1,
			});

			const res = await Contexts.search(dummyContext, {
				projectKey: 'core',
				environmentKey: 'production',
				filter: 'kind anyOf ["user"]',
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'/api/v2/projects/core/environments/production/contexts/search',
				'test-token-xyz',
				expect.objectContaining({
					method: 'POST',
					query: expect.objectContaining({ filter: 'kind anyOf ["user"]' }),
				}),
			);
			expect(res.items[0]?.key).toBe('ctx-1');
		});

		it('Contexts.get gets context by kind and key', async () => {
			mockedRequest.mockResolvedValueOnce({
				items: [{ key: 'user-1', kind: 'user' }],
			});

			const res = await Contexts.get(dummyContext, {
				projectKey: 'core',
				environmentKey: 'production',
				kind: 'user',
				key: 'user-1',
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'/api/v2/projects/core/environments/production/contexts/user/user-1',
				'test-token-xyz',
				expect.objectContaining({ method: 'GET' }),
			);
			expect(res.items[0]?.kind).toBe('user');
		});

		it('Contexts.listKinds lists context kinds for project', async () => {
			mockedRequest.mockResolvedValueOnce({
				items: [{ key: 'user', name: 'User' }],
			});

			const res = await Contexts.listKinds(dummyContext, {
				projectKey: 'core',
			});
			expect(mockedRequest).toHaveBeenCalledWith(
				'/api/v2/projects/core/context-kinds',
				'test-token-xyz',
				expect.objectContaining({ method: 'GET' }),
			);
			expect(res.items[0]?.key).toBe('user');
		});
	});

	describe('Users', () => {
		it('Users.list lists users in environment', async () => {
			mockedRequest.mockResolvedValueOnce({
				items: [{ user: { key: 'u1' } }],
				totalCount: 1,
			});

			const res = await Users.list(dummyContext, {
				projectKey: 'core',
				environmentKey: 'production',
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'/api/v2/users/core/production',
				'test-token-xyz',
				expect.objectContaining({ method: 'GET' }),
			);
			expect(res.items[0]?.user?.key).toBe('u1');
		});

		it('Users.get gets user record by key', async () => {
			mockedRequest.mockResolvedValueOnce({
				user: { key: 'u1', name: 'User 1' },
			});

			const res = await Users.get(dummyContext, {
				projectKey: 'core',
				environmentKey: 'production',
				userKey: 'u1',
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'/api/v2/users/core/production/u1',
				'test-token-xyz',
				expect.objectContaining({ method: 'GET' }),
			);
			expect(res.user?.name).toBe('User 1');
		});

		it('Users.search finds users matching query', async () => {
			mockedRequest.mockResolvedValueOnce({
				items: [{ user: { key: 'u2', email: 'dev@example.com' } }],
				totalCount: 1,
			});

			const res = await Users.search(dummyContext, {
				projectKey: 'core',
				environmentKey: 'production',
				q: 'dev@example.com',
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'/api/v2/user-search/core/production',
				'test-token-xyz',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({ q: 'dev@example.com' }),
				}),
			);
			expect(res.items[0]?.user?.key).toBe('u2');
		});
	});

	describe('Access Tokens', () => {
		it('AccessTokens.list lists access tokens', async () => {
			mockedRequest.mockResolvedValueOnce({
				items: [{ _id: 'tok-1', name: 'Token 1' }],
				totalCount: 1,
			});

			const res = await AccessTokens.list(dummyContext, {});
			expect(mockedRequest).toHaveBeenCalledWith(
				'/api/v2/tokens',
				'test-token-xyz',
				expect.objectContaining({ method: 'GET' }),
			);
			expect(res.items[0]?._id).toBe('tok-1');
		});

		it('AccessTokens.get gets access token by id', async () => {
			mockedRequest.mockResolvedValueOnce({
				_id: 'tok-1',
				name: 'Token 1',
				role: 'admin',
			});

			const res = await AccessTokens.get(dummyContext, { id: 'tok-1' });
			expect(mockedRequest).toHaveBeenCalledWith(
				'/api/v2/tokens/tok-1',
				'test-token-xyz',
				expect.objectContaining({ method: 'GET' }),
			);
			expect(res.role).toBe('admin');
		});

		it('AccessTokens.create creates token', async () => {
			mockedRequest.mockResolvedValueOnce({
				_id: 'tok-2',
				name: 'CI Token',
				role: 'writer',
				token: 'token-secret',
			});

			const res = await AccessTokens.create(dummyContext, {
				name: 'CI Token',
				role: 'writer',
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'/api/v2/tokens',
				'test-token-xyz',
				expect.objectContaining({ method: 'POST' }),
			);
			expect(res.name).toBe('CI Token');
		});

		it('AccessTokens.delete deletes token', async () => {
			mockedRequest.mockResolvedValueOnce(undefined);

			await AccessTokens.delete(dummyContext, { id: 'tok-1' });
			expect(mockedRequest).toHaveBeenCalledWith(
				'/api/v2/tokens/tok-1',
				'test-token-xyz',
				expect.objectContaining({ method: 'DELETE' }),
			);
		});
	});

	describe('Tags', () => {
		it('Tags.list lists tags', async () => {
			mockedRequest.mockResolvedValueOnce({
				items: ['backend', 'frontend'],
				totalCount: 2,
			});

			const res = await Tags.list(dummyContext, { kind: ['flag'] });
			expect(mockedRequest).toHaveBeenCalledWith(
				'/api/v2/tags',
				'test-token-xyz',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({ kind: ['flag'] }),
				}),
			);
			expect(res.items).toEqual(['backend', 'frontend']);
		});
	});

	describe('Root', () => {
		it('Root.get requests GET /api/v2 with undefined apiKey', async () => {
			mockedRequest.mockResolvedValueOnce({
				links: {
					projects: { href: '/api/v2/projects', type: 'application/json' },
				},
			});

			const res = await Root.get(dummyContext, {});
			expect(mockedRequest).toHaveBeenCalledWith(
				'/api/v2',
				undefined,
				expect.objectContaining({ method: 'GET' }),
			);
			expect(res.links.projects?.href).toBe('/api/v2/projects');
		});
	});
});
