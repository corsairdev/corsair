import { Gorgias } from './endpoints';
import type { GorgiasContext } from './index';

const email = process.env.GORGIAS_EMAIL;
const apiKey = process.env.GORGIAS_API_KEY;
const subdomain = process.env.GORGIAS_SUBDOMAIN;
const hasCredentials = Boolean(email && apiKey && subdomain);
if (!hasCredentials) {
	console.warn(
		'[gorgias] live smoke skipped; set GORGIAS_EMAIL, GORGIAS_API_KEY, and GORGIAS_SUBDOMAIN to enable it.',
	);
}

const liveTest = hasCredentials ? it : it.skip;

liveTest(
	'retrieves the configured account without printing credentials',
	async () => {
		const ctx: GorgiasContext = {
			endpoints: {},
			$getAccountId: () => Promise.resolve('live-test-account'),
			key: apiKey ?? '',
			options: {},
			keys: {
				get_dek: () => Promise.resolve('live-test-dek'),
				issue_new_dek: () => Promise.resolve('live-test-dek'),
				get_api_key: () => Promise.resolve(apiKey ?? null),
				set_api_key: () => Promise.resolve(),
				get_email: () => Promise.resolve(email ?? null),
				set_email: () => Promise.resolve(),
				get_tenant_external_id: () => Promise.resolve(subdomain ?? null),
				set_tenant_external_id: () => Promise.resolve(),
				get_webhook_signature: () => Promise.resolve(null),
				set_webhook_signature: () => Promise.resolve(),
			},
			db: {},
		};
		const account = await Gorgias.account.getAccount(ctx, {});
		expect(account.domain).toBeTruthy();
		expect(account.domain).not.toContain(apiKey ?? '');
	},
);
