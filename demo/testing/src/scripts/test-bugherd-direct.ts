import { makeBugherdRequest } from '@corsair-dev/bugherd';

const API_KEY = process.env.BUGHERD_API_KEY!;
const TEST_PROJECT_NAME = 'Corsair BugHerd Integration Test';

async function test() {
	console.log('Testing BugHerd API directly...');
	let createdProjectId: number | undefined;

	try {
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
				name: TEST_PROJECT_NAME,
				description: 'Created via Corsair integration test',
				is_active: true,
				is_public: false,
			},
		});
		console.log(
			'Created Project:',
			JSON.stringify(createProject.data, null, 2),
		);

		createdProjectId = createProject.data?.project?.id;

		// Create Task (if project was created)
		if (createdProjectId) {
			console.log('\n--- Create Task ---');
			const createTask = await makeBugherdRequest<any>(
				`projects/${createdProjectId}/tasks`,
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

		// List Users (do not print PII)
		console.log('\n--- List Users ---');
		const users = await makeBugherdRequest<any>('users', API_KEY, {
			method: 'GET',
		});
		const userCount = Array.isArray(users.data?.users)
			? users.data.users.length
			: 0;
		console.log('Users fetched:', userCount);
	} finally {
		if (createdProjectId) {
			await makeBugherdRequest<any>(`projects/${createdProjectId}`, API_KEY, {
				method: 'DELETE',
			});
			console.log(`Cleaned up project: ${createdProjectId}`);
		}
	}
}

test().catch((err) => {
	console.error(err);
	process.exit(1);
});
