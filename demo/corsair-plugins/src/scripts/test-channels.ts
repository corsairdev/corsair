import { corsair } from '@/server/corsair';
import 'dotenv/config';

const main = async () => {
	const res = await corsair.withTenant('default').slack.db.channels.search({
		data: {
			name: 'sdk-test',
		},
	});
	// search({
	// 	data: {
	// 		name: 'sdk-test',
	// 	},
	// });
	console.log(res);
};

main();
