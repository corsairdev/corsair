import { corsair } from '@/server/corsair';
import 'dotenv/config';

const main = async () => {
	const res = corsair.get_schema('slack.api.channels.gethistory');
	// const res = corsair.get_methods();

	console.log(JSON.stringify(res, null, 2));
};

main();
