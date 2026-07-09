import { listItems } from './index';

describe('faketestplugin', () => {
	it('exports listItems', () => {
		expect(typeof listItems).toBe('function');
		expect(listItems.length).toBe(1);
	});

	it('listItems returns a promise', () => {
		const result = listItems('test-key').catch(() => null);
		expect(result).toBeInstanceOf(Promise);
		expect(result).toBeDefined();
		expect(typeof result.then).toBe('function');
	});
});
