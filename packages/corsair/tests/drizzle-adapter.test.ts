import { drizzleAdapter } from '../adapters/drizzle';
import type { CorsairDbAdapter } from '../adapters/types';

type MockDrizzleDB = {
	_: { fullSchema?: Record<string, unknown> };
	select: jest.Mock;
	insert: jest.Mock;
	update: jest.Mock;
	delete: jest.Mock;
	transaction?: jest.Mock;
};

function createMockDrizzleDB(schema?: Record<string, unknown>): MockDrizzleDB {
	const mockSelectBuilder = {
		from: jest.fn().mockReturnThis(),
		where: jest.fn().mockReturnThis(),
		limit: jest.fn().mockReturnThis(),
		offset: jest.fn().mockReturnThis(),
		orderBy: jest.fn().mockReturnThis(),
		then: jest.fn((resolve) => resolve([])),
	};

	const mockInsertBuilder = {
		values: jest.fn().mockReturnThis(),
		returning: jest.fn().mockResolvedValue([]),
	};

	const mockUpdateBuilder = {
		set: jest.fn().mockReturnThis(),
		where: jest.fn().mockReturnThis(),
		returning: jest.fn().mockResolvedValue([]),
	};

	const mockDeleteBuilder = {
		where: jest.fn().mockReturnThis(),
		returning: jest.fn().mockResolvedValue([]),
	};

	return {
		_: { fullSchema: schema },
		select: jest.fn().mockReturnValue(mockSelectBuilder),
		insert: jest.fn().mockReturnValue(mockInsertBuilder),
		update: jest.fn().mockReturnValue(mockUpdateBuilder),
		delete: jest.fn().mockReturnValue(mockDeleteBuilder),
		transaction: jest.fn(),
	};
}

function createMockTable(columns: string[] = ['id', 'name', 'value']) {
	const table: Record<string, unknown> = {};
	for (const col of columns) {
		table[col] = { name: col };
	}
	return table;
}

describe('Drizzle Adapter', () => {
	let mockDb: MockDrizzleDB;
	let adapter: CorsairDbAdapter;
	let mockSchema: Record<string, unknown>;

	beforeEach(() => {
		mockSchema = {
			corsair_accounts: createMockTable([
				'id',
				'tenant_id',
				'integration_id',
				'config',
				'created_at',
				'updated_at',
			]),
			corsair_entities: createMockTable([
				'id',
				'account_id',
				'entity_id',
				'entity_type',
				'version',
				'data',
			]),
			corsair_events: createMockTable([
				'id',
				'account_id',
				'event_type',
				'payload',
				'status',
			]),
			corsair_integrations: createMockTable(['id', 'name', 'config']),
		};
		mockDb = createMockDrizzleDB(mockSchema);
		adapter = drizzleAdapter(mockDb, { provider: 'pg', schema: mockSchema });
	});

	describe('Initialization', () => {
		it('should create adapter with default id', () => {
			expect(adapter.id).toBe('drizzle');
		});

		it('should create adapter with custom id', () => {
			const customAdapter = drizzleAdapter(mockDb, {
				provider: 'pg',
				schema: mockSchema,
				adapterId: 'custom-drizzle',
			});
			expect(customAdapter.id).toBe('custom-drizzle');
		});

		it('should use schema from config when provided', () => {
			const customSchema = {
				corsair_accounts: createMockTable(),
			};
			const customAdapter = drizzleAdapter(mockDb, {
				provider: 'pg',
				schema: customSchema,
			});
			expect(customAdapter.id).toBe('drizzle');
		});

		it('should use fullSchema from db when schema not provided', () => {
			const dbWithSchema = createMockDrizzleDB(mockSchema);
			const customAdapter = drizzleAdapter(dbWithSchema, {
				provider: 'pg',
			});
			expect(customAdapter.id).toBe('drizzle');
		});

		it('should throw error for unsupported provider', () => {
			expect(() => {
				drizzleAdapter(mockDb, {
					provider: 'mysql' as any,
					schema: mockSchema,
				});
			}).toThrow('Corsair Drizzle adapter only supports provider "pg"');
		});

		it('should throw error when schema is not found', () => {
			const dbWithoutSchema = createMockDrizzleDB();
			expect(() => {
				drizzleAdapter(dbWithoutSchema, { provider: 'pg' });
			}).toThrow('Drizzle adapter failed to initialize. Schema not found');
		});
	});

	describe('findOne', () => {
		it('should find one record with where clause', async () => {
			const mockResult = { id: '1', name: 'test' };
			const mockSelectBuilder = mockDb.select() as any;
			mockSelectBuilder.then = jest.fn((resolve) => resolve([mockResult]));

			const result = await adapter.findOne({
				table: 'corsair_accounts',
				where: [{ field: 'id', value: '1' }],
			});

			expect(mockDb.select).toHaveBeenCalled();
			expect(mockSelectBuilder.from).toHaveBeenCalled();
			expect(mockSelectBuilder.where).toHaveBeenCalled();
			expect(mockSelectBuilder.limit).toHaveBeenCalledWith(1);
			expect(result).toEqual(mockResult);
		});

		it('should return null when no record found', async () => {
			const mockSelectBuilder = mockDb.select() as any;
			mockSelectBuilder.then = jest.fn((resolve) => resolve([]));

			const result = await adapter.findOne({
				table: 'corsair_accounts',
				where: [{ field: 'id', value: '999' }],
			});

			expect(result).toBeNull();
		});

		it('should support select projection', async () => {
			const mockResult = { id: '1', name: 'test' };
			const mockSelectBuilder = mockDb.select() as any;
			mockSelectBuilder.then = jest.fn((resolve) => resolve([mockResult]));

			await adapter.findOne({
				table: 'corsair_accounts',
				where: [{ field: 'id', value: '1' }],
				select: ['id', 'name'],
			});

			const table = mockSchema.corsair_accounts as Record<string, unknown>;
			expect(mockDb.select).toHaveBeenCalledWith({
				id: table.id,
				name: table.name,
			});
		});

		it('should handle custom table names', async () => {
			const customSchema = {
				custom_accounts: createMockTable(),
			};
			const customAdapter = drizzleAdapter(mockDb, {
				provider: 'pg',
				schema: customSchema,
				tableNames: {
					accounts: 'custom_accounts',
				},
			});

			const mockResult = { id: '1' };
			const mockSelectBuilder = mockDb.select() as any;
			mockSelectBuilder.then = jest.fn((resolve) => resolve([mockResult]));

			await customAdapter.findOne({
				table: 'corsair_accounts',
				where: [{ field: 'id', value: '1' }],
			});

			expect(mockSelectBuilder.from).toHaveBeenCalledWith(
				customSchema.custom_accounts,
			);
		});
	});

	describe('findMany', () => {
		it('should find many records', async () => {
			const mockResults = [
				{ id: '1', name: 'test1' },
				{ id: '2', name: 'test2' },
			];
			const mockSelectBuilder = mockDb.select() as any;
			mockSelectBuilder.then = jest.fn((resolve) => resolve(mockResults));

			const result = await adapter.findMany({
				table: 'corsair_accounts',
			});

			expect(mockDb.select).toHaveBeenCalled();
			expect(mockSelectBuilder.from).toHaveBeenCalled();
			expect(result).toEqual(mockResults);
		});

		it('should apply where clause', async () => {
			const mockSelectBuilder = mockDb.select() as any;
			mockSelectBuilder.then = jest.fn((resolve) => resolve([]));

			await adapter.findMany({
				table: 'corsair_accounts',
				where: [{ field: 'tenant_id', value: 'tenant1' }],
			});

			expect(mockSelectBuilder.where).toHaveBeenCalled();
		});

		it('should apply limit', async () => {
			const mockSelectBuilder = mockDb.select() as any;
			mockSelectBuilder.then = jest.fn((resolve) => resolve([]));

			await adapter.findMany({
				table: 'corsair_accounts',
				limit: 10,
			});

			expect(mockSelectBuilder.limit).toHaveBeenCalledWith(10);
		});

		it('should apply offset', async () => {
			const mockSelectBuilder = mockDb.select() as any;
			mockSelectBuilder.then = jest.fn((resolve) => resolve([]));

			await adapter.findMany({
				table: 'corsair_accounts',
				offset: 5,
			});

			expect(mockSelectBuilder.offset).toHaveBeenCalledWith(5);
		});

		it('should apply sortBy', async () => {
			const mockSelectBuilder = mockDb.select() as any;
			mockSelectBuilder.then = jest.fn((resolve) => resolve([]));

			await adapter.findMany({
				table: 'corsair_accounts',
				sortBy: { field: 'id', direction: 'desc' },
			});

			expect(mockSelectBuilder.orderBy).toHaveBeenCalled();
		});

		it('should combine all query options', async () => {
			const mockResults = [{ id: '1' }];
			const mockSelectBuilder = mockDb.select() as any;
			mockSelectBuilder.then = jest.fn((resolve) => resolve(mockResults));

			await adapter.findMany({
				table: 'corsair_accounts',
				where: [{ field: 'tenant_id', value: 'tenant1' }],
				limit: 10,
				offset: 5,
				sortBy: { field: 'id', direction: 'asc' },
				select: ['id', 'name'],
			});

			expect(mockSelectBuilder.where).toHaveBeenCalled();
			expect(mockSelectBuilder.limit).toHaveBeenCalledWith(10);
			expect(mockSelectBuilder.offset).toHaveBeenCalledWith(5);
			expect(mockSelectBuilder.orderBy).toHaveBeenCalled();
		});
	});

	describe('insert', () => {
		it('should insert a record', async () => {
			const mockResult = { id: '1', name: 'test', config: {} };
			const mockInsertBuilder = mockDb.insert() as any;
			mockInsertBuilder.returning = jest.fn().mockResolvedValue([mockResult]);

			const result = await adapter.insert({
				table: 'corsair_integrations',
				data: { id: '1', name: 'test', config: {} },
			});

			expect(mockDb.insert).toHaveBeenCalled();
			expect(mockInsertBuilder.values).toHaveBeenCalledWith({
				id: '1',
				name: 'test',
				config: {},
			});
			expect(result).toEqual(mockResult);
		});

		it('should return data when no returning result', async () => {
			const mockInsertBuilder = mockDb.insert() as any;
			mockInsertBuilder.returning = jest.fn().mockResolvedValue([]);

			const data = { id: '1', name: 'test', config: {} };
			const result = await adapter.insert({
				table: 'corsair_integrations',
				data,
			});

			expect(result).toEqual(data);
		});

		it('should support select projection', async () => {
			const mockResult = { id: '1', name: 'test' };
			const mockInsertBuilder = mockDb.insert() as any;
			mockInsertBuilder.returning = jest.fn().mockResolvedValue([mockResult]);

			await adapter.insert({
				table: 'corsair_integrations',
				data: { id: '1', name: 'test', config: {} },
				select: ['id', 'name'],
			});

			const table = mockSchema.corsair_integrations as Record<string, unknown>;
			expect(mockInsertBuilder.returning).toHaveBeenCalledWith({
				id: table.id,
				name: table.name,
			});
		});
	});

	describe('update', () => {
		it('should update a record', async () => {
			const mockResult = { id: '1', name: 'updated' };
			const mockUpdateBuilder = mockDb.update() as any;
			mockUpdateBuilder.returning = jest.fn().mockResolvedValue([mockResult]);

			const result = await adapter.update({
				table: 'corsair_integrations',
				where: [{ field: 'id', value: '1' }],
				data: { name: 'updated' },
			});

			expect(mockDb.update).toHaveBeenCalled();
			expect(mockUpdateBuilder.set).toHaveBeenCalledWith({ name: 'updated' });
			expect(mockUpdateBuilder.where).toHaveBeenCalled();
			expect(result).toEqual(mockResult);
		});

		it('should throw error when where clause is empty', async () => {
			await expect(
				adapter.update({
					table: 'corsair_integrations',
					where: [],
					data: { name: 'updated' },
				}),
			).rejects.toThrow(
				'Drizzle adapter: update requires a non-empty where clause',
			);
		});

		it('should return null when no record updated', async () => {
			const mockUpdateBuilder = mockDb.update() as any;
			mockUpdateBuilder.returning = jest.fn().mockResolvedValue([]);

			const result = await adapter.update({
				table: 'corsair_integrations',
				where: [{ field: 'id', value: '999' }],
				data: { name: 'updated' },
			});

			expect(result).toBeNull();
		});

		it('should support select projection', async () => {
			const mockResult = { id: '1', name: 'updated' };
			const mockUpdateBuilder = mockDb.update() as any;
			mockUpdateBuilder.returning = jest.fn().mockResolvedValue([mockResult]);

			await adapter.update({
				table: 'corsair_integrations',
				where: [{ field: 'id', value: '1' }],
				data: { name: 'updated' },
				select: ['id', 'name'],
			});

			const table = mockSchema.corsair_integrations as Record<string, unknown>;
			expect(mockUpdateBuilder.returning).toHaveBeenCalledWith({
				id: table.id,
				name: table.name,
			});
		});
	});

	describe('deleteMany', () => {
		it('should delete records and return count', async () => {
			const mockDeleteBuilder = mockDb.delete() as any;
			mockDeleteBuilder.returning = jest
				.fn()
				.mockResolvedValue([{ id: '1' }, { id: '2' }]);

			const result = await adapter.deleteMany({
				table: 'corsair_accounts',
				where: [{ field: 'tenant_id', value: 'tenant1' }],
			});

			expect(mockDb.delete).toHaveBeenCalled();
			expect(mockDeleteBuilder.where).toHaveBeenCalled();
			expect(result).toBe(2);
		});

		it('should return 0 when where clause is empty', async () => {
			const result = await adapter.deleteMany({
				table: 'corsair_accounts',
				where: [],
			});

			expect(result).toBe(0);
			expect(mockDb.delete).not.toHaveBeenCalled();
		});

		it('should return 0 when no records deleted', async () => {
			const mockDeleteBuilder = mockDb.delete() as any;
			mockDeleteBuilder.returning = jest.fn().mockResolvedValue([]);

			const result = await adapter.deleteMany({
				table: 'corsair_accounts',
				where: [{ field: 'id', value: '999' }],
			});

			expect(result).toBe(0);
		});
	});

	describe('count', () => {
		it('should count all records when no where clause', async () => {
			const mockSelectBuilder = mockDb.select() as any;
			mockSelectBuilder.then = jest.fn((resolve) => resolve([{ count: 10 }]));

			const result = await adapter.count({
				table: 'corsair_accounts',
			});

			expect(mockDb.select).toHaveBeenCalled();
			expect(result).toBe(10);
		});

		it('should count records with where clause', async () => {
			const mockSelectBuilder = mockDb.select() as any;
			mockSelectBuilder.then = jest.fn((resolve) => resolve([{ count: 5 }]));

			const result = await adapter.count({
				table: 'corsair_accounts',
				where: [{ field: 'tenant_id', value: 'tenant1' }],
			});

			expect(mockSelectBuilder.where).toHaveBeenCalled();
			expect(result).toBe(5);
		});

		it('should handle bigint count values', async () => {
			const mockSelectBuilder = mockDb.select() as any;
			mockSelectBuilder.then = jest.fn((resolve) =>
				resolve([{ count: BigInt(100) }]),
			);

			const result = await adapter.count({
				table: 'corsair_accounts',
			});

			expect(result).toBe(100);
		});

		it('should handle string count values', async () => {
			const mockSelectBuilder = mockDb.select() as any;
			mockSelectBuilder.then = jest.fn((resolve) => resolve([{ count: '42' }]));

			const result = await adapter.count({
				table: 'corsair_accounts',
			});

			expect(result).toBe(42);
		});

		it('should return 0 when count is null or undefined', async () => {
			const mockSelectBuilder = mockDb.select() as any;
			mockSelectBuilder.then = jest.fn((resolve) => resolve([{ count: null }]));

			const result = await adapter.count({
				table: 'corsair_accounts',
			});

			expect(result).toBe(0);
		});
	});

	describe('transaction', () => {
		it('should execute transaction when db supports it', async () => {
			const mockTransactionAdapter = {
				id: 'drizzle:trx',
			} as CorsairDbAdapter;
			const mockTx = createMockDrizzleDB(mockSchema);
			mockDb.transaction = jest.fn().mockImplementation(async (fn) => {
				return fn(mockTx);
			});

			if (!adapter.transaction) {
				throw new Error('Transaction method should exist');
			}

			const result = await adapter.transaction(async (trx) => {
				expect(trx.id).toBe('drizzle:trx');
				return 'transaction-result';
			});

			expect(mockDb.transaction).toHaveBeenCalled();
			expect(result).toBe('transaction-result');
		});

		it('should execute without transaction when db does not support it', async () => {
			const dbWithoutTransaction = createMockDrizzleDB(mockSchema);
			dbWithoutTransaction.transaction = undefined;
			const adapterWithoutTx = drizzleAdapter(dbWithoutTransaction, {
				provider: 'pg',
				schema: mockSchema,
			});

			if (!adapterWithoutTx.transaction) {
				throw new Error('Transaction method should exist');
			}

			const result = await adapterWithoutTx.transaction(async (trx) => {
				expect(trx.id).toBe('drizzle');
				return 'no-transaction-result';
			});

			expect(result).toBe('no-transaction-result');
		});

		it('should propagate transaction errors', async () => {
			mockDb.transaction = jest
				.fn()
				.mockRejectedValue(new Error('Transaction failed'));

			if (!adapter.transaction) {
				throw new Error('Transaction method should exist');
			}

			await expect(
				adapter.transaction(async () => {
					throw new Error('Transaction failed');
				}),
			).rejects.toThrow('Transaction failed');
		});
	});

	describe('Where operators', () => {
		it('should handle equals operator', async () => {
			const mockSelectBuilder = mockDb.select() as any;
			mockSelectBuilder.then = jest.fn((resolve) => resolve([]));

			await adapter.findMany({
				table: 'corsair_accounts',
				where: [{ field: 'id', value: '1', operator: '=' }],
			});

			expect(mockSelectBuilder.where).toHaveBeenCalled();
		});

		it('should handle in operator', async () => {
			const mockSelectBuilder = mockDb.select() as any;
			mockSelectBuilder.then = jest.fn((resolve) => resolve([]));

			await adapter.findMany({
				table: 'corsair_accounts',
				where: [{ field: 'id', value: ['1', '2', '3'], operator: 'in' }],
			});

			expect(mockSelectBuilder.where).toHaveBeenCalled();
		});

		it('should handle like operator', async () => {
			const mockSelectBuilder = mockDb.select() as any;
			mockSelectBuilder.then = jest.fn((resolve) => resolve([]));

			await adapter.findMany({
				table: 'corsair_accounts',
				where: [{ field: 'name', value: 'test%', operator: 'like' }],
			});

			expect(mockSelectBuilder.where).toHaveBeenCalled();
		});

		it('should handle multiple where conditions', async () => {
			const mockSelectBuilder = mockDb.select() as any;
			mockSelectBuilder.then = jest.fn((resolve) => resolve([]));

			await adapter.findMany({
				table: 'corsair_accounts',
				where: [
					{ field: 'tenant_id', value: 'tenant1' },
					{ field: 'provider', value: 'slack' },
				],
			});

			expect(mockSelectBuilder.where).toHaveBeenCalled();
		});

		it('should default to equals operator when not specified', async () => {
			const mockSelectBuilder = mockDb.select() as any;
			mockSelectBuilder.then = jest.fn((resolve) => resolve([]));

			await adapter.findMany({
				table: 'corsair_accounts',
				where: [{ field: 'id', value: '1' }],
			});

			expect(mockSelectBuilder.where).toHaveBeenCalled();
		});
	});

	describe('Error handling', () => {
		it('should throw error when column not found', async () => {
			await expect(
				adapter.findOne({
					table: 'corsair_accounts',
					where: [{ field: 'nonexistent', value: '1' }],
				}),
			).rejects.toThrow('column "nonexistent" was not found');
		});

		it('should throw error when table not found in schema', async () => {
			const customSchema = {
				corsair_accounts: createMockTable(),
			};
			const customAdapter = drizzleAdapter(mockDb, {
				provider: 'pg',
				schema: customSchema,
			});

			await expect(
				customAdapter.findOne({
					table: 'corsair_resources',
					where: [{ field: 'id', value: '1' }],
				}),
			).rejects.toThrow('Table "corsair_resources" was not found in schema');
		});
	});
});
