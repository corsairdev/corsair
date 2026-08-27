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

	it('uses an explicit Composio API key when supplied', async () => {
		const plugin = borneo({ composioApiKey: 'project-key' });
		const keyBuilder = plugin.keyBuilder as unknown as (
			ctx: unknown,
			source: 'endpoint',
		) => Promise<string>;
		await expect(keyBuilder({}, 'endpoint')).resolves.toBe('project-key');
	});
});
