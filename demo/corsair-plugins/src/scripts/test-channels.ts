import { corsair } from '@/server/corsair';
import 'dotenv/config';

const main = async () => {
	const res = await corsair
		.withTenant('default')
		.resend.api.emails.get({ id: 'f99eea9d-41ca-4a32-a4c5-173eaab9ff9d' });

	console.log(res);

	// ({
	// 	from: 'noreply@updates.corsair.dev',
	// 	to: 'dev@corsair.dev',
	// 	subject: 'Hello',
	// 	text: 'hi there',
	// });
};

main();
