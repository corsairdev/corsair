import 'dotenv/config';
import { makeRunpodGraphql } from './client';
import {
	createSecret,
	deleteRegistryAuth,
	deleteTemplate,
	getGpuTypes,
	getMyself,
	getPod,
	listCpuTypes,
	listPods,
	saveRegistryAuth,
	saveTemplate,
	updateRegistryAuth,
} from './endpoints';
import { RunpodEndpointOutputSchemas } from './endpoints/types';
import type { RunpodContext } from './index';

const TEST_API_KEY = process.env.RUNPOD_API_KEY;
const ctx = { key: TEST_API_KEY } as RunpodContext;
const maybeDescribe = TEST_API_KEY ? describe : describe.skip;

maybeDescribe('RunPod live API', () => {
	it('gets the authenticated user', async () => {
		const myself = await getMyself(ctx, {});
		expect(myself.id).toBeTruthy();
		RunpodEndpointOutputSchemas.getMyself.parse(myself);
	});

	it('lists GPU types with pricing fields', async () => {
		const gpus = await getGpuTypes(ctx, {});
		expect(gpus.length).toBeGreaterThan(0);
		expect(gpus[0]?.id).toBeTruthy();
		RunpodEndpointOutputSchemas.getGpuTypes.parse(gpus);
	});

	it('lists CPU types from the v2 catalog', async () => {
		const cpus = await listCpuTypes(ctx, {});
		expect(cpus.cpus.length).toBeGreaterThan(0);
		RunpodEndpointOutputSchemas.listCpuTypes.parse(cpus);
	});

	it('lists pods', async () => {
		const pods = await listPods(ctx, {});
		expect(Array.isArray(pods)).toBe(true);
		RunpodEndpointOutputSchemas.listPods.parse(pods);
	});

	it('returns a structured error for a missing pod', async () => {
		await expect(getPod(ctx, { podId: 'missing-pod-id' })).rejects.toThrow();
	});

	it('creates, updates, and deletes registry auth', async () => {
		const name = `corsair-test-${Date.now()}`;
		let registryId: string | undefined;
		try {
			const saved = await saveRegistryAuth(ctx, {
				name,
				username: 'corsair-test',
				password: 'corsair-test-password',
			});
			registryId = saved.id;
			expect(saved.id).toBeTruthy();
			RunpodEndpointOutputSchemas.saveRegistryAuth.parse(saved);

			const updated = await updateRegistryAuth(ctx, {
				id: saved.id,
				username: 'corsair-test',
				password: 'corsair-test-password-2',
			});
			expect(updated.id).toBe(saved.id);
		} finally {
			if (registryId) {
				await deleteRegistryAuth(ctx, {
					containerRegistryAuthId: registryId,
				});
			}
		}
	});

	it('creates and deletes a serverless template', async () => {
		const name = `corsair-tpl-${Date.now()}`;
		let created = false;
		try {
			const saved = await saveTemplate(ctx, {
				name,
				imageName: 'runpod/serverless-hello-world:latest',
				containerDiskInGb: 5,
				volumeInGb: 0,
				isServerless: true,
			});
			created = true;
			expect(saved.id).toBeTruthy();
			RunpodEndpointOutputSchemas.saveTemplate.parse(saved);
		} finally {
			if (created) {
				await deleteTemplate(ctx, { templateName: name });
			}
		}
	});

	it('creates a secret', async () => {
		const name = `corsair_secret_${Date.now()}`;
		let secretId: string | undefined;
		try {
			const secret = await createSecret(ctx, {
				name,
				value: 'corsair-live-test',
			});
			secretId = secret.id;
			expect(secret.id).toBeTruthy();
			RunpodEndpointOutputSchemas.createSecret.parse(secret);
		} finally {
			if (secretId) {
				await makeRunpodGraphql(
					TEST_API_KEY!,
					`mutation { secretDelete(id: ${JSON.stringify(secretId)}) }`,
				);
			}
		}
	});
});
