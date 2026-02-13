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
	// await corsair.withTenant('default').linear.keys.setApiKey(process.env.LINEAR_API_KEY!);

	// await corsair.withTenant('default').github.keys.setApiKey(process.env.GITHUB_TOKEN!);
	// await corsair.keys.googlesheets.issueNewDEK()
	// await corsair.keys.googlesheets.setClientId(process.env.GOOGLE_CLIENT_ID!)
	// await corsair.keys.googlesheets.setClientSecret(process.env.GOOGLE_CLIENT_SECRET!)

	// await corsair.withTenant('default').googlesheets.keys.issueNewDEK()

    // await corsair.withTenant('default').googlesheets.keys.setAccessToken(process.env.GOOGLE_ACCESS_TOKEN!);
    // await corsair.withTenant('default').googlesheets.keys.setRefreshToken(process.env.GOOGLE_REFRESH_TOKEN!);

	await corsair.withTenant('default').posthog.keys.issueNewDEK()

	await corsair.withTenant('default').posthog.keys.setApiKey(process.env.POSTHOG_API_KEY!)
};

main();
