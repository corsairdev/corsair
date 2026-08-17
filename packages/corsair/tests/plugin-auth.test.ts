import type { CorsairPlugin } from '../core/plugins';
import { getPluginAuthType, isAuthType } from '../core/utils/plugin-auth';

describe('plugin-auth', () => {
	it('recognizes managed as a valid auth type', () => {
		expect(isAuthType('managed')).toBe(true);
	});

	it('returns managed from getPluginAuthType', () => {
		const plugin = {
			id: 'github',
			options: { authType: 'managed' as const },
		} as unknown as CorsairPlugin;

		expect(getPluginAuthType(plugin)).toBe('managed');
	});
});
