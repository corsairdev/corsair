import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import {
  InferQueriesInputs,
  InferQueriesOutputs,
  InferMutationsInputs,
  InferMutationsOutputs
} from '../../core/types';
import { createQuery, createMutation } from '../../core/operation';

interface TestContext {
  userId: string;
}

const query = createQuery<TestContext>();
const mutation = createMutation<TestContext>();

// Create test queries and mutations for type inference testing
const testQueries = {
  'get user': query({
    prompt: 'get user',
    input_type: z.object({
      id: z.string(),
      includeProfile: z.boolean().optional()
    }),
    response_type: z.object({
      id: z.string(),
      name: z.string(),
      email: z.string(),
      profile: z.object({
        bio: z.string(),
        avatar: z.string().nullable()
      }).optional()
    }),
    dependencies: { tables: ['users'], columns: ['users.*'] },
    handler: async () => ({
      id: '1',
      name: 'Test',
      email: 'test@example.com'
    })
  }),

  'search users': query({
    prompt: 'search users',
    input_type: z.object({
      query: z.string(),
      limit: z.number().default(10),
      filters: z.object({
        active: z.boolean().optional(),
        role: z.enum(['admin', 'user']).optional()
      }).optional()
    }),
    response_type: z.array(z.object({
      id: z.string(),
      name: z.string(),
      matchScore: z.number()
    })),
    dependencies: { tables: ['users'], columns: ['users.*'] },
    handler: async () => []
  }),

  'get stats': query({
    prompt: 'get stats',
    input_type: z.object({}),
    response_type: z.object({
      totalUsers: z.number(),
      activeUsers: z.number(),
      metrics: z.record(z.number())
    }),
    dependencies: { tables: ['users'], columns: ['users.*'] },
    handler: async () => ({
      totalUsers: 100,
      activeUsers: 80,
      metrics: {}
    })
  })
} as const;

const testMutations = {
  'create user': mutation({
    prompt: 'create user',
    input_type: z.object({
      name: z.string(),
      email: z.string().email(),
      profile: z.object({
        bio: z.string().optional(),
        avatar: z.string().url().optional()
      }).optional()
    }),
    response_type: z.object({
      id: z.string(),
      name: z.string(),
      email: z.string(),
      createdAt: z.date()
    }),
    dependencies: { tables: ['users'], columns: ['users.*'] },
    handler: async (input) => ({
      id: 'new-id',
      name: input.name,
      email: input.email,
      createdAt: new Date()
    })
  }),

  'update user': mutation({
    prompt: 'update user',
    input_type: z.object({
      id: z.string(),
      updates: z.object({
        name: z.string().optional(),
        email: z.string().email().optional(),
        active: z.boolean().optional()
      })
    }),
    response_type: z.object({
      id: z.string(),
      updatedFields: z.array(z.string())
    }),
    dependencies: { tables: ['users'], columns: ['users.*'] },
    handler: async (input) => ({
      id: input.id,
      updatedFields: Object.keys(input.updates)
    })
  }),

  'delete user': mutation({
    prompt: 'delete user',
    input_type: z.object({
      id: z.string(),
      reason: z.string().optional()
    }),
    response_type: z.object({
      success: z.boolean(),
      deletedId: z.string()
    }),
    dependencies: { tables: ['users'], columns: ['users.*'] },
    handler: async (input) => ({
      success: true,
      deletedId: input.id
    })
  })
} as const;

describe('Type Inference', () => {
  describe('InferQueriesInputs', () => {
    it('should correctly infer input types for all queries', () => {
      type QueryInputs = InferQueriesInputs<typeof testQueries>;

      // Test get user input type
      const getUserInput: QueryInputs['get user'] = {
        id: 'test-id',
        includeProfile: true
      };
      expect(getUserInput.id).toBe('test-id');
      expect(getUserInput.includeProfile).toBe(true);

      // Test search users input type
      const searchUsersInput: QueryInputs['search users'] = {
        query: 'john',
        limit: 5,
        filters: {
          active: true,
          role: 'admin'
        }
      };
      expect(searchUsersInput.query).toBe('john');
      expect(searchUsersInput.limit).toBe(5);
      expect(searchUsersInput.filters?.active).toBe(true);

      // Test get stats input type (empty object)
      const getStatsInput: QueryInputs['get stats'] = {};
      expect(getStatsInput).toEqual({});
    });

    it('should enforce required and optional properties correctly', () => {
      type QueryInputs = InferQueriesInputs<typeof testQueries>;

      // Required properties should be enforced
      const getUserInput: QueryInputs['get user'] = {
        id: 'required-id'
        // includeProfile is optional
      };
      expect(getUserInput.id).toBe('required-id');

      // Optional nested properties
      const searchInput: QueryInputs['search users'] = {
        query: 'search-term'
        // limit has default, filters is optional
      };
      expect(searchInput.query).toBe('search-term');
    });
  });

  describe('InferQueriesOutputs', () => {
    it('should correctly infer output types for all queries', () => {
      type QueryOutputs = InferQueriesOutputs<typeof testQueries>;

      // Test get user output type
      const getUserOutput: QueryOutputs['get user'] = {
        id: 'user-id',
        name: 'John Doe',
        email: 'john@example.com',
        profile: {
          bio: 'Bio text',
          avatar: 'https://example.com/avatar.jpg'
        }
      };
      expect(getUserOutput.id).toBe('user-id');
      expect(getUserOutput.profile?.bio).toBe('Bio text');

      // Test search users output type (array)
      const searchUsersOutput: QueryOutputs['search users'] = [
        {
          id: 'user-1',
          name: 'User One',
          matchScore: 0.95
        }
      ];
      expect(Array.isArray(searchUsersOutput)).toBe(true);
      expect(searchUsersOutput[0].matchScore).toBe(0.95);

      // Test get stats output type
      const getStatsOutput: QueryOutputs['get stats'] = {
        totalUsers: 100,
        activeUsers: 80,
        metrics: {
          dailyActiveUsers: 50,
          monthlyActiveUsers: 90
        }
      };
      expect(getStatsOutput.totalUsers).toBe(100);
      expect(getStatsOutput.metrics.dailyActiveUsers).toBe(50);
    });

    it('should handle nullable and optional properties correctly', () => {
      type QueryOutputs = InferQueriesOutputs<typeof testQueries>;

      // Avatar can be null
      const getUserOutputWithNullAvatar: QueryOutputs['get user'] = {
        id: 'user-id',
        name: 'John Doe',
        email: 'john@example.com',
        profile: {
          bio: 'Bio text',
          avatar: null
        }
      };
      expect(getUserOutputWithNullAvatar.profile?.avatar).toBeNull();

      // Profile is optional
      const getUserOutputWithoutProfile: QueryOutputs['get user'] = {
        id: 'user-id',
        name: 'John Doe',
        email: 'john@example.com'
      };
      expect(getUserOutputWithoutProfile.profile).toBeUndefined();
    });
  });

  describe('InferMutationsInputs', () => {
    it('should correctly infer input types for all mutations', () => {
      type MutationInputs = InferMutationsInputs<typeof testMutations>;

      // Test create user input type
      const createUserInput: MutationInputs['create user'] = {
        name: 'New User',
        email: 'new@example.com',
        profile: {
          bio: 'User bio',
          avatar: 'https://example.com/avatar.jpg'
        }
      };
      expect(createUserInput.name).toBe('New User');
      expect(createUserInput.profile?.bio).toBe('User bio');

      // Test update user input type
      const updateUserInput: MutationInputs['update user'] = {
        id: 'user-id',
        updates: {
          name: 'Updated Name',
          active: true
        }
      };
      expect(updateUserInput.id).toBe('user-id');
      expect(updateUserInput.updates.active).toBe(true);

      // Test delete user input type
      const deleteUserInput: MutationInputs['delete user'] = {
        id: 'user-to-delete',
        reason: 'Account deactivation'
      };
      expect(deleteUserInput.id).toBe('user-to-delete');
      expect(deleteUserInput.reason).toBe('Account deactivation');
    });

    it('should handle nested optional objects correctly', () => {
      type MutationInputs = InferMutationsInputs<typeof testMutations>;

      // Profile is optional in create user
      const createUserInputMinimal: MutationInputs['create user'] = {
        name: 'Minimal User',
        email: 'minimal@example.com'
      };
      expect(createUserInputMinimal.profile).toBeUndefined();

      // Updates object has all optional properties
      const updateUserInputPartial: MutationInputs['update user'] = {
        id: 'user-id',
        updates: {
          name: 'Only name updated'
        }
      };
      expect(updateUserInputPartial.updates.email).toBeUndefined();
    });
  });

  describe('InferMutationsOutputs', () => {
    it('should correctly infer output types for all mutations', () => {
      type MutationOutputs = InferMutationsOutputs<typeof testMutations>;

      // Test create user output type
      const createUserOutput: MutationOutputs['create user'] = {
        id: 'new-user-id',
        name: 'Created User',
        email: 'created@example.com',
        createdAt: new Date()
      };
      expect(createUserOutput.id).toBe('new-user-id');
      expect(createUserOutput.createdAt instanceof Date).toBe(true);

      // Test update user output type
      const updateUserOutput: MutationOutputs['update user'] = {
        id: 'updated-user-id',
        updatedFields: ['name', 'email']
      };
      expect(Array.isArray(updateUserOutput.updatedFields)).toBe(true);
      expect(updateUserOutput.updatedFields).toContain('name');

      // Test delete user output type
      const deleteUserOutput: MutationOutputs['delete user'] = {
        success: true,
        deletedId: 'deleted-user-id'
      };
      expect(deleteUserOutput.success).toBe(true);
      expect(deleteUserOutput.deletedId).toBe('deleted-user-id');
    });
  });

  describe('Complex Type Scenarios', () => {
    it('should handle unions and enums correctly', () => {
      type QueryInputs = InferQueriesInputs<typeof testQueries>;

      const searchWithRole: QueryInputs['search users'] = {
        query: 'test',
        filters: {
          role: 'admin' // Should only accept 'admin' | 'user'
        }
      };
      expect(searchWithRole.filters?.role).toBe('admin');

      // This should cause a TypeScript error if uncommented:
      // const invalidRole: QueryInputs['search users'] = {
      //   query: 'test',
      //   filters: { role: 'invalid' }
      // };
    });

    it('should preserve array types correctly', () => {
      type QueryOutputs = InferQueriesOutputs<typeof testQueries>;
      type MutationOutputs = InferMutationsOutputs<typeof testMutations>;

      // Array response type
      const searchResults: QueryOutputs['search users'] = [];
      expect(Array.isArray(searchResults)).toBe(true);

      // Array in nested object
      const updateResult: MutationOutputs['update user'] = {
        id: 'user-id',
        updatedFields: []
      };
      expect(Array.isArray(updateResult.updatedFields)).toBe(true);
    });

    it('should handle record types correctly', () => {
      type QueryOutputs = InferQueriesOutputs<typeof testQueries>;

      const statsOutput: QueryOutputs['get stats'] = {
        totalUsers: 100,
        activeUsers: 80,
        metrics: {
          custom_metric_1: 42,
          custom_metric_2: 99,
          another_metric: 0
        }
      };

      expect(typeof statsOutput.metrics).toBe('object');
      expect(typeof statsOutput.metrics.custom_metric_1).toBe('number');
    });

    it('should maintain type safety with deeply nested objects', () => {
      type QueryInputs = InferQueriesInputs<typeof testQueries>;
      type MutationInputs = InferMutationsInputs<typeof testMutations>;

      // Deeply nested optional structures
      const searchWithNestedFilters: QueryInputs['search users'] = {
        query: 'test',
        filters: {
          active: true,
          role: 'user'
        }
      };

      const createUserWithProfile: MutationInputs['create user'] = {
        name: 'Test User',
        email: 'test@example.com',
        profile: {
          bio: 'Test bio'
          // avatar is optional within the optional profile
        }
      };

      expect(searchWithNestedFilters.filters?.active).toBe(true);
      expect(createUserWithProfile.profile?.bio).toBe('Test bio');
    });
  });
});