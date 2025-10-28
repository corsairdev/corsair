import { createQuery, z } from "../../../core";
import { EcommerceContext } from "./context";
import { User, Product, Order, Category } from "./schema";

const query = createQuery<EcommerceContext>();

export const queries = {
  // User queries
  "get all users": query({
    prompt: "get all users",
    input_type: z.object({
      limit: z.number().optional(),
      offset: z.number().optional(),
    }),
    response_type: z.array(z.object({
      id: z.string(),
      email: z.string(),
      name: z.string(),
      role: z.enum(['customer', 'admin', 'vendor']),
      created_at: z.date(),
      updated_at: z.date(),
    })),
    dependencies: {
      tables: ["users"],
      columns: ["users.id", "users.email", "users.name", "users.role", "users.created_at", "users.updated_at"],
    },
    handler: async (input, ctx) => {
      let query = ctx.db.select().from(ctx.schema.users);

      if (input.limit) {
        query = query.limit(input.limit);
      }

      if (input.offset) {
        query = query.offset(input.offset);
      }

      const users = await query.execute();
      return users.map(user => ({
        ...user,
        created_at: new Date(user.created_at),
        updated_at: new Date(user.updated_at),
      }));
    },
  }),

  "get user by id": query({
    prompt: "get user by id",
    input_type: z.object({
      id: z.string(),
    }),
    response_type: z.object({
      id: z.string(),
      email: z.string(),
      name: z.string(),
      role: z.enum(['customer', 'admin', 'vendor']),
      created_at: z.date(),
      updated_at: z.date(),
    }).nullable(),
    dependencies: {
      tables: ["users"],
      columns: ["users.id", "users.email", "users.name", "users.role", "users.created_at", "users.updated_at"],
    },
    handler: async (input, ctx) => {
      const [user] = await ctx.db
        .select()
        .from(ctx.schema.users)
        .where(ctx.conditions.eq(ctx.schema.users.columns.id, input.id))
        .execute();

      return user ? {
        ...user,
        created_at: new Date(user.created_at),
        updated_at: new Date(user.updated_at),
      } : null;
    },
  }),

  // Product queries
  "get all products": query({
    prompt: "get all products",
    input_type: z.object({
      category_id: z.string().optional(),
      is_active: z.boolean().optional(),
      min_price: z.number().optional(),
      max_price: z.number().optional(),
      limit: z.number().optional(),
      offset: z.number().optional(),
    }),
    response_type: z.array(z.object({
      id: z.string(),
      name: z.string(),
      description: z.string().nullable(),
      price: z.number(),
      stock: z.number(),
      category_id: z.string().nullable(),
      vendor_id: z.string().nullable(),
      is_active: z.boolean(),
      images: z.any(),
      metadata: z.any(),
      created_at: z.date(),
      updated_at: z.date(),
    })),
    dependencies: {
      tables: ["products"],
      columns: ["products.*"],
    },
    handler: async (input, ctx) => {
      let query = ctx.db.select().from(ctx.schema.products);

      if (input.category_id) {
        query = query.where(ctx.conditions.eq(ctx.schema.products.columns.category_id, input.category_id));
      }

      if (input.is_active !== undefined) {
        query = query.where(ctx.conditions.eq(ctx.schema.products.columns.is_active, input.is_active));
      }

      if (input.min_price) {
        query = query.where(ctx.conditions.gte(ctx.schema.products.columns.price, input.min_price));
      }

      if (input.max_price) {
        query = query.where(ctx.conditions.lte(ctx.schema.products.columns.price, input.max_price));
      }

      if (input.limit) {
        query = query.limit(input.limit);
      }

      if (input.offset) {
        query = query.offset(input.offset);
      }

      const products = await query.execute();
      return products.map(product => ({
        ...product,
        created_at: new Date(product.created_at),
        updated_at: new Date(product.updated_at),
      }));
    },
  }),

  "get product by id": query({
    prompt: "get product by id",
    input_type: z.object({
      id: z.string(),
    }),
    response_type: z.object({
      id: z.string(),
      name: z.string(),
      description: z.string().nullable(),
      price: z.number(),
      stock: z.number(),
      category_id: z.string().nullable(),
      vendor_id: z.string().nullable(),
      is_active: z.boolean(),
      images: z.any(),
      metadata: z.any(),
      created_at: z.date(),
      updated_at: z.date(),
    }).nullable(),
    dependencies: {
      tables: ["products"],
      columns: ["products.*"],
    },
    handler: async (input, ctx) => {
      const [product] = await ctx.db
        .select()
        .from(ctx.schema.products)
        .where(ctx.conditions.eq(ctx.schema.products.columns.id, input.id))
        .execute();

      return product ? {
        ...product,
        created_at: new Date(product.created_at),
        updated_at: new Date(product.updated_at),
      } : null;
    },
  }),

  "get products with category": query({
    prompt: "get products with category",
    input_type: z.object({
      limit: z.number().optional(),
      offset: z.number().optional(),
    }),
    response_type: z.array(z.object({
      id: z.string(),
      name: z.string(),
      description: z.string().nullable(),
      price: z.number(),
      stock: z.number(),
      is_active: z.boolean(),
      category: z.object({
        id: z.string(),
        name: z.string(),
        description: z.string().nullable(),
      }).nullable(),
    })),
    dependencies: {
      tables: ["products", "categories"],
      columns: ["products.*", "categories.id", "categories.name", "categories.description"],
    },
    handler: async (input, ctx) => {
      let query = ctx.db
        .select()
        .from(ctx.schema.products)
        .leftJoin(
          ctx.schema.categories,
          ctx.conditions.eq(ctx.schema.products.columns.category_id, ctx.schema.categories.columns.id)
        );

      if (input.limit) {
        query = query.limit(input.limit);
      }

      if (input.offset) {
        query = query.offset(input.offset);
      }

      const results = await query.execute();
      return results.map(result => ({
        id: result.id,
        name: result.name,
        description: result.description,
        price: result.price,
        stock: result.stock,
        is_active: result.is_active,
        category: result.category_id ? {
          id: result.category_id,
          name: result.category_name || '',
          description: result.category_description || null,
        } : null,
      }));
    },
  }),

  // Order queries
  "get user orders": query({
    prompt: "get user orders",
    input_type: z.object({
      user_id: z.string(),
      status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']).optional(),
      limit: z.number().optional(),
      offset: z.number().optional(),
    }),
    response_type: z.array(z.object({
      id: z.string(),
      user_id: z.string(),
      total: z.number(),
      status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
      created_at: z.date(),
      updated_at: z.date(),
    })),
    dependencies: {
      tables: ["orders"],
      columns: ["orders.*"],
    },
    handler: async (input, ctx) => {
      let query = ctx.db
        .select()
        .from(ctx.schema.orders)
        .where(ctx.conditions.eq(ctx.schema.orders.columns.user_id, input.user_id));

      if (input.status) {
        query = query.where(ctx.conditions.eq(ctx.schema.orders.columns.status, input.status));
      }

      if (input.limit) {
        query = query.limit(input.limit);
      }

      if (input.offset) {
        query = query.offset(input.offset);
      }

      const orders = await query.execute();
      return orders.map(order => ({
        ...order,
        created_at: new Date(order.created_at),
        updated_at: new Date(order.updated_at),
      }));
    },
  }),

  "get order with items": query({
    prompt: "get order with items",
    input_type: z.object({
      order_id: z.string(),
    }),
    response_type: z.object({
      id: z.string(),
      user_id: z.string(),
      total: z.number(),
      status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
      items: z.array(z.object({
        id: z.string(),
        product_id: z.string(),
        product_name: z.string(),
        quantity: z.number(),
        price: z.number(),
      })),
      created_at: z.date(),
      updated_at: z.date(),
    }).nullable(),
    dependencies: {
      tables: ["orders", "order_items", "products"],
      columns: ["orders.*", "order_items.*", "products.name"],
    },
    handler: async (input, ctx) => {
      const [order] = await ctx.db
        .select()
        .from(ctx.schema.orders)
        .where(ctx.conditions.eq(ctx.schema.orders.columns.id, input.order_id))
        .execute();

      if (!order) return null;

      const items = await ctx.db
        .select()
        .from(ctx.schema.order_items)
        .innerJoin(
          ctx.schema.products,
          ctx.conditions.eq(ctx.schema.order_items.columns.product_id, ctx.schema.products.columns.id)
        )
        .where(ctx.conditions.eq(ctx.schema.order_items.columns.order_id, input.order_id))
        .execute();

      return {
        ...order,
        items: items.map(item => ({
          id: item.id,
          product_id: item.product_id,
          product_name: item.product_name || '',
          quantity: item.quantity,
          price: item.price,
        })),
        created_at: new Date(order.created_at),
        updated_at: new Date(order.updated_at),
      };
    },
  }),

  // Category queries
  "get all categories": query({
    prompt: "get all categories",
    input_type: z.object({}),
    response_type: z.array(z.object({
      id: z.string(),
      name: z.string(),
      description: z.string().nullable(),
      parent_id: z.string().nullable(),
      created_at: z.date(),
    })),
    dependencies: {
      tables: ["categories"],
      columns: ["categories.*"],
    },
    handler: async (input, ctx) => {
      const categories = await ctx.db
        .select()
        .from(ctx.schema.categories)
        .execute();

      return categories.map(category => ({
        ...category,
        created_at: new Date(category.created_at),
      }));
    },
  }),

  "search products": query({
    prompt: "search products",
    input_type: z.object({
      query: z.string(),
      category_id: z.string().optional(),
      limit: z.number().optional(),
    }),
    dependencies: {
      tables: ["products"],
      columns: ["products.*"],
    },
    handler: async (input, ctx) => {
      let query = ctx.db
        .select()
        .from(ctx.schema.products)
        .where(ctx.conditions.or(
          ctx.conditions.ilike(ctx.schema.products.columns.name, `%${input.query}%`),
          ctx.conditions.ilike(ctx.schema.products.columns.description, `%${input.query}%`)
        ));

      if (input.category_id) {
        query = query.where(ctx.conditions.eq(ctx.schema.products.columns.category_id, input.category_id));
      }

      if (input.limit) {
        query = query.limit(input.limit);
      }

      const products = await query.execute();
      return products.map(product => ({
        ...product,
        created_at: new Date(product.created_at),
        updated_at: new Date(product.updated_at),
      }));
    },
  }),
};