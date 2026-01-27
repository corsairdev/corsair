import 'dotenv/config';
import { corsair } from '../server/corsair';

const main = async () => {
	// const res = await corsair.withTenant('default').linear.api.projects.list({});

	// console.log(res);

	const test = await corsair.withTenant('default').linear.api.projects.list({});

	console.log(test);
};

main();
