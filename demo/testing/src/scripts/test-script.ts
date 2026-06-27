import 'dotenv/config';

import { corsair } from '@/server/corsair';

const main = async () => {
	const res = await corsair.slack.api.messages.post({
		channel: 'general',
		text: 'hello',
	});
};

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
