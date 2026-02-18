import { corsair } from '@/server/corsair';
import 'dotenv/config';

const main = async () => {
	// const res = await corsair
	// 	.withTenant('default')
	// 	.linear.keys.getWebhookSignature();

	// console.log(res);

	// const test = await corsair.withTenant('default').linear.db.issues.search({
	// 	data: {
	// 		completedAt: {
	// 			between: [new Date(), new Date()],
	// 		},
	// 	},
	// });

	const clientId = process.env.GOOGLE_CLIENT_ID;
	const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
	const accessToken = process.env.GOOGLE_ACCESS_TOKEN;
	const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

	if (!clientId || !clientSecret || !accessToken || !refreshToken) {
		throw new Error('Missing Google Calendar credentials');
	}

	await corsair.keys.googlesheets.issue_new_dek();
	await corsair.keys.googlesheets.set_client_id(clientId);
	await corsair.keys.googlesheets.set_client_secret(clientSecret);

	await corsair.withTenant('default').googlesheets.keys.issue_new_dek();
	await corsair
		.withTenant('default')
		.googlesheets.keys.set_access_token(accessToken);
	await corsair
		.withTenant('default')
		.googlesheets.keys.set_refresh_token(refreshToken);
};

main();
