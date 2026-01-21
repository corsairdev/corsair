import { corsair } from './';

const main = async () => {
	const teset = await corsair
		.withTenant('default-1')
		.slack.api.channels.list({  });
	console.log(teset);
};

// biome-ignore lint/nursery/noFloatingPromises: this is just for cli testing right now
main();
