import { inngest } from '@/server/inngest/client';
import 'dotenv/config';

const main = async () => {
	console.log('Triggering test Inngest event...');

	try {
		const result = await inngest.send({
			name: 'test/event',
			data: {
				message: 'Hello from trigger script!',
				timestamp: new Date().toISOString(),
			},
		});

		console.log('Event sent successfully!');
		console.log('Event ID:', result.ids[0]);
		console.log('\nYou should see this event in your Inngest dashboard.');
		console.log(
			'Make sure your Inngest dev server is running with: npm run inngest:dev',
		);
	} catch (error) {
		console.error('Error triggering event:', error);
		throw error;
	}
};

main();
