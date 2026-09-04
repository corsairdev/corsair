import { request } from 'corsair/http';
import * as organizations from './endpoints/organizations';
import { GriptapeEndpointInputSchemas } from './endpoints/types';
import type { GriptapeContext } from './index';

jest.mock('corsair/http', () => ({
	...jest.requireActual('corsair/http'),
	request: jest.fn(),
}));

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => undefined),
}));

const mockRequest = request as jest.MockedFunction<typeof request>;

describe('griptape organization endpoints', () => {
	const apiKey = 'test-api-key';
	const ctx = { key: apiKey } as unknown as GriptapeContext;

	beforeEach(() => {
		mockRequest.mockReset();
	});

	it('organization.list sends GET /organizations with pagination', async () => {
		const payload = { organizations: [] };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await organizations.list(ctx, { page: 1, page_size: 10 });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'GET', url: 'organizations' }),
		);
		expect(result).toEqual(payload);
	});

	it('organization.get sends GET /organizations/{organization_id}', async () => {
		const payload = { organization_id: 'org-test-001', name: 'test-org' };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await organizations.get(ctx, {
			organization_id: 'org-test-001',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'GET',
				url: 'organizations/org-test-001',
			}),
		);
		expect(result).toEqual(payload);
	});

	it('organization.update sends PATCH /organizations/{organization_id}', async () => {
		const payload = { organization_id: 'org-test-001', name: 'renamed-org' };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await organizations.update(ctx, {
			organization_id: 'org-test-001',
			body: { name: 'renamed-org' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'PATCH',
				url: 'organizations/org-test-001',
			}),
		);
		expect(result).toEqual(payload);
	});

	it('organization.listApiKeys sends GET /organizations/{organization_id}/api-keys', async () => {
		const payload = { api_keys: [] };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await organizations.listApiKeys(ctx, {
			organization_id: 'org-test-001',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'GET',
				url: 'organizations/org-test-001/api-keys',
			}),
		);
		expect(result).toEqual(payload);
	});

	it('organization.createApiKey sends POST /organizations/{organization_id}/api-keys', async () => {
		const payload = { api_key_id: 'key-test-001' };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await organizations.createApiKey(ctx, {
			organization_id: 'org-test-001',
			body: { name: 'ci-key' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'POST',
				url: 'organizations/org-test-001/api-keys',
			}),
		);
		expect(result).toEqual(payload);
	});

	it('validates organizationCreateApiKey input', () => {
		const valid =
			GriptapeEndpointInputSchemas.organizationCreateApiKey.safeParse({
				organization_id: 'org-test-001',
				body: { name: 'ci-key' },
			});

		expect(valid.success).toBe(true);
	});

	it('rejects organizationCreateApiKey input without an organization id', () => {
		const invalid =
			GriptapeEndpointInputSchemas.organizationCreateApiKey.safeParse({
				body: { name: 'ci-key' },
			});

		expect(invalid.success).toBe(false);
	});
});
