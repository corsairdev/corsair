import { corsair } from '@/server/corsair';
import 'dotenv/config';

const main = async () => {
	const test2 = await corsair.withTenant('default').linear.keys.getApiKey();
};

main();
