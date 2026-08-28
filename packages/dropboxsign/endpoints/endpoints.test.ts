import * as client from '../client';
import {
	Account,
	ApiApps,
	BulkSend,
	Drafts,
	Embedded,
	FaxAndReports,
	SignatureRequests,
	Teams,
	Templates,
} from './index';

jest.mock('corsair/core', () => {
	const actual =
		jest.requireActual<typeof import('corsair/core')>('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn().mockResolvedValue(null),
	};
});

jest.mock('../client', () => ({
	makeDropboxSignRequest: jest.fn(),
}));

const mockedRequest = client.makeDropboxSignRequest as jest.MockedFunction<typeof client.makeDropboxSignRequest>;

const ctx = {
	key: 'test_api_key',
	authType: 'api_key',
	db: {},
} as any;

describe('Dropbox Sign Endpoints', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockedRequest.mockResolvedValue({} as never);
	});

	describe('Account', () => {
		it('gets account info', async () => {
			await Account.getAccount(ctx, { email_address: 'test@example.com' });
			expect(mockedRequest).toHaveBeenCalledWith('account', ctx.key, {
				method: 'GET',
				query: { email_address: 'test@example.com' },
			});
		});

		it('creates an account', async () => {
			await Account.createAccount(ctx, { email_address: 'new@example.com' });
			expect(mockedRequest).toHaveBeenCalledWith('account/create', ctx.key, {
				method: 'POST',
				body: { email_address: 'new@example.com' },
			});
		});

		it('verifies an account', async () => {
			await Account.verifyAccount(ctx, { email_address: 'verify@example.com' });
			expect(mockedRequest).toHaveBeenCalledWith('account/verify', ctx.key, {
				method: 'POST',
				body: { email_address: 'verify@example.com' },
			});
		});
	});

	describe('Signature Requests', () => {
		it('gets signature request by ID', async () => {
			await SignatureRequests.getSignatureRequest(ctx, {
				signature_request_id: 'sig_123',
			});
			expect(mockedRequest).toHaveBeenCalledWith(
				'signature_request/sig_123',
				ctx.key,
				{
					method: 'GET',
				},
			);
		});

		it('sends a signature request', async () => {
			const body = { title: 'Agreement', test_mode: true };
			await SignatureRequests.sendSignatureRequest(ctx, body);
			expect(mockedRequest).toHaveBeenCalledWith(
				'signature_request/send',
				ctx.key,
				{
					method: 'POST',
					body,
				},
			);
		});

		it('cancels a signature request', async () => {
			await SignatureRequests.cancelSignatureRequest(ctx, {
				signature_request_id: 'sig_123',
			});
			expect(mockedRequest).toHaveBeenCalledWith(
				'signature_request/cancel/sig_123',
				ctx.key,
				{
					method: 'POST',
				},
			);
		});
	});

	describe('Templates', () => {
		it('gets template by ID', async () => {
			await Templates.getTemplate(ctx, { template_id: 'tmpl_123' });
			expect(mockedRequest).toHaveBeenCalledWith('template/tmpl_123', ctx.key, {
				method: 'GET',
			});
		});

		it('creates a template', async () => {
			await Templates.createTemplate(ctx, { title: 'New Template' });
			expect(mockedRequest).toHaveBeenCalledWith('template/create', ctx.key, {
				method: 'POST',
				body: { title: 'New Template' },
			});
		});

		it('deletes a template', async () => {
			await Templates.deleteTemplate(ctx, { template_id: 'tmpl_123' });
			expect(mockedRequest).toHaveBeenCalledWith(
				'template/delete/tmpl_123',
				ctx.key,
				{
					method: 'POST',
				},
			);
		});
	});

	describe('Embedded & Drafts', () => {
		it('gets embedded sign URL', async () => {
			await Embedded.getEmbeddedSignUrl(ctx, { signature_id: 'sign_123' });
			expect(mockedRequest).toHaveBeenCalledWith(
				'embedded/sign_url/sign_123',
				ctx.key,
				{
					method: 'GET',
				},
			);
		});

		it('creates unclaimed draft', async () => {
			await Drafts.createUnclaimedDraft(ctx, { type: 'request_signature' });
			expect(mockedRequest).toHaveBeenCalledWith(
				'unclaimed_draft/create',
				ctx.key,
				{
					method: 'POST',
					body: { type: 'request_signature' },
				},
			);
		});
	});

	describe('Bulk Send & Teams & Apps', () => {
		it('bulk sends with template', async () => {
			await BulkSend.bulkSendWithTemplate(ctx, { template_ids: ['tmpl_1'] });
			expect(mockedRequest).toHaveBeenCalledWith(
				'signature_request/bulk_send_with_template',
				ctx.key,
				{
					method: 'POST',
					body: { template_ids: ['tmpl_1'] },
				},
			);
		});

		it('gets bulk send job', async () => {
			await BulkSend.getBulkSendJob(ctx, { bulk_send_job_id: 'job_123' });
			expect(mockedRequest).toHaveBeenCalledWith(
				'bulk_send_job/job_123',
				ctx.key,
				{
					method: 'GET',
				},
			);
		});

		it('gets team info', async () => {
			await Teams.getTeamInfo(ctx, {});
			expect(mockedRequest).toHaveBeenCalledWith('team/info', ctx.key, {
				method: 'GET',
				query: {},
			});
		});

		it('gets current team', async () => {
			await Teams.getCurrentTeam(ctx, {});
			expect(mockedRequest).toHaveBeenCalledWith('team', ctx.key, {
				method: 'GET',
			});
		});

		it('authorizes OAuth app', async () => {
			const res = await ApiApps.oAuthAuthorize(ctx, {
				client_id: 'app_123',
				response_type: 'code',
			});
			expect(res.url).toContain(
				'app.hellosign.com/oauth/authorize?client_id=app_123',
			);
		});

		it('deletes fax', async () => {
			await FaxAndReports.deleteFax(ctx, { fax_id: 'fax_123' });
			expect(mockedRequest).toHaveBeenCalledWith('fax/fax_123', ctx.key, {
				method: 'DELETE',
			});
		});
	});
});
