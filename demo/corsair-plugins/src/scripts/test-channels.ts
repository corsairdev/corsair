import { corsair } from '@/server/corsair';
import 'dotenv/config';

const main = async () => {
	const res = await corsair
		.withTenant('default')
		.linear.api.comments.list({ issueId: '' });
};

main();
