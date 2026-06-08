import 'dotenv/config';

import { setupCorsair } from 'corsair/setup';
import { corsair } from '@/server/corsair';

/**
 * Manual E2E exercise for the Zoho Mail plugin .
 *
 * Set these in demo/testing/.env (gitignored — never commit real values):
 *
 *   ZOHO_CLIENT_ID       Self Client → Client Secret tab
 *   ZOHO_CLIENT_SECRET   Self Client → Client Secret tab
 *   ZOHO_ACCESS_TOKEN    from the token exchange (see below)
 *   ZOHO_REFRESH_TOKEN   from the token exchange
 *   ZOHO_REGION          us | eu | in | au | jp | cn   (default us)
 *   CORSAIR_KEK          node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
 *
 * Getting the tokens:
 *   1. Create a Self Client at https://api-console.zoho.com (your region's console).
 *   2. Generate a grant code with scopes:
 *        ZohoMail.messages.ALL,ZohoMail.folders.ALL,ZohoMail.accounts.READ
 *   3. Exchange it (form-urlencoded POST) at
 *        https://accounts.zoho.<tld>/oauth/v2/token
 *      with grant_type=authorization_code, client_id, client_secret, code.
 *      The response carries access_token + refresh_token.
 *   Full walkthrough: docs/plugins/zohomail/get-credentials.mdx
 *
 * Then run from demo/testing/:  pnpm test
 */
async function seedZohoCredentials() {
	const clientId = process.env.ZOHO_CLIENT_ID;
	const clientSecret = process.env.ZOHO_CLIENT_SECRET;
	const accessToken = process.env.ZOHO_ACCESS_TOKEN;
	const refreshToken = process.env.ZOHO_REFRESH_TOKEN;
	if (!clientId || !clientSecret || !accessToken || !refreshToken) {
		throw new Error('Missing ZOHO_* credentials in demo/testing/.env');
	}

	await corsair.keys.zohomail.issue_new_dek();
	await corsair.keys.zohomail.set_client_id(clientId);
	await corsair.keys.zohomail.set_client_secret(clientSecret);

	await corsair.zohomail.keys.issue_new_dek();
	await corsair.zohomail.keys.set_access_token(accessToken);
	await corsair.zohomail.keys.set_refresh_token(refreshToken);
}

const main = async () => {
	await setupCorsair(corsair); // ensure the Corsair tables exist
	await seedZohoCredentials();

	const folders = await corsair.zohomail.api.folders.list({});
	console.log(`folders: ${folders.folders?.length ?? 0}`);

	// No folderId → defaults to the Inbox.
	const inbox = await corsair.zohomail.api.messages.list({ limit: 3 });
	console.log(`inbox messages: ${inbox.messages.length}`);
};

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
