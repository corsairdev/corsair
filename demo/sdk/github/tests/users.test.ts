import { UsersService } from '../services';
import { requireToken, getTestUsername, handleRateLimit } from './setup';

describe('UsersService - GitHub Users API', () => {
  describe('getAuthenticated', () => {
    it('should fetch the authenticated user', async () => {
      if (requireToken()) {
        console.warn('Skipping test - GITHUB_TOKEN not configured');
        return;
      }

      try {
        const user = await UsersService.usersGetAuthenticated();
        
        // Verify response structure
        expect(user).toBeDefined();
        expect(user).toHaveProperty('login');
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('type');
        expect(user).toHaveProperty('created_at');
        
        // Log user info
        console.log('Authenticated user:', user.login);
        console.log('User type:', user.type);
        console.log('User ID:', user.id);
        console.log('Account created:', user.created_at);
        
        // Verify required fields are not empty
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
        const user = await UsersService.usersGetByUsername(username);
        
        // Verify response structure
        expect(user).toBeDefined();
        expect(user).toHaveProperty('login');
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('type');
        expect(user).toHaveProperty('public_repos');
        
        // Verify username matches
        expect(user.login).toBe(username);
        
        // Log user info
        console.log('User:', user.login);
        console.log('User type:', user.type);
        console.log('Public repos:', user.public_repos);
        console.log('Followers:', user.followers);
        console.log('Following:', user.following);
        
        // Verify data types
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
        await UsersService.usersGetByUsername(nonExistentUser);
        // If we get here, the user exists (unlikely)
        fail('Expected request to fail for non-existent user');
      } catch (error: any) {
        // Verify it's a 404 error
        expect(error.status).toBe(404);
        console.log('Correctly received 404 for non-existent user');
      }
    });
  });

  describe('list', () => {
    it('should list public users', async () => {
      try {
        // usersList(since?: number, perPage: number = 30)
        const users = await UsersService.usersList(undefined, 5);
        
        // Verify response is an array
        expect(Array.isArray(users)).toBe(true);
        expect(users.length).toBeGreaterThan(0);
        expect(users.length).toBeLessThanOrEqual(5);
        
        // Verify first user structure
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
        // Fetch first page
        const firstPage = await UsersService.usersList(0, 3);
        
        expect(firstPage.length).toBe(3);
        
        // Fetch second page using last user's ID from first page
        const lastUserId = firstPage[firstPage.length - 1].id;
        const secondPage = await UsersService.usersList(lastUserId, 3);
        
        expect(secondPage.length).toBeGreaterThan(0);
        
        // Verify no overlap between pages
        const firstPageIds = firstPage.map(u => u.id);
        const secondPageIds = secondPage.map(u => u.id);
        const overlap = firstPageIds.filter(id => secondPageIds.includes(id));
        
        expect(overlap.length).toBe(0);
        
        console.log('First page users:', firstPage.map(u => u.login).join(', '));
        console.log('Second page users:', secondPage.map(u => u.login).join(', '));
      } catch (error) {
        await handleRateLimit(error);
      }
    });
  });
});

