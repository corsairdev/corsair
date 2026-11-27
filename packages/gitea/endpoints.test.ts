import { ApiError } from 'corsair/http';
import {
	encodeGiteaPathValue,
	giteaErrorMessage,
	normalizeInstanceUrl,
	resolveGiteaInstance,
	routeUrl,
} from './client';
import { giteaEndpointsNested } from './endpoints/catalog';
import { fileNameFor, isUsableFile } from './endpoints/operations';
import type { GiteaContext } from './index';

// Every call goes through the real client and core transport; only fetch is fake.

type Captured = {
	url: string;
	method: string;
	headers: Record<string, string>;
	// `unknown` because the sent body is a JSON string, text or a FormData.
	body: unknown;
};

let calls: Captured[] = [];

function reply(
	status: number,
	// `unknown` because each case answers its own body.
	body: unknown,
	contentType = 'application/json',
) {
	jest.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
		const headers: Record<string, string> = {};
		new Headers(init?.headers).forEach((value, key) => {
			headers[key] = value;
		});
		calls.push({
			url: String(input),
			method: init?.method ?? 'GET',
			headers,
			body: init?.body,
		});
		const payload =
			body instanceof Uint8Array
				? body
				: body === undefined
					? null
					: typeof body === 'string' && contentType !== 'application/json'
						? body
						: JSON.stringify(body);
		return new Response(payload, {
			status,
			headers: body === undefined ? {} : { 'content-type': contentType },
		});
	});
}

const SITE = 'https://git.example.com';
const BASE = `${SITE}/api/v1`;

function ctx(
	instanceUrl: string | undefined = SITE,
	stored: string | null = null,
): GiteaContext {
	return {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: 'gt_test_token',
		options: instanceUrl ? { instanceUrl } : {},
		keys: {
			get_api_key: () => Promise.resolve('gt_test_token'),
			get_instance_url: () => Promise.resolve(stored),
		},
		db: {},
		// `unknown` because a test context fills only the fields the endpoints read.
	} as unknown as GiteaContext;
}

// `unknown` because the endpoint tree holds functions of many input types.
type AnyEndpoint = (ctx: GiteaContext, input: unknown) => Promise<unknown>;

function endpointFor(id: string): AnyEndpoint {
	// `unknown` because the walk goes through nested groups of endpoints.
	let node: unknown = giteaEndpointsNested;
	for (const part of id.split('.')) {
		node = (node as Record<string, unknown>)[part];
	}
	if (typeof node !== 'function') throw new Error(`no endpoint ${id}`);
	return node as AnyEndpoint;
}

const path = (n = 0) => decodeURI(new URL(calls[n]?.url ?? '').pathname);
const rawPath = (n = 0) => new URL(calls[n]?.url ?? '').pathname;
const query = (n = 0) => new URL(calls[n]?.url ?? '').searchParams;

beforeEach(() => {
	calls = [];
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('instance URL', () => {
	it('lands the site root and the API root on <site>/api/v1', () => {
		expect(normalizeInstanceUrl('https://gitea.com')).toBe(
			'https://gitea.com/api/v1',
		);
		expect(normalizeInstanceUrl(' https://codeberg.org/api/v1/ ')).toBe(
			'https://codeberg.org/api/v1',
		);
		expect(normalizeInstanceUrl('https://example.com/git/')).toBe(
			'https://example.com/git/api/v1',
		);
		expect(normalizeInstanceUrl('http://localhost:3300')).toBe(
			'http://localhost:3300/api/v1',
		);
	});

	it('refuses URLs that are not a plain http(s) site', () => {
		for (const bad of [
			'',
			'gitea.com',
			'ftp://gitea.com',
			'https://user:pw@gitea.com',
			'https://gitea.com/?x=1',
			'https://gitea.com/#top',
		]) {
			expect(() => normalizeInstanceUrl(bad)).toThrow(/\[gitea\]/);
		}
	});

	it('takes the plugin option first, then the account, else asks to connect', async () => {
		await expect(
			resolveGiteaInstance({
				options: { instanceUrl: 'https://a.example' },
				keys: { get_instance_url: async () => 'https://b.example' },
			}),
		).resolves.toBe('https://a.example/api/v1');
		await expect(
			resolveGiteaInstance({
				options: {},
				keys: { get_instance_url: async () => 'https://b.example' },
			}),
		).resolves.toBe('https://b.example/api/v1');
		await expect(
			resolveGiteaInstance({
				options: {},
				keys: { get_instance_url: async () => null },
			}),
		).rejects.toMatchObject({ name: 'AuthMissingError' });
	});

	it('sends calls to the stored instance with token auth', async () => {
		reply(200, { id: 1, login: 'ada' });
		const out = await endpointFor('user.me')(
			ctx('', 'https://codeberg.org'),
			{},
		);
		expect(out).toEqual({ id: 1, login: 'ada' });
		expect(calls[0]?.url).toBe('https://codeberg.org/api/v1/user');
		expect(calls[0]?.headers.authorization).toBe('token gt_test_token');
	});
});

describe('paths', () => {
	it('keeps the slashes of branches and file paths, segment by segment', async () => {
		reply(200, { name: 'feature/login' });
		await endpointFor('branches.get')(ctx(), {
			owner: 'ada',
			repo: 'site',
			branch: 'feature/login',
		});
		expect(path()).toBe('/api/v1/repos/ada/site/branches/feature/login');
		reply(200, { name: 'a b.md' });
		await endpointFor('contents.get')(ctx(), {
			owner: 'ada',
			repo: 'site',
			filepath: 'docs/a b#1.md',
		});
		expect(rawPath(1)).toBe(
			'/api/v1/repos/ada/site/contents/docs/a%20b%231.md',
		);
	});

	it('encodes a slash in a value that is one segment (an owner, a label id)', async () => {
		reply(200, {});
		await endpointFor('repos.get')(ctx(), { owner: 'a/b', repo: 'site' });
		expect(rawPath()).toBe('/api/v1/repos/a%2Fb/site');
	});

	it('refuses dot segments before sending anything', async () => {
		reply(200, {});
		for (const bad of ['..', 'docs/../x', '.', 'a//b']) {
			await expect(
				endpointFor('contents.get')(ctx(), {
					owner: 'ada',
					repo: 'site',
					filepath: bad,
				}),
			).rejects.toThrow(/Invalid Gitea path value/);
		}
		expect(calls).toHaveLength(0);
		expect(() => encodeGiteaPathValue('..')).toThrow();
		expect(encodeGiteaPathValue('main...feature/x', true)).toBe(
			'main...feature/x',
		);
	});

	it('takes a number where Gitea routes a string id or index', async () => {
		reply(200, { id: 3, title: 'v1' });
		await endpointFor('milestones.get')(ctx(), {
			owner: 'ada',
			repo: 'site',
			id: 3,
		});
		expect(path()).toBe('/api/v1/repos/ada/site/milestones/3');
	});

	it('fills a diff route with two placeholders in one segment', async () => {
		reply(200, 'diff --git a/x b/x\n', 'text/plain');
		const out = await endpointFor('pulls.downloadDiff')(ctx(), {
			owner: 'ada',
			repo: 'site',
			index: 5,
			diffType: 'patch',
		});
		expect(path()).toBe('/api/v1/repos/ada/site/pulls/5.patch');
		expect(out).toEqual({ text: 'diff --git a/x b/x\n' });
	});
});

describe('bodies and queries', () => {
	it('sends path and query fields where they belong and the rest as JSON', async () => {
		reply(201, { id: 9, number: 4, title: 'Login fails' });
		await endpointFor('issues.create')(ctx(), {
			owner: 'ada',
			repo: 'site',
			title: 'Login fails',
			labels: [1, 2],
		});
		expect(calls[0]?.method).toBe('POST');
		expect(path()).toBe('/api/v1/repos/ada/site/issues');
		expect(JSON.parse(String(calls[0]?.body))).toEqual({
			title: 'Login fails',
			labels: [1, 2],
		});
		expect(calls[0]?.headers['content-type']).toBe('application/json');
	});

	it('repeats a list query parameter', async () => {
		reply(200, []);
		await endpointFor('pulls.list')(ctx(), {
			owner: 'ada',
			repo: 'site',
			labels: [1, 2],
		});
		expect(query().getAll('labels')).toEqual(['1', '2']);
	});

	it('sends the other issue of a dependency under Gitea’s own field names', async () => {
		reply(201, {});
		await endpointFor('issues.dependencies.add')(ctx(), {
			owner: 'ada',
			repo: 'site',
			index: 4,
			other_owner: 'ada',
			other_repo: 'api',
			other_index: 7,
		});
		expect(path()).toBe('/api/v1/repos/ada/site/issues/4/dependencies');
		expect(JSON.parse(String(calls[0]?.body))).toEqual({
			owner: 'ada',
			repo: 'api',
			index: 7,
		});
	});

	it('puts the owner of an admin-made org in the path and the org name in the body', async () => {
		reply(201, { username: 'acme' });
		await endpointFor('admin.users.orgs.create')(ctx(), {
			owner: 'ada',
			username: 'acme',
		});
		expect(path()).toBe('/api/v1/admin/users/ada/orgs');
		expect(JSON.parse(String(calls[0]?.body))).toEqual({ username: 'acme' });
	});

	it('sends raw markdown as text/plain and reads HTML back as text', async () => {
		reply(200, '<h1>hi</h1>\n', 'text/html');
		const out = await endpointFor('misc.markdown.renderRaw')(ctx(), {
			text: '# hi',
		});
		expect(calls[0]?.body).toBe('# hi');
		expect(calls[0]?.headers['content-type']).toBe('text/plain');
		expect(out).toEqual({ text: '<h1>hi</h1>\n' });
	});

	it('uploads an attachment as multipart', async () => {
		reply(201, { id: 3, name: 'shot.png' });
		await endpointFor('issues.attachments.create')(ctx(), {
			owner: 'ada',
			repo: 'site',
			index: 4,
			name: 'shot.png',
			attachment: {
				base64: 'iVBORw0KGgo=',
				filename: 'shot.png',
				contentType: 'image/png',
			},
		});
		const form = calls[0]?.body as FormData;
		expect(form).toBeInstanceOf(FormData);
		const file = form.get('attachment') as File;
		expect(file.name).toBe('shot.png');
		// `name` is a query parameter on this route, the file the only form field.
		expect(query().get('name')).toBe('shot.png');
		expect([...form.keys()]).toEqual(['attachment']);
	});

	it('refuses unknown fields on a route without a body, naming none of them', async () => {
		reply(200, {});
		await expect(
			endpointFor('repos.get')(ctx(), {
				owner: 'ada',
				repo: 'site',
				secret_thing: 'x',
			}),
		).rejects.toThrow(
			/1 unknown field \(<key>\); this operation takes owner, repo/,
		);
		expect(calls).toHaveLength(0);
	});
});

describe('responses', () => {
	it('pages a list, asking for 50 when the limit is left out', async () => {
		reply(
			200,
			Array.from({ length: 50 }, (_, i) => ({ id: i })),
		);
		const out = (await endpointFor('repos.list')(ctx(), {})) as {
			items: unknown[];
			next_page: number | null;
		};
		expect(query().get('limit')).toBe('50');
		expect(out.items).toHaveLength(50);
		expect(out.next_page).toBe(2);
	});

	it('keeps paging past a short page, and stops at an empty one', async () => {
		// An instance whose admin set MAX_RESPONSE_ITEMS to 20: a page of 50 asked
		// comes back with 20, and the list goes on.
		reply(
			200,
			Array.from({ length: 20 }, (_, i) => ({ id: i })),
		);
		const short = (await endpointFor('repos.list')(ctx(), {
			page: 3,
			limit: 50,
		})) as { next_page: number | null };
		expect(short.next_page).toBe(4);
		reply(200, []);
		const empty = (await endpointFor('repos.list')(ctx(), { page: 4 })) as {
			next_page: number | null;
		};
		expect(empty.next_page).toBeNull();
	});

	it('reads Go’s null for an empty list as an empty list', async () => {
		reply(200, null);
		await expect(
			endpointFor('issues.templates.list')(ctx(), {
				owner: 'ada',
				repo: 'site',
			}),
		).resolves.toEqual([]);
	});

	it('answers a bodiless 204 with success', async () => {
		reply(204, undefined);
		await expect(
			endpointFor('repos.delete')(ctx(), { owner: 'ada', repo: 'site' }),
		).resolves.toEqual({ success: true });
		reply(205, undefined);
		await expect(
			endpointFor('notifications.threads.markRead')(ctx(), { id: '7' }),
		).resolves.toEqual({ success: true });
	});

	it('returns a raw file with its own name', async () => {
		reply(200, new TextEncoder().encode('hello'), 'text/plain');
		const out = (await endpointFor('contents.raw')(ctx(), {
			owner: 'ada',
			repo: 'site',
			filepath: 'docs/a.md',
		})) as { filename: string; byteLength: number };
		expect(out.filename).toBe('a.md');
		expect(out.byteLength).toBe(5);
	});

	it('refuses an HTML page where an archive should be', async () => {
		reply(
			200,
			new TextEncoder().encode('<!doctype html><p>login'),
			'text/html',
		);
		await expect(
			endpointFor('repos.downloadArchive')(ctx(), {
				owner: 'ada',
				repo: 'site',
				archive: 'main.zip',
			}),
		).rejects.toThrow(/answered without a file/);
		expect(isUsableFile('contents.raw', new Uint8Array(), null)).toBe(true);
		expect(
			fileNameFor(
				'actions.artifacts.download',
				{ artifact_id: 9 },
				'application/zip',
			),
		).toBe('gitea-actions-artifacts-download-9.zip');
	});

	it('refuses a response that breaks its documented types', async () => {
		reply(200, { id: 'not-a-number', login: 3 });
		await expect(endpointFor('user.me')(ctx(), {})).rejects.toThrow(
			/did not match its documented schema/,
		);
	});
});

describe('errors', () => {
	it('keeps the status and Gitea’s message, without the values sent', async () => {
		reply(404, {
			message: 'repository ada/secret-site does not exist',
			url: 'x',
		});
		const error = (await endpointFor('repos.get')(ctx(), {
			owner: 'ada',
			repo: 'secret-site',
		}).catch((e: unknown) => e)) as ApiError;
		expect(error).toBeInstanceOf(ApiError);
		expect(error.status).toBe(404);
		expect(error.message).toBe(
			'Gitea 404: repository [REDACTED]/[REDACTED] does not exist',
		);
		expect(error.url).toBe(`${BASE}/repos/{owner}/{repo}`);
		expect(JSON.stringify(error.request)).not.toContain('secret-site');
		expect(JSON.stringify(error)).not.toContain('gt_test_token');
	});

	it('scrubs path values Gitea quotes back decoded', async () => {
		reply(404, { message: 'file private/ada@example.com.txt does not exist' });
		const error = (await endpointFor('contents.get')(ctx(), {
			owner: 'ada',
			repo: 'site',
			filepath: 'private/ada@example.com.txt',
		}).catch((e: unknown) => e)) as ApiError;
		expect(error.status).toBe(404);
		expect(error.message).not.toContain('ada@example.com');
		expect(JSON.stringify(error.body)).not.toContain('ada@example.com');
	});

	it('drops the sent body from a validation error', async () => {
		reply(422, { message: '[Title]: Required', errors: ['title is empty'] });
		const error = (await endpointFor('issues.create')(ctx(), {
			owner: 'ada',
			repo: 'site',
			title: 'x',
			body: 'private steps',
		}).catch((e: unknown) => e)) as ApiError;
		expect(error.status).toBe(422);
		expect(error.message).toBe('Gitea 422: [Title]: Required; title is empty');
		expect(error.request.body).toBe('[REDACTED]');
	});

	it('writes messages from JSON, plain text and HTML bodies', () => {
		expect(giteaErrorMessage(404, 'Not Found', '404 page not found\n')).toBe(
			'Gitea 404: 404 page not found',
		);
		expect(giteaErrorMessage(502, 'Bad Gateway', '<html>nginx</html>')).toBe(
			'Gitea 502: Bad Gateway',
		);
		expect(giteaErrorMessage(500, '', { message: '' })).toBe(
			'Gitea 500: request failed',
		);
	});

	it('names the route, not the values, in the error URL', () => {
		expect(
			routeUrl(
				'https://git.example.com/sub/api/v1/repos/ada/site/issues/4?state=open',
				'/repos/{owner}/{repo}/issues/{index}',
			),
		).toBe(
			'https://git.example.com/sub/api/v1/repos/{owner}/{repo}/issues/{index}?[REDACTED]',
		);
	});
});
