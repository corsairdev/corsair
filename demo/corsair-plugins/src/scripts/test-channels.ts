import { corsair } from '@/server/corsair';
import 'dotenv/config';

const main = async () => {
	// const res = await corsair.keys.gmail.get_topic_id();

	const res = await corsair.withTenant('').gmail.keys.get_something_else();

	console.log(res);
};

main();
