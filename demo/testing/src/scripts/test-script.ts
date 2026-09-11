import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

import { corsair } from '@/server/corsair';

async function setInstagramCredentials() {
	const { FACEBOOK_APP_ID, FACEBOOK_APP_SECRET, IG_ACCESS_TOKEN } = process.env;

	if (FACEBOOK_APP_ID) {
		await corsair.keys.instagram.set_client_id(FACEBOOK_APP_ID);
	}
	if (FACEBOOK_APP_SECRET) {
		await corsair.keys.instagram.set_client_secret(FACEBOOK_APP_SECRET);
	}
	if (IG_ACCESS_TOKEN) {
		await corsair.instagram.keys.set_access_token(IG_ACCESS_TOKEN);
	}
}

async function testBugherd() {
	console.log('Testing BugHerd plugin...');

	// List Projects
	console.log('\n--- List Projects ---');
	const listProjects = await corsair.bugherd.api.projects.list({});
	console.log('Projects:', JSON.stringify(listProjects.data, null, 2));

	// Create Project
	console.log('\n--- Create Project ---');
	const createProject = await corsair.bugherd.api.projects.create({
		data: {
			name: 'Test Project from Corsair',
			description: 'Created via Corsair integration test',
			is_active: true,
			is_public: false,
		},
	});
	console.log('Created Project:', JSON.stringify(createProject.data, null, 2));

	// Create Task (if project was created)
	if (createProject.data?.project?.id) {
		console.log('\n--- Create Task ---');
		const createTask = await corsair.bugherd.api.tasks.create({
			project_id: createProject.data.project.id,
			description: 'Test task created via Corsair',
			priority: 'normal',
			status: 'backlog',
			tag_list: ['test', 'corsair'],
		});
		console.log('Created Task:', JSON.stringify(createTask.data, null, 2));
	}

	// List Users
	console.log('\n--- List Users ---');
	const listUsers = await corsair.bugherd.api.users.list({});
	console.log('Users:', JSON.stringify(listUsers.data, null, 2));
}

const main = async () => {
	await testBugherd();
};

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
