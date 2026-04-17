import 'dotenv/config';

import { setupCorsair } from 'corsair/setup';
import { corsair } from '@/server/corsair';

const main = async () => {
	// const res = await corsair.github.api.pullRequests.get({
	// 	owner: 'corsairdev',
	// 	repo: 'corsair',
	// 	pullNumber: 153,
	// });

	// const res = await corsair.github.api.issueComments.listForIssue({
	// 	owner: 'corsairdev',
	// 	repo: 'corsair',
	// 	issueNumber: 128,
	// });

	const res = await corsair.github.keys.get_api_key();
	const res2 = await corsair.github.keys.get_webhook_signature();

	console.log(
		`pnpm corsair setup --github api_key=${res} webhook_signature=${res2}`,
	);
};

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
