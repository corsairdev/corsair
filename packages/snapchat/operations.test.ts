import { SNAPCHAT_OPERATIONS, SNAPCHAT_TOOLKIT_VERSION } from './operations';

describe('snapchat operations inventory', () => {
	it('contains the full 139 operation surface', () => {
		expect(SNAPCHAT_OPERATIONS).toHaveLength(139);
	});

	it('contains unique ids and names', () => {
		const ids = new Set(SNAPCHAT_OPERATIONS.map((operation) => operation.id));
		const names = new Set(
			SNAPCHAT_OPERATIONS.map((operation) => operation.name),
		);
		expect(ids.size).toBe(SNAPCHAT_OPERATIONS.length);
		expect(names.size).toBe(SNAPCHAT_OPERATIONS.length);
	});

	it('pins the published Snapchat toolkit version', () => {
		expect(SNAPCHAT_TOOLKIT_VERSION).toBe('20260721_00');
	});
});
