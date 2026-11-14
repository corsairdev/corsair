// Responses recorded from the live JumpCloud API on 11-15 (trial org), trimmed
// to the fields that broke the documented schemas. Each case failed before the
// matching fix.
import type { JumpCloudContext } from '../index';
import { applicationsGet } from './applications';
import { commandsCreate } from './commands';
import { systemGroupsDelete } from './system-groups';
import { userGroupsDelete, userGroupsGet } from './user-groups';
import {
	usersExpirePassword,
	usersResetMfa,
	usersSyncMfa,
	usersUnlock,
} from './users';

jest.mock('corsair/core', () => {
	// unknown: core's export surface is opaque to plugin tests; the record cast
	// only keeps requireActual while stubbing the event logger.
	const actual = jest.requireActual('corsair/core') as Record<string, unknown>;
	return { ...actual, logEventFromContext: jest.fn() };
});

const fetchMock = jest.fn<
	Promise<Response>,
	Parameters<typeof globalThis.fetch>
>();

// unknown: fixtures are raw provider JSON; the output schemas check them.
function jsonResponse(body: unknown): Response {
	return new Response(JSON.stringify(body), {
		status: 200,
		headers: { 'content-type': 'application/json; charset=utf-8' },
	});
}

function textOk(): Response {
	return new Response('OK', {
		status: 200,
		headers: { 'content-type': 'text/plain; charset=utf-8' },
	});
}

const ctx = { key: 'jc-test-key' } as never as JumpCloudContext;

beforeEach(() => {
	fetchMock.mockReset();
	globalThis.fetch = fetchMock as typeof globalThis.fetch;
});

describe('live JumpCloud response shapes', () => {
	it('users.unlock, users.resetMfa and users.syncMfa return the text/plain "OK" body', async () => {
		fetchMock.mockImplementation(() => Promise.resolve(textOk()));
		await expect(usersUnlock(ctx, { id: 'u1' })).resolves.toBe('OK');
		await expect(
			usersResetMfa(ctx, { id: 'u1', body: { exclusion: true } }),
		).resolves.toBe('OK');
		await expect(usersSyncMfa(ctx, { id: 'u1' })).resolves.toBe('OK');
	});

	it('users.expirePassword accepts the JSON object the API sends instead of a string', async () => {
		fetchMock.mockImplementationOnce(() =>
			Promise.resolve(jsonResponse({ orgPasswordPolicyUpdate: false })),
		);
		await expect(usersExpirePassword(ctx, { id: 'u1' })).resolves.toEqual({
			orgPasswordPolicyUpdate: false,
		});
	});

	it('applications.get accepts the null parentApp of a SAML app', async () => {
		fetchMock.mockImplementationOnce(() =>
			Promise.resolve(
				jsonResponse({
					_id: 'app-1',
					id: 'app-1',
					active: false,
					name: 'saml2',
					displayLabel: 'Custom SAML App',
					sso: { beta: false, type: 'saml', hidden: false },
					parentApp: null,
					aiReady: false,
				}),
			),
		);
		const result = await applicationsGet(ctx, { id: 'app-1' });
		expect(result.parentApp).toBeNull();
	});

	it('group deletes resolve on the documented 204 with no body', async () => {
		fetchMock.mockImplementation(() =>
			Promise.resolve(new Response(null, { status: 204 })),
		);
		await expect(userGroupsDelete(ctx, { id: 'g1' })).resolves.toBeUndefined();
		await expect(
			systemGroupsDelete(ctx, { id: 'g2' }),
		).resolves.toBeUndefined();
	});

	it('output enums accept a value JumpCloud adds later', async () => {
		fetchMock.mockImplementationOnce(() =>
			Promise.resolve(
				jsonResponse({
					id: 'g1',
					name: 'Engineering',
					type: 'user_group',
					membershipMethod: 'DYNAMIC_SCHEDULED',
				}),
			),
		);
		const result = await userGroupsGet(ctx, { id: 'g1' });
		expect(result.membershipMethod).toBe('DYNAMIC_SCHEDULED');
	});

	it('commands.create sends the run-as user the API requires for linux commands', async () => {
		fetchMock.mockImplementationOnce(() =>
			Promise.resolve(
				jsonResponse({
					_id: 'c1',
					name: 'disk report',
					command: 'df -h',
					commandType: 'linux',
					user: '000000000000000000000000',
					timeout: '0',
				}),
			),
		);
		await commandsCreate(ctx, {
			body: {
				name: 'disk report',
				command: 'df -h',
				commandType: 'linux',
				user: '000000000000000000000000',
			},
		});
		expect(JSON.parse(String(fetchMock.mock.calls[0]![1]?.body))).toEqual({
			name: 'disk report',
			command: 'df -h',
			commandType: 'linux',
			user: '000000000000000000000000',
		});
	});
});
