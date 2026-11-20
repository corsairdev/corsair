// Live Tailscale API tests. Excluded from the default run by
// `testPathIgnorePatterns` in jest.config.cjs; run them with:
//
//   TAILSCALE_API_KEY=tskey-api-... pnpm test:live
//
// They read the whole tailnet and make only changes they undo: a short-lived
// auth key and OAuth client, a webhook, a Service, an OAuth app, invite links
// without an email (so nobody is emailed), one split DNS domain and one custom
// posture attribute. Each run names its fixtures `corsair-plugin-test-<run>`,
// registers each one for cleanup as soon as it exists, and removes only its
// own in afterAll, so two runs on one tailnet don't touch each other's. The
// policy file is written back byte for byte with its etag, after a write with
// a stale etag is refused; the etag makes Tailscale refuse it if anyone changed
// the file in between. Devices, users, routes and nameservers are never changed.
//
// With TAILSCALE_LIVE_TAILNET_WRITES=1 they also write the DNS search paths,
// the MagicDNS setting and one tailnet setting back with the values just read.
// Those writes have no version check, so an admin's change made between the
// read and the write would be lost: set it only on a tailnet nobody else is
// editing (a test tailnet).
//
// Calls go through createCorsair, so the plugin's error handlers and core's
// retries apply as in production. Failing assertions never print a secret,
// token or invite URL: those are checked as booleans.
import { writeFileSync } from 'node:fs';
import { createCorsair } from 'corsair/core';
import { tailscale } from './index';

const key = process.env.TAILSCALE_API_KEY?.trim() ?? '';
const hasKey = key.length > 0;
if (!hasKey) {
	console.warn(
		'[tailscale] live API tests skipped: set TAILSCALE_API_KEY to enable them.',
	);
}
const live = hasKey ? describe : describe.skip;

const RUN = Date.now().toString(36);
const NAME = `corsair-plugin-test-${RUN}`;
const SERVICE = `svc:${NAME}`;
const SPLIT_DOMAIN = `${NAME}.invalid`;
const POSTURE_KEY = `custom:corsairPluginTest${RUN}`;

const tailnetWrites = process.env.TAILSCALE_LIVE_TAILNET_WRITES === '1';
if (hasKey && !tailnetWrites) {
	console.warn(
		'[tailscale] DNS and settings write-backs skipped: set TAILSCALE_LIVE_TAILNET_WRITES=1 on a test tailnet to run them.',
	);
}

/** Ops this file ran against the live API, for the PR's evidence. */
const ran = new Set<string>();

/** Records every operation called through the returned tree. */
function recording<T extends object>(target: T, path: string[] = []): T {
	return new Proxy(target, {
		get(object, property) {
			const value = Reflect.get(object, property);
			const next = [...path, String(property)];
			if (typeof value === 'function') {
				// `unknown` because each endpoint takes its own input.
				return (...args: unknown[]) => {
					ran.add(next.join('.'));
					return (value as (...a: unknown[]) => unknown)(...args);
				};
			}
			if (value && typeof value === 'object') return recording(value, next);
			return value;
		},
	});
}

/** The HTTP status of a failed call. */
// `unknown` because a rejected promise can carry anything.
async function statusOf(promise: Promise<unknown>): Promise<number | 'ok'> {
	try {
		await promise;
		return 'ok';
	} catch (error) {
		const status = (error as { status?: unknown }).status;
		if (typeof status === 'number') return status;
		throw error;
	}
}

live('Tailscale live API', () => {
	jest.setTimeout(3 * 60_000);
	const api = recording(
		createCorsair({ plugins: [tailscale({ key })] }).tailscale.api,
	);
	const created = {
		keys: new Set<string>(),
		webhooks: new Set<string>(),
		oauthApps: new Set<string>(),
		deviceInvites: new Set<string>(),
		userInvites: new Set<string>(),
		service: false,
		splitDomain: false,
		postureOn: '',
	};
	let deviceId = '';
	let nodeId = '';
	let hostname = '';
	let address = '';

	beforeAll(async () => {
		const { devices } = await api.devices.list({});
		// The device this suite tags with a posture attribute and shares by link:
		// one that is online, so a live device is exercised.
		const device =
			devices?.find((d) => d?.connectedToControl && d?.os === 'macOS') ??
			devices?.find((d) => d?.connectedToControl) ??
			devices?.[0];
		expect(device?.id).toBeTruthy();
		deviceId = device?.id ?? '';
		nodeId = device?.nodeId ?? '';
		hostname = device?.hostname ?? '';
		address = device?.addresses?.[0] ?? '';
	});

	afterAll(async () => {
		for (const id of created.keys) {
			await api.keys.delete({ keyId: id }).catch(() => undefined);
		}
		for (const id of created.webhooks) {
			await api.webhooks.delete({ endpointId: id }).catch(() => undefined);
		}
		for (const id of created.oauthApps) {
			await api.oauthApps.delete({ appId: id }).catch(() => undefined);
		}
		for (const id of created.deviceInvites) {
			await api.deviceInvites
				.delete({ deviceInviteId: id })
				.catch(() => undefined);
		}
		for (const id of created.userInvites) {
			await api.userInvites.delete({ userInviteId: id }).catch(() => undefined);
		}
		if (created.service) {
			await api.services
				.delete({ serviceName: SERVICE })
				.catch(() => undefined);
		}
		if (created.splitDomain) {
			await api.dns.splitDns
				.update({ domains: { [SPLIT_DOMAIN]: null } })
				.catch(() => undefined);
		}
		if (created.postureOn) {
			await api.devices.postureAttributes
				.delete({ deviceId: created.postureOn, attributeKey: POSTURE_KEY })
				.catch(() => undefined);
		}
		const out = process.env.TAILSCALE_LIVE_OPS_FILE;
		if (out) writeFileSync(out, `${[...ran].sort().join('\n')}\n`);
		console.log(
			`[tailscale] live ops (${ran.size}):\n${[...ran].sort().join('\n')}`,
		);
	});

	it('lists and filters devices, and reads one device', async () => {
		const all = await api.devices.list({ fields: 'all' });
		expect(all.devices?.length).toBeGreaterThan(0);
		const full = all.devices?.find((d) => d?.id === deviceId);
		// fields: "all" adds what the default list leaves out.
		expect(full).toHaveProperty('advertisedRoutes');
		expect(full).toHaveProperty('clientConnectivity');

		const filtered = await api.devices.list({ filters: { hostname } });
		expect(filtered.devices?.map((d) => d?.id)).toContain(deviceId);
		const none = await api.devices.list({
			filters: { hostname: `${NAME}-no-such-host` },
		});
		expect(none.devices ?? []).toHaveLength(0);

		const byId = await api.devices.get({ deviceId });
		const byNodeId = await api.devices.get({ deviceId: nodeId });
		expect(byId.hostname).toBe(hostname);
		expect(byNodeId.id).toBe(deviceId);

		const routes = await api.devices.routes.list({ deviceId });
		expect(Array.isArray(routes.advertisedRoutes ?? [])).toBe(true);
		const posture = await api.devices.postureAttributes.get({ deviceId });
		expect(posture.attributes?.['node:os']).toBeTruthy();
		// null when the device was never shared.
		const shares = await api.deviceInvites.list({ deviceId });
		expect(shares === null || Array.isArray(shares)).toBe(true);

		expect(await statusOf(api.devices.get({ deviceId: 'nNoSuchDevice' }))).toBe(
			404,
		);
	});

	it('reads users, settings, contacts, DNS and the other tailnet lists', async () => {
		const users = await api.users.list({ type: 'all', role: 'all' });
		const user = users.users?.[0];
		expect(user?.id).toBeTruthy();
		const one = await api.users.get({ userId: user?.id ?? '' });
		expect(one.loginName).toBe(user?.loginName);

		const settings = await api.tailnetSettings.get({});
		expect(typeof settings.devicesKeyDurationDays).toBe('number');
		const contacts = await api.contacts.get({});
		expect(contacts).toHaveProperty('account');

		const dns = await api.dns.configuration.get({});
		expect(dns).toEqual(expect.any(Object));
		expect(Array.isArray((await api.dns.nameservers.list({})).dns)).toBe(true);
		expect(typeof (await api.dns.preferences.get({})).magicDNS).toBe('boolean');
		expect(
			Array.isArray((await api.dns.searchPaths.list({})).searchPaths),
		).toBe(true);
		expect(await api.dns.splitDns.get({})).toEqual(expect.any(Object));

		const keys = await api.keys.list({ all: true });
		expect(keys.keys?.length).toBeGreaterThan(0);
		const firstKey = await api.keys.get({ keyId: keys.keys?.[0]?.id ?? '' });
		expect(firstKey.id).toBe(keys.keys?.[0]?.id);
		// Never the secret.
		expect(firstKey.key ?? '').toBe('');

		expect(Array.isArray((await api.webhooks.list({})).webhooks ?? [])).toBe(
			true,
		);
		expect(Array.isArray((await api.services.list({})).vipServices ?? [])).toBe(
			true,
		);
		expect(Array.isArray((await api.oauthApps.list({})).oauthApps ?? [])).toBe(
			true,
		);
		const invites = await api.userInvites.list({});
		expect(invites === null || Array.isArray(invites)).toBe(true);
		expect(
			Array.isArray(
				(await api.postureIntegrations.list({})).integrations ?? [],
			),
		).toBe(true);
	});

	it('reads the configuration audit log', async () => {
		const end = new Date();
		const start = new Date(end.getTime() - 7 * 24 * 3600 * 1000);
		const logs = await api.logging.configurationLogs.list({
			start: start.toISOString(),
			end: end.toISOString(),
		});
		expect(Array.isArray(logs.logs ?? [])).toBe(true);
		// Network flow logs and log streaming depend on the plan: an answer or
		// Tailscale's refusal, never a schema failure.
		expect([200, 'ok', 400, 402, 403, 404]).toContain(
			await statusOf(
				api.logging.networkLogs.list({
					start: new Date(end.getTime() - 3600 * 1000).toISOString(),
					end: end.toISOString(),
				}),
			),
		);
		expect(['ok', 400, 402, 403, 404]).toContain(
			await statusOf(
				api.logging.streaming.getStatus({ logType: 'configuration' }),
			),
		);
		expect(['ok', 400, 402, 403, 404]).toContain(
			await statusOf(api.logging.streaming.get({ logType: 'configuration' })),
		);
		expect(['ok', 400, 403, 404]).toContain(
			await statusOf(api.tailnets.list({})),
		);
	});

	it('reads, validates and previews the policy file, and only writes it with the current etag', async () => {
		const text = await api.policyFile.get({});
		expect(typeof text.policy).toBe('string');
		expect(text.etag).toMatch(/^"?[\w-]+"?$/);
		const json = await api.policyFile.get({ format: 'json' });
		expect(typeof json.policy).toBe('object');
		const detailed = await api.policyFile.get({ details: true });
		expect(detailed.policy).toBe(text.policy);
		// null when there are none.
		expect(detailed.warnings ?? []).toEqual(expect.any(Array));
		expect(detailed.errors ?? []).toEqual(expect.any(Array));

		const validated = await api.policyFile.validate({
			policy: text.policy as string,
		});
		expect(validated?.message ?? '').toBe('');
		// ACL tests against the current file. This tailnet runs the default
		// allow-all policy, so its user reaches the device and a deny test fails.
		const loginName = (await api.users.list({})).users?.[0]?.loginName ?? '';
		const passing = await api.policyFile.validate({
			tests: [{ src: loginName, accept: [`${address}:22`] }],
		});
		// No body at all when every test passes.
		expect(passing?.message ?? '').toBe('');
		const failing = await api.policyFile.validate({
			tests: [{ src: loginName, deny: [`${address}:22`] }],
		});
		expect(failing?.message).toBe('test(s) failed');
		expect(failing?.data?.length).toBeGreaterThan(0);
		expect(await statusOf(api.policyFile.validate({ tests: [] }))).toBe(400);
		// A parse error is a 200 with the reason in message, like a failed test.
		const broken = await api.policyFile.validate({
			policy: '{ "acls": [ { "action": ',
		});
		expect(broken?.message).toMatch(/pars/i);

		const users = await api.users.list({});
		const preview = await api.policyFile.preview({
			type: 'user',
			previewFor: users.users?.[0]?.loginName ?? '',
			policy: text.policy as string,
		});
		expect(Array.isArray(preview.matches ?? [])).toBe(true);

		// A stale etag is refused and nothing is saved.
		expect(
			await statusOf(
				api.policyFile.set({
					policy: text.policy as string,
					ifMatch: 'corsair-stale-etag',
				}),
			),
		).toBe(412);
		// The same bytes with the current etag: saved, and nothing changes.
		const saved = await api.policyFile.set({
			policy: text.policy as string,
			ifMatch: text.etag ?? '',
		});
		expect(saved.policy).toBe(text.policy);
		const after = await api.policyFile.get({});
		expect(after.policy).toBe(text.policy);
	});

	it('creates, reads and revokes an auth key', async () => {
		const made = await api.keys.create({
			keyType: 'auth',
			description: NAME,
			expirySeconds: 600,
			capabilities: {
				devices: {
					create: { reusable: false, ephemeral: true, preauthorized: true },
				},
			},
		});
		created.keys.add(made.id ?? '');
		expect(/^tskey-auth-/.test(made.key ?? '')).toBe(true);
		const read = await api.keys.get({ keyId: made.id ?? '' });
		expect(read.description).toBe(NAME);
		expect(read.capabilities?.devices?.create?.ephemeral).toBe(true);
		const result = await api.keys.delete({ keyId: made.id ?? '' });
		expect(result).toEqual({ success: true });
		created.keys.delete(made.id ?? '');
	});

	it('signs in with an OAuth client secret, within its scopes only', async () => {
		const client = await api.keys.create({
			keyType: 'client',
			description: NAME,
			scopes: ['devices:core:read', 'dns:read'],
		});
		created.keys.add(client.id ?? '');
		expect(/^tskey-client-/.test(client.key ?? '')).toBe(true);

		const scoped = createCorsair({
			plugins: [tailscale({ key: client.key ?? '' })],
		}).tailscale.api;
		const seen = await scoped.devices.list({});
		expect(seen.devices?.map((d) => d?.id)).toContain(deviceId);
		expect(typeof (await scoped.dns.preferences.get({})).magicDNS).toBe(
			'boolean',
		);
		// Outside its scopes: Tailscale refuses (it answers 404 for users).
		expect([403, 404]).toContain(await statusOf(scoped.users.list({})));

		const updated = await api.keys.update({
			keyId: client.id ?? '',
			keyType: 'client',
			scopes: ['devices:core:read', 'dns:read', 'users:read'],
		});
		expect(updated.scopes).toContain('users:read');

		await api.keys.delete({ keyId: client.id ?? '' });
		created.keys.delete(client.id ?? '');
	});

	it('manages a webhook endpoint', async () => {
		// A whole category and the generic format (providerType ""), which the
		// spec's enums leave out but Tailscale takes.
		const hook = await api.webhooks.create({
			endpointUrl: `https://example.com/${NAME}`,
			providerType: '',
			subscriptions: ['categoryTailnetManagement'],
		});
		if (hook.endpointId) created.webhooks.add(hook.endpointId);
		expect(hook.endpointId).toBeTruthy();
		expect(Boolean(hook.secret)).toBe(true);
		expect(hook.subscriptions).toContain('categoryTailnetManagement');
		const endpointId = hook.endpointId ?? '';

		expect((await api.webhooks.get({ endpointId })).endpointUrl).toBe(
			`https://example.com/${NAME}`,
		);
		const changed = await api.webhooks.update({
			endpointId,
			subscriptions: ['nodeCreated', 'nodeDeleted'],
		});
		expect(changed.subscriptions).toEqual(
			expect.arrayContaining(['nodeCreated', 'nodeDeleted']),
		);
		expect(await api.webhooks.test({ endpointId })).toEqual({ success: true });
		const rotated = await api.webhooks.rotateSecret({ endpointId });
		expect(Boolean(rotated.secret)).toBe(true);
		expect(rotated.secret !== hook.secret).toBe(true);

		await api.webhooks.delete({ endpointId });
		created.webhooks.delete(endpointId);
		expect(await statusOf(api.webhooks.get({ endpointId }))).toBe(404);
	});

	it('creates and deletes a Tailscale Service', async () => {
		// This run's Service is new: never update and then delete someone's.
		expect(await statusOf(api.services.get({ serviceName: SERVICE }))).toBe(
			404,
		);
		created.service = true;
		const service = await api.services.update({
			serviceName: SERVICE,
			comment: NAME,
			ports: ['tcp:443'],
		});
		expect(service.name).toBe(SERVICE);
		expect((await api.services.get({ serviceName: SERVICE })).comment).toBe(
			NAME,
		);
		const listed = await api.services.list({});
		expect(listed.vipServices?.map((s) => s?.name)).toContain(SERVICE);
		const hosts = await api.services.hosts.list({ serviceName: SERVICE });
		expect(hosts).toEqual(expect.any(Object));
		expect(['ok', 400, 404]).toContain(
			await statusOf(
				api.services.hosts.getApproval({ serviceName: SERVICE, deviceId }),
			),
		);

		await api.services.delete({ serviceName: SERVICE });
		created.service = false;
		expect(await statusOf(api.services.get({ serviceName: SERVICE }))).toBe(
			404,
		);
	});

	it('registers and removes an OAuth app', async () => {
		const app = await api.oauthApps.create({
			name: NAME,
			redirectURIs: ['https://example.com/callback'],
			scopes: ['auth_keys:create:once'],
		});
		if (app.id) created.oauthApps.add(app.id);
		expect(app.id).toBeTruthy();
		const appId = app.id ?? '';
		expect((await api.oauthApps.get({ appId })).name).toBe(NAME);
		const changed = await api.oauthApps.update({
			appId,
			name: `${NAME}-2`,
			redirectURIs: ['https://example.com/callback'],
			scopes: ['auth_keys:create:once'],
		});
		expect(changed.name).toBe(`${NAME}-2`);
		await api.oauthApps.delete({ appId });
		created.oauthApps.delete(appId);
	});

	it('makes invite links without emailing anyone, then deletes them', async () => {
		const shares = await api.deviceInvites.create({
			deviceId,
			invites: [{ multiUse: false }],
		});
		const share = shares?.[0];
		if (share?.id) created.deviceInvites.add(share.id);
		expect(/^https:\/\//.test(share?.inviteUrl ?? '')).toBe(true);
		expect(
			(await api.deviceInvites.get({ deviceInviteId: share?.id ?? '' })).id,
		).toBe(share?.id);
		await api.deviceInvites.delete({ deviceInviteId: share?.id ?? '' });
		created.deviceInvites.delete(share?.id ?? '');

		const invites = await api.userInvites.create({
			invites: [{ role: 'member' }],
		});
		const invite = invites?.[0];
		if (invite?.id) created.userInvites.add(invite.id);
		expect(/^https:\/\//.test(invite?.inviteUrl ?? '')).toBe(true);
		expect(
			(await api.userInvites.get({ userInviteId: invite?.id ?? '' })).role,
		).toBe('member');
		await api.userInvites.delete({ userInviteId: invite?.id ?? '' });
		created.userInvites.delete(invite?.id ?? '');
	});

	it('adds and removes one split DNS domain', async () => {
		// The domain is this run's own, so the update touches nothing else.
		expect((await api.dns.splitDns.get({}))[SPLIT_DOMAIN]).toBeUndefined();
		created.splitDomain = true;
		const added = await api.dns.splitDns.update({
			domains: { [SPLIT_DOMAIN]: ['1.1.1.1'] },
		});
		expect(added[SPLIT_DOMAIN]).toEqual(['1.1.1.1']);
		const removed = await api.dns.splitDns.update({
			domains: { [SPLIT_DOMAIN]: null },
		});
		expect(removed[SPLIT_DOMAIN]).toBeUndefined();
		created.splitDomain = false;
	});

	(tailnetWrites ? it : it.skip)(
		'writes back unchanged DNS search paths, MagicDNS and a tailnet setting',
		async () => {
			const paths = await api.dns.searchPaths.list({});
			const samePaths = await api.dns.searchPaths.set({
				searchPaths: (paths.searchPaths ?? []).filter(
					(p): p is string => typeof p === 'string',
				),
			});
			expect(samePaths.searchPaths ?? []).toEqual(paths.searchPaths ?? []);
			const prefs = await api.dns.preferences.get({});
			const samePrefs = await api.dns.preferences.set({
				magicDNS: prefs.magicDNS ?? true,
			});
			expect(samePrefs.magicDNS).toBe(prefs.magicDNS);

			const settings = await api.tailnetSettings.get({});
			// Tailscale answers null here, so the call reports success only.
			const sameSettings = await api.tailnetSettings.update({
				devicesAutoUpdatesOn: settings.devicesAutoUpdatesOn ?? null,
			});
			expect(sameSettings).toEqual({ success: true });
			expect((await api.tailnetSettings.get({})).devicesAutoUpdatesOn).toBe(
				settings.devicesAutoUpdatesOn,
			);
		},
	);

	it('sets and deletes a custom posture attribute (or reports the plan limit)', async () => {
		created.postureOn = deviceId;
		const attempt = await statusOf(
			api.devices.postureAttributes.set({
				deviceId,
				attributeKey: POSTURE_KEY,
				value: true,
				comment: NAME,
			}),
		);
		// Custom posture attributes need a paid plan: 403 "feature not
		// available on current billing plan" on Personal.
		if (attempt === 403) {
			created.postureOn = '';
			console.warn('[tailscale] custom posture attributes: plan limit (403)');
			return;
		}
		expect(attempt).toBe('ok');
		const read = await api.devices.postureAttributes.get({ deviceId });
		expect(read.attributes?.[POSTURE_KEY]).toBe(true);
		await api.devices.postureAttributes.delete({
			deviceId,
			attributeKey: POSTURE_KEY,
		});
		created.postureOn = '';
		const after = await api.devices.postureAttributes.get({ deviceId });
		expect(after.attributes?.[POSTURE_KEY]).toBeUndefined();
	});

	it('left nothing behind', async () => {
		const keys = await api.keys.list({ all: true });
		expect(keys.keys?.filter((k) => k?.description === NAME) ?? []).toEqual([]);
		const hooks = await api.webhooks.list({});
		expect(
			(hooks.webhooks ?? []).filter((w) => w?.endpointUrl?.includes(NAME)),
		).toEqual([]);
		const apps = await api.oauthApps.list({});
		expect(
			(apps.oauthApps ?? []).filter((a) => a?.name?.startsWith(NAME)),
		).toEqual([]);
		const services = await api.services.list({});
		expect(
			(services.vipServices ?? []).filter((s) => s?.name === SERVICE),
		).toEqual([]);
	});
});
