import { Github } from '../api';
import { getTestOwner, getTestRepo, handleRateLimit, generateTestId, sleep } from './setup';

describe('Github.Issues - GitHub Issues API', () => {
  const owner = getTestOwner();
  const repo = getTestRepo();
  
  let createdIssueNumber: number | undefined;

  afterAll(async () => {
    if (createdIssueNumber) {
      try {
        await Github.Issues.update(owner, repo, createdIssueNumber, {
          state: 'closed',
        });
        console.log(`Cleanup: Closed issue #${createdIssueNumber}`);
      } catch (e) {
        console.warn(`Cleanup failed for issue #${createdIssueNumber}`);
      }
    }
  });

  describe('create', () => {
    it('should create an issue', async () => {
      try {
        const testId = generateTestId();
        const issue = await Github.Issues.create(owner, repo, {
          title: `Test Issue - ${testId}`,
          body: 'This is a test issue created by automated tests. It will be cleaned up automatically.',
          labels: ['test'],
        });

        expect(issue).toBeDefined();
        expect(issue).toHaveProperty('number');
        expect(issue).toHaveProperty('title');
        expect(issue).toHaveProperty('state');
        expect(issue.state).toBe('open');

        createdIssueNumber = issue.number;
        console.log('Created issue #', issue.number);
        console.log('Issue title:', issue.title);
        console.log('Issue URL:', issue.html_url);
      } catch (error) {
        await handleRateLimit(error);
      }
    });
  });

  describe('get', () => {
    it('should fetch the created issue', async () => {
      if (!createdIssueNumber) {
        console.warn('Skipping - no issue was created');
        return;
      }

      try {
        const issue = await Github.Issues.get(owner, repo, createdIssueNumber);

        expect(issue).toBeDefined();
        expect(issue.number).toBe(createdIssueNumber);
        expect(issue).toHaveProperty('title');
        expect(issue).toHaveProperty('state');

        console.log('Fetched issue #', issue.number);
        console.log('Title:', issue.title);
        console.log('State:', issue.state);
      } catch (error) {
        await handleRateLimit(error);
      }
    });
  });

  describe('list', () => {
    it('should list issues for the repository', async () => {
      try {
        const issues = await Github.Issues.list(
          owner,
          repo,
          undefined,
          'all',
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          'created',
          'desc',
          undefined,
          10,
          1
        );

        expect(Array.isArray(issues)).toBe(true);
        
        console.log('Found', issues.length, 'issues');
        issues.slice(0, 5).forEach(issue => {
          console.log(`  #${issue.number}: ${issue.title} (${issue.state})`);
        });
      } catch (error) {
        await handleRateLimit(error);
      }
    });
  });

  describe('createComment', () => {
    it('should create a comment on the issue', async () => {
      if (!createdIssueNumber) {
        console.warn('Skipping - no issue was created');
        return;
      }

      try {
        await sleep(1000);
        
        const comment = await Github.Issues.createComment(
          owner,
          repo,
          createdIssueNumber,
          {
            body: 'This is a test comment added by automated tests.',
          }
        );

        expect(comment).toBeDefined();
        expect(comment).toHaveProperty('id');
        expect(comment).toHaveProperty('body');

        console.log('Created comment ID:', comment.id);
        console.log('Comment body:', comment.body);
      } catch (error) {
        await handleRateLimit(error);
      }
    });
  });

  describe('update', () => {
    it('should update the issue', async () => {
      if (!createdIssueNumber) {
        console.warn('Skipping - no issue was created');
        return;
      }

      try {
        await sleep(1000);
        
        const updatedIssue = await Github.Issues.update(
          owner,
          repo,
          createdIssueNumber,
          {
            title: `Updated Test Issue - ${generateTestId()}`,
            body: 'This issue has been updated by automated tests.',
          }
        );

        expect(updatedIssue).toBeDefined();
        expect(updatedIssue.number).toBe(createdIssueNumber);

        console.log('Updated issue #', updatedIssue.number);
        console.log('New title:', updatedIssue.title);
      } catch (error) {
        await handleRateLimit(error);
      }
    });
  });

  describe('lock', () => {
    it('should lock the issue', async () => {
      if (!createdIssueNumber) {
        console.warn('Skipping - no issue was created');
        return;
      }

      try {
        await sleep(1000);
        
        await Github.Issues.lock(
          owner,
          repo,
          createdIssueNumber,
          {
            lock_reason: 'resolved',
          }
        );

        console.log('Locked issue #', createdIssueNumber);
        
        const issue = await Github.Issues.get(owner, repo, createdIssueNumber);
        expect(issue.locked).toBe(true);
        console.log('Verified: Issue is locked');
      } catch (error) {
        await handleRateLimit(error);
      }
    });
  });

  describe('listForUser', () => {
    it('should list issues for authenticated user', async () => {
      try {
        const issues = await Github.Issues.listForUser(
          'all',
          'all',
          undefined,
          'created',
          'desc',
          undefined,
          5,
          1
        );

        expect(Array.isArray(issues)).toBe(true);
        console.log('User issues count:', issues.length);

        if (issues.length > 0) {
          console.log('Recent issues:');
          issues.forEach(issue => {
            console.log(`  ${issue.repository?.full_name || 'unknown'}#${issue.number}: ${issue.title}`);
          });
        }
      } catch (error) {
        await handleRateLimit(error);
      }
    });
  });
});
