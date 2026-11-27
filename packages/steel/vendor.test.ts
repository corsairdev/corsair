import {
	steelEndpointsNested as api,
	steelEndpointMeta,
} from './endpoints/catalog';
import { encodeSlashPath } from './endpoints/operations';
import type { SteelContext } from './index';

// Routes and shapes written by hand from Steel's API reference and the live
// run (11-27), not read from the manifest.

type Captured = {
	url: URL;
	method: string;
	headers: Record<string, string>;
	// `unknown` because the sent body is a JSON string or a FormData.
	body: unknown;
};
let calls: Captured[] = [];

function reply(
	// `unknown` because each case answers its own body.
	body: unknown,
	status = 200,
	contentType = 'application/json',
) {
	jest.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
		const headers: Record<string, string> = {};
		new Headers(init?.headers).forEach((value, key) => {
			headers[key] = value;
		});
		calls.push({
			url: new URL(String(input)),
			method: init?.method ?? 'GET',
			headers,
			body: init?.body,
		});
		const payload =
			body instanceof Uint8Array
				? body
				: body === undefined
					? null
					: typeof body === 'string'
						? body
						: JSON.stringify(body);
		return new Response(payload, {
			status,
			headers: body === undefined ? {} : { 'content-type': contentType },
		});
	});
}

const ctx = {
	endpoints: {},
	$getAccountId: () => Promise.resolve('test-account'),
	key: 'ste-test-key',
	options: {},
	keys: {},
	db: {},
	// `unknown` because a test context fills only the fields the endpoints read.
} as unknown as SteelContext;

const SESSION = '785f9f18-b814-4160-9934-e3ced40c7e0e';
beforeEach(() => {
	calls = [];
});
afterEach(() => jest.restoreAllMocks());

describe('steel routes', () => {
	it('starts a session with the steel-api-key header', async () => {
		reply({
			id: SESSION,
			status: 'live',
			websocketUrl: 'wss://connect.steel.dev',
		});
		const out = await api.sessions.create(ctx, { timeout: 60000 });
		expect(out).toMatchObject({ id: SESSION, status: 'live' });
		expect(calls[0]?.method).toBe('POST');
		expect(calls[0]?.url.href).toBe('https://api.steel.dev/v1/sessions');
		expect(calls[0]?.headers['steel-api-key']).toBe('ste-test-key');
		expect(calls[0]?.headers.authorization).toBeUndefined();
		expect(JSON.parse(String(calls[0]?.body))).toEqual({ timeout: 60000 });
	});

	it('releases a session', async () => {
		reply({ id: SESSION, status: 'released' });
		await api.sessions.release(ctx, { id: SESSION });
		expect(calls[0]?.method).toBe('POST');
		expect(calls[0]?.url.pathname).toBe(`/v1/sessions/${SESSION}/release`);
	});

	it('keeps the slashes of a file path and encodes each segment', async () => {
		reply(new Uint8Array([104, 105]), 200, 'application/octet-stream');
		const out = await api.files.download(ctx, { path: 'run 1/notes.txt' });
		expect(calls[0]?.url.pathname).toBe('/v1/files/run%201/notes.txt');
		expect(out).toMatchObject({ filename: 'steel-files-download' });
	});

	it('refuses a file path that climbs out of its folder', async () => {
		reply({});
		await expect(
			api.sessions.files.delete(ctx, {
				sessionId: SESSION,
				path: 'uploads/../../v1/api-keys',
			}),
		).rejects.toThrow('Invalid Steel file path');
		expect(calls).toHaveLength(0);
		expect(() => encodeSlashPath('a//b')).toThrow();
		expect(encodeSlashPath('/a b/c#d')).toBe('a%20b/c%23d');
	});

	it('answers success for a file delete with no body', async () => {
		reply(undefined, 204);
		await expect(
			api.files.delete(ctx, { path: 'run/notes.txt' }),
		).resolves.toEqual({ success: true });
		expect(calls[0]?.method).toBe('DELETE');
	});

	it('uploads a project file as multipart with its path', async () => {
		reply({ path: 'run/notes.txt', size: 2 });
		await api.files.upload(ctx, {
			file: {
				base64: 'aGk=',
				filename: 'notes.txt',
				contentType: 'text/plain',
			},
			path: 'run/notes.txt',
		});
		const form = calls[0]?.body as FormData;
		expect(form).toBeInstanceOf(FormData);
		expect(form.get('path')).toBe('run/notes.txt');
		expect((form.get('file') as File).name).toBe('notes.txt');
	});

	it('sends commands and an Idempotency-Key header', async () => {
		reply({ effect: 'applied', id: 'x-1' });
		await api.sessions.commands.run(ctx, {
			sessionId: SESSION,
			idempotency_key: 'retry-1',
			commands: [{ command: 'navigate', url: 'https://example.com' }],
		});
		expect(calls[0]?.url.pathname).toBe(`/v1/sessions/${SESSION}/commands`);
		expect(calls[0]?.headers['idempotency-key']).toBe('retry-1');
		expect(JSON.parse(String(calls[0]?.body))).toEqual({
			commands: [{ command: 'navigate', url: 'https://example.com' }],
		});
	});

	it('moves a profile with targetProjectId in the form and projectId in the query', async () => {
		reply({ id: 'p1' });
		await api.profiles.update(ctx, {
			id: 'p1',
			projectId: '3f0e6a2c-8b1d-4c7e-9a52-1d2e3f4a5b6c',
			targetProjectId: 'e3b5694c-3dd9-4f31-b816-c869fc68dd6e',
			userDataDir: {
				base64: 'UEsFBgAAAAAAAAAAAAAAAAAAAAAAAA==',
				filename: 'profile.zip',
				contentType: 'application/zip',
			},
		} as never);
		expect(calls[0]?.url.searchParams.get('projectId')).toBe(
			'3f0e6a2c-8b1d-4c7e-9a52-1d2e3f4a5b6c',
		);
		expect((calls[0]?.body as FormData).get('projectId')).toBe(
			'e3b5694c-3dd9-4f31-b816-c869fc68dd6e',
		);
	});

	it('reads Steel error messages', async () => {
		reply({ message: 'This session has no recording.' }, 404);
		await expect(
			api.sessions.hlsPlaylist(ctx, { id: SESSION }),
		).rejects.toThrow('Steel 404: This session has no recording.');
	});
});

describe('risk levels', () => {
	it.each([
		'sessions.create',
		'sessions.release',
		'sessions.releaseAll',
		'sessions.captchas.solve',
		'apiKeys.create',
		'files.delete',
	] as const)('%s is destructive', (id) => {
		expect(steelEndpointMeta[id].riskLevel).toBe('destructive');
	});

	it.each(['tools.scrape', 'tools.screenshot', 'tools.pdf'] as const)(
		'%s, a metered read, is read',
		(id) => {
			expect(steelEndpointMeta[id].riskLevel).toBe('read');
		},
	);
});
