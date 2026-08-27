import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

import { corsair } from '@/server/corsair';

const main = async () => {
	if (process.env.BEAMER_API_KEY) {
		const posts = await corsair.beamer.api.posts.get({ limit: 1 });
		console.log('Beamer posts.get succeeded:', posts);
	} else {
		console.log('BEAMER_API_KEY is not set; skipping live Beamer request.');
	}
};

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
