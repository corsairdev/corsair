import { makeShipEngineRequest } from './client';

const apiKey = process.env.SHIPENGINE_API_KEY;

if (!apiKey) {
	console.warn(
		'Skipping ShipEngine live smoke test: set SHIPENGINE_API_KEY to run the read-only carrier-list check.',
	);
	test.skip('lists carriers with a configured API key', () => undefined);
} else {
	test('lists carriers with a configured API key', async () => {
		const response = await makeShipEngineRequest(
			'carriers.listCarriers',
			apiKey,
			{},
		);
		expect(Array.isArray(response.carriers)).toBe(true);
	});
}
