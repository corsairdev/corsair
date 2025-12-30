import { Linear } from '../api';
import { requireToken } from './setup';

describe('Linear.Comments', () => {
	beforeEach(() => {
		if (requireToken()) {
			return;
		}
	});

	describe('list', () => {
		it('should list comments for an issue', async () => {
			if (requireToken()) return;

			const issuesResult = await Linear.issues.list(undefined, 10);

			if (issuesResult.nodes.length === 0) {
				console.log('  ⊘ Skipping: No issues available');
				return;
			}

			const issueId = issuesResult.nodes[0].id;
			const result = await Linear.comments.list(issueId, 20);

			expect(result).toBeDefined();
			expect(Array.isArray(result.nodes)).toBe(true);
			expect(result.pageInfo).toBeDefined();

			if (result.nodes.length > 0) {
				const comment = result.nodes[0];
				expect(comment.id).toBeDefined();
				expect(comment.body).toBeDefined();
				expect(comment.user).toBeDefined();

				console.log(`  ✓ Listed ${result.nodes.length} comment(s)`);
				console.log(`    First comment by: ${comment.user.displayName}`);
			} else {
				console.log('  ✓ Issue has no comments');
			}
		});
	});

	describe('create', () => {
		it('should create a new comment', async () => {
			if (requireToken()) return;

			const issuesResult = await Linear.issues.list(undefined, 1);

			if (issuesResult.nodes.length === 0) {
				console.log('  ⊘ Skipping: No issues available');
				return;
			}

			const issueId = issuesResult.nodes[0].id;
			const comment = await Linear.comments.create({
				issueId,
				body: 'Test comment from Linear SDK',
			});

			expect(comment).toBeDefined();
			expect(comment.id).toBeDefined();
			expect(comment.body).toBe('Test comment from Linear SDK');
			expect(comment.user).toBeDefined();

			console.log(`  ✓ Created comment by ${comment.user.displayName}`);
		});
	});

	describe('update', () => {
		it('should update a comment', async () => {
			if (requireToken()) return;

			const issuesResult = await Linear.issues.list(undefined, 1);

			if (issuesResult.nodes.length === 0) {
				console.log('  ⊘ Skipping: No issues available');
				return;
			}

			const issueId = issuesResult.nodes[0].id;
			const commentsResult = await Linear.comments.list(issueId, 1);

			if (commentsResult.nodes.length === 0) {
				console.log('  ⊘ Skipping: No comments available');
				return;
			}

			const commentId = commentsResult.nodes[0].id;
			const updatedComment = await Linear.comments.update(commentId, {
				body: 'Updated comment text',
			});

			expect(updatedComment).toBeDefined();
			expect(updatedComment.id).toBe(commentId);
			expect(updatedComment.editedAt).toBeDefined();

			console.log(`  ✓ Updated comment`);
		});
	});

	describe('delete', () => {
		it('should delete a comment', async () => {
			if (requireToken()) return;

			const issuesResult = await Linear.issues.list(undefined, 1);

			if (issuesResult.nodes.length === 0) {
				console.log('  ⊘ Skipping: No issues available');
				return;
			}

			const issueId = issuesResult.nodes[0].id;
			const comment = await Linear.comments.create({
				issueId,
				body: 'Test comment to delete',
			});

			const success = await Linear.comments.delete(comment.id);

			expect(success).toBe(true);

			console.log(`  ✓ Deleted comment`);
		});
	});
});
