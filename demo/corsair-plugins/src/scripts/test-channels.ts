import 'dotenv/config';
import { corsair } from '../server/corsair';

const main = async () => {
	console.log('Testing Slack channels API...\n');

	// Example: Get channels from database
	const channels = (
		await corsair.withTenant('default').slack.db.channels.list({})
	).map((channel) => channel.data);

	const archivedChannels = channels.filter(
		(channel) => channel.is_archived === true,
	);

	console.log(`Total channels: ${channels.length}`);
	console.log(`Archived channels: ${archivedChannels.length}`);
	console.log('\nSample channels:');
	channels.slice(0, 5).forEach((channel) => {
		console.log(`  - ${channel.name} (${channel.id})`);
	});
};

main();
