import { lobEndpointsNested } from './endpoints';
import type { LobContext } from './index';

/**
 * Live smoke tests against the real API. Gated on `LOB_API_KEY`, and only a
 * TEST key (`test_...`, dashboard.lob.com/settings/api-keys): in test mode
 * Lob never prints, mails, charges or moves money, verifications return
 * simulated results, and mailpieces stay virtual. A `live_` key is refused,
 * because the round trips below send and cancel mail.
 *
 * Every read runs through the output schemas. Writes are round trips that
 * clean up after themselves (create, read, delete or cancel); billing groups
 * have no delete, so one named `corsair-plugin-test` stays behind. Groups
 * Lob gates per account (campaigns, uploads, Informed Delivery, the URL
 * shortener, buckslips, cards, booklets, snap packs) answer 403/404 when the
 * feature is off; those tests log the status instead of failing.
 *
 * CI ignores this file by name (`api.test.ts`), so it only runs through
 * `pnpm --filter @corsair-dev/lob test:live`.
 */
const API_KEY = process.env.LOB_API_KEY;
const IS_TEST_KEY = API_KEY?.startsWith('test_') ?? false;

const describeIfKey = IS_TEST_KEY ? describe : describe.skip;

if (!API_KEY) {
	// Say so out loud: a skipped run must not read as a green one.
	console.warn(
		'LOB_API_KEY is not set, so the Lob live smoke tests are skipped. Create a test key at dashboard.lob.com/settings/api-keys and export it to run them.',
	);
} else if (!IS_TEST_KEY) {
	console.warn(
		'LOB_API_KEY is not a test_ key, so the Lob live smoke tests are skipped: they send and cancel mail, which a live key would print and bill.',
	);
}

// unknown: only ctx.key is read; the full CorsairPluginContext needs a
// database handle the live calls never touch.
const ctx = {
	key: API_KEY,
	$getAccountId: async () => 'lob-live-test',
} as unknown as LobContext;
const api = lobEndpointsNested;

const TAG = 'corsair-plugin-test';
const TO = {
	name: 'Corsair Plugin Test',
	address_line1: '210 King St',
	address_city: 'San Francisco',
	address_state: 'CA',
	address_zip: '94107',
};

/** Runs a call on a feature Lob may have switched off for the account. */
async function gated<T>(
	label: string,
	run: () => Promise<T>,
): Promise<T | undefined> {
	try {
		return await run();
	} catch (error) {
		const { status, message } = error as { status?: number; message?: string };
		// A fresh test account answers 403 (billing groups, snap packs,
		// booklets, Informed Delivery, campaign creates), 404 (self mailers)
		// or 422 `<feature>_not_allowed` (buckslips, cards).
		const notAllowed = status === 422 && /_not_allowed\b/.test(message ?? '');
		if (status === 403 || status === 404 || notAllowed) {
			console.warn(`${label}: ${status}, feature not enabled on this account`);
			return undefined;
		}
		throw error;
	}
}

describeIfKey('Lob live API (test key)', () => {
	jest.setTimeout(60_000);

	it('reads the balance (live keys only: a test key gets 401)', async () => {
		// Lob answers GET /accounts with 401 invalid_api_key for every test
		// key, while every other route accepts it.
		await expect(api.account.getBalance(ctx, {})).rejects.toMatchObject({
			status: 401,
		});
	});

	it('runs the verification family', async () => {
		const zip = await api.zip.usZipLookup(ctx, { zip_code: '94107' });
		expect(zip.cities.length).toBeGreaterThan(0);
		const auto = await api.autocomplete.usAutocomplete(ctx, {
			address_prefix: '185 Industrial P',
		});
		expect(Array.isArray(auto.suggestions)).toBe(true);
		const us = await api.usVerifications.verify(ctx, {
			primary_line: '210 King Street',
			city: 'San Francisco',
			state: 'CA',
			zip_code: '94107',
		});
		expect(us.deliverability).toBeDefined();
		const intl = await api.intlVerifications.verify(ctx, {
			primary_line: '370 Water St',
			city: 'Summerside',
			state: 'Prince Edward Island',
			postal_code: 'C1N 1C4',
			country: 'CA',
		});
		expect(intl.deliverability).toBeDefined();
		// Bulk verification answers a dummy response on a test key.
		await api.usVerifications.bulk(ctx, {
			addresses: [{ primary_line: '210 King Street', zip_code: '94107' }],
		});
		await api.intlVerifications.bulk(ctx, {
			addresses: [{ primary_line: '370 Water St', country: 'CA' }],
		});
		await api.reverseGeocode.lookup(ctx, {
			latitude: 37.777456,
			longitude: -122.393039,
			size: 2,
		});
		await gated('identityValidation.validate', () =>
			api.identityValidation.validate(ctx, {
				recipient: 'Corsair Plugin Test',
				primary_line: '210 King St',
				zip_code: '94107',
			}),
		);
	});

	it('pages every list', async () => {
		const lists: [string, () => Promise<unknown>][] = [
			['addresses', () => api.addresses.list(ctx, { limit: 2 })],
			['postcards', () => api.postcards.list(ctx, { limit: 2 })],
			['letters', () => api.letters.list(ctx, { limit: 2 })],
			['checks', () => api.checks.list(ctx, { limit: 2 })],
			['selfMailers', () => api.selfMailers.list(ctx, { limit: 2 })],
			['snapPacks', () => api.snapPacks.list(ctx, { limit: 2 })],
			['booklets', () => api.booklets.list(ctx, { limit: 2 })],
			['bankAccounts', () => api.bankAccounts.list(ctx, { limit: 2 })],
			['billingGroups', () => api.billingGroups.list(ctx, { limit: 2 })],
			['buckslips', () => api.buckslips.list(ctx, { limit: 2 })],
			['cards', () => api.cards.list(ctx, { limit: 2 })],
			['campaigns', () => api.campaigns.list(ctx, { limit: 2 })],
			['templates', () => api.templates.list(ctx, { limit: 2 })],
			['uploads', () => api.uploads.list(ctx, {})],
			['informedDelivery', () => api.informedDelivery.list(ctx, {})],
			['domains', () => api.domains.list(ctx, { limit: 2 })],
			['links', () => api.links.list(ctx, { limit: 2 })],
			['qrCodes', () => api.qrCodes.list(ctx, { limit: 2 })],
		];
		for (const [label, run] of lists) {
			await gated(`${label}.list`, run);
		}
	});

	it('creates, reads and deletes an address', async () => {
		const created = await api.addresses.create(ctx, {
			...TO,
			description: TAG,
		});
		const id = String(created.id);
		expect((await api.addresses.get(ctx, { id })).id).toBe(id);
		expect((await api.addresses.delete(ctx, { id })).deleted).toBe(true);
	});

	it('sends, reads and cancels a test postcard and letter', async () => {
		const postcard = await api.postcards.send(ctx, {
			to: TO,
			front: '<html style="font-size:36px">corsair-plugin-test</html>',
			back: '<html style="font-size:24px">front</html>',
			use_type: 'operational',
			description: TAG,
		});
		const psc = String(postcard.id);
		expect((await api.postcards.get(ctx, { id: psc })).id).toBe(psc);
		expect((await api.postcards.cancel(ctx, { id: psc })).deleted).toBe(true);

		const letter = await api.letters.send(ctx, {
			to: TO,
			from: TO,
			file: '<html>corsair-plugin-test</html>',
			color: false,
			use_type: 'operational',
			description: TAG,
		});
		const ltr = String(letter.id);
		expect((await api.letters.get(ctx, { id: ltr })).id).toBe(ltr);
		expect((await api.letters.cancel(ctx, { id: ltr })).deleted).toBe(true);
	});

	it('sends, reads and cancels a test self mailer when self mailers are enabled', async () => {
		const mailer = await gated('selfMailers.send', () =>
			api.selfMailers.send(ctx, {
				to: TO,
				inside: '<html>inside</html>',
				outside: '<html>outside</html>',
				use_type: 'operational',
				description: TAG,
			}),
		);
		if (!mailer) return;
		const sfm = String(mailer.id);
		expect((await api.selfMailers.get(ctx, { id: sfm })).id).toBe(sfm);
		expect((await api.selfMailers.cancel(ctx, { id: sfm })).deleted).toBe(true);
	});

	it('round-trips a template and a version', async () => {
		const template = await api.templates.create(ctx, {
			html: '<html>{{name}}</html>',
			engine: 'handlebars',
			description: TAG,
		});
		const tmpl = String(template.id);
		try {
			const version = await api.templateVersions.create(ctx, {
				template_id: tmpl,
				html: '<html>v2 {{name}}</html>',
				engine: 'handlebars',
				description: TAG,
			});
			const vrsn = String(version.id);
			await api.templateVersions.get(ctx, { template_id: tmpl, id: vrsn });
			await api.templateVersions.update(ctx, {
				template_id: tmpl,
				id: vrsn,
				description: `${TAG} v2`,
			});
			await api.templateVersions.list(ctx, { template_id: tmpl });
			await api.templates.update(ctx, { id: tmpl, description: `${TAG} 2` });
			await api.templates.get(ctx, { id: tmpl });
		} finally {
			await api.templates.delete(ctx, { id: tmpl });
		}
	});

	it('creates and renames a billing group (no delete exists)', async () => {
		const group = await gated('billingGroups.create', () =>
			api.billingGroups.create(ctx, { name: TAG }),
		);
		if (!group) return;
		const bg = String(group.id);
		await api.billingGroups.get(ctx, { id: bg });
		await api.billingGroups.update(ctx, { id: bg, description: TAG });
	});

	it('round-trips a test bank account and a check', async () => {
		const bank = await api.bankAccounts.create(ctx, {
			routing_number: '322271627',
			account_number: '123456789',
			account_type: 'company',
			signatory: 'Corsair Plugin Test',
			description: TAG,
		});
		const id = String(bank.id);
		try {
			await api.bankAccounts.get(ctx, { id });
			// Test mode accepts any two amounts.
			await api.bankAccounts.verify(ctx, { id, amounts: [11, 35] });
			const check = await api.checks.send(ctx, {
				to: TO,
				from: TO,
				bank_account: id,
				amount: 1,
				memo: TAG,
				message: TAG,
				use_type: 'operational',
			});
			const chk = String(check.id);
			await api.checks.get(ctx, { id: chk });
			await api.checks.cancel(ctx, { id: chk });
		} finally {
			await api.bankAccounts.delete(ctx, { id });
		}
	});

	it('round-trips a short link when the URL shortener is enabled', async () => {
		const link = await gated('links.create', () =>
			api.links.create(ctx, {
				redirect_link: 'https://corsair.dev/?ref=corsair-plugin-test',
				title: TAG,
			}),
		);
		if (!link) return;
		const id = String(link.id);
		try {
			expect((await api.links.get(ctx, { id })).id).toBe(id);
			await api.links.update(ctx, {
				id,
				redirect_link: 'https://corsair.dev/?ref=corsair-plugin-test-2',
				title: `${TAG} 2`,
			});
		} finally {
			await api.links.delete(ctx, { id });
		}
	});

	it('creates and deletes a draft campaign when campaigns are enabled', async () => {
		const campaign = await gated('campaigns.create', () =>
			api.campaigns.create(ctx, {
				name: TAG,
				schedule_type: 'immediate',
				use_type: 'operational',
			}),
		);
		if (!campaign?.id) return;
		try {
			await api.campaigns.get(ctx, { id: campaign.id });
			await api.campaigns.update(ctx, {
				id: campaign.id,
				description: TAG,
			});
		} finally {
			await api.campaigns.delete(ctx, { id: campaign.id });
		}
	});
});
