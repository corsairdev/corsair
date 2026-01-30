import { corsair } from '@/server/corsair';
import 'dotenv/config';

const main = async () => {
	console.log('Testing Linear integration...');

	try {
		const linearClient = corsair.withTenant('default').linear;

		// List teams
		const teams = await linearClient.api.teams.list({});

		console.log('\nAvailable teams:');
		teams.nodes.forEach((team) => {
			console.log(`- ${team.name} (${team.id})`);
		});

		console.log('\nTest completed successfully!');
	} catch (error) {
		console.error('Error testing Linear:', error);
		throw error;
	}
};

main();
