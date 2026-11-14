import { makeE2bRequest } from './client';
import { e2bOperationRoutes } from './endpoints/routes';

const runLiveTest = process.env.E2B_API_KEY ? it : it.skip;
if (!process.env.E2B_API_KEY) {
	console.warn('Skipping E2B live tests: E2B_API_KEY is not set.');
}

runLiveTest('lists default templates with a configured API key', async () => {
	const apiKey = process.env.E2B_API_KEY;
	if (!apiKey)
		throw new Error('E2B_API_KEY is required for the live smoke test');

	const result = await makeE2bRequest(
		e2bOperationRoutes['templates.listDefault'],
		apiKey,
		{},
	);
	expect(Array.isArray(result)).toBe(true);
});
