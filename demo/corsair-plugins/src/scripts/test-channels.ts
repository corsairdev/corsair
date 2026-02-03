import { corsair } from '@/server/corsair';
import 'dotenv/config';

const main = async () => {
	const res = await corsair.withTenant('default').linear.db.comments.search({
		data: {
			editedAt: 'sdk-test',
		},
	});
	console.log(res);
};

main();
