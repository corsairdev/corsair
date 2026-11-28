import { AuthMissingError } from 'corsair/core';
import {
	checkAzureDevopsStoredPairing,
	normalizeAzureDevopsOrganization,
	resolveAzureDevopsTarget,
} from './auth';
import {
	azuredevopsEndpointsNested as api,
	azuredevopsEndpointMeta,
} from './endpoints/catalog';
import type { AzureDevopsContext } from './index';
import { azuredevops } from './index';

// Azure DevOps specifics on top of the generic suites: the organization,
// PAT Basic auth, per-area hosts, fixed api-versions, JSON Patch bodies and
// continuation tokens in a response header. Checked against the spec and
// mocks only: no organization could be made without an Azure subscription.

type Captured = {
	url: string;
	method: string;
	headers: Headers;
	body: unknown;
};
let calls: Captured[] = [];

function reply(
	status: number,
	body: unknown,
	headers: Record<string, string> = {},
) {
	jest.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
		calls.push({
			url: String(input),
			method: init?.method ?? 'GET',
			headers: new Headers(init?.headers),
			body: init?.body,
		});
		return new Response(JSON.stringify(body), {
			status,
			headers: { 'content-type': 'application/json', ...headers },
		});
	});
}

const PAT = 'ado_pat_live_like_value';

function ctx(options: Record<string, string> = {}): AzureDevopsContext {
	return {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: PAT,
		options: { organization: 'fabrikam', ...options },
		keys: { get_api_key: () => Promise.resolve(PAT) },
		db: {},
		// `unknown` because a test context fills only the fields the endpoints read.
	} as unknown as AzureDevopsContext;
}

beforeEach(() => {
	calls = [];
});
afterEach(() => {
	jest.restoreAllMocks();
});

describe('organization', () => {
	it('takes a name or either organization URL form', () => {
		expect(normalizeAzureDevopsOrganization('fabrikam')).toBe('fabrikam');
		expect(
			normalizeAzureDevopsOrganization('https://dev.azure.com/fabrikam/'),
		).toBe('fabrikam');
		expect(
			normalizeAzureDevopsOrganization(
				'https://dev.azure.com/fabrikam/Project/_git/repo',
			),
		).toBe('fabrikam');
		expect(
			normalizeAzureDevopsOrganization('https://fabrikam.visualstudio.com'),
		).toBe('fabrikam');
	});

	it('refuses names that could change the host or path', () => {
		for (const bad of [
			'fab/rikam',
			'../x',
			'fab rikam',
			'https://evil.example.com/fabrikam',
			'-fab',
		]) {
			expect(() => normalizeAzureDevopsOrganization(bad)).toThrow(
				/organization/,
			);
		}
	});

	it('asks to connect without an organization, and keeps a stored PAT on its own one', async () => {
		await expect(
			resolveAzureDevopsTarget({ key: PAT, options: {}, keys: {} }),
		).rejects.toBeInstanceOf(AuthMissingError);
		const keys = { get_organization: () => Promise.resolve('fabrikam') };
		await expect(
			checkAzureDevopsStoredPairing(
				{ organization: 'https://dev.azure.com/Fabrikam' },
				keys,
			),
		).resolves.toBeUndefined();
		await expect(
			checkAzureDevopsStoredPairing({ organization: 'contoso' }, keys),
		).rejects.toBeInstanceOf(AuthMissingError);
		const plugin = azuredevops({ organization: 'contoso' });
		await expect(
			(
				plugin.keyBuilder as unknown as (
					c: unknown,
					s: string,
				) => Promise<string>
			)(
				{ keys: { ...keys, get_api_key: () => Promise.resolve(PAT) } },
				'endpoint',
			),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});

describe('requests', () => {
	it('sends the PAT as Basic auth with an empty user, and the documented api-version', async () => {
		reply(200, { count: 0, value: [] });
		await api.git.repositories.list(ctx(), { project: 'Fabrikam-Fiber' });
		const url = new URL(calls[0]?.url ?? '');
		expect(url.origin + url.pathname).toBe(
			'https://dev.azure.com/fabrikam/Fabrikam-Fiber/_apis/git/repositories',
		);
		expect(url.searchParams.get('api-version')).toBe('7.1');
		expect(calls[0]?.headers.get('authorization')).toBe(
			`Basic ${Buffer.from(`:${PAT}`).toString('base64')}`,
		);
	});

	it('creates a classification node under the root, and keeps a nested path whole', async () => {
		reply(200, { id: 7, name: 'Frontend' });
		await api.wit.classificationNodes.createOrUpdate(ctx(), {
			project: 'Fabrikam-Fiber',
			structureGroup: 'areas',
			name: 'Frontend',
		});
		expect(new URL(calls[0]?.url ?? '').pathname).toBe(
			'/fabrikam/Fabrikam-Fiber/_apis/wit/classificationnodes/areas',
		);
		reply(200, { id: 8, name: 'Widgets' });
		await api.wit.classificationNodes.get(ctx(), {
			project: 'Fabrikam-Fiber',
			structureGroup: 'areas',
			path: 'Web/Frontend',
		});
		expect(new URL(calls[1]?.url ?? '').pathname).toBe(
			'/fabrikam/Fabrikam-Fiber/_apis/wit/classificationnodes/areas/Web/Frontend',
		);
		await expect(
			api.wit.classificationNodes.get(ctx(), {
				project: 'Fabrikam-Fiber',
				structureGroup: 'areas',
				path: 'Web/../../keys',
			}),
		).rejects.toThrow();
	});

	it('leaves out optional segments: an organization feed, the default team', async () => {
		reply(200, { count: 0, value: [] });
		await api.artifacts.feedManagement.getFeeds(ctx(), {});
		expect(new URL(calls[0]?.url ?? '').pathname).toBe(
			'/fabrikam/_apis/packaging/feeds',
		);
		reply(200, { count: 0, value: [] });
		await api.work.iterations.list(ctx(), { project: 'Fabrikam-Fiber' });
		expect(new URL(calls[1]?.url ?? '').pathname).toBe(
			'/fabrikam/Fabrikam-Fiber/_apis/work/teamsettings/iterations',
		);
	});

	it('sends an Entra access token as a bearer token', async () => {
		reply(200, { count: 0, value: [] });
		const jwt = 'eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJ4In0.c2lnbmF0dXJl';
		await api.git.repositories.list(
			{ ...ctx(), key: jwt } as AzureDevopsContext,
			{ project: 'Fabrikam-Fiber' },
		);
		expect(calls[0]?.headers.get('authorization')).toBe(`Bearer ${jwt}`);
	});

	it("picks each area's host, and leaves the organization out on org-less hosts", async () => {
		reply(200, { value: [] }, { 'x-ms-continuationtoken': 'next-page' });
		await api.graph.users.list(ctx(), {});
		expect(new URL(calls[0]?.url ?? '').host).toBe('vssps.dev.azure.com');
		expect(new URL(calls[0]?.url ?? '').pathname).toBe(
			'/fabrikam/_apis/graph/users',
		);
		expect(new URL(calls[0]?.url ?? '').searchParams.get('api-version')).toBe(
			'7.1-preview.1',
		);
		calls = [];
		reply(200, { id: 'me' });
		await api.profile.profiles.get(ctx(), { id: 'me' });
		expect(new URL(calls[0]?.url ?? '').toString()).toMatch(
			/^https:\/\/app\.vssps\.visualstudio\.com\/_apis\/profile\/profiles\/me\?/,
		);
	});

	it('returns the continuation token from the response header', async () => {
		reply(
			200,
			{ count: 1, value: [{ id: 'p1', name: 'Fabrikam' }] },
			{ 'x-ms-continuationtoken': 'tok-2' },
		);
		const page = await api.core.projects.list(ctx(), { $top: 1 });
		expect(page).toMatchObject({ nextCursor: 'tok-2' });
		expect(new URL(calls[0]?.url ?? '').searchParams.get('$top')).toBe('1');
	});

	it("returns a wiki page's ETag and sends it back as If-Match", async () => {
		reply(200, { id: 3, path: '/Home', content: '# Home' }, { etag: '"v1"' });
		const page = await api.wiki.pages.getPageById(ctx(), {
			project: 'Fabrikam-Fiber',
			wikiIdentifier: 'Fabrikam-Fiber.wiki',
			id: 3,
			includeContent: true,
		});
		expect(page).toMatchObject({ id: 3, eTag: '"v1"' });
		reply(200, { id: 3, path: '/Home' }, { etag: '"v2"' });
		const edited = await api.wiki.pages.update(ctx(), {
			project: 'Fabrikam-Fiber',
			wikiIdentifier: 'Fabrikam-Fiber.wiki',
			id: 3,
			ifMatch: '"v1"',
			content: '# Home, edited',
		});
		expect(edited).toMatchObject({ eTag: '"v2"' });
		expect(calls[1]?.method).toBe('PATCH');
		expect(calls[1]?.headers.get('if-match')).toBe('"v1"');
		expect(calls[1]?.headers.get('content-type')).toContain('application/json');
		expect(JSON.parse(String(calls[1]?.body))).toEqual({
			content: '# Home, edited',
		});
	});

	it('uploads a wiki attachment as base64 text', async () => {
		reply(201, { name: 'notes.txt', path: '/.attachments/notes.txt' });
		await api.wiki.attachments.create(ctx(), {
			project: 'Fabrikam-Fiber',
			wikiIdentifier: 'Fabrikam-Fiber.wiki',
			name: 'notes.txt',
			file: { base64: 'SGVsbG8=', filename: 'notes.txt' },
		});
		const sent = calls[0]?.body;
		const text =
			typeof sent === 'string'
				? sent
				: new TextDecoder().decode(
						sent instanceof Blob
							? new Uint8Array(await sent.arrayBuffer())
							: (sent as Uint8Array),
					);
		expect(text).toBe('SGVsbG8=');
	});

	it("renames a release folder: the route's path is the old one, the body's the new one", async () => {
		reply(200, { path: '\\Web\\Nightly' });
		await api.release.folders.update(ctx(), {
			project: 'Fabrikam-Fiber',
			path: '\\Web\\Daily',
			bodyPath: '\\Web\\Nightly',
		});
		expect(decodeURIComponent(new URL(calls[0]?.url ?? '').pathname)).toBe(
			'/fabrikam/Fabrikam-Fiber/_apis/release/folders/\\Web\\Daily',
		);
		expect(JSON.parse(String(calls[0]?.body))).toEqual({
			path: '\\Web\\Nightly',
		});
	});

	it('sends a work item as a JSON Patch list', async () => {
		reply(200, {
			id: 1,
			rev: 1,
			fields: { 'System.Title': 'Write the notes' },
		});
		await api.wit.workItems.create(ctx(), {
			project: 'Fabrikam-Fiber',
			type: 'Task',
			body: [
				{ op: 'add', path: '/fields/System.Title', value: 'Write the notes' },
			],
		});
		const url = new URL(calls[0]?.url ?? '');
		expect(decodeURIComponent(url.pathname)).toBe(
			'/fabrikam/Fabrikam-Fiber/_apis/wit/workitems/$Task',
		);
		expect(calls[0]?.headers.get('content-type')).toBe(
			'application/json-patch+json',
		);
		expect(JSON.parse(String(calls[0]?.body))).toEqual([
			{ op: 'add', path: '/fields/System.Title', value: 'Write the notes' },
		]);
	});

	it('keeps the PAT out of an error', async () => {
		reply(401, { message: `TF400813: The user is not authorized ${PAT}` });
		const error = await api.git.repositories
			.list(ctx(), { project: 'Fabrikam-Fiber' })
			.catch((e: unknown) => e as Error);
		expect(String(error)).toMatch(/Azure DevOps 401/);
		expect(String(error)).not.toContain(PAT);
	});

	it('reads the reason from a { count, value: { Message } } error body', async () => {
		reply(400, {
			count: 1,
			value: {
				Message:
					'The KeepForever flag has been deprecated in favor of retention leases.',
			},
		});
		const error = await api.build.builds
			.updateBuild(ctx(), {
				project: 'Fabrikam-Fiber',
				buildId: 391,
				retainedByRelease: true,
			})
			.catch((e: unknown) => e as Error);
		expect(String(error)).toContain(
			'Azure DevOps 400: The KeepForever flag has been deprecated',
		);
	});

	it('asks a download route for the type it documents', async () => {
		jest.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
			calls.push({
				url: String(input),
				method: init?.method ?? 'GET',
				headers: new Headers(init?.headers),
				body: init?.body,
			});
			return new Response(new Uint8Array([80, 75, 3, 4]), {
				status: 200,
				headers: { 'content-type': 'application/zip' },
			});
		});
		await api.git.blobs.getBlobsZip(ctx(), {
			project: 'Fabrikam-Fiber',
			repositoryId: 'fabrikam-web',
			body: ['7ae0a1b5c3f7a9c0d2b3e4f5a6b7c8d9e0f1a2b3'],
		});
		expect(calls[0]?.headers.get('accept')).toBe('application/zip');
	});
});

describe('risk levels', () => {
	it('marks queuing builds, running pipelines, pushes, PR updates and deletes destructive', () => {
		for (const id of [
			'build.builds.queue',
			'pipelines.runs.runPipeline',
			'git.pushes.create',
			'git.pullRequests.update',
			'wit.workItems.delete',
		] as const) {
			expect([id, azuredevopsEndpointMeta[id].riskLevel]).toEqual([
				id,
				'destructive',
			]);
		}
		expect(azuredevopsEndpointMeta['git.repositories.list'].riskLevel).toBe(
			'read',
		);
		expect(azuredevopsEndpointMeta['wit.wiql.queryByWiql'].riskLevel).toBe(
			'read',
		);
		expect(azuredevopsEndpointMeta['wit.workItems.create'].riskLevel).toBe(
			'write',
		);
	});
});
