import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

import { bugherd } from '@corsair-dev/bugherd';
import { createCorsair } from 'corsair';
import { sqlite } from '../db';

const corsair = createCorsair({
	multiTenancy: false,
	database: sqlite,
	kek: process.env.CORSAIR_KEK!,
	permissions: {
		timeout: '10m',
		onTimeout: 'deny',
	},
	plugins: [
		bugherd({
			key: process.env.BUGHERD_API_KEY,
		}),
	],
});

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

testBugherd().catch((err) => {
	console.error(err);
	process.exit(1);
});
