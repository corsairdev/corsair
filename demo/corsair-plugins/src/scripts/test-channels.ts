import { corsair } from '@/server/corsair';
import 'dotenv/config';

const main = async () => {
	const res = await corsair.withTenant('default').slack.api.messages.post({
		channel: '',
		blocks: [
			{
				type: 'section',
				text: {},
			},
		],
	});
	console.log(res);
};

main();
