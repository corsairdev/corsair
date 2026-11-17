const requestMock = jest.fn();
jest.mock('corsair/http', () => ({
	...jest.requireActual('corsair/http'),
	// The mocked shared request takes several heterogeneous arguments; the
	// assertions below read only the options object.
	request: (...args: unknown[]) => requestMock(...args),
}));

import { AuthMissingError } from 'corsair/core';
import { joinPushoverKey } from './client';
import { Glances, Messages, Receipts, Sounds, Users } from './endpoints';
import { pushover, pushoverAuthConfig } from './index';

const status = { status: 1, request: 'r' };
// Endpoints read only `key` from the context, so a context with just the
// joined key stands in for the full plugin context.
const stored = { key: joinPushoverKey('app-token', 'owner-key') } as never;

beforeEach(() => requestMock.mockReset());

function keyBuilderContext(apiKey: string | null, userKey: string | null) {
	// The keyBuilder reads only `authType` and these two getters; building the
	// whole core key context would add nothing to these tests.
	return {
		authType: 'api_key',
		keys: {
			get_api_key: jest.fn().mockResolvedValue(apiKey),
			get_user_key: jest.fn().mockResolvedValue(userKey),
		},
	} as never;
}

test('stores the owner user key as an account field', () => {
	expect(pushoverAuthConfig.api_key.account).toEqual(['user_key']);
});

test('keyBuilder throws AuthMissingError for a missing user key', async () => {
	const build = pushover().keyBuilder;
	if (!build) throw new Error('Expected a keyBuilder');
	await expect(
		build(keyBuilderContext('app-token', null), 'endpoint'),
	).rejects.toBeInstanceOf(AuthMissingError);
	await expect(
		build(keyBuilderContext(null, 'owner-key'), 'endpoint'),
	).rejects.toBeInstanceOf(AuthMissingError);
	await expect(
		build(keyBuilderContext('app-token', 'owner-key'), 'endpoint'),
	).resolves.toBe(joinPushoverKey('app-token', 'owner-key'));
});

test('a message without a user goes to the stored owner key', async () => {
	requestMock.mockResolvedValue(status);
	await Messages.send(stored, { message: 'hello' });
	expect(requestMock.mock.calls[0][1].body).toEqual({
		token: 'app-token',
		user: 'owner-key',
		message: 'hello',
	});
});

test('an explicit user or group key overrides the owner key', async () => {
	requestMock.mockResolvedValue(status);
	await Messages.send(stored, { user: 'group-key', message: 'hello' });
	expect(requestMock.mock.calls[0][1].body.user).toBe('group-key');
});

test('validate and glances default to the owner key', async () => {
	requestMock.mockResolvedValue(status);
	await Users.validate(stored, {});
	await Glances.update(stored, { text: 'ok' });
	expect(requestMock.mock.calls[0][1].body).toEqual({
		token: 'app-token',
		user: 'owner-key',
	});
	expect(requestMock.mock.calls[1][1].body.user).toBe('owner-key');
});

test('the user key never reaches the token parameter', async () => {
	requestMock.mockResolvedValue({ ...status, sounds: {} });
	await Sounds.list(stored, {});
	expect(requestMock.mock.calls[0][1].query).toEqual({ token: 'app-token' });
});

test('a send without user and without a stored key asks for one', async () => {
	await expect(
		// A context with only the token: no user key was stored.
		Messages.send({ key: 'app-token' } as never, { message: 'hello' }),
	).rejects.toBeInstanceOf(AuthMissingError);
	expect(requestMock).not.toHaveBeenCalled();
});

test('rejects messages over the documented length limits', async () => {
	await expect(
		Messages.send(stored, { message: 'x'.repeat(1025) }),
	).rejects.toThrow();
	await expect(
		Messages.send(stored, { message: 'x', title: 'x'.repeat(251) }),
	).rejects.toThrow();
	expect(requestMock).not.toHaveBeenCalled();
});

test('counts characters, not UTF-16 units, against the length limits', async () => {
	requestMock.mockResolvedValue(status);
	await expect(
		Messages.send(stored, {
			message: `${'a'.repeat(1023)}\u{1F600}`,
			title: `${'a'.repeat(249)}\u{1F600}`,
			url_title: `${'a'.repeat(99)}\u{1F600}`,
		}),
	).resolves.toEqual(status);
	await expect(
		Messages.send(stored, { message: `${'a'.repeat(1024)}\u{1F600}` }),
	).rejects.toThrow();
});

test('cancels by any tag a send accepts, quotes and slashes included', async () => {
	requestMock.mockResolvedValue(status);
	await Receipts.cancelByTag(stored, { tag: "O'Hare/gate" });
	expect(requestMock.mock.calls[0][1]).toMatchObject({
		url: "receipts/cancel_by_tag/O'Hare%2Fgate.json",
	});
	await expect(Receipts.cancelByTag(stored, { tag: '..' })).rejects.toThrow();
});

test('cancelling emergency retries is destructive', () => {
	const meta = pushover().endpointMeta;
	expect(meta?.['receipts.cancel']?.riskLevel).toBe('destructive');
	expect(meta?.['receipts.cancelByTag']?.riskLevel).toBe('destructive');
});
