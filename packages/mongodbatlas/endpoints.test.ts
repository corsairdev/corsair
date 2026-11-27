import { createHash } from 'node:crypto';
import { ApiError } from 'corsair/http';
import {
	atlasRequestTarget,
	clearMongoDBAtlasAuthCache,
	digestAuthorization,
	mongodbatlasErrorMessage,
	parseAtlasKey,
	parseDigestChallenge,
} from './client';
import { mongodbatlasEndpointsNested } from './endpoints/catalog';
import type { MongoDBAtlasContext } from './index';

// Every call goes through the real client and core transport; only fetch is fake.

type Captured = {
	url: string;
	method: string;
	headers: Record<string, string>;
	// `unknown` because the sent body is a JSON string or URL-encoded text.
	body: unknown;
};

let calls: Captured[] = [];

type Reply = {
	status: number;
	body?: unknown;
	contentType?: string;
	headers?: Record<string, string>;
};

/** Answers each call with the next reply (the last one repeats). */
function replies(...list: Reply[]) {
	let n = 0;
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
		const r = list[Math.min(n++, list.length - 1)] as Reply;
		const payload =
			r.body === undefined
				? null
				: typeof r.body === 'string'
					? r.body
					: JSON.stringify(r.body);
		return new Response(payload, {
			status: r.status,
			headers: {
				...(r.body === undefined
					? {}
					: { 'content-type': r.contentType ?? 'application/json' }),
				...(r.headers ?? {}),
			},
		});
	});
}
const reply = (status: number, body?: unknown, contentType?: string) =>
	replies({ status, body, contentType });

const SA = 'mdb_sa_id_0123456789abcdef01234567:mdb_sa_sk_secretvalue';
const GROUP = '5f43e7f0a1b2c3d4e5f60718';

function ctx(key = 'atlas-access-token'): MongoDBAtlasContext {
	return {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key,
		options: {},
		keys: { get_api_key: () => Promise.resolve(key) },
		db: {},
		// `unknown` because a test context fills only the fields the endpoints read.
	} as unknown as MongoDBAtlasContext;
}

// `unknown` because the endpoint tree holds functions of many input types.
type AnyEndpoint = (
	ctx: MongoDBAtlasContext,
	input: unknown,
) => Promise<unknown>;

function endpointFor(id: string): AnyEndpoint {
	// `unknown` because the walk goes through nested groups of endpoints.
	let node: unknown = mongodbatlasEndpointsNested;
	for (const part of id.split('.')) {
		node = (node as Record<string, unknown>)[part];
	}
	if (typeof node !== 'function') throw new Error(`no endpoint ${id}`);
	return node as AnyEndpoint;
}

const url = (n = 0) => new URL(calls[n]?.url ?? '');

beforeEach(() => {
	calls = [];
	clearMongoDBAtlasAuthCache();
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('credentials', () => {
	it('tells service accounts, API keys and tokens apart', () => {
		expect(parseAtlasKey(SA)).toMatchObject({ kind: 'serviceAccount' });
		expect(
			parseAtlasKey('{"clientId":"mdb_sa_id_x","clientSecret":"s"}'),
		).toMatchObject({ kind: 'serviceAccount', clientId: 'mdb_sa_id_x' });
		expect(parseAtlasKey('abcdefgh:3f2b8c1e-5c1e-4d8a')).toMatchObject({
			kind: 'apiKey',
			publicKey: 'abcdefgh',
		});
		expect(parseAtlasKey('eyJ.token')).toEqual({
			kind: 'token',
			token: 'eyJ.token',
		});
		expect(() => parseAtlasKey('{"clientId":1}')).toThrow(
			/clientId and clientSecret/,
		);
	});

	it('trades a service account for a token once, then reuses it', async () => {
		replies(
			{ status: 200, body: { access_token: 'atlas-token', expires_in: 3600 } },
			{ status: 200, body: { results: [], totalCount: 0 } },
		);
		await endpointFor('clusters.listClusters')(ctx(SA), { groupId: GROUP });
		await endpointFor('clusters.listClusters')(ctx(SA), { groupId: GROUP });
		expect(calls.map((c) => url(calls.indexOf(c)).pathname)).toEqual([
			'/api/oauth/token',
			`/api/atlas/v2/groups/${GROUP}/clusters`,
			`/api/atlas/v2/groups/${GROUP}/clusters`,
		]);
		expect(calls[0]?.headers.authorization).toBe(
			`Basic ${Buffer.from(SA).toString('base64')}`,
		);
		expect(String(calls[0]?.body)).toBe('grant_type=client_credentials');
		expect(calls[1]?.headers.authorization).toBe('Bearer atlas-token');
	});

	it('asks to connect when Atlas refuses the service account', async () => {
		reply(401, { error: 'invalid_client' });
		await expect(
			endpointFor('clusters.listClusters')(ctx(SA), { groupId: GROUP }),
		).rejects.toMatchObject({ name: 'AuthMissingError' });
	});

	it('answers an API key with HTTP Digest (RFC 7616 MD5)', async () => {
		replies(
			{
				status: 401,
				headers: {
					'www-authenticate':
						'Digest realm="MMS Public API", domain="", nonce="abc123", algorithm=MD5, qop="auth", stale=false',
				},
			},
			{ status: 200, body: { results: [] } },
		);
		await endpointFor('clusters.listClusters')(ctx('pubkey01:priv-key'), {
			groupId: GROUP,
		});
		expect(calls).toHaveLength(2);
		const header = calls[1]?.headers.authorization ?? '';
		const field = (name: string) =>
			header.match(new RegExp(`${name}="?([^",]+)"?`))?.[1] ?? '';
		expect(field('username')).toBe('pubkey01');
		expect(field('nc')).toBe('00000001');
		const uri = field('uri');
		expect(uri).toBe(`/api/atlas/v2/groups/${GROUP}/clusters?itemsPerPage=100`);
		const md5 = (s: string) => createHash('md5').update(s).digest('hex');
		const expected = md5(
			`${md5('pubkey01:MMS Public API:priv-key')}:abc123:00000001:${field('cnonce')}:auth:${md5(`GET:${uri}`)}`,
		);
		expect(field('response')).toBe(expected);
		expect(calls[1]?.url).toBe(`https://cloud.mongodb.com${uri}`);
	});

	it('parses a Digest challenge and refuses anything else', () => {
		expect(
			parseDigestChallenge('Digest realm="r", nonce="n", qop="auth,auth-int"'),
		).toMatchObject({ realm: 'r', nonce: 'n', qop: 'auth' });
		expect(parseDigestChallenge('Bearer realm="x"')).toBeUndefined();
		const challenge = { realm: 'r', nonce: 'n', count: 0 };
		expect(
			digestAuthorization(challenge, 'u', 'p', 'GET', '/x', 'c'),
		).toContain('uri="/x"');
	});
});

describe('requests', () => {
	it('pins the versioned media type and pages with itemsPerPage', async () => {
		reply(200, { results: [{ name: 'Cluster0' }], totalCount: 1 });
		const page = (await endpointFor('clusters.listClusters')(ctx(), {
			groupId: GROUP,
			pageNum: 2,
		})) as { results: unknown[] };
		expect(calls[0]?.headers.accept).toBe(
			'application/vnd.atlas.2024-08-05+json',
		);
		expect(calls[0]?.headers.authorization).toBe('Bearer atlas-access-token');
		expect(url().searchParams.get('pageNum')).toBe('2');
		expect(url().searchParams.get('itemsPerPage')).toBe('100');
		expect(page.results).toHaveLength(1);
	});

	it('sends a body in the same version, and a path value also named in the body to both', async () => {
		reply(201, { username: 'app-user' });
		await endpointFor('databaseUsers.createDatabaseUser')(ctx(), {
			groupId: GROUP,
			databaseName: 'admin',
			username: 'app-user',
			password: 'correct-horse',
			roles: [{ databaseName: 'admin', roleName: 'readAnyDatabase' }],
		});
		expect(calls[0]?.method).toBe('POST');
		expect(calls[0]?.headers['content-type']).toBe(
			'application/vnd.atlas.2023-01-01+json',
		);
		expect(JSON.parse(String(calls[0]?.body))).toMatchObject({
			groupId: GROUP,
			username: 'app-user',
			databaseName: 'admin',
		});
	});

	it('sends a list body whole', async () => {
		reply(201, { results: [] });
		await endpointFor('projectIpAccessList.createAccessListEntry')(ctx(), {
			groupId: GROUP,
			body: [{ cidrBlock: '203.0.113.0/24', comment: 'Office' }],
		});
		expect(JSON.parse(String(calls[0]?.body))).toEqual([
			{ cidrBlock: '203.0.113.0/24', comment: 'Office' },
		]);
	});

	it('answers a bodiless delete with success and returns a log as a file', async () => {
		reply(202, undefined);
		await expect(
			endpointFor('clusters.deleteCluster')(ctx(), {
				groupId: GROUP,
				clusterName: 'Cluster0',
			}),
		).resolves.toEqual({ success: true });
		jest.restoreAllMocks();
		calls = [];
		reply(200, 'gz-bytes', 'application/vnd.atlas.2023-02-01+gzip');
		const file = (await endpointFor('monitoringAndLogs.downloadClusterLog')(
			ctx(),
			{ groupId: GROUP, hostName: 'host-0.mongodb.net', logName: 'mongodb' },
		)) as { filename: string; byteLength: number };
		expect(calls[0]?.headers.accept).toBe(
			'application/vnd.atlas.2023-02-01+gzip',
		);
		expect(url().pathname).toBe(
			`/api/atlas/v2/groups/${GROUP}/clusters/host-0.mongodb.net/logs/mongodb.gz`,
		);
		expect(file.byteLength).toBe(8);
		expect(file.filename).toContain('host-0.mongodb.net');
	});

	it('refuses a bad id and unknown fields before sending', async () => {
		reply(200, {});
		await expect(
			endpointFor('clusters.getCluster')(ctx(), {
				groupId: 'not-hex',
				clusterName: 'Cluster0',
			}),
		).rejects.toThrow(/Invalid input for mongodbatlas clusters.getCluster/);
		await expect(
			endpointFor('clusters.getCluster')(ctx(), {
				groupId: GROUP,
				clusterName: '..',
			}),
		).rejects.toThrow();
		expect(calls).toHaveLength(0);
		expect(
			atlasRequestTarget({
				method: 'GET',
				path: '/api/atlas/v2/groups/{groupId}',
				pathParameters: { groupId: 'g' },
				query: { a: [1, 2], b: true, c: undefined },
			}),
		).toBe('/api/atlas/v2/groups/g?a=1&a=2&b=true');
	});
});

describe('errors', () => {
	it('keeps the status and Atlas errorCode, dropping echoed parameters', async () => {
		reply(404, {
			error: 404,
			errorCode: 'CLUSTER_NOT_FOUND',
			detail: 'No cluster named secret-cluster exists in group.',
			reason: 'Not Found',
			parameters: ['secret-cluster', GROUP],
		});
		const error = (await endpointFor('clusters.getCluster')(ctx(), {
			groupId: GROUP,
			clusterName: 'secret-cluster',
		}).catch((e: unknown) => e)) as ApiError;
		expect(error).toBeInstanceOf(ApiError);
		expect(error.status).toBe(404);
		expect(error.message).toBe(
			'MongoDB Atlas 404: CLUSTER_NOT_FOUND; No cluster named [REDACTED] exists in group.',
		);
		expect(error.url).toBe(
			'https://cloud.mongodb.com/api/atlas/v2/groups/{groupId}/clusters/{clusterName}',
		);
		expect(JSON.stringify(error)).not.toContain('secret-cluster');
		expect(JSON.stringify(error)).not.toContain('atlas-access-token');
	});

	it('writes messages from JSON and plain bodies', () => {
		expect(
			mongodbatlasErrorMessage(400, 'Bad Request', {
				errorCode: 'INVALID_ATTRIBUTE',
				detail: 'Invalid attribute name specified.',
			}),
		).toBe(
			'MongoDBAtlas 400: INVALID_ATTRIBUTE; Invalid attribute name specified.',
		);
		expect(mongodbatlasErrorMessage(502, 'Bad Gateway', '<html>x</html>')).toBe(
			'MongoDBAtlas 502: Bad Gateway',
		);
	});
});
