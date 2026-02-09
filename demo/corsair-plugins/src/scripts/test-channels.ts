import { corsair } from '@/server/corsair';
import 'dotenv/config';

const main = async () => {
	const res = await corsair
		.withTenant('default')
		.linear.keys.getWebhookSignature();

	console.log(res);

	const test = await corsair.withTenant('default').linear.db.issues.search({
		data: {
			completedAt: {
				between: [new Date(), new Date()],
			},
		},
	});
};

main();
