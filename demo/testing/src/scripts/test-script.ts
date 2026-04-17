import 'dotenv/config';

import { setupCorsair } from 'corsair/setup';
import { corsair } from '@/server/corsair';

const main = async () => {
	// const res = await corsair.github.api.pullRequests.get({
	// 	owner: 'corsairdev',
	// 	repo: 'corsair',
	// 	pullNumber: 153,
	// });
};

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
