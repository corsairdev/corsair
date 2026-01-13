import { corsair } from './';

const main = async () => {
	const message =
		await corsair.slack.db.messages.findByResourceId('1768233685.811009');

	// console.log(message);
	// Now using the nested API: corsair.slack.api.reactions.add
	const res = await corsair.slack.api.reactions.add({
		channel: message?.data.channel || '',
		name: 'thumbsup',
		timestamp: message?.data.ts || '',
	});
};

// main();
