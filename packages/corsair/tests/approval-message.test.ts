import {
	APPROVAL_SETUP_HINT,
	buildManualApprovalUrl,
	resolveAsyncApprovalMessage,
	resolveApprovalUrl,
	usesManualApprovalConfig,
} from '../core/permissions/approval-message';

jest.mock('../hub/permission', () => ({
	createHubPermissionSession: jest.fn(async () => ({
		approvalUrl: 'https://hub.example/approve/sess-1',
		token: 'hub-token',
		projectId: 'proj-1',
		expiresAt: '2099-01-01T00:00:00.000Z',
	})),
	formatHubApprovalMessage: (url: string) =>
		`Approval required. Visit ${url} to approve or deny, then tell the agent to retry this action.`,
}));

const baseRecord = {
	id: 'perm-1',
	token: 'tok-abc',
	plugin: 'slack',
	endpoint: 'messages.post',
	args: '{"text":"hi"}',
	tenant_id: 'default',
	expires_at: '2099-01-01T00:00:00.000Z',
};

describe('usesManualApprovalConfig', () => {
	it('is true when approvalBaseUrl or onApprovalRequired is set', () => {
		expect(usesManualApprovalConfig(undefined)).toBe(false);
		expect(usesManualApprovalConfig({})).toBe(false);
		expect(
			usesManualApprovalConfig({ approvalBaseUrl: 'https://app/approve' }),
		).toBe(true);
		expect(
			usesManualApprovalConfig({
				onApprovalRequired: ({ approvalUrl }) => approvalUrl,
			}),
		).toBe(true);
	});
});

describe('buildManualApprovalUrl', () => {
	it('joins base URL and token without duplicate slashes', () => {
		expect(buildManualApprovalUrl('https://app/approve/', 'tok-abc')).toBe(
			'https://app/approve/tok-abc',
		);
	});
});

describe('resolveApprovalUrl', () => {
	it('prefers manual approvalBaseUrl over hub', async () => {
		const url = await resolveApprovalUrl(
			{
				manual: { approvalBaseUrl: 'https://app/approve' },
				hub: {
					apiUrl: 'https://hub',
					projectApiKey: 'key',
					signingSecret: 'secret',
					deliveryUrl: 'https://app/delivery',
				},
			},
			baseRecord,
		);
		expect(url).toBe('https://app/approve/tok-abc');
	});

	it('uses hub when manual approval is not configured', async () => {
		const url = await resolveApprovalUrl(
			{
				hub: {
					apiUrl: 'https://hub',
					projectApiKey: 'key',
					signingSecret: 'secret',
					deliveryUrl: 'https://app/delivery',
				},
			},
			baseRecord,
		);
		expect(url).toBe('https://hub.example/approve/sess-1');
	});
});

describe('resolveAsyncApprovalMessage', () => {
	it('returns setup hint when manual approval is preferred but URL cannot be built', async () => {
		const msg = await resolveAsyncApprovalMessage({
			manual: { onApprovalRequired: ({ approvalUrl }) => approvalUrl },
			permissionId: 'perm-1',
			permissionToken: 'tok-abc',
			plugin: 'slack',
			endpoint: 'messages.post',
			args: { text: 'hi' },
			tenantId: 'default',
			expiresAt: '2099-01-01T00:00:00.000Z',
			operationPath: 'messages.post',
		});
		expect(msg).toBe(APPROVAL_SETUP_HINT);
	});

	it('calls manual.onApprovalRequired with approvalUrl object', async () => {
		const onApprovalRequired = jest.fn(
			({ approvalUrl }: { approvalUrl: string }) => `Go to ${approvalUrl}`,
		);
		const msg = await resolveAsyncApprovalMessage({
			manual: {
				approvalBaseUrl: 'https://app/approve',
				onApprovalRequired,
			},
			permissionId: 'perm-1',
			permissionToken: 'tok-abc',
			plugin: 'slack',
			endpoint: 'messages.post',
			args: { text: 'hi' },
			tenantId: 'default',
			expiresAt: '2099-01-01T00:00:00.000Z',
			operationPath: 'messages.post',
		});
		expect(onApprovalRequired).toHaveBeenCalledWith({
			approvalUrl: 'https://app/approve/tok-abc',
		});
		expect(msg).toBe('Go to https://app/approve/tok-abc');
	});

	it('uses hub message when hub is configured and manual approval is not', async () => {
		const msg = await resolveAsyncApprovalMessage({
			hub: {
				apiUrl: 'https://hub',
				projectApiKey: 'key',
				signingSecret: 'secret',
				deliveryUrl: 'https://app/delivery',
			},
			permissionId: 'perm-1',
			permissionToken: 'tok-abc',
			plugin: 'slack',
			endpoint: 'messages.post',
			args: { text: 'hi' },
			tenantId: 'default',
			expiresAt: '2099-01-01T00:00:00.000Z',
			operationPath: 'messages.post',
		});
		expect(msg).toContain('https://hub.example/approve/sess-1');
	});
});
