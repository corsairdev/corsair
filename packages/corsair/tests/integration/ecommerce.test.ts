import { describe, it, expect, beforeEach } from 'vitest';
import {
  useEcommerceQuery,
  useEcommerceMutation,
} from '../__fixtures__/ecommerce/client';
import {
  ecommerceQuery,
  ecommerceMutation,
  createEcommerceServerFunctions,
  createEcommerceServerContext
} from '../__fixtures__/ecommerce/server';

// Mock React Query for client-side tests
import { vi } from 'vitest';
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn((options) => ({
    data: null,
    isLoading: false,
    error: null,
    ...options
  })),
  useMutation: vi.fn((options) => ({
    mutate: vi.fn(),
    isLoading: false,
    error: null,
    ...options
  }))
}));

describe('E-commerce Integration Tests', () => {
  describe('Server-side Operations', () => {
    describe('User Management', () => {
      it('should create and retrieve users', async () => {
        // Create a new user
        const createResult = await ecommerceMutation('create user', {
          email: 'test@example.com',
          password: 'password123',
          first_name: 'John',
          last_name: 'Doe',
          phone: '+1234567890'
        });

        expect(createResult.id).toBeDefined();
        expect(createResult.email).toBe('test@example.com');
        expect(createResult.first_name).toBe('John');
        expect(createResult.last_name).toBe('Doe');
        expect(createResult.is_active).toBe(true);

        // Retrieve the created user
        const getResult = await ecommerceQuery('get user by id', {
          id: createResult.id
        });

        expect(getResult).toBeDefined();
        expect(getResult?.id).toBe(createResult.id);
        expect(getResult?.email).toBe('test@example.com');
        expect(getResult?.first_name).toBe('John');
      });

      it('should update user information', async () => {
        // Create user first
        const user = await ecommerceMutation('create user', {
          email: 'update@example.com',
          password: 'password123',
          first_name: 'Jane',
          last_name: 'Smith'
        });

        // Update the user
        const updateResult = await ecommerceMutation('update user', {
          id: user.id,
          first_name: 'Janet',
          phone: '+1987654321',
          is_active: false
        });

        expect(updateResult).toBeDefined();
        expect(updateResult?.first_name).toBe('Janet');
        expect(updateResult?.last_name).toBe('Smith'); // Should remain unchanged
        expect(updateResult?.phone).toBe('+1987654321');
        expect(updateResult?.is_active).toBe(false);
      });

      it('should list all users with pagination', async () => {
        // Create multiple users
        await Promise.all([
          ecommerceMutation('create user', {
            email: 'user1@example.com',
            password: 'password123',
            first_name: 'User',
            last_name: 'One'
          }),
          ecommerceMutation('create user', {
            email: 'user2@example.com',
            password: 'password123',
            first_name: 'User',
            last_name: 'Two'
          }),
          ecommerceMutation('create user', {
            email: 'user3@example.com',
            password: 'password123',
            first_name: 'User',
            last_name: 'Three'
          })
        ]);

        // Get all users
        const allUsers = await ecommerceQuery('get all users', {});
        expect(allUsers.length).toBeGreaterThanOrEqual(3);

        // Test pagination
        const firstPage = await ecommerceQuery('get all users', {
          limit: 2,
          offset: 0
        });
        expect(firstPage.length).toBe(2);

        const secondPage = await ecommerceQuery('get all users', {
          limit: 2,
          offset: 2
        });
        expect(secondPage.length).toBeGreaterThanOrEqual(1);
      });
    });

    describe('Product Management', () => {
      it('should create and retrieve products', async () => {
        // Create a product
        const createResult = await ecommerceMutation('create product', {
          name: 'Test Product',
          description: 'A test product for integration testing',
          price: 29.99,
          stock_quantity: 100,
          category_id: 'electronics',
          sku: 'TEST-001',
          is_active: true
        });

        expect(createResult.id).toBeDefined();
        expect(createResult.name).toBe('Test Product');
        expect(createResult.price).toBe(29.99);
        expect(createResult.stock_quantity).toBe(100);
        expect(createResult.sku).toBe('TEST-001');

        // Retrieve the product
        const getResult = await ecommerceQuery('get product by id', {
          id: createResult.id
        });

        expect(getResult).toBeDefined();
        expect(getResult?.id).toBe(createResult.id);
        expect(getResult?.name).toBe('Test Product');
        expect(getResult?.price).toBe(29.99);
      });

      it('should update product stock and details', async () => {
        // Create product
        const product = await ecommerceMutation('create product', {
          name: 'Stock Test Product',
          price: 19.99,
          stock_quantity: 50,
          category_id: 'books',
          sku: 'STOCK-001'
        });

        // Update stock
        const stockResult = await ecommerceMutation('update product stock', {
          id: product.id,
          quantity_change: -10,
          operation: 'subtract'
        });

        expect(stockResult.id).toBe(product.id);
        expect(stockResult.new_stock_quantity).toBe(40);

        // Update product details
        const updateResult = await ecommerceMutation('update product', {
          id: product.id,
          name: 'Updated Stock Test Product',
          price: 24.99,
          is_active: false
        });

        expect(updateResult).toBeDefined();
        expect(updateResult?.name).toBe('Updated Stock Test Product');
        expect(updateResult?.price).toBe(24.99);
        expect(updateResult?.is_active).toBe(false);
      });

      it('should search products by various criteria', async () => {
        // Create products with different attributes
        await Promise.all([
          ecommerceMutation('create product', {
            name: 'Laptop Computer',
            description: 'High-performance laptop',
            price: 999.99,
            stock_quantity: 10,
            category_id: 'electronics',
            sku: 'LAPTOP-001'
          }),
          ecommerceMutation('create product', {
            name: 'Programming Book',
            description: 'Learn programming with this book',
            price: 49.99,
            stock_quantity: 25,
            category_id: 'books',
            sku: 'BOOK-001'
          }),
          ecommerceMutation('create product', {
            name: 'Wireless Mouse',
            description: 'Ergonomic wireless mouse',
            price: 29.99,
            stock_quantity: 50,
            category_id: 'electronics',
            sku: 'MOUSE-001'
          })
        ]);

        // Search by name
        const laptopSearch = await ecommerceQuery('search products', {
          query: 'laptop',
          limit: 10
        });
        expect(laptopSearch.some(p => p.name.toLowerCase().includes('laptop'))).toBe(true);

        // Search by category
        const electronicsProducts = await ecommerceQuery('get all products', {
          category_id: 'electronics',
          limit: 10
        });
        expect(electronicsProducts.length).toBeGreaterThanOrEqual(2);
        expect(electronicsProducts.every(p => p.category_id === 'electronics')).toBe(true);

        // Search with price filter
        const expensiveProducts = await ecommerceQuery('get all products', {
          min_price: 100,
          limit: 10
        });
        expect(expensiveProducts.every(p => p.price >= 100)).toBe(true);
      });
    });

    describe('Order Management', () => {
      let testUser: any;
      let testProduct: any;

      beforeEach(async () => {
        // Create test user and product for order tests
        testUser = await ecommerceMutation('create user', {
          email: 'ordertest@example.com',
          password: 'password123',
          first_name: 'Order',
          last_name: 'Test'
        });

        testProduct = await ecommerceMutation('create product', {
          name: 'Order Test Product',
          price: 99.99,
          stock_quantity: 10,
          category_id: 'test',
          sku: 'ORDER-001'
        });
      });

      it('should create and manage orders', async () => {
        // Create an order
        const createResult = await ecommerceMutation('create order', {
          user_id: testUser.id,
          items: [
            {
              product_id: testProduct.id,
              quantity: 2,
              price: testProduct.price
            }
          ],
          shipping_address: {
            street: '123 Test St',
            city: 'Test City',
            state: 'TS',
            postal_code: '12345',
            country: 'US'
          },
          payment_method: 'credit_card'
        });

        expect(createResult.id).toBeDefined();
        expect(createResult.user_id).toBe(testUser.id);
        expect(createResult.total_amount).toBe(199.98); // 2 * 99.99
        expect(createResult.status).toBe('pending');
        expect(createResult.items.length).toBe(1);
        expect(createResult.items[0].product_id).toBe(testProduct.id);
        expect(createResult.items[0].quantity).toBe(2);

        // Update order status
        const updateResult = await ecommerceMutation('update order status', {
          id: createResult.id,
          status: 'confirmed'
        });

        expect(updateResult.id).toBe(createResult.id);
        expect(updateResult.status).toBe('confirmed');
        expect(updateResult.updated_at).toBeDefined();
      });

      it('should retrieve user orders', async () => {
        // Create multiple orders for the user
        await Promise.all([
          ecommerceMutation('create order', {
            user_id: testUser.id,
            items: [{ product_id: testProduct.id, quantity: 1, price: testProduct.price }],
            shipping_address: {
              street: '123 Test St',
              city: 'Test City',
              state: 'TS',
              postal_code: '12345',
              country: 'US'
            },
            payment_method: 'credit_card'
          }),
          ecommerceMutation('create order', {
            user_id: testUser.id,
            items: [{ product_id: testProduct.id, quantity: 3, price: testProduct.price }],
            shipping_address: {
              street: '456 Test Ave',
              city: 'Test City',
              state: 'TS',
              postal_code: '12345',
              country: 'US'
            },
            payment_method: 'paypal'
          })
        ]);

        // Get user orders
        const userOrders = await ecommerceQuery('get user orders', {
          user_id: testUser.id
        });

        expect(userOrders.length).toBeGreaterThanOrEqual(2);
        expect(userOrders.every(order => order.user_id === testUser.id)).toBe(true);

        // Test order status filtering
        const pendingOrders = await ecommerceQuery('get user orders', {
          user_id: testUser.id,
          status: 'pending'
        });

        expect(pendingOrders.every(order => order.status === 'pending')).toBe(true);
      });

      it('should handle stock updates during order creation', async () => {
        const initialStock = testProduct.stock_quantity;

        // Create an order that reduces stock
        const order = await ecommerceMutation('create order', {
          user_id: testUser.id,
          items: [
            {
              product_id: testProduct.id,
              quantity: 3,
              price: testProduct.price
            }
          ],
          shipping_address: {
            street: '789 Stock St',
            city: 'Stock City',
            state: 'ST',
            postal_code: '54321',
            country: 'US'
          },
          payment_method: 'credit_card'
        });

        expect(order.id).toBeDefined();

        // Check that stock was reduced
        const updatedProduct = await ecommerceQuery('get product by id', {
          id: testProduct.id
        });

        expect(updatedProduct?.stock_quantity).toBe(initialStock - 3);
      });
    });

    describe('Complex Workflows', () => {
      it('should handle a complete e-commerce workflow', async () => {
        // 1. Create a customer
        const customer = await ecommerceMutation('create user', {
          email: 'workflow@example.com',
          password: 'password123',
          first_name: 'Workflow',
          last_name: 'Customer'
        });

        // 2. Create products
        const products = await Promise.all([
          ecommerceMutation('create product', {
            name: 'Workflow Product 1',
            price: 10.00,
            stock_quantity: 100,
            category_id: 'category1',
            sku: 'WF-001'
          }),
          ecommerceMutation('create product', {
            name: 'Workflow Product 2',
            price: 25.00,
            stock_quantity: 50,
            category_id: 'category2',
            sku: 'WF-002'
          })
        ]);

        // 3. Customer searches for products
        const searchResults = await ecommerceQuery('search products', {
          query: 'workflow',
          limit: 10
        });
        expect(searchResults.length).toBeGreaterThanOrEqual(2);

        // 4. Customer creates an order with multiple items
        const order = await ecommerceMutation('create order', {
          user_id: customer.id,
          items: [
            {
              product_id: products[0].id,
              quantity: 2,
              price: products[0].price
            },
            {
              product_id: products[1].id,
              quantity: 1,
              price: products[1].price
            }
          ],
          shipping_address: {
            street: '123 Workflow St',
            city: 'Workflow City',
            state: 'WF',
            postal_code: '12345',
            country: 'US'
          },
          payment_method: 'credit_card'
        });

        expect(order.total_amount).toBe(45.00); // (2 * 10) + (1 * 25)
        expect(order.items.length).toBe(2);

        // 5. Process the order
        const confirmedOrder = await ecommerceMutation('update order status', {
          id: order.id,
          status: 'confirmed'
        });
        expect(confirmedOrder.status).toBe('confirmed');

        const shippedOrder = await ecommerceMutation('update order status', {
          id: order.id,
          status: 'shipped'
        });
        expect(shippedOrder.status).toBe('shipped');

        // 6. Verify final state
        const finalOrderState = await ecommerceQuery('get user orders', {
          user_id: customer.id,
          status: 'shipped'
        });
        expect(finalOrderState.length).toBe(1);
        expect(finalOrderState[0].id).toBe(order.id);

        // 7. Verify stock was properly decremented
        const finalProduct1 = await ecommerceQuery('get product by id', { id: products[0].id });
        const finalProduct2 = await ecommerceQuery('get product by id', { id: products[1].id });

        expect(finalProduct1?.stock_quantity).toBe(98); // 100 - 2
        expect(finalProduct2?.stock_quantity).toBe(49); // 50 - 1
      });
    });
  });

  describe('Client-side Hooks', () => {
    it('should provide properly typed client hooks', () => {
      // Test that hooks are available and properly typed
      expect(typeof useEcommerceQuery).toBe('function');
      expect(typeof useEcommerceMutation).toBe('function');

      // These would be tested in a React testing environment
      // const queryResult = useEcommerceQuery('get all users', {});
      // const mutationResult = useEcommerceMutation('create user');

      // For now, just verify the functions exist
      expect(true).toBe(true);
    });
  });

  describe('Custom Context', () => {
    it('should work with custom server context', async () => {
      const customContextFactory = createEcommerceServerContext('admin-user', 'admin');
      const customFunctions = createEcommerceServerFunctions(customContextFactory);

      // Test that custom context functions work
      expect(typeof customFunctions.query).toBe('function');
      expect(typeof customFunctions.mutate).toBe('function');

      // Create a user with custom context
      const result = await customFunctions.mutate('create user', {
        email: 'custom@example.com',
        password: 'password123',
        first_name: 'Custom',
        last_name: 'User'
      });

      expect(result.id).toBeDefined();
      expect(result.email).toBe('custom@example.com');
    });
  });

  describe('Error Handling', () => {
    it('should handle validation errors gracefully', async () => {
      // Test invalid email format
      try {
        await ecommerceMutation('create user', {
          email: 'invalid-email',
          password: 'password123',
          first_name: 'Invalid',
          last_name: 'User'
        });
        expect.fail('Should have thrown validation error');
      } catch (error) {
        expect(error).toBeDefined();
      }

      // Test missing required fields
      try {
        await ecommerceMutation('create product', {
          name: 'Incomplete Product',
          // Missing required fields like price, stock_quantity, etc.
        } as any);
        expect.fail('Should have thrown validation error');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should handle not found errors', async () => {
      try {
        await ecommerceQuery('get user by id', {
          id: 'nonexistent-user-id'
        });
        expect.fail('Should have thrown not found error');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });
});