import { request } from 'corsair/http';
import {
	FILEVINE_API_BASE_US,
	makeFilevineIdentityRequest,
	makeFilevineRequest,
} from './client';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return { ...original, request: jest.fn() };
});

const mockRequest = request as jest.Mock;

describe('Filevine client', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockRequest.mockResolvedValue({ projectId: 123 });
	});

	it('sets Authorization Bearer header', async () => {
		await makeFilevineRequest('/fv-app/v2/Projects', 'test-bearer-token', {
			method: 'GET',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: FILEVINE_API_BASE_US,
				HEADERS: expect.objectContaining({
					Authorization: 'Bearer test-bearer-token',
				}),
			}),
			expect.objectContaining({ url: '/fv-app/v2/Projects', method: 'GET' }),
			expect.anything(),
		);
	});

	it('passes pagination query params on list', async () => {
		await makeFilevineRequest('/fv-app/v2/Projects', 'tok', {
			method: 'GET',
			query: { offset: 0, limit: 50, projectTypeId: 5 },
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				query: { offset: 0, limit: 50, projectTypeId: 5 },
			}),
			expect.anything(),
		);
	});

	it('uses FormData for document upload', async () => {
		const blob = new Blob(['hello']);
		const fd = { file: blob, filename: 'hello.txt' };
		mockRequest.mockResolvedValue({ documentId: 999, filename: 'hello.txt' });
		await makeFilevineRequest('/fv-app/v2/Documents', 'tok', {
			method: 'POST',
			formData: fd,
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				formData: fd,
				mediaType: 'multipart/form-data',
			}),
			expect.anything(),
		);
	});

	it('supports x-fv-orgid and x-fv-userid headers', async () => {
		await makeFilevineRequest('/fv-app/v2/Projects', 'tok', {
			method: 'GET',
			orgId: 123,
			userId: 456,
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				HEADERS: expect.objectContaining({
					'x-fv-orgid': '123',
					'x-fv-userid': '456',
				}),
			}),
			expect.anything(),
			expect.anything(),
		);
	});

	it('throws FilevineAPIError on ApiError', async () => {
		mockRequest.mockRejectedValue(new Error('rate_limited'));
		await expect(
			makeFilevineRequest('/fv-app/v2/Projects', 'tok'),
		).rejects.toThrow(/rate_limited/i);
	});

	it('identity request posts form-urlencoded', async () => {
		mockRequest.mockResolvedValue({
			access_token: 'abc',
			token_type: 'Bearer',
			expires_in: 1200,
			scope:
				'fv.api.gateway.access tenant filevine.v2.api.* openid email fv.auth.tenant.read',
		});
		await makeFilevineIdentityRequest('/connect/token', {
			grant_type: 'personal_access_token',
			token: 'pat-123',
			scope:
				'fv.api.gateway.access tenant filevine.v2.api.* openid email fv.auth.tenant.read',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://identity.filevine.io' }),
			expect.objectContaining({ method: 'POST', url: '/connect/token' }),
			expect.anything(),
		);
	});

	it('uses correct base URLs per docs', () => {
		expect(FILEVINE_API_BASE_US).toBe('https://api.filevineapp.com');
		expect(mockRequest).toHaveBeenCalledTimes(0);
	});
});
