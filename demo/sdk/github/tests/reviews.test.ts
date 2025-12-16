import { PullsService } from '../services';
import { getTestOwner, getTestRepo, handleRateLimit, sleep } from './setup';

describe('PullsService - Review Operations', () => {
  const owner = getTestOwner();
  const repo = getTestRepo();
  
  // Track PR info for tests
  let pullNumber: number | undefined;
  let reviewId: number | undefined;

  beforeAll(async () => {
    // Find an existing PR to use for tests
    try {
      const pulls = await PullsService.pullsList(owner, repo, 'all', undefined, undefined, 'updated', 'desc', 10, 1);
      
      if (pulls.length > 0) {
        pullNumber = pulls[0].number;
        console.log(`Using PR #${pullNumber}: ${pulls[0].title}`);
      } else {
        console.log('No pull requests found in repository');
        console.log('Note: Review tests require at least one pull request');
      }
    } catch (error) {
      console.log('Error fetching PRs:', error);
    }
  });

  describe('listReviews', () => {
    it('should list reviews for a pull request', async () => {
      if (!pullNumber) {
        console.warn('Skipping - no pull request available');
        return;
      }

      try {
        // pullsListReviews(owner, repo, pullNumber, perPage, page)
        const reviews = await PullsService.pullsListReviews(owner, repo, pullNumber, 10, 1);

        expect(Array.isArray(reviews)).toBe(true);
        
        console.log(`Found ${reviews.length} reviews for PR #${pullNumber}`);
        
        if (reviews.length > 0) {
          reviewId = reviews[0].id;
          
          reviews.forEach(review => {
            console.log(`  Review ID ${review.id}:`);
            console.log(`    State: ${review.state}`);
            console.log(`    Author: ${review.user?.login}`);
            console.log(`    Submitted: ${review.submitted_at}`);
          });
        }
      } catch (error) {
        await handleRateLimit(error);
      }
    });
  });

  describe('getReview', () => {
    it('should get a specific review', async () => {
      if (!pullNumber || !reviewId) {
        console.warn('Skipping - no review available');
        return;
      }

      try {
        const review = await PullsService.pullsGetReview(owner, repo, pullNumber, reviewId);

        expect(review).toBeDefined();
        expect(review.id).toBe(reviewId);
        expect(review).toHaveProperty('state');
        expect(review).toHaveProperty('user');

        console.log('Review ID:', review.id);
        console.log('State:', review.state);
        console.log('Author:', review.user?.login);
        console.log('Body:', review.body || '(no body)');
      } catch (error) {
        await handleRateLimit(error);
      }
    });
  });

  describe('createReview', () => {
    it('should create a review on a pull request', async () => {
      if (!pullNumber) {
        console.warn('Skipping - no pull request available');
        return;
      }

      try {
        await sleep(1000); // Rate limit protection
        
        const review = await PullsService.pullsCreateReview(owner, repo, pullNumber, {
          body: 'Test review created by automated tests',
          event: 'COMMENT', // COMMENT, APPROVE, or REQUEST_CHANGES
        });

        expect(review).toBeDefined();
        expect(review).toHaveProperty('id');
        expect(review).toHaveProperty('state');

        reviewId = review.id;
        console.log('Created review:', review.id);
        console.log('State:', review.state);
        console.log('Body:', review.body);
      } catch (error: any) {
        if (error.status === 422) {
          console.log('Cannot create review - PR may be in an incompatible state');
          console.log('Details:', error.body?.message);
        } else {
          await handleRateLimit(error);
        }
      }
    });
  });

  describe('updateReview', () => {
    it('should update a review', async () => {
      if (!pullNumber || !reviewId) {
        console.warn('Skipping - no review available');
        return;
      }

      try {
        await sleep(1000); // Rate limit protection
        
        const updated = await PullsService.pullsUpdateReview(owner, repo, pullNumber, reviewId, {
          body: 'Updated test review',
        });

        expect(updated).toBeDefined();
        expect(updated.id).toBe(reviewId);

        console.log('Updated review:', updated.id);
        console.log('New body:', updated.body);
      } catch (error: any) {
        if (error.status === 422) {
          console.log('Cannot update review - may be in an incompatible state');
          console.log('Details:', error.body?.message);
        } else {
          await handleRateLimit(error);
        }
      }
    });
  });

  describe('listPulls', () => {
    it('should list pull requests', async () => {
      try {
        const pulls = await PullsService.pullsList(owner, repo, 'all', undefined, undefined, 'updated', 'desc', 10, 1);

        expect(Array.isArray(pulls)).toBe(true);
        
        console.log(`Found ${pulls.length} pull requests`);
        
        pulls.slice(0, 5).forEach(pr => {
          console.log(`  #${pr.number}: ${pr.title}`);
          console.log(`    State: ${pr.state}, Merged: ${pr.merged_at ? 'Yes' : 'No'}`);
          console.log(`    Author: ${pr.user?.login}`);
        });
      } catch (error) {
        await handleRateLimit(error);
      }
    });
  });
});
