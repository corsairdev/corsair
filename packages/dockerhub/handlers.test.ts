import * as CorsairCore from 'corsair/core';
import * as Client from './client';
import {
	ImagesEndpoints,
	OrganizationsEndpoints,
	RepositoriesEndpoints,
	TagsEndpoints,
	TeamsEndpoints,
	WebhooksEndpoints,
} from './endpoints';
import type { DockerHubEndpoints } from './index';

const mockReq = jest.spyOn(Client, 'makeDockerHubRequest');
const logSpy = jest.spyOn(CorsairCore, 'logEventFromContext');
logSpy.mockImplementation(async () => null);

type HandlerCtx = Parameters<DockerHubEndpoints['repositoriesList']>[0];

function ctx(key = 'dckr_pat_test'): HandlerCtx {
	const partial = {
		key,
		db: {},
		authType: 'api_key' as const,
		options: { username: 'testuser' },
		keys: {
			get_api_key: async () => key,
		},
	};
	// Handler unit tests only need key + keys; cast through unknown to avoid
	// constructing a full CorsairPluginContext (database, hooks, etc.).
	return partial as unknown as HandlerCtx;
}

function lastCall() {
	const call = mockReq.mock.calls.at(-1);
	if (!call) throw new Error('makeDockerHubRequest was not called');
	return call;
}

function expectPath(path: string) {
	expect(lastCall()[0]).toBe(path);
}

beforeEach(() => {
	mockReq.mockReset();
	mockReq.mockResolvedValue({ results: [], id: 99 });
	logSpy.mockClear();
	logSpy.mockImplementation(async () => null);
});

describe('handler path construction', () => {
	it('repositories.list', async () => {
		await RepositoriesEndpoints.list(ctx(), {
			namespace: 'library',
			pageSize: 10,
		});
		expectPath('/namespaces/library/repositories');
		expect(lastCall()[2]).toEqual(
			expect.objectContaining({
				query: expect.objectContaining({ page_size: 10 }),
			}),
		);
	});

	it('repositories.get', async () => {
		await RepositoriesEndpoints.get(ctx(), {
			namespace: 'library',
			name: 'hello-world',
		});
		expectPath('/namespaces/library/repositories/hello-world');
	});

	it('repositories.create', async () => {
		await RepositoriesEndpoints.create(ctx(), {
			namespace: 'me',
			name: 'app',
		});
		expectPath('/namespaces/me/repositories');
		expect(lastCall()[2]?.method).toBe('POST');
		expect(lastCall()[2]?.body).toEqual(
			expect.objectContaining({ namespace: 'me', name: 'app' }),
		);
	});

	it('repositories.delete', async () => {
		await RepositoriesEndpoints.delete(ctx(), {
			namespace: 'me',
			name: 'app',
		});
		expectPath('/repositories/me/app/');
		expect(lastCall()[2]).toEqual(
			expect.objectContaining({ method: 'DELETE', okOn404: true }),
		);
	});

	it('tags.list', async () => {
		await TagsEndpoints.list(ctx(), {
			namespace: 'library',
			name: 'alpine',
		});
		expectPath('/namespaces/library/repositories/alpine/tags');
	});

	it('tags.get', async () => {
		await TagsEndpoints.get(ctx(), {
			namespace: 'library',
			name: 'alpine',
			tag: 'latest',
		});
		expectPath('/namespaces/library/repositories/alpine/tags/latest');
	});

	it('tags.delete', async () => {
		await TagsEndpoints.delete(ctx(), {
			namespace: 'me',
			name: 'app',
			tag: 'v1',
		});
		expectPath('/repositories/me/app/tags/v1/');
	});

	it('images.list uses tags endpoint', async () => {
		mockReq.mockResolvedValue({
			results: [
				{
					name: 'latest',
					images: [
						{ digest: 'sha256:aaa', architecture: 'amd64', os: 'linux' },
					],
				},
			],
		});
		const res = await ImagesEndpoints.list(ctx(), {
			namespace: 'library',
			name: 'alpine',
		});
		expectPath('/namespaces/library/repositories/alpine/tags');
		expect((res as { count: number }).count).toBe(1);
	});

	it('images.get paginates until digest found', async () => {
		mockReq
			.mockResolvedValueOnce({
				next: 'https://hub.docker.com/v2/.../tags?page=2',
				results: [{ name: 'a', images: [{ digest: 'sha256:other' }] }],
			})
			.mockResolvedValueOnce({
				next: null,
				results: [
					{
						name: 'b',
						images: [
							{ digest: 'sha256:target', architecture: 'amd64', os: 'linux' },
						],
					},
				],
			});
		const res = await ImagesEndpoints.get(ctx(), {
			namespace: 'library',
			name: 'alpine',
			digest: 'sha256:target',
			pageSize: 25,
		});
		expect(mockReq).toHaveBeenCalledTimes(2);
		expect(mockReq.mock.calls[0]?.[2]?.query).toEqual({
			page: 1,
			page_size: 25,
		});
		expect(mockReq.mock.calls[1]?.[2]?.query).toEqual({
			page: 2,
			page_size: 25,
		});
		expect((res as { digest: string }).digest).toBe('sha256:target');
		expect((res as { foundOnPage: number }).foundOnPage).toBe(2);
		expect(mockReq.mock.calls[0]?.[0]).toBe(
			'/namespaces/library/repositories/alpine/tags',
		);
	});

	it('organizations.list', async () => {
		await OrganizationsEndpoints.list(ctx(), {});
		expectPath('/user/orgs/');
	});

	it('organizations.create', async () => {
		const loginSpy = jest
			.spyOn(Client, 'loginDockerHubJwt')
			.mockResolvedValue('jwt-token');
		mockReq.mockResolvedValueOnce({ orgname: 'acme' });
		await OrganizationsEndpoints.create(ctx(), { orgname: 'acme' });
		expect(loginSpy).toHaveBeenCalledWith('testuser', 'dckr_pat_test');
		expectPath('/orgs/');
		expect(lastCall()[1]).toBe('jwt-token');
		expect(lastCall()[2]?.method).toBe('POST');
		expect(lastCall()[2]?.body).toEqual(
			expect.objectContaining({ orgname: 'acme' }),
		);
		loginSpy.mockRestore();
	});

	it('organizations.delete', async () => {
		await OrganizationsEndpoints.delete(ctx(), { orgname: 'acme' });
		expectPath('/orgs/acme/');
	});

	it('organizations.listMembers', async () => {
		await OrganizationsEndpoints.listMembers(ctx(), { orgname: 'acme' });
		expectPath('/orgs/acme/members/');
	});

	it('organizations.addMember', async () => {
		await OrganizationsEndpoints.addMember(ctx(), {
			orgname: 'acme',
			member: 'u@example.com',
			team: 'owners',
		});
		expectPath('/invites/bulk');
		expect(lastCall()[2]?.method).toBe('POST');
		expect(lastCall()[2]?.body).toEqual({
			org: 'acme',
			invitees: ['u@example.com'],
			role: 'member',
			team: 'owners',
		});
	});

	it('organizations.removeMember', async () => {
		await OrganizationsEndpoints.removeMember(ctx(), {
			orgname: 'acme',
			username: 'bob',
		});
		expectPath('/orgs/acme/members/bob/');
	});

	it('organizations.listAccessTokens', async () => {
		await OrganizationsEndpoints.listAccessTokens(ctx(), {
			orgname: 'acme',
		});
		expectPath('/orgs/acme/access-tokens/');
	});

	it('teams.list uses groups', async () => {
		await TeamsEndpoints.list(ctx(), { orgname: 'acme' });
		expectPath('/orgs/acme/groups/');
	});

	it('teams.get', async () => {
		await TeamsEndpoints.get(ctx(), {
			orgname: 'acme',
			teamname: 'devs',
		});
		expectPath('/orgs/acme/groups/devs/');
	});

	it('teams.delete', async () => {
		await TeamsEndpoints.delete(ctx(), {
			orgname: 'acme',
			teamname: 'devs',
		});
		expectPath('/orgs/acme/groups/devs/');
	});

	it('teams.listMembers', async () => {
		await TeamsEndpoints.listMembers(ctx(), {
			orgname: 'acme',
			teamname: 'devs',
		});
		expectPath('/orgs/acme/groups/devs/members/');
	});

	it('teams.removeMember', async () => {
		await TeamsEndpoints.removeMember(ctx(), {
			orgname: 'acme',
			teamname: 'devs',
			username: 'bob',
		});
		expectPath('/orgs/acme/groups/devs/members/bob/');
	});

	it('webhooks.list', async () => {
		await WebhooksEndpoints.list(ctx(), {
			namespace: 'me',
			name: 'app',
		});
		expectPath('/repositories/me/app/webhook_pipeline/');
	});

	it('webhooks.get', async () => {
		await WebhooksEndpoints.get(ctx(), {
			namespace: 'me',
			name: 'app',
			webhookId: 7,
		});
		expectPath('/repositories/me/app/webhook_pipeline/7/');
	});

	it('webhooks.create two-step', async () => {
		mockReq
			.mockResolvedValueOnce({ id: 7, name: 'deploy' })
			.mockResolvedValueOnce({ hook_url: 'https://example.com/h' });
		await WebhooksEndpoints.create(ctx(), {
			namespace: 'me',
			name: 'app',
			webhookName: 'deploy',
			hookUrl: 'https://example.com/h',
		});
		expect(mockReq).toHaveBeenCalledTimes(2);
		expect(mockReq.mock.calls[0]?.[0]).toBe(
			'/repositories/me/app/webhook_pipeline/',
		);
		expect(mockReq.mock.calls[1]?.[0]).toBe(
			'/repositories/me/app/webhook_pipeline/7/hooks/',
		);
	});

	it('webhooks.create rolls back if hook attach fails', async () => {
		mockReq
			.mockResolvedValueOnce({ id: 7, name: 'deploy' })
			.mockRejectedValueOnce(new Error('hook failed'))
			.mockResolvedValueOnce({ success: true });
		await expect(
			WebhooksEndpoints.create(ctx(), {
				namespace: 'me',
				name: 'app',
				webhookName: 'deploy',
				hookUrl: 'https://example.com/h',
			}),
		).rejects.toThrow('hook failed');
		expect(mockReq.mock.calls[2]?.[0]).toBe(
			'/repositories/me/app/webhook_pipeline/7/',
		);
		expect(mockReq.mock.calls[2]?.[2]?.method).toBe('DELETE');
	});

	it('webhooks.delete', async () => {
		await WebhooksEndpoints.delete(ctx(), {
			namespace: 'me',
			name: 'app',
			webhookId: 7,
		});
		expectPath('/repositories/me/app/webhook_pipeline/7/');
	});
});
