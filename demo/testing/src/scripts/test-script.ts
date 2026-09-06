import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

import { corsair } from '@/server/corsair';

const main = async () => {
	const models = await corsair.writer.models.list({});
	console.log('Writer models:', models);
};

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
