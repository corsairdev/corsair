import { borneo, borneoEndpointSchemas } from './index';
import { BORNEO_OPERATIONS } from './operations';

describe('Borneo plugin wiring', () => {
	it('wires schemas for every operation', () => {
		expect(Object.keys(borneoEndpointSchemas)).toHaveLength(153);

		for (const operation of BORNEO_OPERATIONS) {
			expect(
				borneoEndpointSchemas[
					`${operation.group}.${operation.name}` as keyof typeof borneoEndpointSchemas
				],
			).toBeDefined();
		}
	});

	it('keeps provider credentials separate from the Composio project key', async () => {
		const plugin = borneo({
			composioApiKey: 'composio-project-key',
		});

		const keyBuilder = plugin.keyBuilder as unknown as (
			ctx: {
				authType: 'api_key';
				keys: {
					get_api_key(): Promise<string>;
				};
			},
			source: 'endpoint',
		) => Promise<string>;

		const ctx = {
			authType: 'api_key' as const,
			keys: {
				get_api_key: jest.fn().mockResolvedValue('borneo-provider-key'),
			},
		};

		await expect(keyBuilder(ctx, 'endpoint')).resolves.toBe(
			'borneo-provider-key',
		);

		expect(ctx.keys.get_api_key).toHaveBeenCalledTimes(1);
	});
});
