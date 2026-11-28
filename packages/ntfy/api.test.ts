import { randomBytes } from 'node:crypto';
import { ApiError } from 'corsair/http';
import { makeNtfyRequest, parseNtfyNdjson } from './client';
import { Account, Messages, Server } from './endpoints';
import * as More from './endpoints/more';
import type { NtfyContext } from './index';
import { ntfyEndpointSchemas } from './index';

/**
 * Live suites, both opt-in.
 *
 * 1. ntfy.sh, read-only: `NTFY_API_KEY` = an access token from
 *    https://ntfy.sh/account. ntfy.sh caps visitors at 250 messages a day and
 *    every publish pushes to real subscribers, so this part never sends.
 * 2. A self-hosted server, every operation: `NTFY_LIVE_URL` (e.g.
 *    https://ntfy.example.com) and `NTFY_LIVE_ADMIN` (`admin:password` of an
 *    admin user). The server should run with signup, login, reservations,
 *    attachments, metrics and web push on; email, calls and payments off
 *    (those routes are asserted to refuse). It creates a throwaway user and
 *    tier and deletes them again.
 */
const API_KEY = process.env.NTFY_API_KEY;
const LIVE_URL = process.env.NTFY_LIVE_URL;
const LIVE_ADMIN = process.env.NTFY_LIVE_ADMIN;
const describeIfKey = API_KEY ? describe : describe.skip;
const describeIfServer = LIVE_URL && LIVE_ADMIN ? describe : describe.skip;

if (!API_KEY) {
	// Say so out loud: a skipped suite reads as a pass in the summary otherwise.
	console.warn('NTFY_API_KEY is not set, skipping the live ntfy.sh tests');
}
if (!LIVE_URL || !LIVE_ADMIN) {
	console.warn(
		'NTFY_LIVE_URL / NTFY_LIVE_ADMIN are not set, skipping the self-hosted ntfy tests',
	);
}

describeIfKey('ntfy live API (ntfy.sh, read-only)', () => {
	const schemas = ntfyEndpointSchemas;
	const target = { baseUrl: 'https://ntfy.sh', key: API_KEY ?? '' };

	async function get(path: string, query?: Record<string, string | number>) {
		return makeNtfyRequest(target, { method: 'GET', path, query });
	}

	it('polls an unlikely topic to an empty answer through the output schema', async () => {
		const raw = await get(
			`/corsair-smoke-${Math.random().toString(36).slice(2, 10)}/json`,
			{ poll: 1 },
		);
		const parsed = schemas['messages.poll'].output.parse({
			messages: parseNtfyNdjson(raw),
		});
		expect(parsed.messages).toEqual([]);
	});

	it('reads server health through the output schema', async () => {
		const parsed = schemas['server.health'].output.parse(
			await get('/v1/health'),
		);
		expect(typeof parsed.healthy).toBe('boolean');
	});

	it('reads server stats through the output schema', async () => {
		const parsed = schemas['server.stats'].output.parse(await get('/v1/stats'));
		expect(parsed.messages).toBeGreaterThan(0);
	});

	it('reads the account view through the output schema', async () => {
		const parsed = schemas['account.usage'].output.parse(
			await get('/v1/account'),
		);
		expect(parsed.limits.messages).toBeGreaterThan(0);
	});
});

function ctxFor(key: string): NtfyContext {
	return { key, options: { serverUrl: LIVE_URL } } as unknown as NtfyContext;
}

async function statusOf(promise: Promise<unknown>): Promise<number> {
	try {
		await promise;
		return 200;
	} catch (error) {
		if (error instanceof ApiError) return error.status;
		throw error;
	}
}

describeIfServer('ntfy live API (self-hosted, every operation)', () => {
	const admin = ctxFor(LIVE_ADMIN ?? '');
	const suffix = randomBytes(4).toString('hex');
	const username = `corsair_${suffix}`;
	const password = `pw-${randomBytes(9).toString('hex')}`;
	const topic = `corsair-live-${suffix}`;
	const tierCode = `ct${suffix}`;
	let user: NtfyContext = ctxFor(`${username}:${password}`);
	let userToken = '';

	it('server: health, ready, version, config, stats, metrics', async () => {
		expect((await Server.health(admin, {})).healthy).toBe(true);
		expect((await More.ready(admin, {})).ready).toBe(true);
		expect((await More.version(admin, {})).version).toMatch(/\d/);
		expect((await More.config(admin, {})).enable_signup).toBe(true);
		expect(typeof (await Server.stats(admin, {})).messages).toBe('number');
		expect((await More.metrics(admin, {})).text).toContain('ntfy_');
	});

	it('tiers: create, list, update (admin)', async () => {
		await More.tiersCreate(admin, {
			code: tierCode,
			name: 'Corsair live',
			messages_limit: 500,
			reservations_limit: 2,
			attachment_file_size_limit: 1_000_000,
			attachment_total_size_limit: 10_000_000,
			attachment_expiry_duration: 3600,
			attachment_bandwidth_limit: 50_000_000,
		});
		const tiers = await More.tiersList(admin, {});
		expect(tiers.tiers.some((t) => t.code === tierCode)).toBe(true);
		await More.tiersUpdate(admin, {
			code: tierCode,
			name: 'Corsair live 2',
			messages_limit: 600,
			reservations_limit: 2,
			attachment_file_size_limit: 1_000_000,
			attachment_total_size_limit: 10_000_000,
			attachment_expiry_duration: 3600,
			attachment_bandwidth_limit: 50_000_000,
		});
	});

	it('account: create (signup), login, token create/update', async () => {
		const anonymous = ctxFor('');
		expect(
			(await More.accountCreate(anonymous, { username, password })).success,
		).toBe(true);
		const login = await More.accountLogin(user, {});
		expect(login.username).toBe(username);
		const token = await More.tokensCreate(user, { label: 'corsair live' });
		expect(token.token).toMatch(/^tk_/);
		userToken = token.token;
		user = ctxFor(userToken);
		const updated = await More.tokensUpdate(user, {
			token: userToken,
			label: 'corsair live 2',
		});
		expect(updated.label).toBe('corsair live 2');
		// The login session token is no longer needed.
		await More.tokensDelete(user, { token: login.token });
	});

	it('users: list, update (tier), grant/reset access, tokens, reset password (admin)', async () => {
		const users = await More.usersList(admin, { username });
		expect(users.users[0]?.username).toBe(username);
		await More.usersUpdate(admin, { username, tier: tierCode });
		await More.usersGrantAccess(admin, {
			username,
			topic: `${topic}-ro`,
			permission: 'read-only',
		});
		const granted = await More.usersList(admin, { username });
		expect(granted.users[0]?.grants?.length).toBeGreaterThan(0);
		await More.usersResetAccess(admin, { username, topic: `${topic}-ro` });
		const created = await More.usersCreateToken(admin, {
			username,
			label: 'admin-made',
		});
		expect(created.token).toMatch(/^tk_/);
		const tokens = await More.usersListTokens(admin, { username });
		expect(tokens.tokens.length).toBeGreaterThanOrEqual(2);
		await More.usersDeleteToken(admin, { username, token: created.token });
		const reset = await More.usersResetPassword(admin, { username });
		expect(reset.link).toContain('/account/password/reset/');
	});

	it('account: usage, settings, password change, subscriptions, reservations', async () => {
		const usage = await Account.usage(user, {});
		expect(usage.username).toBe(username);
		await More.accountUpdateSettings(user, {
			language: 'en',
			notification: { min_priority: 2, delete_after: 86400 },
		});
		const newPassword = `${password}-2`;
		await More.accountChangePassword(user, { password, newPassword });
		await More.accountChangePassword(user, {
			password: newPassword,
			newPassword: password,
		});
		const sub = await More.subscriptionsAdd(user, {
			baseUrl: LIVE_URL ?? '',
			topic,
		});
		expect(sub.topic).toBe(topic);
		const renamed = await More.subscriptionsUpdate(user, {
			baseUrl: LIVE_URL ?? '',
			topic,
			displayName: 'Corsair live',
		});
		expect(renamed.display_name).toBe('Corsair live');
		await More.subscriptionsDelete(user, { baseUrl: LIVE_URL ?? '', topic });
		await More.reservationsAdd(user, {
			topic: `${topic}-mine`,
			everyone: 'deny-all',
		});
		const reserved = await Account.usage(user, {});
		expect(JSON.stringify(reserved)).toContain(`${topic}-mine`);
		await More.reservationsDelete(user, {
			topic: `${topic}-mine`,
			deleteMessages: true,
		});
	});

	it('messages: send, sendFile, poll, update, clear, delete; topics.checkAuth; files.download', async () => {
		const sent = await Messages.send(user, {
			topic,
			message: 'Corsair live run',
			title: 'Corsair',
			priority: 'high',
			tags: ['white_check_mark'],
			sequenceId: `seq-${suffix}`,
			markdown: true,
		});
		expect(sent.priority).toBe(4);
		const file = await More.sendFile(user, {
			topic,
			contentBase64: Buffer.from('hello from corsair\n').toString('base64'),
			filename: 'hello.txt',
			contentType: 'text/plain',
			message: 'with a file',
		});
		expect(file.attachment?.name).toBe('hello.txt');
		const id = file.attachment?.url.split('/file/')[1] ?? '';
		const downloaded = await More.download(user, { id });
		expect(downloaded.text ?? '').toContain('hello from corsair');
		const polled = await Messages.poll(user, { topic, since: 'all' });
		expect(polled.messages.length).toBeGreaterThanOrEqual(2);
		const updated = await Messages.update(user, {
			topic,
			message: 'Corsair live run, updated',
			sequenceId: `seq-${suffix}`,
		});
		expect(updated.sequence_id).toBe(`seq-${suffix}`);
		const cleared = await Messages.clear(user, {
			topic,
			sequenceId: `seq-${suffix}`,
		});
		expect(cleared.event).toBe('message_clear');
		const deleted = await Messages.remove(user, {
			topic,
			sequenceId: `seq-${suffix}`,
		});
		expect(deleted.event).toBe('message_delete');
		expect((await More.checkAuth(user, { topic })).success).toBe(true);
	});

	it('webPush: subscribe and unsubscribe', async () => {
		const endpoint = `https://fcm.googleapis.com/fcm/send/corsair-${suffix}`;
		await More.webPushSubscribe(user, {
			endpoint,
			auth: 'kXR9Ur3rBGTOQwqHZB6O5A',
			p256dh:
				'BBC9WCw3sKbOvd8gxvhWrJqA8Yqtsx3m7DyQf_hEr9H6Ijwb5cA3x5bwXjvbXzHJbKjUMBWw8LaSgBmVLQe8uK0',
			topics: [topic],
		});
		await More.webPushUnsubscribe(user, { endpoint });
	});

	// Email, calls and payments are off on the test server: each route
	// refuses with 400 (feature not enabled) or 404, before sending anything.
	it.each([
		[
			'phoneNumbers.sendVerification',
			() =>
				More.phoneSendVerification(user, {
					number: '+15555550100',
					channel: 'sms',
				}),
		],
		[
			'phoneNumbers.add',
			() => More.phoneAdd(user, { number: '+15555550100', code: '123456' }),
		],
		[
			'phoneNumbers.delete',
			() => More.phoneDelete(user, { number: '+15555550100' }),
		],
		['emails.add', () => More.emailsAdd(user, { email: 'nobody@example.com' })],
		['emails.verify', () => More.emailsVerify(user, { token: 'nope' })],
		[
			'emails.delete',
			() => More.emailsDelete(user, { email: 'nobody@example.com' }),
		],
		[
			'emails.setPrimary',
			() => More.emailsSetPrimary(user, { email: 'nobody@example.com' }),
		],
		[
			'emails.resendVerification',
			() =>
				More.emailsResendVerification(user, { email: 'nobody@example.com' }),
		],
		[
			'account.requestPasswordReset',
			() =>
				More.accountRequestPasswordReset(ctxFor(''), { identifier: username }),
		],
		[
			'account.resetPassword',
			() =>
				More.accountResetPassword(ctxFor(''), { token: 'nope', password: 'x' }),
		],
		['billing.tiers', () => More.billingTiers(user, {})],
		[
			'billing.createSubscription',
			() =>
				More.billingCreateSubscription(user, {
					tier: tierCode,
					interval: 'month',
				}),
		],
		[
			'billing.updateSubscription',
			() =>
				More.billingUpdateSubscription(user, {
					tier: tierCode,
					interval: 'month',
				}),
		],
		[
			'billing.cancelSubscription',
			() => More.billingCancelSubscription(user, {}),
		],
		[
			'billing.createPortalSession',
			() => More.billingCreatePortalSession(user, {}),
		],
	])('%s refuses on a server without that feature', async (_, run) => {
		const status = await statusOf(run());
		expect(status).toBeGreaterThanOrEqual(400);
		expect(status).toBeLessThan(500);
	});

	it('cleanup: tokens.delete, account.delete, users.create/delete, tiers.delete', async () => {
		await More.tokensDelete(user, { token: userToken });
		// account.delete only marks the account for removal, so the tier is
		// taken off first or tiers.delete answers 409 (tier still assigned).
		await More.usersUpdate(admin, { username, tier: '-' });
		// The token is gone, so the account is deleted with username:password.
		await More.accountDelete(ctxFor(`${username}:${password}`), { password });
		const other = `${username}_b`;
		await More.usersCreate(admin, { username: other, password });
		await More.usersDelete(admin, { username: other });
		await More.tiersDelete(admin, { code: tierCode });
		const users = await More.usersList(admin, {});
		expect(users.users.some((u) => u.username === other)).toBe(false);
		const tiers = await More.tiersList(admin, {});
		expect(tiers.tiers.some((t) => t.code === tierCode)).toBe(false);
	});
});
