import { corsair } from '@/server/corsair';
import 'dotenv/config';

const main = async () => {
	const res = await corsair
		.withTenant('default')
		.linear.keys.setWebhookSignature('lin_wh_h727o1AhkQuVUSWcC4LEn4Mv1Cho0zcdFSQPD07wFfM1')
	// ({
	// 	from: 'noreply@updates.corsair.dev',
	// 	to: 'dev@corsair.dev',
	// 	subject: 'Hello',
	// 	text: 'hi there',
	// });
};

main();
