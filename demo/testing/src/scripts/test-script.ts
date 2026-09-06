import { corsair } from '@/server/corsair';
import 'dotenv/config';

const main = async () => {
	try {
		console.log('Testing Everhour plugin...');

		const user = await corsair.everhour.api.user.getUser();
		console.log('Current User:', user);

		const projects = await corsair.everhour.api.projects.listProjects();
		console.log('Projects:', projects);

		const timer = await corsair.everhour.api.timer.getCurrentTimer();
		console.log('Current Timer:', timer);
	} catch (error) {
		console.error('Error testing Everhour plugin:', error);
	}
};

main();
