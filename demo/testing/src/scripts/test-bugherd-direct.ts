import { makeBugherdRequest } from 'file:///C:/Users/ASUS/corsair-bugherd/packages/bugherd/client';

const API_KEY = process.env.BUGHERD_API_KEY!;

async function test() {
	console.log('Testing BugHerd API directly...');

	// List Projects
	console.log('\n--- List Projects ---');
	const projects = await makeBugherdRequest<any>('projects', API_KEY, {
		method: 'GET',
	});
	console.log('Projects:', JSON.stringify(projects.data, null, 2));

	// Create Project
	console.log('\n--- Create Project ---');
	const createProject = await makeBugherdRequest<any>('projects', API_KEY, {
		method: 'POST',
		body: {
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
		const createTask = await makeBugherdRequest<any>(
			`projects/${createProject.data.project.id}/tasks`,
			API_KEY,
			{
				method: 'POST',
				body: {
					description: 'Test task created via Corsair',
					priority: 'normal',
					status: 'backlog',
					tag_list: ['test', 'corsair'],
				},
			},
		);
		console.log('Created Task:', JSON.stringify(createTask.data, null, 2));
	}

	// List Users
	console.log('\n--- List Users ---');
	const users = await makeBugherdRequest<any>('users', API_KEY, {
		method: 'GET',
	});
	console.log('Users:', JSON.stringify(users.data, null, 2));
}

test().catch((err) => {
	console.error(err);
	process.exit(1);
});
