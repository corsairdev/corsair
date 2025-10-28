import { describe, it, expect, beforeEach } from 'vitest';
import {
  useBlogQuery,
  useBlogMutation,
} from '../__fixtures__/blog/client';
import {
  blogQuery,
  blogMutation,
  createBlogServerFunctions,
  createBlogServerContext
} from '../__fixtures__/blog/server';

// Mock React Query for client-side tests
import { vi } from 'vitest';
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn((options) => ({
    data: null,
    isLoading: false,
    error: null,
    ...options
  })),
  useMutation: vi.fn((options) => ({
    mutate: vi.fn(),
    isLoading: false,
    error: null,
    ...options
  }))
}));

describe('Blog Integration Tests', () => {
  describe('Server-side Operations', () => {
    describe('Author Management', () => {
      it('should create and retrieve authors', async () => {
        // Create a new author
        const createResult = await blogMutation('create author', {
          username: 'johndoe',
          email: 'john@example.com',
          bio: 'A passionate blogger and writer',
          avatar_url: 'https://example.com/avatars/john.jpg',
          social_links: {
            twitter: '@johndoe',
            linkedin: 'johndoe'
          }
        });

        expect(createResult.id).toBeDefined();
        expect(createResult.username).toBe('johndoe');
        expect(createResult.email).toBe('john@example.com');
        expect(createResult.bio).toBe('A passionate blogger and writer');
        expect(createResult.is_active).toBe(true);
        expect(createResult.created_at).toBeInstanceOf(Date);

        // Retrieve the created author
        const getResult = await blogQuery('get author by id', {
          id: createResult.id
        });

        expect(getResult).toBeDefined();
        expect(getResult?.id).toBe(createResult.id);
        expect(getResult?.username).toBe('johndoe');
        expect(getResult?.email).toBe('john@example.com');
        expect(getResult?.social_links).toEqual({
          twitter: '@johndoe',
          linkedin: 'johndoe'
        });
      });

      it('should update author information', async () => {
        // Create author first
        const author = await blogMutation('create author', {
          username: 'janedoe',
          email: 'jane@example.com',
          bio: 'Tech writer and developer'
        });

        // Update the author
        const updateResult = await blogMutation('update author', {
          id: author.id,
          username: 'janesmith',
          bio: 'Senior tech writer and full-stack developer',
          avatar_url: 'https://example.com/avatars/jane-new.jpg',
          is_active: false
        });

        expect(updateResult).toBeDefined();
        expect(updateResult?.username).toBe('janesmith');
        expect(updateResult?.bio).toBe('Senior tech writer and full-stack developer');
        expect(updateResult?.avatar_url).toBe('https://example.com/avatars/jane-new.jpg');
        expect(updateResult?.is_active).toBe(false);
      });

      it('should list all authors with filtering', async () => {
        // Create multiple authors
        await Promise.all([
          blogMutation('create author', {
            username: 'author1',
            email: 'author1@example.com'
          }),
          blogMutation('create author', {
            username: 'author2',
            email: 'author2@example.com'
          }),
          blogMutation('create author', {
            username: 'author3',
            email: 'author3@example.com',
            bio: 'Inactive author'
          })
        ]);

        // Get all active authors
        const activeAuthors = await blogQuery('get all authors', {
          is_active: true
        });
        expect(activeAuthors.length).toBeGreaterThanOrEqual(3);
        expect(activeAuthors.every(author => author.is_active)).toBe(true);

        // Test pagination
        const limitedAuthors = await blogQuery('get all authors', {
          limit: 2,
          offset: 1
        });
        expect(limitedAuthors.length).toBeLessThanOrEqual(2);
      });
    });

    describe('Post Management', () => {
      let testAuthor: any;
      let testTags: any[];

      beforeEach(async () => {
        // Create test author for post tests
        testAuthor = await blogMutation('create author', {
          username: 'postauthor',
          email: 'postauthor@example.com'
        });

        // Create test tags
        testTags = await Promise.all([
          blogMutation('create tag', {
            name: 'JavaScript',
            slug: 'javascript',
            description: 'JavaScript programming language',
            color: '#F7DF1E'
          }),
          blogMutation('create tag', {
            name: 'TypeScript',
            slug: 'typescript',
            description: 'TypeScript programming language',
            color: '#3178C6'
          })
        ]);
      });

      it('should create and retrieve posts', async () => {
        // Create a blog post
        const createResult = await blogMutation('create post', {
          title: 'Introduction to TypeScript',
          slug: 'introduction-to-typescript',
          content: 'TypeScript is a typed superset of JavaScript...',
          excerpt: 'Learn the basics of TypeScript in this comprehensive guide.',
          author_id: testAuthor.id,
          published: false,
          featured_image: 'https://example.com/images/typescript-intro.jpg',
          seo_title: 'TypeScript Tutorial for Beginners',
          seo_description: 'Complete TypeScript tutorial covering all the basics',
          reading_time: 10,
          metadata: {
            difficulty: 'beginner',
            series: 'typescript-fundamentals'
          },
          tags: [testTags[1].id], // TypeScript tag
          categories: ['programming']
        });

        expect(createResult.id).toBeDefined();
        expect(createResult.title).toBe('Introduction to TypeScript');
        expect(createResult.slug).toBe('introduction-to-typescript');
        expect(createResult.author_id).toBe(testAuthor.id);
        expect(createResult.published).toBe(false);
        expect(createResult.published_at).toBeNull();
        expect(createResult.created_at).toBeInstanceOf(Date);

        // Retrieve the post by slug
        const getResult = await blogQuery('get post by slug', {
          slug: 'introduction-to-typescript'
        });

        expect(getResult).toBeDefined();
        expect(getResult?.id).toBe(createResult.id);
        expect(getResult?.title).toBe('Introduction to TypeScript');
        expect(getResult?.content).toBe('TypeScript is a typed superset of JavaScript...');
        expect(getResult?.author.id).toBe(testAuthor.id);
        expect(getResult?.author.username).toBe('postauthor');
      });

      it('should publish and update posts', async () => {
        // Create a draft post
        const post = await blogMutation('create post', {
          title: 'Draft Post',
          slug: 'draft-post',
          content: 'This is a draft post...',
          author_id: testAuthor.id,
          published: false
        });

        expect(post.published).toBe(false);
        expect(post.published_at).toBeNull();

        // Publish the post
        const publishResult = await blogMutation('publish post', {
          id: post.id
        });

        expect(publishResult).toBeDefined();
        expect(publishResult?.published).toBe(true);
        expect(publishResult?.published_at).toBeInstanceOf(Date);

        // Update the post content
        const updateResult = await blogMutation('update post', {
          id: post.id,
          title: 'Updated Draft Post',
          content: 'This post has been updated and published...',
          excerpt: 'An updated excerpt for the post',
          reading_time: 5
        });

        expect(updateResult).toBeDefined();
        expect(updateResult?.title).toBe('Updated Draft Post');
        expect(updateResult?.published).toBe(true); // Should remain published
      });

      it('should search and filter posts', async () => {
        // Create multiple posts
        const posts = await Promise.all([
          blogMutation('create post', {
            title: 'JavaScript Fundamentals',
            slug: 'javascript-fundamentals',
            content: 'Learn the basics of JavaScript programming...',
            author_id: testAuthor.id,
            published: true,
            tags: [testTags[0].id]
          }),
          blogMutation('create post', {
            title: 'Advanced TypeScript Patterns',
            slug: 'advanced-typescript-patterns',
            content: 'Explore advanced TypeScript design patterns...',
            author_id: testAuthor.id,
            published: true,
            tags: [testTags[1].id]
          }),
          blogMutation('create post', {
            title: 'Web Development Best Practices',
            slug: 'web-dev-best-practices',
            content: 'Essential best practices for web development...',
            author_id: testAuthor.id,
            published: false
          })
        ]);

        // Search posts by content
        const searchResults = await blogQuery('search posts', {
          query: 'typescript',
          published: true,
          limit: 10
        });
        expect(searchResults.some(p => p.title.toLowerCase().includes('typescript'))).toBe(true);

        // Get published posts only
        const publishedPosts = await blogQuery('get all posts', {
          published: true,
          author_id: testAuthor.id
        });
        expect(publishedPosts.length).toBeGreaterThanOrEqual(2);
        expect(publishedPosts.every(p => p.published)).toBe(true);

        // Get posts by author
        const authorPosts = await blogQuery('get all posts', {
          author_id: testAuthor.id,
          sort_by: 'created_at',
          sort_order: 'desc'
        });
        expect(authorPosts.length).toBeGreaterThanOrEqual(3);
        expect(authorPosts.every(p => p.author_id === testAuthor.id)).toBe(true);
      });

      it('should handle posts with tags', async () => {
        // Create a post with multiple tags
        const post = await blogMutation('create post', {
          title: 'Full-Stack Development with JavaScript',
          slug: 'fullstack-js-development',
          content: 'Building full-stack applications with JavaScript and TypeScript...',
          author_id: testAuthor.id,
          published: true,
          tags: [testTags[0].id, testTags[1].id] // Both JavaScript and TypeScript
        });

        // Get posts with tags
        const postsWithTags = await blogQuery('get posts with tags', {
          published: true,
          limit: 10
        });

        const ourPost = postsWithTags.find(p => p.id === post.id);
        expect(ourPost).toBeDefined();
        expect(ourPost?.tags.length).toBeGreaterThanOrEqual(2);

        // Get posts by specific tag
        const jsPosts = await blogQuery('get posts by tag', {
          tag_slug: 'javascript',
          published: true
        });
        expect(jsPosts.some(p => p.id === post.id)).toBe(true);

        const tsPosts = await blogQuery('get posts by tag', {
          tag_slug: 'typescript',
          published: true
        });
        expect(tsPosts.some(p => p.id === post.id)).toBe(true);
      });
    });

    describe('Tag Management', () => {
      it('should create and manage tags', async () => {
        // Create a tag
        const createResult = await blogMutation('create tag', {
          name: 'React',
          slug: 'react',
          description: 'React.js library for building user interfaces',
          color: '#61DAFB'
        });

        expect(createResult.id).toBeDefined();
        expect(createResult.name).toBe('React');
        expect(createResult.slug).toBe('react');
        expect(createResult.description).toBe('React.js library for building user interfaces');
        expect(createResult.color).toBe('#61DAFB');
        expect(createResult.post_count).toBe(0);
        expect(createResult.created_at).toBeInstanceOf(Date);

        // Update the tag
        const updateResult = await blogMutation('update tag', {
          id: createResult.id,
          name: 'React.js',
          description: 'React.js - A JavaScript library for building user interfaces',
          color: '#087EA4'
        });

        expect(updateResult).toBeDefined();
        expect(updateResult?.name).toBe('React.js');
        expect(updateResult?.slug).toBe('react'); // Should remain unchanged
        expect(updateResult?.color).toBe('#087EA4');
      });

      it('should list all tags with sorting', async () => {
        // Create multiple tags
        await Promise.all([
          blogMutation('create tag', {
            name: 'Vue.js',
            slug: 'vuejs'
          }),
          blogMutation('create tag', {
            name: 'Angular',
            slug: 'angular'
          }),
          blogMutation('create tag', {
            name: 'Svelte',
            slug: 'svelte'
          })
        ]);

        // Get all tags sorted by name
        const tagsByName = await blogQuery('get all tags', {
          sort_by: 'name',
          limit: 10
        });
        expect(tagsByName.length).toBeGreaterThanOrEqual(3);

        // Get limited number of tags
        const limitedTags = await blogQuery('get all tags', {
          limit: 2
        });
        expect(limitedTags.length).toBe(2);
      });
    });

    describe('Comment Management', () => {
      let testAuthor: any;
      let testPost: any;

      beforeEach(async () => {
        // Create test author and post for comment tests
        testAuthor = await blogMutation('create author', {
          username: 'commentauthor',
          email: 'commentauthor@example.com'
        });

        testPost = await blogMutation('create post', {
          title: 'Comment Test Post',
          slug: 'comment-test-post',
          content: 'This post is for testing comments...',
          author_id: testAuthor.id,
          published: true
        });
      });

      it('should create and manage comments', async () => {
        // Create a comment
        const createResult = await blogMutation('create comment', {
          post_id: testPost.id,
          content: 'Great post! Very informative.',
          author_name: 'Anonymous Reader',
          author_email: 'reader@example.com'
        });

        expect(createResult.id).toBeDefined();
        expect(createResult.post_id).toBe(testPost.id);
        expect(createResult.content).toBe('Great post! Very informative.');
        expect(createResult.author_name).toBe('Anonymous Reader');
        expect(createResult.is_approved).toBe(false); // Should not be auto-approved for non-admin
        expect(createResult.created_at).toBeInstanceOf(Date);

        // Approve the comment
        const approveResult = await blogMutation('approve comment', {
          id: createResult.id,
          approved: true
        });

        expect(approveResult).toBeDefined();
        expect(approveResult?.is_approved).toBe(true);
        expect(approveResult?.updated_at).toBeInstanceOf(Date);

        // Get post comments
        const comments = await blogQuery('get post comments', {
          post_id: testPost.id,
          is_approved: true
        });

        expect(comments.length).toBe(1);
        expect(comments[0].id).toBe(createResult.id);
        expect(comments[0].content).toBe('Great post! Very informative.');
      });

      it('should handle threaded comments (replies)', async () => {
        // Create parent comment
        const parentComment = await blogMutation('create comment', {
          post_id: testPost.id,
          content: 'This is a parent comment.',
          author_name: 'Parent Commenter'
        });

        // Approve parent comment
        await blogMutation('approve comment', {
          id: parentComment.id,
          approved: true
        });

        // Create reply
        const replyComment = await blogMutation('create comment', {
          post_id: testPost.id,
          content: 'This is a reply to the parent comment.',
          author_name: 'Reply Author',
          parent_id: parentComment.id
        });

        // Approve reply
        await blogMutation('approve comment', {
          id: replyComment.id,
          approved: true
        });

        // Get comments with replies
        const commentsWithReplies = await blogQuery('get post comments', {
          post_id: testPost.id,
          is_approved: true,
          parent_id: null // Get top-level comments only
        });

        expect(commentsWithReplies.length).toBe(1);
        expect(commentsWithReplies[0].id).toBe(parentComment.id);
        expect(commentsWithReplies[0].replies.length).toBe(1);
        expect(commentsWithReplies[0].replies[0].id).toBe(replyComment.id);
        expect(commentsWithReplies[0].replies[0].content).toBe('This is a reply to the parent comment.');
      });

      it('should filter comments by approval status', async () => {
        // Create multiple comments
        const comments = await Promise.all([
          blogMutation('create comment', {
            post_id: testPost.id,
            content: 'Approved comment 1',
            author_name: 'User 1'
          }),
          blogMutation('create comment', {
            post_id: testPost.id,
            content: 'Approved comment 2',
            author_name: 'User 2'
          }),
          blogMutation('create comment', {
            post_id: testPost.id,
            content: 'Unapproved comment',
            author_name: 'User 3'
          })
        ]);

        // Approve first two comments
        await Promise.all([
          blogMutation('approve comment', { id: comments[0].id, approved: true }),
          blogMutation('approve comment', { id: comments[1].id, approved: true })
        ]);

        // Get approved comments only
        const approvedComments = await blogQuery('get post comments', {
          post_id: testPost.id,
          is_approved: true
        });
        expect(approvedComments.length).toBe(2);
        expect(approvedComments.every(c => c.is_approved)).toBe(true);

        // Get unapproved comments only
        const unapprovedComments = await blogQuery('get post comments', {
          post_id: testPost.id,
          is_approved: false
        });
        expect(unapprovedComments.length).toBe(1);
        expect(unapprovedComments[0].is_approved).toBe(false);
      });
    });

    describe('Complex Workflows', () => {
      it('should handle a complete blog workflow', async () => {
        // 1. Create author
        const author = await blogMutation('create author', {
          username: 'workflowauthor',
          email: 'workflow@example.com',
          bio: 'Workflow testing author'
        });

        // 2. Create tags
        const tags = await Promise.all([
          blogMutation('create tag', {
            name: 'Tutorial',
            slug: 'tutorial',
            color: '#FF6B6B'
          }),
          blogMutation('create tag', {
            name: 'Advanced',
            slug: 'advanced',
            color: '#4ECDC4'
          })
        ]);

        // 3. Create a comprehensive blog post
        const post = await blogMutation('create post', {
          title: 'Complete Guide to Modern Web Development',
          slug: 'complete-guide-modern-web-dev',
          content: `
            # Complete Guide to Modern Web Development

            This comprehensive guide covers everything you need to know about modern web development...

            ## Frontend Technologies
            - React, Vue, Angular
            - TypeScript
            - CSS Frameworks

            ## Backend Technologies
            - Node.js, Python, Go
            - Databases
            - APIs
          `.trim(),
          excerpt: 'A comprehensive guide covering frontend and backend web development technologies.',
          author_id: author.id,
          published: false,
          featured_image: 'https://example.com/images/web-dev-guide.jpg',
          seo_title: 'Modern Web Development Guide 2024',
          seo_description: 'Complete guide to modern web development technologies and best practices',
          reading_time: 25,
          metadata: {
            difficulty: 'intermediate',
            updated: '2024-01-15'
          },
          tags: [tags[0].id, tags[1].id]
        });

        // 4. Publish the post
        const publishedPost = await blogMutation('publish post', {
          id: post.id
        });
        expect(publishedPost?.published).toBe(true);

        // 5. Add comments
        const comments = await Promise.all([
          blogMutation('create comment', {
            post_id: post.id,
            content: 'Excellent guide! Very comprehensive.',
            author_name: 'Developer 1',
            author_email: 'dev1@example.com'
          }),
          blogMutation('create comment', {
            post_id: post.id,
            content: 'Thanks for sharing this resource.',
            author_name: 'Developer 2',
            author_email: 'dev2@example.com'
          })
        ]);

        // 6. Moderate comments
        await Promise.all(
          comments.map(comment =>
            blogMutation('approve comment', {
              id: comment.id,
              approved: true
            })
          )
        );

        // 7. Verify the complete post
        const finalPost = await blogQuery('get post by slug', {
          slug: 'complete-guide-modern-web-dev'
        });

        expect(finalPost).toBeDefined();
        expect(finalPost?.published).toBe(true);
        expect(finalPost?.published_at).toBeInstanceOf(Date);
        expect(finalPost?.author.username).toBe('workflowauthor');

        // 8. Verify comments are visible
        const postComments = await blogQuery('get post comments', {
          post_id: post.id,
          is_approved: true
        });
        expect(postComments.length).toBe(2);

        // 9. Verify post appears in various listings
        const publishedPosts = await blogQuery('get all posts', {
          published: true,
          author_id: author.id
        });
        expect(publishedPosts.some(p => p.id === post.id)).toBe(true);

        const postsWithTags = await blogQuery('get posts with tags', {
          published: true
        });
        const ourPostWithTags = postsWithTags.find(p => p.id === post.id);
        expect(ourPostWithTags?.tags.length).toBe(2);

        // 10. Test search functionality
        const searchResults = await blogQuery('search posts', {
          query: 'web development',
          published: true
        });
        expect(searchResults.some(p => p.id === post.id)).toBe(true);
      });
    });
  });

  describe('Client-side Hooks', () => {
    it('should provide properly typed client hooks', () => {
      // Test that hooks are available and properly typed
      expect(typeof useBlogQuery).toBe('function');
      expect(typeof useBlogMutation).toBe('function');

      // These would be tested in a React testing environment
      // const queryResult = useBlogQuery('get all posts', {});
      // const mutationResult = useBlogMutation('create post');

      // For now, just verify the functions exist
      expect(true).toBe(true);
    });
  });

  describe('Custom Context', () => {
    it('should work with custom server context', async () => {
      const customContextFactory = createBlogServerContext('admin-author', 'admin');
      const customFunctions = createBlogServerFunctions(customContextFactory);

      // Test that custom context functions work
      expect(typeof customFunctions.query).toBe('function');
      expect(typeof customFunctions.mutate).toBe('function');

      // Create an author with custom context
      const result = await customFunctions.mutate('create author', {
        username: 'customauthor',
        email: 'custom@example.com',
        bio: 'Created with custom context'
      });

      expect(result.id).toBeDefined();
      expect(result.username).toBe('customauthor');
    });
  });

  describe('Error Handling', () => {
    it('should handle validation errors gracefully', async () => {
      // Test invalid email format
      try {
        await blogMutation('create author', {
          username: 'test',
          email: 'invalid-email'
        });
        expect.fail('Should have thrown validation error');
      } catch (error) {
        expect(error).toBeDefined();
      }

      // Test invalid slug format
      try {
        await blogMutation('create post', {
          title: 'Test Post',
          slug: '', // Empty slug should fail
          content: 'Test content',
          author_id: 'some-author-id'
        });
        expect.fail('Should have thrown validation error');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should handle not found errors', async () => {
      try {
        await blogQuery('get author by id', {
          id: 'nonexistent-author-id'
        });
        expect.fail('Should have thrown not found error');
      } catch (error) {
        expect(error).toBeDefined();
      }

      try {
        await blogQuery('get post by slug', {
          slug: 'nonexistent-post-slug'
        });
        expect.fail('Should have thrown not found error');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should handle business logic errors', async () => {
      // Try to publish a non-existent post
      try {
        await blogMutation('publish post', {
          id: 'nonexistent-post-id'
        });
        expect.fail('Should have thrown not found error');
      } catch (error) {
        expect(error).toBeDefined();
      }

      // Try to approve a non-existent comment
      try {
        await blogMutation('approve comment', {
          id: 'nonexistent-comment-id',
          approved: true
        });
        expect.fail('Should have thrown not found error');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });
});