import * as client from './client';
import {
	Account,
	Integrations,
	Organizations,
	Projects,
	System,
	Tools,
} from './endpoints';
import type { CodacyContext } from './index';

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return {
		...actual,
		makeCodacyRequest: jest.fn(),
	};
});

describe('Codacy endpoints routing', () => {
	const mockMakeCodacyRequest = client.makeCodacyRequest as jest.MockedFunction<
		typeof client.makeCodacyRequest
	>;

	const ctx = {
		key: 'test_key',
	} as unknown as CodacyContext;

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('account.createApiToken issues POST /account/api-tokens', async () => {
		mockMakeCodacyRequest.mockResolvedValueOnce({ success: true } as any);
		const result = await Account.createApiToken(ctx, {} as any);
		expect(result).toEqual({ success: true });
		expect(mockMakeCodacyRequest).toHaveBeenCalledWith(
			'/account/api-tokens',
			'test_key',
			expect.objectContaining({
				method: 'POST',
			}),
		);
	});

	it('account.deleteApiToken issues DELETE /account/api-tokens/{tokenId}', async () => {
		mockMakeCodacyRequest.mockResolvedValueOnce({ success: true } as any);
		const result = await Account.deleteApiToken(ctx, {
			tokenId: 'test_tokenId',
		} as any);
		expect(result).toEqual({ success: true });
		expect(mockMakeCodacyRequest).toHaveBeenCalledWith(
			'/account/api-tokens/test_tokenId',
			'test_key',
			expect.objectContaining({
				method: 'DELETE',
			}),
		);
	});

	it('account.getAccountDetails issues GET /account', async () => {
		mockMakeCodacyRequest.mockResolvedValueOnce({ success: true } as any);
		const result = await Account.getAccountDetails(ctx, {} as any);
		expect(result).toEqual({ success: true });
		expect(mockMakeCodacyRequest).toHaveBeenCalledWith(
			'/account',
			'test_key',
			expect.objectContaining({
				method: 'GET',
			}),
		);
	});

	it('system.getConfigurationStatus issues GET /configuration/status', async () => {
		mockMakeCodacyRequest.mockResolvedValueOnce({ success: true } as any);
		const result = await System.getConfigurationStatus(ctx, {} as any);
		expect(result).toEqual({ success: true });
		expect(mockMakeCodacyRequest).toHaveBeenCalledWith(
			'/configuration/status',
			'test_key',
			expect.objectContaining({
				method: 'GET',
			}),
		);
	});

	it('system.getHealth issues GET /health', async () => {
		mockMakeCodacyRequest.mockResolvedValueOnce({ success: true } as any);
		const result = await System.getHealth(ctx, {} as any);
		expect(result).toEqual({ success: true });
		expect(mockMakeCodacyRequest).toHaveBeenCalledWith(
			'/health',
			'test_key',
			expect.objectContaining({
				method: 'GET',
			}),
		);
	});

	it('organizations.getOrganizationsRepositoriesSettingsLanguages issues GET /organizations/{provider}/{organizationName}/repositories/{repositoryName}/settings/languages', async () => {
		mockMakeCodacyRequest.mockResolvedValueOnce({ success: true } as any);
		const result =
			await Organizations.getOrganizationsRepositoriesSettingsLanguages(ctx, {
				provider: 'test_provider',
				organizationName: 'test_organizationName',
				repositoryName: 'test_repositoryName',
			} as any);
		expect(result).toEqual({ success: true });
		expect(mockMakeCodacyRequest).toHaveBeenCalledWith(
			'/organizations/test_provider/test_organizationName/repositories/test_repositoryName/settings/languages',
			'test_key',
			expect.objectContaining({
				method: 'GET',
			}),
		);
	});

	it('tools.getToolPattern issues GET /tools/{toolUuid}/patterns/{patternId}', async () => {
		mockMakeCodacyRequest.mockResolvedValueOnce({ success: true } as any);
		const result = await Tools.getToolPattern(ctx, {
			toolUuid: 'test_toolUuid',
			patternId: 'test_patternId',
		} as any);
		expect(result).toEqual({ success: true });
		expect(mockMakeCodacyRequest).toHaveBeenCalledWith(
			'/tools/test_toolUuid/patterns/test_patternId',
			'test_key',
			expect.objectContaining({
				method: 'GET',
			}),
		);
	});

	it('organizations.getUserOrganizations issues GET /user/organizations/{provider}', async () => {
		mockMakeCodacyRequest.mockResolvedValueOnce({ success: true } as any);
		const result = await Organizations.getUserOrganizations(ctx, {
			provider: 'test_provider',
		} as any);
		expect(result).toEqual({ success: true });
		expect(mockMakeCodacyRequest).toHaveBeenCalledWith(
			'/user/organizations/test_provider',
			'test_key',
			expect.objectContaining({
				method: 'GET',
			}),
		);
	});

	it('system.getVersion issues GET /version', async () => {
		mockMakeCodacyRequest.mockResolvedValueOnce({ success: true } as any);
		const result = await System.getVersion(ctx, {} as any);
		expect(result).toEqual({ success: true });
		expect(mockMakeCodacyRequest).toHaveBeenCalledWith(
			'/version',
			'test_key',
			expect.objectContaining({
				method: 'GET',
			}),
		);
	});

	it('organizations.listAnalysisOrganizationsRepositories issues GET /organizations/{provider}/{organizationName}/repositories', async () => {
		mockMakeCodacyRequest.mockResolvedValueOnce({ success: true } as any);
		const result = await Organizations.listAnalysisOrganizationsRepositories(
			ctx,
			{
				provider: 'test_provider',
				organizationName: 'test_organizationName',
			} as any,
		);
		expect(result).toEqual({ success: true });
		expect(mockMakeCodacyRequest).toHaveBeenCalledWith(
			'/organizations/test_provider/test_organizationName/repositories',
			'test_key',
			expect.objectContaining({
				method: 'GET',
			}),
		);
	});

	it('tools.listDuplicationTools issues GET /tools/duplication', async () => {
		mockMakeCodacyRequest.mockResolvedValueOnce({ success: true } as any);
		const result = await Tools.listDuplicationTools(ctx, {} as any);
		expect(result).toEqual({ success: true });
		expect(mockMakeCodacyRequest).toHaveBeenCalledWith(
			'/tools/duplication',
			'test_key',
			expect.objectContaining({
				method: 'GET',
			}),
		);
	});

	it('tools.listLanguagesAndTools issues GET /tools/languages', async () => {
		mockMakeCodacyRequest.mockResolvedValueOnce({ success: true } as any);
		const result = await Tools.listLanguagesAndTools(ctx, {} as any);
		expect(result).toEqual({ success: true });
		expect(mockMakeCodacyRequest).toHaveBeenCalledWith(
			'/tools/languages',
			'test_key',
			expect.objectContaining({
				method: 'GET',
			}),
		);
	});

	it('integrations.listLoginIntegrations issues GET /integrations/login', async () => {
		mockMakeCodacyRequest.mockResolvedValueOnce({ success: true } as any);
		const result = await Integrations.listLoginIntegrations(ctx, {} as any);
		expect(result).toEqual({ success: true });
		expect(mockMakeCodacyRequest).toHaveBeenCalledWith(
			'/integrations/login',
			'test_key',
			expect.objectContaining({
				method: 'GET',
			}),
		);
	});

	it('tools.listMetricsTools issues GET /tools/metrics', async () => {
		mockMakeCodacyRequest.mockResolvedValueOnce({ success: true } as any);
		const result = await Tools.listMetricsTools(ctx, {} as any);
		expect(result).toEqual({ success: true });
		expect(mockMakeCodacyRequest).toHaveBeenCalledWith(
			'/tools/metrics',
			'test_key',
			expect.objectContaining({
				method: 'GET',
			}),
		);
	});

	it('projects.listProjects issues GET /projects', async () => {
		mockMakeCodacyRequest.mockResolvedValueOnce({ success: true } as any);
		const result = await Projects.listProjects(ctx, {} as any);
		expect(result).toEqual({ success: true });
		expect(mockMakeCodacyRequest).toHaveBeenCalledWith(
			'/projects',
			'test_key',
			expect.objectContaining({
				method: 'GET',
			}),
		);
	});

	it('integrations.listProviderIntegrations issues GET /integrations/provider', async () => {
		mockMakeCodacyRequest.mockResolvedValueOnce({ success: true } as any);
		const result = await Integrations.listProviderIntegrations(ctx, {} as any);
		expect(result).toEqual({ success: true });
		expect(mockMakeCodacyRequest).toHaveBeenCalledWith(
			'/integrations/provider',
			'test_key',
			expect.objectContaining({
				method: 'GET',
			}),
		);
	});

	it('tools.listTools issues GET /tools', async () => {
		mockMakeCodacyRequest.mockResolvedValueOnce({ success: true } as any);
		const result = await Tools.listTools(ctx, {} as any);
		expect(result).toEqual({ success: true });
		expect(mockMakeCodacyRequest).toHaveBeenCalledWith(
			'/tools',
			'test_key',
			expect.objectContaining({
				method: 'GET',
			}),
		);
	});

	it('tools.listToolsPatterns issues GET /tools/{toolUuid}/patterns', async () => {
		mockMakeCodacyRequest.mockResolvedValueOnce({ success: true } as any);
		const result = await Tools.listToolsPatterns(ctx, {
			toolUuid: 'test_toolUuid',
		} as any);
		expect(result).toEqual({ success: true });
		expect(mockMakeCodacyRequest).toHaveBeenCalledWith(
			'/tools/test_toolUuid/patterns',
			'test_key',
			expect.objectContaining({
				method: 'GET',
			}),
		);
	});
});
