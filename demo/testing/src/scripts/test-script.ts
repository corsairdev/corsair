import { corsair } from '@/server/corsair';
import 'dotenv/config';

const main = async () => {
	const person = await corsair.chmeetings.person.get({ id: '4633264' });
	console.log(person);
};

main();
