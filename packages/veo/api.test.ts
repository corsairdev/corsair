// Live Veo call. Ignored by jest.config.cjs. Run with:
//   VEO_ACCESS_TOKEN=... VEO_PROJECT_ID=... pnpm exec jest api.test.ts
import { makeVeoRequest, veoHost, veoModelPath } from './client';
import { VeoOperationSchema } from './endpoints/types';

const token = process.env.VEO_ACCESS_TOKEN ?? '';
const projectId = process.env.VEO_PROJECT_ID ?? '';
const describeLive = token && projectId ? describe : describe.skip;

describeLive('Veo live API (env-gated)', () => {
	it('starts a text-to-video operation and fetches it once', async () => {
		const location = 'us-central1';
		const model = 'veo-3.1-fast-generate-001';
		const started = await makeVeoRequest<unknown>(
			veoHost(location),
			veoModelPath(projectId, location, model, 'predictLongRunning'),
			token,
			{
				body: {
					instances: [{ prompt: 'a calm ocean at sunrise' }],
					parameters: { sampleCount: 1, durationSeconds: 4 },
				},
			},
		);
		const operation = VeoOperationSchema.parse(started);
		expect(operation.name).toContain('/operations/');

		const polled = await makeVeoRequest<unknown>(
			veoHost(location),
			veoModelPath(projectId, location, model, 'fetchPredictOperation'),
			token,
			{ body: { operationName: operation.name } },
		);
		expect(VeoOperationSchema.parse(polled).name).toBe(operation.name);
	});
});
