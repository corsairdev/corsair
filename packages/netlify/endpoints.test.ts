import { ApiError } from 'corsair/http';
import {
	encodeNetlifyPathValue,
	netlifyErrorMessage,
	routeUrl,
} from './client';
import { netlifyEndpointsNested } from './endpoints/catalog';
import { nextPageOf } from './endpoints/operations';
import type { NetlifyContext } from './index';

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

const BASE = 'https://api.netlify.com/api/v1';

function ctx(): NetlifyContext {
	return {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: 'nfp_test_token',
		options: {},
		keys: { get_api_key: () => Promise.resolve('nfp_test_token') },
		db: {},
		// `unknown` because a test context fills only the fields the endpoints read.
	} as unknown as NetlifyContext;
}

// `unknown` because the endpoint tree holds functions of many input types.
type AnyEndpoint = (ctx: NetlifyContext, input: unknown) => Promise<unknown>;

function endpointFor(id: string): AnyEndpoint {
	// `unknown` because the walk goes through nested groups of endpoints.
	let node: unknown = netlifyEndpointsNested;
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

describe('requests', () => {
	it('sends calls to api.netlify.com with bearer auth', async () => {
		reply(200, { id: 'u1', email: 'ada@example.com' });
		await endpointFor('user.me')(ctx(), {});
		expect(calls[0]?.url).toBe(`${BASE}/user`);
		expect(calls[0]?.method).toBe('GET');
		expect(calls[0]?.headers.authorization).toBe('Bearer nfp_test_token');
	});

	it('fills path parameters and sends the rest of the input as JSON', async () => {
		reply(200, { id: 's1', name: 'docs-v2' });
		await endpointFor('sites.update')(ctx(), {
			site_id: 's1',
			name: 'docs-v2',
			force_ssl: true,
		});
		expect(calls[0]?.method).toBe('PATCH');
		expect(path()).toBe('/api/v1/sites/s1');
		expect(calls[0]?.headers['content-type']).toBe('application/json');
		expect(JSON.parse(String(calls[0]?.body))).toEqual({
			name: 'docs-v2',
			force_ssl: true,
		});
	});

	it('uses the site env route without the repeated base path', async () => {
		reply(200, []);
		await endpointFor('env.listForSite')(ctx(), {
			site_id: 's1',
			context_name: 'production',
		});
		expect(path()).toBe('/api/v1/sites/s1/env');
		expect(query().get('context_name')).toBe('production');
	});

	it('sends a list body as the whole JSON body', async () => {
		reply(201, [{ key: 'API_URL' }]);
		await endpointFor('env.create')(ctx(), {
			account_id: 'a1',
			site_id: 's1',
			env_vars: [{ key: 'API_URL', values: [{ value: 'x', context: 'all' }] }],
		});
		expect(path()).toBe('/api/v1/accounts/a1/env');
		expect(query().get('site_id')).toBe('s1');
		expect(JSON.parse(String(calls[0]?.body))).toEqual([
			{ key: 'API_URL', values: [{ value: 'x', context: 'all' }] },
		]);
	});

	it('sends a value named in both the query and the body to both', async () => {
		reply(201, {
			id: 'h1',
			site_id: 's1',
			type: 'url',
			event: 'deploy_failed',
		});
		await endpointFor('hooks.create')(ctx(), {
			site_id: 's1',
			type: 'url',
			event: 'deploy_failed',
			data: { url: 'https://example.com/hook', signature_secret: 'shh' },
		});
		expect(path()).toBe('/api/v1/hooks');
		expect(query().get('site_id')).toBe('s1');
		expect(JSON.parse(String(calls[0]?.body))).toEqual({
			site_id: 's1',
			type: 'url',
			event: 'deploy_failed',
			data: { url: 'https://example.com/hook', signature_secret: 'shh' },
		});
	});

	it('uploads a deploy file as raw bytes, keeping the slashes of its path', async () => {
		reply(200, { id: '/assets/app.js', sha: 'abc' });
		await endpointFor('deploys.uploadFile')(ctx(), {
			deploy_id: 'd1',
			path: 'assets/my app.js',
			file: { base64: Buffer.from('console.log(1)').toString('base64') },
		});
		expect(calls[0]?.method).toBe('PUT');
		expect(rawPath()).toBe('/api/v1/deploys/d1/files/assets/my%20app.js');
		expect(calls[0]?.headers['content-type']).toBe('application/octet-stream');
		const sent = calls[0]?.body as Blob;
		expect(sent).toBeInstanceOf(Blob);
		expect(await sent.text()).toBe('console.log(1)');
	});

	it('sends a header parameter under its wire name', async () => {
		reply(200, { id: 'f1', name: 'hello' });
		await endpointFor('deploys.uploadFunction')(ctx(), {
			deploy_id: 'd1',
			name: 'hello',
			runtime: 'js',
			retry_count: 2,
			file: { base64: 'UEsDBA==' },
		});
		expect(path()).toBe('/api/v1/deploys/d1/functions/hello');
		expect(query().get('runtime')).toBe('js');
		expect(calls[0]?.headers['x-nf-retry-count']).toBe('2');
	});

	it('starts a build from an uploaded zip as multipart', async () => {
		reply(200, { id: 'b1', deploy_id: 'd1' });
		await endpointFor('sites.builds.create')(ctx(), {
			site_id: 's1',
			clear_cache: true,
			zip: { base64: 'UEsDBA==', filename: 'site.zip' },
		});
		expect(path()).toBe('/api/v1/sites/s1/builds');
		expect(query().get('clear_cache')).toBe('true');
		expect(calls[0]?.body).toBeInstanceOf(FormData);
		expect((calls[0]?.body as FormData).get('zip')).toBeInstanceOf(Blob);
	});

	it('sends a zip deploy as the raw application/zip body', async () => {
		reply(200, { id: 'd1', state: 'uploaded' });
		await endpointFor('sites.deploys.create')(ctx(), {
			site_id: 's1',
			title: 'zip deploy',
			zip: { base64: 'UEsDBA==', filename: 'site.zip' },
		});
		expect(path()).toBe('/api/v1/sites/s1/deploys');
		expect(query().get('title')).toBe('zip deploy');
		expect(calls[0]?.headers['content-type']).toBe('application/zip');
		const sent = calls[0]?.body as Blob;
		expect(Buffer.from(await sent.arrayBuffer()).toString('base64')).toBe(
			'UEsDBA==',
		);
	});

	it('sends a metadata object as the whole body, and {} to clear it', async () => {
		reply(204, undefined);
		await endpointFor('sites.metadata.update')(ctx(), {
			site_id: 's1',
			metadata: { site_id: 'kept-as-a-key', owner: 'docs' },
		});
		expect(JSON.parse(String(calls[0]?.body))).toEqual({
			site_id: 'kept-as-a-key',
			owner: 'docs',
		});
		await expect(
			endpointFor('sites.metadata.update')(ctx(), { site_id: 's1' }),
		).rejects.toThrow(/metadata/);
	});

	it('renames an environment variable with new_key, else keeps key', async () => {
		reply(200, { key: 'NEW_NAME' });
		const base = { account_id: 'a1', key: 'OLD_NAME', values: [] };
		await endpointFor('env.update')(ctx(), { ...base, new_key: 'NEW_NAME' });
		expect(path()).toBe('/api/v1/accounts/a1/env/OLD_NAME');
		expect(JSON.parse(String(calls[0]?.body)).key).toBe('NEW_NAME');
		await endpointFor('env.update')(ctx(), base);
		expect(JSON.parse(String(calls[1]?.body)).key).toBe('OLD_NAME');
	});

	it('caps per_page at the 100 Netlify serves', () => {
		reply(200, []);
		return expect(
			endpointFor('sites.list')(ctx(), { per_page: 200 }),
		).rejects.toThrow(/per_page/);
	});

	it('refuses dot segments and empty ids before sending anything', async () => {
		reply(200, {});
		await expect(
			endpointFor('deploys.uploadFile')(ctx(), {
				deploy_id: 'd1',
				path: '../../sites/x',
				file: { base64: 'eA==' },
			}),
		).rejects.toThrow('Invalid Netlify path value');
		await expect(
			endpointFor('sites.get')(ctx(), { site_id: '' }),
		).rejects.toThrow(/Invalid input for netlify sites.get/);
		expect(calls).toHaveLength(0);
		expect(encodeNetlifyPathValue('a/b')).toBe('a%2Fb');
		expect(encodeNetlifyPathValue('/a/b c', true)).toBe('a/b%20c');
	});

	it('refuses unknown fields on a route without a body, naming none of them', async () => {
		reply(200, {});
		const error = await endpointFor('sites.get')(ctx(), {
			site_id: 's1',
			secret_thing: 'value',
		}).catch((e: unknown) => e as Error);
		expect(String(error)).toContain('1 unknown field (<key>)');
		expect(String(error)).toContain('this operation takes');
		expect(String(error)).not.toContain('secret_thing');
		expect(calls).toHaveLength(0);
	});
});

describe('responses', () => {
	it('pages a list, asking for 100 when per_page is left out', async () => {
		reply(
			200,
			Array.from({ length: 100 }, (_, i) => ({ id: `s${i}` })),
		);
		const page = (await endpointFor('sites.list')(ctx(), {
			filter: 'owner',
		})) as { items: unknown[]; next_page: number | null };
		expect(query().get('per_page')).toBe('100');
		expect(query().get('filter')).toBe('owner');
		expect(page.items).toHaveLength(100);
		expect(page.next_page).toBe(2);
	});

	it('stops at a short page', async () => {
		reply(200, [{ id: 'd1' }]);
		const page = (await endpointFor('sites.deploys.list')(ctx(), {
			site_id: 's1',
			page: 3,
			per_page: 10,
		})) as { next_page: number | null };
		expect(query().get('page')).toBe('3');
		expect(page.next_page).toBeNull();
		expect(nextPageOf({ page: 2, per_page: 5 }, 5, true)).toBe(3);
		expect(nextPageOf({}, 0, false)).toBeNull();
		expect(nextPageOf({}, 3, false)).toBe(2);
	});

	it('answers a bodiless 204 with success', async () => {
		reply(204, undefined);
		await expect(
			endpointFor('sites.delete')(ctx(), { site_id: 's1' }),
		).resolves.toEqual({ success: true });
		expect(calls[0]?.method).toBe('DELETE');
	});

	it('refuses a body that is not JSON where none was documented', async () => {
		reply(200, '<html>proxy</html>', 'text/html');
		await expect(
			endpointFor('hooks.delete')(ctx(), { hook_id: 'h1' }),
		).rejects.toThrow(/not JSON/);
	});

	it('refuses a 2xx without a JSON body, or with one of the wrong type', async () => {
		reply(200, '', 'application/json');
		await expect(
			endpointFor('sites.functions.list')(ctx(), { site_id: 's1' }),
		).rejects.toThrow(/sites.functions.list/);
		jest.restoreAllMocks();
		reply(200, '{not json', 'application/json');
		await expect(
			endpointFor('sites.functions.list')(ctx(), { site_id: 's1' }),
		).rejects.toThrow(/did not match its documented schema/);
	});

	it('reads a text route as text', async () => {
		reply(200, 'diff --git a/x b/x\n', 'text/plain');
		await expect(
			endpointFor('agentRunners.getDiff')(ctx(), { agent_runner_id: 'r1' }),
		).resolves.toEqual({ text: 'diff --git a/x b/x\n' });
	});

	it('refuses a response that breaks its documented types', async () => {
		reply(200, { id: 's1', name: 42 });
		await expect(
			endpointFor('sites.get')(ctx(), { site_id: 's1' }),
		).rejects.toThrow(/did not match its documented schema: name/);
	});
});

describe('errors', () => {
	it('keeps the status and Netlify’s message, without the values sent', async () => {
		reply(404, { code: 404, message: 'Site secret-site not found' });
		const error = (await endpointFor('sites.get')(ctx(), {
			site_id: 'secret-site',
		}).catch((e: unknown) => e)) as ApiError;
		expect(error).toBeInstanceOf(ApiError);
		expect(error.status).toBe(404);
		expect(error.message).toBe('Netlify 404: Site [REDACTED] not found');
		expect(error.url).toBe(`${BASE}/sites/{site_id}`);
		expect(JSON.stringify(error.request)).not.toContain('secret-site');
		expect(JSON.stringify(error)).not.toContain('nfp_test_token');
	});

	it('drops the sent body from a validation error', async () => {
		reply(422, {
			code: 422,
			message: 'Validation failed',
			errors: {
				context: ['is not valid for SECRET_VALUE'],
				value: ['SECRET_VALUE'],
			},
		});
		const error = (await endpointFor('env.setValue')(ctx(), {
			account_id: 'a1',
			key: 'API_TOKEN',
			value: 'SECRET_VALUE',
		}).catch((e: unknown) => e)) as ApiError;
		expect(error.status).toBe(422);
		expect(error.message).toBe(
			'Netlify 422: Validation failed; context is not valid for [REDACTED]',
		);
		expect(error.request.body).toBe('[REDACTED]');
		expect(JSON.stringify(error)).not.toContain('SECRET_VALUE');
	});

	it('scrubs a TLS private key sent in the query from the error body', async () => {
		reply(422, {
			code: 422,
			message: 'Invalid key -----BEGIN PRIVATE KEY-----MIIEsecret',
		});
		const error = (await endpointFor('sites.ssl.provision')(ctx(), {
			site_id: 's1',
			certificate: 'CERT',
			key: '-----BEGIN PRIVATE KEY-----MIIEsecret',
		}).catch((e: unknown) => e)) as ApiError;
		expect(error.status).toBe(422);
		expect(JSON.stringify(error)).not.toContain('MIIEsecret');
		expect(error.message).toContain('[REDACTED]');
	});

	it('keeps the 429 rate-limit fields core reads', async () => {
		const reset = Math.floor(Date.now() / 1000) + 1;
		jest.spyOn(globalThis, 'fetch').mockImplementation(
			async () =>
				new Response(JSON.stringify({ code: 429, message: 'Rate limited' }), {
					status: 429,
					headers: {
						'content-type': 'application/json',
						'x-ratelimit-reset': String(reset),
						'x-ratelimit-remaining': '0',
						'x-ratelimit-limit': '500',
					},
				}),
		);
		jest.spyOn(globalThis, 'setTimeout').mockImplementation(((
			fn: () => void,
		) => {
			fn();
			return 0;
		}) as unknown as typeof setTimeout);
		const error = (await endpointFor('sites.get')(ctx(), {
			site_id: 's1',
		}).catch((e: unknown) => e)) as ApiError;
		expect(error.status).toBe(429);
		expect(error.rateLimitLimit).toBe(500);
		expect(error.rateLimitRemaining).toBe(0);
	});

	it('writes messages from JSON and plain text bodies', () => {
		expect(netlifyErrorMessage(401, 'Unauthorized', 'Access Denied')).toBe(
			'Netlify 401: Access Denied',
		);
		expect(netlifyErrorMessage(502, 'Bad Gateway', '<html>nginx</html>')).toBe(
			'Netlify 502: Bad Gateway',
		);
		expect(netlifyErrorMessage(500, '', { code: 500, message: '' })).toBe(
			'Netlify 500: request failed',
		);
	});

	it('names the route, not the values, in the error URL', () => {
		expect(
			routeUrl(
				'https://api.netlify.com/api/v1/sites/abc/deploys?page=2',
				'/sites/{site_id}/deploys',
			),
		).toBe('https://api.netlify.com/api/v1/sites/{site_id}/deploys?[REDACTED]');
	});
});
