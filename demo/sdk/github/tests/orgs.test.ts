import { OrgsService, ReposService } from '../services';
import { handleRateLimit } from './setup';

describe('OrgsService - Organization Operations', () => {
  // Use a well-known public org for testing
  const org = 'facebook';

  describe('listReposForOrg', () => {
    it('should get repositories for an organization', async () => {
      try {
        // reposListForOrg(org, type?, sort, direction, perPage, page)
        const repos = await ReposService.reposListForOrg(org, 'all', 'updated', 'desc', 10, 1);

        expect(Array.isArray(repos)).toBe(true);
        expect(repos.length).toBeGreaterThan(0);

        console.log(`Found ${repos.length} repositories for org ${org}`);
        
        repos.slice(0, 5).forEach(repo => {
          console.log(`  ${repo.name}`);
          console.log(`    Stars: ${repo.stargazers_count}, Forks: ${repo.forks_count}`);
          console.log(`    Language: ${repo.language || 'N/A'}`);
        });
      } catch (error) {
        await handleRateLimit(error);
      }
    });
  });

  describe('get', () => {
    it('should get organization info', async () => {
      try {
        const orgInfo = await OrgsService.orgsGet(org);

        expect(orgInfo).toBeDefined();
        expect(orgInfo).toHaveProperty('login');
        expect(orgInfo).toHaveProperty('name');
        expect(orgInfo.login.toLowerCase()).toBe(org.toLowerCase());

        console.log('Organization:', orgInfo.name);
        console.log('Login:', orgInfo.login);
        console.log('Public repos:', orgInfo.public_repos);
        console.log('Followers:', orgInfo.followers);
        console.log('Blog:', orgInfo.blog || 'N/A');
        console.log('Location:', orgInfo.location || 'N/A');
      } catch (error) {
        await handleRateLimit(error);
      }
    });
  });

  describe('listMembers', () => {
    it('should list public members of an organization', async () => {
      try {
        // orgsListPublicMembers(org, perPage, page)
        const members = await OrgsService.orgsListPublicMembers(org, 10, 1);

        expect(Array.isArray(members)).toBe(true);

        console.log(`Found ${members.length} public members for org ${org}`);
        
        members.slice(0, 10).forEach(member => {
          console.log(`  ${member.login}`);
        });
      } catch (error) {
        await handleRateLimit(error);
      }
    });
  });
});
