import { corsair } from './';

const main = async () => {
	// const getChannels = await corsair
	// 	.withTenant('default')
	// 	.slack.api.channels.list({ team_id: 'T07E4AUA4LF' });

	// console.log(getChannels);

	const channels = (
		await corsair.withTenant('default').slack.db.channels.list({})
	).map((channel) => channel.data);

	const archivedChannels = channels.filter(
		(channel) => channel.is_archived === true,
	);

	console.log(archivedChannels.length);
};

// biome-ignore lint/nursery/noFloatingPromises: this is just for cli testing right now
main();
