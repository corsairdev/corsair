import { corsair } from '@/server/corsair';
import 'dotenv/config';

const main = async () => {
	const res = await corsair
		.withTenant('default')
		.resend.keys.setWebhookSignature('whsec_W/pJuK8VpwTDOYSzuJkzU+2Px1vCFmj9')
	// ({
	// 	from: 'noreply@updates.corsair.dev',
	// 	to: 'dev@corsair.dev',
	// 	subject: 'Hello',
	// 	text: 'hi there',
	// });
};

main();
