import { Github } from '../api';
import { handleRateLimit } from './setup';

describe('Github.Meta - GitHub API Meta Information', () => {
  describe('get', () => {
    it('should fetch GitHub API meta information', async () => {
      try {
        const meta = await Github.Meta.get();
        
        expect(meta).toBeDefined();
        expect(meta).toHaveProperty('verifiable_password_authentication');
        expect(meta).toHaveProperty('ssh_key_fingerprints');
        expect(meta).toHaveProperty('hooks');
        
        console.log('GitHub API Meta:', Object.keys(meta).length, 'properties');
        console.log('Verifiable password auth:', meta.verifiable_password_authentication);
        
        if (meta.ssh_key_fingerprints) {
          expect(meta.ssh_key_fingerprints).toHaveProperty('SHA256_RSA');
          console.log('SSH RSA fingerprint:', meta.ssh_key_fingerprints.SHA256_RSA);
        }
        
        expect(Array.isArray(meta.hooks)).toBe(true);
        console.log('Hook IPs count:', meta.hooks?.length || 0);
      } catch (error) {
        await handleRateLimit(error);
      }
    });
  });

  describe('root', () => {
    it('should fetch GitHub API root information', async () => {
      try {
        const root = await Github.Meta.root();
        
        expect(root).toBeDefined();
        expect(root).toHaveProperty('current_user_url');
        expect(root).toHaveProperty('authorizations_url');
        expect(root).toHaveProperty('repository_url');
        expect(root).toHaveProperty('user_url');
        
        console.log('Current user URL:', root.current_user_url);
        console.log('Repository URL template:', root.repository_url);
        
        expect(root.current_user_url).toMatch(/^https:\/\/api\.github\.com/);
        expect(root.repository_url).toContain('{owner}');
        expect(root.repository_url).toContain('{repo}');
      } catch (error) {
        await handleRateLimit(error);
      }
    });
  });

  describe('getOctocat', () => {
    it('should fetch the Octocat ASCII art', async () => {
      try {
        const octocat = await Github.Meta.getOctocat();
        
        expect(octocat).toBeDefined();
        expect(typeof octocat).toBe('string');
        
        const lines = octocat.split('\n');
        expect(lines.length).toBeGreaterThan(5);
        
        console.log('Octocat ASCII art lines:', lines.length);
        console.log('First line:', lines[0]);
      } catch (error) {
        await handleRateLimit(error);
      }
    });

    it('should fetch the Octocat ASCII art with custom text', async () => {
      try {
        const customText = 'Hello from tests!';
        const octocat = await Github.Meta.getOctocat(customText);
        
        expect(octocat).toBeDefined();
        expect(typeof octocat).toBe('string');
        expect(octocat.length).toBeGreaterThan(50);
        
        console.log('Octocat with custom text returned successfully');
        console.log('Response length:', octocat.length);
      } catch (error) {
        await handleRateLimit(error);
      }
    });
  });

  describe('getZen', () => {
    it('should fetch a GitHub zen quote', async () => {
      try {
        const zen = await Github.Meta.getZen();
        
        expect(zen).toBeDefined();
        expect(typeof zen).toBe('string');
        expect(zen.length).toBeGreaterThan(0);
        
        console.log('GitHub Zen:', zen);
      } catch (error) {
        await handleRateLimit(error);
      }
    });
  });
});
