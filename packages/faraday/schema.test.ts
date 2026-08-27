import { FaradaySchema } from './schema';

describe('Faraday schema', () => {
	it('declares a semver version', () => {
		expect(FaradaySchema.version).toBeDefined();
		expect(FaradaySchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof FaradaySchema.entities).toBe('object');
		expect(FaradaySchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(FaradaySchema.entities))).toBe(true);
		for (const entity of Object.values(FaradaySchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
import { getAccounts } from './endpoints/accounts';
import * as client from './client';

describe('getAccounts endpoint', () => {
	it('calls makeFaradayRequest with correct arguments', async () => {
		const makeFaradayRequestMock = jest.spyOn(client, 'makeFaradayRequest').mockResolvedValue([{ id: '123' }]);
		const mockCtx: any = { key: 'test-api-key', tenantId: 'tenant-1' };
		
		const result = await getAccounts(mockCtx, { ids: ['123', '456'] });
		
		expect(makeFaradayRequestMock).toHaveBeenCalledWith('accounts', 'test-api-key', {
			method: 'GET',
			query: { ids: ['123', '456'] }
		});
		expect(result).toEqual([{ id: '123' }]);
		
		makeFaradayRequestMock.mockRestore();
	});

	it('throws error if more than 100 ids are provided', async () => {
		const mockCtx: any = { key: 'test-api-key' };
		const ids = Array.from({ length: 101 }, (_, i) => String(i));
		
		await expect(getAccounts(mockCtx, { ids })).rejects.toThrow('Maximum of 100 IDs allowed');
	});
});
