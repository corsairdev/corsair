import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

import { corsair } from '@/server/corsair';

const main = async () => {
	console.log('Testing Better Proposals API connection...');

	try {
		const settings = await corsair.betterproposals.api.settings.get({});

		console.log('✅ Better Proposals API connection successful!');
		console.dir(settings, { depth: null });
	} catch (error) {
		console.error('❌ Better Proposals API test failed:');

		if (error instanceof Error) {
			console.error(error.message);
			console.error(error.stack);
		} else {
			console.error(error);
		}

		process.exitCode = 1;
	}
};

main();
