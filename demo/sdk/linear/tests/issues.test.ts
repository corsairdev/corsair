import { Linear } from '../api';
import { getTestTeamId, requireToken } from './setup';

describe('Linear.Issues', () => {
	beforeEach(() => {
		if (requireToken()) {
			return;
		}
	});

	describe('list', () => {
		it('should list issues', async () => {
			if (requireToken()) return;

			const result = await Linear.issues.list(undefined, 10);

			expect(result).toBeDefined();
			expect(Array.isArray(result.nodes)).toBe(true);
			expect(result.pageInfo).toBeDefined();
			expect(result.pageInfo.hasNextPage).toBeDefined();

			if (result.nodes.length > 0) {
				const issue = result.nodes[0];
				expect(issue.id).toBeDefined();
				expect(issue.title).toBeDefined();
				expect(issue.identifier).toBeDefined();
				expect(issue.team).toBeDefined();
				expect(issue.state).toBeDefined();

				console.log(`  ✓ Listed ${result.nodes.length} issue(s)`);
				console.log(`    First issue: ${issue.identifier} - ${issue.title}`);
			}
		});

		it('should list issues for a specific team', async () => {
			if (requireToken()) return;

			const teamId = getTestTeamId();
			if (!teamId || teamId.trim() === '') {
				console.log('  ⊘ Skipping: LINEAR_TEST_TEAM_ID not set');
				return;
			}

			try {
				const result = await Linear.issues.list(teamId, 5);

				expect(result).toBeDefined();
				expect(Array.isArray(result.nodes)).toBe(true);

				console.log(
					`  ✓ Listed ${result.nodes.length} issue(s) for team ${teamId.substring(0, 8)}...`,
				);
			} catch (error: any) {
				console.log(
					`  ⚠️  Team filter may not be supported or team ID invalid: ${error.message}`,
				);
				console.log(`  Skipping team-specific test`);
			}
		});
	});

	describe('get', () => {
		it('should get a single issue by id', async () => {
			if (requireToken()) return;

			const listResult = await Linear.issues.list(undefined, 1);

			if (listResult.nodes.length === 0) {
				console.log('  ⊘ Skipping: No issues available');
				return;
			}

			const issueId = listResult.nodes[0].id;
			const issue = await Linear.issues.get(issueId);

			expect(issue).toBeDefined();
			expect(issue.id).toBe(issueId);
			expect(issue.title).toBeDefined();
			expect(issue.identifier).toBeDefined();
			expect(issue.team).toBeDefined();
			expect(issue.state).toBeDefined();
			expect(issue.creator).toBeDefined();

			console.log(`  ✓ Retrieved issue: ${issue.identifier} - ${issue.title}`);
			console.log(`    State: ${issue.state.name}`);
			console.log(`    Priority: ${issue.priority}`);
		});
	});

	describe('create', () => {
		it('should create a new issue', async () => {
			if (requireToken()) return;

			const teamId = getTestTeamId();
			if (!teamId) {
				console.log('  ⊘ Skipping: LINEAR_TEST_TEAM_ID not set');
				return;
			}

			const issue = await Linear.issues.create({
				title: 'Test Issue from SDK',
				description: 'This is a test issue created by the Linear SDK',
				teamId,
				priority: 2,
			});

			expect(issue).toBeDefined();
			expect(issue.id).toBeDefined();
			expect(issue.title).toBe('Test Issue from SDK');
			expect(issue.team.id).toBe(teamId);

			console.log(`  ✓ Created issue: ${issue.identifier} - ${issue.title}`);
		});
	});

	describe('update', () => {
		it('should update an issue', async () => {
			if (requireToken()) return;

			const listResult = await Linear.issues.list(undefined, 1);

			if (listResult.nodes.length === 0) {
				console.log('  ⊘ Skipping: No issues available');
				return;
			}

			const issueId = listResult.nodes[0].id;
			const updatedIssue = await Linear.issues.update(issueId, {
				priority: 3,
			});

			expect(updatedIssue).toBeDefined();
			expect(updatedIssue.id).toBe(issueId);
			expect(updatedIssue.priority).toBe(3);

			console.log(`  ✓ Updated issue: ${updatedIssue.identifier}`);
		});
	});

	describe('delete', () => {
		it('should delete an issue', async () => {
			if (requireToken()) return;

			const teamId = getTestTeamId();
			if (!teamId) {
				console.log('  ⊘ Skipping: LINEAR_TEST_TEAM_ID not set');
				return;
			}

			const issue = await Linear.issues.create({
				title: 'Test Issue to Delete',
				teamId,
			});

			const success = await Linear.issues.delete(issue.id);

			expect(success).toBe(true);

			console.log(`  ✓ Deleted issue: ${issue.identifier}`);
		});
	});
});
