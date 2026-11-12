import { callEncodianOperation } from './endpoints/runtime';

const apiKey = process.env.ENCODIAN_API_KEY;

(apiKey ? it : it.skip)(
	'reads Encodian subscription status with a configured API key',
	async () => {
		if (!apiKey) return;
		const result = await callEncodianOperation(
			'general.getSubscriptionStatus',
			apiKey,
			{},
		);
		expect(result).toBeDefined();
	},
);
