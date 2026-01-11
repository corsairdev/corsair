import { Slack } from '../api';
import { UsergroupsService } from '../services';
import { generateTestId, handleRateLimit, requireToken, sleep } from './setup';

describe('Slack.Usergroups - Usergroups API', () => {
	let createdUsergroupId: string | undefined;

	afterAll(async () => {
		if (createdUsergroupId) {
			try {
				await Slack.Usergroups.disable({ usergroup: createdUsergroupId });
				console.log(`Cleanup: Disabled usergroup ${createdUsergroupId}`);
			} catch (e) {
				console.warn(`Cleanup failed for usergroup ${createdUsergroupId}`);
			}
		}
	});

	describe('Service class methods', () => {
		it('should have all usergroup methods defined', () => {
			expect(typeof UsergroupsService.userGroupsCreate).toBe('function');
			expect(typeof UsergroupsService.userGroupsDisable).toBe('function');
			expect(typeof UsergroupsService.userGroupsEnable).toBe('function');
			expect(typeof UsergroupsService.userGroupsList).toBe('function');
			expect(typeof UsergroupsService.userGroupsUpdate).toBe('function');
		});
	});

	describe('API facade methods', () => {
		it('should expose all usergroup methods through facade', () => {
			expect(typeof Slack.Usergroups.create).toBe('function');
			expect(typeof Slack.Usergroups.disable).toBe('function');
			expect(typeof Slack.Usergroups.enable).toBe('function');
			expect(typeof Slack.Usergroups.list).toBe('function');
			expect(typeof Slack.Usergroups.update).toBe('function');
		});
	});

	describe('list', () => {
		it('should list userGroups (integration test)', async () => {
			if (requireToken()) return;

			try {
				const response = await Slack.Usergroups.list({
					include_count: true,
					include_disabled: true,
					include_users: true,
				});

				expect(response).toBeDefined();
				expect(response.ok).toBe(true);
				expect(Array.isArray(response.userGroups)).toBe(true);

				console.log('Usergroups count:', response.userGroups?.length);
				response.userGroups?.slice(0, 5).forEach((group) => {
					console.log(`  @${group.handle} (${group.id}) - ${group.name}`);
					console.log(`    Users: ${group.user_count || 0}`);
				});
			} catch (error) {
				await handleRateLimit(error);
			}
		});
	});

	describe('create', () => {
		it('should create a usergroup (integration test)', async () => {
			if (requireToken()) return;

			try {
				const testId = generateTestId().substring(0, 10);
				const response = await Slack.Usergroups.create({
					name: `Test Group ${testId}`,
					handle: `test-${testId}`,
					description: 'Automated test usergroup',
					include_count: true,
				});

				expect(response).toBeDefined();
				expect(response.ok).toBe(true);
				expect(response.usergroup).toBeDefined();

				createdUsergroupId = response.usergroup?.id;
				console.log('Created usergroup:', response.usergroup?.name);
				console.log('Usergroup ID:', response.usergroup?.id);
				console.log('Handle:', response.usergroup?.handle);
			} catch (error: any) {
				if (error?.body?.error === 'paid_teams_only') {
					console.log('Usergroups require paid plan - skipping');
					return;
				}
				await handleRateLimit(error);
			}
		});
	});

	describe('update', () => {
		it('should update a usergroup (integration test)', async () => {
			if (requireToken()) return;
			if (!createdUsergroupId) {
				console.warn('No created usergroup available for testing');
				return;
			}

			try {
				await sleep(1000);
				const response = await Slack.Usergroups.update({
					usergroup: createdUsergroupId,
					name: `Updated Test Group ${generateTestId().substring(0, 8)}`,
					description: 'Updated automated test usergroup',
				});

				expect(response).toBeDefined();
				expect(response.ok).toBe(true);
				expect(response.usergroup).toBeDefined();

				console.log('Updated usergroup:', response.usergroup?.name);
			} catch (error) {
				await handleRateLimit(error);
			}
		});
	});

	describe('disable and enable', () => {
		it('should disable a usergroup (integration test)', async () => {
			if (requireToken()) return;
			if (!createdUsergroupId) {
				console.warn('No created usergroup available for testing');
				return;
			}

			try {
				await sleep(1000);
				const response = await Slack.Usergroups.disable({
					usergroup: createdUsergroupId,
				});

				expect(response).toBeDefined();
				expect(response.ok).toBe(true);

				console.log('Disabled usergroup:', createdUsergroupId);
			} catch (error) {
				await handleRateLimit(error);
			}
		});

		it('should enable a usergroup (integration test)', async () => {
			if (requireToken()) return;
			if (!createdUsergroupId) {
				console.warn('No created usergroup available for testing');
				return;
			}

			try {
				await sleep(1000);
				const response = await Slack.Usergroups.enable({
					usergroup: createdUsergroupId,
				});

				expect(response).toBeDefined();
				expect(response.ok).toBe(true);

				console.log('Enabled usergroup:', createdUsergroupId);
			} catch (error) {
				await handleRateLimit(error);
			}
		});
	});
});
