import { ReposService } from '../services/ReposService';
import { getTestOwner, getTestRepo, handleRateLimit, generateTestId, sleep } from './setup';

describe('ReposService - Release Actions', () => {
  const owner = getTestOwner();
  const repo = getTestRepo();
  
  // Track created resources for cleanup
  let createdReleaseId: number | undefined;
  let createdTagName: string | undefined;

  // Cleanup after all tests
  afterAll(async () => {
    if (createdReleaseId) {
      try {
        await ReposService.reposDeleteRelease(owner, repo, createdReleaseId);
        console.log(`Cleanup: Deleted release ID ${createdReleaseId}`);
      } catch (e) {
        console.warn(`Cleanup failed for release ID ${createdReleaseId}`);
      }
    }
    
    // Note: The tag itself remains (can't easily delete tags via API without git refs)
  });

  describe('createRelease', () => {
    it('should create a release', async () => {
      try {
        const testId = generateTestId();
        createdTagName = `v0.0.0-${testId}`;
        
        const release = await ReposService.reposCreateRelease(owner, repo, {
          tag_name: createdTagName,
          name: `Test Release ${testId}`,
          body: 'This is a test release created by automated tests. It will be cleaned up automatically.',
          draft: true, // Create as draft so it doesn't show publicly
          prerelease: true,
        });

        expect(release).toBeDefined();
        expect(release).toHaveProperty('id');
        expect(release).toHaveProperty('tag_name');
        expect(release.tag_name).toBe(createdTagName);
        expect(release.draft).toBe(true);

        createdReleaseId = release.id;
        console.log('Created release:', release.tag_name);
        console.log('Release ID:', release.id);
        console.log('Release name:', release.name);
        console.log('Draft:', release.draft);
      } catch (error) {
        await handleRateLimit(error);
      }
    });
  });

  describe('listReleases', () => {
    it('should list releases for the repository', async () => {
      try {
        const releases = await ReposService.reposListReleases(owner, repo, 10, 1);

        expect(Array.isArray(releases)).toBe(true);

        console.log('Found', releases.length, 'releases');
        releases.forEach(release => {
          console.log(`  ${release.tag_name}: ${release.name || 'Unnamed'}`);
          console.log(`    Draft: ${release.draft}, Prerelease: ${release.prerelease}`);
        });
      } catch (error) {
        await handleRateLimit(error);
      }
    });
  });

  describe('getRelease', () => {
    it('should get the created release by ID', async () => {
      if (!createdReleaseId) {
        console.warn('Skipping - no release was created');
        return;
      }

      try {
        const release = await ReposService.reposGetRelease(owner, repo, createdReleaseId);

        expect(release).toBeDefined();
        expect(release.id).toBe(createdReleaseId);
        expect(release).toHaveProperty('tag_name');
        expect(release).toHaveProperty('name');

        console.log('Fetched release:', release.tag_name);
        console.log('Name:', release.name);
        console.log('Author:', release.author?.login);
      } catch (error) {
        await handleRateLimit(error);
      }
    });

    it('should get release by tag (non-draft only)', async () => {
      // Note: Draft releases don't have a published tag, so this only works for non-draft releases
      // We'll try to get any existing release by tag from the repo
      try {
        await sleep(1000); // Rate limit protection
        
        // First get list of releases to find a published (non-draft) one
        const releases = await ReposService.reposListReleases(owner, repo, 10, 1);
        const publishedRelease = releases.find(r => !r.draft);
        
        if (!publishedRelease) {
          console.log('No published (non-draft) releases found to test getByTag');
          return;
        }

        const release = await ReposService.reposGetReleaseByTag(owner, repo, publishedRelease.tag_name);

        expect(release).toBeDefined();
        expect(release.tag_name).toBe(publishedRelease.tag_name);

        console.log('Fetched release by tag:', publishedRelease.tag_name);
        console.log('Name:', release.name);
      } catch (error) {
        await handleRateLimit(error);
      }
    });
  });

  describe('updateRelease', () => {
    it('should update the release', async () => {
      if (!createdReleaseId) {
        console.warn('Skipping - no release was created');
        return;
      }

      try {
        await sleep(1000); // Rate limit protection
        
        const updated = await ReposService.reposUpdateRelease(owner, repo, createdReleaseId, {
          name: 'Updated Test Release',
          body: 'This release has been updated by automated tests.',
        });

        expect(updated).toBeDefined();
        expect(updated.name).toBe('Updated Test Release');

        console.log('Updated release:', updated.tag_name);
        console.log('New name:', updated.name);
      } catch (error) {
        await handleRateLimit(error);
      }
    });
  });

  describe('deleteRelease', () => {
    it('should delete the release', async () => {
      if (!createdReleaseId) {
        console.warn('Skipping - no release was created');
        return;
      }

      try {
        await sleep(1000); // Rate limit protection
        
        await ReposService.reposDeleteRelease(owner, repo, createdReleaseId);

        console.log('Deleted release ID:', createdReleaseId);
        
        // Verify deletion by trying to fetch it (should fail)
        try {
          await ReposService.reposGetRelease(owner, repo, createdReleaseId);
          throw new Error('Release should have been deleted');
        } catch (error: any) {
          expect(error.status).toBe(404);
          console.log('Verified: Release no longer exists');
        }
        
        // Clear the ID so cleanup doesn't try to delete again
        createdReleaseId = undefined;
      } catch (error) {
        await handleRateLimit(error);
      }
    });
  });
});
