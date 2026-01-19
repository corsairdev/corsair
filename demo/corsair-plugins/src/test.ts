import { corsair } from './';

const main = async () => {
	const message = await corsair
		.withTenant('default-1').gmail.api.messages.get({id: '19b36e3921d45e23'});
	console.log(message);
};

// biome-ignore lint/nursery/noFloatingPromises: this is just for cli testing right now
main();