import { Slack } from '../slack-api';
import { UsersService } from '../../services/slack';
import { getTestUser, handleRateLimit, requireToken } from './setup';

describe('Slack.Users - Users API', () => {
	const testUser = getTestUser();

	describe('Service class methods', () => {
		it('should have all user methods defined', () => {
			expect(typeof UsersService.usersInfo).toBe('function');
			expect(typeof UsersService.usersList).toBe('function');
			expect(typeof UsersService.usersProfileGet).toBe('function');
			expect(typeof UsersService.usersGetPresence).toBe('function');
			expect(typeof UsersService.usersProfileSet).toBe('function');
		});
	});

	describe('API facade methods', () => {
		it('should expose all user methods through facade', () => {
			expect(typeof Slack.Users.get).toBe('function');
			expect(typeof Slack.Users.list).toBe('function');
			expect(typeof Slack.Users.getProfile).toBe('function');
			expect(typeof Slack.Users.getPresence).toBe('function');
			expect(typeof Slack.Users.updateProfile).toBe('function');
		});
	});

	describe('list', () => {
		it('should list users (integration test)', async () => {
			if (requireToken()) return;

			try {
				const response = await Slack.Users.list({ limit: 10 });

				expect(response).toBeDefined();
				expect(response.ok).toBe(true);
				expect(Array.isArray(response.members)).toBe(true);

				console.log('Users count:', response.members?.length);
				response.members?.slice(0, 5).forEach((user) => {
					console.log(
						`  @${user.name} (${user.id}) - ${user.real_name || 'N/A'}`,
					);
				});
			} catch (error) {
				await handleRateLimit(error);
			}
		});
	});

	describe('get', () => {
		it('should get user info (integration test)', async () => {
			if (requireToken()) return;

			try {
				const listResponse = await Slack.Users.list({ limit: 1 });
				const userId = listResponse.members?.[0]?.id || testUser;

				const response = await Slack.Users.get({
					user: userId,
					include_locale: true,
				});

				expect(response).toBeDefined();
				expect(response.ok).toBe(true);
				expect(response.user).toBeDefined();
				expect(response.user?.id).toBe(userId);

				console.log('User:', response.user?.name);
				console.log('Real name:', response.user?.real_name);
				console.log('Is admin:', response.user?.is_admin);
				console.log('Is bot:', response.user?.is_bot);
			} catch (error) {
				await handleRateLimit(error);
			}
		});

		it('should handle non-existent user', async () => {
			if (requireToken()) return;

			try {
				await Slack.Users.get({ user: 'UNONEXISTENT' });
				fail('Expected request to fail for non-existent user');
			} catch (error: any) {
				expect(error.body?.error || error.message).toContain('user_not_found');
				console.log('Correctly received error for non-existent user');
			}
		});
	});

	describe('getProfile', () => {
		it('should get user profile (integration test)', async () => {
			if (requireToken()) return;

			try {
				const response = await Slack.Users.getProfile({});

				expect(response).toBeDefined();
				expect(response.ok).toBe(true);
				expect(response.profile).toBeDefined();

				console.log('Profile display name:', response.profile?.display_name);
				console.log('Profile email:', response.profile?.email);
				console.log('Profile title:', response.profile?.title);
			} catch (error) {
				await handleRateLimit(error);
			}
		});
	});

	describe('getPresence', () => {
		it('should get user presence (integration test)', async () => {
			if (requireToken()) return;

			try {
				const response = await Slack.Users.getPresence({});

				expect(response).toBeDefined();
				expect(response.ok).toBe(true);
				expect(response.presence).toBeDefined();

				console.log('Presence:', response.presence);
				console.log('Online:', response.online);
			} catch (error) {
				await handleRateLimit(error);
			}
		});
	});
});
