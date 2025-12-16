import { ReposService } from '../services/ReposService';
import { getTestOwner, getTestRepo, handleRateLimit, generateTestId, sleep } from './setup';

describe('ReposService - File Operations', () => {
  const owner = getTestOwner();
  const repo = getTestRepo();
  
  // Track created files for cleanup
  let createdFilePath: string | undefined;
  let createdFileSha: string | undefined;

  // Cleanup after all tests
  afterAll(async () => {
    if (createdFilePath && createdFileSha) {
      try {
        await ReposService.reposDeleteFile(owner, repo, createdFilePath, {
          message: 'Cleanup: Delete test file',
          sha: createdFileSha,
        });
        console.log(`Cleanup: Deleted file ${createdFilePath}`);
      } catch (e) {
        console.warn(`Cleanup failed for file ${createdFilePath}`);
      }
    }
  });

  describe('getContent', () => {
    it('should get file content from the repository', async () => {
      try {
        // Try to get README or any common file
        const content = await ReposService.reposGetContent(owner, repo, 'README.md');

        expect(content).toBeDefined();
        
        if ('type' in content && content.type === 'file') {
          expect(content).toHaveProperty('name');
          expect(content).toHaveProperty('path');
          expect(content).toHaveProperty('sha');
          expect(content).toHaveProperty('size');

          console.log('File name:', content.name);
          console.log('File path:', content.path);
          console.log('File size:', content.size, 'bytes');
          console.log('SHA:', content.sha.substring(0, 7));
        }
      } catch (error: any) {
        if (error.status === 404) {
          console.log('README.md not found, trying package.json...');
          try {
            const content = await ReposService.reposGetContent(owner, repo, 'package.json');
            expect(content).toBeDefined();
            console.log('Found package.json');
          } catch {
            console.log('No common files found');
          }
        } else {
          await handleRateLimit(error);
        }
      }
    });

    it('should list files in root directory', async () => {
      try {
        const contents = await ReposService.reposGetContent(owner, repo, '');

        expect(contents).toBeDefined();
        expect(Array.isArray(contents)).toBe(true);

        if (Array.isArray(contents)) {
          console.log('Found', contents.length, 'items in root');
          contents.slice(0, 10).forEach(item => {
            console.log(`  ${item.type === 'dir' ? '📁' : '📄'} ${item.name}`);
          });
        }
      } catch (error) {
        await handleRateLimit(error);
      }
    });
  });

  describe('createOrUpdateFileContents', () => {
    it('should create a new file', async () => {
      try {
        const testId = generateTestId();
        createdFilePath = `test-files/${testId}.txt`;
        const content = `This is a test file created at ${new Date().toISOString()}\nTest ID: ${testId}`;
        
        const result = await ReposService.reposCreateOrUpdateFileContents(
          owner,
          repo,
          createdFilePath,
          {
            message: `Test: Create file ${testId}`,
            content: Buffer.from(content).toString('base64'),
          }
        );

        expect(result).toBeDefined();
        expect(result.content).toHaveProperty('sha');
        
        createdFileSha = result.content?.sha;
        
        console.log('Created file:', createdFilePath);
        console.log('Commit SHA:', result.commit.sha?.substring(0, 7));
        console.log('File SHA:', createdFileSha?.substring(0, 7));
      } catch (error) {
        await handleRateLimit(error);
      }
    });

    it('should update the created file', async () => {
      if (!createdFilePath || !createdFileSha) {
        console.warn('Skipping - no file was created');
        return;
      }

      try {
        await sleep(1000); // Rate limit protection
        
        const newContent = `Updated content at ${new Date().toISOString()}`;
        
        const result = await ReposService.reposCreateOrUpdateFileContents(
          owner,
          repo,
          createdFilePath,
          {
            message: 'Test: Update file',
            content: Buffer.from(newContent).toString('base64'),
            sha: createdFileSha,
          }
        );

        expect(result).toBeDefined();
        expect(result.content).toHaveProperty('sha');
        
        // Update the SHA for cleanup
        createdFileSha = result.content?.sha;
        
        console.log('Updated file:', createdFilePath);
        console.log('New commit SHA:', result.commit.sha?.substring(0, 7));
      } catch (error) {
        await handleRateLimit(error);
      }
    });
  });

  describe('deleteFile', () => {
    it('should delete the created file', async () => {
      if (!createdFilePath || !createdFileSha) {
        console.warn('Skipping - no file was created');
        return;
      }

      try {
        await sleep(1000); // Rate limit protection
        
        const result = await ReposService.reposDeleteFile(
          owner,
          repo,
          createdFilePath,
          {
            message: 'Test: Delete file',
            sha: createdFileSha,
          }
        );

        expect(result).toBeDefined();
        expect(result.commit).toHaveProperty('sha');
        
        console.log('Deleted file:', createdFilePath);
        console.log('Commit SHA:', result.commit.sha?.substring(0, 7));
        
        // Clear references so cleanup doesn't try again
        createdFilePath = undefined;
        createdFileSha = undefined;
      } catch (error) {
        await handleRateLimit(error);
      }
    });
  });

  describe('getReadme', () => {
    it('should get repository README', async () => {
      try {
        const readme = await ReposService.reposGetReadme(owner, repo);

        expect(readme).toBeDefined();
        expect(readme).toHaveProperty('name');
        expect(readme).toHaveProperty('content');
        expect(readme.type).toBe('file');

        console.log('README file:', readme.name);
        console.log('Size:', readme.size, 'bytes');
        console.log('Encoding:', readme.encoding);
      } catch (error: any) {
        if (error.status === 404) {
          console.log('No README found in repository');
        } else {
          await handleRateLimit(error);
        }
      }
    });
  });
});
