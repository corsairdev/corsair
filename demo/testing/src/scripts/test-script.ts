import { corsair } from '@/server/corsair';
import 'dotenv/config';

const main = async () => {
	// write any test scripts here
	// const res = await corsair -> fill in the rest
	const res = await corsair.googlesheets.api.spreadsheets.list({});
};

main();
