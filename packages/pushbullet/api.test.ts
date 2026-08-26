/**
 * Endpoint coverage. The transport is mocked so these run in CI with no
 * Pushbullet account, asserting each operation targets the right path and verb
 * and that path parameters are interpolated rather than sent as a body field.
 */
const requestMock = jest.fn();

jest.mock('corsair/http', () => ({
	...jest.requireActual('corsair/http'),
	request: (...args: unknown[]) => requestMock(...args),
}));

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: async () => undefined,
}));

import { Chats, Devices, Files, Pushes, Users } from './endpoints';

function makeCtx() {
	return { key: 'o.testtoken', db: {}, options: {} } as never;
}

interface RequestOptions {
	url: string;
	method: string;
	body?: Record<string, unknown>;
	query?: Record<string, unknown>;
}

function lastCall(): RequestOptions {
	const calls = requestMock.mock.calls;
	return calls[calls.length - 1][1] as RequestOptions;
}

beforeEach(() => {
	requestMock.mockReset();
	requestMock.mockResolvedValue({
		iden: 'ujx1',
		pushes: [],
		devices: [],
		chats: [],
	});
});

type Case = [
	Record<string, unknown>,
	string,
	string,
	'GET' | 'POST' | 'DELETE',
	Record<string, unknown>,
];

const CASES: Case[] = [
	[
		Pushes,
		'create',
		'pushes',
		'POST',
		{ type: 'note', title: 'hi', body: 'there' },
	],
	[Pushes, 'list', 'pushes', 'GET', {}],
	[Pushes, 'update', 'pushes/ujx1', 'POST', { iden: 'ujx1', dismissed: true }],
	[Pushes, 'delete', 'pushes/ujx1', 'DELETE', { iden: 'ujx1' }],
	[Pushes, 'deleteAll', 'pushes', 'DELETE', {}],
	[Devices, 'register', 'devices', 'POST', { nickname: 'laptop' }],
	[Devices, 'list', 'devices', 'GET', {}],
	[
		Devices,
		'update',
		'devices/dv1',
		'POST',
		{ iden: 'dv1', nickname: 'renamed' },
	],
	[Devices, 'delete', 'devices/dv1', 'DELETE', { iden: 'dv1' }],
	[Chats, 'create', 'chats', 'POST', { email: 'a@b.test' }],
	[Chats, 'list', 'chats', 'GET', {}],
	[Chats, 'setMuted', 'chats/ch1', 'POST', { iden: 'ch1', muted: true }],
	[Chats, 'delete', 'chats/ch1', 'DELETE', { iden: 'ch1' }],
	[Users, 'me', 'users/me', 'GET', {}],
	[
		Files,
		'uploadRequest',
		'upload-request',
		'POST',
		{ file_name: 'a.png', file_type: 'image/png' },
	],
];

const NAMED = CASES.map(([group, op, url, method, input]) => ({
	group,
	op,
	url,
	method,
	input,
}));

describe('endpoints target the correct Pushbullet path', () => {
	it.each(NAMED)(
		'$op -> $method $url',
		async ({ group, op, url, method, input }) => {
			const fn = group[op] as (c: unknown, i: unknown) => Promise<unknown>;
			await fn(makeCtx(), input);

			expect(requestMock).toHaveBeenCalled();
			const call = lastCall();
			expect(call.url).toBe(url);
			expect(call.method).toBe(method);
		},
	);

	it('covers every operation the plugin exposes', () => {
		expect(CASES).toHaveLength(15);
	});
});

describe('path parameters', () => {
	it('interpolates iden into the path and drops it from the body', async () => {
		await Pushes.update(makeCtx(), { iden: 'ujx1', dismissed: true });
		const call = lastCall();
		expect(call.url).toBe('pushes/ujx1');
		expect(call.body).toEqual({ dismissed: true });
	});

	it('url-encodes an iden containing reserved characters', async () => {
		await Devices.delete(makeCtx(), { iden: 'a/b c' });
		expect(lastCall().url).toBe('devices/a%2Fb%20c');
	});

	it('sends list filters as query parameters, not a body', async () => {
		await Pushes.list(makeCtx(), { active: true, limit: 50 });
		const call = lastCall();
		expect(call.query).toMatchObject({ active: true, limit: 50 });
		expect(call.body).toBeUndefined();
	});
});
