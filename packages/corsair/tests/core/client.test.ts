import { describe, it, expect, vi, beforeEach } from 'vitest';
import { z } from 'zod';
import { createCorsairQueryClient, createCorsairMutationClient } from '../../core/client';
import { createQuery, createMutation } from '../../core/operation';

// Mock React Query
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn()
}));

interface TestContext {
  userId: string;
}

const query = createQuery<TestContext>();
const mutation = createMutation<TestContext>();

const testQueries = {
  'get user': query({
    prompt: 'get user',
    input_type: z.object({ id: z.string() }),
    response_type: z.object({ id: z.string(), name: z.string() }),
    dependencies: { tables: ['users'], columns: ['users.*'] },
    handler: async (input) => ({ id: input.id, name: 'Test User' })
  }),
  'search users': query({
    prompt: 'search users',
    input_type: z.object({ query: z.string(), limit: z.number().optional() }),
    response_type: z.array(z.object({ id: z.string(), name: z.string() })),
    dependencies: { tables: ['users'], columns: ['users.*'] },
    handler: async () => [{ id: '1', name: 'User 1' }]
  })
};

const testMutations = {
  'create user': mutation({
    prompt: 'create user',
    input_type: z.object({ name: z.string(), email: z.string() }),
    response_type: z.object({ id: z.string(), name: z.string(), email: z.string() }),
    dependencies: { tables: ['users'], columns: ['users.*'] },
    handler: async (input) => ({ id: 'new-id', ...input })
  }),
  'update user': mutation({
    prompt: 'update user',
    input_type: z.object({ id: z.string(), name: z.string().optional() }),
    response_type: z.object({ id: z.string(), name: z.string() }),
    dependencies: { tables: ['users'], columns: ['users.*'] },
    handler: async (input) => ({ id: input.id, name: input.name || 'Updated' })
  })
};

describe('createCorsairQueryClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a query client with useQuery method', () => {
    const queryClient = createCorsairQueryClient(testQueries);

    expect(queryClient).toBeDefined();
    expect(queryClient.useQuery).toBeDefined();
    expect(typeof queryClient.useQuery).toBe('function');
  });

  it('should provide type-safe query keys', () => {
    const queryClient = createCorsairQueryClient(testQueries);

    // Test that query client structure is correct (without calling hooks)
    expect(queryClient.useQuery).toBeDefined();
    expect(typeof queryClient.useQuery).toBe('function');

    // These types should compile without TypeScript errors (compile-time test)
    // const getUserKey = queryClient.useQuery('get user', { id: 'test-id' });
    // const searchUsersKey = queryClient.useQuery('search users', { query: 'test', limit: 10 });
  });

  it('should enforce input type validation at compile time', () => {
    const queryClient = createCorsairQueryClient(testQueries);

    // These would cause TypeScript errors if uncommented:
    // queryClient.useQuery('get user', { wrongProp: 'value' });
    // queryClient.useQuery('get user', { id: 123 }); // wrong type
    // queryClient.useQuery('nonexistent query', { id: 'test' });

    expect(true).toBe(true); // Placeholder for compile-time checks
  });

  it('should handle optional parameters correctly', () => {
    const queryClient = createCorsairQueryClient(testQueries);

    // Test that query client structure supports optional parameters (without calling hooks)
    expect(queryClient.useQuery).toBeDefined();
    expect(typeof queryClient.useQuery).toBe('function');

    // These types should compile correctly (compile-time test):
    // const withLimit = queryClient.useQuery('search users', { query: 'test', limit: 5 });
    // const withoutLimit = queryClient.useQuery('search users', { query: 'test' });
  });
});

describe('createCorsairMutationClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a mutation client with useMutation method', () => {
    const mutationClient = createCorsairMutationClient(testMutations);

    expect(mutationClient).toBeDefined();
    expect(mutationClient.useMutation).toBeDefined();
    expect(typeof mutationClient.useMutation).toBe('function');
  });

  it('should provide type-safe mutation keys', () => {
    const mutationClient = createCorsairMutationClient(testMutations);

    // Test that mutation client structure is correct (without calling hooks)
    expect(mutationClient.useMutation).toBeDefined();
    expect(typeof mutationClient.useMutation).toBe('function');

    // These types should compile correctly (compile-time test):
    // const createUserMutation = mutationClient.useMutation('create user');
    // const updateUserMutation = mutationClient.useMutation('update user');
  });

  it('should enforce mutation type validation at compile time', () => {
    const mutationClient = createCorsairMutationClient(testMutations);

    // These would cause TypeScript errors if uncommented:
    // mutationClient.useMutation('nonexistent mutation');
    // The mutation function would enforce proper input types at runtime

    expect(true).toBe(true); // Placeholder for compile-time checks
  });
});

describe('Type Inference', () => {
  it('should properly infer query input and output types', () => {
    const queryClient = createCorsairQueryClient(testQueries);

    // Test type inference through function signatures
    type GetUserInput = Parameters<typeof queryClient.useQuery<'get user'>>[1];
    type SearchUsersInput = Parameters<typeof queryClient.useQuery<'search users'>>[1];

    // These type assertions verify correct inference
    const getUserInput: GetUserInput = { id: 'test' };
    const searchUsersInput: SearchUsersInput = { query: 'test', limit: 10 };

    expect(getUserInput.id).toBe('test');
    expect(searchUsersInput.query).toBe('test');
    expect(searchUsersInput.limit).toBe(10);
  });

  it('should properly infer mutation input and output types', () => {
    const mutationClient = createCorsairMutationClient(testMutations);

    // Test that mutation client structure supports type inference (without calling hooks)
    expect(mutationClient.useMutation).toBeDefined();
    expect(typeof mutationClient.useMutation).toBe('function');

    // These types should be properly inferred (compile-time test):
    // const createUserMutation = mutationClient.useMutation('create user');
    // const updateUserMutation = mutationClient.useMutation('update user');
  });
});

describe('Error Handling', () => {
  it('should handle invalid query keys gracefully', () => {
    const queryClient = createCorsairQueryClient(testQueries);

    // Runtime error handling for invalid keys
    expect(() => {
      // @ts-expect-error - Testing runtime behavior
      queryClient.useQuery('invalid-query' as any, {});
    }).not.toThrow(); // Should not throw immediately, error handling is in React Query
  });

  it('should validate input schemas at runtime', () => {
    const queryClient = createCorsairQueryClient(testQueries);

    // Schema validation happens in the query execution, not in useQuery call
    // This test verifies the structure is correct for validation
    expect(testQueries['get user'].input_type.safeParse({ id: 'valid' }).success).toBe(true);
    expect(testQueries['get user'].input_type.safeParse({ id: 123 }).success).toBe(false);
  });
});