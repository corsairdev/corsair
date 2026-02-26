import { corsair } from '@/server/corsair';
import 'dotenv/config';

const main = async () => {
	const res = corsair.get_schema('slac');

	console.log(res);
};

main();
