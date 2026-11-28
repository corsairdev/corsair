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
