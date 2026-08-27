import {
	BORNEO_OPERATION_COUNT,
	BORNEO_OPERATION_IDS,
	BORNEO_OPERATIONS,
} from './operations';

describe('Borneo operation inventory', () => {
	it('contains exactly 153 operations', () => {
		expect(BORNEO_OPERATION_COUNT).toBe(153);
		expect(BORNEO_OPERATION_IDS).toHaveLength(153);
	});

	it('contains no duplicate operation IDs', () => {
		expect(new Set(BORNEO_OPERATION_IDS).size).toBe(
			BORNEO_OPERATION_IDS.length,
		);
	});

	it('uses canonical Borneo operation identifiers', () => {
		for (const operation of BORNEO_OPERATIONS) {
			expect(operation.id).toMatch(/^BORNEO_[A-Z0-9_]+$/);
			expect(operation.name.length).toBeGreaterThan(0);
		}
	});
});
