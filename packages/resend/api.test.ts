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

		it('emailsBatch returns correct type', async () => {
			const response = await makeResendRequest<EmailsBatchResponse>(
				'emails/batch',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						emails: [
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
				},
			);
			const result = response;

			ResendEndpointOutputSchemas.emailsBatch.parse(result);
			expect(Array.isArray(result.data)).toBe(true);
		});

		it('emailsCancel returns correct type', async () => {
			// Create a scheduled email then cancel it — the batch/cancel
			// endpoint only accepts scheduled emails, and the per-email
			// cancel endpoint uses POST /emails/{id}/cancel.
			const scheduledBody: Record<string, unknown> = {
				from: 'test@example.com',
				to: ['recipient@example.com'],
				subject: 'Test scheduled email',
				html: '<p>Test</p>',
				text: 'Test',
				scheduled_at: new Date(Date.now() + 60_000).toISOString(),
			};
			const created = await makeResendRequest<SendEmailResponse>(
				'emails',
				TEST_API_KEY,
				{ method: 'POST', body: scheduledBody },
			);
			const emailId = created.id;
			if (!emailId) {
				return;
			}

			const response = await makeResendRequest<EmailsCancelResponse>(
				`emails/${emailId}/cancel`,
				TEST_API_KEY,
				{ method: 'POST' },
			);
			const result = response;

			ResendEndpointOutputSchemas.emailsCancel.parse(result);
			expect(result.cancelled).toBe(true);
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
			const domainsListResponse = await makeResendRequest<ListDomainsResponse>(
				'domains',
				TEST_API_KEY,
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
			const domainsListResponse = await makeResendRequest<ListDomainsResponse>(
				'domains',
				TEST_API_KEY,
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
				TEST_API_KEY,
				{
					method: 'POST',
				},
			);
			const result = response;

			ResendEndpointOutputSchemas.domainsVerify.parse(result);
		});

		it('domainsDelete returns correct type', async () => {
			const domainsListResponse = await makeResendRequest<ListDomainsResponse>(
				'domains',
				TEST_API_KEY,
				{
					query: { limit: 10 },
				},
			);
			const testDomain = domainsListResponse.data.find((domain) =>
				domain.name.startsWith('test-domain-'),
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

	describe('contacts', () => {
		// Use a unique email per run so re-runs don't collide on the
		// Resend-side "contact already exists" path.
		const testContactEmail = `corsair-test+${Date.now()}@example.com`;

		it('contactsCreate returns correct type', async () => {
			const response = await makeResendRequest<ContactsCreateResponse>(
				'contacts',
				TEST_API_KEY,
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
			// Resend returns only { object, id }; store the ID for cleanup.
			expect(result.id).toMatch(/^contact_/);
		});

		it('contactsList returns correct type', async () => {
			const response = await makeResendRequest<ContactsListResponse>(
				'contacts',
				TEST_API_KEY,
				{ query: { limit: 10 } },
			);
			const result = response;

			ResendEndpointOutputSchemas.contactsList.parse(result);
			expect(Array.isArray(result.data)).toBe(true);
		});

		it('contactsGet returns correct type', async () => {
			// Find the contact we just created via list, by email match.
			const list = await makeResendRequest<ContactsListResponse>(
				'contacts',
				TEST_API_KEY,
				{ query: { limit: 100 } },
			);
			const found = list.data.find((c) => c.email === testContactEmail);
			if (!found) {
				return;
			}

			const response = await makeResendRequest<ContactsGetResponse>(
				`contacts/${found.id}`,
				TEST_API_KEY,
			);
			const result = response;

			ResendEndpointOutputSchemas.contactsGet.parse(result);
			expect(result.id).toBe(found.id);
		});

		it('contactsUpdate returns correct type and persists first_name', async () => {
			const list = await makeResendRequest<ContactsListResponse>(
				'contacts',
				TEST_API_KEY,
				{ query: { limit: 100 } },
			);
			const found = list.data.find((c) => c.email === testContactEmail);
			if (!found) {
				return;
			}

			const response = await makeResendRequest<ContactsUpdateResponse>(
				`contacts/${found.id}`,
				TEST_API_KEY,
				{
					method: 'PATCH',
					body: {
						first_name: 'CorsairUpdated',
					},
				},
			);
			const result = response;

			ResendEndpointOutputSchemas.contactsUpdate.parse(result);
			// PATCH returns only { object, id }; verify the id round-trips
			// and then fetch the full contact to verify first_name.
			expect(result.id).toBe(found.id);

			// Fetch the contact from the API to verify persistence.
			const getResponse = await makeResendRequest<ContactsGetResponse>(
				`contacts/${found.id}`,
				TEST_API_KEY,
			);
			const fetched = getResponse;
			expect(fetched.id).toBe(found.id);
			expect(fetched.first_name).toBe('CorsairUpdated');
		});

		it('contactsDelete returns correct type', async () => {
			const list = await makeResendRequest<ContactsListResponse>(
				'contacts',
				TEST_API_KEY,
				{ query: { limit: 100 } },
			);
			const found = list.data.find((c) => c.email === testContactEmail);
			if (!found) {
				return;
			}

			const response = await makeResendRequest<ContactsDeleteResponse>(
				`contacts/${found.id}`,
				TEST_API_KEY,
				{ method: 'DELETE' },
			);
			const result = response;

			ResendEndpointOutputSchemas.contactsDelete.parse(result);
			expect(result.deleted).toBe(true);
		});
	});
});
