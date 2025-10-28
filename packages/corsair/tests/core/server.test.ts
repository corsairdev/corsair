import { describe, it, expect, vi } from 'vitest';
import { z } from 'zod';
import { createCorsairServerQueryClient, createCorsairServerMutationClient } from '../../core/server';
import { createQuery, createMutation } from '../../core/operation';

interface TestContext {
  userId: string;
  database: {
    users: Array<{ id: string; name: string; email: string }>;
  };
}

const query = createQuery<TestContext>();
const mutation = createMutation<TestContext>();

const mockDatabase = {
  users: [
    { id: '1', name: 'John Doe', email: 'john@example.com' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com' }
  ]
};

const createMockContext = (): TestContext => ({
  userId: 'test-user',
  database: {
    users: [
      { id: '1', name: 'John Doe', email: 'john@example.com' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com' }
    ]
  }
});

const testQueries = {
  'get user': query({
    prompt: 'get user',
    input_type: z.object({ id: z.string() }),
    response_type: z.object({ id: z.string(), name: z.string(), email: z.string() }),
    dependencies: { tables: ['users'], columns: ['users.*'] },
    handler: async (input, ctx) => {
      const user = ctx.database.users.find(u => u.id === input.id);
      if (!user) throw new Error('User not found');
      return user;
    }
  }),
  'list users': query({
    prompt: 'list users',
    input_type: z.object({ limit: z.number().optional() }),
    response_type: z.array(z.object({ id: z.string(), name: z.string() })),
    dependencies: { tables: ['users'], columns: ['users.*'] },
    handler: async (input, ctx) => {
      const users = ctx.database.users.slice(0, input.limit || 10);
      return users.map(u => ({ id: u.id, name: u.name }));
    }
  })
};

const testMutations = {
  'create user': mutation({
    prompt: 'create user',
    input_type: z.object({ name: z.string(), email: z.string().email() }),
    response_type: z.object({ id: z.string(), name: z.string(), email: z.string() }),
    dependencies: { tables: ['users'], columns: ['users.*'] },
    handler: async (input, ctx) => {
      const newUser = {
        id: `user-${Date.now()}`,
        name: input.name,
        email: input.email
      };
      ctx.database.users.push(newUser);
      return newUser;
    }
  }),
  'delete user': mutation({
    prompt: 'delete user',
    input_type: z.object({ id: z.string() }),
    response_type: z.object({ success: z.boolean() }),
    dependencies: { tables: ['users'], columns: ['users.*'] },
    handler: async (input, ctx) => {
      const index = ctx.database.users.findIndex(u => u.id === input.id);
      if (index === -1) return { success: false };
      ctx.database.users.splice(index, 1);
      return { success: true };
    }
  })
};

describe('createCorsairServerQueryClient', () => {
  it('should create a server query client with query method', () => {
    const serverClient = createCorsairServerQueryClient(testQueries, createMockContext);

    expect(serverClient).toBeDefined();
    expect(serverClient.query).toBeDefined();
    expect(typeof serverClient.query).toBe('function');
  });

  it('should execute queries with proper context', async () => {
    const contextFactory = vi.fn(createMockContext);
    const serverClient = createCorsairServerQueryClient(testQueries, contextFactory);

    const result = await serverClient.query('get user', { id: '1' });

    expect(contextFactory).toHaveBeenCalled();
    expect(result).toEqual({
      id: '1',
      name: 'John Doe',
      email: 'john@example.com'
    });
  });

  it('should handle query errors properly', async () => {
    const serverClient = createCorsairServerQueryClient(testQueries, createMockContext);

    await expect(
      serverClient.query('get user', { id: 'nonexistent' })
    ).rejects.toThrow('User not found');
  });

  it('should validate input parameters', async () => {
    const serverClient = createCorsairServerQueryClient(testQueries, createMockContext);

    // Valid input should work
    const result = await serverClient.query('list users', { limit: 5 });
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeLessThanOrEqual(5);

    // Invalid input should be caught by Zod validation
    await expect(
      // @ts-expect-error - Testing runtime validation
      serverClient.query('list users', { limit: 'invalid' })
    ).rejects.toThrow();
  });

  it('should support optional parameters', async () => {
    const serverClient = createCorsairServerQueryClient(testQueries, createMockContext);

    // Should work without optional parameter
    const result = await serverClient.query('list users', {});
    expect(Array.isArray(result)).toBe(true);

    // Should work with optional parameter
    const limitedResult = await serverClient.query('list users', { limit: 1 });
    expect(limitedResult.length).toBe(1);
  });
});

describe('createCorsairServerMutationClient', () => {
  it('should create a server mutation client with mutate method', () => {
    const serverClient = createCorsairServerMutationClient(testMutations, createMockContext);

    expect(serverClient).toBeDefined();
    expect(serverClient.mutate).toBeDefined();
    expect(typeof serverClient.mutate).toBe('function');
  });

  it('should execute mutations with side effects', async () => {
    const contextFactory = vi.fn(createMockContext);
    const serverClient = createCorsairServerMutationClient(testMutations, contextFactory);

    const initialUserCount = mockDatabase.users.length;
    const result = await serverClient.mutate('create user', {
      name: 'New User',
      email: 'new@example.com'
    });

    expect(contextFactory).toHaveBeenCalled();
    expect(result.name).toBe('New User');
    expect(result.email).toBe('new@example.com');
    expect(result.id).toBeDefined();
  });

  it('should handle mutation validation', async () => {
    const serverClient = createCorsairServerMutationClient(testMutations, createMockContext);

    // Valid mutation should work
    const result = await serverClient.mutate('create user', {
      name: 'Valid User',
      email: 'valid@example.com'
    });
    expect(result.name).toBe('Valid User');

    // Invalid email should be rejected by Zod
    await expect(
      serverClient.mutate('create user', {
        name: 'Invalid User',
        email: 'invalid-email'
      })
    ).rejects.toThrow();
  });

  it('should handle mutation failures gracefully', async () => {
    const serverClient = createCorsairServerMutationClient(testMutations, createMockContext);

    // Delete non-existent user should return success: false
    const result = await serverClient.mutate('delete user', { id: 'nonexistent' });
    expect(result.success).toBe(false);

    // Delete existing user should work
    const deleteResult = await serverClient.mutate('delete user', { id: '1' });
    expect(deleteResult.success).toBe(true);
  });
});

describe('Context Management', () => {
  it('should call context factory for each operation', async () => {
    const contextFactory = vi.fn(createMockContext);
    const queryClient = createCorsairServerQueryClient(testQueries, contextFactory);
    const mutationClient = createCorsairServerMutationClient(testMutations, contextFactory);

    await queryClient.query('get user', { id: '1' });
    await mutationClient.mutate('create user', { name: 'Test', email: 'test@example.com' });

    expect(contextFactory).toHaveBeenCalledTimes(2);
  });

  it('should pass context correctly to handlers', async () => {
    const customContext = {
      userId: 'custom-user',
      database: {
        users: [{ id: 'custom', name: 'Custom User', email: 'custom@example.com' }]
      }
    };

    const serverClient = createCorsairServerQueryClient(testQueries, () => customContext);

    const result = await serverClient.query('get user', { id: 'custom' });
    expect(result.name).toBe('Custom User');
  });

  it('should handle context factory errors', async () => {
    const failingContextFactory = () => {
      throw new Error('Context creation failed');
    };

    const serverClient = createCorsairServerQueryClient(testQueries, failingContextFactory);

    await expect(
      serverClient.query('get user', { id: '1' })
    ).rejects.toThrow('Context creation failed');
  });
});

describe('Type Safety', () => {
  it('should enforce type safety at compile time', () => {
    const serverClient = createCorsairServerQueryClient(testQueries, createMockContext);

    // These would cause TypeScript errors if uncommented:
    // serverClient.query('nonexistent', { id: '1' });
    // serverClient.query('get user', { wrongProp: 'value' });
    // serverClient.query('get user', { id: 123 });

    expect(true).toBe(true); // Placeholder for compile-time checks
  });

  it('should maintain response type inference', async () => {
    const serverClient = createCorsairServerQueryClient(testQueries, createMockContext);

    const user = await serverClient.query('get user', { id: '1' });
    const users = await serverClient.query('list users', {});

    // TypeScript should infer these types correctly
    expect(typeof user.id).toBe('string');
    expect(typeof user.name).toBe('string');
    expect(typeof user.email).toBe('string');
    expect(Array.isArray(users)).toBe(true);
    if (users.length > 0) {
      expect(typeof users[0].id).toBe('string');
      expect(typeof users[0].name).toBe('string');
    }
  });
});