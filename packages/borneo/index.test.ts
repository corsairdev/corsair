import type { CorsairKeyBuilderBase } from 'corsair/core';
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
			authType: 'api_key',
		});
		const getApiKey = jest.fn().mockResolvedValue('borneo-provider-key');
		const buildKey: CorsairKeyBuilderBase = plugin.keyBuilder!;

		await expect(
			buildKey(
				{
					authType: 'api_key',
					options: plugin.options ?? {
						composioApiKey: 'composio-project-key',
						authType: 'api_key',
					},
					keys: {
						get_api_key: getApiKey,
					},
					tenantId: 'default',
				},
				'endpoint',
			),
		).resolves.toBe('borneo-provider-key');

		expect(getApiKey).toHaveBeenCalledTimes(1);
	});

	it('publishes inventory risk levels on endpoint meta', () => {
		const plugin = borneo({
			composioApiKey: 'composio-project-key',
		});
		const meta = plugin.endpointMeta as Record<
			string,
			{ riskLevel: 'read' | 'write' | 'destructive'; description: string }
		>;

		expect(Object.keys(meta)).toHaveLength(153);

		for (const operation of BORNEO_OPERATIONS) {
			const entry = meta[`${operation.group}.${operation.name}`];
			expect(entry).toEqual({
				riskLevel: operation.riskLevel,
				description: operation.title,
			});
		}
	});
});
