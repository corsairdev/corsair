import { z } from 'zod';
import { makeReplicateRequest } from './client';
import { ReplicateEndpointOutputSchemas } from './endpoints/types';

function loadLiveKey(value: string | undefined): string {
	return z.string().min(1).parse(value);
}

const LIVE_KEY: string = loadLiveKey(process.env.REPLICATE_API_TOKEN);

describe('Replicate live API', (): void => {
	jest.setTimeout(30000);

	it('account.get returns authenticated account', async (): Promise<void> => {
		const response = ReplicateEndpointOutputSchemas.accountGet.parse(
			await makeReplicateRequest('/account', LIVE_KEY, { method: 'GET' }),
		);
		expect(response.username).toBeDefined();
		expect(response.type).toBeDefined();
	});

	it('hardware.list returns hardware catalog', async (): Promise<void> => {
		const response = ReplicateEndpointOutputSchemas.hardwareList.parse(
			await makeReplicateRequest('/hardware', LIVE_KEY, { method: 'GET' }),
		);
		expect(response.length).toBeGreaterThan(0);
	});

	it('collections.list returns collection page', async (): Promise<void> => {
		const response = ReplicateEndpointOutputSchemas.collectionsList.parse(
			await makeReplicateRequest('/collections', LIVE_KEY, { method: 'GET' }),
		);
		expect(response.results.length).toBeGreaterThan(0);
	});

	it('collections.get returns official collection', async (): Promise<void> => {
		const response = ReplicateEndpointOutputSchemas.collectionsGet.parse(
			await makeReplicateRequest('/collections/official', LIVE_KEY, {
				method: 'GET',
			}),
		);
		expect(response.slug).toBe('official');
		expect(response.name).toBeDefined();
	});

	it('models.list returns model page', async (): Promise<void> => {
		const response = ReplicateEndpointOutputSchemas.modelsList.parse(
			await makeReplicateRequest('/models', LIVE_KEY, { method: 'GET' }),
		);
		expect(response.results.length).toBeGreaterThan(0);
	});

	it('models.get returns hello-world model', async (): Promise<void> => {
		const response = ReplicateEndpointOutputSchemas.modelsGet.parse(
			await makeReplicateRequest('/models/replicate/hello-world', LIVE_KEY, {
				method: 'GET',
			}),
		);
		expect(response.owner).toBe('replicate');
		expect(response.name).toBe('hello-world');
	});

	it('models.versions.list returns versions page', async (): Promise<void> => {
		const response = ReplicateEndpointOutputSchemas.modelsVersionsList.parse(
			await makeReplicateRequest(
				'/models/replicate/hello-world/versions',
				LIVE_KEY,
				{ method: 'GET' },
			),
		);
		expect(response.results.length).toBeGreaterThan(0);
	});

	it('models.readme.get returns readme text', async (): Promise<void> => {
		const response = ReplicateEndpointOutputSchemas.modelsReadmeGet.parse(
			await makeReplicateRequest(
				'/models/replicate/hello-world/readme',
				LIVE_KEY,
				{ method: 'GET', headers: { Accept: 'text/plain' } },
			),
		);
		expect(response.length).toBeGreaterThan(0);
	});

	it('models.examples.list returns examples page', async (): Promise<void> => {
		const response = ReplicateEndpointOutputSchemas.modelsExamplesList.parse(
			await makeReplicateRequest(
				'/models/replicate/hello-world/examples',
				LIVE_KEY,
				{ method: 'GET' },
			),
		);
		expect(response.results).toBeDefined();
	});

	it('predictions.list returns predictions page', async (): Promise<void> => {
		const response = ReplicateEndpointOutputSchemas.predictionsList.parse(
			await makeReplicateRequest('/predictions', LIVE_KEY, { method: 'GET' }),
		);
		expect(response.results).toBeDefined();
	});

	it('search returns matches for image query', async (): Promise<void> => {
		const response = ReplicateEndpointOutputSchemas.search.parse(
			await makeReplicateRequest('/search', LIVE_KEY, {
				method: 'GET',
				query: { query: 'image', limit: 5 },
			}),
		);
		expect(response.query).toBe('image');
		expect(response.models).toBeDefined();
	});

	it('files.list returns files page', async (): Promise<void> => {
		const response = ReplicateEndpointOutputSchemas.filesList.parse(
			await makeReplicateRequest('/files', LIVE_KEY, { method: 'GET' }),
		);
		expect(response.results).toBeDefined();
	});

	it('trainings.list returns trainings page', async (): Promise<void> => {
		const response = ReplicateEndpointOutputSchemas.trainingsList.parse(
			await makeReplicateRequest('/trainings', LIVE_KEY, { method: 'GET' }),
		);
		expect(response.results).toBeDefined();
	});

	it('deployments.list returns deployments page', async (): Promise<void> => {
		const response = ReplicateEndpointOutputSchemas.deploymentsList.parse(
			await makeReplicateRequest('/deployments', LIVE_KEY, { method: 'GET' }),
		);
		expect(response.results).toBeDefined();
	});

	it('webhooks.default.secret.get returns secret shape', async (): Promise<void> => {
		const response =
			ReplicateEndpointOutputSchemas.webhooksDefaultSecretGet.parse(
				await makeReplicateRequest('/webhooks/default/secret', LIVE_KEY, {
					method: 'GET',
				}),
			);
		expect(response.key).toBeDefined();
	});

	it('rejects a request with an invalid credential', async (): Promise<void> => {
		await expect(
			makeReplicateRequest('/account', 'invalid-key-for-shape-check', {
				method: 'GET',
			}),
		).rejects.toThrow();
	});
});
