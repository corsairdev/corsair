import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

import { corsair } from '@/server/corsair';

async function setInstagramCredentials() {
	const { FACEBOOK_APP_ID, FACEBOOK_APP_SECRET, IG_ACCESS_TOKEN } = process.env;

	if (FACEBOOK_APP_ID) {
		await corsair.keys.instagram.set_client_id(FACEBOOK_APP_ID);
	}
	if (FACEBOOK_APP_SECRET) {
		await corsair.keys.instagram.set_client_secret(FACEBOOK_APP_SECRET);
	}
	if (IG_ACCESS_TOKEN) {
		await corsair.instagram.keys.set_access_token(IG_ACCESS_TOKEN);
	}
}

const main = async () => {
	const clients = await corsair.coassemble.api.clients.get({
		length: 10,
		page: 0,
	});

	console.log('Coassemble clients:', clients);

	const courses = await corsair.coassemble.api.courses.get({
		length: 10,
		page: 0,
	});

	console.log('Coassemble courses:', courses);

	const users = await corsair.coassemble.api.users.get({
		length: 10,
		page: 0,
	});

	console.log('Coassemble users:', users);

	const tracking = await corsair.coassemble.api.trackings.get({
		id: Number(process.env.COASSEMBLE_TRACKING_ID),
	});

	console.log('Coassemble tracking:', tracking);
};

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
