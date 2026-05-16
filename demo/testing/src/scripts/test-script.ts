import 'dotenv/config';

import { setupCorsair } from 'corsair/setup';
import { corsair } from '@/server/corsair';

const main = async () => {
	const res = await corsair.keys.gmail.get_client_id();
	const res2 = await corsair.keys.gmail.get_client_secret();

	console.log(res);
	console.log(res2);
};

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
