import 'dotenv/config';

import { setupCorsair } from 'corsair/setup';
import { corsair } from '@/server/corsair';

const main = async () => {
	// write any test scripts here
	// const res = await corsair -> fill in the rest
	const res = await corsair.googlesheets.api.spreadsheets.list({});
};

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
