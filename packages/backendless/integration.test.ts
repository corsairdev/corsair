import { request } from 'corsair/http';
import { BackendlessClient, redactSecrets, safeBaseUrl } from './client';
import {
	Counters,
	Data,
	Files,
	Hive,
	Messaging,
	Permissions,
	Users,
} from './endpoints';
import { errorHandlers } from './error-handlers';
import {
	backendless,
	backendlessEndpointMeta,
	backendlessEndpointSchemas,
	backendlessEndpoints,
} from './index';
import { BackendlessFile, BackendlessUser } from './schema';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(async () => ({ ok: true })),
	};
});

const mockRequest = request as jest.Mock;

function ctx(extra: Record<string, unknown> = {}) {
	return {
		key: 'rest-api-key',
		pluginId: 'backendless',
		authType: 'api_key' as const,
		options: {
			applicationId: 'application-id',
			restApiKey: 'rest-api-key',
			baseUrl: 'https://demo.backendless.app',
			userToken: 'user-token',
			...extra,
		},
		schema: {},
	} as any;
}

function lastCall() {
	return mockRequest.mock.calls.at(-1)?.[1] as {
		method: string;
		url: string;
		path?: Record<string, string | number>;
		body?: unknown;
		query?: Record<string, unknown>;
		headers?: Record<string, string>;
	};
}

describe('Backendless plugin', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue({ ok: true });
	});

	it('registers files, data, hive, counters, users, permissions, and messaging', () => {
		expect(Object.keys(backendlessEndpoints).sort()).toEqual([
			'counters',
			'data',
			'files',
			'hive',
			'messaging',
			'permissions',
			'users',
		]);
		expect(backendless().errorHandlers).toBeDefined();
		expect(Object.keys(backendlessEndpointSchemas)).toHaveLength(
			Object.keys(backendlessEndpointMeta).length,
		);
	});

	it('encodes path segments and uses the shared request helper', async () => {
		const client = new BackendlessClient({
			baseUrl: 'https://demo.backendless.app',
			applicationId: 'application-id',
			restApiKey: 'rest-api-key',
			userToken: 'user-token',
		});
		await client.call('GET', 'data.table', {
			path: { tableName: client.segment('Users & Roles') },
			userScoped: true,
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://demo.backendless.app' }),
			expect.objectContaining({
				method: 'GET',
				url: '/api/data/{tableName}',
				path: { tableName: 'Users%20%26%20Roles' },
				headers: { 'user-token': 'user-token' },
			}),
		);
	});

	it('uses native cluster URLs without an /api prefix', async () => {
		const client = new BackendlessClient({
			baseUrl: 'https://api.backendless.com',
			applicationId: 'app-id',
			restApiKey: 'rest-key',
		});
		await client.call('GET', 'counters.get', { path: { counterName: 'n' } });
		expect(lastCall().url).toBe(
			'/{applicationId}/{restApiKey}/counters/{counterName}',
		);
		expect(lastCall().path).toEqual({
			applicationId: 'app-id',
			restApiKey: 'rest-key',
			counterName: 'n',
		});
	});

	it('rejects invalid and non-HTTPS base URLs', () => {
		expect(() => safeBaseUrl('not a url')).toThrow(
			'Backendless base URL is not a valid URL',
		);
		expect(
			() =>
				new BackendlessClient({
					baseUrl: 'http://demo.backendless.app',
					applicationId: 'app',
					restApiKey: 'key',
				}),
		).toThrow('Backendless base URL must use HTTPS');
	});

	it('redacts password, token, and key fields recursively', () => {
		const redacted = redactSecrets({
			password: 'secret',
			nested: { userToken: 'token' },
			restApiKey: 'key',
		}) as Record<string, unknown>;
		expect(redacted.password).toBe('[REDACTED]');
		expect(redacted.restApiKey).toBe('[REDACTED]');
		expect((redacted.nested as Record<string, unknown>).userToken).toBe(
			'[REDACTED]',
		);
	});

	it('marks destructive and security-sensitive operations as destructive', () => {
		expect(backendlessEndpointMeta['files.delete'].riskLevel).toBe(
			'destructive',
		);
		expect(backendlessEndpointMeta['users.delete'].irreversible).toBe(true);
		expect(backendlessEndpointMeta['permissions.grant'].riskLevel).toBe(
			'destructive',
		);
	});
});

describe('Backendless endpoint handlers', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue({ ok: true });
	});

	it('lists and counts the file-storage root', async () => {
		mockRequest.mockResolvedValueOnce([]);
		await Files.list(ctx(), {});
		expect(lastCall()).toEqual(
			expect.objectContaining({ method: 'GET', url: '/api/files' }),
		);
		mockRequest.mockResolvedValueOnce(3);
		await Files.count(ctx(), { recursive: true, directoryCount: true });
		expect(lastCall()).toEqual(
			expect.objectContaining({
				method: 'GET',
				url: '/api/files',
				query: expect.objectContaining({
					action: 'count',
					sub: true,
					countDirectories: true,
				}),
			}),
		);
	});

	it('copies, moves, and deletes files with official paths', async () => {
		mockRequest.mockResolvedValue('/files/b');
		await Files.copy(ctx(), { sourcePath: '/a', targetPath: '/b' });
		expect(lastCall()).toEqual(
			expect.objectContaining({
				method: 'PUT',
				url: '/api/files/copy',
				body: { sourcePath: '/a', targetPath: '/b' },
			}),
		);
		await Files.move(ctx(), { sourcePath: 'a', targetPath: 'b' });
		expect(lastCall().url).toBe('/api/files/move');
		await Files.delete(ctx(), { path: 'docs', fileName: 'a.txt' });
		expect(lastCall()).toEqual(
			expect.objectContaining({
				method: 'DELETE',
				url: '/api/files/{filePath}',
				path: { filePath: 'docs/a.txt' },
			}),
		);
	});

	it('creates and deletes directories', async () => {
		await Files.createDirectory(ctx(), { path: 'notes' });
		expect(lastCall()).toEqual(
			expect.objectContaining({
				method: 'POST',
				url: '/api/files/{dirPath}',
				path: { dirPath: 'notes' },
			}),
		);
		await Files.deleteDirectory(ctx(), { path: 'notes' });
		expect(lastCall().method).toBe('DELETE');
	});

	it('retrieves data with paging query params', async () => {
		mockRequest.mockResolvedValue([]);
		await Data.retrieve(ctx(), {
			tableName: 'Person',
			where: 'age > 30',
			sortBy: 'created desc',
			pageSize: 20,
			offset: 0,
		});
		expect(lastCall()).toEqual(
			expect.objectContaining({
				method: 'GET',
				url: '/api/data/{tableName}',
				path: { tableName: 'Person' },
				query: expect.objectContaining({
					where: 'age > 30',
					sortBy: 'created desc',
					pageSize: 20,
					offset: 0,
				}),
			}),
		);
	});

	it('creates a hive and reads map/list values', async () => {
		await Hive.create(ctx(), { hiveName: 'groceryStore' });
		expect(lastCall()).toEqual(
			expect.objectContaining({
				method: 'POST',
				url: '/api/hive/{hiveName}',
				path: { hiveName: 'groceryStore' },
			}),
		);
		mockRequest.mockResolvedValue({ Apples: 0.99 });
		await Hive.values(ctx(), { hiveName: 'groceryStore', key: 'fruits' });
		expect(lastCall().url).toBe('/api/hive/{hiveName}/map/{key}');
		mockRequest.mockResolvedValue(['a']);
		await Hive.keyItems(ctx(), {
			hiveName: 'groceryStore',
			key: 'fruits',
			index: 1,
		});
		expect(lastCall().url).toBe('/api/hive/{hiveName}/list/{key}/{index}');
		mockRequest.mockResolvedValue(true);
		await Hive.mapPut(ctx(), {
			hiveName: 'groceryStore',
			mapKey: 'fruits',
			keyName: 'Oranges',
			value: 1.29,
		});
		expect(lastCall()).toEqual(
			expect.objectContaining({
				method: 'PUT',
				url: '/api/hive/{hiveName}/map/{mapKey}/set/{keyName}',
				body: { value: 1.29 },
			}),
		);
	});

	it('reads, compare-and-sets, and resets counters', async () => {
		mockRequest.mockResolvedValue(20);
		await Counters.get(ctx(), { counterName: 'mycounter' });
		expect(lastCall().url).toBe('/api/counters/{counterName}');
		mockRequest.mockResolvedValue(true);
		await Counters.set(ctx(), {
			counterName: 'mycounter',
			expected: 20,
			updated: 21,
		});
		expect(lastCall()).toEqual(
			expect.objectContaining({
				method: 'PUT',
				url: '/api/counters/{counterName}/get/compareandset',
				query: { expected: 20, updatedvalue: 21 },
			}),
		);
		await Counters.reset(ctx(), { counterName: 'mycounter' });
		expect(lastCall().url).toBe('/api/counters/{counterName}/reset');
	});

	it('registers with email last so properties cannot overwrite credentials', async () => {
		mockRequest.mockResolvedValue({
			objectId: 'u1',
			email: 'alice@wonderland.com',
		});
		await Users.register(ctx(), {
			identity: 'alice@wonderland.com',
			password: 'wonderland',
			properties: { identity: 'other', password: 'nope', name: 'Alice' },
		});
		expect(lastCall().body).toEqual({
			identity: 'other',
			name: 'Alice',
			email: 'alice@wonderland.com',
			password: 'wonderland',
		});
		await Users.register(ctx({ identityProperty: 'login' }), {
			identity: 'alice',
			password: 'wonderland',
			properties: { email: 'other@wonderland.com' },
		});
		expect(lastCall().body).toEqual({
			email: 'other@wonderland.com',
			login: 'alice',
			password: 'wonderland',
		});
	});

	it('logs in, validates tokens, and maps user-token', async () => {
		mockRequest.mockResolvedValue({
			objectId: 'u1',
			email: 'alice@wonderland.com',
			'user-token': 'tok',
		});
		const login = await Users.login(ctx(), {
			login: 'alice@wonderland.com',
			password: 'wonderland',
		});
		expect(lastCall().body).toEqual({
			login: 'alice@wonderland.com',
			password: 'wonderland',
		});
		expect(login).toEqual({
			user: expect.objectContaining({ objectId: 'u1' }),
			userToken: 'tok',
		});
		mockRequest.mockResolvedValue(true);
		await Users.validateToken(ctx(), { userToken: 'tok' });
		expect(lastCall().url).toBe('/api/users/isvalidusertoken/{token}');
	});

	it('updates, finds, deletes, logs out, and recovers passwords', async () => {
		mockRequest.mockResolvedValue({ objectId: 'u1', email: 'a@b.c' });
		await Users.update(ctx(), { userId: 'u1', properties: { name: 'A' } });
		expect(lastCall().url).toBe('/api/users/{userId}');
		await Users.find(ctx(), { userId: 'u1' });
		expect(lastCall().url).toBe('/api/data/Users/{userId}');
		mockRequest.mockResolvedValue({ deletionTime: 1 });
		await Users.delete(ctx(), { userId: 'u1' });
		expect(lastCall()).toEqual(
			expect.objectContaining({ method: 'DELETE', url: '/api/users/{userId}' }),
		);
		await Users.logout(ctx(), {});
		expect(lastCall().url).toBe('/api/users/logout');
		await Users.passwordRecovery(ctx(), { identity: 'a@b.c' });
		expect(lastCall().url).toBe('/api/users/restorepassword/{identity}');
	});

	it('grants and revokes table permissions for a user or role', async () => {
		await Permissions.grant(ctx(), {
			tableName: 'Person',
			permission: 'FIND',
			userId: 'u1',
		});
		expect(lastCall()).toEqual(
			expect.objectContaining({
				method: 'PUT',
				url: '/api/data/{tableName}/permissions/{action}',
				body: { permission: 'FIND', user: 'u1' },
			}),
		);
		await Permissions.revoke(ctx(), {
			tableName: 'Person',
			permission: 'FIND',
			role: 'TrialUser',
			objectId: 'o1',
		});
		expect(lastCall().url).toBe(
			'/api/data/{tableName}/permissions/{action}/{objectId}',
		);
		await expect(
			Permissions.grant(ctx(), {
				tableName: 'Person',
				permission: 'FIND',
				userId: 'u1',
				role: 'TrialUser',
			}),
		).rejects.toThrow(/mutually exclusive/);
	});

	it('publishes a messaging payload', async () => {
		mockRequest.mockResolvedValue({
			errorMessage: null,
			messageId: 'message:1',
			status: 'published',
		});
		await Messaging.publish(ctx(), {
			channel: 'default',
			message: 'hello world!',
			publishAt: '2026-08-27T09:00:00.000Z',
		});
		expect(lastCall()).toEqual(
			expect.objectContaining({
				method: 'POST',
				url: '/api/messaging/{channel}',
				body: expect.objectContaining({
					message: 'hello world!',
					publishAt: Date.parse('2026-08-27T09:00:00.000Z'),
				}),
			}),
		);
	});
});

describe('Backendless schemas and errors', () => {
	it('parses official listing and user shapes', () => {
		expect(
			BackendlessFile.parse({
				name: 'index.html',
				createdOn: 1438338861000,
				publicUrl: 'https://example.com/index.html',
				size: 1024,
				url: 'web/index.html',
			}).name,
		).toBe('index.html');
		expect(
			BackendlessUser.parse({
				objectId: 'u1',
				email: 'alice@wonderland.com',
				phoneNumber: '5551212',
			}).objectId,
		).toBe('u1');
	});

	it('retries 429 and does not retry 401', async () => {
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(new Error('too many requests')),
		).toBe(true);
		expect(errorHandlers.AUTH_ERROR.match(new Error('unauthorized'))).toBe(
			true,
		);
		await expect(
			errorHandlers.DEFAULT.handler(new Error('other')),
		).resolves.toEqual({ maxRetries: 0 });
	});
});
