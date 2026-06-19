import 'dotenv/config';

import { corsair } from '@/server/corsair';

const main = async () => {
	const res = await corsair.keys.gmail.get_client_id();
	const res2 = await corsair.keys.gmail.get_client_secret();
	console.log(
		`pnpm corsair setup --gmail client_id=${res} client_secret=${res2} redirect_url=http://localhost:4318/oauth/callback/hk_CWWlqj1-VKJh2bckU6y5-bSqsAY3VK83noXwL7YCoDw`,
	);
};

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
