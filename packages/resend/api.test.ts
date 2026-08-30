import 'dotenv/config';
import { makeResendRequest } from './client';
import type {
	ContactsCreateResponse,
	ContactsDeleteResponse,
	ContactsGetResponse,
	ContactsListResponse,
	ContactsUpdateResponse,
	CreateDomainResponse,
	DeleteDomainResponse,
	EmailsBatchResponse,
	EmailsCancelResponse,
	GetDomainResponse,
	GetEmailResponse,
	ListDomainsResponse,
	ListEmailsResponse,
	SendEmailResponse,
	VerifyDomainResponse,
} from './endpoints/types';
import { ResendEndpointOutputSchemas } from './endpoints/types';

const TEST_API_KEY = process.env.RESEND_API_KEY;
const TEST_FROM_EMAIL =
	process.env.TEST_RESEND_FROM_EMAIL || 'onboarding@resend.dev';
const TEST_TO_EMAIL =
	process.env.TEST_RESEND_TO_EMAIL || 'delivered@resend.dev';

const describeLive = TEST_API_KEY ? describe : describe.skip;

describeLive('Resend API Type Tests', () => {
	describe('emails', () => {
		it('emailsList returns correct type', async () => {
			const response = await makeResendRequest<ListEmailsResponse>(
				'emails',
				TEST_API_KEY!,
				{ query: { limit: 10 } },
			);
			const result = response;

			ResendEndpointOutputSchemas.emailsList.parse(result);
		});

		it('emailsSend returns correct type', async () => {
			const response = await makeResendRequest<SendEmailResponse>(
				'emails',
				TEST_API_KEY!,
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
				TEST_API_KEY!,
				{ query: { limit: 1 } },
			);
			const emailId = emailsListResponse.data[0]?.id;
			if (!emailId) {
				return;
			}

			const response = await makeResendRequest<GetEmailResponse>(
				`emails/${emailId}`,
				TEST_API_KEY!,
			);
			const result = response;

			ResendEndpointOutputSchemas.emailsGet.parse(result);
		});

		it('emailsBatch returns correct type', async () => {
			const response = await makeResendRequest<EmailsBatchResponse>(
				'emails/batch',
				TEST_API_KEY!,
				{
					method: 'POST',
					body: [
						{
							from: TEST_FROM_EMAIL,
							to: [TEST_TO_EMAIL],
							subject: `Batch test ${Date.now()}-1`,
							html: '<p>batch 1</p>',
						},
						{
							from: TEST_FROM_EMAIL,
							to: [TEST_TO_EMAIL],
							subject: `Batch test ${Date.now()}-2`,
							html: '<p>batch 2</p>',
						},
					],
				},
			);
			const result = response;

			ResendEndpointOutputSchemas.emailsBatch.parse(result);
			expect(Array.isArray(result.data)).toBe(true);
		});

		it('emailsCancel returns correct type', async () => {
			const scheduledBody: Record<string, unknown> = {
				from: TEST_FROM_EMAIL,
				to: [TEST_TO_EMAIL],
				subject: 'Test scheduled email',
				html: '<p>Test</p>',
				text: 'Test',
				scheduled_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
			};
			const created = await makeResendRequest<SendEmailResponse>(
				'emails',
				TEST_API_KEY!,
				{ method: 'POST', body: scheduledBody },
			);
			const emailId = created.id;
			if (!emailId) {
				return;
			}

			await new Promise((resolve) => setTimeout(resolve, 500));

			const response = await makeResendRequest<EmailsCancelResponse>(
				`emails/${emailId}/cancel`,
				TEST_API_KEY!,
				{ method: 'POST' },
			);
			const result = response;

			ResendEndpointOutputSchemas.emailsCancel.parse(result);
			expect(typeof result.id).toBe('string');
			expect(result.id).toBe(emailId);
		});
	});

	describe('domains', () => {
		it('domainsList returns correct type', async () => {
			const response = await makeResendRequest<ListDomainsResponse>(
				'domains',
				TEST_API_KEY!,
				{ query: { limit: 10 } },
			);
			const result = response;

			ResendEndpointOutputSchemas.domainsList.parse(result);
		});

		it('domainsGet returns correct type', async () => {
			const domainsListResponse = await makeResendRequest<ListDomainsResponse>(
				'domains',
				TEST_API_KEY!,
				{
					query: { limit: 1 },
				},
			);
			const domainId = domainsListResponse.data[0]?.id;
			if (!domainId) {
				return;
			}

			const response = await makeResendRequest<GetDomainResponse>(
				`domains/${domainId}`,
				TEST_API_KEY!,
			);
			const result = response;

			ResendEndpointOutputSchemas.domainsGet.parse(result);
		});

		it('domainsCreate returns correct type', async () => {
			const domainName = `test-${Date.now()}.corsair.dev`;
			const response = await makeResendRequest<CreateDomainResponse>(
				'domains',
				TEST_API_KEY!,
				{
					method: 'POST',
					body: {
						name: domainName,
					},
				},
			);
			const result = response;

			ResendEndpointOutputSchemas.domainsCreate.parse(result);

			if (result.id) {
				await makeResendRequest(`domains/${result.id}`, TEST_API_KEY!, {
					method: 'DELETE',
				});
			}
		});

		it('domainsVerify returns correct type', async () => {
			const domainsListResponse = await makeResendRequest<ListDomainsResponse>(
				'domains',
				TEST_API_KEY!,
				{
					query: { limit: 1 },
				},
			);
			const domainId = domainsListResponse.data[0]?.id;
			if (!domainId) {
				return;
			}

			const response = await makeResendRequest<VerifyDomainResponse>(
				`domains/${domainId}/verify`,
				TEST_API_KEY!,
				{
					method: 'POST',
				},
			);
			const result = response;

			ResendEndpointOutputSchemas.domainsVerify.parse(result);
		});

		it('domainsDelete returns correct type', async () => {
			const domainName = `test-delete-${Date.now()}.corsair.dev`;
			const created = await makeResendRequest<CreateDomainResponse>(
				'domains',
				TEST_API_KEY!,
				{
					method: 'POST',
					body: { name: domainName },
				},
			);
			const domainId = created?.id;
			if (!domainId) {
				return;
			}

			const response = await makeResendRequest<DeleteDomainResponse>(
				`domains/${domainId}`,
				TEST_API_KEY!,
				{
					method: 'DELETE',
				},
			);
			const result = response;

			ResendEndpointOutputSchemas.domainsDelete.parse(result);
		});
	});

	describe('contacts', () => {
		const testContactEmail = `corsair-test+${Date.now()}@example.com`;
		let createdContactId: string;

		it('contactsCreate returns correct type', async () => {
			const response = await makeResendRequest<ContactsCreateResponse>(
				'contacts',
				TEST_API_KEY!,
				{
					method: 'POST',
					body: {
						email: testContactEmail,
						first_name: 'Corsair',
						last_name: 'Test',
						unsubscribed: false,
					},
				},
			);
			const result = response;

			ResendEndpointOutputSchemas.contactsCreate.parse(result);
			expect(typeof result.id).toBe('string');
			expect(result.id.length).toBeGreaterThan(0);
			createdContactId = result.id;
		});

		it('contactsList returns correct type', async () => {
			const response = await makeResendRequest<ContactsListResponse>(
				'contacts',
				TEST_API_KEY!,
				{ query: { limit: 10 } },
			);
			const result = response;

			ResendEndpointOutputSchemas.contactsList.parse(result);
			expect(Array.isArray(result.data)).toBe(true);
		});

		it('contactsGet returns correct type', async () => {
			expect(createdContactId).toBeDefined();

			const response = await makeResendRequest<ContactsGetResponse>(
				`contacts/${createdContactId}`,
				TEST_API_KEY!,
			);
			const result = response;

			ResendEndpointOutputSchemas.contactsGet.parse(result);
			expect(result.id).toBe(createdContactId);
			expect(result.email).toBe(testContactEmail);
		});

		it('contactsUpdate returns correct type and persists first_name', async () => {
			expect(createdContactId).toBeDefined();

			const response = await makeResendRequest<ContactsUpdateResponse>(
				`contacts/${createdContactId}`,
				TEST_API_KEY!,
				{
					method: 'PATCH',
					body: {
						first_name: 'CorsairUpdated',
					},
				},
			);
			const result = response;

			ResendEndpointOutputSchemas.contactsUpdate.parse(result);

			const getResponse = await makeResendRequest<ContactsGetResponse>(
				`contacts/${createdContactId}`,
				TEST_API_KEY!,
			);
			const fetched = getResponse;
			expect(fetched.id).toBe(createdContactId);
			expect(fetched.first_name).toBe('CorsairUpdated');
		});

		it('contactsDelete returns correct type', async () => {
			expect(createdContactId).toBeDefined();

			const response = await makeResendRequest<ContactsDeleteResponse>(
				`contacts/${createdContactId}`,
				TEST_API_KEY!,
				{ method: 'DELETE' },
			);
			const result = response;

			ResendEndpointOutputSchemas.contactsDelete.parse(result);
			expect(result.deleted).toBe(true);
		});
	});
});
