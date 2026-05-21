import 'dotenv/config';

import { corsair } from '@/server/corsair';

const main = async () => {
	const res = await corsair.hubspot.api.contacts.search({
		query: 'test',
		limit: 5,
	});
};

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
