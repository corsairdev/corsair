import { z } from 'zod';
import { defineOperation, environmentField } from './shared';

export const getProxy = defineOperation({
	group: 'proxies',
	name: 'get',
	description:
		'Look up a Modal Proxy (static outbound IP, set up in the dashboard) by name; pass its name as proxyName to sandboxes.create.',
	riskLevel: 'read',
	input: z.object({ environment: environmentField, name: z.string().min(1) }),
	output: z.object({ proxyId: z.string() }),
	run: async (runtime, input) => {
		const proxy = await runtime.client.proxies.fromName(input.name);
		return { proxyId: proxy.proxyId };
	},
});

export const proxiesOperations = [getProxy] as const;
