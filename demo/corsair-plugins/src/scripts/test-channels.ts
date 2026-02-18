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

	await corsair.keys.gmail.issueNewDEK();
	await corsair.keys.gmail.setClientId(clientId);
	await corsair.keys.gmail.setClientSecret(clientSecret);

	await corsair.withTenant('default').gmail.keys.issueNewDEK();
	await corsair.withTenant('default').gmail.keys.setAccessToken(accessToken);
	await corsair.withTenant('default').gmail.keys.setRefreshToken(refreshToken);
};

main();
