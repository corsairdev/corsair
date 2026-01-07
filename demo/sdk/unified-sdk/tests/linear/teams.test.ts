import { Linear } from '../linear-api';
import { requireToken } from './setup';

describe('Linear.Teams', () => {
	beforeEach(() => {
		if (requireToken()) {
			return;
		}
	});

	describe('list', () => {
		it('should list teams', async () => {
			if (requireToken()) return;

			const result = await Linear.teams.list(20);

			expect(result).toBeDefined();
			expect(Array.isArray(result.nodes)).toBe(true);
			expect(result.pageInfo).toBeDefined();

			if (result.nodes.length > 0) {
				const team = result.nodes[0];
				expect(team.id).toBeDefined();
				expect(team.name).toBeDefined();
				expect(team.key).toBeDefined();

				console.log(`  ✓ Listed ${result.nodes.length} team(s)`);
				console.log(`    First team: ${team.key} - ${team.name}`);
			}
		});
	});

	describe('get', () => {
		it('should get a single team by id', async () => {
			if (requireToken()) return;

			const listResult = await Linear.teams.list(1);

			if (listResult.nodes.length === 0) {
				console.log('  ⊘ Skipping: No teams available');
				return;
			}

			const teamId = listResult.nodes[0].id;
			const team = await Linear.teams.get(teamId);

			expect(team).toBeDefined();
			expect(team.id).toBe(teamId);
			expect(team.name).toBeDefined();
			expect(team.key).toBeDefined();

			console.log(`  ✓ Retrieved team: ${team.key} - ${team.name}`);
			console.log(`    Private: ${team.private}`);
			if (team.description) {
				console.log(`    Description: ${team.description}`);
			}
		});
	});
});
