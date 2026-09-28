import type { AccountKeyManagerFor } from 'corsair/core';
import { ApiError } from 'corsair/http';
import * as client from './client';
import {
	deleteBuild,
	downloadBuildLog,
	getBuildArtifacts,
	getBuildByVersion,
	getProjectBadge,
	getProjectBranchBadge,
	getPublicProjectBadge,
	getRole,
	listCollaborators,
	listEnvironments,
	listProjects,
	listRoles,
	listUserInvitations,
	listUsers,
} from './endpoints/operations';
import type { AppVeyorContext, appveyorAuthConfig } from './index';
import { appveyor, appveyorEndpointSchemas } from './index';

jest.mock('./client', () => ({
	...jest.requireActual('./client'),
	makeAppVeyorRequest: jest.fn(),
	makeAppVeyorTextRequest: jest.fn(),
}));

const mockRequest = client.makeAppVeyorRequest as jest.MockedFunction<
	typeof client.makeAppVeyorRequest
>;
const mockTextRequest = client.makeAppVeyorTextRequest as jest.MockedFunction<
	typeof client.makeAppVeyorTextRequest
>;

function endpointPaths(value: unknown, prefix = ''): string[] {
	if (typeof value === 'function') return [prefix];
	if (!value || typeof value !== 'object') return [];
	return Object.entries(value).flatMap(([key, child]) =>
		endpointPaths(child, prefix ? `${prefix}.${key}` : key),
	);
}

type ApiKeyManager = AccountKeyManagerFor<'api_key', typeof appveyorAuthConfig>;

const mockCtx = {
	key: 'test-key',
} as unknown as AppVeyorContext;

describe('AppVeyor plugin', () => {
	it('exposes every configured operation without webhooks', () => {
		const plugin = appveyor({ key: 'test-key' });
		const paths = endpointPaths(plugin.endpoints).sort();
		const schemaPaths = Object.keys(appveyorEndpointSchemas).sort();

		expect(paths).toHaveLength(14);
		expect(paths).toEqual(schemaPaths);
		expect(plugin.webhooks).toEqual({});
		expect(plugin.webhookSchemas).toEqual({});
		expect(plugin.pluginWebhookMatcher?.({ headers: {}, body: '' })).toBe(
			false,
		);
	});

	it('uses API-key authentication and validates endpoint metadata', () => {
		const plugin = appveyor();
		expect(plugin.id).toBe('appveyor');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.authConfig).toEqual({ api_key: { account: [] } });
		expect(Object.keys(plugin.endpointMeta ?? {})).toHaveLength(14);
	});

	it('rejects missing endpoint credentials', async () => {
		const plugin = appveyor();
		const keys: ApiKeyManager = {
			get_api_key: async () => null,
			set_api_key: async () => {},
			get_webhook_signature: async () => null,
			set_webhook_signature: async () => {},
			get_dek: async () => 'test-dek',
			issue_new_dek: async () => 'test-dek',
		};
		await expect(
			plugin.keyBuilder?.(
				{
					authType: 'api_key',
					options: {},
					keys,
					tenantId: 'test-tenant',
				},
				'endpoint',
			),
		).rejects.toMatchObject({ name: 'AuthMissingError', pluginId: 'appveyor' });
	});
});

describe('AppVeyor endpoint handlers', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('builds.delete sends DELETE /builds/{id} and returns success', async () => {
		mockRequest.mockResolvedValueOnce(undefined);
		const result = await deleteBuild(mockCtx, { buildId: 123 });
		expect(mockRequest).toHaveBeenCalledWith('/builds/123', 'test-key', {
			method: 'DELETE',
		});
		expect(result).toEqual({ success: true });
	});

	it('builds.downloadLog uses text request for /buildjobs/{jobId}/log', async () => {
		mockTextRequest.mockResolvedValueOnce('log content');
		const result = await downloadBuildLog(mockCtx, { jobId: 456 });
		expect(mockTextRequest).toHaveBeenCalledWith(
			'/buildjobs/456/log',
			'test-key',
		);
		expect(result).toBe('log content');
	});

	it('builds.getArtifacts parses array', async () => {
		const artifacts = [{ fileName: 'a.zip', name: 'a', size: 10, type: 'Zip' }];
		mockRequest.mockResolvedValueOnce(artifacts);
		const result = await getBuildArtifacts(mockCtx, { jobId: 789 });
		expect(mockRequest).toHaveBeenCalledWith(
			'/buildjobs/789/artifacts',
			'test-key',
		);
		expect(result).toEqual(artifacts);
	});

	it('builds.getByVersion calls /projects/{account}/{slug}/build/{version}', async () => {
		const response = {
			project: { projectId: 1, name: 'p', slug: 'p' },
			build: { buildId: 1, buildNumber: 1, version: '1.0', status: 'success' },
		};
		mockRequest.mockResolvedValueOnce(response);
		const result = await getBuildByVersion(mockCtx, {
			accountName: 'acct',
			projectSlug: 'proj',
			buildVersion: '1.0',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			'/projects/acct/proj/build/1.0',
			'test-key',
		);
		expect(result.build.version).toBe('1.0');
	});

	it('rejects invalid builds.getByVersion input before request', async () => {
		await expect(
			getBuildByVersion(mockCtx, {
				accountName: '',
				projectSlug: '',
				buildVersion: '',
			}),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('environments.list calls GET /environments', async () => {
		mockRequest.mockResolvedValueOnce([]);
		const result = await listEnvironments(mockCtx, {});
		expect(mockRequest).toHaveBeenCalledWith('/environments', 'test-key');
		expect(result).toEqual([]);
	});

	it('projects.getBranchStatusBadge encodes branch', async () => {
		mockTextRequest.mockResolvedValueOnce('badge');
		const result = await getProjectBranchBadge(mockCtx, {
			token: 'tok',
			branch: 'feat/a b',
		});
		expect(mockTextRequest).toHaveBeenCalledWith(
			'/projects/status/tok/branch/feat%2Fa%20b',
			'test-key',
		);
		expect(result).toBe('badge');
	});

	it('projects.getStatusBadge calls /projects/status/{token}', async () => {
		mockTextRequest.mockResolvedValueOnce('badge');
		const result = await getProjectBadge(mockCtx, { token: 'tok' });
		expect(mockTextRequest).toHaveBeenCalledWith(
			'/projects/status/tok',
			'test-key',
		);
		expect(result).toBe('badge');
	});

	it('projects.list calls GET /projects', async () => {
		const projects = [{ projectId: 1, name: 'p', slug: 'p' }];
		mockRequest.mockResolvedValueOnce(projects);
		const result = await listProjects(mockCtx, {});
		expect(mockRequest).toHaveBeenCalledWith('/projects', 'test-key');
		expect(result).toEqual(projects);
	});

	it('projects.getPublicStatusBadge builds 3-segment path', async () => {
		mockTextRequest.mockResolvedValueOnce('badge');
		const result = await getPublicProjectBadge(mockCtx, {
			repositoryProvider: 'github',
			repositoryAccountName: 'owner',
			repositorySlug: 'repo',
		});
		expect(mockTextRequest).toHaveBeenCalledWith(
			'/projects/status/github/owner/repo',
			'test-key',
		);
		expect(result).toBe('badge');
	});

	it('roles.get calls GET /roles/{id} and parses', async () => {
		const role = { roleId: 4, name: 'Admin' };
		mockRequest.mockResolvedValueOnce(role);
		const result = await getRole(mockCtx, { roleId: 4 });
		expect(mockRequest).toHaveBeenCalledWith('/roles/4', 'test-key');
		expect(result).toMatchObject({ roleId: 4 });
	});

	it('roles.list calls GET /roles', async () => {
		mockRequest.mockResolvedValueOnce([]);
		const result = await listRoles(mockCtx, {});
		expect(mockRequest).toHaveBeenCalledWith('/roles', 'test-key');
		expect(result).toEqual([]);
	});

	it('users.listInvitations calls GET /users/invitations', async () => {
		mockRequest.mockResolvedValueOnce([]);
		const result = await listUserInvitations(mockCtx, {});
		expect(mockRequest).toHaveBeenCalledWith('/users/invitations', 'test-key');
		expect(result).toEqual([]);
	});

	it('users.list calls GET /users', async () => {
		mockRequest.mockResolvedValueOnce([]);
		const result = await listUsers(mockCtx, {});
		expect(mockRequest).toHaveBeenCalledWith('/users', 'test-key');
		expect(result).toEqual([]);
	});

	it('collaborators.list calls GET /collaborators', async () => {
		mockRequest.mockResolvedValueOnce([]);
		const result = await listCollaborators(mockCtx, {});
		expect(mockRequest).toHaveBeenCalledWith('/collaborators', 'test-key');
		expect(result).toEqual([]);
	});

	it('propagates ApiError without swallowing', async () => {
		const error = new ApiError(
			{ method: 'GET', url: '/projects' },
			{
				url: '/projects',
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: {},
			},
			'Too Many Requests',
		);
		mockRequest.mockRejectedValueOnce(error);
		await expect(listProjects(mockCtx, {})).rejects.toBe(error);
		expect(mockRequest).toHaveBeenCalledTimes(1);
	});

	it('rejects empty token for badge', async () => {
		await expect(getProjectBadge(mockCtx, { token: '' })).rejects.toThrow();
		expect(mockTextRequest).not.toHaveBeenCalled();
	});
});
