import 'dotenv/config';

import { corsair } from '@/server/corsair';

const main = async () => {
	const res = await corsair.slack.api.messages.delete({
		channel: '1',
		ts: '2',
	});
};

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
