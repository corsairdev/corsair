import { describe, it, expect, vi } from 'vitest';
import { z } from 'zod';
import { createQuery, createMutation } from '../../core/operation';

interface TestContext {
  userId: string;
  database: {
    users: Array<{ id: string; name: string; email: string }>;
  };
}

const mockContext: TestContext = {
  userId: 'test-user',
  database: {
    users: [
      { id: '1', name: 'John Doe', email: 'john@example.com' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com' }
    ]
  }
};

describe('createQuery', () => {
  it('should create a query with proper types', () => {
    const query = createQuery<TestContext>();

    const getUserQuery = query({
      prompt: 'get user by id',
      input_type: z.object({
        id: z.string()
      }),
      response_type: z.object({
        id: z.string(),
        name: z.string(),
        email: z.string()
      }),
      dependencies: {
        tables: ['users'],
        columns: ['users.*']
      },
      handler: async (input, ctx) => {
        const user = ctx.database.users.find(u => u.id === input.id);
        if (!user) throw new Error('User not found');
        return user;
      }
    });

    expect(getUserQuery).toBeDefined();
    expect(getUserQuery.prompt).toBe('get user by id');
    expect(getUserQuery.input_type).toBeDefined();
    expect(getUserQuery.response_type).toBeDefined();
    expect(getUserQuery.dependencies).toEqual({
      tables: ['users'],
      columns: ['users.*']
    });
    expect(typeof getUserQuery.handler).toBe('function');
  });

  it('should validate input types with Zod schemas', () => {
    const query = createQuery<TestContext>();

    const getUserQuery = query({
      prompt: 'get user by id',
      input_type: z.object({
        id: z.string().min(1)
      }),
      response_type: z.object({
        id: z.string(),
        name: z.string()
      }),
      dependencies: {
        tables: ['users'],
        columns: ['users.*']
      },
      handler: async (input, ctx) => {
        return { id: input.id, name: 'Test User' };
      }
    });

    // Valid input should pass
    expect(() => getUserQuery.input_type.parse({ id: 'valid-id' })).not.toThrow();

    // Invalid input should throw
    expect(() => getUserQuery.input_type.parse({ id: '' })).toThrow();
    expect(() => getUserQuery.input_type.parse({})).toThrow();
  });

  it('should execute handler with proper context', async () => {
    const query = createQuery<TestContext>();
    const mockHandler = vi.fn().mockResolvedValue({ id: '1', name: 'John' });

    const testQuery = query({
      prompt: 'test query',
      input_type: z.object({ id: z.string() }),
      response_type: z.object({ id: z.string(), name: z.string() }),
      dependencies: { tables: ['users'], columns: ['users.*'] },
      handler: mockHandler
    });

    const result = await testQuery.handler({ id: '1' }, mockContext);

    expect(mockHandler).toHaveBeenCalledWith({ id: '1' }, mockContext);
    expect(result).toEqual({ id: '1', name: 'John' });
  });
});

describe('createMutation', () => {
  it('should create a mutation with proper types', () => {
    const mutation = createMutation<TestContext>();

    const createUserMutation = mutation({
      prompt: 'create user',
      input_type: z.object({
        name: z.string(),
        email: z.string().email()
      }),
      response_type: z.object({
        id: z.string(),
        name: z.string(),
        email: z.string()
      }),
      dependencies: {
        tables: ['users'],
        columns: ['users.*']
      },
      handler: async (input, ctx) => {
        const newUser = {
          id: Math.random().toString(36),
          name: input.name,
          email: input.email
        };
        ctx.database.users.push(newUser);
        return newUser;
      }
    });

    expect(createUserMutation).toBeDefined();
    expect(createUserMutation.prompt).toBe('create user');
    expect(createUserMutation.input_type).toBeDefined();
    expect(createUserMutation.response_type).toBeDefined();
    expect(typeof createUserMutation.handler).toBe('function');
  });

  it('should handle mutation side effects', async () => {
    const mutation = createMutation<TestContext>();
    const testContext = { ...mockContext };

    const createUserMutation = mutation({
      prompt: 'create user',
      input_type: z.object({
        name: z.string(),
        email: z.string().email()
      }),
      response_type: z.object({
        id: z.string(),
        name: z.string(),
        email: z.string()
      }),
      dependencies: {
        tables: ['users'],
        columns: ['users.*']
      },
      handler: async (input, ctx) => {
        const newUser = {
          id: 'new-user-id',
          name: input.name,
          email: input.email
        };
        ctx.database.users.push(newUser);
        return newUser;
      }
    });

    const initialUserCount = testContext.database.users.length;
    const result = await createUserMutation.handler(
      { name: 'New User', email: 'new@example.com' },
      testContext
    );

    expect(testContext.database.users.length).toBe(initialUserCount + 1);
    expect(result).toEqual({
      id: 'new-user-id',
      name: 'New User',
      email: 'new@example.com'
    });
  });

  it('should validate complex input schemas', () => {
    const mutation = createMutation<TestContext>();

    const complexMutation = mutation({
      prompt: 'complex mutation',
      input_type: z.object({
        user: z.object({
          name: z.string().min(2),
          email: z.string().email(),
          age: z.number().min(13).max(120)
        }),
        preferences: z.object({
          theme: z.enum(['light', 'dark']),
          notifications: z.boolean()
        }).optional(),
        tags: z.array(z.string()).min(1).max(5)
      }),
      response_type: z.object({ success: z.boolean() }),
      dependencies: { tables: ['users'], columns: ['users.*'] },
      handler: async () => ({ success: true })
    });

    // Valid complex input
    const validInput = {
      user: {
        name: 'Valid User',
        email: 'valid@example.com',
        age: 25
      },
      preferences: {
        theme: 'dark' as const,
        notifications: true
      },
      tags: ['tag1', 'tag2']
    };

    expect(() => complexMutation.input_type.parse(validInput)).not.toThrow();

    // Invalid inputs
    expect(() => complexMutation.input_type.parse({
      user: { name: 'A', email: 'invalid-email', age: 5 }, // All invalid
      tags: [] // Empty array
    })).toThrow();
  });
});