import { AuthMissingError } from 'corsair/core';
import { mailtrap } from './index';

describe('Mailtrap keyBuilder', () => {
	it.each([null, undefined, ''])(
		'throws AuthMissingError when the keystore returns %p',
		async (empty) => {
			const plugin = mailtrap();

			await expect(
				plugin.keyBuilder!(
					{
						authType: 'api_key',
						keys: {
							get_api_key: async () => empty,
						},
					} as never,
					'endpoint',
				),
			).rejects.toBeInstanceOf(AuthMissingError);
		},
	);

	it('returns the stored API key when present', async () => {
		const plugin = mailtrap();

		const key = await plugin.keyBuilder!(
			{
				authType: 'api_key',
				keys: {
					get_api_key: async () => 'test-token',
				},
			} as never,
			'endpoint',
		);

		expect(key).toBe('test-token');
	});
});
