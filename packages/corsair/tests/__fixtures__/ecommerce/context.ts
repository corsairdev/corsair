import { schema, User, Category, Product, Order, OrderItem } from "./schema";

// Mock database interface
export interface MockDB {
  select: () => MockQueryBuilder;
  insert: (table: any) => MockInsertBuilder;
  update: (table: any) => MockUpdateBuilder;
  delete: (table: any) => MockDeleteBuilder;
}

interface MockQueryBuilder {
  from: (table: any) => MockQueryBuilder;
  where: (condition: any) => MockQueryBuilder;
  orderBy: (column: any, direction?: 'asc' | 'desc') => MockQueryBuilder;
  limit: (count: number) => MockQueryBuilder;
  offset: (count: number) => MockQueryBuilder;
  innerJoin: (table: any, condition: any) => MockQueryBuilder;
  leftJoin: (table: any, condition: any) => MockQueryBuilder;
  execute: () => Promise<any[]>;
}

interface MockInsertBuilder {
  values: (values: any) => MockInsertBuilder;
  returning: () => MockInsertBuilder;
  execute: () => Promise<any[]>;
}

interface MockUpdateBuilder {
  set: (values: any) => MockUpdateBuilder;
  where: (condition: any) => MockUpdateBuilder;
  returning: () => MockUpdateBuilder;
  execute: () => Promise<any[]>;
}

interface MockDeleteBuilder {
  where: (condition: any) => MockDeleteBuilder;
  returning: () => MockDeleteBuilder;
  execute: () => Promise<any[]>;
}

// Mock data store
const mockDataStore = {
  users: [] as User[],
  categories: [] as Category[],
  products: [] as Product[],
  orders: [] as Order[],
  order_items: [] as OrderItem[],
};

// Mock database implementation
export const createMockDB = (): MockDB => {
  const createQueryBuilder = (): MockQueryBuilder => ({
    from: (table: any) => createQueryBuilder(),
    where: (condition: any) => createQueryBuilder(),
    orderBy: (column: any, direction?: 'asc' | 'desc') => createQueryBuilder(),
    limit: (count: number) => createQueryBuilder(),
    offset: (count: number) => createQueryBuilder(),
    innerJoin: (table: any, condition: any) => createQueryBuilder(),
    leftJoin: (table: any, condition: any) => createQueryBuilder(),
    execute: async () => [],
  });

  const createInsertBuilder = (): MockInsertBuilder => ({
    values: (values: any) => createInsertBuilder(),
    returning: () => createInsertBuilder(),
    execute: async () => [{ id: 'mock-id', ...arguments[0] }],
  });

  const createUpdateBuilder = (): MockUpdateBuilder => ({
    set: (values: any) => createUpdateBuilder(),
    where: (condition: any) => createUpdateBuilder(),
    returning: () => createUpdateBuilder(),
    execute: async () => [{ id: 'mock-id' }],
  });

  const createDeleteBuilder = (): MockDeleteBuilder => ({
    where: (condition: any) => createDeleteBuilder(),
    returning: () => createDeleteBuilder(),
    execute: async () => [{ id: 'mock-id' }],
  });

  return {
    select: () => createQueryBuilder(),
    insert: (table: any) => createInsertBuilder(),
    update: (table: any) => createUpdateBuilder(),
    delete: (table: any) => createDeleteBuilder(),
  };
};

// Mock query conditions
export const mockConditions = {
  eq: (column: any, value: any) => ({ type: 'eq', column, value }),
  ne: (column: any, value: any) => ({ type: 'ne', column, value }),
  gt: (column: any, value: any) => ({ type: 'gt', column, value }),
  gte: (column: any, value: any) => ({ type: 'gte', column, value }),
  lt: (column: any, value: any) => ({ type: 'lt', column, value }),
  lte: (column: any, value: any) => ({ type: 'lte', column, value }),
  like: (column: any, value: any) => ({ type: 'like', column, value }),
  ilike: (column: any, value: any) => ({ type: 'ilike', column, value }),
  in: (column: any, values: any[]) => ({ type: 'in', column, values }),
  isNull: (column: any) => ({ type: 'isNull', column }),
  isNotNull: (column: any) => ({ type: 'isNotNull', column }),
  and: (...conditions: any[]) => ({ type: 'and', conditions }),
  or: (...conditions: any[]) => ({ type: 'or', conditions }),
};

// E-commerce context type
export type EcommerceContext = {
  db: MockDB;
  schema: typeof schema;
  userId?: string;
  userRole?: 'customer' | 'admin' | 'vendor';
  conditions: typeof mockConditions;
};

// Context factory
export const createEcommerceContext = (userId?: string, userRole?: 'customer' | 'admin' | 'vendor'): EcommerceContext => ({
  db: createMockDB(),
  schema,
  userId,
  userRole: userRole || 'customer',
  conditions: mockConditions,
});

// Default context for testing
export const createDefaultContext = (): EcommerceContext =>
  createEcommerceContext('test-user-id', 'customer');