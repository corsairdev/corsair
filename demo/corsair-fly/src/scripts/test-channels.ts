import { corsair } from '@/server/corsair';
import 'dotenv/config';

const main = async () => {
	console.log('Testing Slack channels...');

	try {
		const slackClient = corsair.withTenant('default').slack;

		// List all conversations
		const conversations = await slackClient.api.channels.list({
			types: 'public_channel,private_channel',
		});

		console.log('\nAvailable channels:');
		conversations.channels?.forEach((channel) => {
			console.log(`- ${channel.name} (${channel.id})`);
		});

		console.log('\nTest completed successfully!');
	} catch (error) {
		console.error('Error testing channels:', error);
		throw error;
	}
};

main();
