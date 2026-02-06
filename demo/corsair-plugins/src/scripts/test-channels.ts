import { corsair } from '@/server/corsair';
import 'dotenv/config';

const main = async () => {
	const res = await corsair
		.withTenant('default')
		.github.keys.setWebhookSignature('secret')
	// ({
	// 	from: 'noreply@updates.corsair.dev',
	// 	to: 'dev@corsair.dev',
	// 	subject: 'Hello',
	// 	text: 'hi there',
	// });
};

main();
