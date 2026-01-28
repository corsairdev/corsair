import { corsair } from '@/server/corsair';
import 'dotenv/config';

const main = async () => {
	const test2 = await corsair.withTenant('default').slack.api.messages.post({
		channel: 'C0A3ZTB9X7X',
		text: 'hello',
	});
};

main();
