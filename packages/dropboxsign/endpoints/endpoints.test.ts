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

const mockedRequest = client.makeDropboxSignRequest as jest.MockedFunction<
	typeof client.makeDropboxSignRequest
>;

const ctx = {
	key: 'test_api_key',
	authType: 'api_key',
	db: {},
} as never;

type Case = {
	name: string;
	run: () => Promise<unknown>;
	path: string;
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	body?: Record<string, unknown>;
	query?: Record<string, unknown>;
};

const cases: Case[] = [
	{
		name: 'account.get',
		run: () => Account.getAccount(ctx, { email_address: 'test@example.com' }),
		path: 'account',
		method: 'GET',
		query: { email_address: 'test@example.com' },
	},
	{
		name: 'account.create',
		run: () => Account.createAccount(ctx, { email_address: 'new@example.com' }),
		path: 'account/create',
		method: 'POST',
		body: { email_address: 'new@example.com' },
	},
	{
		name: 'account.update',
		run: () => Account.updateAccount(ctx, { locale: 'en-US' }),
		path: 'account',
		method: 'POST',
		body: { locale: 'en-US' },
	},
	{
		name: 'account.verify',
		run: () =>
			Account.verifyAccount(ctx, { email_address: 'verify@example.com' }),
		path: 'account/verify',
		method: 'POST',
		body: { email_address: 'verify@example.com' },
	},
	{
		name: 'signatureRequests.get',
		run: () =>
			SignatureRequests.getSignatureRequest(ctx, {
				signature_request_id: 'sig_123',
			}),
		path: 'signature_request/sig_123',
		method: 'GET',
	},
	{
		name: 'signatureRequests.list',
		run: () =>
			SignatureRequests.listSignatureRequests(ctx, { page: 1, page_size: 20 }),
		path: 'signature_request/list',
		method: 'GET',
		query: { page: 1, page_size: 20 },
	},
	{
		name: 'signatureRequests.send',
		run: () =>
			SignatureRequests.sendSignatureRequest(ctx, {
				title: 'Agreement',
				test_mode: true,
			}),
		path: 'signature_request/send',
		method: 'POST',
		body: { title: 'Agreement', test_mode: true },
	},
	{
		name: 'signatureRequests.createEmbedded',
		run: () =>
			SignatureRequests.createEmbeddedSignatureRequest(ctx, {
				client_id: 'app_1',
			}),
		path: 'signature_request/create_embedded',
		method: 'POST',
		body: { client_id: 'app_1' },
	},
	{
		name: 'signatureRequests.createEmbeddedWithTemplate',
		run: () =>
			SignatureRequests.createEmbeddedSignatureRequestWithTemplate(ctx, {
				client_id: 'app_1',
				template_ids: ['tmpl_1'],
			}),
		path: 'signature_request/create_embedded_with_template',
		method: 'POST',
		body: { client_id: 'app_1', template_ids: ['tmpl_1'] },
	},
	{
		name: 'signatureRequests.cancel',
		run: () =>
			SignatureRequests.cancelSignatureRequest(ctx, {
				signature_request_id: 'sig_123',
			}),
		path: 'signature_request/cancel/sig_123',
		method: 'POST',
	},
	{
		name: 'signatureRequests.remind',
		run: () =>
			SignatureRequests.sendRequestReminder(ctx, {
				signature_request_id: 'sig_123',
				email_address: 'a@b.com',
			}),
		path: 'signature_request/remind/sig_123',
		method: 'POST',
		body: { email_address: 'a@b.com' },
	},
	{
		name: 'signatureRequests.update',
		run: () =>
			SignatureRequests.updateSignatureRequest(ctx, {
				signature_request_id: 'sig_123',
				name: 'Ada',
			}),
		path: 'signature_request/update/sig_123',
		method: 'POST',
		body: { name: 'Ada' },
	},
	{
		name: 'signatureRequests.downloadFiles',
		run: () =>
			SignatureRequests.downloadSignatureRequestFiles(ctx, {
				signature_request_id: 'sig_123',
				file_type: 'pdf',
			}),
		path: 'signature_request/files/sig_123',
		method: 'GET',
		query: { file_type: 'pdf' },
	},
	{
		name: 'signatureRequests.getFilesAsFileUrl',
		run: () =>
			SignatureRequests.getSignatureRequestFilesAsFileUrl(ctx, {
				signature_request_id: 'sig_123',
			}),
		path: 'signature_request/files_as_file_url/sig_123',
		method: 'GET',
	},
	{
		name: 'signatureRequests.getFilesAsDataUri',
		run: () =>
			SignatureRequests.getSignatureRequestFilesAsDataUri(ctx, {
				signature_request_id: 'sig_123',
			}),
		path: 'signature_request/files_as_data_uri/sig_123',
		method: 'GET',
	},
	{
		name: 'signatureRequests.releaseHold',
		run: () =>
			SignatureRequests.releaseSignatureRequestHold(ctx, {
				signature_request_id: 'sig_123',
			}),
		path: 'signature_request/release_hold/sig_123',
		method: 'POST',
	},
	{
		name: 'signatureRequests.editAndResend',
		run: () =>
			SignatureRequests.editAndResendSignatureRequest(ctx, {
				signature_request_id: 'sig_123',
				title: 'Edited',
			}),
		path: 'signature_request/edit/sig_123',
		method: 'PUT',
		body: { title: 'Edited' },
	},
	{
		name: 'signatureRequests.editAndResendEmbedded',
		run: () =>
			SignatureRequests.editAndResendEmbeddedSignatureRequest(ctx, {
				signature_request_id: 'sig_123',
				client_id: 'app_1',
			}),
		path: 'signature_request/edit_embedded/sig_123',
		method: 'PUT',
		body: { client_id: 'app_1' },
	},
	{
		name: 'signatureRequests.editAndResendEmbeddedTemplate',
		run: () =>
			SignatureRequests.editAndResendEmbeddedSignatureRequestTemplate(ctx, {
				signature_request_id: 'sig_123',
				client_id: 'app_1',
			}),
		path: 'signature_request/edit_embedded_with_template/sig_123',
		method: 'PUT',
		body: { client_id: 'app_1' },
	},
	{
		name: 'templates.get',
		run: () => Templates.getTemplate(ctx, { template_id: 'tmpl_123' }),
		path: 'template/tmpl_123',
		method: 'GET',
	},
	{
		name: 'templates.list',
		run: () => Templates.listTemplates(ctx, { page: 1 }),
		path: 'template/list',
		method: 'GET',
		query: { page: 1 },
	},
	{
		name: 'templates.create',
		run: () => Templates.createTemplate(ctx, { title: 'New Template' }),
		path: 'template/create',
		method: 'POST',
		body: { title: 'New Template' },
	},
	{
		name: 'templates.createEmbeddedDraft',
		run: () =>
			Templates.createEmbeddedTemplateDraft(ctx, { client_id: 'app_1' }),
		path: 'template/create_embedded_draft',
		method: 'POST',
		body: { client_id: 'app_1' },
	},
	{
		name: 'templates.delete',
		run: () => Templates.deleteTemplate(ctx, { template_id: 'tmpl_123' }),
		path: 'template/delete/tmpl_123',
		method: 'POST',
	},
	{
		name: 'templates.addUser',
		run: () =>
			Templates.addUserToTemplate(ctx, {
				template_id: 'tmpl_123',
				email_address: 'a@b.com',
			}),
		path: 'template/add_user/tmpl_123',
		method: 'POST',
		body: { email_address: 'a@b.com' },
	},
	{
		name: 'templates.removeUser',
		run: () =>
			Templates.removeUserFromTemplate(ctx, {
				template_id: 'tmpl_123',
				email_address: 'a@b.com',
			}),
		path: 'template/remove_user/tmpl_123',
		method: 'POST',
		body: { email_address: 'a@b.com' },
	},
	{
		name: 'templates.getFiles',
		run: () =>
			Templates.getTemplateFiles(ctx, {
				template_id: 'tmpl_123',
				file_type: 'pdf',
			}),
		path: 'template/files/tmpl_123',
		method: 'GET',
		query: { file_type: 'pdf' },
	},
	{
		name: 'templates.getFilesAsFileUrl',
		run: () =>
			Templates.getTemplateFilesAsFileUrl(ctx, { template_id: 'tmpl_123' }),
		path: 'template/files_as_file_url/tmpl_123',
		method: 'GET',
	},
	{
		name: 'templates.getFilesAsDataUri',
		run: () =>
			Templates.getTemplateFilesAsDataUri(ctx, { template_id: 'tmpl_123' }),
		path: 'template/files_as_data_uri/tmpl_123',
		method: 'GET',
	},
	{
		name: 'templates.updateFiles',
		run: () =>
			Templates.updateTemplateFiles(ctx, {
				template_id: 'tmpl_123',
				file_urls: ['https://example.com/a.pdf'],
			}),
		path: 'template/update_files/tmpl_123',
		method: 'POST',
		body: { file_urls: ['https://example.com/a.pdf'] },
	},
	{
		name: 'drafts.createUnclaimed',
		run: () => Drafts.createUnclaimedDraft(ctx, { type: 'request_signature' }),
		path: 'unclaimed_draft/create',
		method: 'POST',
		body: { type: 'request_signature' },
	},
	{
		name: 'drafts.createEmbeddedUnclaimedWithTemplate',
		run: () =>
			Drafts.createEmbeddedUnclaimedDraftWithTemplate(ctx, {
				client_id: 'app_1',
				template_ids: ['tmpl_1'],
			}),
		path: 'unclaimed_draft/create_embedded_with_template',
		method: 'POST',
		body: { client_id: 'app_1', template_ids: ['tmpl_1'] },
	},
	{
		name: 'drafts.editAndResendUnclaimed',
		run: () =>
			Drafts.editAndResendUnclaimedDraft(ctx, {
				signature_request_id: 'sig_123',
				client_id: 'app_1',
			}),
		path: 'unclaimed_draft/edit_and_resend/sig_123',
		method: 'POST',
		body: { client_id: 'app_1' },
	},
	{
		name: 'embedded.getSignUrl',
		run: () => Embedded.getEmbeddedSignUrl(ctx, { signature_id: 'sign_123' }),
		path: 'embedded/sign_url/sign_123',
		method: 'GET',
	},
	{
		name: 'embedded.getTemplateEditUrl',
		run: () =>
			Embedded.getEmbeddedTemplateEditUrl(ctx, {
				template_id: 'tmpl_123',
				force_signer_roles: true,
			}),
		path: 'embedded/edit_url/tmpl_123',
		method: 'POST',
		body: { force_signer_roles: true },
	},
	{
		name: 'bulkSend.sendWithTemplate',
		run: () => BulkSend.bulkSendWithTemplate(ctx, { template_ids: ['tmpl_1'] }),
		path: 'signature_request/bulk_send_with_template',
		method: 'POST',
		body: { template_ids: ['tmpl_1'] },
	},
	{
		name: 'bulkSend.createEmbeddedWithTemplate',
		run: () =>
			BulkSend.bulkCreateEmbeddedSigReqWithTemplate(ctx, {
				client_id: 'app_1',
				template_ids: ['tmpl_1'],
			}),
		path: 'signature_request/bulk_create_embedded_with_template',
		method: 'POST',
		body: { client_id: 'app_1', template_ids: ['tmpl_1'] },
	},
	{
		name: 'bulkSend.getJob',
		run: () => BulkSend.getBulkSendJob(ctx, { bulk_send_job_id: 'job_123' }),
		path: 'bulk_send_job/job_123',
		method: 'GET',
	},
	{
		name: 'bulkSend.listJobs',
		run: () => BulkSend.listBulkSendJobs(ctx, { page: 1 }),
		path: 'bulk_send_job/list',
		method: 'GET',
		query: { page: 1 },
	},
	{
		name: 'teams.getInfo',
		run: () => Teams.getTeamInfo(ctx, {}),
		path: 'team/info',
		method: 'GET',
		query: {},
	},
	{
		name: 'teams.getCurrent',
		run: () => Teams.getCurrentTeam(ctx, {}),
		path: 'team',
		method: 'GET',
	},
	{
		name: 'teams.list',
		run: () => Teams.listTeams(ctx, {}),
		path: 'team',
		method: 'GET',
		query: {},
	},
	{
		name: 'teams.listSubTeams',
		run: () => Teams.listSubTeams(ctx, { team_id: 'team_1' }),
		path: 'team/sub_teams/team_1',
		method: 'GET',
		query: {},
	},
	{
		name: 'teams.listMembers',
		run: () => Teams.listTeamMembers(ctx, { team_id: 'team_1' }),
		path: 'team/members/team_1',
		method: 'GET',
		query: {},
	},
	{
		name: 'teams.addMember',
		run: () => Teams.addUserToTeam(ctx, { email_address: 'a@b.com' }),
		path: 'team/add_member',
		method: 'POST',
		body: { email_address: 'a@b.com' },
	},
	{
		name: 'apiApps.get',
		run: () => ApiApps.getApiApp(ctx, { client_id: 'app_123' }),
		path: 'api_app/app_123',
		method: 'GET',
	},
	{
		name: 'apiApps.list',
		run: () => ApiApps.listApiApps(ctx, { page: 1 }),
		path: 'api_app/list',
		method: 'GET',
		query: { page: 1 },
	},
	{
		name: 'apiApps.create',
		run: () => ApiApps.createApiApp(ctx, { name: 'Corsair' }),
		path: 'api_app',
		method: 'POST',
		body: { name: 'Corsair' },
	},
	{
		name: 'apiApps.update',
		run: () => ApiApps.updateApiApp(ctx, { client_id: 'app_123', name: 'N' }),
		path: 'api_app/app_123',
		method: 'PUT',
		body: { name: 'N' },
	},
	{
		name: 'apiApps.delete',
		run: () => ApiApps.deleteApiApp(ctx, { client_id: 'app_123' }),
		path: 'api_app/app_123',
		method: 'DELETE',
	},
	{
		name: 'faxAndReports.listFaxes',
		run: () => FaxAndReports.listFaxes(ctx, { page: 1 }),
		path: 'fax/list',
		method: 'GET',
		query: { page: 1 },
	},
	{
		name: 'faxAndReports.deleteFax',
		run: () => FaxAndReports.deleteFax(ctx, { fax_id: 'fax_123' }),
		path: 'fax/fax_123',
		method: 'DELETE',
	},
	{
		name: 'faxAndReports.listFaxLines',
		run: () => FaxAndReports.listFaxLines(ctx, { page: 1 }),
		path: 'fax_line/list',
		method: 'GET',
		query: { page: 1 },
	},
	{
		name: 'faxAndReports.getAreaCodes',
		run: () => FaxAndReports.getFaxLineAreaCodes(ctx, { country: 'US' }),
		path: 'fax_line/area_codes',
		method: 'GET',
		query: { country: 'US' },
	},
	{
		name: 'faxAndReports.createReport',
		run: () =>
			FaxAndReports.createReport(ctx, {
				report_type: ['user_activity'],
				start_date: '01/01/2026',
				end_date: '01/31/2026',
			}),
		path: 'report/create',
		method: 'POST',
		body: {
			report_type: ['user_activity'],
			start_date: '01/01/2026',
			end_date: '01/31/2026',
		},
	},
];

describe('Dropbox Sign Endpoints', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockedRequest.mockResolvedValue({} as never);
	});

	it('covers all 55 HTTP operations', () => {
		expect(cases).toHaveLength(55);
	});

	it.each(cases)('$name hits the official path', async (row) => {
		await row.run();
		expect(mockedRequest).toHaveBeenCalledWith(
			row.path,
			ctx,
			expect.objectContaining({
				method: row.method,
				...(row.body ? { body: row.body } : {}),
				...(row.query ? { query: row.query } : {}),
			}),
		);
	});

	it('apiApps.authorize builds the official OAuth URL', async () => {
		const res = await ApiApps.oAuthAuthorize(ctx, {
			client_id: 'app_123',
			response_type: 'code',
		});
		expect(res.url).toContain(
			'app.hellosign.com/oauth/authorize?client_id=app_123',
		);
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});
