import { corsair } from './';

const main = async () => {
	// const message = await corsair
	// 	.withTenant('default-1')
	// 	.slack.api.messages.post({ channel: 'C0A3ZTB9X7X', text: 'hello' });
	// console.log(message);

	const message = await corsair
		.withTenant('default-1')
		.slack.db.messages.findById('3bc35797-88db-43bd-8692-2392fb50e470');

	console.log(message);

	// // Now using the nested API: corsair.slack.api.reactions.add
	// const res = await corsair.slack.api.reactions.add({
	// 	channel: message?.data.channel || '',
	// 	name: 'thumbsup',
	// 	timestamp: message?.data.ts || '',
	// });
};

// biome-ignore lint/nursery/noFloatingPromises: this is just for cli testing right now
main();
