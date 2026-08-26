import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

import { corsair } from '@/server/corsair';

const main = async () => {
	const res = await corsair.wakatime.api.users.current({});

	console.log('WakaTime current user:', res);
};

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
