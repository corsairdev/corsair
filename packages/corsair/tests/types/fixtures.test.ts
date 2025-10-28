import { describe, it, expect } from 'vitest';
import {
  InferQueriesInputs,
  InferQueriesOutputs,
  InferMutationsInputs,
  InferMutationsOutputs
} from '../../core';

// Import actual fixture schemas for type testing
import { queries as ecommerceQueries } from '../__fixtures__/ecommerce/queries';
import { mutations as ecommerceMutations } from '../__fixtures__/ecommerce/mutations';
import { queries as blogQueries } from '../__fixtures__/blog/queries';
import { mutations as blogMutations } from '../__fixtures__/blog/mutations';

// Import client hooks for testing
import {
  useEcommerceQuery,
  useEcommerceMutation,
  EcommerceQueryInputs,
  EcommerceQueryOutputs,
  EcommerceMutationInputs,
  EcommerceMutationOutputs
} from '../__fixtures__/ecommerce/client';

import {
  useBlogQuery,
  useBlogMutation,
  BlogQueryInputs,
  BlogQueryOutputs,
  BlogMutationInputs,
  BlogMutationOutputs
} from '../__fixtures__/blog/client';

describe('Fixture Type Safety Tests', () => {
  describe('E-commerce Schema Type Inference', () => {
    it('should correctly infer e-commerce query types', () => {
      type InferredQueryInputs = InferQueriesInputs<typeof ecommerceQueries>;
      type InferredQueryOutputs = InferQueriesOutputs<typeof ecommerceQueries>;

      // Test that inferred types match exported client types
      const getUserInput: InferredQueryInputs['get user by id'] = { id: 'user-123' };
      const clientGetUserInput: EcommerceQueryInputs['get user by id'] = { id: 'user-123' };

      expect(getUserInput.id).toBe(clientGetUserInput.id);

      // Test complex query inputs
      const getAllProductsInput: InferredQueryInputs['get all products'] = {
        category_id: 'electronics',
        min_price: 10.0,
        max_price: 1000.0,
        in_stock: true,
        is_active: true,
        limit: 20,
        offset: 0
      };

      expect(getAllProductsInput.category_id).toBe('electronics');
      expect(getAllProductsInput.min_price).toBe(10.0);

      // Test search query with optional parameters
      const searchInput: InferredQueryInputs['search products'] = {
        query: 'laptop computer',
        limit: 10
      };

      expect(searchInput.query).toBe('laptop computer');
      expect(searchInput.limit).toBe(10);
    });

    it('should correctly infer e-commerce mutation types', () => {
      type InferredMutationInputs = InferMutationsInputs<typeof ecommerceMutations>;
      type InferredMutationOutputs = InferMutationsOutputs<typeof ecommerceMutations>;

      // Test user creation
      const createUserInput: InferredMutationInputs['create user'] = {
        email: 'test@example.com',
        password: 'password123',
        first_name: 'John',
        last_name: 'Doe',
        phone: '+1234567890',
        date_of_birth: new Date('1990-01-01')
      };

      expect(createUserInput.email).toBe('test@example.com');
      expect(createUserInput.date_of_birth).toBeInstanceOf(Date);

      // Test complex order creation
      const createOrderInput: InferredMutationInputs['create order'] = {
        user_id: 'user-123',
        items: [
          {
            product_id: 'product-456',
            quantity: 2,
            price: 29.99
          }
        ],
        shipping_address: {
          street: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          postal_code: '12345',
          country: 'US'
        },
        payment_method: 'credit_card'
      };

      expect(createOrderInput.items.length).toBe(1);
      expect(createOrderInput.items[0].quantity).toBe(2);
      expect(createOrderInput.shipping_address.city).toBe('Anytown');

      // Test output types
      const createOrderOutput: InferredMutationOutputs['create order'] = {
        id: 'order-789',
        user_id: 'user-123',
        status: 'pending',
        total_amount: 59.98,
        items: [
          {
            id: 'item-001',
            product_id: 'product-456',
            quantity: 2,
            price: 29.99,
            total: 59.98
          }
        ],
        shipping_address: {
          street: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          postal_code: '12345',
          country: 'US'
        },
        created_at: new Date(),
        updated_at: new Date()
      };

      expect(createOrderOutput.total_amount).toBe(59.98);
      expect(createOrderOutput.status).toBe('pending');
    });

    it('should ensure client types match inferred types', () => {
      // Test that exported client types are equivalent to inferred types
      type InferredQueryInputs = InferQueriesInputs<typeof ecommerceQueries>;
      type InferredQueryOutputs = InferQueriesOutputs<typeof ecommerceQueries>;

      // These type assertions verify type compatibility
      const testQueryInput: InferredQueryInputs['get all users'] = {
        is_active: true,
        limit: 10,
        offset: 0
      };

      const clientQueryInput: EcommerceQueryInputs['get all users'] = testQueryInput;
      expect(clientQueryInput.is_active).toBe(true);

      // Test that hook types work correctly
      expect(typeof useEcommerceQuery).toBe('function');
      expect(typeof useEcommerceMutation).toBe('function');
    });
  });

  describe('Blog Schema Type Inference', () => {
    it('should correctly infer blog query types', () => {
      type InferredQueryInputs = InferQueriesInputs<typeof blogQueries>;
      type InferredQueryOutputs = InferQueriesOutputs<typeof blogQueries>;

      // Test author queries
      const getAuthorInput: InferredQueryInputs['get author by id'] = {
        id: 'author-123'
      };

      const getAllAuthorsInput: InferredQueryInputs['get all authors'] = {
        is_active: true,
        limit: 20,
        offset: 0
      };

      expect(getAuthorInput.id).toBe('author-123');
      expect(getAllAuthorsInput.is_active).toBe(true);

      // Test complex post query
      const getPostBySlugInput: InferredQueryInputs['get post by slug'] = {
        slug: 'my-blog-post',
        increment_views: true
      };

      expect(getPostBySlugInput.slug).toBe('my-blog-post');
      expect(getPostBySlugInput.increment_views).toBe(true);

      // Test search functionality
      const searchPostsInput: InferredQueryInputs['search posts'] = {
        query: 'javascript tutorial',
        published: true,
        limit: 15
      };

      expect(searchPostsInput.query).toBe('javascript tutorial');
      expect(searchPostsInput.published).toBe(true);

      // Test output types
      const postOutput: InferredQueryOutputs['get post by slug'] = {
        id: 'post-123',
        title: 'My Blog Post',
        slug: 'my-blog-post',
        content: 'This is the content of my blog post...',
        excerpt: 'This is a short excerpt',
        author: {
          id: 'author-123',
          username: 'blogger',
          avatar_url: 'https://example.com/avatar.jpg'
        },
        published: true,
        published_at: new Date(),
        featured_image: 'https://example.com/featured.jpg',
        seo_title: 'My Blog Post - SEO Title',
        seo_description: 'SEO description for my blog post',
        view_count: 42,
        reading_time: 5,
        created_at: new Date(),
        updated_at: new Date()
      };

      expect(postOutput.title).toBe('My Blog Post');
      expect(postOutput.author.username).toBe('blogger');
      expect(postOutput.view_count).toBe(42);
    });

    it('should correctly infer blog mutation types', () => {
      type InferredMutationInputs = InferMutationsInputs<typeof blogMutations>;
      type InferredMutationOutputs = InferMutationsOutputs<typeof blogMutations>;

      // Test author creation
      const createAuthorInput: InferredMutationInputs['create author'] = {
        username: 'newblogger',
        email: 'blogger@example.com',
        bio: 'A passionate writer and blogger',
        avatar_url: 'https://example.com/avatar.jpg',
        social_links: {
          twitter: '@newblogger',
          linkedin: 'newblogger',
          website: 'https://newblogger.com'
        }
      };

      expect(createAuthorInput.username).toBe('newblogger');
      expect(createAuthorInput.social_links?.twitter).toBe('@newblogger');

      // Test complex post creation
      const createPostInput: InferredMutationInputs['create post'] = {
        title: 'Introduction to TypeScript',
        slug: 'intro-to-typescript',
        content: `
          TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.

          ## Benefits of TypeScript
          - Type safety
          - Better IDE support
          - Compile-time error checking
        `,
        excerpt: 'Learn the basics of TypeScript in this comprehensive introduction.',
        author_id: 'author-123',
        published: false,
        featured_image: 'https://example.com/typescript-intro.jpg',
        seo_title: 'Introduction to TypeScript | My Blog',
        seo_description: 'A comprehensive introduction to TypeScript for JavaScript developers.',
        reading_time: 8,
        metadata: {
          difficulty: 'beginner',
          series: 'typescript-fundamentals',
          version: '1.0'
        },
        tags: ['tag-ts', 'tag-js'],
        categories: ['programming', 'tutorial']
      };

      expect(createPostInput.title).toBe('Introduction to TypeScript');
      expect(createPostInput.tags?.length).toBe(2);
      expect(createPostInput.metadata?.difficulty).toBe('beginner');

      // Test comment creation with optional fields
      const createCommentInput: InferredMutationInputs['create comment'] = {
        post_id: 'post-123',
        content: 'Great post! Very informative.',
        author_name: 'Anonymous Reader',
        author_email: 'reader@example.com',
        parent_id: 'parent-comment-456'
      };

      expect(createCommentInput.content).toBe('Great post! Very informative.');
      expect(createCommentInput.parent_id).toBe('parent-comment-456');

      // Test tag creation
      const createTagInput: InferredMutationInputs['create tag'] = {
        name: 'TypeScript',
        slug: 'typescript',
        description: 'Posts about TypeScript programming language',
        color: '#007ACC'
      };

      expect(createTagInput.name).toBe('TypeScript');
      expect(createTagInput.color).toBe('#007ACC');
    });

    it('should handle complex nested query responses', () => {
      type InferredQueryOutputs = InferQueriesOutputs<typeof blogQueries>;

      // Test posts with tags response
      const postsWithTags: InferredQueryOutputs['get posts with tags'] = [
        {
          id: 'post-1',
          title: 'JavaScript Fundamentals',
          slug: 'js-fundamentals',
          excerpt: 'Learn JavaScript from the ground up',
          published: true,
          tags: [
            {
              id: 'tag-1',
              name: 'JavaScript',
              slug: 'javascript',
              color: '#F7DF1E'
            },
            {
              id: 'tag-2',
              name: 'Fundamentals',
              slug: 'fundamentals',
              color: '#61DAFB'
            }
          ],
          created_at: new Date()
        }
      ];

      expect(postsWithTags[0].tags.length).toBe(2);
      expect(postsWithTags[0].tags[0].name).toBe('JavaScript');

      // Test posts by tag response
      const postsByTag: InferredQueryOutputs['get posts by tag'] = [
        {
          id: 'post-2',
          title: 'Advanced JavaScript',
          slug: 'advanced-js',
          excerpt: 'Advanced JavaScript concepts',
          published: true,
          author: {
            id: 'author-1',
            username: 'jsexpert'
          },
          created_at: new Date()
        }
      ];

      expect(postsByTag[0].author.username).toBe('jsexpert');

      // Test comment hierarchy
      const commentsWithReplies: InferredQueryOutputs['get post comments'] = [
        {
          id: 'comment-1',
          content: 'Great article!',
          author_name: 'Reader 1',
          is_approved: true,
          parent_id: null,
          created_at: new Date(),
          replies: [
            {
              id: 'reply-1',
              content: 'Thank you for reading!',
              author_name: 'Author',
              created_at: new Date()
            }
          ]
        }
      ];

      expect(commentsWithReplies[0].replies.length).toBe(1);
      expect(commentsWithReplies[0].replies[0].content).toBe('Thank you for reading!');
    });

    it('should ensure client types match inferred types', () => {
      // Test that exported client types are equivalent to inferred types
      type InferredQueryInputs = InferQueriesInputs<typeof blogQueries>;
      type InferredMutationInputs = InferMutationsInputs<typeof blogMutations>;

      // These type assertions verify type compatibility
      const testQueryInput: InferredQueryInputs['get all posts'] = {
        published: true,
        author_id: 'author-123',
        limit: 10,
        sort_by: 'published_at',
        sort_order: 'desc'
      };

      const clientQueryInput: BlogQueryInputs['get all posts'] = testQueryInput;
      expect(clientQueryInput.published).toBe(true);

      const testMutationInput: InferredMutationInputs['update post'] = {
        id: 'post-123',
        title: 'Updated Title',
        published: true
      };

      const clientMutationInput: BlogMutationInputs['update post'] = testMutationInput;
      expect(clientMutationInput.title).toBe('Updated Title');

      // Test that hook types work correctly
      expect(typeof useBlogQuery).toBe('function');
      expect(typeof useBlogMutation).toBe('function');
    });
  });

  describe('Cross-Schema Type Consistency', () => {
    it('should maintain consistent patterns across schemas', () => {
      // Test that both schemas follow similar patterns for common operations

      // Both schemas should have consistent ID patterns
      type EcommerceGetById = EcommerceQueryInputs['get user by id'];
      type BlogGetById = BlogQueryInputs['get author by id'];

      const ecommerceId: EcommerceGetById = { id: 'user-123' };
      const blogId: BlogGetById = { id: 'author-123' };

      expect(ecommerceId.id).toBeDefined();
      expect(blogId.id).toBeDefined();

      // Both schemas should have consistent pagination patterns
      type EcommercePagination = EcommerceQueryInputs['get all users'];
      type BlogPagination = BlogQueryInputs['get all authors'];

      const ecommercePage: EcommercePagination = {
        limit: 20,
        offset: 0
      };

      const blogPage: BlogPagination = {
        limit: 20,
        offset: 0
      };

      expect(ecommercePage.limit).toBe(20);
      expect(blogPage.limit).toBe(20);

      // Both schemas should have consistent search patterns
      type EcommerceSearch = EcommerceQueryInputs['search products'];
      type BlogSearch = BlogQueryInputs['search posts'];

      const ecommerceSearchInput: EcommerceSearch = {
        query: 'search term',
        limit: 10
      };

      const blogSearchInput: BlogSearch = {
        query: 'search term',
        limit: 10
      };

      expect(ecommerceSearchInput.query).toBe(blogSearchInput.query);
    });

    it('should handle nullable and optional fields consistently', () => {
      // Test nullable field handling
      type EcommerceUser = EcommerceQueryOutputs['get user by id'];
      type BlogAuthor = BlogQueryOutputs['get author by id'];

      const userWithNulls: EcommerceUser = {
        id: 'user-1',
        email: 'user@example.com',
        first_name: 'John',
        last_name: 'Doe',
        phone: null, // nullable
        date_of_birth: null, // nullable
        address: null, // nullable
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      };

      const authorWithNulls: BlogAuthor = {
        id: 'author-1',
        username: 'author',
        email: 'author@example.com',
        bio: null, // nullable
        avatar_url: null, // nullable
        is_active: true,
        social_links: {},
        created_at: new Date(),
        updated_at: new Date()
      };

      expect(userWithNulls.phone).toBeNull();
      expect(authorWithNulls.bio).toBeNull();
    });

    it('should support complex nested relationships consistently', () => {
      // Test that both schemas handle complex nested data similarly
      type EcommerceOrder = EcommerceMutationOutputs['create order'];
      type BlogPost = BlogQueryOutputs['get post by slug'];

      const complexOrder: EcommerceOrder = {
        id: 'order-1',
        user_id: 'user-1',
        status: 'pending',
        total_amount: 99.99,
        items: [
          {
            id: 'item-1',
            product_id: 'product-1',
            quantity: 2,
            price: 49.99,
            total: 99.98
          }
        ],
        shipping_address: {
          street: '123 Main St',
          city: 'City',
          state: 'State',
          postal_code: '12345',
          country: 'US'
        },
        created_at: new Date(),
        updated_at: new Date()
      };

      const complexPost: BlogPost = {
        id: 'post-1',
        title: 'Complex Post',
        slug: 'complex-post',
        content: 'Post content...',
        excerpt: 'Excerpt...',
        author: {
          id: 'author-1',
          username: 'author',
          avatar_url: 'https://example.com/avatar.jpg'
        },
        published: true,
        published_at: new Date(),
        featured_image: 'https://example.com/image.jpg',
        seo_title: 'SEO Title',
        seo_description: 'SEO Description',
        view_count: 100,
        reading_time: 5,
        created_at: new Date(),
        updated_at: new Date()
      };

      expect(complexOrder.items.length).toBeGreaterThan(0);
      expect(complexPost.author.username).toBeDefined();
    });
  });

  describe('Type Safety Edge Cases', () => {
    it('should handle date serialization correctly', () => {
      // Test that Date objects are properly typed
      type BlogPost = BlogMutationOutputs['create post'];
      type EcommerceUser = EcommerceMutationOutputs['create user'];

      const post: BlogPost = {
        id: 'post-1',
        title: 'Test Post',
        slug: 'test-post',
        content: 'Content...',
        author_id: 'author-1',
        published: false,
        published_at: null,
        created_at: new Date() // Should be Date type
      };

      const user: EcommerceUser = {
        id: 'user-1',
        email: 'user@example.com',
        first_name: 'User',
        last_name: 'Test',
        is_active: true,
        created_at: new Date(), // Should be Date type
        updated_at: new Date() // Should be Date type
      };

      expect(post.created_at).toBeInstanceOf(Date);
      expect(user.created_at).toBeInstanceOf(Date);
      expect(user.updated_at).toBeInstanceOf(Date);
    });

    it('should handle enum constraints properly', () => {
      // Test enum value constraints
      type OrderStatus = EcommerceMutationInputs['update order status'];
      type PostSort = BlogQueryInputs['get all posts'];

      const orderStatusUpdate: OrderStatus = {
        id: 'order-1',
        status: 'confirmed' // Should only accept valid enum values
      };

      const postSort: PostSort = {
        sort_by: 'published_at', // Should only accept valid sort fields
        sort_order: 'desc' // Should only accept 'asc' | 'desc'
      };

      expect(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']).toContain(orderStatusUpdate.status);
      expect(['created_at', 'published_at', 'view_count']).toContain(postSort.sort_by);
      expect(['asc', 'desc']).toContain(postSort.sort_order);
    });

    it('should handle array validation correctly', () => {
      // Test array field validation
      type CreateOrder = EcommerceMutationInputs['create order'];
      type CreatePost = BlogMutationInputs['create post'];

      const orderWithItems: CreateOrder = {
        user_id: 'user-1',
        items: [ // Array of order items
          {
            product_id: 'product-1',
            quantity: 2,
            price: 29.99
          },
          {
            product_id: 'product-2',
            quantity: 1,
            price: 49.99
          }
        ],
        shipping_address: {
          street: '123 Main St',
          city: 'City',
          state: 'State',
          postal_code: '12345',
          country: 'US'
        },
        payment_method: 'credit_card'
      };

      const postWithTags: CreatePost = {
        title: 'Post with Tags',
        slug: 'post-with-tags',
        content: 'Content...',
        author_id: 'author-1',
        tags: ['tag-1', 'tag-2', 'tag-3'], // Array of tag IDs
        categories: ['category-1'] // Array of category IDs
      };

      expect(Array.isArray(orderWithItems.items)).toBe(true);
      expect(orderWithItems.items.length).toBe(2);
      expect(Array.isArray(postWithTags.tags)).toBe(true);
      expect(postWithTags.tags?.length).toBe(3);
    });
  });
});