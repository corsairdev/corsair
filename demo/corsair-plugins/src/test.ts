import { corsair } from './';

const main = async () => {
	const res = await corsair.slack.db.messages.findById(
		'3bc35797-88db-43bd-8692-2392fb50e470',
	);

	const reaction = await corsair.slack.api.reactions.add({
		channel: res?.data?.channel || '',
		timestamp: res?.data?.ts || '',
		name: ':thumbsup:',
	});

	console.log(res?.data);
	// const message =
	// 	await corsair.slack.db.messages.findByResourceId('1768233685.811009');
	// console.log(message);
	// // Now using the nested API: corsair.slack.api.reactions.add
	// const res = await corsair.slack.api.reactions.add({
	// 	channel: message?.data.channel || '',
	// 	name: 'thumbsup',
	// 	timestamp: message?.data.ts || '',
	// });
};

main();
