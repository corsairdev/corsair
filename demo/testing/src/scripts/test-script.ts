import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

import { corsair } from '@/server/corsair';

const main = async () => {
	// Test the Groqcloud integration by fetching the static voice list
	const voices = await corsair.groqcloud.api.audioListVoices({});
	console.log('Voices:', voices);

	// Optionally test another endpoint (requires GROQCLOUD_API_KEY in .env)
	// const models = await corsair.groqcloud.api.modelsListModels({});
	// console.log('Models:', models);
};

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
