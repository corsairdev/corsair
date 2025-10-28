import { createMutation, z } from "../../../core";
import { EcommerceContext } from "./context";

const mutation = createMutation<EcommerceContext>();

export const mutations = {
  // User mutations
  "create user": mutation({
    prompt: "create user",
    input_type: z.object({
      email: z.string().email(),
      name: z.string().min(1),
      role: z.enum(['customer', 'admin', 'vendor']).default('customer'),
    }),
    response_type: z.object({
      id: z.string(),
      email: z.string(),
      name: z.string(),
      role: z.enum(['customer', 'admin', 'vendor']),
      created_at: z.date(),
      updated_at: z.date(),
    }),
    dependencies: {
      tables: ["users"],
      columns: ["users.*"],
    },
    handler: async (input, ctx) => {
      const [user] = await ctx.db
        .insert(ctx.schema.users)
        .values({
          email: input.email,
          name: input.name,
          role: input.role,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning()
        .execute();

      return {
        ...user,
        created_at: new Date(user.created_at),
        updated_at: new Date(user.updated_at),
      };
    },
  }),

  "update user": mutation({
    prompt: "update user",
    input_type: z.object({
      id: z.string(),
      email: z.string().email().optional(),
      name: z.string().min(1).optional(),
      role: z.enum(['customer', 'admin', 'vendor']).optional(),
    }),
    response_type: z.object({
      id: z.string(),
      email: z.string(),
      name: z.string(),
      role: z.enum(['customer', 'admin', 'vendor']),
      updated_at: z.date(),
    }).nullable(),
    dependencies: {
      tables: ["users"],
      columns: ["users.*"],
    },
    handler: async (input, ctx) => {
      const updateData: any = { updated_at: new Date() };

      if (input.email) updateData.email = input.email;
      if (input.name) updateData.name = input.name;
      if (input.role) updateData.role = input.role;

      const [user] = await ctx.db
        .update(ctx.schema.users)
        .set(updateData)
        .where(ctx.conditions.eq(ctx.schema.users.columns.id, input.id))
        .returning()
        .execute();

      return user ? {
        ...user,
        updated_at: new Date(user.updated_at),
      } : null;
    },
  }),

  // Product mutations
  "create product": mutation({
    prompt: "create product",
    input_type: z.object({
      name: z.string().min(1),
      description: z.string().optional(),
      price: z.number().positive(),
      stock: z.number().int().min(0),
      category_id: z.string().optional(),
      vendor_id: z.string().optional(),
      images: z.array(z.string()).optional(),
      metadata: z.record(z.any()).optional(),
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
    }),
    dependencies: {
      tables: ["products"],
      columns: ["products.*"],
    },
    handler: async (input, ctx) => {
      const [product] = await ctx.db
        .insert(ctx.schema.products)
        .values({
          name: input.name,
          description: input.description || null,
          price: input.price,
          stock: input.stock,
          category_id: input.category_id || null,
          vendor_id: input.vendor_id || ctx.userId,
          is_active: true,
          images: input.images || [],
          metadata: input.metadata || {},
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning()
        .execute();

      return {
        ...product,
        created_at: new Date(product.created_at),
        updated_at: new Date(product.updated_at),
      };
    },
  }),

  "update product": mutation({
    prompt: "update product",
    input_type: z.object({
      id: z.string(),
      name: z.string().min(1).optional(),
      description: z.string().optional(),
      price: z.number().positive().optional(),
      stock: z.number().int().min(0).optional(),
      category_id: z.string().optional(),
      is_active: z.boolean().optional(),
      images: z.array(z.string()).optional(),
      metadata: z.record(z.any()).optional(),
    }),
    response_type: z.object({
      id: z.string(),
      name: z.string(),
      price: z.number(),
      stock: z.number(),
      is_active: z.boolean(),
      updated_at: z.date(),
    }).nullable(),
    dependencies: {
      tables: ["products"],
      columns: ["products.*"],
    },
    handler: async (input, ctx) => {
      const updateData: any = { updated_at: new Date() };

      if (input.name) updateData.name = input.name;
      if (input.description !== undefined) updateData.description = input.description;
      if (input.price) updateData.price = input.price;
      if (input.stock !== undefined) updateData.stock = input.stock;
      if (input.category_id !== undefined) updateData.category_id = input.category_id;
      if (input.is_active !== undefined) updateData.is_active = input.is_active;
      if (input.images) updateData.images = input.images;
      if (input.metadata) updateData.metadata = input.metadata;

      const [product] = await ctx.db
        .update(ctx.schema.products)
        .set(updateData)
        .where(ctx.conditions.eq(ctx.schema.products.columns.id, input.id))
        .returning()
        .execute();

      return product ? {
        ...product,
        updated_at: new Date(product.updated_at),
      } : null;
    },
  }),

  "delete product": mutation({
    prompt: "delete product",
    input_type: z.object({
      id: z.string(),
    }),
    response_type: z.object({
      id: z.string(),
      deleted: z.boolean(),
    }),
    dependencies: {
      tables: ["products"],
      columns: ["products.id"],
    },
    handler: async (input, ctx) => {
      const [deletedProduct] = await ctx.db
        .delete(ctx.schema.products)
        .where(ctx.conditions.eq(ctx.schema.products.columns.id, input.id))
        .returning()
        .execute();

      return {
        id: input.id,
        deleted: !!deletedProduct,
      };
    },
  }),

  // Order mutations
  "create order": mutation({
    prompt: "create order",
    input_type: z.object({
      user_id: z.string(),
      items: z.array(z.object({
        product_id: z.string(),
        quantity: z.number().int().positive(),
        price: z.number().positive(),
      })),
      shipping_address: z.record(z.any()),
      billing_address: z.record(z.any()).optional(),
    }),
    response_type: z.object({
      id: z.string(),
      user_id: z.string(),
      total: z.number(),
      status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
      created_at: z.date(),
    }),
    dependencies: {
      tables: ["orders", "order_items"],
      columns: ["orders.*", "order_items.*"],
    },
    handler: async (input, ctx) => {
      const total = input.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      const [order] = await ctx.db
        .insert(ctx.schema.orders)
        .values({
          user_id: input.user_id,
          total,
          status: 'pending',
          shipping_address: input.shipping_address,
          billing_address: input.billing_address || input.shipping_address,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning()
        .execute();

      // Insert order items
      for (const item of input.items) {
        await ctx.db
          .insert(ctx.schema.order_items)
          .values({
            order_id: order.id,
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price,
            created_at: new Date(),
          })
          .execute();
      }

      return {
        ...order,
        created_at: new Date(order.created_at),
      };
    },
  }),

  "update order status": mutation({
    prompt: "update order status",
    input_type: z.object({
      id: z.string(),
      status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
    }),
    response_type: z.object({
      id: z.string(),
      status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
      updated_at: z.date(),
    }).nullable(),
    dependencies: {
      tables: ["orders"],
      columns: ["orders.id", "orders.status", "orders.updated_at"],
    },
    handler: async (input, ctx) => {
      const [order] = await ctx.db
        .update(ctx.schema.orders)
        .set({
          status: input.status,
          updated_at: new Date(),
        })
        .where(ctx.conditions.eq(ctx.schema.orders.columns.id, input.id))
        .returning()
        .execute();

      return order ? {
        ...order,
        updated_at: new Date(order.updated_at),
      } : null;
    },
  }),

  "cancel order": mutation({
    prompt: "cancel order",
    input_type: z.object({
      id: z.string(),
      reason: z.string().optional(),
    }),
    response_type: z.object({
      id: z.string(),
      status: z.literal('cancelled'),
      cancelled_at: z.date(),
    }).nullable(),
    dependencies: {
      tables: ["orders"],
      columns: ["orders.*"],
    },
    handler: async (input, ctx) => {
      const [order] = await ctx.db
        .update(ctx.schema.orders)
        .set({
          status: 'cancelled',
          updated_at: new Date(),
        })
        .where(ctx.conditions.and(
          ctx.conditions.eq(ctx.schema.orders.columns.id, input.id),
          ctx.conditions.in(ctx.schema.orders.columns.status, ['pending', 'processing'])
        ))
        .returning()
        .execute();

      return order ? {
        id: order.id,
        status: 'cancelled' as const,
        cancelled_at: new Date(),
      } : null;
    },
  }),

  // Category mutations
  "create category": mutation({
    prompt: "create category",
    input_type: z.object({
      name: z.string().min(1),
      description: z.string().optional(),
      parent_id: z.string().optional(),
    }),
    response_type: z.object({
      id: z.string(),
      name: z.string(),
      description: z.string().nullable(),
      parent_id: z.string().nullable(),
      created_at: z.date(),
    }),
    dependencies: {
      tables: ["categories"],
      columns: ["categories.*"],
    },
    handler: async (input, ctx) => {
      const [category] = await ctx.db
        .insert(ctx.schema.categories)
        .values({
          name: input.name,
          description: input.description || null,
          parent_id: input.parent_id || null,
          created_at: new Date(),
        })
        .returning()
        .execute();

      return {
        ...category,
        created_at: new Date(category.created_at),
      };
    },
  }),

  "update stock": mutation({
    prompt: "update stock",
    input_type: z.object({
      product_id: z.string(),
      quantity: z.number().int(),
      operation: z.enum(['add', 'subtract', 'set']),
    }),
    response_type: z.object({
      product_id: z.string(),
      previous_stock: z.number(),
      new_stock: z.number(),
      updated_at: z.date(),
    }).nullable(),
    dependencies: {
      tables: ["products"],
      columns: ["products.id", "products.stock", "products.updated_at"],
    },
    handler: async (input, ctx) => {
      // First get current stock
      const [product] = await ctx.db
        .select()
        .from(ctx.schema.products)
        .where(ctx.conditions.eq(ctx.schema.products.columns.id, input.product_id))
        .execute();

      if (!product) return null;

      let newStock: number;
      switch (input.operation) {
        case 'add':
          newStock = product.stock + input.quantity;
          break;
        case 'subtract':
          newStock = Math.max(0, product.stock - input.quantity);
          break;
        case 'set':
          newStock = Math.max(0, input.quantity);
          break;
      }

      await ctx.db
        .update(ctx.schema.products)
        .set({
          stock: newStock,
          updated_at: new Date(),
        })
        .where(ctx.conditions.eq(ctx.schema.products.columns.id, input.product_id))
        .execute();

      return {
        product_id: input.product_id,
        previous_stock: product.stock,
        new_stock: newStock,
        updated_at: new Date(),
      };
    },
  }),
};