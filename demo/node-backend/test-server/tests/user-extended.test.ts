import { ReposService } from '../services/ReposService';
import { IssuesService } from '../services/IssuesService';
import { UsersService } from '../services/UsersService';
import { getTestOwner, handleRateLimit } from './setup';

describe('User Operations - Extended', () => {
  const username = getTestOwner();

  describe('getUserRepos', () => {
    it('should get repositories for a user', async () => {
      try {
        // reposListForUser(username, type, sort, direction, perPage, page)
        const repos = await ReposService.reposListForUser(username, 'owner', 'updated', 'desc', 10, 1);

        expect(Array.isArray(repos)).toBe(true);

        console.log(`Found ${repos.length} repositories for user ${username}`);
        
        repos.slice(0, 5).forEach(repo => {
          console.log(`  ${repo.name}`);
          console.log(`    Stars: ${repo.stargazers_count}, Forks: ${repo.forks_count}`);
          console.log(`    Language: ${repo.language || 'N/A'}`);
          console.log(`    Last updated: ${repo.updated_at}`);
        });
      } catch (error) {
        await handleRateLimit(error);
      }
    });
  });

  describe('getUserIssues', () => {
    it('should get issues assigned to the authenticated user', async () => {
      try {
        // issuesListForAuthenticatedUser(filter, state, labels?, sort, direction, since?, perPage, page)
        const issues = await IssuesService.issuesListForAuthenticatedUser(
          'all',
          'open',
          undefined,
          'updated',
          'desc',
          undefined,
          10,
          1
        );

        expect(Array.isArray(issues)).toBe(true);

        console.log(`Found ${issues.length} issues for authenticated user`);
        
        issues.slice(0, 5).forEach(issue => {
          console.log(`  ${issue.repository?.full_name}#${issue.number}: ${issue.title}`);
          console.log(`    State: ${issue.state}`);
          console.log(`    Labels: ${issue.labels?.map((l: any) => l.name || l).join(', ') || 'none'}`);
        });
      } catch (error) {
        await handleRateLimit(error);
      }
    });
  });

  describe('getUser', () => {
    it('should get user profile', async () => {
      try {
        const user = await UsersService.usersGetByUsername(username);

        expect(user).toBeDefined();
        expect(user).toHaveProperty('login');
        expect(user.login).toBe(username);

        console.log('User:', user.login);
        console.log('Name:', user.name || 'N/A');
        console.log('Bio:', user.bio || 'N/A');
        console.log('Location:', user.location || 'N/A');
        console.log('Public repos:', user.public_repos);
        console.log('Followers:', user.followers);
        console.log('Following:', user.following);
      } catch (error) {
        await handleRateLimit(error);
      }
    });
  });

  describe('getAuthenticatedUser', () => {
    it('should get authenticated user profile', async () => {
      try {
        const user = await UsersService.usersGetAuthenticated();

        expect(user).toBeDefined();
        expect(user).toHaveProperty('login');

        console.log('Authenticated as:', user.login);
        console.log('Name:', user.name || 'N/A');
        console.log('Email:', user.email || 'N/A');
        console.log('Plan:', user.plan?.name || 'N/A');
      } catch (error) {
        await handleRateLimit(error);
      }
    });
  });

  describe('listFollowers', () => {
    it('should list followers for a user', async () => {
      try {
        const followers = await UsersService.usersListFollowersForUser(username, 10, 1);

        expect(Array.isArray(followers)).toBe(true);

        console.log(`Found ${followers.length} followers for ${username}`);
        
        followers.slice(0, 10).forEach(follower => {
          console.log(`  ${follower.login}`);
        });
      } catch (error) {
        await handleRateLimit(error);
      }
    });
  });

  describe('listFollowing', () => {
    it('should list users followed by a user', async () => {
      try {
        const following = await UsersService.usersListFollowingForUser(username, 10, 1);

        expect(Array.isArray(following)).toBe(true);

        console.log(`${username} is following ${following.length} users`);
        
        following.slice(0, 10).forEach(user => {
          console.log(`  ${user.login}`);
        });
      } catch (error) {
        await handleRateLimit(error);
      }
    });
  });
});
