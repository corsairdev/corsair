import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

import { corsair } from '@/server/corsair';

const main = async () => {
	console.log('Exercising Aryn plugin endpoints...');

	const apiKey = process.env.ARYN_API_KEY;
	if (!apiKey) {
		console.warn(
			'ARYN_API_KEY environment variable is not set. Skip actual API calls or expect unauthorized errors.',
		);
	}

	try {
		// 1. Create DocSet
		console.log('1. Creating docset...');
		const docset = await corsair.aryn.api.docset.create({
			name: 'test-docset-from-corsair',
		});
		console.log('Docset created successfully:', docset);

		// 2. Get DocSet Metadata
		console.log('2. Getting docset metadata...');
		const metadata = await corsair.aryn.api.docset.get({
			docset_id: docset.docset_id,
		});
		console.log('Docset metadata:', metadata);

		// 3. Delete DocSet
		console.log('3. Deleting docset...');
		const deletedDocset = await corsair.aryn.api.docset.delete({
			docset_id: docset.docset_id,
		});
		console.log('Docset deleted successfully:', deletedDocset);
	} catch (error) {
		console.error('Error during Aryn plugin execution:', error);
	}
};

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
