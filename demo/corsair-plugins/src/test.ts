import { corsair } from './';

const main = async () => {
	const getMessage = await corsair
		.withTenant('default-1')
		.slack.db.messages.findByResourceId('');

	const postMessage = await corsair.withTenant('').slack.api.messages.post({
		channel: '',
		text: '',
	});
};

// biome-ignore lint/nursery/noFloatingPromises: this is just for cli testing right now
main();
