import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { DB } from '@/db';

import {
	enabledConnectProviders,
	fetchLinkedIdentity,
	syncLinkedAccount,
} from './linked-account';

// `body` is whatever JSON the fake GitHub or Discord API returns, including bad shapes.
function respond(status: number, body: unknown) {
	return async () =>
		new Response(JSON.stringify(body), {
			status,
			headers: { 'content-type': 'application/json' },
		});
}

// syncLinkedAccount must not write anything when the token doesn't check out.
const untouchableDb = new Proxy({} as DB, {
	get() {
		throw new Error('the database should not be touched');
	},
});

describe('enabledConnectProviders', () => {
	it('lists a provider only when both its client id and secret are set', () => {
		assert.deepEqual(enabledConnectProviders({}), []);
		assert.deepEqual(
			enabledConnectProviders({
				GITHUB_CLIENT_ID: 'id',
				GITHUB_CLIENT_SECRET: 'secret',
				DISCORD_CLIENT_ID: 'id',
			}),
			['github'],
		);
		assert.deepEqual(
			enabledConnectProviders({
				GITHUB_CLIENT_ID: 'id',
				GITHUB_CLIENT_SECRET: 'secret',
				DISCORD_CLIENT_ID: 'id',
				DISCORD_CLIENT_SECRET: 'secret',
			}),
			['github', 'discord'],
		);
	});
});

describe('fetchLinkedIdentity', () => {
	it('reads the GitHub login and the Discord username, lowercased', async () => {
		assert.deepEqual(
			await fetchLinkedIdentity(
				'github',
				'token',
				respond(200, { id: 1001, login: 'Srinidhi444' }),
			),
			{ id: '1001', username: 'srinidhi444' },
		);
		assert.deepEqual(
			await fetchLinkedIdentity(
				'discord',
				'token',
				respond(200, { id: '1420731498834694164', username: 'contributor' }),
			),
			{ id: '1420731498834694164', username: 'contributor' },
		);
	});

	it('returns null for a rejected token or a response without a name', async () => {
		assert.equal(
			await fetchLinkedIdentity(
				'github',
				'token',
				respond(401, { message: 'Bad credentials' }),
			),
			null,
		);
		assert.equal(
			await fetchLinkedIdentity('discord', 'token', respond(200, { id: '1' })),
			null,
		);
	});
});

describe('syncLinkedAccount', () => {
	it('leaves the profile alone when the token belongs to a different account', async () => {
		await syncLinkedAccount(
			untouchableDb,
			{
				userId: 'u1',
				providerId: 'github',
				accountId: '1001',
				accessToken: 'token',
			},
			respond(200, { id: 2002, login: 'someone-else' }),
		);
	});

	it('ignores providers other than GitHub and Discord, and accounts without a token', async () => {
		await syncLinkedAccount(
			untouchableDb,
			{ userId: 'u1', providerId: 'google', accountId: '1', accessToken: 'x' },
			respond(200, { id: 1, login: 'x' }),
		);
		await syncLinkedAccount(
			untouchableDb,
			{ userId: 'u1', providerId: 'github', accountId: '1', accessToken: null },
			respond(200, { id: 1, login: 'x' }),
		);
	});
});
