import { logEventFromContext } from 'corsair/core';
import { request } from 'corsair/http';
import {
	createCluster,
	createSecret,
	deleteRegistryAuth,
	deleteTemplate,
	getGpuTypes,
	getMyself,
	getPod,
	listCpuTypes,
	listPods,
	saveEndpoint,
	saveRegistryAuth,
	saveTemplate,
	updateRegistryAuth,
	updateUserSettings,
} from './endpoints';
import type { RunpodContext } from './index';

jest.mock('corsair/http', () => ({
	...jest.requireActual('corsair/http'),
	request: jest.fn(),
}));

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockRequest = request as jest.MockedFunction<typeof request>;
const mockLogEvent = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;
const ctx = { key: 'test-key' } as RunpodContext;

beforeEach(() => {
	mockRequest.mockReset();
	mockLogEvent.mockClear();
});

describe('account.myself', () => {
	it('queries GraphQL myself', async () => {
		mockRequest.mockResolvedValueOnce({
			data: { myself: { id: 'user_1', email: 'a@b.c' } },
		});
		const result = await getMyself(ctx, {});
		expect(result.id).toBe('user_1');
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://api.runpod.io' }),
			expect.objectContaining({ method: 'POST', url: '/graphql' }),
			expect.anything(),
		);
	});
});

describe('account.updateSettings', () => {
	it('mutates updateUserSettings', async () => {
		mockRequest.mockResolvedValueOnce({
			data: {
				updateUserSettings: { id: 'user_1', pubKey: 'ssh-ed25519 AAAA' },
			},
		});
		const result = await updateUserSettings(ctx, {
			pubKey: 'ssh-ed25519 AAAA',
		});
		expect(result.pubKey).toContain('ssh-ed25519');
	});
});

describe('catalog.gpuTypes', () => {
	it('queries gpuTypes', async () => {
		mockRequest.mockResolvedValueOnce({
			data: {
				gpuTypes: [{ id: 'NVIDIA RTX A6000', displayName: 'RTX A6000' }],
			},
		});
		const result = await getGpuTypes(ctx, {});
		expect(result[0]?.id).toBe('NVIDIA RTX A6000');
	});
});

describe('catalog.cpuTypes', () => {
	it('lists v2 catalog CPUs', async () => {
		mockRequest.mockResolvedValueOnce({
			cpus: [
				{
					id: 'cpu3c',
					name: 'Compute-Optimized',
					group: 'Gen 3',
					vcpu: { min: 2, max: 32 },
					ramGbPerVcpu: 2.5,
					price: { securePerVcpu: 0.04, serverlessPerVcpu: 0.03 },
				},
			],
		});
		const result = await listCpuTypes(ctx, {});
		expect(result.cpus[0]?.id).toBe('cpu3c');
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://api.runpod.io' }),
			expect.objectContaining({ method: 'GET', url: '/v2/catalog/cpus' }),
			expect.anything(),
		);
	});
});

describe('pods.list', () => {
	it('lists pods from REST v1', async () => {
		mockRequest.mockResolvedValueOnce([
			{ id: 'pod_1', desiredStatus: 'RUNNING' },
		]);
		const result = await listPods(ctx, { desiredStatus: 'RUNNING' });
		expect(result[0]?.id).toBe('pod_1');
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://rest.runpod.io/v1' }),
			expect.objectContaining({
				method: 'GET',
				url: '/pods',
				query: { desiredStatus: 'RUNNING' },
			}),
			expect.anything(),
		);
	});
});

describe('pods.get', () => {
	it('gets a pod from REST v1', async () => {
		mockRequest.mockResolvedValueOnce({
			id: 'pod_1',
			desiredStatus: 'RUNNING',
			costPerHr: '0.74',
			memoryInGb: 62,
		});
		const result = await getPod(ctx, { podId: 'pod_1' });
		expect(result.id).toBe('pod_1');
		expect(result.costPerHr).toBe(0.74);
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://rest.runpod.io/v1' }),
			expect.objectContaining({ method: 'GET', url: '/pods/pod_1' }),
			expect.anything(),
		);
	});
});

describe('clusters.create', () => {
	it('posts a v2 cluster', async () => {
		mockRequest.mockResolvedValueOnce({
			id: 'cluster_1',
			name: 'train',
			type: 'TRAINING',
			compute: {
				gpuTypeId: 'NVIDIA H100 80GB HBM3',
				gpuCountPerPod: 8,
				podCount: 2,
			},
		});
		const result = await createCluster(ctx, {
			name: 'train',
			type: 'TRAINING',
			compute: {
				gpuTypeId: 'NVIDIA H100 80GB HBM3',
				gpuCountPerPod: 8,
				podCount: 2,
			},
		});
		expect(result.id).toBe('cluster_1');
	});
});

describe('secrets.create', () => {
	it('creates a GraphQL secret', async () => {
		mockRequest.mockResolvedValueOnce({
			data: { secretCreate: { id: 'sec_1', name: 'hf' } },
		});
		const result = await createSecret(ctx, { name: 'hf', value: 'tok' });
		expect(result.id).toBe('sec_1');
	});
});

describe('registries', () => {
	it('saves registry auth via REST v1', async () => {
		mockRequest.mockResolvedValueOnce({ id: 'reg_1', name: 'docker' });
		const result = await saveRegistryAuth(ctx, {
			name: 'docker',
			username: 'u',
			password: 'p',
		});
		expect(result.id).toBe('reg_1');
	});

	it('updates registry auth via GraphQL', async () => {
		mockRequest.mockResolvedValueOnce({
			data: { updateRegistryAuth: { id: 'reg_1', name: 'docker' } },
		});
		const result = await updateRegistryAuth(ctx, {
			id: 'reg_1',
			username: 'u',
			password: 'p2',
		});
		expect(result.id).toBe('reg_1');
	});

	it('deletes registry auth via REST v1', async () => {
		mockRequest.mockResolvedValueOnce(undefined);
		const result = await deleteRegistryAuth(ctx, {
			containerRegistryAuthId: 'reg_1',
		});
		expect(result).toEqual({});
	});
});

describe('templates', () => {
	it('saves a template via GraphQL', async () => {
		mockRequest.mockResolvedValueOnce({
			data: {
				saveTemplate: {
					id: 'tpl_1',
					name: 'gpu',
					imageName: 'ubuntu:latest',
					containerDiskInGb: 5,
					volumeInGb: 0,
				},
			},
		});
		const result = await saveTemplate(ctx, {
			name: 'gpu',
			imageName: 'ubuntu:latest',
			containerDiskInGb: 5,
			volumeInGb: 0,
		});
		expect(result.id).toBe('tpl_1');
	});

	it('deletes a template via GraphQL', async () => {
		mockRequest.mockResolvedValueOnce({ data: { deleteTemplate: null } });
		const result = await deleteTemplate(ctx, { templateName: 'gpu' });
		expect(result.success).toBe(true);
	});
});

describe('endpoints.save', () => {
	it('saves a serverless endpoint via GraphQL', async () => {
		mockRequest.mockResolvedValueOnce({
			data: {
				saveEndpoint: {
					id: 'ep_1',
					name: 'infer',
					gpuIds: 'AMPERE_16',
					templateId: 'tpl_1',
				},
			},
		});
		const result = await saveEndpoint(ctx, {
			name: 'infer',
			templateId: 'tpl_1',
			gpuIds: 'AMPERE_16',
		});
		expect(result.id).toBe('ep_1');
	});
});
