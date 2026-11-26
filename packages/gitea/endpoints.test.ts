import { ZodError } from 'zod';
import { GiteaEndpointInputSchemas } from './endpoints/types';
import type { GiteaContext } from './index';
import { gitea } from './index';
import { issueFixture, repoFixture, userFixture } from './test-fixtures';

const API_KEY = 'gt-secret-test-key';
const INSTANCE = 'https://git.example.com';

let fetchMock: jest.SpyInstance;

// The alias keeps the open type off the signature line, where a trailing
// annotation would sit between code and a brace.
type JsonBody = unknown; // unknown: response bodies are arbitrary JSON until the endpoint's output schema parses them.

function respond(body: JsonBody, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

function makeContext(): GiteaContext {
	const fixture = {
		key: API_KEY,
		endpoints: {},
		options: {},
		keys: { get_instance_url: () => Promise.resolve(INSTANCE) },
	};
	// unknown: only the members the endpoints read are implemented; see
	// requests.test.ts for the same fixture pattern.
	return fixture as unknown as GiteaContext; // unknown: see note above
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

const plugin = gitea({ key: API_KEY });
const endpoints = plugin.endpoints as NonNullable<typeof plugin.endpoints>;
const ctx = makeContext();

describe('output parsing', () => {
	it('rejects a plain-text body where a Repository object belongs', async () => {
		respond('not json at all');

		await expect(
			endpoints.repos.get(ctx, { owner: 'gitea', repo: 'gitea' }),
		).rejects.toBeInstanceOf(ZodError);
	});

	it('rejects a list answer where a single object belongs', async () => {
		respond([repoFixture]);

		await expect(
			endpoints.repos.get(ctx, { owner: 'gitea', repo: 'gitea' }),
		).rejects.toBeInstanceOf(ZodError);
	});

	it('rejects an issue whose number arrived as a string', async () => {
		respond({ ...issueFixture, number: '1' });

		await expect(
			endpoints.issues.get(ctx, { owner: 'gitea', repo: 'gitea', index: 1 }),
		).rejects.toBeInstanceOf(ZodError);
	});

	it('rejects a user whose id is missing', async () => {
		respond({ ...userFixture, id: undefined });

		await expect(endpoints.user.me(ctx, {})).rejects.toBeInstanceOf(ZodError);
	});

	it('keeps the documented nulls: an issue with unset fields parses', async () => {
		respond(issueFixture);

		const result = await endpoints.issues.get(ctx, {
			owner: 'gitea',
			repo: 'gitea',
			index: 1,
		});
		expect(result.closed_at).toBeNull();
		expect(result.assignees).toBeNull();
		expect(result.pull_request).toBeNull();
		expect(result.labels).toEqual([]);
	});

	it('passes Go zero time through as the provider sent it', async () => {
		respond(repoFixture);

		const result = await endpoints.repos.get(ctx, {
			owner: 'gitea',
			repo: 'gitea',
		});
		// Unset mirror timestamps arrive as Go's zero time string; the schema
		// types them as plain strings rather than rewriting the value.
		expect(result.mirror_updated).toBe('0001-01-01T00:00:00Z');
		expect(result.mirror_last_sync_at).toBe('0001-01-01T00:00:00Z');
	});

	it('maps a 204 delete onto the recorded result', async () => {
		fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }));

		const result = await endpoints.webhooks.delete(ctx, {
			owner: 'gitea',
			repo: 'gitea',
			id: 3,
		});
		expect(result).toEqual({ deleted: true, id: 3 });
	});
});

describe('input constraints the provider documents', () => {
	const cases: Array<[keyof typeof GiteaEndpointInputSchemas, object]> = [
		['reposList', { limit: 51 }],
		['reposList', { page: 0 }],
		['issuesList', { state: 'reopened' }],
		['issuesList', { type: 'tickets' }],
		['issuesUpdate', { index: 1, state: 'wontfix' }],
		['reposCreate', { name: 'demo', object_format_name: 'sha512' }],
		['reposCreate', { name: 'demo', trust_model: 'nobody' }],
		[
			'webhooksCreate',
			{
				type: 'pagerduty',
				config: { url: 'https://x.example.com', content_type: 'json' },
			},
		],
		['webhooksCreate', { type: 'slack', config: { content_type: 'json' } }],
		[
			'webhooksCreate',
			{ type: 'slack', config: { url: 'https://x.example.com' } },
		],
		['reposCreate', { name: '' }],
		['issuesCreate', { title: '' }],
		['commentsCreate', { body: '' }],
		['releasesCreate', { tag_name: '' }],
		['issuesGet', { index: 0 }],
		['webhooksDelete', { id: 0 }],
	];

	it.each(cases)('%s rejects %j', (key, input) => {
		expect(GiteaEndpointInputSchemas[key].safeParse(input).success).toBe(false);
	});

	it('accepts the boundary values: limit 50, state all, both webhooks config keys', () => {
		expect(
			GiteaEndpointInputSchemas.reposList.safeParse({ limit: 50 }).success,
		).toBe(true);
		expect(
			GiteaEndpointInputSchemas.issuesList.safeParse({
				owner: 'gitea',
				repo: 'gitea',
				state: 'all',
			}).success,
		).toBe(true);
		expect(
			GiteaEndpointInputSchemas.webhooksCreate.safeParse({
				owner: 'gitea',
				repo: 'gitea',
				type: 'slack',
				config: { url: 'https://hooks.example.com', content_type: 'json' },
			}).success,
		).toBe(true);
	});
});
