import { corsair } from './';

const main = async () => {
	const message = await corsair
		.withTenant('default-1')
		.slack.db.messages.findById('3bc35797-88db-43bd-8692-2392fb50e470');

	console.log(message);
};

// biome-ignore lint/nursery/noFloatingPromises: this is just for cli testing right now
main();
