import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

import { corsair } from '@/server/corsair';

async function setInstagramCredentials() {
	const { FACEBOOK_APP_ID, FACEBOOK_APP_SECRET, IG_ACCESS_TOKEN } = process.env;

	if (FACEBOOK_APP_ID) {
		await corsair.keys.instagram.set_client_id(FACEBOOK_APP_ID);
	}
	if (FACEBOOK_APP_SECRET) {
		await corsair.keys.instagram.set_client_secret(FACEBOOK_APP_SECRET);
	}
	if (IG_ACCESS_TOKEN) {
		await corsair.instagram.keys.set_access_token(IG_ACCESS_TOKEN);
	}
}

async function testAeroLeads() {
	console.log('--- AeroLeads: LinkedIn Profile Lookup ---');
	const profile = await corsair.aeroleads.api.linkedin.getDetails({
		linkedin_url: 'linkedin.com/in/satyanadella',
	});
	console.log('Profile:', JSON.stringify(profile, null, 2));

	console.log('--- AeroLeads: Email Verification ---');
	const emailResult = await corsair.aeroleads.api.email.getCompanyEmail({
		email: 'satya@microsoft.com',
	});
	console.log('Email result:', JSON.stringify(emailResult, null, 2));
}

const main = async () => {
	await testAeroLeads();

	const res = await corsair.slack.api.messages.post({
		channel: 'general',
		text: 'hello',
	});
};

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
