import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

import { corsair } from '@/server/corsair';

const main = async () => {
	console.log('Testing Close CRM Corsair Plugin...');
	console.log('Close plugin initialized:', corsair.close !== undefined);

	if (process.env.CLOSE_API_KEY) {
		console.log('Listing leads from Close CRM...');
		const leads = await corsair.close.api.leads.list({ _limit: 5 });
		console.log('Fetched Close leads successfully:', leads);
	} else {
		console.log(
			'No CLOSE_API_KEY found in environment (skipping live API call).',
		);
	}
};

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
