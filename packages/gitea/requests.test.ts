import type { GiteaContext } from './index';
import { gitea } from './index';
import {
	branchFixture,
	commentFixture,
	commitFixture,
	errorEnvelope,
	hookFixture,
	issueFixture,
	releaseFixture,
	repoFixture,
	userFixture,
} from './test-fixtures';

const API_KEY = 'gt-secret-test-key';
const INSTANCE = 'https://git.example.com';

let fetchMock: jest.SpyInstance;

// The alias keeps the open type off the signature line, where a trailing
// annotation would sit between code and a brace.
type JsonBody = unknown; // unknown: response bodies are arbitrary JSON until the endpoint's output schema parses them.

function respond(body: JsonBody, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(typeof body === 'string' ? body : JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

function respondEmpty(status: number) {
	fetchMock.mockResolvedValueOnce(new Response(null, { status }));
}

function makeContext(): GiteaContext {
	const fixture = {
		key: API_KEY,
		endpoints: {},
		options: {},
		keys: {
			get_instance_url: () => Promise.resolve(`${INSTANCE}/`),
			get_api_key: () => Promise.resolve(API_KEY),
		},
	};
	// unknown: only `key` and `keys.get_instance_url` are read by the
	// endpoints, so the fixture is cast instead of fully built.
	return fixture as unknown as GiteaContext; // unknown: see note above
}

function lastCall() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	return {
		url,
		parsed: new URL(url),
		init,
		headers: new Headers(init.headers),
		body: init.body ? JSON.parse(String(init.body)) : undefined,
	};
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

const plugin = gitea({ key: API_KEY });
// `CorsairPlugin.endpoints` is optional on the type; this plugin always sets it.
const endpoints = plugin.endpoints as NonNullable<typeof plugin.endpoints>;

describe('user endpoints', () => {
	it('user.me GETs /user with the token header', async () => {
		respond(userFixture);

		const result = await endpoints.user.me(makeContext(), {});

		const { parsed, init, headers } = lastCall();
		expect(init.method).toBe('GET');
		expect(parsed.pathname).toBe('/api/v1/user');
		expect(headers.get('authorization')).toBe(`token ${API_KEY}`);
		expect(result.id).toBe(userFixture.id);
		expect(result.login).toBe(userFixture.login);
	});
});

describe('repos endpoints', () => {
	it('repos.list GETs /user/repos and sends the page cap when limit is omitted', async () => {
		respond([repoFixture]);

		const result = await endpoints.repos.list(makeContext(), {});

		const { parsed } = lastCall();
		expect(lastCall().init.method).toBe('GET');
		expect(parsed.pathname).toBe('/api/v1/user/repos');
		expect(parsed.searchParams.get('page')).toBe('1');
		expect(parsed.searchParams.get('limit')).toBe('50');
		expect(result.repositories).toHaveLength(1);
		expect(result.page).toBe(1);
		expect(result.limit).toBe(50);
	});

	it('repos.list honours the page and limit the caller asked for', async () => {
		respond([]);

		const result = await endpoints.repos.list(makeContext(), {
			page: 3,
			limit: 10,
		});

		const { parsed } = lastCall();
		expect(parsed.searchParams.get('page')).toBe('3');
		expect(parsed.searchParams.get('limit')).toBe('10');
		expect(result.page).toBe(3);
		expect(result.limit).toBe(10);
	});

	it('repos.get GETs /repos/{owner}/{repo}', async () => {
		respond(repoFixture);

		const result = await endpoints.repos.get(makeContext(), {
			owner: 'gitea',
			repo: 'gitea',
		});

		const { parsed, init } = lastCall();
		expect(init.method).toBe('GET');
		expect(parsed.pathname).toBe('/api/v1/repos/gitea/gitea');
		expect(result.full_name).toBe('gitea/gitea');
		expect(result.archived).toBe(true);
	});

	it('repos.create POSTs CreateRepoOption to /user/repos', async () => {
		respond({ ...repoFixture, name: 'demo', private: true }, 201);

		const result = await endpoints.repos.create(makeContext(), {
			name: 'demo',
			private: true,
			auto_init: true,
		});

		const { parsed, init, body } = lastCall();
		expect(init.method).toBe('POST');
		expect(parsed.pathname).toBe('/api/v1/user/repos');
		expect(body).toEqual({ name: 'demo', private: true, auto_init: true });
		expect(result.name).toBe('demo');
	});

	it('repos.delete DELETEs the repo and records what was removed', async () => {
		respondEmpty(204);

		const result = await endpoints.repos.delete(makeContext(), {
			owner: 'gitea',
			repo: 'gitea',
		});

		const { parsed, init } = lastCall();
		expect(init.method).toBe('DELETE');
		expect(parsed.pathname).toBe('/api/v1/repos/gitea/gitea');
		expect(result).toEqual({ deleted: true, owner: 'gitea', repo: 'gitea' });
	});
});

describe('branches endpoints', () => {
	it('branches.list GETs the branches page', async () => {
		respond([branchFixture]);

		const result = await endpoints.branches.list(makeContext(), {
			owner: 'gitea',
			repo: 'gitea',
			q: 'mas',
			limit: 25,
		});

		const { parsed } = lastCall();
		expect(parsed.pathname).toBe('/api/v1/repos/gitea/gitea/branches');
		expect(parsed.searchParams.get('q')).toBe('mas');
		expect(parsed.searchParams.get('page')).toBe('1');
		expect(parsed.searchParams.get('limit')).toBe('25');
		expect(result.branches[0]?.name).toBe('master');
		expect(result.page).toBe(1);
		expect(result.limit).toBe(25);
	});
});

describe('commits endpoints', () => {
	it('commits.list GETs the commits page with its filters', async () => {
		respond([commitFixture]);

		const result = await endpoints.commits.list(makeContext(), {
			owner: 'gitea',
			repo: 'gitea',
			sha: 'master',
			path: 'docs/',
			since: '2020-01-01T00:00:00Z',
			stat: true,
		});

		const { parsed } = lastCall();
		expect(parsed.pathname).toBe('/api/v1/repos/gitea/gitea/commits');
		expect(parsed.searchParams.get('sha')).toBe('master');
		expect(parsed.searchParams.get('path')).toBe('docs/');
		expect(parsed.searchParams.get('since')).toBe('2020-01-01T00:00:00Z');
		expect(parsed.searchParams.get('stat')).toBe('true');
		expect(parsed.searchParams.get('limit')).toBe('50');
		expect(result.commits[0]?.sha).toBe(commitFixture.sha);
	});

	it('commits.list surfaces the empty-repository 409 instead of faking a page', async () => {
		respond(errorEnvelope('git repository is empty'), 409);

		await expect(
			endpoints.commits.list(makeContext(), {
				owner: 'gitea',
				repo: 'empty',
			}),
		).rejects.toMatchObject({ status: 409 });
	});
});

describe('issues endpoints', () => {
	it('issues.list GETs the issues page with its filters', async () => {
		respond([issueFixture]);

		const result = await endpoints.issues.list(makeContext(), {
			owner: 'gitea',
			repo: 'gitea',
			state: 'all',
			type: 'issues',
			labels: 'bug,ui',
		});

		const { parsed } = lastCall();
		expect(parsed.pathname).toBe('/api/v1/repos/gitea/gitea/issues');
		expect(parsed.searchParams.get('state')).toBe('all');
		expect(parsed.searchParams.get('type')).toBe('issues');
		expect(parsed.searchParams.get('labels')).toBe('bug,ui');
		expect(parsed.searchParams.get('page')).toBe('1');
		expect(parsed.searchParams.get('limit')).toBe('50');
		expect(result.issues[0]?.number).toBe(1);
	});

	it('issues.get GETs the issue by NUMBER, not by global id', async () => {
		respond(issueFixture);

		const result = await endpoints.issues.get(makeContext(), {
			owner: 'gitea',
			repo: 'gitea',
			index: 1,
		});

		const { parsed } = lastCall();
		expect(parsed.pathname).toBe('/api/v1/repos/gitea/gitea/issues/1');
		expect(result.number).toBe(1);
		expect(result.id).toBe(31370);
	});

	it('issues.create POSTs CreateIssueOption', async () => {
		respond({ ...issueFixture, title: 'New bug' }, 201);

		const result = await endpoints.issues.create(makeContext(), {
			owner: 'gitea',
			repo: 'gitea',
			title: 'New bug',
			body: 'Steps to reproduce',
			labels: [7, 11],
		});

		const { parsed, init, body } = lastCall();
		expect(init.method).toBe('POST');
		expect(parsed.pathname).toBe('/api/v1/repos/gitea/gitea/issues');
		expect(body).toEqual({
			title: 'New bug',
			body: 'Steps to reproduce',
			labels: [7, 11],
		});
		expect(result.title).toBe('New bug');
	});

	it('issues.update PATCHes the issue and can close it', async () => {
		// The spec's only success code for PATCH issues is 201 (the 200 one is
		// PATCH /repos/{owner}/{repo}, the repo edit), so the mock follows that.
		respond({ ...issueFixture, state: 'closed' }, 201);

		const result = await endpoints.issues.update(makeContext(), {
			owner: 'gitea',
			repo: 'gitea',
			index: 1,
			state: 'closed',
		});

		const { parsed, init, body } = lastCall();
		expect(init.method).toBe('PATCH');
		expect(parsed.pathname).toBe('/api/v1/repos/gitea/gitea/issues/1');
		expect(body).toEqual({ state: 'closed' });
		expect(result.state).toBe('closed');
	});
});

describe('comments endpoints', () => {
	it('comments.list GETs all comments on an issue and sends no paging', async () => {
		respond([commentFixture]);

		const result = await endpoints.comments.list(makeContext(), {
			owner: 'gitea',
			repo: 'gitea',
			index: 1,
			since: '2020-12-26T00:00:00Z',
		});

		const { parsed } = lastCall();
		expect(parsed.pathname).toBe('/api/v1/repos/gitea/gitea/issues/1/comments');
		expect(parsed.searchParams.get('since')).toBe('2020-12-26T00:00:00Z');
		expect(parsed.searchParams.has('page')).toBe(false);
		expect(parsed.searchParams.has('limit')).toBe(false);
		expect(result.comments[0]?.id).toBe(42);
	});

	it('comments.create POSTs the comment body', async () => {
		respond(commentFixture, 201);

		const result = await endpoints.comments.create(makeContext(), {
			owner: 'gitea',
			repo: 'gitea',
			index: 1,
			body: 'Looks fixed to me.',
		});

		const { parsed, init, body } = lastCall();
		expect(init.method).toBe('POST');
		expect(parsed.pathname).toBe('/api/v1/repos/gitea/gitea/issues/1/comments');
		expect(body).toEqual({ body: 'Looks fixed to me.' });
		expect(result.id).toBe(42);
	});
});

describe('releases endpoints', () => {
	it('releases.list GETs the releases page with the hyphenated pre-release param', async () => {
		respond([releaseFixture]);

		const result = await endpoints.releases.list(makeContext(), {
			owner: 'gitea',
			repo: 'gitea',
			draft: false,
			pre_release: false,
		});

		const { parsed } = lastCall();
		expect(parsed.pathname).toBe('/api/v1/repos/gitea/gitea/releases');
		expect(parsed.searchParams.get('draft')).toBe('false');
		expect(parsed.searchParams.get('pre-release')).toBe('false');
		expect(parsed.searchParams.has('pre_release')).toBe(false);
		expect(result.releases[0]?.tag_name).toBe('v1.0.0');
	});

	it('releases.create POSTs CreateReleaseOption', async () => {
		respond(releaseFixture, 201);

		const result = await endpoints.releases.create(makeContext(), {
			owner: 'gitea',
			repo: 'gitea',
			tag_name: 'v1.0.0',
			name: 'First release',
			prerelease: false,
		});

		const { parsed, init, body } = lastCall();
		expect(init.method).toBe('POST');
		expect(parsed.pathname).toBe('/api/v1/repos/gitea/gitea/releases');
		expect(body).toEqual({
			tag_name: 'v1.0.0',
			name: 'First release',
			prerelease: false,
		});
		expect(result.id).toBe(7);
	});
});

describe('webhooks endpoints', () => {
	it('webhooks.list GETs the hooks page', async () => {
		respond([hookFixture]);

		const result = await endpoints.webhooks.list(makeContext(), {
			owner: 'gitea',
			repo: 'gitea',
		});

		const { parsed } = lastCall();
		expect(parsed.pathname).toBe('/api/v1/repos/gitea/gitea/hooks');
		expect(parsed.searchParams.get('limit')).toBe('50');
		expect(result.hooks[0]?.type).toBe('gitea');
		expect(result.hooks[0]?.config).toEqual(hookFixture.config);
	});

	it('webhooks.create POSTs CreateHookOption', async () => {
		respond(hookFixture, 201);

		const result = await endpoints.webhooks.create(makeContext(), {
			owner: 'gitea',
			repo: 'gitea',
			type: 'gitea',
			config: {
				url: 'https://receiver.example.com/gitea',
				content_type: 'json',
			},
			events: ['push'],
			active: true,
		});

		const { parsed, init, body } = lastCall();
		expect(init.method).toBe('POST');
		expect(parsed.pathname).toBe('/api/v1/repos/gitea/gitea/hooks');
		expect(body).toEqual({
			type: 'gitea',
			config: {
				url: 'https://receiver.example.com/gitea',
				content_type: 'json',
			},
			events: ['push'],
			active: true,
		});
		expect(result.id).toBe(3);
	});

	it('webhooks.delete DELETEs the hook by numeric id', async () => {
		respondEmpty(204);

		const result = await endpoints.webhooks.delete(makeContext(), {
			owner: 'gitea',
			repo: 'gitea',
			id: 3,
		});

		const { parsed, init } = lastCall();
		expect(init.method).toBe('DELETE');
		expect(parsed.pathname).toBe('/api/v1/repos/gitea/gitea/hooks/3');
		expect(result).toEqual({ deleted: true, id: 3 });
	});
});
