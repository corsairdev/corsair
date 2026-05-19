import 'dotenv/config';

import { corsair } from '@/server/corsair';

const main = async () => {
	if (!process.env.XQUIK_API_KEY) {
		console.log('Set XQUIK_API_KEY to run the Xquik demo request.');
		return;
	}

	const trends = await corsair.xquik.trends.get({
		count: 5,
		woeid: 1,
	});

	console.log(trends);
};

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
