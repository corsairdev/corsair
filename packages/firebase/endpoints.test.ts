import { createVerify, generateKeyPairSync } from 'node:crypto';
import { ApiError } from 'corsair/http';
import {
	clearFirebaseTokenCache,
	encodeFirebasePathValue,
	firebaseErrorMessage,
	parseFirebaseKey,
	realtimeDatabaseUrl,
	serviceAccountAssertion,
} from './client';
import { firebaseEndpointsNested } from './endpoints/catalog';
import type { FirebaseContext } from './index';

// Every call goes through the real client and core transport; only fetch is fake.

type Captured = {
	url: string;
	method: string;
	headers: Record<string, string>;
	// `unknown` because the sent body is a JSON string, a Blob or URL-encoded text.
	body: unknown;
};

let calls: Captured[] = [];

/** Answers each call with the next reply (the last one repeats). */
function replies(
	...list: Array<{ status: number; body?: unknown; contentType?: string }>
) {
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
		const r = list[Math.min(n++, list.length - 1)] as {
			status: number;
			body?: unknown;
			contentType?: string;
		};
		const payload =
			r.body === undefined
				? null
				: typeof r.body === 'string'
					? r.body
					: JSON.stringify(r.body);
		return new Response(payload, {
			status: r.status,
			headers:
				r.body === undefined
					? {}
					: { 'content-type': r.contentType ?? 'application/json' },
		});
	});
}
const reply = (status: number, body?: unknown, contentType?: string) =>
	replies({ status, body, contentType });

const { privateKey, publicKey } = generateKeyPairSync('rsa', {
	modulusLength: 2048,
	privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
	publicKeyEncoding: { type: 'spki', format: 'pem' },
});
const SERVICE_ACCOUNT = JSON.stringify({
	type: 'service_account',
	project_id: 'demo-project',
	client_email: 'corsair@demo-project.iam.gserviceaccount.com',
	private_key: privateKey,
});

function ctx(
	key = 'ya29.test-token',
	emulatorUrls?: Record<string, string>,
): FirebaseContext {
	return {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key,
		options: emulatorUrls ? { emulatorUrls } : {},
		keys: { get_api_key: () => Promise.resolve(key) },
		db: {},
		// `unknown` because a test context fills only the fields the endpoints read.
	} as unknown as FirebaseContext;
}

// `unknown` because the endpoint tree holds functions of many input types.
type AnyEndpoint = (ctx: FirebaseContext, input: unknown) => Promise<unknown>;

function endpointFor(id: string): AnyEndpoint {
	// `unknown` because the walk goes through nested groups of endpoints.
	let node: unknown = firebaseEndpointsNested;
	for (const part of id.split('.')) {
		node = (node as Record<string, unknown>)[part];
	}
	if (typeof node !== 'function') throw new Error(`no endpoint ${id}`);
	return node as AnyEndpoint;
}

const url = (n = 0) => new URL(calls[n]?.url ?? '');
const DOCS = 'projects/demo-project/databases/(default)/documents';

beforeEach(() => {
	calls = [];
	clearFirebaseTokenCache();
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('auth', () => {
	it('signs an RS256 JWT for the service account', () => {
		const parsed = parseFirebaseKey(SERVICE_ACCOUNT);
		if (parsed.kind !== 'serviceAccount') throw new Error('not parsed');
		const jwt = serviceAccountAssertion(parsed.account, 1_800_000_000);
		const [head, claims, signature] = jwt.split('.') as [
			string,
			string,
			string,
		];
		expect(JSON.parse(Buffer.from(head, 'base64url').toString())).toEqual({
			alg: 'RS256',
			typ: 'JWT',
		});
		const body = JSON.parse(Buffer.from(claims, 'base64url').toString());
		expect(body).toMatchObject({
			iss: 'corsair@demo-project.iam.gserviceaccount.com',
			aud: 'https://oauth2.googleapis.com/token',
			iat: 1_800_000_000,
			exp: 1_800_003_600,
		});
		expect(body.scope).toContain(
			'https://www.googleapis.com/auth/cloud-platform',
		);
		const verify = createVerify('RSA-SHA256');
		verify.update(`${head}.${claims}`);
		expect(verify.verify(publicKey, Buffer.from(signature, 'base64url'))).toBe(
			true,
		);
	});

	it('trades the JWT for a token once, then reuses it', async () => {
		replies(
			{ status: 200, body: { access_token: 'ya29.minted', expires_in: 3600 } },
			{ status: 200, body: { projectId: 'demo-project' } },
		);
		await endpointFor('management.projects.get')(ctx(SERVICE_ACCOUNT), {
			name: 'projects/demo-project',
		});
		await endpointFor('management.projects.get')(ctx(SERVICE_ACCOUNT), {
			name: 'projects/demo-project',
		});
		expect(calls.map((c) => new URL(c.url).host)).toEqual([
			'oauth2.googleapis.com',
			'firebase.googleapis.com',
			'firebase.googleapis.com',
		]);
		const form = new URLSearchParams(String(calls[0]?.body));
		expect(form.get('grant_type')).toBe(
			'urn:ietf:params:oauth:grant-type:jwt-bearer',
		);
		expect(calls[1]?.headers.authorization).toBe('Bearer ya29.minted');
		expect(url(1).pathname).toBe('/v1beta1/projects/demo-project');
	});

	it('asks to connect when Google refuses the service account', async () => {
		reply(400, {
			error: 'invalid_grant',
			error_description: 'Invalid JWT Signature.',
		});
		await expect(
			endpointFor('management.projects.get')(ctx(SERVICE_ACCOUNT), {
				name: 'projects/demo-project',
			}),
		).rejects.toMatchObject({ name: 'AuthMissingError' });
	});

	it('refuses a JSON key without client_email or private_key', () => {
		expect(() => parseFirebaseKey('{"type":"service_account"}')).toThrow(
			/client_email and private_key/,
		);
		expect(parseFirebaseKey('ya29.x')).toEqual({
			kind: 'token',
			token: 'ya29.x',
		});
	});
});

describe('requests', () => {
	it('keeps the slashes of a full resource name, segment by segment', async () => {
		reply(200, { name: `${DOCS}/users/ada`, fields: {} });
		await endpointFor('firestore.databases.documents.get')(ctx(), {
			name: `${DOCS}/users/ada lovelace`,
			'mask.fieldPaths': ['name', 'born'],
		});
		expect(url().origin).toBe('https://firestore.googleapis.com');
		expect(url().pathname).toBe(
			'/v1/projects/demo-project/databases/(default)/documents/users/ada%20lovelace',
		);
		expect(url().searchParams.getAll('mask.fieldPaths')).toEqual([
			'name',
			'born',
		]);
		expect(calls[0]?.headers.authorization).toBe('Bearer ya29.test-token');
		await expect(
			endpointFor('firestore.databases.documents.get')(ctx(), {
				name: `${DOCS}/../../other`,
			}),
		).rejects.toThrow('Invalid Firebase path value');
	});

	it('sends the body fields as JSON and reads a streamed query as a list', async () => {
		reply(200, [
			{ document: { name: `${DOCS}/users/ada` }, readTime: 't' },
			{ readTime: 't' },
		]);
		const out = await endpointFor('firestore.databases.documents.runQuery')(
			ctx(),
			{
				parent: DOCS,
				structuredQuery: { from: [{ collectionId: 'users' }], limit: 5 },
			},
		);
		expect(calls[0]?.method).toBe('POST');
		expect(url().pathname).toBe(
			'/v1/projects/demo-project/databases/(default)/documents:runQuery',
		);
		expect(JSON.parse(String(calls[0]?.body))).toEqual({
			structuredQuery: { from: [{ collectionId: 'users' }], limit: 5 },
		});
		expect(out).toHaveLength(2);
	});

	it('sends a Remote Config publish with If-Match', async () => {
		reply(200, { parameters: {} });
		await endpointFor('remoteConfig.projects.updateRemoteConfig')(ctx(), {
			project: 'projects/demo-project',
			ifMatch: '*',
			parameters: { welcome: { defaultValue: { value: 'hi' } } },
		});
		expect(calls[0]?.method).toBe('PUT');
		expect(calls[0]?.headers['if-match']).toBe('*');
		expect(JSON.parse(String(calls[0]?.body))).toEqual({
			parameters: { welcome: { defaultValue: { value: 'hi' } } },
		});
	});

	it('uploads an object to the upload path, and downloads it as a file', async () => {
		reply(200, { name: 'a/b.txt', bucket: 'demo-project.appspot.com' });
		await endpointFor('storage.objects.insert')(ctx(), {
			bucket: 'demo-project.appspot.com',
			name: 'a/b.txt',
			file: {
				base64: Buffer.from('hi').toString('base64'),
				contentType: 'text/plain',
			},
		});
		expect(url().origin + url().pathname).toBe(
			'https://storage.googleapis.com/upload/storage/v1/b/demo-project.appspot.com/o',
		);
		expect(url().searchParams.get('uploadType')).toBe('media');
		expect(url().searchParams.get('name')).toBe('a/b.txt');
		expect(await (calls[0]?.body as Blob).text()).toBe('hi');
		jest.restoreAllMocks();
		calls = [];
		reply(200, 'hi', 'text/plain');
		const file = (await endpointFor('storage.objects.download')(ctx(), {
			bucket: 'demo-project.appspot.com',
			object: 'a/b.txt',
		})) as { filename: string; byteLength: number };
		expect(url().pathname).toBe(
			'/storage/v1/b/demo-project.appspot.com/o/a%2Fb.txt',
		);
		expect(url().searchParams.get('alt')).toBe('media');
		expect(file).toMatchObject({ filename: 'b.txt', byteLength: 2 });
	});

	it('answers an Empty response with success', async () => {
		reply(200, {});
		await expect(
			endpointFor('firestore.databases.documents.delete')(ctx(), {
				name: `${DOCS}/users/ada`,
			}),
		).resolves.toEqual({ success: true });
		expect(calls[0]?.method).toBe('DELETE');
	});

	it('points a group at an emulator with Bearer owner', async () => {
		reply(200, { localId: 'u1' });
		await endpointFor('auth.projects.accounts.create')(
			ctx('', {
				auth: 'http://127.0.0.1:9099/identitytoolkit.googleapis.com/',
			}),
			{ targetProjectId: 'demo-project', email: 'ada@example.com' },
		);
		expect(calls[0]?.url).toBe(
			'http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/projects/demo-project/accounts',
		);
		expect(calls[0]?.headers.authorization).toBe('Bearer owner');
	});
});

describe('realtime database', () => {
	it('writes JSON at a path of the database URL', async () => {
		reply(200, { name: 'Ada' });
		await endpointFor('database.set')(ctx(), {
			databaseUrl: 'https://demo-project-default-rtdb.firebaseio.com',
			path: 'users/ada',
			data: { name: 'Ada' },
		});
		expect(calls[0]?.method).toBe('PUT');
		expect(calls[0]?.url).toBe(
			'https://demo-project-default-rtdb.firebaseio.com/users/ada.json',
		);
		expect(JSON.parse(String(calls[0]?.body))).toEqual({ name: 'Ada' });
	});

	it('JSON-encodes query filters and reads the root', async () => {
		reply(200, { ada: true });
		await endpointFor('database.get')(ctx(), {
			databaseUrl: 'https://demo.europe-west1.firebasedatabase.app',
			orderBy: '$key',
			startAt: 'a',
			limitToFirst: 2,
		});
		expect(url().pathname).toBe('/.json');
		expect(url().searchParams.get('orderBy')).toBe('"$key"');
		expect(url().searchParams.get('startAt')).toBe('"a"');
		expect(url().searchParams.get('limitToFirst')).toBe('2');
	});

	it('writes null (a delete by value) and reads null back', async () => {
		reply(200, null);
		await expect(
			endpointFor('database.set')(ctx(), {
				databaseUrl: 'https://demo.firebaseio.com',
				path: 'x',
				data: null,
			}),
		).resolves.toBeNull();
		expect(String(calls[0]?.body)).toBe('null');
	});

	it('never sends the token to another host', async () => {
		reply(200, {});
		for (const bad of [
			'http://demo.firebaseio.com',
			'https://evil.example.com',
			'https://firebaseio.com.evil.example',
		]) {
			await expect(
				endpointFor('database.get')(ctx(), { databaseUrl: bad }),
			).rejects.toThrow(/databaseUrl/);
		}
		expect(calls).toHaveLength(0);
		expect(realtimeDatabaseUrl('https://x.firebaseio.com/').host).toBe(
			'x.firebaseio.com',
		);
	});

	it('uses ?ns= on the emulator', async () => {
		reply(200, {});
		await endpointFor('database.get')(
			ctx('', { database: 'http://127.0.0.1:9000' }),
			{
				databaseUrl: 'https://demo-default-rtdb.firebaseio.com',
				path: 'a',
			},
		);
		expect(calls[0]?.url).toBe(
			'http://127.0.0.1:9000/a.json?ns=demo-default-rtdb',
		);
	});
});

describe('errors', () => {
	it("keeps the status and Google's message, without the values sent", async () => {
		reply(404, {
			error: {
				code: 404,
				message: `No document to update: ${DOCS}/users/secret-person`,
				status: 'NOT_FOUND',
			},
		});
		const error = (await endpointFor('firestore.databases.documents.get')(
			ctx(),
			{ name: `${DOCS}/users/secret-person` },
		).catch((e: unknown) => e)) as ApiError;
		expect(error).toBeInstanceOf(ApiError);
		expect(error.status).toBe(404);
		expect(error.message).toContain('Firebase 404: No document to update:');
		expect(error.url).toBe('https://firestore.googleapis.com/v1/{name}');
		expect(JSON.stringify(error)).not.toContain('secret-person');
		expect(JSON.stringify(error)).not.toContain('ya29.test-token');
	});

	it('writes messages from Google, Realtime Database and plain bodies', () => {
		expect(
			firebaseErrorMessage(400, 'Bad Request', {
				error: { code: 400, message: 'EMAIL_EXISTS' },
			}),
		).toBe('Firebase 400: EMAIL_EXISTS');
		expect(
			firebaseErrorMessage(401, 'Unauthorized', { error: 'Permission denied' }),
		).toBe('Firebase 401: Permission denied');
		expect(firebaseErrorMessage(502, 'Bad Gateway', '<html>x</html>')).toBe(
			'Firebase 502: Bad Gateway',
		);
	});

	it('encodes path values and refuses dot segments', () => {
		expect(encodeFirebasePathValue('projects/p/apps/1:2:web:3', true)).toBe(
			'projects/p/apps/1:2:web:3',
		);
		expect(encodeFirebasePathValue('a/b')).toBe('a%2Fb');
		expect(() => encodeFirebasePathValue('a/../b', true)).toThrow();
	});
});
