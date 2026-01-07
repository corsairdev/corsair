import { Github } from '../api';
import { getTestUsername, handleRateLimit, requireToken } from './setup';

describe('Github.Users - GitHub Users API', () => {
	describe('getAuthenticated', () => {
		it('should fetch the authenticated user', async () => {
			if (requireToken()) {
				console.warn('Skipping test - GITHUB_TOKEN not configured');
				return;
			}

			try {
				const user = await Github.Users.getAuthenticated();

				expect(user).toBeDefined();
				expect(user).toHaveProperty('login');
				expect(user).toHaveProperty('id');
				expect(user).toHaveProperty('type');
				expect(user).toHaveProperty('created_at');

				console.log('Authenticated user:', user.login);
				console.log('User type:', user.type);
				console.log('User ID:', user.id);
				console.log('Account created:', user.created_at);

				expect(user.login).toBeTruthy();
				expect(user.id).toBeGreaterThan(0);
				expect(user.type).toBeTruthy();
			} catch (error) {
				await handleRateLimit(error);
			}
		});
	});

	describe('getByUsername', () => {
		it('should fetch a public user by username', async () => {
			const username = getTestUsername();

			try {
				const user = await Github.Users.getByUsername(username);

				expect(user).toBeDefined();
				expect(user).toHaveProperty('login');
				expect(user).toHaveProperty('id');
				expect(user).toHaveProperty('type');
				expect(user).toHaveProperty('public_repos');

				expect(user.login).toBe(username);

				console.log('User:', user.login);
				console.log('User type:', user.type);
				console.log('Public repos:', user.public_repos);
				console.log('Followers:', user.followers);
				console.log('Following:', user.following);

				expect(typeof user.public_repos).toBe('number');
				expect(typeof user.followers).toBe('number');
				expect(typeof user.following).toBe('number');
			} catch (error) {
				await handleRateLimit(error);
			}
		});

		it('should handle non-existent user gracefully', async () => {
			const nonExistentUser = 'this-user-definitely-does-not-exist-12345';

			try {
				await Github.Users.getByUsername(nonExistentUser);
				fail('Expected request to fail for non-existent user');
			} catch (error: any) {
				expect(error.status).toBe(404);
				console.log('Correctly received 404 for non-existent user');
			}
		});
	});

	describe('list', () => {
		it('should list public users', async () => {
			try {
				const users = await Github.Users.list(undefined, 5);

				expect(Array.isArray(users)).toBe(true);
				expect(users.length).toBeGreaterThan(0);
				expect(users.length).toBeLessThanOrEqual(5);

				const firstUser = users[0];
				expect(firstUser).toHaveProperty('login');
				expect(firstUser).toHaveProperty('id');
				expect(firstUser).toHaveProperty('type');

				console.log('Fetched users count:', users.length);
				console.log('First user:', firstUser.login);
				console.log('Last user:', users[users.length - 1].login);
			} catch (error) {
				await handleRateLimit(error);
			}
		});

		it('should paginate through users', async () => {
			try {
				const firstPage = await Github.Users.list(0, 3);

				expect(firstPage.length).toBe(3);

				const lastUserId = firstPage[firstPage.length - 1].id;
				const secondPage = await Github.Users.list(lastUserId, 3);

				expect(secondPage.length).toBeGreaterThan(0);

				const firstPageIds = firstPage.map((u) => u.id);
				const secondPageIds = secondPage.map((u) => u.id);
				const overlap = firstPageIds.filter((id) => secondPageIds.includes(id));

				expect(overlap.length).toBe(0);

				console.log(
					'First page users:',
					firstPage.map((u) => u.login).join(', '),
				);
				console.log(
					'Second page users:',
					secondPage.map((u) => u.login).join(', '),
				);
			} catch (error) {
				await handleRateLimit(error);
			}
		});
	});
});
