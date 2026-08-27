import {
	BORNEO_OPERATION_COUNT,
	BORNEO_OPERATION_IDS,
	BORNEO_OPERATIONS,
	BORNEO_TOOLKIT_VERSION,
} from './operations';

describe('Borneo operation inventory', () => {
	it('contains exactly 153 operations', () => {
		expect(BORNEO_OPERATION_COUNT).toBe(153);
		expect(BORNEO_OPERATION_IDS).toHaveLength(153);
	});

	it('contains no duplicate operation IDs or names', () => {
		expect(new Set(BORNEO_OPERATION_IDS).size).toBe(153);
		expect(
			new Set(BORNEO_OPERATIONS.map((operation) => operation.name)).size,
		).toBe(153);
	});

	it('pins the public Borneo toolkit version', () => {
		expect(BORNEO_TOOLKIT_VERSION).toBe('20260429_00');
	});
});
