import { tinyfish } from './index';

describe('tinyfish plugin options', () => {
	it('keeps DEFAULT last when caller handlers are merged', () => {
		const plugin = tinyfish({
			errorHandlers: {
				NETWORK_ERROR: {
					match: () => false,
					handler: async () => ({ maxRetries: 0 }),
				},
			},
		});
		const names = Object.keys(plugin.errorHandlers ?? {});
		expect(names.at(-1)).toBe('DEFAULT');
		expect(names.indexOf('NETWORK_ERROR')).toBeGreaterThan(-1);
		expect(names.indexOf('NETWORK_ERROR')).toBeLessThan(
			names.indexOf('DEFAULT'),
		);
		expect(names.indexOf('SERVER_ERROR')).toBeLessThan(
			names.indexOf('DEFAULT'),
		);
	});
});
