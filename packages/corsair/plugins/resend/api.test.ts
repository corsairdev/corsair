import dotenv from 'dotenv';
import { makeResendRequest } from './client';
import type {
	SendEmailResponse,
	GetEmailResponse,
	ListEmailsResponse,
	CreateDomainResponse,
	GetDomainResponse,
	ListDomainsResponse,
	DeleteDomainResponse,
	VerifyDomainResponse,
} from './endpoints/types';
import { ResendEndpointOutputSchemas } from './endpoints/types';

dotenv.config();

const TEST_API_KEY = process.env.RESEND_API_KEY!;
const TEST_FROM_EMAIL =
	process.env.TEST_RESEND_FROM_EMAIL || 'onboarding@resend.dev';
const TEST_TO_EMAIL =
	process.env.TEST_RESEND_TO_EMAIL || 'delivered@resend.dev';

describe('Resend API Type Tests', () => {
	describe('emails', () => {
		it('emailsList returns correct type', async () => {
			const response = await makeResendRequest<ListEmailsResponse>(
				'emails',
				TEST_API_KEY,
				{ query: { limit: 10 } },
			);
			const result = response;

			ResendEndpointOutputSchemas.emailsList.parse(result);
		});

		it('emailsSend returns correct type', async () => {
			const response = await makeResendRequest<SendEmailResponse>(
				'emails',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						from: TEST_FROM_EMAIL,
						to: TEST_TO_EMAIL,
						subject: `Test email from API test - ${Date.now()}`,
						html: '<p>This is a test email created by the API test suite</p>',
					},
				},
			);
			const result = response;

			ResendEndpointOutputSchemas.emailsSend.parse(result);
		});

		it('emailsGet returns correct type', async () => {
			const emailsListResponse = await makeResendRequest<ListEmailsResponse>(
				'emails',
				TEST_API_KEY,
				{ query: { limit: 1 } },
			);
			const emailId = emailsListResponse.data[0]?.id;
			if (!emailId) {
				throw new Error('No emails found');
			}

			const response = await makeResendRequest<GetEmailResponse>(
				`emails/${emailId}`,
				TEST_API_KEY,
			);
			const result = response;

			ResendEndpointOutputSchemas.emailsGet.parse(result);
		});
	});

	describe('domains', () => {
		it('domainsList returns correct type', async () => {
			const response = await makeResendRequest<ListDomainsResponse>(
				'domains',
				TEST_API_KEY,
				{ query: { limit: 10 } },
			);
			const result = response;

			ResendEndpointOutputSchemas.domainsList.parse(result);
		});

		it('domainsGet returns correct type', async () => {
			const domainsListResponse =
				await makeResendRequest<ListDomainsResponse>('domains', TEST_API_KEY, {
					query: { limit: 1 },
				});
			const domainId = domainsListResponse.data[0]?.id;
			if (!domainId) {
				return;
			}

			const response = await makeResendRequest<GetDomainResponse>(
				`domains/${domainId}`,
				TEST_API_KEY,
			);
			const result = response;

			ResendEndpointOutputSchemas.domainsGet.parse(result);
		});

		it('domainsCreate returns correct type', async () => {
			const domainName = `test-domain-${Date.now()}.example.com`;
			const response = await makeResendRequest<CreateDomainResponse>(
				'domains',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						name: domainName,
					},
				},
			);
			const result = response;

			ResendEndpointOutputSchemas.domainsCreate.parse(result);
		});

		it('domainsVerify returns correct type', async () => {
			const domainsListResponse =
				await makeResendRequest<ListDomainsResponse>('domains', TEST_API_KEY, {
					query: { limit: 1 },
				});
			const domainId = domainsListResponse.data[0]?.id;
			if (!domainId) {
				return;
			}

			const response = await makeResendRequest<VerifyDomainResponse>(
				`domains/${domainId}/verify`,
				TEST_API_KEY,
				{
					method: 'POST',
				},
			);
			const result = response;

			ResendEndpointOutputSchemas.domainsVerify.parse(result);
		});

		it('domainsDelete returns correct type', async () => {
			const domainsListResponse =
				await makeResendRequest<ListDomainsResponse>('domains', TEST_API_KEY, {
					query: { limit: 10 },
				});
			const testDomain = domainsListResponse.data.find(
				(domain) => domain.name.startsWith('test-domain-'),
			);
			const domainId = testDomain?.id;
			if (!domainId) {
				throw new Error('No test domain found for deletion');
			}

			const response = await makeResendRequest<DeleteDomainResponse>(
				`domains/${domainId}`,
				TEST_API_KEY,
				{
					method: 'DELETE',
				},
			);
			const result = response;

			ResendEndpointOutputSchemas.domainsDelete.parse(result);
		});
	});
});
