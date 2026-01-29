import { corsair } from '@/server/corsair';
import 'dotenv/config';

const main = async () => {
	const test2 = await corsair
		.withTenant('default')
		.slack.keys.setAccessToken('hello access token');

	console.log(test2);
};

main();
