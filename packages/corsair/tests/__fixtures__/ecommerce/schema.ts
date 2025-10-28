import { z } from "zod";

// Mock Drizzle-like schema builder for testing
// This simulates the structure without requiring actual database dependencies
export const MockDB = {
  table: (name: string, columns: any, config?: any) => ({
    name,
    columns,
    config,
    _type: 'table' as const,
  }),
  text: (name: string) => ({
    type: 'text',
    name,
    primaryKey: () => ({ type: 'text', name, isPrimaryKey: true }),
    notNull: () => ({ type: 'text', name, notNull: true }),
    references: (ref: () => any) => ({ type: 'text', name, references: ref }),
  }),
  integer: (name: string) => ({
    type: 'integer',
    name,
    notNull: () => ({ type: 'integer', name, notNull: true }),
    references: (ref: () => any) => ({ type: 'integer', name, references: ref }),
    default: (value: number) => ({
      type: 'integer',
      name,
      default: value,
      notNull: () => ({ type: 'integer', name, default: value, notNull: true }),
    }),
  }),
  decimal: (name: string, config?: any) => ({
    type: 'decimal',
    name,
    config,
    notNull: () => ({ type: 'decimal', name, config, notNull: true }),
  }),
  timestamp: (name: string) => ({
    type: 'timestamp',
    name,
    defaultNow: () => ({
      type: 'timestamp',
      name,
      defaultNow: true,
      notNull: () => ({ type: 'timestamp', name, defaultNow: true, notNull: true }),
    }),
    notNull: () => ({
      type: 'timestamp',
      name,
      notNull: true,
      defaultNow: () => ({ type: 'timestamp', name, notNull: true, defaultNow: true }),
    }),
  }),
  boolean: (name: string) => ({
    type: 'boolean',
    name,
    default: (value: boolean) => ({
      type: 'boolean',
      name,
      default: value,
      notNull: () => ({ type: 'boolean', name, default: value, notNull: true }),
    }),
    notNull: () => ({
      type: 'boolean',
      name,
      notNull: true,
      default: (value: boolean) => ({ type: 'boolean', name, notNull: true, default: value }),
    }),
  }),
  uuid: (name: string) => ({
    type: 'uuid',
    name,
    primaryKey: () => ({
      type: 'uuid',
      name,
      isPrimaryKey: true,
      defaultRandom: () => ({ type: 'uuid', name, isPrimaryKey: true, defaultRandom: true }),
    }),
    defaultRandom: () => ({ type: 'uuid', name, defaultRandom: true }),
    references: (ref: () => any) => ({
      type: 'uuid',
      name,
      references: ref,
      notNull: () => ({ type: 'uuid', name, references: ref, notNull: true }),
    }),
    notNull: () => ({
      type: 'uuid',
      name,
      notNull: true,
      references: (ref: () => any) => ({ type: 'uuid', name, notNull: true, references: ref }),
    }),
  }),
  jsonb: (name: string) => () => ({
    type: 'jsonb',
    name,
  }),
};

// E-commerce Schema
export const users = MockDB.table(
  "users",
  {
    id: MockDB.uuid("id").primaryKey().defaultRandom(),
    email: MockDB.text("email").notNull(),
    name: MockDB.text("name").notNull(),
    role: MockDB.text("role").notNull(), // 'customer', 'admin', 'vendor'
    created_at: MockDB.timestamp("created_at").defaultNow().notNull(),
    updated_at: MockDB.timestamp("updated_at").defaultNow().notNull(),
  },
  {
    access: {
      create: "authenticated",
      update: "own_record",
      delete: "admin_only",
    },
  }
);

export const categories = MockDB.table(
  "categories",
  {
    id: MockDB.uuid("id").primaryKey().defaultRandom(),
    name: MockDB.text("name").notNull(),
    description: MockDB.text("description"),
    parent_id: MockDB.uuid("parent_id").references(() => categories.columns.id),
    created_at: MockDB.timestamp("created_at").defaultNow().notNull(),
  },
  {
    access: {
      create: "admin",
      update: "admin",
      delete: "admin",
    },
  }
);

export const products = MockDB.table(
  "products",
  {
    id: MockDB.uuid("id").primaryKey().defaultRandom(),
    name: MockDB.text("name").notNull(),
    description: MockDB.text("description"),
    price: MockDB.decimal("price", { precision: 10, scale: 2 }).notNull(),
    stock: MockDB.integer("stock").notNull(),
    category_id: MockDB.uuid("category_id").references(() => categories.columns.id),
    vendor_id: MockDB.uuid("vendor_id").references(() => users.columns.id),
    is_active: MockDB.boolean("is_active").default(true).notNull(),
    images: MockDB.jsonb("images")(),
    metadata: MockDB.jsonb("metadata")(),
    created_at: MockDB.timestamp("created_at").defaultNow().notNull(),
    updated_at: MockDB.timestamp("updated_at").defaultNow().notNull(),
  },
  {
    access: {
      create: "vendor",
      update: "vendor_own",
      delete: "vendor_own",
    },
  }
);

export const orders = MockDB.table(
  "orders",
  {
    id: MockDB.uuid("id").primaryKey().defaultRandom(),
    user_id: MockDB.uuid("user_id").references(() => users.columns.id).notNull(),
    total: MockDB.decimal("total", { precision: 10, scale: 2 }).notNull(),
    status: MockDB.text("status").notNull(), // 'pending', 'processing', 'shipped', 'delivered', 'cancelled'
    shipping_address: MockDB.jsonb("shipping_address")(),
    billing_address: MockDB.jsonb("billing_address")(),
    created_at: MockDB.timestamp("created_at").defaultNow().notNull(),
    updated_at: MockDB.timestamp("updated_at").defaultNow().notNull(),
  },
  {
    access: {
      create: "authenticated",
      update: "own_record",
      delete: "own_record",
    },
  }
);

export const order_items = MockDB.table(
  "order_items",
  {
    id: MockDB.uuid("id").primaryKey().defaultRandom(),
    order_id: MockDB.uuid("order_id").references(() => orders.columns.id).notNull(),
    product_id: MockDB.uuid("product_id").references(() => products.columns.id).notNull(),
    quantity: MockDB.integer("quantity").notNull(),
    price: MockDB.decimal("price", { precision: 10, scale: 2 }).notNull(),
    created_at: MockDB.timestamp("created_at").defaultNow().notNull(),
  },
  {
    access: {
      create: "authenticated",
      update: "admin",
      delete: "admin",
    },
  }
);

// Schema export for easy access
export const schema = {
  users,
  categories,
  products,
  orders,
  order_items,
};

// Type definitions for testing
export type User = {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'admin' | 'vendor';
  created_at: Date;
  updated_at: Date;
};

export type Category = {
  id: string;
  name: string;
  description: string | null;
  parent_id: string | null;
  created_at: Date;
};

export type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  category_id: string | null;
  vendor_id: string | null;
  is_active: boolean;
  images: any;
  metadata: any;
  created_at: Date;
  updated_at: Date;
};

export type Order = {
  id: string;
  user_id: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shipping_address: any;
  billing_address: any;
  created_at: Date;
  updated_at: Date;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  created_at: Date;
};