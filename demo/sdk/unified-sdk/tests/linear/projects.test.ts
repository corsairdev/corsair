import { Linear } from '../linear-api';
import { getTestTeamId, requireToken } from './setup';

describe('Linear.Projects', () => {
	beforeEach(() => {
		if (requireToken()) {
			return;
		}
	});

	describe('list', () => {
		it('should list projects', async () => {
			if (requireToken()) return;

			const result = await Linear.projects.list(20);

			expect(result).toBeDefined();
			expect(Array.isArray(result.nodes)).toBe(true);
			expect(result.pageInfo).toBeDefined();

			if (result.nodes.length > 0) {
				const project = result.nodes[0];
				expect(project.id).toBeDefined();
				expect(project.name).toBeDefined();
				expect(project.state).toBeDefined();

				console.log(`  ✓ Listed ${result.nodes.length} project(s)`);
				console.log(`    First project: ${project.name} (${project.state})`);
			}
		});
	});

	describe('get', () => {
		it('should get a single project by id', async () => {
			if (requireToken()) return;

			const listResult = await Linear.projects.list(1);

			if (listResult.nodes.length === 0) {
				console.log('  ⊘ Skipping: No projects available');
				return;
			}

			const projectId = listResult.nodes[0].id;
			const project = await Linear.projects.get(projectId);

			expect(project).toBeDefined();
			expect(project.id).toBe(projectId);
			expect(project.name).toBeDefined();
			expect(project.state).toBeDefined();

			console.log(`  ✓ Retrieved project: ${project.name}`);
			console.log(`    State: ${project.state}`);
			console.log(`    Priority: ${project.priority}`);
			if (project.lead) {
				console.log(`    Lead: ${project.lead.displayName}`);
			}
		});
	});

	describe('create', () => {
		it('should create a new project', async () => {
			if (requireToken()) return;

			const teamId = getTestTeamId();
			if (!teamId) {
				console.log('  ⊘ Skipping: LINEAR_TEST_TEAM_ID not set');
				return;
			}

			const project = await Linear.projects.create({
				name: 'Test Project from SDK',
				description: 'This is a test project created by the Linear SDK',
				teamIds: [teamId],
				state: 'planned',
			});

			expect(project).toBeDefined();
			expect(project.id).toBeDefined();
			expect(project.name).toBe('Test Project from SDK');
			expect(project.state).toBe('planned');

			console.log(`  ✓ Created project: ${project.name}`);
		});
	});

	describe('update', () => {
		it('should update a project', async () => {
			if (requireToken()) return;

			const listResult = await Linear.projects.list(1);

			if (listResult.nodes.length === 0) {
				console.log('  ⊘ Skipping: No projects available');
				return;
			}

			const projectId = listResult.nodes[0].id;
			const updatedProject = await Linear.projects.update(projectId, {
				state: 'started',
			});

			expect(updatedProject).toBeDefined();
			expect(updatedProject.id).toBe(projectId);

			console.log(`  ✓ Updated project: ${updatedProject.name}`);
		});
	});

	describe('delete', () => {
		it('should delete a project', async () => {
			if (requireToken()) return;

			const teamId = getTestTeamId();
			if (!teamId) {
				console.log('  ⊘ Skipping: LINEAR_TEST_TEAM_ID not set');
				return;
			}

			const project = await Linear.projects.create({
				name: 'Test Project to Delete',
				teamIds: [teamId],
			});

			const success = await Linear.projects.delete(project.id);

			expect(success).toBe(true);

			console.log(`  ✓ Deleted project: ${project.name}`);
		});
	});
});
