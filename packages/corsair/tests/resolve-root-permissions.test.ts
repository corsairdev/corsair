import {
	DEPRECATED_APPROVAL_CONFIG_MESSAGE,
	resolveRootPermissionsConfig,
} from '../core/config/resolve-root-permissions';

describe('resolveRootPermissionsConfig', () => {
	it('returns permissions when set', () => {
		const options = {
			timeout: '10m',
			onTimeout: 'deny' as const,
		};
		expect(resolveRootPermissionsConfig({ permissions: options })).toBe(
			options,
		);
	});

	it('falls back to deprecated approval with a console warning', () => {
		const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
		const options = {
			timeout: '30m',
			onTimeout: 'deny' as const,
			mode: 'asynchronous' as const,
		};

		expect(resolveRootPermissionsConfig({ approval: options })).toBe(options);
		expect(warn).toHaveBeenCalledWith(
			`[corsair] ${DEPRECATED_APPROVAL_CONFIG_MESSAGE}`,
		);

		warn.mockRestore();
	});

	it('throws when both permissions and approval are set', () => {
		const options = { timeout: '10m', onTimeout: 'deny' as const };
		expect(() =>
			resolveRootPermissionsConfig({
				permissions: options,
				approval: options,
			}),
		).toThrow(/both permissions and approval/);
	});
});
