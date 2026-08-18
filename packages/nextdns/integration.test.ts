/**
 * Live checks against a real NextDNS account.
 *
 * Skipped unless `NEXTDNS_API_KEY` is set, so CI and contributors without
 * credentials are unaffected. Unlike a read-only catalog, this plugin has
 * real writes and deletes - so every mutating check here runs against a
 * disposable profile created at the start of the suite and deleted at the
 * end, never against the account's real profiles.
 */
import {
	Allowlist,
	Analytics,
	Auth,
	Denylist,
	Logs,
	ParentalControl,
	Privacy,
	Profiles,
	Rewrites,
	Security,
	Settings,
	Setup,
} from './endpoints';
import {
	NextDNSAnalyticsResponseSchema,
	NextDNSPrivacySchema,
	NextDNSProfileSchema,
	NextDNSSecuritySchema,
} from './endpoints/types';

const apiKey = process.env.NEXTDNS_API_KEY;

const describeLive = apiKey ? describe : describe.skip;

type Ctx = Parameters<typeof Profiles.list>[0];

function makeStore() {
	return {
		upsertByEntityId: async (_id: string, _data: unknown) => undefined,
	};
}

function makeCtx(): Ctx {
	return {
		key: apiKey ?? '',
		db: { profiles: makeStore() },
	} as unknown as Ctx;
}

describeLive('NextDNS live API', () => {
	let profileId: string;

	beforeAll(async () => {
		const created = await Profiles.create(makeCtx(), {
			name: 'claude-integration-test',
		});
		profileId = created.id;
	});

	afterAll(async () => {
		if (profileId) {
			await Profiles.deleteProfile(makeCtx(), { profileId });
		}
	});

	it('lists profiles, including the disposable test profile', async () => {
		const result = await Profiles.list(makeCtx(), {});

		expect(Array.isArray(result)).toBe(true);
		expect(result.some((p) => p.id === profileId)).toBe(true);
	});

	it('gets full profile details matching the declared schema', async () => {
		const result = await Profiles.get(makeCtx(), { profileId });

		expect(NextDNSProfileSchema.safeParse(result).success).toBe(true);
		expect(result.name).toBe('claude-integration-test');
	});

	it('renames the profile', async () => {
		await Profiles.rename(makeCtx(), { profileId, name: 'claude-renamed' });
		const result = await Profiles.get(makeCtx(), { profileId });

		expect(result.name).toBe('claude-renamed');
	});

	it('adds, updates and removes a denylist entry (full lifecycle)', async () => {
		await Denylist.add(makeCtx(), { profileId, id: 'claude-test-example.com' });
		let list = await Denylist.list(makeCtx(), { profileId });
		expect(list.some((e) => e.id === 'claude-test-example.com')).toBe(true);

		await Denylist.update(makeCtx(), {
			profileId,
			id: 'claude-test-example.com',
			active: false,
		});
		list = await Denylist.list(makeCtx(), { profileId });
		expect(list.find((e) => e.id === 'claude-test-example.com')?.active).toBe(
			false,
		);

		await Denylist.remove(makeCtx(), {
			profileId,
			id: 'claude-test-example.com',
		});
		list = await Denylist.list(makeCtx(), { profileId });
		expect(list.some((e) => e.id === 'claude-test-example.com')).toBe(false);
	});

	it('adds and removes an allowlist entry', async () => {
		await Allowlist.add(makeCtx(), { profileId, id: 'claude-test-good.com' });
		let list = await Allowlist.get(makeCtx(), { profileId });
		expect(list.some((e) => e.id === 'claude-test-good.com')).toBe(true);

		await Allowlist.deleteEntry(makeCtx(), {
			profileId,
			id: 'claude-test-good.com',
		});
		list = await Allowlist.get(makeCtx(), { profileId });
		expect(list.some((e) => e.id === 'claude-test-good.com')).toBe(false);
	});

	it('adds and removes a DNS rewrite', async () => {
		const created = await Rewrites.add(makeCtx(), {
			profileId,
			name: 'claude-test.local',
			content: '127.0.0.1',
		});
		expect(created.id).toBeDefined();

		if (created.id) {
			await Rewrites.deleteRewrite(makeCtx(), { profileId, id: created.id });
		}
		const list = await Rewrites.get(makeCtx(), { profileId });
		expect(list.some((r) => r.name === 'claude-test.local')).toBe(false);
	});

	/**
	 * Confirmed live during recon: exactly five valid category ids -
	 * `porn`, `gambling`, `piracy`, `dating`, `social-networks`.
	 */
	it('adds and removes a parental control category using the confirmed vocabulary', async () => {
		await ParentalControl.addCategory(makeCtx(), {
			profileId,
			id: 'gambling',
			active: true,
		});
		let categories = await ParentalControl.getCategories(makeCtx(), {
			profileId,
		});
		expect(categories.some((c) => c.id === 'gambling')).toBe(true);

		await ParentalControl.deleteCategory(makeCtx(), {
			profileId,
			id: 'gambling',
		});
		categories = await ParentalControl.getCategories(makeCtx(), {
			profileId,
		});
		expect(categories.some((c) => c.id === 'gambling')).toBe(false);
	});

	it('adds and removes a blocked TLD', async () => {
		await Security.addBlockedTld(makeCtx(), { profileId, id: 'tk' });
		let tlds = await Security.getTlds(makeCtx(), { profileId });
		expect(tlds.some((t) => t.id === 'tk')).toBe(true);

		await Security.removeBlockedTld(makeCtx(), { profileId, id: 'tk' });
		tlds = await Security.getTlds(makeCtx(), { profileId });
		expect(tlds.some((t) => t.id === 'tk')).toBe(false);
	});

	it('gets security settings matching the declared schema', async () => {
		const result = await Security.get(makeCtx(), { profileId });
		expect(NextDNSSecuritySchema.safeParse(result).success).toBe(true);
	});

	it('updates and reverts a security setting', async () => {
		await Security.update(makeCtx(), { profileId, googleSafeBrowsing: true });
		let result = await Security.get(makeCtx(), { profileId });
		expect(result.googleSafeBrowsing).toBe(true);

		await Security.update(makeCtx(), { profileId, googleSafeBrowsing: false });
		result = await Security.get(makeCtx(), { profileId });
		expect(result.googleSafeBrowsing).toBe(false);
	});

	it('gets privacy settings matching the declared schema', async () => {
		const result = await Privacy.get(makeCtx(), { profileId });
		expect(NextDNSPrivacySchema.safeParse(result).success).toBe(true);
	});

	it('toggles client-IP and domain logging and reads the change back', async () => {
		await Settings.logClientIps(makeCtx(), { profileId, enabled: false });
		let logs = await Settings.getLogs(makeCtx(), { profileId });
		expect(logs.drop?.ip).toBe(true);

		await Settings.logClientIps(makeCtx(), { profileId, enabled: true });
		logs = await Settings.getLogs(makeCtx(), { profileId });
		expect(logs.drop?.ip).toBe(false);
	});

	it('updates the Linked IP setup and gets back a real server list', async () => {
		const result = await Setup.updateLinkedIp(makeCtx(), { profileId });
		expect(Array.isArray(result.servers)).toBe(true);
		expect(result.servers?.length).toBeGreaterThan(0);
	});

	/**
	 * The account has no real DNS query traffic (a disposable profile never
	 * used as an actual resolver), so this only confirms the envelope - a
	 * real 200 with a `data` array and pagination metadata - not any
	 * particular row shape.
	 */
	it('gets analytics status matching the declared envelope', async () => {
		const result = await Analytics.status(makeCtx(), { profileId });
		expect(NextDNSAnalyticsResponseSchema.safeParse(result).success).toBe(true);
	});

	/**
	 * Found during the follow-up Greptile/CodeRabbit verification round:
	 * `type` (`countries`/`gafam`) is required on this one analytics
	 * category - confirmed live it 400s without it. Before this fix,
	 * `analytics.destinations` could never succeed at all.
	 */
	it('gets destinations analytics for both confirmed type values', async () => {
		const countries = await Analytics.destinations(makeCtx(), {
			profileId,
			type: 'countries',
		});
		expect(NextDNSAnalyticsResponseSchema.safeParse(countries).success).toBe(
			true,
		);

		const gafam = await Analytics.destinations(makeCtx(), {
			profileId,
			type: 'gafam',
		});
		expect(NextDNSAnalyticsResponseSchema.safeParse(gafam).success).toBe(true);
	});

	it('gets logs without erroring', async () => {
		const result = await Logs.get(makeCtx(), { profileId });
		expect(Array.isArray(result.data)).toBe(true);
	});

	it('verifies the API key via auth.login', async () => {
		const result = await Auth.login(makeCtx(), {});
		expect(result.valid).toBe(true);
		expect(result.profileCount).toBeGreaterThan(0);
	});

	/**
	 * Found during the verification round: the original implementation only
	 * exposed `disguisedTrackers`/`allowAffiliate` on `privacy.update`, but
	 * the catalog's own description says it can also set `blocklists`/
	 * `natives` in one call - confirmed live here.
	 */
	it('sets a privacy blocklist via privacy.update, not just the dedicated add endpoint', async () => {
		await Privacy.update(makeCtx(), {
			profileId,
			blocklists: [{ id: 'nextdns-recommended' }],
		});
		const result = await Privacy.get(makeCtx(), { profileId });

		expect(result.blocklists?.some((b) => b.id === 'nextdns-recommended')).toBe(
			true,
		);

		await Privacy.update(makeCtx(), { profileId, blocklists: [] });
	});

	/**
	 * Found during the verification round: `profiles.update`'s own catalog
	 * example shows `{"denylist": [{"id": "malware.com", "active": true}]}`,
	 * but the original implementation didn't pass `denylist` through at all.
	 */
	it('sets a denylist entry via profiles.update, not just the dedicated add endpoint', async () => {
		await Profiles.update(makeCtx(), {
			profileId,
			denylist: [{ id: 'claude-verify-round2.com', active: true }],
		});
		const list = await Denylist.list(makeCtx(), { profileId });

		expect(list.some((e) => e.id === 'claude-verify-round2.com')).toBe(true);

		await Denylist.remove(makeCtx(), {
			profileId,
			id: 'claude-verify-round2.com',
		});
	});
});
