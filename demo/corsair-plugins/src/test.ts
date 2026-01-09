import { corsair } from './';

const main = async () => {
	const res = await corsair
		.withTenant('j')
		.slack.channels.deleteByResourceId('123');

	console.log(res);
};

main();
