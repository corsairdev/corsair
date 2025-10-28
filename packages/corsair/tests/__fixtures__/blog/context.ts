import { schema, Author, Post, Tag, Comment, Category } from "./schema";
import { MockDB, mockConditions } from "../ecommerce/context";

// Blog context type
export type BlogContext = {
  db: MockDB;
  schema: typeof schema;
  userId?: string;
  userRole?: 'author' | 'admin' | 'moderator' | 'guest';
  conditions: typeof mockConditions;
};

// Context factory
export const createBlogContext = (userId?: string, userRole?: 'author' | 'admin' | 'moderator' | 'guest'): BlogContext => ({
  db: {
    select: () => ({
      from: (table: any) => ({
        where: (condition: any) => ({
          orderBy: (column: any, direction?: 'asc' | 'desc') => ({
            limit: (count: number) => ({
              offset: (count: number) => ({
                innerJoin: (table: any, condition: any) => ({
                  leftJoin: (table: any, condition: any) => ({
                    execute: async () => [],
                  }),
                  execute: async () => [],
                }),
                leftJoin: (table: any, condition: any) => ({
                  execute: async () => [],
                }),
                execute: async () => [],
              }),
              execute: async () => [],
            }),
            execute: async () => [],
          }),
          limit: (count: number) => ({
            execute: async () => [],
          }),
          innerJoin: (table: any, condition: any) => ({
            execute: async () => [],
          }),
          leftJoin: (table: any, condition: any) => ({
            execute: async () => [],
          }),
          execute: async () => [],
        }),
        orderBy: (column: any, direction?: 'asc' | 'desc') => ({
          limit: (count: number) => ({
            execute: async () => [],
          }),
          execute: async () => [],
        }),
        limit: (count: number) => ({
          execute: async () => [],
        }),
        innerJoin: (table: any, condition: any) => ({
          where: (condition: any) => ({
            execute: async () => [],
          }),
          execute: async () => [],
        }),
        leftJoin: (table: any, condition: any) => ({
          where: (condition: any) => ({
            execute: async () => [],
          }),
          execute: async () => [],
        }),
        execute: async () => [],
      }),
      execute: async () => [],
    }),
    insert: (table: any) => ({
      values: (values: any) => ({
        returning: () => ({
          execute: async () => [{ id: 'mock-id', ...values }],
        }),
        execute: async () => [{ id: 'mock-id', ...values }],
      }),
    }),
    update: (table: any) => ({
      set: (values: any) => ({
        where: (condition: any) => ({
          returning: () => ({
            execute: async () => [{ id: 'mock-id' }],
          }),
          execute: async () => [{ id: 'mock-id' }],
        }),
      }),
    }),
    delete: (table: any) => ({
      where: (condition: any) => ({
        returning: () => ({
          execute: async () => [{ id: 'mock-id' }],
        }),
        execute: async () => [{ id: 'mock-id' }],
      }),
    }),
  },
  schema,
  userId,
  userRole: userRole || 'guest',
  conditions: mockConditions,
});

// Default context for testing
export const createDefaultBlogContext = (): BlogContext =>
  createBlogContext('test-author-id', 'author');