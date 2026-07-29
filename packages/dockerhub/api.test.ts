import { DOCKER_HUB_BASE, makeDockerHubRequest } from './client';
import {
	DockerHubEndpointInputSchemas,
	DockerHubEndpointOutputSchemas,
} from './endpoints/types';

const FIXTURES: Record<keyof typeof DockerHubEndpointInputSchemas, unknown> = {
	repositoriesList: { namespace: 'library', page: 1, pageSize: 10 },
	repositoriesGet: { namespace: 'library', name: 'hello-world' },
	repositoriesCreate: {
		namespace: 'myuser',
		name: 'myapp',
		isPrivate: true,
	},
	repositoriesDelete: { namespace: 'myuser', name: 'myapp' },
	tagsList: { namespace: 'library', name: 'hello-world', pageSize: 5 },
	tagsGet: { namespace: 'library', name: 'hello-world', tag: 'latest' },
	tagsDelete: { namespace: 'myuser', name: 'myapp', tag: 'v1' },
	imagesList: { namespace: 'library', name: 'alpine', pageSize: 25 },
	imagesGet: {
		namespace: 'library',
		name: 'alpine',
		digest: 'sha256:abc',
	},
	imagesDelete: {
		namespace: 'myuser',
		manifests: [{ repository: 'myapp', digest: 'sha256:abc' }],
	},
	organizationsList: { page: 1 },
	organizationsCreate: { orgname: 'my-org' },
	organizationsDelete: { orgname: 'my-org' },
	organizationsListMembers: { orgname: 'my-org' },
	organizationsAddMember: { orgname: 'my-org', member: 'user@example.com' },
	organizationsRemoveMember: { orgname: 'my-org', username: 'other' },
	organizationsListAccessTokens: { orgname: 'my-org' },
	teamsList: { orgname: 'my-org' },
	teamsGet: { orgname: 'my-org', teamname: 'devs' },
	teamsDelete: { orgname: 'my-org', teamname: 'devs' },
	teamsListMembers: { orgname: 'my-org', teamname: 'devs' },
	teamsRemoveMember: {
		orgname: 'my-org',
		teamname: 'devs',
		username: 'other',
	},
	webhooksList: { namespace: 'myuser', name: 'myapp' },
	webhooksGet: { namespace: 'myuser', name: 'myapp', webhookId: 1 },
	webhooksCreate: {
		namespace: 'myuser',
		name: 'myapp',
		webhookName: 'deploy',
		hookUrl: 'https://example.com/hook',
	},
	webhooksDelete: { namespace: 'myuser', name: 'myapp', webhookId: '1' },
};

describe('DockerHub endpoint input schemas', () => {
	const keys = Object.keys(DockerHubEndpointInputSchemas) as Array<
		keyof typeof DockerHubEndpointInputSchemas
	>;

	it('registers all 26 endpoint schemas', () => {
		expect(keys.length).toBe(26);
	});

	for (const key of keys) {
		it(`${key} parses fixture`, () => {
			const fixture = FIXTURES[key];
			expect(fixture).toBeDefined();
			const parsed = DockerHubEndpointInputSchemas[key].parse(fixture);
			expect(parsed).toBeDefined();
			expect(DockerHubEndpointOutputSchemas[key].parse({ ok: true })).toEqual({
				ok: true,
			});
		});
	}

	it('imagesGet does not accept a page input', () => {
		const parsed = DockerHubEndpointInputSchemas.imagesGet.parse({
			namespace: FIXTURES.imagesGet.namespace,
			name: FIXTURES.imagesGet.name,
			digest: FIXTURES.imagesGet.digest,
			page: 2,
		});
		expect(parsed).not.toHaveProperty('page');
	});
});

describe('client helpers', () => {
	it('DOCKER_HUB_BASE is hub.docker.com/v2', () => {
		expect(DOCKER_HUB_BASE).toContain('hub.docker.com');
		expect(DOCKER_HUB_BASE).toContain('/v2');
	});
});

const LIVE = process.env.DOCKER_HUB_LIVE === '1';
const TOKEN = process.env.DOCKER_HUB_TOKEN || process.env.DOCKERHUB_TOKEN || '';

describe('DockerHub live public API', () => {
	it('lists tags for library/hello-world', async () => {
		if (!LIVE) return;
		const res = await makeDockerHubRequest<{ results?: unknown[] }>(
			'/repositories/library/hello-world/tags',
			TOKEN || undefined,
			{ method: 'GET', query: { page_size: 2 } },
		);
		expect(Array.isArray(res.results)).toBe(true);
		expect((res.results ?? []).length).toBeGreaterThan(0);
	});

	it('gets repository library/hello-world', async () => {
		if (!LIVE) return;
		const res = await makeDockerHubRequest<Record<string, unknown>>(
			'/repositories/library/hello-world/',
			TOKEN || undefined,
			{ method: 'GET' },
		);
		expect(res.name || res.repository_type || res.namespace).toBeDefined();
	});
});
