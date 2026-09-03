import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

import { corsair } from '@/server/corsair';

const main = async () => {
	const result = await corsair.browsertool.runBrowserTask({
		task: 'Open https://example.com and tell me the title of the page.',
		start_url: 'https://example.com',
		max_steps: 5,
	});

	console.log('Browser Tool result:');
	console.dir(result, { depth: null });
};

main().catch((err) => {
	console.error('Browser Tool test failed:');
	console.error(err);
	process.exit(1);
});
