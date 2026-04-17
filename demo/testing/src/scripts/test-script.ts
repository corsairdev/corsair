import 'dotenv/config';

import { setupCorsair } from 'corsair/setup';
import { corsair } from '@/server/corsair';

const main = async () => {
	const res = await corsair.onedrive.api.drive.list({})
};

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
